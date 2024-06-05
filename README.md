# 🚀 Descarbonização do Transporte Aéreo: Uma Visão sobre Combustíveis de Aviação Sustentáveis (SAFs)

## Trabalho Acadêmico por Arthur Felipe

Este repositório contém um projeto de pesquisa sobre **Sustainable Aviation Fuels** (Combustíveis de Aviação Sustentáveis), incluindo um programa em JavaScript para calcular as emissões de CO2 de diferentes tipos de SAF com base em um conjunto de dados CSV, e uma página HTML interativa para facilitar o uso do programa.

## 📜 Descrição do Projeto

O objetivo deste projeto é analisar e comparar as emissões de CO2 de diferentes tipos de combustíveis de aviação sustentáveis. Utilizando dados de um conjunto de dados CSV que contém informações sobre a matéria-prima, a rota de produção e as estimativas de emissões de CO2 por MJ de combustível de aviação. O programa JavaScript calcula as emissões reais de CO2 com base na distância de transporte e compara com as emissões teóricas para determinar se um determinado SAF representa uma melhora ou piora em relação aos combustíveis fósseis tradicionais.

## 🌐 Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexão à internet para carregar bibliotecas externas

## ✈️ Calculadora de SAF

### Passos

1. Abra o arquivo `index.html` em seu navegador web para acessar a interface interativa.
2. Selecione a matéria-prima, a rota de produção, o tipo de transporte e a distância para calcular as emissões de CO2.
3. Clique em "Calcular".

### Resultados

- O código verifica se as metas de redução de emissões de CO₂ serão atingidas.
- Exibe mensagens informando se as metas de 1% até 2027 e de 10% até 2037 serão cumpridas.
- Gera um gráfico mostrando as previsões de demanda e produção ao longo dos anos.

### 🌟 Exemplo de Saída

**Input:**

Selecione "Cana de Açúcar" como matéria-prima e "ATJ (Etanol)" como rota de produção. Escolha "Rodoviário" como tipo de transporte e insira uma distância de 100 km. Clique em "Calcular" para ver os resultados das emissões de CO2.

**Output:**

```plaintext
Resumo:
※ Matéria Prima: Cana de Açúcar
※ Rota de Produção: ATJ (Etanol)
※ Tipo de Transporte: Rodoviário
※ Distância (km): 100.0
※ Estimativa de emissão de CO2 por MJ de Combustível de Aviação: 32.80g
※ Emissão de CO2 por kg de Combustível de Aviação: 3.16kg
※ Estimativa de emissão de CO2 por kg do SAF: 1.41kg
※ CO2 emitido durante o transporte: 0.09kg
※ Estimativa de emissão total de CO2 do SAF (incl. transporte): 1.50kg
※ Percentual de redução de emissão de CO2-eq real em comparação com Combustível de Aviação: 52.38%
✅ O combustível em questão, com rota de produção ATJ (Etanol), representa uma melhora em relação aos combustíveis tradicionais. Isso gera uma redução de 40.69g de CO2 por megajoule de combustível, se comparado com o Jet A, combustível aeronáutico tradicional.

### 📊 Gráfico de SAF
**Passos**
Abra o arquivo grafico.html em seu navegador.
Faça upload dos arquivos CSV contendo os dados históricos:
dados_historicos.csv: Contém os dados históricos de demanda de QAV.
producao_saf.csv: Contém os dados históricos de produção de SAF.

**Estrutura dos Arquivos CSV**
dados_historicos.csv:
```
Year,Demand
2010,1000
2011,1050
...
2023,1650
```

producao_saf.csv:
```
Year,Production
2010,50
2011,60
...
2023,180
```

**Resultados**
O código verifica se as metas de redução de emissões de CO₂ serão atingidas.
Exibe mensagens informando se as metas de 1% até 2027 e de 10% até 2037 serão cumpridas.
Gera um gráfico mostrando as previsões de demanda e produção ao longo dos anos.

###🌟 Exemplo de Saída
```
Ano    | Demanda Estimada (Litros) | Produção Estimada de SAF (Litros)
---------------------------------------------------------------------
2024   | 1635.00                   | 216.00
2025   | 1620.00                   | 259.20
...
2037   | 1485.00                   | 1238.65

✅ A produção de SAF atenderá a demanda geral no ano 2035.
✅ A produção de SAF atingirá a meta de redução de 1% de CO2 no ano 2035.
❌ A produção de SAF não atingirá a meta de redução de 10% de CO2 até 2037.
```

###📂 Estrutura do Projeto
/
├── index.html          # Página principal interativa
├── grafico.html        # Página de upload e visualização de gráficos
├── scripts/
│   ├── calculadora.js  # Código para cálculo de emissões de CO2
│   └── grafico.js      # Código para processamento e visualização dos dados
└── assets/
    └── styles.css      # Estilos para a página
