<?php
// Directory where images are stored
$imageDir = __DIR__ . '/../public/images/';

// Get filename from URL (sanitized)

$filename = basename($_GET['file']); // Prevents traversal
$filepath = $imageDir . $filename;

// Check if file exists
if (file_exists($filepath)) {
  // Set headers to force download
  header('Content-Description: File Transfer');
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment; filename="' . $filename . '"');
  header('Content-Length: ' . filesize($filepath));
  header('Pragma: public');
  header('Cache-Control: must-revalidate');

  readfile($filepath);
  exit;
} else {
  echo "Error: File not found.";
}
