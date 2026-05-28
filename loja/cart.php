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

$cart = store_cart_items();
$error = $_SESSION['store_error'] ?? '';
unset($_SESSION['store_error']);
$whatsappHref = store_whatsapp_href();
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Carrinho | GAO Joias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="icon" type="image/png" href="../img/favicon.png">
  <link rel="stylesheet" href="assets/store.css">
</head>
<body>
  <div class="store-shell cart-page">
    <div class="announcement">
      <span><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Checkout seguro</span>
      <span><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> Reserva temporaria de estoque</span>
      <span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Atendimento GAO</span>
    </div>

    <header class="store-header">
      <a class="brand-link" href="index.php">
        <img src="../img/gaojoias_logo.png" alt="GAO Joias">
      </a>
      <nav class="store-nav">
        <a href="index.php"><i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i> Continuar comprando</a>
        <a class="cart-link" href="cart.php"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Carrinho <strong><?= store_cart_count(); ?></strong></a>
      </nav>
    </header>

    <main class="store-main">
      <section class="checkout-hero">
        <p class="eyebrow dark">Carrinho</p>
        <h1>Sua selecao GAO</h1>
        <p>Revise as pecas, ajuste quantidades e siga para o pagamento seguro.</p>
      </section>

      <?php if ($error): ?>
        <div class="notice error"><?= e($error); ?></div>
      <?php endif; ?>
      <?php foreach ($cart['errors'] as $cartError): ?>
        <div class="notice error"><?= e($cartError); ?></div>
      <?php endforeach; ?>

      <?php if (!$cart['items']): ?>
        <div class="empty-state luxe-empty">
          <h2>Carrinho vazio</h2>
          <p>Escolha uma joia publicada na loja para iniciar uma compra.</p>
          <a class="store-button" href="index.php">Ver joias</a>
        </div>
      <?php else: ?>
        <div class="cart-layout">
          <section class="store-panel cart-products">
            <div class="panel-title-row">
              <h2>Pecas escolhidas</h2>
              <a class="text-link" href="index.php"><i class="fa-solid fa-plus" aria-hidden="true"></i> Adicionar mais</a>
            </div>
            <form method="post">
              <input type="hidden" name="action" value="update">
              <div class="cart-items">
                <?php foreach ($cart['items'] as $item): ?>
                  <?php $product = $item['product']; ?>
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
              <button class="store-button secondary" type="submit"><i class="fa-solid fa-rotate" aria-hidden="true"></i> Atualizar carrinho</button>
            </form>
          </section>

          <aside class="store-panel cart-summary">
            <h2>Resumo do pedido</h2>
            <div class="summary-row"><span>Subtotal</span><strong><?= store_money($cart['subtotal']); ?></strong></div>
            <div class="summary-row"><span>Frete</span><strong>A combinar</strong></div>
            <div class="summary-row"><span>Reserva</span><strong>2 horas</strong></div>
            <div class="summary-row total"><span>Total agora</span><strong><?= store_money($cart['subtotal']); ?></strong></div>

            <form class="checkout-form" method="post" action="checkout.php">
              <input type="text" name="name" placeholder="Nome completo" required>
              <input type="email" name="email" placeholder="E-mail" required>
              <input type="tel" name="phone" placeholder="Telefone ou WhatsApp">
              <textarea name="notes" rows="3" placeholder="Observacoes para o pedido"></textarea>
              <button class="store-button" type="submit"><i class="fa-solid fa-credit-card" aria-hidden="true"></i> Pagar com Stripe</button>
            </form>

            <div class="trust-list">
              <span><i class="fa-solid fa-lock" aria-hidden="true"></i> Pagamento criptografado</span>
              <span><i class="fa-solid fa-receipt" aria-hidden="true"></i> Pedido registrado com seguranca</span>
              <span><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i> Estoque reservado automaticamente</span>
            </div>
          </aside>
        </div>
      <?php endif; ?>
    </main>

    <a class="whatsapp-float" href="<?= e($whatsappHref); ?>" target="_blank" rel="noopener noreferrer" aria-label="Falar com a GAO Joias no WhatsApp">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="assets/store.js"></script>
</body>
</html>
