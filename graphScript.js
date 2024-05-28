document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();

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

function calculateEstimatedDemand(year, historicalData) {
    const initialReductionYear = 2027;
    const finalReductionYear = 2037;
    const initialReduction = 0.01; // 1% em 2027
    const finalReduction = 0.10;  // 10% em 2037

    let reduction = 0;
    if (year >= initialReductionYear) {
        const reductionRate = (finalReduction - initialReduction) / (finalReductionYear - initialReductionYear);
        reduction = initialReduction + reductionRate * (year - initialReductionYear);
    }

    const latestDemand = historicalData[historicalData.length - 1].Demand;

    return latestDemand * (1 - reduction);
}

function calculateEstimatedProduction(year, safData) {
    const lastProduction = safData[safData.length - 1].Production;
    const growthRate = 0.20; // Supondo um crescimento anual de 20%
    const yearsFromLastData = year - safData[safData.length - 1].Year;

    return lastProduction * Math.pow(1 + growthRate, yearsFromLastData);
}

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
