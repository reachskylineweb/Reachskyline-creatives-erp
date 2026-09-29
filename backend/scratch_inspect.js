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
    const [subDepts] = await pool.query("SELECT * FROM sub_departments");
    console.log('Sub-departments:\n', subDepts);
    
    const [employees] = await pool.query(`
      SELECT e.id, e.full_name, e.employee_id_code, d.name AS dept_name, sd.name AS sub_dept_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
    `);
    console.log('\nEmployees:\n', employees);

    const [activityTypes] = await pool.query("SELECT * FROM activity_types");
    console.log('\nActivity Types:\n', activityTypes);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

query();
