<?php
declare(strict_types=1);

// One-time import script for GAO Curadoria A2 products.
// DELETE this file after running it successfully on the server.
// Access: /import_curadoria.php?token=GAO2026import

if (($_GET['token'] ?? '') !== 'GAO2026import') {
    http_response_code(403);
    exit('Forbidden');
}

require __DIR__ . '/app/bootstrap.php';

$products = [
    ['sku' => '#0070', 'name' => 'Conjunto Safira Azul Rodinadas',                 'category' => 'Conjunto',    'price' => 52200, 'cost' => 26100, 'stock' => 10, 'images' => ['gao070-1','gao070-2','gao070-3','gao070-4','gao070-5']],
    ['sku' => '#0071', 'name' => 'Colar Gotas Verde Esmeralda e Zircônias Rodinadas','category' => 'Colar',     'price' => 32500, 'cost' => 16250, 'stock' => 10, 'images' => ['gao071-1','gao071-2','gao071-3']],
    ['sku' => '#0072', 'name' => 'Pulseira Verde Esmeralda Zircônias Rodinadas',   'category' => 'Pulseira',    'price' => 32500, 'cost' => 16250, 'stock' => 10, 'images' => ['gao072-1','gao072-2']],
    ['sku' => '#0073', 'name' => 'Colar Gomos Zircônia Gramadas Rodinadas',        'category' => 'Colar',       'price' => 32500, 'cost' => 16250, 'stock' => 10, 'images' => ['gao073-1','gao073-2','gao073-3','gao073-4']],
    ['sku' => '#0074', 'name' => 'Colar de Pérolas Fecho Boia',                    'category' => 'Colar',       'price' => 52200, 'cost' => 26100, 'stock' => 10, 'images' => ['gao074-1','gao074-2','gao074-3']],
    ['sku' => '#0075', 'name' => 'Brincos Flores de Cristal e Zircônia',           'category' => 'Brincos',     'price' => 11590, 'cost' =>  5795, 'stock' => 10, 'images' => ['gao075-1','gao075-2']],
    ['sku' => '#0076', 'name' => 'Colar Riviera Gotas de Safira Azul Rodinadas',   'category' => 'Colar',       'price' => 52200, 'cost' => 26100, 'stock' => 10, 'images' => ['gao076-1','gao076-2','gao076-3']],
    ['sku' => '#0077', 'name' => 'Colar Coração com Zircônia Rodinadas',           'category' => 'Colar',       'price' => 52200, 'cost' => 26100, 'stock' => 10, 'images' => ['gao077-1','gao077-2','gao077-3','gao077-4']],
    ['sku' => '#0078', 'name' => 'Brinco Prata Turquesa Marcassitas',              'category' => 'Brinco',      'price' => 11500, 'cost' =>  5750, 'stock' => 10, 'images' => ['gao078-1','gao078-2','gao078-3']],
    ['sku' => '#0079', 'name' => 'Brinco Quartzo Rajado e Zircônias',              'category' => 'Brinco',      'price' => 11500, 'cost' =>  5750, 'stock' => 10, 'images' => ['gao079-1','gao079-2','gao079-3','gao079-4']],
    ['sku' => '#0080', 'name' => 'Colar Gomas Zircônias Brancas Rodinadas',        'category' => 'Colar',       'price' => 52200, 'cost' => 18990, 'stock' => 10, 'images' => ['gao080-1','gao080-2','gao080-3']],
    ['sku' => '#0081', 'name' => 'Pulseira Zircônias com Coração',                 'category' => 'Pulseira',    'price' => 16990, 'cost' =>  4490, 'stock' => 10, 'images' => ['gao081-1','gao081-2','gao081-3']],
    ['sku' => '#0082', 'name' => 'Pulseira Zircônias Navete',                      'category' => 'Pulseira',    'price' => 16990, 'cost' =>  4490, 'stock' => 10, 'images' => ['gao082-1','gao082-2','gao082-3']],
    ['sku' => '#0083', 'name' => 'Brinco Argolinha Click',                         'category' => 'Brinco',      'price' => 11500, 'cost' =>  4490, 'stock' => 10, 'images' => ['gao083-1','gao083-2','gao083-3','gao083-4']],
    ['sku' => '#0084', 'name' => 'Pulseira Zircônias Redonda',                     'category' => 'Pulseira',    'price' => 32500, 'cost' =>  4490, 'stock' => 10, 'images' => ['gao084-1','gao084-2','gao084-3']],
    ['sku' => '#0085', 'name' => 'Gargantilha Riviera Lilás',                      'category' => 'Gargantilha', 'price' => 52200, 'cost' => 18990, 'stock' => 10, 'images' => ['gao085-1','gao085-2','gao085-3','gao085-4']],
    ['sku' => '#0086', 'name' => 'Riviera Gargantilha Corações',                   'category' => 'Gargantilha', 'price' => 32500, 'cost' => 13990, 'stock' => 10, 'images' => ['gao086-1','gao086-2','gao086-3','gao086-4']],
    ['sku' => '#0087', 'name' => 'Colar Riviera 2mm',                              'category' => 'Colar',       'price' => 52200, 'cost' => 10990, 'stock' => 10, 'images' => ['gao087-1','gao087-2','gao087-3']],
    ['sku' => '#0088', 'name' => 'Pulseira Retangular Cravejada',                  'category' => 'Pulseira',    'price' => 15000, 'cost' =>  4490, 'stock' => 10, 'images' => ['gao088-1','gao088-2','gao088-3','gao088-4']],
    ['sku' => '#0089', 'name' => 'Colar Rivière Amarela',                           'category' => 'Colar',       'price' => 52200, 'cost' => 10990, 'stock' => 10, 'images' => ['gao089-1','gao089-2','gao089-3']],
    ['sku' => '#0090', 'name' => 'Colar Rivière em Gotas de Esmeraldas',            'category' => 'Colar',       'price' => 52200, 'cost' => 10990, 'stock' => 10, 'images' => ['gao090-1','gao090-2','gao090-3']],
];

function get_or_create_category(string $name): int
{
    $stmt = db()->prepare('SELECT id FROM product_categories WHERE name = ?');
    $stmt->execute([$name]);
    $row = $stmt->fetch();
    if ($row) return (int)$row['id'];
    db()->prepare('INSERT INTO product_categories (name, slug) VALUES (?, ?)')->execute([$name, slugify($name)]);
    return (int)db()->lastInsertId();
}

function make_slug(string $name): string
{
    $base = slugify($name);
    $slug = $base;
    $n = 2;
    while (true) {
        $stmt = db()->prepare('SELECT id FROM products WHERE slug = ?');
        $stmt->execute([$slug]);
        if (!$stmt->fetch()) return $slug;
        $slug = $base . '-' . $n++;
    }
}

header('Content-Type: text/plain; charset=utf-8');
$inserted = 0;
$skipped  = 0;
$errors   = [];

foreach ($products as $p) {
    $existing = db()->prepare('SELECT id FROM products WHERE sku = ?');
    $existing->execute([$p['sku']]);
    if ($existing->fetch()) {
        echo "SKIP  {$p['sku']} - {$p['name']}\n";
        $skipped++;
        continue;
    }

    try {
        db()->beginTransaction();

        $catId   = get_or_create_category($p['category']);
        $slug    = make_slug($p['name']);
        $imgUrls = array_map(fn($n) => "img/uploads/$n.jpg", $p['images']);
        $primary = $imgUrls[0];

        $stmt = db()->prepare(
            'INSERT INTO products
             (category_id, sku, name, slug, short_description, status, product_type,
              price_cents, cost_cents, track_stock, allow_backorder, stock_qty,
              low_stock_threshold, image_url, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, \'active\', \'physical\', ?, ?, 1, 0, ?, 2, ?, NOW(), NOW())'
        );
        $stmt->execute([
            $catId,
            $p['sku'],
            $p['name'],
            $slug,
            $p['name'],
            $p['price'],
            $p['cost'],
            $p['stock'],
            $primary,
        ]);
        $productId = (int)db()->lastInsertId();

        // Record initial inventory
        db()->prepare(
            'INSERT INTO inventory_movements (product_id, type, quantity, reason, before_qty, after_qty, created_at)
             VALUES (?, \'initial\', ?, \'Estoque inicial\', 0, ?, NOW())'
        )->execute([$productId, $p['stock'], $p['stock']]);

        // Insert all images (gallery)
        $ins = db()->prepare(
            'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)'
        );
        foreach ($imgUrls as $i => $url) {
            $ins->execute([$productId, $url, $i]);
        }

        db()->commit();
        echo "OK    {$p['sku']} - {$p['name']} (id=$productId, " . count($imgUrls) . " fotos)\n";
        $inserted++;
    } catch (Throwable $e) {
        db()->rollBack();
        $errors[] = "{$p['sku']}: " . $e->getMessage();
        echo "ERR   {$p['sku']} - " . $e->getMessage() . "\n";
    }
}

echo "\n--- Concluido: $inserted inseridos, $skipped ignorados, " . count($errors) . " erros ---\n";
if ($errors) {
    echo "\nErros:\n";
    foreach ($errors as $e) echo "  $e\n";
}
