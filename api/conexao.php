<?php
declare(strict_types=1);

function banco(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = '127.0.0.1';
    $nomeBanco = 'novasound';
    $usuarioBanco = 'root';
    $senhaBanco = '';
    $dsn = "mysql:host={$host};dbname={$nomeBanco};charset=utf8mb4";

    $pdo = new PDO($dsn, $usuarioBanco, $senhaBanco, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
