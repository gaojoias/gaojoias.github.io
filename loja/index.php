<?php
declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        store_add_to_cart((int)($_POST['product_id'] ?? 0), (int)($_POST['quantity'] ?? 1));
        header('Location: ' . $_SERVER['REQUEST_URI']);
        exit;
    } catch (Throwable $e) {
        $error = $e->getMessage();
    }
}

$category         = trim((string)($_GET['categoria'] ?? ''));
$categories       = store_categories();
$products         = $category !== ''
    ? store_product_query('c.slug = ?', [$category])
    : store_product_query();
$featured         = array_slice($products, 0, 4);
$activeCategoryName = 'Todas as joias';
foreach ($categories as $cat) {
    if ($category === $cat['slug']) {
        $activeCategoryName = (string)$cat['name'];
        break;
    }
}
$whatsappHref = store_whatsapp_href();
$cartCount    = store_cart_count();
$sidebarCart  = store_cart_items();
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GAO Joias | Loja Online</title>
  <meta name="description" content="Joias em ouro, pedras preciosas e composicoes delicadas. Curadoria GAO com checkout seguro e estoque em tempo real.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="icon" type="image/png" href="../img/favicon.png">
  <link rel="stylesheet" href="assets/store.css">
</head>
<body>
<div class="store-shell">

  <!-- Announcement Bar -->
  <div class="announcement" id="announcement-bar">
    <div class="announcement-inner">
      <span><i class="fa-solid fa-shield-halved"></i> Compra 100% segura</span>
      <span class="ann-sep">·</span>
      <span><i class="fa-regular fa-gem"></i> Atendimento personalizado</span>
      <span class="ann-sep">·</span>
      <span><i class="fa-solid fa-truck"></i> Frete a combinar</span>
      <span class="ann-sep">·</span>
      <span><i class="fa-solid fa-rotate-left"></i> Trocas facilitadas</span>
    </div>
  </div>

  <!-- Header -->
  <header class="store-header" id="store-header">
    <a class="brand-link" href="index.php" aria-label="GAO Joias — Página inicial">
      <img src="../img/gaojoias_logo.png" alt="GAO Joias" class="header-logo">
    </a>

    <nav class="store-nav" aria-label="Navegação principal">
      <a href="index.php" class="nav-link">Início</a>
      <a href="#colecoes" class="nav-link">Coleções</a>
      <a href="#produtos" class="nav-link">Joias</a>
      <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="nav-link">Contato</a>
    </nav>

    <div class="header-actions">
      <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="header-icon-btn" aria-label="WhatsApp" title="Falar pelo WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <button type="button" class="cart-trigger" id="cart-open-btn" aria-label="Abrir sacola">
        <i class="fa-solid fa-bag-shopping"></i>
        <span>Sacola</span>
        <span class="cart-badge" id="cart-count-badge" <?= $cartCount === 0 ? 'style="display:none"' : ''; ?>><?= $cartCount; ?></span>
      </button>
      <div id="cart-callout" class="cart-callout hidden" role="status" aria-live="polite">
        <div class="callout-header">
          <i class="fa-solid fa-circle-check"></i>
          <div>
            <strong>Item adicionado à sacola!</strong>
            <p>Deseja finalizar ou continuar comprando?</p>
          </div>
        </div>
        <div class="callout-btns">
          <button type="button" class="callout-btn primary" id="callout-view-cart">
            <i class="fa-solid fa-bag-shopping"></i> Ver sacola
          </button>
          <button type="button" class="callout-btn ghost" id="callout-dismiss">
            Continuar <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </header>

  <main>

    <!-- Hero -->
    <section class="hero-luxury">
      <img src="assets/img/hero-jewelry.png" alt="Joias GAO em ouro sobre seda" class="hero-image" loading="eager">
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow">Nova curadoria · <?= date('Y'); ?></p>
        <h1>GAO <em>Joias</em></h1>
        <p>Ouro, pedras preciosas e composições delicadas para momentos que ficam para sempre.</p>
        <div class="hero-actions">
          <a class="store-button light" href="#produtos"><i class="fa-regular fa-gem"></i> Explorar joias</a>
          <a class="store-button glass" href="#colecoes"><i class="fa-solid fa-layer-group"></i> Ver coleções</a>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section" id="colecoes" aria-label="Coleções">
      <div class="categories-header">
        <p class="eyebrow dark">Filtrar por coleção</p>
        <h2 class="section-title">Encontre a joia perfeita</h2>
      </div>
      <div class="cat-pills">
        <a href="index.php" class="cat-pill <?= $category === '' ? 'active' : ''; ?>">Todas</a>
        <?php foreach ($categories as $cat): ?>
          <?php if ((int)$cat['products_count'] <= 0) continue; ?>
          <a class="cat-pill <?= $category === $cat['slug'] ? 'active' : ''; ?>"
             href="index.php?categoria=<?= e($cat['slug']); ?>">
            <?= e($cat['name']); ?>
          </a>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- Editorial Band -->
    <section class="editorial-band">
      <div class="editorial-copy">
        <p class="eyebrow dark">Design autoral</p>
        <h2 class="section-title">Peças para usar todos os dias,<br><em>com presença de joia especial.</em></h2>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <span class="feature-icon"><i class="fa-regular fa-gem"></i></span>
          <strong>Acabamento premium</strong>
          <p>Cada peça com detalhamento completo de materiais, brilho e composição.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon"><i class="fa-solid fa-credit-card"></i></span>
          <strong>Compra direta</strong>
          <p>Checkout seguro com Stripe. Pagamento processado em segundos.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon"><i class="fa-solid fa-boxes-stacked"></i></span>
          <strong>Estoque em tempo real</strong>
          <p>Disponibilidade atualizada automaticamente a cada pedido.</p>
        </article>
      </div>
    </section>

    <?php if ($error): ?>
      <div class="store-notice error"><i class="fa-solid fa-circle-exclamation"></i> <?= e($error); ?></div>
    <?php endif; ?>

    <!-- Products -->
    <section class="products-section" id="produtos">
      <div class="section-head">
        <div>
          <p class="eyebrow dark">Vitrine</p>
          <h2 class="section-title"><?= e($activeCategoryName); ?></h2>
        </div>
        <button type="button" class="text-link" id="section-cart-open">
          <i class="fa-solid fa-bag-shopping"></i>
          <span>Ver sacola<?php if ($cartCount > 0): ?> (<?= $cartCount; ?>)<?php endif; ?></span>
        </button>
      </div>

      <?php if (!$products): ?>
        <div class="empty-state luxe-empty">
          <i class="fa-regular fa-gem empty-icon"></i>
          <h2>Nenhuma joia publicada</h2>
          <p>A nova curadoria GAO está sendo preparada. Volte em breve.</p>
          <a class="store-button" href="index.php"><i class="fa-solid fa-rotate-right"></i> Atualizar vitrine</a>
        </div>
      <?php else: ?>
        <div class="product-grid">
          <?php foreach ($products as $product): ?>
            <?php
              $available  = (int)$product['stock_qty'] - (int)$product['reserved_qty'];
              $isTracked  = (int)$product['track_stock'] === 1;
              $canBuy     = !$isTracked || (int)$product['allow_backorder'] === 1 || $available > 0;
              $isLow      = $isTracked && $available > 0 && $available <= (int)$product['low_stock_threshold'];
              $isOut      = $isTracked && !$canBuy;
              $catLabel   = $product['category_name'] ?: '';
            ?>
            <article class="product-card">
              <div class="product-media <?= empty($product['image_url']) ? 'logo-fallback' : ''; ?>">
                <img src="<?= e($product['image_url'] ?: '../img/gaojoias_logo.png'); ?>"
                     alt="<?= e($product['name']); ?>" loading="lazy">
                <?php if ($catLabel): ?><span class="badge-category"><?= e($catLabel); ?></span><?php endif; ?>
                <?php if ($isLow): ?><span class="badge-low">Últimas unidades</span><?php endif; ?>
                <?php if ($isOut): ?><span class="badge-out">Esgotado</span><?php endif; ?>
                <form class="card-add-form" data-ajax-cart>
                  <input type="hidden" name="product_id" value="<?= (int)$product['id']; ?>">
                  <div class="card-overlay-action">
                    <button class="quick-add-btn" type="submit" <?= $canBuy ? '' : 'disabled'; ?>>
                      <?= $canBuy ? '<i class="fa-solid fa-plus"></i> Adicionar à sacola' : '<i class="fa-solid fa-ban"></i> Esgotado'; ?>
                    </button>
                  </div>
                </form>
              </div>
              <div class="product-body">
                <?php if ($catLabel): ?><span class="product-cat-label"><?= e($catLabel); ?></span><?php endif; ?>
                <h3 class="product-name"><?= e($product['name']); ?></h3>
                <span class="product-price"><?= store_money($product['price_cents']); ?></span>
                <?php if ($isLow): ?>
                  <span class="product-stock-note low"><i class="fa-solid fa-circle-exclamation"></i> <?= max($available,0); ?> restante<?= max($available,0) === 1 ? '' : 's'; ?></span>
                <?php elseif ($isOut): ?>
                  <span class="product-stock-note low"><i class="fa-solid fa-ban"></i> Esgotado</span>
                <?php elseif (!$isTracked): ?>
                  <span class="product-stock-note"><i class="fa-regular fa-clock"></i> Sob encomenda</span>
                <?php endif; ?>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </section>

    <!-- Lookbook -->
    <?php if ($featured): ?>
      <section class="lookbook">
        <div class="lookbook-copy">
          <p class="eyebrow">Seleção GAO</p>
          <h2>Presentes que parecem<br><em>escolhidos pessoalmente.</em></h2>
          <p>Combine anéis, colares e brincos em uma compra única. O sacola mantém a reserva de estoque enquanto você decide.</p>
          <button type="button" class="store-button light" id="lookbook-cart-btn">
            <i class="fa-solid fa-bag-shopping"></i> Ver sacola
          </button>
        </div>
        <div class="mini-products">
          <?php foreach ($featured as $item): ?>
            <a href="#produtos" class="mini-card">
              <div class="mini-card-img">
                <img src="<?= e($item['image_url'] ?: '../img/gaojoias_logo.png'); ?>" alt="<?= e($item['name']); ?>" loading="lazy">
              </div>
              <span class="mini-card-name"><?= e($item['name']); ?></span>
              <strong class="mini-card-price"><?= store_money($item['price_cents']); ?></strong>
            </a>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>

  </main>

  <!-- Footer -->
  <footer class="store-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <img src="../img/gaojoias_logo.png" alt="GAO Joias" class="footer-logo">
        <p>Joias em ouro e pedras preciosas. Design autoral com acabamento premium e atendimento personalizado.</p>
        <div class="footer-social">
          <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Navegação</h4>
        <ul>
          <li><a href="index.php">Início</a></li>
          <li><a href="#colecoes">Coleções</a></li>
          <li><a href="#produtos">Joias</a></li>
          <li><a href="#" id="footer-cart-link">Sacola</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Atendimento</h4>
        <ul>
          <li><a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a></li>
          <li><a href="#">Política de Trocas</a></li>
          <li><a href="#">Formas de Pagamento</a></li>
          <li><a href="#">Sobre a GAO</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Segurança</h4>
        <ul class="footer-trust-list">
          <li><i class="fa-solid fa-lock"></i> Checkout criptografado</li>
          <li><i class="fa-solid fa-shield-halved"></i> Compra 100% segura</li>
          <li><i class="fa-solid fa-boxes-stacked"></i> Reserva automática de estoque</li>
          <li><i class="fa-solid fa-headset"></i> Suporte personalizado</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <?= date('Y'); ?> GAO Joias. Todos os direitos reservados.</span>
      <div class="footer-bottom-badges">
        <span><i class="fa-brands fa-stripe"></i> Pagamentos via Stripe</span>
        <span><i class="fa-solid fa-lock"></i> SSL Seguro</span>
      </div>
    </div>
  </footer>

  <!-- WhatsApp Float -->
  <a class="whatsapp-float" href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener noreferrer" aria-label="Falar com GAO Joias no WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>

  <!-- Cart Sidebar Overlay -->
  <div class="cart-overlay" id="cart-overlay" aria-hidden="true"></div>

  <!-- Cart Sidebar -->
  <aside class="cart-sidebar" id="cart-sidebar" aria-label="Sacola de compras" aria-hidden="true">
    <div class="cart-sidebar-head">
      <div>
        <h2>Sacola</h2>
        <span id="cart-sidebar-count"><?= $cartCount; ?> <?= $cartCount === 1 ? 'item' : 'itens'; ?></span>
      </div>
      <button type="button" class="cart-close-btn" id="cart-close-btn" aria-label="Fechar sacola">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="cart-sidebar-body" id="cart-sidebar-body">
      <ul class="sidebar-items" id="sidebar-items-list" <?= !$sidebarCart['items'] ? 'style="display:none"' : ''; ?>>
        <?php foreach ($sidebarCart['items'] as $sitem):
          $sp = $sitem['product'];
        ?>
          <li class="sidebar-item" data-product-id="<?= (int)$sp['id']; ?>">
            <div class="sidebar-item-img">
              <img src="<?= e($sp['image_url'] ?: '../img/gaojoias_logo.png'); ?>" alt="<?= e($sp['name']); ?>">
            </div>
            <div class="sidebar-item-info">
              <span class="sidebar-item-sku"><?= e($sp['sku']); ?></span>
              <strong class="sidebar-item-name"><?= e($sp['name']); ?></strong>
              <span class="sidebar-item-price"><?= store_money((int)$sp['price_cents']); ?></span>
            </div>
            <div class="sidebar-item-controls">
              <div class="sidebar-qty">
                <button type="button" class="s-qty-btn s-qty-dec" data-product-id="<?= (int)$sp['id']; ?>" data-qty="<?= (int)$sitem['quantity']; ?>">−</button>
                <span class="s-qty-val"><?= (int)$sitem['quantity']; ?></span>
                <button type="button" class="s-qty-btn s-qty-inc" data-product-id="<?= (int)$sp['id']; ?>" data-qty="<?= (int)$sitem['quantity']; ?>">+</button>
              </div>
              <strong class="sidebar-item-total"><?= store_money((int)$sitem['total']); ?></strong>
              <button type="button" class="sidebar-remove" data-product-id="<?= (int)$sp['id']; ?>" aria-label="Remover">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>

      <div class="sidebar-empty" id="sidebar-empty" <?= $sidebarCart['items'] ? 'style="display:none"' : ''; ?>>
        <i class="fa-regular fa-gem"></i>
        <p>Seu sacola está vazio</p>
        <small>Adicione joias para continuar</small>
        <button type="button" class="store-button secondary" id="sidebar-keep-shopping">Explorar joias</button>
      </div>
    </div>

    <div class="cart-sidebar-foot" id="cart-sidebar-foot" <?= !$sidebarCart['items'] ? 'style="display:none"' : ''; ?>>
      <div class="sidebar-subtotal">
        <span>Subtotal</span>
        <strong id="sidebar-subtotal-val"><?= store_money((int)($sidebarCart['subtotal'] ?? 0)); ?></strong>
      </div>
      <p class="sidebar-shipping"><i class="fa-solid fa-truck"></i> Frete calculado no checkout</p>
      <form class="sidebar-checkout-form" method="post" action="checkout.php">
        <input type="text" name="name" placeholder="Nome completo" required autocomplete="name">
        <input type="email" name="email" placeholder="E-mail" required autocomplete="email">
        <input type="tel" name="phone" placeholder="WhatsApp / Telefone" autocomplete="tel">
        <button type="submit" class="store-button sidebar-pay-btn">
          <i class="fa-solid fa-lock"></i> Finalizar pedido
        </button>
      </form>
      <div class="sidebar-trust">
        <span><i class="fa-solid fa-shield-halved"></i> Pagamento seguro via Stripe</span>
        <span><i class="fa-solid fa-rotate-left"></i> Estoque reservado por 2 horas</span>
      </div>
    </div>
  </aside>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="assets/store.js"></script>
</body>
</html>
