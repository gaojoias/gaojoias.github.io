<?php
declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'update') {
    store_update_cart(is_array($_POST['qty'] ?? null) ? $_POST['qty'] : []);
    header('Location: cart.php');
    exit;
}

$cart         = store_cart_items();
$error        = $_SESSION['store_error'] ?? '';
unset($_SESSION['store_error']);
$whatsappHref = store_whatsapp_href();
$cartCount    = store_cart_count();
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sacola | GAO Joias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="icon" type="image/png" href="../img/favicon.png">
  <link rel="stylesheet" href="assets/store.css">
</head>
<body>
<div class="store-shell cart-page">

  <div class="announcement">
    <div class="announcement-inner">
      <span><i class="fa-solid fa-shield-halved"></i> Checkout seguro</span>
      <span class="ann-sep">·</span>
      <span><i class="fa-solid fa-clock-rotate-left"></i> Reserva por 2 horas</span>
      <span class="ann-sep">·</span>
      <span><i class="fa-brands fa-whatsapp"></i> Atendimento GAO</span>
    </div>
  </div>

  <header class="store-header" id="store-header">
    <a class="brand-link" href="index.php" aria-label="GAO Joias">
      <img src="../img/gaojoias_logo.png" alt="GAO Joias" class="header-logo">
    </a>
    <nav class="store-nav">
      <a href="index.php" class="nav-link"><i class="fa-solid fa-arrow-left-long"></i> Continuar comprando</a>
    </nav>
    <div class="header-actions">
      <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" class="header-icon-btn" aria-label="WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <a href="cart.php" class="cart-trigger" style="text-decoration:none">
        <i class="fa-solid fa-bag-shopping"></i>
        <span>Sacola</span>
        <span class="cart-badge" <?= $cartCount === 0 ? 'style="display:none"' : ''; ?>><?= $cartCount; ?></span>
      </a>
    </div>
  </header>

  <main class="store-main">
    <section class="checkout-hero">
      <p class="eyebrow dark">Sacola</p>
      <h1>Sua seleção <em>GAO</em></h1>
      <p>Revise as peças, ajuste quantidades e siga para o pagamento seguro.</p>
    </section>

    <?php if ($error): ?>
      <div class="notice error"><i class="fa-solid fa-circle-exclamation"></i> <?= e($error); ?></div>
    <?php endif; ?>
    <?php foreach ($cart['errors'] as $cartError): ?>
      <div class="notice error"><?= e($cartError); ?></div>
    <?php endforeach; ?>

    <?php if (!$cart['items']): ?>
      <div class="empty-state luxe-empty">
        <i class="fa-regular fa-gem empty-icon"></i>
        <h2>Sacola vazio</h2>
        <p>Escolha joias na vitrine para iniciar uma compra.</p>
        <a class="store-button" href="index.php"><i class="fa-regular fa-gem"></i> Ver joias</a>
      </div>
    <?php else: ?>
      <div class="cart-layout">
        <section class="store-panel cart-products">
          <div class="panel-title-row">
            <h2>Peças escolhidas</h2>
            <a class="text-link" href="index.php"><i class="fa-solid fa-plus"></i> Adicionar mais</a>
          </div>
          <form method="post">
            <input type="hidden" name="action" value="update">
            <div class="cart-items">
              <?php foreach ($cart['items'] as $item):
                $product = $item['product'];
              ?>
                <article class="cart-item">
                  <img src="<?= e($product['image_url'] ?: '../img/gaojoias_logo.png'); ?>" alt="<?= e($product['name']); ?>">
                  <div>
                    <span class="item-kicker"><?= e($product['sku']); ?></span>
                    <strong><?= e($product['name']); ?></strong>
                    <small><?= store_money($product['price_cents']); ?> cada</small>
                  </div>
                  <label>
                    Qtd.
                    <input type="number" min="0" name="qty[<?= (int)$product['id']; ?>]" value="<?= (int)$item['quantity']; ?>">
                  </label>
                  <strong class="item-total"><?= store_money($item['total']); ?></strong>
                </article>
              <?php endforeach; ?>
            </div>
            <button class="store-button secondary" type="submit">
              <i class="fa-solid fa-rotate"></i> Atualizar sacola
            </button>
          </form>
        </section>

        <aside class="store-panel cart-summary">
          <h2>Resumo do pedido</h2>
          <div class="summary-row"><span>Subtotal</span><strong><?= store_money($cart['subtotal']); ?></strong></div>
          <div class="summary-row"><span>Frete</span><strong style="color:var(--gold-dark)">Grátis</strong></div>
          <div class="summary-row"><span>Reserva de estoque</span><strong>2 horas</strong></div>
          <div class="summary-row total">
            <span>Total agora</span>
            <strong><?= store_money($cart['subtotal']); ?></strong>
          </div>

          <form class="checkout-form" method="post" action="checkout.php">
            <input type="text"  name="name"  placeholder="Nome completo" required autocomplete="name">
            <input type="email" name="email" placeholder="E-mail" required autocomplete="email">
            <input type="tel"   name="phone" placeholder="Telefone / WhatsApp" autocomplete="tel">
            <textarea name="notes" rows="3" placeholder="Observações para o pedido"></textarea>
            <button class="store-button" type="submit">
              <i class="fa-solid fa-lock"></i> Finalizar pedido
            </button>
          </form>

          <div class="trust-list">
            <span><i class="fa-solid fa-lock"></i> Pagamento criptografado via Stripe</span>
            <span><i class="fa-solid fa-receipt"></i> Pedido registrado com segurança</span>
            <span><i class="fa-solid fa-boxes-stacked"></i> Estoque reservado automaticamente</span>
          </div>
        </aside>
      </div>
    <?php endif; ?>
  </main>

  <footer class="store-footer">
    <div class="footer-main" style="grid-template-columns:1fr 1fr; gap:32px 40px;">
      <div class="footer-brand">
        <img src="../img/gaojoias_logo.png" alt="GAO Joias" class="footer-logo">
        <p>Joias em ouro e pedras preciosas com atendimento personalizado.</p>
        <div class="footer-social">
          <a href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Segurança</h4>
        <ul class="footer-trust-list">
          <li><i class="fa-solid fa-lock"></i> Checkout criptografado</li>
          <li><i class="fa-solid fa-shield-halved"></i> Compra 100% segura</li>
          <li><i class="fa-solid fa-boxes-stacked"></i> Reserva automática</li>
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

  <a class="whatsapp-float" href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener noreferrer" aria-label="Falar com GAO Joias no WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>

</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="assets/store.js"></script>
</body>
</html>
