//Para trocar os textos entre português, inglês e espanhol

class TranslationSystem {
    constructor() {
        // COMENTÁRIO: Aqui guardo as traduções e a linguagem atual
        this.translations = {};
        this.currentLanguage = 'pt-BR'; // Linguagem padrão
        this.init();
    }

    async init() {
        // COMENTÁRIO: Inicializo o sistema de tradução
        console.log('🌐 Iniciando sistema de tradução...');

        await this.loadTranslations();
        this.setupLanguageSystem();
        this.applyTranslations();

        console.log('✅ Sistema de tradução pronto');
    }

    async loadTranslations() {
        // COMENTÁRIO: Carrego as traduções do arquivo JSON
        try {
            const response = await fetch('data/translations.json');
            this.translations = await response.json();
            console.log('📚 Traduções carregadas do arquivo');
        } catch (error) {
            // COMENTÁRIO: Se der erro, uso traduções de fallback
            console.error('❌ Erro ao carregar traduções:', error);
            this.loadFallbackTranslations();
        }
    }

    loadFallbackTranslations() {
        // COMENTÁRIO: Traduções de segurança caso o arquivo não carregue
        console.log('🔄 Carregando traduções de segurança...');

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
        // COMENTÁRIO: Configuro a linguagem inicial do site
        const savedLanguage = localStorage.getItem('harmonystream-language');
        const browserLanguage = this.detectBrowserLanguage();

        // COMENTÁRIO: Uso a linguagem salva, ou do navegador, ou padrão (pt-BR)
        this.currentLanguage = savedLanguage || browserLanguage;
        this.setupLanguageSwitchers();

        console.log(`🗣️ Linguagem definida: ${this.currentLanguage}`);
    }

    detectBrowserLanguage() {
        // COMENTÁRIO: Detectar a linguagem do navegador do usuário
        const browserLang = navigator.language;
        console.log(`🌍 Linguagem do navegador: ${browserLang}`);

        // COMENTÁRIO: Mapeio códigos simples (pt, en, es) para os completos
        const langMap = {
            'pt': 'pt-BR',
            'en': 'en-US',
            'es': 'es-ES'
        };

        const mainLang = browserLang.split('-')[0]; // Pego só 'pt' de 'pt-BR'
        return langMap[mainLang] || 'pt-BR'; // Se não achar, uso português
    }

    setupLanguageSwitchers() {
        // COMENTÁRIO: Configuro os botões de trocar idioma
        const languageBtns = document.querySelectorAll('.language-btn');

        languageBtns.forEach(btn => {
            // COMENTÁRIO: Adiciono evento de clique em cada botão
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                console.log(`🔄 Tentando mudar para: ${lang}`);
                this.changeLanguage(lang);
            });

            // COMENTÁRIO: Marco o botão da linguagem atual como ativo
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            }
        });

        console.log(`✅ ${languageBtns.length} botões de idioma configurados`);
    }

    changeLanguage(lang) {
        // COMENTÁRIO: Método principal para trocar de idioma
        if (this.translations[lang]) {
            this.currentLanguage = lang;

            // COMENTÁRIO: Salvo no localStorage para lembrar da escolha
            localStorage.setItem('harmonystream-language', lang);

            this.applyTranslations();
            this.updateLanguageButtons();

            console.log(`✅ Idioma alterado para: ${lang}`);
        } else {
            console.log(`❌ Idioma não suportado: ${lang}`);
        }
    }

    applyTranslations() {
        // COMENTÁRIO: Aplico as traduções em todos os elementos com data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`🔤 Aplicando traduções em ${elements.length} elementos`);

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);

            if (translation) {
                // COMENTÁRIO: Verifico se é input (placeholder) ou elemento normal
                if (element.placeholder !== undefined) {
                    element.placeholder = translation;
                } else if (element.value !== undefined) {
                    element.value = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // COMENTÁRIO: Traduzo botões específicos que não usam data-i18n
        this.translateButtons();
    }

    translateButtons() {
        // COMENTÁRIO: Botões que preciso traduzir manualmente
        const btnTrial = document.getElementById('btn-free-trial');
        if (btnTrial) {
            btnTrial.textContent = this.getTranslation('hero.trial');
        }

        const btnPlans = document.getElementById('btn-see-plans');
        if (btnPlans) {
            btnPlans.textContent = this.getTranslation('hero.plans');
        }

        // COMENTÁRIO: Botões dos planos
        const planBtns = document.querySelectorAll('.btn-plan');
        planBtns.forEach(btn => {
            if (btn.classList.contains('primary')) {
                btn.textContent = this.getTranslation('plans.trial');
            } else {
                btn.textContent = this.getTranslation('plans.start');
            }
        });

        // COMENTÁRIO: Badge "Mais Popular"
        const badge = document.querySelector('.popular-badge');
        if (badge) {
            badge.textContent = this.getTranslation('plans.badge');
        }
    }

    getTranslation(key) {
        // COMENTÁRIO: Busco uma tradução específica
        // Uso o ?. (optional chaining) para evitar erros se a chave não existir
        const translation = this.translations[this.currentLanguage]?.[key];

        if (!translation) {
            console.warn(`⚠️ Tradução não encontrada: ${key}`);
            return key; // Se não achar, retorno a própria chave
        }

        return translation;
    }

    updateLanguageButtons() {
        // COMENTÁRIO: Atualizo qual botão de idioma está ativo
        const languageBtns = document.querySelectorAll('.language-btn');

        languageBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-lang') === this.currentLanguage;
            btn.classList.toggle('active', isActive);
        });
    }
}

// COMENTÁRIO: Inicializo o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.translationSystem = new TranslationSystem();
});

// COMENTÁRIO: Função global para trocar idioma (pode ser chamada de qualquer lugar)
window.changeLanguage = (lang) => {
    if (window.translationSystem) {
        window.translationSystem.changeLanguage(lang);
    }
};