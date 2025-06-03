<?php
header('Content-Type: application/json');

// Get and sanitize the directory name (allow only alphanumeric, dash, underscore)
$dir = isset($_GET['dir']) ? $_GET['dir'] : '';
if (!$dir || !preg_match('/^[a-zA-Z0-9_-]+$/', $dir)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid or missing dir parameter']);
  exit;
}

// Define paths
$storagePath = __DIR__ . "/../storage/$dir";
$htmlPath = __DIR__ . "/../pages/$dir.html";

// Create storage directory (assumed parent storage exists)
if (!mkdir($storagePath, 0775)) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to create storage directory']);
  exit;
}

// Prepare default HTML content
$htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PingoCloud</title>
  <link rel="icon" href="../icons/pingo.png" type="image/x-icon">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet">
</head>

<body class="bg-gray-50 text-gray-800 p-6">

  <div id="loading-screen" class="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
    <p class="mb-4 text-lg">Loading...</p>
    <div class="w-64 bg-gray-300 rounded-full h-4">
      <div id="progress-bar" class="bg-blue-600 h-4 rounded-full" style="width: 0%"></div>
    </div>
  </div>

  <a href="/index.html" class="block mx-auto w-max px-4 py-0 text-white rounded hover:bg-blue-600">
    <span class="flex items-center text-3xl gap-0" style="font-family: 'Permanent Marker', cursive;">
      Ping
      <img src="../icons/pingo.png" class="w-10 h-10" alt="Pingo Icon">
      Cloud
    </span>
  </a>


  <a href="../index.html" class="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    ← Back
  </a>

  <form action="../php/upload.php?dir=$dir" method="post" enctype="multipart/form-data">
    <input type="file" name="file">
    <button type="submit">Upload</button>
  </form>

  <h2 class="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
    🖿 $dir 
  </h2>
  <div id="download-container" class="grid grid-cols-5 gap-6"></div>
  <script src="/dist/download.js" defer></script>
  <script src="/dist/upload.js" defer></script>
</body>

</html>
HTML;

// Create or overwrite the HTML file
if (file_put_contents($htmlPath, $htmlContent) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to create HTML file']);
  exit;
}

// Success response
echo json_encode([
  'success' => true,
  'storagePath' => $storagePath,
  'htmlPath' => $htmlPath
]);
