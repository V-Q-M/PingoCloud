<?php
// Get directory from query, default to 'images'
$dir = isset($_GET['dir']) ? $_GET['dir'] : 'images';

// Get sanitized filename from query
if (!isset($_GET['file'])) {
  http_response_code(400);
  echo "Error: No file specified.";
  exit;
}
$filename = basename($_GET['file']); // prevent directory traversal

// Build the full file path
$filePath = __DIR__ . "/../storage/$dir/$filename";

// Check if file exists
if (!file_exists($filePath)) {
  http_response_code(404);
  echo "Error: File not found.";
  exit;
}

// Set headers to force download
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . filesize($filePath));
header('Pragma: public');
header('Cache-Control: must-revalidate');

readfile($filePath);
exit;
