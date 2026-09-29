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

    // 1. Get active manager details for department header
    const [managers] = await pool.query(
      'SELECT id, full_name, manager_id_code FROM managers WHERE department_id = ? AND sub_department_id IS NULL AND status = "active" LIMIT 1',
      [departmentId]
    );
    const manager = managers[0] || null;

    // 1b. Get all managers in this department (including sub-departments)
    const [allManagers] = await pool.query(
      `SELECT m.id, m.manager_id_code, m.full_name, m.phone, m.sub_department_id, u.email, m.status, m.joining_date
       FROM managers m
       JOIN users u ON m.user_id = u.id
       WHERE m.department_id = ? AND u.deleted_at IS NULL`,
      [departmentId]
    );

    // 2. Get sub-departments
    const subDepartments = await departmentRepository.getSubDepartmentsByDeptId(departmentId);

    // 3. Get employees in this department
    const [employees] = await pool.query(
      `SELECT e.id, e.employee_id_code, e.full_name, e.phone, e.sub_department_id, u.email, e.status, e.joining_date
       FROM employees e
       JOIN users u ON e.user_id = u.id
       WHERE e.department_id = ? AND u.deleted_at IS NULL`,
      [departmentId]
    );

    return {
      department: dept,
      manager,
      allManagers,
      subDepartments,
      employees
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
