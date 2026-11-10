await window.albunsPromise;

const listaMaisTocadas = document.getElementById('mostPlayedList');
const filtrosMaisTocadas = document.getElementById('trackFilters');
const vazioMaisTocadas = document.getElementById('mostPlayedEmpty');

// O ranking vem do banco: api/ranking.php devolve as faixas com o total de reproduções.
// Depois juntamos cada item com o catálogo (window.albuns) para ter capa, gêneros etc.
let ranking = [];
let erroNoRanking = false;

try {
    const resposta = await fetch('api/ranking.php');
    if (!resposta.ok) throw new Error('O servidor não conseguiu carregar o ranking.');
    ranking = (await resposta.json()).faixas;
} catch (erro) {
    console.error('Erro ao carregar o ranking:', erro);
    erroNoRanking = true;
}

const faixasEmDestaque = ranking
    .map((item) => {
        const album = window.albuns.find((a) => a.artista === item.artista && a.nome === item.album);
        const faixa = album?.faixas.find((f) => f.titulo === item.titulo);
        return album && faixa ? { album, faixa, total: item.total } : null;
    })
    .filter(Boolean);

const generosFaixas = [...new Set(
    faixasEmDestaque.flatMap(({ album }) => album.generos || [])
)].sort((generoA, generoB) => generoA.localeCompare(generoB, 'pt-BR'));

let generoSelecionado = 'Todos';

function criarFiltro(genero) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'most-played-filter';
    botao.textContent = genero;
    botao.setAttribute('aria-pressed', String(genero === generoSelecionado));
    botao.addEventListener('click', () => {
        generoSelecionado = genero;
        renderizarFiltros();
        renderizarFaixas();
    });
    return botao;
}

function renderizarFiltros() {
    filtrosMaisTocadas.replaceChildren(
        ...['Todos', ...generosFaixas].map(criarFiltro)
    );
}

function criarLinhaDaFaixa(item, posicao) {
    const { album, faixa } = item;
    const linha = document.createElement('li');
    linha.className = 'most-played-row';

    const numero = document.createElement('span');
    numero.className = 'most-played-number';
    numero.textContent = String(posicao).padStart(2, '0');
    numero.setAttribute('aria-label', `Posição ${posicao} da seleção`);

    const capa = document.createElement('img');
    capa.className = 'most-played-cover';
    capa.src = album.capa;
    capa.alt = '';
    capa.loading = 'lazy';

    const informacoes = document.createElement('div');
    informacoes.className = 'most-played-track-info';

    const titulo = document.createElement('h3');
    titulo.textContent = faixa.titulo;

    const artistaAlbum = document.createElement('p');

    const linkArtista = document.createElement('a');
    linkArtista.className = 'most-played-meta-link';
    linkArtista.href = `discografia.html?${new URLSearchParams({ artista: album.artista })}`;
    linkArtista.textContent = album.artista;

    const linkNomeAlbum = document.createElement('a');
    linkNomeAlbum.className = 'most-played-meta-link';
    linkNomeAlbum.href = `discografia.html?${new URLSearchParams({ artista: album.artista, album: album.nome })}`;
    linkNomeAlbum.textContent = album.nome;

    const contagem = document.createElement('span');
    contagem.className = 'most-played-count';
    contagem.textContent = `${item.total} ${item.total === 1 ? 'reprodução' : 'reproduções'}`;

    artistaAlbum.append(linkArtista, ' · ', linkNomeAlbum, ' · ', contagem);
    informacoes.append(titulo, artistaAlbum);

    const generos = document.createElement('span');
    generos.className = 'most-played-genre';
    generos.textContent = (album.generos || []).join(' · ');

    const linkAlbum = document.createElement('a');
    linkAlbum.className = 'most-played-album-link';
    linkAlbum.href = `discografia.html?${new URLSearchParams({ artista: album.artista })}`;
    linkAlbum.textContent = 'Ver álbum';
    linkAlbum.setAttribute('aria-label', `Ver os álbuns de ${album.artista} na discografia`);

    linha.append(numero, capa, informacoes, generos, linkAlbum);
    return linha;
}

function renderizarFaixas() {
    const faixasFiltradas = generoSelecionado === 'Todos'
        ? faixasEmDestaque
        : faixasEmDestaque.filter(({ album }) => (album.generos || []).includes(generoSelecionado));

    listaMaisTocadas.replaceChildren(
        ...faixasFiltradas.map((item, indice) => criarLinhaDaFaixa(item, indice + 1))
    );
    if (erroNoRanking) {
        vazioMaisTocadas.textContent = 'Não foi possível carregar o ranking. Confira se o Apache e o MySQL estão ligados.';
    } else if (faixasEmDestaque.length === 0) {
        vazioMaisTocadas.textContent = 'Ainda não há reproduções registradas. Entre na sua conta e ouça uma faixa por 30 segundos para começar o ranking.';
    } else {
        vazioMaisTocadas.textContent = 'Ainda não há faixas ouvidas neste gênero.';
    }
    vazioMaisTocadas.classList.toggle('is-hidden', faixasFiltradas.length > 0);
}

renderizarFiltros();
renderizarFaixas();
