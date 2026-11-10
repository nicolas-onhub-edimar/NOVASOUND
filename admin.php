<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administração do catálogo — NovaSound</title>
    <link rel="stylesheet" href="style.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="redesign.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
<header>
    <a href="index.html" class="logo"><img src="LOGO.png" alt="Logo NovaSound"></a>
    <div class="header-search"><a class="header-search-toggle" href="discografia.html">← Voltar ao catálogo</a></div>
    <nav aria-label="Navegação principal"><a href="index.html">Início</a><a href="artistas.html">Artistas</a><a href="novidades.html">Lançamentos</a><a href="discografia.html">Discografia</a><a href="mais-tocadas.html">Mais tocadas</a><a href="sobre.html">Sobre</a><a href="contato.html">Contato</a></nav>
    <a class="header-login-button" href="conta.php">Minha conta</a>
</header>
<main class="account-page admin-page">
    <section class="page-header">
        <p class="releases-kicker">FERRAMENTAS DO CATÁLOGO</p>
        <h1>Administração</h1>
        <p>Cadastre artistas, álbuns, gêneros e faixas no catálogo da NovaSound.</p>
    </section>

    <p class="admin-status" id="adminStatus" role="status" aria-live="polite">Verificando seu acesso…</p>

    <div id="adminContent" class="admin-content" hidden>
        <form class="account-form admin-form" id="artistForm">
            <h2>Novo artista</h2>
            <label for="artistName">Nome do artista</label>
            <input id="artistName" name="nome" type="text" maxlength="150" required>
            <button class="btn-primary" type="submit">Cadastrar artista</button>
        </form>

        <form class="account-form admin-form" id="albumForm">
            <h2>Novo álbum</h2>
            <label for="albumArtist">Artista</label>
            <select id="albumArtist" name="artista_id" required></select>
            <label for="albumName">Nome do álbum</label>
            <input id="albumName" name="nome" type="text" maxlength="200" required>
            <label for="albumYear">Ano</label>
            <input id="albumYear" name="ano" type="number" min="1900" max="2100" placeholder="Ex.: 2026">
            <label for="albumGenre">Gênero existente (opcional)</label>
            <select id="albumGenre" name="genero_id"></select>
            <label for="newGenre">Ou crie um gênero</label>
            <input id="newGenre" name="novo_genero" type="text" maxlength="80" placeholder="Ex.: Indie pop">
            <label for="albumCover">Arquivo da capa (JPG, PNG ou WebP)</label>
            <input id="albumCover" name="capa" type="file" accept="image/jpeg,image/png,image/webp">
            <label for="albumCoverUrl">Ou link da capa</label>
            <input id="albumCoverUrl" name="capa_url" type="url" placeholder="https://...">
            <button class="btn-primary" type="submit">Cadastrar álbum</button>
        </form>

        <form class="account-form admin-form" id="trackForm">
            <h2>Nova faixa</h2>
            <label for="trackAlbum">Álbum</label>
            <select id="trackAlbum" name="album_id" required></select>
            <label for="trackNumber">Número da faixa</label>
            <input id="trackNumber" name="numero" type="number" min="1" max="9999" required>
            <label for="trackTitle">Título</label>
            <input id="trackTitle" name="titulo" type="text" maxlength="200" required>
            <label for="trackAudio">Arquivo de áudio (MP3, FLAC, WAV, OGG, M4A ou AAC)</label>
            <input id="trackAudio" name="audio" type="file" accept="audio/*,.flac,.m4a,.aac" required>
            <small>Os arquivos são armazenados na pasta de áudio do projeto. Limite por faixa: 200 MB.</small>
            <button class="btn-primary" type="submit">Cadastrar faixa</button>
        </form>
    </div>
    <p class="admin-help">Se esta for sua primeira vez, siga o passo de ativação do administrador no arquivo COMO-INICIAR-PHP.md.</p>
</main>
<footer class="site-footer">
    <div class="site-footer-inner"><div class="site-footer-main">
        <a class="footer-brand" href="index.html"><img src="LOGO.png" alt=""><span>NovaSound<small>Música independente, sem filtro.</small></span></a>
        <p class="footer-description">Descubra artistas, álbuns e sons independentes em um só lugar.</p>
        <nav class="footer-links" aria-label="Links do rodapé"><a href="artistas.html">Artistas</a><a href="novidades.html">Lançamentos</a><a href="discografia.html">Discografia</a><a href="sobre.html">Sobre</a><a href="contato.html">Contato</a><a href="curtidas.php">Curtidas</a></nav>
    </div><div class="site-footer-bottom"><span>&copy; 2026 NovaSound</span><span>Feito para quem vive música.</span></div></div>
</footer>
<script type="module" src="admin.js"></script>
<script src="auth-header.js"></script>
<script src="router.js"></script>
</body>
</html>
