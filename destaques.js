await window.albunsPromise;

const secaoDestaques = document.getElementById('featuredAlbumsSection');
const botaoAlternarSecaoDestaques = document.getElementById('toggleFeaturedSection');
const areaDestaques = document.querySelector('.featured-albums');
const slideDestaque = document.getElementById('featuredAlbumSlide');
const pontosDestaque = document.getElementById('featuredAlbumDots');
const botoesDestaque = document.getElementById('featuredAlbumsControls');
const botaoDestaqueAnterior = document.getElementById('featuredPrevious');
const botaoDestaqueSeguinte = document.getElementById('featuredNext');
const botaoPausarDestaque = document.getElementById('featuredToggle');

const chaveVisibilidadeDestaques = 'novasound-destaques-visiveis';
const albunsEmDestaque = [...window.albuns].sort((albumA, albumB) => albumB.ano - albumA.ano);
const intervaloDestaque = 6000;
let secaoDestaquesVisivel = lerVisibilidadeDestaques();
let indiceDestaqueAtual = 0;
let temporizadorDestaque = null;
let rotacaoAutomaticaAtiva = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function lerVisibilidadeDestaques() {
    try {
        return localStorage.getItem(chaveVisibilidadeDestaques) !== 'false';
    } catch (erro) {
        return true;
    }
}

function salvarVisibilidadeDestaques() {
    try {
        localStorage.setItem(chaveVisibilidadeDestaques, String(secaoDestaquesVisivel));
    } catch (erro) {
        // O botão continua funcionando mesmo se o navegador bloquear o armazenamento local.
    }
}

function atualizarBotaoDaSecao() {
    secaoDestaques.hidden = !secaoDestaquesVisivel;
    botaoAlternarSecaoDestaques.textContent = secaoDestaquesVisivel
        ? 'Ocultar álbuns em destaque'
        : 'Mostrar álbuns em destaque';
    botaoAlternarSecaoDestaques.setAttribute('aria-expanded', String(secaoDestaquesVisivel));
}

function criarLinkDoArtista(album) {
    const link = document.createElement('a');
    const parametros = new URLSearchParams({ artista: album.artista });

    link.className = 'featured-album-link';
    link.href = `discografia.html?${parametros.toString()}`;
    link.textContent = 'Ver álbuns do artista';

    return link;
}

function renderizarAlbumEmDestaque(album) {
    const artigo = document.createElement('article');
    artigo.className = 'featured-album-card';

    const capa = document.createElement('img');
    capa.className = 'featured-album-cover';
    capa.src = album.capa;
    capa.alt = `Capa do álbum ${album.nome}, de ${album.artista}`;

    const conteudo = document.createElement('div');
    conteudo.className = 'featured-album-content';

    const etiqueta = document.createElement('p');
    etiqueta.className = 'featured-album-label';
    etiqueta.textContent = 'Álbum em destaque';

    const ano = document.createElement('p');
    ano.className = 'featured-album-year';
    ano.textContent = `Álbum · ${album.ano}`;

    const titulo = document.createElement('h3');
    titulo.className = 'featured-album-title';
    titulo.textContent = album.nome;

    const artista = document.createElement('p');
    artista.className = 'featured-album-artist';
    artista.textContent = album.artista;

    conteudo.append(etiqueta, ano, titulo, artista, criarLinkDoArtista(album));
    artigo.append(capa, conteudo);
    slideDestaque.replaceChildren(artigo);
}

function atualizarPontosDestaque() {
    [...pontosDestaque.children].forEach((ponto, indice) => {
        const selecionado = indice === indiceDestaqueAtual;
        ponto.classList.toggle('is-active', selecionado);
        ponto.setAttribute('aria-current', String(selecionado));
    });
}

function mostrarDestaque(indice) {
    if (albunsEmDestaque.length === 0) return;

    indiceDestaqueAtual = (indice + albunsEmDestaque.length) % albunsEmDestaque.length;
    renderizarAlbumEmDestaque(albunsEmDestaque[indiceDestaqueAtual]);
    atualizarPontosDestaque();
}

function iniciarRotacaoDestaque() {
    const usuarioInteragindo = areaDestaques.matches(':hover') || areaDestaques.contains(document.activeElement);

    if (!secaoDestaquesVisivel || !rotacaoAutomaticaAtiva || temporizadorDestaque !== null || albunsEmDestaque.length < 2 || usuarioInteragindo || document.hidden) {
        return;
    }

    temporizadorDestaque = window.setInterval(() => {
        mostrarDestaque(indiceDestaqueAtual + 1);
    }, intervaloDestaque);
}

function pararRotacaoDestaque() {
    window.clearInterval(temporizadorDestaque);
    temporizadorDestaque = null;
}

function atualizarBotaoDeRotacao() {
    botaoPausarDestaque.setAttribute('aria-pressed', String(!rotacaoAutomaticaAtiva));
    botaoPausarDestaque.setAttribute(
        'aria-label',
        rotacaoAutomaticaAtiva ? 'Pausar rotação automática' : 'Retomar rotação automática'
    );
    botaoPausarDestaque.textContent = rotacaoAutomaticaAtiva ? 'Ⅱ' : '▶';
}

function criarPontosDestaque() {
    albunsEmDestaque.forEach((album, indice) => {
        const ponto = document.createElement('button');
        ponto.type = 'button';
        ponto.className = 'featured-album-dot';
        ponto.setAttribute('aria-label', `Mostrar ${album.nome}, de ${album.artista}`);
        ponto.addEventListener('click', () => mostrarDestaque(indice));
        pontosDestaque.appendChild(ponto);
    });
}

botaoAlternarSecaoDestaques.addEventListener('click', () => {
    secaoDestaquesVisivel = !secaoDestaquesVisivel;
    atualizarBotaoDaSecao();
    salvarVisibilidadeDestaques();

    if (secaoDestaquesVisivel) iniciarRotacaoDestaque();
    else pararRotacaoDestaque();
});

botaoDestaqueAnterior.addEventListener('click', () => mostrarDestaque(indiceDestaqueAtual - 1));
botaoDestaqueSeguinte.addEventListener('click', () => mostrarDestaque(indiceDestaqueAtual + 1));
botaoPausarDestaque.addEventListener('click', () => {
    rotacaoAutomaticaAtiva = !rotacaoAutomaticaAtiva;
    atualizarBotaoDeRotacao();
    if (rotacaoAutomaticaAtiva) iniciarRotacaoDestaque();
    else pararRotacaoDestaque();
});

areaDestaques.addEventListener('pointerenter', pararRotacaoDestaque);
areaDestaques.addEventListener('pointerleave', iniciarRotacaoDestaque);
areaDestaques.addEventListener('focusin', pararRotacaoDestaque);
areaDestaques.addEventListener('focusout', (evento) => {
    if (!areaDestaques.contains(evento.relatedTarget)) iniciarRotacaoDestaque();
});

function atualizarRotacaoPorVisibilidade() {
    if (document.hidden) pararRotacaoDestaque();
    else iniciarRotacaoDestaque();
}

document.addEventListener('visibilitychange', atualizarRotacaoPorVisibilidade);
window.addEventListener('novasound:before-navigate', () => {
    pararRotacaoDestaque();
    document.removeEventListener('visibilitychange', atualizarRotacaoPorVisibilidade);
}, { once: true });

atualizarBotaoDaSecao();

if (albunsEmDestaque.length > 0) {
    criarPontosDestaque();
    mostrarDestaque(0);
    atualizarBotaoDeRotacao();

    if (albunsEmDestaque.length < 2) {
        botoesDestaque.classList.add('is-hidden');
        pontosDestaque.classList.add('is-hidden');
    } else {
        iniciarRotacaoDestaque();
    }
} else {
    botaoAlternarSecaoDestaques.hidden = true;
    secaoDestaques.hidden = true;
}
