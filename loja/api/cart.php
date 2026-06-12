<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../../app/bootstrap.php';
require __DIR__ . '/../../app/admin_api.php';
require __DIR__ . '/../../app/store_lib.php';

$action = (string)($_POST['action'] ?? 'get');

try {
    if ($action === 'add') {
        $productId = (int)($_POST['product_id'] ?? 0);
        $qty       = max(1, (int)($_POST['quantity'] ?? 1));
        store_add_to_cart($productId, $qty);
    } elseif ($action === 'update') {
        $productId = (int)($_POST['product_id'] ?? 0);
        $qty       = max(0, (int)($_POST['quantity'] ?? 0));
        store_update_cart([$productId => $qty]);
    } elseif ($action === 'remove') {
        $productId = (int)($_POST['product_id'] ?? 0);
        store_update_cart([$productId => 0]);
    }

    $cart  = store_cart_items();
    $count = store_cart_count();

    $items = array_map(function (array $item): array {
        $p = $item['product'];
        return [
            'product_id' => (int)$p['id'],
            'name'        => (string)$p['name'],
            'sku'         => (string)$p['sku'],
            'image_url'   => (string)($p['image_url'] ?: ''),
            'price_fmt'   => store_money((int)$p['price_cents']),
            'quantity'    => (int)$item['quantity'],
            'total_fmt'   => store_money((int)$item['total']),
        ];
    }, $cart['items']);

    echo json_encode([
        'ok'           => true,
        'count'        => $count,
        'subtotal_fmt' => store_money((int)($cart['subtotal'] ?? 0)),
        'items'        => $items,
    ]);
} catch (Throwable $e) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
