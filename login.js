document.addEventListener('DOMContentLoaded', () => {
    // Remove o usuário de qualquer "sessão" anterior ao chegar na página de login
    sessionStorage.removeItem('currentUser');

    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { fullname: 'Abner Ficticio', email: 'admin@ficticio.com', password: '12345' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Usuário fictício criado para testes.');
    }

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const emailInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value;
        const password = passwordInput.value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            // SUCESSO: Salva o email do usuário na sessionStorage para simular uma sessão
            sessionStorage.setItem('currentUser', foundUser.email);
            
            alert(`Login bem-sucedido! Bem-vindo(a).`);
            window.location.href = 'TelaPrincipal/TelaPrincipal.html';
        } else {
            alert('Email ou senha incorretos. Verifique seus dados ou cadastre-se.');
        }
    });
});