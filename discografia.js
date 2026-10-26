const grid = document.getElementById('albumGrid');
const detail = document.getElementById('albumDetail');
const backBtn = document.getElementById('backBtn');
const searchInput = document.getElementById('searchInput');
const searchLabel = document.querySelector('label[for="searchInput"]');
const emptyState = document.getElementById('emptyState');
const detailCover = document.getElementById('detailCover');
const albumQuery = new URLSearchParams(window.location.search).get('artista') || '';
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

        list.appendChild(item);
    });
}

function animarCapa(origem) {
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!origem || movimentoReduzido) {
        detail.classList.add('album-revealed');
        return;
    }

    detail.classList.remove('album-revealed');
    detailCover.classList.add('album-cover-arriving');

    const inicio = origem.getBoundingClientRect();
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

function showAlbum(album, capaOrigem) {
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

    animarCapa(capaOrigem);
}

function showGrid() {
    cancelarAnimacaoDaCapa?.();
    detail.classList.add('is-hidden');
    detail.classList.remove('album-revealed');
    grid.classList.remove('is-hidden');
    searchInput.classList.remove('is-hidden');
    searchLabel.classList.remove('is-hidden');
}



function renderAlbums(lista) {
    grid.innerHTML = '';
    emptyState.classList.toggle('is-hidden', lista.length > 0);

    lista.forEach((album) => {
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
        grid.appendChild(card);
    });
}

searchInput.addEventListener('input', () => {
    const pesquisa = searchInput.value.trim().toLocaleLowerCase('pt-BR');

    const resultado = albuns.filter((album) => {
        return album.nome.toLocaleLowerCase('pt-BR').includes(pesquisa) ||
            album.artista.toLocaleLowerCase('pt-BR').includes(pesquisa)
    });

    renderAlbums(resultado);
})




renderAlbums(albuns.filter((album) =>
    album.artista.toLocaleLowerCase('pt-BR').includes(albumQuery.trim().toLocaleLowerCase('pt-BR'))
));

backBtn.addEventListener('click', showGrid);
