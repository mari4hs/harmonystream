// Script principal do HarmonyStream - SIMPLES E FUNCIONAL
console.log('🎵 Script.js carregado');

// Função principal que configura TODOS os botões
function setupAllButtons() {
    console.log('🔧 Configurando botões...');

    // 1. Botão "Começar teste grátis"
    const btnFreeTrial = document.getElementById('btn-free-trial');
    if (btnFreeTrial) {
        btnFreeTrial.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🎵 Botão: Começar teste grátis');
            alert('🎵 Teste grátis iniciado!');
        });
        console.log('✅ Botão teste grátis configurado');
    }

    // 2. Botão "Ver planos" 
    const btnSeePlans = document.getElementById('btn-see-plans');
    if (btnSeePlans) {
        btnSeePlans.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🎵 Botão: Ver planos');
            const plansSection = document.getElementById('plans');
            if (plansSection) {
                plansSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        console.log('✅ Botão ver planos configurado');
    }

    // 3. Botões dos planos (Começar/Experimente grátis)
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach((button, index) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(`🎵 Botão: Plano ${index + 1}`);
            alert(`🎵 Plano selecionado!`);
        });
    });
    console.log(`✅ ${planButtons.length} botões de planos configurados`);

    // 4. Botões de play nos artistas
    const playButtons = document.querySelectorAll('.play-overlay');
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(`🎵 Botão: Play artista ${index + 1}`);
            alert(`🎵 Reproduzindo artista!`);
        });
    });
    console.log(`✅ ${playButtons.length} botões de play configurados`);

    // 5. Botão de login
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            console.log('🎵 Botão: Login');
            // O link já funciona pelo href
        });
        console.log('✅ Botão login configurado');
    }

    console.log('✅ Todos os botões configurados!');
}

// Menu mobile
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        console.log('✅ Menu mobile configurado');
    }
}

// Player de música (se existir)
function setupMusicPlayer() {
    const playPauseBtn = document.getElementById('play-pause');
    if (playPauseBtn) {
        console.log('🎵 Player encontrado, configurando...');
        // Sua lógica do player aqui
    }
}

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Página carregada!');
    setupAllButtons();
    setupMobileMenu();
    setupMusicPlayer();
});

// Se o DOM já estiver carregado
if (document.readyState === 'complete') {
    setupAllButtons();
    setupMobileMenu();
    setupMusicPlayer();
}
// CÓDIGO DE EMERGÊNCIA 
function emergencyImageFix() {
    console.log('🚨 INICIANDO CORREÇÃO DE EMERGÊNCIA PARA IMAGENS');

    const imageMap = {
        // Hero Section
        'ariana-grande.jpg': 'assets/images/ariana-grande.jpg',
        'sabrina-carpenter.jpg': 'assets/images/sabrina-carpenter.jpg',
        'nessa-barrett.jpg': 'assets/images/nessa-barrett.jpg',

        // Artists Section  
        'ariana-featured.jpg': 'assets/images/artists/ariana-featured.jpg',
        'sabrina-featured.jpg': 'assets/images/artists/sabrina-featured.jpg',
        'nessa-featured.jpg': 'assets/images/artists/nessa-featured.jpg',
        'taylor-featured.jpg': 'assets/images/artists/taylor-featured.jpg'
    };

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const filename = img.src.split('/').pop();
        if (imageMap[filename] && img.naturalHeight === 0) {
            console.log(`🔧 Corrigindo: ${filename} -> ${imageMap[filename]}`);
            img.src = imageMap[filename];
        }
    });
}

// Executar após 3 segundos como fallback
setTimeout(emergencyImageFix, 3000);