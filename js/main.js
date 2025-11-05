// =============================================
// CONFIGURAÇÃO DO PORTFÓLIO - VARIÁVEIS GLOBAIS
// =============================================

const PORTFOLIO_CONFIG = {
    // ANO BASE - ESTA É A VARIÁVEL QUE CONTROLA O ANO
    BASE_YEAR: 2025,
    
    // INFORMAÇÕES DO AUTOR
    AUTHOR: "Tarcísio Carneiro",
    
    // CONFIGURAÇÕES
    AUTO_UPDATE_YEAR: true,
    ANIMATE_YEAR_CHANGE: true,
    CHECK_INTERVAL: 3600000, // 1 hora em milissegundos
};

// =============================================
// SISTEMA DE ANIMAÇÃO DO ANO
// =============================================

class YearAnimationSystem {
    constructor() {
        this.currentDisplayYear = null;
        this.lastCheckedYear = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupYearElement();
        this.startYearChecker();
        this.isInitialized = true;
        
        console.log('🎉 Sistema de ano animado iniciado!');
    }

    // Configura o elemento do ano no footer
    setupYearElement() {
        const footerBottom = document.querySelector('.footer-bottom');
        if (!footerBottom) return;

        // Remove qualquer ano existente no HTML
        const existingCopyright = footerBottom.querySelector('p:first-child');
        if (existingCopyright) {
            existingCopyright.remove();
        }

        // Cria o elemento do copyright com container para animação
        const copyrightParagraph = document.createElement('p');
        copyrightParagraph.innerHTML = `&copy; <span id="copyright-year" class="year-container"></span> ${PORTFOLIO_CONFIG.AUTHOR}. Todos os direitos reservados.`;
        
        footerBottom.prepend(copyrightParagraph);
        
        // Renderiza o ano inicial
        this.renderYear();
    }

    // Calcula o ano para exibição
    calculateDisplayYear() {
        const currentYear = new Date().getFullYear();
        
        if (currentYear > PORTFOLIO_CONFIG.BASE_YEAR) {
            return `${PORTFOLIO_CONFIG.BASE_YEAR}-${currentYear}`;
        } else {
            return PORTFOLIO_CONFIG.BASE_YEAR.toString();
        }
    }

    // Renderiza o ano com animação
    renderYear(animate = false) {
        const newYear = this.calculateDisplayYear();
        const yearElement = document.getElementById('copyright-year');
        
        if (!yearElement) return;

        if (!this.currentDisplayYear || !animate) {
            // Renderização inicial ou sem animação
            this.wrapDigits(yearElement, newYear);
            this.currentDisplayYear = newYear;
            this.lastCheckedYear = new Date().getFullYear();
            return;
        }

        // Animação de mudança
        if (newYear !== this.currentDisplayYear) {
            this.animateYearChange(this.currentDisplayYear, newYear);
            this.currentDisplayYear = newYear;
            this.lastCheckedYear = new Date().getFullYear();
        }
    }

    // Envolve cada dígito em containers individuais
    wrapDigits(container, yearString) {
        container.innerHTML = '';
        
        for (let i = 0; i < yearString.length; i++) {
            const char = yearString[i];
            const isDigit = /\d/.test(char);
            
            if (isDigit) {
                const digitWrapper = document.createElement('span');
                digitWrapper.className = 'digit-wrapper';
                
                const digitSpan = document.createElement('span');
                digitSpan.className = 'year-digit';
                digitSpan.textContent = char;
                digitSpan.style.animationDelay = `${i * 0.1}s`;
                
                digitWrapper.appendChild(digitSpan);
                container.appendChild(digitWrapper);
            } else {
                // Para hífens ou outros caracteres
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                container.appendChild(charSpan);
            }
        }
    }

    // Anima a mudança de ano
    animateYearChange(oldYear, newYear) {
        const yearElement = document.getElementById('copyright-year');
        if (!yearElement) return;

        console.log(`🔄 Animando mudança de ano: ${oldYear} → ${newYear}`);

        // Efeito de celebração no footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.classList.add('celebrating');
            setTimeout(() => footer.classList.remove('celebrating'), 1000);
        }

        // Prepara os anos para animação
        const maxLength = Math.max(oldYear.length, newYear.length);
        const paddedOld = oldYear.padEnd(maxLength, ' ');
        const paddedNew = newYear.padEnd(maxLength, ' ');

        yearElement.innerHTML = '';

        for (let i = 0; i < maxLength; i++) {
            const oldChar = paddedOld[i];
            const newChar = paddedNew[i];
            const isDigit = /\d/.test(oldChar) && /\d/.test(newChar);

            if (isDigit && oldChar !== newChar && oldChar !== ' ' && newChar !== ' ') {
                // Dígito mudou - animação completa
                this.createDigitChangeAnimation(yearElement, oldChar, newChar, i);
            } else if (isDigit && oldChar === newChar) {
                // Dígito permaneceu - animação sutil
                this.createDigitSameAnimation(yearElement, newChar, i);
            } else {
                // Caractere especial ou espaço
                this.createCharElement(yearElement, newChar !== ' ' ? newChar : oldChar);
            }
        }

        // Log de celebração
        setTimeout(() => {
            console.log('🎉 Ano atualizado com sucesso!');
        }, 600);
    }

    // Cria animação para dígito que mudou
    createDigitChangeAnimation(container, oldDigit, newDigit, index) {
        const wrapper = document.createElement('span');
        wrapper.className = 'digit-wrapper';

        // Dígito antigo (caindo)
        const oldDigitSpan = document.createElement('span');
        oldDigitSpan.className = 'year-digit falling';
        oldDigitSpan.textContent = oldDigit;
        oldDigitSpan.style.animationDelay = `${index * 0.1}s`;

        // Dígito novo (entrando)
        const newDigitSpan = document.createElement('span');
        newDigitSpan.className = 'year-digit new';
        newDigitSpan.textContent = newDigit;
        newDigitSpan.style.animationDelay = `${index * 0.1}s`;

        wrapper.appendChild(oldDigitSpan);
        wrapper.appendChild(newDigitSpan);
        container.appendChild(wrapper);

        // Remove o dígito antigo após a animação
        setTimeout(() => {
            oldDigitSpan.remove();
        }, 500);
    }

    // Cria animação para dígito que permaneceu
    createDigitSameAnimation(container, digit, index) {
        const wrapper = document.createElement('span');
        wrapper.className = 'digit-wrapper';

        const digitSpan = document.createElement('span');
        digitSpan.className = 'year-digit same';
        digitSpan.textContent = digit;
        digitSpan.style.animationDelay = `${index * 0.1}s`;

        wrapper.appendChild(digitSpan);
        container.appendChild(wrapper);
    }

    // Cria elemento para caractere especial
    createCharElement(container, char) {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        container.appendChild(charSpan);
    }

    // Verifica se o ano mudou
    checkYearChange() {
        const currentYear = new Date().getFullYear();
        
        if (this.lastCheckedYear !== currentYear) {
            console.log(`🕐 Mudança de ano detectada: ${this.lastCheckedYear} → ${currentYear}`);
            this.renderYear(true);
        }
    }

    // Inicia a verificação periódica
    startYearChecker() {
        // Verifica a cada hora
        setInterval(() => {
            this.checkYearChange();
        }, PORTFOLIO_CONFIG.CHECK_INTERVAL);
        
        // Verifica também quando a página ganha foco
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkYearChange();
            }
        });
    }

    // Método para teste (remova em produção)
    testAnimation() {
        console.log('🧪 Testando animação...');
        const testYear = new Date().getFullYear() + 1;
        const testDisplay = `${PORTFOLIO_CONFIG.BASE_YEAR}-${testYear}`;
        this.animateYearChange(this.currentDisplayYear, testDisplay);
        
        // Restaura após o teste
        setTimeout(() => {
            this.renderYear(true);
        }, 2000);
    }
}

// =============================================
// SISTEMA DO MENU HAMBURGUER - CORRIGIDO
// =============================================

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createOverlay();
        this.bindEvents();
        console.log('🍔 Menu mobile inicializado!');
    }

    createOverlay() {
        // Remove overlay existente se houver
        const existingOverlay = document.querySelector('.menu-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Cria novo overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');

        if (!menuBtn || !navLinks) {
            console.error('❌ Elementos do menu não encontrados!');
            return;
        }

        // Click no botão do menu
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Click no overlay
        this.overlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Click nos links do menu
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Click no pseudo-elemento de fechar (::after)
        this.setupCloseButton(navLinks);
    }

    setupCloseButton(navLinks) {
        // Usando mutation observer para detectar clicks no pseudo-elemento
        const observer = new MutationObserver(() => {
            if (navLinks.classList.contains('active')) {
                // Adiciona evento de click na área do close
                navLinks.addEventListener('click', (e) => {
                    if (e.offsetX > navLinks.offsetWidth - 50 && e.offsetY < 50) {
                        this.closeMenu();
                    }
                });
            }
        });

        observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuBtn = document.getElementById('mobileMenuBtn');
        
        navLinks.classList.add('active');
        this.overlay.classList.add('active');
        document.body.classList.add('menu-open');
        menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.isOpen = true;
        
        console.log('📱 Menu aberto');
    }

    closeMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuBtn = document.getElementById('mobileMenuBtn');
        
        navLinks.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        this.isOpen = false;
        
        console.log('📱 Menu fechado');
    }
}

// =============================================
// INICIALIZAÇÃO DO SISTEMA
// =============================================

// Cria instâncias globais
const yearSystem = new YearAnimationSystem();
let mobileMenu;

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Smooth scrolling
function initSmoothScroll() {
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
}

// Form submission
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            console.log('Form submitted:', { name, email, subject, message });
            alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            this.reset();
        });
    }
}

// Navbar background on scroll
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = body.classList.contains('dark-mode') ? 
                    'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)';
            } else {
                nav.style.background = body.classList.contains('dark-mode') ? 
                    'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando portfólio...');
    
    // Inicia o sistema de ano
    if (PORTFOLIO_CONFIG.AUTO_UPDATE_YEAR) {
        yearSystem.init();
    }
    
    // Inicia o menu mobile
    mobileMenu = new MobileMenu();
    
    // Inicia outras funcionalidades
    initThemeToggle();
    initSmoothScroll();
    initContactForm();
    initNavbarScroll();
    
    // Adiciona classe loaded para transições
    document.body.classList.add('loaded');
    
    console.log('✅ Portfólio inicializado com sucesso!');
    
    // Para teste (remova em produção)
    // setTimeout(() => yearSystem.testAnimation(), 3000);
});

// Fallback se o DOM já estiver carregado
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(() => {
        if (PORTFOLIO_CONFIG.AUTO_UPDATE_YEAR) {
            yearSystem.init();
        }
        mobileMenu = new MobileMenu();
    }, 100);
}