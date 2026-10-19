<?php
declare(strict_types=1);

// One-off: creates product_category_map in production and reports the result. Removed right after running.
if (!hash_equals('eda0f900a3ce371140414a107b44eb2067678973', (string)($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit('Forbidden');
}

require __DIR__ . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
$type = static function (string $table, string $column): ?string {
    $row = db()->query("SHOW COLUMNS FROM `$table` LIKE '$column'")->fetch();
    return $row['Type'] ?? null;
};
$existedBefore = (bool)db()->query("SHOW TABLES LIKE 'product_category_map'")->fetch();
$error = null;
try {
    ensure_product_category_map();
} catch (Throwable $e) {
    $error = $e->getMessage();
}
$exists = (bool)db()->query("SHOW TABLES LIKE 'product_category_map'")->fetch();
$create = $exists ? (string)(db()->query('SHOW CREATE TABLE product_category_map')->fetch()['Create Table'] ?? '') : '';
echo json_encode([
    'products.id' => $type('products', 'id'),
    'product_categories.id' => $type('product_categories', 'id'),
    'existed_before' => $existedBefore,
    'exists_now' => $exists,
    'error' => $error,
    'fk_product' => str_contains($create, 'fk_pcm_product'),
    'fk_category' => str_contains($create, 'fk_pcm_category'),
    'products_with_category' => (int)db()->query('SELECT COUNT(*) FROM products WHERE category_id IS NOT NULL')->fetchColumn(),
    'map_rows' => $exists ? (int)db()->query('SELECT COUNT(*) FROM product_category_map')->fetchColumn() : null,
    'mismatches' => $exists ? (int)db()->query('SELECT COUNT(*) FROM products p WHERE p.category_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM product_category_map m WHERE m.product_id = p.id AND m.category_id = p.category_id)')->fetchColumn() : null,
], JSON_PRETTY_PRINT);
