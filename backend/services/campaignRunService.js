const campaignRunRepository = require('../repositories/campaignRunRepository');
const clientRepository = require('../repositories/clientRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const notificationRepository = require('../repositories/notificationRepository');
const pool = require('../config/db');

class CampaignRunService {
  async getMetaOptions() {
    // 1. Active Clients
    const [clients] = await pool.query(
      'SELECT id, company_name, client_name, client_id_code, logo_url FROM clients WHERE status = "active" AND deleted_at IS NULL ORDER BY company_name ASC'
    );

    // 2. Campaign Managers (department_id = 4 or code CMP-RS)
    const [campaignManagers] = await pool.query(`
      SELECT m.id, m.full_name, m.manager_id_code, m.department_id, d.name AS department_name
      FROM managers m
      JOIN departments d ON m.department_id = d.id
      JOIN users u ON m.user_id = u.id
      WHERE (m.department_id = 4 OR d.code = 'CMP-RS' OR d.name LIKE '%campaign%') 
        AND m.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL
      ORDER BY m.full_name ASC
    `);

    // Fallback if no campaign manager found: fetch all active managers
    let allManagers = campaignManagers;
    if (allManagers.length === 0) {
      const [fallbackMgrs] = await pool.query(`
        SELECT m.id, m.full_name, m.manager_id_code, m.department_id, d.name AS department_name
        FROM managers m
        JOIN departments d ON m.department_id = d.id
        WHERE m.status = 'active'
        ORDER BY m.full_name ASC
      `);
      allManagers = fallbackMgrs;
    }

    // 3. Campaign Employees
    const [campaignEmployees] = await pool.query(`
      SELECT e.id, e.full_name, e.employee_id_code, e.department_id, d.name AS department_name, sd.name AS sub_department_name
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      JOIN users u ON e.user_id = u.id
      WHERE (e.department_id = 4 OR d.code = 'CMP-RS' OR d.name LIKE '%campaign%') 
        AND e.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL
      ORDER BY e.full_name ASC
    `);

    // Also get all employees for flexible assignment
    const [allEmployees] = await pool.query(`
      SELECT e.id, e.full_name, e.employee_id_code, e.department_id, d.name AS department_name, sd.name AS sub_department_name
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.status = 'active'
      ORDER BY d.id = 4 DESC, e.full_name ASC
    `);

    return {
      clients,
      campaignManagers: allManagers,
      campaignEmployees,
      allEmployees
    };
  }

  async createCampaignRun(adminUserId, data) {
    if (!data.client_id) {
      const error = new Error('Client selection is required.');
      error.statusCode = 400;
      throw error;
    }

    if (!data.title || data.title.trim().length < 2) {
      const error = new Error('Campaign title is required.');
      error.statusCode = 400;
      throw error;
    }

    if (!data.start_date) {
      const error = new Error('Campaign start date is required.');
      error.statusCode = 400;
      throw error;
    }

    const hasNoEndDate = Boolean(data.has_no_end_date);
    if (!hasNoEndDate) {
      if (!data.end_date) {
        const error = new Error('Please specify an end date or select "Continuous / Without End Date".');
        error.statusCode = 400;
        throw error;
      }
      if (new Date(data.end_date) < new Date(data.start_date)) {
        const error = new Error('Campaign end date cannot be earlier than the start date.');
        error.statusCode = 400;
        throw error;
      }
    }

    const totalAmount = Number(data.total_amount) || 0;
    if (totalAmount < 0) {
      const error = new Error('Total amount must be a positive number.');
      error.statusCode = 400;
      throw error;
    }

    const validPlatforms = ['meta', 'google', 'both'];
    const platform = validPlatforms.includes(data.platform) ? data.platform : 'meta';

    // Verify client exists
    const client = await clientRepository.findById(data.client_id);
    if (!client) {
      const error = new Error('Selected client was not found.');
      error.statusCode = 404;
      throw error;
    }

    // Auto-detect Campaign Manager if not explicitly provided
    let assignedManagerId = data.assigned_manager_id || null;
    if (!assignedManagerId) {
      const [cmpMgrs] = await pool.query(
        'SELECT id FROM managers WHERE department_id = 4 AND status = "active" LIMIT 1'
      );
      if (cmpMgrs.length > 0) {
        assignedManagerId = cmpMgrs[0].id;
      }
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const insertData = {
        client_id: data.client_id,
        title: data.title.trim(),
        campaign_details: data.campaign_details || '',
        platform,
        has_no_end_date: hasNoEndDate,
        start_date: data.start_date,
        end_date: hasNoEndDate ? null : data.end_date,
        total_amount: totalAmount,
        creatives_text: data.creatives_text || '',
        creatives_url: data.creatives_url || null,
        creatives_status: 'pending_review',
        assigned_manager_id: assignedManagerId,
        status: 'pending_manager_review',
        created_by: adminUserId
      };

      const campaignId = await campaignRunRepository.create(insertData, connection);

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Create Campaign Run',
        `Campaign Run "${insertData.title}" created for client "${client.company_name}". Budget: ₹${totalAmount.toLocaleString('en-IN')}`,
        connection
      );

      // In-app notification for Campaign Managers
      await notificationRepository.createNotification(
        `New Campaign Run: "${insertData.title}" for ${client.company_name} requires manager review and setup.`,
        'campaign_run_created',
        connection
      );

      await connection.commit();
      return campaignId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async managerReview(managerUserId, campaignId, data) {
    const campaign = await campaignRunRepository.findById(campaignId);
    if (!campaign) {
      const error = new Error('Campaign Run not found.');
      error.statusCode = 404;
      throw error;
    }

    const validCreativesStatuses = ['pending_review', 'approved', 'changes_requested'];
    const creativesStatus = validCreativesStatuses.includes(data.creatives_status) ? data.creatives_status : 'approved';

    const validTypes = ['lead_form', 'whatsapp_number', 'awareness', 'call_ad', 'website_link'];
    if (!data.campaign_type || !validTypes.includes(data.campaign_type)) {
      const error = new Error('Valid Campaign Type is required (Lead Form, WhatsApp Number, Awareness, Call Ad, or Website Link).');
      error.statusCode = 400;
      throw error;
    }

    const dailyBudget = Number(data.daily_budget);
    if (isNaN(dailyBudget) || dailyBudget <= 0) {
      const error = new Error('Minimum daily budget must be a positive number greater than 0.');
      error.statusCode = 400;
      throw error;
    }

    // Determine status: if assigned to employee -> 'assigned', else 'manager_approved'
    let nextStatus = campaign.status;
    if (data.assigned_employee_id) {
      nextStatus = 'assigned';
    } else if (nextStatus === 'pending_manager_review') {
      nextStatus = 'assigned';
    }

    const updatePayload = {
      creatives_status: creativesStatus,
      creatives_notes: data.creatives_notes || null,
      daily_budget: dailyBudget,
      campaign_type: data.campaign_type,
      campaign_type_target: data.campaign_type_target || null,
      assigned_employee_id: data.assigned_employee_id ? Number(data.assigned_employee_id) : null,
      status: nextStatus
    };

    if (data.assigned_manager_id) {
      updatePayload.assigned_manager_id = Number(data.assigned_manager_id);
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await campaignRunRepository.update(campaignId, updatePayload, connection);

      await dashboardRepository.createActivityLog(
        managerUserId,
        'Manager Campaign Review',
        `Campaign Run #${campaignId} reviewed: Type: ${data.campaign_type}, Daily Budget: ₹${dailyBudget}, Creatives: ${creativesStatus}`,
        connection
      );

      if (data.assigned_employee_id) {
        await notificationRepository.createNotification(
          `Campaign Work Assigned: You have been assigned to run "${campaign.title}" (${data.campaign_type}).`,
          'campaign_assigned',
          connection
        );
      }

      await connection.commit();
      return await campaignRunRepository.findDetailedById(campaignId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async updateStatus(userId, campaignId, data) {
    const campaign = await campaignRunRepository.findById(campaignId);
    if (!campaign) {
      const error = new Error('Campaign Run not found.');
      error.statusCode = 404;
      throw error;
    }

    const validStatuses = ['pending_manager_review', 'assigned', 'running', 'paused', 'completed', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      const error = new Error(`Invalid status: ${data.status}`);
      error.statusCode = 400;
      throw error;
    }

    const updatePayload = {
      status: data.status
    };

    if (data.live_campaign_url !== undefined) {
      updatePayload.live_campaign_url = data.live_campaign_url;
    }
    if (data.employee_notes !== undefined) {
      updatePayload.employee_notes = data.employee_notes;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await campaignRunRepository.update(campaignId, updatePayload, connection);

      await dashboardRepository.createActivityLog(
        userId,
        'Update Campaign Run Status',
        `Campaign Run #${campaignId} status updated to "${data.status}".`,
        connection
      );

      if (data.status === 'running') {
        await notificationRepository.createNotification(
          `Campaign is LIVE: "${campaign.title}" is now actively running.`,
          'campaign_running',
          connection
        );
      } else if (data.status === 'completed') {
        await notificationRepository.createNotification(
          `Campaign Completed: "${campaign.title}" has been marked completed.`,
          'campaign_completed',
          connection
        );
      }

      await connection.commit();
      return await campaignRunRepository.findDetailedById(campaignId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async adminUpdate(adminUserId, campaignId, data) {
    const campaign = await campaignRunRepository.findById(campaignId);
    if (!campaign) {
      const error = new Error('Campaign Run not found.');
      error.statusCode = 404;
      throw error;
    }

    const updatePayload = {};
    if (data.client_id) updatePayload.client_id = data.client_id;
    if (data.title) updatePayload.title = data.title.trim();
    if (data.campaign_details !== undefined) updatePayload.campaign_details = data.campaign_details;
    if (data.platform) updatePayload.platform = data.platform;
    if (data.has_no_end_date !== undefined) {
      updatePayload.has_no_end_date = Boolean(data.has_no_end_date) ? 1 : 0;
      if (updatePayload.has_no_end_date) updatePayload.end_date = null;
    }
    if (data.start_date) updatePayload.start_date = data.start_date;
    if (data.end_date !== undefined && !updatePayload.has_no_end_date) {
      updatePayload.end_date = data.end_date || null;
    }
    if (data.total_amount !== undefined) updatePayload.total_amount = Number(data.total_amount) || 0;
    if (data.creatives_text !== undefined) updatePayload.creatives_text = data.creatives_text;
    if (data.creatives_url !== undefined) updatePayload.creatives_url = data.creatives_url;
    if (data.assigned_manager_id !== undefined) updatePayload.assigned_manager_id = data.assigned_manager_id;
    if (data.assigned_employee_id !== undefined) updatePayload.assigned_employee_id = data.assigned_employee_id;
    if (data.status) updatePayload.status = data.status;

    await campaignRunRepository.update(campaignId, updatePayload);
    return await campaignRunRepository.findDetailedById(campaignId);
  }

  async deleteCampaignRun(adminUserId, campaignId) {
    const campaign = await campaignRunRepository.findById(campaignId);
    if (!campaign) {
      const error = new Error('Campaign Run not found.');
      error.statusCode = 404;
      throw error;
    }
    await campaignRunRepository.softDelete(campaignId);
    return true;
  }

  async listCampaignRuns(user, filters = {}) {
    const scopedFilters = { ...filters };

    // Role-based scoping:
    // If regular employee, only show campaigns assigned to them
    if (user.role === 'employee' && user.employeeProfile?.employee_id) {
      scopedFilters.assignedEmployeeId = user.employeeProfile.employee_id;
    }

    const items = await campaignRunRepository.list(scopedFilters);
    const stats = await campaignRunRepository.getStats();

    return {
      items,
      stats
    };
  }

  async getCampaignRunById(id) {
    const item = await campaignRunRepository.findDetailedById(id);
    if (!item) {
      const error = new Error('Campaign Run not found.');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }
}

module.exports = new CampaignRunService();
