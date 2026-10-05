const departmentRepository = require('../repositories/departmentRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const pool = require('../config/db');

class DepartmentService {
  async getDepartments(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const queryParams = {
      limit,
      offset,
      sortColumn: filters.sortColumn || 'id',
      sortOrder: filters.sortOrder || 'asc',
      searchQuery: filters.searchQuery || '',
      statusFilter: filters.statusFilter || ''
    };

    const departments = await departmentRepository.getDepartmentsList(queryParams);
    const total = await departmentRepository.getDepartmentsCount(queryParams);

    return {
      departments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getDepartmentById(id) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      const error = new Error('Department not found.');
      error.statusCode = 404;
      throw error;
    }
    return department;
  }

  async createDepartment(deptData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check unique code
      const existingDept = await departmentRepository.findByCode(deptData.code);
      if (existingDept) {
        const error = new Error(`Department code "${deptData.code}" is already in use.`);
        error.statusCode = 400;
        throw error;
      }

      const insertData = {
        ...deptData,
        created_by: adminUserId
      };

      const deptId = await departmentRepository.create(insertData, connection);
      
      await dashboardRepository.createActivityLog(adminUserId, 'Create Department', `Department "${deptData.name}" (${deptData.code.toUpperCase()}) was created.`, connection);

      await connection.commit();
      return deptId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateDepartment(id, deptData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const dept = await departmentRepository.findById(id);
      if (!dept) {
        const error = new Error('Department not found.');
        error.statusCode = 404;
        throw error;
      }

      // Check unique code if code has changed
      if (deptData.code.toUpperCase() !== dept.code) {
        const existingDept = await departmentRepository.findByCode(deptData.code);
        if (existingDept) {
          const error = new Error(`Department code "${deptData.code}" is already in use.`);
          error.statusCode = 400;
          throw error;
        }
      }

      const updateData = {
        ...deptData,
        updated_by: adminUserId
      };

      await departmentRepository.update(id, updateData, connection);
      
      await dashboardRepository.createActivityLog(adminUserId, 'Update Department', `Department "${deptData.name}" (${dept.code}) was updated.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteDepartment(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const dept = await departmentRepository.findById(id);
      if (!dept) {
        const error = new Error('Department not found.');
        error.statusCode = 404;
        throw error;
      }

      await departmentRepository.softDelete(id, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Department', `Department "${dept.name}" (${dept.code}) was soft-deleted.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async toggleDepartmentStatus(id, status, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const dept = await departmentRepository.findById(id);
      if (!dept) {
        const error = new Error('Department not found.');
        error.statusCode = 404;
        throw error;
      }

      await departmentRepository.changeStatus(id, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Toggle Department Status', `Department "${dept.name}" status was set to ${status}.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Bulk Actions
  async bulkDeleteDepartments(ids, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No department IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await departmentRepository.bulkDelete(ids, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Delete Departments', `Bulk deleted ${ids.length} departments.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async bulkUpdateDepartmentsStatus(ids, status, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No department IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await departmentRepository.bulkUpdateStatus(ids, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Update Department Status', `Bulk updated status of ${ids.length} departments to "${status}".`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getSubDepartmentsByDeptId(departmentId) {
    return await departmentRepository.getSubDepartmentsByDeptId(departmentId);
  }

  async getDepartmentDetails(departmentId) {
    const dept = await departmentRepository.findById(departmentId);
    if (!dept) {
      const error = new Error('Department not found.');
      error.statusCode = 404;
      throw error;
    }

    // 1. Get all managers in this department (including sub-departments)
    const [allManagers] = await pool.query(
      `SELECT m.id, m.manager_id_code, m.full_name, m.phone, m.branch, m.sub_department_id, 
              sd.name AS sub_department_name, u.username, u.email, m.status, m.joining_date, m.profile_image
       FROM managers m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN sub_departments sd ON m.sub_department_id = sd.id
       WHERE (m.department_id = ? OR m.sub_department_id IN (SELECT id FROM sub_departments WHERE department_id = ?))
         AND u.deleted_at IS NULL
       ORDER BY m.id DESC`,
      [departmentId, departmentId]
    );

    // 2. Get sub-departments with counts
    const [subDepartments] = await pool.query(
      `SELECT 
         sd.*,
         (SELECT COUNT(*) FROM employees e JOIN users u ON e.user_id = u.id WHERE e.sub_department_id = sd.id AND u.deleted_at IS NULL) AS employee_count,
         (SELECT COUNT(*) FROM managers m JOIN users u ON m.user_id = u.id WHERE m.sub_department_id = sd.id AND u.deleted_at IS NULL) AS manager_count
       FROM sub_departments sd
       WHERE sd.department_id = ?
       ORDER BY sd.name ASC`,
      [departmentId]
    );

    // 3. Get employees in this department with full details
    const [employees] = await pool.query(
      `SELECT e.id, e.employee_id_code, e.full_name, e.phone, e.sub_department_id, 
              sd.name AS sub_department_name, e.reporting_manager_id, 
              mgr.full_name AS reporting_manager_name, u.username, u.email, 
              e.status, e.joining_date, e.profile_image
       FROM employees e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
       LEFT JOIN managers mgr ON e.reporting_manager_id = mgr.id
       WHERE (e.department_id = ? OR e.sub_department_id IN (SELECT id FROM sub_departments WHERE department_id = ?))
         AND u.deleted_at IS NULL
       ORDER BY e.id DESC`,
      [departmentId, departmentId]
    );

    // 4. Get clients working with this department
    const [clients] = await pool.query(
      `SELECT DISTINCT 
         c.id, c.client_id_code, c.company_name, c.client_name, c.phone, c.email, c.status, c.industry, c.website,
         (SELECT COUNT(*) FROM projects p WHERE p.client_id = c.id AND p.department_id = ? AND p.deleted_at IS NULL) AS project_count,
         (SELECT COUNT(*) FROM monthly_deliverables md WHERE md.client_id = c.id AND md.department_id = ? AND md.deleted_at IS NULL) AS deliverable_count
       FROM clients c
       WHERE c.deleted_at IS NULL
         AND (
           EXISTS (SELECT 1 FROM projects p WHERE p.client_id = c.id AND p.department_id = ? AND p.deleted_at IS NULL)
           OR EXISTS (SELECT 1 FROM monthly_deliverables md WHERE md.client_id = c.id AND md.department_id = ? AND md.deleted_at IS NULL)
           OR EXISTS (SELECT 1 FROM job_works jw JOIN managers m ON jw.assigned_manager_id = m.id WHERE jw.client_id = c.id AND m.department_id = ?)
         )
       ORDER BY c.company_name ASC`,
      [departmentId, departmentId, departmentId, departmentId, departmentId]
    );

    // 5. Manager Efficiency for this department
    const [managerEfficiency] = await pool.query(
      `SELECT 
         m.id,
         m.full_name,
         m.manager_id_code,
         (SELECT COUNT(*) FROM employees e WHERE e.reporting_manager_id = m.id) AS team_size,
         (
           (SELECT COUNT(*) FROM monthly_deliverables md WHERE (md.assigned_manager_id = m.id OR md.department_id = m.department_id) AND md.status != 'pending' AND md.deleted_at IS NULL)
           + (SELECT COUNT(*) FROM job_works jw WHERE jw.assigned_manager_id = m.id)
         ) AS total_tasks,
         (
           (SELECT COUNT(*) FROM monthly_deliverables md WHERE (md.assigned_manager_id = m.id OR md.department_id = m.department_id) AND md.status IN ('client_approved', 'approved', 'posted', 'completed') AND md.deleted_at IS NULL)
           + (SELECT COUNT(*) FROM job_works jw WHERE jw.assigned_manager_id = m.id AND jw.status IN ('approved', 'completed'))
         ) AS completed_tasks
       FROM managers m
       JOIN users u ON m.user_id = u.id
       WHERE m.department_id = ? AND u.deleted_at IS NULL`,
      [departmentId]
    );

    const formattedManagerEfficiency = managerEfficiency.map(mgr => {
      const total = Number(mgr.total_tasks) || 0;
      const completed = Number(mgr.completed_tasks) || 0;
      const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...mgr,
        total_tasks: total,
        completed_tasks: completed,
        efficiency
      };
    });

    // 6. Compute Employee Efficiency for this department's employees
    const employeeEfficiency = [];
    for (const emp of employees) {
      const [delivRows] = await pool.query(
        `SELECT COUNT(*) AS total, 
                SUM(CASE WHEN status IN ('completed', 'posted', 'client_approved', 'approved') THEN 1 ELSE 0 END) AS completed
         FROM monthly_deliverables 
         WHERE (assigned_employee_id = ? OR content_writer_id = ? OR smm_employee_id = ?) 
           AND status != 'pending' AND deleted_at IS NULL`,
        [emp.id, emp.id, emp.id]
      );
      const [jwRows] = await pool.query(
        `SELECT COUNT(*) AS total, 
                SUM(CASE WHEN status IN ('completed', 'approved', 'posted') THEN 1 ELSE 0 END) AS completed
         FROM job_works 
         WHERE (assigned_employee_id = ? OR content_writer_id = ? OR smm_employee_id = ?)`,
        [emp.id, emp.id, emp.id]
      );

      const totalTasks = (Number(delivRows[0]?.total) || 0) + (Number(jwRows[0]?.total) || 0);
      const completedTasks = (Number(delivRows[0]?.completed) || 0) + (Number(jwRows[0]?.completed) || 0);
      const efficiencyRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      employeeEfficiency.push({
        id: emp.id,
        employee_id_code: emp.employee_id_code,
        full_name: emp.full_name,
        sub_department_id: emp.sub_department_id,
        sub_department_name: emp.sub_department_name || 'Direct Department',
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        pending_tasks: Math.max(0, totalTasks - completedTasks),
        efficiency: efficiencyRate
      });
    }

    // 7. Aggregate Dashboard Stats
    const totalEmp = employees.length;
    const activeEmp = employees.filter(e => e.status === 'active').length;
    const totalMgr = allManagers.length;
    const activeMgr = allManagers.filter(m => m.status === 'active').length;
    const totalSub = subDepartments.length;
    const totalCli = clients.length;
    const avgEmpEff = (totalEmp > 0 && employeeEfficiency.length > 0)
      ? Math.round(employeeEfficiency.reduce((acc, curr) => acc + curr.efficiency, 0) / employeeEfficiency.length) 
      : 0;
    const avgMgrEff = (totalMgr > 0 && formattedManagerEfficiency.length > 0)
      ? Math.round(formattedManagerEfficiency.reduce((acc, curr) => acc + curr.efficiency, 0) / formattedManagerEfficiency.length) 
      : 0;

    const stats = {
      totalEmployees: totalEmp,
      activeEmployees: activeEmp,
      totalManagers: totalMgr,
      activeManagers: activeMgr,
      totalSubDepartments: totalSub,
      totalClients: totalCli,
      avgEmployeeEfficiency: avgEmpEff,
      avgManagerEfficiency: avgMgrEff
    };

    return {
      department: dept,
      allManagers,
      subDepartments,
      employees,
      clients,
      managerEfficiency: formattedManagerEfficiency,
      employeeEfficiency,
      stats
    };
  }

  async createSubDepartment(departmentId, data, adminUserId) {
    const { name, code } = data;
    if (!name || !code) {
      const error = new Error('Sub-department name and code prefix are required.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [existing] = await connection.query(
        'SELECT id FROM sub_departments WHERE code = ?',
        [code.toUpperCase().trim()]
      );
      if (existing.length > 0) {
        const error = new Error(`Sub-department code prefix "${code.toUpperCase().trim()}" is already registered.`);
        error.statusCode = 400;
        throw error;
      }

      const [result] = await connection.query(
        'INSERT INTO sub_departments (department_id, name, code, created_by) VALUES (?, ?, ?, ?)',
        [departmentId, name.trim(), code.toUpperCase().trim(), adminUserId]
      );

      await dashboardRepository.createActivityLog(adminUserId, 'Create Sub-department', `Sub-department "${name.trim()}" (${code.toUpperCase().trim()}) was created.`, connection);
      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteSubDepartment(subDeptId, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [rows] = await connection.query(
        'SELECT name FROM sub_departments WHERE id = ?',
        [subDeptId]
      );
      if (rows.length === 0) {
        const error = new Error('Sub-department not found.');
        error.statusCode = 404;
        throw error;
      }
      const subDeptName = rows[0].name;

      const [empRows] = await connection.query(
        'SELECT COUNT(*) AS count FROM employees WHERE sub_department_id = ?',
        [subDeptId]
      );
      if (empRows[0].count > 0) {
        const error = new Error('Cannot delete sub-department because it contains active employees. Please reassign or delete the employees first.');
        error.statusCode = 400;
        throw error;
      }

      await connection.query(
        'DELETE FROM sub_departments WHERE id = ?',
        [subDeptId]
      );

      await dashboardRepository.createActivityLog(adminUserId, 'Delete Sub-department', `Sub-department "${subDeptName}" was deleted.`, connection);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new DepartmentService();
