<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';

current_admin() ?: json_response(['ok' => false, 'error' => 'Nao autenticado.'], 401);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Metodo nao permitido.'], 405);
}

$file = $_FILES['file'] ?? null;
if (!$file || !isset($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
    $errMsg = match((int)($file['error'] ?? -1)) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Arquivo muito grande.',
        UPLOAD_ERR_NO_FILE => 'Nenhum arquivo enviado.',
        default => 'Erro no upload.',
    };
    json_response(['ok' => false, 'error' => $errMsg], 422);
}

$allowedMime = [
    'image/jpeg'       => 'jpg',
    'image/png'        => 'png',
    'image/gif'        => 'gif',
    'image/webp'       => 'webp',
    'image/avif'       => 'avif',
    'application/pdf'  => 'pdf',
];

$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
if (!array_key_exists($mimeType, $allowedMime)) {
    json_response(['ok' => false, 'error' => 'Tipo de arquivo nao permitido. Use imagens (JPG, PNG, WEBP) ou PDF.'], 422);
}

$maxBytes = 8 * 1024 * 1024; // 8 MB
if ($file['size'] > $maxBytes) {
    json_response(['ok' => false, 'error' => 'Arquivo muito grande. Maximo 8 MB.'], 422);
}

$uploadDir = __DIR__ . '/../img/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext      = $allowedMime[$mimeType];
$name     = bin2hex(random_bytes(12)) . '.' . $ext;
$destPath = $uploadDir . $name;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    json_response(['ok' => false, 'error' => 'Falha ao salvar arquivo.'], 500);
}

json_response(['ok' => true, 'url' => 'img/uploads/' . $name]);
