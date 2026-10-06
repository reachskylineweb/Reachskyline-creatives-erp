const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const pool = require('../config/db');

class AuthService {
  async login(username, password) {
    const cleanUser = username ? String(username).trim() : '';
    const cleanPassword = password !== undefined && password !== null ? String(password).trim() : '';

    // 1. Find user by username or email in users table
    let user = await userRepository.findByUsername(cleanUser) || await userRepository.findByEmail(cleanUser);

    // 2. If not found directly in users table, search clients table for client_name, company_name, email, or username
    if (!user) {
      const [clientRows] = await pool.query(
        `SELECT c.*, u.id as linked_user_id
         FROM clients c
         LEFT JOIN users u ON c.user_id = u.id OR c.email = u.email
         WHERE (LOWER(TRIM(c.client_name)) = LOWER(?) OR LOWER(TRIM(c.company_name)) = LOWER(?) OR LOWER(TRIM(c.email)) = LOWER(?)) AND c.deleted_at IS NULL`,
        [cleanUser, cleanUser, cleanUser]
      );

      if (clientRows.length > 0) {
        const client = clientRows[0];
        if (client.linked_user_id) {
          user = await userRepository.findUserById(client.linked_user_id);
        } else {
          const passwordHash = await bcrypt.hash(cleanPassword || password, 12);
          const newUserId = await userRepository.createUser({
            username: client.client_name ? client.client_name.toLowerCase().replace(/\s+/g, '') : cleanUser,
            password: passwordHash,
            plain_password: cleanPassword || password,
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
    let isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
    if (!isPasswordValid && password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }
    if (!isPasswordValid && user.plain_password) {
      const storedPlain = String(user.plain_password).trim();
      if (
        cleanPassword === storedPlain ||
        password === user.plain_password ||
        cleanPassword.toLowerCase() === storedPlain.toLowerCase()
      ) {
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
        `SELECT m.id AS manager_id, m.full_name, m.department_id, m.profile_image, d.code AS department_code, d.name AS department_name
         FROM managers m
         JOIN departments d ON m.department_id = d.id
         WHERE m.user_id = ? AND m.status = 'active'`,
        [user.id]
      );
      if (mgrRows.length > 0) {
        userPayload.managerProfile = mgrRows[0];
        userPayload.profile_image = mgrRows[0].profile_image;
        userPayload.avatar_url = mgrRows[0].profile_image;
      }
    } else if (user.role === 'employee') {
      const [empRows] = await pool.query(
        `SELECT e.id AS employee_id, e.full_name, e.department_id, e.profile_image, e.avatar_url,
                e.sub_department_id,
                sd.code AS sub_department_code, sd.name AS sub_department_name,
                d.code AS department_code, d.name AS department_name
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
         WHERE e.user_id = ? AND e.status = 'active'`,
        [user.id]
      );
      if (empRows.length > 0) {
        userPayload.employeeProfile = empRows[0];
        userPayload.profile_image = empRows[0].profile_image || empRows[0].avatar_url;
        userPayload.avatar_url = empRows[0].avatar_url || empRows[0].profile_image;
      }
    } else if (user.role === 'client') {
      const [clientRows] = await pool.query(
        `SELECT c.id AS client_id, c.company_name, c.client_name, c.profile_image, c.logo_url
         FROM clients c
         WHERE c.user_id = ? AND c.status = 'active'`,
        [user.id]
      );
      if (clientRows.length > 0) {
        userPayload.clientProfile = clientRows[0];
        userPayload.profile_image = clientRows[0].profile_image || clientRows[0].logo_url;
        userPayload.logo_url = clientRows[0].logo_url || clientRows[0].profile_image;
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
        `SELECT m.id AS manager_id, m.full_name, m.department_id, m.profile_image, d.code AS department_code, d.name AS department_name
         FROM managers m
         JOIN departments d ON m.department_id = d.id
         WHERE m.user_id = ? AND m.status = 'active'`,
        [user.id]
      );
      if (mgrRows.length > 0) {
        user.managerProfile = mgrRows[0];
        user.profile_image = mgrRows[0].profile_image;
        user.avatar_url = mgrRows[0].profile_image;
      }
    } else if (user.role === 'employee') {
      const [empRows] = await pool.query(
        `SELECT e.id AS employee_id, e.full_name, e.department_id, e.profile_image, e.avatar_url,
                e.sub_department_id,
                sd.code AS sub_department_code, sd.name AS sub_department_name,
                d.code AS department_code, d.name AS department_name
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
         WHERE e.user_id = ? AND e.status = 'active'`,
        [user.id]
      );
      if (empRows.length > 0) {
        user.employeeProfile = empRows[0];
        user.profile_image = empRows[0].profile_image || empRows[0].avatar_url;
        user.avatar_url = empRows[0].avatar_url || empRows[0].profile_image;
      }
    } else if (user.role === 'client') {
      const [clientRows] = await pool.query(
        `SELECT c.id AS client_id, c.company_name, c.client_name, c.profile_image, c.logo_url
         FROM clients c
         WHERE c.user_id = ? AND c.status = 'active'`,
        [user.id]
      );
      if (clientRows.length > 0) {
        user.clientProfile = clientRows[0];
        user.profile_image = clientRows[0].profile_image || clientRows[0].logo_url;
        user.logo_url = clientRows[0].logo_url || clientRows[0].profile_image;
      }
    }

    return user;
  }
}

module.exports = new AuthService();