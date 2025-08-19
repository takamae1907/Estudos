document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const periodDisplay = document.getElementById('period-display');
    const summaryFooter = document.getElementById('summary-footer');
    const materiasTbody = document.getElementById('materias-tbody');
    const noDataMessage = document.getElementById('no-data-message');
    const chartCanvas = document.getElementById('performanceChart');

    let performanceChart;
    let currentPeriod = 'semana';

    function processData() {
        const progress = JSON.parse(localStorage.getItem('questoesProgresso')) || {};
        // Adicione aqui a lógica para processar dados de outras fontes se necessário
        // Por exemplo, dados de tempo de estudo do 'studyActivities'
        
        // Esta é uma implementação simplificada. Para dados reais, você precisaria
        // de datas em seus registros de questões para filtrá-los por período.
        // Como o `questoesProgresso` não tem datas, vamos simular o comportamento
        // usando os dados gerais para todos os períodos.

        const allMaterias = Object.values(progress);
        if (allMaterias.length === 0) return null;

        const totalAcertos = allMaterias.reduce((acc, m) => acc + m.acertos, 0);
        const totalErros = allMaterias.reduce((acc, m) => acc + m.erros, 0);
        const totalQuestoes = totalAcertos + totalErros;
        const aproveitamentoGeral = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

        return {
            semana: {
                display: 'Últimos 7 Dias (Simulado)',
                labels: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                data: [aproveitamentoGeral - 5, aproveitamentoGeral + 2, aproveitamentoGeral - 3, aproveitamentoGeral, aproveitamentoGeral + 5, aproveitamentoGeral - 2, aproveitamentoGeral],
                resumo: { total: totalQuestoes, acertos: totalAcertos, aproveitamento: aproveitamentoGeral },
                materias: allMaterias.map(m => ({
                    nome: m.nome,
                    questoes: m.acertos + m.erros,
                    acertos: m.acertos,
                    aproveitamento: (m.acertos + m.erros > 0) ? Math.round((m.acertos / (m.acertos + m.erros)) * 100) : 0
                }))
            },
            // Simulações para outros períodos
            mes: { display: 'Este Mês (Simulado)', /* ... dados simulados ... */ },
            ano: { display: 'Este Ano (Simulado)', /* ... dados simulados ... */ },
            total: { display: 'Todo o Período', /* ... dados simulados ... */ }
        };
    }

    function createOrUpdateChart(period) {
        const processedData = processData();
        const periodData = processedData ? processedData[period] : null;

        if (!periodData || (periodData.resumo && periodData.resumo.total === 0)) {
            noDataMessage.classList.remove('hidden');
            chartCanvas.classList.add('hidden');
            if (performanceChart) {
                performanceChart.destroy();
                performanceChart = null;
            }
            updateUI(null);
            return;
        }

        noDataMessage.classList.add('hidden');
        chartCanvas.classList.remove('hidden');

        const dataConfig = {
            labels: periodData.labels,
            datasets: [{
                label: 'Aproveitamento', data: periodData.data,
                borderColor: '#0a84ff', backgroundColor: 'rgba(10, 132, 255, 0.1)',
                fill: true, tension: 0.4, pointBackgroundColor: '#0a84ff',
                pointBorderColor: '#fff', pointHoverRadius: 7, pointHoverBorderWidth: 2
            }]
        };

        if (performanceChart) {
            performanceChart.data = dataConfig;
            performanceChart.update();
        } else {
            performanceChart = new Chart(ctx, {
                type: 'line', data: dataConfig,
                options: { /* ... opções do gráfico ... */ }
            });
        }
        updateUI(periodData);
    }

    function updateUI(periodData) {
        if (!periodData) {
            periodDisplay.textContent = 'Sem Dados';
            summaryFooter.textContent = 'Média de desempenho';
            document.getElementById('summary-percentage').textContent = `-%`;
            document.getElementById('summary-details').innerHTML = `<strong>-</strong> questões<br><strong>-</strong> acertos`;
            materiasTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #8a8a8e;">Nenhum dado para exibir.</td></tr>`;
            document.getElementById('best-materia').textContent = '-';
            document.getElementById('best-materia-percent').textContent = `-%`;
            document.getElementById('worst-materia').textContent = '-';
            document.getElementById('worst-materia-percent').textContent = `-%`;
            document.getElementById('comparison-value').textContent = `-`;
            return;
        }

        periodDisplay.textContent = periodData.display;
        summaryFooter.textContent = `Média de desempenho em ${periodData.display}`;
        document.getElementById('summary-percentage').textContent = `${periodData.resumo.aproveitamento}%`;
        document.getElementById('summary-details').innerHTML = `<strong>${periodData.resumo.total}</strong> questões<br><strong>${periodData.resumo.acertos}</strong> acertos`;

        materiasTbody.innerHTML = periodData.materias.map(m => `
            <tr>
                <td>${m.nome}</td>
                <td>${m.questoes}</td>
                <td>${m.acertos}</td>
                <td>${m.aproveitamento}%</td>
            </tr>
        `).join('');

        const sortedMaterias = [...periodData.materias].sort((a, b) => b.aproveitamento - a.aproveitamento);
        if (sortedMaterias.length > 0) {
            const best = sortedMaterias[0];
            const worst = sortedMaterias[sortedMaterias.length - 1];
            document.getElementById('best-materia').textContent = best.nome;
            document.getElementById('best-materia-percent').textContent = `${best.aproveitamento}%`;
            document.getElementById('worst-materia').textContent = worst.nome;
            document.getElementById('worst-materia-percent').textContent = `${worst.aproveitamento}%`;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPeriod = button.dataset.period;
            createOrUpdateChart(currentPeriod);
        });
    });

    createOrUpdateChart(currentPeriod);
});