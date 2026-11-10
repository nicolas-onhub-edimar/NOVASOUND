<?php
declare(strict_types=1);

require_once __DIR__ . '/comum.php';

try {
    $pdo = banco();

    $consulta = $pdo->query("
        SELECT
            f.id AS faixa_id,
            f.numero,
            f.titulo AS faixa_titulo,
            f.arquivo,
            a.id AS album_id,
            a.nome AS album_nome,
            a.ano,
            a.capa,
            ar.nome AS artista,
            COUNT(r.id) AS reproducoes,
            GROUP_CONCAT(
                DISTINCT g.nome
                ORDER BY g.nome
                SEPARATOR '||'
            ) AS generos
        FROM reproducoes r
        INNER JOIN faixas f ON f.id = r.faixa_id
        INNER JOIN albuns a ON a.id = f.album_id
        INNER JOIN artistas ar ON ar.id = a.artista_id
        LEFT JOIN album_generos ag ON ag.album_id = a.id
        LEFT JOIN generos g ON g.id = ag.genero_id
        GROUP BY
            f.id,
            f.numero,
            f.titulo,
            f.arquivo,
            a.id,
            a.nome,
            a.ano,
            a.capa,
            ar.nome
        ORDER BY reproducoes DESC, f.titulo ASC
    ");

    $faixas = $consulta->fetchAll(PDO::FETCH_ASSOC);

    $resultado = [];

    foreach ($faixas as $faixa) {
        $resultado[] = [
            'faixa' => [
                'id' => (int) $faixa['faixa_id'],
                'numero' => (int) $faixa['numero'],
                'titulo' => $faixa['faixa_titulo'],
                'arquivo' => $faixa['arquivo'],
            ],
            'album' => [
                'id' => (int) $faixa['album_id'],
                'nome' => $faixa['album_nome'],
                'ano' => (int) $faixa['ano'],
                'capa' => $faixa['capa'],
                'artista' => $faixa['artista'],
                'generos' => $faixa['generos']
                    ? explode('||', $faixa['generos'])
                    : [],
            ],
            'reproducoes' => (int) $faixa['reproducoes'],
        ];
    }

    responder($resultado);

} catch (Throwable $erro) {
    error_log('Erro ao consultar mais tocadas: ' . $erro->getMessage());
    responder(['erro' => 'Não foi possível carregar as mais tocadas.'], 500);
}