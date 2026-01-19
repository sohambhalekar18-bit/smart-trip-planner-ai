
<?php
// generate-trip.php
require_once 'config/db.php';
require_once 'config/gemini.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $city = trim($_POST['city'] ?? '');
    $days = filter_var($_POST['days'] ?? 0, FILTER_VALIDATE_INT);
    $budget = trim($_POST['budget'] ?? '');
    $user_id = $_SESSION['user_id'];

    if (empty($city) || $days <= 0 || empty($budget)) {
        $_SESSION['error'] = "Invalid trip parameters. Please fill out the form correctly.";
        header('Location: /user/plan_trip.php');
        exit();
    }
    
    // Construct the prompt for Gemini
    $prompt = "Create a detailed and exciting travel itinerary for a trip to {$city} for {$days} days with a {$budget} budget.
    Provide a day-by-day plan with specific activities for morning, afternoon, and evening.
    Include recommendations for local food and transport.
    The response should be a single block of well-formatted text, using markdown for headings and lists.";

    // Call the Gemini API
    $ai_trip_text = callGeminiAPI($prompt, $pdo);

    if ($ai_trip_text) {
        // Save the trip to the database immediately
        $stmt = $pdo->prepare(
            "INSERT INTO trips (user_id, city, days, budget, ai_trip_text, created_at) VALUES (?, ?, ?, ?, ?, NOW())"
        );
        $stmt->execute([$user_id, $city, $days, $budget, $ai_trip_text]);
        $trip_id = $pdo->lastInsertId();

        // Redirect to view the newly created trip
        header('Location: /user/view-trip.php?id=' . $trip_id);
        exit();
    } else {
        // Handle API failure
        $_SESSION['error'] = "The AI failed to generate a trip plan. This can happen during peak times. Please try again in a moment.";
        header('Location: /user/plan_trip.php');
        exit();
    }
} else {
    // Redirect if accessed directly
    header('Location: /user/plan_trip.php');
    exit();
}
?>
