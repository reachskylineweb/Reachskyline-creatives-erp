const pool = require('../config/db');

class UserRepository {
  // Utility to select database context (pool or transactional connection)
  getContext(conn) {
    return conn || pool;
  }

  // General User Operations
  async findByUsername(username, conn) {
    const db = this.getContext(conn);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? ORDER BY CASE WHEN role = 'super_admin' THEN 1 WHEN role = 'admin' THEN 2 WHEN role = 'manager' THEN 3 WHEN role = 'employee' THEN 4 WHEN role = 'hr' THEN 5 ELSE 6 END ASC LIMIT 1",
      [username]
    );
    return rows[0];
  }

  async findByEmail(email, conn) {
    const db = this.getContext(conn);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? ORDER BY CASE WHEN role = 'super_admin' THEN 1 WHEN role = 'admin' THEN 2 WHEN role = 'manager' THEN 3 WHEN role = 'employee' THEN 4 WHEN role = 'hr' THEN 5 ELSE 6 END ASC LIMIT 1",
      [email]
    );
    return rows[0];
  }

  async findByUsernameIncludingDeleted(username, conn) {
    const db = this.getContext(conn);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? ORDER BY CASE WHEN role = 'super_admin' THEN 1 WHEN role = 'admin' THEN 2 WHEN role = 'manager' THEN 3 WHEN role = 'employee' THEN 4 WHEN role = 'hr' THEN 5 ELSE 6 END ASC LIMIT 1",
      [username]
    );
    return rows[0];
  }

  async findByEmailIncludingDeleted(email, conn) {
    const db = this.getContext(conn);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? ORDER BY CASE WHEN role = 'super_admin' THEN 1 WHEN role = 'admin' THEN 2 WHEN role = 'manager' THEN 3 WHEN role = 'employee' THEN 4 WHEN role = 'hr' THEN 5 ELSE 6 END ASC LIMIT 1",
      [email]
    );
    return rows[0];
  }

  async findUserById(id, conn) {
    const db = this.getContext(conn);
    const [rows] = await db.query('SELECT id, username, email, role, status FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async createUser(userData, conn) {
    const db = this.getContext(conn);
    const { username, password, plain_password, email, role, status, created_by } = userData;
    const [result] = await db.query(
      'INSERT INTO users (username, password, plain_password, email, role, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, plain_password || null, email, role, status, created_by]
    );
    return result.insertId;
  }

  // ⚡ UPDATES USERNAME AND PASSWORD IN USERS TABLE
  async updateUser(id, userData, conn) {
    const db = this.getContext(conn);
    const { email, status, updated_by, username, password, plain_password } = userData;
    let query = 'UPDATE users SET email = ?, status = ?, updated_by = ?';
    const params = [email, status, updated_by || null];

    if (username) {
      query += ', username = ?';
      params.push(username);
    }
    if (password) {
      query += ', password = ?, plain_password = ?';
      params.push(password, plain_password || null);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);
  }

  // ⚡ HARD-DELETE USER & ALL PROFILES AUTOMATICALLY
  async softDeleteUser(id, conn) {
    const db = this.getContext(conn);
    
    // 1. Delete associated profile rows
    try { await db.query('DELETE FROM managers WHERE user_id = ?', [id]); } catch (_) {}
    try { await db.query('DELETE FROM employees WHERE user_id = ?', [id]); } catch (_) {}
    try { await db.query('DELETE FROM hr WHERE user_id = ?', [id]); } catch (_) {}
    try { await db.query('DELETE FROM clients WHERE user_id = ?', [id]); } catch (_) {}

    // 2. Delete user account permanently from users table
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }

  async freeUpSoftDeletedUser(id, username, email, conn) {
    const db = this.getContext(conn);
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }

  async changeUserStatus(id, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
  }

  async updateUserPassword(id, hashedPassword, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }

  // Manager Operations
  async getManagersList({ limit, offset, sortColumn, sortOrder, searchQuery, departmentFilter, statusFilter }) {
    let query = `
      SELECT m.*, u.username, u.email, d.name AS department_name, d.code AS department_code, sd.name AS sub_department_name, sd.code AS sub_department_code 
      FROM managers m 
      JOIN users u ON m.user_id = u.id 
      JOIN departments d ON m.department_id = d.id
      LEFT JOIN sub_departments sd ON m.sub_department_id = sd.id
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (m.full_name LIKE ? OR m.manager_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (departmentFilter) {
      query += ` AND m.department_id = ?`;
      params.push(departmentFilter);
    }
    if (statusFilter) {
      query += ` AND m.status = ?`;
      params.push(statusFilter);
    }

    // Sorting
    const allowedSort = ['full_name', 'manager_id_code', 'joining_date', 'status', 'department_name'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'm.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getManagersCount({ searchQuery, departmentFilter, statusFilter }) {
    let query = `
      SELECT COUNT(*) as count 
      FROM managers m
      JOIN users u ON m.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (m.full_name LIKE ? OR m.manager_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (departmentFilter) {
      query += ` AND m.department_id = ?`;
      params.push(departmentFilter);
    }
    if (statusFilter) {
      query += ` AND m.status = ?`;
      params.push(statusFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async getManagersDropdown() {
    const [rows] = await pool.query(`
      SELECT m.id, m.full_name, m.manager_id_code, d.name AS department_name 
      FROM managers m 
      JOIN departments d ON m.department_id = d.id
      JOIN users u ON m.user_id = u.id
      WHERE m.status = 'active' AND u.status = 'active'
    `);
    return rows;
  }

  async findManagerById(id) {
    const [rows] = await pool.query(`
      SELECT m.*, u.username, u.email, d.name as department_name, sd.name AS sub_department_name, sd.code AS sub_department_code 
      FROM managers m 
      JOIN users u ON m.user_id = u.id 
      JOIN departments d ON m.department_id = d.id
      LEFT JOIN sub_departments sd ON m.sub_department_id = sd.id
      WHERE m.id = ?
    `, [id]);
    return rows[0];
  }

  async findManagerByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM managers WHERE user_id = ?', [userId]);
    return rows[0];
  }

  async getLastManagerCode() {
    const [rows] = await pool.query('SELECT manager_id_code FROM managers ORDER BY id DESC LIMIT 1');
    return rows[0] ? rows[0].manager_id_code : null;
  }

  async createManagerProfile(profileData, conn) {
    const db = this.getContext(conn);
    const { user_id, manager_id_code, full_name, phone, department_id, sub_department_id, branch, joining_date, status, created_by, profile_image } = profileData;
    const [result] = await db.query(
      `INSERT INTO managers (user_id, manager_id_code, full_name, phone, department_id, sub_department_id, branch, joining_date, status, created_by, profile_image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, manager_id_code, full_name, phone, department_id, sub_department_id || null, branch, joining_date, status, created_by, profile_image || null]
    );
    return result.insertId;
  }

  async updateManagerProfile(id, profileData, conn) {
    const db = this.getContext(conn);
    const { full_name, phone, department_id, sub_department_id, branch, joining_date, status, updated_by, profile_image } = profileData;
    await db.query(
      `UPDATE managers 
       SET full_name = ?, phone = ?, department_id = ?, sub_department_id = ?, branch = ?, joining_date = ?, status = ?, updated_by = ?, profile_image = ? 
       WHERE id = ?`,
      [full_name, phone, department_id, sub_department_id || null, branch, joining_date, status, updated_by || null, profile_image || null, id]
    );
  }

  // Employee Operations
  async getEmployeesList({ limit, offset, sortColumn, sortOrder, searchQuery, departmentFilter, statusFilter }) {
    let query = `
      SELECT e.*, u.username, u.email, d.name AS department_name, m.full_name AS reporting_manager_name, sd.name AS sub_department_name, sd.code AS sub_department_code 
      FROM employees e 
      JOIN users u ON e.user_id = u.id 
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN managers m ON e.reporting_manager_id = m.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (e.full_name LIKE ? OR e.employee_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (departmentFilter) {
      query += ` AND e.department_id = ?`;
      params.push(departmentFilter);
    }
    if (statusFilter) {
      query += ` AND e.status = ?`;
      params.push(statusFilter);
    }

    const allowedSort = ['full_name', 'employee_id_code', 'joining_date', 'status', 'department_name', 'reporting_manager_name'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'e.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getEmployeesCount({ searchQuery, departmentFilter, statusFilter }) {
    let query = `
      SELECT COUNT(*) as count 
      FROM employees e
      JOIN users u ON e.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (e.full_name LIKE ? OR e.employee_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (departmentFilter) {
      query += ` AND e.department_id = ?`;
      params.push(departmentFilter);
    }
    if (statusFilter) {
      query += ` AND e.status = ?`;
      params.push(statusFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  // ⚡ INCLUDES SUB-DEPARTMENT NAME AND CODE FOR DROPDOWNS
  async getEmployeesDropdown(departmentId) {
    let query = `
      SELECT 
        e.id, 
        e.full_name, 
        e.employee_id_code, 
        e.department_id, 
        e.sub_department_id, 
        d.name AS department_name,
        sd.name AS sub_department_name,
        sd.code AS sub_department_code
      FROM employees e 
      JOIN users u ON e.user_id = u.id
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.status = 'active' AND u.deleted_at IS NULL
    `;
    const params = [];
    if (departmentId) {
      query += ` AND e.department_id = ?`;
      params.push(departmentId);
    }
    query += ` ORDER BY e.full_name ASC`;
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async findEmployeeById(id) {
    const [rows] = await pool.query(`
      SELECT e.*, u.username, u.email, d.name as department_name, m.full_name as reporting_manager_name, sd.name as sub_department_name, sd.code as sub_department_code 
      FROM employees e 
      JOIN users u ON e.user_id = u.id 
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN managers m ON e.reporting_manager_id = m.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

  async findEmployeeByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT e.*, d.code AS department_code, d.name AS department_name, sd.code AS sub_department_code, sd.name AS sub_department_name 
      FROM employees e 
      JOIN departments d ON e.department_id = d.id 
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id 
      WHERE e.user_id = ?
    `, [userId]);
    return rows[0];
  }

  async getLastEmployeeCode() {
    const [rows] = await pool.query('SELECT employee_id_code FROM employees ORDER BY id DESC LIMIT 1');
    return rows[0] ? rows[0].employee_id_code : null;
  }

  async getLastEmployeeCodeByPrefix(prefix) {
    const [rows] = await pool.query(
      'SELECT employee_id_code FROM employees WHERE employee_id_code LIKE ? ORDER BY id DESC LIMIT 1',
      [`${prefix}%`]
    );
    return rows[0] ? rows[0].employee_id_code : null;
  }

  async createEmployeeProfile(profileData, conn) {
    const db = this.getContext(conn);
    const { user_id, employee_id_code, full_name, phone, department_id, sub_department_id, reporting_manager_id, joining_date, status, created_by, profile_image } = profileData;
    const [result] = await db.query(
      `INSERT INTO employees (user_id, employee_id_code, full_name, phone, department_id, sub_department_id, reporting_manager_id, joining_date, status, created_by, profile_image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, employee_id_code, full_name, phone, department_id, sub_department_id || null, reporting_manager_id || null, joining_date, status, created_by, profile_image || null]
    );
    return result.insertId;
  }

  async updateEmployeeProfile(id, profileData, conn) {
    const db = this.getContext(conn);
    const { full_name, phone, department_id, sub_department_id, reporting_manager_id, joining_date, status, updated_by, profile_image } = profileData;
    await db.query(
      `UPDATE employees 
       SET full_name = ?, phone = ?, department_id = ?, sub_department_id = ?, reporting_manager_id = ?, joining_date = ?, status = ?, updated_by = ?, profile_image = ? 
       WHERE id = ?`,
      [full_name, phone, department_id, sub_department_id || null, reporting_manager_id || null, reporting_manager_id || null, joining_date, status, updated_by || null, profile_image || null, id]
    );
  }

  // HR Operations
  async getHRList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter }) {
    let query = `
      SELECT h.*, u.username, u.email 
      FROM hr h 
      JOIN users u ON h.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (h.full_name LIKE ? OR h.hr_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (statusFilter) {
      query += ` AND h.status = ?`;
      params.push(statusFilter);
    }

    const allowedSort = ['full_name', 'hr_id_code', 'joining_date', 'status'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'h.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getHRCount({ searchQuery, statusFilter }) {
    let query = `
      SELECT COUNT(*) as count 
      FROM hr h
      JOIN users u ON h.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (h.full_name LIKE ? OR h.hr_id_code LIKE ? OR u.email LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like);
    }
    if (statusFilter) {
      query += ` AND h.status = ?`;
      params.push(statusFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async findHRById(id) {
    const [rows] = await pool.query(`
      SELECT h.*, u.username, u.email 
      FROM hr h 
      JOIN users u ON h.user_id = u.id 
      WHERE h.id = ?
    `, [id]);
    return rows[0];
  }

  async findHRByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM hr WHERE user_id = ?', [userId]);
    return rows[0];
  }

  async getLastHRCode() {
    const [rows] = await pool.query('SELECT hr_id_code FROM hr ORDER BY id DESC LIMIT 1');
    return rows[0] ? rows[0].hr_id_code : null;
  }

  async createHRProfile(profileData, conn) {
    const db = this.getContext(conn);
    const { user_id, hr_id_code, full_name, phone, joining_date, status, created_by, profile_image } = profileData;
    const [result] = await db.query(
      `INSERT INTO hr (user_id, hr_id_code, full_name, phone, joining_date, status, created_by, profile_image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, hr_id_code, full_name, phone, joining_date, status, created_by, profile_image || null]
    );
    return result.insertId;
  }

  async updateHRProfile(id, profileData, conn) {
    const db = this.getContext(conn);
    const { full_name, phone, joining_date, status, updated_by, profile_image } = profileData;
    await db.query(
      `UPDATE hr 
       SET full_name = ?, phone = ?, joining_date = ?, status = ?, updated_by = ?, profile_image = ? 
       WHERE id = ?`,
      [full_name, phone, joining_date, status, updated_by || null, profile_image || null, id]
    );
  }

  async bulkDeleteUsers(userIds, conn) {
    const db = this.getContext(conn);
    if (!userIds || !userIds.length) return;

    try { await db.query('DELETE FROM managers WHERE user_id IN (?)', [userIds]); } catch (_) {}
    try { await db.query('DELETE FROM employees WHERE user_id IN (?)', [userIds]); } catch (_) {}
    try { await db.query('DELETE FROM hr WHERE user_id IN (?)', [userIds]); } catch (_) {}
    try { await db.query('DELETE FROM clients WHERE user_id IN (?)', [userIds]); } catch (_) {}

    await db.query('DELETE FROM users WHERE id IN (?)', [userIds]);
  }

  async bulkUpdateUsersStatus(userIds, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE users SET status = ? WHERE id IN (?)', [status, userIds]);
  }

  async isOrphanUser(userId) {
    const [emp] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    const [mgr] = await pool.query('SELECT id FROM managers WHERE user_id = ?', [userId]);
    const [hr] = await pool.query('SELECT id FROM hr WHERE user_id = ?', [userId]);
    const [client] = await pool.query('SELECT id FROM clients WHERE user_id = ?', [userId]);
    
    return emp.length === 0 && mgr.length === 0 && hr.length === 0 && client.length === 0;
  }

  async hardDeleteUser(userId, conn) {
    const db = this.getContext(conn);
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
  }
}

module.exports = new UserRepository();