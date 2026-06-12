const API_ENDPOINT = 'api/index.php';

const STORAGE_KEYS = {
  sidebarCollapsed: 'gao_sidebar_collapsed',
  theme: 'gao_theme',
  thermalBaudRate: 'gao_thermal_baud_rate',
  thermalMode: 'gao_thermal_mode'
};

const state = {
  user: null,
  perfil: null,
  csrfToken: '',
  data: {
    clientes: [],
    orcamentos: [],
    vendas: [],
    logs: [],
    financeiro: [],
    lembretes: [],
    categorias: [],
    produtos: [],
    fornecedores: [],
    inventoryMovements: [],
    pedidos: []
  },
  charts: {},
  dashboardPeriod: 'today',
  reminderNoticeKey: ''
};

const dom = {
  loginScreen: document.getElementById('login-screen'),
  appShell: document.getElementById('app-shell'),
  loginForm: document.getElementById('login-form'),
  loginUser: document.getElementById('login-user'),
  profileSelectButtons: document.querySelectorAll('.profile-select'),
  loginPassword: document.getElementById('login-password'),
  togglePassword: document.getElementById('toggle-password'),
  logoutBtn: document.getElementById('logout-btn'),
  navLinks: document.querySelectorAll('.nav-link'),
  views: document.querySelectorAll('.view'),
  viewTitle: document.getElementById('view-title'),
  viewSubtitle: document.getElementById('view-subtitle'),
  profileName: document.getElementById('profile-name'),
  profileRole: document.getElementById('profile-role'),
  profileAvatar: document.getElementById('profile-avatar'),
  menuBtn: document.getElementById('menu-btn'),
  sidebar: document.querySelector('.sidebar'),
  refreshBtn: document.getElementById('refresh-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  sessionChip: document.getElementById('session-chip'),
  toast: document.getElementById('toast'),
  loading: document.getElementById('loading'),
  drawer: document.getElementById('drawer'),
  drawerBody: document.getElementById('drawer-body'),
  drawerClose: document.getElementById('drawer-close'),
  modal: document.getElementById('modal'),
  modalContent: document.getElementById('modal-content'),
  clienteForm: document.getElementById('cliente-form'),
  clienteTable: document.getElementById('cliente-table').querySelector('tbody'),
  clienteSearch: document.getElementById('cliente-search'),
  orcamentoForm: document.getElementById('orcamento-form'),
  orcamentoTable: document.getElementById('orcamento-table').querySelector('tbody'),
  orcamentoSearch: document.getElementById('orcamento-search'),
  vendaForm: document.getElementById('venda-form'),
  vendaTable: document.getElementById('venda-table').querySelector('tbody'),
  vendaSearch: document.getElementById('venda-search'),
  productForm: document.getElementById('product-form'),
  productFormReset: document.getElementById('product-form-reset'),
  productTable: document.getElementById('product-table')?.querySelector('tbody'),
  productSearch: document.getElementById('product-search'),
  productCategories: document.getElementById('product-categories'),
  supplierDatalist: document.getElementById('supplier-datalist'),
  fornecedorForm: document.getElementById('fornecedor-form'),
  fornecedorFormReset: document.getElementById('fornecedor-form-reset'),
  fornecedorTable: document.getElementById('fornecedor-table')?.querySelector('tbody'),
  fornecedorSearch: document.getElementById('fornecedor-search'),
  inventoryForm: document.getElementById('inventory-form'),
  inventoryProduct: document.getElementById('inventory-product'),
  inventoryTable: document.getElementById('inventory-table')?.querySelector('tbody'),
  orderTable: document.getElementById('order-table')?.querySelector('tbody'),
  orderSearch: document.getElementById('order-search'),
  financeiroForm: document.getElementById('financeiro-form'),
  financeiroTable: document.getElementById('financeiro-table').querySelector('tbody'),
  financeiroSearch: document.getElementById('financeiro-search'),
  financeiroTipo: document.getElementById('financeiro-tipo'),
  financeiroCategoria: document.getElementById('financeiro-categoria'),
  financeiroStatus: document.getElementById('financeiro-status'),
  lembreteForm: document.getElementById('lembrete-form'),
  lembreteTable: document.getElementById('lembrete-table').querySelector('tbody'),
  lembreteSearch: document.getElementById('lembrete-search'),
  lembreteCount: document.getElementById('lembrete-count'),
  logTable: document.getElementById('log-table').querySelector('tbody'),
  orcamentoCliente: document.getElementById('orcamento-cliente'),
  vendaCliente: document.getElementById('venda-cliente'),
  scriptUrl: document.getElementById('script-url'),
  saveScriptUrl: document.getElementById('save-script-url'),
  testPdf: document.getElementById('test-pdf'),
  testPrint: document.getElementById('test-print'),
  testThermal: document.getElementById('test-thermal'),
  thermalStatus: document.getElementById('thermal-status'),
  thermalBaud: document.getElementById('thermal-baud'),
  thermalMode: document.getElementById('thermal-mode'),
  thermalConnect: document.getElementById('thermal-connect'),
  thermalDisconnect: document.getElementById('thermal-disconnect'),
  exportClientes: document.getElementById('export-clientes'),
  exportVendas: document.getElementById('export-vendas'),
  exportFinanceiro: document.getElementById('export-financeiro'),
  dashboardPeriod: document.getElementById('dashboard-period'),
  dashboardPeriodLabel: document.getElementById('dashboard-period-label'),
  dashSaldoGeral: document.getElementById('dash-saldo-geral'),
  dashSaldoGeralInfo: document.getElementById('dash-saldo-geral-info'),
  dashEntradas: document.getElementById('dash-entradas'),
  dashEntradasCompare: document.getElementById('dash-entradas-compare'),
  dashSaidas: document.getElementById('dash-saidas'),
  dashSaidasCompare: document.getElementById('dash-saidas-compare'),
  dashSaldo: document.getElementById('dash-saldo'),
  dashSaldoCompare: document.getElementById('dash-saldo-compare'),
  dashDre: document.getElementById('dash-dre'),
  dashDreCompare: document.getElementById('dash-dre-compare'),
  dashOrcamentos: document.getElementById('dash-orcamentos'),
  dashConversao: document.getElementById('dash-conversao'),
  dashVendas: document.getElementById('dash-vendas'),
  dashTicket: document.getElementById('dash-ticket'),
  dashAportes: document.getElementById('dash-aportes'),
  dashAportesCompare: document.getElementById('dash-aportes-compare'),
  dashMargem: document.getElementById('dash-margem'),
  dashClientes: document.getElementById('dash-clientes'),
  drePeriodLabel: document.getElementById('dre-period-label'),
  dreReceitaOp: document.getElementById('dre-receita-op'),
  dreOutrasEntradas: document.getElementById('dre-outras-entradas'),
  dreCustos: document.getElementById('dre-custos'),
  dreDespesas: document.getElementById('dre-despesas'),
  dreResultadoOp: document.getElementById('dre-resultado-op'),
  dreResultadoLiquido: document.getElementById('dre-resultado-liquido'),
  topClientes: document.getElementById('top-clientes'),
  financeiroResumoList: document.getElementById('financeiro-resumo-list'),
  importModal: document.getElementById('import-modal'),
  importModalTitle: document.getElementById('import-modal-title'),
  importModalSubtitle: document.getElementById('import-modal-subtitle'),
  importModalClose: document.getElementById('import-modal-close'),
  importModalCancel: document.getElementById('import-modal-cancel'),
  importModalTemplate: document.getElementById('import-modal-template'),
  importModalSubmit: document.getElementById('import-modal-submit'),
  importModalSubmitLabel: document.getElementById('import-modal-submit-label'),
  importModalResult: document.getElementById('import-modal-result'),
  importDropzone: document.getElementById('import-dropzone'),
  importFileHidden: document.getElementById('import-file-hidden'),
  importDzIdle: document.getElementById('import-dz-idle'),
  importDzSelected: document.getElementById('import-dz-selected'),
  importDzFilename: document.getElementById('import-dz-filename'),
  importDzFilesize: document.getElementById('import-dz-filesize'),
  importDzClear: document.getElementById('import-dz-clear')
};

const subtitles = {
  dashboard: 'Visao geral do negocio em tempo real',
  clientes: 'Cadastro e gestao de relacionamento',
  orcamentos: 'Propostas, custos e margens',
  vendas: 'Controle financeiro e pagamentos',
  produtos: 'Catalogo, precos e controle de inventario',
  pedidos: 'Pedidos da loja online, pagamentos e separacao',
  financeiro: 'Fluxo de caixa, DRE e lancamentos manuais',
  lembretes: 'Compromissos a pagar e alertas de vencimento',
  logs: 'Auditoria de acessos do sistema',
  config: 'Backend PHP, loja online e exportacoes',
  fornecedores: 'Cadastro de fornecedores e distribuidores'
};

const ITEM_TYPES = ['Produto', 'Servico'];
const PAYMENT_METHODS = ['Pix', 'Credito', 'Debito', 'Dinheiro'];
const PAYMENT_STATUSES = ['Pago', 'Pendente'];
const DEFAULT_THERMAL_BAUD_RATE = 9600;
const DEFAULT_THERMAL_MODE = 'text';
const thermalPrinter = {
  port: null,
  connected: false
};

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function showToast(message, type = 'info') {
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  dom.toast.dataset.type = type;
  setTimeout(() => dom.toast.classList.remove('show'), 3000);
}

function setLoading(active) {
  if (!dom.loading) return;
  dom.loading.classList.toggle('hidden', !active);
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercent(value) {
  const num = Number(value || 0);
  return `${num.toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('pt-BR');
}

function formatDateShort(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('pt-BR');
}

function formatDateISO(value) {
  const date = parseDateSafe(value);
  if (!date) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toIsoFromDateInput(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  const cleaned = String(value).replace(',', '.');
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatPhoneBR(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '';
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 1)} ${rest.slice(1, 5)}-${rest.slice(5, 9)}`;
}

function formatCpfCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 9);
    const p4 = digits.slice(9, 11);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  }
  const c1 = digits.slice(0, 2);
  const c2 = digits.slice(2, 5);
  const c3 = digits.slice(5, 8);
  const c4 = digits.slice(8, 12);
  const c5 = digits.slice(12, 14);
  let out = c1;
  if (c2) out += `.${c2}`;
  if (c3) out += `.${c3}`;
  if (c4) out += `/${c4}`;
  if (c5) out += `-${c5}`;
  return out;
}

function applyInputMasks(scope) {
  const telefoneInput = scope.querySelector('input[name="telefone"]');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (event) => {
      event.target.value = formatPhoneBR(event.target.value);
    });
  }

  const docInput = scope.querySelector('input[name="cpfCNPJ"]');
  if (docInput) {
    docInput.addEventListener('input', (event) => {
      event.target.value = formatCpfCnpj(event.target.value);
    });
  }
}

function calcOrcamentoValues(payload) {
  const custoMaterial = parseNumber(payload.custoMaterial);
  const custoOutros = parseNumber(payload.custoOutros);
  const totalCustos = custoMaterial + custoOutros;
  const valorCobrado = parseNumber(payload.valorCobrado);
  const lucro = valorCobrado - totalCustos;
  const margem = valorCobrado ? (lucro / valorCobrado) * 100 : 0;
  return {
    custoMaterial,
    custoOutros,
    totalCustos,
    lucro,
    margem,
    valorCobrado
  };
}

function makeUid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function roundCurrencyValue(value) {
  return Math.round(parseNumber(value) * 100) / 100;
}

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function parseJsonObject(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    return null;
  }
}

function formatDateForInput(value) {
  return formatDateISO(value);
}

function normalizeItem(item = {}, fallbackTitle = 'Item') {
  const quantidade = Math.max(parseNumber(item.quantidade) || 1, 0.01);
  const valorUnitario = roundCurrencyValue(item.valorUnitario !== undefined ? item.valorUnitario : item.valor);
  const custoUnitario = roundCurrencyValue(item.custoUnitario);
  return {
    id: item.id || makeUid('item'),
    tipo: ITEM_TYPES.includes(item.tipo) ? item.tipo : 'Produto',
    titulo: String(item.titulo || item.nome || fallbackTitle).trim(),
    descricao: String(item.descricao || '').trim(),
    quantidade,
    valorUnitario,
    custoUnitario
  };
}

function normalizePayment(payment = {}, fallbackDescription = 'Parcela') {
  const forma = PAYMENT_METHODS.includes(payment.forma) ? payment.forma : 'Pix';
  const status = PAYMENT_STATUSES.includes(payment.status) ? payment.status : 'Pendente';
  return {
    id: payment.id || makeUid('pay'),
    descricao: String(payment.descricao || fallbackDescription).trim(),
    valor: roundCurrencyValue(payment.valor),
    forma,
    status,
    vencimento: payment.vencimento || '',
    recebidoEm: payment.recebidoEm || ''
  };
}

function getOrcamentoItems(orcamento = {}) {
  const parsed = parseJsonArray(orcamento.itensJson).map((item, index) => normalizeItem(item, `Item ${index + 1}`));
  if (parsed.length) return parsed;
  const valorTotal = roundCurrencyValue(orcamento.valorTotal || (parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro)));
  const hasCustoMaterial = orcamento.custoMaterial !== undefined && orcamento.custoMaterial !== null && orcamento.custoMaterial !== '';
  const custoOutros = roundCurrencyValue(orcamento.custoOutros);
  const custoTotal = hasCustoMaterial
    ? roundCurrencyValue(orcamento.custoMaterial)
    : roundCurrencyValue(Math.max(parseNumber(orcamento.totalCustos) - custoOutros, 0));
  if (!orcamento.produtoServico && !orcamento.descricao && !valorTotal) return [];
  return [normalizeItem({
    id: makeUid('item'),
    tipo: 'Produto',
    titulo: orcamento.produtoServico || 'Item unico',
    descricao: orcamento.descricao || '',
    quantidade: 1,
    valorUnitario: valorTotal,
    custoUnitario: custoTotal
  })];
}

function getVendaItems(venda = {}) {
  const parsed = parseJsonArray(venda.itensJson).map((item, index) => normalizeItem(item, `Item ${index + 1}`));
  if (parsed.length) return parsed;
  const valorTotal = roundCurrencyValue(venda.valor);
  const custoTotal = roundCurrencyValue(venda.totalCustos);
  if (!venda.produtoServico && !venda.descricao && !valorTotal) return [];
  return [normalizeItem({
    id: makeUid('item'),
    tipo: 'Produto',
    titulo: venda.produtoServico || 'Item unico',
    descricao: venda.descricao || '',
    quantidade: 1,
    valorUnitario: valorTotal,
    custoUnitario: custoTotal
  })];
}

function getVendaPayments(venda = {}) {
  const parsed = parseJsonArray(venda.pagamentosJson).map((payment, index) => normalizePayment(payment, `Parcela ${index + 1}`));
  if (parsed.length) return parsed;
  const total = roundCurrencyValue(venda.valor);
  if (!total) return [];
  const hasValorRecebido = venda.valorRecebido !== undefined && venda.valorRecebido !== null && venda.valorRecebido !== '';
  const hasSaldoRestante = venda.saldoRestante !== undefined && venda.saldoRestante !== null && venda.saldoRestante !== '';
  const valorRecebido = roundCurrencyValue(hasValorRecebido ? venda.valorRecebido : total);
  const saldoRestante = roundCurrencyValue(hasSaldoRestante ? venda.saldoRestante : Math.max(total - valorRecebido, 0));
  const payments = [];
  if (valorRecebido > 0) {
    payments.push(normalizePayment({
      id: makeUid('pay'),
      descricao: 'Recebimento principal',
      valor: valorRecebido,
      forma: venda.pgto || 'Pix',
      status: 'Pago',
      recebidoEm: venda.dataHora || nowIso()
    }, 'Recebimento principal'));
  }
  if (saldoRestante > 0) {
    payments.push(normalizePayment({
      id: makeUid('pay'),
      descricao: 'Saldo restante',
      valor: saldoRestante,
      forma: venda.pgto || 'Pix',
      status: 'Pendente',
      vencimento: venda.vencimento || ''
    }, 'Saldo restante'));
  }
  if (!payments.length) {
    payments.push(normalizePayment({
      id: makeUid('pay'),
      descricao: 'Pagamento integral',
      valor: total,
      forma: venda.pgto || 'Pix',
      status: 'Pago',
      recebidoEm: venda.dataHora || nowIso()
    }, 'Pagamento integral'));
  }
  return payments;
}

function calcItemsTotals(items = [], extraCosts = 0) {
  const normalizedItems = items.map((item, index) => normalizeItem(item, `Item ${index + 1}`));
  const subtotal = normalizedItems.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
  const custoItens = normalizedItems.reduce((sum, item) => sum + (item.quantidade * item.custoUnitario), 0);
  const custoOutros = roundCurrencyValue(extraCosts);
  const totalCustos = roundCurrencyValue(custoItens + custoOutros);
  const valorTotal = roundCurrencyValue(subtotal);
  const lucro = roundCurrencyValue(valorTotal - totalCustos);
  const margem = valorTotal ? (lucro / valorTotal) * 100 : 0;
  return {
    items: normalizedItems,
    subtotal: valorTotal,
    custoItens: roundCurrencyValue(custoItens),
    custoOutros,
    totalCustos,
    lucro,
    margem
  };
}

function calcPaymentsSummary(payments = [], totalVenda = 0) {
  const normalizedPayments = payments.map((payment, index) => normalizePayment(payment, `Parcela ${index + 1}`))
    .filter((payment) => payment.valor > 0);
  const totalPlanejado = roundCurrencyValue(normalizedPayments.reduce((sum, payment) => sum + payment.valor, 0));
  const recebido = roundCurrencyValue(normalizedPayments
    .filter((payment) => payment.status === 'Pago')
    .reduce((sum, payment) => sum + payment.valor, 0));
  const saldo = roundCurrencyValue(Math.max(roundCurrencyValue(totalVenda) - recebido, 0));
  let status = 'Pendente';
  if (roundCurrencyValue(totalVenda) > 0 && saldo <= 0.009) {
    status = 'Pago';
  } else if (recebido > 0) {
    status = 'Parcial';
  }
  const proximoVencimento = normalizedPayments
    .filter((payment) => payment.status !== 'Pago' && payment.vencimento)
    .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())[0]?.vencimento || '';
  return {
    payments: normalizedPayments,
    totalPlanejado,
    recebido,
    saldo,
    status,
    proximoVencimento
  };
}

function summarizeItemLabel(items = [], fallback = '-') {
  if (!items.length) return fallback;
  const first = items[0].titulo || items[0].descricao || fallback;
  return items.length === 1 ? first : `${first} +${items.length - 1}`;
}

function getPaymentMethodSummary(payments = [], fallback = 'Pix') {
  const methods = Array.from(new Set(
    payments
      .filter((payment) => payment.status === 'Pago')
      .map((payment) => payment.forma)
      .filter(Boolean)
  ));
  if (!methods.length) {
    return payments[0]?.forma || fallback;
  }
  return methods.length === 1 ? methods[0] : 'Multiplo';
}

function getVendaReferenceBase(reference) {
  return String(reference || '').split('::')[0].trim();
}

function getVendaMetrics(venda = {}) {
  const items = getVendaItems(venda);
  const totals = calcItemsTotals(items);
  const hasValor = venda.valor !== undefined && venda.valor !== null && venda.valor !== '';
  const hasTotalCustos = venda.totalCustos !== undefined && venda.totalCustos !== null && venda.totalCustos !== '';
  const hasMargem = venda.margem !== undefined && venda.margem !== null && venda.margem !== '';
  const hasValorRecebido = venda.valorRecebido !== undefined && venda.valorRecebido !== null && venda.valorRecebido !== '';
  const hasSaldoRestante = venda.saldoRestante !== undefined && venda.saldoRestante !== null && venda.saldoRestante !== '';
  const valor = roundCurrencyValue(hasValor ? venda.valor : totals.subtotal);
  const payments = getVendaPayments(venda);
  const paymentSummary = calcPaymentsSummary(payments, valor);
  const totalCustos = roundCurrencyValue(hasTotalCustos ? venda.totalCustos : totals.totalCustos);
  const lucroCalculado = valor - totalCustos;
  return {
    items,
    payments,
    valor,
    totalCustos,
    lucro: roundCurrencyValue(venda.lucro !== undefined && venda.lucro !== null && venda.lucro !== '' ? venda.lucro : lucroCalculado),
    margem: Number(hasMargem ? venda.margem : (valor ? (lucroCalculado / valor) * 100 : 0)),
    recebido: roundCurrencyValue(hasValorRecebido ? venda.valorRecebido : paymentSummary.recebido),
    saldoRestante: roundCurrencyValue(hasSaldoRestante ? venda.saldoRestante : paymentSummary.saldo),
    statusRecebimento: venda.statusRecebimento || paymentSummary.status,
    vencimento: venda.vencimento || paymentSummary.proximoVencimento || '',
    pgtoResumo: venda.pgto || getPaymentMethodSummary(payments)
  };
}

function getOrcamentoMetrics(orcamento = {}) {
  const items = getOrcamentoItems(orcamento);
  const totals = calcItemsTotals(items, orcamento.custoOutros);
  const hasValorTotal = orcamento.valorTotal !== undefined && orcamento.valorTotal !== null && orcamento.valorTotal !== '';
  const hasCustoOutros = orcamento.custoOutros !== undefined && orcamento.custoOutros !== null && orcamento.custoOutros !== '';
  const hasTotalCustos = orcamento.totalCustos !== undefined && orcamento.totalCustos !== null && orcamento.totalCustos !== '';
  const hasLucro = orcamento.lucro !== undefined && orcamento.lucro !== null && orcamento.lucro !== '';
  const hasMargem = orcamento.margem !== undefined && orcamento.margem !== null && orcamento.margem !== '';
  return {
    items,
    valor: roundCurrencyValue(hasValorTotal ? orcamento.valorTotal : totals.subtotal),
    custoItens: totals.custoItens,
    custoOutros: roundCurrencyValue(hasCustoOutros ? orcamento.custoOutros : totals.custoOutros),
    totalCustos: roundCurrencyValue(hasTotalCustos ? orcamento.totalCustos : totals.totalCustos),
    lucro: roundCurrencyValue(hasLucro ? orcamento.lucro : totals.lucro),
    margem: Number(hasMargem ? orcamento.margem : totals.margem)
  };
}

function buildPaymentStatusBadge(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'pago') return 'success';
  if (normalized === 'parcial') return 'warn';
  return 'neutral';
}

function buildItemRowHtml(item = {}, includeCost = true) {
  const normalized = normalizeItem(item);
  const costField = includeCost ? `
    <label data-admin>Custo unit.
      <input type="number" step="0.01" min="0" class="item-cost" value="${normalized.custoUnitario}" />
    </label>
  ` : '';
  const listAttr = normalized.tipo === 'Produto' ? 'list="product-datalist"' : '';
  return `
    <div class="builder-row item-row" data-row-id="${escapeHtml(normalized.id)}">
      <input type="hidden" class="row-id" value="${escapeHtml(normalized.id)}" />
      <label>Tipo
        <select class="item-type">
          ${ITEM_TYPES.map((type) => `<option value="${type}" ${type === normalized.tipo ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
      </label>
      <label>Titulo
        <input type="text" class="item-title" value="${escapeHtml(normalized.titulo)}" placeholder="Ex: Alianca ouro 18k" ${listAttr} autocomplete="off" />
      </label>
      <label>Descricao
        <input type="text" class="item-description" value="${escapeHtml(normalized.descricao)}" placeholder="Detalhes do item" />
      </label>
      <label>Qtd.
        <input type="number" step="0.01" min="0.01" class="item-quantity" value="${normalized.quantidade}" />
      </label>
      <label>Valor unit.
        <input type="number" step="0.01" min="0" class="item-price" value="${normalized.valorUnitario}" />
      </label>
      ${costField}
      <button type="button" class="icon-btn builder-remove-btn" data-action="remove-row" title="Remover item">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;
}

function buildPaymentRowHtml(payment = {}) {
  const normalized = normalizePayment(payment);
  return `
    <div class="builder-row payment-row" data-row-id="${escapeHtml(normalized.id)}">
      <input type="hidden" class="row-id" value="${escapeHtml(normalized.id)}" />
      <label>Descricao
        <input type="text" class="payment-description" value="${escapeHtml(normalized.descricao)}" placeholder="Ex: Sinal, saldo, parcela 2" />
      </label>
      <label>Valor
        <input type="number" step="0.01" min="0" class="payment-value" value="${normalized.valor}" />
      </label>
      <label>Forma
        <select class="payment-method">
          ${PAYMENT_METHODS.map((method) => `<option value="${method}" ${method === normalized.forma ? 'selected' : ''}>${method}</option>`).join('')}
        </select>
      </label>
      <label>Status
        <select class="payment-status">
          ${PAYMENT_STATUSES.map((status) => `<option value="${status}" ${status === normalized.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </label>
      <label>Vencimento
        <input type="date" class="payment-due" value="${formatDateForInput(normalized.vencimento)}" />
      </label>
      <label>Recebido em
        <input type="date" class="payment-date" value="${formatDateForInput(normalized.recebidoEm)}" />
      </label>
      <button type="button" class="icon-btn builder-remove-btn" data-action="remove-row" title="Remover parcela">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;
}

function getBuilderList(builder) {
  return qs('.builder-list', builder);
}

function serializeItemRows(scope) {
  return qsa('.item-row', scope)
    .map((row, index) => normalizeItem({
      id: qs('.row-id', row)?.value || makeUid('item'),
      tipo: qs('.item-type', row)?.value || 'Produto',
      titulo: qs('.item-title', row)?.value || '',
      descricao: qs('.item-description', row)?.value || '',
      quantidade: qs('.item-quantity', row)?.value || 1,
      valorUnitario: qs('.item-price', row)?.value || 0,
      custoUnitario: qs('.item-cost', row)?.value || 0
    }, `Item ${index + 1}`))
    .filter((item) => item.titulo || item.descricao || item.valorUnitario || item.custoUnitario);
}

function serializePaymentRows(scope) {
  return qsa('.payment-row', scope)
    .map((row, index) => normalizePayment({
      id: qs('.row-id', row)?.value || makeUid('pay'),
      descricao: qs('.payment-description', row)?.value || `Parcela ${index + 1}`,
      valor: qs('.payment-value', row)?.value || 0,
      forma: qs('.payment-method', row)?.value || 'Pix',
      status: qs('.payment-status', row)?.value || 'Pendente',
      vencimento: toIsoFromDateInput(qs('.payment-due', row)?.value || ''),
      recebidoEm: toIsoFromDateInput(qs('.payment-date', row)?.value || '')
    }, `Parcela ${index + 1}`))
    .filter((payment) => payment.valor > 0);
}

function renderItemsSummary(builder) {
  const items = serializeItemRows(builder);
  const form = builder.closest('form') || builder.closest('.drawer-content') || builder.parentElement;
  const extraCostInput = qs('input[name="custoOutros"]', form);
  const extraCosts = extraCostInput ? extraCostInput.value : 0;
  const totals = calcItemsTotals(items, extraCosts);
  const summary = qs('.builder-summary', builder);
  if (!summary) return totals;
  const chips = [
    `<div class="summary-chip"><span>Itens</span><strong>${items.length}</strong></div>`,
    `<div class="summary-chip"><span>Total</span><strong>${formatCurrency(totals.subtotal)}</strong></div>`
  ];
  if (state.perfil === 'Administrador') {
    chips.push(`<div class="summary-chip"><span>Custos</span><strong>${formatCurrency(totals.totalCustos)}</strong></div>`);
    chips.push(`<div class="summary-chip"><span>Lucro</span><strong>${formatCurrency(totals.lucro)}</strong></div>`);
    chips.push(`<div class="summary-chip"><span>Margem</span><strong>${formatPercent(totals.margem)}</strong></div>`);
  }
  summary.innerHTML = chips.join('');
  return totals;
}

function renderPaymentsSummary(builder) {
  const form = builder.closest('form') || builder.closest('.drawer-content') || builder.parentElement;
  const itemBuilder = qs('.items-builder[data-builder-kind="venda"]', form);
  const itemTotals = itemBuilder ? calcItemsTotals(serializeItemRows(itemBuilder)) : { subtotal: 0 };
  const payments = serializePaymentRows(builder);
  const summaryData = calcPaymentsSummary(payments, itemTotals.subtotal);
  const summary = qs('.builder-summary', builder);
  if (!summary) return summaryData;
  summary.innerHTML = `
    <div class="summary-chip"><span>Total da venda</span><strong>${formatCurrency(itemTotals.subtotal)}</strong></div>
    <div class="summary-chip"><span>Planejado</span><strong>${formatCurrency(summaryData.totalPlanejado)}</strong></div>
    <div class="summary-chip"><span>Recebido</span><strong>${formatCurrency(summaryData.recebido)}</strong></div>
    <div class="summary-chip"><span>Saldo</span><strong>${formatCurrency(summaryData.saldo)}</strong></div>
    <div class="summary-chip"><span>Status</span><strong>${summaryData.status}</strong></div>
  `;
  return summaryData;
}

function updateProductDatalist() {
  const dl = document.getElementById('product-datalist');
  if (!dl) return;
  dl.innerHTML = (state.data.produtos || [])
    .filter((p) => p.status !== 'archived')
    .map((p) => `<option value="${escapeHtml(p.name)}" data-price="${p.price}" data-cost="${p.cost || 0}" data-sku="${escapeHtml(p.sku || '')}">`)
    .join('');
}

function onItemTitleChange(row) {
  const titleInput = qs('.item-title', row);
  const typeSelect  = qs('.item-type', row);
  if (!titleInput || !typeSelect || typeSelect.value !== 'Produto') return;
  const chosen = (state.data.produtos || []).find((p) => p.name === titleInput.value);
  if (!chosen) return;
  const priceInput = qs('.item-price', row);
  const costInput  = qs('.item-cost', row);
  if (priceInput && (!priceInput.value || Number(priceInput.value) === 0)) priceInput.value = chosen.price || 0;
  if (costInput  && (!costInput.value  || Number(costInput.value)  === 0)) costInput.value  = chosen.cost  || 0;
}

function setItemTitleList(row, isProduct) {
  const titleInput = qs('.item-title', row);
  if (!titleInput) return;
  if (isProduct) {
    titleInput.setAttribute('list', 'product-datalist');
    titleInput.placeholder = 'Buscar produto cadastrado ou digitar';
  } else {
    titleInput.removeAttribute('list');
    titleInput.placeholder = 'Ex: Servico personalizado';
  }
}

function initItemsBuilder(builder) {
  if (!builder || builder.dataset.ready === '1') return;
  const list = getBuilderList(builder);
  if (list && !list.children.length) {
    list.insertAdjacentHTML('beforeend', buildItemRowHtml());
  }
  builder.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'add-item') {
      list.insertAdjacentHTML('beforeend', buildItemRowHtml());
      applyRoleAccess();
      renderItemsSummary(builder);
      renderPaymentsSummary(qs('.payments-builder[data-builder-kind="venda"]', builder.closest('form') || builder.closest('.drawer-content') || document));
    }
    if (action === 'remove-row') {
      const row = event.target.closest('.item-row');
      if (!row) return;
      const rows = qsa('.item-row', builder);
      if (rows.length === 1) {
        qsa('input', row).forEach((input) => { input.value = input.type === 'number' ? '0' : ''; });
        const qtyInput = qs('.item-quantity', row);
        if (qtyInput) qtyInput.value = '1';
        const typeSelect = qs('.item-type', row);
        if (typeSelect) typeSelect.value = 'Produto';
      } else {
        row.remove();
      }
      renderItemsSummary(builder);
      renderPaymentsSummary(qs('.payments-builder[data-builder-kind="venda"]', builder.closest('form') || builder.closest('.drawer-content') || document));
    }
  });
  /* Handle type change → toggle datalist, and title selection → auto-fill price/cost */
  builder.addEventListener('change', (event) => {
    const typeSelect = event.target.closest('.item-type');
    if (typeSelect) {
      const row = typeSelect.closest('.item-row');
      if (row) setItemTitleList(row, typeSelect.value === 'Produto');
    }
    const titleInput = event.target.closest('.item-title');
    if (titleInput) {
      const row = titleInput.closest('.item-row');
      if (row) onItemTitleChange(row);
    }
  });
  builder.addEventListener('input', (event) => {
    renderItemsSummary(builder);
    renderPaymentsSummary(qs('.payments-builder[data-builder-kind="venda"]', builder.closest('form') || builder.closest('.drawer-content') || document));
  });
  builder.dataset.ready = '1';
  applyRoleAccess();
  renderItemsSummary(builder);
}

function initPaymentsBuilder(builder) {
  if (!builder || builder.dataset.ready === '1') return;
  const list = getBuilderList(builder);
  if (list && !list.children.length) {
    list.insertAdjacentHTML('beforeend', buildPaymentRowHtml({ status: 'Pago', descricao: 'Pagamento inicial' }));
  }
  builder.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'add-payment') {
      list.insertAdjacentHTML('beforeend', buildPaymentRowHtml());
      renderPaymentsSummary(builder);
      return;
    }
    if (action === 'fill-balance') {
      const form = builder.closest('form') || builder.closest('.drawer-content') || builder.parentElement;
      const itemBuilder = qs('.items-builder[data-builder-kind="venda"]', form);
      const itemTotals = itemBuilder ? calcItemsTotals(serializeItemRows(itemBuilder)) : { subtotal: 0 };
      const currentSummary = calcPaymentsSummary(serializePaymentRows(builder), itemTotals.subtotal);
      const remaining = roundCurrencyValue(itemTotals.subtotal - currentSummary.totalPlanejado);
      if (remaining <= 0) {
        showToast('As parcelas ja cobrem o valor total da venda.', 'error');
        return;
      }
      list.insertAdjacentHTML('beforeend', buildPaymentRowHtml({
        descricao: 'Saldo restante',
        valor: remaining,
        forma: 'Pix',
        status: 'Pendente'
      }));
      renderPaymentsSummary(builder);
      return;
    }
    if (action === 'remove-row') {
      const row = event.target.closest('.payment-row');
      if (!row) return;
      const rows = qsa('.payment-row', builder);
      if (rows.length === 1) {
        qsa('input', row).forEach((input) => { input.value = input.type === 'number' ? '0' : ''; });
        const method = qs('.payment-method', row);
        if (method) method.value = 'Pix';
        const status = qs('.payment-status', row);
        if (status) status.value = 'Pago';
      } else {
        row.remove();
      }
      renderPaymentsSummary(builder);
    }
  });
  builder.addEventListener('input', () => renderPaymentsSummary(builder));
  builder.dataset.ready = '1';
  renderPaymentsSummary(builder);
}

function initStructuredBuilders(scope = document) {
  qsa('.items-builder', scope).forEach(initItemsBuilder);
  qsa('.payments-builder', scope).forEach(initPaymentsBuilder);
}

function injectBuilderRows(builder, rowsHtml = []) {
  const list = getBuilderList(builder);
  if (!list) return;
  list.innerHTML = rowsHtml.join('') || '';
}

function buildItensTableHtml(items = [], totalLabel = 'Total') {
  if (!items.length) {
    return `
      <table class="doc-table">
        <tbody><tr><td colspan="5">Sem itens informados</td></tr></tbody>
      </table>
    `;
  }
  const rows = items.map((item) => {
    const subtotal = roundCurrencyValue(item.quantidade * item.valorUnitario);
    return `
      <tr>
        <td>${escapeHtml(item.tipo)}</td>
        <td>${escapeHtml(item.titulo || '-')}</td>
        <td>${escapeHtml(item.descricao || '-')}</td>
        <td>${item.quantidade}</td>
        <td>${formatCurrency(subtotal)}</td>
      </tr>
    `;
  }).join('');
  return `
    <table class="doc-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Item</th>
          <th>Descricao</th>
          <th>Qtd.</th>
          <th>${totalLabel}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildPagamentosTableHtml(payments = []) {
  if (!payments.length) return '<p>-</p>';
  return `
    <table class="doc-table">
      <thead>
        <tr>
          <th>Descricao</th>
          <th>Forma</th>
          <th>Status</th>
          <th>Data</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map((payment) => `
          <tr>
            <td>${escapeHtml(payment.descricao || '-')}</td>
            <td>${escapeHtml(payment.forma || '-')}</td>
            <td>${escapeHtml(payment.status || '-')}</td>
            <td>${formatDateShort(payment.status === 'Pago' ? payment.recebidoEm : payment.vencimento)}</td>
            <td>${formatCurrency(payment.valor)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function buildDescriptionSummary(items = []) {
  return items
    .map((item) => item.descricao || item.titulo || '')
    .filter(Boolean)
    .join(' | ')
    .slice(0, 500);
}

function ensurePaidDates(payments = []) {
  return payments.map((payment) => {
    if (payment.status === 'Pago') {
      return {
        ...payment,
        recebidoEm: payment.recebidoEm || nowIso(),
        vencimento: payment.vencimento || payment.recebidoEm || nowIso()
      };
    }
    return payment;
  });
}

function validateItems(items = []) {
  if (!items.length) {
    throw new Error('Adicione ao menos um item.');
  }
  const invalid = items.find((item) => !item.titulo || item.valorUnitario < 0 || item.quantidade <= 0);
  if (invalid) {
    throw new Error('Revise os itens: titulo, quantidade e valor unitario sao obrigatorios.');
  }
}

function validatePayments(payments = [], totalVenda = 0) {
  if (!payments.length) {
    throw new Error('Adicione ao menos um recebimento ou parcela.');
  }
  const invalid = payments.find((payment) => payment.valor <= 0 || !payment.descricao);
  if (invalid) {
    throw new Error('Cada parcela precisa de descricao e valor maior que zero.');
  }
  const pendingWithoutDue = payments.find((payment) => payment.status !== 'Pago' && !payment.vencimento);
  if (pendingWithoutDue) {
    throw new Error('Toda parcela pendente precisa ter vencimento.');
  }
  const totalPlanejado = roundCurrencyValue(payments.reduce((sum, payment) => sum + payment.valor, 0));
  const totalComparado = roundCurrencyValue(totalVenda);
  if (Math.abs(totalPlanejado - totalComparado) > 0.01) {
    throw new Error('A soma das parcelas precisa bater exatamente com o total da venda.');
  }
}

function buildItemsBuilderBlockHtml(kind, title, subtitle) {
  return `
    <div class="builder-card items-builder full" data-builder-kind="${kind}">
      <div class="builder-head">
        <div>
          <h5>${title}</h5>
          <p class="muted">${subtitle}</p>
        </div>
        <button type="button" class="btn btn-ghost builder-add-btn" data-action="add-item">
          <i class="fa-solid fa-plus"></i><span>Adicionar item</span>
        </button>
      </div>
      <div class="builder-list"></div>
      <div class="builder-summary"></div>
    </div>
  `;
}

function buildPaymentsBuilderBlockHtml() {
  return `
    <div class="builder-card payments-builder full" data-builder-kind="venda">
      <div class="builder-head">
        <div>
          <h5>Recebimentos e saldo</h5>
          <p class="muted">Registre sinal, parcelas pendentes e valores recebidos.</p>
        </div>
        <div class="builder-head-actions">
          <button type="button" class="btn btn-ghost builder-add-btn" data-action="add-payment">
            <i class="fa-solid fa-plus"></i><span>Adicionar parcela</span>
          </button>
          <button type="button" class="btn btn-ghost builder-balance-btn" data-action="fill-balance">
            <i class="fa-solid fa-scale-balanced"></i><span>Completar saldo</span>
          </button>
        </div>
      </div>
      <div class="builder-list"></div>
      <div class="builder-summary"></div>
    </div>
  `;
}

function buildOrcamentoFormHtml(orcamento = {}) {
  return `
    <h3>${orcamento.numero ? `Editar Orcamento #${orcamento.numero}` : 'Converter em venda'}</h3>
    <form id="orcamento-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${escapeHtml(orcamento.cliente || '')}" readonly /></label>
      <label>Validade<input type="date" name="validade" value="${escapeHtml(orcamento.validade || '')}" /></label>
      <label>Status
        <select name="status">
          <option value="Em negociacao">Em negociacao</option>
          <option value="Enviado">Enviado</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Perdido">Perdido</option>
          <option value="Confirmado">Confirmado</option>
        </select>
      </label>
      <label>Observacao publica<input type="text" name="obsPublic" value="${escapeHtml(orcamento.obsPublic || '')}" /></label>
      <label>Observacao interna<input type="text" name="obsPrivate" value="${escapeHtml(orcamento.obsPrivate || '')}" /></label>
      <label data-admin>Custos adicionais<input type="number" step="0.01" min="0" name="custoOutros" value="${roundCurrencyValue(orcamento.custoOutros)}" /></label>
      ${buildItemsBuilderBlockHtml('orcamento', 'Itens do orcamento', 'Edite os itens, quantidades e valores do documento.')}
      <button class="btn btn-primary" type="submit">Atualizar</button>
    </form>
  `;
}

function buildVendaComposerHtml(venda = {}, heading = 'Editar venda') {
  return `
    <h3>${heading}</h3>
    <form id="venda-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${escapeHtml(venda.cliente || '')}" readonly /></label>
      <label class="full">Observacoes<input type="text" name="obs" value="${escapeHtml(venda.obs || '')}" /></label>
      ${buildItemsBuilderBlockHtml('venda', 'Itens da venda', 'Monte os itens vendidos e seus valores unitarios.')}
      ${buildPaymentsBuilderBlockHtml()}
      <button class="btn btn-primary" type="submit">Salvar venda</button>
    </form>
  `;
}

function fillBuilderWithRows(scope, selector, rowsHtml) {
  const builder = qs(selector, scope);
  if (!builder) return null;
  injectBuilderRows(builder, rowsHtml);
  initStructuredBuilders(scope);
  return builder;
}

function resetItemsBuilder(builder) {
  if (!builder) return;
  injectBuilderRows(builder, [buildItemRowHtml()]);
  renderItemsSummary(builder);
}

function resetPaymentsBuilder(builder) {
  if (!builder) return;
  injectBuilderRows(builder, [buildPaymentRowHtml({ descricao: 'Pagamento inicial', status: 'Pago' })]);
  renderPaymentsSummary(builder);
}

function buildOrcamentoPayloadFromScope(scope, base = {}) {
  const itemsBuilder = qs('.items-builder[data-builder-kind="orcamento"]', scope) || qs('.items-builder', scope);
  const items = serializeItemRows(itemsBuilder);
  validateItems(items);
  const extraCosts = qs('input[name="custoOutros"]', scope)?.value || 0;
  const totals = calcItemsTotals(items, extraCosts);
  return {
    ...base,
    cliente: qs('[name="cliente"]', scope)?.value || base.cliente || '',
    produtoServico: summarizeItemLabel(items, base.produtoServico || 'Itens do orcamento'),
    descricao: buildDescriptionSummary(items),
    validade: qs('[name="validade"]', scope)?.value || '',
    obsPublic: qs('[name="obsPublic"]', scope)?.value || '',
    obsPrivate: qs('[name="obsPrivate"]', scope)?.value || '',
    custoMaterial: totals.custoItens,
    custoOutros: totals.custoOutros,
    totalCustos: totals.totalCustos,
    lucro: totals.lucro,
    margem: totals.margem,
    valorTotal: totals.subtotal,
    itensJson: JSON.stringify(items),
    status: qs('[name="status"]', scope)?.value || 'Em negociacao'
  };
}

function buildVendaPayloadFromScope(scope, base = {}) {
  const itemsBuilder = qs('.items-builder[data-builder-kind="venda"]', scope) || qs('.items-builder', scope);
  const paymentsBuilder = qs('.payments-builder[data-builder-kind="venda"]', scope) || qs('.payments-builder', scope);
  const items = serializeItemRows(itemsBuilder);
  validateItems(items);
  const itemTotals = calcItemsTotals(items);
  const payments = ensurePaidDates(serializePaymentRows(paymentsBuilder));
  validatePayments(payments, itemTotals.subtotal);
  const paymentSummary = calcPaymentsSummary(payments, itemTotals.subtotal);
  return {
    ...base,
    cliente: qs('[name="cliente"]', scope)?.value || base.cliente || '',
    produtoServico: summarizeItemLabel(items, base.produtoServico || 'Itens da venda'),
    descricao: buildDescriptionSummary(items),
    valor: itemTotals.subtotal,
    valorRecebido: paymentSummary.recebido,
    saldoRestante: paymentSummary.saldo,
    statusRecebimento: paymentSummary.status,
    vencimento: paymentSummary.proximoVencimento,
    totalCustos: itemTotals.totalCustos,
    lucro: itemTotals.lucro,
    margem: itemTotals.margem,
    pgto: getPaymentMethodSummary(payments),
    itensJson: JSON.stringify(items),
    pagamentosJson: JSON.stringify(payments),
    obs: qs('[name="obs"]', scope)?.value || ''
  };
}

function mountStructuredForms() {
  if (dom.orcamentoForm && !qs('.items-builder', dom.orcamentoForm)) {
    const submitButton = qs('button[type="submit"]', dom.orcamentoForm);
    if (submitButton) {
      submitButton.insertAdjacentHTML('beforebegin', `
        <div class="builder-card items-builder full" data-builder-kind="orcamento">
          <div class="builder-head">
            <div>
              <h5>Itens do orcamento</h5>
              <p class="muted">Adicione produtos, servicos ou combinacoes no mesmo documento.</p>
            </div>
            <button type="button" class="btn btn-ghost builder-add-btn" data-action="add-item">
              <i class="fa-solid fa-plus"></i><span>Adicionar item</span>
            </button>
          </div>
          <div class="builder-list" id="orcamento-items"></div>
          <div class="builder-summary" id="orcamento-summary"></div>
        </div>
      `);
    }
  }

  if (dom.vendaForm && !qs('.items-builder', dom.vendaForm)) {
    qsa('input[name="produtoServico"], input[name="descricao"], input[name="valor"], input[name="totalCustos"], select[name="pgto"]', dom.vendaForm)
      .forEach((field) => {
        const label = field.closest('label');
        if (label) label.remove();
      });
    const submitButton = qs('button[type="submit"]', dom.vendaForm);
    if (submitButton) {
      submitButton.insertAdjacentHTML('beforebegin', `
        <div class="builder-card items-builder full" data-builder-kind="venda">
          <div class="builder-head">
            <div>
              <h5>Itens da venda</h5>
              <p class="muted">Monte a venda com quantos itens forem necessarios.</p>
            </div>
            <button type="button" class="btn btn-ghost builder-add-btn" data-action="add-item">
              <i class="fa-solid fa-plus"></i><span>Adicionar item</span>
            </button>
          </div>
          <div class="builder-list" id="venda-items"></div>
          <div class="builder-summary" id="venda-items-summary"></div>
        </div>
        <div class="builder-card payments-builder full" data-builder-kind="venda">
          <div class="builder-head">
            <div>
              <h5>Recebimentos e saldo</h5>
              <p class="muted">Registre sinal, pagamentos recebidos e saldo pendente.</p>
            </div>
            <div class="builder-head-actions">
              <button type="button" class="btn btn-ghost builder-add-btn" data-action="add-payment">
                <i class="fa-solid fa-plus"></i><span>Adicionar parcela</span>
              </button>
              <button type="button" class="btn btn-ghost builder-balance-btn" data-action="fill-balance">
                <i class="fa-solid fa-scale-balanced"></i><span>Completar saldo</span>
              </button>
            </div>
          </div>
          <div class="builder-list" id="venda-payments"></div>
          <div class="builder-summary" id="venda-payments-summary"></div>
        </div>
      `);
    }
  }

  const orcamentoHeader = qs('#orcamento-table thead tr');
  if (orcamentoHeader) {
    orcamentoHeader.innerHTML = `
      <th>Numero</th>
      <th>Data</th>
      <th>Cliente</th>
      <th>Itens</th>
      <th>Valor</th>
      <th>Lucro</th>
      <th>Status</th>
      <th>Acoes</th>
    `;
  }

  const vendaHeader = qs('#venda-table thead tr');
  if (vendaHeader) {
    vendaHeader.innerHTML = `
      <th>Numero</th>
      <th>Data</th>
      <th>Cliente</th>
      <th>Itens</th>
      <th>Valor</th>
      <th>Recebido</th>
      <th>Saldo</th>
      <th>Status</th>
      <th>Acoes</th>
    `;
  }

  initStructuredBuilders(document);
}
function applyAuthenticatedUser(user) {
  state.user = user?.name || user?.email || null;
  state.perfil = user?.perfil || null;
  updateProfile();
  applyRoleAccess();
}

function setSidebarCollapsed(collapsed) {
  dom.appShell.classList.toggle('collapsed', collapsed);
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, collapsed ? '1' : '0');
  updateMenuIcon();
}

function updateMenuIcon() {
  const icon = dom.menuBtn ? dom.menuBtn.querySelector('i') : null;
  if (!icon) return;
  if (window.innerWidth <= 980) {
    icon.className = 'fa-solid fa-bars';
    return;
  }
  const collapsed = dom.appShell.classList.contains('collapsed');
  icon.className = collapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
}

function loadSidebarState() {
  const collapsed = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === '1';
  setSidebarCollapsed(collapsed);
}

function applyTheme(theme) {
  const mode = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem(STORAGE_KEYS.theme, mode);
  const icon = dom.themeToggle ? dom.themeToggle.querySelector('i') : null;
  if (icon) {
    icon.className = mode === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  updateLogos(mode);
  if (state.data && Array.isArray(state.data.vendas)) {
    renderDashboard();
  }
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
  applyTheme(saved);
}

function updateLogos(mode) {
  qsa('.logo-swap').forEach((img) => {
    const src = mode === 'light' ? img.dataset.logoLight : img.dataset.logoDark;
    if (src) img.src = src;
  });
}

// Actions that can be queued and executed later when offline
const OFFLINE_QUEUEABLE = new Set([
  'createVenda', 'createCliente', 'createOrcamento',
  'createFinanceiro', 'createLembrete', 'createProduct', 'createFornecedor',
]);

async function apiRequest(action, payload = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.csrfToken) headers['X-CSRF-Token'] = state.csrfToken;

  let response, data;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      credentials: 'same-origin',
      body: JSON.stringify({ action, payload })
    });
    data = await response.json().catch(() => null);
  } catch (networkErr) {
    // No network — queue create operations, fail everything else
    if (OFFLINE_QUEUEABLE.has(action)) {
      return offlineEnqueue(action, payload);
    }
    throw networkErr;
  }

  if (!response.ok || !data?.ok) {
    const message = data?.error || 'Erro ao comunicar com o backend PHP';
    if (response.status === 401) {
      state.user = null;
      state.perfil = null;
      state.csrfToken = '';
      dom.appShell.classList.add('hidden');
      dom.loginScreen.classList.remove('hidden');
    }
    throw new Error(message);
  }
  if (data.data?.csrfToken) state.csrfToken = data.data.csrfToken;
  return data.data;
}

async function loadAllData() {
  setLoading(true);
  try {
    const data = await apiRequest('listAll');
    state.data = {
      clientes: data?.clientes || [],
      orcamentos: data?.orcamentos || [],
      vendas: data?.vendas || [],
      logs: data?.logs || [],
      financeiro: data?.financeiro || [],
      lembretes: data?.lembretes || [],
      categorias: data?.categorias || [],
      produtos: data?.produtos || [],
      fornecedores: data?.fornecedores || [],
      inventoryMovements: data?.inventoryMovements || [],
      pedidos: data?.pedidos || []
    };
    // Persist fresh data for offline use
    offlineStore.cacheSave(state.data).catch(() => {});
    renderAll();
  } catch (error) {
    // Try to recover from offline cache
    const cached = await offlineStore.cacheLoad().catch(() => null);
    if (cached) {
      state.data = { ...cached };
      await offlineStore.applyPendingToState(state.data);
      renderAll();
      showToast('Modo offline — exibindo dados do último acesso.', 'error');
    } else {
      showToast(error.message || 'Falha ao carregar dados', 'error');
    }
  } finally {
    setLoading(false);
  }
}

function applyRoleAccess() {
  const isAdmin = state.perfil === 'Administrador';
  qsa('[data-admin]').forEach((el) => {
    const wrapper = el.closest('label') || el;
    if (!isAdmin) {
      wrapper.classList.add('hidden');
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
        el.disabled = true;
        el.removeAttribute('required');
      }
    } else {
      wrapper.classList.remove('hidden');
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
        el.disabled = false;
      }
    }
  });

  dom.navLinks.forEach((link) => {
    if (link.dataset.admin !== undefined) {
      link.classList.toggle('hidden', !isAdmin);
    }
  });

  enforceViewAccess();
}

function enforceViewAccess() {
  const activeView = document.querySelector('.view.active');
  if (!activeView) return;
  if (activeView.dataset.admin !== undefined && state.perfil !== 'Administrador') {
    switchView('clientes');
  }
}

function switchView(viewId) {
  const targetView = document.getElementById(viewId);
  if (!targetView) return;
  if (targetView.dataset.admin !== undefined && state.perfil !== 'Administrador') {
    showToast('Acesso restrito.', 'error');
    return;
  }
  dom.views.forEach((view) => {
    view.classList.toggle('active', view.id === viewId);
  });
  dom.navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });
  dom.viewTitle.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
  dom.viewSubtitle.textContent = subtitles[viewId] || '';
  if (dom.sidebar.classList.contains('open')) {
    dom.sidebar.classList.remove('open');
  }
}

function updateProfile() {
  dom.profileName.textContent = state.user || 'Usuario';
  dom.profileRole.textContent = state.perfil || '-';
  const initials = (state.user || 'GA').split(' ').map((part) => part[0]).slice(0, 2).join('');
  dom.profileAvatar.textContent = initials.toUpperCase();
  dom.sessionChip.textContent = `${state.perfil || 'Sessao'} | ${new Date().toLocaleTimeString('pt-BR')}`;
}

async function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const user = form.get('user')?.toString().trim();
  const senha = form.get('senha')?.toString().trim();

  if (!user || !senha) {
    showToast('Credenciais invalidas.', 'error');
    return;
  }

  try {
    const data = await apiRequest('login', { user, senha });
    applyAuthenticatedUser(data.user);
    // Cache session for offline auto-login (valid 8h)
    try { localStorage.setItem('gao_offline_session', JSON.stringify({ user: data.user, ts: Date.now() })); } catch (_) {}
    dom.loginScreen.classList.add('hidden');
    dom.appShell.classList.remove('hidden');
    showToast(`Bem-vindo, ${state.user}!`);
    await loadAllData();
  } catch (error) {
    showToast(error.message || 'Credenciais invalidas.', 'error');
  }
}

async function registerLogin() {
  return Promise.resolve();
}

function getSystemInfo() {
  const ua = navigator.userAgent || '';
  let browser = 'Desconhecido';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  if (ua.includes('Firefox')) browser = 'Firefox';
  if (ua.includes('Edg')) browser = 'Edge';
  const system = navigator.platform || 'Web';
  return { browser, system };
}

async function handleLogout() {
  try {
    await apiRequest('logout');
  } catch (error) {
    console.warn(error);
  }
  state.user = null;
  state.perfil = null;
  state.csrfToken = '';
  dom.appShell.classList.add('hidden');
  dom.loginScreen.classList.remove('hidden');
}
function renderAll() {
  renderClientes();
  renderOrcamentos();
  renderVendas();
  renderFinanceiro();
  renderLembretes(true);
  renderLogs();
  renderProducts();
  renderFornecedores();
  renderInventoryMovements();
  renderOrders();
  renderDashboard();
  renderClienteOptions();
  renderProductOptions();
  updateProductDatalist();
  updateSupplierDatalist();
}

function renderClientes() {
  const search = dom.clienteSearch.value?.toLowerCase() || '';
  const rows = state.data.clientes.filter((cliente) => {
    if (!search) return true;
    return (
      String(cliente.nome).toLowerCase().includes(search) ||
      String(cliente.telefone).toLowerCase().includes(search)
    );
  });

  dom.clienteTable.innerHTML = rows
    .map((cliente) => `
      <tr>
        <td data-label="Data">${formatDateShort(cliente.dataHora)}</td>
        <td data-label="Nome">${escapeHtml(cliente.nome || '-')}</td>
        <td data-label="Telefone">${escapeHtml(cliente.telefone || '-')}</td>
        <td data-label="Email">${escapeHtml(cliente.email || '-')}</td>
        <td data-label="Empresa">${escapeHtml(cliente.empresa || '-')}</td>
        <td data-label="CPF/CNPJ">${escapeHtml(cliente.cpfCNPJ || '-')}</td>
        <td data-label="Obs">${escapeHtml(cliente.obs || '-')}</td>
        <td data-label="Acoes">
          <button class="btn btn-ghost action-btn" data-action="edit-cliente" data-id="${cliente.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
        </td>
      </tr>
    `)
    .join('');
}

function fillClienteForm(cliente) {
  if (!dom.clienteForm) return;
  dom.clienteForm.querySelector('[name="id"]').value = cliente.id || '';
  dom.clienteForm.querySelector('[name="nome"]').value = cliente.nome || '';
  dom.clienteForm.querySelector('[name="telefone"]').value = cliente.telefone || '';
  dom.clienteForm.querySelector('[name="email"]').value = cliente.email || '';
  dom.clienteForm.querySelector('[name="empresa"]').value = cliente.empresa || '';
  dom.clienteForm.querySelector('[name="cpfCNPJ"]').value = cliente.cpfCNPJ || '';
  dom.clienteForm.querySelector('[name="obs"]').value = cliente.obs || '';
}

function handleClienteActions(event) {
  const btn = event.target.closest('button');
  if (!btn || btn.dataset.action !== 'edit-cliente') return;
  const cliente = (state.data.clientes || []).find((c) => Number(c.id) === Number(btn.dataset.id));
  if (cliente) fillClienteForm(cliente);
}

/* ── FORNECEDORES ─────────────────────────────────── */
function renderFornecedores() {
  if (!dom.fornecedorTable) return;
  const search = dom.fornecedorSearch?.value?.toLowerCase() || '';
  const rows = (state.data.fornecedores || []).filter((f) => {
    if (!search) return true;
    return (
      String(f.nome).toLowerCase().includes(search) ||
      String(f.contactPerson || '').toLowerCase().includes(search) ||
      String(f.document || '').toLowerCase().includes(search) ||
      String(f.email || '').toLowerCase().includes(search)
    );
  });

  dom.fornecedorTable.innerHTML = rows.length === 0
    ? `<tr><td colspan="7" class="muted" style="text-align:center;padding:24px">Nenhum fornecedor cadastrado.</td></tr>`
    : rows.map((f) => {
      const rawPhone = (f.phone || '').replace(/\D/g, '');
      const waHref = rawPhone ? `https://wa.me/${rawPhone}` : '';
      const callHref = f.phone ? `tel:${f.phone}` : '';
      return `
      <tr>
        <td data-label="Nome">
          ${f.logoUrl ? `<img src="${escapeHtml(f.logoUrl)}" alt="" style="width:30px;height:30px;border-radius:4px;object-fit:contain;vertical-align:middle;margin-right:6px;border:1px solid var(--border);">` : ''}
          <strong>${escapeHtml(f.nome || '-')}</strong>
        </td>
        <td data-label="Contato">${escapeHtml(f.contactPerson || '-')}</td>
        <td data-label="Telefone">${escapeHtml(f.phone || '-')}</td>
        <td data-label="E-mail">${escapeHtml(f.email || '-')}</td>
        <td data-label="CNPJ/CPF">${escapeHtml(f.document || '-')}</td>
        <td data-label="Status">
          <span class="chip ${f.isActive ? 'chip-green' : 'chip-neutral'}">${f.isActive ? 'Ativo' : 'Inativo'}</span>
        </td>
        <td data-label="Acoes">
          ${waHref ? `<a href="${escapeHtml(waHref)}" target="_blank" rel="noopener" class="btn btn-ghost action-btn" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
          ${callHref ? `<a href="${escapeHtml(callHref)}" class="btn btn-ghost action-btn" title="Ligar"><i class="fa-solid fa-phone"></i></a>` : ''}
          <button class="btn btn-ghost action-btn" data-action="edit-fornecedor" data-id="${f.id}" title="Editar">
            <i class="fa-solid fa-pen"></i>
          </button>
        </td>
      </tr>
    `;
    }).join('');
}

function fillFornecedorForm(f) {
  if (!dom.fornecedorForm) return;
  dom.fornecedorForm.querySelector('[name="id"]').value = f.id || '';
  dom.fornecedorForm.querySelector('[name="nome"]').value = f.nome || '';
  dom.fornecedorForm.querySelector('[name="document"]').value = f.document || '';
  dom.fornecedorForm.querySelector('[name="contactPerson"]').value = f.contactPerson || '';
  dom.fornecedorForm.querySelector('[name="phone"]').value = f.phone || '';
  dom.fornecedorForm.querySelector('[name="email"]').value = f.email || '';
  dom.fornecedorForm.querySelector('[name="notes"]').value = f.notes || '';
  dom.fornecedorForm.querySelector('[name="isActive"]').checked = f.isActive !== false;
  const logoUrlEl  = document.getElementById('fornecedor-logo-url');
  const logoPreview = document.getElementById('fornecedor-logo-preview');
  const logoImg    = document.getElementById('fornecedor-logo-preview-img');
  if (logoUrlEl) logoUrlEl.value = f.logoUrl || '';
  if (logoPreview && logoImg) {
    if (f.logoUrl) { logoImg.src = f.logoUrl; logoPreview.style.display = 'flex'; }
    else { logoPreview.style.display = 'none'; }
  }
}

function handleFornecedorActions(event) {
  const btn = event.target.closest('button');
  if (!btn || btn.dataset.action !== 'edit-fornecedor') return;
  const f = (state.data.fornecedores || []).find((x) => Number(x.id) === Number(btn.dataset.id));
  if (f) fillFornecedorForm(f);
}

function buildFornecedorPayload(form) {
  const fd = new FormData(form);
  return {
    id: fd.get('id') || '',
    nome: fd.get('nome') || '',
    document: fd.get('document') || '',
    contactPerson: fd.get('contactPerson') || '',
    phone: fd.get('phone') || '',
    email: fd.get('email') || '',
    notes: fd.get('notes') || '',
    isActive: fd.get('isActive') === 'on',
    logoUrl: fd.get('logoUrl') || ''
  };
}

async function handleFornecedorSubmit(event) {
  event.preventDefault();
  const payload = buildFornecedorPayload(event.target);
  if (!payload.nome) {
    showToast('Informe o nome do fornecedor.', 'error');
    return;
  }
  try {
    await apiRequest(payload.id ? 'updateFornecedor' : 'createFornecedor', payload);
    dom.fornecedorForm.reset();
    dom.fornecedorForm.querySelector('[name="id"]').value = '';
    const lp = document.getElementById('fornecedor-logo-preview');
    if (lp) lp.style.display = 'none';
    await loadAllData();
    showToast('Fornecedor salvo.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar fornecedor', 'error');
  }
}

function updateSupplierDatalist() {
  if (!dom.supplierDatalist) return;
  dom.supplierDatalist.innerHTML = (state.data.fornecedores || [])
    .filter((f) => f.isActive !== false)
    .map((f) => `<option value="${escapeHtml(f.nome)}"></option>`)
    .join('');
}

function renderClienteOptions() {
  const options = state.data.clientes.map((cliente) => `
    <option value="${cliente.nome}">${cliente.nome}</option>
  `);
  const base = '<option value="">Selecione</option>';
  dom.orcamentoCliente.innerHTML = base + options.join('');
  dom.vendaCliente.innerHTML = base + options.join('');
}

function renderOrcamentos() {
  const search = dom.orcamentoSearch.value?.toLowerCase() || '';
  const rows = state.data.orcamentos.filter((orcamento) => {
    const metrics = getOrcamentoMetrics(orcamento);
    const itemLabel = summarizeItemLabel(metrics.items, orcamento.produtoServico || '-');
    if (!search) return true;
    return (
      String(orcamento.cliente).toLowerCase().includes(search) ||
      String(orcamento.status).toLowerCase().includes(search) ||
      String(itemLabel).toLowerCase().includes(search)
    );
  });

  dom.orcamentoTable.innerHTML = rows
    .map((orcamento) => {
      const metrics = getOrcamentoMetrics(orcamento);
      const itemLabel = summarizeItemLabel(metrics.items, orcamento.produtoServico || '-');
      const statusMap = {
        Aprovado: 'success',
        Confirmado: 'success',
        Perdido: 'danger',
        Enviado: 'info',
        'Em negociacao': 'warn'
      };
      const statusClass = statusMap[orcamento.status] || 'neutral';
      const editBtn = state.perfil === 'Administrador'
        ? `<button class="btn btn-ghost action-btn" data-action="edit" data-id="${orcamento.rowIndex}" title="Editar"><i class="fa-solid fa-pen"></i></button>`
        : '';
      return `
        <tr>
          <td data-label="Numero">${orcamento.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(orcamento.dataHora)}</td>
          <td data-label="Cliente">${orcamento.cliente || '-'}</td>
          <td data-label="Itens">${itemLabel}</td>
          <td data-label="Valor">${formatCurrency(metrics.valor)}</td>
          <td data-label="Lucro">${formatCurrency(metrics.lucro)}</td>
          <td data-label="Status"><span class="badge ${statusClass}">${orcamento.status || 'Em negociacao'}</span></td>
          <td data-label="Acoes">
            <div class="actions">
              <button class="btn btn-ghost action-btn" data-action="view" data-id="${orcamento.rowIndex}" title="Visualizar"><i class="fa-solid fa-eye"></i></button>
              ${editBtn}
              <button class="btn btn-ghost action-btn" data-action="pdf" data-id="${orcamento.rowIndex}" title="Baixar PDF"><i class="fa-solid fa-file-pdf"></i></button>
              <button class="btn btn-ghost action-btn" data-action="whatsapp" data-id="${orcamento.rowIndex}" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
              <button class="btn btn-ghost action-btn" data-action="confirm" data-id="${orcamento.rowIndex}" title="Confirmar"><i class="fa-solid fa-thumbs-up"></i></button>
              <button class="btn btn-ghost action-btn" data-action="reject" data-id="${orcamento.rowIndex}" title="Recusar"><i class="fa-solid fa-thumbs-down"></i></button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderVendas() {
  const search = dom.vendaSearch.value?.toLowerCase() || '';
  const rows = state.data.vendas.filter((venda) => {
    const metrics = getVendaMetrics(venda);
    const itemLabel = summarizeItemLabel(metrics.items, venda.produtoServico || '-');
    if (!search) return true;
    return (
      String(venda.cliente).toLowerCase().includes(search) ||
      String(metrics.statusRecebimento).toLowerCase().includes(search) ||
      String(metrics.pgtoResumo).toLowerCase().includes(search) ||
      String(itemLabel).toLowerCase().includes(search)
    );
  });

  dom.vendaTable.innerHTML = rows
    .map((venda) => {
      const metrics = getVendaMetrics(venda);
      const itemLabel = summarizeItemLabel(metrics.items, venda.produtoServico || '-');
      const statusClass = buildPaymentStatusBadge(metrics.statusRecebimento);
      return `
        <tr>
          <td data-label="Numero">${venda.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(venda.dataHora)}</td>
          <td data-label="Cliente">${venda.cliente || '-'}</td>
          <td data-label="Itens">${itemLabel}</td>
          <td data-label="Valor">${formatCurrency(metrics.valor)}</td>
          <td data-label="Recebido">${formatCurrency(metrics.recebido)}</td>
          <td data-label="Saldo">${formatCurrency(metrics.saldoRestante)}</td>
          <td data-label="Status"><span class="badge ${statusClass}">${metrics.statusRecebimento}</span></td>
          <td data-label="Acoes">
            <div class="actions">
              <button class="btn btn-ghost action-btn" data-action="nota" data-id="${venda.rowIndex}" title="Ver nota"><i class="fa-solid fa-receipt"></i></button>
              <button class="btn btn-ghost action-btn" data-action="edit-venda" data-id="${venda.rowIndex}" title="Editar pagamento"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-ghost action-btn" data-action="print" data-id="${venda.rowIndex}" title="Imprimir"><i class="fa-solid fa-print"></i></button>
              <button class="btn btn-ghost action-btn" data-action="whatsapp" data-id="${venda.rowIndex}" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderFinanceiro() {
  const search = dom.financeiroSearch?.value?.toLowerCase() || '';
  const rows = [...(state.data.financeiro || [])]
    .sort((a, b) => {
      const da = new Date(a.dataHora || 0).getTime();
      const db = new Date(b.dataHora || 0).getTime();
      return db - da;
    })
    .filter((item) => {
      if (!search) return true;
      return (
        String(item.numero || '').toLowerCase().includes(search) ||
        String(item.tipo || '').toLowerCase().includes(search) ||
        String(item.categoria || '').toLowerCase().includes(search) ||
        String(item.descricao || '').toLowerCase().includes(search) ||
        String(item.status || '').toLowerCase().includes(search) ||
        String(item.vencimento || '').toLowerCase().includes(search) ||
        String(item.origem || '').toLowerCase().includes(search)
      );
    });

  dom.financeiroTable.innerHTML = rows
    .map((item) => {
      const tipoClass = String(item.tipo || '').toLowerCase() === 'saida' ? 'danger' : 'success';
      const status = getFinanceStatus(item);
      const isPendente = String(status).toLowerCase() === 'a pagar';
      const vencDate = parseDateSafe(item.vencimento);
      const isAtrasado = isPendente && vencDate && startOfDay(vencDate).getTime() < startOfDay(new Date()).getTime();
      const statusClass = isPendente ? (isAtrasado ? 'danger' : 'warn') : 'success';
      const canEdit = state.perfil === 'Administrador' && String(item.origem || '').toLowerCase() !== 'venda';
      return `
        <tr>
          <td data-label="Numero">${item.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(item.dataHora)}</td>
          <td data-label="Tipo"><span class="badge ${tipoClass}">${item.tipo || '-'}</span></td>
          <td data-label="Categoria">${item.categoria || '-'}</td>
          <td data-label="Descricao">${item.descricao || '-'}</td>
          <td data-label="Valor">${formatCurrency(item.valor || 0)}</td>
          <td data-label="Status"><span class="badge ${statusClass}">${status}</span></td>
          <td data-label="Vencimento">${formatDateShort(item.vencimento)}</td>
          <td data-label="Origem">${item.origem || '-'}</td>
          <td data-label="Acoes">
            <div class="actions">
              ${canEdit ? `<button class="btn btn-ghost action-btn" data-action="edit-financeiro" data-id="${item.rowIndex}" title="Editar"><i class="fa-solid fa-pen"></i></button>` : '<span class="muted">-</span>'}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function productStatusLabel(status) {
  const labels = { draft: 'Rascunho', active: 'Ativo', archived: 'Arquivado' };
  return labels[status] || status || '-';
}

function productStatusBadge(status) {
  if (status === 'active') return 'success';
  if (status === 'archived') return 'neutral';
  return 'warn';
}

function renderProductOptions() {
  const products = state.data.produtos || [];
  if (dom.productCategories) {
    dom.productCategories.innerHTML = (state.data.categorias || [])
      .map((cat) => `<option value="${escapeHtml(cat.name)}"></option>`)
      .join('');
  }
  if (dom.inventoryProduct) {
    const options = products.map((product) => `
      <option value="${product.id}">${escapeHtml(product.sku)} - ${escapeHtml(product.name)} (${product.availableQty} disp.)</option>
    `);
    dom.inventoryProduct.innerHTML = '<option value="">Selecione</option>' + options.join('');
  }
}

function renderProducts() {
  if (!dom.productTable) return;
  const search = dom.productSearch?.value?.toLowerCase() || '';
  const rows = (state.data.produtos || []).filter((product) => {
    if (!search) return true;
    return (
      String(product.sku || '').toLowerCase().includes(search) ||
      String(product.name || '').toLowerCase().includes(search) ||
      String(product.categoryName || '').toLowerCase().includes(search) ||
      String(product.status || '').toLowerCase().includes(search)
    );
  });

  dom.productTable.innerHTML = rows.map((product) => {
    const stockClass = product.trackStock && product.availableQty <= product.lowStockThreshold ? 'danger' : 'success';
    return `
      <tr>
        <td data-label="SKU">${escapeHtml(product.sku || '-')}</td>
        <td data-label="Produto">${escapeHtml(product.name || '-')}</td>
        <td data-label="Categoria">${escapeHtml(product.categoryName || '-')}</td>
        <td data-label="Preco">${formatCurrency(product.price || 0)}</td>
        <td data-label="Estoque">
          <span class="badge ${stockClass}">${product.trackStock ? `${product.availableQty} disp. / ${product.stockQty} total` : 'Sem controle'}</span>
        </td>
        <td data-label="Status"><span class="badge ${productStatusBadge(product.status)}">${productStatusLabel(product.status)}</span></td>
        <td data-label="Acoes">
          <div class="actions">
            <button class="btn btn-ghost action-btn" data-action="edit-product" data-id="${product.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-ghost action-btn danger" data-action="delete-product" data-id="${product.id}" data-name="${escapeHtml(product.name || '')}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderInventoryMovements() {
  if (!dom.inventoryTable) return;
  const rows = (state.data.inventoryMovements || []).slice(0, 80);
  dom.inventoryTable.innerHTML = rows.map((item) => `
    <tr>
      <td data-label="Data">${formatDateShort(item.createdAt)}</td>
      <td data-label="Produto">${escapeHtml(item.sku || '')} ${escapeHtml(item.productName || '-')}</td>
      <td data-label="Tipo">${escapeHtml(item.movementType || '-')}</td>
      <td data-label="Qtd."><span class="badge ${item.quantity < 0 ? 'danger' : 'success'}">${item.quantity}</span></td>
      <td data-label="Saldo">${item.afterQty ?? '-'}</td>
      <td data-label="Motivo">${escapeHtml(item.reason || '-')}</td>
    </tr>
  `).join('');
}

function orderPaymentBadge(status) {
  if (status === 'paid') return 'success';
  if (status === 'failed' || status === 'refunded') return 'danger';
  return 'warn';
}

function renderOrders() {
  if (!dom.orderTable) return;
  const search = dom.orderSearch?.value?.toLowerCase() || '';
  const rows = (state.data.pedidos || []).filter((order) => {
    if (!search) return true;
    return (
      String(order.numero || '').toLowerCase().includes(search) ||
      String(order.cliente || '').toLowerCase().includes(search) ||
      String(order.email || '').toLowerCase().includes(search) ||
      String(order.status || '').toLowerCase().includes(search) ||
      String(order.paymentStatus || '').toLowerCase().includes(search)
    );
  });

  dom.orderTable.innerHTML = rows.map((order) => `
    <tr>
      <td data-label="Pedido">${escapeHtml(order.numero || '-')}</td>
      <td data-label="Data">${formatDateShort(order.dataHora)}</td>
      <td data-label="Cliente">${escapeHtml(order.cliente || '-')}<br><span class="muted">${escapeHtml(order.email || '')}</span></td>
      <td data-label="Total">${formatCurrency(order.total || 0)}</td>
      <td data-label="Pagamento"><span class="badge ${orderPaymentBadge(order.paymentStatus)}">${escapeHtml(order.paymentStatus || '-')}</span></td>
      <td data-label="Entrega"><span class="badge ${order.fulfillmentStatus === 'fulfilled' ? 'success' : 'warn'}">${escapeHtml(order.fulfillmentStatus || '-')}</span></td>
      <td data-label="Estoque">${escapeHtml(order.inventoryStatus || '-')}</td>
      <td data-label="Acoes">
        <div class="actions">
          <button class="btn btn-ghost action-btn" data-action="mark-processing" data-id="${order.id}" title="Processando"><i class="fa-solid fa-box-open"></i></button>
          <button class="btn btn-ghost action-btn" data-action="mark-fulfilled" data-id="${order.id}" title="Entregue"><i class="fa-solid fa-check"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getLembretesData() {
  const financeirosAPagar = (state.data.financeiro || [])
    .filter((item) => String(getFinanceStatus(item)).toLowerCase() === 'a pagar')
    .map((item) => ({
      source: 'financeiro',
      rowIndex: item.rowIndex,
      vencimento: item.vencimento || '',
      titulo: item.categoria || `Lancamento ${item.numero || ''}`.trim(),
      descricao: `${item.descricao || ''}${item.valor !== undefined ? ` • ${formatCurrency(item.valor)}` : ''}`.trim(),
      status: getFinanceStatus(item),
      origem: 'Financeiro',
      isPending: true
    }));

  const manuais = (state.data.lembretes || []).map((item) => ({
    source: 'manual',
    rowIndex: item.rowIndex,
    vencimento: item.vencimento || '',
    titulo: item.titulo || '-',
    descricao: item.descricao || '-',
    status: item.status || 'Pendente',
    origem: item.origem || 'Manual',
    isPending: String(item.status || 'Pendente').toLowerCase() !== 'concluido'
  }));

  return financeirosAPagar
    .concat(manuais)
    .sort((a, b) => {
      const da = parseDateSafe(a.vencimento);
      const db = parseDateSafe(b.vencimento);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    });
}

function renderLembretes(allowNotify = false) {
  const search = dom.lembreteSearch?.value?.toLowerCase() || '';
  const allRows = getLembretesData();
  const rows = allRows.filter((item) => {
    if (!search) return true;
    return (
      String(item.titulo || '').toLowerCase().includes(search) ||
      String(item.descricao || '').toLowerCase().includes(search) ||
      String(item.origem || '').toLowerCase().includes(search) ||
      String(item.status || '').toLowerCase().includes(search) ||
      String(item.vencimento || '').toLowerCase().includes(search)
    );
  });

  dom.lembreteTable.innerHTML = rows
    .map((item) => {
      const venc = parseDateSafe(item.vencimento);
      const overdue = item.isPending && venc && startOfDay(venc).getTime() < startOfDay(new Date()).getTime();
      const statusClass = overdue ? 'danger' : (item.isPending ? 'warn' : 'success');
      const actions = item.source === 'financeiro'
        ? `<button class="btn btn-ghost action-btn" data-action="mark-paid" data-id="${item.rowIndex}" title="Marcar como pago"><i class="fa-solid fa-circle-check"></i></button>`
        : `
            <button class="btn btn-ghost action-btn" data-action="edit-lembrete" data-id="${item.rowIndex}" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-ghost action-btn" data-action="toggle-lembrete" data-id="${item.rowIndex}" title="Alternar status"><i class="fa-solid fa-check-double"></i></button>
          `;
      return `
        <tr>
          <td data-label="Vencimento">${formatDateShort(item.vencimento)}</td>
          <td data-label="Titulo">${item.titulo || '-'}</td>
          <td data-label="Descricao">${item.descricao || '-'}</td>
          <td data-label="Status"><span class="badge ${statusClass}">${item.status || '-'}</span></td>
          <td data-label="Origem">${item.origem || '-'}</td>
          <td data-label="Acoes"><div class="actions">${actions}</div></td>
        </tr>
      `;
    })
    .join('');

  const pendingCount = allRows.filter((item) => item.isPending).length;
  if (dom.lembreteCount) {
    dom.lembreteCount.textContent = pendingCount ? `(${pendingCount})` : '';
  }

  if (allowNotify) {
    notifyAdminReminders(allRows);
  }
}

function notifyAdminReminders(rows) {
  if (state.perfil !== 'Administrador') return;
  const pending = rows.filter((item) => item.isPending);
  if (!pending.length) {
    state.reminderNoticeKey = '0-0';
    return;
  }
  const today = startOfDay(new Date()).getTime();
  const soonLimit = today + (7 * 24 * 60 * 60 * 1000);
  const overdueCount = pending.filter((item) => {
    const venc = parseDateSafe(item.vencimento);
    return venc && startOfDay(venc).getTime() < today;
  }).length;
  const dueSoonCount = pending.filter((item) => {
    const venc = parseDateSafe(item.vencimento);
    if (!venc) return false;
    const time = startOfDay(venc).getTime();
    return time >= today && time <= soonLimit;
  }).length;
  const reminderKey = `${pending.length}-${overdueCount}-${dueSoonCount}`;
  if (state.reminderNoticeKey === reminderKey) return;
  state.reminderNoticeKey = reminderKey;
  if (overdueCount > 0) {
    showToast(`Voce possui ${overdueCount} compromisso(s) vencido(s).`, 'error');
    return;
  }
  if (dueSoonCount > 0) {
    showToast(`Voce possui ${dueSoonCount} compromisso(s) a vencer nos proximos 7 dias.`);
  }
}

function renderLogs() {
  dom.logTable.innerHTML = state.data.logs
    .map((log) => `
      <tr>
        <td>${log.user || '-'}</td>
        <td>${log.perfil || '-'}</td>
        <td>${formatDate(log.dataHora)}</td>
        <td>${log.sistema || '-'}</td>
        <td>${log.navegador || '-'}</td>
        <td>${log.ip || '-'}</td>
      </tr>
    `)
    .join('');
}

function renderDashboard() {
  const period = state.dashboardPeriod || 'today';
  if (dom.dashboardPeriod) {
    qsa('.period-btn', dom.dashboardPeriod).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.period === period);
    });
  }
  const range = getPeriodRange(period);
  const previousRange = getPreviousRange(range);

  const vendasAtual = filterByRange(state.data.vendas, range);
  const vendasAnterior = filterByRange(state.data.vendas, previousRange);
  const orcamentosAtual = filterByRange(state.data.orcamentos, range);
  const orcamentosAnterior = filterByRange(state.data.orcamentos, previousRange);
  const financeiroAtual = filterByRange(state.data.financeiro, range);
  const financeiroAnterior = filterByRange(state.data.financeiro, previousRange);
  const financeiroTotal = state.data.financeiro || [];
  const financeiroAtualPago = financeiroAtual.filter(isFinancePaid);
  const financeiroAnteriorPago = financeiroAnterior.filter(isFinancePaid);
  const financeiroTotalPago = financeiroTotal.filter(isFinancePaid);

  const entradasAtual = sumFinance(financeiroAtualPago, 'Entrada');
  const entradasAnterior = sumFinance(financeiroAnteriorPago, 'Entrada');
  const saidasAtual = sumFinance(financeiroAtualPago, 'Saida');
  const saidasAnterior = sumFinance(financeiroAnteriorPago, 'Saida');
  const saldoAtual = entradasAtual - saidasAtual;
  const saldoAnterior = entradasAnterior - saidasAnterior;
  const entradasTotal = sumFinance(financeiroTotalPago, 'Entrada');
  const saidasTotal = sumFinance(financeiroTotalPago, 'Saida');
  const saldoGeral = entradasTotal - saidasTotal;

  const outrasEntradasAtual = sumFinance(financeiroAtualPago, 'Entrada', (item) => String(item.origem || '').toLowerCase() !== 'venda');
  const outrasEntradasAnterior = sumFinance(financeiroAnteriorPago, 'Entrada', (item) => String(item.origem || '').toLowerCase() !== 'venda');
  const despesasAtual = saidasAtual;
  const despesasAnterior = saidasAnterior;

  const recebimentosVendaAtual = financeiroAtualPago.filter((item) => String(item.origem || '').toLowerCase() === 'venda');
  const recebimentosVendaAnterior = financeiroAnteriorPago.filter((item) => String(item.origem || '').toLowerCase() === 'venda');
  const recebidoPorVendaAtual = recebimentosVendaAtual.reduce((acc, item) => {
    const key = getVendaReferenceBase(item.referencia);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + parseNumber(item.valor);
    return acc;
  }, {});
  const recebidoPorVendaAnterior = recebimentosVendaAnterior.reduce((acc, item) => {
    const key = getVendaReferenceBase(item.referencia);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + parseNumber(item.valor);
    return acc;
  }, {});
  const vendasAtualContabilizadas = vendasAtual.filter((item) => (recebidoPorVendaAtual[String(item.numero || '').trim()] || 0) > 0);
  const vendasAnteriorContabilizadas = vendasAnterior.filter((item) => (recebidoPorVendaAnterior[String(item.numero || '').trim()] || 0) > 0);

  const receitaOperacionalAtual = roundCurrencyValue(recebimentosVendaAtual.reduce((sum, item) => sum + parseNumber(item.valor), 0));
  const receitaOperacionalAnterior = roundCurrencyValue(recebimentosVendaAnterior.reduce((sum, item) => sum + parseNumber(item.valor), 0));
  const custosAtual = roundCurrencyValue(vendasAtualContabilizadas.reduce((sum, item) => {
    const numero = String(item.numero || '').trim();
    const valorVenda = parseNumber(item.valor);
    const recebido = recebidoPorVendaAtual[numero] || 0;
    const fator = valorVenda > 0 ? Math.min(recebido / valorVenda, 1) : 0;
    return sum + (parseNumber(item.totalCustos) * fator);
  }, 0));
  const custosAnterior = roundCurrencyValue(vendasAnteriorContabilizadas.reduce((sum, item) => {
    const numero = String(item.numero || '').trim();
    const valorVenda = parseNumber(item.valor);
    const recebido = recebidoPorVendaAnterior[numero] || 0;
    const fator = valorVenda > 0 ? Math.min(recebido / valorVenda, 1) : 0;
    return sum + (parseNumber(item.totalCustos) * fator);
  }, 0));
  const lucroAtual = roundCurrencyValue(receitaOperacionalAtual - custosAtual);

  const resultadoOperacionalAtual = receitaOperacionalAtual - custosAtual - despesasAtual;
  const resultadoOperacionalAnterior = receitaOperacionalAnterior - custosAnterior - despesasAnterior;
  const resultadoLiquidoAtual = resultadoOperacionalAtual + outrasEntradasAtual;
  const resultadoLiquidoAnterior = resultadoOperacionalAnterior + outrasEntradasAnterior;

  const totalOrcamentosAtual = orcamentosAtual.length;
  const totalOrcamentosAnterior = orcamentosAnterior.length;
  const totalVendasAtual = vendasAtualContabilizadas.length;
  const totalVendasAnterior = vendasAnteriorContabilizadas.length;
  const conversaoAtual = totalOrcamentosAtual ? (totalVendasAtual / totalOrcamentosAtual) * 100 : 0;
  const conversaoAnterior = totalOrcamentosAnterior ? (totalVendasAnterior / totalOrcamentosAnterior) * 100 : 0;
  const ticketAtual = totalVendasAtual ? receitaOperacionalAtual / totalVendasAtual : 0;
  const margemAtual = receitaOperacionalAtual ? (lucroAtual / receitaOperacionalAtual) * 100 : 0;
  const clientesAtivos = new Set(
    vendasAtualContabilizadas.map((item) => item.cliente).concat(orcamentosAtual.map((item) => item.cliente)).filter(Boolean)
  ).size;

  dom.dashSaldoGeral.textContent = formatCurrency(saldoGeral);
  dom.dashSaldoGeralInfo.textContent = `Entradas pagas ${formatCurrency(entradasTotal)} • Saidas pagas ${formatCurrency(saidasTotal)}`;
  dom.dashSaldoGeralInfo.classList.remove('metric-up', 'metric-down', 'metric-flat');
  if (saldoGeral > 0) dom.dashSaldoGeralInfo.classList.add('metric-up');
  else if (saldoGeral < 0) dom.dashSaldoGeralInfo.classList.add('metric-down');
  else dom.dashSaldoGeralInfo.classList.add('metric-flat');
  dom.dashEntradas.textContent = formatCurrency(entradasAtual);
  dom.dashSaidas.textContent = formatCurrency(saidasAtual);
  dom.dashSaldo.textContent = formatCurrency(saldoAtual);
  dom.dashDre.textContent = formatCurrency(resultadoLiquidoAtual);
  dom.dashOrcamentos.textContent = totalOrcamentosAtual;
  dom.dashVendas.textContent = totalVendasAtual;
  dom.dashAportes.textContent = formatCurrency(outrasEntradasAtual);
  dom.dashMargem.textContent = formatPercent(margemAtual);
  dom.dashTicket.textContent = `Ticket medio ${formatCurrency(ticketAtual)}`;
  dom.dashConversao.textContent = `Conversao ${formatPercent(conversaoAtual)} (anterior ${formatPercent(conversaoAnterior)})`;
  dom.dashClientes.textContent = `${clientesAtivos} clientes no periodo`;

  setComparisonText(dom.dashEntradasCompare, entradasAtual, entradasAnterior);
  setComparisonText(dom.dashSaidasCompare, saidasAtual, saidasAnterior, true);
  setComparisonText(dom.dashSaldoCompare, saldoAtual, saldoAnterior);
  setComparisonText(dom.dashDreCompare, resultadoLiquidoAtual, resultadoLiquidoAnterior);
  setComparisonText(dom.dashAportesCompare, outrasEntradasAtual, outrasEntradasAnterior);

  dom.dreReceitaOp.textContent = formatCurrency(receitaOperacionalAtual);
  dom.dreOutrasEntradas.textContent = formatCurrency(outrasEntradasAtual);
  dom.dreCustos.textContent = formatCurrency(custosAtual);
  dom.dreDespesas.textContent = formatCurrency(despesasAtual);
  dom.dreResultadoOp.textContent = formatCurrency(resultadoOperacionalAtual);
  dom.dreResultadoLiquido.textContent = formatCurrency(resultadoLiquidoAtual);

  const labelAtual = formatRangeLabel(range);
  const labelAnterior = formatRangeLabel(previousRange);
  dom.dashboardPeriodLabel.textContent = `${labelAtual} • comparativo com ${labelAnterior}`;
  dom.drePeriodLabel.textContent = `Periodo: ${labelAtual}`;

  renderCharts({
    period,
    range,
    financeiroAtual: financeiroAtualPago,
    vendasAtual: vendasAtualContabilizadas,
    orcamentosAtual
  });
  renderTopClientes(vendasAtualContabilizadas, recebidoPorVendaAtual);
  renderFinanceiroResumo(financeiroAtualPago);
}

function renderCharts(context) {
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();
  const fluxo = buildFluxoSeries(context.period, context.range, context.financeiroAtual);

  updateChart('chart-fluxo', 'line', {
    labels: fluxo.labels,
    datasets: [
      {
        label: 'Entradas',
        data: fluxo.entradas,
        borderColor: '#4dd599',
        backgroundColor: 'rgba(77, 213, 153, 0.18)',
        tension: 0.28,
        fill: false
      },
      {
        label: 'Saidas',
        data: fluxo.saidas,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.18)',
        tension: 0.28,
        fill: false
      },
      {
        label: 'Saldo acumulado',
        data: fluxo.saldoAcumulado,
        borderColor: '#d9b45a',
        backgroundColor: 'rgba(217, 180, 90, 0.2)',
        tension: 0.32,
        fill: true
      }
    ]
  }, {
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  });

  const saidasByCategoria = context.financeiroAtual
    .filter((item) => String(item.tipo || '').toLowerCase() === 'saida')
    .reduce((acc, item) => {
      const key = item.categoria || 'Outros';
      acc[key] = (acc[key] || 0) + parseNumber(item.valor);
      return acc;
    }, {});

  const categoriasLabels = Object.keys(saidasByCategoria);
  const categoriasValues = Object.values(saidasByCategoria);
  updateChart('chart-categorias', 'doughnut', {
    labels: categoriasLabels.length ? categoriasLabels : ['Sem saidas'],
    datasets: [{
      data: categoriasValues.length ? categoriasValues : [1],
      backgroundColor: ['#ff6b6b', '#d9b45a', '#6aa6ff', '#8aa49c', '#4dd599', '#b88a2f']
    }]
  }, {
    plugins: { legend: { labels: { color: textColor } } }
  });

  const statusCounts = context.orcamentosAtual.reduce((acc, item) => {
    const key = item.status || 'Em negociacao';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  updateChart('chart-orcamentos', 'bar', {
    labels: Object.keys(statusCounts).length ? Object.keys(statusCounts) : ['Sem dados'],
    datasets: [{
      label: 'Orcamentos',
      data: Object.values(statusCounts).length ? Object.values(statusCounts) : [0],
      backgroundColor: ['#d9b45a', '#4dd599', '#ff6b6b', '#6aa6ff', '#8aa49c']
    }]
  }, {
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  });

  const pgtoCounts = context.vendasAtual.reduce((acc, item) => {
    const key = item.pgto || 'Pendente';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  updateChart('chart-pgto', 'bar', {
    labels: Object.keys(pgtoCounts).length ? Object.keys(pgtoCounts) : ['Sem dados'],
    datasets: [{
      label: 'Vendas',
      data: Object.values(pgtoCounts).length ? Object.values(pgtoCounts) : [0],
      backgroundColor: '#4dd599'
    }]
  }, {
    plugins: { legend: { labels: { color: textColor } } },
    indexAxis: 'y',
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  });
}

function updateChart(canvasId, type, data, options) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (state.charts[canvasId]) {
    state.charts[canvasId].destroy();
  }
  state.charts[canvasId] = new Chart(ctx, {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...options
    }
  });
}

function buildFluxoSeries(period, range, financeiroRows) {
  const labels = [];
  const entradas = [];
  const saidas = [];
  const monthShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let bucketCount = 0;

  if (period === 'today') {
    bucketCount = 24;
    for (let h = 0; h < bucketCount; h += 1) {
      labels.push(`${String(h).padStart(2, '0')}h`);
      entradas.push(0);
      saidas.push(0);
    }
  } else if (period === 'week') {
    bucketCount = 7;
    for (let d = 0; d < bucketCount; d += 1) {
      const date = new Date(range.start);
      date.setDate(range.start.getDate() + d);
      labels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
      entradas.push(0);
      saidas.push(0);
    }
  } else if (period === 'month') {
    const daysInMonth = new Date(range.start.getFullYear(), range.start.getMonth() + 1, 0).getDate();
    bucketCount = daysInMonth;
    for (let d = 1; d <= bucketCount; d += 1) {
      labels.push(String(d));
      entradas.push(0);
      saidas.push(0);
    }
  } else {
    bucketCount = 12;
    for (let m = 0; m < bucketCount; m += 1) {
      labels.push(monthShort[m]);
      entradas.push(0);
      saidas.push(0);
    }
  }

  financeiroRows.forEach((item) => {
    const date = parseDateSafe(item.dataHora);
    if (!date) return;
    let index = -1;
    if (period === 'today') {
      index = date.getHours();
    } else if (period === 'week') {
      const diff = Math.floor((startOfDay(date).getTime() - startOfDay(range.start).getTime()) / 86400000);
      index = diff;
    } else if (period === 'month') {
      index = date.getDate() - 1;
    } else {
      index = date.getMonth();
    }
    if (index < 0 || index >= bucketCount) return;
    const value = parseNumber(item.valor);
    if (String(item.tipo || '').toLowerCase() === 'saida') {
      saidas[index] += value;
    } else {
      entradas[index] += value;
    }
  });

  const saldoAcumulado = [];
  let running = 0;
  for (let i = 0; i < entradas.length; i += 1) {
    running += entradas[i] - saidas[i];
    saldoAcumulado.push(running);
  }

  return { labels, entradas, saidas, saldoAcumulado };
}

function sumFinance(items, tipo, extraPredicate = null) {
  return items.reduce((sum, item) => {
    const matchTipo = String(item.tipo || '').toLowerCase() === String(tipo || '').toLowerCase();
    const extraOk = typeof extraPredicate === 'function' ? extraPredicate(item) : true;
    if (!matchTipo || !extraOk) return sum;
    return sum + parseNumber(item.valor);
  }, 0);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateSafe(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPeriodRange(period) {
  const now = new Date();
  const start = new Date(now);
  if (period === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    const weekDay = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - weekDay);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}

function getPreviousRange(range) {
  const duration = range.end.getTime() - range.start.getTime();
  const end = new Date(range.start.getTime() - 1);
  const start = new Date(end.getTime() - duration);
  return { start, end };
}

function filterByRange(items, range, field = 'dataHora') {
  return (items || []).filter((item) => {
    const date = parseDateSafe(item[field]);
    if (!date) return false;
    return date >= range.start && date <= range.end;
  });
}

function formatRangeLabel(range) {
  const startLabel = range.start.toLocaleDateString('pt-BR');
  const endLabel = range.end.toLocaleDateString('pt-BR');
  if (startLabel === endLabel) return startLabel;
  return `${startLabel} ate ${endLabel}`;
}

function setComparisonText(element, current, previous, reverseGood = false) {
  if (!element) return;
  let text = 'Sem variacao';
  let trendClass = 'metric-flat';
  const delta = current - previous;
  if (previous === 0 && current !== 0) {
    text = 'Novo no periodo';
    trendClass = reverseGood ? 'metric-down' : 'metric-up';
  } else if (delta !== 0 && previous !== 0) {
    const pct = (delta / Math.abs(previous)) * 100;
    const sign = pct > 0 ? '+' : '';
    text = `${sign}${pct.toFixed(1)}% vs periodo anterior`;
    const improved = reverseGood ? delta < 0 : delta > 0;
    trendClass = improved ? 'metric-up' : 'metric-down';
  }
  element.textContent = text;
  element.classList.remove('metric-up', 'metric-down', 'metric-flat');
  element.classList.add(trendClass);
}

function getChartTextColor() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? '#465048' : '#b9c4bf';
}

function getChartGridColor() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'rgba(0, 0, 0, 0.08)'
    : 'rgba(255, 255, 255, 0.08)';
}

function renderTopClientes(vendasBase = state.data.vendas, recebidoPorVenda = {}) {
  const ranking = (vendasBase || []).reduce((acc, venda) => {
    const key = venda.cliente || 'Sem cliente';
    const total = recebidoPorVenda[String(venda.numero || '').trim()] || parseNumber(venda.valor);
    acc[key] = (acc[key] || 0) + total;
    return acc;
  }, {});

  const top = Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  dom.topClientes.innerHTML = top.length
    ? top.map(([cliente, total]) => `
        <div class="list-item">
          <span>${cliente}</span>
          <strong>${formatCurrency(total)}</strong>
        </div>
      `).join('')
    : '<div class="list-item"><span>Sem vendas no periodo</span><strong>-</strong></div>';
}

function renderFinanceiroResumo(financeiroRows) {
  const rows = [...(financeiroRows || [])]
    .sort((a, b) => new Date(b.dataHora || 0).getTime() - new Date(a.dataHora || 0).getTime())
    .slice(0, 6);

  dom.financeiroResumoList.innerHTML = rows.length
    ? rows.map((item) => `
      <div class="list-item">
        <span>${formatDate(item.dataHora)} • ${item.categoria || '-'}</span>
        <strong>${String(item.tipo || '').toLowerCase() === 'saida' ? '-' : '+'} ${formatCurrency(item.valor || 0)}</strong>
      </div>
    `).join('')
    : '<div class="list-item"><span>Sem movimentacoes no periodo</span><strong>-</strong></div>';
}

function getClienteTelefone(nome) {
  const cliente = state.data.clientes.find((item) => item.nome === nome);
  return cliente?.telefone ? String(cliente.telefone) : '';
}

function openDrawer(contentHtml) {
  dom.drawerBody.innerHTML = contentHtml;
  dom.drawer.classList.remove('hidden');
  applyInputMasks(dom.drawerBody);
}

function closeDrawer() {
  dom.drawer.classList.add('hidden');
  dom.drawerBody.innerHTML = '';
}

function openModal(contentHtml) {
  dom.modalContent.innerHTML = contentHtml;
  dom.modal.classList.remove('hidden');
}

function closeModal() {
  dom.modal.classList.add('hidden');
  dom.modalContent.innerHTML = '';
}

function buildOrcamentoDoc(orcamento) {
  const metrics = getOrcamentoMetrics(orcamento);
  return `
    <div class="doc">
      <header class="doc-header">
        <div class="brand-block">
          <img src="img/logo_black.png" alt="GAO Joias" />
          <div>
            <div class="doc-title">Orcamento</div>
            <div class="doc-number">#${orcamento.numero || '-'}</div>
          </div>
        </div>
        <div>
          <div class="doc-title">GAO Joias</div>
          <strong>Proposta comercial</strong>
        </div>
      </header>
      <div class="doc-meta">
        <div><span>Cliente</span><strong>${orcamento.cliente || '-'}</strong></div>
        <div><span>Data</span><strong>${formatDateShort(orcamento.dataHora)}</strong></div>
        <div><span>Validade</span><strong>${orcamento.validade || '-'}</strong></div>
        <div><span>Status</span><strong>${orcamento.status || 'Em negociacao'}</strong></div>
      </div>
      <section class="doc-section">
        <h4>Itens</h4>
        ${buildItensTableHtml(metrics.items)}
      </section>
      <div class="doc-total">
        <div class="total-box">
          <span>Total do orcamento</span>
          <strong>${formatCurrency(metrics.valor)}</strong>
        </div>
      </div>
      <section class="doc-section">
        <h4>Observacoes</h4>
        <p>${orcamento.obsPublic || '-'}</p>
      </section>
      <footer class="doc-footer">
        <span>Documento nao fiscal • GAO Joias</span><br>
      </footer><br>
    </div>
  `;
}

function buildVendaDoc(venda, thermal = false) {
  const metrics = getVendaMetrics(venda);
  return `
    <div class="doc ${thermal ? 'thermal' : ''}">
      <header class="doc-header">
        <div class="brand-block">
          <img src="img/logo_black.png" alt="GAO Joias" />
          <div>
            <div class="doc-title">Nota de venda</div>
            <div class="doc-number">#${venda.numero || '-'}</div>
          </div>
        </div>
        <div>
          <div class="doc-title">GAO Joias</div>
          <strong>Documento nao fiscal</strong>
        </div>
      </header>
      <div class="doc-meta">
        <div><span>Cliente</span><strong>${venda.cliente || '-'}</strong></div>
        <div><span>Data</span><strong>${formatDateShort(venda.dataHora)}</strong></div>
        <div><span>Pagamento</span><strong>${metrics.pgtoResumo || '-'}</strong></div>
        <div><span>Status</span><strong>${metrics.statusRecebimento}</strong></div>
        <div><span>Valor</span><strong>${formatCurrency(metrics.valor)}</strong></div>
        <div><span>Recebido</span><strong>${formatCurrency(metrics.recebido)}</strong></div>
      </div>
      <section class="doc-section">
        <h4>Itens</h4>
        ${buildItensTableHtml(metrics.items)}
      </section>
      <section class="doc-section">
        <h4>Recebimentos</h4>
        ${buildPagamentosTableHtml(metrics.payments)}
      </section>
      <div class="doc-total">
        <div class="total-box">
          <span>Total da venda</span>
          <strong>${formatCurrency(metrics.valor)}</strong>
        </div>
      </div>
      <section class="doc-section">
        <h4>Observacoes</h4>
        <p>${venda.obs || '-'}</p>
      </section>
      <footer class="doc-footer">
        <span>Documento nao fiscal • GAO Joias</span>
      </footer>
    </div>
  `;
}

async function generatePdf(html, filename) {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  await html2pdf()
    .from(container)
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4' }
    })
    .save();
  container.remove();
}

async function generatePdfBlob(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const worker = html2pdf().from(container).set({
    margin: 10,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4' }
  });
  const blob = await worker.outputPdf('blob');
  container.remove();
  return blob;
}

function supportsWebSerial() {
  return Boolean(navigator.serial && window.isSecureContext);
}

function getThermalBaudRate() {
  return Number(dom.thermalBaud?.value || localStorage.getItem(STORAGE_KEYS.thermalBaudRate) || DEFAULT_THERMAL_BAUD_RATE);
}

function getThermalMode() {
  const mode = dom.thermalMode?.value || localStorage.getItem(STORAGE_KEYS.thermalMode) || DEFAULT_THERMAL_MODE;
  return mode === 'visual' ? 'visual' : 'text';
}

function updateThermalStatus(message, ok = false) {
  if (!dom.thermalStatus) return;
  if (message) {
    dom.thermalStatus.textContent = message;
  } else if (!navigator.serial) {
    dom.thermalStatus.textContent = 'Web Serial nao esta disponivel neste navegador. Use Chrome/Edge em HTTPS.';
  } else if (!window.isSecureContext) {
    dom.thermalStatus.textContent = 'Web Serial exige HTTPS ou localhost. Na Hostinger, use o dominio com HTTPS.';
  } else if (thermalPrinter.connected) {
    dom.thermalStatus.textContent = `Bematech conectada em ${getThermalBaudRate()} baud.`;
  } else {
    dom.thermalStatus.textContent = 'Bematech ainda nao conectada. Clique em Conectar Bematech.';
  }
  dom.thermalStatus.dataset.status = ok ? 'ok' : 'warn';
}

function restoreThermalSettings() {
  if (dom.thermalBaud) {
    dom.thermalBaud.value = String(localStorage.getItem(STORAGE_KEYS.thermalBaudRate) || DEFAULT_THERMAL_BAUD_RATE);
  }
  if (dom.thermalMode) {
    dom.thermalMode.value = localStorage.getItem(STORAGE_KEYS.thermalMode) || DEFAULT_THERMAL_MODE;
  }
  updateThermalStatus();
}

async function connectThermalPrinter(requestPermission = true) {
  if (!supportsWebSerial()) {
    updateThermalStatus();
    showToast('Web Serial exige Chrome/Edge em HTTPS ou localhost.', 'error');
    return false;
  }

  try {
    const baudRate = getThermalBaudRate();
    let port = thermalPrinter.port;
    if (!port && !requestPermission) {
      const ports = await navigator.serial.getPorts();
      port = ports[0] || null;
    }
    if (!port && requestPermission) {
      port = await navigator.serial.requestPort();
    }
    if (!port) {
      updateThermalStatus('Nenhuma Bematech autorizada ainda.', false);
      return false;
    }

    if (!port.writable) {
      await port.open({
        baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });
    }

    thermalPrinter.port = port;
    thermalPrinter.connected = true;
    localStorage.setItem(STORAGE_KEYS.thermalBaudRate, String(baudRate));
    updateThermalStatus('', true);
    return true;
  } catch (error) {
    thermalPrinter.connected = false;
    const message = error?.name === 'NotFoundError'
      ? 'Conexao cancelada. Selecione a porta USB/serial da Bematech.'
      : `Nao foi possivel conectar a Bematech: ${error.message || error}`;
    updateThermalStatus(message, false);
    showToast(message, 'error');
    return false;
  }
}

async function disconnectThermalPrinter() {
  try {
    if (thermalPrinter.port) {
      await thermalPrinter.port.close();
    }
  } catch (error) {
    console.warn(error);
  } finally {
    thermalPrinter.port = null;
    thermalPrinter.connected = false;
    updateThermalStatus('Bematech desconectada.', false);
  }
}

function printerText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E\n\r]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function thermalLine(char = '-') {
  return char.repeat(42);
}

function centerThermalText(value) {
  const text = printerText(value).slice(0, 42);
  const left = Math.max(Math.floor((42 - text.length) / 2), 0);
  return `${' '.repeat(left)}${text}`;
}

function wrapThermalText(value, width = 42) {
  const words = printerText(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    if (!line) {
      line = word;
      return;
    }
    if ((line.length + word.length + 1) <= width) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : ['-'];
}

function twoColumnThermal(left, right, width = 42) {
  const l = printerText(left);
  const r = printerText(right);
  const available = Math.max(width - r.length - 1, 1);
  return `${l.slice(0, available).padEnd(available, ' ')} ${r}`;
}

function buildThermalItensLines(items = []) {
  if (!items.length) {
    return ['Sem itens'];
  }

  const lines = [];
  items.forEach((item, index) => {
    const itemNumber = String(index + 1).padStart(2, '0');
    wrapThermalText(item.titulo || 'Item', 39).forEach((line, lineIndex) => {
      lines.push(lineIndex === 0 ? `${itemNumber} ${line}`.slice(0, 42) : `   ${line}`.slice(0, 42));
    });
    const qty = Number(item.quantidade || 1).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    const unit = formatCurrency(item.valorUnitario || 0);
    const total = formatCurrency((item.quantidade || 1) * (item.valorUnitario || 0));
    lines.push(twoColumnThermal(`${qty} x ${unit}`, total));
    lines.push(thermalLine('.'));
  });
  if (lines.at(-1) === thermalLine('.')) {
    lines.pop();
  }
  return lines;
}

function buildThermalVendaText(venda) {
  const metrics = getVendaMetrics(venda);
  const lines = [
    centerThermalText('GAO JOIAS'),
    centerThermalText('Joias e atendimento personalizado'),
    centerThermalText('DOCUMENTO NAO FISCAL'),
    thermalLine('='),
    centerThermalText(`CUPOM DE VENDA #${printerText(venda.numero || '-')}`),
    thermalLine('='),
    twoColumnThermal('Data', printerText(formatDateShort(venda.dataHora))),
    twoColumnThermal('Cliente', printerText(venda.cliente || '-')),
    twoColumnThermal('Pagamento', printerText(metrics.pgtoResumo || '-')),
    twoColumnThermal('Status', printerText(metrics.statusRecebimento || '-')),
    thermalLine('-'),
    'ITENS',
    ...buildThermalItensLines(metrics.items),
    thermalLine('-'),
    centerThermalText(`TOTAL ${formatCurrency(metrics.valor)}`),
    twoColumnThermal('Recebido', formatCurrency(metrics.recebido)),
    twoColumnThermal('Saldo', formatCurrency(metrics.saldo)),
  ];

  if (metrics.payments?.length) {
    lines.push(thermalLine(), 'RECEBIMENTOS');
    metrics.payments.forEach((payment) => {
      lines.push(twoColumnThermal(payment.descricao || payment.forma || 'Pagamento', formatCurrency(payment.valor || 0)));
      lines.push(`  ${printerText(payment.forma || '-')} | ${printerText(payment.status || '-')}`);
    });
  }

  if (venda.obs) {
    lines.push(thermalLine(), 'OBSERVACOES');
    lines.push(...wrapThermalText(venda.obs));
  }

  lines.push(
    thermalLine('='),
    centerThermalText('Obrigado pela preferencia!'),
    centerThermalText('WhatsApp (19) 98968-9260'),
    centerThermalText('GAO Joias'),
    '\n\n'
  );
  return `${lines.join('\n')}\n`;
}

function buildThermalOrcamentoText(orcamento) {
  const metrics = getOrcamentoMetrics(orcamento);
  const lines = [
    centerThermalText('GAO JOIAS'),
    centerThermalText('Joias e atendimento personalizado'),
    centerThermalText('ORCAMENTO'),
    thermalLine('='),
    centerThermalText(`ORCAMENTO #${printerText(orcamento.numero || '-')}`),
    thermalLine('='),
    twoColumnThermal('Data', printerText(formatDateShort(orcamento.dataHora))),
    twoColumnThermal('Cliente', printerText(orcamento.cliente || '-')),
    twoColumnThermal('Validade', printerText(orcamento.validade || '-')),
    twoColumnThermal('Status', printerText(orcamento.status || '-')),
    thermalLine('-'),
    'ITENS',
    ...buildThermalItensLines(metrics.items),
    thermalLine('-'),
    centerThermalText(`TOTAL ${formatCurrency(metrics.valor)}`),
  ];

  if (orcamento.obsPublic) {
    lines.push(thermalLine(), 'OBSERVACOES');
    lines.push(...wrapThermalText(orcamento.obsPublic));
  }

  lines.push(
    thermalLine('='),
    centerThermalText('Documento nao fiscal'),
    centerThermalText('WhatsApp (19) 98968-9260'),
    '\n\n'
  );
  return `${lines.join('\n')}\n`;
}

function escposText(text = '') {
  return new TextEncoder().encode(`${text}\n`);
}

function escposCommand(...bytes) {
  return new Uint8Array(bytes);
}

function escposAlign(position = 'left') {
  const alignments = { left: 0, center: 1, right: 2 };
  return escposCommand(0x1b, 0x61, alignments[position] ?? 0);
}

function escposBold(active) {
  return escposCommand(0x1b, 0x45, active ? 1 : 0);
}

function escposSize(width = 0, height = 0) {
  return escposCommand(0x1d, 0x21, ((width & 0x07) << 4) | (height & 0x07));
}

function escposFeed(lines = 1) {
  return escposCommand(0x1b, 0x64, lines);
}

function appendEscposLine(commands, line, options = {}) {
  const align = options.align || 'left';
  commands.push(
    escposAlign(align),
    escposBold(Boolean(options.bold)),
    escposSize(options.double ? 1 : 0, options.double ? 1 : 0),
    escposText(line),
    escposSize(0, 0),
    escposBold(false),
    escposAlign('left')
  );
}

function escposPayload(text) {
  const lines = String(text || '').split(/\r?\n/);
  const commands = [
    new Uint8Array([0x1b, 0x40]),
    new Uint8Array([0x1b, 0x33, 0x18])
  ];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      commands.push(escposText(''));
      return;
    }

    if (trimmed === 'GAO JOIAS') {
      appendEscposLine(commands, trimmed, { align: 'center', bold: true, double: true });
      return;
    }

    if (
      trimmed === 'DOCUMENTO NAO FISCAL'
      || trimmed === 'ORCAMENTO'
      || trimmed.startsWith('CUPOM DE VENDA #')
      || trimmed.startsWith('ORCAMENTO #')
    ) {
      appendEscposLine(commands, trimmed, { align: 'center', bold: true });
      return;
    }

    if (/^[=\-.]{8,}$/.test(trimmed)) {
      appendEscposLine(commands, line, { align: 'center' });
      return;
    }

    if (['ITENS', 'RECEBIMENTOS', 'OBSERVACOES'].includes(trimmed)) {
      appendEscposLine(commands, trimmed, { bold: true });
      return;
    }

    if (trimmed.startsWith('TOTAL ')) {
      appendEscposLine(commands, trimmed, { align: 'center', bold: true, double: true });
      return;
    }

    if (trimmed.startsWith('Obrigado') || trimmed.startsWith('WhatsApp') || trimmed === 'GAO Joias') {
      appendEscposLine(commands, trimmed, { align: 'center', bold: trimmed === 'Obrigado pela preferencia!' });
      return;
    }

    appendEscposLine(commands, line);
  });

  commands.push(
    escposFeed(3),
    new Uint8Array([0x1d, 0x56, 0x42, 0x00])
  );

  const total = commands.reduce((sum, command) => sum + command.length, 0);
  const payload = new Uint8Array(total);
  let offset = 0;
  commands.forEach((command) => {
    payload.set(command, offset);
    offset += command.length;
  });
  return payload;
}

async function printThermalText(text, label = 'cupom') {
  const connected = await connectThermalPrinter(!thermalPrinter.port);
  if (!connected || !thermalPrinter.port?.writable) {
    return;
  }

  const writer = thermalPrinter.port.writable.getWriter();
  try {
    await writeSerialBytes(writer, escposPayload(text));
    showToast(`Impressao ${label} enviada para a Bematech.`);
  } catch (error) {
    thermalPrinter.connected = false;
    updateThermalStatus('Falha ao enviar dados para a Bematech.', false);
    showToast(error.message || 'Falha ao imprimir na Bematech.', 'error');
  } finally {
    writer.releaseLock();
  }
}

async function writeSerialBytes(writer, payload, chunkSize = 4096) {
  for (let offset = 0; offset < payload.length; offset += chunkSize) {
    await writer.write(payload.slice(offset, offset + chunkSize));
  }
}

function thermalRasterCss() {
  return `
    .thermal-raster-root {
      width: 576px;
      background: #fff;
      color: #111;
      font-family: Poppins, Arial, sans-serif;
    }
    .thermal-raster-root .doc {
      width: 576px !important;
      max-width: 576px !important;
      margin: 0 !important;
      padding: 28px !important;
      border: 1px solid #dddddd !important;
      border-radius: 16px !important;
      background: #fff !important;
      box-shadow: none !important;
      color: #111 !important;
    }
    .thermal-raster-root .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #d8d8d8;
      padding-bottom: 14px;
    }
    .thermal-raster-root .brand-block {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .thermal-raster-root .doc-header img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .thermal-raster-root .doc-title {
      color: #555;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .thermal-raster-root .doc-number {
      font-size: 22px;
      font-weight: 800;
    }
    .thermal-raster-root .doc-meta {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .thermal-raster-root .doc-meta div {
      border: 1px solid #e3e3e3;
      border-radius: 10px;
      background: #f6f6f6;
      padding: 10px;
    }
    .thermal-raster-root .doc-meta span {
      display: block;
      color: #666;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .5px;
      text-transform: uppercase;
    }
    .thermal-raster-root .doc-meta strong {
      display: block;
      margin-top: 3px;
      font-size: 15px;
    }
    .thermal-raster-root .doc-section {
      margin-top: 16px;
      display: grid;
      gap: 8px;
    }
    .thermal-raster-root .doc h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .thermal-raster-root .doc p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
    }
    .thermal-raster-root .doc-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .thermal-raster-root .doc-table th {
      border-bottom: 1px solid #222;
      color: #444;
      font-size: 11px;
      font-weight: 800;
      padding: 7px 4px;
      text-align: left;
      text-transform: uppercase;
    }
    .thermal-raster-root .doc-table td {
      border-bottom: 1px dashed #cfcfcf;
      font-size: 14px;
      padding: 9px 4px;
      vertical-align: top;
    }
    .thermal-raster-root .doc-table th:last-child,
    .thermal-raster-root .doc-table td:last-child {
      text-align: right;
    }
    .thermal-raster-root .doc-total {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    .thermal-raster-root .total-box {
      min-width: 230px;
      border-radius: 12px;
      background: #111;
      color: #fff;
      padding: 14px 16px;
      text-align: right;
    }
    .thermal-raster-root .total-box span {
      display: block;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .6px;
      opacity: .8;
      text-transform: uppercase;
    }
    .thermal-raster-root .total-box strong {
      display: block;
      margin-top: 4px;
      font-size: 24px;
      font-weight: 900;
    }
    .thermal-raster-root .doc-footer {
      margin-top: 18px;
      border-top: 1px solid #d8d8d8;
      padding-top: 12px;
      color: #444;
      font-size: 13px;
      text-align: center;
    }
  `;
}

function waitForImages(scope) {
  const images = Array.from(scope.querySelectorAll('img'));
  return Promise.all(images.map((image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });
  }));
}

async function renderThermalHtmlCanvas(html) {
  if (typeof html2canvas !== 'function') {
    throw new Error('Biblioteca html2canvas indisponivel.');
  }

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = '576px';
  host.style.background = '#fff';
  host.style.zIndex = '-1';
  host.className = 'thermal-raster-root';
  host.innerHTML = `<style>${thermalRasterCss()}</style>${html}`;
  document.body.appendChild(host);

  try {
    await document.fonts?.ready;
    await waitForImages(host);
    const target = host.querySelector('.doc') || host;
    return await html2canvas(target, {
      backgroundColor: '#ffffff',
      scale: 1,
      width: 576,
      windowWidth: 576,
      useCORS: true
    });
  } finally {
    host.remove();
  }
}

function canvasToEscposRaster(canvas) {
  const width = Math.min(576, canvas.width);
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.getImageData(0, 0, width, height).data;
  const widthBytes = Math.ceil(width / 8);
  const imageData = new Uint8Array(widthBytes * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceIndex = ((y * canvas.width) + x) * 4;
      const red = pixels[sourceIndex];
      const green = pixels[sourceIndex + 1];
      const blue = pixels[sourceIndex + 2];
      const alpha = pixels[sourceIndex + 3];
      const luminance = (red * 0.299) + (green * 0.587) + (blue * 0.114);
      const isBlack = alpha > 80 && luminance < 178;
      if (isBlack) {
        const byteIndex = (y * widthBytes) + Math.floor(x / 8);
        imageData[byteIndex] |= 0x80 >> (x % 8);
      }
    }
  }

  const header = new Uint8Array([
    0x1d, 0x76, 0x30, 0x00,
    widthBytes & 0xff,
    (widthBytes >> 8) & 0xff,
    height & 0xff,
    (height >> 8) & 0xff
  ]);
  const commands = [
    escposCommand(0x1b, 0x40),
    escposCommand(0x1b, 0x33, 0x18),
    header,
    imageData,
    escposFeed(3),
    escposCommand(0x1d, 0x56, 0x42, 0x00)
  ];
  const total = commands.reduce((sum, command) => sum + command.length, 0);
  const payload = new Uint8Array(total);
  let offset = 0;
  commands.forEach((command) => {
    payload.set(command, offset);
    offset += command.length;
  });
  return payload;
}

async function printThermalHtml(html, label = 'cupom', fallbackText = '') {
  const connected = await connectThermalPrinter(!thermalPrinter.port);
  if (!connected || !thermalPrinter.port?.writable) {
    return;
  }

  setLoading(true);
  let payload;
  try {
    const canvas = await renderThermalHtmlCanvas(html);
    payload = canvasToEscposRaster(canvas);
  } catch (error) {
    console.warn(error);
    if (!fallbackText) {
      showToast('Nao foi possivel renderizar a nota visual para a Bematech.', 'error');
      setLoading(false);
      return;
    }
    payload = escposPayload(fallbackText);
  }

  const writer = thermalPrinter.port.writable.getWriter();
  try {
    await writeSerialBytes(writer, payload);
    showToast(`Impressao visual ${label} enviada para a Bematech.`);
  } catch (error) {
    thermalPrinter.connected = false;
    updateThermalStatus('Falha ao enviar dados para a Bematech.', false);
    showToast(error.message || 'Falha ao imprimir na Bematech.', 'error');
  } finally {
    writer.releaseLock();
    setLoading(false);
  }
}

function printThermalVenda(venda) {
  if (getThermalMode() === 'visual') {
    return printThermalHtml(buildVendaDoc(venda, true), 'da venda', buildThermalVendaText(venda));
  }
  return printThermalText(buildThermalVendaText(venda), 'da venda');
}

function printThermalOrcamento(orcamento) {
  if (getThermalMode() === 'visual') {
    return printThermalHtml(buildOrcamentoDoc(orcamento), 'do orcamento', buildThermalOrcamentoText(orcamento));
  }
  return printThermalText(buildThermalOrcamentoText(orcamento), 'do orcamento');
}

function printHtml(html, thermal = false) {
  const win = window.open('', '_blank');
  if (!win) {
    showToast('O navegador bloqueou a janela de impressao.', 'error');
    return;
  }
  win.document.write(`
    <html>
    <head>
      <title>Impressao</title>
      <style>
        body { font-family: Poppins, sans-serif; margin: 0; padding: 0; background: #fff; color: #1b1b1b; }
        .doc {
          width: 100%;
          max-width: ${thermal ? '80mm' : '190mm'};
          margin: 0 auto;
          padding: ${thermal ? '12px' : '24px'};
          border: ${thermal ? 'none' : '1px solid #ededed'};
          border-radius: ${thermal ? '0' : '16px'};
          box-shadow: none;
        }
        .doc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid #e6e6e6;
          padding-bottom: 12px;
        }
        .brand-block { display: flex; align-items: center; gap: 10px; }
        .doc-header img { width: 56px; height: 56px; object-fit: contain; }
        .doc-title { text-transform: uppercase; letter-spacing: 1px; font-size: 11px; color: #666; }
        .doc-number { font-size: 18px; font-weight: 600; }
        .doc-meta { margin-top: 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .doc-meta div { background: #f8f8f8; border: 1px solid #eee; border-radius: 10px; padding: 8px 10px; }
        .doc-meta span { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #777; }
        .doc-meta strong { font-size: 13px; }
        .doc-section { margin-top: 14px; display: grid; gap: 8px; }
        .doc h4 { font-size: 13px; margin: 0; }
        .doc p { margin: 0; }
        .doc-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .doc-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #666; border-bottom: 1px solid #ddd; padding: 6px 4px; }
        .doc-table td { padding: 8px 4px; border-bottom: 1px dashed #ddd; font-size: 12px; }
        .doc-table th:last-child, .doc-table td:last-child { text-align: right; }
        .doc-total { margin-top: 12px; display: flex; justify-content: flex-end; }
        .doc-total .total-box { background: #111; color: #fff; border-radius: 10px; padding: 10px 12px; min-width: 160px; text-align: right; }
        .doc-total .total-box span { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.8; }
        .doc-total .total-box strong { font-size: 16px; }
        .doc-footer { margin-top: 16px; font-size: 11px; color: #444; }
        @page { size: ${thermal ? '80mm auto' : 'A4'}; margin: ${thermal ? '6mm' : '12mm'}; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 300);
}

async function sendWhatsApp(html, phone, message) {
  try {
    const text = encodeURIComponent(`${message}\n\nPDF pronto para anexar.`);
    const url = `https://wa.me/${phone || ''}?text=${text}`;
    window.open(url, '_blank');
    showToast('Envie o PDF manualmente no WhatsApp.');
  } catch (error) {
    showToast('Nao foi possivel abrir o WhatsApp.', 'error');
  }
}
function handleOrcamentoActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  const orcamento = state.data.orcamentos.find((item) => item.rowIndex === id);
  if (!orcamento) return;

  const docHtml = buildOrcamentoDoc(orcamento);

  if (action === 'view') {
    openModal(`
      <div class="modal-actions">
        <h3>Orcamento #${orcamento.numero}</h3>
        <div class="config-actions">
          <button class="btn btn-ghost" id="modal-pdf"><i class="fa-solid fa-file-pdf"></i><span>Baixar PDF</span></button>
          <button class="btn btn-ghost" id="modal-print"><i class="fa-solid fa-print"></i><span>Imprimir</span></button>
          <button class="btn btn-ghost" id="modal-thermal"><i class="fa-solid fa-receipt"></i><span>Imprimir Bematech</span></button>
          <button class="icon-btn" id="modal-close" title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${docHtml}
    `);
    qs('#modal-pdf').addEventListener('click', () => generatePdf(docHtml, `orcamento-${orcamento.numero}.pdf`));
    qs('#modal-print').addEventListener('click', () => printHtml(docHtml));
    qs('#modal-thermal').addEventListener('click', () => printThermalOrcamento(orcamento));
    qs('#modal-close').addEventListener('click', closeModal);
    return;
  }

  if (action === 'edit') {
    if (state.perfil !== 'Administrador') return;
    openOrcamentoEditor(orcamento);
    return;
  }

  if (action === 'pdf') {
    generatePdf(docHtml, `orcamento-${orcamento.numero}.pdf`);
  }

  if (action === 'whatsapp') {
    const phone = getClienteTelefone(orcamento.cliente).replace(/\D/g, '');
    const message = `Ola, ${orcamento.cliente}. Segue o orcamento ${orcamento.numero} da GAO Joias.`;
    sendWhatsApp(docHtml, phone, message);
  }

  if (action === 'confirm') {
    confirmVendaFromOrcamento(orcamento);
  }

  if (action === 'reject') {
    rejectOrcamento(orcamento);
  }
}

async function rejectOrcamento(orcamento) {
  try {
    const updated = { ...orcamento, status: 'Perdido' };
    await apiRequest('updateOrcamento', updated);
    const index = state.data.orcamentos.findIndex((item) => item.rowIndex === orcamento.rowIndex);
    if (index >= 0) state.data.orcamentos[index] = updated;
    renderAll();
    showToast('Orcamento recusado.');
  } catch (error) {
    showToast(error.message || 'Erro ao recusar orcamento', 'error');
  }
}

function openOrcamentoEditor(orcamento) {
  const valorAtual = parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro);
  openDrawer(`
    <h3>Editar Orcamento #${orcamento.numero}</h3>
    <form id="orcamento-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${orcamento.cliente || ''}" readonly /></label>
      <label>Produto/Servico<input type="text" name="produtoServico" value="${orcamento.produtoServico || ''}" required /></label>
      <label>Descricao<input type="text" name="descricao" value="${orcamento.descricao || ''}" /></label>
      <label>Validade<input type="date" name="validade" value="${orcamento.validade || ''}" /></label>
      <label>Observacao publica<input type="text" name="obsPublic" value="${orcamento.obsPublic || ''}" /></label>
      <label>Observacao interna<input type="text" name="obsPrivate" value="${orcamento.obsPrivate || ''}" /></label>
      <label>Custo material<input type="number" step="0.01" name="custoMaterial" value="${orcamento.custoMaterial || 0}" /></label>
      <label>Custo outros<input type="number" step="0.01" name="custoOutros" value="${orcamento.custoOutros || 0}" /></label>
      <label>Valor cobrado<input type="number" step="0.01" name="valorCobrado" value="${valorAtual}" /></label>
      <label>Status\n        <select name="status">\n          <option value="Em negociacao">Em negociacao</option>\n          <option value="Enviado">Enviado</option>\n          <option value="Aprovado">Aprovado</option>\n          <option value="Perdido">Perdido</option>\n          <option value="Confirmado">Confirmado</option>\n        </select>\n      </label>
      <button class="btn btn-primary" type="submit">Atualizar</button>
    </form>
  `);

  const form = qs('#orcamento-edit-form');
  form.querySelector('select[name="status"]').value = orcamento.status || 'Em negociacao';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const calc = calcOrcamentoValues({
      custoMaterial: formData.get('custoMaterial'),
      custoOutros: formData.get('custoOutros'),
      valorCobrado: formData.get('valorCobrado')
    });
    const updated = {
      ...orcamento,
      produtoServico: formData.get('produtoServico') || '',
      descricao: formData.get('descricao') || '',
      validade: formData.get('validade') || '',
      obsPublic: formData.get('obsPublic') || '',
      obsPrivate: formData.get('obsPrivate') || '',
      custoMaterial: calc.custoMaterial,
      custoOutros: calc.custoOutros,
      totalCustos: calc.totalCustos,
      lucro: calc.lucro,
      margem: calc.margem,
      status: formData.get('status') || 'Em negociacao'
    };
    try {
      await apiRequest('updateOrcamento', updated);
      const index = state.data.orcamentos.findIndex((item) => item.rowIndex === orcamento.rowIndex);
      if (index >= 0) state.data.orcamentos[index] = updated;
      closeDrawer();
      renderAll();
      showToast('Orcamento atualizado.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar orcamento', 'error');
    }
  });
}

async function confirmVendaFromOrcamento(orcamento) {
  const valor = parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro);
  const payload = {
    dataHora: nowIso(),
    cliente: orcamento.cliente,
    produtoServico: orcamento.produtoServico,
    descricao: orcamento.descricao,
    valor,
    totalCustos: orcamento.totalCustos,
    lucro: orcamento.lucro,
    margem: orcamento.margem,
    pgto: 'Pix',
    obs: orcamento.obsPublic
  };

  try {
    await apiRequest('createVenda', payload);
    const updated = { ...orcamento, status: 'Confirmado' };
    await apiRequest('updateOrcamento', updated);
    const index = state.data.orcamentos.findIndex((item) => item.rowIndex === orcamento.rowIndex);
    if (index >= 0) state.data.orcamentos[index] = updated;
    await loadAllData();
    showToast('Venda criada e orcamento confirmado.');
  } catch (error) {
    showToast(error.message || 'Erro ao confirmar venda', 'error');
  }
}

function handleVendaActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  const venda = state.data.vendas.find((item) => item.rowIndex === id);
  if (!venda) return;

  const docHtml = buildVendaDoc(venda);
  if (action === 'nota') {
    openModal(`
      <div class="modal-actions">
        <h3>Nota de venda #${venda.numero}</h3>
        <div class="config-actions">
          <button class="btn btn-ghost" id="modal-pdf"><i class="fa-solid fa-file-pdf"></i><span>Baixar PDF</span></button>
          <button class="btn btn-ghost" id="modal-print"><i class="fa-solid fa-print"></i><span>Imprimir</span></button>
          <button class="btn btn-ghost" id="modal-thermal"><i class="fa-solid fa-receipt"></i><span>Bematech HS</span></button>
          <button class="icon-btn" id="modal-close" title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${docHtml}
    `);
    qs('#modal-pdf').addEventListener('click', () => generatePdf(docHtml, `nota-${venda.numero}.pdf`));
    qs('#modal-print').addEventListener('click', () => printHtml(docHtml));
    qs('#modal-thermal').addEventListener('click', () => printThermalVenda(venda));
    qs('#modal-close').addEventListener('click', closeModal);
  }

  if (action === 'edit-venda') {
    openVendaEditor(venda);
  }

  if (action === 'print') {
    printHtml(docHtml);
  }

  if (action === 'whatsapp') {
    const phone = getClienteTelefone(venda.cliente).replace(/\D/g, '');
    const message = `Ola, ${venda.cliente}. Segue a nota de venda ${venda.numero} da GAO Joias.`;
    sendWhatsApp(docHtml, phone, message);
  }
}

function openVendaEditor(venda) {
  openDrawer(`
    <h3>Editar venda #${venda.numero}</h3>
    <form id="venda-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${venda.cliente || ''}" readonly /></label>
      <label>Produto/Servico<input type="text" name="produtoServico" value="${venda.produtoServico || ''}" required /></label>
      <label>Descricao<input type="text" name="descricao" value="${venda.descricao || ''}" /></label>
      <label>Valor<input type="number" step="0.01" name="valor" value="${venda.valor || 0}" required /></label>
      <label>Custo total<input type="number" step="0.01" name="totalCustos" value="${venda.totalCustos || 0}" /></label>
      <label>Pagamento
        <select name="pgto" required>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Crédito">Crédito</option>
          <option value="Débito">Débito</option>
        </select>
      </label>
      <label class="full">Observacoes<input type="text" name="obs" value="${venda.obs || ''}" /></label>
      <button class="btn btn-primary" type="submit">Atualizar</button>
    </form>
  `);

  const form = qs('#venda-edit-form');
  const pgtoSelect = form.querySelector('select[name="pgto"]');
  const pgtoAtual = String(venda.pgto || '').trim();
  const pgtoValido = ['Dinheiro', 'Pix', 'Crédito', 'Débito'].includes(pgtoAtual);
  pgtoSelect.value = pgtoValido ? pgtoAtual : 'Pix';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const valor = parseNumber(formData.get('valor'));
    const totalCustos = parseNumber(formData.get('totalCustos'));
    const lucro = valor - totalCustos;
    const margem = valor ? (lucro / valor) * 100 : 0;

    const updated = {
      ...venda,
      produtoServico: formData.get('produtoServico') || '',
      descricao: formData.get('descricao') || '',
      valor,
      totalCustos,
      lucro,
      margem,
      pgto: formData.get('pgto') || 'Pix',
      obs: formData.get('obs') || ''
    };

    try {
      await apiRequest('updateVenda', updated);
      closeDrawer();
      await loadAllData();
      showToast('Venda atualizada.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar venda', 'error');
    }
  });
}
async function handleClienteSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get('id') || '';
  const payload = {
    id: id ? Number(id) : undefined,
    dataHora: nowIso(),
    nome: formData.get('nome') || '',
    telefone: formData.get('telefone') || '',
    email: formData.get('email') || '',
    empresa: formData.get('empresa') || '',
    cpfCNPJ: formData.get('cpfCNPJ') || '',
    obs: formData.get('obs') || ''
  };

  try {
    if (id) {
      const updated = await apiRequest('updateCliente', payload);
      const idx = state.data.clientes.findIndex((c) => Number(c.id) === Number(id));
      if (idx !== -1) state.data.clientes[idx] = updated; else state.data.clientes.unshift(updated);
      event.target.reset();
      renderAll();
      showToast('Cliente atualizado.');
    } else {
      const cliente = await apiRequest('createCliente', payload);
      state.data.clientes.unshift(cliente);
      event.target.reset();
      renderAll();
      showToast('Cliente cadastrado.');
    }
  } catch (error) {
    showToast(error.message || 'Erro ao salvar cliente', 'error');
  }
}

async function handleOrcamentoSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    dataHora: nowIso(),
    cliente: formData.get('cliente') || '',
    produtoServico: formData.get('produtoServico') || '',
    descricao: formData.get('descricao') || '',
    validade: formData.get('validade') || '',
    obsPublic: formData.get('obsPublic') || '',
    obsPrivate: formData.get('obsPrivate') || '',
    custoMaterial: formData.get('custoMaterial') || 0,
    custoOutros: formData.get('custoOutros') || 0,
    status: formData.get('status') || 'Em negociacao'
  };

  const calc = calcOrcamentoValues({
    custoMaterial: payload.custoMaterial,
    custoOutros: payload.custoOutros,
    valorCobrado: formData.get('valorCobrado')
  });
  payload.custoMaterial = calc.custoMaterial;
  payload.custoOutros = calc.custoOutros;
  payload.totalCustos = calc.totalCustos;
  payload.lucro = calc.lucro;
  payload.margem = calc.margem;

  try {
    const orcamento = await apiRequest('createOrcamento', payload);
    state.data.orcamentos.unshift(orcamento);
    event.target.reset();
    renderAll();
    showToast('Orcamento salvo.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar orcamento', 'error');
  }
}

async function handleVendaSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const valor = parseNumber(formData.get('valor'));
  const totalCustos = parseNumber(formData.get('totalCustos'));
  const lucro = valor - totalCustos;
  const margem = valor ? (lucro / valor) * 100 : 0;

  const payload = {
    dataHora: nowIso(),
    cliente: formData.get('cliente') || '',
    produtoServico: formData.get('produtoServico') || '',
    descricao: formData.get('descricao') || '',
    valor,
    totalCustos,
    lucro,
    margem,
    pgto: formData.get('pgto') || 'Pix',
    obs: formData.get('obs') || ''
  };

  try {
    await apiRequest('createVenda', payload);
    event.target.reset();
    await loadAllData();
    showToast('Venda registrada.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar venda', 'error');
  }
}

function openOrcamentoEditor(orcamento) {
  const metrics = getOrcamentoMetrics(orcamento);
  openDrawer(buildOrcamentoFormHtml(orcamento));
  const form = qs('#orcamento-edit-form');
  fillBuilderWithRows(form, '.items-builder[data-builder-kind="orcamento"]', metrics.items.map((item) => buildItemRowHtml(item)));
  form.querySelector('select[name="status"]').value = orcamento.status || 'Em negociacao';
  renderItemsSummary(qs('.items-builder', form));
  applyRoleAccess();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const updated = buildOrcamentoPayloadFromScope(form, { ...orcamento });
      await apiRequest('updateOrcamento', updated);
      closeDrawer();
      await loadAllData();
      showToast('Orcamento atualizado.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar orcamento', 'error');
    }
  });
}

async function confirmVendaFromOrcamento(orcamento) {
  try {
    const metrics = getOrcamentoMetrics(orcamento);
    const items = metrics.items;
    if (!items || items.length === 0) {
      showToast('Orcamento sem itens — nao e possivel converter.', 'error');
      return;
    }
    const defaultPayment = {
      descricao: `Orcamento #${orcamento.numero}`,
      valor: metrics.valor,
      forma: 'Pix',
      status: 'Pendente',
      vencimento: nowIso()
    };
    const vendaPayload = {
      dataHora: nowIso(),
      cliente: orcamento.cliente,
      obs: orcamento.obsPublic || '',
      itensJson: JSON.stringify(items),
      pagamentosJson: JSON.stringify([defaultPayment])
    };
    await apiRequest('createVenda', vendaPayload);
    await apiRequest('updateOrcamento', { ...orcamento, status: 'Confirmado' });
    await loadAllData();
    showToast(`Venda criada e orcamento #${orcamento.numero} confirmado.`);
  } catch (error) {
    showToast(error.message || 'Erro ao confirmar venda', 'error');
  }
}

function openVendaEditor(venda) {
  const metrics = getVendaMetrics(venda);
  openDrawer(buildVendaComposerHtml(venda, `Editar venda #${venda.numero}`));
  const form = qs('#venda-edit-form');
  fillBuilderWithRows(form, '.items-builder[data-builder-kind="venda"]', metrics.items.map((item) => buildItemRowHtml(item)));
  fillBuilderWithRows(form, '.payments-builder[data-builder-kind="venda"]', metrics.payments.map((payment) => buildPaymentRowHtml(payment)));
  renderItemsSummary(qs('.items-builder', form));
  renderPaymentsSummary(qs('.payments-builder', form));
  applyRoleAccess();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const updated = buildVendaPayloadFromScope(form, { ...venda });
      await apiRequest('updateVenda', updated);
      closeDrawer();
      await loadAllData();
      showToast('Venda atualizada.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar venda', 'error');
    }
  });
}

async function handleOrcamentoSubmit(event) {
  event.preventDefault();
  try {
    const payload = buildOrcamentoPayloadFromScope(event.target, { dataHora: nowIso() });
    const orcamento = await apiRequest('createOrcamento', payload);
    state.data.orcamentos.unshift(orcamento);
    event.target.reset();
    resetItemsBuilder(qs('.items-builder[data-builder-kind="orcamento"]', dom.orcamentoForm));
    const extraCostInput = qs('input[name="custoOutros"]', dom.orcamentoForm);
    if (extraCostInput) extraCostInput.value = '0';
    renderItemsSummary(qs('.items-builder[data-builder-kind="orcamento"]', dom.orcamentoForm));
    renderAll();
    showToast('Orcamento salvo.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar orcamento', 'error');
  }
}

async function handleVendaSubmit(event) {
  event.preventDefault();
  try {
    const payload = buildVendaPayloadFromScope(event.target, { dataHora: nowIso() });
    await apiRequest('createVenda', payload);
    event.target.reset();
    resetItemsBuilder(qs('.items-builder[data-builder-kind="venda"]', dom.vendaForm));
    resetPaymentsBuilder(qs('.payments-builder[data-builder-kind="venda"]', dom.vendaForm));
    renderItemsSummary(qs('.items-builder[data-builder-kind="venda"]', dom.vendaForm));
    renderPaymentsSummary(qs('.payments-builder[data-builder-kind="venda"]', dom.vendaForm));
    await loadAllData();
    showToast('Venda registrada.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar venda', 'error');
  }
}

function buildProductPayload(form) {
  const formData = new FormData(form);
  const imageUrls = formData.getAll('imageUrls[]').filter((u) => u && String(u).trim() !== '');
  const weightRaw = formData.get('weightGrams');
  const shippingRaw = formData.get('shipping');
  return {
    id: formData.get('id') || '',
    sku: formData.get('sku') || '',
    name: formData.get('name') || '',
    categoryName: formData.get('categoryName') || '',
    supplierName: formData.get('supplierName') || '',
    status: formData.get('status') || 'draft',
    productType: 'physical',
    price: parseNumber(formData.get('price')),
    cost: formData.get('cost') === '' ? '' : parseNumber(formData.get('cost')),
    shipping: shippingRaw === '' || shippingRaw === null ? '' : parseNumber(shippingRaw),
    stockQty: Number(formData.get('stockQty') || 0),
    lowStockThreshold: Number(formData.get('lowStockThreshold') || 2),
    weightGrams: weightRaw !== '' && weightRaw !== null ? Number(weightRaw) : '',
    dimensions: formData.get('dimensions') || '',
    notes: formData.get('notes') || '',
    imageUrl: imageUrls[0] || '',
    imageUrls: imageUrls,
    shortDescription: formData.get('shortDescription') || '',
    description: formData.get('description') || '',
    trackStock: formData.get('trackStock') === 'on',
    allowBackorder: formData.get('allowBackorder') === 'on'
  };
}

function clearProductPhotos(form) {
  const slots = form ? form.querySelectorAll('.photo-slot') : [];
  slots.forEach((slot) => {
    const preview  = slot.querySelector('.photo-slot-preview');
    const urlInput = slot.querySelector('.photo-url-input');
    const fileInput= slot.querySelector('.photo-file-input');
    if (preview)  { preview.style.display = 'none'; const img = preview.querySelector('img'); if (img) img.src = ''; }
    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
  });
}

function fillProductPhotos(form, imageUrls) {
  clearProductPhotos(form);
  const slots = form ? form.querySelectorAll('.photo-slot') : [];
  (imageUrls || []).forEach((url, i) => {
    if (!url || i >= slots.length) return;
    const slot     = slots[i];
    const preview  = slot.querySelector('.photo-slot-preview');
    const img      = slot.querySelector('.photo-slot-preview img');
    const urlInput = slot.querySelector('.photo-url-input');
    if (urlInput) urlInput.value = url;
    if (img)     img.src = url;
    if (preview) preview.style.display = 'block';
  });
}

function resetProductForm() {
  if (!dom.productForm) return;
  dom.productForm.reset();
  dom.productForm.querySelector('[name="id"]').value = '';
  dom.productForm.querySelector('[name="status"]').value = 'draft';
  dom.productForm.querySelector('[name="stockQty"]').value = '0';
  dom.productForm.querySelector('[name="lowStockThreshold"]').value = '2';
  const track = dom.productForm.querySelector('[name="trackStock"]');
  if (track) track.checked = true;
  const allowBack = dom.productForm.querySelector('[name="allowBackorder"]');
  if (allowBack) allowBack.checked = false;
  ['weightGrams','dimensions','notes','shipping','cost','shortDescription','description','sku'].forEach((n) => {
    const el = dom.productForm.querySelector(`[name="${n}"]`);
    if (el) el.value = '';
  });
  clearProductPhotos(dom.productForm);
}

function fillProductForm(product) {
  if (!dom.productForm) return;
  const set = (name, val) => {
    const el = dom.productForm.querySelector(`[name="${name}"]`);
    if (el) el.value = val ?? '';
  };
  set('id',               product.id || '');
  set('sku',              product.sku || '');
  set('name',             product.name || '');
  set('categoryName',     product.categoryName || '');
  set('supplierName',     product.supplierName || '');
  set('status',           product.status || 'draft');
  set('price',            product.price || 0);
  set('cost',             product.cost || '');
  set('shipping',         product.shipping || '');
  set('stockQty',         product.stockQty ?? 0);
  set('lowStockThreshold',product.lowStockThreshold ?? 2);
  set('weightGrams',      product.weightGrams ?? '');
  set('dimensions',       product.dimensions || '');
  set('shortDescription', product.shortDescription || '');
  set('description',      product.description || '');
  set('notes',            product.notes || '');
  const trackEl = dom.productForm.querySelector('[name="trackStock"]');
  if (trackEl) trackEl.checked = Boolean(product.trackStock);
  const backEl = dom.productForm.querySelector('[name="allowBackorder"]');
  if (backEl) backEl.checked = Boolean(product.allowBackorder);
  fillProductPhotos(dom.productForm, product.imageUrls || (product.imageUrl ? [product.imageUrl] : []));
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const payload = buildProductPayload(event.target);
  if (!payload.name || !payload.price) {
    showToast('Informe nome e preco do produto.', 'error');
    return;
  }
  try {
    await apiRequest(payload.id ? 'updateProduct' : 'createProduct', payload);
    resetProductForm();
    await loadAllData();
    showToast('Produto salvo.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar produto', 'error');
  }
}

function handleProductActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;

  if (btn.dataset.action === 'edit-product') {
    const product = (state.data.produtos || []).find((item) => Number(item.id) === Number(btn.dataset.id));
    if (product) fillProductForm(product);
    return;
  }

  if (btn.dataset.action === 'delete-product') {
    const id   = Number(btn.dataset.id);
    const name = btn.dataset.name || 'este produto';
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    apiRequest('deleteProduct', { id })
      .then(() => { showToast('Produto excluído.'); return loadAllData(); })
      .catch((err) => showToast(err.message || 'Erro ao excluir.', 'error'));
  }
}

async function handleInventorySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    productId: Number(formData.get('productId') || 0),
    movementType: formData.get('movementType') || 'adjustment',
    quantity: Number(formData.get('quantity') || 0),
    reason: formData.get('reason') || ''
  };
  if (!payload.productId || !payload.quantity || !payload.reason) {
    showToast('Preencha produto, quantidade e motivo.', 'error');
    return;
  }
  try {
    await apiRequest('adjustInventory', payload);
    event.target.reset();
    await loadAllData();
    showToast('Estoque atualizado.');
  } catch (error) {
    showToast(error.message || 'Erro ao ajustar estoque', 'error');
  }
}

async function handleOrderActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;
  const id = Number(btn.dataset.id || 0);
  if (!id) return;
  const payload = { id };
  if (btn.dataset.action === 'mark-processing') {
    payload.status = 'processing';
  } else if (btn.dataset.action === 'mark-fulfilled') {
    payload.status = 'fulfilled';
    payload.fulfillmentStatus = 'fulfilled';
  } else {
    return;
  }
  try {
    await apiRequest('updateOrder', payload);
    await loadAllData();
    showToast('Pedido atualizado.');
  } catch (error) {
    showToast(error.message || 'Erro ao atualizar pedido', 'error');
  }
}

function defaultCategoryByTipo(tipo) {
  return String(tipo || '').toLowerCase() === 'saida' ? 'Compra de material' : 'Aporte';
}

function defaultStatusByTipo(tipo) {
  return String(tipo || '').toLowerCase() === 'saida' ? 'A pagar' : 'Pago';
}

function getFinanceStatus(item) {
  const status = String(item?.status || '').trim();
  if (status) return status;
  return defaultStatusByTipo(item?.tipo);
}

function isPaidStatus(status) {
  return String(status || '').trim().toLowerCase() === 'pago';
}

function isFinancePaid(item) {
  return isPaidStatus(getFinanceStatus(item));
}

function toDateTimeLocalValue(value) {
  const date = parseDateSafe(value) || new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function handleFinanceiroSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    dataHora: formData.get('dataHora')
      ? new Date(String(formData.get('dataHora'))).toISOString()
      : nowIso(),
    tipo: formData.get('tipo') || 'Entrada',
    categoria: formData.get('categoria') || defaultCategoryByTipo(formData.get('tipo')),
    descricao: formData.get('descricao') || '',
    valor: parseNumber(formData.get('valor')),
    status: formData.get('status') || defaultStatusByTipo(formData.get('tipo')),
    vencimento: toIsoFromDateInput(String(formData.get('vencimento') || '')),
    origem: 'Manual',
    referencia: '',
    obs: formData.get('obs') || '',
    attachmentUrl: formData.get('attachmentUrl') || ''
  };

  if (!payload.valor) {
    showToast('Informe um valor maior que zero.', 'error');
    return;
  }
  if (String(payload.status).toLowerCase() === 'a pagar' && !payload.vencimento) {
    showToast('Informe o vencimento para lancamentos a pagar.', 'error');
    return;
  }

  try {
    await apiRequest('createFinanceiro', payload);
    event.target.reset();
    if (dom.financeiroTipo) dom.financeiroTipo.value = 'Entrada';
    if (dom.financeiroCategoria) dom.financeiroCategoria.value = 'Aporte';
    if (dom.financeiroStatus) dom.financeiroStatus.value = 'Pago';
    if (dom.financeiroForm) {
      const dateInput = dom.financeiroForm.querySelector('input[name="dataHora"]');
      if (dateInput) dateInput.value = toDateTimeLocalValue(nowIso());
      const attachPrev = dom.financeiroForm.querySelector('#financeiro-attachment-preview');
      const attachUrl  = dom.financeiroForm.querySelector('#financeiro-attachment-url');
      const attachIn   = dom.financeiroForm.querySelector('#financeiro-attachment-input');
      if (attachPrev) attachPrev.style.display = 'none';
      if (attachUrl)  attachUrl.value = '';
      if (attachIn)   attachIn.value = '';
    }
    await loadAllData();
    showToast('Lancamento financeiro salvo.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar lancamento', 'error');
  }
}

function handleFinanceiroActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action !== 'edit-financeiro') return;
  const item = state.data.financeiro.find((row) => row.rowIndex === id);
  if (!item) return;
  if (String(item.origem || '').toLowerCase() === 'venda') {
    showToast('Lancamentos de venda sao sincronizados automaticamente.', 'error');
    return;
  }
  openFinanceiroEditor(item);
}

function openFinanceiroEditor(item) {
  openDrawer(`
    <h3>Editar lancamento #${item.numero || '-'}</h3>
    <form id="financeiro-edit-form" class="form-grid">
      <label>Data e hora<input type="datetime-local" name="dataHora" value="${toDateTimeLocalValue(item.dataHora)}" /></label>
      <label>Tipo
        <select name="tipo" required>
          <option value="Entrada">Entrada</option>
          <option value="Saida">Saida</option>
        </select>
      </label>
      <label>Categoria<input type="text" name="categoria" value="${item.categoria || ''}" required /></label>
      <label>Valor<input type="number" step="0.01" min="0" name="valor" value="${parseNumber(item.valor)}" required /></label>
      <label>Status
        <select name="status" required>
          <option value="Pago">Pago</option>
          <option value="A pagar">A pagar</option>
        </select>
      </label>
      <label>Vencimento<input type="date" name="vencimento" value="${formatDateISO(item.vencimento)}" /></label>
      <label class="full">Descricao<input type="text" name="descricao" value="${item.descricao || ''}" required /></label>
      <label class="full">Observacoes<input type="text" name="obs" value="${item.obs || ''}" /></label>
      <button class="btn btn-primary" type="submit">Atualizar lancamento</button>
    </form>
  `);

  const form = qs('#financeiro-edit-form');
  form.querySelector('select[name="tipo"]').value = item.tipo || 'Entrada';
  form.querySelector('select[name="status"]').value = item.status || defaultStatusByTipo(item.tipo || 'Entrada');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const updated = {
      ...item,
      dataHora: formData.get('dataHora')
        ? new Date(String(formData.get('dataHora'))).toISOString()
        : item.dataHora,
      tipo: formData.get('tipo') || 'Entrada',
      categoria: formData.get('categoria') || '',
      descricao: formData.get('descricao') || '',
      valor: parseNumber(formData.get('valor')),
      status: formData.get('status') || defaultStatusByTipo(formData.get('tipo')),
      vencimento: toIsoFromDateInput(String(formData.get('vencimento') || '')),
      origem: item.origem || 'Manual',
      referencia: item.referencia || '',
      obs: formData.get('obs') || ''
    };
    if (String(updated.status).toLowerCase() === 'a pagar' && !updated.vencimento) {
      showToast('Informe o vencimento para lancamentos a pagar.', 'error');
      return;
    }
    try {
      await apiRequest('updateFinanceiro', updated);
      closeDrawer();
      await loadAllData();
      showToast('Lancamento atualizado.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar lancamento', 'error');
    }
  });
}

async function handleLembreteSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    dataHora: nowIso(),
    titulo: formData.get('titulo') || '',
    descricao: formData.get('descricao') || '',
    vencimento: toIsoFromDateInput(String(formData.get('vencimento') || '')),
    status: formData.get('status') || 'Pendente',
    origem: 'Manual',
    obs: formData.get('obs') || ''
  };
  if (!payload.titulo || !payload.descricao || !payload.vencimento) {
    showToast('Preencha titulo, descricao e vencimento.', 'error');
    return;
  }
  try {
    await apiRequest('createLembrete', payload);
    event.target.reset();
    await loadAllData();
    showToast('Lembrete cadastrado.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar lembrete', 'error');
  }
}

async function handleLembretesActions(event) {
  const btn = event.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  if (!id || !action) return;

  if (action === 'mark-paid') {
    const financeiro = state.data.financeiro.find((item) => item.rowIndex === id);
    if (!financeiro) return;
    const updated = { ...financeiro, status: 'Pago', dataHora: nowIso() };
    try {
      await apiRequest('updateFinanceiro', updated);
      await loadAllData();
      showToast('Compromisso marcado como pago.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar compromisso', 'error');
    }
    return;
  }

  const lembrete = state.data.lembretes.find((item) => item.rowIndex === id);
  if (!lembrete) return;

  if (action === 'edit-lembrete') {
    openLembreteEditor(lembrete);
    return;
  }

  if (action === 'toggle-lembrete') {
    const status = String(lembrete.status || 'Pendente').toLowerCase() === 'concluido' ? 'Pendente' : 'Concluido';
    try {
      await apiRequest('updateLembrete', { ...lembrete, status });
      await loadAllData();
      showToast(`Lembrete ${status === 'Concluido' ? 'concluido' : 'reaberto'}.`);
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar lembrete', 'error');
    }
  }
}

function openLembreteEditor(lembrete) {
  openDrawer(`
    <h3>Editar lembrete #${lembrete.numero || '-'}</h3>
    <form id="lembrete-edit-form" class="form-grid">
      <label>Titulo<input type="text" name="titulo" value="${lembrete.titulo || ''}" required /></label>
      <label>Status
        <select name="status" required>
          <option value="Pendente">Pendente</option>
          <option value="Concluido">Concluido</option>
        </select>
      </label>
      <label>Vencimento<input type="date" name="vencimento" value="${formatDateISO(lembrete.vencimento)}" required /></label>
      <label class="full">Descricao<input type="text" name="descricao" value="${lembrete.descricao || ''}" required /></label>
      <label class="full">Observacoes<input type="text" name="obs" value="${lembrete.obs || ''}" /></label>
      <button class="btn btn-primary" type="submit">Atualizar lembrete</button>
    </form>
  `);

  const form = qs('#lembrete-edit-form');
  form.querySelector('select[name="status"]').value = lembrete.status || 'Pendente';
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const updated = {
      ...lembrete,
      titulo: formData.get('titulo') || '',
      descricao: formData.get('descricao') || '',
      vencimento: toIsoFromDateInput(String(formData.get('vencimento') || '')),
      status: formData.get('status') || 'Pendente',
      origem: lembrete.origem || 'Manual',
      obs: formData.get('obs') || ''
    };
    try {
      await apiRequest('updateLembrete', updated);
      closeDrawer();
      await loadAllData();
      showToast('Lembrete atualizado.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar lembrete', 'error');
    }
  });
}

function handleExport(type) {
  const rows = state.data[type];
  if (!rows || !rows.length) {
    showToast('Sem dados para exportar.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(';')]
    .concat(rows.map((row) => headers.map((h) => row[h]).join(';')))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function setupEvents() {
  dom.loginForm.addEventListener('submit', handleLogin);
  dom.profileSelectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dom.profileSelectButtons.forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      if (dom.loginUser) dom.loginUser.value = button.dataset.loginUser || '';
      if (dom.loginPassword) dom.loginPassword.focus();
    });
  });
  if (dom.togglePassword && dom.loginPassword) {
    dom.togglePassword.addEventListener('click', () => {
      const isVisible = dom.loginPassword.type === 'text';
      dom.loginPassword.type = isVisible ? 'password' : 'text';
      const icon = dom.togglePassword.querySelector('i');
      if (icon) {
        icon.className = isVisible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      }
      const actionLabel = isVisible ? 'Mostrar senha' : 'Ocultar senha';
      dom.togglePassword.setAttribute('aria-label', actionLabel);
      dom.togglePassword.setAttribute('title', actionLabel);
    });
  }
  dom.logoutBtn.addEventListener('click', handleLogout);
  dom.navLinks.forEach((link) => link.addEventListener('click', () => switchView(link.dataset.view)));
  dom.menuBtn.addEventListener('click', () => {
    if (window.innerWidth <= 980) {
      dom.sidebar.classList.toggle('open');
      return;
    }
    const collapsed = dom.appShell.classList.contains('collapsed');
    setSidebarCollapsed(!collapsed);
  });
  if (dom.themeToggle) {
    dom.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }
  window.addEventListener('resize', updateMenuIcon);
  dom.refreshBtn.addEventListener('click', loadAllData);
  dom.drawer.addEventListener('click', (event) => {
    if (event.target === dom.drawer) closeDrawer();
  });
  dom.modal.addEventListener('click', (event) => {
    if (event.target === dom.modal) closeModal();
  });
  dom.drawerClose.addEventListener('click', closeDrawer);

  applyInputMasks(dom.clienteForm);

  dom.clienteForm.addEventListener('submit', handleClienteSubmit);
  dom.orcamentoForm.addEventListener('submit', handleOrcamentoSubmit);
  dom.vendaForm.addEventListener('submit', handleVendaSubmit);
  if (dom.productForm) dom.productForm.addEventListener('submit', handleProductSubmit);
  if (dom.productFormReset) dom.productFormReset.addEventListener('click', resetProductForm);
  if (dom.inventoryForm) dom.inventoryForm.addEventListener('submit', handleInventorySubmit);
  dom.financeiroForm.addEventListener('submit', handleFinanceiroSubmit);
  dom.lembreteForm.addEventListener('submit', handleLembreteSubmit);
  if (dom.fornecedorForm) dom.fornecedorForm.addEventListener('submit', handleFornecedorSubmit);
  if (dom.fornecedorFormReset) dom.fornecedorFormReset.addEventListener('click', () => {
    dom.fornecedorForm.reset();
    dom.fornecedorForm.querySelector('[name="id"]').value = '';
    const lp = document.getElementById('fornecedor-logo-preview');
    if (lp) lp.style.display = 'none';
  });

  dom.clienteSearch.addEventListener('input', renderClientes);
  dom.orcamentoSearch.addEventListener('input', renderOrcamentos);
  dom.vendaSearch.addEventListener('input', renderVendas);
  if (dom.productSearch) dom.productSearch.addEventListener('input', renderProducts);
  if (dom.orderSearch) dom.orderSearch.addEventListener('input', renderOrders);
  dom.financeiroSearch.addEventListener('input', renderFinanceiro);
  dom.lembreteSearch.addEventListener('input', () => renderLembretes(false));
  if (dom.fornecedorSearch) dom.fornecedorSearch.addEventListener('input', renderFornecedores);

  dom.clienteTable.addEventListener('click', handleClienteActions);
  dom.orcamentoTable.addEventListener('click', handleOrcamentoActions);
  dom.vendaTable.addEventListener('click', handleVendaActions);
  if (dom.productTable) dom.productTable.addEventListener('click', handleProductActions);
  if (dom.orderTable) dom.orderTable.addEventListener('click', handleOrderActions);
  dom.financeiroTable.addEventListener('click', handleFinanceiroActions);
  dom.lembreteTable.addEventListener('click', handleLembretesActions);
  if (dom.fornecedorTable) dom.fornecedorTable.addEventListener('click', handleFornecedorActions);

  if (dom.dashboardPeriod) {
    dom.dashboardPeriod.addEventListener('click', (event) => {
      const btn = event.target.closest('.period-btn');
      if (!btn) return;
      const period = btn.dataset.period;
      if (!period || period === state.dashboardPeriod) return;
      state.dashboardPeriod = period;
      qsa('.period-btn', dom.dashboardPeriod).forEach((node) => {
        node.classList.toggle('active', node.dataset.period === period);
      });
      renderDashboard();
    });
  }

  if (dom.financeiroTipo) {
    dom.financeiroTipo.addEventListener('change', () => {
      if (dom.financeiroCategoria) {
        const current = String(dom.financeiroCategoria.value || '').trim().toLowerCase();
        if (!current || current === 'aporte' || current === 'compra de material') {
          dom.financeiroCategoria.value = defaultCategoryByTipo(dom.financeiroTipo.value);
        }
      }
      if (dom.financeiroStatus) {
        dom.financeiroStatus.value = defaultStatusByTipo(dom.financeiroTipo.value);
      }
    });
  }

  dom.saveScriptUrl.addEventListener('click', () => {
    if (dom.scriptUrl) dom.scriptUrl.value = API_ENDPOINT;
    showToast('Dados recarregados do backend PHP.');
    loadAllData();
  });

  dom.testPdf.addEventListener('click', () => {
    const html = buildOrcamentoDoc({ numero: 'TESTE', cliente: 'GAO Joias', produtoServico: 'Teste', dataHora: nowIso(), validade: '-', obsPublic: 'Documento teste', totalCustos: 0, lucro: 0 });
    generatePdf(html, 'teste.pdf');
  });
  dom.testPrint.addEventListener('click', () => {
    const html = buildVendaDoc({ numero: 'TESTE', cliente: 'GAO Joias', produtoServico: 'Teste', dataHora: nowIso(), valor: 0, pgto: 'Pix', obs: '' });
    printHtml(html);
  });
  if (dom.thermalBaud) {
    dom.thermalBaud.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEYS.thermalBaudRate, String(getThermalBaudRate()));
      if (thermalPrinter.connected) {
        updateThermalStatus('Velocidade alterada. Desconecte e conecte novamente para aplicar.', false);
      }
    });
  }
  if (dom.thermalMode) {
    dom.thermalMode.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEYS.thermalMode, getThermalMode());
      showToast(getThermalMode() === 'visual'
        ? 'Bematech configurada para formato visual.'
        : 'Bematech configurada para formato texto ESC/POS.');
    });
  }
  if (dom.thermalConnect) {
    dom.thermalConnect.addEventListener('click', () => connectThermalPrinter(true));
  }
  if (dom.thermalDisconnect) {
    dom.thermalDisconnect.addEventListener('click', disconnectThermalPrinter);
  }
  dom.testThermal.addEventListener('click', () => {
    printThermalVenda({
      numero: 'TESTE',
      cliente: 'GAO Joias',
      dataHora: nowIso(),
      valor: 1,
      valorRecebido: 1,
      pgto: 'Pix',
      statusRecebimento: 'Pago',
      itensJson: JSON.stringify([{ titulo: 'Teste Bematech MP-4200 HS', quantidade: 1, valorUnitario: 1 }]),
      pagamentosJson: JSON.stringify([{ descricao: 'Teste', valor: 1, forma: 'Pix', status: 'Pago' }]),
      obs: 'Teste de comunicacao Web Serial.'
    });
  });
  dom.exportClientes.addEventListener('click', () => handleExport('clientes'));
  dom.exportVendas.addEventListener('click', () => handleExport('vendas'));
  dom.exportFinanceiro.addEventListener('click', () => handleExport('financeiro'));

  if (dom.financeiroForm) {
    const dateInput = dom.financeiroForm.querySelector('input[name="dataHora"]');
    if (dateInput) dateInput.value = toDateTimeLocalValue(nowIso());
  }
  if (dom.financeiroCategoria) {
    dom.financeiroCategoria.value = defaultCategoryByTipo(dom.financeiroTipo?.value || 'Entrada');
  }
  if (dom.financeiroStatus) {
    dom.financeiroStatus.value = defaultStatusByTipo(dom.financeiroTipo?.value || 'Entrada');
  }
}

async function init() {
  mountStructuredForms();
  restoreThermalSettings();
  setupEvents();
  loadSidebarState();
  loadTheme();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => null);
    });
  }
  if (dom.scriptUrl) dom.scriptUrl.value = API_ENDPOINT;
  try {
    const session = await apiRequest('me');
    state.csrfToken = session.csrfToken || state.csrfToken;
    if (session.authenticated && session.user) {
      applyAuthenticatedUser(session.user);
      // Refresh cached session on every successful auth check
      try { localStorage.setItem('gao_offline_session', JSON.stringify({ user: session.user, ts: Date.now() })); } catch (_) {}
      dom.loginScreen.classList.add('hidden');
      dom.appShell.classList.remove('hidden');
      await loadAllData();
    }
  } catch (error) {
    // No network — try cached session (valid 8h)
    try {
      const saved = JSON.parse(localStorage.getItem('gao_offline_session') || 'null');
      if (saved?.user && (Date.now() - saved.ts) < 8 * 60 * 60 * 1000) {
        applyAuthenticatedUser(saved.user);
        dom.loginScreen.classList.add('hidden');
        dom.appShell.classList.remove('hidden');
        await loadAllData();
        return;
      }
    } catch (_) {}
    console.warn(error);
  }
}

/* ── Import Modal ────────────────────────────────────────── */
(function setupImportModal() {
  const importState = { type: null, label: null, file: null };
  const dz = dom.importDropzone;

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function showIdle() {
    dom.importDzIdle.style.display     = 'flex';
    dom.importDzSelected.style.display = 'none';
    dz.classList.remove('has-file');
  }

  function showSelected(file) {
    dom.importDzIdle.style.display     = 'none';
    dom.importDzSelected.style.display = 'flex';
    dz.classList.add('has-file');
    dom.importDzFilename.textContent = file.name;
    dom.importDzFilesize.textContent = fmtBytes(file.size);
    document.getElementById('import-dz-file-icon-i').className =
      /\.xlsx?$/i.test(file.name) ? 'fa-solid fa-file-excel' : 'fa-solid fa-file-csv';
  }

  function openImportModal(type, label) {
    importState.type  = type;
    importState.label = label;
    dom.importModalTitle.textContent    = `Importar ${label}`;
    dom.importModalSubtitle.textContent = 'CSV ou planilha Excel (.xlsx / .xls)';
    dom.importModalTemplate.href        = `api/export.php?type=${type}&template=1`;
    resetModal();
    dom.importModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeImportModal() {
    dom.importModal.hidden = true;
    document.body.style.overflow = '';
    resetModal();
  }

  function resetModal() {
    importState.file = null;
    dom.importFileHidden.value = '';
    showIdle();
    dom.importModalResult.removeAttribute('style');
    dom.importModalResult.hidden    = true;
    dom.importModalResult.className = 'import-modal-result';
    dom.importModalResult.innerHTML = '';
    dom.importModalSubmit.disabled  = true;
    dom.importModalSubmitLabel.textContent = 'Importar';
  }

  function setFile(file) {
    importState.file = file;
    showSelected(file);
    dom.importModalSubmit.disabled = false;
    dom.importModalResult.hidden   = true;
  }

  // Open via any [data-import-type] button (event delegation)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-import-type]');
    if (btn) openImportModal(btn.dataset.importType, btn.dataset.importLabel || btn.dataset.importType);
  });

  dom.importModalClose.addEventListener('click',  closeImportModal);
  dom.importModalCancel.addEventListener('click', closeImportModal);
  dom.importModal.addEventListener('click', e => { if (e.target === dom.importModal) closeImportModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !dom.importModal.hidden) closeImportModal(); });

  // Drop zone – click opens file picker only when no file is selected
  dz.addEventListener('click', e => {
    if (dz.classList.contains('has-file')) return;
    dom.importFileHidden.click();
  });
  dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', e => { if (!dz.contains(e.relatedTarget)) dz.classList.remove('drag-over'); });
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  });
  dom.importFileHidden.addEventListener('change', () => {
    if (dom.importFileHidden.files[0]) setFile(dom.importFileHidden.files[0]);
  });
  dom.importDzClear.addEventListener('click', e => {
    e.stopPropagation();
    resetModal();
  });

  // Submit
  dom.importModalSubmit.addEventListener('click', async () => {
    const { type, file } = importState;
    if (!type || !file) return;

    dom.importModalSubmit.disabled = true;
    dom.importModalSubmitLabel.textContent = 'Importando...';
    dom.importModalSubmit.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
    dom.importModalResult.hidden = true;

    try {
      let uploadFile = file;

      if (/\.xlsx?$/i.test(file.name) && typeof XLSX !== 'undefined') {
        const wb  = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
        uploadFile = new Blob([csv], { type: 'text/csv' });
      }

      const fd = new FormData();
      fd.append('type', type);
      fd.append('file', uploadFile, file.name.replace(/\.xlsx?$/i, '.csv'));
      fd.append('csrf_token', state.csrfToken);

      const res  = await fetch('api/import.php', {
        method: 'POST', body: fd, credentials: 'same-origin',
        headers: { 'X-CSRF-Token': state.csrfToken }
      });
      const data = await res.json();
      const resultEl = dom.importModalResult;
      resultEl.hidden = false;

      if (!res.ok || !data.ok) {
        resultEl.className = 'import-modal-result err';
        resultEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><div class="im-body">${escapeHtml(data.error || 'Erro desconhecido.')}</div>`;
      } else {
        resultEl.className = 'import-modal-result ok';
        const parts = [];
        if (data.inserted) parts.push(`<strong>${data.inserted}</strong> criado(s)`);
        if (data.updated)  parts.push(`<strong>${data.updated}</strong> atualizado(s)`);
        const rowErrors = data.errors && data.errors.length
          ? `<div class="import-row-errors">${data.errors.map(escapeHtml).join('<br>')}</div>` : '';
        resultEl.innerHTML = `<i class="fa-solid fa-circle-check"></i><div class="im-body">${parts.join(' e ') || 'Concluido.'} ${rowErrors}</div>`;
        await loadAllData();
        // auto-close: 2s on clean import, 5s when there are row errors to review
        setTimeout(() => closeImportModal(), data.errors && data.errors.length ? 5000 : 2000);
      }
    } catch (err) {
      const resultEl = dom.importModalResult;
      resultEl.hidden = false;
      resultEl.className = 'import-modal-result err';
      resultEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><div class="im-body">Erro de rede: ${escapeHtml(err.message)}</div>`;
    } finally {
      dom.importModalSubmit.disabled = false;
      dom.importModalSubmit.querySelector('i').className = 'fa-solid fa-file-import';
      dom.importModalSubmitLabel.textContent = 'Importar';
    }
  });
}());

/* ── Offline Store (IndexedDB) ───────────────────────────── */
const offlineStore = (function () {
  const DB = 'gao_offline_v1';
  let _db = null;

  function open() {
    return new Promise((res, rej) => {
      if (_db) return res(_db);
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('cache'))
          db.createObjectStore('cache', { keyPath: 'k' });
        if (!db.objectStoreNames.contains('queue'))
          db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      };
      req.onsuccess = e => { _db = e.target.result; res(_db); };
      req.onerror   = () => rej(req.error);
    });
  }

  async function cacheSave(data) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction('cache', 'readwrite');
      tx.objectStore('cache').put({ k: 'listAll', v: data, ts: Date.now() });
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }

  async function cacheLoad() {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction('cache', 'readonly');
      const req = tx.objectStore('cache').get('listAll');
      req.onsuccess = () => res(req.result?.v ?? null);
      req.onerror   = () => rej(req.error);
    });
  }

  async function queuePush(item) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx  = db.transaction('queue', 'readwrite');
      const req = tx.objectStore('queue').add({ ...item, ts: Date.now() });
      req.onsuccess = () => res(req.result);
      tx.onerror = () => rej(tx.error);
    });
  }

  async function queueAll() {
    const db = await open();
    return new Promise((res, rej) => {
      const tx  = db.transaction('queue', 'readonly');
      const req = tx.objectStore('queue').getAll();
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }

  async function queueRemove(id) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction('queue', 'readwrite');
      tx.objectStore('queue').delete(id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }

  async function queueCount() {
    const db = await open();
    return new Promise((res, rej) => {
      const tx  = db.transaction('queue', 'readonly');
      const req = tx.objectStore('queue').count();
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }

  // Inject pending queue items back into state.data when loading offline cache
  async function applyPendingToState(data) {
    const pending = await queueAll().catch(() => []);
    for (const op of pending) {
      if (op.snapshot && op.action === 'createVenda')
        data.vendas = [op.snapshot, ...data.vendas.filter(v => v.id !== op.snapshot.id)];
      else if (op.snapshot && op.action === 'createCliente')
        data.clientes = [op.snapshot, ...data.clientes.filter(c => c.id !== op.snapshot.id)];
      else if (op.snapshot && op.action === 'createOrcamento')
        data.orcamentos = [op.snapshot, ...data.orcamentos.filter(o => o.id !== op.snapshot.id)];
    }
    return pending.length;
  }

  return { cacheSave, cacheLoad, queuePush, queueAll, queueRemove, queueCount, applyPendingToState };
}());

/* ── Offline Queue Helpers ───────────────────────────────── */
let _pendingOfflineNum = 0;

function _nextOfflineNum() {
  return String(++_pendingOfflineNum).padStart(3, '0');
}

async function offlineEnqueue(action, payload) {
  const offlineId  = 'OFF_' + Date.now();
  const offlineNum = 'PEND-' + _nextOfflineNum();
  const now        = new Date().toISOString();
  let snapshot     = null;

  if (action === 'createVenda') {
    snapshot = {
      rowIndex: offlineId, id: offlineId,
      numero: offlineNum,
      dataHora: payload.dataHora || now,
      cliente: payload.cliente || payload.clienteNome || '',
      produtoServico: payload.produtoServico || '',
      descricao: payload.descricao || '',
      valor: payload.valor || 0,
      valorRecebido: payload.valorRecebido || 0,
      saldoRestante: payload.saldoRestante ?? payload.valor ?? 0,
      statusRecebimento: 'Pendente',
      totalCustos: payload.totalCustos || 0,
      lucro: payload.lucro || 0,
      margem: payload.margem || 0,
      pgto: payload.pgto || 'Pix',
      itensJson: JSON.stringify(payload.itens || []),
      pagamentosJson: JSON.stringify(payload.pagamentos || []),
      obs: payload.obs || '',
      _offline: true,
    };
    state.data.vendas = [snapshot, ...(state.data.vendas || [])];
  } else if (action === 'createCliente') {
    snapshot = {
      rowIndex: offlineId, id: offlineId,
      nome: payload.nome || payload.name || '',
      email: payload.email || '',
      telefone: payload.telefone || payload.phone || '',
      empresa: payload.empresa || payload.company || '',
      documento: payload.documento || '',
      obs: payload.obs || '',
      _offline: true,
    };
    state.data.clientes = [snapshot, ...(state.data.clientes || [])];
  } else if (action === 'createOrcamento') {
    snapshot = {
      rowIndex: offlineId, id: offlineId,
      numero: offlineNum,
      dataHora: now,
      cliente: payload.cliente || payload.clienteNome || '',
      produtoServico: payload.produtoServico || '',
      status: 'Em negociacao',
      valorTotal: payload.valorTotal || 0,
      _offline: true,
    };
    state.data.orcamentos = [snapshot, ...(state.data.orcamentos || [])];
  }

  await offlineStore.queuePush({ action, payload, snapshot, offlineId }).catch(() => {});
  offlineUI.refresh();
  renderAll();
  showToast('Sem conexão — salvo localmente, será sincronizado quando a internet voltar.', 'error');
  return snapshot || { id: offlineId, _offline: true };
}

/* ── Offline Banner UI ───────────────────────────────────── */
const offlineUI = (function () {
  const banner      = document.getElementById('offline-banner');
  const badge       = document.getElementById('offline-pending-badge');
  const syncBtn     = document.getElementById('offline-sync-btn');

  function show(online) {
    if (!banner) return;
    banner.classList.toggle('hidden', online);
  }

  async function refresh() {
    if (!banner) return;
    const online = navigator.onLine;
    show(!online);
    if (!online || !syncBtn) return;
    // Show sync button if there are pending items (even when back online)
    const count = await offlineStore.queueCount().catch(() => 0);
    if (badge)   { badge.textContent = count + (count === 1 ? ' pendente' : ' pendente(s)'); badge.classList.toggle('hidden', count === 0); }
    if (syncBtn) { syncBtn.classList.toggle('hidden', count === 0); }
    if (count > 0) banner.classList.remove('hidden');
  }

  async function sync() {
    if (!syncBtn) return;
    const pending = await offlineStore.queueAll().catch(() => []);
    if (!pending.length) { refresh(); return; }

    syncBtn.classList.add('syncing');
    syncBtn.disabled = true;

    // Refresh auth/CSRF before sending queued operations
    try {
      const session = await apiRequest('me');
      if (session?.csrfToken) state.csrfToken = session.csrfToken;
    } catch (_) {
      syncBtn.classList.remove('syncing');
      syncBtn.disabled = false;
      showToast('Sem conexão para sincronizar.', 'error');
      return;
    }

    let ok = 0; let fail = 0;
    for (const op of pending) {
      try {
        await apiRequest(op.action, op.payload);
        await offlineStore.queueRemove(op.id);
        ok++;
      } catch (_) { fail++; }
    }

    syncBtn.classList.remove('syncing');
    syncBtn.disabled = false;
    if (ok)   showToast(`${ok} operação(ões) sincronizada(s).`);
    if (fail) showToast(`${fail} operação(ões) não puderam ser enviadas.`, 'error');
    await loadAllData();
    refresh();
  }

  if (syncBtn) syncBtn.addEventListener('click', sync);

  window.addEventListener('online',  () => { refresh(); if (state.user) sync(); });
  window.addEventListener('offline', () => refresh());

  // Initial state
  refresh();

  return { refresh, sync };
}());

/* ── Inactivity Auto-Logout (30 min) ─────────────────────── */
(function setupInactivityTimer() {
  const TIMEOUT_MS = 30 * 60 * 1000;
  const WARNING_MS = 28 * 60 * 1000;
  let idleTimer, warnTimer;

  function isLoggedIn() {
    return dom.loginScreen && dom.loginScreen.classList.contains('hidden');
  }

  function forceLogout() {
    if (!isLoggedIn()) return;
    try { apiRequest('logout').catch(() => {}); } catch (_) {}
    state.user = null;
    state.perfil = null;
    state.csrfToken = '';
    dom.appShell.classList.add('hidden');
    dom.loginScreen.classList.remove('hidden');
    showToast('Sessão encerrada por inatividade.', 'error');
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(warnTimer);
    warnTimer = setTimeout(() => {
      if (isLoggedIn()) showToast('Sessão expirando em 2 minutos por inatividade.', 'error');
    }, WARNING_MS);
    idleTimer = setTimeout(forceLogout, TIMEOUT_MS);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach((evt) => {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
}());

init();
