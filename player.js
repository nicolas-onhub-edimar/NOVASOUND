const audio = document.getElementById('audioPlayer');
const playerBar = document.getElementById('playerBar');
const playerCover = document.getElementById('playerCover');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playPauseBtn = document.getElementById('progressBar');
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
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '&10073;&#10073;';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '&#9658;';
    }
});

audio.addEventListener('timeupdate', () => {
        
})
