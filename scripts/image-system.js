// Sistema para gerenciar todas as imagens do site
// Cuida do carregamento lento (lazy loading), fallbacks e otimização de performance

class ImageSystem {
    constructor() {
        // COMENTÁRIO: Imagem padrão em SVG quando nenhuma imagem carrega
        // É uma imagem azul com texto "Imagem não carregada"
        this.defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzIzY2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VtIG7Do28gY2FycmVnYWRhPC90ZXh0Pjwvc3ZnPg==';
        this.init();
    }

    init() {
        // COMENTÁRIO: Método principal que inicia todo o sistema
        console.log('🖼️ Iniciando sistema de imagens...');

        this.setupLazyLoading();
        this.setupImageFallbacks();
        this.preloadCriticalImages();
        this.optimizeImageLoading();

        console.log('✅ Sistema de imagens configurado');
    }

    setupLazyLoading() {
        // COMENTÁRIO: Lazy loading = carrega imagens apenas quando aparecem na tela
        // Isso melhora MUITO a velocidade de carregamento da página

        const lazyImages = document.querySelectorAll('img[data-src]');

        if (lazyImages.length === 0) {
            console.log('ℹ️ Nenhuma imagem com lazy loading encontrada');
            return;
        }

        console.log(`🔍 Encontradas ${lazyImages.length} imagens para lazy loading`);

        // COMENTÁRIO: IntersectionObserver observa quando elementos entram na tela
        // É uma API moderna do JavaScript muito eficiente
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // COMENTÁRIO: Quando a imagem aparece na tela (ou perto), carrego ela
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img); // Paro de observar para economizar recursos

                    console.log(`🔄 Imagem carregada via lazy loading: ${img.dataset.src}`);
                }
            });
        }, {
            rootMargin: '50px 0px', // Começa a carregar 50px antes da imagem aparecer
            threshold: 0.1 // 10% da imagem precisa estar visível
        });

        // COMENTÁRIO: Começo a observar cada imagem com data-src
        lazyImages.forEach(img => {
            imageObserver.observe(img);

            // Adiciono efeito de loading (skeleton) enquanto a imagem não carrega
            img.classList.add('skeleton');
        });
    }

    loadImage(img) {
        // COMENTÁRIO: Carrego uma imagem individualmente
        const src = img.dataset.src;

        // COMENTÁRIO: Uso um objeto Image temporário para testar o carregamento
        const image = new Image();

        image.onload = () => {
            // COMENTÁRIO: Quando a imagem carrega com sucesso
            img.src = src;
            img.classList.remove('skeleton');
            img.classList.add('loaded');
            console.log(`✅ Imagem carregada: ${src}`);
        };

        image.onerror = () => {
            // COMENTÁRIO: Se der erro no carregamento, uso o sistema de fallback
            console.error(`❌ Erro ao carregar: ${src}`);
            this.applyFallback(img);
        };

        image.src = src; // Inicio o carregamento
    }

    setupImageFallbacks() {
        // COMENTÁRIO: Configuro fallbacks para TODAS as imagens do site
        // Fallback = plano B quando a imagem principal não carrega

        const images = document.querySelectorAll('img');
        console.log(`📸 Configurando fallbacks para ${images.length} imagens`);

        images.forEach(img => {
            // COMENTÁRIO: Verifico se a imagem já falhou (pode acontecer em conexões lentas)
            if (img.complete && img.naturalHeight === 0) {
                console.log(`⚠️ Imagem já falhou ao carregar: ${img.src}`);
                this.applyFallback(img);
            }

            // COMENTÁRIO: Adiciono listener para capturar erros futuros no carregamento
            img.addEventListener('error', (e) => {
                console.log(`❌ Erro no carregamento da imagem: ${e.target.src}`);
                this.applyFallback(e.target);
            });

            // COMENTÁRIO: Listener para quando a imagem carrega com sucesso
            img.addEventListener('load', () => {
                console.log(`✅ Imagem carregada com sucesso: ${img.src}`);
                img.classList.add('loaded');
            });
        });
    }

    applyFallback(img) {
        // COMENTÁRIO: Quando uma imagem falha, tento caminhos alternativos
        const filename = this.extractFilename(img.src);
        console.log(`🔄 Aplicando fallback para: ${filename}`);

        // COMENTÁRIO: Lista de caminhos alternativos para tentar, em ordem de prioridade
        const alternativePaths = [
            `assets/images/${filename}`,           // Primeiro tenta na pasta principal
            `assets/images/artists/${filename}`,   // Depois na pasta de artistas
            `assets/artists/${filename}`,          // Caminho alternativo
            `images/${filename}`,                  // Caminho simples
            `./assets/images/${filename}`          // Caminho relativo
        ];

        this.tryAlternativePaths(img, alternativePaths);
    }

    tryAlternativePaths(img, paths, index = 0) {
        // COMENTÁRIO: Tento cada caminho alternativo até achar um que funcione

        if (index >= paths.length) {
            // COMENTÁRIO: Se nenhum caminho alternativo funcionar, uso a imagem padrão
            console.log('⚠️ Todos os caminhos alternativos falharam, usando imagem padrão');
            img.src = this.defaultImage;
            img.alt = 'Imagem não disponível';
            img.classList.remove('skeleton');
            return;
        }

        const testImg = new Image();
        const currentPath = paths[index];

        testImg.onload = () => {
            // COMENTÁRIO: Este caminho funciona! Atualizo a imagem original
            console.log(`✅ Sucesso com caminho alternativo: ${currentPath}`);
            img.src = currentPath;
            img.classList.remove('skeleton');
        };

        testImg.onerror = () => {
            // COMENTÁRIO: Este caminho falhou, tento o próximo da lista
            console.log(`❌ Falha com caminho: ${currentPath}`);
            this.tryAlternativePaths(img, paths, index + 1);
        };

        testImg.src = currentPath;
    }

    extractFilename(path) {
        // COMENTÁRIO: Extrai o nome do arquivo de uma URL completa
        // Exemplo: "https://site.com/images/photo.jpg" → "photo.jpg"
        // Exemplo: "assets/images/artista.jpg" → "artista.jpg"
        return path.split('/').pop();
    }

    preloadCriticalImages() {
        // COMENTÁRIO: Pré-carrego imagens importantes que estão "above the fold"
        // "Above the fold" = o que o usuário vê sem precisar rolar a página

        const criticalImages = [
            'ariana-grande.jpg',
            'sabrina-carpenter.jpg',
            'nessa-barrett.jpg',
            'ariana-featured.jpg',
            'sabrina-featured.jpg',
            'nessa-featured.jpg',
            'taylor-featured.jpg'
        ];

        console.log('🚀 Pré-carregando imagens críticas...');

        criticalImages.forEach(filename => {
            const img = new Image();
            img.src = `assets/images/${filename}`;

            img.onload = () => {
                console.log(`✅ Imagem crítica pré-carregada: ${filename}`);
            };

            img.onerror = () => {
                console.log(`❌ Falha ao pré-carregar imagem crítica: ${filename}`);
            };
        });
    }

    optimizeImageLoading() {
        // COMENTÁRIO: Método para adicionar atributos de performance nas imagens
        // Isso usa recursos nativos do navegador para melhorar o carregamento

        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // COMENTÁRIO: Adiciono lazy loading nativo se não tiver
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // COMENTÁRIO: Decodificação assíncrona para não travar a página
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            // COMENTÁRIO: Se a imagem não tem alt, adiciono um placeholder
            if (!img.hasAttribute('alt') || img.alt === '') {
                img.alt = 'Imagem do HarmonyStream';
            }
        });

        console.log(`⚡ ${images.length} imagens otimizadas para performance`);
    }

    // COMENTÁRIO: Método para verificar o status de todas as imagens (útil para debug)
    checkImageStatus() {
        const images = document.querySelectorAll('img');
        let loaded = 0;
        let errors = 0;
        let loading = 0;

        images.forEach(img => {
            if (img.complete) {
                if (img.naturalHeight === 0) {
                    errors++;
                } else {
                    loaded++;
                }
            } else {
                loading++;
            }
        });

        console.log(`📊 Status das imagens:`);
        console.log(`   ✅ Carregadas: ${loaded}`);
        console.log(`   ❌ Com erro: ${errors}`);
        console.log(`   🔄 Carregando: ${loading}`);
        console.log(`   📦 Total: ${images.length}`);

        return { loaded, errors, loading, total: images.length };
    }

    // COMENTÁRIO: Método para forçar o recarregamento de imagens com erro
    reloadFailedImages() {
        const images = document.querySelectorAll('img');
        let reloaded = 0;

        images.forEach(img => {
            if (img.complete && img.naturalHeight === 0) {
                // COMENTÁRIO: Imagem com erro, tento recarregar
                const src = img.src;
                img.src = '';
                img.src = src;
                reloaded++;
                console.log(`🔄 Tentando recarregar: ${src}`);
            }
        });

        console.log(`🔧 ${reloaded} imagens com erro recarregadas`);
        return reloaded;
    }
}

// COMENTÁRIO: Inicializo o sistema quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    window.imageSystem = new ImageSystem();
});

// COMENTÁRIO: Se o DOM já estiver carregado quando o script carregar
if (document.readyState === 'complete') {
    window.imageSystem = new ImageSystem();
}

// COMENTÁRIO: Disponibilizo métodos úteis no console para teste e debug
window.imageSystemUtils = {
    checkStatus: () => window.imageSystem?.checkImageStatus(),
    reloadFailed: () => window.imageSystem?.reloadFailedImages(),
    listImages: () => {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            console.log(`${index + 1}. ${img.src} - ${img.complete ? (img.naturalHeight === 0 ? '❌ Erro' : '✅ OK') : '🔄 Carregando'}`);
        });
    }
};

console.log('🎵 image-system.js carregado - use imageSystemUtils no console para debug');