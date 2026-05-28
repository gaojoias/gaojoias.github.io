<?php

declare(strict_types=1);

function app_load_env_file(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (str_starts_with($line, 'export ')) {
            $line = trim(substr($line, 7));
        }
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if ($key === '' || preg_match('/^[A-Z0-9_]+$/', $key) !== 1) {
            continue;
        }
        if (
            (str_starts_with($value, '"') && str_ends_with($value, '"'))
            || (str_starts_with($value, "'") && str_ends_with($value, "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
        putenv($key . '=' . $value);
    }
}

function app_env(string $key): ?string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
    return $value === false || $value === null ? null : (string)$value;
}

function app_env_bool(string $key): ?bool
{
    $value = app_env($key);
    if ($value === null || $value === '') {
        return null;
    }

    $parsed = filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);
    return $parsed ?? (bool)$value;
}

function app_set_config_value(array &$config, array $path, mixed $value): void
{
    $target = &$config;
    foreach ($path as $part) {
        if (!isset($target[$part]) || !is_array($target[$part])) {
            $target[$part] = [];
        }
        $target = &$target[$part];
    }
    $target = $value;
}

function app_apply_env_config(array $config): array
{
    $stringMap = [
        'APP_NAME' => ['app', 'name'],
        'APP_BASE_URL' => ['app', 'base_url'],
        'APP_ENV' => ['app', 'env'],
        'APP_TIMEZONE' => ['app', 'timezone'],
        'APP_STORE_PATH' => ['app', 'store_path'],
        'DB_HOST' => ['database', 'host'],
        'DB_NAME' => ['database', 'name'],
        'DB_USER' => ['database', 'user'],
        'DB_PASS' => ['database', 'password'],
        'DB_CHARSET' => ['database', 'charset'],
        'APP_SESSION_NAME' => ['security', 'session_name'],
        'STRIPE_SECRET_KEY' => ['stripe', 'secret_key'],
        'STRIPE_PUBLISHABLE_KEY' => ['stripe', 'publishable_key'],
        'STRIPE_WEBHOOK_SECRET' => ['stripe', 'webhook_secret'],
        'STRIPE_CURRENCY' => ['stripe', 'currency'],
        'STRIPE_SUCCESS_PATH' => ['stripe', 'success_path'],
        'STRIPE_CANCEL_PATH' => ['stripe', 'cancel_path'],
        'STORE_WHATSAPP_NUMBER' => ['store', 'whatsapp_number'],
    ];
    foreach ($stringMap as $envKey => $path) {
        $value = app_env($envKey);
        if ($value !== null && $value !== '') {
            app_set_config_value($config, $path, $value);
        }
    }

    $intMap = [
        'DB_PORT' => ['database', 'port'],
        'LOGIN_MAX_ATTEMPTS' => ['security', 'login_max_attempts'],
        'LOGIN_DECAY_MINUTES' => ['security', 'login_decay_minutes'],
    ];
    foreach ($intMap as $envKey => $path) {
        $value = app_env($envKey);
        if ($value !== null && $value !== '') {
            app_set_config_value($config, $path, (int)$value);
        }
    }

    $boolMap = [
        'COOKIE_SECURE' => ['security', 'cookie_secure'],
        'CSRF_REQUIRED' => ['security', 'csrf_required'],
    ];
    foreach ($boolMap as $envKey => $path) {
        $value = app_env_bool($envKey);
        if ($value !== null) {
            app_set_config_value($config, $path, $value);
        }
    }

    return $config;
}

$configPath = __DIR__ . '/../config/config.php';
$exampleConfigPath = __DIR__ . '/../config/config.example.php';
app_load_env_file(__DIR__ . '/../.env');
$config = file_exists($configPath) ? require $configPath : require $exampleConfigPath;
$config = app_apply_env_config($config);

date_default_timezone_set($config['app']['timezone'] ?? 'America/Sao_Paulo');

$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['SERVER_PORT'] ?? '') === '443');

session_name($config['security']['session_name'] ?? 'gaoapp_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => (bool)($config['security']['cookie_secure'] ?? $isSecure),
    'httponly' => true,
    'samesite' => 'Lax',
]);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

function app_config(?string $key = null, mixed $default = null): mixed
{
    global $config;
    if ($key === null) {
        return $config;
    }
    $value = $config;
    foreach (explode('.', $key) as $part) {
        if (!is_array($value) || !array_key_exists($part, $value)) {
            return $default;
        }
        $value = $value[$part];
    }
    return $value;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db = app_config('database');
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'],
        $db['port'],
        $db['name'],
        $db['charset']
    );

    $pdo = new PDO($dsn, $db['user'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function e(string|int|float|null $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['ok' => false, 'error' => 'JSON invalido.'], 400);
    }
    return $data;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function require_csrf(): void
{
    if (!(bool)app_config('security.csrf_required', true)) {
        return;
    }
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? '');
    if (!hash_equals($_SESSION['csrf_token'] ?? '', (string)$token)) {
        json_response(['ok' => false, 'error' => 'Sessao expirada. Recarregue a pagina.'], 419);
    }
}

function is_api_request(): bool
{
    $uri = (string)($_SERVER['REQUEST_URI'] ?? '');
    return str_contains($uri, '/api/') || str_ends_with($uri, '/api/index.php');
}

function current_admin(): ?array
{
    if (empty($_SESSION['admin_user_id'])) {
        return null;
    }

    $stmt = db()->prepare('SELECT id, name, email, role, is_active FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$_SESSION['admin_user_id']]);
    $user = $stmt->fetch();

    if (!$user || (int)$user['is_active'] !== 1) {
        unset($_SESSION['admin_user_id']);
        return null;
    }

    return $user;
}

function require_admin(): array
{
    $user = current_admin();
    if (!$user) {
        if (is_api_request()) {
            json_response(['ok' => false, 'error' => 'Nao autenticado.'], 401);
        }
        header('Location: ' . absolute_url('index.html'));
        exit;
    }
    return $user;
}

function require_admin_role(array $roles = ['admin']): array
{
    $user = require_admin();
    if (!in_array($user['role'], $roles, true)) {
        json_response(['ok' => false, 'error' => 'Acesso restrito.'], 403);
    }
    return $user;
}

function role_label(string $role): string
{
    return match ($role) {
        'admin' => 'Administrador',
        'manager' => 'Gerente',
        'operator' => 'Operador',
        default => 'Usuario',
    };
}

function app_user_payload(array $user): array
{
    return [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'perfil' => role_label((string)$user['role']),
    ];
}

function slugify(string $value): string
{
    $value = iconv('UTF-8', 'ASCII//TRANSLIT', $value);
    $value = strtolower((string)$value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : bin2hex(random_bytes(4));
}

function money_to_cents(mixed $value): int
{
    if ($value === null || $value === '') {
        return 0;
    }
    $normalized = str_replace(',', '.', (string)$value);
    return (int)round(((float)$normalized) * 100);
}

function cents_to_decimal(int|string|null $value): float
{
    return round(((int)$value) / 100, 2);
}

function cents_to_money(int|string|null $value): string
{
    return number_format(((int)$value) / 100, 2, ',', '.');
}

function absolute_url(string $path): string
{
    return rtrim((string)app_config('app.base_url'), '/') . '/' . ltrim($path, '/');
}

function to_mysql_datetime(mixed $value = null): string
{
    if ($value === null || $value === '') {
        return date('Y-m-d H:i:s');
    }

    try {
        return (new DateTimeImmutable((string)$value))->format('Y-m-d H:i:s');
    } catch (Throwable) {
        return date('Y-m-d H:i:s');
    }
}

function to_mysql_date(mixed $value = null): ?string
{
    if ($value === null || $value === '') {
        return null;
    }

    try {
        return (new DateTimeImmutable((string)$value))->format('Y-m-d');
    } catch (Throwable) {
        return null;
    }
}

function app_json_encode(mixed $value): string
{
    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: 'null';
}
