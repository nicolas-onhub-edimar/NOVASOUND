const audio = document.getElementById('audioPlayer');
const playerBar = document.getElementById('playerBar');
const playerCover = document.getElementById('playerCover');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
}

function playTrack(faixa, album){
    audio.src = faixa.arquivo;
    audio.play();

    playerCover.src = album.capa;
    playerTrackTitle.textContent = faixa.titulo;
    playerTrackArtist.textContent = album.artista;

    playerBar.classList.remove('is-hidden');
    playPauseBtn.innerHTML = '&#10073;&#10073;';
}

playPauseBtn.addEventListener('click', () => {
    console.log('botão clicado. Pausado?', audio.paused);
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '&#10073;&#10073;';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '&#9658;';
    }
});

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