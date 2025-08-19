document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS LOCAL (CRONOGRAMAS E EDITAIS) ---
    // Centralizamos os dados aqui para que a página principal possa acessá-los.

    // DADOS DO EDITAL PMDF
    const editalPMDF = {
        'Língua Portuguesa': [ 'Compreensão e interpretação de textos', 'Reconhecimento de tipos e gêneros textuais', 'Domínio da ortografia oficial', 'Domínio dos mecanismos de coesão textual', 'Emprego de tempos e modos verbais', 'Domínio da estrutura morfossintática', 'Relações de coordenação e subordinação', 'Emprego dos sinais de pontuação', 'Concordância verbal e nominal', 'Regência verbal e nominal', 'Emprego do sinal indicativo de crase', 'Colocação dos pronomes átonos', 'Reescrita de frases e parágrafos' ],
        'Direito Constitucional': [ 'Constituição: Conceito e classificações', 'Supremacia da Constituição', 'Princípios fundamentais', 'Direitos e deveres individuais e coletivos', 'Remédios Constitucionais', 'Direitos sociais, nacionalidade, políticos', 'Organização do Estado', 'Entes Federados', 'Administração pública', 'Defesa do Estado e instituições', 'Organização dos poderes', 'Poder Legislativo e Judiciário' ],
        'Direito Administrativo': [ 'Estado, governo e adm. pública', 'Direito administrativo: conceito', 'Regime jurídico-administrativo', 'Ato administrativo', 'Poderes da administração', 'Responsabilidade civil do Estado', 'Controle da administração', 'Improbidade administrativa (Lei 8.429)', 'Processo administrativo (Lei 9.784)', 'Licitações e contratos (Lei 14.133)' ],
        'Direito Penal': [ 'Princípios aplicáveis', 'Aplicação da lei penal', 'Ilicitude e Culpabilidade', 'Concurso de pessoas', 'Penas', 'Ação penal e Extinção da punibilidade', 'Prescrição', 'Crimes contra a fé pública', 'Crimes contra a adm. pública', 'Crimes contra a pessoa e patrimônio', 'Crimes contra dignidade sexual e incolumidade' ],
        'Raciocínio Lógico': [ 'Estruturas lógicas', 'Lógica de argumentação', 'Lógica sentencial (proposições)', 'Equivalências e Leis de De Morgan', 'Diagramas lógicos', 'Lógica de primeira ordem', 'Operações com conjuntos', 'Conjuntos numéricos', 'Razões, proporções e porcentagens', 'Regras de três', 'Equações e inequações', 'Sistemas lineares', 'Funções e gráficos', 'Princípios de contagem' ],
    };
    const cronogramaPMDF = [
        { semana: 1, dias: [ { dia: "Segunda", topicos: [{ id: "lp1", m: "Língua Portuguesa", t: 0 }, { id: "dc1", m: "Direito Constitucional", t: 0 }] }, { dia: "Terça", topicos: [{ id: "da1", m: "Direito Administrativo", t: 0 }, { id: "rl1", m: "Raciocínio Lógico", t: 0 }] }, { dia: "Quarta", topicos: [{ id: "lp2", m: "Língua Portuguesa", t: 1 }, { id: "dp1", m: "Direito Penal", t: 0 }] }] },
        { semana: 2, dias: [ { dia: "Segunda", topicos: [{ id: "lp3", m: "Língua Portuguesa", t: 2 }, { id: "dc4", m: "Direito Constitucional", t: 3 }] }, { dia: "Terça", topicos: [{ id: "da4", m: "Direito Administrativo", t: 3 }, { id: "rl3", m: "Raciocínio Lógico", t: 2 }] } ] }
    ];

    // DADOS DO EDITAL CBMDF
    const editalCBMDF = {
        'Legislação CBMDF': [ 'Lei nº 7.479/1986 (Estatuto dos Bombeiros-Militares).', 'Lei nº 8.255/1991 (Organização básica do CBMDF).' ],
        'Emergência Pré-Hospitalar': [ 'Fundamentos Anatômicos e Fisiológicos.', 'Primeiros Socorros e Suporte Básico de Vida (SBV).' ],
        'Matemática': ['Sistemas de unidades de medidas e transformação.', 'Sequências numéricas, progressões aritméticas e geométricas.']
    };
    const cronogramaCBMDF = [
        { semana: 1, dias: [ { dia: "Segunda", topicos: [{ id: "leg1", m: "Legislação CBMDF", t: 0 }] }, { dia: "Terça", topicos: [{ id: "aph1", m: "Emergência Pré-Hospitalar", t: 0 }] }, { dia: "Quarta", topicos: [{ id: "leg2", m: "Legislação CBMDF", t: 1 }] }] },
        { semana: 2, dias: [ { dia: "Segunda", topicos: [{ id: "aph2", m: "Emergência Pré-Hospitalar", t: 1 }] }, { dia: "Terça", topicos: [{ id: "mat2", m: "Matemática", t: 1 }] } ] }
    ];
    
    // --- LÓGICA DO WIDGET DE LEMBRETES DINÂMICOS ---
    const populateRemindersWidget = () => {
        const lembretesList = document.querySelector('.right-column .lembretes-widget ul');
        if (!lembretesList) return;

        let dynamicReminders = [];
        const hoje = new Date();
        const diaDaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/-feira/i, '').replace(/^\w/, c => c.toUpperCase());

        // Função auxiliar para buscar tarefas nos cronogramas
        const findTasksForToday = (cronograma, edital, startDateStr, concurso) => {
            const startDate = new Date(startDateStr);
            const weekDiff = Math.floor((hoje - startDate) / (1000 * 60 * 60 * 24 * 7));

            if (weekDiff >= 0 && weekDiff < cronograma.length) {
                const currentWeek = cronograma[weekDiff];
                const todayPlan = currentWeek.dias.find(d => d.dia === diaDaSemana);
                if (todayPlan) {
                    todayPlan.topicos.forEach(topic => {
                        const topicText = (typeof topic.t === 'number') ? edital[topic.m][topic.t] : topic.t;
                        dynamicReminders.push({ text: `[${concurso}] ${topicText}`, date: hoje.toISOString().split('T')[0] });
                    });
                }
            }
        };

        // Buscar tarefas de hoje nos dois cronogramas
        findTasksForToday(cronogramaPMDF, editalPMDF, '2025-08-04', 'PMDF');
        findTasksForToday(cronogramaCBMDF, editalCBMDF, '2025-08-18', 'CBMDF');
        
        lembretesList.innerHTML = ''; 

        if (dynamicReminders.length === 0) {
            lembretesList.innerHTML = '<li>Nenhum estudo agendado para hoje nos seus cronogramas.</li>';
            return;
        }

        dynamicReminders.forEach(reminder => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${reminder.text}</strong><span>Hoje</span>`;
            lembretesList.appendChild(li);
        });
    };

    // --- LÓGICA DA BARRA LATERAL (SIDEBAR) ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const link = event.currentTarget.querySelector('a');
            if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                window.location.href = link.getAttribute('href');
            } else {
                sidebarItems.forEach(i => i.classList.remove('active'));
                event.currentTarget.classList.add('active');
            }
        });
    });

    // --- LÓGICA DA PESQUISA DE TURMAS ---
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

    // --- ALERTAS DE EXEMPLO PARA INTERATIVIDADE ---
    const pesquisaButton = document.querySelector('.main-header button');
    if (pesquisaButton) {
        pesquisaButton.addEventListener('click', () => alert('Obrigado por participar da pesquisa! (Função de exemplo)'));
    }

    // --- LÓGICA DINÂMICA PARA O USUÁRIO LOGADO ---
    const loadUserData = () => {
        const currentUserEmail = getCurrentUserEmail(); // Pega o email do auth.js
        if (!currentUserEmail) return;

        // 1. ATUALIZA A MENSAGEM DE BOAS-VINDAS
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(user => user.email === currentUserEmail);
        const welcomeEl = document.getElementById('welcome-message'); 
        if (currentUser && welcomeEl) {
            const firstName = currentUser.fullname ? currentUser.fullname.split(' ')[0] : 'Usuário';
            welcomeEl.innerHTML = `Olá, ${firstName}. <span class="subtitle">Bem-vindo!</span>`;
        }

        // 2. ATUALIZA AS ESTATÍSTICAS GLOBAIS (NÃO MAIS USADO AQUI, MAS MANTIDO)
        // A lógica de estatísticas foi movida para dentro da função de carregar dados do usuário
    };
    
    // --- EXECUÇÃO DAS FUNÇÕES AO CARREGAR A PÁGINA ---
    populateRemindersWidget(); // Agora é dinâmico
    loadUserData();
});