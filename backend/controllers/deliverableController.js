const deliverableService = require('../services/deliverableService');
const pool = require('../config/db');

class DeliverableController {
  // --- TEMPLATE CONTROLLERS ---
  async listTemplates(req, res, next) {
    try {
      const data = await deliverableService.getTemplates(req.query);
      res.status(200).json({
        success: true,
        message: 'Templates list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getTemplate(req, res, next) {
    try {
      const data = await deliverableService.getTemplateById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Template details retrieved.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { template, items } = req.body;
      if (!template || !template.name) {
        return res.status(400).json({
          success: false,
          message: 'Template definition and name are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const id = await deliverableService.createTemplate(template, items, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Deliverable template created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { template, items } = req.body;
      if (!template || !template.name) {
        return res.status(400).json({
          success: false,
          message: 'Template definition and name are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.updateTemplate(req.params.id, template, items, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Deliverable template updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTemplate(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await deliverableService.deleteTemplate(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Deliverable template deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- MONTHLY DELIVERABLES CONTROLLERS ---
  async listDeliverables(req, res, next) {
    try {
      if (req.user.role === 'employee') {
        const pool = require('../config/db');
        const [empRows] = await pool.query(
          "SELECT id FROM employees WHERE user_id = ? AND status = 'active'",
          [req.user.id]
        );
        if (empRows.length > 0) {
          req.query.employeeFilter = empRows[0].id;
        } else {
          return res.status(200).json({
            success: true,
            message: 'No deliverables found.',
            data: { deliverables: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
            errors: []
          });
        }
      }
      const data = await deliverableService.getDeliverables(req.query);
      res.status(200).json({
        success: true,
        message: 'Deliverables list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getDeliverable(req, res, next) {
    try {
      const deliverable = await deliverableService.getDeliverableById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Deliverable details retrieved.',
        data: { deliverable },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createDeliverable(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const id = await deliverableService.createDeliverable(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Monthly deliverable created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDeliverable(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await deliverableService.updateDeliverable(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Monthly deliverable updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDeliverable(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await deliverableService.deleteDeliverable(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Deliverable soft-deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async changeDeliverableStatus(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { status, isJobWork } = req.body;
      const isJobWorkFlag = isJobWork === true || isJobWork === 1 || req.query.isJobWork === 'true';

      if (!['pending', 'in_progress', 'completed', 'cancelled', 'posted'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "pending", "in_progress", "completed", "cancelled", or "posted".',
          data: null,
          errors: ['Validation error']
        });
      }

      // If employee, secure access to only their assigned deliverable
      if (req.user.role === 'employee') {
        const pool = require('../config/db');
        const [empRows] = await pool.query(
          `SELECT e.id, d.code AS department_code 
           FROM employees e
           LEFT JOIN departments d ON e.department_id = d.id
           WHERE e.user_id = ? AND e.status = 'active'`,
          [req.user.id]
        );
        if (empRows.length === 0) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Active employee profile not found.',
            data: null,
            errors: ['Forbidden']
          });
        }
        
        const employeeId = empRows[0].id;
        const deptCode = empRows[0].department_code;
        const queryTable = isJobWorkFlag ? 'job_works' : 'monthly_deliverables';
        const [delRows] = await pool.query(
          `SELECT assigned_employee_id, smm_employee_id FROM ${queryTable} WHERE id = ?`,
          [req.params.id]
        );
        if (delRows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Deliverable not found.',
            data: null,
            errors: ['Not Found']
          });
        }

        const isSMM = deptCode === 'SMM-RS';
        let isMatch = false;
        if (isSMM) {
          isMatch = String(delRows[0].smm_employee_id) === String(employeeId) || String(delRows[0].assigned_employee_id) === String(employeeId);
        } else {
          isMatch = String(delRows[0].assigned_employee_id) === String(employeeId);
        }

        if (!isMatch) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only update deliverables assigned to you.',
            data: null,
            errors: ['Forbidden']
          });
        }
      }

      await deliverableService.toggleDeliverableStatus(req.params.id, status, adminUserId, isJobWorkFlag);
      res.status(200).json({
        success: true,
        message: `Deliverable status changed to ${status}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- AUTOMATED TEMPLATE GENERATOR ---
  async generateFromTemplate(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { templateId, clientId, month } = req.body;

      if (!templateId || !clientId || !month) {
        return res.status(400).json({
          success: false,
          message: 'Required parameters missing: templateId, clientId, and month (YYYY-MM).',
          data: null,
          errors: ['Validation error']
        });
      }

      const createdIds = await deliverableService.generateFromTemplate(templateId, clientId, month, adminUserId);
      res.status(201).json({
        success: true,
        message: `Successfully generated ${createdIds.length} deliverables from template for month ${month}.`,
        data: { createdIds },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk Actions
  async bulkDelete(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { ids } = req.body;
      await deliverableService.bulkDeleteDeliverables(ids, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected deliverables (${ids.length}) deleted successfully.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { ids, status } = req.body;
      if (!['pending', 'in_progress', 'completed', 'cancelled', 'posted'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.bulkUpdateDeliverablesStatus(ids, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected deliverables status updated to "${status}".`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- MONTHLY DELIVERABLES GRID CONTROLLERS ---
  async getMonthlyGrid(req, res, next) {
    try {
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month (YYYY-MM) is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const data = await deliverableService.getMonthlyGrid(month);
      res.status(200).json({
        success: true,
        message: 'Monthly deliverables grid retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async saveMonthlyGrid(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { month, gridData } = req.body;
      if (!month || !Array.isArray(gridData)) {
        return res.status(400).json({
          success: false,
          message: 'Month and gridData are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.saveMonthlyGrid(month, gridData, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Monthly deliverables grid saved successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- MONTHLY BLOGS GRID CONTROLLERS ---
  async getMonthlyBlogsGrid(req, res, next) {
    try {
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month (YYYY-MM) is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const data = await deliverableService.getMonthlyBlogsGrid(month);
      res.status(200).json({
        success: true,
        message: 'Monthly blogs grid retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async saveMonthlyBlogsGrid(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { month, gridData } = req.body;
      if (!month || !Array.isArray(gridData)) {
        return res.status(400).json({
          success: false,
          message: 'Month and gridData are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.saveMonthlyBlogsGrid(month, gridData, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Monthly blogs grid saved successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async generateBlogCalendarFromGrid(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month (YYYY-MM) is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.generateBlogCalendarFromGrid(month, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Blog calendar generated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async generateCalendarFromGrid(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await deliverableService.generateContentCalendarFromGrid(month, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Content calendar generated successfully from monthly grid counts.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- JOB WORK CONTROLLERS ---
  async getJobWorks(req, res, next) {
    try {
      const data = await deliverableService.getJobWorks();
      res.status(200).json({
        success: true,
        message: 'Job Works list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobWorksByManager(req, res, next) {
    try {
      const managerUserId = req.user.id;
      let managerId = null;
      let deptId = null;

      const [mgrs] = await pool.query(
        "SELECT id, department_id FROM managers WHERE user_id = ?",
        [managerUserId]
      );
      if (mgrs.length > 0) {
        managerId = mgrs[0].id;
        deptId = mgrs[0].department_id;
      }

      const data = await deliverableService.getJobWorksByManager(managerId, deptId);
      res.status(200).json({
        success: true,
        message: 'Job Works for manager retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createJobWork(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { client_id, activity_type_code, quantity, deadline } = req.body;
      if (!client_id || !activity_type_code || !deadline) {
        return res.status(400).json({
          success: false,
          message: 'client_id, activity_type_code, and deadline are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const id = await deliverableService.createJobWork(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Job Work created and assigned successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async completeJobWork(req, res, next) {
    try {
      const managerUserId = req.user.id;
      const { id } = req.params;
      await deliverableService.completeJobWork(id, managerUserId);
      res.status(200).json({
        success: true,
        message: 'Job Work marked completed successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeTodayDeliverables(req, res, next) {
    try {
      const userId = req.user.id;
      const deliverables = await deliverableService.getEmployeeTodayDeliverables(userId);
      res.status(200).json({
        success: true,
        message: 'Employee today deliverables retrieved successfully.',
        data: { deliverables },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeReworkQueue(req, res, next) {
    try {
      const userId = req.user.id;
      const deliverables = await deliverableService.getEmployeeReworkQueue(userId);
      res.status(200).json({
        success: true,
        message: 'Employee rework queue retrieved successfully.',
        data: { deliverables },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeAllDeliverables(req, res, next) {
    try {
      const userId = req.user.id;
      const deliverables = await deliverableService.getEmployeeAllDeliverables(userId);
      res.status(200).json({
        success: true,
        message: 'Employee all deliverables retrieved successfully.',
        data: { deliverables },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async assignDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId, isJobWork } = req.body;
      const managerUserId = req.user.id;
      await deliverableService.assignDeliverableWork(id, employeeId, managerUserId, isJobWork === true || isJobWork === 1);
      res.status(200).json({
        success: true,
        message: 'Deliverable assigned to employee successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async submitDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const { googleDriveLink } = req.body;
      const employeeUserId = req.user.id;
      await deliverableService.submitDeliverableWork(id, googleDriveLink, employeeUserId);
      res.status(200).json({
        success: true,
        message: 'Deliverable work submitted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async startDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const employeeUserId = req.user.id;
      await deliverableService.startDeliverableWork(id, employeeUserId);
      res.status(200).json({
        success: true,
        message: 'Deliverable work started successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async reviewDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const { action, feedbackText, voiceBase64, feedback, voiceNote } = req.body;
      const managerUserId = req.user.id;
      await deliverableService.reviewDeliverableWork(id, { 
        action, 
        feedbackText: feedbackText || feedback, 
        voiceBase64: voiceBase64 || voiceNote 
      }, managerUserId);
      res.status(200).json({
        success: true,
        message: `Deliverable review successfully submitted: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async clientReviewDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const { action, feedbackText, feedback } = req.body;
      await deliverableService.clientReviewDeliverableWork(id, { 
        action, 
        feedbackText: feedbackText || feedback 
      });
      res.status(200).json({
        success: true,
        message: `Client deliverable review successfully processed: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async managerClientReviewDeliverableWork(req, res, next) {
    try {
      const { id } = req.params;
      const { action, feedbackText, voiceBase64, feedback, voiceNote, employeeId } = req.body;
      const managerUserId = req.user.id;
      await deliverableService.managerClientReviewDeliverableWork(id, { 
        action, 
        feedbackText: feedbackText || feedback, 
        voiceBase64: voiceBase64 || voiceNote,
        employeeId
      }, managerUserId);
      res.status(200).json({
        success: true,
        message: `Manager resolution successfully processed: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async assignJobWork(req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId, feedbackText, voiceBase64 } = req.body;
      const managerUserId = req.user.id;
      await deliverableService.assignJobWork(id, employeeId, feedbackText, voiceBase64, managerUserId);
      res.status(200).json({
        success: true,
        message: 'Job Work assigned to employee successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async submitJobWork(req, res, next) {
    try {
      const { id } = req.params;
      const { googleDriveLink } = req.body;
      const employeeUserId = req.user.id;
      await deliverableService.submitJobWork(id, googleDriveLink, employeeUserId);
      res.status(200).json({
        success: true,
        message: 'Job Work successfully submitted.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async startJobWork(req, res, next) {
    try {
      const { id } = req.params;
      const employeeUserId = req.user.id;
      await deliverableService.startJobWork(id, employeeUserId);
      res.status(200).json({
        success: true,
        message: 'Job work started successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async reviewJobWork(req, res, next) {
    try {
      const { id } = req.params;
      const { action, feedbackText, voiceBase64, feedback, voiceNote, employeeId } = req.body;
      const managerUserId = req.user.id;
      await deliverableService.reviewJobWork(id, { 
        action, 
        feedbackText: feedbackText || feedback, 
        voiceBase64: voiceBase64 || voiceNote,
        employeeId
      }, managerUserId);
      res.status(200).json({
        success: true,
        message: `Job Work review successfully submitted: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async clientReviewJobWork(req, res, next) {
    try {
      const { id } = req.params;
      const { action, feedbackText, feedback } = req.body;
      const clientUserId = req.user?.id || null;
      await deliverableService.clientReviewJobWork(id, { 
        action, 
        feedbackText: feedbackText || feedback 
      }, clientUserId);
      res.status(200).json({
        success: true,
        message: `Client Job Work review successfully processed: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeJobWorks(req, res, next) {
    try {
      const userId = req.user.id;
      const jobWorks = await deliverableService.getEmployeeJobWorks(userId);
      res.status(200).json({
        success: true,
        message: 'Employee Job Works retrieved successfully.',
        data: jobWorks,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientJobWorks(req, res, next) {
    try {
      const clientUserId = req.user.id;
      const jobWorks = await deliverableService.getClientJobWorks(clientUserId);
      res.status(200).json({
        success: true,
        message: 'Client Job Works retrieved successfully.',
        data: jobWorks,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientReworkJobWorks(req, res, next) {
    try {
      const managerUserId = req.user.id;
      const jobWorks = await deliverableService.getClientReworkJobWorks(managerUserId);
      res.status(200).json({
        success: true,
        message: 'Client rework Job Works retrieved successfully.',
        data: jobWorks,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminWorkUpdates(req, res, next) {
    try {
      const data = await deliverableService.getAdminWorkUpdates(req.query);
      res.status(200).json({
        success: true,
        message: 'Admin work updates retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobWorkHistory(req, res, next) {
    try {
      const { id } = req.params;
      const isJobWork = req.query.isJobWork !== undefined ? Number(req.query.isJobWork) : 1;
      const history = await deliverableService.getJobWorkHistory(id, isJobWork);
      res.status(200).json({
        success: true,
        message: 'Job Work history retrieved successfully.',
        data: history,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeliverableController();