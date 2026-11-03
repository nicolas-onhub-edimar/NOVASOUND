const listaMaisTocadas = document.getElementById('mostPlayedList');
const filtrosMaisTocadas = document.getElementById('trackFilters');
const vazioMaisTocadas = document.getElementById('mostPlayedEmpty');

// Enquanto não existe contagem de reproduções, usamos uma seleção editorial:
// álbuns mais recentes primeiro e faixas na ordem em que aparecem no álbum.
const faixasEmDestaque = albuns
    .slice()
    .sort((albumA, albumB) => albumB.ano - albumA.ano)
    .flatMap((album) => album.faixas.map((faixa) => ({ album, faixa })));

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
    artistaAlbum.textContent = `${album.artista} · ${album.nome}`;
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
    vazioMaisTocadas.classList.toggle('is-hidden', faixasFiltradas.length > 0);
}

renderizarFiltros();
renderizarFaixas();
