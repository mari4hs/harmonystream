// =============================================
// MENU MOBILE - Hamburger para dispositivos menores
// =============================================

// Seleciona o ícone do menu hamburger e o menu de navegação
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Verifica se ambos elementos existem na página antes de adicionar eventos
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        // Alterna a classe 'active' em ambos elementos
        // Se não tem, adiciona; se tem, remove (toggle)
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fechar menu automaticamente ao clicar em um link
// Útil para mobile: depois de clicar em um link, o menu some
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// =============================================
// SCROLL SUAVE - Navegação fluida entre seções
// =============================================

// Seleciona todos os links que começam com # (âncoras internas)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Impede o comportamento padrão do link

        // Encontra o elemento alvo baseado no href do link
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            // Rola suavemente até o elemento alvo
            target.scrollIntoView({
                behavior: 'smooth', // Animação suave
                block: 'start'      // Alinha o topo do elemento com o topo da viewport
            });
        }
    });
});

// =============================================
// HEADER DINÂMICO - Efeito ao rolar a página
// =============================================

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        // Quando o scroll vertical for maior que 100px
        if (window.scrollY > 100) {
            // Header fica mais opaco e com sombra (estilo "sticky")
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(8, 18, 244, 0.1)';
        } else {
            // Header volta ao estado original (no topo da página)
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// =============================================
// ANIMAÇÕES AO SCROLL - Elementos aparecem ao entrar na tela
// =============================================

// Configurações do Intersection Observer
const observerOptions = {
    threshold: 0.1,        // Dispara quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px' // Margem negativa para animar antes do elemento chegar
};

// Cria o observador que monitora quando elementos entram na viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Quando o elemento fica visível, aplica as animações
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Configura as animações quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos que serão animados
    const animatedElements = document.querySelectorAll('.artist-featured, .plan-card, .feature-card');

    // Prepara cada elemento com estado inicial invisível
    animatedElements.forEach(el => {
        el.style.opacity = '0';                     // Invisível
        el.style.transform = 'translateY(30px)';    // Deslocado para baixo
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Transição suave
        observer.observe(el); // Começa a observar o elemento
    });
});

// =============================================
// PLAYER SIMULADO - Efeitos interativos nos artistas
// =============================================

document.querySelectorAll('.artist-img').forEach(artist => {
    artist.addEventListener('click', function () {
        // Pega o nome do artista do card clicado
        const artistName = this.closest('.artist-featured').querySelector('h3').textContent;

        // Efeito visual: muda a cor do overlay para verde
        const overlay = this.querySelector('.play-overlay');
        const originalBg = overlay.style.background; // Guarda a cor original
        overlay.style.background = 'rgba(16, 185, 129, 0.9)'; // Verde de "playing"

        // Feedback tátil: efeito de pressionar
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)'; // Volta ao tamanho normal
        }, 200);

        // Restaura a cor original depois de 600ms
        setTimeout(() => {
            overlay.style.background = originalBg;
        }, 600);

        // Simula a reprodução no console (em um app real, tocaria música)
        console.log(`🎵 Playing ${artistName}...`);
    });
});

// =============================================
// BOTÕES DE AÇÃO - Comportamento dos CTAs principais
// =============================================

// Botões primários (teste grátis, etc.)
document.querySelectorAll('.btn-primary, .btn-plan.primary').forEach(button => {
    button.addEventListener('click', (e) => {
        // Efeito visual de clique
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Simula ação após um delay
        setTimeout(() => {
            if (button.classList.contains('btn-primary')) {
                alert('🎵 Welcome to HarmonyStream! Redirecting to free trial...');
            } else {
                alert('🎵 Starting your free trial...');
            }
        }, 300);
    });
});

// Botões secundários (ver planos, etc.)
document.querySelectorAll('.btn-secondary, .btn-plan:not(.primary)').forEach(button => {
    button.addEventListener('click', (e) => {
        // Efeito visual de clique
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Se não estiver na página de login, faz scroll suave para a seção de planos
        if (!window.location.pathname.includes('login.html')) {
            setTimeout(() => {
                const plansSection = document.querySelector('#plans');
                if (plansSection) {
                    plansSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 200);
        }
    });
});

// =============================================
// INTEGRAÇÃO ENTRE SISTEMAS - Comunicação entre módulos
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    // Verifica se os outros sistemas foram carregados e mostra no console
    if (window.languageManager) {
        console.log('🌐 Language system initialized');
    }

    if (window.animationManager) {
        console.log('✨ Animation system initialized');
    }

    // Configura animações de texto se o gerenciador de animações existir
    const animationManager = window.animationManager;
    if (animationManager && typeof animationManager.setupTextReveal === 'function') {
        animationManager.setupTextReveal();
    }
});

// =============================================
// TRATAMENTO DE ERROS - Fallbacks para imagens
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function () {
            // Avisa no console se uma imagem não carregar
            console.warn('Image failed to load:', this.src);
            // Em um projeto real, você poderia:
            // this.src = 'assets/images/placeholder.jpg'; // Usar uma imagem de fallback
        });
    });
});

// =============================================
// EFEITOS VISUAIS EXTRAS - Polimento final
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    // Adiciona animação de pulsar nos botões de call-to-action
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-plan.primary');
    ctaButtons.forEach(btn => {
        btn.classList.add('pulse'); // Classe CSS que faz pulsar suavemente
    });

    // Adiciona animação de flutuar nos ícones de features
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.classList.add('floating'); // Classe CSS que faz flutuar
    });
});

// =============================================
// CONFIRMAÇÃO DE CARREGAMENTO
// =============================================

console.log('🎵 HarmonyStream loaded successfully!');
// Esta mensagem aparece no console quando tudo carregou corretamente