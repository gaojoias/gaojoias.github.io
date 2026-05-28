<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$sessionId = trim((string)($_GET['session_id'] ?? ''));
$order = $sessionId !== '' ? store_find_order_by_session($sessionId) : null;
$whatsappHref = store_whatsapp_href('Ola, quero falar sobre meu pedido GAO Joias.');
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pedido recebido | GAO Joias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="icon" type="image/png" href="../img/favicon.png">
  <link rel="stylesheet" href="assets/store.css">
</head>
<body>
  <div class="store-shell">
    <header class="store-header">
      <a class="brand-link" href="index.php">
        <img src="../img/gaojoias_logo.png" alt="GAO Joias">
      </a>
      <nav class="store-nav">
        <a class="cart-link" href="index.php"><i class="fa-solid fa-store" aria-hidden="true"></i> Loja</a>
      </nav>
    </header>
    <main class="store-main">
      <section class="empty-state luxe-empty">
        <p class="eyebrow dark">Pedido recebido</p>
        <h2>Obrigada pela compra.</h2>
        <?php if ($order): ?>
          <p>Pedido <strong><?= e($order['order_number']); ?></strong> registrado. Status do pagamento: <strong><?= e($order['payment_status']); ?></strong>.</p>
          <p>Se o status ainda estiver pendente, aguarde alguns instantes: a confirmacao final chega pelo webhook da Stripe.</p>
        <?php else: ?>
          <p>O pagamento retornou para a loja. A confirmacao sera registrada assim que a Stripe enviar o webhook.</p>
        <?php endif; ?>
        <a class="store-button" href="index.php"><i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i> Voltar para a loja</a>
      </section>
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
