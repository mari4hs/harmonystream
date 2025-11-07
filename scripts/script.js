// Configuração inicial do player
const player = document.getElementById('player');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const artistImage = document.getElementById('artist-image');
const progressContainer = document.querySelector('.progress-container');

// Lista de músicas
const songs = [
    {
        title: "Cruel Summer",
        artist: "Taylor Swift",
        src: "https://www.soundjay.com/music/sounds/crowd-cheering-1.mp3", // URL temporária para teste
        image: "assets/images/artists/taylor-swift.jpg"
    },
    {
        title: "positions",
        artist: "Ariana Grande",
        src: "https://www.soundjay.com/music/sounds/crowd-cheering-2.mp3", // URL temporária para teste
        image: "assets/images/artists/ariana-grande.jpg"
    },
    {
        title: "Feather",
        artist: "Sabrina Carpenter",
        src: "https://www.soundjay.com/music/sounds/crowd-cheering-3.mp3", // URL temporária para teste
        image: "assets/images/artists/sabrina-carpenter.jpg"
    },
    {
        title: "die first",
        artist: "Nessa Barrett",
        src: "https://www.soundjay.com/music/sounds/crowd-cheering-4.mp3", // URL temporária para teste
        image: "assets/images/artists/nessa-barrett.jpg"
    }
];

let currentSongIndex = 0;
let isPlaying = false;

// Carregar música
function loadSong() {
    const song = songs[currentSongIndex];

    console.log('Carregando música:', song); // Debug

    player.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    // Atualizar imagem do artista - CORRIGIDO O CAMINHO
    artistImage.src = song.image;
    artistImage.alt = `${song.artist} - ${song.title}`;

    // Adicionar tratamento de erro para imagem
    artistImage.onerror = function () {
        console.error(`Erro ao carregar imagem: ${song.image}`);
        // Tentar caminhos alternativos
        const alternativePaths = [
            `./${song.image}`,
            `../${song.image}`,
            `../../${song.image}`,
            'assets/images/artists/default.jpg'
        ];

        for (let path of alternativePaths) {
            console.log('Tentando caminho alternativo:', path);
            const img = new Image();
            img.onload = function () {
                artistImage.src = path;
                console.log('Imagem carregada com caminho alternativo:', path);
            };
            img.src = path;
        }
    };

    artistImage.onload = function () {
        console.log('Imagem carregada com sucesso:', song.image);
    };

    player.load();

    // Disparar evento de mudança de música para animações
    window.dispatchEvent(new CustomEvent('songChanged', {
        detail: { song: song }
    }));
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        player.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.setAttribute('data-i18n', 'play');
    } else {
        player.play().then(() => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('data-i18n', 'pause');
            isPlaying = true;
        }).catch(error => {
            console.error('Erro ao reproduzir:', error);
            // Tentar carregar a música novamente
            loadSong();
            setTimeout(() => {
                player.play().then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.setAttribute('data-i18n', 'pause');
                    isPlaying = true;
                });
            }, 500);
        });
    }
    isPlaying = !isPlaying;

    // Atualizar acessibilidade
    updateAriaLabels();

    // Animação do botão
    if (window.animatePlayButton) {
        window.animatePlayButton(playPauseBtn);
    }
}

// Próxima música
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
    if (isPlaying) {
        player.play().catch(error => {
            console.error('Erro ao reproduzir próxima música:', error);
        });
    }
}

// Música anterior
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong();
    if (isPlaying) {
        player.play().catch(error => {
            console.error('Erro ao reproduzir música anterior:', error);
        });
    }
}

// Atualizar progresso
function updateProgress() {
    if (player.duration) {
        const progressPercent = (player.currentTime / player.duration) * 100;
        progress.value = progressPercent;

        // Atualizar tempos
        currentTimeEl.textContent = formatTime(player.currentTime);
        durationEl.textContent = formatTime(player.duration);
    }
}

// Formatar tempo
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Definir progresso
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = player.duration;

    if (duration) {
        player.currentTime = (clickX / width) * duration;
    }
}

// Controlar volume
function setVolume() {
    player.volume = volumeSlider.value / 100;

    // Atualizar ícone do volume
    const volumeIcon = document.querySelector('.volume-icon');
    if (volumeIcon) {
        if (volumeSlider.value == 0) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volumeSlider.value < 50) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
}

// Atualizar labels de acessibilidade
function updateAriaLabels() {
    if (playPauseBtn) {
        const action = isPlaying ? 'pause' : 'play';
        playPauseBtn.setAttribute('aria-label', getTranslation(action));
    }

    if (prevBtn) {
        prevBtn.setAttribute('aria-label', getTranslation('previous'));
    }

    if (nextBtn) {
        nextBtn.setAttribute('aria-label', getTranslation('next'));
    }

    if (volumeSlider) {
        volumeSlider.setAttribute('aria-label', getTranslation('volume'));
    }
}

// Função auxiliar para obter traduções
function getTranslation(key) {
    if (window.getCurrentTranslation) {
        return window.getCurrentTranslation(key);
    }
    return key;
}

// Teclado shortcuts
function handleKeyPress(e) {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSong();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSong();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
            setVolume();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
            setVolume();
            break;
    }
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
player.addEventListener('timeupdate', updateProgress);
player.addEventListener('ended', nextSong);
player.addEventListener('loadedmetadata', updateProgress);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);

// Eventos de teclado
document.addEventListener('keydown', handleKeyPress);

// Swipe para mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - próxima música
            nextSong();
        } else {
            // Swipe right - música anterior
            prevSong();
        }
    }
}

// Inicializar
function initPlayer() {
    console.log('Inicializando player...');

    // Configurar volume inicial
    player.volume = 0.7;
    volumeSlider.value = 70;

    // Carregar primeira música
    loadSong();

    // Atualizar acessibilidade
    updateAriaLabels();

    console.log('Player inicializado com sucesso');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    initPlayer();
}

// Exportar funções para uso global
window.togglePlay = togglePlay;
window.nextSong = nextSong;
window.prevSong = prevSong;
window.loadSong = loadSong;
window.setVolume = setVolume;