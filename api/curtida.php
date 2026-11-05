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

    $stmt = $pdo->prepare('SELECT 1 FROM curtidas_faixas WHERE usuario_id = ? AND faixa_id = ?');
    $stmt->execute([$usuario['id'], $faixaId]);
    $jaCurtiu = (bool)$stmt->fetchColumn();

    if ($jaCurtiu) {
        $stmt = $pdo->prepare('DELETE FROM curtidas_faixas WHERE usuario_id = ? AND faixa_id = ?');
        $stmt->execute([$usuario['id'], $faixaId]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO curtidas_faixas (usuario_id, faixa_id) VALUES (?, ?)');
        $stmt->execute([$usuario['id'], $faixaId]);
    }

    responder(['curtida' => !$jaCurtiu, 'mensagem' => $jaCurtiu ? 'Curtida removida.' : 'Música adicionada às curtidas.']);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível salvar a curtida no banco de dados.'], 500);
}
