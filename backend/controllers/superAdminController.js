const pool = require('../config/db');
const bcrypt = require('bcrypt');

class SuperAdminController {
  async getBranches(req, res, next) {
    try {
      const [rows] = await pool.query(`
        SELECT b.*,
          (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id AND u.role = 'admin') AS admins_count,
          (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id AND u.role = 'manager') AS managers_count,
          (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id AND u.role = 'employee') AS employees_count
        FROM branches b
        ORDER BY b.name ASC
      `);
      res.status(200).json({
        success: true,
        message: 'Branches retrieved successfully.',
        data: rows,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createBranch(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Branch name is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      const [existing] = await pool.query("SELECT id FROM branches WHERE name = ?", [name.trim()]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Branch name already exists.',
          data: null,
          errors: ['Conflict error']
        });
      }

      const [result] = await pool.query("INSERT INTO branches (name) VALUES (?)", [name.trim()]);
      res.status(201).json({
        success: true,
        message: 'Branch created successfully.',
        data: { id: result.insertId, name: name.trim() },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBranch(req, res, next) {
    try {
      const { id } = req.params;
      const branchId = Number(id);

      // Disassociate users and clients from this branch before deletion
      await pool.query("UPDATE users SET branch_id = NULL WHERE branch_id = ?", [branchId]);
      await pool.query("UPDATE clients SET branch_id = NULL WHERE branch_id = ?", [branchId]);

      // Permanently delete branch record
      const [result] = await pool.query("DELETE FROM branches WHERE id = ?", [branchId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Branch location not found.',
          data: null,
          errors: ['Not found']
        });
      }

      res.status(200).json({
        success: true,
        message: 'Branch location deleted completely from database.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdmins(req, res, next) {
    try {
      const [rows] = await pool.query(`
        SELECT u.id, u.username, u.email, u.status, u.branch_id, b.name AS branch_name, u.created_at
        FROM users u 
        LEFT JOIN branches b ON u.branch_id = b.id 
        WHERE u.role = 'admin'
        ORDER BY u.id DESC
      `);
      res.status(200).json({
        success: true,
        message: 'Admin accounts retrieved successfully.',
        data: rows,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { username, password, email, branchId } = req.body;
      if (!username || !password || !email || !branchId) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, email, and branch association are required.',
          data: null,
          errors: ['Validation error']
        });
      }

      const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [username.trim()]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists.',
          data: null,
          errors: ['Conflict error']
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const [result] = await pool.query(
        "INSERT INTO users (username, password, email, role, status, branch_id) VALUES (?, ?, ?, 'admin', 'active', ?)",
        [username.trim(), hashedPassword, email.trim(), Number(branchId)]
      );

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully.',
        data: { id: result.insertId, username: username.trim(), email: email.trim(), branchId: Number(branchId) },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, email, branchId } = req.body;

      if (!username || !email || !branchId) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and branch association are required.',
          data: null,
          errors: ['Validation error']
        });
      }

      const [existing] = await pool.query(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username.trim(), id]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists on another account.',
          data: null,
          errors: ['Conflict error']
        });
      }

      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 12);
        await pool.query(
          "UPDATE users SET username = ?, password = ?, email = ?, branch_id = ? WHERE id = ? AND role = 'admin'",
          [username.trim(), hashedPassword, email.trim(), Number(branchId), id]
        );
      } else {
        await pool.query(
          "UPDATE users SET username = ?, email = ?, branch_id = ? WHERE id = ? AND role = 'admin'",
          [username.trim(), email.trim(), Number(branchId), id]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Admin user updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAdmin(req, res, next) {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM users WHERE id = ? AND role = 'admin'", [id]);
      res.status(200).json({
        success: true,
        message: 'Admin user deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const branchIdQuery = req.query.branchId ? Number(req.query.branchId) : null;

      // 1. Get branches list
      const [branches] = await pool.query("SELECT * FROM branches ORDER BY name ASC");

      // 2. Client stats & list
      const clientQuery = branchIdQuery
        ? ["SELECT c.*, b.name AS branch_name FROM clients c LEFT JOIN branches b ON c.branch_id = b.id WHERE c.branch_id = ? AND c.deleted_at IS NULL", [branchIdQuery]]
        : ["SELECT c.*, b.name AS branch_name FROM clients c LEFT JOIN branches b ON c.branch_id = b.id WHERE c.deleted_at IS NULL", []];
      
      const [clients] = await pool.query(...clientQuery);

      // 3. Employee stats & list
      const employeeQuery = branchIdQuery
        ? [`
            SELECT e.*, d.name AS department_name, b.name AS branch_name 
            FROM employees e 
            JOIN users u ON e.user_id = u.id 
            JOIN departments d ON e.department_id = d.id
            LEFT JOIN branches b ON u.branch_id = b.id
            WHERE u.branch_id = ?
          `, [branchIdQuery]]
        : [`
            SELECT e.*, d.name AS department_name, b.name AS branch_name 
            FROM employees e 
            JOIN users u ON e.user_id = u.id 
            JOIN departments d ON e.department_id = d.id
            LEFT JOIN branches b ON u.branch_id = b.id
          `, []];

      const [employees] = await pool.query(...employeeQuery);

      // 4. Admin users list
      const adminQuery = branchIdQuery
        ? ["SELECT u.id, u.username, u.email, b.name AS branch_name FROM users u LEFT JOIN branches b ON u.branch_id = b.id WHERE u.role = 'admin' AND u.branch_id = ?", [branchIdQuery]]
        : ["SELECT u.id, u.username, u.email, b.name AS branch_name FROM users u LEFT JOIN branches b ON u.branch_id = b.id WHERE u.role = 'admin'", []];
      
      const [admins] = await pool.query(...adminQuery);

      // 5. Calculate Branch Efficiency Comparison
      const [branchEfficiencies] = await pool.query(`
        SELECT 
            b.id,
            b.name,
            COALESCE(
              (
                SELECT AVG(
                  CASE 
                    WHEN (
                      SELECT COUNT(*) FROM monthly_deliverables md WHERE md.assigned_employee_id = emp.id AND md.status != 'pending'
                    ) + (
                      SELECT COUNT(*) FROM job_works jw WHERE jw.assigned_employee_id = emp.id
                    ) > 0 
                    THEN (
                      (
                        SELECT COUNT(*) FROM monthly_deliverables md WHERE md.assigned_employee_id = emp.id AND md.status = 'client_approved'
                      ) + (
                        SELECT COUNT(*) FROM job_works jw WHERE jw.assigned_employee_id = emp.id AND jw.status = 'approved'
                      )
                    ) / (
                      (
                        SELECT COUNT(*) FROM monthly_deliverables md WHERE md.assigned_employee_id = emp.id AND md.status != 'pending'
                      ) + (
                        SELECT COUNT(*) FROM job_works jw WHERE jw.assigned_employee_id = emp.id
                      )
                    ) * 100
                    ELSE 0
                  END
                )
                FROM employees emp
                JOIN users usr ON emp.user_id = usr.id
                WHERE usr.branch_id = b.id
              ),
              0
            ) AS average_efficiency
        FROM branches b
      `);

      const branchEfficiencyList = branchEfficiencies.map(be => ({
        id: be.id,
        name: be.name,
        efficiency: Math.round(Number(be.average_efficiency))
      }));

      res.status(200).json({
        success: true,
        message: 'Super Admin statistics compiled successfully.',
        data: {
          branches,
          clientsCount: clients.length,
          clients,
          employeesCount: employees.length,
          employees,
          adminsCount: admins.length,
          admins,
          branchEfficiencyList
        },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeEfficiency(req, res, next) {
    try {
      const branchIdQuery = req.query.branchId ? Number(req.query.branchId) : null;
      const filterType = req.query.filterType || 'monthly';
      const targetDate = req.query.date || new Date().toISOString().substring(0, 10);
      const targetMonth = req.query.month || new Date().toISOString().substring(0, 7);
      const departmentFilter = req.query.departmentFilter;

      let empQuery = `
        SELECT 
          e.id,
          e.full_name,
          e.employee_id_code,
          e.sub_department_id,
          sd.name AS sub_department_name,
          d.name AS department_name,
          b.name AS branch_name,
          e.department_id
        FROM employees e
        JOIN users u ON e.user_id = u.id
        JOIN departments d ON e.department_id = d.id
        LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE e.status = 'active'
          AND (? IS NULL OR u.branch_id = ?)
      `;
      const empParams = [branchIdQuery, branchIdQuery];
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
        const isSMM = Number(emp.department_id) === 2 || (emp.department_name || '').toLowerCase().includes('social') || (emp.department_name || '').toLowerCase().includes('smm');
        let tasks = [];

        if (!isWriter) {
          // --- DESIGNER / EDITOR / SMM ---
          // Query Monthly Deliverables (only count deliverables actually assigned/dispatched by manager, status != 'pending')
          let mdQuery = `
            SELECT id, activity_type_code, status, completed_time_spent, started_at, due_date, month, rework_count, google_drive_link, designer_output, content_link, submitted_at
            FROM monthly_deliverables
            WHERE ${isSMM ? 'smm_employee_id' : 'assigned_employee_id'} = ? AND status != 'pending' AND deleted_at IS NULL
          `;
          let mdParams = [emp.id];
          if (filterType === 'daily') {
            mdQuery += " AND DATE(due_date) = ?";
            mdParams.push(targetDate);
          } else {
            mdQuery += " AND (DATE_FORMAT(due_date, '%Y-%m') = ? OR month = ?)";
            mdParams.push(targetMonth, targetMonth);
          }
          const [mdRows] = await pool.query(mdQuery, mdParams);
          tasks = tasks.concat(mdRows.map(r => ({ ...r, type: 'deliverable' })));

          // Query Job Works
          let jwQuery = `
            SELECT id, activity_type_code, status, completed_time_spent, started_at, deadline, rework_count, google_drive_link, content_link, submitted_at, NULL AS designer_output
            FROM job_works
            WHERE ${isSMM ? 'smm_employee_id' : 'assigned_employee_id'} = ?
          `;
          let jwParams = [emp.id];
          if (filterType === 'daily') {
            jwQuery += " AND DATE(deadline) = ?";
            jwParams.push(targetDate);
          } else {
            jwQuery += " AND DATE_FORMAT(deadline, '%Y-%m') = ?";
            jwParams.push(targetMonth);
          }
          const [jwRows] = await pool.query(jwQuery, jwParams);
          tasks = tasks.concat(jwRows.map(r => ({ ...r, type: 'job_work' })));

        } else {
          // --- CONTENT WRITER ---
          // Query Monthly Deliverables assigned to Content Writer (joining content_calendar for work_link/submission_status)
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
            WHERE d.content_writer_id = ? AND d.deleted_at IS NULL
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

          // Query Standalone Content Calendar items not in monthly deliverables
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

          // Query Event Days
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

          // Query Shoot Scripts
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

          // Query Job Works (assigned as content writer)
          let jwQuery = `
            SELECT id, activity_type_code, status, writer_completed_time_spent AS completed_time_spent, writer_started_at AS started_at, deadline, rework_count, assigned_employee_id, content_writer_id, google_drive_link, content_link, submitted_at
            FROM job_works
            WHERE content_writer_id = ?
          `;
          let jwParams = [emp.id];
          if (filterType === 'daily') {
            jwQuery += " AND DATE(deadline) = ?";
            jwParams.push(targetDate);
          } else {
            jwQuery += " AND DATE_FORMAT(deadline, '%Y-%m') = ?";
            jwParams.push(targetMonth);
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
            isCompleted = statusLower === 'posted';
          } else if (isWriter) {
            const isPending = subStatusLower === 'pending' || (!t.content_link && !t.work_link);
            const inRework = (reworkCount > 0 && isPending) || ['reassigned', 'rework', 'client_rework', 'in_rework'].includes(subStatusLower);
            const hasLink = Boolean((t.content_link && String(t.content_link).trim() !== '') || (t.work_link && String(t.work_link).trim() !== ''));
            const hasSubmittedStatus = ['submitted', 'approved', 'client_approved', 'posted', 'completed'].includes(subStatusLower);
            isCompleted = !inRework && (hasLink || hasSubmittedStatus || Boolean(t.submitted_at));
          } else {
            const isPending = statusLower === 'pending' || (!t.google_drive_link && !t.designer_output && !t.submitted_at);
            const inRework = (reworkCount > 0 && isPending) || ['reassigned', 'rework', 'client_rework', 'in_rework'].includes(statusLower);
            const hasLink = Boolean((t.google_drive_link && String(t.google_drive_link).trim() !== '') || (t.designer_output && String(t.designer_output).trim() !== ''));
            const hasSubmittedStatus = ['submitted', 'sent_to_client', 'client_approved', 'posted', 'completed'].includes(statusLower);
            isCompleted = !inRework && (hasLink || hasSubmittedStatus || Boolean(t.submitted_at));
          }

          // Fetch estimated time
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
            completed_est_mins += est_mins;
            let secs = Number(t.completed_time_spent || 0);
            total_comp_seconds += Math.max(0, secs);
          }
          total_est_mins += est_mins;
        });

        const completion_score = total_tasks > 0 ? ((completed_tasks / total_tasks) * 100) : 0;
        const time_score = completion_score;
        const overall_efficiency = Math.round(completion_score);

        efficiencyList.push({
          id: emp.id,
          full_name: emp.full_name,
          employee_id_code: emp.employee_id_code,
          sub_department_id: emp.sub_department_id,
          sub_department_name: emp.sub_department_name,
          department_name: emp.department_name,
          branch_name: emp.branch_name || 'N/A',
          total_tasks,
          completed_tasks,
          estimated_time: total_est_mins,
          completed_time: total_comp_seconds,
          time_score: Math.round(time_score),
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

  async getBranchDetails(req, res, next) {
    try {
      const { id } = req.params;
      const branchId = Number(id);

      const [branchRows] = await pool.query("SELECT * FROM branches WHERE id = ?", [branchId]);
      if (branchRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Branch location not found.',
          data: null,
          errors: ['Not found error']
        });
      }
      const branch = branchRows[0];

      const [admins] = await pool.query(
        "SELECT id, username, email, status, created_at FROM users WHERE role = 'admin' AND branch_id = ?", 
        [branchId]
      );

      const [managers] = await pool.query(`
        SELECT m.*, d.name AS department_name, u.email 
        FROM managers m
        JOIN users u ON m.user_id = u.id
        JOIN departments d ON m.department_id = d.id
        WHERE u.branch_id = ?
      `, [branchId]);

      const [employees] = await pool.query(`
        SELECT e.*, d.name AS department_name, u.email
        FROM employees e
        JOIN users u ON e.user_id = u.id
        JOIN departments d ON e.department_id = d.id
        WHERE u.branch_id = ?
      `, [branchId]);

      // Employee Efficiency
      const [efficiencies] = await pool.query(`
        SELECT 
            e.id,
            e.full_name,
            d.name AS department_name,
            (
              SELECT COUNT(*) 
              FROM monthly_deliverables md 
              WHERE md.assigned_employee_id = e.id AND md.status != 'pending' AND md.deleted_at IS NULL
            ) + (
              SELECT COUNT(*) 
              FROM job_works jw 
              WHERE jw.assigned_employee_id = e.id
            ) AS total_tasks,
            (
              SELECT COUNT(*) 
              FROM monthly_deliverables md 
              WHERE md.assigned_employee_id = e.id 
                AND md.status = 'client_approved'
            ) + (
              SELECT COUNT(*) 
              FROM job_works jw 
              WHERE jw.assigned_employee_id = e.id 
                AND jw.status = 'approved'
            ) AS completed_tasks
        FROM employees e
        JOIN users u ON e.user_id = u.id
        JOIN departments d ON e.department_id = d.id
        WHERE u.branch_id = ?
      `, [branchId]);

      const employeeEfficiency = efficiencies.map(emp => {
        const total = emp.total_tasks || 0;
        const completed = emp.completed_tasks || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          id: emp.id,
          full_name: emp.full_name,
          department_name: emp.department_name,
          total_tasks: total,
          completed_tasks: completed,
          efficiency: percentage
        };
      });

      // Manager Efficiency
      const [mgrEfficiencies] = await pool.query(`
        SELECT 
            m.id,
            m.full_name,
            d.name AS department_name,
            (
              SELECT COUNT(*) 
              FROM monthly_deliverables md 
              WHERE md.assigned_manager_id = m.id AND md.status != 'pending' AND md.deleted_at IS NULL
            ) + (
              SELECT COUNT(*) 
              FROM job_works jw 
              WHERE jw.assigned_manager_id = m.id
            ) AS total_tasks,
            (
              SELECT COUNT(*) 
              FROM monthly_deliverables md 
              WHERE md.assigned_manager_id = m.id 
                AND md.status = 'client_approved'
            ) + (
              SELECT COUNT(*) 
              FROM job_works jw 
              WHERE jw.assigned_manager_id = m.id 
                AND jw.status = 'approved'
            ) AS completed_tasks
        FROM managers m
        JOIN users u ON m.user_id = u.id
        JOIN departments d ON m.department_id = d.id
        WHERE u.branch_id = ?
      `, [branchId]);

      const managerEfficiency = mgrEfficiencies.map(mgr => {
        const total = mgr.total_tasks || 0;
        const completed = mgr.completed_tasks || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          id: mgr.id,
          full_name: mgr.full_name,
          department_name: mgr.department_name,
          total_tasks: total,
          completed_tasks: completed,
          efficiency: percentage
        };
      });

      // Branding Team (Creatives, ID 1) Workflow list
      const [brandingWorkflow] = await pool.query(`
        SELECT 
            'Monthly Plan' AS type,
            md.id,
            c.company_name AS client_name,
            md.deliverable AS task_name,
            md.due_date AS deadline,
            md.status,
            e.full_name AS employee_name,
            md.activity_code
        FROM monthly_deliverables md
        JOIN clients c ON md.client_id = c.id
        JOIN employees e ON md.assigned_employee_id = e.id
        JOIN users u ON e.user_id = u.id
        WHERE md.department_id = 1 AND u.branch_id = ?
        
        UNION ALL
        
        SELECT 
            'Job Work' AS type,
            jw.id,
            c.company_name AS client_name,
            CONCAT('Activity: ', jw.activity_type_code, ' (Qty: ', jw.quantity, ')') AS task_name,
            jw.deadline,
            jw.status,
            e.full_name AS employee_name,
            jw.activity_code
        FROM job_works jw
        JOIN clients c ON jw.client_id = c.id
        JOIN employees e ON jw.assigned_employee_id = e.id
        JOIN users u ON e.user_id = u.id
        WHERE u.branch_id = ?
        
        ORDER BY deadline ASC
      `, [branchId, branchId]);

      res.status(200).json({
        success: true,
        message: 'Branch drill-down details retrieved successfully.',
        data: {
          branch,
          admins,
          managers,
          employees,
          employeeEfficiency,
          managerEfficiency,
          brandingWorkflow
        },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const superAdminId = req.user.id;
      const { username, password } = req.body;

      if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      // Check if username already exists for another user
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username.trim(), superAdminId]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken.',
          data: null,
          errors: ['Conflict error']
        });
      }

      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 12);
        await pool.query(
          "UPDATE users SET username = ?, password = ? WHERE id = ?",
          [username.trim(), hashedPassword, superAdminId]
        );
      } else {
        await pool.query(
          "UPDATE users SET username = ? WHERE id = ?",
          [username.trim(), superAdminId]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: { username: username.trim() },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SuperAdminController();
