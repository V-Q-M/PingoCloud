<?php

$dir = isset($_GET['dir']) ? $_GET['dir'] : 'images';
$uploadPath = __DIR__ . "/../storage/$dir";

// Ensure the upload directory exists
if (!is_dir($uploadPath)) {
  if (!mkdir($uploadPath, 0775, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create upload directory']);
    exit;
  }
}

// Check if file is being uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
  $file = $_FILES['file'];

  // Basic error handling
  if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Upload failed', 'details' => $file['error']]);
    exit;
  }

  $filename = basename($file['name']);
  $destination = $uploadPath . '/' . $filename;

  if (move_uploaded_file($file['tmp_name'], $destination)) {
    echo json_encode(['success' => true, 'filename' => $filename]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
  }
} else {
  http_response_code(405);
  echo json_encode(['error' => 'Invalid request method or missing file']);
}
