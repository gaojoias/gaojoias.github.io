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
        $name     = trim((string)($payload['user'] ?? $payload['email'] ?? ''));
        $password = (string)($payload['senha'] ?? $payload['password'] ?? '');

        if ($name === '' || $password === '') {
            json_response(['ok' => false, 'error' => 'Preencha todos os campos.'], 400);
        }

        // Rate limiting
        $maxAttempts  = (int)app_config('security.login_max_attempts', 8);
        $decaySeconds = (int)app_config('security.login_decay_minutes', 15) * 60;
        $bucket = $_SESSION['login_attempts'] ?? ['count' => 0, 'first' => time()];
        if ((time() - (int)$bucket['first']) > $decaySeconds) {
            $bucket = ['count' => 0, 'first' => time()];
        }
        if ((int)$bucket['count'] >= $maxAttempts) {
            json_response(['ok' => false, 'error' => 'Muitas tentativas. Aguarde alguns minutos.'], 429);
        }

        // Determine role from fixed passwords stored in config
        $adminPwd    = (string)app_config('auth.admin_password', '');
        $operatorPwd = (string)app_config('auth.operator_password', '');

        if ($adminPwd !== '' && $password === $adminPwd) {
            $role = 'admin';
        } elseif ($operatorPwd !== '' && $password === $operatorPwd) {
            $role = 'operator';
        } else {
            $bucket['count'] = (int)$bucket['count'] + 1;
            $_SESSION['login_attempts'] = $bucket;
            json_response(['ok' => false, 'error' => 'Credenciais invalidas.'], 401);
        }

        // Fetch or create the system user for FK references (created_by)
        $email = $role === 'admin' ? 'admin@gao.local' : 'operador@gao.local';
        $pdo   = db();
        $stmt  = $pdo->prepare('SELECT id FROM admin_users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $systemUser = $stmt->fetch();
        if ($systemUser) {
            $systemUserId = (int)$systemUser['id'];
        } else {
            $pdo->prepare(
                'INSERT INTO admin_users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)'
            )->execute([
                $role === 'admin' ? 'Administrador' : 'Operador',
                $email,
                password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT),
                $role,
            ]);
            $systemUserId = (int)$pdo->lastInsertId();
        }

        // Establish session
        unset($_SESSION['login_attempts']);
        session_regenerate_id(true);
        $_SESSION['admin_authenticated']  = true;
        $_SESSION['admin_user_id']        = $systemUserId;
        $_SESSION['admin_display_name']   = $name;
        $_SESSION['admin_session_role']   = $role;
        $_SESSION['admin_last_activity']  = time();
        csrf_token();

        // Record access log
        $ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 190);
        $ip = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);
        $pdo->prepare(
            'INSERT INTO access_logs (admin_user_id, user_name, role_label, system_info, browser, ip_address)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([$systemUserId, $name, role_label($role), PHP_OS_FAMILY, $ua, $ip]);

        $user = [
            'id'        => $systemUserId,
            'name'      => $name,
            'email'     => '',
            'role'      => $role,
            'is_active' => 1,
        ];

        json_response([
            'ok' => true,
            'data' => [
                'user'      => app_user_payload($user),
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
