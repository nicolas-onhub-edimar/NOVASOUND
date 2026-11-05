<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sua conta — NovaSound</title>
    <link rel="stylesheet" href="style.css">
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
    <a class="header-login-button" href="conta.php" aria-current="page">Login</a>
</header>
<main class="account-page">
    <section class="page-header">
        <p class="releases-kicker">SUA EXPERIÊNCIA, DO SEU JEITO</p>
        <h1>Entre na NovaSound.</h1>
        <p>Entre para curtir músicas e guardar suas descobertas.</p>
    </section>
    <p id="accountStatus" class="account-status" role="status" aria-live="polite"></p>
    <div class="account-panels" id="accountForms">
        <form class="account-form" id="loginForm">
            <h2>Entrar na NovaSound</h2>
            <label for="loginEmail">E-mail</label><input id="loginEmail" name="email" type="email" autocomplete="email" required>
            <label for="loginPassword">Senha</label><input id="loginPassword" name="senha" type="password" autocomplete="current-password" required>
            <button class="btn-primary" type="submit">Entrar</button>
            <button class="account-switch-button" id="showRegisterButton" type="button">Ainda não tem uma conta?</button>
        </form>
        <form class="account-form is-hidden" id="registerForm">
            <h2>Criar uma conta</h2>
            <label for="registerName">Nome</label><input id="registerName" name="nome" type="text" maxlength="100" autocomplete="name" required>
            <label for="registerEmail">E-mail</label><input id="registerEmail" name="email" type="email" autocomplete="email" required>
            <label for="registerPassword">Senha (mínimo de 8 caracteres)</label><input id="registerPassword" name="senha" type="password" minlength="8" autocomplete="new-password" required>
            <button class="btn-primary" type="submit">Criar conta</button>
            <button class="account-switch-button" id="showLoginButton" type="button">Já tenho uma conta. Entrar</button>
        </form>
    </div>
    <section class="account-logged-in is-hidden" id="accountLoggedIn">
        <h2>Olá, <span id="accountUserName"></span>!</h2>
        <p>Sua conta está pronta para guardar suas descobertas musicais.</p>
        <div class="hero-actions"><a class="btn-primary" href="curtidas.php">Abrir minhas curtidas</a><a class="btn-secondary is-hidden" id="adminLink" href="admin.php">Administração do catálogo</a><button class="btn-secondary" type="button" id="logoutButton">Sair da conta</button></div>
    </section>
</main>
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
<script type="module" src="conta.js"></script>
<script src="dados.js"></script>
<script type="module" src="pesquisa.js"></script>
<script src="auth-header.js"></script>
<script src="router.js"></script>
</body>
</html>
