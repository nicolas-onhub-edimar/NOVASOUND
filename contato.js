// Formulário de contato: valida os campos, mostra os erros ao lado de cada campo e envia para api/contato.php.
const formulario = document.getElementById('contactForm');

if (formulario) {
    const sucesso = document.getElementById('contactSuccess');
    const outraMensagem = document.getElementById('contactAnother');
    const mensagemDeStatus = document.getElementById('contactStatus');
    const botaoEnviar = formulario.querySelector('.ct-submit');
    const campoMensagem = document.getElementById('contactMessage');
    const contador = document.getElementById('contactCount');

    function mostrarErro(nome, texto) {
        const alvo = document.getElementById(`erro-${nome}`);
        if (!alvo) return;
        alvo.textContent = texto;
        alvo.hidden = !texto;
        const campo = formulario.querySelector(`[data-campo="${nome}"]`);
        if (campo) {
            if (texto) campo.setAttribute('data-invalid', '');
            else campo.removeAttribute('data-invalid');
            const entrada = campo.querySelector('input, textarea');
            if (entrada) entrada.setAttribute('aria-invalid', String(Boolean(texto)));
        }
    }

    function lerCampos() {
        const dados = new FormData(formulario);
        return {
            assunto: String(dados.get('assunto') || ''),
            nome: String(dados.get('nome') || '').trim(),
            email: String(dados.get('email') || '').trim(),
            mensagem: String(dados.get('mensagem') || '').trim(),
            site: String(dados.get('site') || ''),
        };
    }

    function validar(dados) {
        const erros = {};
        if (!dados.assunto) erros.assunto = 'Escolha o assunto da sua mensagem.';
        if (!dados.nome) erros.nome = 'Informe seu nome.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.email = 'Informe um e-mail válido, como voce@exemplo.com.';
        if (dados.mensagem.length < 10) erros.mensagem = 'Escreva pelo menos 10 caracteres.';
        return erros;
    }

    async function carregarSessao() {
        const resposta = await fetch('api/status.php');
        if (!resposta.ok) throw new Error('Não foi possível iniciar o envio. Confira se o Apache e o MySQL estão ligados.');
        return resposta.json();
    }

    // Se a pessoa está logada, já preenche nome e e-mail.
    carregarSessao().then((sessao) => {
        if (!sessao.usuario) return;
        const nome = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        if (nome && !nome.value) nome.value = sessao.usuario.nome || '';
        if (email && !email.value) email.value = sessao.usuario.email || '';
    }).catch(() => {});

    campoMensagem.addEventListener('input', () => {
        contador.textContent = `${campoMensagem.value.length} de 2000 caracteres`;
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mensagemDeStatus.textContent = '';

        const dados = lerCampos();
        const erros = validar(dados);
        ['assunto', 'nome', 'email', 'mensagem'].forEach((nome) => mostrarErro(nome, erros[nome] || ''));

        const primeiroErro = Object.keys(erros)[0];
        if (primeiroErro) {
            const alvo = primeiroErro === 'assunto'
                ? formulario.querySelector('input[name="assunto"]')
                : formulario.querySelector(`[name="${primeiroErro}"]`);
            alvo?.focus();
            return;
        }

        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';

        try {
            const sessao = await carregarSessao();
            const resposta = await fetch('api/contato.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': sessao.csrf },
                body: JSON.stringify(dados),
            });
            const corpo = await resposta.json().catch(() => ({}));
            if (!resposta.ok) throw new Error(corpo.erro || 'Não foi possível enviar agora. Tente de novo em instantes.');

            formulario.hidden = true;
            sucesso.hidden = false;
            sucesso.focus();
        } catch (erro) {
            mensagemDeStatus.textContent = erro.message;
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = 'Enviar mensagem';
        }
    });

    outraMensagem.addEventListener('click', () => {
        formulario.reset();
        contador.textContent = '0 de 2000 caracteres';
        sucesso.hidden = true;
        formulario.hidden = false;
        formulario.querySelector('input[name="assunto"]').focus();
    });
}
