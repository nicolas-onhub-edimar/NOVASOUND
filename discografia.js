const grid = document.getElementById('albumGrid');

albuns.forEach((album) => {
    const card = document.createElement('div');
    card.className = 'album-card';

    card.innerHTML = `
    <img src="${album.capa}" alt="Capa do álbum ${album.nome}, de ${album.artista}">
    <h3>${album.nome}</h3>
    <p class="album-artist">${album.artista}</p>
    <p class="album-year">${album.ano}</p>
    `;

    grid.appendChild(card);
});