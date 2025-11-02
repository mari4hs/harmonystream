// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header com efeito no scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(8, 18, 244, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.artist-featured, .plan-card, .feature-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Efeito de play nos artistas
document.querySelectorAll('.artist-img').forEach(artist => {
    artist.addEventListener('click', function () {
        const artistName = this.closest('.artist-featured').querySelector('h3').textContent;

        // Efeito visual de play
        const overlay = this.querySelector('.play-overlay');
        const originalBg = overlay.style.background;
        overlay.style.background = 'rgba(16, 185, 129, 0.9)';

        // Feedback visual
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);

        setTimeout(() => {
            overlay.style.background = originalBg;
        }, 600);

        // Simular reprodução
        console.log(`🎵 Playing ${artistName}...`);
    });
});

// Botões de ação
document.querySelectorAll('.btn-primary, .btn-plan.primary').forEach(button => {
    button.addEventListener('click', (e) => {
        // Efeito visual
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Simular ação
        setTimeout(() => {
            if (button.classList.contains('btn-primary')) {
                alert('🎵 Welcome to HarmonyStream! Redirecting to free trial...');
            } else {
                alert('🎵 Starting your free trial...');
            }
        }, 300);
    });
});

document.querySelectorAll('.btn-secondary, .btn-plan:not(.primary)').forEach(button => {
    button.addEventListener('click', (e) => {
        // Efeito visual
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Scroll para planos se não for página de login
        if (!window.location.pathname.includes('login.html')) {
            setTimeout(() => {
                const plansSection = document.querySelector('#plans');
                if (plansSection) {
                    plansSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 200);
        }
    });
});

// Integration with new systems
document.addEventListener('DOMContentLoaded', function () {
    // Initialize systems if they exist
    if (window.languageManager) {
        console.log('🌐 Language system initialized');
    }

    if (window.animationManager) {
        console.log('✨ Animation system initialized');
    }

    // Setup text animations
    const animationManager = window.animationManager;
    if (animationManager && typeof animationManager.setupTextReveal === 'function') {
        animationManager.setupTextReveal();
    }
});

// Handle image loading errors
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function () {
            console.warn('Image failed to load:', this.src);
            // You could set a placeholder image here
            // this.src = 'assets/images/placeholder.jpg';
        });
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function () {
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-plan.primary');
    ctaButtons.forEach(btn => {
        btn.classList.add('pulse');
    });

    // Add floating animation to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.classList.add('floating');
    });
});

console.log('🎵 HarmonyStream loaded successfully!');