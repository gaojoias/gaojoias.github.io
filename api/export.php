<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';

current_admin() ?: json_response(['ok' => false, 'error' => 'Nao autenticado.'], 401);

$type     = trim((string)($_GET['type'] ?? ''));
$template = !empty($_GET['template']);

$allowed = ['produtos', 'clientes', 'financeiro', 'orcamentos', 'vendas', 'fornecedores'];
if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    exit('Tipo invalido.');
}

$suffix   = $template ? '_modelo' : '_' . date('Y-m-d');
$filename = "gao_{$type}{$suffix}.csv";

header('Content-Type: text/csv; charset=utf-8');
header("Content-Disposition: attachment; filename=\"{$filename}\"");
header('Cache-Control: no-cache, no-store');

$out = fopen('php://output', 'w');
// UTF-8 BOM so Excel opens correctly
fwrite($out, "\xEF\xBB\xBF");

/* ── helpers ─────────────────────────────────────────────── */
function cents_to_brl(int|null $cents): string
{
    if ($cents === null) return '';
    return number_format($cents / 100, 2, '.', '');
}
function fmt_date(?string $dt): string
{
    if (!$dt) return '';
    try { return (new DateTimeImmutable($dt))->format('d/m/Y'); }
    catch (Exception) { return $dt; }
}

/* ── export by type ──────────────────────────────────────── */
switch ($type) {

    case 'produtos':
        fputcsv($out, ['SKU', 'Nome', 'Categoria', 'Preco_BRL', 'Custo_BRL', 'Estoque', 'Status', 'Tipo', 'Descricao_curta', 'Descricao']);
        if (!$template) {
            $rows = db()->query(
                'SELECT p.*, c.name AS cat FROM products p
                 LEFT JOIN product_categories c ON c.id = p.category_id
                 ORDER BY p.name'
            )->fetchAll();
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r['sku'], $r['name'], $r['cat'] ?? '',
                    cents_to_brl($r['price_cents']), cents_to_brl($r['cost_cents']),
                    $r['stock_qty'], $r['status'], $r['product_type'],
                    $r['short_description'] ?? '', $r['description'] ?? '',
                ]);
            }
        }
        break;

    case 'clientes':
        fputcsv($out, ['Nome', 'Email', 'Telefone', 'Empresa', 'CNPJ_CPF', 'Observacoes']);
        if (!$template) {
            $rows = db()->query('SELECT * FROM customers ORDER BY name')->fetchAll();
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r['name'], $r['email'] ?? '', $r['phone'] ?? '',
                    $r['company'] ?? '', $r['document'] ?? '', $r['notes'] ?? '',
                ]);
            }
        }
        break;

    case 'financeiro':
        fputcsv($out, ['Data', 'Tipo', 'Categoria', 'Descricao', 'Valor_BRL', 'Status', 'Vencimento', 'Observacoes']);
        if (!$template) {
            $rows = db()->query(
                'SELECT * FROM financial_entries ORDER BY created_at DESC'
            )->fetchAll();
            foreach ($rows as $r) {
                fputcsv($out, [
                    fmt_date($r['created_at']), $r['type'], $r['category'],
                    $r['description'], cents_to_brl($r['amount_cents']),
                    $r['status'], fmt_date($r['due_at'] ?? null),
                    $r['notes'] ?? '',
                ]);
            }
        }
        break;

    case 'orcamentos':
        fputcsv($out, ['Numero', 'Cliente', 'Status', 'Validade', 'Tipo_item', 'Item', 'Descricao_item', 'Qtd', 'Preco_unit_BRL', 'Custo_unit_BRL', 'Obs_publica', 'Obs_interna']);
        if (!$template) {
            $quotes = db()->query(
                'SELECT q.*, qi.*,
                        q.id AS qid, qi.id AS iid,
                        q.public_notes, q.private_notes
                 FROM quotes q
                 JOIN quote_items qi ON qi.quote_id = q.id
                 ORDER BY q.id DESC, qi.id'
            )->fetchAll();
            foreach ($quotes as $r) {
                fputcsv($out, [
                    $r['quote_number'] ?? '', $r['customer_name'], $r['status'],
                    fmt_date($r['valid_until'] ?? null),
                    $r['item_type'], $r['title'],
                    $r['description'] ?? '', $r['quantity'],
                    cents_to_brl($r['unit_price_cents']), cents_to_brl($r['unit_cost_cents']),
                    $r['public_notes'] ?? '', $r['private_notes'] ?? '',
                ]);
            }
        }
        break;

    case 'vendas':
        fputcsv($out, ['Numero', 'Cliente', 'Status_pagamento', 'Tipo_item', 'Item', 'Descricao_item', 'Qtd', 'Preco_unit_BRL', 'Custo_unit_BRL', 'Observacoes']);
        if (!$template) {
            $sales = db()->query(
                'SELECT s.sale_number, s.customer_name, s.payment_status, s.notes,
                        si.item_type, si.title, si.description, si.quantity,
                        si.unit_price_cents, si.unit_cost_cents
                 FROM sales s
                 JOIN sale_items si ON si.sale_id = s.id
                 ORDER BY s.id DESC, si.id'
            )->fetchAll();
            foreach ($sales as $r) {
                fputcsv($out, [
                    $r['sale_number'] ?? '', $r['customer_name'], $r['payment_status'],
                    $r['item_type'], $r['title'], $r['description'] ?? '',
                    $r['quantity'], cents_to_brl($r['unit_price_cents']),
                    cents_to_brl($r['unit_cost_cents']), $r['notes'] ?? '',
                ]);
            }
        }
        break;

    case 'fornecedores':
        fputcsv($out, ['Nome', 'Email', 'Telefone', 'CNPJ_CPF', 'Contato', 'Observacoes', 'Ativo']);
        if (!$template) {
            $rows = db()->query('SELECT * FROM suppliers ORDER BY name')->fetchAll();
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r['name'], $r['email'] ?? '', $r['phone'] ?? '',
                    $r['document'] ?? '', $r['contact_person'] ?? '',
                    $r['notes'] ?? '', $r['is_active'] ? 'sim' : 'nao',
                ]);
            }
        }
        break;
}

fclose($out);
