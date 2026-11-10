<?php
declare(strict_types=1);

require_once __DIR__ . '/comum.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$usuario = exigirUsuario();
exigirCsrf();

$dados = dadosJson();
$faixaId = filter_var(
    $dados['faixa_id'] ?? null,
    FILTER_VALIDATE_INT
);

if (!$faixaId || $faixaId < 1) {
    responder(['erro' => 'ID da faixa inválido.'], 422);
}

try {
    $pdo = banco();

    $verificar = $pdo->prepare(
        'SELECT id FROM faixas WHERE id = ?'
    );
    $verificar->execute([$faixaId]);

    if (!$verificar->fetch()) {
        responder(['erro' => 'Faixa não encontrada.'], 404);
    }

    $inserir = $pdo->prepare(
        'INSERT INTO reproducoes (usuario_id, faixa_id)
         VALUES (?, ?)'
    );

    $inserir->execute([
        (int) $usuario['id'],
        $faixaId
    ]);

    responder(['mensagem' => 'Reprodução registrada.']);

} catch (Throwable $erro) {
    error_log('Erro ao registrar reprodução: ' . $erro->getMessage());
    responder(['erro' => 'Não foi possível registrar a reprodução.'], 500);
}