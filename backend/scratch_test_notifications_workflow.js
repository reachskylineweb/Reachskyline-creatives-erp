const pool = require('./config/db');
const notificationService = require('./services/notificationService');
const notificationRepository = require('./repositories/notificationRepository');

async function testWorkflowNotifications() {
  console.log('=== STARTING NOTIFICATION WORKFLOW VERIFICATION TEST ===\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${message}`);
    }
  }

  try {
    // 1. Verify notifications table schema
    const [cols] = await pool.query('DESCRIBE notifications');
    const hasUserId = cols.some(c => c.Field === 'user_id');
    assert(hasUserId, 'notifications table contains user_id column');

    // 2. Fetch sample users across roles (Admin, Manager, Employee, Client)
    const [admins] = await pool.query("SELECT id FROM users WHERE role = 'admin' AND deleted_at IS NULL LIMIT 1");
    const [managers] = await pool.query("SELECT m.id AS manager_id, m.user_id FROM managers m JOIN users u ON m.user_id = u.id WHERE m.status = 'active' LIMIT 1");
    const [employees] = await pool.query("SELECT e.id AS employee_id, e.user_id FROM employees e JOIN users u ON e.user_id = u.id WHERE e.status = 'active' LIMIT 2");
    const [clients] = await pool.query("SELECT c.id AS client_id, c.user_id FROM clients c JOIN users u ON c.user_id = u.id WHERE c.user_id IS NOT NULL LIMIT 1");

    assert(admins.length > 0, 'Admin user found in system');
    assert(managers.length > 0, 'Manager user found in system');
    assert(employees.length > 0, 'Employee user found in system');

    const adminUserId = admins[0] ? admins[0].id : 1;
    const managerObj = managers[0] || { manager_id: 1, user_id: 2 };
    const emp1Obj = employees[0] || { employee_id: 1, user_id: 3 };
    const emp2Obj = employees[1] || { employee_id: 2, user_id: 4 };

    console.log('\n--- Test Accounts ---');
    console.log(`Admin User ID: ${adminUserId}`);
    console.log(`Manager ID: ${managerObj.manager_id}, User ID: ${managerObj.user_id}`);
    console.log(`Employee 1 ID: ${emp1Obj.employee_id}, User ID: ${emp1Obj.user_id}`);
    console.log(`Employee 2 ID: ${emp2Obj.employee_id}, User ID: ${emp2Obj.user_id}\n`);

    // 3. Clean up test notifications
    await pool.query("DELETE FROM notifications WHERE message LIKE 'TEST_WORKFLOW_%'");

    // 4. Test Notification Isolation: Notify Manager
    await notificationService.notifyManager(
      managerObj.manager_id,
      'Test Job Work',
      'TEST_WORKFLOW_1: Admin assigned job work to manager',
      'deliverables_assigned',
      '/manager/job-works'
    );

    // Fetch notifications for Manager
    const mgrNotifs = await notificationRepository.getNotifications(managerObj.user_id, 'manager', 50);
    const mgrTest1 = mgrNotifs.find(n => n.message.includes('TEST_WORKFLOW_1'));
    assert(!!mgrTest1, 'Manager received TEST_WORKFLOW_1 notification in DB');

    // Fetch notifications for Employee 1 (should NOT see manager notification)
    const emp1Notifs = await notificationRepository.getNotifications(emp1Obj.user_id, 'employee', 50);
    const emp1Test1 = emp1Notifs.find(n => n.message.includes('TEST_WORKFLOW_1'));
    assert(!emp1Test1, 'Employee 1 did NOT receive Manager TEST_WORKFLOW_1 notification (Targeting verified)');

    // 5. Test Notification Isolation: Notify Employee 1 Only
    await notificationService.notifyEmployee(
      emp1Obj.employee_id,
      'Test Content Assignment',
      'TEST_WORKFLOW_2: Content Task assigned to Employee 1',
      'deliverables_assigned',
      '/employee/assigned-work'
    );

    const emp1NotifsAfter = await notificationRepository.getNotifications(emp1Obj.user_id, 'employee', 50);
    const emp1Test2 = emp1NotifsAfter.find(n => n.message.includes('TEST_WORKFLOW_2'));
    assert(!!emp1Test2, 'Employee 1 received TEST_WORKFLOW_2 notification');

    const emp2Notifs = await notificationRepository.getNotifications(emp2Obj.user_id, 'employee', 50);
    const emp2Test2 = emp2Notifs.find(n => n.message.includes('TEST_WORKFLOW_2'));
    assert(!emp2Test2, 'Employee 2 did NOT receive Employee 1 TEST_WORKFLOW_2 notification (Isolation verified)');

    // 6. Test Notification Isolation: Notify Admin
    await notificationService.notifyAdmins(
      'Test Calendar Approval',
      'TEST_WORKFLOW_3: Content Calendar approved by Creatives Manager',
      'calendar_approved',
      '/admin/deliverables'
    );

    const adminNotifs = await notificationRepository.getNotifications(adminUserId, 'admin', 50);
    const adminTest3 = adminNotifs.find(n => n.message.includes('TEST_WORKFLOW_3'));
    assert(!!adminTest3, 'Admin received TEST_WORKFLOW_3 notification');

    const mgrNotifsAfter = await notificationRepository.getNotifications(managerObj.user_id, 'manager', 50);
    const mgrTest3 = mgrNotifsAfter.find(n => n.message.includes('TEST_WORKFLOW_3'));
    assert(!mgrTest3, 'Manager did NOT receive Admin-only TEST_WORKFLOW_3 notification');

    // 7. Clean up test entries
    await pool.query("DELETE FROM notifications WHERE message LIKE 'TEST_WORKFLOW_%'");

    console.log(`\n=== VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    process.exit(0);
  }
}

testWorkflowNotifications();
