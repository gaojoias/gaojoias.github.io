<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';
require __DIR__ . '/../app/store_lib.php';

$payload = file_get_contents('php://input') ?: '';
$signature = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
$secret = (string)app_config('stripe.webhook_secret', '');

if (!store_verify_stripe_signature($payload, $signature, $secret)) {
    json_response(['ok' => false, 'error' => 'Assinatura Stripe invalida.'], 400);
}

$event = json_decode($payload, true);
if (!is_array($event)) {
    json_response(['ok' => false, 'error' => 'Payload invalido.'], 400);
}

try {
    store_process_stripe_event($event);
    json_response(['ok' => true, 'data' => true]);
} catch (Throwable $e) {
    $message = app_config('app.env') === 'local' ? $e->getMessage() : 'Erro ao processar webhook.';
    json_response(['ok' => false, 'error' => $message], 500);
}
