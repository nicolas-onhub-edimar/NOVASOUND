<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';
$usuario = exigirUsuario();

try {
    $stmt = banco()->prepare('SELECT f.titulo, ar.nome AS artista, a.nome AS album, a.ano, a.capa, f.arquivo
        FROM curtidas_faixas cf
        INNER JOIN faixas f ON f.id = cf.faixa_id
        INNER JOIN albuns a ON a.id = f.album_id
        INNER JOIN artistas ar ON ar.id = a.artista_id
        WHERE cf.usuario_id = ?
        ORDER BY cf.criada_em DESC');
    $stmt->execute([$usuario['id']]);
    responder(['musicas' => $stmt->fetchAll()]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível carregar suas músicas curtidas.'], 500);
}
