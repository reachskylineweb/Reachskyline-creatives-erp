const pool = require('./config/db');

async function checkTasks() {
  try {
    const [employees] = await pool.query("SELECT * FROM employees");
    console.log('All Employees:', employees.map(e => ({ id: e.id, user_id: e.user_id, full_name: e.full_name })));
    
    const [users] = await pool.query("SELECT * FROM users");
    console.log('All Users:', users.map(u => ({ id: u.id, username: u.username, role: u.role, role_title: u.role_title, full_name: u.full_name })));
    
    const [tasks] = await pool.query("SELECT * FROM blog_calendar WHERE assigned_employee_id IS NOT NULL");
    console.log('Assigned tasks in blog_calendar:', tasks);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkTasks();
