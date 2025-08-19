document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE PERSONALIZAÇÃO E SESSÃO ---
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Procura por elementos com a classe 'user-name' para atualizar
    const userNameElements = document.querySelectorAll('.user-name');

    if (currentUser && currentUser.fullname) {
        // Se encontrou um usuário logado, atualiza o nome
        userNameElements.forEach(el => {
            el.textContent = currentUser.fullname;
        });
    } else {
        // Se não houver ninguém logado, pode redirecionar para o login
        // ou manter um nome padrão (exceto na página de login/cadastro)
        if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('cadastro.html')) {
            // Opcional: redirecionar se não estiver logado
            // window.location.href = '../index.html'; 
        }
    }

    // --- LÓGICA DA BARRA LATERAL (SIDEBAR) ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const link = event.currentTarget.querySelector('a');
            if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                // Comportamento de navegação padrão
            } else {
                event.preventDefault(); 
            }
        });
    });
});