document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('saf-form');
  const materiaPrimaSelect = document.getElementById('materiaPrima');
  const rotaProducaoSelect = document.getElementById('rotaProducao');
  const tipoTransporteSelect = document.getElementById('tipoTransporte');
  const distanciaInput = document.getElementById('distancia');
  const resultadoDiv = document.getElementById('resultado');

  const safData = `Matéria Prima,Rota de Conversão,Estimativa de CO2 (g) por MJ de Combustível de Aviação,Potencial de Redução de CO2 em Comparação com Combustíveis Fósseis ao Longo do Ciclo de Vida
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
      co2Transporte = (distancia * 11.8) / 1000;
    } else if (tipoTransporte === 'Marítimo') {
      co2Transporte = (distancia * 15) / 1000;
    }

    const co2Total = co2Estimado + co2Transporte;
    const co2Fossil = 3.16 * 1000; // CO2 emitido por litro de Jet A queimado
    const co2FossilGrama = 3.16; // CO2 emitido por grama de Jet A queimado
    const co2EconomizadoPorTonelada = (3.16 - ((3.16 * reducaoCO2) / 100)) - co2Transporte;
    const helpVar = 100 - ((co2EconomizadoPorTonelada * 100) / 3.16)
    //const co2EconomizadoPorTonelada = ((helpVar + co2Transporte) * 100) / 3.16
    //const co2EconomizadoPorTonelada = 3160 - (((3.16 * reducaoCO2) / 100) * 1000);
    //const reducaoPercentual = 100 - ((100 * co2Total)/co2Fossil);
    const emissaoOriginal = ((co2Estimado * 100) / reducaoCO2);
    const reducaoPercentual = emissaoOriginal - co2Total;
    const moduloAumento = Math.abs(reducaoCO2);
    
    let resultado= `
      <p>Resumo:</p>
      <p>Matéria Prima: ${materiaPrima}</p>
      <p>Rota de Produção: ${rotaProducao}</p>
      <p>Tipo de Transporte: ${tipoTransporte}</p>
      <p>Distância (km): ${distancia.toFixed(1)}</p>
      <p>Estimativa de emissão de CO2 por MJ de Combustível de Aviação: ${co2Estimado.toFixed(2)} g</p>
      <p>CO2 emitido durante o transporte: ${co2Transporte.toFixed(2)} g</p>
      <p>Total de CO2 emitido no processo (incl. transporte): ${co2Total.toFixed(2)} g</p>
          `;
    

    if (co2Total > emissaoOriginal || reducaoCO2 < 0) {
      resultado += `<p>Percentual de AUMENTO total de CO2-eq em comparação com Combustível de Aviação: ${moduloAumento.toFixed(2)}%</br>O combustível em questão, com rota de produção ${rotaProducao}, não representa uma melhora em relação aos combustíveis tradicionais.</p>`;
    } else {
      resultado += `<p>Percentual total de CO2 por tonelada de Combustível de Aviação: ${co2EconomizadoPorTonelada.toFixed(2)} t de CO2</br></br>
      Percentual máximo de redução de CO2-eq em comparação com comparação com Combustível de Aviação: ${reducaoCO2.toFixed(2)}%</br></br>
      Percentual de REDUÇÃO total de CO2-eq obtido: ${helpVar.toFixed(2)}%</br></br>
      O combustível em questão, com rota de produção ${rotaProducao}, representa uma melhora em relação aos combustíveis tradicionais. 
      Isso gera uma redução de ${reducaoPercentual.toFixed(2)} g de CO2 por megajoule de combustível, se comparado com o Jet A, 
      combustível aeronáutico tradicional.</br></br>Obs.: Levando-se em conta que uma aeronave gera, em média, 3,16 toneladas de CO2
para cada tonelada de combustível Jet A queimado (fonte: https://applications.icao.int/icec/`;
    }

    resultadoDiv.innerHTML = resultado;
  });
});

