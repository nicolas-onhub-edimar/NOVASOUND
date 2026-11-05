<?php
declare(strict_types=1);

require_once __DIR__ . '/conexao.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function responder(array $dados, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function usuarioAtual(): ?array
{
    return isset($_SESSION['usuario']) && is_array($_SESSION['usuario'])
        ? $_SESSION['usuario']
        : null;
}

function exigirUsuario(): array
{
    $usuario = usuarioAtual();
    if (!$usuario) {
        responder(['erro' => 'Entre na sua conta para continuar.'], 401);
    }
    return $usuario;
}

function exigirCsrf(): void
{
    $tokenEnviado = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $tokenSalvo = $_SESSION['csrf'] ?? '';

    if (!$tokenSalvo || !hash_equals($tokenSalvo, $tokenEnviado)) {
        responder(['erro' => 'A sessão expirou. Atualize a página e tente novamente.'], 403);
    }
}

function dadosJson(): array
{
    $dados = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($dados) ? $dados : [];
}
