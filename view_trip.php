
<?php
// user/view_trip.php
require_once '../config/db.php';
require_login();

$trip_id = $_GET['id'] ?? null;
if (!$trip_id) {
    header('Location: my_trips.php');
    exit();
}

// Fetch trip data, ensuring it belongs to the current user and is approved
$stmt = $pdo->prepare("
    SELECT t.*, c.name as city_name 
    FROM trips t
    JOIN cities c ON t.city_id = c.id
    WHERE t.id = ? AND t.user_id = ? AND t.status = 'approved'
");
$stmt->execute([$trip_id, $_SESSION['user_id']]);
$trip = $stmt->fetch();

if (!$trip) {
    // Redirect if trip not found, not owned by user, or not approved
    header('Location: my_trips.php');
    exit();
}

$page_title = 'Your Trip to ' . htmlspecialchars($trip['city_name']);

// A simple markdown-to-HTML converter for the AI plan
function simple_markdown_to_html($text) {
    // Convert headers (e.g., ### Title)
    $text = preg_replace('/^### (.*$)/m', '<h3>$1</h3>', $text);
    $text = preg_replace('/^## (.*$)/m', '<h2>$1</h2>', $text);
    // Convert bold (e.g., **text**)
    $text = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $text);
    // Convert lists (e.g., - item)
    $text = preg_replace('/^\- (.*$)/m', '<li>$1</li>', $text);
    $text = preg_replace('/(<li>.*<\/li>)/s', '<ul>$1</ul>', $text);
    // Convert paragraphs
    $text = '<p>' . preg_replace('/\n(\s*\n)+/', '</p><p>', $text) . '</p>';
    return $text;
}

include 'header.php';
?>

<div class="content-header">
    <a href="my_trips.php" class="btn btn-secondary">&larr; Back to My Trips</a>
</div>

<div class="card">
    <div class="card-header">
        <h1>Your Itinerary: <?= htmlspecialchars($trip['city_name']) ?></h1>
        <p>A <?= htmlspecialchars($trip['num_days']) ?>-day adventure with a <?= htmlspecialchars($trip['budget']) ?> budget.</p>
    </div>
    
    <div class="trip-plan-content">
        <?php 
        if (!empty($trip['ai_generated_plan'])) {
            echo simple_markdown_to_html(htmlspecialchars($trip['ai_generated_plan']));
        } else {
            echo '<p>No detailed plan available.</p>';
        }
        ?>
    </div>
</div>

<style>
.trip-plan-content h2 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.25rem;
}
.trip-plan-content h3 {
    font-size: 1.2rem;
    color: var(--dark-color);
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
.trip-plan-content ul {
    list-style-position: inside;
    padding-left: 1rem;
}
.trip-plan-content li {
    margin-bottom: 0.5rem;
}
</style>

<?php include 'footer.php'; ?>
