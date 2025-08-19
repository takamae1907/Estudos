document.addEventListener('DOMContentLoaded', () => {
    // Pega o email do usuário "logado" do sessionStorage
    const currentUserEmail = sessionStorage.getItem('currentUser');

    // Se não houver usuário logado, redireciona para a página de login
    if (!currentUserEmail) {
        // Ajusta o caminho para voltar para a raiz do projeto
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = '../index.html';
        return;
    }

    // Pega todos os usuários do localStorage para encontrar os dados do usuário atual
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.email === currentUserEmail);

    if (currentUser) {
        // Tenta encontrar e atualizar o nome do usuário na sidebar de qualquer página
        const userNameElements = document.querySelectorAll('.sidebar-user h2');
        userNameElements.forEach(element => {
            // Usa o nome completo, mas pega o primeiro nome para ser mais amigável
            const firstName = currentUser.fullname ? currentUser.fullname.split(' ')[0] : 'Usuário';
            element.textContent = firstName;
        });

        // Tenta encontrar a mensagem de boas-vindas APENAS na tela principal
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) {
             const firstName = currentUser.fullname ? currentUser.fullname.split(' ')[0] : 'Usuário';
             welcomeEl.innerHTML = `Olá, ${firstName}. <span class="subtitle">Bem-vindo(a)!</span>`;
        }
    }
});

// Função auxiliar para obter o email do usuário atual em outros scripts
function getCurrentUserEmail() {
    return sessionStorage.getItem('currentUser');
}