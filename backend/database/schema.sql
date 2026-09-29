-- MySQL Schema for ReachSkyline ERP Admin Module
-- Database: reachskyline_erp

CREATE DATABASE IF NOT EXISTS reachskyline_erp;
USE reachskyline_erp;

-- Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NULL DEFAULT NULL,
    address TEXT NULL DEFAULT NULL,
    phone VARCHAR(50) NULL DEFAULT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table (Unified authentication and base profile table)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    plain_password VARCHAR(255) NULL DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('super_admin', 'admin', 'hr', 'manager', 'employee', 'client') NOT NULL DEFAULT 'employee',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    branch_id INT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status_role (status, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_dept_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Managers Table
CREATE TABLE IF NOT EXISTS managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    manager_id_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    sub_department_id INT NULL,
    branch VARCHAR(100),
    joining_date DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    profile_image MEDIUMTEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (sub_department_id) REFERENCES sub_departments(id) ON DELETE SET NULL,
    INDEX idx_manager_code (manager_id_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sub-Departments Table
CREATE TABLE IF NOT EXISTS sub_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    employee_id_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    sub_department_id INT NULL,
    reporting_manager_id INT NULL,
    joining_date DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    profile_image MEDIUMTEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (sub_department_id) REFERENCES sub_departments(id) ON DELETE SET NULL,
    FOREIGN KEY (reporting_manager_id) REFERENCES managers(id) ON DELETE SET NULL,
    INDEX idx_employee_code (employee_id_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HR Table
CREATE TABLE IF NOT EXISTS hr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hr_id_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    joining_date DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    profile_image MEDIUMTEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_hr_code (hr_id_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(100) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    website VARCHAR(100),
    gst_number VARCHAR(15),
    contact_person VARCHAR(100) DEFAULT NULL,
    contact_phone VARCHAR(20) DEFAULT NULL,
    industry VARCHAR(100),
    start_date DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    notes TEXT,
    user_id INT NULL DEFAULT NULL,
    branch_id INT NULL DEFAULT NULL,
    profile_image MEDIUMTEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_client_code (client_id_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    client_id INT NOT NULL,
    department_id INT NOT NULL,
    manager_id INT NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'active', 'completed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES managers(id),
    INDEX idx_project_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliverable Templates Table
CREATE TABLE IF NOT EXISTS deliverable_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliverable Template Items Table
CREATE TABLE IF NOT EXISTS deliverable_template_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    department_id INT NOT NULL,
    deliverable VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    FOREIGN KEY (template_id) REFERENCES deliverable_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Monthly Deliverables Table
CREATE TABLE IF NOT EXISTS monthly_deliverables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    department_id INT NOT NULL,
    activity_type_code VARCHAR(20) DEFAULT NULL,
    activity_code VARCHAR(50) DEFAULT NULL,
    deliverable VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    assigned_manager_id INT NOT NULL,
    assigned_employee_id INT NOT NULL, -- Original Creative Designer
    smm_employee_id INT NULL DEFAULT NULL, -- Social Media Marketer assigned for posting
    content_writer_id INT NULL DEFAULT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    due_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    remarks TEXT,
    content_link VARCHAR(1024) DEFAULT NULL,
    google_drive_link VARCHAR(1024) DEFAULT NULL,
    designer_output VARCHAR(1024) DEFAULT NULL,
    manager_feedback_text TEXT DEFAULT NULL,
    manager_voice_base64 MEDIUMTEXT DEFAULT NULL,
    client_feedback_text TEXT DEFAULT NULL,
    client_voice_base64 MEDIUMTEXT DEFAULT NULL,
    started_at TIMESTAMP NULL DEFAULT NULL,
    writer_started_at TIMESTAMP NULL DEFAULT NULL,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    submitted_at TIMESTAMP NULL DEFAULT NULL,
    sent_to_client_at TIMESTAMP NULL DEFAULT NULL,
    client_action_at TIMESTAMP NULL DEFAULT NULL,
    posted_at TIMESTAMP NULL DEFAULT NULL,
    completed_time_spent INT NOT NULL DEFAULT 0,
    writer_completed_time_spent INT NOT NULL DEFAULT 0,
    rework_count INT NOT NULL DEFAULT 0,
    is_event_day TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (assigned_manager_id) REFERENCES managers(id),
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id),
    FOREIGN KEY (smm_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (content_writer_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_deliverable_month (month),
    INDEX idx_deliverable_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client Approvals Table
CREATE TABLE IF NOT EXISTS client_approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    request_date DATE NOT NULL,
    approval_date DATE NULL DEFAULT NULL,
    approved_by VARCHAR(100) NULL DEFAULT NULL,
    remarks TEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    INDEX idx_approval_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    assigned_to INT NOT NULL, -- FK to users
    due_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_task_due_status (due_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL DEFAULT NULL,
    message TEXT NOT NULL,
    type ENUM('employee_created', 'manager_created', 'hr_created', 'client_created', 'deliverables_assigned', 'deadline_reminder', 'project_delayed', 'client_approval_pending') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Types Table
CREATE TABLE IF NOT EXISTS activity_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type_code VARCHAR(20) NOT NULL UNIQUE,
    activity_name VARCHAR(100) NOT NULL,
    time_editor INT NOT NULL DEFAULT 0,
    time_content INT NOT NULL DEFAULT 0,
    editor_employees TEXT,
    content_employees TEXT,
    sub_department_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sub_department_id) REFERENCES sub_departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Default Activity Types
INSERT IGNORE INTO activity_types (activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees) VALUES
('AT001', 'Poster', 20, 5, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT002', 'Reel', 25, 10, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT003', 'Carosel', 30, 10, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT004', 'Shorts and Blogs', 90, 20, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT005', 'Longform', 150, 80, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT006', 'Event Day', 15, 5, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT007', 'Blog', 15, 30, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008'),
('AT008', 'Ad Shorts', 90, 10, 'E001, E002, E003, E004, E005, E009', 'E006, E007, E008');

-- Content Calendar Table
CREATE TABLE IF NOT EXISTS content_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    activity_type_code VARCHAR(20) NOT NULL,
    activity_code VARCHAR(50) NULL DEFAULT NULL,
    date DATE NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('draft', 'approved', 'sent_to_employees', 'sent_to_manager') NOT NULL DEFAULT 'draft',
    assigned_employee_id INT DEFAULT NULL,
    work_link VARCHAR(1024) DEFAULT NULL,
    submission_status ENUM('pending', 'submitted', 'approved') NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP NULL DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    voice_note MEDIUMTEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_calendar_month (month),
    INDEX idx_calendar_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Calendar Skip Dates Table
CREATE TABLE IF NOT EXISTS calendar_skip_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(7) NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_month_date (month, date),
    INDEX idx_skip_month (month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event Days Table
CREATE TABLE IF NOT EXISTS event_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(7) NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('draft', 'sent_to_manager', 'sent_to_employee') NOT NULL DEFAULT 'draft',
    event_type ENUM('event_day', 'national_day', 'international_day', 'celebrity_birthday', 'festival_state', 'festival_national') NOT NULL DEFAULT 'event_day',
    assigned_employee_id INT DEFAULT NULL,
    work_link VARCHAR(1024) DEFAULT NULL,
    submission_status ENUM('pending', 'submitted', 'approved') NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP NULL DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    voice_note MEDIUMTEXT DEFAULT NULL,
    created_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_month (month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event Day Client Deliverables Table
CREATE TABLE IF NOT EXISTS event_day_client_deliverables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_day_id INT NOT NULL,
    client_id INT NOT NULL,
    activity_type_code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_day_id) REFERENCES event_days(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_type_code) REFERENCES activity_types(activity_type_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shoot Scripts Table
CREATE TABLE IF NOT EXISTS shoot_scripts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    assigned_employee_id INT NOT NULL,
    month VARCHAR(7) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    work_link VARCHAR(1024) NULL,
    submission_status ENUM('pending', 'submitted', 'approved') NOT NULL DEFAULT 'pending',
    remarks TEXT DEFAULT NULL,
    voice_note MEDIUMTEXT DEFAULT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Monthly Deliverables Grid Table
CREATE TABLE IF NOT EXISTS monthly_deliverables_grid (
    client_id INT NOT NULL,
    month VARCHAR(7) NOT NULL,
    posters INT NOT NULL DEFAULT 0,
    reels INT NOT NULL DEFAULT 0,
    yts INT NOT NULL DEFAULT 0,
    yt INT NOT NULL DEFAULT 0,
    posted_day VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (client_id, month),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Monthly Blogs Grid Table
CREATE TABLE IF NOT EXISTS monthly_blogs_grid (
    client_id INT NOT NULL,
    month VARCHAR(7) NOT NULL,
    blogs_count INT NOT NULL DEFAULT 0,
    gmb_count INT NOT NULL DEFAULT 0,
    backlink_count INT NOT NULL DEFAULT 0,
    posted_day VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (client_id, month),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Works Table
CREATE TABLE IF NOT EXISTS job_works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    activity_type_code VARCHAR(20) NOT NULL,
    activity_code VARCHAR(50) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    deadline DATETIME NOT NULL,
    assigned_manager_id INT NULL,
    content_writer_id INT NULL,
    assigned_employee_id INT NULL,
    smm_employee_id INT NULL,
    google_drive_link VARCHAR(1024) DEFAULT NULL,
    content_link VARCHAR(1024) DEFAULT NULL,
    manager_feedback_text TEXT DEFAULT NULL,
    manager_voice_base64 MEDIUMTEXT DEFAULT NULL,
    client_feedback_text TEXT DEFAULT NULL,
    client_voice_base64 MEDIUMTEXT DEFAULT NULL,
    started_at TIMESTAMP NULL DEFAULT NULL,
    writer_started_at TIMESTAMP NULL DEFAULT NULL,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    sent_to_client_at TIMESTAMP NULL DEFAULT NULL,
    submitted_at TIMESTAMP NULL DEFAULT NULL,
    assigned_at TIMESTAMP NULL DEFAULT NULL,
    completed_time_spent INT NOT NULL DEFAULT 0,
    writer_completed_time_spent INT NOT NULL DEFAULT 0,
    rework_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_manager_id) REFERENCES managers(id) ON DELETE SET NULL,
    FOREIGN KEY (content_writer_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (smm_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (activity_type_code) REFERENCES activity_types(activity_type_code) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Work History Table
CREATE TABLE IF NOT EXISTS job_work_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_work_id INT NOT NULL,
    stage VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    user_name VARCHAR(100) DEFAULT NULL,
    is_job_work TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
