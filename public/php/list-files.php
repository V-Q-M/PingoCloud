<?php

$dir = isset($_GET['dir']) ? $_GET['dir'] : 'images';

$basePath = __DIR__ . "/../storage/$dir";

$files = scandir($basePath);
if ($files === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to read directory']);
  exit;
}

$filtered = array_values(array_filter($files, function ($file) use ($basePath) {
  return is_file($basePath . '/' . $file);
}));

header('Content-Type: application/json');
echo json_encode($filtered);
