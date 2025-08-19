document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!fullname) {
            alert('Por favor, insira seu nome completo.');
            return;
        }
        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            alert('Este email já foi cadastrado. Por favor, use outro.');
            return;
        }

        // Salva o novo usuário com nome
        users.push({ fullname: fullname, email: email, password: password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
        window.location.href = 'index.html';
    });
});