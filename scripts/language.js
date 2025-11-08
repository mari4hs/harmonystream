// Sistema de internacionalização - SIMPLIFICADO
class TranslationSystem {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'pt-BR';
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSystem();
        this.applyTranslations();
    }

    async loadTranslations() {
        try {
            const response = await fetch('data/translations.json');
            this.translations = await response.json();
            console.log('✅ Traduções carregadas');
        } catch (error) {
            console.error('❌ Erro ao carregar traduções:', error);
            this.loadFallbackTranslations();
        }
    }

    loadFallbackTranslations() {
        this.translations = {
            'pt-BR': {
                'play': 'Reproduzir', 'pause': 'Pausar', 'next': 'Próxima', 'previous': 'Anterior',
                'volume': 'Volume', 'currentTime': 'Tempo atual', 'duration': 'Duração',
                'nowPlaying': 'Tocando agora', 'login': 'Entrar', 'logout': 'Sair',
                'settings': 'Configurações', 'language': 'Idioma', 'loading': 'Carregando...',
                'nav.home': 'Início', 'nav.artists': 'Artistas', 'nav.plans': 'Planos', 'nav.login': 'Entrar',
                'hero.title': 'Ouça suas artistas pop favoritas sem limites',
                'hero.subtitle': 'Milhões de músicas. Zero anúncios. A experiência musical definitiva.',
                'hero.trial': 'Começar teste grátis', 'hero.plans': 'Ver planos',
                'artists.title': 'Artistas em Destaque',
                'artists.subtitle': 'Descubra os artistas que estão dominando as paradas',
                'plans.title': 'Escolha seu plano',
                'plans.subtitle': 'Experimente grátis por 30 dias. Cancele quando quiser.',
                'plans.badge': 'Mais Popular',
                'plans.start': 'Começar',
                'plans.trial': 'Experimente grátis'
            },
            'en-US': {
                'play': 'Play', 'pause': 'Pause', 'next': 'Next', 'previous': 'Previous',
                'volume': 'Volume', 'currentTime': 'Current time', 'duration': 'Duration',
                'nowPlaying': 'Now playing', 'login': 'Login', 'logout': 'Logout',
                'settings': 'Settings', 'language': 'Language', 'loading': 'Loading...',
                'nav.home': 'Home', 'nav.artists': 'Artists', 'nav.plans': 'Plans', 'nav.login': 'Login',
                'hero.title': 'Listen to your favorite pop artists without limits',
                'hero.subtitle': 'Millions of songs. Zero ads. The ultimate music experience.',
                'hero.trial': 'Start free trial', 'hero.plans': 'See plans',
                'artists.title': 'Featured Artists',
                'artists.subtitle': 'Discover the artists dominating the charts',
                'plans.title': 'Choose your plan',
                'plans.subtitle': 'Try free for 30 days. Cancel anytime.',
                'plans.badge': 'Most Popular',
                'plans.start': 'Get Started',
                'plans.trial': 'Try for free'
            },
            'es-ES': {
                'play': 'Reproducir', 'pause': 'Pausar', 'next': 'Siguiente', 'previous': 'Anterior',
                'volume': 'Volumen', 'currentTime': 'Tiempo actual', 'duration': 'Duración',
                'nowPlaying': 'Reproduciendo ahora', 'login': 'Iniciar sesión', 'logout': 'Cerrar sesión',
                'settings': 'Configuraciones', 'language': 'Idioma', 'loading': 'Cargando...',
                'nav.home': 'Inicio', 'nav.artists': 'Artistas', 'nav.plans': 'Planes', 'nav.login': 'Iniciar sesión',
                'hero.title': 'Escucha a tus artistas pop favoritos sin límites',
                'hero.subtitle': 'Millones de canciones. Cero anuncios. La experiencia musical definitiva.',
                'hero.trial': 'Comenzar prueba gratis', 'hero.plans': 'Ver planes',
                'artists.title': 'Artistas Destacados',
                'artists.subtitle': 'Descubre los artistas que dominan las listas',
                'plans.title': 'Elige tu plan',
                'plans.subtitle': 'Prueba gratis por 30 días. Cancela cuando quieras.',
                'plans.badge': 'Más Popular',
                'plans.start': 'Comenzar',
                'plans.trial': 'Probar gratis'
            }
        };
    }

    setupLanguageSystem() {
        const savedLanguage = localStorage.getItem('harmonystream-language');
        const browserLanguage = this.detectBrowserLanguage();
        this.currentLanguage = savedLanguage || browserLanguage;
        this.setupLanguageSwitchers();
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language;
        const langMap = { 'pt': 'pt-BR', 'en': 'en-US', 'es': 'es-ES' };
        const mainLang = browserLang.split('-')[0];
        return langMap[mainLang] || 'pt-BR';
    }

    setupLanguageSwitchers() {
        const languageBtns = document.querySelectorAll('.language-btn');
        languageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.changeLanguage(lang);
            });

            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    changeLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('harmonystream-language', lang);
            this.applyTranslations();
            this.updateLanguageButtons();
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);

            if (translation) {
                if (element.placeholder !== undefined) {
                    element.placeholder = translation;
                } else if (element.value !== undefined) {
                    element.value = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Traduzir botões específicos
        this.translateButtons();
    }

    translateButtons() {
        // Botão Começar teste grátis
        const btnTrial = document.getElementById('btn-free-trial');
        if (btnTrial) {
            btnTrial.textContent = this.getTranslation('hero.trial');
        }

        // Botão Ver planos
        const btnPlans = document.getElementById('btn-see-plans');
        if (btnPlans) {
            btnPlans.textContent = this.getTranslation('hero.plans');
        }

        // Botões dos planos
        const planBtns = document.querySelectorAll('.btn-plan');
        planBtns.forEach(btn => {
            if (btn.classList.contains('primary')) {
                btn.textContent = this.getTranslation('plans.trial');
            } else {
                btn.textContent = this.getTranslation('plans.start');
            }
        });

        // Badge Mais Popular
        const badge = document.querySelector('.popular-badge');
        if (badge) {
            badge.textContent = this.getTranslation('plans.badge');
        }
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    updateLanguageButtons() {
        const languageBtns = document.querySelectorAll('.language-btn');
        languageBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLanguage);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.translationSystem = new TranslationSystem();
});

// Funções globais
window.changeLanguage = (lang) => {
    if (window.translationSystem) {
        window.translationSystem.changeLanguage(lang);
    }
};