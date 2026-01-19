
<?php
// user/header.php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($page_title) ? htmlspecialchars($page_title) : 'User Panel' ?> - Smart Trip Planner</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="dashboard-wrapper">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Smart Trip Planner</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li class="<?= $current_page == 'plan_trip.php' ? 'active' : '' ?>">
                        <a href="/user/plan_trip.php">Plan a New Trip</a>
                    </li>
                    <li class="<?= $current_page == 'my_trips.php' ? 'active' : '' ?>">
                        <a href="/user/my_trips.php">My Trips</a>
                    </li>
                </ul>
            </nav>
        </aside>
        <div class="main-content">
            <header class="main-header">
                <h1><?= isset($page_title) ? htmlspecialchars($page_title) : 'Dashboard' ?></h1>
                <div class="user-info">
                    <span>Hello, <strong><?= htmlspecialchars($_SESSION['user_name']) ?></strong></span>
                    <a href="/logout.php" class="btn btn-secondary btn-sm">Logout</a>
                </div>
            </header>
            <main class="content">
