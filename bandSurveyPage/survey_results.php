<?php
// survey_results.php
// Handle survey form submission securely and email results.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$recipient = 'nibrudnotserp@gmail.com';

function sanitize_input($value)
{
    if (is_array($value)) {
        return implode(', ', array_map('sanitize_input', $value));
    }
    return trim(filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES));
}

function sanitize_header($value)
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value));
}

$raw_post = filter_input_array(INPUT_POST, FILTER_DEFAULT) ?: [];
$message_lines = [];

foreach ($raw_post as $key => $value) {
    $clean_key = sanitize_input($key);
    $clean_value = sanitize_input($value);
    $message_lines[] = "$clean_key: $clean_value";
}

$message = implode("\r\n", $message_lines);
$subject = sanitize_header('Survey Submission');
$headers = "From: noreply@hardprest.github.io\r\n";
$headers .= "Reply-To: noreply@hardprest.github.io\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (empty($message)) {
    http_response_code(400);
    exit('No form data submitted.');
}

if (mail($recipient, $subject, $message, $headers)) {
    echo 'Thank you. Your survey submission has been sent.';
} else {
    http_response_code(500);
    echo 'Unable to send submission. Please try again later.';
}
