// Animações para o HarmonyStream

// Configuração de animações
const animationConfig = {
    duration: {
        quick: 300,
        normal: 500,
        slow: 800
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

// Animação de entrada dos elementos
document.addEventListener('DOMContentLoaded', function () {
    initAnimations();
});

function initAnimations() {
    // Animação de fade-in para o player
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.style.opacity = '0';
        playerContainer.style.transform = 'translateY(30px)';

        setTimeout(() => {
            playerContainer.style.transition = `all ${animationConfig.duration.slow}ms ${animationConfig.easing}`;
            playerContainer.style.opacity = '1';
            playerContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    // Animação para a imagem do artista
    const artistImg = document.getElementById('artist-image');
    if (artistImg) {
        artistImg.style.opacity = '0';
        artistImg.style.transform = 'scale(0.8) rotate(-5deg)';

        setTimeout(() => {
            artistImg.style.transition = `all ${animationConfig.duration.normal}ms ${animationConfig.easing}`;
            artistImg.style.opacity = '1';
            artistImg.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }

    // Animação sequencial para controles
    const controls = document.querySelectorAll('.control-btn, .progress-container, .volume-control');
    controls.forEach((control, index) => {
        control.style.opacity = '0';
        control.style.transform = 'translateY(20px)';

        setTimeout(() => {
            control.style.transition = `all ${animationConfig.duration.normal}ms ${animationConfig.easing}`;
            control.style.opacity = '1';
            control.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });

    // Animação para informações da música
    const songInfo = document.querySelector('.song-info');
    if (songInfo) {
        songInfo.style.opacity = '0';

        setTimeout(() => {
            songInfo.style.transition = `opacity ${animationConfig.duration.normal}ms ease`;
            songInfo.style.opacity = '1';
        }, 800);
    }
}

// Animação para troca de música
function animateSongChange() {
    const artistImg = document.getElementById('artist-image');
    const songInfo = document.querySelector('.song-info');

    if (artistImg && songInfo) {
        // Animação de saída
        artistImg.style.transition = `all ${animationConfig.duration.quick}ms ease`;
        songInfo.style.transition = `opacity ${animationConfig.duration.quick}ms ease`;

        artistImg.style.transform = 'scale(0.9) translateX(-20px)';
        artistImg.style.opacity = '0.7';
        songInfo.style.opacity = '0.5';

        // Animação de entrada
        setTimeout(() => {
            artistImg.style.transition = `all ${animationConfig.duration.normal}ms ${animationConfig.easing}`;
            songInfo.style.transition = `opacity ${animationConfig.duration.normal}ms ease`;

            artistImg.style.transform = 'scale(1) translateX(0)';
            artistImg.style.opacity = '1';
            songInfo.style.opacity = '1';
        }, 150);
    }
}

// Animação para botão play/pause
function animatePlayButton(button) {
    if (!button) return;

    button.style.transform = 'scale(0.85)';
    button.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);

    // Efeito de ripple
    createRippleEffect(button);
}

// Efeito de onda (ripple) para botões
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left - size / 2 : size / 2;
    const y = event ? event.clientY - rect.top - size / 2 : size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Animação para barra de progresso
function animateProgressBar() {
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.transition = 'width 0.1s linear';
    }
}

// Animação de pulso para a imagem do artista quando está tocando
function createPulseAnimation() {
    const artistImg = document.getElementById('artist-image');
    if (!artistImg) return;

    if (window.isPlaying) {
        artistImg.style.animation = `pulse 2s infinite`;
    } else {
        artistImg.style.animation = 'none';
    }
}

// CSS animations dinâmicas
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes slideInFromBottom {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .slide-in {
            animation: slideInFromBottom 0.8s ease-out;
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Animação para loading
function showLoadingAnimation() {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-animation';
    loadingEl.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Carregando...</p>
    `;
    loadingEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
        text-align: center;
    `;

    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #6a11cb;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loadingEl);

    return loadingEl;
}

function hideLoadingAnimation(loadingEl) {
    if (loadingEl) {
        loadingEl.style.transition = 'opacity 0.3s ease';
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            loadingEl.remove();
        }, 300);
    }
}

// Listeners para eventos globais
window.addEventListener('songChanged', function () {
    animateSongChange();
});

window.addEventListener('play', function () {
    createPulseAnimation();
});

window.addEventListener('pause', function () {
    createPulseAnimation();
});

// Inicializar estilos de animação
injectAnimationStyles();

// Adicionar listeners de hover para todos os botões
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.control-btn, button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });

        button.addEventListener('mousedown', function (e) {
            createRippleEffect(this);
        });
    });
});

// Exportar funções para uso global
window.animatePlayButton = animatePlayButton;
window.animateSongChange = animateSongChange;
window.showLoadingAnimation = showLoadingAnimation;
window.hideLoadingAnimation = hideLoadingAnimation;
window.createRippleEffect = createRippleEffect;