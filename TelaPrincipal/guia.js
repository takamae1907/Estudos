document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS DO DOM ---
    const progressGrid = document.querySelector('.progress-grid');
    const pontosFortesList = document.querySelector('#pontos-fortes ul');
    const pontosFracosList = document.querySelector('#pontos-fracos ul');
    const sugestoesList = document.querySelector('.sugestoes-widget ul');
    const atividadeRecenteList = document.querySelector('.atividade-recente-widget ul');
    
    // Referências para os widgets de resumo
    const summaryTempoEl = document.getElementById('summary-tempo');
    const summaryQuestoesEl = document.getElementById('summary-questoes');
    const summaryAproveitamentoEl = document.getElementById('summary-aproveitamento');

    // --- FUNÇÕES DE CARREGAMENTO E PROCESSAMENTO DE DADOS ---

    // Carrega dados de todas as fontes do localStorage
    const studyActivities = JSON.parse(localStorage.getItem('studyActivities')) || [];
    const questoesProgresso = JSON.parse(localStorage.getItem('questoesProgresso')) || {};

    // Função para calcular e exibir os widgets de resumo
    function renderSummaryWidgets() {
        // 1. Tempo de Estudo
        const totalMinutes = studyActivities.reduce((acc, act) => acc + act.duration, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        summaryTempoEl.textContent = `${hours}h ${minutes}m`;

        // 2. Questões Resolvidas e Aproveitamento
        const materias = Object.values(questoesProgresso);
        const totalAcertos = materias.reduce((acc, m) => acc + m.acertos, 0);
        const totalErros = materias.reduce((acc, m) => acc + m.erros, 0);
        const totalQuestoes = totalAcertos + totalErros;
        const aproveitamento = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

        summaryQuestoesEl.textContent = totalQuestoes.toLocaleString('pt-BR');
        summaryAproveitamentoEl.textContent = `${aproveitamento}%`;
    }

    // Função para renderizar os cards de progresso por matéria
    function renderProgressCards() {
        progressGrid.innerHTML = ''; 
        const materias = Object.values(questoesProgresso);
        if (materias.length === 0) {
            progressGrid.innerHTML = '<p style="color:#8a8a8e; padding-left: 5px;">Resolva questões para ver seu progresso por matéria.</p>';
            return;
        };

        const totalAcertos = materias.reduce((acc, m) => acc + m.acertos, 0);
        const totalErros = materias.reduce((acc, m) => acc + m.erros, 0);
        const progressoGeral = (totalAcertos + totalErros) > 0 ? Math.round((totalAcertos / (totalAcertos + totalErros)) * 100) : 0;

        const cardGeralHTML = `
            <div class="progress-card">
                <h3>Aproveitamento Geral em Questões</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-bar-fill geral" style="width: ${progressoGeral}%"></div>
                    </div>
                    <span class="percentage">${progressoGeral}%</span>
                </div>
            </div>
        `;
        progressGrid.innerHTML += cardGeralHTML;

        materias.forEach(materia => {
            const aproveitamentoMateria = (materia.acertos + materia.erros) > 0 ? Math.round((materia.acertos / (materia.acertos + materia.erros)) * 100) : 0;
            const cardHTML = `
                <div class="progress-card">
                    <h3>${materia.nome}</h3>
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${aproveitamentoMateria}%"></div>
                        </div>
                        <span class="percentage">${aproveitamentoMateria}%</span>
                    </div>
                </div>
            `;
            progressGrid.innerHTML += cardHTML;
        });
    }

    // Função para analisar e mostrar pontos fortes, fracos e sugestões
    function renderPerformanceAnalysis() {
        const materias = Object.values(questoesProgresso).filter(m => (m.acertos + m.erros) > 0);
        
        if (materias.length === 0) {
            pontosFortesList.innerHTML = '<li>Sem dados suficientes.</li>';
            pontosFracosList.innerHTML = '<li>Sem dados suficientes.</li>';
            sugestoesList.innerHTML = `<li><i class="fa-solid fa-rocket"></i><div>Comece a resolver questões para receber sugestões.</div></li>`;
            return;
        }

        materias.forEach(m => {
            m.aproveitamento = Math.round((m.acertos / (m.acertos + m.erros)) * 100);
        });

        const sortedMaterias = [...materias].sort((a, b) => b.aproveitamento - a.aproveitamento);

        const fortes = sortedMaterias.slice(0, 3);
        pontosFortesList.innerHTML = fortes.map(m => `<li>${m.nome} <span>${m.aproveitamento}%</span></li>`).join('');

        const fracos = sortedMaterias.filter(m => m.aproveitamento < 100).slice(-3).reverse();
        pontosFracosList.innerHTML = fracos.map(m => `<li>${m.nome} <span>${m.aproveitamento}%</span></li>`).join('');
        
        if (fracos.length > 0 && fortes.length > 0) {
            sugestoesList.innerHTML = `
                <li><i class="fa-solid fa-lightbulb"></i><div>Foque em <strong>${fracos[0].nome}</strong> para melhorar seu desempenho geral.</div></li>
                <li><i class="fa-solid fa-list-check"></i><div>Faça uma lista de revisão para <strong>${fortes[0].nome}</strong> para manter o bom resultado.</div></li>
            `;
        } else if (fortes.length > 0) {
             sugestoesList.innerHTML = `
                <li><i class="fa-solid fa-check-double"></i><div>Parabéns! Você está com um ótimo desempenho. Continue revisando <strong>${fortes[0].nome}</strong>.</div></li>
            `;
        }
    }

    // Função para mostrar as atividades recentes
    function renderRecentActivities() {
        // Pega as últimas 4 atividades de estudo do cronômetro
        const recentStudies = studyActivities.slice(-4).reverse();
        atividadeRecenteList.innerHTML = '';

        if (recentStudies.length === 0) {
            atividadeRecenteList.innerHTML = '<li>Nenhuma atividade recente.</li>';
            return;
        }

        recentStudies.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> Estudou ${activity.name} por ${activity.duration} min.`;
            atividadeRecenteList.appendChild(li);
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    renderSummaryWidgets();
    renderProgressCards();
    renderPerformanceAnalysis();
    renderRecentActivities();
});