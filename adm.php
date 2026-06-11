<?php
/*
 * Entry point for /adm — serves index.html with a dynamically calculated
 * <base href> so all relative asset paths resolve correctly regardless of
 * whether the project lives at the domain root (production) or in a
 * subdirectory (local development).
 */
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'];
$docRoot  = rtrim(str_replace('\\', '/', (string)$_SERVER['DOCUMENT_ROOT']), '/');
$selfDir  = rtrim(str_replace('\\', '/', dirname((string)$_SERVER['SCRIPT_FILENAME'])), '/');
$webDir   = trim(substr($selfDir, strlen($docRoot)), '/');
$base     = $protocol . '://' . $host . '/' . ($webDir !== '' ? $webDir . '/' : '');

$html = file_get_contents(__DIR__ . '/index.html');
// Inject base href right after <meta charset>
$html = str_replace(
    '<meta charset="utf-8" />',
    '<meta charset="utf-8" />' . "\n  " . '<base href="' . htmlspecialchars($base, ENT_QUOTES, 'UTF-8') . '" />',
    $html
);

header('Content-Type: text/html; charset=utf-8');
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
echo $html;
