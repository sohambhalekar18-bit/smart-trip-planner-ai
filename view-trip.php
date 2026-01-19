
<?php
// user/view-trip.php
require_once '../config/db.php';
require_login();

$trip_id = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
$user_id = $_SESSION['user_id'];

if ($trip_id <= 0) {
    header('Location: my-trips.php');
    exit();
}

// Fetch trip data, ensuring it belongs to the current user
$stmt = $pdo->prepare("SELECT * FROM trips WHERE id = ? AND user_id = ?");
$stmt->execute([$trip_id, $user_id]);
$trip = $stmt->fetch();

if (!$trip) {
    header('Location: my-trips.php');
    exit();
}

$page_title = 'Your Trip to ' . htmlspecialchars($trip['city']);

// A simple markdown-to-HTML converter
function simple_text_to_html($text) {
    $text = htmlspecialchars($text);
    $text = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $text);
    $text = preg_replace('/^\- (.*$)/m', '<li>$1</li>', $text);
    $text = nl2br($text);
    return $text;
}

include 'header.php';
?>

<div id="feedback-message" class="alert alert-success" style="display:none;"></div>

<div class="card">
    <div class="card-header">
        <h1>Your Itinerary: <?= htmlspecialchars($trip['city']) ?></h1>
        <p>A <?= htmlspecialchars($trip['days']) ?>-day adventure with a <?= htmlspecialchars($trip['budget']) ?> budget.</p>
    </div>

    <div class="trip-actions" style="padding: 15px 0; display:flex; gap: 10px;">
        <a href="/download-trip.php?id=<?= $trip['id'] ?>" class="btn btn-success">Download Plan</a>
        <button id="share-btn" data-trip-id="<?= $trip['id'] ?>" class="btn btn-primary">Share Plan</button>
    </div>
    
    <div class="trip-plan">
        <?= simple_text_to_html($trip['ai_trip_text']) ?>
    </div>
</div>

<script src="/assets/js/main.js"></script>
<?php include 'footer.php'; ?>
