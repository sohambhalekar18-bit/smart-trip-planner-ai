
<?php
// config/db.php

// --- DATABASE CONFIGURATION ---
define('DB_HOST', '127.0.0.1'); // or 'localhost'
define('DB_NAME', 'smart_trip_planner');
define('DB_USER', 'root');
define('DB_PASS', '');

// --- PDO DATABASE CONNECTION ---
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// --- AUTHENTICATION HELPER FUNCTIONS ---
session_start();

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return is_logged_in() && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function require_login() {
    if (!is_logged_in()) {
        header('Location: /login.php');
        exit();
    }
}

function require_admin() {
    if (!is_admin()) {
        header('Location: /index.php'); // Redirect non-admins
        exit();
    }
}

/*
================================================
DATABASE SETUP SCRIPT (MySQL)
================================================
Execute this SQL in your MySQL database to create the necessary tables.
*/

/*
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `smart_trip_planner` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_trip_planner`;

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping default data for table `users`
-- Passwords are: 'adminpassword' and 'userpassword'
--
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin User', 'admin@example.com', '$2y$10$E/g0j2b2J3k4l5m6N7o8p.u9/gH2I1J4k5L6m7N8o9P0q1R2s3t4u', 'admin'),
('Regular User', 'user@example.com', '$2y$10$A/b1c2d3E4f5g6H7i8j9k.uL1m2N3o4P5q6R7s8T9u0V1w2X3y4z5', 'user');

--
-- Table structure for table `trips`
--
CREATE TABLE `trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `days` int(3) NOT NULL,
  `budget` enum('budget','mid-range','luxury') NOT NULL,
  `ai_trip_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_shared` tinyint(1) NOT NULL DEFAULT 0,
  `is_downloaded` tinyint(1) NOT NULL DEFAULT 0,
  `share_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `share_token` (`share_token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `trips_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

*/
?>
