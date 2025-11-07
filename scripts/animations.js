// Sistema de Animações - Gerencia todas as animações do site
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupImageLoading();
        this.setupRippleEffects();
    }

    setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');

        if (loadingScreen) {
            const progress = loadingScreen.querySelector('.loading-progress');
            let width = 0;

            const loadingInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add('loaded');

                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 500);
                } else {
                    width += Math.random() * 15;
                    progress.style.width = Math.min(width, 100) + '%';
                }
            }, 100);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    if (entry.target.classList.contains('fade-in-up')) {
                        entry.target.style.animationPlayState = 'running';
                    }

                    if (entry.target.classList.contains('scroll-fade-in')) {
                        entry.target.classList.add('visible');
                    }
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scroll-fade-in'
        );

        animatedElements.forEach(el => observer.observe(el));
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.artist-card, .plan-card, .feature-card, .feature-highlight');
        cards.forEach(card => {
            card.classList.add('hover-lift');
        });

        const images = document.querySelectorAll('.artist-card img, .artist-img img');
        images.forEach(img => {
            img.classList.add('image-zoom');
        });
    }

    setupImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                const parent = img.closest('.artist-card, .artist-img');
                if (parent) {
                    parent.classList.add('loaded');
                }
            });

            img.addEventListener('error', () => {
                console.warn('Failed to load image:', img.src);
                const parent = img.closest('.artist-card, .artist-img');
                if (parent) {
                    parent.classList.add('loaded');
                }
            });
        });
    }

    setupRippleEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan, .btn-login-submit');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const existingRipples = this.querySelectorAll('.ripple');
                existingRipples.forEach(ripple => ripple.remove());

                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.classList.add('ripple');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    animateElement(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }

    setupTextReveal() {
        const headings = document.querySelectorAll('.section-title, .hero-content h1');

        headings.forEach(heading => {
            const text = heading.textContent;
            heading.innerHTML = '';

            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.animationDelay = `${index * 0.1}s`;
                span.classList.add('text-reveal');
                heading.appendChild(span);
            });
        });
    }
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});