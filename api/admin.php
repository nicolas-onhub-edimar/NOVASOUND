<?php
declare(strict_types=1);
require_once __DIR__ . '/comum.php';

function exigirAdministrador(): array
{
    $usuario = exigirUsuario();
    $stmt = banco()->prepare('SELECT 1 FROM administradores WHERE usuario_id = ?');
    $stmt->execute([$usuario['id']]);
    if (!$stmt->fetchColumn()) {
        responder(['erro' => 'Esta área é exclusiva para administradores.'], 403);
    }
    return $usuario;
}

function textoPost(string $chave, int $limite): string
{
    $valor = trim((string)($_POST[$chave] ?? ''));
    if ($valor === '' || mb_strlen($valor) > $limite) {
        throw new InvalidArgumentException('Preencha os campos obrigatórios dentro do limite indicado.');
    }
    return $valor;
}

function salvarArquivo(string $campo, string $pastaRelativa, array $extensoes, int $limiteBytes): ?string
{
    if (!isset($_FILES[$campo]) || $_FILES[$campo]['error'] === UPLOAD_ERR_NO_FILE) return null;
    $arquivo = $_FILES[$campo];
    if ($arquivo['error'] !== UPLOAD_ERR_OK || $arquivo['size'] > $limiteBytes) {
        throw new InvalidArgumentException('O arquivo não foi enviado corretamente ou excede o tamanho permitido.');
    }

    $extensao = strtolower(pathinfo((string)$arquivo['name'], PATHINFO_EXTENSION));
    if (!in_array($extensao, $extensoes, true) || !is_uploaded_file($arquivo['tmp_name'])) {
        throw new InvalidArgumentException('Formato de arquivo não permitido.');
    }

    $pasta = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $pastaRelativa);
    if (!is_dir($pasta) && !mkdir($pasta, 0775, true) && !is_dir($pasta)) {
        throw new RuntimeException('Não foi possível criar a pasta de arquivos do catálogo.');
    }

    $nome = bin2hex(random_bytes(12)) . '.' . $extensao;
    if (!move_uploaded_file($arquivo['tmp_name'], $pasta . DIRECTORY_SEPARATOR . $nome)) {
        throw new RuntimeException('Não foi possível salvar o arquivo enviado.');
    }
    return $pastaRelativa . '/' . $nome;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    exigirAdministrador();
    $pdo = banco();
    responder([
        'artistas' => $pdo->query('SELECT id, nome FROM artistas ORDER BY nome')->fetchAll(),
        'albuns' => $pdo->query('SELECT a.id, a.nome, ar.nome AS artista FROM albuns a JOIN artistas ar ON ar.id = a.artista_id ORDER BY ar.nome, a.ano DESC, a.nome')->fetchAll(),
        'generos' => $pdo->query('SELECT id, nome FROM generos ORDER BY nome')->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(['erro' => 'Método não permitido.'], 405);
exigirAdministrador();
exigirCsrf();

try {
    $pdo = banco();
    $acao = (string)($_POST['acao'] ?? '');

    if ($acao === 'artista') {
        $nome = textoPost('nome', 150);
        $stmt = $pdo->prepare('INSERT INTO artistas (nome) VALUES (?)');
        $stmt->execute([$nome]);
        responder(['mensagem' => 'Artista cadastrado.', 'id' => (int)$pdo->lastInsertId()]);
    }

    if ($acao === 'album') {
        $artistaId = filter_var($_POST['artista_id'] ?? null, FILTER_VALIDATE_INT);
        $nome = textoPost('nome', 200);
        $anoTexto = trim((string)($_POST['ano'] ?? ''));
        $ano = $anoTexto === '' ? null : filter_var($anoTexto, FILTER_VALIDATE_INT);
        if (!$artistaId || ($anoTexto !== '' && (!$ano || $ano < 1900 || $ano > 2100))) {
            throw new InvalidArgumentException('Escolha um artista e informe um ano válido.');
        }

        $capaUrl = trim((string)($_POST['capa_url'] ?? ''));
        if ($capaUrl !== '' && !filter_var($capaUrl, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('O link da capa precisa ser uma URL válida.');
        }

        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO albuns (artista_id, nome, ano, capa) VALUES (?, ?, ?, ?)');
        $stmt->execute([$artistaId, $nome, $ano, $capaUrl !== '' ? $capaUrl : null]);
        $albumId = (int)$pdo->lastInsertId();

        $capaArquivo = salvarArquivo('capa', 'capas/catalogo', ['jpg', 'jpeg', 'png', 'webp'], 10 * 1024 * 1024);
        if ($capaArquivo) {
            $pdo->prepare('UPDATE albuns SET capa = ? WHERE id = ?')->execute([$capaArquivo, $albumId]);
        }

        $generoId = filter_var($_POST['genero_id'] ?? null, FILTER_VALIDATE_INT);
        $novoGenero = trim((string)($_POST['novo_genero'] ?? ''));
        if ($novoGenero !== '') {
            if (mb_strlen($novoGenero) > 80) throw new InvalidArgumentException('O nome do gênero deve ter até 80 caracteres.');
            $pdo->prepare('INSERT INTO generos (nome) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)')->execute([$novoGenero]);
            $generoId = (int)$pdo->lastInsertId();
        }
        if ($generoId) {
            $pdo->prepare('INSERT INTO album_generos (album_id, genero_id) VALUES (?, ?)')->execute([$albumId, $generoId]);
        }
        $pdo->commit();
        responder(['mensagem' => 'Álbum cadastrado.', 'id' => $albumId]);
    }

    if ($acao === 'faixa') {
        $albumId = filter_var($_POST['album_id'] ?? null, FILTER_VALIDATE_INT);
        $numero = filter_var($_POST['numero'] ?? null, FILTER_VALIDATE_INT);
        $titulo = textoPost('titulo', 200);
        if (!$albumId || !$numero || $numero > 9999) {
            throw new InvalidArgumentException('Escolha um álbum e informe o número da faixa.');
        }
        $arquivo = salvarArquivo('audio', 'audio/catalogo/' . (int)$albumId, ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac'], 200 * 1024 * 1024);
        if (!$arquivo) throw new InvalidArgumentException('Escolha o arquivo de áudio da faixa.');

        $stmt = $pdo->prepare('INSERT INTO faixas (album_id, numero, titulo, arquivo) VALUES (?, ?, ?, ?)');
        $stmt->execute([$albumId, $numero, $titulo, $arquivo]);
        responder(['mensagem' => 'Faixa cadastrada.']);
    }

    responder(['erro' => 'Ação desconhecida.'], 400);
} catch (InvalidArgumentException $erro) {
    if (banco()->inTransaction()) banco()->rollBack();
    responder(['erro' => $erro->getMessage()], 422);
} catch (PDOException $erro) {
    if (banco()->inTransaction()) banco()->rollBack();
    error_log($erro->getMessage());
    responder(['erro' => 'Esse nome ou número já existe nesse artista ou álbum. Confira os dados e tente novamente.'], 409);
} catch (Throwable $erro) {
    if (banco()->inTransaction()) banco()->rollBack();
    error_log($erro->getMessage());
    responder(['erro' => 'Não foi possível salvar. Confira as permissões das pastas e se o MySQL está ligado.'], 500);
}
