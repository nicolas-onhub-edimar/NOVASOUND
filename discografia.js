const grid = document.getElementById('albumGrid');
const detail = document.getElementById('albumDetail');
const backBtn = document.getElementById('backBtn');

function renderTracklist(faixas) {
    const list = document.getElementById('detailTracklist');
    list.innerHTML = '';

    faixas.forEach((faixa) => {
        const item = document.createElement('li');
        item.className = 'track-item';
        item.innerHTML = `
        <span class="track-number">${faixa.numero}</span>
        <span class="track-title">${faixa.titulo}</span>
        `;
        list.appendChild(item);
    });
}

function showAlbum(album) {
    document.getElementById('detailCover').src = album.capa;
    document.getElementById('detailCover').alt = `Capa do álbum ${album.nome}`;
    document.getElementById('detailName').textContent = album.nome;
    document.getElementById('detailArtist').textContent = album.artista;
    document.getElementById('detailYear').textContent = album.ano;

    renderTracklist(album.faixas);

    grid.classList.add('is-hidden');
    detail.classList.remove('is-hidden');
}

function showGrid() {
    detail.classList.add('is-hidden');
    grid.classList.remove('is-hidden');
}

albuns.forEach((album) => {
    const card = document.createElement('div');
    card.className = 'album-card';

    card.innerHTML = `
    <img src="${album.capa}" alt="Capa do álbum ${album.nome}, de ${album.artista}">
    <h3>${album.nome}</h3>
    <p class="album-artist">${album.artista}</p>
    <p class="album-year">${album.ano}</p>
    `;

    card.addEventListener('click', () => showAlbum(album));

    grid.appendChild(card);
});

backBtn.addEventListener('click', showGrid);