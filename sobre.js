// Escreve na página Sobre quantos álbuns, faixas e artistas existem hoje no catálogo.
await window.albunsPromise;

const alvo = document.getElementById('sbLive');

if (alvo && Array.isArray(window.albuns) && window.albuns.length > 0) {
    const totalAlbuns = window.albuns.length;
    const totalFaixas = window.albuns.reduce((soma, album) => soma + album.faixas.length, 0);
    const totalArtistas = new Set(window.albuns.map((album) => album.artista)).size;

    const texto = (numero, singular, plural) => `${numero} ${numero === 1 ? singular : plural}`;

    alvo.textContent = `Hoje o catálogo tem ${texto(totalAlbuns, 'álbum', 'álbuns')}, ` +
        `${texto(totalFaixas, 'faixa', 'faixas')} e ${texto(totalArtistas, 'artista', 'artistas')} com música para ouvir.`;
}
