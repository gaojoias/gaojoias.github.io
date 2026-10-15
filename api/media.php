<?php

declare(strict_types=1);

// Serves files saved by upload.php. .htaccess routes img/uploads/<name> here
// when the file is not in public_html. No bootstrap: no session lock per image.
require __DIR__ . '/../app/uploads.php';

$types = [
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png'  => 'image/png',
    'gif'  => 'image/gif',
    'webp' => 'image/webp',
    'avif' => 'image/avif',
    'pdf'  => 'application/pdf',
];

$name = (string)($_GET['f'] ?? '');
$ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
$path = upload_storage_dir() . '/' . $name;

if (!preg_match('/^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/', $name) || !isset($types[$ext]) || !is_file($path)) {
    http_response_code(404);
    exit;
}

$mtime = (int)filemtime($path);
header('Content-Type: ' . $types[$ext]);
header('X-Content-Type-Options: nosniff');
// Names are random and never reused, so the browser can keep them forever
header('Cache-Control: public, max-age=31536000, immutable');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');

if (strtotime((string)($_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '')) === $mtime) {
    http_response_code(304);
    exit;
}

header('Content-Length: ' . (string)filesize($path));
readfile($path);
