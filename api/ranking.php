<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

try {
    // Conta quantas linhas de "reproducoes" cada faixa tem e ordena da mais ouvida para a menos ouvida.
    $stmt = banco()->query('SELECT f.titulo, a.nome AS album, ar.nome AS artista, COUNT(r.id) AS total
        FROM reproducoes r
        INNER JOIN faixas f ON f.id = r.faixa_id
        INNER JOIN albuns a ON a.id = f.album_id
        INNER JOIN artistas ar ON ar.id = a.artista_id
        GROUP BY f.id, f.titulo, a.nome, ar.nome
        ORDER BY total DESC, f.titulo
        LIMIT 100');

    $faixas = [];
    foreach ($stmt->fetchAll() as $linha) {
        $faixas[] = [
            'titulo' => $linha['titulo'],
            'album' => $linha['album'],
            'artista' => $linha['artista'],
            'total' => (int)$linha['total'],
        ];
    }

    responder(['faixas' => $faixas]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível carregar o ranking.'], 500);
}
