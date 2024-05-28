document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('saf-form');
  const materiaPrimaSelect = document.getElementById('materiaPrima');
  const rotaProducaoSelect = document.getElementById('rotaProducao');
  const tipoTransporteSelect = document.getElementById('tipoTransporte');
  const distanciaInput = document.getElementById('distancia');
  const resultadoDiv = document.getElementById('resultado');
  
  const safData = `Matéria Prima,Rota de Conversão,Estimativa de CO2 (g) por MJ de Combustível de Aviação,Potencial de Redução de CO2 em Comparação com Combustíveis Fósseis ao Longo do Ciclo de Vida
Dióxido de Carbono (CO2),FT,5.3,94%
Glicerina,FT,15.5,82%
Beterraba Açucareira,SIP,43.6,47.8%
Biomassa de Capim-sorgo,ATJ (Etanol),41.2,50.7%
Biomassa de Capim-sorgo,ATJ (Isobutanol),48.8,41.6%
Biomassa de Capim-sorgo,FT,15.7,81.2%
Biomassa de Choupo,FT,20.8,75.1%
Biomassa de Miscanthus,ATJ (Etanol),16.8,79.9%
Biomassa de Miscanthus,ATJ (Isobutanol),19.8,76.3%
Biomassa de Miscanthus,FT,-2.2,102.6%
Cana de Açúcar,ATJ (Etanol),32.8,60.8%
Cana de Açúcar,ATJ (Isobutanol),33.1,60.4%
Cana de Açúcar,SIP,43.9,47.5%
Destilado de Ácido Graxo de Palma,HEFA,20.7,75.2%
Gases Residuais,ATJ (Etanol),35.9,57.3%
Grão de Milho,ATJ (Etanol),100.6,-20.3%
Grão de Milho,ATJ (Isobutanol),85.5,-2.3%
Melaço,ATJ (Isobutanol),36.1,56.8%
Óleo de Camelina,HEFA,28.6,65.8%
Óleo de Colza,HEFA,73.4,12.2%
Óleo de Cozinha Usado,HEFA,13.9,83.4%
Óleo de Milho,HEFA,17.2,79.4%
Óleo de Soja,HEFA,66.2,20.8%
Resíduos Agrícolas,ATJ (Etanol),32.15,61.5%
Resíduos Agrícolas,ATJ (Isobutanol),29.3,65.0%
Resíduos Agrícolas,FT,7.7,90.8%
Resíduos Florestais,ATJ (Etanol),32.45,61.2%
Resíduos Florestais,ATJ (Isobutanol),23.8,71.5%
Resíduos Florestais,FT,8.3,90.1%
Resíduos Sólidos Municipais,FT,5.2,93.8%
Sebo,HEFA,22.5,73.1%`;

  const safRows = safData.split('\n').slice(1);
  const safInfo = safRows.map(row => {
    const [materiaPrima, rota, co2, reducao] = row.split(',');
    return { materiaPrima, rota, co2: parseFloat(co2), reducao: parseFloat(reducao.replace('%', '')) };
  });

  const materiasPrimas = [...new Set(safInfo.map(item => item.materiaPrima))];
  materiasPrimas.forEach(mp => {
    const option = document.createElement('option');
    option.value = mp;
    option.textContent = mp;
    materiaPrimaSelect.appendChild(option);
  });

  materiaPrimaSelect.addEventListener('change', function () {
    const selectedMateriaPrima = materiaPrimaSelect.value;
    const rotas = safInfo
      .filter(item => item.materiaPrima === selectedMateriaPrima)
      .map(item => item.rota);
    
    rotaProducaoSelect.innerHTML = '<option value="">Selecione...</option>';
    rotas.forEach(rota => {
      const option = document.createElement('option');
      option.value = rota;
      option.textContent = rota;
      rotaProducaoSelect.appendChild(option);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const materiaPrima = materiaPrimaSelect.value;
    const rotaProducao = rotaProducaoSelect.value;
    const tipoTransporte = tipoTransporteSelect.value;
    const distancia = parseFloat(distanciaInput.value);
  
    const selectedData = safInfo.find(item => item.materiaPrima === materiaPrima && item.rota === rotaProducao);

    if (!selectedData) {
      resultadoDiv.textContent = 'Combinação de Matéria Prima e Rota de Produção não encontrada.';
      return;
    }

    const co2Estimado = selectedData.co2;
    const reducaoCO2 = selectedData.reducao;
    let co2Transporte = 0;

    if (tipoTransporte === 'Rodoviário') {
      co2Transporte = (distancia * 944) / 1000; // g CO2 por km
    } else if (tipoTransporte === 'Marítimo') {
      co2Transporte = (distancia * 150) / 1000; // g CO2 por km
    }

    const co2TotalKg = co2Estimado / 1000 * 43; // kg CO2 por kg de combustível
    const co2TotalTransporteKg = co2Transporte / 1000; // kg CO2 pelo transporte
    const co2Total = co2TotalKg + co2TotalTransporteKg;

    const emissaoCO2QAV = 3.16; // kg CO2 por kg de QAV
    const reducaoPercentual = ((emissaoCO2QAV - co2Total) / emissaoCO2QAV) * 100;
    const reductionCo2PerMJ = emissaoCO2QAV * 1000 / 43 - co2Estimado; // g CO2 por MJ de combustível

    let resultado = `
      <p><b>Resumo:</b></p>
      <p>※ Matéria Prima: ${materiaPrima}</p>
      <p>※ Rota de Produção: ${rotaProducao}</p>
      <p>※ Tipo de Transporte: ${tipoTransporte}</p>
      <p>※ Distância (km): ${distancia.toFixed(1)}</p>
      <p>※ Estimativa de emissão de CO2 por MJ de Combustível de Aviação: ${co2Estimado.toFixed(2)}g</p>
      <p>※ Emissão de CO2 por kg de Combustível de Aviação: 3.16kg</p>
      <p>※ Estimativa de emissão de CO2 por kg do SAF: ${co2TotalKg.toFixed(2)}kg</p>
      <p>※ CO2 emitido durante o transporte: ${co2TotalTransporteKg.toFixed(2)}kg</p>
      <p>※ Estimativa de emissão total de CO2 do SAF (incl. transporte): ${co2Total.toFixed(2)}kg</p>
    `;

    if (reducaoPercentual < 0) {
      resultado += `<p>※ Percentual de aumento total de CO2 em comparação com Combustível de Aviação: ${Math.abs(reducaoPercentual).toFixed(2)}%</br></br>
      ❌ O combustível em questão, com rota de produção ${rotaProducao}, não representa uma melhora em relação aos combustíveis tradicionais.</p>`;
    } else {
      resultado += `
      <p>※ Percentual de redução de emissão de CO2-eq real em comparação com Combustível de Aviação: ${reducaoPercentual.toFixed(2)}%</br></br>
      ✅ O combustível em questão, com rota de produção ${rotaProducao}, representa uma melhora em relação aos combustíveis tradicionais. Isso gera uma redução de ${reductionCo2PerMJ.toFixed(2)}g de CO2 por megajoule de combustível, se comparado com o Jet A, combustível aeronáutico tradicional.</p>`;
    }

    resultadoDiv.innerHTML = resultado;
  });
});
