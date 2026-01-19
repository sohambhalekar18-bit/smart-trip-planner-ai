
<?php
// admin/edit_trip.php
require_once '../config/db.php';
require_admin();

$trip_id = $_GET['id'] ?? null;
if (!$trip_id) {
    header('Location: manage_trips.php');
    exit();
}

// Handle form submission for update/approve/reject
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ai_plan = $_POST['ai_generated_plan'];
    $admin_notes = $_POST['admin_notes'];
    $status = $_POST['status'];

    $stmt = $pdo->prepare("UPDATE trips SET ai_generated_plan = ?, admin_notes = ?, status = ? WHERE id = ?");
    $stmt->execute([$ai_plan, $admin_notes, $status, $trip_id]);
    
    header('Location: manage_trips.php');
    exit();
}

// Fetch trip data
$stmt = $pdo->prepare("
    SELECT t.*, u.name as user_name, c.name as city_name 
    FROM trips t
    JOIN users u ON t.user_id = u.id
    JOIN cities c ON t.city_id = c.id
    WHERE t.id = ?
");
$stmt->execute([$trip_id]);
$trip = $stmt->fetch();

if (!$trip) {
    header('Location: manage_trips.php');
    exit();
}

$page_title = 'Edit Trip Plan for ' . htmlspecialchars($trip['city_name']);
include 'header.php';
?>

<div class="card">
    <div class="card-header">
        <h3>Trip Details</h3>
    </div>
    <p><strong>User:</strong> <?= htmlspecialchars($trip['user_name']) ?></p>
    <p><strong>City:</strong> <?= htmlspecialchars($trip['city_name']) ?></p>
    <p><strong>Duration:</strong> <?= htmlspecialchars($trip['num_days']) ?> days</p>
    <p><strong>Budget:</strong> <?= htmlspecialchars(ucfirst($trip['budget'])) ?></p>
    <p><strong>Current Status:</strong> <span class="status-badge status-<?= $trip['status'] ?>"><?= htmlspecialchars(str_replace('_', ' ', ucfirst($trip['status']))) ?></span></p>
</div>

<div class="card">
    <div class="card-header">
        <h3>AI Generated Plan</h3>
    </div>
    <form action="edit_trip.php?id=<?= $trip_id ?>" method="POST">
        <div class="form-group">
            <label for="ai_generated_plan">Itinerary and Tips (Editable)</label>
            <textarea name="ai_generated_plan" id="ai_generated_plan" rows="25"><?= htmlspecialchars($trip['ai_generated_plan'] ?? 'No plan generated yet.') ?></textarea>
        </div>
        <div class="form-group">
            <label for="admin_notes">Admin Notes (Optional)</label>
            <textarea name="admin_notes" id="admin_notes" rows="3"><?= htmlspecialchars($trip['admin_notes'] ?? '') ?></textarea>
        </div>
        <div class="form-group">
            <label for="status">Update Status</label>
            <select name="status" id="status">
                <option value="pending_approval" <?= $trip['status'] == 'pending_approval' ? 'selected' : '' ?>>Pending Approval</option>
                <option value="approved" <?= $trip['status'] == 'approved' ? 'selected' : '' ?>>Approve</option>
                <option value="rejected" <?= $trip['status'] == 'rejected' ? 'selected' : '' ?>>Reject</option>
            </select>
        </div>
        
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <a href="manage_trips.php" class="btn btn-secondary">Back to List</a>
    </form>
</div>

<?php include 'footer.php'; ?>
