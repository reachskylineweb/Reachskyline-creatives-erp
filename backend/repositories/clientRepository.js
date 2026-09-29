const pool = require('../config/db');

class ClientRepository {
  getContext(conn) {
    return conn || pool;
  }

  async getClientsList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter }) {
    let query = 'SELECT * FROM clients WHERE 1=1';
    const params = [];

    if (searchQuery) {
      query += ` AND (company_name LIKE ? OR client_name LIKE ? OR email LIKE ? OR client_id_code LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like, like);
    }

    if (statusFilter) {
      query += ` AND status = ?`;
      params.push(statusFilter);
    }

    const allowedSort = ['company_name', 'client_name', 'email', 'client_id_code', 'start_date', 'status'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getClientsCount({ searchQuery, statusFilter }) {
    let query = 'SELECT COUNT(*) as count FROM clients WHERE 1=1';
    const params = [];

    if (searchQuery) {
      query += ` AND (company_name LIKE ? OR client_name LIKE ? OR email LIKE ? OR client_id_code LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like, like, like);
    }

    if (statusFilter) {
      query += ` AND status = ?`;
      params.push(statusFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async getClientsDropdown() {
    const [rows] = await pool.query("SELECT id, company_name, client_name, client_id_code FROM clients WHERE status = 'active'");
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM clients WHERE email = ?', [email]);
    return rows[0];
  }

  async getLastClientCode() {
    const [rows] = await pool.query('SELECT client_id_code FROM clients ORDER BY id DESC LIMIT 1');
    return rows[0] ? rows[0].client_id_code : null;
  }

  async create(clientData, conn) {
    const db = this.getContext(conn);
    const { 
      client_id_code, company_name, client_name, phone, email, address, 
      website, gst_number, contact_person, contact_phone, industry, 
      start_date, status, notes, created_by, user_id, profile_image 
    } = clientData;

    const cleanEmail = (email && String(email).trim() !== '') ? String(email).trim() : null;

    const [result] = await db.query(
      `INSERT INTO clients (
        client_id_code, company_name, client_name, phone, email, address, 
        website, gst_number, contact_person, contact_phone, industry, 
        start_date, status, notes, created_by, user_id, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id_code, company_name, client_name, phone, cleanEmail, address, 
        website, gst_number, contact_person || '', contact_phone || '', industry, 
        start_date, status, notes, created_by, user_id || null, profile_image || null
      ]
    );
    return result.insertId;
  }

  async update(id, clientData, conn) {
    const db = this.getContext(conn);
    const { 
      company_name, client_name, phone, email, address, website, 
      gst_number, contact_person, contact_phone, industry, 
      start_date, status, notes, updated_by, profile_image 
    } = clientData;

    const cleanEmail = (email && String(email).trim() !== '') ? String(email).trim() : null;

    await db.query(
      `UPDATE clients 
       SET company_name = ?, client_name = ?, phone = ?, email = ?, address = ?, website = ?, gst_number = ?, contact_person = ?, contact_phone = ?, industry = ?, start_date = ?, status = ?, notes = ?, updated_by = ?, profile_image = ? 
       WHERE id = ?`,
      [
        company_name, client_name, phone, cleanEmail, address, website, 
        gst_number, contact_person || '', contact_phone || '', industry, 
        start_date, status, notes, updated_by, profile_image || null, id
      ]
    );
  }

  // ⚡ HARD-DELETE AUTOMATICALLY (Erases Client, User Account, and Deliverables completely)
  async softDelete(id, conn) {
    const db = this.getContext(conn);
    
    // Get associated user_id
    const [clients] = await db.query('SELECT user_id FROM clients WHERE id = ?', [id]);
    const userId = clients[0] ? clients[0].user_id : null;

    // 1. Clean up deliverables
    try { await db.query('DELETE FROM event_day_client_deliverables WHERE client_id = ?', [id]); } catch (_) {}
    try { await db.query('DELETE FROM monthly_deliverables WHERE client_id = ?', [id]); } catch (_) {}
    try { await db.query('DELETE FROM content_calendar WHERE client_id = ?', [id]); } catch (_) {}

    // 2. Hard delete client profile
    await db.query('DELETE FROM clients WHERE id = ?', [id]);

    // 3. Hard delete associated portal user account
    if (userId) {
      await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }
  }

  async changeStatus(id, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE clients SET status = ? WHERE id = ?', [status, id]);
  }

  // ⚡ HARD-DELETE BULK OPERATONS
  async bulkDelete(ids, conn) {
    const db = this.getContext(conn);
    if (!ids || !ids.length) return;

    // Get user_ids to clean up login accounts
    const [clients] = await db.query('SELECT user_id FROM clients WHERE id IN (?)', [ids]);
    const userIds = clients.map(c => c.user_id).filter(Boolean);

    try { await db.query('DELETE FROM event_day_client_deliverables WHERE client_id IN (?)', [ids]); } catch (_) {}
    try { await db.query('DELETE FROM monthly_deliverables WHERE client_id IN (?)', [ids]); } catch (_) {}
    try { await db.query('DELETE FROM content_calendar WHERE client_id IN (?)', [ids]); } catch (_) {}

    await db.query('DELETE FROM clients WHERE id IN (?)', [ids]);

    if (userIds.length > 0) {
      await db.query('DELETE FROM users WHERE id IN (?)', [userIds]);
    }
  }

  async bulkUpdateStatus(ids, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE clients SET status = ? WHERE id IN (?)', [status, ids]);
  }
}

module.exports = new ClientRepository();