<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$orderNumber = trim((string)($_GET['order'] ?? ''));
$order = $orderNumber !== '' ? store_find_order_by_number($orderNumber) : null;
$whatsappHref = store_whatsapp_href('Ola, quero ajuda para finalizar minha compra na GAO Joias.');
if ($order && $order['payment_status'] !== 'paid') {
    db()->beginTransaction();
    try {
        store_release_order_reservation((int)$order['id']);
        db()->commit();
    } catch (Throwable) {
        if (db()->inTransaction()) {
            db()->rollBack();
        }
    }
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pagamento cancelado | GAO Joias</title>
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
        <p class="eyebrow dark">Checkout interrompido</p>
        <h2>Pagamento cancelado.</h2>
        <p>A compra nao foi concluida. A reserva de estoque foi liberada para pedidos nao pagos.</p>
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
