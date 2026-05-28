<?php

return [
    'app' => [
        'name' => 'GAO Joias',
        'base_url' => 'http://localhost/gaoapp',
        'env' => 'local',
        'timezone' => 'America/Sao_Paulo',
        'store_path' => 'loja',
    ],
    'database' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'gaoapp',
        'user' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    'security' => [
        'session_name' => 'gaoapp_admin',
        'cookie_secure' => false,
        'csrf_required' => true,
        'login_max_attempts' => 8,
        'login_decay_minutes' => 15,
    ],
    'stripe' => [
        'secret_key' => '',
        'publishable_key' => '',
        'webhook_secret' => '',
        'currency' => 'brl',
        'success_path' => 'loja/success.php',
        'cancel_path' => 'loja/cancel.php',
    ],
    'store' => [
        'whatsapp_number' => '5519989689260',
    ],
];
