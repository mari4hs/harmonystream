// Sistema de Internacionalização (i18n) - Gerencia múltiplos idiomas do site
// i18n significa "internationalization" (i + 18 letras + n)
class LanguageManager {
    constructor() {
        this.currentLang = 'pt-BR'; // Idioma padrão: Português Brasileiro
        this.translations = {};     // Aqui ficarão todas as traduções carregadas
        this.init();                // Inicia o sistema automaticamente
    }

    async init() {
        // Fluxo de inicialização do sistema de idiomas:
        await this.loadTranslations();     // 1. Carrega as traduções do arquivo JSON
        this.setupLanguageSwitcher();      // 2. Configura os botões de troca de idioma
        const savedLang = this.loadPreference(); // 3. Verifica se tem idioma salvo
        this.applyLanguage(savedLang);     // 4. Aplica o idioma escolhido
    }

    async loadTranslations() {
        try {
            // Faz uma requisição para carregar o arquivo de traduções
            // O 'await' espera a resposta antes de continuar
            const response = await fetch('data/translations.json');
            this.translations = await response.json(); // Converte a resposta para JSON
            console.log('Translations loaded successfully:', this.translations);
        } catch (error) {
            // Se der erro (arquivo não encontrado, etc.), usa traduções vazias
            console.error('Error loading translations:', error);
            this.translations = {
                'pt-BR': {}, // Português vazio
                'en': {}     // Inglês vazio
            };
        }
    }

    setupLanguageSwitcher() {
        // Encontra todos os botões de troca de idioma na página
        const languageBtns = document.querySelectorAll('.language-btn');

        // Adiciona evento de clique em cada botão
        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang; // Pega o idioma do data-atributo
                this.switchLanguage(lang);     // Troca para o idioma selecionado
            });
        });
    }

    switchLanguage(lang) {
        // Verifica se as traduções para esse idioma existem
        if (this.translations[lang]) {
            this.currentLang = lang;           // Atualiza o idioma atual
            this.applyLanguage(lang);          // Aplica as traduções na página
            this.updateLanguageButtons(lang);  // Atualiza a aparência dos botões
            this.savePreference(lang);         // Salva a preferência do usuário
        }
    }

    applyLanguage(lang) {
        // Encontra TODOS os elementos que precisam ser traduzidos
        // [data-translate] seleciona elementos com esse atributo
        const elements = document.querySelectorAll('[data-translate]');
        console.log(`Applying language: ${lang}, found ${elements.length} elements to translate`);

        // Para cada elemento traduzível na página...
        elements.forEach(element => {
            const key = element.dataset.translate; // Pega a chave de tradução
            const translation = this.getTranslation(key, lang); // Busca a tradução

            // Se encontrou uma tradução válida...
            if (translation !== null && translation !== undefined) {
                // Para inputs e textareas, traduz o placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                }
                // Para imagens, traduz o texto alternativo (alt)
                else if (element.tagName === 'IMG') {
                    element.alt = translation;
                }
                // Para outros elementos (div, span, p, h1, etc.)
                else {
                    // Trata traduções que são arrays (como tags de artistas)
                    if (Array.isArray(translation) && element.classList.contains('artist-tags')) {
                        this.handleArrayTranslation(element, translation);
                    } else {
                        // Tradução normal: substitui o texto do elemento
                        element.textContent = translation;
                    }
                }
            } else {
                // Avisa se não encontrou tradução para essa chave
                console.warn(`No translation found for key: ${key}`);
            }
        });

        // Atualiza o atributo lang do HTML (importante para acessibilidade e SEO)
        document.documentElement.lang = lang;

        // Atualiza o título da página
        this.updatePageTitle(lang);
    }

    handleArrayTranslation(element, translationArray) {
        // Usado para traduzir arrays (como as tags dos artistas: ["Pop", "R&B"])
        // Encontra todos os spans dentro do elemento (cada tag é um span)
        const spans = element.querySelectorAll('span');

        // Para cada span, usa a tradução correspondente do array
        spans.forEach((span, index) => {
            if (translationArray[index]) {
                span.textContent = translationArray[index];
            }
        });
    }

    getTranslation(key, lang) {
        // Divide a chave por pontos: "hero.title" vira ["hero", "title"]
        const keys = key.split('.');
        let value = this.translations[lang]; // Começa com as traduções do idioma

        // TRATAMENTO ESPECIAL PARA ARRAYS: tags[0], tags[1], etc.
        // Usa regex para detectar padrão como "artists.ariana.tags[0]"
        const arrayMatch = key.match(/(.+)\.(\w+)\[(\d+)\]/);
        if (arrayMatch) {
            const baseKey = arrayMatch[1];    // "artists.ariana"
            const arrayName = arrayMatch[2];  // "tags"
            const index = parseInt(arrayMatch[3]); // 0, 1, 2...

            // Busca o array dentro das traduções
            const baseValue = this.getNestedValue(this.translations[lang], baseKey.split('.'));
            if (baseValue && baseValue[arrayName] && Array.isArray(baseValue[arrayName])) {
                return baseValue[arrayName][index]; // Retorna o item específico do array
            }
            return null; // Se não encontrou, retorna null
        }

        // BUSCA NORMAL (para chaves sem arrays)
        // Navega pelo objeto de traduções: translations[lang].hero.title
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k]; // Vai descendo no objeto: hero → title
            } else {
                return null; // Se algum nível não existir, retorna null
            }
        }

        return value; // Retorna a tradução encontrada
    }

    getNestedValue(obj, keys) {
        // Função auxiliar para navegar em objetos aninhados
        // Exemplo: getNestedValue(translations, ['hero', 'title'])
        let value = obj;
        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key]; // Vai descendo: obj → hero → title
            } else {
                return null; // Caminho não existe
            }
        }
        return value; // Retorna o valor final
    }

    updatePageTitle(lang) {
        // Atualiza o título da página (<title> no <head>)
        const title = document.querySelector('title');
        if (title) {
            if (window.location.pathname.includes('login.html')) {
                // Se está na página de login, usa título específico
                title.textContent = lang === 'pt-BR' ? 'Login - HarmonyStream' : 'Login - HarmonyStream';
            } else {
                // Se está na página principal, usa título normal
                title.textContent = lang === 'pt-BR'
                    ? 'HarmonyStream - Sua Música, Sua Emoção'
                    : 'HarmonyStream - Your Music, Your Emotion';
            }
        }
    }

    updateLanguageButtons(activeLang) {
        // Atualiza a aparência dos botões de idioma (qual está ativo)
        const languageBtns = document.querySelectorAll('.language-btn');

        languageBtns.forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active');    // Destaca o botão do idioma atual
            } else {
                btn.classList.remove('active'); // Remove destaque dos outros
            }
        });
    }

    savePreference(lang) {
        // Salva a preferência de idioma no localStorage do navegador
        // Isso faz o site "lembrar" sua escolha entre visitas
        try {
            localStorage.setItem('harmonystream-language', lang);
        } catch (e) {
            // Se der erro (navegador em modo privado, etc.), só avisa
            console.warn('Could not save language preference:', e);
        }
    }

    loadPreference() {
        // Carrega a preferência de idioma salva anteriormente
        try {
            // Tenta carregar do localStorage, se não existir usa 'pt-BR'
            return localStorage.getItem('harmonystream-language') || 'pt-BR';
        } catch (e) {
            // Se der erro, usa o idioma padrão
            console.warn('Could not load language preference:', e);
            return 'pt-BR';
        }
    }
}

// Inicializa o Gerenciador de Idiomas quando a página terminar de carregar
// DOMContentLoaded significa "quando o HTML está totalmente carregado e parseado"
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager(); // Torna acessível globalmente
});