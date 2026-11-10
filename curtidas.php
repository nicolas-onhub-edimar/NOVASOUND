<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minhas curtidas — NovaSound</title>
    <link rel="stylesheet" href="style.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="redesign.css">
</head>
<body>
<header>
    <a href="index.html" class="logo"><img src="LOGO.png" alt="Logo NovaSound"></a>
    <div class="header-search">
    <button class="header-search-toggle" id="siteSearchToggle" type="button" aria-controls="siteSearchPanel" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>
        <span>Pesquisa</span>
    </button>
    <div class="header-search-panel" id="siteSearchPanel" hidden>
        <label class="visually-hidden" for="siteSearchInput">Pesquisar artistas, músicas e álbuns</label>
        <input id="siteSearchInput" type="search" placeholder="Artista, música ou álbum" autocomplete="off" aria-controls="siteSearchResults">
        <p class="search-results-label" id="siteSearchStatus" aria-live="polite">Digite para pesquisar no catálogo.</p>
        <div class="site-search-results" id="siteSearchResults"></div>
    </div>
</div>
    <nav>
        <a href="index.html">Início</a><a href="artistas.html">Artistas</a>
        <a href="novidades.html">Lançamentos</a>
        <a href="discografia.html">Discografia</a><a href="mais-tocadas.html">Mais tocadas</a>
        
    
        <a href="curtidas.php">Curtidas</a>
        <a href="sobre.html">Sobre</a>
        <a href="contato.html">Contato</a>
    </nav>
    <a class="header-login-button" href="conta.php">Login</a>
</header>
<main class="account-page favorites-page">
    <section class="page-header">
        <p class="releases-kicker">SUA COLEÇÃO PESSOAL</p>
        <h1>Músicas curtidas</h1>
        <p>Uma playlist com as faixas que você guardou.</p>
    </section>
    <p id="favoritesStatus" class="account-status" role="status" aria-live="polite">Carregando suas curtidas...</p>
    <ol class="favorite-track-list" id="favoriteTrackList"></ol>
    <p id="favoritesEmpty" class="empty-state is-hidden">Você ainda não curtiu nenhuma música. Explore a <a href="discografia.html">discografia</a> para começar.</p>
</main>
<div class="player-bar is-hidden" id="playerBar">
    <img id="playerCover" src="" alt="">
    <div class="player-info"><p id="playerTrackTitle"></p><p id="playerTrackArtist"></p></div>
    <button class="player-control-btn" id="previousBtn" aria-label="Faixa anterior">&#9198;</button>
    <button class="play-pause-btn" id="playPauseBtn" type="button" aria-label="Reproduzir">&#9658;</button>
    <button class="player-control-btn" id="nextBtn" aria-label="Próxima faixa">&#9197;</button>
    <button class="player-control-btn queue-toggle" id="queueToggleBtn" type="button" aria-label="Ver fila de reprodução" aria-controls="queuePanel" aria-expanded="false" title="Ver fila">&#9776;</button>
    <div class="player-progress"><span id="currentTime">0:00</span><label class="visually-hidden" for="progressBar">Posição da faixa</label><input type="range" id="progressBar" value="0" min="0" max="100" step="any"><span id="duration">0:00</span></div>
    <label class="visually-hidden" for="volumeBar">Volume</label><input type="range" id="volumeBar" min="0" max="1" step="0.01" value="1">
</div>
<aside class="player-queue-panel" id="queuePanel" aria-label="Fila de reprodução" hidden>
    <div class="queue-panel-heading">
        <div><p>O QUE VEM A SEGUIR</p><h2>Fila de reprodução</h2></div>
        <button class="queue-close-button" id="queueCloseBtn" type="button" aria-label="Fechar fila">&times;</button>
    </div>
    <p class="queue-current-track" id="queueCurrentTrack">Nenhuma faixa tocando.</p>
    <ol class="queue-track-list" id="queueTrackList"></ol>
    <p class="queue-empty-state" id="queueEmptyState">Reproduza uma música curtida para ver as próximas faixas.</p>
</aside>
<footer class="site-footer">
    <div class="site-footer-inner">
        <div class="site-footer-main">
            <a class="footer-brand" href="index.html"><img src="LOGO.png" alt=""><span>NovaSound<small>Música independente, sem filtro.</small></span></a>
            <p class="footer-description">Descubra artistas, álbuns e sons independentes em um só lugar.</p>
            <nav class="footer-links" aria-label="Links do rodapé"><a href="artistas.html">Artistas</a><a href="novidades.html">Lançamentos</a><a href="discografia.html">Discografia</a><a href="sobre.html">Sobre</a><a href="contato.html">Contato</a><a href="curtidas.php">Curtidas</a><a href="conta.php">Login</a></nav>
        </div>
        <div class="site-footer-bottom"><span>&copy; 2026 NovaSound</span><span>Feito para quem vive música.</span></div>
    </div>
</footer>
<script src="player.js"></script>
<script type="module" src="curtidas.js"></script>
<script src="dados.js"></script>
<script type="module" src="pesquisa.js"></script>
<script src="auth-header.js"></script>
<script src="router.js"></script>
</body>
</html>
