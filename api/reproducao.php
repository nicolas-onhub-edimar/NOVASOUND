<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$usuario = exigirUsuario();
exigirCsrf();
$dados = dadosJson();
$titulo = trim((string)($dados['titulo'] ?? ''));
$artista = trim((string)($dados['artista'] ?? ''));
$album = trim((string)($dados['album'] ?? ''));

if ($titulo === '' || $artista === '' || $album === '') {
    responder(['erro' => 'Não foi possível identificar esta faixa no catálogo.'], 422);
}

try {
    $pdo = banco();

    // 1) Descobre qual faixa do banco corresponde ao título + álbum + artista recebidos.
    $stmt = $pdo->prepare('SELECT f.id
        FROM faixas f
        INNER JOIN albuns a ON a.id = f.album_id
        INNER JOIN artistas ar ON ar.id = a.artista_id
        WHERE f.titulo = ? AND a.nome = ? AND ar.nome = ?');
    $stmt->execute([$titulo, $album, $artista]);
    $faixaId = $stmt->fetchColumn();

    if (!$faixaId) {
        responder(['erro' => 'Esta faixa não foi encontrada no catálogo.'], 404);
    }

    // 2) Proteção simples: a mesma pessoa não conta a mesma faixa duas vezes em menos de 30 segundos.
    $stmt = $pdo->prepare('SELECT 1 FROM reproducoes
        WHERE usuario_id = ? AND faixa_id = ? AND reproduzida_em > (NOW() - INTERVAL 30 SECOND)');
    $stmt->execute([$usuario['id'], $faixaId]);
    if ($stmt->fetchColumn()) {
        responder(['registrada' => false, 'mensagem' => 'Reprodução recente já contabilizada.']);
    }

    // 3) Guarda a reprodução. A data entra sozinha (DEFAULT current_timestamp()).
    $stmt = $pdo->prepare('INSERT INTO reproducoes (usuario_id, faixa_id) VALUES (?, ?)');
    $stmt->execute([$usuario['id'], $faixaId]);

    responder(['registrada' => true]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível registrar a reprodução.'], 500);
}
