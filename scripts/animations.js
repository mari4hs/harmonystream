// Animation System
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
            // Simulate loading process
            const progress = loadingScreen.querySelector('.loading-progress');
            let width = 0;

            const loadingInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add('loaded');

                    // Remove from DOM after animation
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
        // Use Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Add specific animation classes based on existing classes
                    if (entry.target.classList.contains('fade-in-up')) {
                        entry.target.style.animationPlayState = 'running';
                    }

                    // Add visible class for scroll-fade-in elements
                    if (entry.target.classList.contains('scroll-fade-in')) {
                        entry.target.classList.add('visible');
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scroll-fade-in'
        );
        animatedElements.forEach(el => observer.observe(el));
    }

    setupHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.artist-card, .plan-card, .feature-card, .feature-highlight');

        cards.forEach(card => {
            card.classList.add('hover-lift');
        });

        // Image hover effects
        const images = document.querySelectorAll('.artist-card img, .artist-img img');
        images.forEach(img => {
            img.classList.add('image-zoom');
        });
    }

    setupImageLoading() {
        // Handle image loading states
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
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan, .btn-login-submit');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Remove existing ripples
                const existingRipples = this.querySelectorAll('.ripple');
                existingRipples.forEach(ripple => ripple.remove());

                // Create new ripple
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

    // Utility function to add animation to any element
    animateElement(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }

    // Text reveal animation
    setupTextReveal() {
        const headings = document.querySelectorAll('.section-title, .hero-content h1');

        headings.forEach(heading => {
            const text = heading.textContent;
            heading.innerHTML = '';

            // Create spans for each word
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

// Add ripple animation to CSS
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

// Initialize Animation Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});