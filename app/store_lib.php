<?php

declare(strict_types=1);

function store_money(int|string|null $cents): string
{
    return 'R$ ' . cents_to_money($cents);
}

function store_whatsapp_href(string $message = 'Ola, quero falar com a GAO Joias.'): string
{
    $number = preg_replace('/\D+/', '', (string)app_config('store.whatsapp_number', '5519989689260')) ?? '';
    $text = rawurlencode($message);

    return $number !== ''
        ? "https://wa.me/{$number}?text={$text}"
        : "https://wa.me/?text={$text}";
}

function store_cart(): array
{
    return is_array($_SESSION['store_cart'] ?? null) ? $_SESSION['store_cart'] : [];
}

function store_set_cart(array $cart): void
{
    $_SESSION['store_cart'] = array_filter($cart, static fn(int $qty): bool => $qty > 0);
}

function store_cart_count(): int
{
    return array_sum(store_cart());
}

function store_product_query(string $where = '', array $params = []): array
{
    $sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            LEFT JOIN product_categories c ON c.id = p.category_id
            WHERE p.status = "active"';
    if ($where !== '') {
        $sql .= ' AND ' . $where;
    }
    $sql .= ' ORDER BY c.sort_order ASC, p.name ASC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function store_categories(): array
{
    return db()->query(
        'SELECT c.*, COUNT(p.id) AS products_count
         FROM product_categories c
         LEFT JOIN products p ON p.category_id = c.id AND p.status = "active"
         WHERE c.is_active = 1
         GROUP BY c.id
         ORDER BY c.sort_order ASC, c.name ASC'
    )->fetchAll();
}

function store_cart_items(): array
{
    $cart = store_cart();
    if (!$cart) {
        return ['items' => [], 'subtotal' => 0, 'errors' => []];
    }

    $ids = array_map('intval', array_keys($cart));
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = db()->prepare("SELECT * FROM products WHERE id IN ({$placeholders})");
    $stmt->execute($ids);
    $rows = $stmt->fetchAll();
    $products = [];
    foreach ($rows as $row) {
        $products[(int)$row['id']] = $row;
    }

    $items = [];
    $subtotal = 0;
    $errors = [];
    foreach ($cart as $productId => $quantity) {
        $product = $products[(int)$productId] ?? null;
        if (!$product || $product['status'] !== 'active') {
            $errors[] = 'Um produto do carrinho nao esta mais disponivel.';
            continue;
        }
        $available = (int)$product['stock_qty'] - (int)$product['reserved_qty'];
        if ((int)$product['track_stock'] === 1 && (int)$product['allow_backorder'] !== 1 && $quantity > $available) {
            $errors[] = $product['name'] . ' tem apenas ' . max($available, 0) . ' unidade(s) disponiveis.';
            $quantity = max($available, 0);
        }
        if ($quantity <= 0) {
            continue;
        }
        $total = (int)$product['price_cents'] * (int)$quantity;
        $items[] = [
            'product' => $product,
            'quantity' => (int)$quantity,
            'available' => $available,
            'total' => $total,
        ];
        $subtotal += $total;
    }

    return ['items' => $items, 'subtotal' => $subtotal, 'errors' => $errors];
}

function store_add_to_cart(int $productId, int $quantity): void
{
    $quantity = max($quantity, 1);
    $stmt = db()->prepare('SELECT id, track_stock, allow_backorder, stock_qty, reserved_qty FROM products WHERE id = ? AND status = "active"');
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    if (!$product) {
        throw new RuntimeException('Produto indisponivel.');
    }
    $cart = store_cart();
    $newQty = (int)($cart[$productId] ?? 0) + $quantity;
    $available = (int)$product['stock_qty'] - (int)$product['reserved_qty'];
    if ((int)$product['track_stock'] === 1 && (int)$product['allow_backorder'] !== 1 && $newQty > $available) {
        throw new RuntimeException('Estoque insuficiente para este produto.');
    }
    $cart[$productId] = $newQty;
    store_set_cart($cart);
}

function store_update_cart(array $quantities): void
{
    $cart = [];
    foreach ($quantities as $productId => $quantity) {
        $id = (int)$productId;
        $qty = max((int)$quantity, 0);
        if ($id > 0 && $qty > 0) {
            $cart[$id] = $qty;
        }
    }
    store_set_cart($cart);
}

function store_create_customer_from_checkout(array $customer): int
{
    $name = trim((string)($customer['name'] ?? ''));
    $email = trim((string)($customer['email'] ?? ''));
    $phone = trim((string)($customer['phone'] ?? ''));

    if ($email !== '') {
        $stmt = db()->prepare('SELECT id FROM customers WHERE email = ? ORDER BY id DESC LIMIT 1');
        $stmt->execute([$email]);
        $id = $stmt->fetchColumn();
        if ($id) {
            db()->prepare('UPDATE customers SET name = ?, phone = ? WHERE id = ?')->execute([$name, $phone ?: null, (int)$id]);
            return (int)$id;
        }
    }

    $stmt = db()->prepare('INSERT INTO customers (name, email, phone, notes) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email ?: null, $phone ?: null, 'Cliente criado pela loja online']);
    return (int)db()->lastInsertId();
}

function store_create_order(array $customer, array $shippingAddress = []): array
{
    $cartData = store_cart_items();
    if (!$cartData['items']) {
        throw new RuntimeException('Carrinho vazio.');
    }
    if ($cartData['errors']) {
        throw new RuntimeException(implode(' ', $cartData['errors']));
    }

    $name = trim((string)($customer['name'] ?? ''));
    $email = trim((string)($customer['email'] ?? ''));
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Informe nome e e-mail validos.');
    }

    db()->beginTransaction();
    try {
        $customerId = store_create_customer_from_checkout($customer);
        $subtotal = (int)$cartData['subtotal'];
        $shipping = 0;
        $discount = 0;
        $total = $subtotal + $shipping - $discount;
        $insertOrder = db()->prepare(
            'INSERT INTO orders (order_number, customer_id, status, payment_status, fulfillment_status, inventory_status, subtotal_cents, shipping_cents, discount_cents, total_cents, currency, customer_email, customer_name, customer_phone, shipping_address, notes, reservation_expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 2 HOUR))'
        );
        $insertOrder->execute([
            'TEMP-' . bin2hex(random_bytes(4)),
            $customerId,
            'draft',
            'pending',
            'unfulfilled',
            'reserved',
            $subtotal,
            $shipping,
            $discount,
            $total,
            strtoupper((string)app_config('stripe.currency', 'brl')),
            $email,
            $name,
            trim((string)($customer['phone'] ?? '')) ?: null,
            $shippingAddress ? app_json_encode($shippingAddress) : null,
            trim((string)($customer['notes'] ?? '')) ?: null,
        ]);
        $orderId = (int)db()->lastInsertId();
        $orderNumber = admin_set_public_number('orders', 'order_number', 'PED', $orderId);

        $insertItem = db()->prepare(
            'INSERT INTO order_items (order_id, product_id, sku, name, quantity, unit_price_cents, unit_cost_cents, total_cents)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($cartData['items'] as $item) {
            $product = $item['product'];
            $productId = (int)$product['id'];
            $qty = (int)$item['quantity'];
            $lock = db()->prepare('SELECT * FROM products WHERE id = ? FOR UPDATE');
            $lock->execute([$productId]);
            $locked = $lock->fetch();
            if (!$locked) {
                throw new RuntimeException('Produto indisponivel.');
            }
            $available = (int)$locked['stock_qty'] - (int)$locked['reserved_qty'];
            if ((int)$locked['track_stock'] === 1 && (int)$locked['allow_backorder'] !== 1 && $qty > $available) {
                throw new RuntimeException($locked['name'] . ' nao possui estoque suficiente.');
            }
            $insertItem->execute([
                $orderId,
                $productId,
                $locked['sku'],
                $locked['name'],
                $qty,
                (int)$locked['price_cents'],
                $locked['cost_cents'] !== null ? (int)$locked['cost_cents'] : null,
                (int)$locked['price_cents'] * $qty,
            ]);
            if ((int)$locked['track_stock'] === 1) {
                db()->prepare('UPDATE products SET reserved_qty = reserved_qty + ? WHERE id = ?')->execute([$qty, $productId]);
                admin_record_inventory_movement($productId, 'reservation', $qty, 'Reserva do pedido ' . $orderNumber, 'order', $orderId, null, (int)$locked['stock_qty']);
            }
        }

        db()->commit();
        store_set_cart([]);
    } catch (Throwable $e) {
        if (db()->inTransaction()) {
            db()->rollBack();
        }
        throw $e;
    }

    $stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
    $stmt->execute([$orderId]);
    return $stmt->fetch();
}

function store_order_items(int $orderId): array
{
    $stmt = db()->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
    $stmt->execute([$orderId]);
    return $stmt->fetchAll();
}

function store_stripe_request(string $method, string $endpoint, array $params = []): array
{
    $secret = (string)app_config('stripe.secret_key', '');
    if ($secret === '') {
        throw new RuntimeException('Configure a chave secreta da Stripe em config/config.php.');
    }

    $url = 'https://api.stripe.com/v1/' . ltrim($endpoint, '/');
    $body = http_build_query($params);
    if (!function_exists('curl_init')) {
        $context = stream_context_create([
            'http' => [
                'method' => strtoupper($method),
                'header' => "Authorization: Basic " . base64_encode($secret . ':') . "\r\nContent-Type: application/x-www-form-urlencoded\r\n",
                'content' => $body,
                'ignore_errors' => true,
            ],
        ]);
        $response = file_get_contents($url, false, $context);
    } else {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERPWD => $secret . ':',
            CURLOPT_POST => strtoupper($method) === 'POST',
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $response = curl_exec($ch);
        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('Erro de conexao com Stripe: ' . $error);
        }
        curl_close($ch);
    }

    $data = json_decode((string)$response, true);
    if (!is_array($data)) {
        throw new RuntimeException('Resposta invalida da Stripe.');
    }
    if (isset($data['error'])) {
        throw new RuntimeException((string)($data['error']['message'] ?? 'Erro na Stripe.'));
    }

    return $data;
}

function store_create_checkout_session(int $orderId): array
{
    $stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order) {
        throw new RuntimeException('Pedido nao encontrado.');
    }
    $items = store_order_items($orderId);
    if (!$items) {
        throw new RuntimeException('Pedido sem itens.');
    }

    $params = [
        'mode' => 'payment',
        'success_url' => absolute_url((string)app_config('stripe.success_path', 'loja/success.php')) . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => absolute_url((string)app_config('stripe.cancel_path', 'loja/cancel.php')) . '?order=' . urlencode((string)$order['order_number']),
        'client_reference_id' => (string)$order['order_number'],
        'customer_email' => (string)$order['customer_email'],
        'metadata' => [
            'order_id' => (string)$order['id'],
            'order_number' => (string)$order['order_number'],
        ],
        'payment_intent_data' => [
            'metadata' => [
                'order_id' => (string)$order['id'],
                'order_number' => (string)$order['order_number'],
            ],
        ],
    ];

    foreach ($items as $index => $item) {
        $params['line_items'][$index] = [
            'quantity' => (int)$item['quantity'],
            'price_data' => [
                'currency' => strtolower((string)app_config('stripe.currency', 'brl')),
                'unit_amount' => (int)$item['unit_price_cents'],
                'product_data' => [
                    'name' => $item['name'],
                    'metadata' => [
                        'product_id' => (string)$item['product_id'],
                        'sku' => $item['sku'],
                    ],
                ],
            ],
        ];
    }

    $session = store_stripe_request('POST', 'checkout/sessions', $params);
    db()->prepare('UPDATE orders SET status = ?, stripe_session_id = ?, checkout_url = ? WHERE id = ?')
        ->execute(['checkout_created', $session['id'] ?? null, $session['url'] ?? null, $orderId]);

    return $session;
}

function store_find_order_by_number(string $orderNumber): ?array
{
    $stmt = db()->prepare('SELECT * FROM orders WHERE order_number = ? LIMIT 1');
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();
    return $order ?: null;
}

function store_find_order_by_session(string $sessionId): ?array
{
    $stmt = db()->prepare('SELECT * FROM orders WHERE stripe_session_id = ? LIMIT 1');
    $stmt->execute([$sessionId]);
    $order = $stmt->fetch();
    return $order ?: null;
}

function store_release_order_reservation(int $orderId): void
{
    $stmt = db()->prepare('SELECT * FROM orders WHERE id = ? FOR UPDATE');
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order || $order['inventory_status'] !== 'reserved') {
        return;
    }

    foreach (store_order_items($orderId) as $item) {
        $productId = (int)$item['product_id'];
        $qty = (int)$item['quantity'];
        $productStmt = db()->prepare('SELECT stock_qty FROM products WHERE id = ? FOR UPDATE');
        $productStmt->execute([$productId]);
        $stock = (int)$productStmt->fetchColumn();
        db()->prepare('UPDATE products SET reserved_qty = GREATEST(reserved_qty - ?, 0) WHERE id = ?')->execute([$qty, $productId]);
        admin_record_inventory_movement($productId, 'release', -$qty, 'Liberacao de reserva do pedido ' . $order['order_number'], 'order', $orderId, null, $stock);
    }

    db()->prepare("UPDATE orders SET inventory_status = ?, status = IF(payment_status = 'paid', status, 'cancelled') WHERE id = ?")
        ->execute(['released', $orderId]);
}

function store_mark_order_paid(int $orderId, array $session): void
{
    db()->beginTransaction();
    try {
        $stmt = db()->prepare('SELECT * FROM orders WHERE id = ? FOR UPDATE');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        if (!$order) {
            throw new RuntimeException('Pedido nao encontrado.');
        }
        if ($order['payment_status'] === 'paid') {
            db()->commit();
            return;
        }

        $paymentIntent = $session['payment_intent'] ?? null;
        db()->prepare(
            'UPDATE orders
             SET status = ?, payment_status = ?, paid_at = NOW(), stripe_payment_intent_id = ?
             WHERE id = ?'
        )->execute(['processing', 'paid', $paymentIntent, $orderId]);

        db()->prepare(
            'INSERT INTO order_payments (order_id, provider, provider_payment_id, amount_cents, status, paid_at, raw_payload)
             VALUES (?, ?, ?, ?, ?, NOW(), ?)'
        )->execute([
            $orderId,
            'stripe',
            $paymentIntent,
            (int)($session['amount_total'] ?? $order['total_cents']),
            'paid',
            app_json_encode($session),
        ]);

        if ($order['inventory_status'] === 'reserved') {
            foreach (store_order_items($orderId) as $item) {
                $productId = (int)$item['product_id'];
                $qty = (int)$item['quantity'];
                $productStmt = db()->prepare('SELECT stock_qty FROM products WHERE id = ? FOR UPDATE');
                $productStmt->execute([$productId]);
                $before = (int)$productStmt->fetchColumn();
                $after = $before - $qty;
                db()->prepare('UPDATE products SET stock_qty = ?, reserved_qty = GREATEST(reserved_qty - ?, 0) WHERE id = ?')
                    ->execute([$after, $qty, $productId]);
                admin_record_inventory_movement($productId, 'sale', -$qty, 'Baixa do pedido ' . $order['order_number'], 'order', $orderId, null, $before);
            }
            db()->prepare('UPDATE orders SET inventory_status = ? WHERE id = ?')->execute(['deducted', $orderId]);
        }

        $entry = db()->prepare(
            'INSERT INTO financial_entries (type, category, description, amount_cents, status, source, reference, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())'
        );
        $entry->execute([
            'Entrada',
            'Venda ecommerce',
            'Pedido online ' . $order['order_number'],
            (int)($session['amount_total'] ?? $order['total_cents']),
            'Pago',
            'Loja',
            $order['order_number'],
        ]);
        admin_set_public_number('financial_entries', 'entry_number', 'FIN', (int)db()->lastInsertId());

        db()->commit();
    } catch (Throwable $e) {
        if (db()->inTransaction()) {
            db()->rollBack();
        }
        throw $e;
    }
}

function store_verify_stripe_signature(string $payload, string $header, string $secret, int $tolerance = 300): bool
{
    if ($secret === '' || $header === '') {
        return false;
    }
    $parts = [];
    foreach (explode(',', $header) as $pair) {
        [$key, $value] = array_pad(explode('=', trim($pair), 2), 2, null);
        if ($key && $value) {
            $parts[$key][] = $value;
        }
    }
    $timestamp = isset($parts['t'][0]) ? (int)$parts['t'][0] : 0;
    $signatures = $parts['v1'] ?? [];
    if (!$timestamp || !$signatures || abs(time() - $timestamp) > $tolerance) {
        return false;
    }
    $signedPayload = $timestamp . '.' . $payload;
    $expected = hash_hmac('sha256', $signedPayload, $secret);
    foreach ($signatures as $signature) {
        if (hash_equals($expected, $signature)) {
            return true;
        }
    }
    return false;
}

function store_process_stripe_event(array $event): void
{
    $eventId = (string)($event['id'] ?? '');
    $eventType = (string)($event['type'] ?? '');
    if ($eventId === '' || $eventType === '') {
        throw new RuntimeException('Evento Stripe invalido.');
    }

    $alreadyProcessed = db()->prepare('SELECT id FROM stripe_events WHERE event_id = ? LIMIT 1');
    $alreadyProcessed->execute([$eventId]);
    if ($alreadyProcessed->fetchColumn()) {
        return;
    }

    $session = $event['data']['object'] ?? [];
    if (!is_array($session)) {
        db()->prepare('INSERT IGNORE INTO stripe_events (event_id, event_type) VALUES (?, ?)')->execute([$eventId, $eventType]);
        return;
    }

    $orderId = (int)($session['metadata']['order_id'] ?? 0);
    $order = null;
    if ($orderId > 0) {
        $stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
    }
    if (!$order && !empty($session['id'])) {
        $order = store_find_order_by_session((string)$session['id']);
    }
    if (!$order) {
        db()->prepare('INSERT IGNORE INTO stripe_events (event_id, event_type) VALUES (?, ?)')->execute([$eventId, $eventType]);
        return;
    }

    if (in_array($eventType, ['checkout.session.completed', 'checkout.session.async_payment_succeeded'], true)) {
        store_mark_order_paid((int)$order['id'], $session);
        db()->prepare('INSERT IGNORE INTO stripe_events (event_id, event_type) VALUES (?, ?)')->execute([$eventId, $eventType]);
        return;
    }

    if (in_array($eventType, ['checkout.session.expired', 'checkout.session.async_payment_failed'], true)) {
        db()->beginTransaction();
        try {
            store_release_order_reservation((int)$order['id']);
            if ($eventType === 'checkout.session.async_payment_failed') {
                db()->prepare('UPDATE orders SET payment_status = ?, status = ? WHERE id = ?')->execute(['failed', 'cancelled', (int)$order['id']]);
            }
            db()->commit();
            db()->prepare('INSERT IGNORE INTO stripe_events (event_id, event_type) VALUES (?, ?)')->execute([$eventId, $eventType]);
        } catch (Throwable $e) {
            if (db()->inTransaction()) {
                db()->rollBack();
            }
            throw $e;
        }
        return;
    }

    db()->prepare('INSERT IGNORE INTO stripe_events (event_id, event_type) VALUES (?, ?)')->execute([$eventId, $eventType]);
}
