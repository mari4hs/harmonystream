// Sistema de fallback para imagens - CORRIGIDO PARA OS NOMES CERTOS
class ImageFallback {
    constructor() {
        this.defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzIzY2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VtIG7Do28gY2FycmVnYWRhPC90ZXh0Pjwvc3ZnPg==';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🖼️ Iniciando sistema de imagens...');
            this.correctAllImagePaths();
            this.setupImageFallbacks();
        });
    }

    // CORREÇÃO: Mapeamento dos nomes corretos das imagens
    correctAllImagePaths() {
        const images = document.querySelectorAll('img');
        console.log(`📸 Encontradas ${images.length} imagens para corrigir`);

        images.forEach((img, index) => {
            const currentSrc = img.getAttribute('src') || img.src;
            console.log(`🔄 Imagem ${index + 1}: ${currentSrc}`);

            // Se a imagem tem caminho incorreto, corrigir
            if (currentSrc.includes('images/artists/') || currentSrc.includes('assets/images/')) {
                const filename = this.extractFilename(currentSrc);
                const correctPath = this.getCorrectPath(filename);

                if (correctPath) {
                    console.log(`🔧 Corrigindo: ${currentSrc} -> ${correctPath}`);
                    img.src = correctPath;
                    img.setAttribute('src', correctPath);
                }
            }
        });
    }

    // CORREÇÃO: Mapeamento dos nomes corretos
    getCorrectPath(filename) {
        const pathMap = {
            // Hero Section - nomes simples
            'ariana-grande.jpg': 'assets/images/ariana-grande.jpg',
            'sabrina-carpenter.jpg': 'assets/images/sabrina-carpenter.jpg',
            'nessa-barrett.jpg': 'assets/images/nessa-barrett.jpg',

            // Artists Section - nomes com featured
            'ariana-featured.jpg': 'assets/images/artists/ariana-featured.jpg',
            'sabrina-featured.jpg': 'assets/images/artists/sabrina-featured.jpg',
            'nessa-featured.jpg': 'assets/images/artists/nessa-featured.jpg',
            'taylor-featured.jpg': 'assets/images/artists/taylor-featured.jpg'
        };

        return pathMap[filename] || `assets/artists/${filename}`;
    }

    extractFilename(path) {
        return path.split('/').pop();
    }

    setupImageFallbacks() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // Verificar se a imagem já falhou
            if (img.complete && img.naturalHeight === 0) {
                console.log(`❌ Imagem já falhou: ${img.src}`);
                this.applyFallback(img);
            }

            img.addEventListener('error', (e) => {
                console.log(`❌ Erro ao carregar: ${e.target.src}`);
                this.applyFallback(e.target);
            });

            img.addEventListener('load', () => {
                console.log(`✅ Carregada: ${img.src}`);
            });
        });

        // Pré-carregar imagens críticas
        this.preloadCriticalImages();
    }

    applyFallback(img) {
        const filename = this.extractFilename(img.src);
        const alternativePaths = [
            `assets/artists/${filename}`,
            `artists/${filename}`,
            `./assets/artists/${filename}`,
            `./artists/${filename}`
        ];

        this.tryAlternativePaths(img, alternativePaths);
    }

    tryAlternativePaths(img, paths, index = 0) {
        if (index >= paths.length) {
            console.log('⚠️ Todas as alternativas falharam, usando fallback');
            img.src = this.defaultImage;
            return;
        }

        const testImg = new Image();
        testImg.onload = () => {
            console.log(`✅ Sucesso com: ${paths[index]}`);
            img.src = paths[index];
        };

        testImg.onerror = () => {
            this.tryAlternativePaths(img, paths, index + 1);
        };

        testImg.src = paths[index];
    }

    preloadCriticalImages() {
        const criticalImages = [
            'ariana-grande.jpg',
            'sabrina-carpenter.jpg',
            'nessa-barrett.jpg',
            'taylor-swift.jpg',
            'ariana-featured.jpg',
            'sabrina-featured.jpg',
            'nessa-featured.jpg',
            'taylor-featured.jpg'
        ];

        criticalImages.forEach(filename => {
            const img = new Image();
            img.src = `assets/artists/${filename}`;
            img.onload = () => console.log(`✅ Pré-carregada: ${filename}`);
            img.onerror = () => console.log(`❌ Falha ao pré-carregar: ${filename}`);
        });
    }
}

// Inicializar
new ImageFallback();