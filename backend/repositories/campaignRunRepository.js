const pool = require('../config/db');

class CampaignRunRepository {
  async create(data, connection = pool) {
    const sql = `
      INSERT INTO campaign_runs (
        client_id,
        title,
        campaign_details,
        platform,
        has_no_end_date,
        start_date,
        end_date,
        total_amount,
        creatives_text,
        creatives_url,
        creatives_status,
        creatives_notes,
        daily_budget,
        campaign_type,
        campaign_type_target,
        assigned_manager_id,
        assigned_employee_id,
        status,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.client_id,
      data.title,
      data.campaign_details || null,
      data.platform || 'meta',
      data.has_no_end_date ? 1 : 0,
      data.start_date,
      data.has_no_end_date ? null : (data.end_date || null),
      data.total_amount || 0.00,
      data.creatives_text || null,
      data.creatives_url || null,
      data.creatives_status || 'pending_review',
      data.creatives_notes || null,
      data.daily_budget || null,
      data.campaign_type || null,
      data.campaign_type_target || null,
      data.assigned_manager_id || null,
      data.assigned_employee_id || null,
      data.status || 'pending_manager_review',
      data.created_by
    ];

    const [result] = await connection.query(sql, values);
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM campaign_runs WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  }

  async findDetailedById(id) {
    const sql = `
      SELECT 
        cr.*,
        c.company_name AS client_company_name,
        c.client_name AS client_contact_name,
        c.client_id_code,
        c.logo_url AS client_logo_url,
        m.full_name AS assigned_manager_name,
        m.manager_id_code AS assigned_manager_code,
        e.full_name AS assigned_employee_name,
        e.employee_id_code AS assigned_employee_code,
        u.username AS creator_username,
        u.role AS creator_role
      FROM campaign_runs cr
      JOIN clients c ON cr.client_id = c.id
      LEFT JOIN managers m ON cr.assigned_manager_id = m.id
      LEFT JOIN employees e ON cr.assigned_employee_id = e.id
      LEFT JOIN users u ON cr.created_by = u.id
      WHERE cr.id = ? AND cr.deleted_at IS NULL
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  async list(filters = {}) {
    const conditions = ['cr.deleted_at IS NULL'];
    const values = [];

    if (filters.clientId) {
      conditions.push('cr.client_id = ?');
      values.push(filters.clientId);
    }

    if (filters.platform && filters.platform !== 'all') {
      conditions.push('cr.platform = ?');
      values.push(filters.platform);
    }

    if (filters.status && filters.status !== 'all') {
      conditions.push('cr.status = ?');
      values.push(filters.status);
    }

    if (filters.campaignType && filters.campaignType !== 'all') {
      conditions.push('cr.campaign_type = ?');
      values.push(filters.campaignType);
    }

    if (filters.assignedEmployeeId) {
      conditions.push('cr.assigned_employee_id = ?');
      values.push(filters.assignedEmployeeId);
    }

    if (filters.assignedManagerId) {
      conditions.push('cr.assigned_manager_id = ?');
      values.push(filters.assignedManagerId);
    }

    if (filters.searchQuery) {
      conditions.push('(cr.title LIKE ? OR c.company_name LIKE ? OR c.client_name LIKE ? OR cr.campaign_details LIKE ?)');
      const term = `%${filters.searchQuery}%`;
      values.push(term, term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        cr.*,
        c.company_name AS client_company_name,
        c.client_name AS client_contact_name,
        c.client_id_code,
        c.logo_url AS client_logo_url,
        m.full_name AS assigned_manager_name,
        m.manager_id_code AS assigned_manager_code,
        e.full_name AS assigned_employee_name,
        e.employee_id_code AS assigned_employee_code,
        u.username AS creator_username
      FROM campaign_runs cr
      JOIN clients c ON cr.client_id = c.id
      LEFT JOIN managers m ON cr.assigned_manager_id = m.id
      LEFT JOIN employees e ON cr.assigned_employee_id = e.id
      LEFT JOIN users u ON cr.created_by = u.id
      ${whereClause}
      ORDER BY cr.created_at DESC
    `;

    const [rows] = await pool.query(sql, values);
    return rows;
  }

  async update(id, data, connection = pool) {
    const fields = [];
    const values = [];

    const allowedKeys = [
      'client_id',
      'title',
      'campaign_details',
      'platform',
      'has_no_end_date',
      'start_date',
      'end_date',
      'total_amount',
      'creatives_text',
      'creatives_url',
      'creatives_status',
      'creatives_notes',
      'daily_budget',
      'campaign_type',
      'campaign_type_target',
      'assigned_manager_id',
      'assigned_employee_id',
      'status',
      'live_campaign_url',
      'employee_notes'
    ];

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return;

    values.push(id);
    const sql = `UPDATE campaign_runs SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    await connection.query(sql, values);
  }

  async softDelete(id, connection = pool) {
    await connection.query(
      'UPDATE campaign_runs SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
  }

  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) AS total_campaigns,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) AS active_running,
        SUM(CASE WHEN status = 'pending_manager_review' THEN 1 ELSE 0 END) AS pending_manager_review,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS assigned_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
        COALESCE(SUM(total_amount), 0) AS total_budget_allocated,
        COALESCE(SUM(CASE WHEN status = 'running' THEN daily_budget ELSE 0 END), 0) AS current_daily_spend
      FROM campaign_runs
      WHERE deleted_at IS NULL
    `;
    const [rows] = await pool.query(sql);
    return rows[0] || {};
  }
}

module.exports = new CampaignRunRepository();
