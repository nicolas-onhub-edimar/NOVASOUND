const statusConta = document.getElementById('accountStatus');
const formulariosConta = document.getElementById('accountForms');
const painelLogado = document.getElementById('accountLoggedIn');
const formularioLogin = document.getElementById('loginForm');
const formularioCadastro = document.getElementById('registerForm');
let csrfConta = '';

async function atualizarContaSemRecarregar() {
    if (window.novaNavegar) {
        const atualizada = await window.novaNavegar(window.location.href, false);
        if (atualizada) return;
    }
    window.location.reload();
}

function mostrarFormulario(tipo) {
    const mostrarCadastro = tipo === 'cadastro';
    formularioLogin.classList.toggle('is-hidden', mostrarCadastro);
    formularioCadastro.classList.toggle('is-hidden', !mostrarCadastro);
    statusConta.textContent = '';
}

async function carregarEstadoConta() {
    try {
        const resposta = await fetch('api/status.php');
        const dados = await resposta.json();
        csrfConta = dados.csrf;
        if (dados.usuario) {
            formulariosConta.classList.add('is-hidden');
            painelLogado.classList.remove('is-hidden');
            document.getElementById('accountUserName').textContent = dados.usuario.nome;
            document.getElementById('adminLink').classList.toggle('is-hidden', !dados.administrador);
        }
    } catch (erro) {
        statusConta.textContent = 'Abra o site pelo XAMPP (http://localhost/...) para usar contas e curtidas.';
    }
}

async function enviarAcaoConta(acao, formulario) {
    const dadosFormulario = new FormData(formulario);
    const corpo = Object.fromEntries(dadosFormulario.entries());
    corpo.acao = acao;
    const resposta = await fetch('api/conta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfConta },
        body: JSON.stringify(corpo),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível entrar.');
    return dados;
}

formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    try {
        await enviarAcaoConta('login', evento.currentTarget);
        await atualizarContaSemRecarregar();
    } catch (erro) { statusConta.textContent = erro.message; }
});

formularioCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    try {
        await enviarAcaoConta('cadastro', evento.currentTarget);
        await atualizarContaSemRecarregar();
    } catch (erro) { statusConta.textContent = erro.message; }
});

document.getElementById('showRegisterButton').addEventListener('click', () => mostrarFormulario('cadastro'));
document.getElementById('showLoginButton').addEventListener('click', () => mostrarFormulario('login'));

document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const resposta = await fetch('api/conta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfConta },
            body: JSON.stringify({ acao: 'sair' }),
        });
        if (!resposta.ok) throw new Error('Não foi possível sair da conta.');
        await atualizarContaSemRecarregar();
    } catch (erro) { statusConta.textContent = erro.message; }
});

carregarEstadoConta();
