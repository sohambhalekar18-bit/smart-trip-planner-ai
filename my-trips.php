
<?php
// user/my-trips.php
require_once '../config/db.php';
require_login();

$page_title = 'My Trips';

// Fetch user's saved trips
$stmt = $pdo->prepare("
    SELECT id, city, days, budget, created_at
    FROM trips
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$trips = $stmt->fetchAll();

include 'header.php';
?>

<div class="content-header">
    <h2>Your Saved Trips</h2>
    <a href="plan_trip.php" class="btn btn-primary">Plan a New Trip</a>
</div>

<div class="card">
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Destination</th>
                    <th>Duration</th>
                    <th>Budget</th>
                    <th>Date Planned</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($trips)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">You haven't planned any trips yet.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($trips as $trip): ?>
                    <tr>
                        <td><?= htmlspecialchars($trip['city']) ?></td>
                        <td><?= htmlspecialchars($trip['days']) ?> days</td>
                        <td><?= htmlspecialchars(ucfirst($trip['budget'])) ?></td>
                        <td><?= date('M d, Y', strtotime($trip['created_at'])) ?></td>
                        <td class="actions">
                            <a href="view-trip.php?id=<?= $trip['id'] ?>" class="btn btn-sm btn-primary">View Plan</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'footer.php'; ?>
