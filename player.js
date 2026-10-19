const audio = document.getElementById('audioPlayer');
const playerBar = document.getElementById('playerBar');
const playerCover = document.getElementById('playerCover');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let albumAtual = null;
let indiceFaixaAtual = -1;

function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
}

function playTrack(faixa, album){
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

    playTrack(albumAtual.faixas[proximoIndice], albumAtual);
}

nextBtn.addEventListener('click', proximaFaixa);
audio.addEventListener('ended', proximaFaixa);

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


audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
});

progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});
