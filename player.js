const playerBar = document.getElementById('playerBar');
const playerCover = document.getElementById('playerCover');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const progressBar = document.getElementById('progressBar');

let albumAtual = null;
let indiceFaixaAtual = -1;

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const contextoAudio = new AudioContextClass();
const controleVolume = contextoAudio.createGain();
controleVolume.gain.value = Number(volumeBar.value);
controleVolume.connect(contextoAudio.destination);

let fonteAtual = null;
let fonteProgramada = null;
let bufferAtual = null;
let bufferSeguinte = null;
let indiceProgramado = -1;
let indicePrecarregado = -1;
let inicioDaFaixa = 0;
let inicioProgramado = 0;
let idRequisicao = 0;
let idPrecarregamento = 0;
let usuarioMovendoBarra = false;

async function carregarBuffer(faixa) {
    const resposta = await fetch(faixa.arquivo);

    if (!resposta.ok) {
        throw new Error(`Não foi possível carregar: ${faixa.arquivo}`);
    }

    const dadosDoArquivo = await resposta.arrayBuffer();
    return await contextoAudio.decodeAudioData(dadosDoArquivo);
}

function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
}

function atualizarInformacoesDaFaixa(faixa, album) {
    playerCover.src = album.capa;
    playerTrackTitle.textContent = faixa.titulo;
    playerTrackArtist.textContent = album.artista;
    playerBar.classList.remove('is-hidden');
    playPauseBtn.innerHTML = '&#10073;&#10073;';
}

function pararFonte(fonte) {
    if (!fonte) return;

    fonte.onended = null;

    try {
        fonte.stop();
    } catch (erro) {
        // A fonte pode já ter terminado quando este código for chamado.
    }
}

function cancelarFontes() {
    pararFonte(fonteAtual);
    pararFonte(fonteProgramada);
    fonteAtual = null;
    fonteProgramada = null;
    indiceProgramado = -1;
}

function finalizarFonte(fonte) {
    if (fonte !== fonteAtual) return;

    if (fonteProgramada) {
        fonteAtual = fonteProgramada;
        bufferAtual = bufferSeguinte;
        indiceFaixaAtual = indiceProgramado;
        inicioDaFaixa = inicioProgramado;

        const faixa = albumAtual.faixas[indiceFaixaAtual];
        fonteProgramada = null;
        bufferSeguinte = null;
        indiceProgramado = -1;
        indicePrecarregado = -1;

        atualizarInformacoesDaFaixa(faixa, albumAtual);
        return;
    }

    fonteAtual = null;
    proximaFaixa();
}

function agendarProximaFaixa(indice) {
    if (!bufferSeguinte || indice !== indicePrecarregado || fonteProgramada) {
        return;
    }

    const horarioDeInicio = inicioDaFaixa + bufferAtual.duration;

    // Se a decodificação terminou tarde, deixa a troca de segurança cuidar da faixa.
    if (horarioDeInicio <= contextoAudio.currentTime + 0.05) {
        return;
    }

    const fonte = contextoAudio.createBufferSource();
    fonte.buffer = bufferSeguinte;
    fonte.connect(controleVolume);
    fonte.onended = () => finalizarFonte(fonte);

    fonteProgramada = fonte;
    indiceProgramado = indice;
    inicioProgramado = horarioDeInicio;
    fonte.start(horarioDeInicio);
}

async function playTrack(faixa, album, bufferPreparado = null, posicaoInicial = 0) {
    const requisicao = ++idRequisicao;
    idPrecarregamento++;
    cancelarFontes();

    bufferAtual = null;
    bufferSeguinte = null;
    indicePrecarregado = -1;

    await contextoAudio.resume();

    albumAtual = album;
    indiceFaixaAtual = album.faixas.indexOf(faixa);

    try {
        const buffer = bufferPreparado || await carregarBuffer(faixa);
        if (requisicao !== idRequisicao) return;

        bufferAtual = buffer;

        const fonte = contextoAudio.createBufferSource();
        fonte.buffer = bufferAtual;
        fonte.connect(controleVolume);
        fonte.onended = () => finalizarFonte(fonte);

        fonteAtual = fonte;
        inicioDaFaixa = contextoAudio.currentTime - posicaoInicial;
        fonte.start(contextoAudio.currentTime, posicaoInicial);

        atualizarInformacoesDaFaixa(faixa, album);
    } catch (erro) {
        console.error('Erro ao iniciar a faixa:', erro);
    }
}

async function proximaFaixa() {
    if (!albumAtual || albumAtual.faixas.length === 0) return;

    const proximoIndice = (indiceFaixaAtual + 1) % albumAtual.faixas.length;
    const faixaSeguinte = albumAtual.faixas[proximoIndice];
    const bufferPronto = indicePrecarregado === proximoIndice
        ? bufferSeguinte
        : null;

    await playTrack(faixaSeguinte, albumAtual, bufferPronto);
}

function faixaAnterior() {
    if (!albumAtual || albumAtual.faixas.length === 0) return;

    const tempoDecorrido = contextoAudio.currentTime - inicioDaFaixa;

    if (tempoDecorrido > 3) {
        playTrack(albumAtual.faixas[indiceFaixaAtual], albumAtual, bufferAtual);
        return;
    }

    const indiceAnterior =
        (indiceFaixaAtual - 1 + albumAtual.faixas.length) % albumAtual.faixas.length;

    playTrack(albumAtual.faixas[indiceAnterior], albumAtual);
}

async function prepararProximaFaixa() {
    if (!albumAtual || !bufferAtual || fonteProgramada) return;

    const indice = (indiceFaixaAtual + 1) % albumAtual.faixas.length;
    if (indicePrecarregado === indice) return;

    const requisicaoPreload = ++idPrecarregamento;
    indicePrecarregado = indice;

    try {
        const buffer = await carregarBuffer(albumAtual.faixas[indice]);

        if (requisicaoPreload !== idPrecarregamento || indice !== (indiceFaixaAtual + 1) % albumAtual.faixas.length) {
            return;
        }

        bufferSeguinte = buffer;
        console.log('Próxima faixa decodificada.');
        agendarProximaFaixa(indice);
    } catch (erro) {
        if (requisicaoPreload === idPrecarregamento) {
            indicePrecarregado = -1;
        }
        console.error('Erro ao decodificar a próxima faixa:', erro);
    }
}

playPauseBtn.addEventListener('click', async () => {
    if (contextoAudio.state === 'running') {
        await contextoAudio.suspend();
        playPauseBtn.innerHTML = '&#9658;';
    } else {
        await contextoAudio.resume();
        playPauseBtn.innerHTML = '&#10073;&#10073;';
    }
});

nextBtn.addEventListener('click', proximaFaixa);
previousBtn.addEventListener('click', faixaAnterior);

progressBar.addEventListener('pointerdown', () => {
    usuarioMovendoBarra = true;
});

window.addEventListener('pointerup', () => {
    setTimeout(() => {
        usuarioMovendoBarra = false;
    }, 0);
});

progressBar.addEventListener('input', () => {
    if (!bufferAtual) return;

    usuarioMovendoBarra = true;
    const tempoEscolhido = (Number(progressBar.value) / 100) * bufferAtual.duration;
    currentTimeEl.textContent = formatTime(tempoEscolhido);
});

progressBar.addEventListener('change', () => {
    if (!bufferAtual || !albumAtual) return;

    const posicao = (Number(progressBar.value) / 100) * bufferAtual.duration;
    playTrack(albumAtual.faixas[indiceFaixaAtual], albumAtual, bufferAtual, posicao);
    usuarioMovendoBarra = false;
});

volumeBar.addEventListener('input', () => {
    controleVolume.gain.value = Number(volumeBar.value);
});

setInterval(() => {
    if (!bufferAtual || contextoAudio.state !== 'running' || usuarioMovendoBarra) return;

    const tempoDecorrido = Math.min(
        contextoAudio.currentTime - inicioDaFaixa,
        bufferAtual.duration
    );
    const segundosRestantes = bufferAtual.duration - tempoDecorrido;

    progressBar.value = (tempoDecorrido / bufferAtual.duration) * 100;
    currentTimeEl.textContent = formatTime(tempoDecorrido);
    durationEl.textContent = formatTime(bufferAtual.duration);

    if (segundosRestantes <= 6 && !bufferSeguinte && !fonteProgramada) {
        prepararProximaFaixa();
    }
}, 100);
