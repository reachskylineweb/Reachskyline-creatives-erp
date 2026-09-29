const pool = require('./config/db');

async function fixStatusColumn() {
  try {
    console.log('Modifying status column enum in blog_calendar table...');
    await pool.query("ALTER TABLE blog_calendar MODIFY COLUMN status ENUM('draft', 'approved', 'sent_to_employees', 'assigned') NOT NULL DEFAULT 'draft'");
    console.log('SUCCESS: Altered status column to allow assigned!');
  } catch (err) {
    console.error('Error modifying column:', err.message);
  } finally {
    process.exit(0);
  }
}

fixStatusColumn();
