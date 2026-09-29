const pool = require('./config/db');

async function migrate() {
  try {
    console.log('Connecting to database...');
    const [cols] = await pool.query("SHOW COLUMNS FROM blog_calendar LIKE 'featured_image'");
    if (cols.length === 0) {
      await pool.query("ALTER TABLE blog_calendar ADD COLUMN featured_image VARCHAR(10) DEFAULT 'YES'");
      console.log('SUCCESS: Added featured_image column to blog_calendar table.');
    } else {
      console.log('INFO: featured_image column already exists in blog_calendar table.');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
