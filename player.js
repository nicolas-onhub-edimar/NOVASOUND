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
let audioPrecarregado = new Audio();
audioPrecarregado.preload = 'auto';
let indicePrecarregado = -1;
let indiceFaixaAtual = -1;

audioPrecarregado.addEventListener('canplay', () => {
    console.log(
        'A próxima faixa já pode começar. readyState:',
        audioPrecarregado.readyState
    );
});

function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
}



function playTrack(faixa, album){
    indicePrecarregado = -1;
    albumAtual = album;
    indiceFaixaAtual = album.faixas.indexOf(faixa);

    audio.src = faixa.arquivo;
    audio.play();

    playerCover.src = album.capa;
    playerTrackTitle.textContent = faixa.titulo;
    playerTrackArtist.textContent = album.artista;

    playerBar.classList.remove('is-hidden');
    playPauseBtn.innerHTML = '&#10073;&#10073;';
}

playPauseBtn.addEventListener('click', () => {
    console.log('botÃ£o clicado. Pausado?', audio.paused);
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '&#10073;&#10073;';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '&#9658;';
    }
});

function proximaFaixa() {
    if(!albumAtual || albumAtual.faixas.length === 0) {
        return;
    }

    const proximoIndice =
        (indiceFaixaAtual + 1) % albumAtual.faixas.length;
    const faixaSeguinte = albumAtual.faixas[proximoIndice];

    if (
        indicePrecarregado === proximoIndice &&
            audioPrecarregado.readyState >= 3
    ) {
        console.log(
         'Trocando para o áudio pré-carregado. readyState:',
         audioPrecarregado.readyState
        );
        audio.pause();

        const audioAntigo = audio;
        audio = audioPrecarregado;
        audioPrecarregado = audioAntigo;

        indiceFaixaAtual = proximoIndice;
        indicePrecarregado = -1;

        audio.volume = Number(volumeBar.value);
        audio.play();

        playerTrackTitle.textContent = faixaSeguinte.titulo;
        playPauseBtn.innerHTML = '&#10073;&#10073;';
        return;
    }
    console.log('Usando o carregamento normal. readyState:', audioPrecarregado.readyState);
    playTrack(faixaSeguinte, albumAtual);
}

nextBtn.addEventListener('click', proximaFaixa);
audio.addEventListener('ended', proximaFaixa);
audioPrecarregado.addEventListener('ended', proximaFaixa);

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


function atualizarTempo(evento){
    if (evento.currentTarget !== audio) return;
    if (!audio.duration) return;

    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);

    const segundosRestantes = audio.duration - audio.currentTime;

    if(segundosRestantes <= 6 && albumAtual && albumAtual.faixas.length > 0){
        const proximoIndice =
            (indiceFaixaAtual + 1) % albumAtual.faixas.length;

        if (indicePrecarregado !== proximoIndice) {
            audioPrecarregado.src = albumAtual.faixas[proximoIndice].arquivo;
            audioPrecarregado.load();
            indicePrecarregado = proximoIndice;
            console.log('Usando a faixa pré-carregada. readyState: ', audioPrecarregado.readyState);
        }
    }
}

audio.addEventListener('timeupdate', atualizarTempo);
audioPrecarregado.addEventListener('timeupdate', atualizarTempo);

progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeBar.addEventListener('input', () => {
    audio.volume = Number(volumeBar.value);
});
