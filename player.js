let audio = document.getElementById('audioPlayer');
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

const contextoAudio = new AudioContext();
const controleVolume = contextoAudio.createGain();

controleVolume.connect(contextoAudio.destination);

let fonteAtual = null;
let bufferAtual = null;
let bufferSeguinte = null;
let proximoIndiceCarregado = -1;
let inicioDaFaixa = 0;
let tempoPausado = 0;

async function carregarBuffer(faixa){
    const resposta = await fetch(faixa.arquivo);
    const dadosDoArquivo = await resposta.arrayBuffer();
    return await contextoAudio.decodeAudioData(dadosDoArquivo);
}

function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
}



async function playTrack(faixa, album) {
    if (fonteAtual) {
        fonteAtual.stop();
    }

    await contextoAudio.resume();

    albumAtual = album;
    indiceFaixaAtual = album.faixas.indexOf(faixa);
    bufferAtual = await carregarBuffer(faixa);

    fonteAtual = contextoAudio.createBufferSource();
    fonteAtual.buffer = bufferAtual;
    fonteAtual.connect(controleVolume);
    fonteAtual.start();

    inicioDaFaixa = contextoAudio.currentTime;
    tempoPausado = 0;

    fonteAtual.onended = () => {
        proximaFaixa();
    };

    playerCover.src = album.capa;
    playerTrackTitle.textContent = faixa.titulo;
    playerTrackArtist.textContent = album.artista;

    playerBar.classList.remove('is-hidden');
    playPauseBtn.innerHTML = '&#10073;&#10073;';
}

playPauseBtn.addEventListener('click', async () => {
    if (contextoAudio.state === 'running') {
        tempoPausado = contextoAudio.currentTime - inicioDaFaixa;
        await contextoAudio.suspend();
        playPauseBtn.innerHTML = '&#9658;';
    } else {
        await contextoAudio.resume();
        playPauseBtn.innerHTML = '&#10073;&#10073;';
    };
});

async function proximaFaixa() {
    if (!albumAtual || albumAtual.faixas.length === 0) {
        return;
    }

    const proximoIndice = 
        (indiceFaixaAtual + 1) % albumAtual.faixas.length;

    const faixaSeguinte = albumAtual.faixas[proximoIndice];

    await playTrack(faixaSeguinte, albumAtual);

}

nextBtn.addEventListener('click', proximaFaixa);

function faixaAnterior() {
    if (!albumAtual || albumAtual.faixas.length === 0) {
        return;
    }

    if(audio.currentTime > 3){
        audio.currentTime = 0;
        return;
    }

    const indiceAnterior =
        (indiceFaixaAtual - 1 + albumAtual.faixas.length) % albumAtual.faixas.length;

    playTrack(albumAtual.faixas[indiceAnterior], albumAtual);

}

previousBtn.addEventListener('click', faixaAnterior);

setInterval(async () => {
    if (!bufferAtual || contextoAudio.state !== 'running') {
        return;
    }

    const tempoDecorrido = contextoAudio.currentTime - inicioDaFaixa;
    const segundosRestantes = bufferAtual.duration - tempoDecorrido;

    progressBar.value = (tempoDecorrido / bufferAtual.duration) * 100;
    currentTimeEl.textContent = formatTime(tempoDecorrido);
    durationEl.textContent = formatTime(bufferAtual.duration);

    if (
        segundosRestantes <= 6 &&
        albumAtual &&
        albumAtual.faixas.length > 0
    ) {
        const proximoIndice = 
            (indiceFaixaAtual + 1) % albumAtual.faixas.length;
        
        if (proximoIndiceCarregado !== proximoIndice){
            proximoIndiceCarregado = proximoIndice;

            try {
                bufferSeguinte = await carregarBuffer(
                    albumAtual.faixas[proximoIndice]
                );
                console.log('Próxima faixa decodificada.');
            } catch (erro) {
                console.error('Erro ao decodificar a próxima faixa:', erro);
                proximoIndiceCarregado = -1;
            }
        }
    }
}, 100);
