-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 01, 2026 at 03:02 PM
-- Server version: 10.11.18-MariaDB-cll-lve
-- PHP Version: 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pgipffom_reachskyline_erp_creatives`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `created_at`) VALUES
(3, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:37:58'),
(4, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:40:53'),
(5, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:41:32'),
(6, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:42:06'),
(7, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:42:18'),
(8, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:42:54'),
(9, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:43:53'),
(10, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:44:43'),
(11, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 09:45:04'),
(12, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 10:03:31'),
(13, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 10:04:07'),
(14, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 10:09:17'),
(15, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 10:09:54'),
(16, 3, 'Delete Client', 'Client \"Reachskyline\" (C0001) was completely deleted.', '2026-08-31 10:10:04'),
(17, 3, 'Create Client', 'Client company \"Madras Coffee House\" (C0001) created.', '2026-08-31 10:13:09'),
(18, 3, 'Update Client', 'Client company \"Madras Coffee House\" (C0001) was updated.', '2026-08-31 10:13:09'),
(19, 3, 'Create Client', 'Client company \"GEM Hospital Chennai\" (C0002) created.', '2026-08-31 10:18:37'),
(20, 3, 'Update Client', 'Client company \"GEM Hospital Chennai\" (C0002) was updated.', '2026-08-31 10:21:18'),
(21, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-08-31 11:16:26'),
(22, 3, 'Create Client', 'Client company \"supreme\" (C0003) created.', '2026-08-31 11:21:50'),
(23, 3, 'Update Client', 'Client company \"Madras Coffee House\" (C0001) was updated.', '2026-08-31 11:22:21'),
(24, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:25:41'),
(25, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:25:41'),
(26, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:26:09'),
(27, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:26:09'),
(28, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:28:26'),
(29, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:28:26'),
(30, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:28:44'),
(31, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:29:11'),
(32, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:29:11'),
(33, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:29:37'),
(34, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:29:44'),
(35, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:30:16'),
(36, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:30:16'),
(37, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:31:55'),
(38, 3, 'Update Client', 'Client company \"Supreme Hospital\" (C0003) was updated.', '2026-08-31 11:32:03'),
(39, 3, 'Create Client', 'Client company \"Ramnath Bhagavath\" (C0004) created.', '2026-08-31 11:34:18'),
(40, 3, 'Update Client', 'Client company \"Ramnath Bhagavath\" (C0004) was updated.', '2026-08-31 11:34:18'),
(41, 3, 'Create Client', 'Client company \"Hercyclopedia\" (C0005) created.', '2026-08-31 11:36:28'),
(42, 3, 'Create Client', 'Client company \"Brigantine\" (C0006) created.', '2026-08-31 11:38:24'),
(43, 3, 'Create Client', 'Client company \"GEM Restaurant\" (C0007) created.', '2026-08-31 11:40:03'),
(44, 3, 'Create Client', 'Client company \"stardome\" (C0008) created.', '2026-08-31 11:45:22'),
(45, 3, 'Update Client', 'Client company \"GEM Restaurant\" (C0007) was updated.', '2026-08-31 11:46:25'),
(46, 3, 'Create Client', 'Client company \"RK Hospitality\" (C0009) created.', '2026-08-31 11:52:09'),
(47, 3, 'Update Client', 'Client company \"Ramnath Bhagavath\" (C0004) was updated.', '2026-08-31 11:52:20'),
(48, 3, 'Create Client', 'Client company \"GEM Liver \" (C0010) created.', '2026-08-31 11:59:22'),
(49, 3, 'Update Client', 'Client company \"GEM Liver \" (C0010) was updated.', '2026-08-31 11:59:22'),
(50, 3, 'Create Client', 'Client company \"SCSVMV University\" (C0011) created.', '2026-08-31 12:07:48'),
(51, 3, 'Create Client', 'Client company \"Rajesh Personal Branding\" (C0012) created.', '2026-08-31 12:24:27'),
(52, 3, 'Create Client', 'Client company \"Dr. Senthilnathan\" (C0013) created.', '2026-08-31 12:28:26'),
(53, 3, 'Create Client', 'Client company \"D- Medva\" (C0014) created.', '2026-08-31 12:32:50'),
(54, 3, 'Create Client', 'Client company \"MSPVL\" (C0015) created.', '2026-08-31 12:38:23'),
(55, 3, 'Create Client', 'Client company \"Bell Match\" (C0016) created.', '2026-08-31 13:49:57'),
(56, 3, 'Create Client', 'Client company \"Zing International School\" (C0017) created.', '2026-08-31 13:56:53'),
(57, 3, 'Update Client', 'Client company \"Zing International School\" (C0017) was updated.', '2026-08-31 13:58:29'),
(58, 3, 'Delete Client', 'Client \"Zing International School\" (C0017) was completely deleted.', '2026-08-31 14:02:46'),
(59, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-09-01 02:49:14'),
(60, 3, 'Create Client', 'Client company \"ReachSkyline\" (C0017) created.', '2026-09-01 02:56:02'),
(61, 3, 'Create Client', 'Client company \"GEM Hospital  Dr. Ajay pai \" (C0018) created.', '2026-09-01 03:01:55'),
(62, 3, 'Update Client', 'Client company \"RK Grande\" (C0009) was updated.', '2026-09-01 03:14:00'),
(63, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 03:19:40'),
(64, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 03:20:01'),
(65, 3, 'Update Client', 'Client company \"GEM  Hospital Chennai - Liver \" (C0010) was updated.', '2026-09-01 03:20:28'),
(66, 3, 'Update Client', 'Client company \"GEM Hospital Chennai   Dr. Ajay pai \" (C0018) was updated.', '2026-09-01 03:20:55'),
(67, 3, 'Update Client', 'Client company \" GEM Hospital Chennai Dr. Senthilnathan\" (C0013) was updated.', '2026-09-01 03:21:16'),
(68, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 03:21:30'),
(69, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 04:51:43'),
(70, 3, 'Update Client', 'Client company \"Bell Match\" (C0016) was updated.', '2026-09-01 04:52:19'),
(71, 3, 'Create Client', 'Client company \"Bell Concept Selling\" (C0019) created.', '2026-09-01 04:54:47'),
(72, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 04:56:08'),
(73, 3, 'Create Client', 'Client company \"GEM Hospital Chennai podcast \" (C0020) created.', '2026-09-01 05:03:37'),
(74, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 05:04:38'),
(75, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-09-01 05:05:18'),
(76, 3, 'Save Monthly Grid', 'Saved monthly deliverables grid counts for month \"2026-09\".', '2026-09-01 05:05:43'),
(77, 3, 'Generate Calendar', 'Generated draft content calendar for month \"2026-09\" from monthly deliverables grid.', '2026-09-01 05:05:43'),
(78, 3, 'Create Sub-department', 'Sub-department \"Creative designer\" (CR-RS) was created.', '2026-09-01 05:06:56'),
(79, 3, 'User Login', 'User admin successfully logged into the Admin Portal.', '2026-09-01 07:18:14');

-- --------------------------------------------------------

--
-- Table structure for table `activity_types`
--

CREATE TABLE `activity_types` (
  `id` int(11) NOT NULL,
  `activity_type_code` varchar(20) NOT NULL,
  `activity_name` varchar(100) NOT NULL,
  `time_editor` int(11) NOT NULL DEFAULT 0,
  `time_content` int(11) NOT NULL DEFAULT 0,
  `editor_employees` text DEFAULT NULL,
  `content_employees` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sub_department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_types`
--

INSERT INTO `activity_types` (`id`, `activity_type_code`, `activity_name`, `time_editor`, `time_content`, `editor_employees`, `content_employees`, `created_at`, `updated_at`, `sub_department_id`) VALUES
(1, 'AT001', 'Poster', 20, 5, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(2, 'AT002', 'Reel', 25, 10, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(3, 'AT003', 'Carousel', 30, 10, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(4, 'AT004', 'Shorts and Blogs', 90, 20, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(5, 'AT005', 'Longform', 150, 80, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(6, 'AT006', 'Event Day', 15, 5, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(7, 'AT007', 'Blog', 15, 30, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL),
(8, 'AT008', 'Ad Shorts', 90, 10, '', '', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `calendar_skip_dates`
--

CREATE TABLE `calendar_skip_dates` (
  `id` int(11) NOT NULL,
  `month` varchar(20) DEFAULT NULL,
  `skip_date` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `skip_dates` text DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `client_id_code` varchar(20) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `client_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `start_date` date NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `profile_image` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_id_code`, `company_name`, `client_name`, `phone`, `email`, `address`, `website`, `gst_number`, `industry`, `start_date`, `status`, `notes`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `contact_person`, `contact_phone`, `user_id`, `profile_image`) VALUES
(2, 'C0001', 'Madras Coffee House', 'Chandra Prabha', '962504656', NULL, NULL, '', '', 'Food & Beverage', '2024-01-01', 'active', '', '2026-08-31 10:13:09', '2026-08-31 11:22:21', NULL, 3, 3, '', '', 4, NULL),
(3, 'C0002', 'GEM Hospital Chennai', 'Rajesh ', '7358668341', '', '', '', '', 'Healthcare', '2024-01-01', 'active', '', '2026-08-31 10:18:37', '2026-08-31 10:21:18', NULL, 3, 3, 'Dharshan', '93443 92843', 5, NULL),
(8, 'C0003', 'Supreme Hospital', 'Grace ', '90470 16976', NULL, NULL, '', '', 'Healthcare', '2024-01-01', 'active', '', '2026-08-31 11:21:50', '2026-08-31 11:32:03', NULL, 3, 3, 'Dharshan', '9344392843', 12, NULL),
(9, 'C0004', 'Ramnath Bhagavath', 'Ramnath', '9884468285', NULL, NULL, '', '', 'Personal Branding', '2024-01-01', 'active', '', '2026-08-31 11:34:18', '2026-08-31 11:52:20', NULL, 3, 3, '', '', 13, NULL),
(10, 'C0005', 'Hercyclopedia', 'Rajesh', '7358668341', NULL, '', '', '', 'Healthcare', '2024-01-01', 'active', '', '2026-08-31 11:36:28', '2026-08-31 11:36:28', NULL, 3, NULL, 'Dharshan', '93443 92843', 14, NULL),
(11, 'C0006', 'Brigantine', 'Deepa', '9600233886', NULL, '', '', '', 'Marine Serivce', '2024-01-01', 'active', '', '2026-08-31 11:38:24', '2026-08-31 11:38:24', NULL, 3, NULL, 'Dharshan', '9344392843', 15, NULL),
(12, 'C0007', 'GEM Restaurant', 'Rajesh kumar', '9884478450', NULL, '', '', '', 'Food & Beverage', '2026-05-09', 'active', '', '2026-08-31 11:40:03', '2026-08-31 11:46:25', NULL, 3, 3, 'Dharshan', '9344392843', 16, NULL),
(13, 'C0008', 'stardome', 'Rajesh Kumar', '9884478450', NULL, '', '', '', 'Food & Beverage', '2026-05-09', 'active', '', '2026-08-31 11:45:22', '2026-08-31 11:45:22', NULL, 3, NULL, 'Dharshan', '9344392843', 17, NULL),
(14, 'C0009', 'RK Grande', 'Rajesh Kumar', '9884478450', NULL, '', '', '', 'Healthcare', '2026-05-09', 'active', '', '2026-08-31 11:52:09', '2026-09-01 03:14:00', NULL, 3, 3, 'Dharshan', '9884478450', 18, NULL),
(15, 'C0010', 'GEM  Hospital Chennai - Liver ', 'Hidyath', '80124 39716', 'client@reachskyline.com', NULL, '', '', 'Healthcare', '2024-01-01', 'active', '', '2026-08-31 11:59:22', '2026-09-01 03:20:28', NULL, 3, 3, '', '', 19, NULL),
(16, 'C0011', 'SCSVMV University', 'Vaishnavi', '7708678772', NULL, '', '', '', 'Education', '2024-01-01', 'active', '', '2026-08-31 12:07:48', '2026-08-31 12:07:48', NULL, 3, NULL, 'Dharshan', '9344392843', 20, NULL),
(17, 'C0012', 'Rajesh Personal Branding', 'Rajesh Kumar', '9884478450', NULL, '', '', '', 'personal Branding', '2026-05-09', 'active', '', '2026-08-31 12:24:27', '2026-08-31 12:24:27', NULL, 3, NULL, '', '', 21, NULL),
(18, 'C0013', ' GEM Hospital Chennai Dr. Senthilnathan', 'Dr. Babu Narayanan', '72992 52827', NULL, '', '', '', 'Healthcare', '2024-01-01', 'active', '', '2026-08-31 12:28:26', '2026-09-01 03:21:16', NULL, 3, 3, 'Dharshan', '9344392843', 22, NULL),
(19, 'C0014', 'D- Medva', 'Ram Kesavan', '8825597272', NULL, '', '', '', 'Hospitality', '2024-01-01', 'active', '', '2026-08-31 12:32:50', '2026-08-31 12:32:50', NULL, 3, NULL, 'Dharshan', '9344392843', 23, NULL),
(20, 'C0015', 'MSPVL', 'Ramesh', '9944578733', NULL, '', '', '', 'Education', '2024-01-01', 'active', '', '2026-08-31 12:38:23', '2026-08-31 12:38:23', NULL, 3, NULL, 'Dharshan', '9344392843', 24, NULL),
(21, 'C0016', 'Bell Match', 'Dhanasekaran', '7397637798', NULL, '', '', '', 'Retail', '2026-06-01', 'active', '', '2026-08-31 13:49:57', '2026-09-01 04:52:19', NULL, 3, 3, 'Dharshan', '9344392843', 25, NULL),
(23, 'C0017', 'ReachSkyline', 'Ram Kesavan', '8825597272', NULL, '', '', '', 'Digital Marketing', '2016-12-23', 'active', '', '2026-09-01 02:56:02', '2026-09-01 02:56:02', NULL, 3, NULL, 'Dharshan', '9344392843', 27, NULL),
(24, 'C0018', 'GEM Hospital Chennai   Dr. Ajay pai ', 'Dr. Babu Narayanan', '72992 52827', NULL, '', '', '', 'Hospitality', '2026-08-01', 'active', '', '2026-09-01 03:01:55', '2026-09-01 03:20:55', NULL, 3, 3, 'Dharshan', '93443 92843', 28, NULL),
(25, 'C0019', 'Bell Concept Selling', 'Dhanasekeran', '7397637798', NULL, '', '', '', 'Retail', '2026-06-01', 'active', '', '2026-09-01 04:54:47', '2026-09-01 04:54:47', NULL, 3, NULL, 'Dharshan', '9344392843', 29, NULL),
(26, 'C0020', 'GEM Hospital Chennai podcast ', 'Dr. Babu Narayanan', '72992 52827', NULL, '', '', '', 'Hospitality', '2026-08-01', 'active', '', '2026-09-01 05:03:37', '2026-09-01 05:03:37', NULL, 3, NULL, 'Dharshan', '9344392843', 30, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_approvals`
--

CREATE TABLE `client_approvals` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `request_date` date NOT NULL,
  `approval_date` date DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `content_calendar`
--

CREATE TABLE `content_calendar` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `activity_type_code` varchar(20) NOT NULL,
  `activity_code` varchar(50) DEFAULT NULL,
  `date` date NOT NULL,
  `month` varchar(7) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('draft','approved','sent_to_employees','sent_to_manager') NOT NULL DEFAULT 'draft',
  `assigned_employee_id` int(11) DEFAULT NULL,
  `work_link` varchar(1024) DEFAULT NULL,
  `submission_status` enum('pending','submitted','approved') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `voice_note` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `rework_count` int(11) NOT NULL DEFAULT 0,
  `is_event_day` tinyint(1) DEFAULT 0,
  `event_day_title` varchar(255) DEFAULT NULL,
  `event_day_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_calendar`
--

INSERT INTO `content_calendar` (`id`, `client_id`, `activity_type_code`, `activity_code`, `date`, `month`, `title`, `description`, `status`, `assigned_employee_id`, `work_link`, `submission_status`, `submitted_at`, `remarks`, `voice_note`, `created_at`, `updated_at`, `started_at`, `completed_time_spent`, `rework_count`, `is_event_day`, `event_day_title`, `event_day_id`) VALUES
(1, 11, 'AT002', '6090006R1', '2026-09-01', '2026-09', 'Brigantine - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(2, 11, 'AT002', '6090006R2', '2026-09-04', '2026-09', 'Brigantine - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(3, 11, 'AT002', '6090006R3', '2026-09-08', '2026-09', 'Brigantine - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(4, 11, 'AT002', '6090006R4', '2026-09-11', '2026-09', 'Brigantine - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(5, 11, 'AT002', '6090006R5', '2026-09-15', '2026-09', 'Brigantine - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(6, 11, 'AT002', '6090006R6', '2026-09-18', '2026-09', 'Brigantine - Reel #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(7, 11, 'AT002', '6090006R7', '2026-09-22', '2026-09', 'Brigantine - Reel #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(8, 11, 'AT002', '6090006R8', '2026-09-25', '2026-09', 'Brigantine - Reel #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(9, 26, 'AT005', '6090020L1', '2026-09-01', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(10, 26, 'AT005', '6090020L2', '2026-09-04', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(11, 26, 'AT005', '6090020L3', '2026-09-11', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(12, 26, 'AT005', '6090020L4', '2026-09-15', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(13, 26, 'AT005', '6090020L5', '2026-09-22', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(14, 26, 'AT005', '6090020L6', '2026-09-29', '2026-09', 'GEM Hospital Chennai podcast  - YouTube Long Video #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(15, 9, 'AT004', '6090004S1', '2026-09-01', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(16, 9, 'AT004', '6090004S2', '2026-09-04', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(17, 9, 'AT004', '6090004S3', '2026-09-08', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(18, 9, 'AT004', '6090004S4', '2026-09-11', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(19, 9, 'AT004', '6090004S5', '2026-09-15', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(20, 9, 'AT004', '6090004S6', '2026-09-18', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(21, 9, 'AT004', '6090004S7', '2026-09-22', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(22, 9, 'AT004', '6090004S8', '2026-09-25', '2026-09', 'Ramnath Bhagavath - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(23, 18, 'AT004', '6090013S1', '2026-09-02', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(24, 18, 'AT004', '6090013S2', '2026-09-05', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(25, 18, 'AT004', '6090013S3', '2026-09-09', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(26, 18, 'AT004', '6090013S4', '2026-09-12', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(27, 18, 'AT004', '6090013S5', '2026-09-16', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(28, 18, 'AT004', '6090013S6', '2026-09-19', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(29, 18, 'AT004', '6090013S7', '2026-09-23', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(30, 18, 'AT004', '6090013S8', '2026-09-26', '2026-09', ' GEM Hospital Chennai Dr. Senthilnathan - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(31, 25, 'AT002', '6090019R1', '2026-09-02', '2026-09', 'Bell Concept Selling - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(32, 25, 'AT001', '6090019P1', '2026-09-03', '2026-09', 'Bell Concept Selling - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(33, 25, 'AT002', '6090019R2', '2026-09-07', '2026-09', 'Bell Concept Selling - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(34, 25, 'AT001', '6090019P2', '2026-09-09', '2026-09', 'Bell Concept Selling - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(35, 25, 'AT002', '6090019R3', '2026-09-10', '2026-09', 'Bell Concept Selling - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(36, 25, 'AT001', '6090019P3', '2026-09-14', '2026-09', 'Bell Concept Selling - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(37, 25, 'AT002', '6090019R4', '2026-09-17', '2026-09', 'Bell Concept Selling - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(38, 25, 'AT001', '6090019P4', '2026-09-19', '2026-09', 'Bell Concept Selling - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(39, 25, 'AT002', '6090019R5', '2026-09-21', '2026-09', 'Bell Concept Selling - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(40, 25, 'AT002', '6090019R6', '2026-09-24', '2026-09', 'Bell Concept Selling - Reel #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(41, 25, 'AT002', '6090019R7', '2026-09-26', '2026-09', 'Bell Concept Selling - Reel #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(42, 25, 'AT002', '6090019R8', '2026-09-28', '2026-09', 'Bell Concept Selling - Reel #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(43, 21, 'AT001', '6090016P1', '2026-09-02', '2026-09', 'Bell Match - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(44, 21, 'AT004', '6090016S1', '2026-09-03', '2026-09', 'Bell Match - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(45, 21, 'AT001', '6090016P2', '2026-09-05', '2026-09', 'Bell Match - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(46, 21, 'AT004', '6090016S2', '2026-09-08', '2026-09', 'Bell Match - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(47, 21, 'AT001', '6090016P3', '2026-09-10', '2026-09', 'Bell Match - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(48, 21, 'AT004', '6090016S3', '2026-09-12', '2026-09', 'Bell Match - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(49, 21, 'AT001', '6090016P4', '2026-09-16', '2026-09', 'Bell Match - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(50, 21, 'AT004', '6090016S4', '2026-09-18', '2026-09', 'Bell Match - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(51, 21, 'AT001', '6090016P5', '2026-09-21', '2026-09', 'Bell Match - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(52, 21, 'AT001', '6090016P6', '2026-09-23', '2026-09', 'Bell Match - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(53, 21, 'AT001', '6090016P7', '2026-09-25', '2026-09', 'Bell Match - Poster #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(54, 21, 'AT001', '6090016P8', '2026-09-30', '2026-09', 'Bell Match - Poster #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(55, 19, 'AT001', '6090014P1', '2026-09-01', '2026-09', 'D- Medva - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(56, 19, 'AT002', '6090014R1', '2026-09-02', '2026-09', 'D- Medva - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(57, 19, 'AT001', '6090014P2', '2026-09-03', '2026-09', 'D- Medva - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(58, 19, 'AT005', '6090014L1', '2026-09-05', '2026-09', 'D- Medva - YouTube Long Video #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(59, 19, 'AT001', '6090014P3', '2026-09-07', '2026-09', 'D- Medva - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(60, 19, 'AT002', '6090014R2', '2026-09-08', '2026-09', 'D- Medva - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(61, 19, 'AT001', '6090014P4', '2026-09-09', '2026-09', 'D- Medva - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(62, 19, 'AT005', '6090014L2', '2026-09-11', '2026-09', 'D- Medva - YouTube Long Video #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(63, 19, 'AT001', '6090014P5', '2026-09-12', '2026-09', 'D- Medva - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(64, 19, 'AT002', '6090014R3', '2026-09-14', '2026-09', 'D- Medva - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(65, 19, 'AT001', '6090014P6', '2026-09-16', '2026-09', 'D- Medva - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(66, 19, 'AT005', '6090014L3', '2026-09-17', '2026-09', 'D- Medva - YouTube Long Video #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(67, 19, 'AT001', '6090014P7', '2026-09-18', '2026-09', 'D- Medva - Poster #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(68, 19, 'AT002', '6090014R4', '2026-09-19', '2026-09', 'D- Medva - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(69, 19, 'AT001', '6090014P8', '2026-09-22', '2026-09', 'D- Medva - Poster #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(70, 19, 'AT005', '6090014L4', '2026-09-23', '2026-09', 'D- Medva - YouTube Long Video #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(71, 19, 'AT001', '6090014P9', '2026-09-24', '2026-09', 'D- Medva - Poster #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(72, 19, 'AT002', '6090014R5', '2026-09-26', '2026-09', 'D- Medva - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(73, 19, 'AT001', '6090014P10', '2026-09-28', '2026-09', 'D- Medva - Poster #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(74, 19, 'AT005', '6090014L5', '2026-09-29', '2026-09', 'D- Medva - YouTube Long Video #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(75, 3, 'AT004', '6090002S1', '2026-09-01', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(76, 3, 'AT005', '6090002L1', '2026-09-02', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(77, 3, 'AT004', '6090002S2', '2026-09-03', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(78, 3, 'AT001', '6090002P1', '2026-09-04', '2026-09', 'GEM Hospital Chennai - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(79, 3, 'AT004', '6090002S3', '2026-09-05', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(80, 3, 'AT002', '6090002R1', '2026-09-07', '2026-09', 'GEM Hospital Chennai - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(81, 3, 'AT004', '6090002S4', '2026-09-08', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(82, 3, 'AT005', '6090002L2', '2026-09-09', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(83, 3, 'AT004', '6090002S5', '2026-09-10', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(84, 3, 'AT001', '6090002P2', '2026-09-11', '2026-09', 'GEM Hospital Chennai - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(85, 3, 'AT004', '6090002S6', '2026-09-12', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(86, 3, 'AT002', '6090002R2', '2026-09-14', '2026-09', 'GEM Hospital Chennai - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(87, 3, 'AT004', '6090002S7', '2026-09-15', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(88, 3, 'AT005', '6090002L3', '2026-09-16', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(89, 3, 'AT001', '6090002P3', '2026-09-17', '2026-09', 'GEM Hospital Chennai - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(90, 3, 'AT002', '6090002R3', '2026-09-18', '2026-09', 'GEM Hospital Chennai - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(91, 3, 'AT004', '6090002S8', '2026-09-19', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(92, 3, 'AT005', '6090002L4', '2026-09-21', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(93, 3, 'AT001', '6090002P4', '2026-09-22', '2026-09', 'GEM Hospital Chennai - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(94, 3, 'AT002', '6090002R4', '2026-09-23', '2026-09', 'GEM Hospital Chennai - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(95, 3, 'AT004', '6090002S9', '2026-09-24', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(96, 3, 'AT005', '6090002L5', '2026-09-25', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(97, 3, 'AT001', '6090002P5', '2026-09-26', '2026-09', 'GEM Hospital Chennai - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(98, 3, 'AT002', '6090002R5', '2026-09-28', '2026-09', 'GEM Hospital Chennai - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(99, 3, 'AT004', '6090002S10', '2026-09-29', '2026-09', 'GEM Hospital Chennai - Shorts and Blogs #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(100, 3, 'AT005', '6090002L6', '2026-09-30', '2026-09', 'GEM Hospital Chennai - YouTube Long Video #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(101, 24, 'AT004', '6090018S1', '2026-09-03', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(102, 24, 'AT004', '6090018S2', '2026-09-07', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(103, 24, 'AT004', '6090018S3', '2026-09-10', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(104, 24, 'AT004', '6090018S4', '2026-09-14', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(105, 24, 'AT004', '6090018S5', '2026-09-17', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(106, 24, 'AT004', '6090018S6', '2026-09-21', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(107, 24, 'AT004', '6090018S7', '2026-09-24', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(108, 24, 'AT004', '6090018S8', '2026-09-30', '2026-09', 'GEM Hospital Chennai   Dr. Ajay pai  - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(109, 12, 'AT004', '6090007S1', '2026-09-01', '2026-09', 'GEM Restaurant - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(110, 12, 'AT001', '6090007P1', '2026-09-02', '2026-09', 'GEM Restaurant - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(111, 12, 'AT004', '6090007S2', '2026-09-04', '2026-09', 'GEM Restaurant - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(112, 12, 'AT001', '6090007P2', '2026-09-07', '2026-09', 'GEM Restaurant - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(113, 12, 'AT004', '6090007S3', '2026-09-09', '2026-09', 'GEM Restaurant - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(114, 12, 'AT001', '6090007P3', '2026-09-12', '2026-09', 'GEM Restaurant - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(115, 12, 'AT004', '6090007S4', '2026-09-14', '2026-09', 'GEM Restaurant - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(116, 12, 'AT001', '6090007P4', '2026-09-16', '2026-09', 'GEM Restaurant - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(117, 12, 'AT004', '6090007S5', '2026-09-17', '2026-09', 'GEM Restaurant - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(118, 12, 'AT001', '6090007P5', '2026-09-19', '2026-09', 'GEM Restaurant - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(119, 12, 'AT004', '6090007S6', '2026-09-23', '2026-09', 'GEM Restaurant - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(120, 12, 'AT001', '6090007P6', '2026-09-24', '2026-09', 'GEM Restaurant - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(121, 12, 'AT004', '6090007S7', '2026-09-28', '2026-09', 'GEM Restaurant - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(122, 12, 'AT004', '6090007S8', '2026-09-29', '2026-09', 'GEM Restaurant - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(123, 10, 'AT001', '6090005P1', '2026-09-05', '2026-09', 'Hercyclopedia - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(124, 10, 'AT004', '6090005S1', '2026-09-10', '2026-09', 'Hercyclopedia - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(125, 10, 'AT001', '6090005P2', '2026-09-21', '2026-09', 'Hercyclopedia - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(126, 10, 'AT004', '6090005S2', '2026-09-30', '2026-09', 'Hercyclopedia - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(127, 2, 'AT002', '6090001R1', '2026-09-01', '2026-09', 'Madras Coffee House - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(128, 2, 'AT004', '6090001S1', '2026-09-02', '2026-09', 'Madras Coffee House - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(129, 2, 'AT002', '6090001R2', '2026-09-03', '2026-09', 'Madras Coffee House - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(130, 2, 'AT004', '6090001S2', '2026-09-04', '2026-09', 'Madras Coffee House - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(131, 2, 'AT002', '6090001R3', '2026-09-05', '2026-09', 'Madras Coffee House - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(132, 2, 'AT004', '6090001S3', '2026-09-08', '2026-09', 'Madras Coffee House - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(133, 2, 'AT001', '6090001P1', '2026-09-09', '2026-09', 'Madras Coffee House - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(134, 2, 'AT002', '6090001R4', '2026-09-10', '2026-09', 'Madras Coffee House - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(135, 2, 'AT004', '6090001S4', '2026-09-11', '2026-09', 'Madras Coffee House - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(136, 2, 'AT001', '6090001P2', '2026-09-14', '2026-09', 'Madras Coffee House - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(137, 2, 'AT002', '6090001R5', '2026-09-15', '2026-09', 'Madras Coffee House - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(138, 2, 'AT004', '6090001S5', '2026-09-16', '2026-09', 'Madras Coffee House - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(139, 2, 'AT001', '6090001P3', '2026-09-17', '2026-09', 'Madras Coffee House - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(140, 2, 'AT002', '6090001R6', '2026-09-19', '2026-09', 'Madras Coffee House - Reel #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(141, 2, 'AT004', '6090001S6', '2026-09-21', '2026-09', 'Madras Coffee House - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(142, 2, 'AT001', '6090001P4', '2026-09-22', '2026-09', 'Madras Coffee House - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(143, 2, 'AT002', '6090001R7', '2026-09-23', '2026-09', 'Madras Coffee House - Reel #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(144, 2, 'AT004', '6090001S7', '2026-09-25', '2026-09', 'Madras Coffee House - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(145, 2, 'AT001', '6090001P5', '2026-09-26', '2026-09', 'Madras Coffee House - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(146, 2, 'AT002', '6090001R8', '2026-09-28', '2026-09', 'Madras Coffee House - Reel #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(147, 2, 'AT004', '6090001S8', '2026-09-29', '2026-09', 'Madras Coffee House - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(148, 20, 'AT001', '6090015P1', '2026-09-30', '2026-09', 'MSPVL - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(149, 20, 'AT004', '6090015S1', '2026-09-01', '2026-09', 'MSPVL - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(150, 20, 'AT001', '6090015P2', '2026-09-02', '2026-09', 'MSPVL - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(151, 20, 'AT004', '6090015S2', '2026-09-03', '2026-09', 'MSPVL - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(152, 20, 'AT001', '6090015P3', '2026-09-04', '2026-09', 'MSPVL - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(153, 20, 'AT004', '6090015S3', '2026-09-05', '2026-09', 'MSPVL - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(154, 20, 'AT001', '6090015P4', '2026-09-07', '2026-09', 'MSPVL - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(155, 20, 'AT004', '6090015S4', '2026-09-08', '2026-09', 'MSPVL - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(156, 20, 'AT001', '6090015P5', '2026-09-09', '2026-09', 'MSPVL - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(157, 20, 'AT004', '6090015S5', '2026-09-10', '2026-09', 'MSPVL - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(158, 20, 'AT001', '6090015P6', '2026-09-11', '2026-09', 'MSPVL - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(159, 20, 'AT002', '6090015R1', '2026-09-12', '2026-09', 'MSPVL - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(160, 20, 'AT004', '6090015S6', '2026-09-14', '2026-09', 'MSPVL - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(161, 20, 'AT001', '6090015P7', '2026-09-15', '2026-09', 'MSPVL - Poster #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(162, 20, 'AT002', '6090015R2', '2026-09-16', '2026-09', 'MSPVL - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(163, 20, 'AT004', '6090015S7', '2026-09-17', '2026-09', 'MSPVL - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(164, 20, 'AT001', '6090015P8', '2026-09-18', '2026-09', 'MSPVL - Poster #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(165, 20, 'AT002', '6090015R3', '2026-09-19', '2026-09', 'MSPVL - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(166, 20, 'AT004', '6090015S8', '2026-09-21', '2026-09', 'MSPVL - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(167, 20, 'AT001', '6090015P9', '2026-09-22', '2026-09', 'MSPVL - Poster #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(168, 20, 'AT002', '6090015R4', '2026-09-23', '2026-09', 'MSPVL - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(169, 20, 'AT004', '6090015S9', '2026-09-24', '2026-09', 'MSPVL - Shorts and Blogs #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(170, 20, 'AT005', '6090015L1', '2026-09-25', '2026-09', 'MSPVL - YouTube Long Video #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(171, 20, 'AT001', '6090015P10', '2026-09-26', '2026-09', 'MSPVL - Poster #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(172, 20, 'AT002', '6090015R5', '2026-09-28', '2026-09', 'MSPVL - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(173, 20, 'AT004', '6090015S10', '2026-09-29', '2026-09', 'MSPVL - Shorts and Blogs #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(174, 20, 'AT005', '6090015L2', '2026-09-30', '2026-09', 'MSPVL - YouTube Long Video #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(175, 17, 'AT001', '6090012P1', '2026-09-03', '2026-09', 'Rajesh Personal Branding - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(176, 17, 'AT001', '6090012P2', '2026-09-07', '2026-09', 'Rajesh Personal Branding - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(177, 17, 'AT001', '6090012P3', '2026-09-08', '2026-09', 'Rajesh Personal Branding - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(178, 17, 'AT001', '6090012P4', '2026-09-12', '2026-09', 'Rajesh Personal Branding - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(179, 17, 'AT001', '6090012P5', '2026-09-18', '2026-09', 'Rajesh Personal Branding - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(180, 17, 'AT001', '6090012P6', '2026-09-19', '2026-09', 'Rajesh Personal Branding - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(181, 17, 'AT001', '6090012P7', '2026-09-24', '2026-09', 'Rajesh Personal Branding - Poster #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(182, 17, 'AT001', '6090012P8', '2026-09-26', '2026-09', 'Rajesh Personal Branding - Poster #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(183, 23, 'AT004', '6090017S1', '2026-09-15', '2026-09', 'ReachSkyline - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(184, 23, 'AT004', '6090017S2', '2026-09-01', '2026-09', 'ReachSkyline - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(185, 23, 'AT004', '6090017S3', '2026-09-02', '2026-09', 'ReachSkyline - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(186, 23, 'AT004', '6090017S4', '2026-09-03', '2026-09', 'ReachSkyline - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(187, 23, 'AT004', '6090017S5', '2026-09-04', '2026-09', 'ReachSkyline - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL);
INSERT INTO `content_calendar` (`id`, `client_id`, `activity_type_code`, `activity_code`, `date`, `month`, `title`, `description`, `status`, `assigned_employee_id`, `work_link`, `submission_status`, `submitted_at`, `remarks`, `voice_note`, `created_at`, `updated_at`, `started_at`, `completed_time_spent`, `rework_count`, `is_event_day`, `event_day_title`, `event_day_id`) VALUES
(188, 23, 'AT004', '6090017S6', '2026-09-05', '2026-09', 'ReachSkyline - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(189, 23, 'AT004', '6090017S7', '2026-09-25', '2026-09', 'ReachSkyline - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(190, 23, 'AT004', '6090017S8', '2026-09-07', '2026-09', 'ReachSkyline - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(191, 23, 'AT004', '6090017S9', '2026-09-08', '2026-09', 'ReachSkyline - Shorts and Blogs #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(192, 23, 'AT004', '6090017S10', '2026-09-09', '2026-09', 'ReachSkyline - Shorts and Blogs #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(193, 23, 'AT004', '6090017S11', '2026-09-10', '2026-09', 'ReachSkyline - Shorts and Blogs #11', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(194, 23, 'AT004', '6090017S12', '2026-09-11', '2026-09', 'ReachSkyline - Shorts and Blogs #12', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(195, 23, 'AT004', '6090017S13', '2026-09-28', '2026-09', 'ReachSkyline - Shorts and Blogs #13', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(196, 23, 'AT004', '6090017S14', '2026-09-12', '2026-09', 'ReachSkyline - Shorts and Blogs #14', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(197, 23, 'AT004', '6090017S15', '2026-09-14', '2026-09', 'ReachSkyline - Shorts and Blogs #15', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(198, 23, 'AT004', '6090017S16', '2026-09-15', '2026-09', 'ReachSkyline - Shorts and Blogs #16', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(199, 23, 'AT004', '6090017S17', '2026-09-16', '2026-09', 'ReachSkyline - Shorts and Blogs #17', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(200, 23, 'AT004', '6090017S18', '2026-09-17', '2026-09', 'ReachSkyline - Shorts and Blogs #18', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(201, 23, 'AT004', '6090017S19', '2026-09-29', '2026-09', 'ReachSkyline - Shorts and Blogs #19', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(202, 23, 'AT004', '6090017S20', '2026-09-18', '2026-09', 'ReachSkyline - Shorts and Blogs #20', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(203, 23, 'AT004', '6090017S21', '2026-09-19', '2026-09', 'ReachSkyline - Shorts and Blogs #21', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(204, 23, 'AT004', '6090017S22', '2026-09-21', '2026-09', 'ReachSkyline - Shorts and Blogs #22', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(205, 23, 'AT004', '6090017S23', '2026-09-22', '2026-09', 'ReachSkyline - Shorts and Blogs #23', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(206, 23, 'AT004', '6090017S24', '2026-09-23', '2026-09', 'ReachSkyline - Shorts and Blogs #24', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(207, 23, 'AT004', '6090017S25', '2026-09-30', '2026-09', 'ReachSkyline - Shorts and Blogs #25', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(208, 23, 'AT004', '6090017S26', '2026-09-24', '2026-09', 'ReachSkyline - Shorts and Blogs #26', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(209, 23, 'AT004', '6090017S27', '2026-09-25', '2026-09', 'ReachSkyline - Shorts and Blogs #27', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(210, 23, 'AT004', '6090017S28', '2026-09-26', '2026-09', 'ReachSkyline - Shorts and Blogs #28', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(211, 23, 'AT004', '6090017S29', '2026-09-28', '2026-09', 'ReachSkyline - Shorts and Blogs #29', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(212, 23, 'AT004', '6090017S30', '2026-09-29', '2026-09', 'ReachSkyline - Shorts and Blogs #30', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(213, 23, 'AT004', '6090017S31', '2026-09-30', '2026-09', 'ReachSkyline - Shorts and Blogs #31', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(214, 14, 'AT004', '6090009S1', '2026-09-04', '2026-09', 'RK Grande - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(215, 14, 'AT001', '6090009P1', '2026-09-05', '2026-09', 'RK Grande - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(216, 14, 'AT004', '6090009S2', '2026-09-10', '2026-09', 'RK Grande - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(217, 14, 'AT001', '6090009P2', '2026-09-16', '2026-09', 'RK Grande - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(218, 14, 'AT004', '6090009S3', '2026-09-21', '2026-09', 'RK Grande - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(219, 14, 'AT004', '6090009S4', '2026-09-25', '2026-09', 'RK Grande - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(220, 13, 'AT001', '6090008P1', '2026-09-07', '2026-09', 'stardome - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(221, 13, 'AT004', '6090008S1', '2026-09-09', '2026-09', 'stardome - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(222, 13, 'AT001', '6090008P2', '2026-09-17', '2026-09', 'stardome - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(223, 13, 'AT004', '6090008S2', '2026-09-23', '2026-09', 'stardome - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(224, 8, 'AT001', '6090003P1', '2026-09-11', '2026-09', 'Supreme Hospital - Poster #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(225, 8, 'AT002', '6090003R1', '2026-09-01', '2026-09', 'Supreme Hospital - Reel #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(226, 8, 'AT001', '6090003P2', '2026-09-02', '2026-09', 'Supreme Hospital - Poster #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(227, 8, 'AT002', '6090003R2', '2026-09-03', '2026-09', 'Supreme Hospital - Reel #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(228, 8, 'AT001', '6090003P3', '2026-09-12', '2026-09', 'Supreme Hospital - Poster #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(229, 8, 'AT002', '6090003R3', '2026-09-04', '2026-09', 'Supreme Hospital - Reel #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(230, 8, 'AT004', '6090003S1', '2026-09-05', '2026-09', 'Supreme Hospital - Shorts and Blogs #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(231, 8, 'AT001', '6090003P4', '2026-09-07', '2026-09', 'Supreme Hospital - Poster #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(232, 8, 'AT002', '6090003R4', '2026-09-14', '2026-09', 'Supreme Hospital - Reel #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(233, 8, 'AT004', '6090003S2', '2026-09-08', '2026-09', 'Supreme Hospital - Shorts and Blogs #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(234, 8, 'AT001', '6090003P5', '2026-09-09', '2026-09', 'Supreme Hospital - Poster #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(235, 8, 'AT002', '6090003R5', '2026-09-10', '2026-09', 'Supreme Hospital - Reel #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(236, 8, 'AT004', '6090003S3', '2026-09-15', '2026-09', 'Supreme Hospital - Shorts and Blogs #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(237, 8, 'AT005', '6090003L1', '2026-09-11', '2026-09', 'Supreme Hospital - YouTube Long Video #1', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(238, 8, 'AT001', '6090003P6', '2026-09-12', '2026-09', 'Supreme Hospital - Poster #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(239, 8, 'AT002', '6090003R6', '2026-09-14', '2026-09', 'Supreme Hospital - Reel #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(240, 8, 'AT004', '6090003S4', '2026-09-15', '2026-09', 'Supreme Hospital - Shorts and Blogs #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(241, 8, 'AT005', '6090003L2', '2026-09-18', '2026-09', 'Supreme Hospital - YouTube Long Video #2', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(242, 8, 'AT001', '6090003P7', '2026-09-16', '2026-09', 'Supreme Hospital - Poster #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(243, 8, 'AT002', '6090003R7', '2026-09-17', '2026-09', 'Supreme Hospital - Reel #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(244, 8, 'AT004', '6090003S5', '2026-09-18', '2026-09', 'Supreme Hospital - Shorts and Blogs #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(245, 8, 'AT005', '6090003L3', '2026-09-22', '2026-09', 'Supreme Hospital - YouTube Long Video #3', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(246, 8, 'AT001', '6090003P8', '2026-09-19', '2026-09', 'Supreme Hospital - Poster #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(247, 8, 'AT002', '6090003R8', '2026-09-21', '2026-09', 'Supreme Hospital - Reel #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(248, 8, 'AT004', '6090003S6', '2026-09-22', '2026-09', 'Supreme Hospital - Shorts and Blogs #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(249, 8, 'AT005', '6090003L4', '2026-09-24', '2026-09', 'Supreme Hospital - YouTube Long Video #4', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(250, 8, 'AT001', '6090003P9', '2026-09-23', '2026-09', 'Supreme Hospital - Poster #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(251, 8, 'AT002', '6090003R9', '2026-09-24', '2026-09', 'Supreme Hospital - Reel #9', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(252, 8, 'AT004', '6090003S7', '2026-09-25', '2026-09', 'Supreme Hospital - Shorts and Blogs #7', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(253, 8, 'AT005', '6090003L5', '2026-09-26', '2026-09', 'Supreme Hospital - YouTube Long Video #5', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(254, 8, 'AT001', '6090003P10', '2026-09-26', '2026-09', 'Supreme Hospital - Poster #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(255, 8, 'AT002', '6090003R10', '2026-09-28', '2026-09', 'Supreme Hospital - Reel #10', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(256, 8, 'AT004', '6090003S8', '2026-09-29', '2026-09', 'Supreme Hospital - Shorts and Blogs #8', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL),
(257, 8, 'AT005', '6090003L6', '2026-09-30', '2026-09', 'Supreme Hospital - YouTube Long Video #6', 'Automated monthly deliverable calendar entry.', 'draft', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-01 05:05:43', '2026-09-01 05:05:43', NULL, 0, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deliverable_templates`
--

CREATE TABLE `deliverable_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deliverable_template_items`
--

CREATE TABLE `deliverable_template_items` (
  `id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `deliverable` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`) VALUES
(1, 'Creatives', 'CD-RS', 'Handles content, creatives, graphic design and calendars', 'active', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL, 2, NULL),
(2, 'Social Media Marketing', 'SMM-RS', 'Handles social media marketing and publishing', 'active', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `employee_id_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department_id` int(11) NOT NULL,
  `sub_department_id` int(11) DEFAULT NULL,
  `reporting_manager_id` int(11) DEFAULT NULL,
  `joining_date` date NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `profile_image` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_days`
--

CREATE TABLE `event_days` (
  `id` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('draft','sent_to_manager','sent_to_employee') NOT NULL DEFAULT 'draft',
  `event_type` enum('event_day','national_day','international_day','celebrity_birthday','festival_state','festival_national') NOT NULL DEFAULT 'event_day',
  `assigned_employee_id` int(11) DEFAULT NULL,
  `work_link` varchar(1024) DEFAULT NULL,
  `submission_status` enum('pending','submitted','approved') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `voice_note` mediumtext DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `rework_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_days`
--

INSERT INTO `event_days` (`id`, `month`, `date`, `title`, `description`, `status`, `event_type`, `assigned_employee_id`, `work_link`, `submission_status`, `submitted_at`, `remarks`, `voice_note`, `created_by`, `created_at`, `updated_at`, `started_at`, `completed_time_spent`, `rework_count`) VALUES
(1, '2026-08', '2026-08-15', 'Independence Day', 'National festival commemorating freedom.', 'draft', 'festival_national', NULL, NULL, 'pending', NULL, NULL, NULL, 2, '2026-08-31 05:46:21', '2026-08-31 05:46:21', NULL, 0, 0),
(2, '2026-09', '2026-09-05', 'Teacher\'s Day', 'Celebrating educators and teachers.', 'draft', 'event_day', NULL, NULL, 'pending', NULL, NULL, NULL, 3, '2026-09-01 05:06:10', '2026-09-01 05:06:10', NULL, 0, 0),
(3, '2026-09', '2026-09-27', 'World Tourism Day', 'Promoting global travel.', 'draft', 'international_day', NULL, NULL, 'pending', NULL, NULL, NULL, 3, '2026-09-01 05:06:10', '2026-09-01 05:06:10', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_day_client_deliverables`
--

CREATE TABLE `event_day_client_deliverables` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `event_day_id` int(11) DEFAULT NULL,
  `deliverable_title` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `activity_type_code` varchar(50) DEFAULT NULL,
  `activity_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_day_months`
--

CREATE TABLE `event_day_months` (
  `month` varchar(7) NOT NULL,
  `initialized` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_day_months`
--

INSERT INTO `event_day_months` (`month`, `initialized`, `created_at`) VALUES
('2026-08', 1, '2026-08-31 05:46:21'),
('2026-09', 1, '2026-09-01 05:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `hr`
--

CREATE TABLE `hr` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `full_name` varchar(255) DEFAULT NULL,
  `hr_id_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_works`
--

CREATE TABLE `job_works` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `activity_type_code` varchar(20) NOT NULL,
  `activity_code` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `deadline` datetime NOT NULL,
  `assigned_manager_id` int(11) DEFAULT NULL,
  `content_writer_id` int(11) DEFAULT NULL,
  `assigned_employee_id` int(11) DEFAULT NULL,
  `smm_employee_id` int(11) DEFAULT NULL,
  `google_drive_link` varchar(1024) DEFAULT NULL,
  `content_link` varchar(1024) DEFAULT NULL,
  `manager_feedback_text` text DEFAULT NULL,
  `manager_voice_base64` mediumtext DEFAULT NULL,
  `client_feedback_text` text DEFAULT NULL,
  `client_voice_base64` mediumtext DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `writer_started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `sent_to_client_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT NULL,
  `completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `writer_completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `rework_count` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'assigned',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_work_history`
--

CREATE TABLE `job_work_history` (
  `id` int(11) NOT NULL,
  `job_work_id` int(11) NOT NULL,
  `stage` varchar(100) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `is_job_work` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `manager_id_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department_id` int(11) NOT NULL,
  `sub_department_id` int(11) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `joining_date` date NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `profile_image` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_blogs_grid`
--

CREATE TABLE `monthly_blogs_grid` (
  `client_id` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `blogs_count` int(11) NOT NULL DEFAULT 0,
  `gmb_count` int(11) NOT NULL DEFAULT 0,
  `backlink_count` int(11) NOT NULL DEFAULT 0,
  `posted_day` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_deliverables`
--

CREATE TABLE `monthly_deliverables` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `department_id` int(11) NOT NULL,
  `activity_type_code` varchar(20) DEFAULT NULL,
  `deliverable` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `assigned_manager_id` int(11) NOT NULL,
  `assigned_employee_id` int(11) NOT NULL,
  `smm_employee_id` int(11) DEFAULT NULL,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `due_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `content_link` varchar(1024) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `activity_code` varchar(50) DEFAULT NULL,
  `content_writer_id` int(11) DEFAULT NULL,
  `google_drive_link` varchar(1024) DEFAULT NULL,
  `designer_output` varchar(1024) DEFAULT NULL,
  `manager_feedback_text` text DEFAULT NULL,
  `manager_voice_base64` mediumtext DEFAULT NULL,
  `client_feedback_text` text DEFAULT NULL,
  `client_voice_base64` mediumtext DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `writer_started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `sent_to_client_at` timestamp NULL DEFAULT NULL,
  `client_action_at` timestamp NULL DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT NULL,
  `completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `writer_completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `rework_count` int(11) NOT NULL DEFAULT 0,
  `is_event_day` tinyint(1) DEFAULT 0,
  `event_day_title` varchar(255) DEFAULT NULL,
  `event_day_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_deliverables_grid`
--

CREATE TABLE `monthly_deliverables_grid` (
  `client_id` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `posters` int(11) NOT NULL DEFAULT 0,
  `reels` int(11) NOT NULL DEFAULT 0,
  `yts` int(11) NOT NULL DEFAULT 0,
  `yt` int(11) NOT NULL DEFAULT 0,
  `posted_day` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `monthly_deliverables_grid`
--

INSERT INTO `monthly_deliverables_grid` (`client_id`, `month`, `posters`, `reels`, `yts`, `yt`, `posted_day`) VALUES
(2, '2026-09', 5, 8, 8, 0, ''),
(3, '2026-09', 5, 5, 10, 6, ''),
(8, '2026-09', 10, 10, 8, 6, ''),
(9, '2026-09', 0, 0, 8, 0, 'tuesday,friday'),
(10, '2026-09', 2, 0, 2, 0, ''),
(11, '2026-09', 0, 8, 0, 0, 'tuesday,friday'),
(12, '2026-09', 6, 0, 8, 0, ''),
(13, '2026-09', 2, 0, 2, 0, ''),
(14, '2026-09', 2, 0, 4, 0, ''),
(15, '2026-09', 0, 0, 0, 0, ''),
(16, '2026-09', 0, 0, 0, 0, ''),
(17, '2026-09', 8, 0, 0, 0, ''),
(18, '2026-09', 0, 0, 8, 0, ''),
(19, '2026-09', 10, 5, 0, 5, ''),
(20, '2026-09', 10, 5, 10, 2, ''),
(21, '2026-09', 8, 0, 4, 0, ''),
(23, '2026-09', 0, 0, 31, 0, ''),
(24, '2026-09', 0, 0, 8, 0, ''),
(25, '2026-09', 4, 8, 0, 0, ''),
(26, '2026-09', 0, 0, 0, 6, 'tuesday,friday');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('employee_created','manager_created','hr_created','client_created','deliverables_assigned','deadline_reminder','project_delayed','client_approval_pending') NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `is_read`, `created_at`) VALUES
(2, NULL, 'Client Created: \"Madras Coffee House\" has been registered.', 'client_created', 0, '2026-08-31 10:13:09'),
(3, NULL, 'Client Created: \"GEM Hospital Chennai\" has been registered.', 'client_created', 0, '2026-08-31 10:18:37'),
(4, NULL, 'Client Created: \"supreme\" has been registered.', 'client_created', 0, '2026-08-31 11:21:50'),
(5, NULL, 'Client Created: \"Ramnath Bhagavath\" has been registered.', 'client_created', 0, '2026-08-31 11:34:18'),
(6, NULL, 'Client Created: \"Hercyclopedia\" has been registered.', 'client_created', 0, '2026-08-31 11:36:28'),
(7, NULL, 'Client Created: \"Brigantine\" has been registered.', 'client_created', 0, '2026-08-31 11:38:24'),
(8, NULL, 'Client Created: \"GEM Restaurant\" has been registered.', 'client_created', 0, '2026-08-31 11:40:03'),
(9, NULL, 'Client Created: \"stardome\" has been registered.', 'client_created', 0, '2026-08-31 11:45:22'),
(10, NULL, 'Client Created: \"RK Hospitality\" has been registered.', 'client_created', 0, '2026-08-31 11:52:09'),
(11, NULL, 'Client Created: \"GEM Liver \" has been registered.', 'client_created', 0, '2026-08-31 11:59:22'),
(12, NULL, 'Client Created: \"SCSVMV University\" has been registered.', 'client_created', 0, '2026-08-31 12:07:48'),
(13, NULL, 'Client Created: \"Rajesh Personal Branding\" has been registered.', 'client_created', 0, '2026-08-31 12:24:27'),
(14, NULL, 'Client Created: \"Dr. Senthilnathan\" has been registered.', 'client_created', 0, '2026-08-31 12:28:26'),
(15, NULL, 'Client Created: \"D- Medva\" has been registered.', 'client_created', 0, '2026-08-31 12:32:50'),
(16, NULL, 'Client Created: \"MSPVL\" has been registered.', 'client_created', 0, '2026-08-31 12:38:23'),
(17, NULL, 'Client Created: \"Bell Match\" has been registered.', 'client_created', 0, '2026-08-31 13:49:57'),
(19, NULL, 'Client Created: \"ReachSkyline\" has been registered.', 'client_created', 0, '2026-09-01 02:56:02'),
(20, NULL, 'Client Created: \"GEM Hospital  Dr. Ajay pai \" has been registered.', 'client_created', 0, '2026-09-01 03:01:55'),
(21, NULL, 'Client Created: \"Bell Concept Selling\" has been registered.', 'client_created', 0, '2026-09-01 04:54:47'),
(22, NULL, 'Client Created: \"GEM Hospital Chennai podcast \" has been registered.', 'client_created', 0, '2026-09-01 05:03:37');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `client_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','active','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shoot_scripts`
--

CREATE TABLE `shoot_scripts` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `assigned_employee_id` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `work_link` varchar(1024) DEFAULT NULL,
  `submission_status` enum('pending','submitted','approved') NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `voice_note` mediumtext DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_time_spent` int(11) NOT NULL DEFAULT 0,
  `rework_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_departments`
--

CREATE TABLE `sub_departments` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_departments`
--

INSERT INTO `sub_departments` (`id`, `department_id`, `name`, `code`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 'Content Writing', 'CW-RS', '2026-08-31 05:43:11', '2026-08-31 05:43:11', 2, NULL),
(2, 1, 'Graphic Design', 'GD-RS', '2026-08-31 05:43:11', '2026-08-31 05:43:11', 2, NULL),
(3, 1, 'Video Editing', 'VE-RS', '2026-08-31 05:43:11', '2026-08-31 05:43:11', 2, NULL),
(4, 1, 'Creative designer', 'CR-RS', '2026-09-01 05:06:56', '2026-09-01 05:06:56', 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `assigned_to` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `plain_password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` enum('super_admin','admin','hr','manager','employee','client') NOT NULL DEFAULT 'employee',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `plain_password`, `email`, `role`, `status`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`) VALUES
(1, 'superadmin', '$2b$10$QNq86UK6e88HQlowFmHZn.2/wJqYggJs6z6sCjqW3RSBLeEcYbyL6', 'SuperAdmin@123', 'superadmin@reachskyline.com', 'super_admin', 'active', '2026-08-31 05:43:11', '2026-08-31 05:43:11', NULL, NULL, NULL),
(3, 'admin', '$2b$10$C/jYX.BlTIYctay8VVAGpe/NpnAdILc9bN1GtX.Jd7BMhHI46k64q', 'Admin@123', 'admin@noemail.local', 'admin', 'active', '2026-08-31 09:36:58', '2026-08-31 10:09:00', NULL, NULL, NULL),
(4, 'Chandra Prabha_MCH', '$2b$10$LpbOWxNjqFq2NiJI6bHX6esM49gBE8RhKN1etzVt2lE36KzKvcuWm', 'MCH@123', 'Chandra Prabha_MCH@noemail.local', 'client', 'active', '2026-08-31 10:13:09', '2026-08-31 10:13:09', NULL, NULL, NULL),
(5, 'Rajesh_GEM', '$2b$10$eRKgxGwwww.VlbfEdBOAf.6ZEN9EGGLgxHYDjp0G1MbxWrkskswP2', 'GEM@123', 'Rajesh_GEM@noemail.local', 'client', 'active', '2026-08-31 10:18:37', '2026-08-31 10:18:37', NULL, NULL, NULL),
(12, 'supreme', '$2b$10$EDocOZbZ8LNlIuwKs2z81.MDvsPGwGXNY2d6GV3tvRBjw0NdmknnC', 'Grace@123', 'supreme@noemail.local', 'client', 'active', '2026-08-31 11:21:50', '2026-08-31 11:30:16', NULL, NULL, NULL),
(13, 'Ramnath_123', '$2b$10$Y1ESx6fYwpx2tH5Ja0PpUu60b9UnaXvnnLxLM0WkyusvvM4soate2', 'Ramnath@123', 'Ramnath_123@noemail.local', 'client', 'active', '2026-08-31 11:34:18', '2026-08-31 11:34:18', NULL, NULL, NULL),
(14, 'Hercyclopedia_123', '$2b$10$ZCihTs28ij6R5KdAUqPcm.YSBbZXD7Dcin3wE99iEVCjZYFzBOLQW', 'Rajesh@123', 'Hercyclopedia_123@noemail.local', 'client', 'active', '2026-08-31 11:36:28', '2026-08-31 11:36:28', NULL, NULL, NULL),
(15, 'Brigantine_123', '$2b$10$xg1zeXL1WXWNuNHk9VajKuiAay2RhhA8BTM4NBQa9ovTDAT1/awDq', 'Deepa@123', 'Brigantine_123@noemail.local', 'client', 'active', '2026-08-31 11:38:24', '2026-08-31 11:38:24', NULL, NULL, NULL),
(16, 'GEM _123', '$2b$10$HKNkln9lRjxaQbI/T6JPh.gd5DqufwPrx4lKbcDFvBPT1umT4jM4m', 'Rajesh@123', 'GEM _123@noemail.local', 'client', 'active', '2026-08-31 11:40:03', '2026-08-31 11:40:03', NULL, NULL, NULL),
(17, 'Stardome_123', '$2b$10$5s1KX/Rlgz8ChcyGLwbL0OmsbUrtJ8/DzgGcpJlI5KWehLudwq1v.', 'Rajesh@123', 'Stardome_123@noemail.local', 'client', 'active', '2026-08-31 11:45:22', '2026-08-31 11:45:22', NULL, NULL, NULL),
(18, 'RK_123', '$2b$10$hkVrrqOF4z/NImxyC81Py.S0ERo96xlN/mUmYmlE8QpdOYqTrYfjy', 'Rajesh@123', 'RK_123@noemail.local', 'client', 'active', '2026-08-31 11:52:09', '2026-08-31 11:52:09', NULL, NULL, NULL),
(19, 'GEM Liver_123', '$2b$10$iX2eTojIz2xIrtxKUd6uP.Pa.Dh.lqkZ.iLUSE7K9dhdpnvujxCOa', 'Hidyath@123', 'GEM Liver_123@noemail.local', 'client', 'active', '2026-08-31 11:59:22', '2026-08-31 11:59:22', NULL, NULL, NULL),
(20, 'SCSVMV_123', '$2b$10$F0V0xEKPFAJGWdtlMigCJuoDjX8FtSVcSCMzbv3c2BhMgqvYPeox.', 'Vaishnavi@123', 'SCSVMV_123@noemail.local', 'client', 'active', '2026-08-31 12:07:48', '2026-08-31 12:07:48', NULL, NULL, NULL),
(21, 'Rajesh_123', '$2b$10$pFqIEnOS.xM2YXbrGR7DzuNmDadUpJGigoHGJRSo36ALC7sIbVWCi', 'Rajesh@123', 'Rajesh_123@noemail.local', 'client', 'active', '2026-08-31 12:24:27', '2026-08-31 12:24:27', NULL, NULL, NULL),
(22, 'Senthilnathan_123', '$2b$10$pGtrGrH3kdPJjZ4qXEcGm.qrZNAf6e.z4R.hvE/jU2YRH5i5zplKe', 'GEM@123', 'Senthilnathan_123@noemail.local', 'client', 'active', '2026-08-31 12:28:26', '2026-08-31 12:28:26', NULL, NULL, NULL),
(23, 'D- Medva_123', '$2b$10$QmteyK3L1IIN4KMR0zzjMO2N0gKXFZbVbbhUhrRdOcuJ5xMJLQlja', 'dmedva@123', 'D- Medva_123@noemail.local', 'client', 'active', '2026-08-31 12:32:50', '2026-08-31 12:32:50', NULL, NULL, NULL),
(24, 'MSPVL_123', '$2b$10$jgyrfAdVQseweSPnAoYRE.T4mxnDVslrex/nIJuynBib4NYks6qEO', 'Ramesh@123', 'MSPVL_123@noemail.local', 'client', 'active', '2026-08-31 12:38:23', '2026-08-31 12:38:23', NULL, NULL, NULL),
(25, 'BellMatch_123', '$2b$10$EWiKZztbaup2l6KbqvpwMeGgTk6ytZ6pZ5Dw5esfNFj7mqMbYD62y', 'BellMatch@123', 'BellMatch_123@noemail.local', 'client', 'active', '2026-08-31 13:49:57', '2026-08-31 13:49:57', NULL, NULL, NULL),
(27, 'Reachskyline_123', '$2b$10$K7P2AOubJFoNgZvwiVt43Ov6XA1uwPWJbxAmfKbcZvQDqPZhk5G1m', 'Ram@123', 'Reachskyline_123@noemail.local', 'client', 'active', '2026-09-01 02:56:02', '2026-09-01 02:56:02', NULL, NULL, NULL),
(28, 'Ajay Pai', '$2b$10$0wKB4SrGu98f/5NWy.iqbOOqYaAF70a5q9Zbrufb9d.RDo8QonlwG', 'GEM@123', 'Ajay Pai@noemail.local', 'client', 'active', '2026-09-01 03:01:55', '2026-09-01 03:01:55', NULL, NULL, NULL),
(29, 'Bell Concept Selling_123', '$2b$10$c.v1XqHVWJAL1ryKI4kb6.JMeGq6PLtHVtzwdHPneyjg0g.MFQhmm', 'Bell@123', 'Bell Concept Selling_123@noemail.local', 'client', 'active', '2026-09-01 04:54:47', '2026-09-01 04:54:47', NULL, NULL, NULL),
(30, 'podcast _ 123', '$2b$10$EDZAIgieBYEm3LArqDPQH.FMi9CLw/Aos0UPJHaxLTjdA3GrdKt.e', 'GEM@123', 'podcast _ 123@noemail.local', 'client', 'active', '2026-09-01 05:03:37', '2026-09-01 05:03:37', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_push_subscriptions`
--

CREATE TABLE `user_push_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `onesignal_subscription_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_push_subscriptions`
--

INSERT INTO `user_push_subscriptions` (`id`, `user_id`, `onesignal_subscription_id`, `created_at`) VALUES
(23, 3, '31780963-ac2b-4feb-ae03-70658f89192c', '2026-08-31 09:38:00'),
(36, 3, '783e8c9b-9c43-42d9-8f7d-a5221b815c2c', '2026-08-31 09:43:55'),
(37, 3, '9bf9a127-b08c-4412-ab2f-5fc230401170', '2026-08-31 09:44:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `activity_types`
--
ALTER TABLE `activity_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activity_type_code` (`activity_type_code`),
  ADD KEY `fk_activity_types_sub_dept` (`sub_department_id`);

--
-- Indexes for table `calendar_skip_dates`
--
ALTER TABLE `calendar_skip_dates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `client_id_code` (`client_id_code`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_client_code` (`client_id_code`),
  ADD KEY `fk_clients_user_id` (`user_id`);

--
-- Indexes for table `client_approvals`
--
ALTER TABLE `client_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `idx_approval_status` (`status`);

--
-- Indexes for table `content_calendar`
--
ALTER TABLE `content_calendar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`),
  ADD KEY `idx_calendar_month` (`month`),
  ADD KEY `idx_calendar_client` (`client_id`);

--
-- Indexes for table `deliverable_templates`
--
ALTER TABLE `deliverable_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `deliverable_template_items`
--
ALTER TABLE `deliverable_template_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_id` (`template_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_dept_code` (`code`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id_code` (`employee_id_code`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `sub_department_id` (`sub_department_id`),
  ADD KEY `reporting_manager_id` (`reporting_manager_id`),
  ADD KEY `idx_employee_code` (`employee_id_code`);

--
-- Indexes for table `event_days`
--
ALTER TABLE `event_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`),
  ADD KEY `idx_month` (`month`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `event_day_client_deliverables`
--
ALTER TABLE `event_day_client_deliverables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `event_day_months`
--
ALTER TABLE `event_day_months`
  ADD PRIMARY KEY (`month`);

--
-- Indexes for table `hr`
--
ALTER TABLE `hr`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_works`
--
ALTER TABLE `job_works`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activity_code` (`activity_code`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `assigned_manager_id` (`assigned_manager_id`),
  ADD KEY `content_writer_id` (`content_writer_id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`),
  ADD KEY `smm_employee_id` (`smm_employee_id`),
  ADD KEY `activity_type_code` (`activity_type_code`);

--
-- Indexes for table `job_work_history`
--
ALTER TABLE `job_work_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `manager_id_code` (`manager_id_code`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `idx_manager_code` (`manager_id_code`),
  ADD KEY `fk_managers_sub_department` (`sub_department_id`);

--
-- Indexes for table `monthly_blogs_grid`
--
ALTER TABLE `monthly_blogs_grid`
  ADD PRIMARY KEY (`client_id`,`month`);

--
-- Indexes for table `monthly_deliverables`
--
ALTER TABLE `monthly_deliverables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `assigned_manager_id` (`assigned_manager_id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`),
  ADD KEY `smm_employee_id` (`smm_employee_id`),
  ADD KEY `idx_deliverable_month` (`month`),
  ADD KEY `idx_deliverable_status` (`status`),
  ADD KEY `fk_monthly_deliv_writer` (`content_writer_id`);

--
-- Indexes for table `monthly_deliverables_grid`
--
ALTER TABLE `monthly_deliverables_grid`
  ADD PRIMARY KEY (`client_id`,`month`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notification_read` (`is_read`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `manager_id` (`manager_id`),
  ADD KEY `idx_project_status` (`status`);

--
-- Indexes for table `shoot_scripts`
--
ALTER TABLE `shoot_scripts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`);

--
-- Indexes for table `sub_departments`
--
ALTER TABLE `sub_departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_task_due_status` (`due_date`,`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status_role` (`status`,`role`);

--
-- Indexes for table `user_push_subscriptions`
--
ALTER TABLE `user_push_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `onesignal_subscription_id` (`onesignal_subscription_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `activity_types`
--
ALTER TABLE `activity_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `calendar_skip_dates`
--
ALTER TABLE `calendar_skip_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `client_approvals`
--
ALTER TABLE `client_approvals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `content_calendar`
--
ALTER TABLE `content_calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

--
-- AUTO_INCREMENT for table `deliverable_templates`
--
ALTER TABLE `deliverable_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deliverable_template_items`
--
ALTER TABLE `deliverable_template_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_days`
--
ALTER TABLE `event_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `event_day_client_deliverables`
--
ALTER TABLE `event_day_client_deliverables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hr`
--
ALTER TABLE `hr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_works`
--
ALTER TABLE `job_works`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_work_history`
--
ALTER TABLE `job_work_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthly_deliverables`
--
ALTER TABLE `monthly_deliverables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shoot_scripts`
--
ALTER TABLE `shoot_scripts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_departments`
--
ALTER TABLE `sub_departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_push_subscriptions`
--
ALTER TABLE `user_push_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `activity_types`
--
ALTER TABLE `activity_types`
  ADD CONSTRAINT `fk_activity_types_sub_dept` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `fk_clients_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `client_approvals`
--
ALTER TABLE `client_approvals`
  ADD CONSTRAINT `client_approvals_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

--
-- Constraints for table `content_calendar`
--
ALTER TABLE `content_calendar`
  ADD CONSTRAINT `content_calendar_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `content_calendar_ibfk_2` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `deliverable_template_items`
--
ALTER TABLE `deliverable_template_items`
  ADD CONSTRAINT `deliverable_template_items_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `deliverable_templates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliverable_template_items_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`reporting_manager_id`) REFERENCES `managers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `event_days`
--
ALTER TABLE `event_days`
  ADD CONSTRAINT `event_days_ibfk_1` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `job_works`
--
ALTER TABLE `job_works`
  ADD CONSTRAINT `job_works_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_works_ibfk_2` FOREIGN KEY (`assigned_manager_id`) REFERENCES `managers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_works_ibfk_3` FOREIGN KEY (`content_writer_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_works_ibfk_4` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_works_ibfk_5` FOREIGN KEY (`smm_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_works_ibfk_6` FOREIGN KEY (`activity_type_code`) REFERENCES `activity_types` (`activity_type_code`);

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `fk_managers_sub_department` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `managers_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `monthly_blogs_grid`
--
ALTER TABLE `monthly_blogs_grid`
  ADD CONSTRAINT `monthly_blogs_grid_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `monthly_deliverables`
--
ALTER TABLE `monthly_deliverables`
  ADD CONSTRAINT `fk_monthly_deliv_writer` FOREIGN KEY (`content_writer_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_deliverables_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `monthly_deliverables_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `monthly_deliverables_ibfk_3` FOREIGN KEY (`assigned_manager_id`) REFERENCES `managers` (`id`),
  ADD CONSTRAINT `monthly_deliverables_ibfk_4` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `monthly_deliverables_ibfk_5` FOREIGN KEY (`smm_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `monthly_deliverables_grid`
--
ALTER TABLE `monthly_deliverables_grid`
  ADD CONSTRAINT `monthly_deliverables_grid_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`manager_id`) REFERENCES `managers` (`id`);

--
-- Constraints for table `shoot_scripts`
--
ALTER TABLE `shoot_scripts`
  ADD CONSTRAINT `shoot_scripts_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shoot_scripts_ibfk_2` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_departments`
--
ALTER TABLE `sub_departments`
  ADD CONSTRAINT `sub_departments_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_push_subscriptions`
--
ALTER TABLE `user_push_subscriptions`
  ADD CONSTRAINT `user_push_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
