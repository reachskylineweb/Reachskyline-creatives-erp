const clientRepository = require('../repositories/clientRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const notificationRepository = require('../repositories/notificationRepository');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

class ClientService {
  async generateNextClientId() {
    const lastCode = await clientRepository.getLastClientCode();
    if (!lastCode) {
      return 'C0001';
    }

    // Extract numerical part (assume format CXXXX)
    const match = lastCode.match(/^C(\d+)$/);
    if (!match) {
      return 'C0001';
    }

    const currentNumber = parseInt(match[1], 10);
    const nextNumber = currentNumber + 1;
    return `C${String(nextNumber).padStart(4, '0')}`;
  }

  async getClients(filters) {
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

    const clients = await clientRepository.getClientsList(queryParams);
    const total = await clientRepository.getClientsCount(queryParams);

    return {
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getClientById(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      const error = new Error('Client not found.');
      error.statusCode = 404;
      throw error;
    }
    return client;
  }

  async createClient(clientData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check username uniqueness
      if (clientData.username) {
        const existingUser = await userRepository.findByUsernameIncludingDeleted(clientData.username);
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
      }

      let createdUserId = null;
      if (clientData.username && clientData.password) {
        const hashedPassword = await bcrypt.hash(clientData.password, 10);
        const userEmail = (clientData.email && clientData.email.trim()) 
          ? clientData.email.trim() 
          : `${clientData.username.trim()}@noemail.local`;

        const [userResult] = await connection.query(
          "INSERT INTO users (username, email, password, plain_password, role) VALUES (?, ?, ?, ?, 'client')",
          [clientData.username.trim(), userEmail, hashedPassword, clientData.password.trim()]
        );
        createdUserId = userResult.insertId;
      }

      const clientIdCode = await this.generateNextClientId();
      const insertData = {
        ...clientData,
        user_id: createdUserId,
        client_id_code: clientIdCode,
        created_by: adminUserId
      };

      const clientId = await clientRepository.create(insertData, connection);
      
      // Activity and Notification log
      await dashboardRepository.createActivityLog(adminUserId, 'Create Client', `Client company "${clientData.company_name}" (${clientIdCode}) created.`, connection);
      await notificationRepository.createNotification(`Client Created: "${clientData.company_name}" has been registered.`, 'client_created', connection);

      await connection.commit();
      return { id: clientId, client_id_code: clientIdCode };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateClient(id, clientData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const client = await clientRepository.findById(id);
      if (!client) {
        const error = new Error('Client not found.');
        error.statusCode = 404;
        throw error;
      }

      const updateData = {
        ...clientData,
        updated_by: adminUserId
      };

      await clientRepository.update(id, updateData, connection);

      // Sync password and plain_password to users table if updated
      const newPwd = clientData.password || clientData.raw_password || clientData.plain_password;
      if (newPwd && newPwd.trim() && client.user_id) {
        const hashedPassword = await bcrypt.hash(newPwd.trim(), 10);
        await connection.query(
          "UPDATE users SET password = ?, plain_password = ? WHERE id = ?",
          [hashedPassword, newPwd.trim(), client.user_id]
        );
      }
      
      await dashboardRepository.createActivityLog(adminUserId, 'Update Client', `Client company "${clientData.company_name}" (${client.client_id_code}) was updated.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async cascadeDeleteClientData(clientIds, conn) {
    const db = conn || pool;
    if (!Array.isArray(clientIds) || clientIds.length === 0) return;

    // 1. Fetch user_ids and company details for notification cleanup
    const [clients] = await db.query(
      'SELECT id, user_id, company_name, client_id_code FROM clients WHERE id IN (?)',
      [clientIds]
    );

    const userIds = clients.map(c => c.user_id).filter(Boolean);

    // 2. Soft-delete / deactivate linked users and remove user notifications
    if (userIds.length > 0) {
      await db.query(
        "UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = 'inactive' WHERE id IN (?)",
        [userIds]
      );
      await db.query(
        "DELETE FROM notifications WHERE user_id IN (?)",
        [userIds]
      );
    }

    // 3. Delete/soft-delete monthly_deliverables & grids
    await db.query(
      "UPDATE monthly_deliverables SET deleted_at = CURRENT_TIMESTAMP WHERE client_id IN (?)",
      [clientIds]
    );

    // 4. Delete job_works & job_work_history
    const [jobs] = await db.query("SELECT id FROM job_works WHERE client_id IN (?)", [clientIds]);
    const jobIds = jobs.map(j => j.id);
    if (jobIds.length > 0) {
      await db.query("DELETE FROM job_work_history WHERE job_work_id IN (?)", [jobIds]);
    }
    await db.query("DELETE FROM job_works WHERE client_id IN (?)", [clientIds]);

    // 5. Delete content_calendar
    await db.query("DELETE FROM content_calendar WHERE client_id IN (?)", [clientIds]);

    // 6. Delete event_day_client_deliverables
    await db.query("DELETE FROM event_day_client_deliverables WHERE client_id IN (?)", [clientIds]);

    // 7. Soft-delete projects
    await db.query("UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE client_id IN (?)", [clientIds]);

    // 8. Delete shoot_scripts, client_approvals, & client_reports
    await db.query("DELETE FROM shoot_scripts WHERE client_id IN (?)", [clientIds]);
    await db.query("DELETE FROM client_approvals WHERE client_id IN (?)", [clientIds]);
    try { await db.query("DELETE FROM client_reports WHERE client_id IN (?)", [clientIds]); } catch (_) {}

    // 9. Delete notifications referencing company name or code
    for (const c of clients) {
      if (c.company_name) {
        await db.query("DELETE FROM notifications WHERE message LIKE ?", [`%${c.company_name}%`]);
      }
      if (c.client_id_code) {
        await db.query("DELETE FROM notifications WHERE message LIKE ?", [`%${c.client_id_code}%`]);
      }
    }
  }

  async deleteClient(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const client = await clientRepository.findById(id);
      if (!client) {
        const error = new Error('Client not found.');
        error.statusCode = 404;
        throw error;
      }

      await this.cascadeDeleteClientData([id], connection);
      await clientRepository.softDelete(id, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Client', `Client "${client.company_name}" (${client.client_id_code}) was completely deleted.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async toggleClientStatus(id, status, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const client = await clientRepository.findById(id);
      if (!client) {
        const error = new Error('Client not found.');
        error.statusCode = 404;
        throw error;
      }

      await clientRepository.changeStatus(id, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Toggle Client Status', `Client "${client.company_name}" status set to ${status}.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Bulk Actions
  async bulkDeleteClients(ids, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No client IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await this.cascadeDeleteClientData(ids, connection);
      await clientRepository.bulkDelete(ids, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Delete Clients', `Bulk deleted ${ids.length} clients.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async bulkUpdateClientsStatus(ids, status, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No client IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await clientRepository.bulkUpdateStatus(ids, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Update Client Status', `Bulk updated status of ${ids.length} clients to "${status}".`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getClientsDropdown() {
    return await clientRepository.getClientsDropdown();
  }
}

module.exports = new ClientService();