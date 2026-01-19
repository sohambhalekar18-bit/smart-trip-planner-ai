
<?php
// config/gemini.php

// IMPORTANT: Store your Gemini API Key here.
// For better security in a production environment, consider loading this from an environment variable.
define('GEMINI_API_KEY', 'AIzaSyBLl6EIPOqeM4FZk_jkOpMTIpG2zTb_5Ps');

// Gemini API Endpoint
define('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . GEMINI_API_KEY);

/**
 * Calls the Google Gemini API to generate content based on a given prompt.
 *
 * @param string $prompt The prompt to send to the AI model.
 * @param PDO $pdo The database connection object for logging.
 * @param int|null $trip_id The ID of the trip for logging purposes.
 * @return string|null The generated text content from the AI, or null on failure.
 */
function callGeminiAPI($prompt, $pdo, $trip_id = null) {
    $data = [
        'contents' => [
            [
                'parts' => [
                    [
                        'text' => $prompt
                    ]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7,
            'topK' => 1,
            'topP' => 1,
            'maxOutputTokens' => 8192,
        ]
    ];

    $json_data = json_encode($data);

    $ch = curl_init(GEMINI_API_URL);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Use true in production with proper CA certs

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    // Log the API call
    $log_stmt = $pdo->prepare(
        "INSERT INTO ai_logs (trip_id, prompt_sent, response_received, status, error_message) VALUES (?, ?, ?, ?, ?)"
    );

    if ($response === false || $http_code !== 200) {
        $error_message = "cURL Error: " . $curl_error . " | HTTP Code: " . $http_code . " | Response: " . $response;
        $log_stmt->execute([$trip_id, $prompt, $response, 'error', $error_message]);
        return null;
    }

    $result = json_decode($response, true);
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $generated_text = $result['candidates'][0]['content']['parts'][0]['text'];
        $log_stmt->execute([$trip_id, $prompt, $generated_text, 'success', null]);
        return $generated_text;
    } else {
        $error_message = "Error: Unexpected API response format. Full response: " . $response;
        $log_stmt->execute([$trip_id, $prompt, $response, 'error', $error_message]);
        return null;
    }
}
?>