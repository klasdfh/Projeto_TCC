document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();

    /* Adiciona um ouvinte de evento ao formulário para capturar o evento de envio (submit) e 
      e verifica se ambos os arquivos CSV foram fornecidos para dar início ao processamento dos dados */
    const historicalFile = document.getElementById('historicalFile').files[0];
    const safFile = document.getElementById('safFile').files[0];

    if (!historicalFile || !safFile) {
        alert('Por favor, faça o upload de ambos os arquivos CSV.');
        return;
    }

    if (!historicalFile.name.endsWith('.csv') || !safFile.name.endsWith('.csv')) {
        alert('Por favor, faça o upload de arquivos no formato CSV.');
        return;
    }

    Promise.all([
        parseCSVFile(historicalFile),
        parseCSVFile(safFile)
    ]).then(([historicalData, safData]) => {
        const futureData = predictFutureDemand(historicalData, safData);
        displayResults(futureData);
        renderChart(futureData);
    }).catch(error => {
        console.error(error);
        alert('Erro ao processar os arquivos CSV.');
    });
});

/* A função parseCSVFile utiliza a biblioteca PapaParse para ler e analisar os arquivos CSV. 
  Retorna uma Promise que resolve com os dados do CSV analisado */
function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

/* A função predictFutureDemand gera previsões de demanda e produção de SAF para os anos 
  de 2024 a 2037. Para cada ano, ela calcula a demanda e a produção estimadas, armazenando 
  esses valores em arrays. Valores estimados com base em uma progressão aritimética simples */
function predictFutureDemand(historicalData, safData) {
    const futureDemand = [];
    const futureProduction = [];

    const startYear = 2024;
    const endYear = 2037;

    for (let year = startYear; year <= endYear; year++) {
        const estimatedDemand = calculateEstimatedDemand(year, historicalData);
        futureDemand.push({ year, demand: estimatedDemand });

        const estimatedProduction = calculateEstimatedProduction(year, safData);
        futureProduction.push({ year, production: estimatedProduction });
    }

    return { futureDemand, futureProduction };
}

/* A função calculateEstimatedDemand calcula a demanda estimada de SAF para um dado ano, 
  considerando uma redução gradual nas metas de emissão de CO2 entre 2027 e 2037. Valores 
  estimados com base em uma progressão aritimética simples */
function calculateEstimatedDemand(year, historicalData) {
    const initialReductionYear = 2027;
    const finalReductionYear = 2037;
    const initialReduction = 0.01; // meta de redução de 1% anual até 2027 (com base nas metas do governo brasileiro)
    const finalReduction = 0.10;  // meta de redução anual de 10% a partir de 2027 até 2037 (com base nas metas do governo brasileiro)

    let reduction = 0;
    if (year >= initialReductionYear) {
        const reductionRate = (finalReduction - initialReduction) / (finalReductionYear - initialReductionYear);
        reduction = initialReduction + reductionRate * (year - initialReductionYear);
    }

    const latestDemand = historicalData[historicalData.length - 1].Demand;

    return latestDemand * (1 - reduction);
}

/* A função calculateEstimatedProduction calcula a produção estimada de SAF para um dado ano, assumindo uma taxa 
  de crescimento anual de 20% */
function calculateEstimatedProduction(year, safData) {
    const lastProduction = safData[safData.length - 1].Production;
    const growthRate = 0.20; // suposição do crescimento anual de 20%
    const yearsFromLastData = year - safData[safData.length - 1].Year;

    return lastProduction * Math.pow(1 + growthRate, yearsFromLastData);
}

/* A função displayResults exibe os resultados da previsão de demanda e produção de SAF em uma tabela. Ela 
  também verifica se a produção atenderá a demanda e se atingirá as metas de redução de CO2 de 1% e 10%, 
  exibindo as mensagens apropriadas */
function displayResults(futureData) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    const futureDemand = futureData.futureDemand;
    const futureProduction = futureData.futureProduction;

    let intersectionYear = null;
    let meets1PercentTarget = false;
    let meets10PercentTarget = false;

    const resultTable = document.createElement('table');
    resultTable.className = 'table table-striped';
    const headerRow = resultTable.insertRow();
    headerRow.insertCell().textContent = 'Ano';
    headerRow.insertCell().textContent = 'Demanda Estimada (Litros)';
    headerRow.insertCell().textContent = 'Produção Estimada de SAF (Litros)';

    futureDemand.forEach((demand, index) => {
        const row = resultTable.insertRow();
        row.insertCell().textContent = demand.year;
        row.insertCell().textContent = demand.demand.toFixed(2);
        row.insertCell().textContent = futureProduction[index].production.toFixed(2);

        if (!intersectionYear && futureProduction[index].production >= demand.demand) {
            intersectionYear = demand.year;
        }

        if (!meets1PercentTarget && futureProduction[index].production >= demand.demand * 0.99) {
            meets1PercentTarget = demand.year;
        }

        if (!meets10PercentTarget && futureProduction[index].production >= demand.demand * 0.90) {
            meets10PercentTarget = demand.year;
        }
    });

    outputDiv.appendChild(resultTable);

    if (intersectionYear) {
        outputDiv.innerHTML += `<p>✅ A produção de SAF atenderá a demanda geral no ano ${intersectionYear}.</p>`;
    } else {
        outputDiv.innerHTML += '<p>❌ A produção de SAF não atenderá a demanda até 2037.</p>';
    }

    if (meets1PercentTarget) {
        outputDiv.innerHTML += `<p>✅ A produção de SAF atingirá a meta de redução de 1% de CO2 no ano ${meets1PercentTarget}.</p>`;
    } else {
        outputDiv.innerHTML += '<p>❌ A produção de SAF não atingirá a meta de redução de 1% de CO2 até 2037.</p>';
    }

    if (meets10PercentTarget) {
        outputDiv.innerHTML += `<p>✅ A produção de SAF atingirá a meta de redução de 10% de CO2 no ano ${meets10PercentTarget}.</p>`;
    } else {
        outputDiv.innerHTML += '<p>❌ A produção de SAF não atingirá a meta de redução de 10% de CO2 até 2037.</p>';
    }
}

/* A função renderChart utiliza a biblioteca Chart.js para renderizar um gráfico de linha que mostra a demanda e 
  a produção estimadas de SAF ao longo dos anos */
function renderChart(futureData) {
    const ctx = document.getElementById('safChart').getContext('2d');

    const futureYears = futureData.futureDemand.map(d => d.year);
    const futureDemand = futureData.futureDemand.map(d => d.demand);
    const futureProduction = futureData.futureProduction.map(p => p.production);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: futureYears,
            datasets: [
                {
                    label: 'Demanda Estimada de SAF (Litros)',
                    data: futureDemand,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Produção Estimada de SAF (Litros)',
                    data: futureProduction,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
