<?php
declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$slug = trim((string)($_GET['slug'] ?? ''));
if ($slug === '') {
    header('Location: index.php');
    exit;
}

$stmt = db()->prepare(
    'SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN product_categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.status = "active"
     LIMIT 1'
);
$stmt->execute([$slug]);
$product = $stmt->fetch();

if (!$product) {
    header('Location: index.php');
    exit;
}

$imgStmt = db()->prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order, id');
$imgStmt->execute([(int)$product['id']]);
$extraImages = array_column($imgStmt->fetchAll(), 'image_url');

$allImages = [];
if ($product['image_url']) $allImages[] = $product['image_url'];
foreach ($extraImages as $url) {
    if ($url && !in_array($url, $allImages, true)) $allImages[] = $url;
}
if (!$allImages) $allImages[] = '../img/gaojoias_logo.png';

$available = (int)$product['stock_qty'] - (int)$product['reserved_qty'];
$isTracked = (int)$product['track_stock'] === 1;
$canBuy    = !$isTracked || (int)$product['allow_backorder'] === 1 || $available > 0;
$isLow     = $isTracked && $available > 0 && $available <= (int)$product['low_stock_threshold'];
$isOut     = $isTracked && !$canBuy;

$related = [];
if ($product['category_id']) {
    $relStmt = db()->prepare(
        'SELECT p.*, c.name AS category_name
         FROM products p
         LEFT JOIN product_categories c ON c.id = p.category_id
         WHERE p.category_id = ? AND p.id != ? AND p.status = "active"
         ORDER BY RAND() LIMIT 4'
    );
    $relStmt->execute([(int)$product['category_id'], (int)$product['id']]);
    $related = $relStmt->fetchAll();
}
if (count($related) < 4) {
    $needed     = 4 - count($related);
    $excludeIds = [(int)$product['id']];
    foreach ($related as $r) $excludeIds[] = (int)$r['id'];
    $ph      = implode(',', array_fill(0, count($excludeIds), '?'));
    $fillStmt = db()->prepare(
        "SELECT p.*, c.name AS category_name
         FROM products p
         LEFT JOIN product_categories c ON c.id = p.category_id
         WHERE p.id NOT IN ($ph) AND p.status = 'active'
         ORDER BY RAND() LIMIT $needed"
    );
    $fillStmt->execute($excludeIds);
    $related = array_merge($related, $fillStmt->fetchAll());
}

$waMsg        = 'Ola, tenho interesse na joia: ' . $product['name'] . ' (Ref: ' . $product['sku'] . ')';
$whatsappHref = store_whatsapp_href($waMsg);
$cartCount    = store_cart_count();
$sidebarCart  = store_cart_items();
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($product['name']); ?> | GAO Joias</title>
  <meta name="description" content="<?= e($product['short_description'] ?: 'Joia GAO Joias. ' . $product['name']); ?>">
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
      <span><i class="fa-solid fa-truck"></i> Frete grátis para todo o Brasil</span>
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
      <div class="nav-dropdown">
        <a href="index.php#produtos" class="nav-link nav-has-dropdown">
          Joias <i class="fa-solid fa-chevron-down nav-caret"></i>
        </a>
        <div class="nav-dropdown-menu">
          <a href="index.php" class="nav-dropdown-item">
            <i class="fa-regular fa-gem"></i> Todas as joias
          </a>
          <?php foreach (store_categories() as $cat): ?>
            <?php if ((int)$cat['products_count'] <= 0) continue; ?>
            <a href="index.php?categoria=<?= e($cat['slug']); ?>" class="nav-dropdown-item">
              <?= e($cat['name']); ?>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
      <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="nav-link">Contato</a>
    </nav>
    <div class="header-actions">
      <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="header-icon-btn" aria-label="WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <button type="button" class="cart-trigger" id="cart-open-btn" aria-label="Abrir sacola">
        <i class="fa-solid fa-bag-shopping"></i>
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

    <!-- Breadcrumb -->
    <nav class="pdp-breadcrumb" aria-label="Caminho">
      <a href="index.php">Joias</a>
      <?php if ($product['category_name']): ?>
        <span class="bc-sep"><i class="fa-solid fa-chevron-right"></i></span>
        <a href="index.php?categoria=<?= e($product['category_slug'] ?? ''); ?>"><?= e($product['category_name']); ?></a>
      <?php endif; ?>
      <span class="bc-sep"><i class="fa-solid fa-chevron-right"></i></span>
      <span class="bc-current"><?= e($product['name']); ?></span>
    </nav>

    <!-- Product Detail -->
    <section class="pdp-layout">

      <!-- Gallery -->
      <div class="pdp-gallery">
        <div class="pdp-main-wrap">
          <?php if ($isOut): ?>
            <span class="pdp-badge out">Esgotado</span>
          <?php elseif ($isLow): ?>
            <span class="pdp-badge low">Últimas unidades</span>
          <?php endif; ?>
          <img id="pdp-main-img" class="pdp-main-img"
               src="<?= e(store_img_url($allImages[0])); ?>"
               alt="<?= e($product['name']); ?>">
        </div>
        <?php if (count($allImages) > 1): ?>
          <div class="pdp-thumbs">
            <?php foreach ($allImages as $i => $imgUrl): ?>
              <button type="button"
                      class="pdp-thumb <?= $i === 0 ? 'active' : ''; ?>"
                      data-src="<?= e(store_img_url($imgUrl)); ?>"
                      aria-label="Foto <?= $i + 1; ?>">
                <img src="<?= e(store_img_url($imgUrl)); ?>" alt="Foto <?= $i + 1; ?>" loading="lazy">
              </button>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- Info -->
      <div class="pdp-info">
        <?php if ($product['category_name']): ?>
          <a class="pdp-cat-pill" href="index.php?categoria=<?= e($product['category_slug'] ?? ''); ?>">
            <?= e($product['category_name']); ?>
          </a>
        <?php endif; ?>

        <h1 class="pdp-name"><?= e($product['name']); ?></h1>

        <div class="pdp-price-row">
          <span class="pdp-price"><?= store_money($product['price_cents']); ?></span>
          <?php if ($product['compare_at_cents'] && (int)$product['compare_at_cents'] > (int)$product['price_cents']): ?>
            <span class="pdp-compare"><?= store_money($product['compare_at_cents']); ?></span>
            <span class="pdp-discount-badge">
              <?= round((1 - (int)$product['price_cents'] / (int)$product['compare_at_cents']) * 100); ?>% OFF
            </span>
          <?php endif; ?>
        </div>

        <p class="pdp-free-ship"><i class="fa-solid fa-truck"></i> Frete grátis para todo o Brasil</p>

        <?php if ($product['short_description']): ?>
          <p class="pdp-short-desc"><?= nl2br(e($product['short_description'])); ?></p>
        <?php endif; ?>

        <!-- Add to Cart -->
        <form class="pdp-add-form" data-ajax-cart>
          <input type="hidden" name="product_id" value="<?= (int)$product['id']; ?>">
          <div class="pdp-qty-row">
            <label class="pdp-qty-label">Quantidade</label>
            <div class="pdp-qty-ctrl">
              <button type="button" class="pdp-qty-btn qty-dec" aria-label="Diminuir">−</button>
              <input type="number" name="quantity" class="pdp-qty-input" value="1" min="1"
                     <?= ($isTracked && !$product['allow_backorder']) ? 'max="' . $available . '"' : ''; ?>>
              <button type="button" class="pdp-qty-btn qty-inc" aria-label="Aumentar">+</button>
            </div>
          </div>

          <?php if ($isOut): ?>
            <button type="button" class="store-button pdp-add-btn" disabled>
              <i class="fa-solid fa-ban"></i> Esgotado
            </button>
          <?php else: ?>
            <button type="submit" class="store-button pdp-add-btn add-btn">
              <i class="fa-solid fa-bag-shopping"></i> Adicionar à sacola
            </button>
          <?php endif; ?>
        </form>

        <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="store-button secondary pdp-wa-btn">
          <i class="fa-brands fa-whatsapp"></i> Consultar pelo WhatsApp
        </a>

        <?php if ($isLow): ?>
          <p class="pdp-stock-note low">
            <i class="fa-solid fa-circle-exclamation"></i>
            Apenas <?= max($available, 0); ?> unidade<?= max($available, 0) === 1 ? '' : 's'; ?> disponível
          </p>
        <?php endif; ?>

        <!-- Product Meta -->
        <div class="pdp-meta">
          <?php if ($product['sku']): ?>
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">Referência</span>
              <span class="pdp-meta-val"><?= e($product['sku']); ?></span>
            </div>
          <?php endif; ?>
          <?php if ($product['weight_grams']): ?>
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">Peso</span>
              <span class="pdp-meta-val"><?= (int)$product['weight_grams']; ?> g</span>
            </div>
          <?php endif; ?>
          <?php if ($product['dimensions']): ?>
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">Dimensões</span>
              <span class="pdp-meta-val"><?= e($product['dimensions']); ?></span>
            </div>
          <?php endif; ?>
          <div class="pdp-meta-row">
            <span class="pdp-meta-label">Disponibilidade</span>
            <span class="pdp-meta-val <?= $canBuy ? 'in-stock' : 'out-stock'; ?>">
              <?= $isOut ? 'Esgotado' : ($isTracked ? 'Em estoque' : 'Sob encomenda'); ?>
            </span>
          </div>
        </div>

        <!-- Trust badges -->
        <div class="pdp-trust">
          <span><i class="fa-solid fa-lock"></i> Checkout seguro</span>
          <span><i class="fa-solid fa-rotate-left"></i> Trocas facilitadas</span>
          <span><i class="fa-solid fa-shield-halved"></i> Compra garantida</span>
        </div>
      </div>
    </section>

    <!-- Full Description -->
    <?php if ($product['description']): ?>
      <section class="pdp-full-desc">
        <div class="pdp-full-desc-inner">
          <h2>Sobre esta peça</h2>
          <div class="pdp-desc-body">
            <?= nl2br(e($product['description'])); ?>
          </div>
        </div>
      </section>
    <?php endif; ?>

    <!-- Related Products -->
    <?php if ($related): ?>
      <section class="related-section">
        <div class="section-head">
          <div>
            <p class="eyebrow dark">Você pode gostar também</p>
            <h2 class="section-title">Peças relacionadas</h2>
          </div>
          <a href="index.php" class="text-link">
            <i class="fa-solid fa-arrow-right"></i> Ver todas
          </a>
        </div>
        <div class="product-grid">
          <?php foreach ($related as $rel):
            $relAvail = (int)$rel['stock_qty'] - (int)$rel['reserved_qty'];
            $relTrack = (int)$rel['track_stock'] === 1;
            $relCan   = !$relTrack || (int)$rel['allow_backorder'] === 1 || $relAvail > 0;
            $relOut   = $relTrack && !$relCan;
            $relLow   = $relTrack && $relAvail > 0 && $relAvail <= (int)$rel['low_stock_threshold'];
          ?>
            <article class="product-card">
              <a href="produto.php?slug=<?= e($rel['slug']); ?>" class="card-cover-link" aria-label="Ver <?= e($rel['name']); ?>"></a>
              <div class="product-media <?= empty($rel['image_url']) ? 'logo-fallback' : ''; ?>">
                <img src="<?= e(store_img_url($rel['image_url'])); ?>"
                     alt="<?= e($rel['name']); ?>" loading="lazy">
                <?php if ($rel['category_name']): ?><span class="badge-category"><?= e($rel['category_name']); ?></span><?php endif; ?>
                <?php if ($relLow): ?><span class="badge-low">Últimas unidades</span><?php endif; ?>
                <?php if ($relOut): ?><span class="badge-out">Esgotado</span><?php endif; ?>
                <form class="card-add-form" data-ajax-cart>
                  <input type="hidden" name="product_id" value="<?= (int)$rel['id']; ?>">
                  <div class="card-overlay-action">
                    <button class="quick-add-btn" type="submit" <?= $relCan ? '' : 'disabled'; ?>>
                      <?= $relCan ? '<i class="fa-solid fa-plus"></i> Adicionar à sacola' : '<i class="fa-solid fa-ban"></i> Esgotado'; ?>
                    </button>
                  </div>
                </form>
              </div>
              <div class="product-body">
                <?php if ($rel['category_name']): ?><span class="product-cat-label"><?= e($rel['category_name']); ?></span><?php endif; ?>
                <h3 class="product-name"><?= e($rel['name']); ?></h3>
                <span class="product-price"><?= store_money($rel['price_cents']); ?></span>
              </div>
            </article>
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
          <li><a href="index.php#colecoes">Coleções</a></li>
          <li><a href="index.php#produtos">Joias</a></li>
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

  <!-- Cart Sidebar -->
  <div class="cart-overlay" id="cart-overlay" aria-hidden="true"></div>
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
        <?php foreach ($sidebarCart['items'] as $sitem): $sp = $sitem['product']; ?>
          <li class="sidebar-item" data-product-id="<?= (int)$sp['id']; ?>">
            <div class="sidebar-item-img">
              <img src="<?= e(store_img_url($sp['image_url'])); ?>" alt="<?= e($sp['name']); ?>">
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
      <p class="sidebar-shipping"><i class="fa-solid fa-truck"></i> Frete grátis para todo o Brasil</p>
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
<script>
(function () {
  var mainImg = document.getElementById('pdp-main-img');
  document.querySelectorAll('.pdp-thumb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      mainImg.src = btn.dataset.src;
      document.querySelectorAll('.pdp-thumb').forEach(function (t) { t.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  var qtyInput = document.querySelector('.pdp-qty-input');
  document.querySelector('.qty-dec')?.addEventListener('click', function () {
    if (qtyInput) qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1', 10) - 1);
  });
  document.querySelector('.qty-inc')?.addEventListener('click', function () {
    if (qtyInput) qtyInput.value = parseInt(qtyInput.value || '1', 10) + 1;
  });
})();
</script>
</body>
</html>
