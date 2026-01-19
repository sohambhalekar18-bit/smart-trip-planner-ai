
<?php
// user/plan_trip.php
require_once '../config/db.php';
require_login();

$page_title = 'Plan a New Trip';

$cities = [
    'Paris', 'Tokyo', 'New York', 'London', 'Dubai', 'Rome', 'Bali', 'Sydney'
];

$error = $_SESSION['error'] ?? null;
unset($_SESSION['error']);

include 'header.php';
?>

<?php if ($error): ?>
<div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header">
        <h3>Let's Plan Your Next Adventure!</h3>
    </div>
    <p>Fill in the details below, and our AI will craft a personalized itinerary for you instantly.</p>
    <form action="/generate-trip.php" method="POST">
        <div class="form-group">
            <label for="city">Destination City</label>
            <select name="city" id="city" required>
                <option value="">-- Select a Destination --</option>
                <?php foreach ($cities as $city): ?>
                <option value="<?= $city ?>"><?= htmlspecialchars($city) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="days">Number of Days</label>
            <input type="number" name="days" id="days" min="1" max="14" value="3" required>
        </div>
        <div class="form-group">
            <label for="budget">Budget</label>
            <select name="budget" id="budget" required>
                <option value="budget">Budget</option>
                <option value="mid-range" selected>Mid-range</option>
                <option value="luxury">Luxury</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Generate My Trip</button>
    </form>
</div>

<?php include 'footer.php'; ?>
