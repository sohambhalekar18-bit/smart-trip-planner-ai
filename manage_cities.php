
<?php
// admin/manage_cities.php
require_once '../config/db.php';
require_admin();

$page_title = 'Manage Cities';
$feedback = '';

// Handle form submissions for add/edit
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $city_id = $_POST['city_id'] ?? null;
    $name = trim($_POST['name']);
    $country = trim($_POST['country']);
    $description = trim($_POST['description']);
    $image_url = trim($_POST['image_url']);
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    if (empty($name) || empty($country)) {
        $feedback = ['type' => 'danger', 'message' => 'City name and country are required.'];
    } else {
        if ($city_id) { // Update
            $stmt = $pdo->prepare("UPDATE cities SET name = ?, country = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?");
            $stmt->execute([$name, $country, $description, $image_url, $is_active, $city_id]);
            $feedback = ['type' => 'success', 'message' => 'City updated successfully.'];
        } else { // Insert
            $stmt = $pdo->prepare("INSERT INTO cities (name, country, description, image_url, is_active) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $country, $description, $image_url, $is_active]);
            $feedback = ['type' => 'success', 'message' => 'City added successfully.'];
        }
    }
}

// Handle delete
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    // First, check for associated places
    $place_check = $pdo->prepare("SELECT COUNT(*) FROM places WHERE city_id = ?");
    $place_check->execute([$_GET['id']]);
    if ($place_check->fetchColumn() > 0) {
         $feedback = ['type' => 'danger', 'message' => 'Cannot delete city. It has associated places.'];
    } else {
        $stmt = $pdo->prepare("DELETE FROM cities WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $feedback = ['type' => 'success', 'message' => 'City deleted successfully.'];
    }
}

// Fetch city for editing
$editing_city = null;
if (isset($_GET['action']) && $_GET['action'] == 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM cities WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editing_city = $stmt->fetch();
}

// Fetch all cities
$cities = $pdo->query("SELECT * FROM cities ORDER BY name ASC")->fetchAll();

include 'header.php';
?>

<?php if ($feedback): ?>
<div class="alert alert-<?= $feedback['type'] ?>"><?= $feedback['message'] ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header">
        <h3><?= $editing_city ? 'Edit City' : 'Add New City' ?></h3>
    </div>
    <form action="manage_cities.php" method="POST">
        <input type="hidden" name="city_id" value="<?= $editing_city['id'] ?? '' ?>">
        <div class="form-group">
            <label for="name">City Name</label>
            <input type="text" name="name" id="name" value="<?= htmlspecialchars($editing_city['name'] ?? '') ?>" required>
        </div>
        <div class="form-group">
            <label for="country">Country</label>
            <input type="text" name="country" id="country" value="<?= htmlspecialchars($editing_city['country'] ?? '') ?>" required>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description"><?= htmlspecialchars($editing_city['description'] ?? '') ?></textarea>
        </div>
        <div class="form-group">
            <label for="image_url">Image URL</label>
            <input type="url" name="image_url" id="image_url" value="<?= htmlspecialchars($editing_city['image_url'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" name="is_active" value="1" <?= ($editing_city['is_active'] ?? 1) ? 'checked' : '' ?>>
                Active
            </label>
        </div>
        <button type="submit" class="btn btn-primary"><?= $editing_city ? 'Update City' : 'Add City' ?></button>
        <?php if ($editing_city): ?>
        <a href="manage_cities.php" class="btn btn-secondary">Cancel Edit</a>
        <?php endif; ?>
    </form>
</div>

<div class="card">
    <div class="card-header">
        <h3>Existing Cities</h3>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($cities as $city): ?>
                <tr>
                    <td><?= htmlspecialchars($city['name']) ?></td>
                    <td><?= htmlspecialchars($city['country']) ?></td>
                    <td><?= $city['is_active'] ? 'Active' : 'Inactive' ?></td>
                    <td class="actions">
                        <a href="?action=edit&id=<?= $city['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                        <a href="?action=delete&id=<?= $city['id'] ?>" class="btn btn-sm btn-danger btn-delete-confirm" data-confirm-message="Are you sure you want to delete this city? Any associated trips will also be affected.">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'footer.php'; ?>
