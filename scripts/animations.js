// Sistema de Animações - Gerencia todas as animações do site
class AnimationManager {
    constructor() {
        this.init(); // Inicia automaticamente quando a classe é criada
    }

    init() {
        // Configura todas as animações quando a página carrega
        this.setupLoadingScreen();      // Tela de carregamento inicial
        this.setupScrollAnimations();   // Animações ao rolar a página
        this.setupHoverEffects();       // Efeitos quando passa o mouse
        this.setupImageLoading();       // Controle de carregamento de imagens
        this.setupRippleEffects();      // Efeito de onda nos botões
    }

    setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');

        if (loadingScreen) {
            // Simula um processo de carregamento progressivo
            const progress = loadingScreen.querySelector('.loading-progress');
            let width = 0;

            // Intervalo que atualiza a barra de progresso
            const loadingInterval = setInterval(() => {
                if (width >= 100) {
                    // Quando chega a 100%, para o intervalo e esconde a tela
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add('loaded');

                    // Remove a tela do DOM depois da animação terminar
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 500);
                } else {
                    // Aumenta a largura de forma aleatória (entre 0-15%)
                    width += Math.random() * 15;
                    progress.style.width = Math.min(width, 100) + '%';
                }
            }, 100); // Atualiza a cada 100ms
        }
    }

    setupScrollAnimations() {
        // Usa Intersection Observer para animar elementos quando aparecem na tela
        // É mais eficiente que verificar scroll com event listeners
        const observerOptions = {
            threshold: 0.1,        // Dispara quando 10% do elemento está visível
            rootMargin: '0px 0px -50px 0px' // Margem negativa para animar antes do elemento chegar totalmente
        };

        // Cria o observador que monitora quando elementos entram/saem da tela
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Quando o elemento fica visível na tela
                    entry.target.classList.add('visible');

                    // Para elementos com fade-in-up, inicia a animação
                    if (entry.target.classList.contains('fade-in-up')) {
                        entry.target.style.animationPlayState = 'running';
                    }

                    // Para elementos com scroll-fade-in, marca como visível
                    if (entry.target.classList.contains('scroll-fade-in')) {
                        entry.target.classList.add('visible');
                    }
                }
            });
        }, observerOptions);

        // Seleciona TODOS os elementos que devem ser animados ao scroll
        const animatedElements = document.querySelectorAll(
            '.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scroll-fade-in'
        );

        // Começa a observar cada elemento
        animatedElements.forEach(el => observer.observe(el));
    }

    setupHoverEffects() {
        // Adiciona efeito de "levantar" quando passa o mouse nos cards
        const cards = document.querySelectorAll('.artist-card, .plan-card, .feature-card, .feature-highlight');

        cards.forEach(card => {
            card.classList.add('hover-lift'); // Classe CSS que faz o efeito
        });

        // Adiciona efeito de zoom nas imagens ao passar o mouse
        const images = document.querySelectorAll('.artist-card img, .artist-img img');
        images.forEach(img => {
            img.classList.add('image-zoom'); // Classe CSS que faz o zoom suave
        });
    }

    setupImageLoading() {
        // Controla o estado de carregamento das imagens (útil para lazy loading)
        const images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            // Quando a imagem carrega com sucesso
            img.addEventListener('load', () => {
                img.classList.add('loaded'); // Marca a imagem como carregada
                const parent = img.closest('.artist-card, .artist-img');
                if (parent) {
                    parent.classList.add('loaded'); // Marca o container também
                }
            });

            // Se houver erro no carregamento da imagem
            img.addEventListener('error', () => {
                console.warn('Failed to load image:', img.src);
                const parent = img.closest('.artist-card, .artist-img');
                if (parent) {
                    parent.classList.add('loaded'); // Mesmo com erro, marca como carregado para remover loading
                }
            });
        });
    }

    setupRippleEffects() {
        // Cria aquele efeito legal de onda quando clica em botões (como no Material Design)
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan, .btn-login-submit');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Remove ondas anteriores para não acumular
                const existingRipples = this.querySelectorAll('.ripple');
                existingRipples.forEach(ripple => ripple.remove());

                // Cria uma nova onda
                const ripple = document.createElement('span');

                // Calcula a posição exata do clique dentro do botão
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height); // Tamanho da onda
                const x = e.clientX - rect.left - size / 2;     // Posição X do clique
                const y = e.clientY - rect.top - size / 2;      // Posição Y do clique

                // Configura o elemento da onda
                ripple.classList.add('ripple');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6); // Cor branca semi-transparente
                    transform: scale(0);                   // Começa invisível
                    animation: ripple 0.6s linear;         // Animação de 0.6s
                    left: ${x}px;                          // Posição X
                    top: ${y}px;                           // Posição Y
                    width: ${size}px;                      // Largura
                    height: ${size}px;                     // Altura
                    pointer-events: none;                  // Não interfere com cliques
                `;

                // Prepara o botão para conter a onda
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                // Remove a onda depois da animação terminar
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Função utilitária para animar qualquer elemento rapidamente
    animateElement(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);        // Adiciona a classe de animação
        setTimeout(() => {
            element.classList.remove(animationClass); // Remove depois do tempo especificado
        }, duration);
    }

    // Animação de revelação de texto (cada palavra aparece sequencialmente)
    setupTextReveal() {
        const headings = document.querySelectorAll('.section-title, .hero-content h1');

        headings.forEach(heading => {
            const text = heading.textContent;
            heading.innerHTML = ''; // Limpa o conteúdo original

            // Divide o texto em palavras e cria um span para cada uma
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.animationDelay = `${index * 0.1}s`; // Delay progressivo para cada palavra
                span.classList.add('text-reveal');             // Classe que faz a animação
                heading.appendChild(span);
            });
        });
    }
}

// Adiciona a animação ripple ao CSS dinamicamente
// Isso garante que a animação esteja disponível mesmo se o CSS não tiver
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);  // A onda expande 4x seu tamanho
            opacity: 0;           // E some gradualmente
        }
    }
`;
document.head.appendChild(rippleStyle); // Adiciona ao <head> da página

// Inicializa o Gerenciador de Animações quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager(); // Torna acessível globalmente
});