const statusAdmin = document.getElementById('adminStatus');
const conteudoAdmin = document.getElementById('adminContent');
let tokenCsrf = '';

function preencherOpcoes(seletor, itens, textoVazio) {
    seletor.replaceChildren();
    const opcaoInicial = document.createElement('option');
    opcaoInicial.value = '';
    opcaoInicial.textContent = textoVazio;
    seletor.appendChild(opcaoInicial);

    itens.forEach((item) => {
        const opcao = document.createElement('option');
        opcao.value = item.id;
        opcao.textContent = item.artista ? `${item.artista} — ${item.nome}` : item.nome;
        seletor.appendChild(opcao);
    });
}

async function carregarCatalogoAdmin() {
    const respostaStatus = await fetch('api/status.php');
    const statusSessao = await respostaStatus.json();
    tokenCsrf = statusSessao.csrf || '';

    if (!statusSessao.usuario) {
        statusAdmin.textContent = 'Entre na sua conta para acessar a administração.';
        const link = document.createElement('a');
        link.href = 'conta.php';
        link.textContent = ' Ir para o login';
        statusAdmin.appendChild(link);
        return;
    }

    const resposta = await fetch('api/admin.php');
    const dados = await resposta.json();
    if (!resposta.ok) {
        statusAdmin.textContent = dados.erro || 'Você não tem acesso de administrador.';
        return;
    }

    preencherOpcoes(document.getElementById('albumArtist'), dados.artistas, 'Selecione um artista');
    preencherOpcoes(document.getElementById('albumGenre'), dados.generos, 'Sem gênero');
    preencherOpcoes(document.getElementById('trackAlbum'), dados.albuns, 'Selecione um álbum');
    conteudoAdmin.hidden = false;
    statusAdmin.textContent = 'Acesso autorizado. Os novos itens serão adicionados ao catálogo.';
}

async function enviarFormulario(formulario, acao) {
    const dados = new FormData(formulario);
    dados.set('acao', acao);
    const resposta = await fetch('api/admin.php', {
        method: 'POST',
        headers: { 'X-CSRF-Token': tokenCsrf },
        body: dados,
    });
    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível salvar os dados.');
    formulario.reset();
    await carregarCatalogoAdmin();
    statusAdmin.textContent = resultado.mensagem;
}

[
    ['artistForm', 'artista'],
    ['albumForm', 'album'],
    ['trackForm', 'faixa'],
].forEach(([id, acao]) => {
    document.getElementById(id).addEventListener('submit', async (evento) => {
        evento.preventDefault();
        statusAdmin.textContent = 'Salvando…';
        try {
            await enviarFormulario(evento.currentTarget, acao);
        } catch (erro) {
            statusAdmin.textContent = erro.message;
        }
    });
});

carregarCatalogoAdmin().catch((erro) => {
    console.error('Administração NovaSound:', erro);
    statusAdmin.textContent = 'Não foi possível carregar. Confirme se Apache e MySQL estão ativos.';
});
