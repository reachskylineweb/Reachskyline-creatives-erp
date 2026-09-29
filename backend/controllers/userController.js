const userService = require('../services/userService');

class UserController {
  // --- MANAGER ACTIONS ---
  async listManagers(req, res, next) {
    try {
      const data = await userService.getManagers(req.query);
      res.status(200).json({
        success: true,
        message: 'Managers list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getManager(req, res, next) {
    try {
      const manager = await userService.getManagerById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Manager details retrieved.',
        data: { manager },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createManager(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      const result = await userService.createManager(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Manager created successfully.',
        data: result,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateManager(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.updateManager(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Manager details updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteManager(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.deleteManager(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Manager soft-deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- EMPLOYEE ACTIONS ---
  async listEmployees(req, res, next) {
    try {
      const data = await userService.getEmployees(req.query);
      res.status(200).json({
        success: true,
        message: 'Employees list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployee(req, res, next) {
    try {
      const employee = await userService.getEmployeeById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Employee details retrieved.',
        data: { employee },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      const result = await userService.createEmployee(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Employee created successfully.',
        data: result,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.updateEmployee(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Employee details updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.deleteEmployee(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Employee soft-deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- HR ACTIONS ---
  async listHR(req, res, next) {
    try {
      const data = await userService.getHR(req.query);
      res.status(200).json({
        success: true,
        message: 'HR staff list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getHR(req, res, next) {
    try {
      const hr = await userService.getHRById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'HR details retrieved.',
        data: { hr },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createHR(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      const result = await userService.createHR(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'HR staff created successfully.',
        data: result,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateHR(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.updateHR(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'HR details updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteHR(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      await userService.deleteHR(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'HR staff soft-deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- UTILITY ACCOUNT CONTROLS ---
  async resetPassword(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      const { profileId, userType, newPassword } = req.body;
      
      if (!profileId || !userType || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: profileId, userType, and newPassword.',
          data: null,
          errors: ['Validation error']
        });
      }
      if (!['manager', 'employee', 'hr', 'client'].includes(userType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid userType. Must be "manager", "employee", "hr" or "client".',
          data: null,
          errors: ['Validation error']
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
          data: null,
          errors: ['Validation error']
        });
      }

      await userService.resetUserPassword(profileId, userType, newPassword, adminUserId);
      res.status(200).json({
        success: true,
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} password reset successfully.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const adminUserId = req.user ? (req.user.id || req.user.userId || null) : null;
      const { profileId, userType, status } = req.body;

      if (!profileId || !userType || !status) {
        return res.status(400).json({
          success: false,
          message: 'Missing fields: profileId, userType, or status.',
          data: null,
          errors: ['Validation error']
        });
      }
      if (!['manager', 'employee', 'hr', 'client'].includes(userType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid userType.',
          data: null,
          errors: ['Validation error']
        });
      }
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "active" or "inactive".',
          data: null,
          errors: ['Validation error']
        });
      }

      await userService.toggleUserStatus(profileId, userType, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} status changed to ${status}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // --- DROPDOWNS ---
  async getManagersDropdown(req, res, next) {
    try {
      const managers = await userService.getManagersDropdown();
      res.status(200).json({
        success: true,
        message: 'Active managers dropdown items retrieved.',
        data: { managers },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeesDropdown(req, res, next) {
    try {
      const { departmentId } = req.query;
      const employees = await userService.getEmployeesDropdown(departmentId);
      res.status(200).json({
        success: true,
        message: 'Active employees dropdown items retrieved.',
        data: { employees },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeEfficiency(req, res, next) {
    try {
      const pool = require('../config/db');
      
      const filterType = req.query.filterType || 'monthly';
      const targetDate = req.query.date || new Date().toISOString().substring(0, 10);
      const targetMonth = req.query.month || new Date().toISOString().substring(0, 7);
      const departmentFilter = req.query.departmentFilter;

      // 1. Fetch active employees
      let empQuery = `
        SELECT 
          e.id,
          e.full_name,
          e.employee_id_code,
          e.sub_department_id,
          sd.name AS sub_department_name,
          d.name AS department_name,
          e.department_id
        FROM employees e
        JOIN users u ON e.user_id = u.id
        JOIN departments d ON e.department_id = d.id
        LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
        WHERE e.status = 'active' AND u.deleted_at IS NULL
      `;
      const empParams = [];
      if (departmentFilter && departmentFilter !== 'all' && departmentFilter !== 'all_departments') {
        empQuery += " AND e.department_id = ?";
        empParams.push(departmentFilter);
      }
      const [employees] = await pool.query(empQuery, empParams);

      // 2. Fetch all activity types
      const [actTypes] = await pool.query('SELECT * FROM activity_types');
      const actTypeMap = new Map(actTypes.map(a => [a.activity_type_code.toUpperCase(), a]));

      // Fetch job work history reworks counts
      const [historyReworks] = await pool.query(`
        SELECT 
          job_work_id,
          SUM(CASE WHEN stage = 'manager_rework_script' THEN 1 ELSE 0 END) AS writer_reworks,
          SUM(CASE WHEN stage IN ('manager_rework_design', 'client_rework') THEN 1 ELSE 0 END) AS designer_reworks
        FROM job_work_history
        GROUP BY job_work_id
      `);
      const jobWorkReworksMap = new Map(historyReworks.map(h => [Number(h.job_work_id), h]));

      const efficiencyList = [];

      for (const emp of employees) {
        const isWriter = emp.sub_department_code === 'CW-RS' || Number(emp.sub_department_id) === 1 || (emp.sub_department_name || '').toLowerCase().includes('content');
        const isSMM = Number(emp.department_id) === 2;
        let tasks = [];

        if (!isWriter) {
          // --- DESIGNER / EDITOR / SMM ---
          // 1. Query Monthly Deliverables
          let mdQuery = `
            SELECT id, activity_type_code, status, completed_time_spent, started_at, due_date, month, rework_count, google_drive_link, designer_output, content_link, submitted_at
            FROM monthly_deliverables
            WHERE (${isSMM ? 'smm_employee_id = ?' : 'assigned_employee_id = ? OR content_writer_id = ?'}) AND status != 'pending' AND deleted_at IS NULL
          `;
          let mdParams = isSMM ? [emp.id] : [emp.id, emp.id];
          if (filterType === 'daily') {
            mdQuery += " AND (DATE(due_date) = ? OR DATE(created_at) = ?)";
            mdParams.push(targetDate, targetDate);
          } else {
            mdQuery += " AND (DATE_FORMAT(due_date, '%Y-%m') = ? OR month = ? OR DATE_FORMAT(created_at, '%Y-%m') = ?)";
            mdParams.push(targetMonth, targetMonth, targetMonth);
          }
          const [mdRows] = await pool.query(mdQuery, mdParams);
          tasks = tasks.concat(mdRows.map(r => ({ ...r, type: 'deliverable' })));

          // 2. Query Job Works
          let jwQuery = `
            SELECT id, activity_type_code, status, completed_time_spent, started_at, deadline, rework_count, google_drive_link, content_link, submitted_at, NULL AS designer_output
            FROM job_works
            WHERE ${isSMM ? 'smm_employee_id = ?' : '(assigned_employee_id = ? OR content_writer_id = ?)'}
          `;
          let jwParams = isSMM ? [emp.id] : [emp.id, emp.id];
          if (filterType === 'daily') {
            jwQuery += " AND (DATE(deadline) = ? OR DATE(created_at) = ? OR deadline IS NULL)";
            jwParams.push(targetDate, targetDate);
          } else {
            jwQuery += " AND (DATE_FORMAT(deadline, '%Y-%m') = ? OR DATE_FORMAT(created_at, '%Y-%m') = ? OR deadline IS NULL)";
            jwParams.push(targetMonth, targetMonth);
          }
          const [jwRows] = await pool.query(jwQuery, jwParams);
          tasks = tasks.concat(jwRows.map(r => ({ ...r, type: 'job_work' })));

          // 3. Query Event Days / Shoot Scripts assigned to designer
          let edQuery = `
            SELECT id, submission_status, submission_status AS status, completed_time_spent, started_at, date, month, rework_count, work_link, submitted_at
            FROM event_days
            WHERE assigned_employee_id = ?
          `;
          let edParams = [emp.id];
          if (filterType === 'daily') {
            edQuery += " AND date = ?";
            edParams.push(targetDate);
          } else {
            edQuery += " AND month = ?";
            edParams.push(targetMonth);
          }
          const [edRows] = await pool.query(edQuery, edParams);
          tasks = tasks.concat(edRows.map(r => ({ ...r, type: 'event_day', activity_type_code: 'AT006' })));

        } else {
          // --- CONTENT WRITER ---
          let mdWriterQuery = `
            SELECT d.id, d.activity_type_code, d.status, 
                   COALESCE(c.submission_status, d.status) AS submission_status,
                   COALESCE(c.completed_time_spent, d.writer_completed_time_spent) AS completed_time_spent, 
                   COALESCE(c.started_at, d.writer_started_at) AS started_at, 
                   d.due_date, d.month, GREATEST(d.rework_count, COALESCE(c.rework_count, 0)) AS rework_count, d.content_writer_id, 
                   COALESCE(c.work_link, d.content_link) AS content_link, 
                   COALESCE(c.submitted_at, d.submitted_at) AS submitted_at
            FROM monthly_deliverables d
            LEFT JOIN content_calendar c ON c.assigned_employee_id = d.content_writer_id 
              AND ( (c.activity_code IS NOT NULL AND c.activity_code = d.activity_code) 
                    OR (c.client_id = d.client_id AND c.date = d.due_date AND c.activity_type_code = d.activity_type_code) )
            WHERE d.content_writer_id = ? AND d.status != 'pending' AND d.deleted_at IS NULL
          `;
          let mdWriterParams = [emp.id];
          if (filterType === 'daily') {
            mdWriterQuery += " AND DATE(d.due_date) = ?";
            mdWriterParams.push(targetDate);
          } else {
            mdWriterQuery += " AND (DATE_FORMAT(d.due_date, '%Y-%m') = ? OR d.month = ?)";
            mdWriterParams.push(targetMonth, targetMonth);
          }
          const [mdWriterRows] = await pool.query(mdWriterQuery, mdWriterParams);
          tasks = tasks.concat(mdWriterRows.map(r => ({ ...r, type: 'deliverable' })));

          let ccQuery = `
            SELECT c.id, c.activity_type_code, c.submission_status, c.submission_status AS status, c.completed_time_spent, c.started_at, c.date, c.month, c.rework_count, c.work_link, c.submitted_at
            FROM content_calendar c
            WHERE c.assigned_employee_id = ?
              AND NOT EXISTS (
                SELECT 1 FROM monthly_deliverables d 
                WHERE d.content_writer_id = c.assigned_employee_id 
                  AND (d.activity_type_code = c.activity_type_code OR d.due_date = c.date)
              )
          `;
          let ccParams = [emp.id];
          if (filterType === 'daily') {
            ccQuery += " AND c.date = ?";
            ccParams.push(targetDate);
          } else {
            ccQuery += " AND c.month = ?";
            ccParams.push(targetMonth);
          }
          const [ccRows] = await pool.query(ccQuery, ccParams);
          tasks = tasks.concat(ccRows.map(r => ({ ...r, type: 'content_calendar' })));

          let edQuery = `
            SELECT id, submission_status, submission_status AS status, completed_time_spent, started_at, date, month, rework_count, work_link, submitted_at
            FROM event_days
            WHERE assigned_employee_id = ?
          `;
          let edParams = [emp.id];
          if (filterType === 'daily') {
            edQuery += " AND date = ?";
            edParams.push(targetDate);
          } else {
            edQuery += " AND month = ?";
            edParams.push(targetMonth);
          }
          const [edRows] = await pool.query(edQuery, edParams);
          tasks = tasks.concat(edRows.map(r => ({ ...r, type: 'event_day', activity_type_code: 'AT006' })));

          let ssQuery = `
            SELECT id, submission_status, submission_status AS status, completed_time_spent, started_at, month, rework_count, work_link, NULL AS submitted_at
            FROM shoot_scripts
            WHERE assigned_employee_id = ?
          `;
          let ssParams = [emp.id];
          if (filterType === 'daily') {
            ssQuery += " AND DATE(created_at) = ?";
            ssParams.push(targetDate);
          } else {
            ssQuery += " AND month = ?";
            ssParams.push(targetMonth);
          }
          const [ssRows] = await pool.query(ssQuery, ssParams);
          tasks = tasks.concat(ssRows.map(r => ({ ...r, type: 'shoot_script', activity_type_code: 'DEFAULT_SCRIPT' })));

          let jwQuery = `
            SELECT id, activity_type_code, status, writer_completed_time_spent AS completed_time_spent, writer_started_at AS started_at, deadline, rework_count, assigned_employee_id, content_writer_id, google_drive_link, content_link, submitted_at
            FROM job_works
            WHERE content_writer_id = ?
          `;
          let jwParams = [emp.id];
          if (filterType === 'daily') {
            jwQuery += " AND (DATE(deadline) = ? OR DATE(created_at) = ? OR deadline IS NULL)";
            jwParams.push(targetDate, targetDate);
          } else {
            jwQuery += " AND (DATE_FORMAT(deadline, '%Y-%m') = ? OR DATE_FORMAT(created_at, '%Y-%m') = ? OR deadline IS NULL)";
            jwParams.push(targetMonth, targetMonth);
          }
          const [jwRows] = await pool.query(jwQuery, jwParams);
          tasks = tasks.concat(jwRows.map(r => ({ ...r, type: 'job_work' })));
        }

        // --- CALCULATIONS ---
        let total_tasks = 0;
        let completed_tasks = 0;
        let total_est_mins = 0;
        let completed_est_mins = 0;
        let total_comp_seconds = 0;

        tasks.forEach(t => {
          const statusLower = (t.status || '').toLowerCase();
          const subStatusLower = (t.submission_status || t.status || '').toLowerCase();

          const reworks = jobWorkReworksMap.get(Number(t.id)) || { writer_reworks: 0, designer_reworks: 0 };
          const roleReworks = Number(isWriter ? reworks.writer_reworks : reworks.designer_reworks);
          const reworkCount = roleReworks > 0 ? roleReworks : (isWriter ? Number(t.rework_count || 0) : 0);

          let isCompleted = false;
          if (isSMM) {
            isCompleted = statusLower === 'posted' || statusLower === 'completed';
          } else if (isWriter) {
            const isPending = subStatusLower === 'pending' || (!t.content_link && !t.work_link);
            const inRework = (reworkCount > 0 && isPending) || ['reassigned', 'rework', 'client_rework', 'in_rework'].includes(subStatusLower);
            const hasLink = Boolean((t.content_link && String(t.content_link).trim() !== '') || (t.work_link && String(t.work_link).trim() !== ''));
            const hasSubmittedStatus = ['submitted', 'approved', 'client_approved', 'posted', 'completed'].includes(subStatusLower);
            isCompleted = !inRework && (hasLink || hasSubmittedStatus);
          } else {
            const isPending = statusLower === 'pending' || (!t.google_drive_link && !t.designer_output);
            const inRework = (reworkCount > 0 && isPending) || ['reassigned', 'rework', 'client_rework', 'in_rework'].includes(statusLower);
            const hasLink = Boolean((t.google_drive_link && String(t.google_drive_link).trim() !== '') || (t.designer_output && String(t.designer_output).trim() !== ''));
            const hasSubmittedStatus = ['submitted', 'sent_to_client', 'client_approved', 'posted', 'completed'].includes(subStatusLower);
            isCompleted = !inRework && (hasLink || hasSubmittedStatus);
          }

          let est_mins = 15;
          if (t.activity_type_code) {
            const act = actTypeMap.get(t.activity_type_code.toUpperCase());
            if (act) {
              est_mins = isWriter ? act.time_content : act.time_editor;
            }
          } else if (t.type === 'shoot_script') {
            est_mins = 30;
          }

          total_tasks += 1;
          if (isCompleted) {
            completed_tasks += 1;
          }
          total_est_mins += est_mins;
          if (isCompleted) {
            completed_est_mins += est_mins;
            let secs = Number(t.completed_time_spent || 0);
            total_comp_seconds += Math.max(0, secs);
          }
        });

        const completion_score = total_tasks > 0 ? ((completed_tasks / total_tasks) * 100) : 0;
        const time_score = completion_score;
        const overall_efficiency = Math.round(completion_score);

        efficiencyList.push({
          id: emp.id,
          full_name: emp.full_name,
          employee_id_code: emp.employee_id_code,
          sub_department_id: emp.sub_department_id,
          sub_department_name: emp.sub_department_name || emp.department_name,
          department_name: emp.department_name,
          department_id: emp.department_id,
          total_tasks,
          completed_tasks,
          estimated_time: isSMM ? null : total_est_mins,
          completed_time: isSMM ? null : total_comp_seconds,
          time_score: isSMM ? null : Math.round(time_score),
          completion_score: Math.round(completion_score),
          efficiency: overall_efficiency
        });
      }

      res.status(200).json({
        success: true,
        message: 'Employee efficiency report fetched successfully.',
        data: efficiencyList,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async listCredentials(req, res, next) {
    try {
      const credentials = await userService.getAllCredentials();
      res.status(200).json({
        success: true,
        message: 'User credentials retrieved successfully.',
        data: { credentials },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();