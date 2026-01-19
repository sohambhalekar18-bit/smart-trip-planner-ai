
<?php
// admin/manage_places.php
require_once '../config/db.php';
require_admin();

$page_title = 'Manage Places';
$feedback = '';

// Handle form submissions for add/edit
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $place_id = $_POST['place_id'] ?? null;
    $city_id = $_POST['city_id'];
    $name = trim($_POST['name']);
    $type = $_POST['type'];
    $description = trim($_POST['description']);
    $duration = filter_var($_POST['avg_visit_duration_mins'], FILTER_VALIDATE_INT);

    if (empty($name) || empty($city_id) || empty($type)) {
        $feedback = ['type' => 'danger', 'message' => 'City, name, and type are required.'];
    } else {
        if ($place_id) { // Update
            $stmt = $pdo->prepare("UPDATE places SET city_id = ?, name = ?, type = ?, description = ?, avg_visit_duration_mins = ? WHERE id = ?");
            $stmt->execute([$city_id, $name, $type, $description, $duration, $place_id]);
            $feedback = ['type' => 'success', 'message' => 'Place updated successfully.'];
        } else { // Insert
            $stmt = $pdo->prepare("INSERT INTO places (city_id, name, type, description, avg_visit_duration_mins) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$city_id, $name, $type, $description, $duration]);
            $feedback = ['type' => 'success', 'message' => 'Place added successfully.'];
        }
    }
}

// Handle delete
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("DELETE FROM places WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $feedback = ['type' => 'success', 'message' => 'Place deleted successfully.'];
}

// Fetch place for editing
$editing_place = null;
if (isset($_GET['action']) && $_GET['action'] == 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM places WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editing_place = $stmt->fetch();
}

// Fetch all cities for the dropdown
$cities = $pdo->query("SELECT id, name FROM cities ORDER BY name ASC")->fetchAll();
$place_types = ['Attraction','Restaurant','Museum','Park','Cafe','Shopping'];

// Fetch all places with city names
$places = $pdo->query("
    SELECT p.*, c.name as city_name 
    FROM places p
    JOIN cities c ON p.city_id = c.id
    ORDER BY c.name, p.name ASC
")->fetchAll();

include 'header.php';
?>

<?php if ($feedback): ?>
<div class="alert alert-<?= $feedback['type'] ?>"><?= $feedback['message'] ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header">
        <h3><?= $editing_place ? 'Edit Place' : 'Add New Place' ?></h3>
    </div>
    <form action="manage_places.php" method="POST">
        <input type="hidden" name="place_id" value="<?= $editing_place['id'] ?? '' ?>">
        <div class="form-group">
            <label for="city_id">City</label>
            <select name="city_id" id="city_id" required>
                <option value="">-- Select a City --</option>
                <?php foreach ($cities as $city): ?>
                <option value="<?= $city['id'] ?>" <?= (($editing_place['city_id'] ?? '') == $city['id']) ? 'selected' : '' ?>>
                    <?= htmlspecialchars($city['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="name">Place Name</label>
            <input type="text" name="name" id="name" value="<?= htmlspecialchars($editing_place['name'] ?? '') ?>" required>
        </div>
        <div class="form-group">
            <label for="type">Type</label>
            <select name="type" id="type" required>
                <?php foreach ($place_types as $type): ?>
                <option value="<?= $type ?>" <?= (($editing_place['type'] ?? '') == $type) ? 'selected' : '' ?>><?= $type ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="avg_visit_duration_mins">Avg. Visit Duration (minutes)</label>
            <input type="number" name="avg_visit_duration_mins" id="avg_visit_duration_mins" value="<?= htmlspecialchars($editing_place['avg_visit_duration_mins'] ?? '60') ?>">
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description"><?= htmlspecialchars($editing_place['description'] ?? '') ?></textarea>
        </div>
        <button type="submit" class="btn btn-primary"><?= $editing_place ? 'Update Place' : 'Add Place' ?></button>
        <?php if ($editing_place): ?>
        <a href="manage_places.php" class="btn btn-secondary">Cancel Edit</a>
        <?php endif; ?>
    </form>
</div>

<div class="card">
    <div class="card-header">
        <h3>Existing Places</h3>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Place Name</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($places as $place): ?>
                <tr>
                    <td><?= htmlspecialchars($place['name']) ?></td>
                    <td><?= htmlspecialchars($place['city_name']) ?></td>
                    <td><?= htmlspecialchars($place['type']) ?></td>
                    <td class="actions">
                        <a href="?action=edit&id=<?= $place['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                        <a href="?action=delete&id=<?= $place['id'] ?>" class="btn btn-sm btn-danger btn-delete-confirm">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'footer.php'; ?>
