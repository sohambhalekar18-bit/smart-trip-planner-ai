
<?php
// admin/manage_trips.php
require_once '../config/db.php';
require_once '../config/gemini.php';
require_admin();

$page_title = 'Manage Trips';
$feedback = '';

// Handle AI Generation
if (isset($_GET['action']) && $_GET['action'] == 'generate' && isset($_GET['id'])) {
    $trip_id = $_GET['id'];
    
    // 1. Fetch trip details
    $trip_stmt = $pdo->prepare("SELECT t.num_days, t.budget, c.name as city_name FROM trips t JOIN cities c ON t.city_id = c.id WHERE t.id = ?");
    $trip_stmt->execute([$trip_id]);
    $trip = $trip_stmt->fetch();

    if ($trip) {
        // 2. Fetch places for the city
        $places_stmt = $pdo->prepare("SELECT name, type, description FROM places WHERE city_id = (SELECT city_id FROM trips WHERE id = ?)");
        $places_stmt->execute([$trip_id]);
        $places = $places_stmt->fetchAll();
        
        if (empty($places)) {
            $feedback = ['type' => 'danger', 'message' => 'Cannot generate plan. No places have been added for this city yet.'];
        } else {
            // 3. Construct the prompt
            $places_list = '';
            foreach($places as $place) {
                $places_list .= "- " . $place['name'] . " (" . $place['type'] . "): " . $place['description'] . "\n";
            }
            
            $prompt = "You are a professional travel planner.
Create a " . $trip['num_days'] . "-day trip plan for " . $trip['city_name'] . " with a " . $trip['budget'] . " budget.
The plan must be engaging, well-structured, and realistic.

Use ONLY the following places from the list provided:
" . $places_list . "

Rules:
- Create a detailed day-wise plan with sections for Morning, Afternoon, and Evening for each day.
- Suggest a logical sequence of activities.
- Include a brief, engaging trip summary at the beginning.
- Provide a few practical travel tips at the end.
- Do not invent new places or activities not on the provided list.
- Format the output clearly with markdown for headings and lists.";

            // 4. Call Gemini API
            $generated_plan = callGeminiAPI($prompt, $pdo, $trip_id);
            
            // 5. Update trip in DB
            if ($generated_plan) {
                $update_stmt = $pdo->prepare("UPDATE trips SET ai_generated_plan = ?, status = 'pending_approval' WHERE id = ?");
                $update_stmt->execute([$generated_plan, $trip_id]);
                $feedback = ['type' => 'success', 'message' => 'AI trip plan generated successfully! It is now pending approval.'];
            } else {
                $feedback = ['type' => 'danger', 'message' => 'Failed to generate AI plan. Check AI logs for details.'];
                 $update_stmt = $pdo->prepare("UPDATE trips SET status = 'rejected', admin_notes = 'AI generation failed' WHERE id = ?");
                $update_stmt->execute([$trip_id]);
            }
        }
    } else {
        $feedback = ['type' => 'danger', 'message' => 'Trip not found.'];
    }
}


// Fetch all trips
$trips = $pdo->query("
    SELECT t.id, u.name as user_name, c.name as city_name, t.num_days, t.budget, t.status
    FROM trips t
    JOIN users u ON t.user_id = u.id
    JOIN cities c ON t.city_id = c.id
    ORDER BY t.created_at DESC
")->fetchAll();

include 'header.php';
?>

<?php if ($feedback): ?>
<div class="alert alert-<?= $feedback['type'] ?>"><?= $feedback['message'] ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header">
        <h3>All User Trips</h3>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>City</th>
                    <th>Duration</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($trips as $trip): ?>
                <tr>
                    <td><?= htmlspecialchars($trip['user_name']) ?></td>
                    <td><?= htmlspecialchars($trip['city_name']) ?></td>
                    <td><?= htmlspecialchars($trip['num_days']) ?> days</td>
                    <td><?= htmlspecialchars(ucfirst($trip['budget'])) ?></td>
                    <td><span class="status-badge status-<?= $trip['status'] ?>"><?= htmlspecialchars(str_replace('_', ' ', ucfirst($trip['status']))) ?></span></td>
                    <td class="actions">
                        <?php if ($trip['status'] == 'pending_generation'): ?>
                            <a href="?action=generate&id=<?= $trip['id'] ?>" class="btn btn-sm btn-primary">Generate AI Plan</a>
                        <?php elseif (in_array($trip['status'], ['pending_approval', 'approved', 'rejected'])): ?>
                            <a href="edit_trip.php?id=<?= $trip['id'] ?>" class="btn btn-sm btn-secondary">View/Edit Plan</a>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
                 <?php if (empty($trips)): ?>
                    <tr><td colspan="6">No trips have been planned yet.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'footer.php'; ?>
