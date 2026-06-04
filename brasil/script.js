// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleFloatingSimulator();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== FLOATING SIMULATOR =====
const floatingSimulator = document.getElementById('floatingSimulator');
let simulatorSection = null;

function handleFloatingSimulator() {
  if (!simulatorSection) simulatorSection = document.getElementById('simulador');
  if (!simulatorSection) return;

  const simTop = simulatorSection.getBoundingClientRect().top;
  const scrollY = window.scrollY;

  // Show after scrolling 400px, hide when near simulator section
  if (scrollY > 400 && simTop > 200) {
    floatingSimulator.classList.add('visible');
  } else {
    floatingSimulator.classList.remove('visible');
  }
}

// ===== SIMULADOR =====
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function calcularSimulacao() {
  const empreendimento = document.getElementById('sim-empreendimento').value;
  const valorBase = parseFloat(document.getElementById('sim-valor').value) || 450000;
  const entradaPct = parseFloat(document.getElementById('sim-entrada-pct').value) || 20;
  const prazo = parseInt(document.getElementById('sim-prazo').value) || 48;
  const valorizacaoPct = parseFloat(document.getElementById('sim-valorizacao-pct').value) || 15;
  const modalidade = document.getElementById('sim-modalidade').value;

  // Validações
  const valorFinal = Math.max(100000, Math.min(10000000, valorBase));
  const entradaFinal = Math.max(10, Math.min(50, entradaPct));
  const valorizacaoFinal = Math.max(5, Math.min(30, valorizacaoPct));

  // Cálculos
  const entrada = valorFinal * (entradaFinal / 100);
  const restante = valorFinal - entrada;
  const parcelaMensal = restante / prazo;
  const anosObra = prazo / 12;
  const valorEntrega = valorFinal * Math.pow(1 + valorizacaoFinal / 100, anosObra);
  const lucro = valorEntrega - valorFinal;
  const roi = (lucro / entrada) * 100;

  // Renda estimada
  let rendaMensal = 0;
  if (modalidade === 'arrendamento') {
    rendaMensal = valorEntrega * 0.006; // 0.6% ao mês
  } else if (modalidade === 'temporada') {
    rendaMensal = valorEntrega * 0.012; // 1.2% ao mês (temporada)
  }

  // Atualizar UI
  const empNome = empreendimento === 'morata' ? 'Residencial Morata' : 'Evidence Residence';
  document.getElementById('sim-emp-nome').textContent = empNome;
  document.getElementById('res-valor').textContent = formatCurrency(valorFinal);
  document.getElementById('res-entrada').textContent = formatCurrency(entrada);
  document.getElementById('res-parcelas').textContent = formatCurrency(parcelaMensal) + '/mês';
  document.getElementById('res-valor-entrega').textContent = formatCurrency(valorEntrega);
  document.getElementById('res-lucro').textContent = formatCurrency(lucro);
  document.getElementById('res-roi').textContent = roi.toFixed(0) + '%';

  const rendaItem = document.getElementById('res-renda-item');
  const rendaEl = document.getElementById('res-renda');
  if (modalidade === 'revenda') {
    rendaItem.style.display = 'none';
  } else {
    rendaItem.style.display = 'flex';
    const tipoRenda = modalidade === 'temporada' ? 'Renda Mensal (Temporada)' : 'Renda Mensal (Anual)';
    rendaItem.querySelector('.resultado-label').textContent = tipoRenda;
    rendaEl.textContent = formatCurrency(rendaMensal) + '/mês';
  }
}

// Inicializar simulador
document.addEventListener('DOMContentLoaded', () => {
  calcularSimulacao();

  // Recalcular ao mudar qualquer campo
  ['sim-empreendimento', 'sim-valor', 'sim-prazo', 'sim-modalidade'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', calcularSimulacao);
  });
  document.getElementById('sim-valor').addEventListener('input', calcularSimulacao);
});

// ===== LIGHTBOX =====
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== INTERSECTION OBSERVER (Animações) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.motivo-card, .vantagem-item, .diferencial, .contacto-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
// ===== SIMULADOR BRASIL — TABELA DE UNIDADES + RENTABILIDADE =====

const SHEETS_ID = '1sN_UpkmsFO5iSPPHe5V0Y8UkgZCoDPHCcInGh-GbZDI';
const SHEETS = {
  evidence: 'EVIDENCE MARCO 2026',
  morata: 'MORATA MARCO 2026'
};

// Datas de início dos contratos
const DATAS_INICIO = {
  evidence: { ano: 2025, mes: 7 }, // 2.º semestre 2025
  morata:   { ano: 2027, mes: 7 }  // 2.º semestre 2027
};

let empAtual = 'evidence';
let unidadeAtual = null;
let perspectiva = 'realista';
const TAXA = { realista: 0.18, conservadora: 0.10 };

function formatBRL(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

function parseBRL(str) {
  if (!str) return 0;
  // Remove "R$", todos os espaços (incluindo separadores de milhar como "R$ 92 300,16"), pontos de milhar e substitui vírgula por ponto
  return parseFloat(str.replace(/R\$\s*/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
}

function selecionarEmpreendimento(emp) {
  empAtual = emp;
  document.getElementById('btn-evidence').classList.toggle('active', emp === 'evidence');
  document.getElementById('btn-morata').classList.toggle('active', emp === 'morata');
  unidadeAtual = null;
  document.getElementById('sim-step-3').style.display = 'none';
  document.getElementById('sim-step-4').style.display = 'none';
  carregarUnidades(emp);
}

async function carregarUnidades(emp) {
  const loading = document.getElementById('sim-loading');
  const wrapper = document.getElementById('sim-table-wrapper');
  loading.style.display = 'flex';
  wrapper.style.display = 'none';

  try {
    const sheetName = encodeURIComponent(SHEETS[emp]);
    const url = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    const resp = await fetch(url);
    const text = await resp.text();
    const rows = parseCSV(text);
    renderTabela(rows, emp);
  } catch (e) {
    loading.innerHTML = '<p style="color:#e74c3c">Erro ao carregar unidades. Tente novamente.</p>';
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

function renderTabela(rows, emp) {
  const loading = document.getElementById('sim-loading');
  const wrapper = document.getElementById('sim-table-wrapper');
  const tbody = document.getElementById('sim-table-body');
  const info = document.getElementById('sim-table-info');

  // Encontrar a linha de cabeçalho (contém "UNIDADE")
  let headerRow = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].some(c => c.toUpperCase().includes('UNIDADE'))) {
      headerRow = i;
      break;
    }
  }

  if (headerRow === -1) {
    loading.innerHTML = '<p style="color:#e74c3c">Formato de dados não reconhecido.</p>';
    return;
  }

  // Dados começam na linha seguinte ao cabeçalho
  const dataRows = rows.slice(headerRow + 1).filter(r => r[0] && r[0].trim() !== '');

  // Contar disponíveis
  const disponiveis = dataRows.filter(r => r[3] && r[3].toLowerCase().includes('disponível') || r[3] && r[3].toLowerCase().includes('disponivel'));
  info.innerHTML = `<span class="sim-count-disp">${disponiveis.length} unidades disponíveis</span> de ${dataRows.length} total`;

  tbody.innerHTML = '';
  dataRows.forEach((row, idx) => {
    const [unidade, area, tipologia, situacao, entrada, mensalidade, anuidade, chaves, total] = row;
    const isDisp = situacao && (situacao.toLowerCase().includes('disponível') || situacao.toLowerCase().includes('disponivel'));
    const isRes = situacao && situacao.toLowerCase().includes('reservada');

    const tr = document.createElement('tr');
    tr.className = isDisp ? 'row-disponivel' : isRes ? 'row-reservada' : 'row-vendida';

    const statusClass = isDisp ? 'badge-disponivel' : isRes ? 'badge-reservada' : 'badge-vendida';
    const statusLabel = isDisp ? 'Disponível' : isRes ? 'Reservada' : 'Vendida';

    tr.innerHTML = `
      <td><strong>${unidade || '—'}</strong></td>
      <td>${area || '—'}</td>
      <td>${tipologia || '—'}</td>
      <td><span class="sim-badge ${statusClass}">${statusLabel}</span></td>
      <td>${entrada || '—'}</td>
      <td>${mensalidade || '—'}</td>
      <td>${anuidade || '—'}</td>
      <td>${chaves || '—'}</td>
      <td><strong>${total || '—'}</strong></td>
      <td>${isDisp ? `<button class="btn-selecionar" onclick="selecionarUnidade(${idx}, this)">Selecionar</button>` : '<span class="btn-indisponivel">Indisponível</span>'}</td>
    `;

    // Guardar dados na linha
    tr.dataset.unidade = unidade || '';
    tr.dataset.area = area || '';
    tr.dataset.tipologia = tipologia || '';
    tr.dataset.entrada = entrada || '';
    tr.dataset.mensalidade = mensalidade || '';
    tr.dataset.anuidade = anuidade || '';
    tr.dataset.chaves = chaves || '';
    tr.dataset.total = total || '';

    tbody.appendChild(tr);
  });

  loading.style.display = 'none';
  wrapper.style.display = 'block';
}

function selecionarUnidade(idx, btn) {
  // Remover selecção anterior
  document.querySelectorAll('#sim-table-body tr').forEach(tr => tr.classList.remove('row-selected'));
  document.querySelectorAll('.btn-selecionar').forEach(b => b.textContent = 'Selecionar');

  const tr = document.querySelectorAll('#sim-table-body tr')[idx];
  tr.classList.add('row-selected');
  btn.textContent = '✓ Selecionado';

  unidadeAtual = {
    unidade: tr.dataset.unidade,
    area: tr.dataset.area,
    tipologia: tr.dataset.tipologia,
    entrada: parseBRL(tr.dataset.entrada),
    mensalidade: parseBRL(tr.dataset.mensalidade),
    anuidade: parseBRL(tr.dataset.anuidade),
    chaves: parseBRL(tr.dataset.chaves),
    total: parseBRL(tr.dataset.total)
  };

  mostrarDetalhe();
  mostrarRentabilidade();

  // Scroll suave para o passo 3
  setTimeout(() => {
    document.getElementById('sim-step-3').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function mostrarDetalhe() {
  const u = unidadeAtual;
  const empNome = empAtual === 'evidence' ? 'Evidence Residencial' : 'Residencial Morata';

  document.getElementById('det-emp-nome').textContent = empNome;
  document.getElementById('det-unidade').textContent = 'Unidade ' + u.unidade;
  document.getElementById('det-area').textContent = u.area + ' m²';
  document.getElementById('det-tipologia').textContent = u.tipologia;
  document.getElementById('det-entrada').textContent = formatBRL(u.entrada);
  document.getElementById('det-mensalidade').textContent = formatBRL(u.mensalidade) + ' × 120';
  document.getElementById('det-anuidade').textContent = formatBRL(u.anuidade) + ' × 10';
  document.getElementById('det-chaves').textContent = formatBRL(u.chaves);
  document.getElementById('det-total').textContent = formatBRL(u.total);

  // Preencher input da anuidade
  document.getElementById('input-anuidade').value = u.anuidade.toFixed(2);
  recalcularMensalidade();

  document.getElementById('sim-step-3').style.display = 'block';
}

function recalcularMensalidade() {
  if (!unidadeAtual) return;
  const u = unidadeAtual;
  const novaAnuidade = parseFloat(document.getElementById('input-anuidade').value) || 0;
  const totalAnuidades = novaAnuidade * 10;
  const restante = u.total - u.entrada - u.chaves - totalAnuidades;
  const novaMensalidade = restante / 120;

  document.getElementById('nova-mensalidade').textContent = formatBRL(novaMensalidade) + ' × 120';
  document.getElementById('total-anuidades').textContent = formatBRL(totalAnuidades);
  document.getElementById('total-mensalidades').textContent = formatBRL(Math.max(0, restante));

  // Actualizar unidadeAtual com novos valores para o simulador de rentabilidade
  unidadeAtual._anuidade_custom = novaAnuidade;
  unidadeAtual._mensalidade_custom = Math.max(0, novaMensalidade);

  if (document.getElementById('sim-step-4').style.display !== 'none') {
    calcularRentabilidade();
  }
}

function mostrarRentabilidade() {
  document.getElementById('sim-step-4').style.display = 'block';
  calcularRentabilidade();
}

function setPerspectiva(p) {
  perspectiva = p;
  document.getElementById('btn-realista').classList.toggle('active', p === 'realista');
  document.getElementById('btn-conservadora').classList.toggle('active', p === 'conservadora');
  calcularRentabilidade();
}

function calcularRentabilidade() {
  if (!unidadeAtual) return;

  const u = unidadeAtual;
  const meses = parseInt(document.getElementById('sim-meses').value) || 24;
  document.getElementById('sim-meses-val').value = meses;
  document.getElementById('rent-mes-label').textContent = meses;

  const taxa = TAXA[perspectiva];
  const taxaMensal = Math.pow(1 + taxa, 1/12) - 1;

  // Datas
  const inicio = DATAS_INICIO[empAtual];
  const dataInicio = new Date(inicio.ano, inicio.mes - 1, 1);
  const dataVenda = new Date(dataInicio);
  dataVenda.setMonth(dataVenda.getMonth() + meses);

  const mesesNomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  document.getElementById('rent-data-inicio').textContent = mesesNomes[dataInicio.getMonth()] + ' ' + dataInicio.getFullYear();
  document.getElementById('rent-data-venda').textContent = mesesNomes[dataVenda.getMonth()] + ' ' + dataVenda.getFullYear();
  document.getElementById('rent-valor-base').textContent = formatBRL(u.total);

  // Anuidade e mensalidade (custom ou original)
  const anuidade = u._anuidade_custom !== undefined ? u._anuidade_custom : u.anuidade;
  const mensalidade = u._mensalidade_custom !== undefined ? u._mensalidade_custom : u.mensalidade;

  // Calcular total investido até X meses
  // Entrada: paga no início (mês 0)
  const entrada = u.entrada;

  // Mensalidades: pagas do mês 1 ao mês X (ou até ao fim do contrato, 120 meses)
  const mesesMensalidade = Math.min(meses, 120);
  const totalMensalidades = mensalidade * mesesMensalidade;

  // Anuidades: 1.ª no mês 12, 2.ª no mês 24, etc.
  // Pagas nos meses 12, 24, 36, 48, 60, 72, 84, 96, 108, 120
  let anuidades_pagas = 0;
  let num_anuidades = 0;
  for (let m = 12; m <= meses && m <= 120; m += 12) {
    anuidades_pagas += anuidade;
    num_anuidades++;
  }

  const totalInvestido = entrada + totalMensalidades + anuidades_pagas;

  // Valor de venda previsto: valorização sobre o valor total do imóvel
  const anos = meses / 12;
  const valorVenda = u.total * Math.pow(1 + taxa, anos);

  // Ganho: o comprador paga ao vendedor o que ele investiu + a valorização
  // O vendedor recebe: totalInvestido + (valorVenda - u.total)
  // Ganho = valorVenda - u.total (a valorização é o lucro)
  const ganho = valorVenda - u.total;
  const roi = totalInvestido > 0 ? (ganho / totalInvestido) * 100 : 0;

  // Actualizar UI
  const label = perspectiva === 'realista' ? 'Perspectiva Realista (18%/ano)' : 'Perspectiva Conservadora (10%/ano)';
  document.getElementById('rent-perspectiva-label').textContent = label;

  document.getElementById('rent-investido').textContent = formatBRL(totalInvestido);
  document.getElementById('rent-investido-detail').textContent = `entrada + ${mesesMensalidade} mensalidades + ${num_anuidades} anuidade(s)`;

  document.getElementById('rent-valor-venda').textContent = formatBRL(valorVenda);
  document.getElementById('rent-valor-venda-detail').textContent = `${formatBRL(u.total)} × (1 + ${(taxa*100).toFixed(0)}%)^${anos.toFixed(2)} anos`;

  document.getElementById('rent-ganho').textContent = formatBRL(ganho);
  document.getElementById('rent-ganho-detail').textContent = `valorização de ${(taxa*100).toFixed(0)}%/ano sobre ${formatBRL(u.total)}`;

  document.getElementById('rent-roi').textContent = roi.toFixed(1) + '% sobre capital investido';

  // Breakdown
  document.getElementById('bd-entrada').textContent = formatBRL(entrada);
  document.getElementById('bd-mensalidades').textContent = formatBRL(totalMensalidades) + ` (${mesesMensalidade}×)`;
  document.getElementById('bd-anuidades-pagas').textContent = formatBRL(anuidades_pagas) + ` (${num_anuidades}×)`;
  document.getElementById('bd-total').textContent = formatBRL(totalInvestido);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  carregarUnidades('evidence');

  // Listener do slider de meses
  document.getElementById('sim-meses').addEventListener('input', calcularRentabilidade);
  document.getElementById('sim-meses-val').addEventListener('input', function() {
    document.getElementById('sim-meses').value = this.value;
    calcularRentabilidade();
  });
});
