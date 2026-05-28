<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        store_add_to_cart((int)($_POST['product_id'] ?? 0), (int)($_POST['quantity'] ?? 1));
        header('Location: cart.php');
        exit;
    } catch (Throwable $e) {
        $error = $e->getMessage();
    }
}

$category = trim((string)($_GET['categoria'] ?? ''));
$categories = store_categories();
$products = $category !== ''
    ? store_product_query('c.slug = ?', [$category])
    : store_product_query();
$featured = array_slice($products, 0, 4);
$activeCategoryName = 'Todas as joias';
foreach ($categories as $cat) {
    if ($category === $cat['slug']) {
        $activeCategoryName = (string)$cat['name'];
        break;
    }
}
$whatsappHref = store_whatsapp_href();
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GAO Joias | Loja Online</title>
  <meta name="description" content="Loja online GAO Joias com catalogo integrado ao estoque e checkout seguro.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="icon" type="image/png" href="../img/favicon.png">
  <link rel="stylesheet" href="assets/store.css">
</head>
<body>
  <div class="store-shell">
    <div class="announcement">
      <span><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Compra segura</span>
      <span><i class="fa-regular fa-gem" aria-hidden="true"></i> Atendimento personalizado</span>
      <span><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i> Estoque em tempo real</span>
    </div>

    <header class="store-header">
      <a class="brand-link" href="index.php" aria-label="GAO Joias">
        <img src="../img/gaojoias_logo.png" alt="GAO Joias">
      </a>
      <nav class="store-nav" aria-label="Navegacao principal">
        <a href="#colecoes"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Colecoes</a>
        <a href="#produtos"><i class="fa-regular fa-gem" aria-hidden="true"></i> Joias</a>
        <a class="cart-link" href="cart.php"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Carrinho <strong><?= store_cart_count(); ?></strong></a>
      </nav>
    </header>

    <main>
      <section class="hero-luxury">
        <img src="assets/img/hero-jewelry.png" alt="Joias GAO em ouro e pedras sobre seda" class="hero-image">
        <div class="hero-shade"></div>
        <div class="hero-content">
          <p class="eyebrow">Nova curadoria</p>
          <h1>GAO Joias</h1>
          <p>Joias em ouro, pedras e composicoes delicadas para presentes, celebracoes e pecas de assinatura pessoal.</p>
          <div class="hero-actions">
            <a class="store-button light" href="#produtos"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Comprar agora</a>
            <a class="store-button glass" href="#colecoes"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Ver colecoes</a>
          </div>
        </div>
      </section>

      <section class="category-strip" id="colecoes" aria-label="Categorias">
        <a href="index.php" class="<?= $category === '' ? 'active' : ''; ?>">
          <span><i class="fa-solid fa-star" aria-hidden="true"></i> Tudo</span>
          <strong>Curadoria completa</strong>
        </a>
        <?php foreach ($categories as $cat): ?>
          <?php if ((int)$cat['products_count'] <= 0) continue; ?>
          <a class="<?= $category === $cat['slug'] ? 'active' : ''; ?>" href="index.php?categoria=<?= e($cat['slug']); ?>">
            <span><i class="fa-regular fa-gem" aria-hidden="true"></i> <?= e($cat['name']); ?></span>
            <strong><?= (int)$cat['products_count']; ?> peca<?= (int)$cat['products_count'] === 1 ? '' : 's'; ?></strong>
          </a>
        <?php endforeach; ?>
      </section>

      <?php if ($error): ?>
        <section class="store-main compact"><div class="notice error"><?= e($error); ?></div></section>
      <?php endif; ?>

      <section class="editorial-band">
        <div>
          <p class="eyebrow dark">Design autoral</p>
          <h2>Pecas para usar todos os dias, com presenca de joia especial.</h2>
        </div>
        <div class="feature-grid">
          <article>
            <span class="feature-icon"><i class="fa-regular fa-gem" aria-hidden="true"></i></span>
            <strong>Acabamento premium</strong>
            <p>Cadastro pensado para destacar materiais, brilho, estoque e detalhes de cada peca.</p>
          </article>
          <article>
            <span class="feature-icon"><i class="fa-solid fa-credit-card" aria-hidden="true"></i></span>
            <strong>Compra direta</strong>
            <p>Produtos selecionados entram na vitrine e seguem para checkout seguro com Stripe.</p>
          </article>
          <article>
            <span class="feature-icon"><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i></span>
            <strong>Controle de estoque</strong>
            <p>Disponibilidade, reservas e baixas acompanham a compra em tempo real.</p>
          </article>
        </div>
      </section>

      <section class="section-head" id="produtos">
        <div>
          <p class="eyebrow dark">Vitrine</p>
          <h2><?= e($activeCategoryName); ?></h2>
        </div>
        <a class="text-link" href="cart.php"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Finalizar compra</a>
      </section>

      <?php if (!$products): ?>
        <section class="store-main">
          <div class="empty-state luxe-empty">
            <h2>Nenhuma joia publicada ainda</h2>
            <p>A nova curadoria da GAO Joias esta sendo preparada. Volte em breve para conhecer as pecas disponiveis.</p>
            <a class="store-button" href="index.php"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Atualizar vitrine</a>
          </div>
        </section>
      <?php else: ?>
        <section class="product-grid">
          <?php foreach ($products as $product): ?>
            <?php
              $available = (int)$product['stock_qty'] - (int)$product['reserved_qty'];
              $isTracked = (int)$product['track_stock'] === 1;
              $canBuy = !$isTracked || (int)$product['allow_backorder'] === 1 || $available > 0;
              $isLow = $isTracked && $available <= (int)$product['low_stock_threshold'];
              $description = trim((string)($product['short_description'] ?: substr((string)$product['description'], 0, 126)));
            ?>
            <article class="product-card">
              <div class="product-media <?= empty($product['image_url']) ? 'logo-fallback' : ''; ?>">
                <img src="<?= e($product['image_url'] ?: '../img/gaojoias_logo.png'); ?>" alt="<?= e($product['name']); ?>">
                <span class="product-badge"><?= e($product['category_name'] ?: 'GAO'); ?></span>
              </div>
              <div class="product-body">
                <div class="product-title-row">
                  <h3><?= e($product['name']); ?></h3>
                  <span><?= e($product['sku']); ?></span>
                </div>
                <p><?= e($description ?: 'Peca selecionada pela curadoria GAO Joias.'); ?></p>
                <div class="price-row">
                  <span class="price"><?= store_money($product['price_cents']); ?></span>
                  <?php if ($isTracked): ?>
                    <span class="stock <?= $isLow ? 'low' : ''; ?>"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <?= max($available, 0); ?> disponivel<?= max($available, 0) === 1 ? '' : 's'; ?></span>
                  <?php else: ?>
                    <span class="stock"><i class="fa-regular fa-clock" aria-hidden="true"></i> Sob encomenda</span>
                  <?php endif; ?>
                </div>
                <form class="product-form" method="post">
                  <input type="hidden" name="product_id" value="<?= (int)$product['id']; ?>">
                  <input type="number" name="quantity" min="1" value="1" aria-label="Quantidade" <?= $canBuy ? '' : 'disabled'; ?>>
                  <button class="store-button" type="submit" <?= $canBuy ? '' : 'disabled'; ?>>
                    <i class="fa-solid <?= $canBuy ? 'fa-plus' : 'fa-ban'; ?>" aria-hidden="true"></i> <?= $canBuy ? 'Adicionar' : 'Esgotado'; ?>
                  </button>
                </form>
              </div>
            </article>
          <?php endforeach; ?>
        </section>
      <?php endif; ?>

      <?php if ($featured): ?>
        <section class="lookbook">
          <div class="lookbook-copy">
            <p class="eyebrow dark">Selecao GAO</p>
            <h2>Presentes que parecem escolhidos pessoalmente.</h2>
            <p>Combine aneis, colares e brincos em uma compra unica. O carrinho mantem a reserva do estoque ao iniciar o checkout.</p>
          </div>
          <div class="mini-products">
            <?php foreach ($featured as $item): ?>
              <a href="#produtos">
                <img src="<?= e($item['image_url'] ?: '../img/gaojoias_logo.png'); ?>" alt="<?= e($item['name']); ?>">
                <span><?= e($item['name']); ?></span>
                <strong><?= store_money($item['price_cents']); ?></strong>
              </a>
            <?php endforeach; ?>
          </div>
        </section>
      <?php endif; ?>
    </main>

    <footer class="store-footer">
      <div>
        <strong>GAO Joias</strong>
        <span>Loja online oficial com checkout seguro e atendimento personalizado.</span>
      </div>
      <a href="cart.php"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Carrinho</a>
    </footer>

    <a class="whatsapp-float" href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener noreferrer" aria-label="Falar com a GAO Joias no WhatsApp">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="assets/store.js"></script>
</body>
</html>
