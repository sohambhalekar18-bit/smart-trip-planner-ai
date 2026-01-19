
<?php
// download-trip.php
require_once 'config/db.php';
require_login();

$trip_id = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
$user_id = $_SESSION['user_id'];

if ($trip_id <= 0) {
    header('Location: /user/my-trips.php');
    exit();
}

// Fetch the trip, ensuring it belongs to the logged-in user
$stmt = $pdo->prepare("SELECT * FROM trips WHERE id = ? AND user_id = ?");
$stmt->execute([$trip_id, $user_id]);
$trip = $stmt->fetch();

if (!$trip) {
    // Trip not found or doesn't belong to the user
    header('Location: /user/my-trips.php');
    exit();
}

// Update the is_downloaded flag
$update_stmt = $pdo->prepare("UPDATE trips SET is_downloaded = 1 WHERE id = ?");
$update_stmt->execute([$trip_id]);

// Sanitize city name for the filename
$filename = "Trip-to-" . preg_replace('/[^a-zA-Z0-9-]/', '', $trip['city']) . ".html";

// Set headers for file download
header('Content-Type: text/html');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Simple markdown to HTML conversion for download
function text_to_html($text) {
    $text = htmlspecialchars($text);
    $text = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $text); // Bold
    $text = preg_replace('/^\- (.*$)/m', '<li>$1</li>', $text); // List items
    $text = nl2br($text); // New lines
    return $text;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Trip to <?= htmlspecialchars($trip['city']) ?></title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 20px auto; padding: 20px; }
        h1 { color: #0056b3; }
        h2 { color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px; }
        strong { font-weight: bold; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .trip-header { text-align: center; border-bottom: 2px solid #ccc; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="trip-header">
        <h1>Your Trip Plan: <?= htmlspecialchars($trip['city']) ?></h1>
        <p><strong>Duration:</strong> <?= htmlspecialchars($trip['days']) ?> days | <strong>Budget:</strong> <?= htmlspecialchars(ucfirst($trip['budget'])) ?></p>
    </div>
    <div class="trip-content">
        <?= text_to_html($trip['ai_trip_text']) ?>
    </div>
</body>
</html>
