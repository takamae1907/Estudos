document.addEventListener('DOMContentLoaded', () => {

    // Carrega os dados de todos os módulos
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const studyActivities = JSON.parse(localStorage.getItem('studyActivities')) || [];
    const questoesProgresso = JSON.parse(localStorage.getItem('questoesProgresso')) || {};
    const provas = JSON.parse(localStorage.getItem('study_provas_v3')) || [];
    const turmas = [ // O mesmo array de 'conteudos.js' para calcular progresso
        { id: 'cfo-pmdf', title: 'CFO PMDF', localStorageKey: 'studyProgressPMDF', cronogramaData: typeof cronograma !== 'undefined' ? cronograma : [] },
        { id: 'cfo-cbmdf', title: 'CFO CBMDF', localStorageKey: 'studyProgressCBMDF', cronogramaData: typeof cronogramaCBMDF_data !== 'undefined' ? cronogramaCBMDF_data : [] },
    ];

    // --- 1. FUNÇÃO PARA ATUALIZAR OS WIDGETS ---
    function populateDashboard() {
        // --- Widget de Boas-Vindas e Stats Gerais ---
        const materias = Object.values(questoesProgresso);
        const totalAcertos = materias.reduce((acc, m) => acc + m.acertos, 0);
        const totalErros = materias.reduce((acc, m) => acc + m.erros, 0);
        const totalQuestoes = totalAcertos + totalErros;
        const aproveitamento = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
        
        document.getElementById('geral-progress-bar').style.width = `${aproveitamento}%`;
        document.getElementById('geral-progress-text').textContent = `${aproveitamento}% APROVEITAMENTO GERAL`;
        
        // --- Widget de Stats Overview ---
        const totalMinutes = studyActivities.reduce((acc, act) => acc + act.duration, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        document.getElementById('stats-tempo').textContent = `${hours}h ${minutes}m`;
        document.getElementById('stats-questoes').textContent = totalQuestoes.toLocaleString('pt-BR');
        document.getElementById('stats-aproveitamento').textContent = `${aproveitamento}%`;

        // --- Widget de Próximas Provas ---
        const provasList = document.getElementById('provas-list');
        provasList.innerHTML = '';
        if (provas.length > 0) {
            const today = new Date();
            provas.sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
                .forEach(prova => {
                    const provaDate = new Date(prova.date + 'T00:00:00');
                    const diffTime = provaDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays >= 0) {
                        provasList.innerHTML += `
                            <li>
                                <div class="countdown"><strong>${diffDays}</strong><span>dias</span></div>
                                <div class="prova-info"><strong>${prova.name}</strong><span>${provaDate.toLocaleDateString('pt-BR')}</span></div>
                            </li>`;
                    }
                });
        } else {
            provasList.innerHTML = '<li>Nenhuma prova cadastrada.</li>';
        }

        // --- Widget Meus Editais ---
        const editaisList = document.getElementById('editais-list');
        editaisList.innerHTML = '';
        turmas.forEach(turma => {
            const progress = JSON.parse(localStorage.getItem(turma.localStorageKey)) || {};
            const completedTopics = Object.keys(progress).length;
            let totalTopics = 0;
            turma.cronogramaData.forEach(s => s.dias.forEach(d => d.topicos.forEach(t => { if (typeof t.t === 'number') totalTopics++; })));
            const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            
            editaisList.innerHTML += `
                <li>
                    <div class="edital-info">
                        <strong>${turma.title}</strong>
                        <span class="status open">Em andamento</span>
                    </div>
                    <div class="edital-progress">
                        <div class="progress-bar-small"><div class="progress-small" style="width: ${percentage}%;"></div></div>
                        <span>${percentage}% concluído</span>
                    </div>
                </li>
            `;
        });
        
        // --- Widget Para Revisar Hoje ---
        const revisaoList = document.getElementById('revisao-list');
        revisaoList.innerHTML = '';
        const materiasParaRevisar = materias
            .filter(m => (m.acertos + m.erros) > 0) // Apenas matérias com questões resolvidas
            .map(m => ({ ...m, aproveitamento: Math.round((m.acertos / (m.acertos + m.erros)) * 100) }))
            .sort((a, b) => a.aproveitamento - b.aproveitamento) // Ordena do menor para o maior aproveitamento
            .slice(0, 3); // Pega as 3 piores

        if (materiasParaRevisar.length > 0) {
            materiasParaRevisar.forEach(materia => {
                revisaoList.innerHTML += `
                    <li>
                        <i class="fa-solid fa-arrow-trend-down"></i>
                        <div>
                            <strong>${materia.nome}</strong>
                            <span>Aproveitamento: ${materia.aproveitamento}%</span>
                        </div>
                    </li>`;
            });
        } else {
            revisaoList.innerHTML = '<li>Resolva questões para receber sugestões.</li>';
        }
    }

    // --- 2. LÓGICA DE PESQUISA (sem alterações) ---
    const searchInput = document.querySelector('.turmas-section input');
    const turmasLinks = document.querySelectorAll('.turmas-grid .turma-card');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            turmasLinks.forEach(link => {
                const turmaTitle = link.querySelector('.turma-title').textContent.toLowerCase();
                link.style.display = turmaTitle.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    // --- 3. INICIALIZAÇÃO ---
    populateDashboard();
});