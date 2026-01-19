
<?php
// index.php
require_once 'config/db.php';

if (!is_logged_in()) {
    header('Location: login.php');
    exit();
}

if (is_admin()) {
    header('Location: /admin/view-trips.php');
} else {
    // Regular users are directed to the main trip planning page
    header('Location: /user/plan_trip.php');
}
exit();
?>
