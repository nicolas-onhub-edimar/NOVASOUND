await window.albunsPromise;

const destaqueLancamento = document.getElementById('featuredRelease');
const gradeLancamentos = document.getElementById('releaseGrid');
const estadoVazioLancamentos = document.getElementById('releaseEmptyState');

function criarLinkDaDiscografia(album, texto, classe) {
    const link = document.createElement('a');
    const parametros = new URLSearchParams({ artista: album.artista });

    link.href = `discografia.html?${parametros.toString()}`;
    link.className = classe;
    link.textContent = texto;

    return link;
}

function renderizarDestaque(album) {
    const artigo = document.createElement('article');
    artigo.className = 'release-feature-card';

    const imagem = document.createElement('img');
    imagem.className = 'release-feature-cover';
    imagem.src = album.capa;
    imagem.alt = `Capa do álbum ${album.nome}, de ${album.artista}`;
    imagem.fetchPriority = 'high';

    const conteudo = document.createElement('div');
    conteudo.className = 'release-feature-content';

    const etiqueta = document.createElement('p');
    etiqueta.className = 'release-feature-label';
    etiqueta.textContent = 'Mais recente no catálogo';

    const ano = document.createElement('p');
    ano.className = 'release-feature-year';
    ano.textContent = `Álbum · ${album.ano}`;

    const titulo = document.createElement('h2');
    titulo.textContent = album.nome;

    const artista = document.createElement('p');
    artista.className = 'release-feature-artist';
    artista.textContent = album.artista;

    const descricao = document.createElement('p');
    descricao.className = 'release-feature-description';
    descricao.textContent = 'Descubra este lançamento e explore os projetos disponíveis na NovaSound.';

    conteudo.append(etiqueta, ano, titulo, artista, descricao);
    conteudo.appendChild(criarLinkDaDiscografia(album, 'Explorar álbum', 'btn-primary'));
    artigo.append(imagem, conteudo);
    destaqueLancamento.replaceChildren(artigo);
}

function criarCartaoLancamento(album) {
    const artigo = document.createElement('article');
    artigo.className = 'release-card';

    const linkDaCapa = criarLinkDaDiscografia(album, '', 'release-card-cover-link');
    linkDaCapa.setAttribute('aria-label', `Ver discografia de ${album.artista}`);

    const imagem = document.createElement('img');
    imagem.src = album.capa;
    imagem.alt = `Capa do álbum ${album.nome}, de ${album.artista}`;
    imagem.loading = 'lazy';
    linkDaCapa.appendChild(imagem);

    const informacoes = document.createElement('div');
    informacoes.className = 'release-card-info';

    const ano = document.createElement('p');
    ano.className = 'release-card-year';
    ano.textContent = `Álbum · ${album.ano}`;

    const titulo = document.createElement('h3');
    titulo.textContent = album.nome;

    const artista = document.createElement('p');
    artista.className = 'release-card-artist';
    artista.textContent = album.artista;

    const linkTexto = criarLinkDaDiscografia(album, 'Ver discografia', 'release-card-link');
    linkTexto.setAttribute('aria-label', `Ver discografia de ${album.artista}`);

    informacoes.append(ano, titulo, artista, linkTexto);
    artigo.append(linkDaCapa, informacoes);

    return artigo;
}

function renderizarLancamentos() {
    const lancamentos = [...window.albuns].sort((albumA, albumB) => albumB.ano - albumA.ano);

    if (lancamentos.length === 0) {
        estadoVazioLancamentos.classList.remove('is-hidden');
        destaqueLancamento.classList.add('is-hidden');
        return;
    }

    const [lancamentoMaisRecente, ...outrosLancamentos] = lancamentos;
    renderizarDestaque(lancamentoMaisRecente);
    outrosLancamentos.forEach((album) => {
        gradeLancamentos.appendChild(criarCartaoLancamento(album));
    });
}

renderizarLancamentos();
