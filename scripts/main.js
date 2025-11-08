// Para controlar toda a interatividade do site

class HarmonyStream {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎵 HarmonyStream inicializado');

        this.hideLoadingScreen();
        this.setupMobileMenu();
        this.setupEventListeners();
        this.setupSmoothScroll();
        this.setupAnimations();
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                    console.log('✅ Tela de loading removida');
                }, 500);
            }, 800);
        }
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (!hamburger || !navMenu) {
            console.log('❌ Elementos do menu mobile não encontrados');
            return;
        }

        hamburger.addEventListener('click', () => {
            console.log('🍔 Hamburger clicado!');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                console.log('🔗 Link clicado, fechando menu...');
                this.closeMobileMenu();
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        console.log('✅ Menu mobile configurado');
    }

    closeMobileMenu() {
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.nav-menu')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupEventListeners() {
        this.setupButton('#btn-free-trial', () => {
            console.log('🎵 Iniciando teste grátis...');
            this.showTrialModal();
        });

        this.setupButton('#btn-see-plans', () => {
            console.log('📋 Indo para planos...');
            this.scrollToSection('#plans');
        });

        // Play buttons no novo layout pyramid
        document.querySelectorAll('.artists-pyramid-layout .play-overlay').forEach((overlay, index) => {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                const artistCard = overlay.closest('.artist-main, .artist-secondary');
                const artistName = artistCard?.querySelector('h3, h4')?.textContent;
                console.log(`🎤 Reproduzindo: ${artistName}`);
                this.playArtist(overlay);
            });
        });

        // Play buttons na seção de artistas
        document.querySelectorAll('.artist-featured .play-overlay').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🎤 Reproduzindo artista ${index + 1}`);
                this.playArtist(btn);
            });
        });

        // Botões dos planos
        document.querySelectorAll('.btn-plan').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`💳 Plano ${index + 1} selecionado`);
                this.handlePlanSelection(btn);
            });
        });

        console.log('✅ Event listeners configurados');
    }

    setupButton(selector, callback) {
        const button = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', callback);
        } else {
            console.log(`❌ Botão não encontrado: ${selector}`);
        }
    }

    scrollToSection(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.log(`❌ Seção não encontrada: ${selector}`);
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }

    setupAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    showTrialModal() {
        alert('🎵 Funcionalidade de teste grátis!\nEm um site real, aqui abriria um formulário de cadastro.');
    }

    handlePlanSelection(button) {
        const planCard = button.closest('.plan-card');
        const planName = planCard?.querySelector('h3')?.textContent;
        const planPrice = planCard?.querySelector('.price')?.textContent;

        console.log(`📦 Plano selecionado: ${planName} - ${planPrice}`);
        const originalText = button.textContent;
        button.textContent = 'Processando...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            alert(`🎉 Plano ${planName} selecionado com sucesso!\nEm um site real, aqui iria para o checkout.`);
        }, 1000);
    }

    playArtist(button) {
        const artistCard = button.closest('.artist-main, .artist-secondary, .artist-featured');
        const artistName = artistCard?.querySelector('h3, h4')?.textContent;

        console.log(`🎤 Reproduzindo: ${artistName}`);

        // Efeito visual no botão de play
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);

        alert(`🎵 Reproduzindo ${artistName}!\nEm um player real, aqui começaria a tocar música.`);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.harmonyApp = new HarmonyStream();
});

// Fallback para garantir que o loading some
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }
    }, 3000);
});

// Se estiver carregado
if (document.readyState === 'complete') {
    window.harmonyApp = new HarmonyStream();
}