const pool = require('../config/db');

class DepartmentRepository {
  getContext(conn) {
    return conn || pool;
  }

  async getDepartmentsList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter }) {
    let query = "SELECT * FROM departments WHERE deleted_at IS NULL";
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

    const allowedSort = ['name', 'code', 'status'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

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
