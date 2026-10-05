const pool = require('../config/db');

async function createCampaignRunsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS campaign_runs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      campaign_details TEXT NULL,
      platform ENUM('meta', 'google', 'both') NOT NULL DEFAULT 'meta',
      has_no_end_date TINYINT(1) NOT NULL DEFAULT 0,
      start_date DATE NOT NULL,
      end_date DATE NULL,
      total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      creatives_text TEXT NULL,
      creatives_url VARCHAR(500) NULL,
      creatives_status ENUM('pending_review', 'approved', 'changes_requested') NOT NULL DEFAULT 'pending_review',
      creatives_notes TEXT NULL,
      daily_budget DECIMAL(12,2) NULL,
      campaign_type ENUM('lead_form', 'whatsapp_number', 'awareness', 'call_ad', 'website_link') NULL,
      campaign_type_target VARCHAR(500) NULL,
      assigned_manager_id INT NULL,
      assigned_employee_id INT NULL,
      status ENUM('pending_manager_review', 'assigned', 'running', 'paused', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_manager_review',
      live_campaign_url VARCHAR(500) NULL,
      employee_notes TEXT NULL,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL,
      INDEX idx_client (client_id),
      INDEX idx_status (status),
      INDEX idx_manager (assigned_manager_id),
      INDEX idx_employee (assigned_employee_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.query(sql);
    console.log('campaign_runs table created or verified successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating campaign_runs table:', err);
    process.exit(1);
  }
}

createCampaignRunsTable();
