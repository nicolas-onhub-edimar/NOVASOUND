let sessaoCurtidas = { usuario: null, csrf: '', chaves: new Set() };

function chaveDaFaixa(titulo, artista, album) {
    return JSON.stringify([String(artista), String(album), String(titulo)]);
}

async function carregarSessaoCurtidas() {
    try {
        const resposta = await fetch('api/status.php');
        if (!resposta.ok) throw new Error('Não foi possível consultar a sessão.');
        sessaoCurtidas = await resposta.json();
        sessaoCurtidas.chaves = new Set();

        if (sessaoCurtidas.usuario) {
            const respostaCurtidas = await fetch('api/curtidas.php');
            if (!respostaCurtidas.ok) throw new Error('Não foi possível consultar as músicas curtidas.');
            const dadosCurtidas = await respostaCurtidas.json();
            sessaoCurtidas.chaves = new Set(dadosCurtidas.musicas.map((musica) =>
                chaveDaFaixa(musica.titulo, musica.artista, musica.album)
            ));
        }
    } catch (erro) {
        console.warn('Não foi possível carregar as curtidas salvas.', erro);
    }
}

const sessaoCurtidasPronta = carregarSessaoCurtidas();

async function adicionarBotaoCurtida(item, faixa, album) {
    await sessaoCurtidasPronta;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'like-track-button';
    const chave = chaveDaFaixa(faixa.titulo, album.artista, album.nome);
    const jaCurtiu = sessaoCurtidas.chaves.has(chave);
    botao.setAttribute('aria-label', `${jaCurtiu ? 'Remover curtida de' : 'Curtir'} ${faixa.titulo}`);
    botao.setAttribute('aria-pressed', String(jaCurtiu));
    botao.innerHTML = jaCurtiu ? '&#9829;' : '&#9825;';
    botao.classList.toggle('is-liked', jaCurtiu);
    botao.addEventListener('click', async (evento) => {
        evento.stopPropagation();
        if (!sessaoCurtidas.usuario) {
            window.location.href = 'conta.php';
            return;
        }
        botao.disabled = true;
        try {
            const resposta = await fetch('api/curtida.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': sessaoCurtidas.csrf },
                body: JSON.stringify({
                    titulo: faixa.titulo,
                    artista: album.artista,
                    album: album.nome,
                    ano: album.ano,
                    capa: album.capa,
                    arquivo: faixa.arquivo,
                }),
            });
            const dados = await resposta.json();
            if (resposta.status === 401) {
                window.location.href = 'conta.php';
                return;
            }
            if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível salvar a curtida.');
            botao.innerHTML = dados.curtida ? '&#9829;' : '&#9825;';
            botao.classList.toggle('is-liked', dados.curtida);
            botao.setAttribute('aria-pressed', String(dados.curtida));
            botao.setAttribute('aria-label', `${dados.curtida ? 'Remover curtida de' : 'Curtir'} ${faixa.titulo}`);
            if (dados.curtida) sessaoCurtidas.chaves.add(chave);
            else sessaoCurtidas.chaves.delete(chave);
            botao.title = dados.mensagem;
        } catch (erro) {
            alert(erro.message);
        } finally {
            botao.disabled = false;
        }
    });
    item.appendChild(botao);
}

window.adicionarBotaoCurtida = adicionarBotaoCurtida;
