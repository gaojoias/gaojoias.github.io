<?php

declare(strict_types=1);

function admin_find_customer_id(string $name): ?int
{
    $name = trim($name);
    if ($name === '') {
        return null;
    }

    $stmt = db()->prepare('SELECT id FROM customers WHERE name = ? ORDER BY id DESC LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();

    return $id ? (int)$id : null;
}

function admin_public_number(string $prefix, int $id): string
{
    return $prefix . '-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT);
}

function admin_unique_slug(string $value, string $table, ?int $ignoreId = null): string
{
    $base = slugify($value);
    $slug = $base;
    $suffix = 2;
    while (true) {
        $sql = "SELECT id FROM {$table} WHERE slug = ?";
        $params = [$slug];
        if ($ignoreId !== null) {
            $sql .= ' AND id <> ?';
            $params[] = $ignoreId;
        }
        $sql .= ' LIMIT 1';
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        if (!$stmt->fetchColumn()) {
            return $slug;
        }
        $slug = $base . '-' . $suffix;
        $suffix++;
    }
}

function admin_set_public_number(string $table, string $column, string $prefix, int $id): string
{
    $number = admin_public_number($prefix, $id);
    $stmt = db()->prepare("UPDATE {$table} SET {$column} = ? WHERE id = ?");
    $stmt->execute([$number, $id]);

    return $number;
}

function admin_normalize_items(array $payload): array
{
    $items = [];
    $raw = $payload['itensJson'] ?? null;

    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $items = $decoded;
        }
    } elseif (is_array($raw)) {
        $items = $raw;
    }

    if (!$items && (!empty($payload['produtoServico']) || !empty($payload['valor']) || !empty($payload['valorTotal']))) {
        $items[] = [
            'tipo' => 'Produto',
            'titulo' => (string)($payload['produtoServico'] ?? 'Item'),
            'descricao' => (string)($payload['descricao'] ?? ''),
            'quantidade' => 1,
            'valorUnitario' => $payload['valorTotal'] ?? $payload['valor'] ?? 0,
            'custoUnitario' => $payload['custoMaterial'] ?? $payload['totalCustos'] ?? 0,
        ];
    }

    $normalized = [];
    foreach ($items as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = trim((string)($item['titulo'] ?? $item['nome'] ?? 'Item ' . ($index + 1)));
        $quantity = max((float)str_replace(',', '.', (string)($item['quantidade'] ?? 1)), 0.01);
        $unitPrice = money_to_cents($item['valorUnitario'] ?? $item['valor'] ?? 0);
        $unitCost = money_to_cents($item['custoUnitario'] ?? 0);
        if ($title === '' && $unitPrice <= 0) {
            continue;
        }
        $normalized[] = [
            'product_id' => !empty($item['productId']) ? (int)$item['productId'] : (!empty($item['product_id']) ? (int)$item['product_id'] : null),
            'tipo' => in_array(($item['tipo'] ?? 'Produto'), ['Produto', 'Servico'], true) ? (string)$item['tipo'] : 'Produto',
            'titulo' => $title !== '' ? $title : 'Item ' . ($index + 1),
            'descricao' => trim((string)($item['descricao'] ?? '')),
            'quantidade' => $quantity,
            'valorUnitarioCents' => $unitPrice,
            'custoUnitarioCents' => $unitCost,
            'totalCents' => (int)round($unitPrice * $quantity),
        ];
    }

    return $normalized;
}

function admin_normalize_payments(array $payload, int $saleTotalCents): array
{
    $payments = [];
    $raw = $payload['pagamentosJson'] ?? null;

    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $payments = $decoded;
        }
    } elseif (is_array($raw)) {
        $payments = $raw;
    }

    if (!$payments && $saleTotalCents > 0) {
        $received = money_to_cents($payload['valorRecebido'] ?? $payload['valor'] ?? 0);
        $received = min($received, $saleTotalCents);
        if ($received > 0) {
            $payments[] = [
                'descricao' => 'Recebimento principal',
                'valor' => cents_to_decimal($received),
                'forma' => $payload['pgto'] ?? 'Pix',
                'status' => 'Pago',
                'recebidoEm' => $payload['dataHora'] ?? null,
            ];
        }
        if ($received < $saleTotalCents) {
            $payments[] = [
                'descricao' => 'Saldo restante',
                'valor' => cents_to_decimal($saleTotalCents - $received),
                'forma' => $payload['pgto'] ?? 'Pix',
                'status' => 'Pendente',
                'vencimento' => $payload['vencimento'] ?? null,
            ];
        }
    }

    $normalized = [];
    foreach ($payments as $index => $payment) {
        if (!is_array($payment)) {
            continue;
        }
        $amount = money_to_cents($payment['valor'] ?? 0);
        if ($amount <= 0) {
            continue;
        }
        $status = (string)($payment['status'] ?? 'Pendente');
        $normalized[] = [
            'descricao' => trim((string)($payment['descricao'] ?? 'Parcela ' . ($index + 1))),
            'valorCents' => $amount,
            'forma' => trim((string)($payment['forma'] ?? 'Pix')),
            'status' => $status === 'Pago' ? 'Pago' : 'Pendente',
            'vencimento' => to_mysql_date($payment['vencimento'] ?? null),
            'recebidoEm' => ($status === 'Pago') ? to_mysql_datetime($payment['recebidoEm'] ?? null) : null,
        ];
    }

    return $normalized;
}

function admin_item_totals(array $items, int $extraCostCents = 0): array
{
    $subtotal = 0;
    $itemCosts = 0;
    foreach ($items as $item) {
        $subtotal += (int)$item['totalCents'];
        $itemCosts += (int)round((int)$item['custoUnitarioCents'] * (float)$item['quantidade']);
    }
    $totalCosts = $itemCosts + $extraCostCents;
    $profit = $subtotal - $totalCosts;

    return [
        'subtotal' => $subtotal,
        'itemCosts' => $itemCosts,
        'extraCosts' => $extraCostCents,
        'totalCosts' => $totalCosts,
        'profit' => $profit,
        'margin' => $subtotal > 0 ? round(($profit / $subtotal) * 100, 2) : 0,
    ];
}

function admin_items_to_front(array $items): array
{
    return array_map(static fn(array $item): array => [
        'id' => 'item-' . (int)$item['id'],
        'productId' => $item['product_id'] !== null ? (int)$item['product_id'] : null,
        'tipo' => $item['item_type'],
        'titulo' => $item['title'],
        'descricao' => $item['description'] ?? '',
        'quantidade' => (float)$item['quantity'],
        'valorUnitario' => cents_to_decimal($item['unit_price_cents']),
        'custoUnitario' => cents_to_decimal($item['unit_cost_cents']),
    ], $items);
}

function admin_payments_to_front(array $payments): array
{
    return array_map(static fn(array $payment): array => [
        'id' => 'pay-' . (int)$payment['id'],
        'descricao' => $payment['description'],
        'valor' => cents_to_decimal($payment['amount_cents']),
        'forma' => $payment['method'],
        'status' => $payment['status'],
        'vencimento' => $payment['due_at'],
        'recebidoEm' => $payment['paid_at'],
    ], $payments);
}

function admin_fetch_quote_items(int $quoteId): array
{
    $stmt = db()->prepare('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY id ASC');
    $stmt->execute([$quoteId]);
    return $stmt->fetchAll();
}

function admin_fetch_sale_items(int $saleId): array
{
    $stmt = db()->prepare('SELECT * FROM sale_items WHERE sale_id = ? ORDER BY id ASC');
    $stmt->execute([$saleId]);
    return $stmt->fetchAll();
}

function admin_fetch_sale_payments(int $saleId): array
{
    $stmt = db()->prepare('SELECT * FROM sale_payments WHERE sale_id = ? ORDER BY id ASC');
    $stmt->execute([$saleId]);
    return $stmt->fetchAll();
}

function admin_summary_label(array $items): string
{
    if (!$items) {
        return '-';
    }
    $first = $items[0]['titulo'] ?? $items[0]['title'] ?? 'Item';
    return count($items) === 1 ? $first : $first . ' +' . (count($items) - 1);
}

function admin_description_summary(array $items): string
{
    $parts = [];
    foreach ($items as $item) {
        $parts[] = $item['descricao'] ?? $item['description'] ?? $item['titulo'] ?? $item['title'] ?? '';
    }
    return substr(implode(' | ', array_filter($parts)), 0, 500);
}

function admin_customer_payload(array $row): array
{
    return [
        'rowIndex' => (int)$row['id'],
        'id' => (int)$row['id'],
        'dataHora' => $row['created_at'],
        'nome' => $row['name'],
        'telefone' => $row['phone'] ?? '',
        'email' => $row['email'] ?? '',
        'empresa' => $row['company'] ?? '',
        'cpfCNPJ' => $row['document'] ?? '',
        'obs' => $row['notes'] ?? '',
    ];
}

function admin_quote_payload(array $row): array
{
    $items = admin_items_to_front(admin_fetch_quote_items((int)$row['id']));
    return [
        'rowIndex' => (int)$row['id'],
        'id' => (int)$row['id'],
        'numero' => $row['quote_number'],
        'dataHora' => $row['created_at'],
        'cliente' => $row['customer_name'],
        'produtoServico' => admin_summary_label($items),
        'descricao' => admin_description_summary($items),
        'validade' => $row['valid_until'],
        'obsPublic' => $row['public_notes'] ?? '',
        'obsPrivate' => $row['private_notes'] ?? '',
        'custoMaterial' => cents_to_decimal($row['items_cost_cents']),
        'custoOutros' => cents_to_decimal($row['extra_cost_cents']),
        'totalCustos' => cents_to_decimal($row['total_cost_cents']),
        'lucro' => cents_to_decimal($row['profit_cents']),
        'margem' => (float)$row['margin_percent'],
        'valorTotal' => cents_to_decimal($row['subtotal_cents']),
        'itensJson' => app_json_encode($items),
        'status' => $row['status'],
    ];
}

function admin_sale_payload(array $row): array
{
    $items = admin_items_to_front(admin_fetch_sale_items((int)$row['id']));
    $payments = admin_payments_to_front(admin_fetch_sale_payments((int)$row['id']));
    return [
        'rowIndex' => (int)$row['id'],
        'id' => (int)$row['id'],
        'numero' => $row['sale_number'],
        'dataHora' => $row['created_at'],
        'cliente' => $row['customer_name'],
        'produtoServico' => admin_summary_label($items),
        'descricao' => admin_description_summary($items),
        'valor' => cents_to_decimal($row['subtotal_cents']),
        'valorRecebido' => cents_to_decimal($row['received_cents']),
        'saldoRestante' => cents_to_decimal($row['balance_cents']),
        'statusRecebimento' => $row['payment_status'],
        'vencimento' => $row['due_at'],
        'totalCustos' => cents_to_decimal($row['total_cost_cents']),
        'lucro' => cents_to_decimal($row['profit_cents']),
        'margem' => (float)$row['margin_percent'],
        'pgto' => $row['payment_summary'] ?? 'Pix',
        'itensJson' => app_json_encode($items),
        'pagamentosJson' => app_json_encode($payments),
        'obs' => $row['notes'] ?? '',
    ];
}

function admin_finance_payload(array $row): array
{
    return [
        'rowIndex' => (int)$row['id'],
        'id' => (int)$row['id'],
        'numero' => $row['entry_number'],
        'dataHora' => $row['created_at'],
        'tipo' => $row['type'],
        'categoria' => $row['category'],
        'descricao' => $row['description'],
        'valor' => cents_to_decimal($row['amount_cents']),
        'status' => $row['status'],
        'vencimento' => $row['due_at'],
        'origem' => $row['source'],
        'referencia' => $row['reference'] ?? '',
        'obs' => $row['notes'] ?? '',
        'attachmentUrl' => $row['attachment_url'] ?? '',
    ];
}

function admin_reminder_payload(array $row): array
{
    return [
        'rowIndex' => (int)$row['id'],
        'id' => (int)$row['id'],
        'numero' => $row['reminder_number'],
        'dataHora' => $row['created_at'],
        'titulo' => $row['title'],
        'descricao' => $row['description'],
        'vencimento' => $row['due_at'],
        'status' => $row['status'],
        'origem' => $row['source'],
        'obs' => $row['notes'] ?? '',
    ];
}

function admin_log_payload(array $row): array
{
    return [
        'rowIndex' => (int)$row['id'],
        'user' => $row['user_name'],
        'perfil' => $row['role_label'],
        'dataHora' => $row['created_at'],
        'sistema' => $row['system_info'] ?? '',
        'navegador' => $row['browser'] ?? '',
        'ip' => $row['ip_address'] ?? '',
    ];
}

function admin_category_payload(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'rowIndex' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'description' => $row['description'] ?? '',
        'isActive' => (int)$row['is_active'] === 1,
    ];
}

function admin_product_payload(array $row): array
{
    $available = (int)$row['stock_qty'] - (int)$row['reserved_qty'];
    $primaryUrl = $row['image_url'] ?? '';

    $imgStmt = db()->prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order, id');
    $imgStmt->execute([(int)$row['id']]);
    $extraUrls = array_column($imgStmt->fetchAll(), 'image_url');

    $imageUrls = [];
    if ($primaryUrl !== '') {
        $imageUrls[] = $primaryUrl;
    }
    foreach ($extraUrls as $u) {
        if ($u !== '' && !in_array($u, $imageUrls, true)) {
            $imageUrls[] = $u;
        }
    }

    return [
        'id' => (int)$row['id'],
        'rowIndex' => (int)$row['id'],
        'sku' => $row['sku'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'categoryId' => $row['category_id'] !== null ? (int)$row['category_id'] : null,
        'categoryName' => $row['category_name'] ?? '',
        'supplierId' => $row['supplier_id'] !== null ? (int)$row['supplier_id'] : null,
        'supplierName' => $row['supplier_name'] ?? '',
        'shortDescription' => $row['short_description'] ?? '',
        'description' => $row['description'] ?? '',
        'status' => $row['status'],
        'productType' => $row['product_type'],
        'price' => cents_to_decimal($row['price_cents']),
        'compareAt' => $row['compare_at_cents'] !== null ? cents_to_decimal($row['compare_at_cents']) : '',
        'cost' => $row['cost_cents'] !== null ? cents_to_decimal($row['cost_cents']) : '',
        'trackStock' => (int)$row['track_stock'] === 1,
        'allowBackorder' => (int)$row['allow_backorder'] === 1,
        'stockQty' => (int)$row['stock_qty'],
        'reservedQty' => (int)$row['reserved_qty'],
        'availableQty' => $available,
        'lowStockThreshold' => (int)$row['low_stock_threshold'],
        'imageUrl' => $primaryUrl,
        'imageUrls' => $imageUrls,
        'stripePriceId' => $row['stripe_price_id'] ?? '',
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function admin_inventory_payload(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'rowIndex' => (int)$row['id'],
        'productId' => (int)$row['product_id'],
        'productName' => $row['product_name'] ?? '',
        'sku' => $row['sku'] ?? '',
        'movementType' => $row['movement_type'],
        'quantity' => (int)$row['quantity'],
        'beforeQty' => $row['before_qty'] !== null ? (int)$row['before_qty'] : null,
        'afterQty' => $row['after_qty'] !== null ? (int)$row['after_qty'] : null,
        'unitCost' => $row['unit_cost_cents'] !== null ? cents_to_decimal($row['unit_cost_cents']) : '',
        'reason' => $row['reason'] ?? '',
        'referenceType' => $row['reference_type'] ?? '',
        'referenceId' => $row['reference_id'] !== null ? (int)$row['reference_id'] : null,
        'createdAt' => $row['created_at'],
    ];
}

function admin_order_payload(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'rowIndex' => (int)$row['id'],
        'numero' => $row['order_number'],
        'dataHora' => $row['created_at'],
        'cliente' => $row['customer_name'] ?? '',
        'email' => $row['customer_email'] ?? '',
        'status' => $row['status'],
        'paymentStatus' => $row['payment_status'],
        'fulfillmentStatus' => $row['fulfillment_status'],
        'inventoryStatus' => $row['inventory_status'],
        'subtotal' => cents_to_decimal($row['subtotal_cents']),
        'frete' => cents_to_decimal($row['shipping_cents']),
        'desconto' => cents_to_decimal($row['discount_cents']),
        'total' => cents_to_decimal($row['total_cents']),
        'stripeSessionId' => $row['stripe_session_id'] ?? '',
        'paidAt' => $row['paid_at'],
    ];
}

function admin_insert_quote_items(int $quoteId, array $items): void
{
    $stmt = db()->prepare(
        'INSERT INTO quote_items (quote_id, product_id, item_type, title, description, quantity, unit_price_cents, unit_cost_cents, total_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($items as $item) {
        $stmt->execute([
            $quoteId,
            $item['product_id'],
            $item['tipo'],
            $item['titulo'],
            $item['descricao'],
            $item['quantidade'],
            $item['valorUnitarioCents'],
            $item['custoUnitarioCents'],
            $item['totalCents'],
        ]);
    }
}

function admin_insert_sale_items(int $saleId, array $items): void
{
    $stmt = db()->prepare(
        'INSERT INTO sale_items (sale_id, product_id, item_type, title, description, quantity, unit_price_cents, unit_cost_cents, total_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($items as $item) {
        $stmt->execute([
            $saleId,
            $item['product_id'],
            $item['tipo'],
            $item['titulo'],
            $item['descricao'],
            $item['quantidade'],
            $item['valorUnitarioCents'],
            $item['custoUnitarioCents'],
            $item['totalCents'],
        ]);
    }
}

function admin_insert_sale_payments(int $saleId, array $payments): void
{
    $stmt = db()->prepare(
        'INSERT INTO sale_payments (sale_id, description, method, status, amount_cents, due_at, paid_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($payments as $payment) {
        $stmt->execute([
            $saleId,
            $payment['descricao'],
            $payment['forma'],
            $payment['status'],
            $payment['valorCents'],
            $payment['vencimento'],
            $payment['recebidoEm'],
        ]);
    }
}

function admin_sync_sale_finance(int $saleId, ?int $userId = null): void
{
    $saleStmt = db()->prepare('SELECT * FROM sales WHERE id = ?');
    $saleStmt->execute([$saleId]);
    $sale = $saleStmt->fetch();
    if (!$sale) {
        return;
    }

    $delete = db()->prepare("DELETE FROM financial_entries WHERE source = 'Venda' AND reference = ?");
    $delete->execute([$sale['sale_number']]);

    $payments = admin_fetch_sale_payments($saleId);
    $insert = db()->prepare(
        'INSERT INTO financial_entries (type, category, description, amount_cents, status, due_at, source, reference, notes, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($payments as $payment) {
        if ($payment['status'] !== 'Pago') {
            continue;
        }
        $insert->execute([
            'Entrada',
            'Venda ' . $payment['method'],
            'Venda ' . $sale['sale_number'] . ' - ' . $sale['customer_name'],
            (int)$payment['amount_cents'],
            'Pago',
            $payment['due_at'],
            'Venda',
            $sale['sale_number'],
            $payment['description'],
            $userId,
            $payment['paid_at'] ?: $sale['created_at'],
        ]);
        $entryId = (int)db()->lastInsertId();
        admin_set_public_number('financial_entries', 'entry_number', 'FIN', $entryId);
    }
}

function admin_recalculate_sale_totals(array $items, array $payments): array
{
    $totals = admin_item_totals($items);
    $received = 0;
    $nextDue = null;
    $methods = [];
    foreach ($payments as $payment) {
        if ($payment['status'] === 'Pago') {
            $received += (int)$payment['valorCents'];
            $methods[$payment['forma']] = true;
        } elseif ($payment['vencimento'] && ($nextDue === null || $payment['vencimento'] < $nextDue)) {
            $nextDue = $payment['vencimento'];
        }
    }
    $balance = max($totals['subtotal'] - $received, 0);
    $status = $balance <= 0 && $totals['subtotal'] > 0 ? 'Pago' : ($received > 0 ? 'Parcial' : 'Pendente');
    $methodList = array_keys($methods);

    return [
        ...$totals,
        'received' => $received,
        'balance' => $balance,
        'status' => $status,
        'nextDue' => $nextDue,
        'paymentSummary' => count($methodList) === 1 ? $methodList[0] : (count($methodList) > 1 ? 'Multiplo' : 'Pix'),
    ];
}

function admin_is_admin(array $user): bool
{
    return ($user['role'] ?? '') === 'admin';
}

function admin_require_admin_action(array $user): void
{
    if (!admin_is_admin($user)) {
        json_response(['ok' => false, 'error' => 'Acesso restrito ao administrador.'], 403);
    }
}

function admin_list_all(array $user): array
{
    $customers = db()->query('SELECT * FROM customers ORDER BY id DESC')->fetchAll();
    $quotes = db()->query('SELECT * FROM quotes ORDER BY id DESC')->fetchAll();
    $sales = db()->query('SELECT * FROM sales ORDER BY id DESC')->fetchAll();
    $categories = db()->query('SELECT * FROM product_categories ORDER BY sort_order ASC, name ASC')->fetchAll();
    $suppliers = db()->query('SELECT * FROM suppliers ORDER BY name ASC')->fetchAll();
    $products = db()->query(
        'SELECT p.*, c.name AS category_name, s.name AS supplier_name
         FROM products p
         LEFT JOIN product_categories c ON c.id = p.category_id
         LEFT JOIN suppliers s ON s.id = p.supplier_id
         ORDER BY p.updated_at DESC, p.id DESC'
    )->fetchAll();

    $finance = [];
    $reminders = [];
    $logs = [];
    $inventory = [];
    $orders = [];

    if (admin_is_admin($user)) {
        $finance = db()->query('SELECT * FROM financial_entries ORDER BY created_at DESC, id DESC')->fetchAll();
        $reminders = db()->query('SELECT * FROM reminders ORDER BY due_at ASC, id DESC')->fetchAll();
        $logs = db()->query('SELECT * FROM access_logs ORDER BY id DESC LIMIT 200')->fetchAll();
        $inventory = db()->query(
            'SELECT m.*, p.name AS product_name, p.sku
             FROM inventory_movements m
             INNER JOIN products p ON p.id = m.product_id
             ORDER BY m.created_at DESC, m.id DESC
             LIMIT 300'
        )->fetchAll();
        $orders = db()->query('SELECT * FROM orders ORDER BY id DESC LIMIT 300')->fetchAll();
    }

    return [
        'clientes' => array_map('admin_customer_payload', $customers),
        'orcamentos' => array_map('admin_quote_payload', $quotes),
        'vendas' => array_map('admin_sale_payload', $sales),
        'financeiro' => array_map('admin_finance_payload', $finance),
        'lembretes' => array_map('admin_reminder_payload', $reminders),
        'logs' => array_map('admin_log_payload', $logs),
        'categorias' => array_map('admin_category_payload', $categories),
        'fornecedores' => array_map('admin_supplier_payload', $suppliers),
        'produtos' => array_map('admin_product_payload', $products),
        'inventoryMovements' => array_map('admin_inventory_payload', $inventory),
        'pedidos' => array_map('admin_order_payload', $orders),
    ];
}

function admin_create_customer(array $payload): array
{
    $name = trim((string)($payload['nome'] ?? ''));
    if ($name === '') {
        json_response(['ok' => false, 'error' => 'Informe o nome do cliente.'], 422);
    }

    $stmt = db()->prepare(
        'INSERT INTO customers (name, email, phone, company, document, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        trim((string)($payload['email'] ?? '')) ?: null,
        trim((string)($payload['telefone'] ?? '')) ?: null,
        trim((string)($payload['empresa'] ?? '')) ?: null,
        trim((string)($payload['cpfCNPJ'] ?? '')) ?: null,
        trim((string)($payload['obs'] ?? '')) ?: null,
        to_mysql_datetime($payload['dataHora'] ?? null),
    ]);

    $stmt = db()->prepare('SELECT * FROM customers WHERE id = ?');
    $stmt->execute([(int)db()->lastInsertId()]);
    return admin_customer_payload($stmt->fetch());
}

function admin_update_customer(array $payload): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Cliente invalido.'], 422);
    }
    $name = trim((string)($payload['nome'] ?? ''));
    if ($name === '') {
        json_response(['ok' => false, 'error' => 'Informe o nome do cliente.'], 422);
    }
    $stmt = db()->prepare(
        'UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, document = ?, notes = ?
         WHERE id = ?'
    );
    $stmt->execute([
        $name,
        trim((string)($payload['email'] ?? '')) ?: null,
        trim((string)($payload['telefone'] ?? '')) ?: null,
        trim((string)($payload['empresa'] ?? '')) ?: null,
        trim((string)($payload['cpfCNPJ'] ?? '')) ?: null,
        trim((string)($payload['obs'] ?? '')) ?: null,
        $id,
    ]);
    $stmt = db()->prepare('SELECT * FROM customers WHERE id = ?');
    $stmt->execute([$id]);
    return admin_customer_payload($stmt->fetch());
}

function admin_create_quote(array $payload, array $user): array
{
    $items = admin_normalize_items($payload);
    if (!$items) {
        json_response(['ok' => false, 'error' => 'Adicione ao menos um item.'], 422);
    }
    $extraCost = money_to_cents($payload['custoOutros'] ?? 0);
    $totals = admin_item_totals($items, $extraCost);
    $customerName = trim((string)($payload['cliente'] ?? ''));
    if ($customerName === '') {
        json_response(['ok' => false, 'error' => 'Selecione o cliente.'], 422);
    }

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'INSERT INTO quotes (customer_id, customer_name, status, valid_until, public_notes, private_notes, subtotal_cents, items_cost_cents, extra_cost_cents, total_cost_cents, profit_cents, margin_percent, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            admin_find_customer_id($customerName),
            $customerName,
            $payload['status'] ?? 'Em negociacao',
            to_mysql_date($payload['validade'] ?? null),
            trim((string)($payload['obsPublic'] ?? '')) ?: null,
            trim((string)($payload['obsPrivate'] ?? '')) ?: null,
            $totals['subtotal'],
            $totals['itemCosts'],
            $totals['extraCosts'],
            $totals['totalCosts'],
            $totals['profit'],
            $totals['margin'],
            (int)$user['id'],
            to_mysql_datetime($payload['dataHora'] ?? null),
        ]);
        $id = (int)db()->lastInsertId();
        admin_set_public_number('quotes', 'quote_number', 'ORC', $id);
        admin_insert_quote_items($id, $items);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    $stmt = db()->prepare('SELECT * FROM quotes WHERE id = ?');
    $stmt->execute([$id]);
    return admin_quote_payload($stmt->fetch());
}

function admin_update_quote(array $payload, array $user): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Orcamento invalido.'], 422);
    }
    $items = admin_normalize_items($payload);
    if (!$items) {
        json_response(['ok' => false, 'error' => 'Adicione ao menos um item.'], 422);
    }
    $extraCost = money_to_cents($payload['custoOutros'] ?? 0);
    $totals = admin_item_totals($items, $extraCost);

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'UPDATE quotes
             SET customer_id = ?, customer_name = ?, status = ?, valid_until = ?, public_notes = ?, private_notes = ?,
                 subtotal_cents = ?, items_cost_cents = ?, extra_cost_cents = ?, total_cost_cents = ?, profit_cents = ?, margin_percent = ?
             WHERE id = ?'
        );
        $customerName = trim((string)($payload['cliente'] ?? ''));
        $stmt->execute([
            admin_find_customer_id($customerName),
            $customerName,
            $payload['status'] ?? 'Em negociacao',
            to_mysql_date($payload['validade'] ?? null),
            trim((string)($payload['obsPublic'] ?? '')) ?: null,
            trim((string)($payload['obsPrivate'] ?? '')) ?: null,
            $totals['subtotal'],
            $totals['itemCosts'],
            $totals['extraCosts'],
            $totals['totalCosts'],
            $totals['profit'],
            $totals['margin'],
            $id,
        ]);
        db()->prepare('DELETE FROM quote_items WHERE quote_id = ?')->execute([$id]);
        admin_insert_quote_items($id, $items);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    $stmt = db()->prepare('SELECT * FROM quotes WHERE id = ?');
    $stmt->execute([$id]);
    return admin_quote_payload($stmt->fetch());
}

function admin_create_sale(array $payload, array $user): array
{
    $items = admin_normalize_items($payload);
    if (!$items) {
        json_response(['ok' => false, 'error' => 'Adicione ao menos um item.'], 422);
    }
    $itemTotals = admin_item_totals($items);
    $payments = admin_normalize_payments($payload, $itemTotals['subtotal']);
    $totals = admin_recalculate_sale_totals($items, $payments);
    if (!$payments) {
        json_response(['ok' => false, 'error' => 'Adicione ao menos uma parcela.'], 422);
    }
    $customerName = trim((string)($payload['cliente'] ?? ''));
    if ($customerName === '') {
        json_response(['ok' => false, 'error' => 'Selecione o cliente.'], 422);
    }

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'INSERT INTO sales (customer_id, customer_name, payment_status, payment_summary, due_at, subtotal_cents, received_cents, balance_cents, total_cost_cents, profit_cents, margin_percent, notes, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            admin_find_customer_id($customerName),
            $customerName,
            $totals['status'],
            $totals['paymentSummary'],
            $totals['nextDue'],
            $totals['subtotal'],
            $totals['received'],
            $totals['balance'],
            $totals['totalCosts'],
            $totals['profit'],
            $totals['margin'],
            trim((string)($payload['obs'] ?? '')) ?: null,
            (int)$user['id'],
            to_mysql_datetime($payload['dataHora'] ?? null),
        ]);
        $id = (int)db()->lastInsertId();
        admin_set_public_number('sales', 'sale_number', 'VEN', $id);
        admin_insert_sale_items($id, $items);
        admin_insert_sale_payments($id, $payments);
        admin_sync_sale_finance($id, (int)$user['id']);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    $stmt = db()->prepare('SELECT * FROM sales WHERE id = ?');
    $stmt->execute([$id]);
    return admin_sale_payload($stmt->fetch());
}

function admin_update_sale(array $payload, array $user): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Venda invalida.'], 422);
    }
    $items = admin_normalize_items($payload);
    $itemTotals = admin_item_totals($items);
    $payments = admin_normalize_payments($payload, $itemTotals['subtotal']);
    $totals = admin_recalculate_sale_totals($items, $payments);

    db()->beginTransaction();
    try {
        $customerName = trim((string)($payload['cliente'] ?? ''));
        $stmt = db()->prepare(
            'UPDATE sales
             SET customer_id = ?, customer_name = ?, payment_status = ?, payment_summary = ?, due_at = ?,
                 subtotal_cents = ?, received_cents = ?, balance_cents = ?, total_cost_cents = ?, profit_cents = ?, margin_percent = ?, notes = ?
             WHERE id = ?'
        );
        $stmt->execute([
            admin_find_customer_id($customerName),
            $customerName,
            $totals['status'],
            $totals['paymentSummary'],
            $totals['nextDue'],
            $totals['subtotal'],
            $totals['received'],
            $totals['balance'],
            $totals['totalCosts'],
            $totals['profit'],
            $totals['margin'],
            trim((string)($payload['obs'] ?? '')) ?: null,
            $id,
        ]);
        db()->prepare('DELETE FROM sale_items WHERE sale_id = ?')->execute([$id]);
        db()->prepare('DELETE FROM sale_payments WHERE sale_id = ?')->execute([$id]);
        admin_insert_sale_items($id, $items);
        admin_insert_sale_payments($id, $payments);
        admin_sync_sale_finance($id, (int)$user['id']);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    $stmt = db()->prepare('SELECT * FROM sales WHERE id = ?');
    $stmt->execute([$id]);
    return admin_sale_payload($stmt->fetch());
}

function admin_create_finance(array $payload, array $user): array
{
    $amount = money_to_cents($payload['valor'] ?? 0);
    if ($amount <= 0) {
        json_response(['ok' => false, 'error' => 'Informe um valor maior que zero.'], 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO financial_entries (type, category, description, amount_cents, status, due_at, source, reference, notes, attachment_url, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        ($payload['tipo'] ?? 'Entrada') === 'Saida' ? 'Saida' : 'Entrada',
        trim((string)($payload['categoria'] ?? 'Geral')),
        trim((string)($payload['descricao'] ?? 'Lancamento')),
        $amount,
        ($payload['status'] ?? 'Pago') === 'A pagar' ? 'A pagar' : 'Pago',
        to_mysql_date($payload['vencimento'] ?? null),
        trim((string)($payload['origem'] ?? 'Manual')) ?: 'Manual',
        trim((string)($payload['referencia'] ?? '')) ?: null,
        trim((string)($payload['obs'] ?? '')) ?: null,
        trim((string)($payload['attachmentUrl'] ?? '')) ?: null,
        (int)$user['id'],
        to_mysql_datetime($payload['dataHora'] ?? null),
    ]);
    $id = (int)db()->lastInsertId();
    admin_set_public_number('financial_entries', 'entry_number', 'FIN', $id);

    $stmt = db()->prepare('SELECT * FROM financial_entries WHERE id = ?');
    $stmt->execute([$id]);
    return admin_finance_payload($stmt->fetch());
}

function admin_update_finance(array $payload): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Lancamento invalido.'], 422);
    }
    $stmt = db()->prepare(
        'UPDATE financial_entries
         SET type = ?, category = ?, description = ?, amount_cents = ?, status = ?, due_at = ?, source = ?, reference = ?, notes = ?, attachment_url = ?, created_at = ?
         WHERE id = ?'
    );
    $stmt->execute([
        ($payload['tipo'] ?? 'Entrada') === 'Saida' ? 'Saida' : 'Entrada',
        trim((string)($payload['categoria'] ?? 'Geral')),
        trim((string)($payload['descricao'] ?? 'Lancamento')),
        money_to_cents($payload['valor'] ?? 0),
        ($payload['status'] ?? 'Pago') === 'A pagar' ? 'A pagar' : 'Pago',
        to_mysql_date($payload['vencimento'] ?? null),
        trim((string)($payload['origem'] ?? 'Manual')) ?: 'Manual',
        trim((string)($payload['referencia'] ?? '')) ?: null,
        trim((string)($payload['obs'] ?? '')) ?: null,
        trim((string)($payload['attachmentUrl'] ?? '')) ?: null,
        to_mysql_datetime($payload['dataHora'] ?? null),
        $id,
    ]);

    $stmt = db()->prepare('SELECT * FROM financial_entries WHERE id = ?');
    $stmt->execute([$id]);
    return admin_finance_payload($stmt->fetch());
}

function admin_create_reminder(array $payload, array $user): array
{
    $title = trim((string)($payload['titulo'] ?? ''));
    $description = trim((string)($payload['descricao'] ?? ''));
    $due = to_mysql_date($payload['vencimento'] ?? null);
    if ($title === '' || $description === '' || !$due) {
        json_response(['ok' => false, 'error' => 'Preencha titulo, descricao e vencimento.'], 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO reminders (title, description, due_at, status, source, notes, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $title,
        $description,
        $due,
        ($payload['status'] ?? 'Pendente') === 'Concluido' ? 'Concluido' : 'Pendente',
        trim((string)($payload['origem'] ?? 'Manual')) ?: 'Manual',
        trim((string)($payload['obs'] ?? '')) ?: null,
        (int)$user['id'],
        to_mysql_datetime($payload['dataHora'] ?? null),
    ]);
    $id = (int)db()->lastInsertId();
    admin_set_public_number('reminders', 'reminder_number', 'LEM', $id);

    $stmt = db()->prepare('SELECT * FROM reminders WHERE id = ?');
    $stmt->execute([$id]);
    return admin_reminder_payload($stmt->fetch());
}

function admin_update_reminder(array $payload): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Lembrete invalido.'], 422);
    }
    $stmt = db()->prepare(
        'UPDATE reminders SET title = ?, description = ?, due_at = ?, status = ?, source = ?, notes = ? WHERE id = ?'
    );
    $stmt->execute([
        trim((string)($payload['titulo'] ?? '')),
        trim((string)($payload['descricao'] ?? '')),
        to_mysql_date($payload['vencimento'] ?? null),
        ($payload['status'] ?? 'Pendente') === 'Concluido' ? 'Concluido' : 'Pendente',
        trim((string)($payload['origem'] ?? 'Manual')) ?: 'Manual',
        trim((string)($payload['obs'] ?? '')) ?: null,
        $id,
    ]);

    $stmt = db()->prepare('SELECT * FROM reminders WHERE id = ?');
    $stmt->execute([$id]);
    return admin_reminder_payload($stmt->fetch());
}

function admin_category_id_from_payload(array $payload): ?int
{
    $categoryId = (int)($payload['categoryId'] ?? $payload['category_id'] ?? 0);
    if ($categoryId > 0) {
        return $categoryId;
    }
    $name = trim((string)($payload['categoryName'] ?? $payload['category'] ?? ''));
    if ($name === '') {
        return null;
    }
    $slug = slugify($name);
    $stmt = db()->prepare('SELECT id FROM product_categories WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int)$id;
    }
    $insert = db()->prepare('INSERT INTO product_categories (name, slug, description) VALUES (?, ?, ?)');
    $insert->execute([$name, $slug, null]);
    return (int)db()->lastInsertId();
}

/* ── FORNECEDORES ─────────────────────────────────────────── */

function admin_supplier_payload(array $row): array
{
    return [
        'id'            => (int)$row['id'],
        'nome'          => $row['name'],
        'email'         => $row['email'] ?? '',
        'phone'         => $row['phone'] ?? '',
        'document'      => $row['document'] ?? '',
        'contactPerson' => $row['contact_person'] ?? '',
        'notes'         => $row['notes'] ?? '',
        'isActive'      => (int)$row['is_active'] === 1,
        'logoUrl'       => $row['logo_url'] ?? '',
        'createdAt'     => $row['created_at'],
    ];
}

function admin_get_supplier(int $id): array
{
    $stmt = db()->prepare('SELECT * FROM suppliers WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_response(['ok' => false, 'error' => 'Fornecedor nao encontrado.'], 404);
    }
    return admin_supplier_payload($row);
}

function admin_create_supplier(array $payload): array
{
    $name = trim((string)($payload['nome'] ?? ''));
    if ($name === '') {
        json_response(['ok' => false, 'error' => 'Informe o nome do fornecedor.'], 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO suppliers (name, email, phone, document, contact_person, notes, is_active, logo_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        trim((string)($payload['email'] ?? '')) ?: null,
        trim((string)($payload['phone'] ?? '')) ?: null,
        trim((string)($payload['document'] ?? '')) ?: null,
        trim((string)($payload['contactPerson'] ?? '')) ?: null,
        trim((string)($payload['notes'] ?? '')) ?: null,
        !empty($payload['isActive']) ? 1 : 0,
        trim((string)($payload['logoUrl'] ?? '')) ?: null,
    ]);
    return admin_get_supplier((int)db()->lastInsertId());
}

function admin_update_supplier(array $payload): array
{
    $id = (int)($payload['id'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Fornecedor invalido.'], 422);
    }
    $name = trim((string)($payload['nome'] ?? ''));
    if ($name === '') {
        json_response(['ok' => false, 'error' => 'Informe o nome do fornecedor.'], 422);
    }
    $stmt = db()->prepare(
        'UPDATE suppliers SET name = ?, email = ?, phone = ?, document = ?, contact_person = ?, notes = ?, is_active = ?, logo_url = ?
         WHERE id = ?'
    );
    $stmt->execute([
        $name,
        trim((string)($payload['email'] ?? '')) ?: null,
        trim((string)($payload['phone'] ?? '')) ?: null,
        trim((string)($payload['document'] ?? '')) ?: null,
        trim((string)($payload['contactPerson'] ?? '')) ?: null,
        trim((string)($payload['notes'] ?? '')) ?: null,
        !empty($payload['isActive']) ? 1 : 0,
        trim((string)($payload['logoUrl'] ?? '')) ?: null,
        $id,
    ]);
    return admin_get_supplier($id);
}

function admin_supplier_id_from_payload(array $payload): ?int
{
    $name = trim((string)($payload['supplierName'] ?? ''));
    if ($name === '') return null;
    $stmt = db()->prepare('SELECT id FROM suppliers WHERE name = ? LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id !== false) return (int)$id;
    // Auto-cria fornecedor se não existir
    $ins = db()->prepare('INSERT INTO suppliers (name, is_active) VALUES (?, 1)');
    $ins->execute([$name]);
    return (int)db()->lastInsertId();
}

/* ── PRODUTOS ─────────────────────────────────────────────── */

function admin_create_product(array $payload, array $user): array
{
    $name = trim((string)($payload['name'] ?? $payload['nome'] ?? ''));
    if ($name === '') {
        json_response(['ok' => false, 'error' => 'Informe o nome do produto.'], 422);
    }
    $sku = strtoupper(trim((string)($payload['sku'] ?? '')));
    if ($sku === '') {
        $sku = 'GAO-' . strtoupper(substr(slugify($name), 0, 10)) . '-' . random_int(1000, 9999);
    }
    $stock = (int)($payload['stockQty'] ?? $payload['stock_qty'] ?? 0);

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'INSERT INTO products (category_id, supplier_id, sku, name, slug, short_description, description, status, product_type, price_cents, compare_at_cents, cost_cents, track_stock, allow_backorder, stock_qty, low_stock_threshold, image_url, stripe_price_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            admin_category_id_from_payload($payload),
            admin_supplier_id_from_payload($payload),
            $sku,
            $name,
            admin_unique_slug((string)($payload['slug'] ?? $name), 'products'),
            trim((string)($payload['shortDescription'] ?? '')) ?: null,
            trim((string)($payload['description'] ?? '')) ?: null,
            in_array(($payload['status'] ?? 'draft'), ['draft', 'active', 'archived'], true) ? $payload['status'] : 'draft',
            in_array(($payload['productType'] ?? 'physical'), ['physical', 'service', 'custom'], true) ? $payload['productType'] : 'physical',
            money_to_cents($payload['price'] ?? 0),
            ($payload['compareAt'] ?? '') !== '' ? money_to_cents($payload['compareAt']) : null,
            ($payload['cost'] ?? '') !== '' ? money_to_cents($payload['cost']) : null,
            !empty($payload['trackStock']) ? 1 : 0,
            !empty($payload['allowBackorder']) ? 1 : 0,
            $stock,
            (int)($payload['lowStockThreshold'] ?? 2),
            trim((string)($payload['imageUrl'] ?? '')) ?: null,
            trim((string)($payload['stripePriceId'] ?? '')) ?: null,
        ]);
        $id = (int)db()->lastInsertId();
        if ($stock !== 0) {
            admin_record_inventory_movement($id, 'initial', $stock, 'Estoque inicial', null, null, (int)$user['id'], 0);
        }
        admin_sync_product_images($id, $payload);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    return admin_get_product($id);
}

function admin_get_product(int $id): array
{
    $stmt = db()->prepare(
        'SELECT p.*, c.name AS category_name, s.name AS supplier_name
         FROM products p
         LEFT JOIN product_categories c ON c.id = p.category_id
         LEFT JOIN suppliers s ON s.id = p.supplier_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_response(['ok' => false, 'error' => 'Produto nao encontrado.'], 404);
    }
    return admin_product_payload($row);
}

function admin_update_product(array $payload, array $user): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Produto invalido.'], 422);
    }
    $currentStmt = db()->prepare('SELECT stock_qty FROM products WHERE id = ?');
    $currentStmt->execute([$id]);
    $currentStock = $currentStmt->fetchColumn();
    if ($currentStock === false) {
        json_response(['ok' => false, 'error' => 'Produto nao encontrado.'], 404);
    }
    $newStock = (int)($payload['stockQty'] ?? $currentStock);
    $sku = strtoupper(trim((string)($payload['sku'] ?? '')));
    if ($sku === '') {
        $sku = 'GAO-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT);
    }

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'UPDATE products
             SET category_id = ?, supplier_id = ?, sku = ?, name = ?, slug = ?, short_description = ?, description = ?, status = ?, product_type = ?,
                 price_cents = ?, compare_at_cents = ?, cost_cents = ?, track_stock = ?, allow_backorder = ?, stock_qty = ?,
                 low_stock_threshold = ?, image_url = ?, stripe_price_id = ?
             WHERE id = ?'
        );
        $stmt->execute([
            admin_category_id_from_payload($payload),
            admin_supplier_id_from_payload($payload),
            $sku,
            trim((string)($payload['name'] ?? '')),
            admin_unique_slug((string)($payload['slug'] ?? $payload['name'] ?? ('produto-' . $id)), 'products', $id),
            trim((string)($payload['shortDescription'] ?? '')) ?: null,
            trim((string)($payload['description'] ?? '')) ?: null,
            in_array(($payload['status'] ?? 'draft'), ['draft', 'active', 'archived'], true) ? $payload['status'] : 'draft',
            in_array(($payload['productType'] ?? 'physical'), ['physical', 'service', 'custom'], true) ? $payload['productType'] : 'physical',
            money_to_cents($payload['price'] ?? 0),
            ($payload['compareAt'] ?? '') !== '' ? money_to_cents($payload['compareAt']) : null,
            ($payload['cost'] ?? '') !== '' ? money_to_cents($payload['cost']) : null,
            !empty($payload['trackStock']) ? 1 : 0,
            !empty($payload['allowBackorder']) ? 1 : 0,
            $newStock,
            (int)($payload['lowStockThreshold'] ?? 2),
            trim((string)($payload['imageUrl'] ?? '')) ?: null,
            trim((string)($payload['stripePriceId'] ?? '')) ?: null,
            $id,
        ]);
        $diff = $newStock - (int)$currentStock;
        if ($diff !== 0) {
            admin_record_inventory_movement($id, 'adjustment', $diff, 'Ajuste pelo cadastro do produto', null, null, (int)$user['id'], (int)$currentStock);
        }
        admin_sync_product_images($id, $payload);
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    return admin_get_product($id);
}

function admin_sync_product_images(int $productId, array $payload): void
{
    $urls = array_values(array_filter(
        array_map('trim', (array)($payload['imageUrls'] ?? [])),
        fn($u) => $u !== ''
    ));
    if (empty($urls)) {
        return;
    }
    // Primary image stays in products.image_url; extras go into product_images
    $primary = $urls[0];
    db()->prepare('UPDATE products SET image_url = ? WHERE id = ?')->execute([$primary, $productId]);
    db()->prepare('DELETE FROM product_images WHERE product_id = ?')->execute([$productId]);
    $ins = db()->prepare('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)');
    foreach ($urls as $i => $url) {
        $ins->execute([$productId, $url, $i]);
    }
}

function admin_record_inventory_movement(int $productId, string $type, int $quantity, string $reason, ?string $referenceType, ?int $referenceId, ?int $userId, ?int $beforeOverride = null): void
{
    $productStmt = db()->prepare('SELECT stock_qty FROM products WHERE id = ?');
    $productStmt->execute([$productId]);
    $before = $beforeOverride ?? (int)$productStmt->fetchColumn();
    $after = in_array($type, ['reservation', 'release'], true) ? $before : $before + $quantity;
    $stmt = db()->prepare(
        'INSERT INTO inventory_movements (product_id, movement_type, quantity, before_qty, after_qty, reason, reference_type, reference_id, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$productId, $type, $quantity, $before, $after, $reason, $referenceType, $referenceId, $userId]);
}

function admin_adjust_inventory(array $payload, array $user): array
{
    $productId = (int)($payload['productId'] ?? $payload['product_id'] ?? 0);
    $quantity = (int)($payload['quantity'] ?? 0);
    if ($productId <= 0 || $quantity === 0) {
        json_response(['ok' => false, 'error' => 'Informe produto e quantidade.'], 422);
    }
    $type = (string)($payload['movementType'] ?? 'adjustment');
    if (!in_array($type, ['purchase', 'adjustment', 'return'], true)) {
        $type = 'adjustment';
    }

    db()->beginTransaction();
    try {
        $stmt = db()->prepare('SELECT * FROM products WHERE id = ? FOR UPDATE');
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        if (!$product) {
            json_response(['ok' => false, 'error' => 'Produto nao encontrado.'], 404);
        }
        $before = (int)$product['stock_qty'];
        $after = $before + $quantity;
        if ($after < 0) {
            json_response(['ok' => false, 'error' => 'Ajuste deixaria o estoque negativo.'], 422);
        }
        db()->prepare('UPDATE products SET stock_qty = ? WHERE id = ?')->execute([$after, $productId]);
        admin_record_inventory_movement(
            $productId,
            $type,
            $quantity,
            trim((string)($payload['reason'] ?? 'Ajuste de estoque')),
            'manual',
            null,
            (int)$user['id'],
            $before
        );
        db()->commit();
    } catch (Throwable $e) {
        if (db()->inTransaction()) {
            db()->rollBack();
        }
        throw $e;
    }

    return admin_get_product($productId);
}

function admin_update_order(array $payload): array
{
    $id = (int)($payload['id'] ?? $payload['rowIndex'] ?? 0);
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Pedido invalido.'], 422);
    }
    $allowedStatus = ['draft', 'checkout_created', 'paid', 'processing', 'fulfilled', 'cancelled', 'refunded'];
    $allowedFulfillment = ['unfulfilled', 'partial', 'fulfilled'];
    $status = in_array(($payload['status'] ?? ''), $allowedStatus, true) ? $payload['status'] : null;
    $fulfillment = in_array(($payload['fulfillmentStatus'] ?? ''), $allowedFulfillment, true) ? $payload['fulfillmentStatus'] : null;

    if ($status) {
        db()->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $id]);
    }
    if ($fulfillment) {
        db()->prepare('UPDATE orders SET fulfillment_status = ? WHERE id = ?')->execute([$fulfillment, $id]);
    }

    $stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
    $stmt->execute([$id]);
    return admin_order_payload($stmt->fetch());
}

function admin_handle_action(string $action, array $payload, array $user): mixed
{
    $adminOnlyActions = [
        'createFinanceiro',
        'updateFinanceiro',
        'createLembrete',
        'updateLembrete',
        'createProduct',
        'updateProduct',
        'createFornecedor',
        'updateFornecedor',
        'adjustInventory',
        'updateOrder',
    ];
    if (in_array($action, $adminOnlyActions, true)) {
        admin_require_admin_action($user);
    }

    return match ($action) {
        'listAll' => admin_list_all($user),
        'createCliente' => admin_create_customer($payload),
        'updateCliente' => admin_update_customer($payload),
        'createOrcamento' => admin_create_quote($payload, $user),
        'updateOrcamento' => admin_update_quote($payload, $user),
        'createVenda' => admin_create_sale($payload, $user),
        'updateVenda' => admin_update_sale($payload, $user),
        'createFinanceiro' => admin_create_finance($payload, $user),
        'updateFinanceiro' => admin_update_finance($payload),
        'createLembrete' => admin_create_reminder($payload, $user),
        'updateLembrete' => admin_update_reminder($payload),
        'createProduct' => admin_create_product($payload, $user),
        'updateProduct' => admin_update_product($payload, $user),
        'createFornecedor' => admin_create_supplier($payload),
        'updateFornecedor' => admin_update_supplier($payload),
        'adjustInventory' => admin_adjust_inventory($payload, $user),
        'updateOrder' => admin_update_order($payload),
        default => json_response(['ok' => false, 'error' => 'Acao invalida.'], 400),
    };
}
