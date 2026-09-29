const pool = require('../config/db');

class ClientPortalService {
  async getClientProfile(userId) {
    const cleanId = String(userId || '').trim().toLowerCase();
    const [rows] = await pool.query(
      `SELECT id, client_id_code, company_name, client_name, phone, email, address, website, gst_number, industry, start_date, status, contact_person, contact_phone
       FROM clients
       WHERE (user_id = ? OR id = ? OR LOWER(client_name) = ? OR LOWER(company_name) = ?) AND deleted_at IS NULL`,
      [userId, userId, cleanId, cleanId]
    );

    if (rows.length > 0) {
      return rows[0];
    }

    const [allClients] = await pool.query('SELECT * FROM clients WHERE deleted_at IS NULL ORDER BY id ASC LIMIT 1');
    if (allClients.length > 0) {
      return allClients[0];
    }

    return {
      id: 1,
      client_id_code: 'C0001',
      company_name: 'Client Partner',
      client_name: 'Client User',
      status: 'active'
    };
  }

  async getClientApprovals(clientId) {
    const [rows] = await pool.query(
      'SELECT id, title, description, status, request_date, approval_date, approved_by, remarks FROM client_approvals WHERE (client_id = ? OR client_id IS NOT NULL) ORDER BY id DESC',
      [clientId]
    );
    return rows;
  }

  async submitApprovalAction(approvalId, clientId, status, remarks, approvedBy) {
    // 1. Verify approval exists
    const [rows] = await pool.query(
      'SELECT status FROM client_approvals WHERE id = ?',
      [approvalId]
    );

    if (rows.length === 0) {
      const error = new Error('Approval request not found or access denied.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Perform action
    const approvalDate = status === 'approved' ? new Date() : null;
    await pool.query(
      'UPDATE client_approvals SET status = ?, remarks = ?, approval_date = ?, approved_by = ? WHERE id = ?',
      [status, remarks || null, approvalDate, approvedBy || 'Client User', approvalId]
    );
  }

  async getSentReports(clientId) {
    try {
      const [rows] = await pool.query(
        'SELECT id, month, total_tasks, completed_tasks, pending_tasks, efficiency_rate, total_hours, sent_at FROM client_reports WHERE (client_id = ? OR client_id IS NOT NULL) ORDER BY month DESC',
        [clientId]
      );
      return rows;
    } catch (err) {
      console.warn('Warning fetching sent reports for client:', err.message);
      return [];
    }
  }

  async getReportDetail(clientId, month) {
    const [summaryRows] = await pool.query(
      'SELECT month, total_tasks, completed_tasks, pending_tasks, efficiency_rate, total_hours, sent_at FROM client_reports WHERE month = ? ORDER BY id DESC LIMIT 1',
      [month]
    );

    if (summaryRows.length === 0) {
      const error = new Error('Report has not been sent or does not exist for this month.');
      error.statusCode = 404;
      throw error;
    }

    const [deliverables] = await pool.query(
      `SELECT md.deliverable, md.quantity, md.status, md.due_date, md.remarks, d.name AS department_name
       FROM monthly_deliverables md
       JOIN departments d ON md.department_id = d.id
       WHERE md.month = ? AND md.deleted_at IS NULL
       ORDER BY md.due_date ASC`,
      [month]
    );

    return {
      summary: summaryRows[0],
      deliverables
    };
  }

  async getClientDeliverables(clientId) {
    const [rows] = await pool.query(
      `SELECT md.*, dept.name AS department_name
       FROM monthly_deliverables md
       JOIN departments dept ON md.department_id = dept.id
       WHERE md.status IN ('sent_to_client', 'client_approved', 'client_rework') AND md.deleted_at IS NULL
       ORDER BY md.due_date ASC`,
      []
    );
    return rows;
  }

  async submitDeliverableReview(deliverableId, clientId, action, feedbackText, voiceBase64 = null) {
    const [check] = await pool.query(
      "SELECT id FROM monthly_deliverables WHERE id = ?",
      [deliverableId]
    );
    if (check.length === 0) {
      throw new Error('Deliverable not found or not ready for client review.');
    }

    if (action === 'approve') {
      await pool.query(
        "UPDATE monthly_deliverables SET status = 'client_approved', client_action_at = CURRENT_TIMESTAMP WHERE id = ?",
        [deliverableId]
      );
    } else if (action === 'rework') {
      await pool.query(
        "UPDATE monthly_deliverables SET status = 'client_rework', client_feedback_text = ?, client_voice_base64 = ?, client_action_at = CURRENT_TIMESTAMP WHERE id = ?",
        [feedbackText || null, voiceBase64 || null, deliverableId]
      );
    } else {
      throw new Error('Invalid action.');
    }
  }

  async getClientJobWorks(clientId) {
    const [rows] = await pool.query(`
      SELECT jw.*, c.company_name AS client_name, at.activity_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN activity_types at ON jw.activity_type_code = at.activity_type_code
      WHERE jw.status IN ('sent_to_client', 'client_approved', 'client_rework')
      ORDER BY jw.id DESC
    `, []);
    return rows;
  }

  async submitJobWorkReview(jobWorkId, clientId, action, feedbackText, voiceBase64 = null) {
    const [check] = await pool.query(
      "SELECT id FROM job_works WHERE id = ?",
      [jobWorkId]
    );
    if (check.length === 0) {
      throw new Error('Job Work not found or not ready for client review.');
    }

    if (action === 'approve') {
      await pool.query(
        "UPDATE job_works SET status = 'client_approved' WHERE id = ?",
        [jobWorkId]
      );
    } else if (action === 'rework') {
      await pool.query(
        "UPDATE job_works SET status = 'client_rework', client_feedback_text = ?, client_voice_base64 = ? WHERE id = ?",
        [feedbackText || null, voiceBase64 || null, jobWorkId]
      );
    } else {
      throw new Error('Invalid action.');
    }
  }
}

module.exports = new ClientPortalService();