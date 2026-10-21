<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: cart.php');
    exit;
}

$stripeReady = (string)app_config('stripe.secret_key', '') !== '';
$order = null;

try {
    if (!$stripeReady) {
        throw new RuntimeException('Stripe nao conectada (Configuracoes > Pagamentos no painel).');
    }
    $order = store_create_order([
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'notes' => $_POST['notes'] ?? '',
    ]);
    $session = store_create_checkout_session((int)$order['id']);
    if (empty($session['url'])) {
        throw new RuntimeException('Stripe nao retornou a URL de checkout.');
    }
    header('Location: ' . $session['url'], true, 303);
    exit;
} catch (Throwable $e) {
    // Cart/form errors are written for the customer; payment failures are technical
    if (!$stripeReady || $order !== null) {
        error_log('[checkout] ' . $e->getMessage());
        if ($order !== null) {
            try {
                db()->beginTransaction();
                store_release_order_reservation((int)$order['id']);
                db()->commit();
            } catch (Throwable) {
                if (db()->inTransaction()) {
                    db()->rollBack();
                }
            }
        }
        $_SESSION['store_error'] = 'Não foi possível abrir o pagamento agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.';
    } else {
        $_SESSION['store_error'] = $e->getMessage();
    }
    header('Location: cart.php');
    exit;
}
