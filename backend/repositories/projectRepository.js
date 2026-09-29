const pool = require('../config/db');

class ProjectRepository {
  getContext(conn) {
    return conn || pool;
  }

  async getProjectsList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter, priorityFilter, clientFilter, departmentFilter, managerFilter }) {
    let query = `
      SELECT p.*, c.company_name AS client_name, d.name AS department_name, m.full_name AS manager_name 
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      JOIN departments d ON p.department_id = d.id
      JOIN managers m ON p.manager_id = m.id
      WHERE p.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (p.project_name LIKE ? OR p.description LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }
    if (statusFilter) {
      query += ` AND p.status = ?`;
      params.push(statusFilter);
    }
    if (priorityFilter) {
      query += ` AND p.priority = ?`;
      params.push(priorityFilter);
    }
    if (clientFilter) {
      query += ` AND p.client_id = ?`;
      params.push(clientFilter);
    }
    if (departmentFilter) {
      query += ` AND p.department_id = ?`;
      params.push(departmentFilter);
    }
    if (managerFilter) {
      query += ` AND p.manager_id = ?`;
      params.push(managerFilter);
    }

    const allowedSort = ['project_name', 'client_name', 'department_name', 'manager_name', 'priority', 'start_date', 'end_date', 'status'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'p.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getProjectsCount({ searchQuery, statusFilter, priorityFilter, clientFilter, departmentFilter, managerFilter }) {
    let query = `
      SELECT COUNT(*) as count 
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      JOIN departments d ON p.department_id = d.id
      JOIN managers m ON p.manager_id = m.id
      WHERE p.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (p.project_name LIKE ? OR p.description LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }
    if (statusFilter) {
      query += ` AND p.status = ?`;
      params.push(statusFilter);
    }
    if (priorityFilter) {
      query += ` AND p.priority = ?`;
      params.push(priorityFilter);
    }
    if (clientFilter) {
      query += ` AND p.client_id = ?`;
      params.push(clientFilter);
    }
    if (departmentFilter) {
      query += ` AND p.department_id = ?`;
      params.push(departmentFilter);
    }
    if (managerFilter) {
      query += ` AND p.manager_id = ?`;
      params.push(managerFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async getProjectsDropdown() {
    const [rows] = await pool.query("SELECT id, project_name FROM projects WHERE deleted_at IS NULL AND status = 'active'");
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.company_name AS client_name, d.name AS department_name, m.full_name AS manager_name 
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      JOIN departments d ON p.department_id = d.id
      JOIN managers m ON p.manager_id = m.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `, [id]);
    return rows[0];
  }

  async create(projectData, conn) {
    const db = this.getContext(conn);
    const { project_name, client_id, department_id, manager_id, description, priority, start_date, end_date, status, created_by } = projectData;
    const [result] = await db.query(
      `INSERT INTO projects (project_name, client_id, department_id, manager_id, description, priority, start_date, end_date, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_name, client_id, department_id, manager_id, description, priority, start_date, end_date, status, created_by]
    );
    return result.insertId;
  }

  async update(id, projectData, conn) {
    const db = this.getContext(conn);
    const { project_name, client_id, department_id, manager_id, description, priority, start_date, end_date, status, updated_by } = projectData;
    await db.query(
      `UPDATE projects 
       SET project_name = ?, client_id = ?, department_id = ?, manager_id = ?, description = ?, priority = ?, start_date = ?, end_date = ?, status = ?, updated_by = ? 
       WHERE id = ? AND deleted_at IS NULL`,
      [project_name, client_id, department_id, manager_id, description, priority, start_date, end_date, status, updated_by, id]
    );
  }

  async softDelete(id, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  async changeStatus(id, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE projects SET status = ? WHERE id = ? AND deleted_at IS NULL', [status, id]);
  }

  // Bulk Operations
  async bulkDelete(ids, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id IN (?)', [ids]);
  }

  async bulkUpdateStatus(ids, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE projects SET status = ? WHERE id IN (?) AND deleted_at IS NULL', [status, ids]);
  }
}

module.exports = new ProjectRepository();
