const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, 'schema.sql');

async function runSeed() {
  console.log('Initializing database seeding...');
  
  // Connection without database to ensure DB creation
  const initConnection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    // Create database if not exists
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'reachskyline_erp'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database "${process.env.DB_NAME || 'reachskyline_erp'}" checked/created.`);
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await initConnection.end();
  }

  // Connection with database to execute schema
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reachskyline_erp',
    multipleStatements: true // Enable multiple statements for schema.sql
  });

  try {
    // Read and run schema.sql
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Creating database tables...');
    await connection.query(schemaSql);
    console.log('Tables created successfully.');

    // Seed default Admin User
    // Seed default Super Admin
    const [existingSuperAdmins] = await connection.query('SELECT * FROM users WHERE role = "super_admin"');
    let superAdminUserId = null;
    if (existingSuperAdmins.length === 0) {
      console.log('Seeding default Super Admin...');
      const superAdminPasswordHash = await bcrypt.hash('SuperAdmin@123', 12);
      const [insertResult] = await connection.query(
        'INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, ?, ?)',
        ['superadmin', superAdminPasswordHash, 'superadmin@reachskyline.com', 'super_admin', 'active']
      );
      superAdminUserId = insertResult.insertId;
      console.log('Default Super Admin seeded (username: superadmin, password: SuperAdmin@123).');
    } else {
      superAdminUserId = existingSuperAdmins[0].id;
      console.log('Super Admin account already exists.');
    }

    // Seed default Admin User
    const [existingAdmins] = await connection.query('SELECT * FROM users WHERE role = "admin"');
    let adminUserId = null;
    if (existingAdmins.length === 0) {
      console.log('Seeding default Admin...');
      const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
      const [insertResult] = await connection.query(
        'INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, ?, ?)',
        ['admin', adminPasswordHash, 'admin@reachskyline.com', 'admin', 'active']
      );
      adminUserId = insertResult.insertId;
      console.log('Default Admin seeded (username: admin, password: Admin@123).');
    } else {
      adminUserId = existingAdmins[0].id;
      console.log('Admin account already exists.');
    }

    // Seed Departments
    const [existingDepts] = await connection.query('SELECT * FROM departments');
    let gdDeptId, devDeptId, smmDeptId;
    if (existingDepts.length === 0) {
      console.log('Seeding Departments...');
      const [gdResult] = await connection.query(
        'INSERT INTO departments (name, code, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
        ['Creatives', 'CD-RS', 'Handles content, creatives, graphic design and calendars', 'active', adminUserId]
      );
      const [smmResult] = await connection.query(
        'INSERT INTO departments (name, code, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
        ['Social Media Marketing', 'SMM-RS', 'Handles social media marketing and publishing', 'active', adminUserId]
      );
      gdDeptId = gdResult.insertId;
      smmDeptId = smmResult.insertId;
      console.log('Departments seeded.');
    } else {
      gdDeptId = existingDepts.find(d => d.code === 'CD-RS')?.id;
      smmDeptId = existingDepts.find(d => d.code === 'SMM-RS')?.id;
      console.log('Departments already exist.');
    }

    console.log('All seed data checks and inserts completed successfully!');
  } catch (err) {
    console.error('Database seeding failed:', err);
  } finally {
    await connection.end();
  }
}

runSeed();
