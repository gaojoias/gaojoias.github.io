<?php

declare(strict_types=1);

require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/admin_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Metodo nao permitido.'], 405);
}

$input = json_input();
$action = (string)($input['action'] ?? '');
$payload = is_array($input['payload'] ?? null) ? $input['payload'] : [];

try {
    if ($action === 'me') {
        $user = current_admin();
        json_response([
            'ok' => true,
            'data' => [
                'authenticated' => (bool)$user,
                'user' => $user ? app_user_payload($user) : null,
                'csrfToken' => csrf_token(),
                'storeUrl' => absolute_url((string)app_config('app.store_path', 'loja') . '/'),
            ],
        ]);
    }

    if ($action === 'login') {
        $identifier = trim((string)($payload['user'] ?? $payload['email'] ?? ''));
        $password = (string)($payload['senha'] ?? $payload['password'] ?? '');

        $maxAttempts = (int)app_config('security.login_max_attempts', 8);
        $decaySeconds = (int)app_config('security.login_decay_minutes', 15) * 60;
        $bucket = $_SESSION['login_attempts'] ?? ['count' => 0, 'first' => time()];
        if ((time() - (int)$bucket['first']) > $decaySeconds) {
            $bucket = ['count' => 0, 'first' => time()];
        }
        if ((int)$bucket['count'] >= $maxAttempts) {
            json_response(['ok' => false, 'error' => 'Muitas tentativas. Aguarde alguns minutos.'], 429);
        }

        $stmt = db()->prepare('SELECT * FROM admin_users WHERE (email = ? OR name = ?) AND is_active = 1 LIMIT 1');
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, (string)$user['password_hash'])) {
            $bucket['count'] = (int)$bucket['count'] + 1;
            $_SESSION['login_attempts'] = $bucket;
            json_response(['ok' => false, 'error' => 'Credenciais invalidas.'], 401);
        }

        unset($_SESSION['login_attempts']);
        session_regenerate_id(true);
        $_SESSION['admin_user_id'] = (int)$user['id'];
        csrf_token();

        db()->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([(int)$user['id']]);
        $ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 190);
        $ip = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);
        $log = db()->prepare(
            'INSERT INTO access_logs (admin_user_id, user_name, role_label, system_info, browser, ip_address)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $log->execute([(int)$user['id'], $user['name'], role_label((string)$user['role']), PHP_OS_FAMILY, $ua, $ip]);

        json_response([
            'ok' => true,
            'data' => [
                'user' => app_user_payload($user),
                'csrfToken' => csrf_token(),
            ],
        ]);
    }

    if ($action === 'logout') {
        require_csrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        json_response(['ok' => true, 'data' => true]);
    }

    $user = require_admin();
    require_csrf();
    $data = admin_handle_action($action, $payload, $user);
    json_response(['ok' => true, 'data' => $data]);
} catch (PDOException $e) {
    $message = app_config('app.env') === 'local' ? $e->getMessage() : 'Erro de banco de dados.';
    json_response(['ok' => false, 'error' => $message], 500);
} catch (Throwable $e) {
    $message = app_config('app.env') === 'local' ? $e->getMessage() : 'Erro interno.';
    json_response(['ok' => false, 'error' => $message], 500);
}
