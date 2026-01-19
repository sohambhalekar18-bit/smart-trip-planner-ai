
<?php
// user/dashboard.php
require_once '../config/db.php';
require_login();

$page_title = 'Dashboard';

include 'header.php';
?>

<div class="card">
    <div class="card-header">
        <h3>Welcome to Your Dashboard, <?= htmlspecialchars($_SESSION['user_name']) ?>!</h3>
    </div>
    <p>This is your personal space to manage and create amazing travel plans.</p>
    <p>Ready for your next adventure?</p>
    <br>
    <div style="display: flex; gap: 10px;">
        <a href="plan_trip.php" class="btn btn-primary">Plan a New Trip</a>
        <a href="my_trips.php" class="btn btn-secondary">View My Trips</a>
    </div>
</div>

<?php include 'footer.php'; ?>
