const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function resetToCleanState() {
  console.log('=====================================================');
  console.log('RESETTING REACHSKYLINE ERP TO CLEAN UNUSED DEMO STATE');
  console.log('=====================================================');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reachskyline_erp',
    multipleStatements: true
  });

  try {
    // 0. Execute schema.sql to ensure all tables exist
    const fs = require('fs');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
    }
    // Ensure branch_id columns exist on users and clients and role ENUM supports client
    try { await connection.query("ALTER TABLE users ADD COLUMN branch_id INT NULL DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE clients ADD COLUMN branch_id INT NULL DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE notifications ADD COLUMN user_id INT NULL DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE monthly_deliverables ADD COLUMN is_event_day TINYINT(1) NOT NULL DEFAULT 0;"); } catch (_) {}
    try { await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'hr', 'manager', 'employee', 'client') NOT NULL DEFAULT 'employee';"); } catch (_) {}
    try { await connection.query("ALTER TABLE monthly_deliverables MODIFY COLUMN assigned_employee_id INT NULL DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE shoot_scripts MODIFY COLUMN assigned_employee_id INT NULL DEFAULT NULL;"); } catch (_) {}

    // 1. Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2. Truncate all transactional and user entity tables
    const tablesToTruncate = [
      'job_work_history',
      'job_works',
      'monthly_deliverables',
      'monthly_deliverables_grid',
      'monthly_blogs_grid',
      'content_calendar',
      'calendar_skip_dates',
      'event_day_client_deliverables',
      'event_days',
      'shoot_scripts',
      'deliverable_template_items',
      'deliverable_templates',
      'client_approvals',
      'tasks',
      'projects',
      'clients',
      'notifications',
      'activity_logs',
      'user_push_subscriptions',
      'hr',
      'employees',
      'managers',
      'sub_departments',
      'departments',
      'activity_types',
      'branches',
      'users'
    ];

    console.log('Clearing existing data and resetting table IDs...');
    for (const table of tablesToTruncate) {
      await connection.query(`TRUNCATE TABLE \`${table}\`;`);
    }

    // 3. Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('All transactional tables cleared successfully.');

    // 4. Seed Default Branch
    console.log('\nSeeding Default Branch...');
    const [branchRes] = await connection.query(
      'INSERT INTO branches (name, code, address, phone, status) VALUES (?, ?, ?, ?, ?)',
      ['Headquarters', 'HQ-01', 'Head Office', '9999999999', 'active']
    );
    const defaultBranchId = branchRes.insertId;

    // 5. Seed Default Users (Super Admin & Admin)
    console.log('Seeding Core Admin Accounts...');
    const superAdminPasswordHash = await bcrypt.hash('SuperAdmin@123', 12);
    const [superAdminRes] = await connection.query(
      'INSERT INTO users (username, password, email, role, status, branch_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['superadmin', superAdminPasswordHash, 'superadmin@reachskyline.com', 'super_admin', 'active', defaultBranchId]
    );
    const superAdminUserId = superAdminRes.insertId;

    const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
    const [adminRes] = await connection.query(
      'INSERT INTO users (username, password, email, role, status, created_by, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['admin', adminPasswordHash, 'admin@reachskyline.com', 'admin', 'active', superAdminUserId, defaultBranchId]
    );
    const adminUserId = adminRes.insertId;

    // 6. Seed Core Departments
    console.log('\nSeeding Core Departments...');
    const [gdDeptRes] = await connection.query(
      'INSERT INTO departments (name, code, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
      ['Creatives', 'CD-RS', 'Handles content, creatives, graphic design and calendars', 'active', adminUserId]
    );
    const [smmDeptRes] = await connection.query(
      'INSERT INTO departments (name, code, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
      ['Social Media Marketing', 'SMM-RS', 'Handles social media marketing and publishing', 'active', adminUserId]
    );

    // 7. Seed Sub-Departments
    console.log('Seeding Core Sub-Departments...');
    const [cwSubRes] = await connection.query(
      'INSERT INTO sub_departments (department_id, name, code, created_by) VALUES (?, ?, ?, ?)',
      [gdDeptRes.insertId, 'Content Writing', 'CW-RS', adminUserId]
    );
    const [gdSubRes] = await connection.query(
      'INSERT INTO sub_departments (department_id, name, code, created_by) VALUES (?, ?, ?, ?)',
      [gdDeptRes.insertId, 'Graphic Design', 'GD-RS', adminUserId]
    );
    await connection.query(
      'INSERT INTO sub_departments (department_id, name, code, created_by) VALUES (?, ?, ?, ?)',
      [gdDeptRes.insertId, 'Video Editing', 'VE-RS', adminUserId]
    );

    // 8. Seed Default Activity Types
    console.log('Seeding Default Activity Types...');
    await connection.query(`
      INSERT INTO activity_types (activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees) VALUES
      ('AT001', 'Poster', 20, 5, '', ''),
      ('AT002', 'Reel', 25, 10, '', ''),
      ('AT003', 'Carousel', 30, 10, '', ''),
      ('AT004', 'Shorts and Blogs', 90, 20, '', ''),
      ('AT005', 'Longform', 150, 80, '', ''),
      ('AT006', 'Event Day', 15, 5, '', ''),
      ('AT007', 'Blog', 15, 30, '', ''),
      ('AT008', 'Ad Shorts', 90, 10, '', '');
    `);

    console.log('\n Pure Fresh Production Credentials:');
    console.log('   - Super Admin:        username=superadmin,   password=SuperAdmin@123');
    console.log('   - Admin:              username=admin,        password=Admin@123');

    console.log('\n=====================================================');
    console.log('SUCCESS: ERP Database is 100% clean and completely empty!');
    console.log('0 Clients, 0 Employees, 0 Managers, 0 Projects.');
    console.log('=====================================================\n');

  } catch (err) {
    console.error('DATABASE RESET ERROR:', err);
  } finally {
    await connection.end();
  }
}

resetToCleanState();
