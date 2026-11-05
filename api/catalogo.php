<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

try {
    $pdo = banco();
    $stmt = $pdo->query('SELECT a.id, a.nome, a.ano, a.capa, ar.nome AS artista, g.nome AS genero
        FROM albuns a
        INNER JOIN artistas ar ON ar.id = a.artista_id
        LEFT JOIN album_generos ag ON ag.album_id = a.id
        LEFT JOIN generos g ON g.id = ag.genero_id
        ORDER BY a.ano DESC, a.nome, g.nome');

    $albuns = [];
    foreach ($stmt->fetchAll() as $linha) {
        $id = (int)$linha['id'];
        if (!isset($albuns[$id])) {
            $albuns[$id] = [
                'nome' => $linha['nome'],
                'artista' => $linha['artista'],
                'ano' => (int)$linha['ano'],
                'generos' => [],
                'capa' => $linha['capa'],
                'faixas' => [],
            ];
        }
        if ($linha['genero'] !== null) $albuns[$id]['generos'][] = $linha['genero'];
    }

    $stmt = $pdo->query('SELECT f.album_id, f.numero, f.titulo, f.arquivo
        FROM faixas f
        INNER JOIN albuns a ON a.id = f.album_id
        ORDER BY a.ano DESC, a.nome, f.numero');
    foreach ($stmt->fetchAll() as $faixa) {
        $albumId = (int)$faixa['album_id'];
        if (!isset($albuns[$albumId])) continue;
        $albuns[$albumId]['faixas'][] = [
            'numero' => (int)$faixa['numero'],
            'titulo' => $faixa['titulo'],
            'arquivo' => $faixa['arquivo'],
        ];
    }

    responder(['albuns' => array_values($albuns)]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível carregar o catálogo do banco de dados.'], 500);
}
