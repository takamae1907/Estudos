document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { fullname: 'Usuário Teste', email: 'admin@ficticio.com', password: '12345' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            // Salva os dados do usuário na sessão para usar em outras páginas
            sessionStorage.setItem('currentUser', JSON.stringify({ fullname: foundUser.fullname, email: foundUser.email }));
            
            alert(`Login bem-sucedido! Bem-vindo(a), ${foundUser.fullname}.`);
            window.location.href = 'TelaPrincipal/TelaPrincipal.html';
        } else {
            alert('Email ou senha incorretos. Verifique seus dados ou cadastre-se.');
        }
    });
});