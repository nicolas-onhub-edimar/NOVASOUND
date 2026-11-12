<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

exigirCsrf();
$dados = dadosJson();

// Campo-armadilha: pessoas não veem este campo, mas robôs costumam preenchê-lo.
if (trim((string)($dados['site'] ?? '')) !== '') {
    responder(['mensagem' => 'Mensagem recebida.']);
}

$assuntosPermitidos = ['artista', 'catalogo', 'bug', 'sugestao', 'outro'];
$assunto = (string)($dados['assunto'] ?? '');
$nome = trim((string)($dados['nome'] ?? ''));
$email = mb_strtolower(trim((string)($dados['email'] ?? '')));
$mensagem = trim((string)($dados['mensagem'] ?? ''));

if (!in_array($assunto, $assuntosPermitidos, true)) {
    responder(['erro' => 'Escolha o assunto da sua mensagem.'], 422);
}
if ($nome === '' || mb_strlen($nome) > 100) {
    responder(['erro' => 'Informe seu nome com até 100 caracteres.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    responder(['erro' => 'Informe um e-mail válido.'], 422);
}
if (mb_strlen($mensagem) < 10 || mb_strlen($mensagem) > 2000) {
    responder(['erro' => 'A mensagem precisa ter entre 10 e 2000 caracteres.'], 422);
}

// Limite simples: no máximo 3 mensagens por hora para a mesma sessão.
$agora = time();
$envios = array_filter($_SESSION['contato_envios'] ?? [], fn($momento) => $momento > $agora - 3600);
if (count($envios) >= 3) {
    responder(['erro' => 'Você já enviou algumas mensagens agora. Tente de novo mais tarde.'], 429);
}

try {
    $usuario = usuarioAtual();
    $stmt = banco()->prepare('INSERT INTO mensagens (usuario_id, nome, email, assunto, mensagem) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$usuario['id'] ?? null, $nome, $email, $assunto, $mensagem]);

    $envios[] = $agora;
    $_SESSION['contato_envios'] = array_values($envios);
    responder(['mensagem' => 'Mensagem recebida.']);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível salvar sua mensagem. Confira se o MySQL está ligado e se a tabela mensagens foi criada.'], 500);
}
