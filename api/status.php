<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

$usuario = usuarioAtual();
$administrador = false;
if ($usuario) {
    $stmt = banco()->prepare('SELECT 1 FROM administradores WHERE usuario_id = ?');
    $stmt->execute([$usuario['id']]);
    $administrador = (bool)$stmt->fetchColumn();
}

responder([
    'usuario' => $usuario,
    'administrador' => $administrador,
    'csrf' => $_SESSION['csrf'],
]);
