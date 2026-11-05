(() => {
    let navegacaoEmAndamento = false;
    let numeroDaNavegacao = 0;
    const scriptsCompartilhados = new Set(
        [...document.scripts]
            .map((script) => script.src && new URL(script.src).pathname.split('/').pop())
            .filter(Boolean)
            .filter((nome) => nome === 'player.js' || nome === 'dados.js')
    );

    function inserirScript(src, tipo = 'module') {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            if (tipo === 'module') script.type = 'module';
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Não foi possível carregar ${src}`));
            document.body.appendChild(script);
        });
    }

    async function carregarScriptsDaPagina(documentoNovo, urlDestino) {
        for (const scriptAntigo of documentoNovo.querySelectorAll('script[src]')) {
            const src = new URL(scriptAntigo.getAttribute('src'), urlDestino);
            const nome = src.pathname.split('/').pop();

            if (nome === 'router.js' || nome === 'auth-header.js') continue;

            if (nome === 'player.js' || nome === 'dados.js') {
                if (scriptsCompartilhados.has(nome)) continue;
                scriptsCompartilhados.add(nome);
                try {
                    await inserirScript(src.href, 'classic');
                } catch (erro) {
                    scriptsCompartilhados.delete(nome);
                    throw erro;
                }
                continue;
            }

            src.searchParams.set('_nav', String(++numeroDaNavegacao));
            await inserirScript(src.href, 'module');
        }
    }

    async function navegar(destino, adicionarHistorico = true) {
        const urlDestino = new URL(destino, window.location.href);
        if (urlDestino.origin !== window.location.origin) return false;

        navegacaoEmAndamento = true;
        try {
            const resposta = await fetch(urlDestino.href, {
                headers: { 'X-Requested-With': 'NovaSound-Navigation' },
            });
            if (!resposta.ok) throw new Error(`A página respondeu com status ${resposta.status}.`);

            const html = await resposta.text();
            const analisador = new DOMParser();
            const documentoNovo = analisador.parseFromString(html, 'text/html');
            const cabecalhoNovo = documentoNovo.querySelector('header');
            const conteudoNovo = documentoNovo.querySelector('main');
            const rodapeNovo = documentoNovo.querySelector('footer.site-footer');

            if (!cabecalhoNovo || !conteudoNovo || !rodapeNovo) {
                throw new Error('A página não possui a estrutura esperada para navegação contínua.');
            }

            window.dispatchEvent(new Event('novasound:before-navigate'));

            const playerAtual = document.getElementById('playerBar');
            const filaAtual = document.getElementById('queuePanel');
            const playerNovo = documentoNovo.getElementById('playerBar');
            const filaNova = documentoNovo.getElementById('queuePanel');

            document.querySelector('header')?.replaceWith(document.importNode(cabecalhoNovo, true));
            document.querySelector('main')?.replaceWith(document.importNode(conteudoNovo, true));
            document.querySelector('footer.site-footer')?.replaceWith(document.importNode(rodapeNovo, true));

            if (!playerAtual && playerNovo) {
                const novoPlayerImportado = document.importNode(playerNovo, true);
                const filaImportada = filaNova ? document.importNode(filaNova, true) : null;
                document.querySelector('main').after(novoPlayerImportado);
                if (filaImportada) novoPlayerImportado.after(filaImportada);
            } else {
                playerNovo?.remove();
                filaNova?.remove();
            }

            document.title = documentoNovo.title;
            const descricaoNova = documentoNovo.querySelector('meta[name="description"]');
            const descricaoAtual = document.querySelector('meta[name="description"]');
            if (descricaoNova && descricaoAtual) descricaoAtual.content = descricaoNova.content;

            if (adicionarHistorico) history.pushState({}, '', urlDestino.href);
            await carregarScriptsDaPagina(documentoNovo, urlDestino);
            await window.atualizarCabecalhoConta?.();

            if (urlDestino.hash) {
                document.getElementById(decodeURIComponent(urlDestino.hash.slice(1)))?.scrollIntoView();
            } else {
                window.scrollTo(0, 0);
            }

            return true;
        } catch (erro) {
            console.error('Navegação NovaSound:', erro);
            return false;
        } finally {
            navegacaoEmAndamento = false;
        }
    }

    window.novaNavegar = navegar;

    document.addEventListener('click', async (evento) => {
        if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

        const link = evento.target instanceof Element ? evento.target.closest('a[href]') : null;
        if (!link || link.target || link.hasAttribute('download')) return;

        const destino = new URL(link.href, window.location.href);
        if (destino.origin !== window.location.origin || !/\.(html|php)$/i.test(destino.pathname)) return;
        if (destino.pathname === location.pathname && destino.search === location.search && destino.hash) return;

        evento.preventDefault();
        if (navegacaoEmAndamento) return;
        const concluiu = await navegar(destino.href);
        if (!concluiu) window.location.href = destino.href;
    });

    window.addEventListener('popstate', async () => {
        const concluiu = await navegar(window.location.href, false);
        if (!concluiu) window.location.reload();
    });
})();
