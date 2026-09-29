const pool = require('../config/db');

class BlogAssignmentRepository {
  // Get all active clients with their assigned blog manager details
  async getAllClientsWithBlogAssignments({ searchQuery, managerFilter, statusFilter }) {
    let query = `
      SELECT 
        c.id, 
        c.client_id_code, 
        c.company_name, 
        c.client_name, 
        c.email, 
        c.phone, 
        c.website,
        c.status as client_status,
        c.start_date,
        bca.id as assignment_id,
        bca.manager_id,
        bca.assigned_at,
        m.full_name as manager_name,
        m.manager_id_code,
        d.name as department_name,
        d.code as department_code
      FROM clients c
      LEFT JOIN blog_client_assignments bca ON c.id = bca.client_id
      LEFT JOIN managers m ON bca.manager_id = m.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE c.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (c.company_name LIKE ? OR c.client_name LIKE ? OR c.client_id_code LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }

    if (statusFilter) {
      query += ` AND c.status = ?`;
      params.push(statusFilter);
    }

    if (managerFilter) {
      if (managerFilter === 'unassigned') {
        query += ` AND bca.manager_id IS NULL`;
      } else {
        query += ` AND bca.manager_id = ?`;
        params.push(Number(managerFilter));
      }
    }

    query += ` ORDER BY c.company_name ASC`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Get list of all managers (especially SEO department managers)
  async getManagersForBlogAssignment() {
    const query = `
      SELECT 
        m.id, 
        m.manager_id_code, 
        m.full_name, 
        m.department_id, 
        m.status,
        d.name as department_name, 
        d.code as department_code
      FROM managers m
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.status = 'active'
      ORDER BY (d.code = 'SEO-RS' OR d.name LIKE '%SEO%') DESC, m.full_name ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Assign multiple clients to a manager
  async assignClientsToManager(clientIds, managerId, assignedBy) {
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      return { success: false, message: 'No clients selected.' };
    }

    const numericClientIds = clientIds.map(Number);
    const targetMgrId = Number(managerId);

    // 1. Fetch manager name
    const [mgrRows] = await pool.query('SELECT full_name FROM managers WHERE id = ?', [targetMgrId]);
    const managerName = mgrRows[0] ? mgrRows[0].full_name : 'SEO Manager';

    // 2. Fetch existing assignments for selected clients
    const [existingRows] = await pool.query(
      `SELECT bca.client_id, bca.manager_id, c.company_name
       FROM blog_client_assignments bca
       JOIN clients c ON bca.client_id = c.id
       WHERE bca.client_id IN (?)`,
      [numericClientIds]
    );

    const alreadyAssignedClients = [];
    const clientsToAssign = [];

    for (const clientId of numericClientIds) {
      const existing = existingRows.find(r => Number(r.client_id) === clientId);
      if (existing && Number(existing.manager_id) === targetMgrId) {
        alreadyAssignedClients.push(existing.company_name);
      } else {
        clientsToAssign.push(clientId);
      }
    }

    // 3. If ALL selected clients are already assigned to this manager
    if (clientsToAssign.length === 0) {
      const clientListStr = alreadyAssignedClients.join(', ');
      return {
        alreadyAssignedAll: true,
        alreadyAssignedClients,
        managerName,
        message: `Client(s) "${clientListStr}" are already assigned to ${managerName}.`
      };
    }

    // 4. Assign clients
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const clientId of clientsToAssign) {
        await connection.query(
          `INSERT INTO blog_client_assignments (client_id, manager_id, assigned_by)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             manager_id = VALUES(manager_id),
             assigned_by = VALUES(assigned_by),
             updated_at = CURRENT_TIMESTAMP`,
          [clientId, targetMgrId, assignedBy ? Number(assignedBy) : null]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    let message = `Successfully assigned ${clientsToAssign.length} client(s) to ${managerName}.`;
    if (alreadyAssignedClients.length > 0) {
      message += ` (Note: ${alreadyAssignedClients.join(', ')} were already assigned).`;
    }

    return {
      success: true,
      assignedCount: clientsToAssign.length,
      alreadyAssignedClients,
      managerName,
      message
    };
  }

  // Unassign multiple clients
  async unassignClients(clientIds) {
    if (!Array.isArray(clientIds) || clientIds.length === 0) return;
    await pool.query(
      `DELETE FROM blog_client_assignments WHERE client_id IN (?)`,
      [clientIds.map(Number)]
    );
  }

  // Get clients assigned to a specific manager for blogs
  async getClientsAssignedToManager(managerId) {
    const query = `
      SELECT 
        c.id, 
        c.client_id_code, 
        c.company_name, 
        c.client_name, 
        c.email, 
        c.phone, 
        c.website,
        c.address,
        c.industry,
        c.status as client_status,
        c.start_date,
        bca.assigned_at
      FROM blog_client_assignments bca
      JOIN clients c ON bca.client_id = c.id
      WHERE bca.manager_id = ? AND c.deleted_at IS NULL
      ORDER BY c.company_name ASC
    `;
    const [rows] = await pool.query(query, [Number(managerId)]);
    return rows;
  }

  async getManagerByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM managers WHERE user_id = ? AND status = "active"', [Number(userId)]);
    return rows[0];
  }

  async createBlogJobWork({ client_id, topic, manager_id, admin_user_id }) {
    const uniqueActivityCode = `BJW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [result] = await pool.query(
      `INSERT INTO job_works (client_id, topic, assigned_manager_id, work_type, activity_type_code, activity_code, status, assigned_at)
       VALUES (?, ?, ?, 'blog_job_work', 'AT007', ?, 'pending', CURRENT_TIMESTAMP)`,
      [Number(client_id), topic, Number(manager_id), uniqueActivityCode]
    );
    return result.insertId;
  }

  async getBlogJobWorksForManager(managerId) {
    const query = `
      SELECT 
        jw.id, 
        jw.client_id, 
        jw.topic, 
        jw.status, 
        jw.created_at, 
        jw.assigned_employee_id,
        c.company_name, 
        c.client_name, 
        c.client_id_code,
        e.full_name as employee_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN employees e ON jw.assigned_employee_id = e.id
      WHERE jw.assigned_manager_id = ? AND jw.work_type = 'blog_job_work'
      ORDER BY jw.id DESC
    `;
    const [rows] = await pool.query(query, [Number(managerId)]);
    return rows;
  }

  async getBlogJobWorksForAdmin() {
    const query = `
      SELECT 
        jw.id, 
        jw.client_id, 
        jw.topic, 
        jw.status, 
        jw.created_at, 
        jw.assigned_manager_id,
        jw.assigned_employee_id,
        c.company_name, 
        c.client_name, 
        c.client_id_code,
        m.full_name as manager_name,
        e.full_name as employee_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN managers m ON jw.assigned_manager_id = m.id
      LEFT JOIN employees e ON jw.assigned_employee_id = e.id
      WHERE jw.work_type = 'blog_job_work'
      ORDER BY jw.id DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  async assignJobWorkToEmployee(jobWorkId, employeeId) {
    await pool.query(
      `UPDATE job_works SET assigned_employee_id = ?, status = 'assigned', assigned_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [Number(employeeId), Number(jobWorkId)]
    );
  }
}

module.exports = new BlogAssignmentRepository();
