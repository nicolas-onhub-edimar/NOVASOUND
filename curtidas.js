const listaCurtidas = document.getElementById('favoriteTrackList');
const statusCurtidas = document.getElementById('favoritesStatus');
const mensagemVazia = document.getElementById('favoritesEmpty');

async function carregarCurtidas() {
    try {
        const resposta = await fetch('api/curtidas.php');
        const dados = await resposta.json();
        if (resposta.status === 401) {
            statusCurtidas.innerHTML = 'Entre na sua conta para ver suas músicas curtidas: <a href="conta.php">fazer login</a>.';
            return;
        }
        if (!resposta.ok) throw new Error(dados.erro || 'Erro ao carregar as curtidas.');
        statusCurtidas.textContent = `${dados.musicas.length} faixa(s) na sua playlist.`;
        mensagemVazia.classList.toggle('is-hidden', dados.musicas.length !== 0);
        if (dados.musicas.length === 0) return;

        const albumPlaylist = { nome: 'Músicas curtidas', artista: 'Sua playlist NovaSound', ano: '', capa: dados.musicas[0].capa, faixas: [] };
        albumPlaylist.faixas = dados.musicas.map((musica, indice) => ({
            numero: indice + 1,
            titulo: musica.titulo,
            artista: musica.artista,
            album: musica.album,
            arquivo: musica.arquivo,
        }));

        dados.musicas.forEach((musica, indice) => {
            const item = document.createElement('li');
            item.className = 'favorite-track';
            const tocar = document.createElement('button');
            tocar.type = 'button';
            tocar.className = 'favorite-track-play';
            tocar.innerHTML = `<span aria-hidden="true">▶</span><span><strong>${escaparTexto(musica.titulo)}</strong><small>${escaparTexto(musica.artista)} · ${escaparTexto(musica.album)}</small></span>`;
            tocar.addEventListener('click', () => playTrack(albumPlaylist.faixas[indice], albumPlaylist));
            item.appendChild(tocar);
            listaCurtidas.appendChild(item);
        });
    } catch (erro) {
        statusCurtidas.textContent = 'Não foi possível carregar. Confira o XAMPP e se o banco foi importado.';
        console.error(erro);
    }
}

function escaparTexto(texto) {
    const elemento = document.createElement('span');
    elemento.textContent = texto ?? '';
    return elemento.innerHTML;
}

carregarCurtidas();
