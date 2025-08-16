// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  // Botões principais
  document.getElementById("addArea").addEventListener("click", adicionarArea);
  document.getElementById("calcular").addEventListener("click", calcular);
  document.getElementById("imprimir").addEventListener("click", prepararImpressao);

  // Gerenciamento de Empresas
  document.getElementById("salvarEmpresa").addEventListener("click", salvarEmpresa);
  document.getElementById("excluirEmpresa").addEventListener("click", excluirEmpresa);
  document.getElementById("listaEmpresas").addEventListener("change", carregarEmpresaSelecionada);
  document.getElementById("empresaLogo").addEventListener("change", exibirLogoPreview);

  // Delegação de evento para botões de remover área
  document.getElementById("areas-container").addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-remover-area")) {
      removerArea(e.target);
    }
  });

  // Persistência dos dados desejados
  carregarDadosDesejados();
  document.getElementById("dadosDesejados").addEventListener("input", salvarDadosDesejados);

  // Carrega a lista de empresas salvas
  carregarListaEmpresas();
});

let logoBase64 = null;

/**
 * Exibe a prévia do logo da empresa.
 * @param {Event} event - O evento de change do input de arquivo.
 */
function exibirLogoPreview(event) {
  // CORREÇÃO APLICADA: Usado event.target.files[0] em vez de event.target.files(0)
  const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
  const logoPreview = document.getElementById("logo-preview");
  logoPreview.innerHTML = ""; // Limpa qualquer prévia anterior

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      logoPreview.appendChild(img);
      logoBase64 = e.target.result; // Salva os dados do logo como Base64
    };
    reader.readAsDataURL(file);
  } else {
    logoBase64 = null;
  }
}

// --- GERENCIAMENTO DE EMPRESAS ---

/**
 * Carrega a lista de empresas do localStorage e preenche o <select>.
 */
function carregarListaEmpresas() {
  const empresas = JSON.parse(localStorage.getItem("empresasCalculadora")) || {};
  const select = document.getElementById("listaEmpresas");
  select.innerHTML = '<option value="">-- Nova Empresa --</option>'; // Limpa e adiciona a opção padrão

  for (const cnpj in empresas) {
    const empresa = empresas[cnpj]; // Pega o objeto da empresa atual
    const option = document.createElement("option");
    option.value = cnpj;
    // CORREÇÃO APLICADA: Usado 'empresa.nome' e 'empresa.cnpj' para exibir o nome correto na lista
    option.textContent = empresa.nome ? `${empresa.nome} (${empresa.cnpj})` : empresa.cnpj;
    select.appendChild(option);
  }
}

/**
 * Salva os dados da empresa no localStorage.
 */
function salvarEmpresa() {
  const nome = document.getElementById("empresaNome").value.trim();
  const cnpj = document.getElementById("empresaCnpj").value.trim();

  if (!nome || !cnpj) {
    alert("Por favor, preencha o Nome e o CNPJ da empresa.");
    return;
  }

  const empresas = JSON.parse(localStorage.getItem("empresasCalculadora")) || {};
  empresas[cnpj] = {
    nome: nome,
    cnpj: cnpj,
    contato: document.getElementById("empresaContato").value,
    endereco: document.getElementById("empresaEndereco").value,
    logo: logoBase64, // Salva o logo junto com as informações da empresa
  };

  localStorage.setItem("empresasCalculadora", JSON.stringify(empresas));
  alert("Empresa salva com sucesso!");
  carregarListaEmpresas();
  document.getElementById("listaEmpresas").value = cnpj; // Seleciona a empresa salva
}

/**
 * Carrega os dados da empresa selecionada no dropdown para os campos do formulário.
 */
function carregarEmpresaSelecionada() {
  const select = document.getElementById("listaEmpresas");
  const cnpj = select.value;
  const empresas = JSON.parse(localStorage.getItem("empresasCalculadora")) || {};
  const logoPreview = document.getElementById("logo-preview");

  if (cnpj && empresas[cnpj]) {
    const empresa = empresas[cnpj];
    document.getElementById("empresaNome").value = empresa.nome;
    document.getElementById("empresaCnpj").value = empresa.cnpj;
    document.getElementById("empresaContato").value = empresa.contato;
    document.getElementById("empresaEndereco").value = empresa.endereco;

    logoPreview.innerHTML = ""; // Limpa a prévia
    if (empresa.logo) {
      logoPreview.innerHTML = `<img src="${empresa.logo}" alt="Logo da Empresa">`;
      logoBase64 = empresa.logo;
    } else {
      logoBase64 = null;
    }
  } else {
    // Limpa os campos se "Nova Empresa" for selecionada
    document.getElementById("empresaNome").value = "";
    document.getElementById("empresaCnpj").value = "";
    document.getElementById("empresaContato").value = "";
    document.getElementById("empresaEndereco").value = "";
    document.getElementById("empresaLogo").value = ""; // Limpa o input de arquivo
    logoPreview.innerHTML = "";
    logoBase64 = null;
  }
}

/**
 * Exclui a empresa selecionada do localStorage.
 */
function excluirEmpresa() {
  const select = document.getElementById("listaEmpresas");
  const cnpj = select.value;
  if (!cnpj) {
    alert("Nenhuma empresa selecionada para excluir.");
    return;
  }

  if (confirm("Tem certeza que deseja excluir esta empresa?")) {
    const empresas = JSON.parse(localStorage.getItem("empresasCalculadora")) || {};
    delete empresas[cnpj];
    localStorage.setItem("empresasCalculadora", JSON.stringify(empresas));
    alert("Empresa excluída com sucesso!");
    carregarEmpresaSelecionada(); // Limpa os campos
    carregarListaEmpresas();
  }
}

// --- GERENCIAMENTO DE ÁREAS ---

function adicionarArea() {
  const areasContainer = document.getElementById("areas-container");
  const novaArea = document.createElement("div");
  novaArea.className = "card area";
  const areaCount = areasContainer.children.length + 1;

  novaArea.innerHTML = `
    <div class="area-header">
      <h4>Área ${areaCount}</h4>
      <button class="btn-danger btn-remover-area">Remover</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Área (ha):</label>
        <input type="number" class="valorArea" placeholder="Ex: 50.5" />
      </div>
      <div class="form-group">
        <label>Umidade Obtida (%):</label>
        <input type="number" class="umidadeObtida" placeholder="Ex: 18.2" />
      </div>
      <div class="form-group">
        <label>População (10m):</label>
        <input type="number" class="populacao10m" placeholder="Plantas em 10m" />
      </div>
      <div class="form-group">
        <label>Peso Médio Espiga (g):</label>
        <input type="number" class="pesoEspiga" placeholder="Ex: 110.5" />
      </div>
    </div>
  `;
  areasContainer.appendChild(novaArea);
}

function removerArea(botao) {
  const areaParaRemover = botao.closest(".area");
  areaParaRemover.remove();
  renumerarAreas();
}

function renumerarAreas() {
  const areas = document.querySelectorAll("#areas-container .area");
  areas.forEach((area, index) => {
    area.querySelector("h4").textContent = `Área ${index + 1}`;
  });
}

// --- CÁLCULO E EXIBIÇÃO ---

function formatarNumero(numero) {
  if (isNaN(numero) || !isFinite(numero)) {
    return "0,00";
  }
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calcular() {
  const areas = document.querySelectorAll("#areas-container .area");
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = "";

  const umidadeDesejada = parseFloat(document.getElementById("umidadeDesejada").value) || 0;
  const produtividadeDesejada = parseFloat(document.getElementById("produtividadeDesejada").value) || 0;

  let producaoRealTotal = 0;
  let producaoContratadaTotal = 0;

  areas.forEach((area, index) => {
    const valorArea = parseFloat(area.querySelector(".valorArea").value) || 0;
    const umidadeObtida = parseFloat(area.querySelector(".umidadeObtida").value) || 0;
    const populacao10m = parseFloat(area.querySelector(".populacao10m").value) || 0;
    const pesoEspiga = parseFloat(area.querySelector(".pesoEspiga").value) || 0;

    const populacaoReal = (10000 / 0.7) * (populacao10m / 10);
    const pesoMedioCorrigido = ((100 - umidadeObtida) / (100 - umidadeDesejada)) * pesoEspiga;
    const produtividadeEstimada = (pesoMedioCorrigido * populacaoReal) / 1000;
    const producaoContratada = valorArea * produtividadeDesejada;
    const producaoReal = valorArea * produtividadeEstimada;
    const producaoEmSacos = producaoReal / 60;

    let porcentagemPerdas = 0;
    if (produtividadeDesejada > 0) {
      porcentagemPerdas = ((produtividadeDesejada - produtividadeEstimada) / produtividadeDesejada) * 100;
    }

    producaoContratadaTotal += producaoContratada;
    producaoRealTotal += producaoReal;

    const resultadoHTML = `
      <div class="card resultado-card">
        <h3>Resultados para Área ${index + 1} (${formatarNumero(valorArea)} ha)</h3>
        <div class="resultado-grid">
          <div class="resultado-item">
            <p>População Real</p>
            <strong>${formatarNumero(populacaoReal)} plantas/ha</strong>
          </div>
          <div class="resultado-item">
            <p>Peso Médio Corrigido</p>
            <strong>${formatarNumero(pesoMedioCorrigido)} g</strong>
          </div>
          <div class="resultado-item">
            <p>Produtividade Estimada</p>
            <strong>${formatarNumero(produtividadeEstimada)} kg/ha</strong>
          </div>
          <div class="resultado-item">
            <p>Produção em Sacos</p>
            <strong>${formatarNumero(producaoEmSacos)} sacos</strong>
          </div>
          <div class="resultado-item">
            <p>Produção Contratada</p>
            <strong>${formatarNumero(producaoContratada)} kg</strong>
          </div>
          <div class="resultado-item">
            <p>Produção Real</p>
            <strong>${formatarNumero(producaoReal)} kg</strong>
          </div>
          <div class="resultado-item">
            <p>Porcentagem de Perdas</p>
            <strong>${formatarNumero(porcentagemPerdas)}%</strong>
          </div>
        </div>
      </div>
    `;
    resultadosContainer.innerHTML += resultadoHTML;
  });

  let porcentagemPerdaTotal = 0;
  if (producaoContratadaTotal > 0) {
    porcentagemPerdaTotal = ((producaoContratadaTotal - producaoRealTotal) / producaoContratadaTotal) * 100;
  }

  const totalHTML = `
    <div class="card resultado-card total">
      <h3>Resultados Totais</h3>
      <div class="resultado-grid">
        <div class="resultado-item">
          <p>Produção Contratada Total</p>
          <strong>${formatarNumero(producaoContratadaTotal)} kg</strong>
        </div>
        <div class="resultado-item">
          <p>Produção Real Total</p>
          <strong>${formatarNumero(producaoRealTotal)} kg</strong>
        </div>
        <div class="resultado-item">
          <p>Porcentagem de Perda Total</p>
          <strong>${formatarNumero(porcentagemPerdaTotal)}%</strong>
        </div>
      </div>
    </div>
  `;
  resultadosContainer.innerHTML += totalHTML;
}

// --- IMPRESSÃO ---

function prepararImpressao() {
  const resultadosContainer = document.getElementById("resultados-container");
  if (resultadosContainer.innerHTML.trim() === "") {
    alert("Por favor, realize o cálculo antes de imprimir o relatório.");
    return;
  }

  document.getElementById("relatorio-empresa-nome").textContent = document.getElementById("empresaNome").value;
  document.getElementById("relatorio-empresa-cnpj").textContent = `CNPJ: ${document.getElementById("empresaCnpj").value}`;
  document.getElementById("relatorio-empresa-contato").textContent = document.getElementById("empresaContato").value;
  document.getElementById("relatorio-empresa-endereco").textContent = document.getElementById("empresaEndereco").value;
  document.getElementById("relatorio-produtor").textContent = document.getElementById("nomeProdutor").value;
  document.getElementById("relatorio-cpf").textContent = document.getElementById("cpfProdutor").value;

  const logoRelatorio = document.getElementById("relatorio-logo-empresa");
  logoRelatorio.src = logoBase64 || "https://via.placeholder.com/150x80.png?text=Logo+Empresa";

  const umidadeDesejada = document.getElementById("umidadeDesejada").value;
  const produtividadeDesejada = document.getElementById("produtividadeDesejada").value;
  const sacosDesejados = document.getElementById("sacosDesejados").value;
  const populacaoDesejada = document.getElementById("populacaoDesejada").value;
  const pesoEspigaDesejado = document.getElementById("pesoEspigaDesejado").value;

  document.getElementById("relatorio-dados-desejados").innerHTML = `
      <h3>Parâmetros de Cálculo</h3>
      <p><strong>Umidade Desejada:</strong> ${umidadeDesejada}%</p>
      <p><strong>Produtividade Meta:</strong> ${produtividadeDesejada} kg/ha</p>
      <p><strong>Sacos Desejados:</strong> ${sacosDesejados} sacos/TA</p>
      <p><strong>População Meta:</strong> ${populacaoDesejada} plantas/ha</p>
      <p><strong>Peso Médio Espiga Meta:</strong> ${pesoEspigaDesejado} g</p>
  `;

  const resultadosImpressao = document.getElementById("resultados-impressao");
  resultadosImpressao.innerHTML = resultadosContainer.innerHTML;

  window.print();
}

// --- PERSISTÊNCIA DE DADOS ---

function salvarDadosDesejados() {
  const dados = {
    umidade: document.getElementById("umidadeDesejada").value,
    produtividade: document.getElementById("produtividadeDesejada").value,
    sacos: document.getElementById("sacosDesejados").value,
    populacao: document.getElementById("populacaoDesejada").value,
    pesoEspiga: document.getElementById("pesoEspigaDesejado").value,
  };
  localStorage.setItem("dadosDesejadosCalculadora", JSON.stringify(dados));
}

function carregarDadosDesejados() {
  const dados = JSON.parse(localStorage.getItem("dadosDesejadosCalculadora"));
  if (dados) {
    document.getElementById("umidadeDesejada").value = dados.umidade || 13;
    document.getElementById("produtividadeDesejada").value = dados.produtividade || 5500;
    document.getElementById("sacosDesejados").value = dados.sacos || 27.78;
    document.getElementById("populacaoDesejada").value = dados.populacao || 50400;
    document.getElementById("pesoEspigaDesejado").value = dados.pesoEspiga || 109.13;
  }
}
