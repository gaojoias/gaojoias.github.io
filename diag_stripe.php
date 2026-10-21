<?php
declare(strict_types=1);

// One-off diagnostic: which Stripe account (if any) the store is configured with.
// Prints only key type + last 4 characters, never full keys. Removed right after running.
if (!hash_equals('9a84ae87c6c30a53d9d063dc6922044506980f01', (string)($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit('Forbidden');
}

require __DIR__ . '/app/bootstrap.php';
require __DIR__ . '/app/store_lib.php';

header('Content-Type: application/json; charset=utf-8');
$mask = static function ($value): string {
    $value = (string)$value;
    if ($value === '') {
        return '(vazio)';
    }
    preg_match('/^(sk|pk|rk|whsec)_(live|test)?_?/', $value, $m);
    return ($m[0] ?? 'formato-desconhecido ') . '…' . substr($value, -4);
};
$count = static function (string $sql): ?int {
    try {
        return (int)db()->query($sql)->fetchColumn();
    } catch (Throwable) {
        return null;
    }
};

$account = null;
$accountError = null;
if ((string)app_config('stripe.secret_key', '') !== '') {
    try {
        $a = store_stripe_request('GET', 'account');
        $account = [
            'id' => $a['id'] ?? null,
            'name' => $a['business_profile']['name'] ?? ($a['settings']['dashboard']['display_name'] ?? null),
            'email' => $a['email'] ?? null,
            'country' => $a['country'] ?? null,
            'charges_enabled' => $a['charges_enabled'] ?? null,
            'details_submitted' => $a['details_submitted'] ?? null,
        ];
    } catch (Throwable $e) {
        $accountError = $e->getMessage();
    }
}

echo json_encode([
    'config_files' => [
        'public_html/config/config.php' => is_file(__DIR__ . '/config/config.php'),
        '../gaoapp_config.php' => is_file(__DIR__ . '/../gaoapp_config.php'),
        'public_html/.env' => is_file(__DIR__ . '/.env'),
    ],
    'stripe' => [
        'secret_key' => $mask(app_config('stripe.secret_key', '')),
        'publishable_key' => $mask(app_config('stripe.publishable_key', '')),
        'webhook_secret' => $mask(app_config('stripe.webhook_secret', '')),
        'currency' => app_config('stripe.currency', ''),
    ],
    'account' => $account,
    'account_error' => $accountError,
    'history' => [
        'orders_total' => $count('SELECT COUNT(*) FROM orders'),
        'orders_with_stripe_session' => $count("SELECT COUNT(*) FROM orders WHERE stripe_session_id IS NOT NULL AND stripe_session_id <> ''"),
        'orders_paid' => $count("SELECT COUNT(*) FROM orders WHERE payment_status = 'paid'"),
        'stripe_events' => $count('SELECT COUNT(*) FROM stripe_events'),
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
