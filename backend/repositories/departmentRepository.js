const pool = require('../config/db');

class DepartmentRepository {
  getContext(conn) {
    return conn || pool;
  }

  async getDepartmentsList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter } = {}) {
    let query = `
      SELECT 
        d.*,
        (
          SELECT COUNT(*) 
          FROM managers m 
          JOIN users u ON m.user_id = u.id 
          WHERE (m.department_id = d.id OR m.sub_department_id IN (SELECT id FROM sub_departments WHERE department_id = d.id))
            AND u.deleted_at IS NULL
        ) AS manager_count,
        (
          SELECT COUNT(*) 
          FROM employees e 
          JOIN users u ON e.user_id = u.id 
          WHERE (e.department_id = d.id OR e.sub_department_id IN (SELECT id FROM sub_departments WHERE department_id = d.id))
            AND u.deleted_at IS NULL
        ) AS employee_count,
        (
          SELECT COUNT(*) 
          FROM sub_departments sd 
          WHERE sd.department_id = d.id
        ) AS sub_department_count,
        (
          SELECT COUNT(DISTINCT c.id) 
          FROM clients c 
          WHERE c.deleted_at IS NULL 
            AND (
              EXISTS (SELECT 1 FROM projects p WHERE p.client_id = c.id AND p.department_id = d.id AND p.deleted_at IS NULL)
              OR EXISTS (SELECT 1 FROM monthly_deliverables md WHERE md.client_id = c.id AND md.department_id = d.id AND md.deleted_at IS NULL)
            )
        ) AS client_count
      FROM departments d 
      WHERE d.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (d.name LIKE ? OR d.code LIKE ? OR d.description LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }

    if (statusFilter) {
      query += ` AND d.status = ?`;
      params.push(statusFilter);
    }

    const allowedSort = ['name', 'code', 'status', 'employee_count', 'manager_count'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'd.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    if (limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset || 0));
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getDepartmentsCount({ searchQuery, statusFilter }) {
    let query = "SELECT COUNT(*) as count FROM departments WHERE deleted_at IS NULL";
    const params = [];

    if (searchQuery) {
      query += ` AND (name LIKE ? OR code LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }

    if (statusFilter) {
      query += ` AND status = ?`;
      params.push(statusFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async getDepartmentsDropdown() {
    const [rows] = await pool.query("SELECT id, name, code FROM departments WHERE deleted_at IS NULL AND status = 'active'");
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  }

  async findByCode(code) {
    const [rows] = await pool.query('SELECT * FROM departments WHERE code = ? AND deleted_at IS NULL', [code]);
    return rows[0];
  }

  async create(deptData, conn) {
    const db = this.getContext(conn);
    const { name, code, description, status, created_by } = deptData;
    const [result] = await db.query(
      'INSERT INTO departments (name, code, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, code.toUpperCase(), description, status, created_by]
    );
    return result.insertId;
  }

  async update(id, deptData, conn) {
    const db = this.getContext(conn);
    const { name, code, description, status, updated_by } = deptData;
    await db.query(
      'UPDATE departments SET name = ?, code = ?, description = ?, status = ?, updated_by = ? WHERE id = ? AND deleted_at IS NULL',
      [name, code.toUpperCase(), description, status, updated_by, id]
    );
  }

  async softDelete(id, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE departments SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  async changeStatus(id, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE departments SET status = ? WHERE id = ? AND deleted_at IS NULL', [status, id]);
  }

  // Bulk Operations
  async bulkDelete(ids, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE departments SET deleted_at = CURRENT_TIMESTAMP WHERE id IN (?)', [ids]);
  }

  async bulkUpdateStatus(ids, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE departments SET status = ? WHERE id IN (?) AND deleted_at IS NULL', [status, ids]);
  }

  async getSubDepartmentsByDeptId(departmentId) {
    const [rows] = await pool.query(
      'SELECT id, name, code FROM sub_departments WHERE department_id = ? ORDER BY name ASC',
      [departmentId]
    );
    return rows;
  }
}

module.exports = new DepartmentRepository();
