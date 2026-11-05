window.atualizarCabecalhoConta = async function () {
    const botaoContaCabecalho = document.querySelector('.header-login-button');
    if (!botaoContaCabecalho) return;

    try {
        const resposta = await fetch('api/status.php');
        if (!resposta.ok) return;
        const sessao = await resposta.json();
        botaoContaCabecalho.textContent = sessao.usuario ? 'Minha conta' : 'Login';
    } catch (erro) {
        botaoContaCabecalho.textContent = 'Login';
    }
};

window.atualizarCabecalhoConta();
