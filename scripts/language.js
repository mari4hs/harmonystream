// Sistema de internacionalização para HarmonyStream

const translations = {
    'pt-BR': {
        'play': 'Reproduzir',
        'pause': 'Pausar',
        'next': 'Próxima',
        'previous': 'Anterior',
        'volume': 'Volume',
        'currentTime': 'Tempo atual',
        'duration': 'Duração',
        'nowPlaying': 'Tocando agora',
        'login': 'Entrar',
        'logout': 'Sair',
        'settings': 'Configurações',
        'language': 'Idioma',
        'portuguese': 'Português',
        'english': 'Inglês',
        'spanish': 'Espanhol',
        'loading': 'Carregando...',
        'musicPlayer': 'Player de Música',
        'currentSong': 'Música atual'
    },
    'en-US': {
        'play': 'Play',
        'pause': 'Pause',
        'next': 'Next',
        'previous': 'Previous',
        'volume': 'Volume',
        'currentTime': 'Current time',
        'duration': 'Duration',
        'nowPlaying': 'Now playing',
        'login': 'Login',
        'logout': 'Logout',
        'settings': 'Settings',
        'language': 'Language',
        'portuguese': 'Portuguese',
        'english': 'English',
        'spanish': 'Spanish',
        'loading': 'Loading...',
        'musicPlayer': 'Music Player',
        'currentSong': 'Current song'
    },
    'es-ES': {
        'play': 'Reproducir',
        'pause': 'Pausar',
        'next': 'Siguiente',
        'previous': 'Anterior',
        'volume': 'Volumen',
        'currentTime': 'Tiempo actual',
        'duration': 'Duración',
        'nowPlaying': 'Reproduciendo ahora',
        'login': 'Iniciar sesión',
        'logout': 'Cerrar sesión',
        'settings': 'Configuraciones',
        'language': 'Idioma',
        'portuguese': 'Portugués',
        'english': 'Inglés',
        'spanish': 'Español',
        'loading': 'Cargando...',
        'musicPlayer': 'Reproductor de Música',
        'currentSong': 'Canción actual'
    }
};

// Idioma padrão
let currentLanguage = 'pt-BR';

// Carregar traduções
async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        if (!response.ok) {
            throw new Error('Arquivo de traduções não encontrado, usando traduções locais');
        }
        const externalTranslations = await response.json();

        // Mesclar traduções externas com as locais
        Object.keys(externalTranslations).forEach(lang => {
            if (!translations[lang]) {
                translations[lang] = {};
            }
            Object.assign(translations[lang], externalTranslations[lang]);
        });

        console.log('Traduções carregadas com sucesso');
    } catch (error) {
        console.warn(error.message);
    } finally {
        applyTranslations();
    }
}

// Aplicar traduções
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);

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

    // Atualizar atributos aria-label
    updateAriaLabels();

    // Atualizar título da página se existir
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.getAttribute('data-i18n')) {
        const titleKey = pageTitle.getAttribute('data-i18n');
        const titleTranslation = getTranslation(titleKey);
        if (titleTranslation) {
            pageTitle.textContent = titleTranslation;
        }
    }

    console.log('Traduções aplicadas:', currentLanguage);
}

// Obter tradução específica
function getTranslation(key) {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }

    // Fallback para inglês se não encontrado no idioma atual
    if (translations['en-US'] && translations['en-US'][key]) {
        return translations['en-US'][key];
    }

    console.warn(`Tradução não encontrada para a chave: ${key}`);
    return key;
}

// Atualizar labels de acessibilidade
function updateAriaLabels() {
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const volumeSlider = document.getElementById('volume');

    if (playPauseBtn) {
        const action = window.isPlaying ? 'pause' : 'play';
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

// Alterar idioma
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('harmonystream-language', lang);

        // Aplicar traduções
        applyTranslations();

        // Atualizar acessibilidade
        updateAriaLabels();

        // Disparar evento personalizado para notificar mudança de idioma
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        // Animação de transição de idioma
        animateLanguageChange();

        console.log('Idioma alterado para:', lang);
    } else {
        console.error('Idioma não suportado:', lang);
    }
}

// Animação para mudança de idioma
function animateLanguageChange() {
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.style.transform = 'scale(0.98)';
        playerContainer.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
            playerContainer.style.transform = 'scale(1)';
        }, 300);
    }
}

// Detectar idioma do navegador
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const supportedLangs = Object.keys(translations);

    // Verificar se o idioma do navegador é suportado
    if (supportedLangs.includes(browserLang)) {
        return browserLang;
    }

    // Verificar apenas o código principal (pt, en, es)
    const mainLang = browserLang.split('-')[0];
    const langMap = {
        'pt': 'pt-BR',
        'en': 'en-US',
        'es': 'es-ES'
    };

    return langMap[mainLang] || 'pt-BR';
}

// Criar seletor de idioma
function createLanguageSelector() {
    const existingSelector = document.getElementById('language-selector');
    if (existingSelector) {
        existingSelector.remove();
    }

    const selector = document.createElement('div');
    selector.id = 'language-selector';
    selector.className = 'language-selector';
    selector.innerHTML = `
        <button class="lang-btn" data-lang="pt-BR">🇧🇷</button>
        <button class="lang-btn" data-lang="en-US">🇺🇸</button>
        <button class="lang-btn" data-lang="es-ES">🇪🇸</button>
    `;

    // Estilos para o seletor de idioma
    const styles = `
        .language-selector {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        .lang-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .lang-btn:hover {
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        .lang-btn.active {
            border-color: #6a11cb;
            background: rgba(106, 17, 203, 0.2);
        }
    `;

    // Adicionar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Adicionar event listeners
    selector.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);

            // Atualizar estado ativo
            selector.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });

        // Marcar botão ativo
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });

    document.body.appendChild(selector);
}

// Inicializar sistema de idioma
function initLanguageSystem() {
    // Verificar se há idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('harmonystream-language');

    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // Detectar idioma do navegador
        currentLanguage = detectBrowserLanguage();
    }

    // Carregar e aplicar traduções
    loadTranslations();

    // Criar seletor de idioma
    createLanguageSelector();

    console.log('Sistema de idioma inicializado:', currentLanguage);
}

// Atualizar função togglePlay para incluir atualização de aria-label
const originalTogglePlay = window.togglePlay;
window.togglePlay = function () {
    originalTogglePlay();
    setTimeout(updateAriaLabels, 100);
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initLanguageSystem);

// Exportar funções para uso global
window.changeLanguage = changeLanguage;
window.getCurrentLanguage = () => currentLanguage;
window.getTranslation = getTranslation;
window.getCurrentTranslation = getTranslation;