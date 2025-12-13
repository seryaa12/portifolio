// switch.js ATUALIZADO - Versão simplificada
function verificarModo() {
    fetch('/mode.json')
        .then(response => response.json())
        .then(data => {
            const modo = data.mode;

            if (modo === "close") {
                // Ativa modo manutenção (modal)
                document.body.classList.add('maintenance-active');
            } else {
                // Desativa modo manutenção  
                document.body.classList.remove('maintenance-active');
                
                // Aplicar fonte do logo se especificada
                if (data.logoFont) {
                    aplicarFonteLogo(data.logoFont);
                }
            }
        })
        .catch(err => {
            // Não mostrar erro no console
        });
}

// Função para aplicar fonte no logo
function aplicarFonteLogo(font) {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    // Lista de todas as classes de fonte possíveis
    const todasFontes = [
        'font-dancing', 'font-great-vibes', 'font-parisienne', 'font-pacifico',
        'font-homemade', 'font-yellowtail', 'font-bad-script', 'font-belle',
        'font-de-haviland', 'font-marck', 'font-kaushan', 'font-alex',
        'font-allura', 'font-cedarville', 'font-playball', 'font-qwigley',
        'font-rouge', 'font-sacramento', 'font-satisfy', 'font-tangerine'
    ];
    
    // Remove todas as classes de fonte primeiro
    todasFontes.forEach(fontClass => {
        logo.classList.remove(fontClass);
    });
    
    // Adiciona a nova fonte
    logo.classList.add(`font-${font}`);
}

// Verifica imediatamente
verificarModo();

// Se estiver em manutenção, verifica a cada 5 segundos
setInterval(verificarModo, 5000);