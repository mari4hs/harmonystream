// Language System
class LanguageManager {
    constructor() {
        this.currentLang = 'pt-BR';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSwitcher();
        const savedLang = this.loadPreference();
        this.applyLanguage(savedLang);
    }

    async loadTranslations() {
        try {
            const response = await fetch('data/translations.json');
            this.translations = await response.json();
            console.log('Translations loaded successfully:', this.translations);
        } catch (error) {
            console.error('Error loading translations:', error);
            this.translations = {
                'pt-BR': {},
                'en': {}
            };
        }
    }

    setupLanguageSwitcher() {
        const languageBtns = document.querySelectorAll('.language-btn');

        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.applyLanguage(lang);
            this.updateLanguageButtons(lang);
            this.savePreference(lang);
        }
    }

    applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        console.log(`Applying language: ${lang}, found ${elements.length} elements to translate`);

        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key, lang);

            if (translation !== null && translation !== undefined) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } else {
                    // Handle array translations for tags
                    if (Array.isArray(translation) && element.classList.contains('artist-tags')) {
                        this.handleArrayTranslation(element, translation);
                    } else {
                        element.textContent = translation;
                    }
                }
            } else {
                console.warn(`No translation found for key: ${key}`);
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update page title
        this.updatePageTitle(lang);
    }

    handleArrayTranslation(element, translationArray) {
        const spans = element.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (translationArray[index]) {
                span.textContent = translationArray[index];
            }
        });
    }

    getTranslation(key, lang) {
        const keys = key.split('.');
        let value = this.translations[lang];

        // Handle array syntax like tags[0]
        const arrayMatch = key.match(/(.+)\.(\w+)\[(\d+)\]/);
        if (arrayMatch) {
            const baseKey = arrayMatch[1];
            const arrayName = arrayMatch[2];
            const index = parseInt(arrayMatch[3]);

            const baseValue = this.getNestedValue(this.translations[lang], baseKey.split('.'));
            if (baseValue && baseValue[arrayName] && Array.isArray(baseValue[arrayName])) {
                return baseValue[arrayName][index];
            }
            return null;
        }

        // Regular nested key access
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return null;
            }
        }

        return value;
    }

    getNestedValue(obj, keys) {
        let value = obj;
        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                return null;
            }
        }
        return value;
    }

    updatePageTitle(lang) {
        const title = document.querySelector('title');
        if (title) {
            if (window.location.pathname.includes('login.html')) {
                title.textContent = lang === 'pt-BR' ? 'Login - HarmonyStream' : 'Login - HarmonyStream';
            } else {
                title.textContent = lang === 'pt-BR' ? 'HarmonyStream - Sua Música, Sua Emoção' : 'HarmonyStream - Your Music, Your Emotion';
            }
        }
    }

    updateLanguageButtons(activeLang) {
        const languageBtns = document.querySelectorAll('.language-btn');

        languageBtns.forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    savePreference(lang) {
        try {
            localStorage.setItem('harmonystream-language', lang);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
    }

    loadPreference() {
        try {
            return localStorage.getItem('harmonystream-language') || 'pt-BR';
        } catch (e) {
            console.warn('Could not load language preference:', e);
            return 'pt-BR';
        }
    }
}

// Initialize Language Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});