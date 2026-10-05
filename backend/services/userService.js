const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const clientRepository = require('../repositories/clientRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const notificationRepository = require('../repositories/notificationRepository');
const onesignalService = require('./onesignalService');
const pool = require('../config/db');
function formatToMySQLDate(inputDate) {
  if (!inputDate) return null;
  const str = String(inputDate).trim();
  if (str.includes('T')) return str.split('T')[0];
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch (_) {}
  return str;
}

class UserService {
  // --- ID GENERATION CODE HELPERS ---
  async generateNextManagerId(departmentId, subDepartmentId) {
    let prefix = '';
    if (subDepartmentId) {
      const [subDeps] = await pool.query('SELECT code FROM sub_departments WHERE id = ?', [subDepartmentId]);
      if (subDeps.length > 0) {
        prefix = subDeps[0].code.trim();
      }
    }
    
    if (!prefix && departmentId) {
      const [depts] = await pool.query('SELECT code FROM departments WHERE id = ?', [departmentId]);
      if (depts.length > 0) {
        prefix = depts[0].code.trim();
      }
    }

    if (!prefix) {
      prefix = 'DEPT';
    }

    const likePattern = `${prefix} M%`;
    const [rows] = await pool.query(
      'SELECT manager_id_code FROM managers WHERE manager_id_code LIKE ? ORDER BY id DESC LIMIT 1',
      [likePattern]
    );

    if (rows.length === 0) {
      return `${prefix} M001`;
    }

    const lastCode = rows[0].manager_id_code;
    const match = lastCode.match(/ M(\d+)$/);
    if (!match) {
      return `${prefix} M001`;
    }

    const nextVal = parseInt(match[1], 10) + 1;
    return `${prefix} M${String(nextVal).padStart(3, '0')}`;
  }

  async generateNextEmployeeId(departmentId, subDepartmentId) {
    let prefix = '';
    if (subDepartmentId) {
      const [subDeps] = await pool.query('SELECT code FROM sub_departments WHERE id = ?', [subDepartmentId]);
      if (subDeps.length > 0) {
        prefix = subDeps[0].code.trim();
      }
    }
    
    if (!prefix && departmentId) {
      const [depts] = await pool.query('SELECT code FROM departments WHERE id = ?', [departmentId]);
      if (depts.length > 0) {
        prefix = depts[0].code.trim();
      }
    }

    if (!prefix) {
      prefix = 'DEPT';
    }

    const likePattern = `${prefix} E%`;
    const [rows] = await pool.query(
      'SELECT employee_id_code FROM employees WHERE employee_id_code LIKE ? ORDER BY id DESC LIMIT 1',
      [likePattern]
    );

    if (rows.length === 0) {
      return `${prefix} E001`;
    }

    const lastCode = rows[0].employee_id_code;
    const match = lastCode.match(/ E(\d+)$/);
    if (!match) {
      return `${prefix} E001`;
    }

    const nextVal = parseInt(match[1], 10) + 1;
    return `${prefix} E${String(nextVal).padStart(3, '0')}`;
  }

  async generateNextHRId() {
    const lastCode = await userRepository.getLastHRCode();
    if (!lastCode) return 'HR0001';
    const match = lastCode.match(/^(?:HR|H)(\d+)$/);
    if (!match) return 'HR0001';
    return `HR${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`;
  }

  // --- MANAGER MANAGEMENT ---
  async getManagers(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const queryParams = {
      limit,
      offset,
      sortColumn: filters.sortColumn || 'id',
      sortOrder: filters.sortOrder || 'asc',
      searchQuery: filters.searchQuery || '',
      departmentFilter: filters.departmentFilter || '',
      statusFilter: filters.statusFilter || ''
    };

    const managers = await userRepository.getManagersList(queryParams);
    const total = await userRepository.getManagersCount(queryParams);

    return {
      managers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getManagerById(id) {
    const manager = await userRepository.findManagerById(id);
    if (!manager) {
      const error = new Error('Manager not found.');
      error.statusCode = 404;
      throw error;
    }
    return manager;
  }

  async createManager(data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check username unique
      const existingUser = await userRepository.findByUsernameIncludingDeleted(data.username);
      if (existingUser) {
        if (existingUser.deleted_at !== null) {
          await userRepository.freeUpSoftDeletedUser(existingUser.id, existingUser.username, existingUser.email);
        } else {
          const isOrphan = await userRepository.isOrphanUser(existingUser.id);
          if (isOrphan) {
            await userRepository.hardDeleteUser(existingUser.id, connection);
          } else {
            const error = new Error(`Username "${data.username}" is already registered. Please choose a different username.`);
            error.statusCode = 400;
            throw error;
          }
        }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);
      
      // Create user auth profile
      const userId = await userRepository.createUser({
        username: data.username,
        password: passwordHash,
        plain_password: data.password,
        email: data.email,
        role: 'manager',
        status: data.status,
        created_by: adminUserId
      }, connection);

      // Generate manager ID
      const managerIdCode = await this.generateNextManagerId(data.department_id, data.sub_department_id);
      
      // Create manager profile
      const profileId = await userRepository.createManagerProfile({
        user_id: userId,
        manager_id_code: managerIdCode,
        full_name: data.full_name,
        phone: data.phone,
        department_id: data.department_id,
        sub_department_id: data.sub_department_id || null,
        branch: data.branch,
        joining_date: data.joining_date,
        status: data.status,
        created_by: adminUserId,
        profile_image: data.profile_image
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Create Manager', `Manager "${data.full_name}" (${managerIdCode}) created.`, connection);
      await notificationRepository.createNotification(`Manager Created: "${data.full_name}" has been registered.`, 'manager_created', connection);

      await connection.commit();
      
      // Send Welcome Email in the background
      try {
        Promise.resolve(onesignalService.sendWelcomeEmail(data.email, data.full_name, 'Manager', data.department_id, data.sub_department_id))
          .catch(err => console.error('[UserService] Failed to send welcome email to manager:', err.message));
      } catch (err) {
        console.error('[UserService] Error initiating welcome email to manager:', err.message);
      }

      return { id: profileId, manager_id_code: managerIdCode };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateManager(id, data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const manager = await userRepository.findManagerById(id);
      if (!manager) {
        const error = new Error('Manager profile not found.');
        error.statusCode = 404;
        throw error;
      }

      // Check username unique if changed
      if (data.username && data.username.trim() !== '' && data.username.trim() !== manager.username) {
        const newUsername = data.username.trim();
        const existingUser = await userRepository.findByUsernameIncludingDeleted(newUsername, connection);
        if (existingUser && existingUser.id !== manager.user_id) {
          if (existingUser.deleted_at !== null) {
            await userRepository.freeUpSoftDeletedUser(existingUser.id, existingUser.username, existingUser.email, connection);
          } else {
            const error = new Error(`Username "${newUsername}" is already taken by another active user.`);
            error.statusCode = 400;
            throw error;
          }
        }
      }

      let passwordHash = null;
      if (data.password && data.password.trim().length > 0) {
        passwordHash = await bcrypt.hash(data.password.trim(), 12);
      }

      // Update auth user profile (NOW UPDATES USERNAME & PASSWORD)
      await userRepository.updateUser(manager.user_id, {
        email: data.email ? data.email.trim() : manager.email,
        username: data.username ? data.username.trim() : undefined,
        password: passwordHash || undefined,
        plain_password: data.password ? data.password.trim() : undefined,
        status: data.status || manager.status,
        updated_by: adminUserId
      }, connection);

      // Update manager detail profile
      await userRepository.updateManagerProfile(id, {
        full_name: data.full_name,
        phone: data.phone,
        department_id: data.department_id,
        sub_department_id: data.sub_department_id || null,
        branch: data.branch,
        joining_date: formatToMySQLDate(data.joining_date) || formatToMySQLDate(manager.joining_date),
        status: data.status,
        updated_by: adminUserId,
        profile_image: data.profile_image
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Update Manager', `Manager "${data.full_name}" (${manager.manager_id_code}) updated.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteManager(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const manager = await userRepository.findManagerById(id);
      if (!manager) {
        const error = new Error('Manager not found.');
        error.statusCode = 404;
        throw error;
      }

      const mgrId = manager.id;
      const userId = manager.user_id;

      // 1. Unassign employees reporting to this manager
      await connection.query('UPDATE employees SET reporting_manager_id = NULL WHERE reporting_manager_id = ?', [mgrId]);

      // 2. Remove blog client assignments for this manager
      await connection.query('DELETE FROM blog_client_assignments WHERE manager_id = ?', [mgrId]);

      // 3. Soft delete user record and set manager status to inactive
      await userRepository.softDeleteUser(userId, connection);
      await connection.query("UPDATE managers SET status = 'inactive', updated_by = ? WHERE id = ?", [adminUserId, mgrId]);

      // 4. Immediately purge push subscriptions for the removed user
      await connection.query('DELETE FROM user_push_subscriptions WHERE user_id = ?', [userId]);

      await dashboardRepository.createActivityLog(adminUserId, 'Delete Manager', `Manager "${manager.full_name}" (${manager.manager_id_code}) was deleted.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- EMPLOYEE MANAGEMENT ---
  async getEmployees(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const queryParams = {
      limit,
      offset,
      sortColumn: filters.sortColumn || 'id',
      sortOrder: filters.sortOrder || 'asc',
      searchQuery: filters.searchQuery || '',
      departmentFilter: filters.departmentFilter || '',
      statusFilter: filters.statusFilter || ''
    };

    const employees = await userRepository.getEmployeesList(queryParams);
    const total = await userRepository.getEmployeesCount(queryParams);

    return {
      employees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getEmployeeById(id) {
    const employee = await userRepository.findEmployeeById(id);
    if (!employee) {
      const error = new Error('Employee not found.');
      error.statusCode = 404;
      throw error;
    }
    return employee;
  }

  async createEmployee(data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const existingUser = await userRepository.findByUsernameIncludingDeleted(data.username);
      if (existingUser) {
        if (existingUser.deleted_at !== null) {
          await userRepository.freeUpSoftDeletedUser(existingUser.id, existingUser.username, existingUser.email);
        } else {
          const isOrphan = await userRepository.isOrphanUser(existingUser.id);
          if (isOrphan) {
            await userRepository.hardDeleteUser(existingUser.id, connection);
          } else {
            const error = new Error(`Username "${data.username}" is already registered. Please choose a different username.`);
            error.statusCode = 400;
            throw error;
          }
        }
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      
      const userId = await userRepository.createUser({
        username: data.username,
        password: passwordHash,
        plain_password: data.password,
        email: data.email,
        role: 'employee',
        status: data.status,
        created_by: adminUserId
      }, connection);

      const employeeIdCode = await this.generateNextEmployeeId(data.department_id, data.sub_department_id);
      
      const profileId = await userRepository.createEmployeeProfile({
        user_id: userId,
        employee_id_code: employeeIdCode,
        full_name: data.full_name,
        phone: data.phone,
        department_id: data.department_id,
        sub_department_id: data.sub_department_id || null,
        reporting_manager_id: data.reporting_manager_id,
        joining_date: data.joining_date,
        status: data.status,
        created_by: adminUserId,
        profile_image: data.profile_image || data.avatar_url || null,
        avatar_url: data.avatar_url || data.profile_image || null
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Create Employee', `Employee "${data.full_name}" (${employeeIdCode}) created.`, connection);
      await notificationRepository.createNotification(`Employee Created: "${data.full_name}" has been registered.`, 'employee_created', connection);

      await connection.commit();

      // Send Welcome Email in the background
      try {
        Promise.resolve(onesignalService.sendWelcomeEmail(data.email, data.full_name, 'Employee', data.department_id, data.sub_department_id))
          .catch(err => console.error('[UserService] Failed to send welcome email to employee:', err.message));
      } catch (err) {
        console.error('[UserService] Error initiating welcome email to employee:', err.message);
      }

      return { id: profileId, employee_id_code: employeeIdCode };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateEmployee(id, data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const employee = await userRepository.findEmployeeById(id);
      if (!employee) {
        const error = new Error('Employee profile not found.');
        error.statusCode = 404;
        throw error;
      }

      // Check username unique if changed
      if (data.username && data.username.trim() !== '' && data.username.trim() !== employee.username) {
        const newUsername = data.username.trim();
        const existingUser = await userRepository.findByUsernameIncludingDeleted(newUsername, connection);
        if (existingUser && existingUser.id !== employee.user_id) {
          if (existingUser.deleted_at !== null) {
            await userRepository.freeUpSoftDeletedUser(existingUser.id, existingUser.username, existingUser.email, connection);
          } else {
            const error = new Error(`Username "${newUsername}" is already taken by another active user.`);
            error.statusCode = 400;
            throw error;
          }
        }
      }

      let passwordHash = null;
      if (data.password && data.password.trim().length > 0) {
        passwordHash = await bcrypt.hash(data.password.trim(), 12);
      }

      // Update auth user profile (NOW UPDATES USERNAME & PASSWORD)
      await userRepository.updateUser(employee.user_id, {
        email: data.email ? data.email.trim() : employee.email,
        username: data.username ? data.username.trim() : undefined,
        password: passwordHash || undefined,
        plain_password: data.password ? data.password.trim() : undefined,
        status: data.status || employee.status,
        updated_by: adminUserId
      }, connection);

      await userRepository.updateEmployeeProfile(id, {
        full_name: data.full_name,
        phone: data.phone,
        department_id: data.department_id,
        sub_department_id: data.sub_department_id || null,
        reporting_manager_id: data.reporting_manager_id,
        joining_date: formatToMySQLDate(data.joining_date) || formatToMySQLDate(employee.joining_date),
        status: data.status,
        updated_by: adminUserId,
        profile_image: data.profile_image !== undefined ? data.profile_image : data.avatar_url,
        avatar_url: data.avatar_url !== undefined ? data.avatar_url : data.profile_image
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Update Employee', `Employee "${data.full_name}" (${employee.employee_id_code}) updated.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteEmployee(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const employee = await userRepository.findEmployeeById(id);
      if (!employee) {
        const error = new Error('Employee not found.');
        error.statusCode = 404;
        throw error;
      }

      const empId = employee.id;
      const userId = employee.user_id;

      // Ensure monthly_deliverables.assigned_employee_id allows NULL if possible
      try {
        await connection.query("ALTER TABLE monthly_deliverables MODIFY assigned_employee_id INT(11) NULL");
      } catch (_) {}

      // 1. Unassign from monthly_deliverables safely BEFORE employee deletion
      try {
        await connection.query("UPDATE monthly_deliverables SET assigned_employee_id = NULL WHERE assigned_employee_id = ?", [empId]);
      } catch (_) {
        try {
          await connection.query("DELETE FROM monthly_deliverables WHERE assigned_employee_id = ?", [empId]);
        } catch (_) {}
      }

      try {
        await connection.query("UPDATE monthly_deliverables SET smm_employee_id = NULL WHERE smm_employee_id = ?", [empId]);
      } catch (_) {}

      try {
        await connection.query("UPDATE monthly_deliverables SET content_writer_id = NULL WHERE content_writer_id = ?", [empId]);
      } catch (_) {}

      // 2. Unassign from job_works safely
      try {
        await connection.query("UPDATE job_works SET assigned_employee_id = NULL WHERE assigned_employee_id = ?", [empId]);
      } catch (_) {}
      try {
        await connection.query("UPDATE job_works SET smm_employee_id = NULL WHERE smm_employee_id = ?", [empId]);
      } catch (_) {}
      try {
        await connection.query("UPDATE job_works SET content_writer_id = NULL WHERE content_writer_id = ?", [empId]);
      } catch (_) {}

      // 3. Unassign from content_calendar, event_days, shoot_scripts safely
      try {
        await connection.query("UPDATE content_calendar SET assigned_employee_id = NULL WHERE assigned_employee_id = ?", [empId]);
      } catch (_) {}
      try {
        await connection.query("UPDATE event_days SET assigned_employee_id = NULL WHERE assigned_employee_id = ?", [empId]);
      } catch (_) {}
      try {
        await connection.query("DELETE FROM shoot_scripts WHERE assigned_employee_id = ?", [empId]);
      } catch (_) {}

      // 4. Unassign/delete from tasks (where assigned_to = user_id)
      if (userId) {
        try {
          await connection.query("UPDATE tasks SET assigned_to = NULL WHERE assigned_to = ?", [userId]);
        } catch (_) {
          try {
            await connection.query("DELETE FROM tasks WHERE assigned_to = ?", [userId]);
          } catch (_) {}
        }
      }

      // 5. Delete notifications & push subscriptions safely
      if (userId) {
        try {
          await connection.query("DELETE FROM notifications WHERE user_id = ?", [userId]);
        } catch (_) {}
        try {
          await connection.query("DELETE FROM user_push_subscriptions WHERE user_id = ?", [userId]);
        } catch (_) {}
      }

      // 6. HARD DELETE employee profile
      await connection.query("DELETE FROM employees WHERE id = ?", [empId]);

      // 7. Safely check if user account is linked to other roles before deleting user account
      if (userId) {
        let isLinked = false;
        try {
          const [mgrCount] = await connection.query('SELECT COUNT(*) as cnt FROM managers WHERE user_id = ?', [userId]);
          if (mgrCount && mgrCount[0] && mgrCount[0].cnt > 0) isLinked = true;
        } catch (_) {}
        try {
          const [hrCount] = await connection.query('SELECT COUNT(*) as cnt FROM hr WHERE user_id = ?', [userId]);
          if (hrCount && hrCount[0] && hrCount[0].cnt > 0) isLinked = true;
        } catch (_) {}

        if (!isLinked) {
          try {
            await connection.query("DELETE FROM users WHERE id = ?", [userId]);
          } catch (_) {}
        }
      }

      try {
        if (adminUserId && dashboardRepository && dashboardRepository.createActivityLog) {
          await dashboardRepository.createActivityLog(adminUserId, 'Delete Employee', `Employee "${employee.full_name}" (${employee.employee_id_code}) was completely removed.`, connection);
        }
      } catch (_) {}

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- HR MANAGEMENT ---
  async getHR(filters) {
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

    const hrList = await userRepository.getHRList(queryParams);
    const total = await userRepository.getHRCount(queryParams);

    return {
      hrList,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getHRById(id) {
    const hr = await userRepository.findHRById(id);
    if (!hr) {
      const error = new Error('HR staff not found.');
      error.statusCode = 404;
      throw error;
    }
    return hr;
  }

  async createHR(data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const existingUser = await userRepository.findByUsernameIncludingDeleted(data.username);
      if (existingUser) {
        if (existingUser.deleted_at !== null) {
          await userRepository.freeUpSoftDeletedUser(existingUser.id, existingUser.username, existingUser.email);
        } else {
          const isOrphan = await userRepository.isOrphanUser(existingUser.id);
          if (isOrphan) {
            await userRepository.hardDeleteUser(existingUser.id, connection);
          } else {
            const error = new Error('Username is already registered.');
            error.statusCode = 400;
            throw error;
          }
        }
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      
      const userId = await userRepository.createUser({
        username: data.username,
        password: passwordHash,
        plain_password: data.password,
        email: data.email,
        role: 'hr',
        status: data.status,
        created_by: adminUserId
      }, connection);

      const hrIdCode = await this.generateNextHRId();
      
      const profileId = await userRepository.createHRProfile({
        user_id: userId,
        hr_id_code: hrIdCode,
        full_name: data.full_name,
        phone: data.phone,
        joining_date: data.joining_date,
        status: data.status,
        created_by: adminUserId,
        profile_image: data.profile_image
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Create HR', `HR Staff "${data.full_name}" (${hrIdCode}) created.`, connection);
      await notificationRepository.createNotification(`HR Staff Created: "${data.full_name}" has been registered.`, 'hr_created', connection);

      await connection.commit();
      return { id: profileId, hr_id_code: hrIdCode };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateHR(id, data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const hr = await userRepository.findHRById(id);
      if (!hr) {
        const error = new Error('HR profile not found.');
        error.statusCode = 404;
        throw error;
      }

      await userRepository.updateUser(hr.user_id, {
        email: data.email,
        username: data.username ? data.username.trim() : undefined,
        status: data.status,
        updated_by: adminUserId
      }, connection);

      await userRepository.updateHRProfile(id, {
        full_name: data.full_name,
        phone: data.phone,
        joining_date: data.joining_date,
        status: data.status,
        updated_by: adminUserId,
        profile_image: data.profile_image
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Update HR', `HR Staff "${data.full_name}" (${hr.hr_id_code}) updated.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteHR(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const hr = await userRepository.findHRById(id);
      if (!hr) {
        const error = new Error('HR not found.');
        error.statusCode = 404;
        throw error;
      }

      await userRepository.softDeleteUser(hr.user_id, connection);
      await userRepository.updateHRProfile(id, {
        ...hr,
        status: 'inactive',
        updated_by: adminUserId
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Delete HR', `HR Staff "${hr.full_name}" (${hr.hr_id_code}) was deleted.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- PASSWORD RESET & STATUS TOGGLE FOR USERS ---
  async resetUserPassword(profileId, userType, newPassword, adminUserId) {
    let profile;
    if (userType === 'manager') {
      profile = await userRepository.findManagerById(profileId);
    } else if (userType === 'employee') {
      profile = await userRepository.findEmployeeById(profileId);
    } else if (userType === 'hr') {
      profile = await userRepository.findHRById(profileId);
    } else if (userType === 'client') {
      profile = await clientRepository.findById(profileId);
      if (profile) profile.full_name = profile.client_name || profile.company_name;
    }

    if (!profile) {
      const error = new Error('Profile not found.');
      error.statusCode = 404;
      throw error;
    }

    let targetUserId = profile.user_id;
    if (!targetUserId && profile.email) {
      const linkedUser = await userRepository.findByEmail(profile.email);
      if (linkedUser) {
        targetUserId = linkedUser.id;
        if (userType === 'client') {
          try {
            await pool.query('UPDATE clients SET user_id = ? WHERE id = ?', [linkedUser.id, profileId]);
          } catch (_) {}
        }
      }
    }

    if (!targetUserId) {
      const rawUsername = profile.username || (profile.email ? profile.email.split('@')[0] : `client_${profileId}`);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      targetUserId = await userRepository.createUser({
        username: rawUsername.trim(),
        password: hashedPassword,
        plain_password: newPassword,
        email: profile.email || `${rawUsername}@client.com`,
        role: userType === 'client' ? 'client' : userType,
        status: 'active',
        created_by: adminUserId
      });

      if (userType === 'client') {
        try {
          await pool.query('UPDATE clients SET user_id = ? WHERE id = ?', [targetUserId, profileId]);
        } catch (_) {}
      }
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updateUserPassword(targetUserId, hashedPassword, newPassword);
    }

    await dashboardRepository.createActivityLog(adminUserId, 'Reset Password', `Reset password for ${userType} "${profile.full_name}" (User ID: ${targetUserId}).`);
  }

  async toggleUserStatus(profileId, userType, status, adminUserId) {
    let profile;
    if (userType === 'manager') {
      profile = await userRepository.findManagerById(profileId);
    } else if (userType === 'employee') {
      profile = await userRepository.findEmployeeById(profileId);
    } else if (userType === 'hr') {
      profile = await userRepository.findHRById(profileId);
    } else if (userType === 'client') {
      profile = await clientRepository.findById(profileId);
      if (profile) profile.full_name = profile.client_name || profile.company_name;
    }

    if (!profile) {
      const error = new Error('Profile not found.');
      error.statusCode = 404;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (profile.user_id) {
        await userRepository.changeUserStatus(profile.user_id, status, connection);
      }
      
      if (userType === 'manager') {
        await userRepository.updateManagerProfile(profileId, { ...profile, status }, connection);
      } else if (userType === 'employee') {
        await userRepository.updateEmployeeProfile(profileId, { ...profile, status }, connection);
      } else if (userType === 'hr') {
        await userRepository.updateHRProfile(profileId, { ...profile, status }, connection);
      } else if (userType === 'client') {
        await clientRepository.update(profileId, { ...profile, status }, connection);
      }

      await dashboardRepository.createActivityLog(adminUserId, 'Toggle Status', `${userType} "${profile.full_name}" status set to ${status}.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- DROPDOWNS ---
  async getManagersDropdown() {
    return await userRepository.getManagersDropdown();
  }

  async getEmployeesDropdown(departmentId) {
    return await userRepository.getEmployeesDropdown(departmentId);
  }

  async getAllCredentials() {
    const [rows] = await pool.query(
      `SELECT 
          u.id, 
          u.username, 
          u.plain_password, 
          u.email, 
          u.role, 
          u.status,
          COALESCE(m.full_name, e.full_name, h.full_name, c.client_name) AS full_name,
          COALESCE(m.manager_id_code, e.employee_id_code, h.hr_id_code, c.client_id_code) AS code
       FROM users u
       LEFT JOIN managers m ON u.id = m.user_id
       LEFT JOIN employees e ON u.id = e.user_id
       LEFT JOIN hr h ON u.id = h.user_id
       LEFT JOIN clients c ON u.id = c.user_id AND c.deleted_at IS NULL
       WHERE u.deleted_at IS NULL AND u.role != 'super_admin'
       ORDER BY u.role ASC, u.username ASC`
    );
    return rows;
  }
}

module.exports = new UserService();