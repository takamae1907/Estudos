document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE DADOS DOS CURSOS ---
    // Mapeia cada curso ao seu link, imagem, e dados de progresso no localStorage.
    const turmas = [
        {
            id: 'cfo-pmdf',
            title: 'CFO PMDF',
            image: 'fotos/cfo-pmdf.png',
            link: 'edital-pmdf.html',
            localStorageKey: 'studyProgressPMDF',
            cronogramaData: typeof cronograma !== 'undefined' ? cronograma : [], // Usa a variável global de edital-pmdf.js
            editalData: typeof edital !== 'undefined' ? edital : {}
        },
        {
            id: 'cfo-cbmdf',
            title: 'CFO CBMDF',
            image: 'fotos/cfo-cbm.png',
            link: 'edital-cbmdf.html',
            localStorageKey: 'studyProgressCBMDF',
            cronogramaData: typeof cronogramaCBMDF_data !== 'undefined' ? cronogramaCBMDF_data : [], // Usa a variável global definida no HTML
            editalData: typeof editalCBMDF_data !== 'undefined' ? editalCBMDF_data : {}
        },
        // Adicione outros cursos aqui no mesmo formato
        // Exemplo:
        // {
        //     id: 'sd-pmgo',
        //     title: 'SD PMGO',
        //     image: 'fotos/sd-pmmg.png',
        //     link: '#', // link para a página do edital
        //     localStorageKey: 'studyProgressPMGO',
        //     cronogramaData: cronogramaPMGO, // Supondo que exista essa variável
        //     editalData: editalPMGO
        // },
    ];

    const turmasGrid = document.querySelector('.turmas-grid-conteudo');
    const searchInput = document.getElementById('search-input');
    const lembretesList = document.querySelector('.lembretes-widget ul');
    const currentDateEl = document.getElementById('current-date');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    // 1. Renderiza os cards de conteúdo com base no progresso real
    function renderTurmasCards() {
        turmasGrid.innerHTML = ''; // Limpa o grid antes de popular

        turmas.forEach(turma => {
            // Carrega o progresso salvo para este curso
            const progress = JSON.parse(localStorage.getItem(turma.localStorageKey)) || {};
            const completedTopics = Object.keys(progress).length;
            
            // Calcula o total de tópicos contáveis no cronograma
            let totalTopics = 0;
            turma.cronogramaData.forEach(semana => {
                semana.dias.forEach(dia => {
                    dia.topicos.forEach(topico => {
                        if (typeof topico.t === 'number') {
                            totalTopics++;
                        }
                    });
                });
            });

            // Calcula a porcentagem de progresso
            const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

            // Cria o elemento do card
            const cardLink = document.createElement('a');
            cardLink.href = turma.link;
            cardLink.className = 'turma-card-conteudo';
            cardLink.innerHTML = `
                <img src="${turma.image}" alt="${turma.title}">
                <div class="turma-info">
                    <h4>${turma.title}</h4>
                    <div class="turma-progress">
                        <div class="progress-bar-small">
                            <div class="progress-small" style="width: ${percentage}%;"></div>
                        </div>
                        <span>${percentage}%</span>
                    </div>
                </div>
            `;
            turmasGrid.appendChild(cardLink);
        });
    }

    // 2. Renderiza os lembretes de "Meu Dia" com base nos cronogramas
    function renderMeuDia() {
        const today = new Date();
        const dayOfWeek = today.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/-feira/i, '').replace(/^\w/, c => c.toUpperCase());
        currentDateEl.textContent = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        
        lembretesList.innerHTML = '';
        let topicosDeHoje = [];

        // Verifica cada plano de estudo
        turmas.forEach(turma => {
            // A data de início deve ser definida aqui para cada cronograma
            // Exemplo:
            const startDate = turma.id === 'cfo-cbmdf' ? new Date('2025-08-18') : new Date('2025-08-04');
            
            const oneDay = 1000 * 60 * 60 * 24;
            const weekDiff = Math.floor((today - startDate) / (oneDay * 7));

            if (weekDiff >= 0 && weekDiff < turma.cronogramaData.length) {
                const currentWeek = turma.cronogramaData[weekDiff];
                if (currentWeek && currentWeek.dias) {
                    const todayPlan = currentWeek.dias.find(d => d.dia === dayOfWeek);
                    if (todayPlan) {
                        todayPlan.topicos.forEach(topic => {
                            const topicText = typeof topic.t === 'number' ? turma.editalData[topic.m][topic.t] : topic.t;
                            topicosDeHoje.push({
                                text: topicText,
                                materia: topic.m
                            });
                        });
                    }
                }
            }
        });

        if (topicosDeHoje.length > 0) {
            topicosDeHoje.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.materia}:</strong> <span>${item.text}</span>`;
                lembretesList.appendChild(li);
            });
        } else {
            lembretesList.innerHTML = '<li>Nenhum estudo agendado para hoje.</li>';
        }
    }

    // --- LÓGICA DE PESQUISA ---
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        const turmasCards = document.querySelectorAll('.turma-card-conteudo');
        
        turmasCards.forEach(card => {
            const turmaTitle = card.querySelector('h4').textContent.toLowerCase();
            if (turmaTitle.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- INICIALIZAÇÃO ---
    renderTurmasCards();
    renderMeuDia();
});