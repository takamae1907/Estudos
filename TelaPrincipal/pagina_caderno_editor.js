document.addEventListener('DOMContentLoaded', () => {
    const notebookTitleEl = document.getElementById('notebook-title');
    const editorEl = document.getElementById('editor');
    const saveBtn = document.getElementById('save-btn');
    const saveStatusEl = document.getElementById('save-status');

    let notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];
    let currentNotebookId = null;
    let saveTimeout;

    const params = new URLSearchParams(window.location.search);
    currentNotebookId = params.get('id');

    if (!currentNotebookId) {
        alert('Caderno não encontrado!');
        window.location.href = 'caderno.html';
        return;
    }

    const currentNotebook = notebooks.find(n => n.id == currentNotebookId);
    if (currentNotebook) {
        notebookTitleEl.textContent = currentNotebook.name;
        document.title = currentNotebook.name;
        editorEl.value = localStorage.getItem(`notebook_content_${currentNotebookId}`) || '';
    } else {
        alert('Caderno inválido!');
        window.location.href = 'caderno.html';
    }

    const saveContent = () => {
        localStorage.setItem(`notebook_content_${currentNotebookId}`, editorEl.value);

        const notebookIndex = notebooks.findIndex(n => n.id == currentNotebookId);
        if (notebookIndex !== -1) {
            notebooks[notebookIndex].lastModified = new Date().toISOString();
            localStorage.setItem('notebooks', JSON.stringify(notebooks));
        }

        saveStatusEl.textContent = 'Salvo!';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatusEl.textContent = '';
        }, 2000);
    };

    saveBtn.addEventListener('click', saveContent);

    editorEl.addEventListener('input', () => {
        saveStatusEl.textContent = 'Salvando...';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, 1000);
    });
});document.addEventListener('DOMContentLoaded', () => {
    const notebookTitleEl = document.getElementById('notebook-title');
    const editorEl = document.getElementById('editor');
    const saveBtn = document.getElementById('save-btn');
    const saveStatusEl = document.getElementById('save-status');

    let notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];
    let currentNotebookId = null;
    let saveTimeout;

    const params = new URLSearchParams(window.location.search);
    currentNotebookId = params.get('id');

    if (!currentNotebookId) {
        alert('Caderno não encontrado!');
        window.location.href = 'caderno.html';
        return;
    }

    const currentNotebook = notebooks.find(n => n.id == currentNotebookId);
    if (currentNotebook) {
        notebookTitleEl.textContent = currentNotebook.name;
        document.title = currentNotebook.name;
        editorEl.value = localStorage.getItem(`notebook_content_${currentNotebookId}`) || '';
    } else {
        alert('Caderno inválido!');
        window.location.href = 'caderno.html';
    }

    const saveContent = () => {
        localStorage.setItem(`notebook_content_${currentNotebookId}`, editorEl.value);

        const notebookIndex = notebooks.findIndex(n => n.id == currentNotebookId);
        if (notebookIndex !== -1) {
            notebooks[notebookIndex].lastModified = new Date().toISOString();
            localStorage.setItem('notebooks', JSON.stringify(notebooks));
        }

        saveStatusEl.textContent = 'Salvo!';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatusEl.textContent = '';
        }, 2000);
    };

    saveBtn.addEventListener('click', saveContent);

    editorEl.addEventListener('input', () => {
        saveStatusEl.textContent = 'Salvando...';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, 1000);
    });
});