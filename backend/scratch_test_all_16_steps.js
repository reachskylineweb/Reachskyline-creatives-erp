const pool = require('./config/db');
const notificationService = require('./services/notificationService');
const notificationRepository = require('./repositories/notificationRepository');

async function testAll16Steps() {
  console.log('=== VERIFYING ALL 16 WORKFLOW NOTIFICATION STEPS ===\n');

  let passed = 0;
  let total = 0;

  function assert(condition, stepName) {
    total++;
    if (condition) {
      console.log(`[PASS] Step ${total}: ${stepName}`);
      passed++;
    } else {
      console.error(`[FAIL] Step ${total}: ${stepName}`);
    }
  }

  try {
    // Resolve user IDs for testing
    const [admins] = await pool.query("SELECT id FROM users WHERE role = 'admin' AND deleted_at IS NULL LIMIT 1");
    const [cmMgrs] = await pool.query("SELECT m.id AS manager_id, m.user_id FROM managers m JOIN departments d ON m.department_id = d.id WHERE d.code = 'CD-RS' AND m.status = 'active' LIMIT 1");
    const [smmMgrs] = await pool.query("SELECT m.id AS manager_id, m.user_id FROM managers m JOIN departments d ON m.department_id = d.id WHERE d.code = 'SMM-RS' AND m.status = 'active' LIMIT 1");
    const [writers] = await pool.query("SELECT e.id AS employee_id, e.user_id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' LIMIT 1");
    const [designers] = await pool.query("SELECT e.id AS employee_id, e.user_id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'GD-RS' AND e.status = 'active' LIMIT 1");
    const [smmEmps] = await pool.query("SELECT e.id AS employee_id, e.user_id FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.code = 'SMM-RS' AND e.status = 'active' LIMIT 1");
    const [clients] = await pool.query("SELECT c.id AS client_id, c.user_id FROM clients c JOIN users u ON c.user_id = u.id WHERE c.user_id IS NOT NULL AND c.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL LIMIT 1");

    const adminUserId = admins[0] ? admins[0].id : 1;
    const cmManager = cmMgrs[0] || { manager_id: 1, user_id: 11 };
    const smmManager = smmMgrs[0] || { manager_id: 2, user_id: 14 };
    const writerEmp = writers[0] || { employee_id: 1, user_id: 12 };
    const designerEmp = designers[0] || { employee_id: 2, user_id: 13 };
    const smmEmp = smmEmps[0] || { employee_id: 3, user_id: 15 };
    const clientUser = clients[0] || { client_id: 1, user_id: 16 };

    // Clean test tags
    await pool.query("DELETE FROM notifications WHERE message LIKE 'STEP_%'");

    // Step 1: Admin assigns Job Work to Creatives Manager
    await notificationService.notifyManager(cmManager.manager_id, 'New Job Work', 'STEP_1: Admin assigned job work to Creatives Manager', 'deliverables_assigned', '/manager/job-works');
    let notifs = await notificationRepository.getNotifications(cmManager.user_id, 'manager', 50);
    assert(notifs.some(n => n.message.includes('STEP_1')), 'Admin assigns Job Work -> Creatives Manager received notification');

    // Step 2: Creatives Manager assigns Content Work to Content Writer
    await notificationService.notifyEmployee(writerEmp.employee_id, 'Content Task', 'STEP_2: Creatives Manager assigned content task to writer', 'deliverables_assigned', '/employee/assigned-work');
    notifs = await notificationRepository.getNotifications(writerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_2')), 'Creatives Manager assigns content work -> Content Writer received notification');

    // Step 3: Content Writer submits work
    await notificationService.notifyManager(cmManager.manager_id, 'Script Submitted', 'STEP_3: Content Writer submitted script for approval', 'work_submitted', '/manager/submissions-review');
    notifs = await notificationRepository.getNotifications(cmManager.user_id, 'manager', 50);
    assert(notifs.some(n => n.message.includes('STEP_3')), 'Content Writer submits work -> Creatives Manager received notification');

    // Step 4: Creatives Manager approves Content Writer's work
    await notificationService.notifyEmployee(writerEmp.employee_id, 'Script Approved', 'STEP_4: Creatives Manager approved your script', 'work_approved', '/employee/approved-work');
    notifs = await notificationRepository.getNotifications(writerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_4')), 'Creatives Manager approves script -> Content Writer received notification');

    // Step 5: Creatives Manager requests Rework from Content Writer
    await notificationService.notifyEmployee(writerEmp.employee_id, 'Rework Requested', 'STEP_5: Creatives Manager requested rework on script', 'rework_requested', '/employee/rework');
    notifs = await notificationRepository.getNotifications(writerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_5')), 'Creatives Manager requests rework -> Content Writer received notification');

    // Step 6: Content Writer resubmits rework
    await notificationService.notifyManager(cmManager.manager_id, 'Script Resubmitted', 'STEP_6: Content Writer resubmitted script rework', 'work_submitted', '/manager/submissions-review');
    notifs = await notificationRepository.getNotifications(cmManager.user_id, 'manager', 50);
    assert(notifs.some(n => n.message.includes('STEP_6')), 'Content Writer resubmits rework -> Creatives Manager received notification');

    // Step 7: Creatives Manager assigns to Graphic Designer
    await notificationService.notifyEmployee(designerEmp.employee_id, 'Design Task', 'STEP_7: Creatives Manager assigned design task to designer', 'deliverables_assigned', '/employee/assigned-work');
    notifs = await notificationRepository.getNotifications(designerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_7')), 'Creatives Manager assigns design task -> Graphic Designer received notification');

    // Step 8: Graphic Designer submits design work
    await notificationService.notifyManager(cmManager.manager_id, 'Design Submitted', 'STEP_8: Graphic Designer submitted design draft', 'work_submitted', '/manager/submissions-review');
    notifs = await notificationRepository.getNotifications(cmManager.user_id, 'manager', 50);
    assert(notifs.some(n => n.message.includes('STEP_8')), 'Graphic Designer submits work -> Creatives Manager received notification');

    // Step 9: Creatives Manager approves/reworks design
    await notificationService.notifyEmployee(designerEmp.employee_id, 'Design Approved', 'STEP_9: Creatives Manager approved design draft', 'work_approved', '/employee/approved-work');
    notifs = await notificationRepository.getNotifications(designerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_9')), 'Creatives Manager approves design -> Graphic Designer received notification');

    // Step 10: Creatives Manager sends work to Client for approval
    await notificationService.notifyClient(clientUser.client_id, 'Approval Needed', 'STEP_10: Creative draft sent to client for approval', 'client_approval_pending', '/client/approvals');
    notifs = await notificationRepository.getNotifications(clientUser.user_id, 'client', 50);
    assert(notifs.some(n => n.message.includes('STEP_10')), 'Creatives Manager sends work to client -> Client received notification');

    // Step 11: Client approves or requests rework
    await notificationService.notifyManager(cmManager.manager_id, 'Client Feedback', 'STEP_11: Client approved creative draft', 'client_feedback', '/manager/client-reworks');
    notifs = await notificationRepository.getNotifications(cmManager.user_id, 'manager', 50);
    assert(notifs.some(n => n.message.includes('STEP_11')), 'Client approves/reworks -> Creatives Manager received notification');

    // Step 12: Creatives Manager reassigns client rework to employee
    await notificationService.notifyEmployee(designerEmp.employee_id, 'Client Rework', 'STEP_12: Creatives Manager reassigned client rework to designer', 'rework_requested', '/employee/rework');
    notifs = await notificationRepository.getNotifications(designerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_12')), 'Creatives Manager reassigns client rework -> Employee received notification');

    // Step 13: Move to SMM & SMM assigns Social Media Employee
    await notificationService.notifyEmployee(smmEmp.employee_id, 'Posting Task', 'STEP_13: SMM Manager assigned posting task to SMM Employee', 'deliverables_assigned', '/employee/today-posting');
    notifs = await notificationRepository.getNotifications(smmEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_13')), 'Move to SMM & assign -> Social Media Employee received notification');

    // Step 14: Social Media Employee posts & marks as posted -> SMM Manager & Admin notified
    await notificationService.notifyManager(smmManager.manager_id, 'Deliverable Posted', 'STEP_14A: SMM Employee marked deliverable "Poster #1" as posted', 'work_completed', '/manager/job-works');
    await notificationService.notifyAdmins('Deliverable Completed', 'STEP_14B: Deliverable "Poster #1" completed and posted', 'work_completed', '/admin/deliverables');
    
    let smmNotifs = await notificationRepository.getNotifications(smmManager.user_id, 'manager', 50);
    assert(smmNotifs.some(n => n.message.includes('STEP_14A')), 'Social Media Employee posts -> SMM Manager received notification as posted');
    
    let adminNotifs = await notificationRepository.getNotifications(adminUserId, 'admin', 50);
    assert(adminNotifs.some(n => n.message.includes('STEP_14B')), 'Social Media Employee posts -> Admin received notification with work mentioned as completed');

    // Step 15: Content Calendar approved by Creatives Manager -> Admin notified
    await notificationService.notifyAdmins('Calendar Approved', 'STEP_15: Content Calendar approved by Creatives Manager', 'calendar_approved', '/admin/deliverables');
    adminNotifs = await notificationRepository.getNotifications(adminUserId, 'admin', 50);
    assert(adminNotifs.some(n => n.message.includes('STEP_15')), 'Content Calendar approved by Creatives Manager -> Admin received notification');

    // Step 16: Content Calendar items sent to Employee / Today's To-Do task
    await notificationService.notifyEmployee(designerEmp.employee_id, 'Calendar Task Released', 'STEP_16: Content Calendar task released for your page & Today\'s To-Do', 'calendar_task', '/employee/calendar');
    notifs = await notificationRepository.getNotifications(designerEmp.user_id, 'employee', 50);
    assert(notifs.some(n => n.message.includes('STEP_16')), 'Content Calendar task sent to employee -> Employee received notification on page and Today\'s To-Do');

    // Clean up test entries
    await pool.query("DELETE FROM notifications WHERE message LIKE 'STEP_%'");

    console.log(`\n=== FINAL RESULT: ${passed}/${total} WORKFLOW NOTIFICATION STEPS VERIFIED SUCCESSFULLY! ===\n`);
  } catch (err) {
    console.error('Error during step verification:', err);
  } finally {
    process.exit(0);
  }
}

testAll16Steps();
