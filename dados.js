window.albuns = [];
window.albunsPromise = fetch('api/catalogo.php')
    .then(async (resposta) => {
        if (!resposta.ok) throw new Error('O servidor não conseguiu carregar o catálogo.');
        return resposta.json();
    })
    .then((dados) => {
        window.albuns = Array.isArray(dados.albuns) ? dados.albuns : [];
        return window.albuns;
    })
    .catch((erro) => {
        console.error('Erro ao carregar o catálogo do banco:', erro);
        window.albuns = [];
        return window.albuns;
    });
