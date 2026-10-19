<?php
declare(strict_types=1);

// One-off: applies and verifies products.supplier_ref in production. Removed right after running.
if (!hash_equals('f718f446bdd8983215e64aadb42539e2d5a20357', (string)($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit('Forbidden');
}

require __DIR__ . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
$column = static fn() => db()->query("SHOW COLUMNS FROM products LIKE 'supplier_ref'")->fetch() ?: null;
$before = $column();
ensure_products_supplier_ref();
$after = $column();
$fields = db()->query('SHOW COLUMNS FROM products')->fetchAll(PDO::FETCH_COLUMN);
echo json_encode([
    'existed_before' => $before !== null,
    'exists_now' => $after !== null,
    'type' => $after['Type'] ?? null,
    'after_sku' => ($fields[array_search('sku', $fields, true) + 1] ?? null) === 'supplier_ref',
    'products' => (int)db()->query('SELECT COUNT(*) FROM products')->fetchColumn(),
], JSON_PRETTY_PRINT);
