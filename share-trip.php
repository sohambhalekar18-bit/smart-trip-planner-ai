
<?php
// share-trip.php
require_once 'config/db.php';

// --- API endpoint for generating a share token ---
if (isset($_GET['action']) && $_GET['action'] == 'generate_token' && isset($_GET['id'])) {
    require_login(); // Ensure user is logged in to generate a token
    
    $trip_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT id, share_token FROM trips WHERE id = ? AND user_id = ?");
    $stmt->execute([$trip_id, $user_id]);
    $trip = $stmt->fetch();

    if ($trip) {
        $token = $trip['share_token'];
        if (empty($token)) {
            $token = bin2hex(random_bytes(32));
            $update_stmt = $pdo->prepare("UPDATE trips SET share_token = ?, is_shared = 1 WHERE id = ?");
            $update_stmt->execute([$token, $trip_id]);
        }
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'token' => $token]);
        exit();
    }

    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Trip not found.']);
    exit();
}


// --- Public page for viewing a shared trip ---
$token = trim($_GET['token'] ?? '');
if (empty($token)) {
    die("Invalid share link.");
}

$stmt = $pdo->prepare("SELECT * FROM trips WHERE share_token = ?");
$stmt->execute([$token]);
$trip = $stmt->fetch();

if (!$trip) {
    die("This trip is no longer shared or does not exist.");
}

// Simple markdown to HTML conversion
function text_to_html_public($text) {
    $text = htmlspecialchars($text);
    $text = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $text);
    $text = preg_replace('/^\- (.*$)/m', '<li>$1</li>', $text);
    $text = nl2br($text);
    return $text;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A Shared Trip Plan to <?= htmlspecialchars($trip['city']) ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        body { background-color: #f4f7f6; }
        .share-container { max-width: 900px; margin: 40px auto; }
    </style>
</head>
<body>
    <div class="share-container">
        <div class="card">
            <div class="card-header" style="text-align:center;">
                <h3>A Trip Plan to <?= htmlspecialchars($trip['city']) ?></h3>
                <p>
                    <strong>Duration:</strong> <?= htmlspecialchars($trip['days']) ?> days | 
                    <strong>Budget:</strong> <?= htmlspecialchars(ucfirst($trip['budget'])) ?>
                </p>
            </div>
            <div class="trip-plan">
                <?= text_to_html_public($trip['ai_trip_text']) ?>
            </div>
            <p style="text-align:center; margin-top: 20px; color: #777;">
                This trip was planned with Smart Trip Planner.
            </p>
        </div>
    </div>
</body>
</html>
