// =============================================
// CONFIGURAÇÃO GLOBAL DO PORTFÓLIO
// =============================================



const PORTFOLIO_CONFIG = {
    // INFORMAÇÕES DO AUTOR
    AUTHOR: "Tarcísio Carneiro",

    // CONFIGURAÇÕES DO EMAILJS
    EMAILJS: {
        PUBLIC_KEY: "IHYyQz4Gbk-EPOTil",
        SERVICE_ID: "service_v7jlvg8",
        TEMPLATE_ID: "template_wper866"
    }
};

// =============================================
// SISTEMA DE MÁSCARA DE TELEFONE
// =============================================

class PhoneMaskSystem {
    constructor() {
        this.phoneInput = null;
    }

    init() {
        this.phoneInput = document.getElementById('phone');
        if (!this.phoneInput) return;

        this.bindPhoneEvents();
        console.log('📞 Sistema de máscara de telefone inicializado!');
    }

    bindPhoneEvents() {
        this.phoneInput.addEventListener('input', (e) => {
            this.applyPhoneMask(e);
        });

        this.phoneInput.addEventListener('keydown', (e) => {
            this.handlePhoneKeydown(e);
        });

        this.phoneInput.addEventListener('focus', () => {
            this.handlePhoneFocus();
        });

        this.phoneInput.addEventListener('blur', () => {
            this.validatePhoneFormat();
        });
    }

    applyPhoneMask(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 11);

        if (value.length > 0) {
            value = this.formatPhoneNumber(value);
        }

        e.target.value = value;
        this.updatePhoneValidationState(value);
    }

    formatPhoneNumber(numbers) {
        const numbersArray = numbers.split('');

        if (numbersArray.length <= 2) {
            return `(${numbersArray.join('')}`;
        }
        else if (numbersArray.length <= 7) {
            return `(${numbersArray[0]}${numbersArray[1]}) ${numbersArray.slice(2).join('')}`;
        }
        else if (numbersArray.length <= 11) {
            return `(${numbersArray[0]}${numbersArray[1]}) ${numbersArray.slice(2, 7).join('')}-${numbersArray.slice(7).join('')}`;
        }

        return numbers;
    }

    handlePhoneKeydown(e) {
        if ([8, 9, 13, 27, 46].includes(e.keyCode) ||
            (e.keyCode >= 37 && e.keyCode <= 40)) {
            return;
        }

        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    handlePhoneFocus() {
        if (!this.phoneInput.value) {
            this.phoneInput.value = '(';
            this.setCursorPosition(1);
        }

        this.phoneInput.classList.remove('phone-invalid');
        this.phoneInput.classList.add('phone-typing');
    }

    validatePhoneFormat() {
        const value = this.phoneInput.value;
        this.phoneInput.classList.remove('phone-typing');

        if (value && !this.isValidPhone(value)) {
            this.phoneInput.classList.add('phone-invalid');
            this.showPhoneHint('Telefone incompleto. Use: (21) 99999-9999');
        } else {
            this.phoneInput.classList.remove('phone-invalid');
            this.hidePhoneHint();
        }
    }

    updatePhoneValidationState(value) {
        if (value.length === 15) {
            this.phoneInput.classList.add('phone-valid');
            this.phoneInput.classList.remove('phone-invalid');
            this.hidePhoneHint();
        } else if (value.length > 0 && value.length < 15) {
            this.phoneInput.classList.remove('phone-valid');
        }
    }

    setCursorPosition(position) {
        setTimeout(() => {
            this.phoneInput.setSelectionRange(position, position);
        }, 0);
    }

    showPhoneHint(message) {
        this.hidePhoneHint();

        const hint = document.createElement('div');
        hint.className = 'phone-hint';
        hint.textContent = message;
        hint.style.cssText = `
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;

        this.phoneInput.parentNode.appendChild(hint);
    }

    hidePhoneHint() {
        const existingHint = this.phoneInput.parentNode.querySelector('.phone-hint');
        if (existingHint) existingHint.remove();
    }

    isValidPhone(phone) {
        return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(phone);
    }

    cleanPhoneNumber(phone) {
        return phone.replace(/\D/g, '');
    }
}

// =============================================
// SISTEMA DE MENU MOBILE
// =============================================

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.bindEvents();
        console.log('🍔 Menu mobile inicializado!');
    }

    createMobileMenu() {
        const existingOverlay = document.querySelector('.menu-overlay');
        const existingMobileMenu = document.querySelector('.nav-links.mobile-active');

        if (existingOverlay) existingOverlay.remove();
        if (existingMobileMenu) existingMobileMenu.remove();

        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        document.body.appendChild(this.overlay);

        const originalNav = document.querySelector('.nav-links');
        if (originalNav) {
            this.mobileNav = originalNav.cloneNode(true);
            this.mobileNav.classList.add('mobile-active');

            const closeBtn = document.createElement('button');
            closeBtn.className = 'menu-close-btn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.setAttribute('aria-label', 'Fechar menu');

            const title = document.createElement('div');
            title.className = 'menu-title';
            title.textContent = 'Menu';

            this.mobileNav.prepend(title);
            this.mobileNav.prepend(closeBtn);

            document.body.appendChild(this.mobileNav);
        }
    }

    bindEvents() {
        const menuBtn = document.getElementById('mobileMenuBtn');

        if (!menuBtn) {
            console.error('❌ Botão do menu não encontrado!');
            return;
        }

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.overlay.addEventListener('click', () => this.closeMenu());

        const closeBtn = document.querySelector('.menu-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMenu());
        }

        if (this.mobileNav) {
            this.mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeMenu();
        });

        if (this.mobileNav) {
            this.mobileNav.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');

        if (!this.mobileNav || !menuBtn) return;

        this.mobileNav.classList.add('show');
        this.overlay.classList.add('active');
        document.body.classList.add('menu-open');
        menuBtn.classList.add('active');
        menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        menuBtn.setAttribute('aria-expanded', 'true');
        this.isOpen = true;

        console.log('📱 Menu aberto');
    }

    closeMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');

        if (!this.mobileNav || !menuBtn) return;

        this.mobileNav.classList.remove('show');
        this.overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuBtn.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-expanded', 'false');
        this.isOpen = false;

        console.log('📱 Menu fechado');
    }
}

// =============================================
// SISTEMA DE FORMULÁRIO DE CONTATO
// =============================================

class ContactFormSystem {
    constructor() {
        this.isSubmitting = false;
        this.phoneMaskSystem = new PhoneMaskSystem();
        this.emailjsInitialized = false;
    }

    init() {
        this.phoneMaskSystem.init();
        this.bindFormEvents();
        this.initEmailJS();
        console.log('📧 Sistema de formulário inicializado!');
    }

    initEmailJS() {
        try {
            emailjs.init("IHYyQz4Gbk-EPOTil");
            this.emailjsInitialized = true;
            console.log('✅ EmailJS inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar EmailJS:', error);
            this.emailjsInitialized = false;
        }
    }

    bindFormEvents() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();

        switch (field.type) {
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    this.showFieldError(field, 'Nome deve ter pelo menos 2 caracteres');
                    return false;
                }
                break;

            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Email inválido');
                    return false;
                }
                break;

            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.showFieldError(field, 'Telefone inválido. Use: (21) 99999-9999');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(phone);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        field.classList.add('validation-error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;

        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('validation-error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        const form = e.target;
        const formData = this.collectFormData(form);

        if (!this.validateForm(formData)) return;

        await this.submitForm(formData, form);
    }

    collectFormData(form) {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            date: new Date().toLocaleString('pt-BR')
        };
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
            this.showNotification('❌ Preencha todos os campos obrigatórios', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('❌ Email inválido', 'error');
            return false;
        }

        if (!this.isValidPhone(data.phone)) {
            this.showNotification('❌ Telefone inválido. Use: (21) 99999-9999', 'error');
            return false;
        }

        if (data.message.length < 10) {
            this.showNotification('❌ Mensagem muito curta (mín. 10 caracteres)', 'error');
            return false;
        }

        if (data.message.length > 1000) {
            this.showNotification('❌ Mensagem muito longa (máx. 1000 caracteres)', 'error');
            return false;
        }

        return true;
    }

    async submitForm(formData, formElement) {
        this.isSubmitting = true;
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;

        try {
            if (!this.emailjsInitialized) {
                throw new Error('EmailJS não foi inicializado corretamente');
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            console.log('📤 Enviando dados:', formData);

            // ✅ VARIÁVEIS EXATAS DO SEU TEMPLATE
            const templateParams = {
                name: formData.name,        // {{name}} no template
                email: formData.email,      // {{email}} no template  
                phone: formData.phone,      // {{phone}} no template
                subject: formData.subject,  // {{subject}} no template
                message: formData.message,  // {{message}} no template
                date: formData.date         // {{date}} no template
            };

            console.log('📝 Parâmetros enviados para template:', templateParams);

            await emailjs.send(
                PORTFOLIO_CONFIG.EMAILJS.SERVICE_ID,
                PORTFOLIO_CONFIG.EMAILJS.TEMPLATE_ID,
                templateParams
            );

            console.log('✅ Email enviado com sucesso!');
            this.showNotification('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            formElement.reset();

        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);

            let errorMessage = '❌ Erro ao enviar mensagem. Tente novamente.';
            if (error.status === 400) {
                errorMessage = '❌ Erro de configuração. Verifique Service ID e Template ID.';
            } else if (error.text && error.text.includes('template ID')) {
                errorMessage = '❌ Template ID não encontrado. Verifique no dashboard.';
            }

            this.showNotification(errorMessage, 'error');

        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.isSubmitting = false;
        }
    }

    showNotification(message, type) {
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }
}

// =============================================
// SISTEMA DE TEMA (DARK/LIGHT MODE)
// =============================================

class ThemeSystem {
    constructor() {
        this.currentTheme = 'light';
    }

    init() {
        this.loadSavedTheme();
        this.bindThemeToggle();
        console.log('🌙 Sistema de tema inicializado!');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');

        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    bindThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
}

// =============================================
// SISTEMA DE SCROLL E NAVEGAÇÃO
// =============================================

class ScrollSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindSmoothScroll();
        this.bindNavbarScroll();
        console.log('🎯 Sistema de scroll inicializado!');
    }

    bindSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    bindNavbarScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const body = document.body;

            if (scrollY > 100) {
                nav.style.background = body.classList.contains('dark-mode')
                    ? 'rgba(30, 30, 30, 0.98)'
                    : 'rgba(255, 255, 255, 0.98)';
            } else {
                nav.style.background = body.classList.contains('dark-mode')
                    ? 'rgba(30, 30, 30, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
}

// =============================================
// INICIALIZAÇÃO DO SISTEMA
// =============================================

const themeSystem = new ThemeSystem();
const scrollSystem = new ScrollSystem();
const contactFormSystem = new ContactFormSystem();
let mobileMenu;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando portfólio...');

    themeSystem.init();
    scrollSystem.init();
    contactFormSystem.init();
    mobileMenu = new MobileMenu();

    document.body.classList.add('loaded');

    console.log('✅ Portfólio inicializado com sucesso!');
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(() => {
        themeSystem.init();
        scrollSystem.init();
        contactFormSystem.init();
        mobileMenu = new MobileMenu();
    }, 100);
}

// =============================================
// ESTILOS DINÂMICOS
// =============================================

const dynamicStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.form-notification button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.form-notification button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.validation-error {
    border-color: #f44336 !important;
    animation: shake 0.3s ease !important;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.field-error {
    color: #f44336 !important;
    font-size: 0.8rem !important;
    margin-top: 5px !important;
    animation: fadeIn 0.3s ease !important;
}

.phone-typing {
    border-color: #2196F3 !important;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

.phone-valid {
    border-color: #4CAF50 !important;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1) !important;
}

.phone-invalid {
    border-color: #f44336 !important;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1) !important;
}

.phone-hint {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 5px;
    animation: fadeIn 0.3s ease;
}

#phone::placeholder {
    color: #999;
    font-size: 0.9rem;
}

#phone:focus {
    border-color: #8A2BE2;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);