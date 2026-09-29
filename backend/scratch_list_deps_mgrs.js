const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function query() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [depts] = await pool.query("SELECT id, name, code FROM departments");
    console.log('Departments:', depts);

    const [mgrs] = await pool.query(
      `SELECT m.id, m.full_name, m.department_id, u.email, d.name AS dept_name
       FROM managers m
       JOIN users u ON m.user_id = u.id
       JOIN departments d ON m.department_id = d.id`
    );
    console.log('Managers:', mgrs);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

query();
