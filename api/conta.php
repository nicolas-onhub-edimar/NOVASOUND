<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

exigirCsrf();
$dados = dadosJson();
$acao = $dados['acao'] ?? '';

try {
    if ($acao === 'cadastro') {
        $nome = trim((string)($dados['nome'] ?? ''));
        $email = mb_strtolower(trim((string)($dados['email'] ?? '')));
        $senha = (string)($dados['senha'] ?? '');

        if ($nome === '' || mb_strlen($nome) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            responder(['erro' => 'Confira seu nome e seu e-mail.'], 422);
        }
        if (strlen($senha) < 8) {
            responder(['erro' => 'A senha precisa ter pelo menos 8 caracteres.'], 422);
        }

        $stmt = banco()->prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)');
        try {
            $stmt->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
        } catch (PDOException $erro) {
            if ($erro->getCode() === '23000') {
                responder(['erro' => 'Este e-mail já tem uma conta. Entre ou use outro e-mail.'], 409);
            }
            throw $erro;
        }

        session_regenerate_id(true);
        $_SESSION['usuario'] = ['id' => (int)banco()->lastInsertId(), 'nome' => $nome, 'email' => $email];
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        responder(['mensagem' => 'Conta criada. Bem-vindo à NovaSound!', 'usuario' => $_SESSION['usuario']]);
    }

    if ($acao === 'login') {
        $email = mb_strtolower(trim((string)($dados['email'] ?? '')));
        $senha = (string)($dados['senha'] ?? '');
        $stmt = banco()->prepare('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if (!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
            responder(['erro' => 'E-mail ou senha incorretos.'], 401);
        }

        session_regenerate_id(true);
        $_SESSION['usuario'] = ['id' => (int)$usuario['id'], 'nome' => $usuario['nome'], 'email' => $usuario['email']];
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        responder(['mensagem' => 'Login realizado.', 'usuario' => $_SESSION['usuario']]);
    }

    if ($acao === 'sair') {
        $_SESSION = [];
        session_destroy();
        responder(['mensagem' => 'Você saiu da sua conta.']);
    }

    responder(['erro' => 'Ação desconhecida.'], 400);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível concluir a operação. Confira se o MySQL está ligado e se o banco foi criado.'], 500);
}
