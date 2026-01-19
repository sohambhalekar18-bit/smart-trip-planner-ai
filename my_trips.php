
<?php
// user/my_trips.php
require_once '../config/db.php';
require_login();

$page_title = 'My Trips';

// Fetch user's trips
$stmt = $pdo->prepare("
    SELECT t.id, c.name as city_name, t.num_days, t.budget, t.status, t.created_at
    FROM trips t
    JOIN cities c ON t.city_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$trips = $stmt->fetchAll();

include 'header.php';
?>

<div class="content-header">
    <h2>Your Planned Trips</h2>
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
                    <th>Status</th>
                    <th>Date Planned</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($trips)): ?>
                    <tr>
                        <td colspan="6" style="text-align: center;">You haven't planned any trips yet.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($trips as $trip): ?>
                    <tr>
                        <td><?= htmlspecialchars($trip['city_name']) ?></td>
                        <td><?= htmlspecialchars($trip['num_days']) ?> days</td>
                        <td><?= htmlspecialchars(ucfirst($trip['budget'])) ?></td>
                        <td>
                            <span class="status-badge status-<?= $trip['status'] ?>">
                                <?= htmlspecialchars(str_replace('_', ' ', ucfirst($trip['status']))) ?>
                            </span>
                        </td>
                        <td><?= date('M d, Y', strtotime($trip['created_at'])) ?></td>
                        <td class="actions">
                            <?php if ($trip['status'] == 'approved'): ?>
                                <a href="view_trip.php?id=<?= $trip['id'] ?>" class="btn btn-sm btn-success">View Plan</a>
                            <?php else: ?>
                                <button class="btn btn-sm btn-secondary" disabled>View Plan</button>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'footer.php'; ?>
