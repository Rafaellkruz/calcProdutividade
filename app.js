function calcular() {
  const umidadeDesejada = parseFloat(document.getElementById('umidadeDesejada').value);
  const produtividadeDesejada = parseFloat(document.getElementById('produtividadeDesejada').value);
  const sacosDesejados = parseFloat(document.getElementById('sacosDesejados').value);
  const populacaoDesejada = parseFloat(document.getElementById('populacaoDesejada').value);
  const pesoEspigaDesejado = parseFloat(document.getElementById('pesoEspigaDesejado').value);

  const areas = document.querySelectorAll('.area');
  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = '';

  let producaoRealTotal = 0;
  let producaoContratadaTotal = 0;

  areas.forEach((area, index) => {
      const valorArea = parseFloat(area.querySelector('.valorArea').value);
      const umidadeObtida = parseFloat(area.querySelector('.umidadeObtida').value);
      const populacao10m = parseFloat(area.querySelector('.populacao10m').value);
      const pesoEspiga = parseFloat(area.querySelector('.pesoEspiga').value);

      // Cálculo da população real
      const populacaoReal = (10000 / 0.7) * (populacao10m / 10);

      // Cálculo do Peso Médio Corrigido usando a umidade desejada
      const pesoMedioCorrigido = ((100 - umidadeObtida) / (100 - umidadeDesejada)) * pesoEspiga;

      // Cálculo da produtividade estimada
      const produtividadeEstimada = (pesoMedioCorrigido * populacaoReal) / 1000;

      // Cálculo da produção contratada para a área
      const producaoContratada = valorArea * produtividadeDesejada; // kg
      producaoContratadaTotal += producaoContratada;

      // Cálculo da produção real para a área
      const producaoReal = valorArea * produtividadeEstimada; // kg
      producaoRealTotal += producaoReal;

      // Cálculo dos sacos por tarefa
      const sacosPorTarefa = (produtividadeEstimada / 3.3) / 60;

      // Cálculo da porcentagem de perdas
      const porcentagemPerdas = ((5500 - produtividadeEstimada) / 5500) * 100;

      // Exibir os resultados
      resultadosDiv.innerHTML += `
          <div class="resultados">
              <h3>Resultados para Área ${index + 1}</h3>
              <p><strong>Valor da Área:</strong> ${formatarNumero(valorArea)} ha</p>
              <p><strong>População Real:</strong> ${formatarNumero(populacaoReal)} plantas/há</p>
              <p><strong>Produtividade Estimada:</strong> ${formatarNumero(produtividadeEstimada)} kg/ha</p>
              <p><strong>Peso Médio Corrigido:</strong> ${formatarNumero(pesoMedioCorrigido)} g</p>
              <p><strong>Sacos por Tarefa:</strong> ${formatarNumero(sacosPorTarefa)} sacos/TA</p>
              <p><strong>Produção Contratada:</strong> ${formatarNumero(producaoContratada)} kg</p>
              <p><strong>Produção Real:</strong> ${formatarNumero(producaoReal)} kg</p>
              <p><strong>Porcentagem de Perdas:</strong> ${formatarNumero(porcentagemPerdas)}%</p>
          </div>
      `;
  });

  // Cálculo da produção total e porcentagem de perda total
  const porcentagemPerdaTotal = ((producaoContratadaTotal - producaoRealTotal) / producaoContratadaTotal) * 100;

  resultadosDiv.innerHTML += `
      <div class="resultados">
          <h3>Resultados Totais</h3>
          <p><strong>Produção Total:</strong> ${formatarNumero(producaoRealTotal)} kg</p>
          <p><strong>Produção Contratada Total:</strong> ${formatarNumero(producaoContratadaTotal)} kg</p>
          <p><strong>Porcentagem de Perda Total:</strong> ${formatarNumero(porcentagemPerdaTotal)}%</p>
      </div>
  `;
}
