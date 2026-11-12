await window.albunsPromise;

const grid = document.getElementById('albumGrid');
const detail = document.getElementById('albumDetail');
const backBtn = document.getElementById('backBtn');
const searchInput = document.getElementById('searchInput');
const searchLabel = document.querySelector('label[for="searchInput"]');
const emptyState = document.getElementById('emptyState');
const detailCover = document.getElementById('detailCover');
const parametrosDiscografia = new URLSearchParams(window.location.search);
const albumQuery = parametrosDiscografia.get('artista') || '';
const nomeAlbumSolicitado = parametrosDiscografia.get('album') || '';
const nomeFaixaSolicitada = parametrosDiscografia.get('faixa') || '';
searchInput.value = albumQuery;
let cancelarAnimacaoDaCapa = null;


function renderTracklist(album) {
    const list = document.getElementById('detailTracklist');
    list.innerHTML = '';

    album.faixas.forEach((faixa) => {
        const item = document.createElement('li');
        item.className = 'track-item';
        item.innerHTML = `
            <button class="track-select" type="button">
                <span class="track-number">${faixa.numero}</span>
                <span class="track-title">${faixa.titulo}</span>
            </button>
        `;

        item.querySelector('.track-select').addEventListener('click', () => playTrack(faixa, album));

        if (window.adicionarBotaoCurtida) {
            window.adicionarBotaoCurtida(item, faixa, album);
        }

        list.appendChild(item);
    });
}

function animarCapa(origem, retanguloOrigem) {
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!origem || movimentoReduzido) {
        detail.classList.add('album-revealed');
        return;
    }

    detail.classList.remove('album-revealed');
    detailCover.classList.add('album-cover-arriving');

    const inicio = retanguloOrigem || origem.getBoundingClientRect();
    const capaVoadora = origem.cloneNode();
    capaVoadora.classList.add('album-cover-flight');
    Object.assign(capaVoadora.style, {
        top: `${inicio.top}px`,
        left: `${inicio.left}px`,
        width: `${inicio.width}px`,
        height: `${inicio.height}px`,
    });
    document.body.appendChild(capaVoadora);

    const destino = detailCover.getBoundingClientRect();
    let finalizada = false;
    let temporizador;
    let quadroAgendado;

    const limpar = (revelarDetalhes) => {
        if (finalizada) return;
        finalizada = true;
        if (quadroAgendado !== undefined) cancelAnimationFrame(quadroAgendado);
        clearTimeout(temporizador);
        capaVoadora.remove();
        detailCover.classList.remove('album-cover-arriving');
        if (revelarDetalhes) detail.classList.add('album-revealed');
        cancelarAnimacaoDaCapa = null;
    };

    cancelarAnimacaoDaCapa = () => limpar(false);
    capaVoadora.addEventListener('transitionend', (evento) => {
        if (evento.propertyName === 'top') limpar(true);
    });

    quadroAgendado = requestAnimationFrame(() => {
        capaVoadora.style.top = `${destino.top}px`;
        capaVoadora.style.left = `${destino.left}px`;
        capaVoadora.style.width = `${destino.width}px`;
        capaVoadora.style.height = `${destino.height}px`;
        temporizador = setTimeout(() => limpar(true), 650);
    });
}

// Guarda onde a página estava rolada, para voltar ao mesmo ponto quando a pessoa fechar o álbum.
let posicaoDaRolagem = 0;

function showAlbum(album, capaOrigem) {
    // Mede a capa clicada ANTES de esconder a grade, para a animação sair do lugar certo.
    const retanguloOrigem = capaOrigem ? capaOrigem.getBoundingClientRect() : null;
    posicaoDaRolagem = window.scrollY;

    cancelarAnimacaoDaCapa?.();
    detail.classList.remove('album-revealed');
    detailCover.src = album.capa;
    detailCover.alt = `Capa do álbum ${album.nome}`;
    document.getElementById('detailName').textContent = album.nome;
    document.getElementById('detailArtist').textContent = album.artista;
    document.getElementById('detailYear').textContent = album.ano;

    renderTracklist(album);

    grid.classList.add('is-hidden');
    detail.classList.remove('is-hidden');
    searchInput.classList.add('is-hidden');
    searchLabel.classList.add('is-hidden');
    emptyState.classList.add('is-hidden');

    // A tela do álbum começa no topo da página.
    window.scrollTo({ top: 0, behavior: 'instant' });

    animarCapa(capaOrigem, retanguloOrigem);
}

function showGrid() {
    cancelarAnimacaoDaCapa?.();
    detail.classList.add('is-hidden');
    detail.classList.remove('album-revealed');
    grid.classList.remove('is-hidden');
    searchInput.classList.remove('is-hidden');
    searchLabel.classList.remove('is-hidden');
    window.scrollTo({ top: posicaoDaRolagem, behavior: 'instant' });
}



function renderAlbums(lista) {
    grid.innerHTML = '';
    emptyState.classList.toggle('is-hidden', lista.length > 0);

    const albunsPorGenero = new Map();

    lista.forEach((album) => {
        const generosDoAlbum = album.generos?.length ? album.generos : ['Outros'];

        generosDoAlbum.forEach((genero) => {
            if (!albunsPorGenero.has(genero)) {
                albunsPorGenero.set(genero, []);
            }

            albunsPorGenero.get(genero).push(album);
        });
    });

    const gruposOrdenados = [...albunsPorGenero.entries()].sort(([generoA], [generoB]) =>
        generoA.localeCompare(generoB, 'pt-BR')
    );

    gruposOrdenados.forEach(([genero, albunsDoGenero]) => {
        const secao = document.createElement('section');
        secao.className = 'genre-section';

        const titulo = document.createElement('h2');
        titulo.className = 'genre-title';
        titulo.textContent = genero;
        titulo.id = `genre-${genero.toLocaleLowerCase('pt-BR').replaceAll(' ', '-')}`;
        secao.setAttribute('aria-labelledby', titulo.id);

        const grade = document.createElement('div');
        grade.className = 'album-grid';

        albunsDoGenero.forEach((album) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'album-card';

            card.innerHTML = `
                <img src="${album.capa}" alt="Capa do álbum ${album.nome}, de ${album.artista}">
                <h3>${album.nome}</h3>
                <p class="album-artist">${album.artista}</p>
                <p class="album-year">${album.ano}</p>
            `;

            card.addEventListener('click', () => showAlbum(album, card.querySelector('img')));
            grade.appendChild(card);
        });

        secao.append(titulo, grade);
        grid.appendChild(secao);
    });
}

searchInput.addEventListener('input', () => {
    const pesquisa = searchInput.value.trim().toLocaleLowerCase('pt-BR');

    const resultado = window.albuns.filter((album) => {
        return album.nome.toLocaleLowerCase('pt-BR').includes(pesquisa) ||
            album.artista.toLocaleLowerCase('pt-BR').includes(pesquisa)
    });

    renderAlbums(resultado);
})




renderAlbums(window.albuns.filter((album) =>
    album.artista.toLocaleLowerCase('pt-BR').includes(albumQuery.trim().toLocaleLowerCase('pt-BR'))
));

backBtn.addEventListener('click', showGrid);

if (nomeAlbumSolicitado) {
    const albumSolicitado = window.albuns.find((album) =>
        album.nome.toLocaleLowerCase('pt-BR') === nomeAlbumSolicitado.toLocaleLowerCase('pt-BR') &&
        (!albumQuery || album.artista.toLocaleLowerCase('pt-BR') === albumQuery.toLocaleLowerCase('pt-BR'))
    );

    if (albumSolicitado) {
        showAlbum(albumSolicitado);
        if (nomeFaixaSolicitada) {
            const faixaSolicitada = [...document.querySelectorAll('.track-item')].find((item) =>
                item.querySelector('.track-title')?.textContent.toLocaleLowerCase('pt-BR') === nomeFaixaSolicitada.toLocaleLowerCase('pt-BR')
            );
            faixaSolicitada?.classList.add('search-match-track');
            faixaSolicitada?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
