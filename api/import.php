<?php

declare(strict_types=1);

// Capture any PHP errors/warnings as JSON so the client always gets valid JSON
set_error_handler(static function (int $code, string $msg): bool {
    if (!($code & error_reporting())) return false;
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Erro interno: ' . $msg], JSON_UNESCAPED_UNICODE);
    exit;
});

require __DIR__ . '/../app/bootstrap.php';

current_admin() ?: json_response(['ok' => false, 'error' => 'Nao autenticado.'], 401);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Metodo invalido.'], 405);
}

require_csrf();

$type    = trim((string)($_POST['type'] ?? ''));
$allowed = ['produtos', 'clientes', 'financeiro', 'fornecedores'];
if (!in_array($type, $allowed, true)) {
    json_response(['ok' => false, 'error' => 'Tipo invalido.'], 400);
}

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'error' => 'Nenhum arquivo recebido.'], 400);
}

$path = $_FILES['file']['tmp_name'];
$mime = mime_content_type($path);
if (!in_array($mime, ['text/plain', 'text/csv', 'application/csv', 'application/octet-stream'], true)) {
    json_response(['ok' => false, 'error' => 'Formato invalido. Envie um arquivo CSV.'], 400);
}

/* ── helpers ─────────────────────────────────────────────── */
function parse_brl_to_cents(string $val): int
{
    $val = trim(preg_replace('/[R$\s]/', '', $val));
    if (preg_match('/^\d{1,3}(?:\.\d{3})+,\d{2}$/', $val)) {
        $val = str_replace(['.', ','], ['', '.'], $val);
    } else {
        $val = str_replace(',', '.', $val);
    }
    return (int) round((float) $val * 100);
}

function parse_date(string $val): ?string
{
    if (!$val) return null;
    foreach (['d/m/Y', 'Y-m-d', 'd-m-Y', 'Y/m/d'] as $fmt) {
        $dt = DateTimeImmutable::createFromFormat($fmt, trim($val));
        if ($dt) return $dt->format('Y-m-d');
    }
    return null;
}

function read_csv(string $path): array
{
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!$lines) return [];

    // Strip UTF-8 BOM
    $lines[0] = ltrim($lines[0], "\xEF\xBB\xBF");

    // Detect delimiter from header
    $header = $lines[0];
    $delim  = substr_count($header, ';') >= substr_count($header, ',') ? ';' : ',';

    $rows = [];
    $fp   = fopen('php://memory', 'r+');
    fwrite($fp, implode("\n", $lines));
    rewind($fp);

    $headers = null;
    while (($row = fgetcsv($fp, 0, $delim)) !== false) {
        if ($headers === null) {
            $headers = array_map('trim', $row);
            continue;
        }
        $mapped = [];
        foreach ($headers as $i => $h) {
            $mapped[$h] = isset($row[$i]) ? trim($row[$i]) : '';
        }
        $rows[] = $mapped;
    }
    fclose($fp);
    return $rows;
}

/* ── import handlers ─────────────────────────────────────── */
function import_produtos(array $rows): array
{
    $pdo      = db();
    $inserted = 0;
    $updated  = 0;
    $errors   = [];

    $stmtCat = $pdo->prepare('SELECT id FROM product_categories WHERE name = ? LIMIT 1');

    foreach ($rows as $i => $r) {
        $lineNum = $i + 2; // +2: 1-indexed + header row
        $name    = $r['Nome'] ?? '';
        if (!$name) { $errors[] = "Linha {$lineNum}: Nome obrigatorio."; continue; }

        $sku    = $r['SKU'] ?? '';
        $price  = isset($r['Preco_BRL']) && $r['Preco_BRL'] !== '' ? parse_brl_to_cents($r['Preco_BRL']) : null;
        $cost   = isset($r['Custo_BRL']) && $r['Custo_BRL'] !== '' ? parse_brl_to_cents($r['Custo_BRL']) : null;
        $stock  = isset($r['Estoque']) && $r['Estoque'] !== '' ? (int) $r['Estoque'] : 0;
        $status = in_array($r['Status'] ?? '', ['active', 'inactive']) ? $r['Status'] : 'active';
        $type   = in_array($r['Tipo'] ?? '', ['product', 'service']) ? $r['Tipo'] : 'product';

        $catId = null;
        if (!empty($r['Categoria'])) {
            $stmtCat->execute([$r['Categoria']]);
            $catId = $stmtCat->fetchColumn() ?: null;
        }

        if ($sku) {
            $existing = $pdo->prepare('SELECT id FROM products WHERE sku = ? LIMIT 1');
            $existing->execute([$sku]);
            $existingId = $existing->fetchColumn();
            if ($existingId) {
                $pdo->prepare(
                    'UPDATE products SET name=?, category_id=?, price_cents=?, cost_cents=?,
                     stock_qty=?, status=?, product_type=?,
                     short_description=?, description=? WHERE id=?'
                )->execute([$name, $catId, $price, $cost, $stock, $status, $type,
                    $r['Descricao_curta'] ?? '', $r['Descricao'] ?? '', $existingId]);
                $updated++;
                continue;
            }
        }

        $pdo->prepare(
            'INSERT INTO products (sku, name, category_id, price_cents, cost_cents,
             stock_qty, status, product_type, short_description, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([$sku ?: null, $name, $catId, $price, $cost, $stock, $status, $type,
            $r['Descricao_curta'] ?? '', $r['Descricao'] ?? '']);
        $inserted++;
    }
    return ['inserted' => $inserted, 'updated' => $updated, 'errors' => $errors];
}

function import_clientes(array $rows): array
{
    $pdo      = db();
    $inserted = 0;
    $errors   = [];

    foreach ($rows as $i => $r) {
        $lineNum = $i + 2;
        $name    = $r['Nome'] ?? '';
        if (!$name) { $errors[] = "Linha {$lineNum}: Nome obrigatorio."; continue; }

        $pdo->prepare(
            'INSERT INTO customers (name, email, phone, company, document, notes)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([$name, $r['Email'] ?? '', $r['Telefone'] ?? '',
            $r['Empresa'] ?? '', $r['CNPJ_CPF'] ?? '', $r['Observacoes'] ?? '']);
        $inserted++;
    }
    return ['inserted' => $inserted, 'updated' => 0, 'errors' => $errors];
}

function import_financeiro(array $rows): array
{
    $pdo      = db();
    $inserted = 0;
    $errors   = [];

    foreach ($rows as $i => $r) {
        $lineNum = $i + 2;
        $desc    = $r['Descricao'] ?? '';
        $valStr  = $r['Valor_BRL'] ?? '';
        if (!$desc) { $errors[] = "Linha {$lineNum}: Descricao obrigatoria."; continue; }
        if ($valStr === '') { $errors[] = "Linha {$lineNum}: Valor obrigatorio."; continue; }

        $type   = in_array($r['Tipo'] ?? '', ['income', 'expense']) ? $r['Tipo'] : 'expense';
        $status = in_array($r['Status'] ?? '', ['pending', 'paid', 'cancelled']) ? $r['Status'] : 'pending';
        $dueAt  = parse_date($r['Vencimento'] ?? '');

        $pdo->prepare(
            'INSERT INTO financial_entries (type, category, description, amount_cents, status, due_at, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([$type, $r['Categoria'] ?? '', $desc,
            parse_brl_to_cents($valStr), $status, $dueAt, $r['Observacoes'] ?? '']);
        $inserted++;
    }
    return ['inserted' => $inserted, 'updated' => 0, 'errors' => $errors];
}

function import_fornecedores(array $rows): array
{
    $pdo      = db();
    $inserted = 0;
    $errors   = [];

    foreach ($rows as $i => $r) {
        $lineNum = $i + 2;
        $name    = $r['Nome'] ?? '';
        if (!$name) { $errors[] = "Linha {$lineNum}: Nome obrigatorio."; continue; }

        $active = strtolower($r['Ativo'] ?? 'sim') !== 'nao' ? 1 : 0;

        $pdo->prepare(
            'INSERT INTO suppliers (name, email, phone, document, contact_person, notes, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([$name, $r['Email'] ?? '', $r['Telefone'] ?? '',
            $r['CNPJ_CPF'] ?? '', $r['Contato'] ?? '', $r['Observacoes'] ?? '', $active]);
        $inserted++;
    }
    return ['inserted' => $inserted, 'updated' => 0, 'errors' => $errors];
}

/* ── run ─────────────────────────────────────────────────── */
try {
    $rows = read_csv($path);
    if (!$rows) {
        json_response(['ok' => false, 'error' => 'Arquivo vazio ou sem dados validos.'], 400);
    }

    $result = match($type) {
        'produtos'     => import_produtos($rows),
        'clientes'     => import_clientes($rows),
        'financeiro'   => import_financeiro($rows),
        'fornecedores' => import_fornecedores($rows),
    };

    json_response([
        'ok'      => true,
        'inserted' => $result['inserted'],
        'updated'  => $result['updated'] ?? 0,
        'errors'   => $result['errors'],
        'warning'  => count($result['errors']) > 0 ? count($result['errors']) . ' linha(s) ignorada(s).' : null,
    ]);
} catch (PDOException $e) {
    $msg = app_config('app.env') === 'local' ? $e->getMessage() : 'Erro de banco de dados.';
    json_response(['ok' => false, 'error' => $msg], 500);
} catch (Throwable $e) {
    $msg = app_config('app.env') === 'local' ? $e->getMessage() : 'Erro interno.';
    json_response(['ok' => false, 'error' => $msg], 500);
}
