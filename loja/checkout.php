<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: cart.php');
    exit;
}

try {
    if ((string)app_config('stripe.secret_key', '') === '') {
        throw new RuntimeException('Configure a chave secreta da Stripe antes de abrir o checkout.');
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
    $_SESSION['store_error'] = $e->getMessage();
    header('Location: cart.php');
    exit;
}
