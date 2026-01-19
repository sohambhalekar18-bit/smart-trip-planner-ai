<?php
session_start();
require_once '../config/db.php';
require_admin_login();

$user_id = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);

if (!$user_id) {
    header("Location: manage-users.php");
    exit();
}

// Fetch user details
$user_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$user_stmt->execute([$user_id]);
$user = $user_stmt->fetch();

if (!$user) {
    header("Location: manage-users.php");
    exit();
}

// Fetch user trip history
$trips_stmt = $pdo->prepare("SELECT * FROM user_trips WHERE user_id = ? ORDER BY created_at DESC");
$trips_stmt->execute([$user_id]);
$trips = $trips_stmt->fetchAll();

// Fetch user favorites
$favorites_stmt = $pdo->prepare("
    SELECT ut.*, f.saved_at 
    FROM favorites f
    JOIN user_trips ut ON f.trip_id = ut.id
    WHERE f.user_id = ? 
    ORDER BY f.saved_at DESC
");
$favorites_stmt->execute([$user_id]);
$favorites = $favorites_stmt->fetchAll();

// Fetch user activity
$activity_stmt = $pdo->prepare("SELECT * FROM user_activity WHERE user_id = ? ORDER BY activity_time DESC LIMIT 10");
$activity_stmt->execute([$user_id]);
$activities = $activity_stmt->fetchAll();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Details - <?php echo htmlspecialchars($user['name']); ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <div class="admin-wrapper">
        <aside class="sidebar">
            <h3>Admin Panel</h3>
            <nav>
                <ul>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li class="active"><a href="manage-users.php">Manage Users</a></li>
                    <li><a href="../logout.php">Logout</a></li>
                </ul>
            </nav>
        </aside>
        <main class="main-content">
            <header class="main-header">
                <div>
                    <h1>User Details</h1>
                    <a href="manage-users.php" class="btn btn-secondary back-btn">&larr; Back to User List</a>
                </div>
                <button id="theme-toggle" class="theme-toggle-btn">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.591-1.591a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.803 17.803a.75.75 0 01-1.06 0l-1.592-1.591a.75.75 0 011.061-1.06l1.591 1.591a.75.75 0 010 1.06zM12 21.75a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0V21a.75.75 0 01-.75.75zM5.197 17.803a.75.75 0 010-1.06l1.591-1.592a.75.75 0 011.06 1.061l-1.591 1.591a.75.75 0 01-1.06 0zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM6.106 5.106a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.06 1.06l-1.591-1.591a.75.75 0 010-1.06z"></path></svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.636 4.382-8.442a.75.75 0 01.819.162z" clip-rule="evenodd"></path></svg>
                </button>
            </header>
            
            <div class="content">
                <div class="details-grid">
                    <!-- User Profile Card -->
                    <div class="card">
                        <h3>User Profile</h3>
                        <p><strong>ID:</strong> <?php echo htmlspecialchars($user['id']); ?></p>
                        <p><strong>Name:</strong> <?php echo htmlspecialchars($user['name']); ?></p>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                        <p><strong>Joined:</strong> <?php echo date('F j, Y, g:i a', strtotime($user['created_at'])); ?></p>
                        <p><strong>Status:</strong> <span class="status-badge status-<?php echo htmlspecialchars($user['status']); ?>"><?php echo htmlspecialchars(ucfirst($user['status'])); ?></span></p>
                    </div>

                    <!-- Recent Activity Card -->
                    <div class="card">
                        <h3>Recent Activity</h3>
                        <ul>
                            <?php foreach ($activities as $activity): ?>
                                <li>
                                    <strong><?php echo htmlspecialchars(ucfirst($activity['action'])); ?>:</strong>
                                    <?php echo htmlspecialchars($activity['details']); ?>
                                    <small>(<?php echo date('M d, Y H:i', strtotime($activity['activity_time'])); ?>)</small>
                                </li>
                            <?php endforeach; ?>
                            <?php if (empty($activities)) echo "<li>No recent activity found.</li>"; ?>
                        </ul>
                    </div>
                </div>

                <!-- Trip History -->
                <div class="card full-width">
                    <h3>Trip History</h3>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>City</th><th>Days</th><th>Budget</th><th>Date</th></tr></thead>
                            <tbody>
                                <?php foreach ($trips as $trip): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($trip['city']); ?></td>
                                        <td><?php echo htmlspecialchars($trip['days']); ?></td>
                                        <td><?php echo htmlspecialchars(ucfirst($trip['budget'])); ?></td>
                                        <td><?php echo date('M d, Y', strtotime($trip['created_at'])); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                <?php if (empty($trips)) echo "<tr><td colspan='4'>No trips created by this user.</td></tr>"; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Saved Favorites -->
                <div class="card full-width">
                    <h3>Saved Favorites</h3>
                     <div class="table-container">
                        <table>
                            <thead><tr><th>City</th><th>Days</th><th>Budget</th><th>Saved On</th></tr></thead>
                            <tbody>
                                <?php foreach ($favorites as $fav): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($fav['city']); ?></td>
                                        <td><?php echo htmlspecialchars($fav['days']); ?></td>
                                        <td><?php echo htmlspecialchars(ucfirst($fav['budget'])); ?></td>
                                        <td><?php echo date('M d, Y', strtotime($fav['saved_at'])); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                <?php if (empty($favorites)) echo "<tr><td colspan='4'>No favorites saved by this user.</td></tr>"; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>
    <script src="../assets/js/admin.js"></script>
</body>
</html>