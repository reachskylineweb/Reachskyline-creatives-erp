const pool = require('./config/db');

(async () => {
  try {
    const createSql = `
      CREATE TABLE IF NOT EXISTS blog_calendar (
        id INT NOT NULL AUTO_INCREMENT,
        client_id INT NOT NULL,
        date DATE NOT NULL,
        month VARCHAR(7) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('draft','approved','sent_to_employees') NOT NULL DEFAULT 'draft',
        type VARCHAR(50) DEFAULT 'blog',
        assigned_employee_id INT DEFAULT NULL,
        content_link TEXT,
        google_drive_link TEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_client_id (client_id),
        KEY idx_month (month),
        KEY idx_assigned_employee_id (assigned_employee_id),
        CONSTRAINT fk_blog_calendar_client FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createSql);
    console.log('SUCCESSFULLY_CREATED_BLOG_CALENDAR_TABLE');
    process.exit(0);
  } catch (err) {
    console.error('ERROR_CREATING_TABLE:', err);
    process.exit(1);
  }
})();
