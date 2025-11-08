// Animações simplificadas
function initLoadingSystem() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Esconder loading rapidamente
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 1000);
    }
}

function initAnimations() {
    // Animações de entrada básicas
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0)';
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initLoadingSystem();
    initAnimations();
});

window.addEventListener('load', function () {
    // Garantir que loading some
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
});