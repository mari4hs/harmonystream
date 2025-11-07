// =============================================
// SISTEMA PRINCIPAL - Funcionalidades do HarmonyStream
// =============================================

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('HarmonyStream - Inicializando...');

    // Inicializa todas as funcionalidades
    initMobileMenu();
    initHeaderScroll();
    initImageLoading();
    initButtons();
    initCardInteractions();
    initLoginFunctionality();

    console.log('HarmonyStream - Inicializado com sucesso!');
});

// =============================================
// MENU MOBILE - Funcionalidade do hamburger
// =============================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Alterna classes 'active' para animar o menu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Previne scroll do body quando menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fecha menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// =============================================
// HEADER SCROLL - Efeito ao rolar a página
// =============================================

function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            // Adiciona sombra quando scroll > 50px
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(8, 18, 244, 0.15)';
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            }
        });
    }
}

// =============================================
// CARREGAMENTO DE IMAGENS - Efeito de loading
// =============================================

function initImageLoading() {
    // Seleciona todas as imagens dos artistas
    const artistImages = document.querySelectorAll('.artist-card img, .artist-img img');

    // Para cada imagem, adiciona evento de carregamento
    artistImages.forEach(img => {
        // Adiciona classe 'loaded' quando a imagem carrega
        img.addEventListener('load', function () {
            this.classList.add('loaded');
            const parent = this.closest('.artist-card, .artist-img');
            if (parent) {
                parent.classList.add('loaded');
            }
        });

        // Remove animação de loading se houver erro
        img.addEventListener('error', function () {
            console.warn(`Imagem não carregada: ${this.src}`);
            this.classList.add('loaded');
            const parent = this.closest('.artist-card, .artist-img');
            if (parent) {
                parent.classList.add('loaded');
            }
        });

        // Se a imagem já está carregada, marca como loaded
        if (img.complete) {
            img.classList.add('loaded');
            const parent = img.closest('.artist-card, .artist-img');
            if (parent) {
                parent.classList.add('loaded');
            }
        }
    });
}

// =============================================
// BOTÕES PRINCIPAIS - Funcionalidades
// =============================================

function initButtons() {
    // Botão "Começar teste grátis"
    const btnFreeTrial = document.getElementById('btn-free-trial');
    if (btnFreeTrial) {
        btnFreeTrial.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Botão "Começar teste grátis" clicado');
            showMessage('Redirecionando para teste gratuito...', 'success');

            // Redireciona para a página de login após breve delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // Botão "Ver planos"
    const btnSeePlans = document.getElementById('btn-see-plans');
    if (btnSeePlans) {
        btnSeePlans.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Botão "Ver planos" clicado');

            // Rola suavemente para a seção de planos
            const plansSection = document.getElementById('plans');
            if (plansSection) {
                plansSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Botões dos planos
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const planName = this.closest('.plan-card').querySelector('h3').textContent;
            console.log(`Plano selecionado: ${planName}`);

            showMessage(`Iniciando assinatura do plano ${planName}...`, 'success');

            // Redireciona para a página de login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    });

    // Link de cadastro na página de login
    const signupLink = document.getElementById('signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Link de cadastro clicado');
            showMessage('Funcionalidade de cadastro em desenvolvimento!', 'info');
        });
    }

    // Link "Esqueceu a senha?"
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Link "Esqueceu a senha?" clicado');
            showMessage('Funcionalidade de recuperação de senha em desenvolvimento!', 'info');
        });
    }
}

// =============================================
// INTERATIVIDADE DOS CARDS - Efeitos de hover
// =============================================

function initCardInteractions() {
    // Adiciona efeitos de hover nos cards de artistas
    const artistCards = document.querySelectorAll('.artist-featured');

    artistCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Efeito de play nos overlays dos artistas
    const playOverlays = document.querySelectorAll('.play-overlay');
    playOverlays.forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            e.preventDefault();
            const artistName = this.closest('.artist-featured').querySelector('h3').textContent;
            console.log(`Reproduzindo música de ${artistName}`);
            showMessage(`Reproduzindo ${artistName}...`, 'success');
        });
    });
}

// =============================================
// FUNCIONALIDADE DO LOGIN - Validação e interação
// =============================================

function initLoginFunctionality() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Alterna visibilidade da senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Alterna entre tipo password e text
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna ícone do olho
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Validação do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = passwordInput.value;
            const rememberMe = document.getElementById('remember').checked;

            // Validação básica
            if (!email || !password) {
                showMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }

            // Simula envio do formulário
            simulateLogin(email, password, rememberMe);
        });
    }

    // Botões de login social
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const provider = this.classList.contains('google') ? 'Google' :
                this.classList.contains('apple') ? 'Apple' : 'Social';
            showMessage(`Login com ${provider} em desenvolvimento`, 'info');
        });
    });
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

// Valida formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Exibe mensagens para o usuário
function showMessage(message, type = 'info') {
    // Remove mensagens anteriores
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

    // Estilo baseado no tipo
    if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }

    document.body.appendChild(messageDiv);

    // Remove após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Simula processo de login
function simulateLogin(email, password, rememberMe) {
    const submitBtn = document.querySelector('.btn-login-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Mostra estado de loading
    btnText.style.opacity = '0';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    // Simula delay de rede
    setTimeout(() => {
        // Aqui normalmente faria uma requisição AJAX
        console.log('Login attempt:', { email, rememberMe });

        // Simula sucesso
        showMessage('Login realizado com sucesso!', 'success');

        // Redireciona após sucesso
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    }, 2000);
}

// =============================================
// ANIMAÇÕES CSS ADICIONAIS
// =============================================

// Adiciona keyframes para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Efeito de loading para imagens */
    .artist-card:not(.loaded),
    .artist-img:not(.loaded) {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    .artist-card.loaded,
    .artist-img.loaded {
        background: none;
        animation: none;
    }
`;

document.head.appendChild(style);

// =============================================
// OTIMIZAÇÕES DE PERFORMANCE
// =============================================

// Debounce para eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Otimiza eventos de scroll
window.addEventListener('scroll', debounce(() => {
    // Código que precisa executar no scroll
}, 10));