document.addEventListener('DOMContentLoaded', () => {
    // DADOS DO EDITAL E CRONOGRAMA (mesmos do seu arquivo original)
    const edital = { /* ... seu objeto edital completo aqui ... */ };
    const cronograma = [ /* ... seu array de cronograma completo aqui ... */ ];

    const cronogramaContainer = document.getElementById('cronograma-container');
    const progressPanel = document.getElementById('progress-panel');
    const todayList = document.getElementById('today-list');
    const currentDateEl = document.getElementById('current-date');

    let progress = JSON.parse(localStorage.getItem('studyProgressPMDF')) || {};
    let totalTopics = 0;

    function saveProgress() {
        localStorage.setItem('studyProgressPMDF', JSON.stringify(progress));
    }

    function renderCronograma() {
        cronogramaContainer.innerHTML = '';
        totalTopics = 0;

        cronograma.forEach(semanaData => {
            if (!semanaData.dias || semanaData.dias.length === 0) return;

            const semanaEl = document.createElement('div');
            semanaEl.className = 'accordion-item';
            let semanaTopics = 0;
            let semanaCompleted = 0;

            const contentHtml = semanaData.dias.map(diaData => {
                const diaTopics = diaData.topicos.map(topic => {
                    if (typeof topic.t === 'number') {
                        totalTopics++;
                        semanaTopics++;
                        if (progress[topic.id]) {
                            semanaCompleted++;
                        }
                    }
                    const topicText = typeof topic.t === 'number' ? edital[topic.m][topic.t] : topic.t;
                    const isCompleted = progress[topic.id] ? 'completed' : '';
                    const isChecked = progress[topic.id] ? 'checked' : '';
                    
                    return `<li class="topic-item ${isCompleted}" data-id="${topic.id}"><input type="checkbox" id="${topic.id}" ${isChecked}><label for="${topic.id}"><span>${topicText}</span><span class="subject-tag">${topic.m}</span></label></li>`;
                }).join('');
                return `<div class="day-plan"><h4>${diaData.dia}</h4><ul>${diaTopics}</ul></div>`;
            }).join('');
            
            const semanaProgress = semanaTopics > 0 ? Math.round((semanaCompleted / semanaTopics) * 100) : 0;

            semanaEl.innerHTML = `
                <div class="accordion-header">
                    <h3>Semana ${semanaData.semana} <span class="progress-label-semana">(${semanaProgress}%)</span></h3>
                    <i class="fas fa-plus icon"></i>
                </div>
                <div class="accordion-content">${contentHtml}</div>`;

            cronogramaContainer.appendChild(semanaEl);
        });
    }

    function updateCharts() {
        const completedTopics = Object.keys(progress).filter(id => !id.startsWith('rev') && !id.startsWith('sim')).length;
        const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        document.getElementById('geral-progress-bar').style.width = `${overallPercentage}%`;
        document.getElementById('geral-progress-label').textContent = `${overallPercentage}%`;
        
        const existingCharts = progressPanel.querySelectorAll('.chart-container:not(.overall-chart)');
        existingCharts.forEach(chart => chart.remove());

        Object.keys(edital).forEach(materia => {
            let totalMateria = 0, completedMateria = 0;
            cronograma.forEach(s => s.dias && s.dias.forEach(d => d.topicos.forEach(t => {
                if (t.m === materia) {
                    totalMateria++;
                    if (progress[t.id]) completedMateria++;
                }
            })));

            if (totalMateria > 0) {
                const materiaPercentage = Math.round((completedMateria / totalMateria) * 100);
                const chartEl = document.createElement('div');
                chartEl.className = 'chart-container';
                chartEl.innerHTML = `<h4>${materia}</h4><div class="progress-bar-container"><div class="progress-bar" style="width: ${materiaPercentage}%;"></div></div><span class="progress-label">${materiaPercentage}%</span>`;
                progressPanel.appendChild(chartEl);
            }
        });
    }
    
    function renderTodayStudies() {
        const today = new Date();
        const dayOfWeek = today.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/-feira/i, '').replace(/^\w/, c => c.toUpperCase());
        
        currentDateEl.textContent = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        todayList.innerHTML = '<li>Nenhum estudo agendado para hoje.</li>';
        
        const startDate = new Date('2025-08-04');
        const weekDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 7));

        if (weekDiff >= 0 && weekDiff < cronograma.length) {
            const currentWeek = cronograma[weekDiff];
            if (currentWeek && currentWeek.dias) {
                const todayPlan = currentWeek.dias.find(d => d.dia === dayOfWeek);
                if (todayPlan) {
                    todayList.innerHTML = todayPlan.topicos.map(topic => {
                        const topicText = typeof topic.t === 'number' ? edital[topic.m][topic.t] : topic.t;
                        return `<li><strong>${topic.m}:</strong> <span>${topicText}</span></li>`
                    }).join('');
                }
            }
        }
    }

    cronogramaContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
            header.parentElement.classList.toggle('active');
            return;
        }

        const checkbox = e.target.closest('input[type="checkbox"]');
        if (checkbox) {
            const id = checkbox.id;
            const topicItem = checkbox.closest('.topic-item');
            if (checkbox.checked) {
                progress[id] = true;
                topicItem.classList.add('completed');
            } else {
                delete progress[id];
                topicItem.classList.remove('completed');
            }
            saveProgress();
            renderCronograma();
            updateCharts();
        }
    });

    renderCronograma();
    updateCharts();
    renderTodayStudies();
});