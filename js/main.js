// =============================================
// SISTEMA PRINCIPAL DO PORTFÓLIO
// =============================================



class PhoneMaskSystem {
    constructor(inputElement) {
        this.input = inputElement;
        this.handleInput = this.handleInput.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.input.addEventListener('input', this.handleInput);
        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('blur', this.handleBlur);
        this.input.addEventListener('keydown', this.handleKeydown);
    }

    handleInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 11);

        if (value.length > 0) {
            value = this.formatPhoneNumber(value);
        }

        e.target.value = value;
        this.updateValidationState(value);
    }

    handleKeydown(e) {
        if ([8, 9, 13, 27, 46].includes(e.keyCode) ||
            (e.keyCode >= 37 && e.keyCode <= 40)) {
            return;
        }

        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    handleFocus() {
        if (!this.input.value) {
            this.input.value = '(';
        }
        this.input.classList.add('phone-typing');
        this.clearError();
    }

    handleBlur() {
        this.input.classList.remove('phone-typing');
        this.validatePhoneFormat();
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

    updateValidationState(value) {
        if (value.length === 15 && this.isValidPhone(value)) {
            this.input.classList.add('phone-valid');
            this.input.classList.remove('phone-invalid');
            this.clearError();
        } else if (value.length > 0 && value.length < 15) {
            this.input.classList.remove('phone-valid');
        }
    }

    validatePhoneFormat() {
        const value = this.input.value;

        if (value && !this.isValidPhone(value)) {
            this.input.classList.add('phone-invalid');
            this.showError('Telefone incompleto. Use: (21) 99999-9999');
        } else {
            this.input.classList.remove('phone-invalid');
            this.clearError();
        }
    }

    isValidPhone(phone) {
        return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(phone);
    }

    showError(message) {
        this.clearError();
        const errorElement = document.createElement('div');
        errorElement.className = 'phone-hint';
        errorElement.textContent = message;
        this.input.parentNode.appendChild(errorElement);
    }

    clearError() {
        const existingError = this.input.parentNode.querySelector('.phone-hint');
        if (existingError) existingError.remove();
    }

    destroy() {
        this.input.removeEventListener('input', this.handleInput);
        this.input.removeEventListener('focus', this.handleFocus);
        this.input.removeEventListener('blur', this.handleBlur);
        this.input.removeEventListener('keydown', this.handleKeydown);
    }
}

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.navLinks = document.querySelector('.nav-links');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.handleClick = this.handleClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.menuBtn.addEventListener('click', this.handleClick);
        this.menuOverlay.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('resize', this.handleResize);

        // Fechar menu ao clicar em links
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    handleClick(e) {
        e.stopPropagation();
        this.toggle();
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isOpen) {
            this.close();
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.navLinks.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        this.menuBtn.setAttribute('aria-expanded', 'true');
        this.menuBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        this.isOpen = true;

        // Trap focus no menu
        this.trapFocus();
    }

    close() {
        this.navLinks.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.menuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        this.isOpen = false;
    }

    trapFocus() {
        const focusableElements = this.navLinks.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.navLinks.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        firstElement.focus();
    }

    destroy() {
        this.menuBtn.removeEventListener('click', this.handleClick);
        this.menuOverlay.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
    }
}

class ContactFormSystem {
    constructor() {
        this.isSubmitting = false;
        this.phoneMaskSystem = null;
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailjsInitialized = false;
    }

    init() {
        if (!this.form) return;

        this.phoneMaskSystem = new PhoneMaskSystem(document.getElementById('phone'));
        this.phoneMaskSystem.init();
        this.initEmailJS();
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    initEmailJS() {
        try {
            // ✅ SUAS CONFIGURAÇÕES ORIGINAIS
            emailjs.init("IHYyQz4Gbk-EPOTil");
            this.emailjsInitialized = true;
            console.log('✅ EmailJS pronto!');
        } catch (error) {
            console.error('❌ Erro ao iniciar EmailJS:', error);
            this.emailjsInitialized = false;
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit);
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let error = '';

        switch (field.type) {
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    isValid = false;
                    error = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;

            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    error = 'Email inválido';
                }
                break;

            case 'tel':
                if (value && !this.phoneMaskSystem.isValidPhone(value)) {
                    isValid = false;
                    error = 'Telefone inválido. Use: (21) 99999-9999';
                }
                break;

            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    error = 'Mensagem muito curta (mín. 10 caracteres)';
                } else if (value.length > 1000) {
                    isValid = false;
                    error = 'Mensagem muito longa (máx. 1000 caracteres)';
                }
                break;
        }

        if (field.required && !value) {
            isValid = false;
            error = 'Campo obrigatório';
        }

        if (!isValid) {
            this.showFieldError(field, error);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('validation-error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
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

        const formData = this.collectFormData();
        const validation = this.validateForm(formData);

        if (!validation.isValid) {
            this.showNotification(validation.error, 'error');
            return;
        }

        await this.submitWithEmailJS(formData);
    }

    collectFormData() {
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
        const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];

        for (let field of requiredFields) {
            if (!data[field]) {
                return { isValid: false, error: 'Preencha todos os campos obrigatórios' };
            }
        }

        if (!this.isValidEmail(data.email)) {
            return { isValid: false, error: 'Email inválido' };
        }

        if (!this.phoneMaskSystem.isValidPhone(data.phone)) {
            return { isValid: false, error: 'Telefone inválido' };
        }

        if (data.message.length < 10) {
            return { isValid: false, error: 'Mensagem muito curta (mín. 10 caracteres)' };
        }

        return { isValid: true };
    }

    async submitWithEmailJS(formData) {
        this.isSubmitting = true;
        const originalText = this.submitBtn.innerHTML;

        try {
            if (!this.emailjsInitialized) {
                throw new Error('EmailJS não foi inicializado');
            }

            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.submitBtn.disabled = true;

            console.log('📤 Enviando dados:', formData);

            // ✅ CONFIGURAÇÕES ORIGINAIS DO SEU EMAILJS
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                date: formData.date
            };

            console.log('📝 Parâmetros para template:', templateParams);

            // ✅ SERVICE ID E TEMPLATE ID ORIGINAIS
            await emailjs.send(
                "service_v7jlvg8",    // Seu Service ID
                "template_wper866",   // Seu Template ID  
                templateParams
            );

            console.log('✅ Email enviado com sucesso!');
            this.showNotification('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            this.form.reset();

        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);

            let errorMessage = '❌ Erro ao enviar mensagem. Tente novamente.';

            if (error.status === 400) {
                errorMessage = '❌ Erro de configuração. Verifique Service ID e Template ID.';
            } else if (error.text && error.text.includes('template')) {
                errorMessage = '❌ Template não encontrado. Verifique no dashboard.';
            }

            this.showNotification(errorMessage, 'error');

        } finally {
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
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
            <button onclick="this.parentElement.remove()" aria-label="Fechar notificação">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }

    destroy() {
        if (this.phoneMaskSystem) {
            this.phoneMaskSystem.destroy();
        }
        this.form.removeEventListener('submit', this.handleSubmit);
    }
}

class ThemeSystem {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.handleClick = this.handleClick.bind(this);
    }

    init() {
        this.loadSavedTheme();
        this.bindEvents();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        this.setTheme(savedTheme);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', this.handleClick);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    handleClick() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    setTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');

        // Muda apenas a classe do ícone
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        if (theme === 'dark') {
            themeIcon.classList.remove('bi-moon');
            themeIcon.classList.add('bi-sun');
        } else {
            themeIcon.classList.remove('bi-sun');
            themeIcon.classList.add('bi-moon');
        }

        this.themeToggle.setAttribute('aria-label',
            theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro');
        this.currentTheme = theme;

        this.updateNavbarBackground();
    }

    updateNavbarBackground() {
        const nav = document.querySelector('nav');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            nav.style.background = this.currentTheme === 'dark'
                ? 'rgba(30, 30, 30, 0.98)'
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.background = this.currentTheme === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
        }
    }

    destroy() {
        this.themeToggle.removeEventListener('click', this.handleClick);
    }
}

class ScrollSystem {
    constructor() {
        this.nav = document.querySelector('nav');
        this.themeSystem = null;
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.handleSmoothScroll = this.handleSmoothScroll.bind(this);
    }

    init(themeSystem) {
        this.themeSystem = themeSystem;
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // Scroll suave sem alterar URL
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;

        if (this.nav) {
            if (scrollY > 100) {
                this.nav.style.background = document.body.classList.contains('dark-mode')
                    ? 'rgba(30, 30, 30, 0.98)'
                    : 'rgba(255, 255, 255, 0.98)';
            } else {
                this.nav.style.background = document.body.classList.contains('dark-mode')
                    ? 'rgba(30, 30, 30, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)';
            }
        }
    }

    handleSmoothScroll(e) {
        const href = this.getHash(e.currentTarget);
        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            // Scroll suave
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // ⭐⭐ MUDANÇA CRÍTICA: NÃO atualiza a URL ⭐⭐
            // Remove estas linhas se existirem:
            // if (history.pushState) {
            //     history.pushState(null, null, href);
            // }
        }
    }

    getHash(element) {
        return element.getAttribute('href');
    }

    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.removeEventListener('click', this.handleSmoothScroll);
        });
    }
}

class PortfolioApp {
    constructor() {
        this.themeSystem = new ThemeSystem();
        this.scrollSystem = new ScrollSystem();
        this.contactFormSystem = new ContactFormSystem();
        this.mobileMenu = new MobileMenu();
    }

    init() {
        // Inicializar sistemas
        this.themeSystem.init();
        this.scrollSystem.init(this.themeSystem);
        this.contactFormSystem.init();
        this.mobileMenu.init();

        // Atualizar ano no footer
        this.updateCurrentYear();

        // Marcar como carregado
        document.body.classList.add('loaded');

        console.log('✅ Portfólio iniciado com sucesso!');
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    destroy() {
        this.themeSystem.destroy();
        this.scrollSystem.destroy();
        this.contactFormSystem.destroy();
        this.mobileMenu.destroy();
    }
}

// =============================================
// INICIALIZAÇÃO
// =============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
    app.init();
});

// Cleanup na unload da página
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Testa se os arquivos existem
const icons = [
    'assets/favicon.ico',
    'assets/favicon-32x32.png', 
    'assets/favicon-16x16.png',
    'assets/apple-touch-icon.png'
];

icons.forEach(icon => {
    fetch(icon)
        .then(response => console.log(`${icon}: ${response.status}`))
        .catch(error => console.log(`${icon}: ERROR - ${error}`));
});