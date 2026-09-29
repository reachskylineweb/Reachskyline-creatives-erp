const deliverableRepository = require('../repositories/deliverableRepository');
const notificationRepository = require('../repositories/notificationRepository');
const { getTypeCode, generateNextActivityCode } = require('../utils/activityCodeHelper');
const clientRepository = require('../repositories/clientRepository');
const departmentRepository = require('../repositories/departmentRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const pool = require('../config/db');
const onesignalService = require('./onesignalService');
const notificationService = require('./notificationService');

class DeliverableService {
  // --- TEMPLATES ---
  async getTemplates(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const templates = await deliverableRepository.getTemplatesList({ limit, offset, searchQuery: filters.searchQuery || '' });
    const total = await deliverableRepository.getTemplatesCount({ searchQuery: filters.searchQuery || '' });

    return {
      templates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getTemplateById(id) {
    const template = await deliverableRepository.findTemplateById(id);
    if (!template) {
      const error = new Error('Template not found.');
      error.statusCode = 404;
      throw error;
    }
    const items = await deliverableRepository.getTemplateItems(id);
    return { ...template, items };
  }

  async createTemplate(templateData, items, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check unique name
      const existing = await deliverableRepository.findTemplateByName(templateData.name);
      if (existing) {
        const error = new Error(`Template name "${templateData.name}" already exists.`);
        error.statusCode = 400;
        throw error;
      }

      const templateId = await deliverableRepository.createTemplate({
        name: templateData.name,
        description: templateData.description,
        created_by: adminUserId
      }, connection);

      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          await deliverableRepository.createTemplateItem({
            template_id: templateId,
            department_id: item.department_id,
            deliverable: item.deliverable,
            quantity: item.quantity,
            priority: item.priority || 'medium'
          }, connection);
        }
      }

      await dashboardRepository.createActivityLog(adminUserId, 'Create Template', `Deliverable Template "${templateData.name}" created.`, connection);
      await connection.commit();
      return templateId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateTemplate(id, templateData, items, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const template = await deliverableRepository.findTemplateById(id);
      if (!template) {
        const error = new Error('Template not found.');
        error.statusCode = 404;
        throw error;
      }

      // Check unique name if name changed
      if (templateData.name !== template.name) {
        const existing = await deliverableRepository.findTemplateByName(templateData.name);
        if (existing) {
          const error = new Error(`Template name "${templateData.name}" already exists.`);
          error.statusCode = 400;
          throw error;
        }
      }

      await deliverableRepository.updateTemplate(id, templateData, connection);
      
      // Clear and rebuild items
      await deliverableRepository.clearTemplateItems(id, connection);
      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          await deliverableRepository.createTemplateItem({
            template_id: id,
            department_id: item.department_id,
            deliverable: item.deliverable,
            quantity: item.quantity,
            priority: item.priority || 'medium'
          }, connection);
        }
      }

      await dashboardRepository.createActivityLog(adminUserId, 'Update Template', `Deliverable Template "${templateData.name}" updated.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteTemplate(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const template = await deliverableRepository.findTemplateById(id);
      if (!template) {
        const error = new Error('Template not found.');
        error.statusCode = 404;
        throw error;
      }

      await deliverableRepository.deleteTemplate(id, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Template', `Deliverable Template "${template.name}" deleted.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- MONTHLY DELIVERABLES ---
  async getDeliverables(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const queryParams = {
      limit,
      offset,
      sortColumn: filters.sortColumn || 'id',
      sortOrder: filters.sortOrder || 'desc',
      searchQuery: filters.searchQuery || '',
      statusFilter: filters.statusFilter || '',
      priorityFilter: filters.priorityFilter || '',
      clientFilter: filters.clientFilter || '',
      departmentFilter: filters.departmentFilter || '',
      monthFilter: filters.monthFilter || '',
      dateFilter: filters.dateFilter || '',
      smmTodayFilter: filters.smmTodayFilter || '',
      managerFilter: filters.managerFilter || '',
      employeeFilter: filters.employeeFilter || ''
    };

    const deliverables = await deliverableRepository.getDeliverablesList(queryParams);
    const total = await deliverableRepository.getDeliverablesCount(queryParams);

    return {
      deliverables,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getDeliverableById(id) {
    const deliverable = await deliverableRepository.findDeliverableById(id);
    if (!deliverable) {
      const error = new Error('Deliverable not found.');
      error.statusCode = 404;
      throw error;
    }
    return deliverable;
  }

  async createDeliverable(data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const id = await deliverableRepository.createDeliverable({
        ...data,
        created_by: adminUserId
      }, connection);

      const client = await clientRepository.findById(data.client_id);
      await dashboardRepository.createActivityLog(adminUserId, 'Create Deliverable', `Deliverable "${data.deliverable}" created for Client "${client.company_name}".`, connection);
      await notificationRepository.createNotification(`Deliverables Assigned: "${data.deliverable}" assigned for client ${client.company_name}.`, 'deliverables_assigned', connection);

      await connection.commit();
      return id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateDeliverable(id, data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const deliverable = await deliverableRepository.findDeliverableById(id);
      if (!deliverable) {
        const error = new Error('Deliverable not found.');
        error.statusCode = 404;
        throw error;
      }

      await deliverableRepository.updateDeliverable(id, {
        ...data,
        updated_by: adminUserId
      }, connection);

      await dashboardRepository.createActivityLog(adminUserId, 'Update Deliverable', `Deliverable "${data.deliverable}" was updated.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteDeliverable(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const deliverable = await deliverableRepository.findDeliverableById(id);
      if (!deliverable) {
        const error = new Error('Deliverable not found.');
        error.statusCode = 404;
        throw error;
      }

      await deliverableRepository.softDeleteDeliverable(id, connection);
      if (deliverable.activity_code) {
        await connection.query("DELETE FROM notifications WHERE message LIKE ?", [`%${deliverable.activity_code}%`]);
      }
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Deliverable', `Deliverable "${deliverable.deliverable}" was soft-deleted.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async toggleDeliverableStatus(id, status, adminUserId, isJobWork = false) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (isJobWork) {
        let jobStatus = status;
        if (jobStatus === 'posted') jobStatus = 'completed';

        if (jobStatus === 'sent_to_client') {
          await connection.query('UPDATE job_works SET status = ?, sent_to_client_at = CURRENT_TIMESTAMP WHERE id = ?', [jobStatus, id]);
        } else if (jobStatus === 'completed') {
          await connection.query('UPDATE job_works SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?', [jobStatus, id]);
        } else {
          await connection.query('UPDATE job_works SET status = ? WHERE id = ?', [jobStatus, id]);
        }

        if (jobStatus === 'completed') {
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'smm_post',
            action: 'Published & Completed',
            description: 'Published and live on social accounts.',
            userId: adminUserId
          }, connection);
        }
        
        const [jwRow] = await connection.query(
          "SELECT client_id, activity_code, activity_type_code FROM job_works WHERE id = ?",
          [id]
        );
        if (jwRow.length > 0) {
          const client = await clientRepository.findById(jwRow[0].client_id);
          await dashboardRepository.createActivityLog(
            adminUserId, 
            'Toggle Job Work Status', 
            `Job Work "${jwRow[0].activity_code || jwRow[0].activity_type_code}" status set to ${jobStatus}.`, 
            connection
          );
        }
      } else {
        const deliverable = await deliverableRepository.findDeliverableById(id);
        if (!deliverable) {
          const error = new Error('Deliverable not found.');
          error.statusCode = 404;
          throw error;
        }

        await deliverableRepository.changeDeliverableStatus(id, status, connection);
        await dashboardRepository.createActivityLog(adminUserId, 'Toggle Deliverable Status', `Deliverable "${deliverable.deliverable}" status set to ${status}.`, connection);
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- AUTOMATED GENERATION FROM TEMPLATE ---
  async generateFromTemplate(templateId, clientId, month, adminUserId) {
    const client = await clientRepository.findById(clientId);
    if (!client) {
      const error = new Error('Client not found.');
      error.statusCode = 404;
      throw error;
    }
    if (client.status !== 'active') {
      const error = new Error('Client is inactive. Cannot generate deliverables.');
      error.statusCode = 400;
      throw error;
    }

    const template = await deliverableRepository.findTemplateById(templateId);
    if (!template) {
      const error = new Error('Template not found.');
      error.statusCode = 404;
      throw error;
    }

    const items = await deliverableRepository.getTemplateItems(templateId);
    if (items.length === 0) {
      const error = new Error('Template contains no deliverables.');
      error.statusCode = 400;
      throw error;
    }

    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthInt = parseInt(monthStr, 10);
    const lastDayDate = new Date(year, monthInt, 0);
    const dueDateStr = lastDayDate.toISOString().split('T')[0];

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const createdIds = [];

      for (const item of items) {
        const managerId = await deliverableRepository.findDefaultManagerForDept(item.department_id);
        const employeeId = await deliverableRepository.findDefaultEmployeeForDept(item.department_id);

        if (!managerId) {
          const dept = await departmentRepository.findById(item.department_id);
          const error = new Error(`Department "${dept ? dept.name : item.department_id}" does not have any active managers. Create a manager first.`);
          error.statusCode = 400;
          throw error;
        }

        if (!employeeId) {
          const dept = await departmentRepository.findById(item.department_id);
          const error = new Error(`Department "${dept ? dept.name : item.department_id}" does not have any active employees. Create an employee first.`);
          error.statusCode = 400;
          throw error;
        }

        const id = await deliverableRepository.createDeliverable({
          client_id: clientId,
          month,
          department_id: item.department_id,
          deliverable: item.deliverable,
          quantity: item.quantity,
          assigned_manager_id: managerId,
          assigned_employee_id: employeeId,
          priority: item.priority,
          due_date: dueDateStr,
          description: `Automatically generated from template "${template.name}".`,
          status: 'pending',
          remarks: '',
          created_by: adminUserId
        }, connection);

        createdIds.push(id);
      }

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Generate Deliverables',
        `Generated ${items.length} deliverables from template "${template.name}" for client "${client.company_name}" and month "${month}".`,
        connection
      );

      await notificationRepository.createNotification(
        `Deliverables Assigned: Automatically generated ${items.length} deliverables from template "${template.name}" for client ${client.company_name} (${month}).`,
        'deliverables_assigned',
        connection
      );

      await connection.commit();
      return createdIds;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Bulk Actions
  async bulkDeleteDeliverables(ids, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No deliverable IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [delRows] = await connection.query("SELECT activity_code FROM monthly_deliverables WHERE id IN (?) AND activity_code IS NOT NULL", [ids]);
      await deliverableRepository.bulkDeleteDeliverables(ids, connection);
      if (delRows.length > 0) {
        for (const d of delRows) {
          await connection.query("DELETE FROM notifications WHERE message LIKE ?", [`%${d.activity_code}%`]);
        }
      }
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Delete Deliverables', `Bulk deleted ${ids.length} deliverables.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async bulkUpdateDeliverablesStatus(ids, status, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No deliverable IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await deliverableRepository.bulkUpdateDeliverablesStatus(ids, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Update Deliverable Status', `Bulk updated status of ${ids.length} deliverables to "${status}".`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- MONTHLY GRID SERVICES ---
  async getMonthlyGrid(month) {
    const [clients] = await pool.query(
      "SELECT id, company_name FROM clients WHERE status = 'active' AND deleted_at IS NULL ORDER BY company_name ASC"
    );
    
    const savedRows = await deliverableRepository.getMonthlyGrid(month);
    const savedMap = new Map(savedRows.map(r => [r.client_id, r]));

    return clients.map(c => {
      const saved = savedMap.get(c.id) || {};
      return {
        client_id: c.id,
        client_name: c.company_name,
        posters: saved.posters || 0,
        reels: saved.reels || 0,
        yts: saved.yts || 0,
        yt: saved.yt || 0,
        posted_day: saved.posted_day || ''
      };
    });
  }

  async saveMonthlyGrid(month, gridData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const row of gridData) {
        await deliverableRepository.saveGridRow({
          client_id: Number(row.client_id),
          month,
          posters: Number(row.posters) || 0,
          reels: Number(row.reels) || 0,
          yts: Number(row.yts) || 0,
          yt: Number(row.yt) || 0,
          posted_day: row.posted_day || ''
        }, connection);
      }

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Save Monthly Grid',
        `Saved monthly deliverables grid counts for month "${month}".`,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- MONTHLY BLOGS GRID SERVICES ---
  async getMonthlyBlogsGrid(month) {
    const [clients] = await pool.query(
      "SELECT id, company_name FROM clients WHERE status = 'active' AND deleted_at IS NULL ORDER BY company_name ASC"
    );
    
    const savedRows = await deliverableRepository.getMonthlyBlogsGrid(month);
    const savedMap = new Map(savedRows.map(r => [r.client_id, r]));

    return clients.map(c => {
      const saved = savedMap.get(c.id) || {};
      return {
        client_id: c.id,
        client_name: c.company_name,
        blogs_count: saved.blogs_count || 0,
        gmb_count: saved.gmb_count || 0,
        backlink_count: saved.backlink_count || 0,
        posted_day: saved.posted_day || ''
      };
    });
  }

  async saveMonthlyBlogsGrid(month, gridData, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const row of gridData) {
        await deliverableRepository.saveBlogsGridRow({
          client_id: Number(row.client_id),
          month,
          blogs_count: Number(row.blogs_count) || 0,
          gmb_count: Number(row.gmb_count) || 0,
          backlink_count: Number(row.backlink_count) || 0,
          posted_day: row.posted_day || ''
        }, connection);
      }

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Save Monthly Blogs Grid',
        `Saved monthly SEO grid targets for month "${month}".`,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async generateBlogCalendarFromGrid(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [approvedBlogItems] = await connection.query(
        "SELECT id FROM blog_calendar WHERE month = ? AND status IN ('approved', 'sent_to_employees') LIMIT 1",
        [month]
      );
      if (approvedBlogItems.length > 0) {
        const error = new Error('blog calendar already done and approved');
        error.statusCode = 400;
        throw error;
      }

      const gridRows = await this.getMonthlyBlogsGrid(month);

      for (const row of gridRows) {
        await connection.query(
          'DELETE FROM blog_calendar WHERE client_id = ? AND month = ? AND status = "draft"',
          [row.client_id, month]
        );

        const [existingItems] = await connection.query(
          'SELECT type FROM blog_calendar WHERE client_id = ? AND month = ? AND status != "draft"',
          [row.client_id, month]
        );

        const existingCounts = { blog: 0, gmb: 0, backlink: 0 };
        for (const item of existingItems) {
          const type = item.type;
          if (existingCounts[type] !== undefined) {
            existingCounts[type]++;
          }
        }

        const blogsToGen = Math.max(0, (row.blogs_count || 0) - existingCounts.blog);
        const gmbToGen = Math.max(0, (row.gmb_count || 0) - existingCounts.gmb);
        const backlinkToGen = Math.max(0, (row.backlink_count || 0) - existingCounts.backlink);

        const totalItems = blogsToGen + gmbToGen + backlinkToGen;
        if (totalItems === 0) continue;

        const weekdays = [];
        const dayStr = (row.posted_day || '').toLowerCase().trim();
        if (dayStr && dayStr !== 'any_day') {
          const parts = dayStr.split(',').map(s => s.trim());
          for (const part of parts) {
            if (part === 'monday' || part === 'mon') weekdays.push(1);
            else if (part === 'tuesday' || part === 'tue') weekdays.push(2);
            else if (part === 'wednesday' || part === 'wed') weekdays.push(3);
            else if (part === 'thursday' || part === 'thu') weekdays.push(4);
            else if (part === 'friday' || part === 'fri') weekdays.push(5);
            else if (part === 'saturday' || part === 'sat') weekdays.push(6);
            else if (part === 'sunday' || part === 'sun') weekdays.push(0);
          }
        }
        if (weekdays.length === 0) {
          weekdays.push(1, 2, 3, 4, 5, 6);
        }

        const [yearVal, monthNumVal] = month.split('-').map(Number);
        const daysInMonth = new Date(yearVal, monthNumVal, 0).getDate();
        const dates = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const dateObj = new Date(yearVal, monthNumVal - 1, d, 12, 0, 0);
          if (weekdays.includes(dateObj.getDay())) {
            const mmStr = String(monthNumVal).padStart(2, '0');
            const ddStr = String(d).padStart(2, '0');
            dates.push(`${yearVal}-${mmStr}-${ddStr}`);
          }
        }
        if (dates.length === 0) {
          for (let d = 1; d <= daysInMonth; d++) {
            dates.push(`${yearVal}-${String(monthNumVal).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
          }
        }

        const D = dates.length;
        const blogDates = [];

        if (blogsToGen > 0) {
          const step = D / blogsToGen;
          for (let i = 0; i < blogsToGen; i++) {
            const date = dates[Math.floor(i * step) % D];
            blogDates.push(date);
            const blogNum = existingCounts.blog + i + 1;
            const title = `${row.client_name} - Blog #${blogNum}`;
            await connection.query(
              `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type)
               VALUES (?, ?, ?, ?, ?, 'draft', 'blog')`,
              [row.client_id, date, month, title, 'Automated blog entry.']
            );
          }
        }

        if (gmbToGen > 0) {
          if (blogDates.length > 0) {
            for (let i = 0; i < gmbToGen; i++) {
              const gmbNum = existingCounts.gmb + i + 1;
              const title = `${row.client_name} - GMB Post #${gmbNum}`;
              if (i < blogDates.length) {
                const date = blogDates[i];
                await connection.query(
                  `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type)
                   VALUES (?, ?, ?, ?, ?, 'draft', 'gmb')`,
                  [row.client_id, date, month, title, 'Automated GMB post entry.']
                );
              } else {
                const remainingDates = dates.filter(d => !blogDates.includes(d));
                const remD = remainingDates.length > 0 ? remainingDates : dates;
                const extraIndex = i - blogDates.length;
                const step = remD.length / Math.max(1, gmbToGen - blogDates.length);
                const date = remD[Math.floor(extraIndex * step) % remD.length];
                await connection.query(
                  `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type)
                   VALUES (?, ?, ?, ?, ?, 'draft', 'gmb')`,
                  [row.client_id, date, month, title, 'Automated GMB post entry.']
                );
              }
            }
          } else {
            const step = D / gmbToGen;
            for (let i = 0; i < gmbToGen; i++) {
              const date = dates[Math.floor(i * step) % D];
              const gmbNum = existingCounts.gmb + i + 1;
              const title = `${row.client_name} - GMB Post #${gmbNum}`;
              await connection.query(
                `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type)
                 VALUES (?, ?, ?, ?, ?, 'draft', 'gmb')`,
                [row.client_id, date, month, title, 'Automated GMB post entry.']
              );
            }
          }
        }

        if (backlinkToGen > 0) {
          const step = D / backlinkToGen;
          for (let i = 0; i < backlinkToGen; i++) {
            const date = dates[Math.floor(i * step) % D];
            const backlinkNum = existingCounts.backlink + i + 1;
            const title = `${row.client_name} - Backlink #${backlinkNum}`;
            await connection.query(
              `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type)
               VALUES (?, ?, ?, ?, ?, 'draft', 'backlink')`,
              [row.client_id, date, month, title, 'Automated Backlink submission entry.']
            );
          }
        }
      }

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Generate SEO Calendar',
        `Generated draft SEO calendar for month "${month}" from monthly SEO grid.`,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async generateContentCalendarFromGrid(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [approvedCcItems] = await connection.query(
        "SELECT id FROM content_calendar WHERE month = ? AND status IN ('approved', 'sent_to_employees') LIMIT 1",
        [month]
      );
      if (approvedCcItems.length > 0) {
        const error = new Error('content calender alerady done and approved');
        error.statusCode = 400;
        throw error;
      }

      const gridRows = await this.getMonthlyGrid(month);
      const [clientList] = await connection.query("SELECT id, client_id_code FROM clients WHERE deleted_at IS NULL AND status = 'active'");
      const clientCodes = {};
      for (const c of clientList) {
        clientCodes[c.id] = c.client_id_code ? c.client_id_code.replace(/\D/g, '').padStart(3, '0') : String(c.id).padStart(3, '0');
      }

      const [yearVal, monthNumVal] = month.split('-').map(Number);
      const daysInMonth = new Date(yearVal, monthNumVal, 0).getDate();
      const dailyLoad = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const mmStr = String(monthNumVal).padStart(2, '0');
        const ddStr = String(d).padStart(2, '0');
        dailyLoad[`${yearVal}-${mmStr}-${ddStr}`] = 0;
      }

      const [existingLoads] = await connection.query(
        "SELECT date, COUNT(*) as count FROM content_calendar WHERE month = ? AND status != 'draft' GROUP BY date",
        [month]
      );
      const formatDate = (d) => {
        if (!d) return '';
        if (typeof d === 'string') return d.substring(0, 10);
        try {
          const dateObj = new Date(d);
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        } catch {
          return '';
        }
      };
      for (const row of existingLoads) {
        const dateStr = formatDate(row.date);
        if (dailyLoad[dateStr] !== undefined) {
          dailyLoad[dateStr] = row.count;
        }
      }

      const clientTasks = [];

      for (const row of gridRows) {
        await connection.query(
          'DELETE FROM content_calendar WHERE client_id = ? AND month = ? AND status = "draft"',
          [row.client_id, month]
        );

        const [existingItems] = await connection.query(
          'SELECT activity_type_code, activity_code FROM content_calendar WHERE client_id = ? AND month = ? AND status != "draft"',
          [row.client_id, month]
        );

        const existingCounts = { AT001: 0, AT002: 0, AT004: 0, AT005: 0 };
        for (const item of existingItems) {
          const type = (item.activity_type_code || '').toUpperCase();
          if (existingCounts[type] !== undefined) {
            existingCounts[type]++;
          }
        }

        const postersToGen = Math.max(0, (row.posters || 0) - existingCounts.AT001);
        const reelsToGen = Math.max(0, (row.reels || 0) - existingCounts.AT002);
        const ytsToGen = Math.max(0, (row.yts || 0) - existingCounts.AT004);
        const ytToGen = Math.max(0, (row.yt || 0) - existingCounts.AT005);

        const totalItems = postersToGen + reelsToGen + ytsToGen + ytToGen;
        if (totalItems === 0) continue;

        const weekdays = [];
        const dayStr = (row.posted_day || '').toLowerCase().trim();
        if (dayStr && dayStr !== 'any_day') {
          const parts = dayStr.split(',').map(s => s.trim());
          for (const part of parts) {
            if (part === 'monday' || part === 'mon') weekdays.push(1);
            else if (part === 'tuesday' || part === 'tue') weekdays.push(2);
            else if (part === 'wednesday' || part === 'wed') weekdays.push(3);
            else if (part === 'thursday' || part === 'thu') weekdays.push(4);
            else if (part === 'friday' || part === 'fri') weekdays.push(5);
            else if (part === 'saturday' || part === 'sat') weekdays.push(6);
            else if (part === 'sunday' || part === 'sun') weekdays.push(0);
          }
        }
        if (weekdays.length === 0) {
          weekdays.push(1, 2, 3, 4, 5, 6);
        }

        const dates = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const dateObj = new Date(yearVal, monthNumVal - 1, d, 12, 0, 0);
          if (weekdays.includes(dateObj.getDay())) {
            const mmStr = String(monthNumVal).padStart(2, '0');
            const ddStr = String(d).padStart(2, '0');
            dates.push(`${yearVal}-${mmStr}-${ddStr}`);
          }
        }
        if (dates.length === 0) {
          for (let d = 1; d <= daysInMonth; d++) {
            dates.push(`${yearVal}-${String(monthNumVal).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
          }
        }

        const posterList = Array.from({ length: postersToGen }, () => ({ type: 'AT001', name: 'Poster' }));
        const reelList = Array.from({ length: reelsToGen }, () => ({ type: 'AT002', name: 'Reel' }));
        const ytsList = Array.from({ length: ytsToGen }, () => ({ type: 'AT004', name: 'Shorts and Blogs' }));
        const ytList = Array.from({ length: ytToGen }, () => ({ type: 'AT005', name: 'YouTube Long Video' }));

        const queues = [
          { type: 'AT001', list: posterList },
          { type: 'AT002', list: reelList },
          { type: 'AT004', list: ytsList },
          { type: 'AT005', list: ytList }
        ].filter(q => q.list.length > 0);

        const itemsToSchedule = [];
        let lastType = null;
        while (true) {
          const activeQueues = queues.filter(q => q.list.length > 0);
          if (activeQueues.length === 0) break;
          
          activeQueues.sort((a, b) => {
            const aDiff = a.type !== lastType ? 1 : 0;
            const bDiff = b.type !== lastType ? 1 : 0;
            if (aDiff !== bDiff) {
              return bDiff - aDiff;
            }
            return b.list.length - a.list.length;
          });
          
          const chosenQueue = activeQueues[0];
          const item = chosenQueue.list.shift();
          itemsToSchedule.push(item);
          lastType = chosenQueue.type;
        }

        clientTasks.push({
          row,
          dates,
          items: itemsToSchedule,
          existingCounts
        });
      }

      clientTasks.sort((a, b) => a.dates.length - b.dates.length);

      const [year, monthNum] = month.split('-');
      const yearDigit = year.slice(-1);
      const monthDigit = monthNum;

      for (const ct of clientTasks) {
        const clientCodeNum = clientCodes[ct.row.client_id] || String(ct.row.client_id).padStart(3, '0');
        const K = ct.items.length;
        const D = ct.dates.length;
        
        const counters = {
          AT001: ct.existingCounts.AT001,
          AT002: ct.existingCounts.AT002,
          AT004: ct.existingCounts.AT004,
          AT005: ct.existingCounts.AT005
        };

        for (let i = 0; i < K; i++) {
          const item = ct.items[i];
          const segmentSize = D / K;
          const startIdx = Math.floor(i * segmentSize);
          const endIdx = Math.min(D, Math.floor((i + 1) * segmentSize));
          
          const candidates = ct.dates.slice(startIdx, endIdx);
          const searchSpace = candidates.length > 0 ? candidates : ct.dates;
          
          let chosenDate = searchSpace[0];
          let minLoad = dailyLoad[chosenDate] !== undefined ? dailyLoad[chosenDate] : 9999;
          
          for (let j = 1; j < searchSpace.length; j++) {
            const dateCandidate = searchSpace[j];
            const loadVal = dailyLoad[dateCandidate] !== undefined ? dailyLoad[dateCandidate] : 0;
            if (loadVal < minLoad) {
              minLoad = loadVal;
              chosenDate = dateCandidate;
            }
          }

          if (dailyLoad[chosenDate] !== undefined) {
            dailyLoad[chosenDate]++;
          }

          counters[item.type]++;
          const itemNum = counters[item.type];
          const typeCode = getTypeCode(item.type);
          const activityCode = `${yearDigit}${monthDigit}${clientCodeNum}${typeCode}${itemNum}`;
          const title = `${ct.row.company_name || ct.row.client_name} - ${item.name} #${itemNum}`;

          await connection.query(
            `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
            [ct.row.client_id, item.type, activityCode, chosenDate, month, title, 'Automated monthly deliverable calendar entry.']
          );
        }
      }

      await dashboardRepository.createActivityLog(
        adminUserId,
        'Generate Calendar',
        `Generated draft content calendar for month "${month}" from monthly deliverables grid.`,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- JOB WORK SERVICES ---
  async getJobWorks() {
    return await deliverableRepository.getJobWorks();
  }

  async getJobWorksByManager(managerId) {
    return await deliverableRepository.getJobWorksByManager(managerId);
  }

  async createJobWork(data, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let managerId = null;
      const [depts] = await connection.query(
        "SELECT id FROM departments WHERE code = 'CD-RS'"
      );

      if (depts.length > 0) {
        const deptIds = depts.map(d => d.id);
        const [mgrs] = await connection.query(
          "SELECT id FROM managers WHERE department_id IN (?) AND status = 'active' ORDER BY id ASC LIMIT 1",
          [deptIds]
        );
        if (mgrs.length > 0) {
          managerId = mgrs[0].id;
        }
      }

      if (!managerId) {
        const [allMgrs] = await connection.query(
          "SELECT id FROM managers WHERE status = 'active' ORDER BY id ASC LIMIT 1"
        );
        if (allMgrs.length > 0) {
          managerId = allMgrs[0].id;
        }
      }

      if (!managerId) {
        const error = new Error('No active creative managers found in the system to assign work to.');
        error.statusCode = 400;
        throw error;
      }

      const deadlineDate = new Date(data.deadline);
      const month = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth() + 1).padStart(2, '0')}`;
      
      const qtyCount = Math.max(1, Number(data.quantity) || 1);
      let firstJobWorkId = null;

      for (let i = 0; i < qtyCount; i++) {
        const activityCode = await generateNextActivityCode(connection, data.client_id, month, 'JD');
        const insertedId = await deliverableRepository.createJobWork({
          client_id: Number(data.client_id),
          activity_type_code: data.activity_type_code,
          activity_code: activityCode,
          quantity: 1,
          deadline: data.deadline,
          assigned_manager_id: managerId
        }, connection);

        await deliverableRepository.logJobWorkHistory({
          jobWorkId: insertedId,
          stage: 'admin_assign',
          action: 'Job Work Assigned by Admin',
          description: `Job Work created by Admin and assigned to Creative Manager.`,
          userId: adminUserId
        }, connection);

        if (i === 0) {
          firstJobWorkId = insertedId;
        }
      }

      const client = await clientRepository.findById(data.client_id);
      await dashboardRepository.createActivityLog(
        adminUserId,
        'Create Job Work',
        `Created ${qtyCount} Job Works (split individually) for client "${client.company_name}" assigned to Creative Manager.`,
        connection
      );

      await connection.commit();

      if (managerId) {
        await notificationService.notifyManager(
          managerId,
          'New Job Work Assigned',
          `New Job Work Assigned: Client ${client.company_name} - ${data.activity_type_code} (Quantity: ${qtyCount}) assigned to you.`,
          'deliverables_assigned',
          '/manager/job-works',
          true
        );
      }

      return firstJobWorkId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async completeJobWork(id, managerUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [mgrs] = await connection.query(
        "SELECT id FROM managers WHERE user_id = ?",
        [managerUserId]
      );
      if (mgrs.length === 0) {
        const error = new Error('Authorized manager profile not found.');
        error.statusCode = 403;
        throw error;
      }
      const managerId = mgrs[0].id;

      const [jw] = await connection.query(
        "SELECT * FROM job_works WHERE id = ?",
        [id]
      );
      if (jw.length === 0) {
        const error = new Error('Job Work not found.');
        error.statusCode = 404;
        throw error;
      }
      if (jw[0].assigned_manager_id !== managerId) {
        const error = new Error('You are not authorized to complete this Job Work.');
        error.statusCode = 403;
        throw error;
      }

      const [mgrDept] = await connection.query(
        "SELECT m.department_id, d.code FROM managers m JOIN departments d ON m.department_id = d.id WHERE m.id = ?",
        [managerId]
      );
      const isCreativesManager = mgrDept.length > 0 && (
        Number(mgrDept[0].department_id) === 1 || 
        ['CD-RS', 'CR-RS', 'Creatives', 'CREATIVES'].includes(mgrDept[0].code)
      );

      if (isCreativesManager) {
        const [smmMgrs] = await connection.query(
          "SELECT m.id FROM managers m JOIN departments d ON m.department_id = d.id WHERE (d.code = 'SMM-RS' OR m.department_id = 2 OR d.name LIKE '%Social%') AND m.status = 'active' ORDER BY m.id ASC LIMIT 1"
        );
        if (smmMgrs.length > 0) {
          const smmManagerId = smmMgrs[0].id;
          await connection.query(
            "UPDATE job_works SET assigned_manager_id = ?, status = 'approved', smm_employee_id = NULL WHERE id = ?",
            [smmManagerId, id]
          );
          await dashboardRepository.createActivityLog(
            managerUserId,
            'Complete Job Work (Routed to SMM)',
            `Job Work #${id} completed by Creatives and routed to Social Media Manager.`,
            connection
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_route_smm',
            action: 'Approved & Routed to SMM',
            description: 'Approved by Creative Manager and routed to SMM Manager.',
            userId: managerUserId
          }, connection);
        } else {
          await deliverableRepository.updateJobWorkStatus(id, 'completed', connection);
          await dashboardRepository.createActivityLog(
            managerUserId,
            'Complete Job Work',
            `Job Work #${id} marked as completed.`,
            connection
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'smm_post',
            action: 'Published & Completed',
            description: 'Published and live on social accounts (fallback completed).',
            userId: managerUserId
          }, connection);
        }
      } else {
        await deliverableRepository.updateJobWorkStatus(id, 'completed', connection);
        await dashboardRepository.createActivityLog(
          managerUserId,
          'Complete Job Work',
          `Job Work #${id} marked as completed.`,
          connection
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'smm_post',
          action: 'Published & Completed',
          description: 'Published and live on social accounts.',
          userId: managerUserId
        }, connection);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getEmployeeTodayDeliverables(userId) {
    const [emp] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const employeeId = emp[0].id;
    const [rows] = await pool.query(`
      SELECT d.*, c.company_name AS client_name, dept.name AS department_name
      FROM monthly_deliverables d
      JOIN clients c ON d.client_id = c.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.assigned_employee_id = ? 
        AND d.status IN ('assigned', 'reassigned')
        AND d.due_date = CURDATE()
    `, [employeeId]);
    return rows;
  }

  async getEmployeeReworkQueue(userId) {
    const [emp] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const employeeId = emp[0].id;
    const [rows] = await pool.query(`
      SELECT d.*, c.company_name AS client_name, dept.name AS department_name
      FROM monthly_deliverables d
      JOIN clients c ON d.client_id = c.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.assigned_employee_id = ? 
        AND d.status = 'reassigned'
    `, [employeeId]);
    return rows;
  }

  async getEmployeeAllDeliverables(userId) {
    const [emp] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const employeeId = emp[0].id;
    const [rows] = await pool.query(`
      SELECT d.*, c.company_name AS client_name, dept.name AS department_name
      FROM monthly_deliverables d
      JOIN clients c ON d.client_id = c.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.assigned_employee_id = ? 
        AND d.status != 'pending'
        AND d.deleted_at IS NULL
      ORDER BY d.due_date ASC
    `, [employeeId]);
    return rows;
  }

  async assignDeliverableWork(id, employeeId, managerUserId, isJobWork = false) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [empRows] = await connection.query(
        "SELECT e.department_id, d.code AS department_code FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.id = ?",
        [employeeId]
      );
      
      if (empRows.length === 0) throw new Error('Employee not found.');
      const isSMM = empRows[0].department_code === 'SMM-RS';

      const table = isJobWork ? 'job_works' : 'monthly_deliverables';
      const [currRows] = await connection.query(
        `SELECT started_at, writer_started_at, status, assigned_employee_id, smm_employee_id, google_drive_link, content_writer_id, content_link FROM ${table} WHERE id = ?`,
        [id]
      );
      if (currRows.length > 0) {
        const curr = currRows[0];

        if (!isSMM) {
          if (curr.content_writer_id && !curr.content_link) {
            throw new Error('Cannot assign designer before the content script is uploaded.');
          }
        }

        if (isSMM) {
          if (curr.smm_employee_id && Number(curr.smm_employee_id) !== Number(employeeId)) {
            const smmStarted = !!curr.started_at || ['posted', 'completed'].includes(curr.status);
            if (smmStarted) {
              throw new Error('Work has already started. You cannot reassign this task to another SMM staff.');
            }
          }
        } else {
          const isDesignerAssigned = curr.assigned_employee_id && Number(curr.assigned_employee_id) !== Number(curr.content_writer_id);
          if (isDesignerAssigned && Number(curr.assigned_employee_id) !== Number(employeeId)) {
            const designerStarted = !!curr.started_at || 
                                   !!curr.google_drive_link || 
                                   ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(curr.status);
            if (designerStarted) {
              throw new Error('Work has already started. You cannot reassign this task to another designer.');
            }
          }
        }
      }

      const [empDetailRows] = await connection.query("SELECT full_name FROM employees WHERE id = ?", [employeeId]);
      const empName = empDetailRows.length > 0 ? empDetailRows[0].full_name : 'Employee';

      if (isJobWork) {
        if (isSMM) {
          await connection.query(
            "UPDATE job_works SET smm_employee_id = ?, status = 'assigned' WHERE id = ?",
            [employeeId, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'smm_assign_staff',
            action: 'Assigned SMM Employee',
            description: `Assigned SMM staff: ${empName}.`,
            userId: managerUserId,
            isJobWork: 1
          }, connection);
        } else {
          await connection.query(
            "UPDATE job_works SET assigned_employee_id = ?, status = 'assigned' WHERE id = ?",
            [employeeId, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_assign_designer',
            action: 'Assigned Designer/Editor',
            description: `Assigned designer/editor: ${empName}.`,
            userId: managerUserId,
            isJobWork: 1
          }, connection);
        }
      } else {
        if (isSMM) {
          await connection.query(
            "UPDATE monthly_deliverables SET smm_employee_id = ?, status = 'assigned' WHERE id = ?",
            [employeeId, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_route_smm',
            action: 'Approved & Routed to SMM',
            description: `Assigned SMM staff: ${empName}.`,
            userId: managerUserId,
            isJobWork: 0
          }, connection);
        } else {
          await connection.query(
            "UPDATE monthly_deliverables SET assigned_employee_id = ?, status = 'assigned' WHERE id = ?",
            [employeeId, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_assign_designer',
            action: 'Assigned Designer/Editor',
            description: `Assigned designer/editor: ${empName}.`,
            userId: managerUserId,
            isJobWork: 0
          }, connection);
        }
      }
      
      await connection.commit();

      try {
        const typeLabel = isJobWork ? 'Job Work' : 'Monthly Deliverable';
        const [taskRows] = await pool.query(
          `SELECT deliverable FROM ${isJobWork ? 'job_works' : 'monthly_deliverables'} WHERE id = ?`,
          [id]
        );
        const taskName = taskRows.length > 0 ? taskRows[0].deliverable : 'New Task';
        
        await notificationService.notifyEmployee(
          employeeId,
          'New Task Assigned',
          `You have been assigned a new ${typeLabel}: "${taskName}". Please check your board and start work.`,
          'deliverables_assigned',
          isSMM ? '/employee/today-posting' : '/employee/assigned-work',
          true
        );
      } catch (err) {
        console.error('[OneSignal] Error notifying employee on assignment:', err.message);
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async startDeliverableWork(id, employeeUserId) {
    const [emp] = await pool.query(`
      SELECT e.id, e.sub_department_id, sd.code AS sub_department_code, sd.name AS sub_department_name
      FROM employees e
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.user_id = ?
    `, [employeeUserId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const isWriter = emp[0].sub_department_code === 'CW-RS' || Number(emp[0].sub_department_id) === 1 || Number(emp[0].sub_department_id) === 3 || (emp[0].sub_department_name || '').toLowerCase().includes('content');

    const [check] = await pool.query(
      'SELECT id FROM monthly_deliverables WHERE id = ?',
      [id]
    );
    if (check.length === 0) {
      throw new Error('Deliverable not found.');
    }

    const query = isWriter
      ? "UPDATE monthly_deliverables SET writer_started_at = CURRENT_TIMESTAMP WHERE id = ?"
      : "UPDATE monthly_deliverables SET started_at = CURRENT_TIMESTAMP WHERE id = ?";

    await pool.query(query, [id]);
  }

  async submitDeliverableWork(id, googleDriveLink, employeeUserId) {
    const [emp] = await pool.query(`
      SELECT e.id, e.sub_department_id, sd.code AS sub_department_code, sd.name AS sub_department_name
      FROM employees e
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.user_id = ?
    `, [employeeUserId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const isWriter = emp[0].sub_department_code === 'CW-RS' || Number(emp[0].sub_department_id) === 1 || Number(emp[0].sub_department_id) === 3 || (emp[0].sub_department_name || '').toLowerCase().includes('content');

    const [delivs] = await pool.query(
      'SELECT started_at, completed_time_spent, writer_started_at, writer_completed_time_spent, assigned_manager_id, deliverable, updated_at, created_at FROM monthly_deliverables WHERE id = ?',
      [id]
    );
    if (delivs.length === 0) {
      throw new Error('Deliverable not found.');
    }
    const deliv = delivs[0];

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const nowMs = Date.now();
      const defaultEstSecs = (isWriter ? 15 : 25) * 60;
      const maxCapSecs = Math.round(defaultEstSecs * 1.5);

      if (isWriter) {
        let elapsed = 15 * 60;
        if (deliv.writer_started_at) {
          const startMs = new Date(deliv.writer_started_at).getTime();
          elapsed = Math.max(1, Math.round((nowMs - startMs) / 1000));
        }

        const newTotal = (deliv.writer_completed_time_spent || 0) + elapsed;
        await connection.query(
          "UPDATE monthly_deliverables SET content_link = ?, writer_started_at = NULL, writer_completed_time_spent = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
          [googleDriveLink, newTotal, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'writer_submit_script',
          action: 'Submitted Script Doc',
          description: `Content script doc uploaded. Link: ${googleDriveLink}`,
          userId: employeeUserId,
          isJobWork: 0
        }, connection);
      } else {
        let elapsed = 25 * 60;
        if (deliv.started_at) {
          const startMs = new Date(deliv.started_at).getTime();
          elapsed = Math.max(1, Math.round((nowMs - startMs) / 1000));
        }

        const newTotal = (deliv.completed_time_spent || 0) + elapsed;
        await connection.query(
          "UPDATE monthly_deliverables SET google_drive_link = ?, started_at = NULL, completed_time_spent = ?, status = 'submitted', submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
          [googleDriveLink, newTotal, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'designer_submit_design',
          action: 'Submitted Design Draft',
          description: `Design draft uploaded by Designer. Link: ${googleDriveLink}`,
          userId: employeeUserId,
          isJobWork: 0
        }, connection);
      }
      await connection.commit();

      if (deliv.assigned_manager_id) {
        const roleLabel = isWriter ? 'Script' : 'Design';
        await notificationService.notifyManager(
          deliv.assigned_manager_id,
          `${roleLabel} Submitted`,
          `Deliverable "${deliv.deliverable}" ${roleLabel.toLowerCase()} has been submitted by the employee for your review.`,
          'work_submitted',
          '/manager/submissions-review',
          true
        );
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async reviewDeliverableWork(id, { action, feedbackText, voiceBase64 }, managerUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [delivRows] = await connection.query(
        'SELECT deliverable, client_id, assigned_employee_id, content_writer_id FROM monthly_deliverables WHERE id = ?',
        [id]
      );
      if (delivRows.length === 0) throw new Error('Deliverable not found.');
      const deliv = delivRows[0];

      if (action === 'reassign') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'reassigned', manager_feedback_text = ?, manager_voice_base64 = ?, rework_count = rework_count + 1 WHERE id = ?",
          [feedbackText || null, voiceBase64 || null, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_rework_design',
          action: 'Manager Requested Design Rework',
          description: `Design rejected by Manager. Reason: ${feedbackText || 'Revision requested.'}`,
          userId: managerUserId,
          isJobWork: 0
        }, connection);

        await connection.commit();

        const empId = deliv.assigned_employee_id || deliv.content_writer_id;
        if (empId) {
          await notificationService.notifyEmployee(
            empId,
            'Rework Requested',
            `Rework has been requested for deliverable: "${deliv.deliverable}". Feedback: "${feedbackText || 'Please review.'}"`,
            'rework_requested',
            '/employee/reassigned-work',
            true
          );
        }
      } else if (action === 'send_to_client') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'sent_to_client', sent_to_client_at = CURRENT_TIMESTAMP WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_send_client',
          action: 'Sent Design to Client',
          description: 'Design approved by Manager and sent to Client for review.',
          userId: managerUserId,
          isJobWork: 0
        }, connection);

        await connection.commit();

        await notificationService.notifyClient(
          deliv.client_id,
          'Creative Approval Pending',
          `A new creative draft for "${deliv.deliverable}" has been submitted for your review. Please review it on the Portal.`,
          'client_approval_pending',
          '/client/approvals',
          true
        );
      } else if (action === 'approved' || action === 'approve') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'approved' WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_route_smm',
          action: 'Approved & Routed to SMM',
          description: 'Approved by Creative Manager and routed to SMM Manager.',
          userId: managerUserId,
          isJobWork: 0
        }, connection);

        await connection.commit();

        const empId = deliv.assigned_employee_id || deliv.content_writer_id;
        if (empId) {
          await notificationService.notifyEmployee(
            empId,
            'Work Approved',
            `Your work for deliverable "${deliv.deliverable}" has been approved by the manager.`,
            'work_approved',
            '/employee/approved-work',
            true
          );
        }
      } else {
        throw new Error('Invalid action.');
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async clientReviewDeliverableWork(id, { action, feedbackText }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [delivRows] = await connection.query(
        'SELECT deliverable, assigned_manager_id FROM monthly_deliverables WHERE id = ?',
        [id]
      );
      const deliv = delivRows.length > 0 ? delivRows[0] : null;

      if (action === 'approve') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'client_approved' WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'client_approve',
          action: 'Client Approved Design',
          description: 'Design draft approved by Client. Ready for final processing.',
          userId: null,
          isJobWork: 0
        }, connection);
        await connection.commit();

        if (deliv && deliv.assigned_manager_id) {
          await notificationService.notifyManager(
            deliv.assigned_manager_id,
            'Client Approved Work',
            `Client approved creative for deliverable "${deliv.deliverable}".`,
            'client_feedback',
            '/manager/client-reworks',
            true
          );
        }
      } else if (action === 'rework') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'client_rework', client_feedback_text = ?, rework_count = rework_count + 1 WHERE id = ?",
          [feedbackText || null, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'client_rework',
          action: 'Client Requested Rework',
          description: `Design rejected by Client. Feedback: "${feedbackText || 'Revision requested.'}"`,
          userId: null,
          isJobWork: 0
        }, connection);
        await connection.commit();

        if (deliv && deliv.assigned_manager_id) {
          await notificationService.notifyManager(
            deliv.assigned_manager_id,
            'Client Requested Rework',
            `Client requested rework for deliverable "${deliv.deliverable}": ${feedbackText || 'Please review.'}`,
            'client_feedback',
            '/manager/client-reworks',
            true
          );
        }
      } else {
        throw new Error('Invalid action.');
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async managerClientReviewDeliverableWork(id, { action, feedbackText = null, voiceBase64 = null, employeeId = null }, managerUserId = null) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      if (action === 'reassign') {
        await connection.query(
          "UPDATE monthly_deliverables SET assigned_employee_id = COALESCE(?, assigned_employee_id), status = 'reassigned', manager_feedback_text = ?, manager_voice_base64 = ?, rework_count = rework_count + 1 WHERE id = ?",
          [employeeId || null, feedbackText || null, voiceBase64 || null, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_rework_design',
          action: 'Manager Requested Design Rework',
          description: `Design rejected by Manager. Reason: ${feedbackText || 'Revision requested.'}`,
          userId: managerUserId,
          isJobWork: 0
        }, connection);
      } else if (action === 'approved') {
        await connection.query(
          "UPDATE monthly_deliverables SET status = 'approved' WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_route_smm',
          action: 'Approved & Routed to SMM',
          description: 'Approved by Creative Manager and routed to SMM Manager.',
          userId: managerUserId,
          isJobWork: 0
        }, connection);
      } else {
        throw new Error('Invalid action.');
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async assignJobWork(id, employeeId, feedbackText = null, voiceBase64 = null, managerUserId = null) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [empRows] = await connection.query(
        "SELECT e.full_name, e.department_id, e.sub_department_id, d.code AS department_code, sd.code AS sub_department_code, sd.name AS sub_department_name FROM employees e JOIN departments d ON e.department_id = d.id LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE e.id = ?",
        [employeeId]
      );
      const emp = empRows[0];
      if (!emp) throw new Error('Employee not found.');
      const empName = emp.full_name;
      const isSMM = emp.department_code === 'SMM-RS';
      const isWriter = emp.sub_department_code === 'CW-RS' || Number(emp.sub_department_id) === 1 || Number(emp.sub_department_id) === 3 || (emp.sub_department_name || '').toLowerCase().includes('content');

      const [currRows] = await connection.query(
        "SELECT started_at, writer_started_at, status, assigned_employee_id, content_writer_id, smm_employee_id, google_drive_link, content_link FROM job_works WHERE id = ?",
        [id]
      );
      if (currRows.length > 0) {
        const curr = currRows[0];

        if (!isSMM && !isWriter) {
          if (curr.content_writer_id && !curr.content_link) {
            throw new Error('Cannot assign designer before the content script is uploaded.');
          }
        }

        if (isSMM) {
          if (curr.smm_employee_id && Number(curr.smm_employee_id) !== Number(employeeId)) {
            const smmStarted = !!curr.started_at || ['posted', 'completed'].includes(curr.status);
            if (smmStarted) {
              throw new Error('Work has already started. You cannot reassign this task to another SMM staff.');
            }
          }
        } else if (isWriter) {
          if (curr.content_writer_id && Number(curr.content_writer_id) !== Number(employeeId)) {
            const writerStarted = !!curr.writer_started_at || 
                                  !!curr.content_link || 
                                  ['submitted', 'approved', 'completed', 'posted'].includes(curr.status);
            if (writerStarted) {
              throw new Error('Work has already started. You cannot reassign this task to another content writer.');
            }
          }
        } else {
          const isDesignerAssigned = curr.assigned_employee_id && Number(curr.assigned_employee_id) !== Number(curr.content_writer_id);
          if (isDesignerAssigned && Number(curr.assigned_employee_id) !== Number(employeeId)) {
            const designerStarted = !!curr.started_at || 
                                   !!curr.google_drive_link || 
                                   ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(curr.status);
            if (designerStarted) {
              throw new Error('Work has already started. You cannot reassign this task to another designer.');
            }
          }
        }
      }

      if (isSMM) {
        await connection.query(
          "UPDATE job_works SET smm_employee_id = ?, manager_feedback_text = ?, manager_voice_base64 = ?, status = 'assigned_employee' WHERE id = ?",
          [employeeId, feedbackText, voiceBase64, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'smm_assign_staff',
          action: 'Assigned SMM Employee',
          description: `Assigned to SMM staff: ${empName}.`,
          userId: managerUserId
        }, connection);
      } else {
        if (isWriter) {
          await connection.query(
            "UPDATE job_works SET assigned_employee_id = ?, content_writer_id = ?, manager_feedback_text = ?, manager_voice_base64 = ?, status = 'assigned_employee' WHERE id = ?",
            [employeeId, employeeId, feedbackText, voiceBase64, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_assign_writer',
            action: 'Assigned Content Creator',
            description: `Assigned to content writer: ${empName}.`,
            userId: managerUserId
          }, connection);
        } else {
          await connection.query(
            "UPDATE job_works SET assigned_employee_id = ?, manager_feedback_text = ?, manager_voice_base64 = ?, status = 'assigned_employee' WHERE id = ?",
            [employeeId, feedbackText, voiceBase64, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_assign_designer',
            action: 'Assigned Designer/Editor',
            description: `Assigned to designer/editor: ${empName}.`,
            userId: managerUserId
          }, connection);
        }
      }
      await connection.commit();

      try {
        const [taskRows] = await pool.query(
          `SELECT activity_code FROM job_works WHERE id = ?`,
          [id]
        );
        const taskName = taskRows.length > 0 ? taskRows[0].activity_code : 'Job Work';
        
        await notificationService.notifyEmployee(
          employeeId,
          'Job Work Assigned',
          `You have been assigned a new Job Work task: "${taskName}". Please check your board and start work.`,
          'deliverables_assigned',
          isSMM ? '/employee/today-posting' : '/employee/assigned-work',
          true
        );
      } catch (err) {
        console.error('[OneSignal] Error notifying employee on Job Work assignment:', err.message);
      }

      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async startJobWork(id, employeeUserId) {
    const [emp] = await pool.query(`
      SELECT e.id, e.sub_department_id, sd.code AS sub_department_code, sd.name AS sub_department_name
      FROM employees e
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.user_id = ?
    `, [employeeUserId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const isWriter = emp[0].sub_department_code === 'CW-RS' || Number(emp[0].sub_department_id) === 1 || Number(emp[0].sub_department_id) === 3 || (emp[0].sub_department_name || '').toLowerCase().includes('content');

    const [check] = await pool.query(
      'SELECT id FROM job_works WHERE id = ?',
      [id]
    );
    if (check.length === 0) {
      throw new Error('Job Work not found.');
    }

    const query = isWriter
      ? "UPDATE job_works SET writer_started_at = CURRENT_TIMESTAMP WHERE id = ?"
      : "UPDATE job_works SET started_at = CURRENT_TIMESTAMP WHERE id = ?";

    await pool.query(query, [id]);
  }

  async submitJobWork(id, googleDriveLink, employeeUserId = null) {
    const [emp] = await pool.query(`
      SELECT e.id, e.sub_department_id, sd.code AS sub_department_code, sd.name AS sub_department_name
      FROM employees e
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
      WHERE e.user_id = ?
    `, [employeeUserId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const isWriter = emp[0].sub_department_code === 'CW-RS' || Number(emp[0].sub_department_id) === 1 || Number(emp[0].sub_department_id) === 3 || (emp[0].sub_department_name || '').toLowerCase().includes('content');

    const [jws] = await pool.query(
      'SELECT started_at, completed_time_spent, writer_started_at, writer_completed_time_spent, smm_employee_id, assigned_manager_id, activity_code FROM job_works WHERE id = ?',
      [id]
    );
    if (jws.length === 0) throw new Error('Job Work not found.');
    const jw = jws[0];

    const isSMMJob = jw.smm_employee_id !== null;
    const status = isSMMJob ? 'completed' : 'submitted';

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      if (isSMMJob) {
        await connection.query(
          "UPDATE job_works SET google_drive_link = ?, status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
          [googleDriveLink, status, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'smm_post',
          action: 'Published & Completed',
          description: `Published and live on social accounts. Link: ${googleDriveLink}`,
          userId: employeeUserId
        }, connection);
      } else {
        if (isWriter) {
          let elapsed = 0;
          if (jw.writer_started_at) {
            elapsed = Math.round((new Date() - new Date(jw.writer_started_at)) / 1000);
          }
          const newTotal = (jw.writer_completed_time_spent || 0) + elapsed;
          await connection.query(
            "UPDATE job_works SET content_link = ?, status = ?, writer_started_at = NULL, writer_completed_time_spent = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
            [googleDriveLink, status, newTotal, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'writer_submit_script',
            action: 'Submitted Script Doc',
            description: `Content script doc uploaded. Link: ${googleDriveLink}`,
            userId: employeeUserId
          }, connection);
        } else {
          let elapsed = 0;
          if (jw.started_at) {
            elapsed = Math.round((new Date() - new Date(jw.started_at)) / 1000);
          }
          const newTotal = (jw.completed_time_spent || 0) + elapsed;
          await connection.query(
            "UPDATE job_works SET google_drive_link = ?, status = ?, started_at = NULL, completed_time_spent = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
            [googleDriveLink, status, newTotal, id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'designer_submit_design',
            action: 'Submitted Design Draft',
            description: `Design draft uploaded by Designer. Link: ${googleDriveLink}`,
            userId: employeeUserId
          }, connection);
        }
      }
      await connection.commit();

      if (isSMMJob) {
        if (jw.assigned_manager_id) {
          await notificationService.notifyManager(
            jw.assigned_manager_id,
            'Deliverable Marked Posted',
            `Social Media Employee marked Job Work "${jw.activity_code}" as posted.`,
            'work_completed',
            '/manager/job-works',
            true
          );
        }
        await notificationService.notifyAdmins(
          'Job Work Completed & Posted',
          `Job Work "${jw.activity_code}" has been marked as posted and completed by Social Media Employee.`,
          'work_completed',
          '/admin/deliverables',
          true
        );
      } else if (jw.assigned_manager_id) {
        const roleLabel = isWriter ? 'Script' : 'Design';
        await notificationService.notifyManager(
          jw.assigned_manager_id,
          `${roleLabel} Submitted`,
          `Job Work "${jw.activity_code}" ${roleLabel.toLowerCase()} has been submitted by the employee for your review.`,
          'work_submitted',
          '/manager/job-works',
          true
        );
      }

      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ⚡ FIXED REVIEW JOB WORK METHOD (ROUTING ISSUE FIXED)
  async reviewJobWork(id, { action, feedbackText, voiceBase64, employeeId = null }, managerUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [jwRow] = await connection.query(
        `SELECT jw.assigned_employee_id, jw.content_writer_id, jw.client_id, jw.activity_code, 
                e.sub_department_id, sd.code AS sub_department_code, sd.name AS sub_department_name 
         FROM job_works jw
         LEFT JOIN employees e ON jw.assigned_employee_id = e.id
         LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
         WHERE jw.id = ?`,
        [id]
      );
      if (jwRow.length === 0) throw new Error('Job Work not found.');
      const jwData = jwRow[0];

      // ✅ ACCURATE CONTENT WRITER DETECTION
      const isWriter = (jwData.content_writer_id && Number(jwData.assigned_employee_id) === Number(jwData.content_writer_id)) ||
                       Number(jwData.sub_department_id) === 3 ||
                       Number(jwData.sub_department_id) === 1 ||
                       jwData.sub_department_code === 'CW-RS' ||
                       (jwData.sub_department_name || '').toLowerCase().includes('content') ||
                       (jwData.sub_department_name || '').toLowerCase().includes('writer') ||
                       (jwData.sub_department_name || '').toLowerCase().includes('writing');

      let smmManagerIdRouted = null;

      if (action === 'approve' || action === 'approved') {
        if (isWriter) {
          // ✅ CREATIVE MANAGER APPROVES SCRIPT -> STAYS IN CREATIVES FOR DESIGNER ASSIGNMENT
          await connection.query(
            "UPDATE job_works SET status = 'pending', assigned_employee_id = NULL WHERE id = ?",
            [id]
          );
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_approve_script',
            action: 'Approved Content Script',
            description: 'Content script approved by Creative Manager. Ready for design assignment.',
            userId: managerUserId
          }, connection);
        } else {
          // Resolve the manager's department
          const [mgrs] = await connection.query(
            "SELECT id FROM managers WHERE user_id = ?",
            [managerUserId]
          );
          const managerId = mgrs.length > 0 ? mgrs[0].id : null;
          
          const [mgrDept] = await connection.query(
            "SELECT m.department_id, d.code FROM managers m JOIN departments d ON m.department_id = d.id WHERE m.id = ?",
            [managerId]
          );
          const isCreativesManager = mgrDept.length > 0 && (
            Number(mgrDept[0].department_id) === 1 || 
            ['CD-RS', 'CR-RS', 'Creatives', 'CREATIVES'].includes(mgrDept[0].code)
          );

          if (isCreativesManager) {
            // Find active SMM Lead/Manager
            const [smmMgrs] = await connection.query(
              "SELECT m.id FROM managers m JOIN departments d ON m.department_id = d.id WHERE (d.code = 'SMM-RS' OR m.department_id = 2 OR d.name LIKE '%Social%') AND m.status = 'active' ORDER BY m.id ASC LIMIT 1"
            );
            if (smmMgrs.length > 0) {
              const smmManagerId = smmMgrs[0].id;
              smmManagerIdRouted = smmManagerId;
              // Route to SMM Manager
              await connection.query(
                "UPDATE job_works SET assigned_manager_id = ?, status = 'approved', smm_employee_id = NULL WHERE id = ?",
                [smmManagerId, id]
              );
              await dashboardRepository.createActivityLog(
                managerUserId,
                'Approve Job Work (Routed to SMM)',
                `Job Work #${id} approved by Creatives and routed to Social Media Manager.`,
                connection
              );
              await deliverableRepository.logJobWorkHistory({
                jobWorkId: id,
                stage: 'manager_route_smm',
                action: 'Approved & Routed to SMM',
                description: 'Approved by Creative Manager and routed to SMM Manager.',
                userId: managerUserId
              }, connection);
            } else {
              // Fallback to completed if no SMM manager is active
              await connection.query(
                "UPDATE job_works SET status = 'completed' WHERE id = ?",
                [id]
              );
              await deliverableRepository.logJobWorkHistory({
                jobWorkId: id,
                stage: 'smm_post',
                action: 'Published & Completed',
                description: 'Published and live on social accounts (fallback completed).',
                userId: managerUserId
              }, connection);
            }
          } else {
            // SMM manager (or others) approves SMM employee's submission -> mark completed
            await connection.query(
              "UPDATE job_works SET status = 'completed' WHERE id = ?",
              [id]
            );
            await dashboardRepository.createActivityLog(
              managerUserId,
              'Approve SMM Job Work',
              `Job Work #${id} marked as completed after SMM approval.`,
              connection
            );
            await deliverableRepository.logJobWorkHistory({
              jobWorkId: id,
              stage: 'smm_post',
              action: 'Published & Completed',
              description: 'Published and live on social accounts (approved by SMM Manager).',
              userId: managerUserId
            }, connection);
          }
        }
      } else if (action === 'reassign') {
        await connection.query(
          "UPDATE job_works SET assigned_employee_id = COALESCE(?, assigned_employee_id), status = 'reassigned', manager_feedback_text = ?, manager_voice_base64 = ?, rework_count = rework_count + 1 WHERE id = ?",
          [employeeId || null, feedbackText || null, voiceBase64 || null, id]
        );
        if (isWriter) {
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_rework_script',
            action: 'Manager Requested Script Rework',
            description: `Script rejected by Creative Manager. Reason: ${feedbackText || 'Revision requested.'}`,
            userId: managerUserId
          }, connection);
        } else {
          await deliverableRepository.logJobWorkHistory({
            jobWorkId: id,
            stage: 'manager_rework_design',
            action: 'Manager Requested Design Rework',
            description: `Design rejected by Creative Manager. Reason: ${feedbackText || 'Revision requested.'}`,
            userId: managerUserId
          }, connection);
        }
      } else if (action === 'send_to_client') {
        await connection.query(
          "UPDATE job_works SET status = 'sent_to_client', sent_to_client_at = CURRENT_TIMESTAMP WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'manager_send_client',
          action: 'Sent Design to Client',
          description: 'Design approved by Manager and sent to Client for review.',
          userId: managerUserId
        }, connection);
      } else {
        throw new Error('Invalid action.');
      }

      await connection.commit();

      // Trigger OneSignal alerts in background after commit
      if (action === 'reassign') {
        const empId = employeeId || jwData.assigned_employee_id;
        if (empId) {
          await notificationService.notifyEmployee(
            empId,
            'Job Work Rework',
            `Rework has been requested for your Job Work task "${jwData.activity_code}". Feedback: "${feedbackText || 'Please review.'}"`,
            'rework_requested',
            '/employee/reassigned-work',
            true
          );
        }
      } else if (action === 'send_to_client') {
        await notificationService.notifyClient(
          jwData.client_id,
          'Job Work Approval Pending',
          `A new design draft for Job Work "${jwData.activity_code}" is ready for your approval.`,
          'client_approval_pending',
          '/client/reachskyline-approvals',
          true
        );
      } else if (action === 'approve' || action === 'approved') {
        if (isWriter && jwData.assigned_employee_id) {
          await notificationService.notifyEmployee(
            jwData.assigned_employee_id,
            'Script Approved',
            `Your content script for Job Work "${jwData.activity_code}" has been approved by the manager.`,
            'work_approved',
            '/employee/overall-work',
            true
          );
        } else if (smmManagerIdRouted) {
          await notificationService.notifyManager(
            smmManagerIdRouted,
            'Job Work Approved',
            `Job Work "${jwData.activity_code}" design approved by Creatives and routed to you for publishing.`,
            'deliverables_assigned',
            '/manager/job-works',
            true
          );
        }
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async clientReviewJobWork(id, { action, feedbackText }, clientUserId = null) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [jwRows] = await connection.query(
        'SELECT activity_code, assigned_manager_id FROM job_works WHERE id = ?',
        [id]
      );
      const jw = jwRows.length > 0 ? jwRows[0] : null;

      if (action === 'approve') {
        await connection.query(
          "UPDATE job_works SET status = 'client_approved' WHERE id = ?",
          [id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'client_approve',
          action: 'Client Approved Design',
          description: 'Design draft approved by Client. Ready for final processing.',
          userId: clientUserId
        }, connection);
        await connection.commit();

        if (jw && jw.assigned_manager_id) {
          await notificationService.notifyManager(
            jw.assigned_manager_id,
            'Client Approved Job Work',
            `Client approved Job Work "${jw.activity_code}".`,
            'client_feedback',
            '/manager/job-works',
            true
          );
        }
      } else if (action === 'rework') {
        await connection.query(
          "UPDATE job_works SET status = 'client_rework', client_feedback_text = ? WHERE id = ?",
          [feedbackText || null, id]
        );
        await deliverableRepository.logJobWorkHistory({
          jobWorkId: id,
          stage: 'client_rework',
          action: 'Client Requested Rework',
          description: `Design rejected by Client. Feedback: "${feedbackText || 'Revision requested.'}"`,
          userId: clientUserId
        }, connection);
        await connection.commit();

        if (jw && jw.assigned_manager_id) {
          await notificationService.notifyManager(
            jw.assigned_manager_id,
            'Client Requested Rework',
            `Client requested rework for Job Work "${jw.activity_code}": ${feedbackText || 'Please review.'}`,
            'client_feedback',
            '/manager/job-works',
            true
          );
        }
      } else {
        throw new Error('Invalid action.');
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getEmployeeJobWorks(userId) {
    const [emp] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (emp.length === 0) {
      throw new Error('Employee profile not found.');
    }
    const employeeId = emp[0].id;
    const [rows] = await pool.query(`
      SELECT jw.*, c.company_name AS client_name, at.activity_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN activity_types at ON jw.activity_type_code = at.activity_type_code
      WHERE jw.assigned_employee_id = ? OR jw.smm_employee_id = ? OR jw.content_writer_id = ?
      ORDER BY jw.id DESC
    `, [employeeId, employeeId, employeeId]);
    return rows;
  }

  async getClientJobWorks(clientUserId) {
    const [cl] = await pool.query('SELECT id FROM clients WHERE user_id = ?', [clientUserId]);
    if (cl.length === 0) {
      throw new Error('Client profile not found.');
    }
    const clientId = cl[0].id;
    const [rows] = await pool.query(`
      SELECT jw.*, c.company_name AS client_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      WHERE jw.client_id = ? 
        AND jw.status = 'sent_to_client'
    `, [clientId]);
    return rows;
  }

  async getClientReworkJobWorks(managerUserId) {
    const [mgrs] = await pool.query('SELECT id FROM managers WHERE user_id = ?', [managerUserId]);
    if (mgrs.length === 0) {
      throw new Error('Manager profile not found.');
    }
    const managerId = mgrs[0].id;
    const [rows] = await pool.query(`
      SELECT jw.*, c.company_name AS client_name, e.full_name AS employee_name, e.sub_department_id AS employee_sub_dept_id, at.sub_department_id AS sub_department_id, at.activity_name AS activity_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN employees e ON jw.assigned_employee_id = e.id
      LEFT JOIN activity_types at ON jw.activity_type_code = at.activity_type_code
      WHERE jw.assigned_manager_id = ? 
        AND jw.status IN ('client_rework', 'client_approved')
    `, [managerId]);
    return rows;
  }

  async getAdminWorkUpdates(params) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    const queryParams = {
      departmentId: params.departmentId,
      date: params.date,
      month: params.month,
      tab: params.tab || 'daily',
      limit,
      offset,
      searchQuery: params.searchQuery || '',
      statusFilter: params.statusFilter || '',
      employeeId: params.employeeId || '',
      workType: params.workType || 'all'
    };

    const updates = await deliverableRepository.getAdminWorkUpdatesList(queryParams);
    const total = await deliverableRepository.getAdminWorkUpdatesCount(queryParams);

    return {
      updates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getJobWorkHistory(jobWorkId, isJobWork = 1) {
    return await deliverableRepository.getJobWorkHistory(jobWorkId, isJobWork);
  }
}

module.exports = new DeliverableService();