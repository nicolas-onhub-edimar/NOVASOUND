await window.albunsPromise;

const botaoAbrirPesquisa = document.getElementById('siteSearchToggle');
const painelPesquisa = document.getElementById('siteSearchPanel');
const campoPesquisa = document.getElementById('siteSearchInput');
const listaResultadosPesquisa = document.getElementById('siteSearchResults');
const statusPesquisa = document.getElementById('siteSearchStatus');
const controladorPesquisa = new AbortController();

function normalizarBusca(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

function criarResultadoPesquisa(tipo, titulo, detalhe, parametros) {
    const link = document.createElement('a');
    link.className = 'site-search-result';
    link.href = `discografia.html?${new URLSearchParams(parametros).toString()}`;

    const texto = document.createElement('span');
    texto.className = 'site-search-result-copy';
    const nome = document.createElement('strong');
    nome.textContent = titulo;
    const complemento = document.createElement('small');
    complemento.textContent = detalhe;
    texto.append(nome, complemento);

    const categoria = document.createElement('span');
    categoria.className = 'site-search-result-type';
    categoria.textContent = tipo;
    link.append(texto, categoria);
    return link;
}

function pesquisarNoCatalogo() {
    const consulta = normalizarBusca(campoPesquisa.value);
    listaResultadosPesquisa.replaceChildren();

    if (!consulta) {
        statusPesquisa.textContent = 'Digite para pesquisar no catálogo.';
        return;
    }

    const albuns = window.albuns || [];
    const artistas = [...new Set(albuns.map((album) => album.artista))]
        .filter((artista) => normalizarBusca(artista).includes(consulta));
    const resultados = [];

    artistas.forEach((artista) => resultados.push(
        criarResultadoPesquisa('Artista', artista, 'Ver discografia do artista', { artista })
    ));

    albuns.filter((album) => normalizarBusca(album.nome).includes(consulta))
        .forEach((album) => resultados.push(
            criarResultadoPesquisa('Álbum', album.nome, `${album.artista} · ${album.ano}`, {
                artista: album.artista,
                album: album.nome,
            })
        ));

    albuns.forEach((album) => {
        album.faixas.forEach((faixa) => {
            if (normalizarBusca(faixa.titulo).includes(consulta)) {
                resultados.push(criarResultadoPesquisa('Faixa', faixa.titulo, `${album.artista} · ${album.nome}`, {
                    artista: album.artista,
                    album: album.nome,
                    faixa: faixa.titulo,
                }));
            }
        });
    });

    const limite = 12;
    resultados.slice(0, limite).forEach((resultado) => listaResultadosPesquisa.appendChild(resultado));

    if (resultados.length === 0) {
        statusPesquisa.textContent = 'Nenhum artista, álbum ou faixa encontrado.';
    } else if (resultados.length > limite) {
        statusPesquisa.textContent = `Mostrando ${limite} de ${resultados.length} resultados.`;
    } else {
        statusPesquisa.textContent = `${resultados.length} resultado(s).`;
    }
}

function fecharPesquisa() {
    painelPesquisa.hidden = true;
    botaoAbrirPesquisa.setAttribute('aria-expanded', 'false');
}

botaoAbrirPesquisa.addEventListener('click', () => {
    painelPesquisa.hidden = !painelPesquisa.hidden;
    botaoAbrirPesquisa.setAttribute('aria-expanded', String(!painelPesquisa.hidden));
    if (!painelPesquisa.hidden) campoPesquisa.focus();
});

campoPesquisa.addEventListener('input', pesquisarNoCatalogo);
campoPesquisa.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharPesquisa();
    if (evento.key === 'Enter') listaResultadosPesquisa.querySelector('a')?.click();
});

document.addEventListener('click', (evento) => {
    if (!painelPesquisa.hidden && !evento.target.closest('.header-search')) fecharPesquisa();
}, { signal: controladorPesquisa.signal });

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !painelPesquisa.hidden) fecharPesquisa();
}, { signal: controladorPesquisa.signal });

window.addEventListener('novasound:before-navigate', () => controladorPesquisa.abort(), { once: true });
