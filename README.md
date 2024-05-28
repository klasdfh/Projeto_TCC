# Projeto_TCC
Repositório destinado ao TCC de Arthur Felipe - Aplicação de sustainable aviation fuels (SAFs) no Brasil

# Predição de Demanda e Produção de SAF

## Descrição

Este projeto tem como objetivo prever a demanda futura de querosene de aviação (QAV) e a produção de combustível de aviação sustentável (SAF) no Brasil, com base em dados históricos. O projeto utiliza dados de consumo e produção de anos anteriores para estimar a demanda e a produção até 2037, considerando as metas de redução de emissões de CO₂ estabelecidas pelo governo brasileiro.

## Funcionalidades

- Leitura de arquivos CSV contendo dados históricos de demanda e produção de QAV e SAF.
- Previsão da demanda de QAV e produção de SAF para os anos de 2024 a 2037.
- Verificação das metas de redução de CO₂: 1% até 2027 e 10% até 2037.
- Geração de gráficos para visualização das previsões.
- Exibição de resultados em uma tabela e mensagens indicativas se as metas foram ou não atingidas.

## Como usar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexão à internet para carregar bibliotecas externas

### Passos

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2. Abra o arquivo `index.html` em seu navegador.

3. Faça upload dos arquivos CSV contendo os dados históricos:
    - `dados_historicos.csv`: Contém os dados históricos de demanda de QAV.
    - `producao_saf.csv`: Contém os dados históricos de produção de SAF.

### Estrutura dos Arquivos CSV

- `dados_historicos.csv`:
    ```csv
    Year,Demand
    2010,1000
    2011,1050
    ...
    2023,1650
    ```

- `producao_saf.csv`:
    ```csv
    Year,Production
    2010,50
    2011,60
    ...
    2023,180
    ```

### Funcionalidades do Código

O código JavaScript do projeto realiza as seguintes tarefas:

1. **Leitura dos arquivos CSV**:
    Utiliza a biblioteca [PapaParse](https://www.papaparse.com/) para ler os arquivos CSV.

2. **Predição da demanda e produção futuras**:
    Previsões baseadas em dados históricos e nas metas de redução de CO₂.

3. **Cálculo das emissões de CO₂**:
    ```latex
    \[
    \text{Emissão de CO}_2 \text{ por km} = \frac{2.682 \text{ g de CO}_2}{2.84 \text{ km/l}} = 944 \text{ g de CO}_2 \text{ por km}
    \]
    ```

4. **Geração de gráficos**:
    Utiliza a biblioteca [Chart.js](https://www.chartjs.org/) para gerar gráficos das previsões de demanda e produção.

### Resultados

- O código verifica se as metas de redução de emissões de CO₂ serão atingidas.
- Exibe mensagens informando se as metas de 1% até 2027 e de 10% até 2037 serão cumpridas.
- Gera um gráfico mostrando as previsões de demanda e produção ao longo dos anos.

### Exemplo de Saída

```plaintext
Ano    | Demanda Estimada (Litros) | Produção Estimada de SAF (Litros)
---------------------------------------------------------------------
2024   | 1635.00                   | 216.00
2025   | 1620.00                   | 259.20
...
2037   | 1485.00                   | 1238.65

✅ A produção de SAF atenderá a demanda geral no ano 2035.
✅ A produção de SAF atingirá a meta de redução de 1% de CO2 no ano 2035.
❌ A produção de SAF não atingirá a meta de redução de 10% de CO2 até 2037.
