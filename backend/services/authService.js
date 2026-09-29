const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const pool = require('../config/db');

class AuthService {
  async login(username, password) {
    const cleanUser = username ? username.trim().toLowerCase() : '';

    // 1. Find user by username or email in users table
    let user = await userRepository.findByUsername(username) || await userRepository.findByEmail(username);

    // 2. If not found directly in users table, search clients table for client_name, company_name, email, or username
    if (!user) {
      const [clientRows] = await pool.query(
        `SELECT c.*, u.id as linked_user_id
         FROM clients c
         LEFT JOIN users u ON c.user_id = u.id OR c.email = u.email
         WHERE (LOWER(c.client_name) = ? OR LOWER(c.company_name) = ? OR LOWER(c.email) = ?) AND c.deleted_at IS NULL`,
        [cleanUser, cleanUser, cleanUser]
      );

      if (clientRows.length > 0) {
        const client = clientRows[0];
        if (client.linked_user_id) {
          user = await userRepository.findUserById(client.linked_user_id);
        } else {
          const passwordHash = await bcrypt.hash(password, 12);
          const newUserId = await userRepository.createUser({
            username: client.client_name ? client.client_name.toLowerCase().replace(/\s+/g, '') : cleanUser,
            password: passwordHash,
            plain_password: password,
            email: client.email || `${cleanUser}@client.com`,
            role: 'client',
            status: 'active'
          });
          try {
            await pool.query('UPDATE clients SET user_id = ? WHERE id = ?', [newUserId, client.id]);
          } catch (_) {}
          user = await userRepository.findUserById(newUserId);
        }
      }
    }

    if (!user) {
      const error = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    // 3. Verify account is active
    if (user.status !== 'active') {
      const error = new Error('Your account is deactivated. Contact the system administrator.');
      error.statusCode = 403;
      throw error;
    }

    // 4. Verify password (checks hashed password + raw plain_password fallback)
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid && user.plain_password) {
      if (password === user.plain_password || password.toLowerCase() === user.plain_password.toLowerCase()) {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      const error = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    // 5. Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforerpsystem2026!';
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '8h' }
    );

    // 6. Log Activity
    try {
      await dashboardRepository.createActivityLog(user.id, 'User Login', `User ${user.username} successfully logged into the Admin Portal.`);
    } catch (_) {}

    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    if (user.role === 'manager') {
      const [mgrRows] = await pool.query(
        `SELECT m.id AS manager_id, m.full_name, m.department_id, d.code AS department_code, d.name AS department_name
         FROM managers m
         JOIN departments d ON m.department_id = d.id
         WHERE m.user_id = ? AND m.status = 'active'`,
        [user.id]
      );
      if (mgrRows.length > 0) {
        userPayload.managerProfile = mgrRows[0];
      }
    } else if (user.role === 'employee') {
      const [empRows] = await pool.query(
        `SELECT e.id AS employee_id, e.full_name, e.department_id, 
                CASE WHEN sd.code = 'CW-RS' THEN 3 ELSE e.sub_department_id END AS sub_department_id, 
                d.code AS department_code, d.name AS department_name
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
         WHERE e.user_id = ? AND e.status = 'active'`,
        [user.id]
      );
      if (empRows.length > 0) {
        userPayload.employeeProfile = empRows[0];
      }
    }

    // 7. Return response payload (omitting password hash)
    return {
      token,
      user: userPayload
    };
  }

  async verifySession(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      const error = new Error('Session is invalid or user does not exist.');
      error.statusCode = 401;
      throw error;
    }
    if (user.status !== 'active') {
      const error = new Error('Your account has been deactivated.');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'manager') {
      const [mgrRows] = await pool.query(
        `SELECT m.id AS manager_id, m.full_name, m.department_id, d.code AS department_code, d.name AS department_name
         FROM managers m
         JOIN departments d ON m.department_id = d.id
         WHERE m.user_id = ? AND m.status = 'active'`,
        [user.id]
      );
      if (mgrRows.length > 0) {
        user.managerProfile = mgrRows[0];
      }
    } else if (user.role === 'employee') {
      const [empRows] = await pool.query(
        `SELECT e.id AS employee_id, e.full_name, e.department_id, 
                CASE WHEN sd.code = 'CW-RS' THEN 3 ELSE e.sub_department_id END AS sub_department_id, 
                d.code AS department_code, d.name AS department_name
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
         WHERE e.user_id = ? AND e.status = 'active'`,
        [user.id]
      );
      if (empRows.length > 0) {
        user.employeeProfile = empRows[0];
      }
    }

    return user;
  }
}

module.exports = new AuthService();