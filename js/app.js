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
  marketing: { posts: [], campaigns: [], metrics: [], loaded: false },
  mktCalMonth: new Date().getMonth(),
  mktCalYear: new Date().getFullYear(),
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
  productGrid: document.getElementById('product-grid'),
  productViewToggle: document.getElementById('product-view-toggle'),
  bulkStockBtn: document.getElementById('bulk-stock-btn'),
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
  financeiro: 'Fluxo de caixa, DRE e lançamentos manuais',
  lembretes: 'Compromissos a pagar e alertas de vencimento',
  logs: 'Auditoria de acessos do sistema',
  config: 'Backend PHP, loja online e exportacoes',
  fornecedores: 'Cadastro de fornecedores e distribuidores',
  marketing: 'Calendario editorial, planejamento e metricas'
};

const ITEM_TYPES = ['Produto', 'Serviço'];
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
    tipo: ITEM_TYPES.includes(item.tipo) ? item.tipo : item.tipo === 'Servico' ? 'Serviço' : 'Produto',
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
      <label>Título
        <input type="text" class="item-title" value="${escapeHtml(normalized.titulo)}" placeholder="Ex: Aliança ouro 18k" ${listAttr} autocomplete="off" />
      </label>
      <label>Descrição
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
      <label>Descrição
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
    titleInput.placeholder = 'Ex: Serviço personalizado';
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
          <th>Descrição</th>
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
          <th>Descrição</th>
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
    <h3>${orcamento.numero ? `Editar Orçamento #${orcamento.numero}` : 'Converter em venda'}</h3>
    <form id="orcamento-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${escapeHtml(orcamento.cliente || '')}" readonly /></label>
      <label>Validade<input type="date" name="validade" value="${escapeHtml(orcamento.validade || '')}" /></label>
      <label>Status
        <select name="status">
          <option value="Em negociacao">Em negociação</option>
          <option value="Enviado">Enviado</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Perdido">Perdido</option>
          <option value="Confirmado">Confirmado</option>
        </select>
      </label>
      <label>Observação pública<input type="text" name="obsPublic" value="${escapeHtml(orcamento.obsPublic || '')}" /></label>
      <label>Observação interna<input type="text" name="obsPrivate" value="${escapeHtml(orcamento.obsPrivate || '')}" /></label>
      <label data-admin>Custos adicionais<input type="number" step="0.01" min="0" name="custoOutros" value="${roundCurrencyValue(orcamento.custoOutros)}" /></label>
      ${buildItemsBuilderBlockHtml('orcamento', 'Itens do orçamento', 'Edite os itens, quantidades e valores do documento.')}
      <button class="btn btn-primary" type="submit">Atualizar</button>
    </form>
  `;
}

function buildVendaComposerHtml(venda = {}, heading = 'Editar venda') {
  return `
    <h3>${heading}</h3>
    <form id="venda-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${escapeHtml(venda.cliente || '')}" readonly /></label>
      <label class="full">Observações<input type="text" name="obs" value="${escapeHtml(venda.obs || '')}" /></label>
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
    produtoServico: summarizeItemLabel(items, base.produtoServico || 'Itens do orçamento'),
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
              <h5>Itens do orçamento</h5>
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
      <th>Número</th>
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
      <th>Número</th>
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
  if (viewId === 'marketing' && !state.marketing.loaded) {
    loadMarketing();
  }
  if (viewId === 'config') {
    loadPaymentSettings();
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
          <td data-label="Número">${orcamento.numero || '-'}</td>
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
          <td data-label="Número">${venda.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(venda.dataHora)}</td>
          <td data-label="Cliente">${venda.cliente || '-'}</td>
          <td data-label="Itens">${itemLabel}</td>
          <td data-label="Valor">${formatCurrency(metrics.valor)}</td>
          <td data-label="Recebido">${formatCurrency(metrics.recebido)}</td>
          <td data-label="Saldo">${formatCurrency(metrics.saldoRestante)}</td>
          <td data-label="Status"><span class="badge ${statusClass}">${metrics.statusRecebimento}</span></td>
          <td data-label="Acoes">
            <div class="actions">
              <button class="btn btn-ghost action-btn" data-action="nota" data-id="${venda.rowIndex}" title="Ver nota"><i class="fa-solid fa-eye"></i></button>
              <button class="btn btn-ghost action-btn" data-action="edit-venda" data-id="${venda.rowIndex}" title="Editar pagamento"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-ghost action-btn" data-action="print" data-id="${venda.rowIndex}" title="Imprimir"><i class="fa-solid fa-print"></i></button>
              ${metrics.items.some(i => (i.tipo || '').toLowerCase().includes('servi')) ? `<button class="btn btn-ghost action-btn os-btn" data-action="os" data-id="${venda.rowIndex}" title="Ordem de Serviço para o ourives"><i class="fa-solid fa-hammer"></i></button>` : ''}
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
          <td data-label="Número">${item.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(item.dataHora)}</td>
          <td data-label="Tipo"><span class="badge ${tipoClass}">${item.tipo || '-'}</span></td>
          <td data-label="Categoria">${item.categoria || '-'}</td>
          <td data-label="Descrição">${item.descricao || '-'}</td>
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
  if (dom.inventoryProduct) {
    const options = products.map((product) => `
      <option value="${product.id}">${escapeHtml(product.sku)} - ${escapeHtml(product.name)} (${product.availableQty} disp.)</option>
    `);
    dom.inventoryProduct.innerHTML = '<option value="">Selecione</option>' + options.join('');
  }
}

let productViewMode = 'table';

function getFilteredProducts() {
  const search = dom.productSearch?.value?.toLowerCase() || '';
  return (state.data.produtos || []).filter((product) => {
    if (!search) return true;
    return (
      String(product.sku || '').toLowerCase().includes(search) ||
      String(product.supplierRef || '').toLowerCase().includes(search) ||
      String(product.name || '').toLowerCase().includes(search) ||
      productCategoryLabel(product).toLowerCase().includes(search) ||
      String(product.status || '').toLowerCase().includes(search)
    );
  });
}

function productImageList(product) {
  if (Array.isArray(product.imageUrls) && product.imageUrls.length) return product.imageUrls;
  return product.imageUrl ? [product.imageUrl] : [];
}

function productThumb(product) {
  return productImageList(product)[0] || '';
}

// All categories of a product, main one first ("categoryName" alone is the main one)
function productCategoryLabel(product) {
  const names = Array.isArray(product.categoryNames) && product.categoryNames.length ? product.categoryNames : [product.categoryName];
  return names.filter(Boolean).join(', ');
}

// Multi-select category field: pick existing ones or type to create; the first is the main category
let categoryPicker = null;

function createCategoryPicker(root) {
  if (!root) return null;
  const field = qs('.cat-picker-field', root);
  const input = qs('.cat-picker-input', root);
  const menu = qs('.cat-picker-menu', root);
  let selected = [];
  let options = [];
  let activeIndex = -1;

  const clean = (name) => String(name || '').trim().replace(/\s+/g, ' ');
  const keyOf = (name) => normalizeSearchText(clean(name));
  const has = (name) => selected.some((item) => keyOf(item) === keyOf(name));
  const known = () => {
    const seen = new Set();
    return [...(state.data.categorias || []).map((category) => clean(category.name)), ...selected]
      .filter((name) => name && !seen.has(keyOf(name)) && seen.add(keyOf(name)));
  };

  function renderChips() {
    qsa('.cat-chip', field).forEach((chip) => chip.remove());
    selected.forEach((name, index) => {
      const chip = document.createElement('span');
      chip.className = `cat-chip${index === 0 ? ' is-main' : ''}`;
      chip.dataset.index = String(index);
      chip.title = index === 0 ? 'Categoria principal (exibida na loja)' : 'Clique para tornar principal';
      chip.innerHTML = `${index === 0 ? '<i class="fa-solid fa-star"></i>' : ''}<span>${escapeHtml(name)}</span>`
        + `<button type="button" class="cat-chip-remove" aria-label="Remover ${escapeHtml(name)}"><i class="fa-solid fa-xmark"></i></button>`;
      field.insertBefore(chip, input);
    });
    input.placeholder = selected.length ? 'Adicionar outra…' : 'Selecione ou digite para criar';
    root.classList.toggle('has-several', selected.length > 1);
  }

  function renderMenu() {
    const query = clean(input.value);
    const term = keyOf(query);
    const names = known().filter((name) => !term || keyOf(name).includes(term)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    options = names.map((name) => ({ name, create: false }));
    if (query && !known().some((name) => keyOf(name) === term)) options.push({ name: query, create: true });
    if (activeIndex >= options.length) activeIndex = options.length - 1;
    menu.innerHTML = options.length
      ? options.map((option, index) => {
        const active = index === activeIndex ? ' is-active' : '';
        if (option.create) {
          return `<div class="cat-option cat-option--create${active}" role="option" data-index="${index}"><i class="fa-solid fa-plus"></i><span>Criar categoria “${escapeHtml(option.name)}”</span></div>`;
        }
        const on = has(option.name);
        return `<div class="cat-option${on ? ' is-selected' : ''}${active}" role="option" aria-selected="${on}" data-index="${index}"><span class="cat-option-check"><i class="fa-solid fa-check"></i></span><span>${escapeHtml(option.name)}</span></div>`;
      }).join('')
      : '<div class="cat-empty">Nenhuma categoria cadastrada. Digite para criar.</div>';
  }

  function open() {
    menu.hidden = false;
    root.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
    renderMenu();
  }

  function close() {
    menu.hidden = true;
    root.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function add(name) {
    const value = clean(name);
    if (value && !has(value)) selected.push(value);
  }

  function choose(index) {
    const option = options[index];
    if (!option) return;
    if (!option.create && has(option.name)) selected = selected.filter((item) => keyOf(item) !== keyOf(option.name));
    else add(option.name);
    input.value = '';
    activeIndex = -1;
    renderChips();
    renderMenu();
  }

  // Text typed but not confirmed still counts (Enter, comma or saving the form)
  function commitTyped() {
    const query = clean(input.value);
    if (!query) return;
    add(known().find((name) => keyOf(name) === keyOf(query)) || query);
    input.value = '';
    renderChips();
  }

  field.addEventListener('mousedown', (event) => {
    if (event.target.closest('.cat-chip')) return;
    if (event.target !== input) {
      event.preventDefault();
      input.focus();
    }
    open();
  });

  field.addEventListener('click', (event) => {
    const chip = event.target.closest('.cat-chip');
    if (!chip) return;
    const index = Number(chip.dataset.index);
    if (event.target.closest('.cat-chip-remove')) selected.splice(index, 1);
    else if (index > 0) selected.unshift(...selected.splice(index, 1));
    renderChips();
    if (!menu.hidden) renderMenu();
  });

  input.addEventListener('focus', open);
  input.addEventListener('input', () => {
    activeIndex = clean(input.value) ? 0 : -1;
    open();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (menu.hidden) open();
      if (!options.length) return;
      activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      renderMenu();
      qs('.cat-option.is-active', menu)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0) choose(activeIndex);
      else {
        commitTyped();
        renderMenu();
      }
    } else if ((event.key === ',' || event.key === ';') && clean(input.value)) {
      event.preventDefault();
      commitTyped();
      renderMenu();
    } else if (event.key === 'Backspace' && !input.value && selected.length) {
      selected.pop();
      renderChips();
      renderMenu();
    } else if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      event.stopPropagation(); // closes only the list, not the product form
      close();
    } else if (event.key === 'Tab') {
      close();
    }
  });

  menu.addEventListener('mousedown', (event) => {
    event.preventDefault(); // keeps the focus in the input
    const option = event.target.closest('.cat-option');
    if (option) choose(Number(option.dataset.index));
  });

  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !root.contains(event.target)) close();
  });
  input.addEventListener('blur', () => setTimeout(() => {
    if (!root.contains(document.activeElement)) close();
  }, 0));

  return {
    setValues(names) {
      selected = [];
      (names || []).forEach(add);
      input.value = '';
      renderChips();
      close();
    },
    values() {
      commitTyped();
      return selected.slice();
    }
  };
}

function renderProducts() {
  hideProductQuickView();
  const rows = getFilteredProducts();
  const tableEl = dom.productTable?.closest('table');

  if (productViewMode === 'table') {
    if (tableEl) tableEl.style.display = '';
    if (dom.productGrid) dom.productGrid.style.display = 'none';
    if (dom.productTable) {
      dom.productTable.innerHTML = rows.map((product) => {
        const stockClass = product.trackStock && product.availableQty <= product.lowStockThreshold ? 'danger' : 'success';
        const thumb = productThumb(product);
        return `
          <tr>
            <td data-label="SKU">
              ${escapeHtml(product.sku || '-')}
              ${product.supplierRef ? `<small class="product-sku-ref" title="Referência do fornecedor">Ref. ${escapeHtml(product.supplierRef)}</small>` : ''}
            </td>
            <td data-label="Produto" class="qv-anchor" data-product-id="${product.id}" tabindex="0" aria-haspopup="dialog">
              <div class="product-row-name">
                ${thumb ? `<img class="product-row-thumb" src="${escapeHtml(thumb)}" alt="" />` : ''}
                <span>${escapeHtml(product.name || '-')}</span>
              </div>
            </td>
            <td data-label="Categoria">${escapeHtml(productCategoryLabel(product) || '-')}</td>
            <td data-label="Preço">${formatCurrency(product.price || 0)}</td>
            <td data-label="Estoque">
              <span class="badge ${stockClass}">${product.trackStock ? `${product.availableQty} disp. / ${product.stockQty} total` : 'Sem controle'}</span>
            </td>
            <td data-label="Status"><span class="badge ${productStatusBadge(product.status)}">${productStatusLabel(product.status)}</span></td>
            <td data-label="Ações">
              <div class="actions">
                <button class="btn btn-ghost action-btn" data-action="edit-product" data-id="${product.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-ghost action-btn danger" data-action="delete-product" data-id="${product.id}" data-name="${escapeHtml(product.name || '')}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
    return;
  }

  if (tableEl) tableEl.style.display = 'none';
  if (!dom.productGrid) return;
  dom.productGrid.style.display = '';
  dom.productGrid.className = 'product-grid' + (productViewMode === 'thumb' ? ' thumb-view' : '');

  dom.productGrid.innerHTML = rows.map((product) => {
    const stockClass = product.trackStock && product.availableQty <= product.lowStockThreshold ? 'danger' : 'success';
    const thumb = productThumb(product);
    return `
      <div class="product-card qv-anchor" data-product-id="${product.id}" tabindex="0" aria-haspopup="dialog">
        <div class="product-card-thumb">
          ${thumb ? `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(product.name || '')}" />` : '<i class="fa-solid fa-gem no-img"></i>'}
        </div>
        <div class="product-card-body">
          <div class="product-card-name" title="${escapeHtml(product.name || '')}">${escapeHtml(product.name || '-')}</div>
          <div class="product-card-sku">${escapeHtml(product.sku || '-')} · ${escapeHtml(productCategoryLabel(product) || '-')}</div>
          <div class="product-card-meta">
            <span class="product-card-price">${formatCurrency(product.price || 0)}</span>
            <span class="badge ${stockClass} product-card-stock">${product.trackStock ? `${product.availableQty}/${product.stockQty}` : '∞'}</span>
          </div>
        </div>
        <div class="product-card-actions">
          <button class="icon-btn" data-action="edit-product" data-id="${product.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn danger" data-action="delete-product" data-id="${product.id}" data-name="${escapeHtml(product.name || '')}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

function normalizeSearchText(value) {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function bulkStockRowHtml(row) {
  const product = row.product;
  const thumb = productThumb(product);
  const meta = [
    product.sku ? `SKU ${product.sku}` : '',
    product.supplierRef ? `Ref. ${product.supplierRef}` : '',
    productCategoryLabel(product)
  ].filter(Boolean).map(escapeHtml).join(' · ');
  const reserved = Number(product.reservedQty || 0);
  const statusText = { ok: 'em estoque', low: 'estoque baixo', out: 'esgotada' }[row.status];
  const name = escapeHtml(product.name || '-');
  return `
    <div class="bs-row bs-row--${row.status}" data-id="${row.id}">
      <label class="bs-check" title="Selecionar"><input type="checkbox" class="bs-row-check" aria-label="Selecionar ${name}" /></label>
      <div class="bs-thumb">${thumb ? `<img src="${escapeHtml(thumb)}" alt="" loading="lazy" />` : '<i class="fa-solid fa-gem"></i>'}</div>
      <div class="bs-name">
        <strong title="${name}">${name}</strong>
        ${meta ? `<span>${meta}</span>` : ''}
      </div>
      <div class="bs-current">
        <span><b>${row.current}</b> atual</span>
        <small><i class="bs-dot"></i>${statusText}${reserved ? ` · ${reserved} ${reserved === 1 ? 'reservada' : 'reservadas'}` : ''}</small>
      </div>
      <div class="bs-stepper">
        <button type="button" class="bs-step" data-step="-1" aria-label="Diminuir"><i class="fa-solid fa-minus"></i></button>
        <input type="number" class="bs-qty" min="0" step="1" inputmode="numeric" value="${row.current}" aria-label="Nova quantidade de ${name}" />
        <button type="button" class="bs-step" data-step="1" aria-label="Aumentar"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="bs-change">
        <span class="bs-diff"></span>
        <button type="button" class="bs-undo" title="Desfazer" aria-label="Desfazer alteração" hidden><i class="fa-solid fa-rotate-left"></i></button>
      </div>
    </div>`;
}

// Checkboxes pick the targets of "apply to selected"; saving sends every row whose quantity changed.
function openBulkStockDrawer() {
  const allProducts = state.data.produtos || [];
  const products = allProducts.filter((product) => product.trackStock);
  if (!products.length) {
    showToast('Nenhuma peça com controle de estoque.', 'error');
    return;
  }
  const untracked = allProducts.length - products.length;
  const rows = products.map((product) => {
    const current = Number(product.stockQty || 0);
    const available = Number(product.availableQty ?? current);
    return {
      id: Number(product.id),
      current,
      value: current,
      selected: false,
      status: available <= 0 ? 'out' : available <= Number(product.lowStockThreshold || 0) ? 'low' : 'ok',
      search: normalizeSearchText([product.name, product.sku, product.supplierRef, productCategoryLabel(product)].join(' ')),
      product
    };
  });
  const countStatus = (status) => rows.filter((row) => row.status === status).length;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  openDrawer(`
    <div class="bs" id="bulk-stock">
      <header class="bs-head">
        <span class="bs-head-icon"><i class="fa-solid fa-boxes-stacked"></i></span>
        <div>
          <h3>Estoque em lote</h3>
          <p>Selecione as peças e aplique a mesma quantidade a todas, ou ajuste cada uma na lista.</p>
        </div>
      </header>

      <div class="bs-toolbar">
        <label class="bs-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" class="bs-search-input" placeholder="Buscar por nome, SKU, referência ou categoria" autocomplete="off" aria-label="Buscar peças" />
        </label>
        <div class="bs-chips" role="group" aria-label="Filtrar peças">
          <button type="button" class="bs-chip active" data-filter="all">Todas <b>${rows.length}</b></button>
          <button type="button" class="bs-chip bs-chip--low" data-filter="low"><i class="bs-dot"></i>Estoque baixo <b>${countStatus('low')}</b></button>
          <button type="button" class="bs-chip bs-chip--out" data-filter="out"><i class="bs-dot"></i>Esgotadas <b>${countStatus('out')}</b></button>
          <button type="button" class="bs-chip" data-filter="changed"><i class="fa-solid fa-pen"></i>Alteradas <b data-count="changed">0</b></button>
        </div>
      </div>

      <div class="bs-bulkbar">
        <label class="bs-check bs-check-all">
          <input type="checkbox" class="bs-all" />
          <span>Selecionar todas</span>
        </label>
        <span class="bs-selected" data-count="selected">Nenhuma selecionada</span>
        <div class="bs-apply">
          <div class="bs-mode" role="radiogroup" aria-label="Como aplicar a quantidade">
            <button type="button" class="active" data-mode="set" role="radio" aria-checked="true">Definir</button>
            <button type="button" data-mode="add" role="radio" aria-checked="false">Somar</button>
            <button type="button" data-mode="sub" role="radio" aria-checked="false">Subtrair</button>
          </div>
          <input type="number" class="bs-apply-qty" min="0" step="1" inputmode="numeric" placeholder="Qtd." aria-label="Quantidade a aplicar nas selecionadas" />
          <button type="button" class="btn btn-primary bs-apply-btn" disabled><i class="fa-solid fa-wand-magic-sparkles"></i><span>Aplicar</span></button>
        </div>
      </div>

      <div class="bs-list">
        ${rows.map(bulkStockRowHtml).join('')}
        <div class="bs-empty" hidden><i class="fa-solid fa-magnifying-glass"></i><span>Nenhuma peça encontrada com esse filtro.</span></div>
        ${untracked ? `<p class="bs-note"><i class="fa-solid fa-circle-info"></i>${plural(untracked, 'peça sem controle de estoque não aparece', 'peças sem controle de estoque não aparecem')} aqui.</p>` : ''}
      </div>

      <footer class="bs-foot">
        <div class="bs-summary" data-summary></div>
        <label class="bs-reason">
          <i class="fa-solid fa-comment-dots"></i>
          <input type="text" class="bs-reason-input" list="bs-reasons" maxlength="180" value="Atualização de estoque em lote" placeholder="Motivo da alteração" aria-label="Motivo da alteração" />
        </label>
        <datalist id="bs-reasons">
          <option value="Contagem de inventário"></option>
          <option value="Entrada de mercadoria do fornecedor"></option>
          <option value="Correção de estoque"></option>
        </datalist>
        <div class="bs-foot-actions">
          <button type="button" class="btn btn-ghost bs-cancel">Cancelar</button>
          <button type="button" class="btn btn-primary bs-save" disabled><i class="fa-solid fa-check"></i><span>Salvar</span></button>
        </div>
      </footer>
    </div>
  `, 'bulk-stock');

  const root = qs('#bulk-stock');
  const list = qs('.bs-list', root);
  const searchInput = qs('.bs-search-input', root);
  const allBox = qs('.bs-all', root);
  const applyQty = qs('.bs-apply-qty', root);
  const applyBtn = qs('.bs-apply-btn', root);
  const saveBtn = qs('.bs-save', root);
  const reasonInput = qs('.bs-reason-input', root);
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const elById = new Map(qsa('.bs-row', list).map((el) => [Number(el.dataset.id), el]));
  let filter = 'all';
  let mode = 'set';

  const rowOf = (node) => rowById.get(Number(node.closest('.bs-row')?.dataset.id));
  const changedRows = () => rows.filter((row) => row.value !== row.current);
  const visibleRows = () => rows.filter((row) => !elById.get(row.id).hidden);

  function paintRow(row, keepInput = false) {
    const el = elById.get(row.id);
    const diff = row.value - row.current;
    el.classList.toggle('is-selected', row.selected);
    el.classList.toggle('is-changed', diff !== 0);
    el.querySelector('.bs-row-check').checked = row.selected;
    if (!keepInput) el.querySelector('.bs-qty').value = row.value;
    const badge = el.querySelector('.bs-diff');
    badge.textContent = diff ? `${diff > 0 ? '+' : '−'}${Math.abs(diff)}` : '';
    badge.className = `bs-diff${diff > 0 ? ' up' : diff < 0 ? ' down' : ''}`;
    el.querySelector('.bs-undo').hidden = diff === 0;
  }

  function setValue(row, value) {
    row.value = Math.max(0, Math.floor(value) || 0);
    paintRow(row);
  }

  function refreshSelection() {
    const visible = visibleRows();
    const selectedVisible = visible.filter((row) => row.selected).length;
    allBox.checked = visible.length > 0 && selectedVisible === visible.length;
    allBox.indeterminate = selectedVisible > 0 && selectedVisible < visible.length;
    const selected = rows.filter((row) => row.selected).length;
    qs('[data-count="selected"]', root).textContent = selected ? plural(selected, 'selecionada', 'selecionadas') : 'Nenhuma selecionada';
    root.classList.toggle('has-selection', selected > 0);
    applyBtn.disabled = !selected || applyQty.value === '';
    applyBtn.querySelector('span').textContent = selected ? `Aplicar a ${selected}` : 'Aplicar';
  }

  function refreshSummary() {
    const changed = changedRows();
    const delta = changed.reduce((sum, row) => sum + row.value - row.current, 0);
    qs('[data-count="changed"]', root).textContent = changed.length;
    qs('[data-summary]', root).innerHTML = changed.length
      ? `<strong>${plural(changed.length, 'alteração', 'alterações')}</strong>
         <span class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '+' : delta < 0 ? '−' : ''}${Math.abs(delta)} un. no total</span>
         <button type="button" class="bs-reset-all">Desfazer tudo</button>`
      : '<span class="bs-summary-empty">Nenhuma alteração ainda</span>';
    saveBtn.disabled = !changed.length;
    saveBtn.querySelector('span').textContent = changed.length ? `Salvar ${plural(changed.length, 'alteração', 'alterações')}` : 'Salvar';
  }

  function applyFilters() {
    const term = normalizeSearchText(searchInput.value.trim());
    let shown = 0;
    rows.forEach((row) => {
      const inFilter = filter === 'all' || (filter === 'changed' ? row.value !== row.current : row.status === filter);
      const visible = inFilter && (!term || row.search.includes(term));
      elById.get(row.id).hidden = !visible;
      if (visible) shown += 1;
    });
    qs('.bs-empty', list).hidden = shown > 0;
    refreshSelection();
  }

  function applyToSelected() {
    if (applyQty.value === '') return;
    const qty = Math.max(0, Math.floor(Number(applyQty.value)) || 0);
    const targets = rows.filter((row) => row.selected);
    if (!targets.length) return;
    targets.forEach((row) => setValue(row, mode === 'set' ? qty : mode === 'add' ? row.value + qty : row.value - qty));
    refreshSummary();
    if (filter === 'changed') applyFilters();
    const pieces = plural(targets.length, 'peça', 'peças');
    const done = mode === 'set' ? `Quantidade ${qty} definida para ${pieces}` : `${mode === 'add' ? '+' : '−'}${qty} un. em ${pieces}`;
    showToast(`${done}. Revise e salve.`);
  }

  list.addEventListener('error', (event) => markImageMissing(event.target), true);

  list.addEventListener('click', (event) => {
    const step = event.target.closest('.bs-step');
    if (step) {
      const row = rowOf(step);
      setValue(row, row.value + Number(step.dataset.step));
      refreshSummary();
      return;
    }
    const undo = event.target.closest('.bs-undo');
    if (undo) {
      setValue(rowOf(undo), rowOf(undo).current);
      refreshSummary();
      if (filter === 'changed') applyFilters();
      return;
    }
    if (event.target.closest('input, button, label')) return;
    const row = rowOf(event.target);
    if (!row) return;
    row.selected = !row.selected;
    paintRow(row);
    refreshSelection();
  });

  list.addEventListener('change', (event) => {
    if (event.target.classList.contains('bs-row-check')) {
      const row = rowOf(event.target);
      row.selected = event.target.checked;
      paintRow(row);
      refreshSelection();
    } else if (event.target.classList.contains('bs-qty')) {
      // Normalizes what was typed: blank restores the last valid value, decimals/negatives are clamped
      paintRow(rowOf(event.target));
      if (filter === 'changed') applyFilters();
    }
  });

  list.addEventListener('input', (event) => {
    if (!event.target.classList.contains('bs-qty') || event.target.value === '') return;
    const row = rowOf(event.target);
    row.value = Math.max(0, Math.floor(Number(event.target.value)) || 0);
    paintRow(row, true);
    refreshSummary();
  });

  // Enter / Shift+Enter walk the list like a spreadsheet, for fast inventory counts
  list.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || !event.target.classList.contains('bs-qty')) return;
    event.preventDefault();
    const inputs = qsa('.bs-row:not([hidden]) .bs-qty', list);
    const next = inputs[inputs.indexOf(event.target) + (event.shiftKey ? -1 : 1)];
    if (next) {
      next.focus();
      next.select();
    } else {
      event.target.blur();
    }
  });

  // A focused number input changes on mouse wheel: scrolling the list must never edit stock
  list.addEventListener('wheel', (event) => {
    if (event.target === document.activeElement && event.target.classList?.contains('bs-qty')) event.target.blur();
  }, { passive: true });

  searchInput.addEventListener('input', applyFilters);

  qs('.bs-chips', root).addEventListener('click', (event) => {
    const chip = event.target.closest('.bs-chip');
    if (!chip) return;
    filter = chip.dataset.filter;
    qsa('.bs-chip', root).forEach((node) => node.classList.toggle('active', node === chip));
    applyFilters();
  });

  allBox.addEventListener('change', () => {
    visibleRows().forEach((row) => {
      row.selected = allBox.checked;
      paintRow(row);
    });
    refreshSelection();
  });

  qs('.bs-mode', root).addEventListener('click', (event) => {
    const btn = event.target.closest('[data-mode]');
    if (!btn) return;
    mode = btn.dataset.mode;
    qsa('.bs-mode [data-mode]', root).forEach((node) => {
      node.classList.toggle('active', node === btn);
      node.setAttribute('aria-checked', String(node === btn));
    });
    applyQty.placeholder = { set: 'Qtd.', add: '+ Qtd.', sub: '− Qtd.' }[mode];
    applyQty.focus();
  });

  applyQty.addEventListener('input', refreshSelection);
  applyQty.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    applyToSelected();
  });
  applyBtn.addEventListener('click', applyToSelected);

  qs('[data-summary]', root).addEventListener('click', (event) => {
    if (!event.target.closest('.bs-reset-all')) return;
    changedRows().forEach((row) => setValue(row, row.current));
    refreshSummary();
    if (filter === 'changed') applyFilters();
  });

  qs('.bs-cancel', root).addEventListener('click', requestDrawerClose);

  saveBtn.addEventListener('click', async () => {
    const changed = changedRows();
    if (!changed.length) return;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Salvando...</span>';
    try {
      const result = await apiRequest('bulkAdjustInventory', {
        items: changed.map((row) => ({ productId: row.id, quantity: row.value })),
        reason: reasonInput.value.trim() || 'Atualização de estoque em lote',
        mode: 'set'
      });
      closeDrawer();
      await loadAllData();
      showToast(`Estoque atualizado em ${plural(Number(result?.updated ?? changed.length), 'peça', 'peças')}.`);
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar o estoque em lote', 'error');
      saveBtn.innerHTML = '<i class="fa-solid fa-check"></i><span></span>';
      refreshSummary();
    }
  });

  drawerCloseGuard = () => {
    const pending = changedRows().length;
    return !pending || confirm(`Descartar ${plural(pending, 'alteração', 'alterações')} de estoque?`);
  };

  refreshSummary();
  refreshSelection();
}

// Product quick view: hover shows a passive preview, click pins an interactive one.
const QV_OPEN_DELAY = 300;
const QV_SWITCH_DELAY = 70;
const QV_CLOSE_DELAY = 120;
const QV_MAX_WIDTH = 640;
const QV_MIN_SIDE_WIDTH = 520;
const qvHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const productQuickView = { el: null, backdrop: null, anchor: null, productId: null, pinned: false, openTimer: 0, closeTimer: 0, frame: 0 };

const INVENTORY_MOVEMENT_LABELS = {
  initial: 'Estoque inicial',
  purchase: 'Compra',
  adjustment: 'Ajuste',
  return: 'Devolução',
  reservation: 'Reserva',
  release: 'Liberação',
  sale: 'Venda'
};

// MySQL datetimes ("2026-08-04 04:25:25") are not parsed by every Safari version without the "T"
function qvDate(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
}

function qvNumber(value, digits = 1) {
  return Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: digits });
}

function canHoverPreview() {
  return qvHoverQuery.matches && window.innerWidth >= 760;
}

function getQuickViewAnchor(target) {
  return target instanceof Element ? target.closest('.qv-anchor') : null;
}

function markImageMissing(img) {
  if (!(img instanceof HTMLImageElement) || !img.isConnected) return;
  const placeholder = document.createElement('span');
  placeholder.className = 'img-missing';
  placeholder.title = 'Foto não encontrada no servidor — reenvie pelo editor da peça';
  placeholder.innerHTML = '<i class="fa-solid fa-image"></i><span>Foto ausente</span>';
  img.replaceWith(placeholder);
}

function buildProductQuickViewHtml(product) {
  const isAdmin = state.perfil === 'Administrador';
  const images = productImageList(product);
  const price = Number(product.price || 0);
  const compareAt = Number(product.compareAt || 0);
  const cost = product.cost === '' || product.cost === null || product.cost === undefined ? null : Number(product.cost);

  const photo = images.length
    ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name || '')}" />`
    : '<span class="img-missing"><i class="fa-solid fa-gem"></i><span>Sem foto cadastrada</span></span>';
  const thumbs = images.length > 1
    ? `<div class="qv-thumbs">${images.map((url, index) => `
        <button type="button" class="qv-thumb${index === 0 ? ' active' : ''}" data-src="${escapeHtml(url)}" aria-label="Foto ${index + 1}">
          <img src="${escapeHtml(url)}" alt="" loading="lazy" />
        </button>`).join('')}</div>`
    : '';

  let stock;
  if (!product.trackStock) {
    stock = '<div class="qv-stock"><i class="fa-solid fa-infinity"></i><span>Sem controle de estoque</span></div>';
  } else {
    const available = Number(product.availableQty || 0);
    const total = Number(product.stockQty || 0);
    const reserved = Number(product.reservedQty || 0);
    const level = available <= 0 ? 'out' : available <= Number(product.lowStockThreshold || 0) ? 'low' : 'ok';
    const flag = { out: product.allowBackorder ? 'Esgotado · aceita encomenda' : 'Esgotado', low: 'Estoque baixo', ok: '' }[level];
    stock = `
      <div class="qv-stock qv-stock--${level}">
        <i class="fa-solid fa-boxes-stacked"></i>
        <span><strong>${available}</strong> ${available === 1 ? 'disponível' : 'disponíveis'} · ${total} em estoque${reserved ? ` · ${reserved} ${reserved === 1 ? 'reservado' : 'reservados'}` : ''}</span>
        ${flag ? `<em>${flag}</em>` : ''}
      </div>`;
  }

  const facts = [];
  if (isAdmin && cost !== null) {
    facts.push(['Custo', formatCurrency(cost)]);
    if (price > 0) facts.push(['Margem', `${qvNumber(((price - cost) / price) * 100)}% · ${formatCurrency(price - cost)}`]);
  }
  if (product.supplierName) facts.push(['Fornecedor', escapeHtml(product.supplierName)]);
  if (product.supplierRef) facts.push(['Ref. do fornecedor', escapeHtml(product.supplierRef)]);
  if (product.shipping !== '' && product.shipping !== null && product.shipping !== undefined) facts.push(['Frete', formatCurrency(product.shipping)]);
  if (product.weightGrams) facts.push(['Peso', `${qvNumber(product.weightGrams, 2)} g`]);
  if (product.dimensions) facts.push(['Dimensões', escapeHtml(product.dimensions)]);
  if (product.trackStock) {
    facts.push(['Alerta de estoque', `${qvNumber(product.lowStockThreshold, 0)} un.`]);
    facts.push(['Venda sem estoque', product.allowBackorder ? 'Permitida' : 'Bloqueada']);
  }

  const shortDesc = String(product.shortDescription || '').trim();
  const longDesc = String(product.description || '').trim();
  const descriptions = [shortDesc !== product.name ? shortDesc : '', longDesc !== shortDesc ? longDesc : ''].filter(Boolean);

  const moves = (state.data.inventoryMovements || [])
    .filter((move) => Number(move.productId) === Number(product.id))
    .slice(0, 3);

  const created = qvDate(product.createdAt);
  const updated = qvDate(product.updatedAt);
  const storeLink = product.status === 'active' && product.slug
    ? `<a class="btn btn-ghost" href="loja/produto.php?slug=${encodeURIComponent(product.slug)}" target="_blank" rel="noopener"><i class="fa-solid fa-store"></i><span>Ver na loja</span></a>`
    : '';
  const stockAction = isAdmin && product.trackStock
    ? `<button type="button" class="btn btn-ghost" data-qv-action="stock" data-id="${product.id}"><i class="fa-solid fa-boxes-stacked"></i><span>Ajustar estoque</span></button>`
    : '';

  return `
    <div class="qv-media">
      <div class="qv-photo">${photo}</div>
      ${thumbs}
    </div>
    <div class="qv-info">
      <div class="qv-head">
        <div class="qv-title">
          <span class="qv-eyebrow">${escapeHtml([product.sku, productCategoryLabel(product)].filter(Boolean).join(' · ') || 'Sem SKU')}</span>
          <h4 id="product-qv-title">${escapeHtml(product.name || '-')}</h4>
        </div>
        <div class="qv-head-side">
          <span class="badge ${productStatusBadge(product.status)}">${escapeHtml(productStatusLabel(product.status))}</span>
          <button type="button" class="icon-btn icon-btn--sm qv-close" title="Fechar (Esc)" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      <div class="qv-price">
        <strong>${formatCurrency(price)}</strong>
        ${compareAt > price ? `<s>${formatCurrency(compareAt)}</s>` : ''}
      </div>
      ${stock}
      ${facts.length ? `<dl class="qv-facts">${facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>` : ''}
      ${descriptions.length ? `<div class="qv-section"><h5>Descrição</h5>${descriptions.map((text) => `<p>${escapeHtml(text)}</p>`).join('')}</div>` : ''}
      ${product.notes ? `<div class="qv-section qv-notes"><h5>Observações internas</h5><p>${escapeHtml(product.notes)}</p></div>` : ''}
      ${moves.length ? `<div class="qv-section"><h5>Últimas movimentações</h5><ul class="qv-moves">${moves.map((move) => {
        const qty = Number(move.quantity || 0);
        return `<li title="${escapeHtml(move.reason || '')}"><b class="${qty < 0 ? 'neg' : 'pos'}">${qty > 0 ? '+' : ''}${qty}</b><span>${escapeHtml(INVENTORY_MOVEMENT_LABELS[move.movementType] || move.movementType || '-')}</span><time>${qvDate(move.createdAt)}</time></li>`;
      }).join('')}</ul></div>` : ''}
      <div class="qv-foot">
        ${created ? `<span class="qv-dates">Cadastrado em ${created}${updated && updated !== created ? ` · atualizado em ${updated}` : ''}</span>` : ''}
        <div class="qv-actions">
          ${storeLink}
          ${stockAction}
          <button type="button" class="btn btn-primary" data-action="edit-product" data-id="${product.id}"><i class="fa-solid fa-pen"></i><span>Editar</span></button>
        </div>
        <span class="qv-hint"><i class="fa-solid fa-thumbtack"></i> Clique para fixar</span>
      </div>
    </div>
  `;
}

function getProductQuickView() {
  if (productQuickView.el) return productQuickView.el;
  const el = document.createElement('div');
  el.className = 'product-qv';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-labelledby', 'product-qv-title');
  el.setAttribute('aria-hidden', 'true');
  el.tabIndex = -1;
  el.addEventListener('click', handleQuickViewClick);
  el.addEventListener('mouseover', (event) => {
    const thumb = event.target.closest('.qv-thumb');
    if (thumb) setQuickViewPhoto(thumb);
  });
  el.addEventListener('mousemove', handleQuickViewZoom);
  el.addEventListener('error', (event) => markImageMissing(event.target), true);
  const backdrop = document.createElement('div');
  backdrop.className = 'product-qv-backdrop';
  document.body.append(backdrop, el);
  productQuickView.el = el;
  productQuickView.backdrop = backdrop;
  return el;
}

function positionProductQuickView() {
  const { el, anchor } = productQuickView;
  if (!el || !anchor || el.classList.contains('sheet')) return;
  if (!anchor.isConnected) {
    hideProductQuickView();
    return;
  }
  const margin = 12;
  const gap = 14;
  const rect = anchor.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const spaceRight = viewportWidth - rect.right - gap - margin;
  const spaceLeft = rect.left - gap - margin;

  let side = '';
  let width = Math.min(QV_MAX_WIDTH, viewportWidth - margin * 2);
  let left;
  if (Math.max(spaceRight, spaceLeft) >= QV_MIN_SIDE_WIDTH) {
    side = spaceRight >= QV_MAX_WIDTH || spaceRight >= spaceLeft ? 'right' : 'left';
    width = Math.min(QV_MAX_WIDTH, side === 'right' ? spaceRight : spaceLeft);
    left = side === 'right' ? rect.right + gap : rect.left - gap - width;
  }
  el.style.width = `${width}px`;
  const height = el.offsetHeight;

  let top;
  if (side) {
    top = Math.min(Math.max(margin, rect.top + rect.height / 2 - height / 2), viewportHeight - height - margin);
  } else {
    left = Math.min(Math.max(margin, rect.left + rect.width / 2 - width / 2), viewportWidth - width - margin);
    if (rect.bottom + gap + height <= viewportHeight - margin) {
      side = 'below';
      top = rect.bottom + gap;
    } else if (rect.top - gap - height >= margin) {
      side = 'above';
      top = rect.top - gap - height;
    } else {
      side = 'over';
      top = Math.max(margin, (viewportHeight - height) / 2);
    }
  }
  el.style.left = `${Math.round(left)}px`;
  el.style.top = `${Math.round(Math.max(margin, top))}px`;
  el.dataset.side = side;
}

function showProductQuickView(anchor, pinned) {
  const product = (state.data.produtos || []).find((item) => Number(item.id) === Number(anchor.dataset.productId));
  if (!product) return;
  const el = getProductQuickView();
  clearTimeout(productQuickView.openTimer);
  clearTimeout(productQuickView.closeTimer);

  if (productQuickView.anchor !== anchor) {
    productQuickView.anchor?.classList.remove('qv-active');
    anchor.classList.add('qv-active');
    productQuickView.anchor = anchor;
  }
  if (productQuickView.productId !== product.id || !el.classList.contains('open')) {
    el.innerHTML = buildProductQuickViewHtml(product);
    el.scrollTop = 0;
    productQuickView.productId = product.id;
  }

  productQuickView.pinned = pinned;
  const sheet = pinned && !canHoverPreview();
  el.classList.toggle('pinned', pinned);
  el.classList.toggle('sheet', sheet);
  el.setAttribute('aria-modal', String(sheet));
  el.setAttribute('aria-hidden', 'false');
  productQuickView.backdrop.classList.toggle('open', sheet);
  if (sheet) {
    el.style.left = '';
    el.style.top = '';
    el.style.width = '';
    el.dataset.side = 'sheet';
  } else {
    positionProductQuickView();
  }
  el.classList.add('open');
}

function hideProductQuickView() {
  clearTimeout(productQuickView.openTimer);
  clearTimeout(productQuickView.closeTimer);
  const { el, backdrop, anchor } = productQuickView;
  anchor?.classList.remove('qv-active');
  productQuickView.anchor = null;
  productQuickView.productId = null;
  productQuickView.pinned = false;
  if (!el) return;
  el.classList.remove('open', 'pinned');
  el.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('open');
}

function scheduleProductQuickView(anchor) {
  clearTimeout(productQuickView.closeTimer);
  clearTimeout(productQuickView.openTimer);
  const isOpen = Boolean(productQuickView.el?.classList.contains('open'));
  if (isOpen && productQuickView.anchor === anchor) return;
  productQuickView.openTimer = setTimeout(() => {
    if (anchor.isConnected) showProductQuickView(anchor, false);
  }, isOpen ? QV_SWITCH_DELAY : QV_OPEN_DELAY);
}

function scheduleProductQuickViewClose() {
  clearTimeout(productQuickView.openTimer);
  clearTimeout(productQuickView.closeTimer);
  productQuickView.closeTimer = setTimeout(hideProductQuickView, QV_CLOSE_DELAY);
}

function toggleProductQuickViewPin(anchor) {
  if (productQuickView.pinned && productQuickView.anchor === anchor) {
    hideProductQuickView();
    return;
  }
  showProductQuickView(anchor, true);
}

function handleQuickViewMouseOver(event) {
  if (productQuickView.pinned || !canHoverPreview()) return;
  const anchor = getQuickViewAnchor(event.target);
  if (anchor && !anchor.contains(event.relatedTarget)) scheduleProductQuickView(anchor);
}

function handleQuickViewMouseOut(event) {
  if (productQuickView.pinned) return;
  const anchor = getQuickViewAnchor(event.target);
  if (anchor && !anchor.contains(event.relatedTarget)) scheduleProductQuickViewClose();
}

function handleQuickViewAnchorKey(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const anchor = getQuickViewAnchor(event.target);
  if (!anchor || event.target !== anchor) return;
  event.preventDefault();
  toggleProductQuickViewPin(anchor);
  if (productQuickView.pinned) productQuickView.el.focus({ preventScroll: true });
}

function handleQuickViewOutsidePointer(event) {
  const { el, anchor, pinned } = productQuickView;
  if (!pinned || !el || el.contains(event.target) || anchor?.contains(event.target)) return;
  hideProductQuickView();
}

function handleQuickViewKeydown(event) {
  if (event.key !== 'Escape' || !productQuickView.el?.classList.contains('open')) return;
  const { anchor, pinned } = productQuickView;
  hideProductQuickView();
  if (pinned && anchor?.isConnected) anchor.focus({ preventScroll: true });
}

function handleQuickViewScroll(event) {
  const { el, pinned } = productQuickView;
  if (!el?.classList.contains('open') || el.contains(event.target)) return;
  if (!pinned) {
    hideProductQuickView();
    return;
  }
  if (productQuickView.frame) return;
  productQuickView.frame = requestAnimationFrame(() => {
    productQuickView.frame = 0;
    positionProductQuickView();
  });
}

function handleQuickViewResize() {
  const { el, anchor, pinned } = productQuickView;
  if (!el?.classList.contains('open')) return;
  if (pinned && anchor?.isConnected) showProductQuickView(anchor, true);
  else hideProductQuickView();
}

function handleQuickViewZoom(event) {
  const photo = event.target.closest('.qv-photo');
  const img = photo?.querySelector('img');
  if (!img) return;
  const rect = photo.getBoundingClientRect();
  img.style.transformOrigin = `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`;
}

function setQuickViewPhoto(thumb) {
  if (thumb.classList.contains('active')) return;
  const el = productQuickView.el;
  const photo = el.querySelector('.qv-photo');
  if (!photo) return;
  el.querySelectorAll('.qv-thumb.active').forEach((node) => node.classList.remove('active'));
  thumb.classList.add('active');
  const img = document.createElement('img');
  img.src = thumb.dataset.src;
  img.alt = el.querySelector('#product-qv-title')?.textContent || '';
  photo.replaceChildren(img);
}

function openQuickViewStockAdjust(productId) {
  hideProductQuickView();
  if (!window.smartModal || !dom.inventoryProduct) return;
  window.smartModal.open('inventory-form');
  dom.inventoryProduct.value = String(productId);
}

function handleQuickViewClick(event) {
  const thumb = event.target.closest('.qv-thumb');
  if (thumb) {
    setQuickViewPhoto(thumb);
    return;
  }
  if (event.target.closest('.qv-close')) {
    hideProductQuickView();
    return;
  }
  const stockBtn = event.target.closest('[data-qv-action="stock"]');
  if (stockBtn) {
    openQuickViewStockAdjust(stockBtn.dataset.id);
    return;
  }
  if (event.target.closest('[data-action="edit-product"]')) handleProductActions(event);
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
          <td data-label="Título">${item.titulo || '-'}</td>
          <td data-label="Descrição">${item.descricao || '-'}</td>
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
  dom.dashTicket.textContent = `Ticket médio ${formatCurrency(ticketAtual)}`;
  dom.dashConversao.textContent = `Conversão ${formatPercent(conversaoAtual)} (anterior ${formatPercent(conversaoAnterior)})`;
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
      label: 'Orçamentos',
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

let drawerCloseGuard = null;

function openDrawer(contentHtml, variant = '') {
  drawerCloseGuard = null;
  dom.drawerBody.innerHTML = contentHtml;
  const panel = dom.drawerBody.parentElement;
  if (variant) panel.dataset.variant = variant;
  else delete panel.dataset.variant;
  dom.drawer.classList.remove('hidden');
  applyInputMasks(dom.drawerBody);
}

function closeDrawer() {
  drawerCloseGuard = null;
  dom.drawer.classList.add('hidden');
  dom.drawerBody.innerHTML = '';
  delete dom.drawerBody.parentElement.dataset.variant;
}

// X button and backdrop click: the open drawer may veto closing (unsaved edits)
function requestDrawerClose() {
  if (drawerCloseGuard && !drawerCloseGuard()) return;
  closeDrawer();
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
            <div class="doc-title">Orçamento</div>
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
          <span>Total do orçamento</span>
          <strong>${formatCurrency(metrics.valor)}</strong>
        </div>
      </div>
      <section class="doc-section">
        <h4>Observações</h4>
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
        <h4>Observações</h4>
        <p>${venda.obs || '-'}</p>
      </section>
      <footer class="doc-footer">
        <span>Documento nao fiscal • GAO Joias</span>
      </footer>
    </div>
  `;
}

function buildVendaOSSlip(venda) {
  const metrics  = getVendaMetrics(venda);
  const today    = new Date().toLocaleDateString('pt-BR');
  const dataVenda = formatDateShort(venda.dataHora);
  const serviceItems  = metrics.items.filter(i => (i.tipo || '').toLowerCase().includes('servi'));
  const productItems  = metrics.items.filter(i => !(i.tipo || '').toLowerCase().includes('servi'));

  const itemRows = (items, label) => {
    if (!items.length) return '';
    const rows = items.map(item => `
      <tr>
        <td class="os-slip-item-name">${escapeHtml(item.titulo || '—')}</td>
        <td class="os-slip-item-desc">${escapeHtml(item.descricao || '—')}</td>
        <td class="os-slip-item-qty">${item.quantidade}${item.unidade ? ' ' + escapeHtml(item.unidade) : ''}</td>
      </tr>`).join('');
    return `
      <section class="doc-section os-slip-section">
        <h4>${label}</h4>
        <table class="doc-table os-slip-table">
          <thead>
            <tr><th>Item</th><th>Descrição</th><th>Qtd.</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  };

  return `
    <div class="doc doc-os-slip">
      <header class="doc-header">
        <div class="brand-block">
          <img src="img/logo_black.png" alt="GAO Joias" />
          <div>
            <div class="doc-title">Ordem de Serviço</div>
            <div class="doc-number">#${escapeHtml(String(venda.numero || '—'))}</div>
          </div>
        </div>
        <div class="os-slip-stamp">
          <i class="fa-solid fa-hammer"></i>
        </div>
      </header>

      <div class="doc-meta os-slip-meta">
        <div><span>Cliente</span><strong>${escapeHtml(venda.cliente || '—')}</strong></div>
        <div><span>Data da entrada</span><strong>${dataVenda}</strong></div>
        <div><span>Status</span><strong>${escapeHtml(metrics.statusRecebimento || '—')}</strong></div>
        ${venda.prazoEntrega ? `<div><span>Prazo de entrega</span><strong class="os-slip-prazo">${escapeHtml(venda.prazoEntrega)}</strong></div>` : ''}
      </div>

      ${itemRows(serviceItems, 'Serviços a realizar')}
      ${itemRows(productItems, 'Materiais / Produtos')}

      ${venda.obs ? `
      <section class="doc-section os-slip-section">
        <h4>Observações</h4>
        <div class="os-slip-obs">${escapeHtml(venda.obs).replace(/\n/g, '<br>')}</div>
      </section>` : ''}

      <div class="os-slip-signatures">
        <div class="os-sig">
          <div class="os-sig-line"></div>
          <span>Ourives responsável</span>
        </div>
        <div class="os-sig">
          <div class="os-sig-line"></div>
          <span>Data de conclusão</span>
        </div>
        <div class="os-sig">
          <div class="os-sig-line"></div>
          <span>Conferência / Retirada</span>
        </div>
      </div>

      <footer class="doc-footer">
        <span>Documento interno — GAO Joias · OS #${escapeHtml(String(venda.numero || '—'))} · Emitido em ${today} · <strong>Não contém valores</strong></span>
      </footer>
    </div>`;
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
    dom.thermalStatus.textContent = 'Web Serial não está disponível neste navegador. Use Chrome/Edge em HTTPS.';
  } else if (!window.isSecureContext) {
    dom.thermalStatus.textContent = 'Web Serial exige HTTPS ou localhost. Na Hostinger, use o dominio com HTTPS.';
  } else if (thermalPrinter.connected) {
    dom.thermalStatus.textContent = `Bematech conectada em ${getThermalBaudRate()} baud.`;
  } else {
    dom.thermalStatus.textContent = 'Bematech ainda não conectada. Clique em Conectar Bematech.';
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

function buildThermalOSSlipText(venda) {
  const metrics = getVendaMetrics(venda);
  const serviceItems = metrics.items.filter(i => (i.tipo || '').toLowerCase().includes('servi'));
  const productItems = metrics.items.filter(i => !(i.tipo || '').toLowerCase().includes('servi'));
  const lines = [
    centerThermalText('GAO JOIAS'),
    centerThermalText('ORDEM DE SERVICO'),
    thermalLine('='),
    centerThermalText(`OS #${printerText(venda.numero || '-')}`),
    thermalLine('-'),
    twoColumnThermal('Cliente', printerText(venda.cliente || '-')),
    twoColumnThermal('Data', printerText(formatDateShort(venda.dataHora))),
    twoColumnThermal('Status', printerText(metrics.statusRecebimento || '-')),
    thermalLine('='),
  ];

  if (serviceItems.length) {
    lines.push(centerThermalText('SERVICOS'));
    lines.push(thermalLine('-'));
    serviceItems.forEach((item, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      wrapThermalText(item.titulo || 'Item', 39).forEach((l, li) => {
        lines.push(li === 0 ? `${num} ${l}`.slice(0, 42) : `   ${l}`.slice(0, 42));
      });
      if (item.descricao) {
        wrapThermalText(item.descricao, 40).forEach(l => lines.push(`   ${l}`.slice(0, 42)));
      }
      lines.push(twoColumnThermal('   Qtd.', String(item.quantidade || 1)));
      lines.push(thermalLine('.'));
    });
    if (lines.at(-1) === thermalLine('.')) lines.pop();
    lines.push(thermalLine('-'));
  }

  if (productItems.length) {
    lines.push(centerThermalText('MATERIAIS / PRODUTOS'));
    lines.push(thermalLine('-'));
    productItems.forEach((item, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      wrapThermalText(item.titulo || 'Item', 39).forEach((l, li) => {
        lines.push(li === 0 ? `${num} ${l}`.slice(0, 42) : `   ${l}`.slice(0, 42));
      });
      lines.push(twoColumnThermal('   Qtd.', String(item.quantidade || 1)));
    });
    lines.push(thermalLine('-'));
  }

  if (venda.obs) {
    lines.push(centerThermalText('OBSERVACOES'));
    lines.push(thermalLine('-'));
    wrapThermalText(venda.obs, 42).forEach(l => lines.push(l));
    lines.push(thermalLine('-'));
  }

  lines.push('');
  lines.push(centerThermalText('Assinatura Ourives'));
  lines.push('');
  lines.push(thermalLine('_'));
  lines.push('');
  lines.push(centerThermalText('Data de conclusao'));
  lines.push('');
  lines.push(thermalLine('_'));
  lines.push('');
  lines.push(thermalLine('='));
  lines.push(centerThermalText('Documento interno - sem valores'));
  lines.push(centerThermalText('GAO Joias'));

  return lines.join('\n');
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

function printThermalOSSlip(venda) {
  if (getThermalMode() === 'visual') {
    return printThermalHtml(buildVendaOSSlip(venda), 'da OS', buildThermalOSSlipText(venda));
  }
  return printThermalText(buildThermalOSSlipText(venda), 'da OS');
}

function printThermalVenda(venda) {
  if (getThermalMode() === 'visual') {
    return printThermalHtml(buildVendaDoc(venda, true), 'da venda', buildThermalVendaText(venda));
  }
  return printThermalText(buildThermalVendaText(venda), 'da venda');
}

function printThermalOrcamento(orcamento) {
  if (getThermalMode() === 'visual') {
    return printThermalHtml(buildOrcamentoDoc(orcamento), 'do orçamento', buildThermalOrcamentoText(orcamento));
  }
  return printThermalText(buildThermalOrcamentoText(orcamento), 'do orçamento');
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
        <h3>Orçamento #${orcamento.numero}</h3>
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
    showToast('Orçamento recusado.');
  } catch (error) {
    showToast(error.message || 'Erro ao recusar orcamento', 'error');
  }
}

function openOrcamentoEditor(orcamento) {
  const valorAtual = parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro);
  openDrawer(`
    <h3>Editar Orçamento #${orcamento.numero}</h3>
    <form id="orcamento-edit-form" class="form-grid">
      <label>Cliente<input type="text" name="cliente" value="${orcamento.cliente || ''}" readonly /></label>
      <label>Produto/Serviço<input type="text" name="produtoServico" value="${orcamento.produtoServico || ''}" required /></label>
      <label>Descrição<input type="text" name="descricao" value="${orcamento.descricao || ''}" /></label>
      <label>Validade<input type="date" name="validade" value="${orcamento.validade || ''}" /></label>
      <label>Observação pública<input type="text" name="obsPublic" value="${orcamento.obsPublic || ''}" /></label>
      <label>Observação interna<input type="text" name="obsPrivate" value="${orcamento.obsPrivate || ''}" /></label>
      <label>Custo material<input type="number" step="0.01" name="custoMaterial" value="${orcamento.custoMaterial || 0}" /></label>
      <label>Custo outros<input type="number" step="0.01" name="custoOutros" value="${orcamento.custoOutros || 0}" /></label>
      <label>Valor cobrado<input type="number" step="0.01" name="valorCobrado" value="${valorAtual}" /></label>
      <label>Status\n        <select name="status">\n          <option value="Em negociacao">Em negociação</option>\n          <option value="Enviado">Enviado</option>\n          <option value="Aprovado">Aprovado</option>\n          <option value="Perdido">Perdido</option>\n          <option value="Confirmado">Confirmado</option>\n        </select>\n      </label>
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
      showToast('Orçamento atualizado.');
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
    showToast('Venda criada e orçamento confirmado.');
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
  const metrics = getVendaMetrics(venda);
  const hasService = metrics.items.some(i => (i.tipo || '').toLowerCase().includes('servi'));
  if (action === 'nota') {
    openModal(`
      <div class="modal-actions">
        <h3>Nota de venda #${venda.numero}</h3>
        <div class="config-actions">
          <button class="icon-btn" id="modal-pdf"     title="Baixar PDF"><i class="fa-solid fa-file-pdf"></i></button>
          <button class="icon-btn" id="modal-print"   title="Imprimir"><i class="fa-solid fa-print"></i></button>
          <button class="icon-btn" id="modal-thermal" title="Bematech HS"><i class="fa-solid fa-receipt"></i></button>
          ${hasService ? `<button class="icon-btn os-btn" id="modal-os" title="Ordem de Serviço — sem valores"><i class="fa-solid fa-hammer"></i></button>` : ''}
          <button class="icon-btn" id="modal-close"   title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${docHtml}
    `);
    qs('#modal-pdf').addEventListener('click', () => generatePdf(docHtml, `nota-${venda.numero}.pdf`));
    qs('#modal-print').addEventListener('click', () => printHtml(docHtml));
    qs('#modal-thermal').addEventListener('click', () => printThermalVenda(venda));
    if (hasService) {
      qs('#modal-os').addEventListener('click', () => {
        closeModal();
        setTimeout(() => {
          const slipHtml = buildVendaOSSlip(venda);
          openModal(`
            <div class="modal-actions">
              <h3><i class="fa-solid fa-hammer" style="color:var(--gold);margin-right:8px"></i>OS #${venda.numero} — Ordem de Serviço</h3>
              <div class="config-actions">
                <button class="icon-btn" id="os-modal-print"   title="Imprimir"><i class="fa-solid fa-print"></i></button>
                <button class="icon-btn" id="os-modal-pdf"     title="Baixar PDF"><i class="fa-solid fa-file-pdf"></i></button>
                <button class="icon-btn" id="os-modal-thermal" title="Bematech HS"><i class="fa-solid fa-receipt"></i></button>
                <button class="icon-btn" id="os-modal-close"   title="Fechar"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
            ${slipHtml}
          `);
          qs('#os-modal-print').addEventListener('click', () => printHtml(slipHtml));
          qs('#os-modal-pdf').addEventListener('click', () => generatePdf(slipHtml, `OS-${venda.numero}.pdf`));
          qs('#os-modal-thermal').addEventListener('click', () => printThermalOSSlip(venda));
          qs('#os-modal-close').addEventListener('click', closeModal);
        }, 180);
      });
    }
    qs('#modal-close').addEventListener('click', closeModal);
  }

  if (action === 'os') {
    const slipHtml = buildVendaOSSlip(venda);
    openModal(`
      <div class="modal-actions">
        <h3><i class="fa-solid fa-hammer" style="color:var(--gold);margin-right:8px"></i>OS #${venda.numero} — Ordem de Serviço</h3>
        <div class="config-actions">
          <button class="icon-btn" id="os-modal-print"   title="Imprimir"><i class="fa-solid fa-print"></i></button>
          <button class="icon-btn" id="os-modal-pdf"     title="Baixar PDF"><i class="fa-solid fa-file-pdf"></i></button>
          <button class="icon-btn" id="os-modal-thermal" title="Bematech HS"><i class="fa-solid fa-receipt"></i></button>
          <button class="icon-btn" id="os-modal-close"   title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${slipHtml}
    `);
    qs('#os-modal-print').addEventListener('click', () => printHtml(slipHtml));
    qs('#os-modal-pdf').addEventListener('click', () => generatePdf(slipHtml, `OS-${venda.numero}.pdf`));
    qs('#os-modal-thermal').addEventListener('click', () => printThermalOSSlip(venda));
    qs('#os-modal-close').addEventListener('click', closeModal);
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
      <label>Produto/Serviço<input type="text" name="produtoServico" value="${venda.produtoServico || ''}" required /></label>
      <label>Descrição<input type="text" name="descricao" value="${venda.descricao || ''}" /></label>
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
      <label class="full">Observações<input type="text" name="obs" value="${venda.obs || ''}" /></label>
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
    showToast('Orçamento salvo.');
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
      showToast('Orçamento atualizado.');
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
      showToast('Orçamento sem itens — não é possível converter.', 'error');
      return;
    }
    const defaultPayment = {
      descricao: `Orçamento #${orcamento.numero}`,
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
    showToast('Orçamento salvo.');
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
  const categoryNames = categoryPicker ? categoryPicker.values() : [];
  const weightRaw = formData.get('weightGrams');
  const shippingRaw = formData.get('shipping');
  return {
    id: formData.get('id') || '',
    sku: formData.get('sku') || '',
    supplierRef: formData.get('supplierRef') || '',
    name: formData.get('name') || '',
    categoryName: categoryNames[0] || '',
    categoryNames,
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

function readProductPhotoUrls(grid) {
  return qsa('.photo-slot', grid).map((slot) => (slot.querySelector('.photo-url-input')?.value || '').trim());
}

// Saved order = slot order (the first photo is the main one in the store)
function writeProductPhotoUrls(grid, urls, animate = false) {
  qsa('.photo-slot', grid).forEach((slot, index) => {
    const url = urls[index] || '';
    const input = slot.querySelector('.photo-url-input');
    const preview = slot.querySelector('.photo-slot-preview');
    const img = preview?.querySelector('img');
    const changed = Boolean(input) && input.value !== url;
    if (input) input.value = url;
    if (img) {
      if (!url) img.removeAttribute('src');
      else if (img.getAttribute('src') !== url) img.src = url;
    }
    if (preview) preview.style.display = url ? 'block' : 'none';
    slot.classList.toggle('has-photo', Boolean(url));
    if (animate && changed && url) {
      slot.classList.remove('photo-shift');
      void slot.offsetWidth;
      slot.classList.add('photo-shift');
    }
  });
  grid.classList.toggle('can-reorder', urls.filter(Boolean).length > 1);
}

// Keeps photos side by side from the first slot, with no gaps
function compactProductPhotos(grid) {
  if (grid) writeProductPhotoUrls(grid, readProductPhotoUrls(grid).filter(Boolean));
}
window.compactProductPhotos = compactProductPhotos;

function clearProductPhotos(form) {
  const grid = form?.querySelector('.photo-upload-grid');
  if (!grid) return;
  writeProductPhotoUrls(grid, []);
  qsa('.photo-file-input', grid).forEach((input) => { input.value = ''; });
}

function fillProductPhotos(form, imageUrls) {
  clearProductPhotos(form);
  const grid = form?.querySelector('.photo-upload-grid');
  if (grid) writeProductPhotoUrls(grid, (imageUrls || []).filter(Boolean));
}

// Drag to reorder photos: mouse drags after a few pixels, touch after a short press-and-hold
const PHOTO_DRAG_THRESHOLD = 6;
const PHOTO_LONG_PRESS_MS = 280;
let photoDrag = null;
let suppressPhotoClick = false;

function photoTargetIndex(grid, x, y, count) {
  let best = 0;
  let bestDistance = Infinity;
  qsa('.photo-slot', grid).slice(0, count).forEach((slot, index) => {
    const rect = slot.getBoundingClientRect();
    const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}

function handlePhotoPointerDown(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  const grid = event.currentTarget;
  const slot = event.target.closest('.photo-slot');
  if (!slot || event.target.closest('.photo-remove-btn') || !slot.classList.contains('has-photo')) return;
  if (grid.querySelector('.photo-slot.uploading')) return;
  const pressedUrl = slot.querySelector('.photo-url-input').value;
  compactProductPhotos(grid);
  const urls = readProductPhotoUrls(grid).filter(Boolean);
  if (urls.length < 2) return;
  const from = urls.indexOf(pressedUrl);
  photoDrag = {
    grid, urls, from, current: from,
    pointerId: event.pointerId,
    touch: event.pointerType !== 'mouse',
    startX: event.clientX, startY: event.clientY,
    lastX: event.clientX, lastY: event.clientY,
    active: false, ghost: null, timer: 0
  };
  if (photoDrag.touch) photoDrag.timer = setTimeout(startPhotoDrag, PHOTO_LONG_PRESS_MS);
}

function startPhotoDrag() {
  const drag = photoDrag;
  if (!drag || drag.active) return;
  const slot = qsa('.photo-slot', drag.grid)[drag.from];
  const rect = slot.getBoundingClientRect();
  drag.active = true;
  drag.offsetX = drag.startX - rect.left;
  drag.offsetY = drag.startY - rect.top;
  const ghost = document.createElement('div');
  ghost.className = 'photo-drag-ghost';
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.innerHTML = `<img src="${escapeHtml(drag.urls[drag.from])}" alt="" />`;
  document.body.appendChild(ghost);
  drag.ghost = ghost;
  document.body.classList.add('photo-dragging');
  slot.classList.add('is-drag-target');
  positionPhotoGhost();
  if (drag.touch && navigator.vibrate) navigator.vibrate(12);
}

function positionPhotoGhost() {
  const { ghost, lastX, lastY, offsetX, offsetY } = photoDrag;
  ghost.style.transform = `translate3d(${lastX - offsetX}px, ${lastY - offsetY}px, 0) scale(1.06)`;
}

function handlePhotoPointerMove(event) {
  const drag = photoDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.lastX = event.clientX;
  drag.lastY = event.clientY;
  if (!drag.active) {
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.touch && distance >= PHOTO_DRAG_THRESHOLD) startPhotoDrag();
    else if (drag.touch && distance > 10) endPhotoDrag(false); // finger moved early: it is a scroll
    return;
  }
  positionPhotoGhost();
  const target = photoTargetIndex(drag.grid, event.clientX, event.clientY, drag.urls.length);
  if (target === drag.current) return;
  const order = drag.urls.slice();
  order.splice(target, 0, order.splice(drag.from, 1)[0]);
  writeProductPhotoUrls(drag.grid, order, true);
  qsa('.photo-slot', drag.grid).forEach((slot, index) => slot.classList.toggle('is-drag-target', index === target));
  drag.current = target;
}

function endPhotoDrag(restore) {
  const drag = photoDrag;
  if (!drag) return;
  photoDrag = null;
  clearTimeout(drag.timer);
  if (!drag.active) return;
  if (restore) writeProductPhotoUrls(drag.grid, drag.urls);
  drag.ghost.remove();
  document.body.classList.remove('photo-dragging');
  qsa('.photo-slot', drag.grid).forEach((slot) => slot.classList.remove('is-drag-target'));
  // The click that follows the release would open the file picker
  suppressPhotoClick = true;
  setTimeout(() => { suppressPhotoClick = false; }, 300);
}

function setupProductPhotoReorder() {
  const grid = document.getElementById('product-photos');
  if (!grid) return;
  grid.addEventListener('pointerdown', handlePhotoPointerDown);
  grid.addEventListener('click', (event) => {
    if (!suppressPhotoClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressPhotoClick = false;
  }, true);
  grid.addEventListener('contextmenu', (event) => {
    if (photoDrag) event.preventDefault();
  });
  window.addEventListener('pointermove', handlePhotoPointerMove);
  window.addEventListener('pointerup', (event) => {
    if (photoDrag && event.pointerId === photoDrag.pointerId) endPhotoDrag(false);
  });
  window.addEventListener('pointercancel', () => endPhotoDrag(true));
  window.addEventListener('touchmove', (event) => {
    if (photoDrag?.active) event.preventDefault();
  }, { passive: false });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !photoDrag?.active) return;
    event.stopPropagation();
    endPhotoDrag(true);
  }, true);
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
  categoryPicker?.setValues([]);
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
  set('supplierRef',      product.supplierRef || '');
  set('name',             product.name || '');
  categoryPicker?.setValues(product.categoryNames?.length ? product.categoryNames : [product.categoryName]);
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
  if (!btn) {
    const anchor = getQuickViewAnchor(event.target);
    if (anchor) toggleProductQuickViewPin(anchor);
    return;
  }
  hideProductQuickView();

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
    showToast('Informe o vencimento para lançamentos a pagar.', 'error');
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
    showToast(error.message || 'Erro ao salvar lançamento', 'error');
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
    <h3>Editar lançamento #${item.numero || '-'}</h3>
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
      <label class="full">Descrição<input type="text" name="descricao" value="${item.descricao || ''}" required /></label>
      <label class="full">Observações<input type="text" name="obs" value="${item.obs || ''}" /></label>
      <button class="btn btn-primary" type="submit">Atualizar lançamento</button>
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
      showToast('Informe o vencimento para lançamentos a pagar.', 'error');
      return;
    }
    try {
      await apiRequest('updateFinanceiro', updated);
      closeDrawer();
      await loadAllData();
      showToast('Lancamento atualizado.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar lançamento', 'error');
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
      showToast(`Lembrete ${status === 'Concluido' ? 'concluído' : 'reaberto'}.`);
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar lembrete', 'error');
    }
  }
}

function openLembreteEditor(lembrete) {
  openDrawer(`
    <h3>Editar lembrete #${lembrete.numero || '-'}</h3>
    <form id="lembrete-edit-form" class="form-grid">
      <label>Título<input type="text" name="titulo" value="${lembrete.titulo || ''}" required /></label>
      <label>Status
        <select name="status" required>
          <option value="Pendente">Pendente</option>
          <option value="Concluido">Concluído</option>
        </select>
      </label>
      <label>Vencimento<input type="date" name="vencimento" value="${formatDateISO(lembrete.vencimento)}" required /></label>
      <label class="full">Descrição<input type="text" name="descricao" value="${lembrete.descricao || ''}" required /></label>
      <label class="full">Observações<input type="text" name="obs" value="${lembrete.obs || ''}" /></label>
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

// ── Pagamentos (Stripe): the API only ever returns a key hint, never the key ──
let paymentStatus = null;

function paymentCheck(ok, label, hint) {
  return `<li class="pay-check ${ok ? 'ok' : 'no'}"><i class="fa-solid ${ok ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>`
    + `<span>${label}${!ok && hint ? `<small>${hint}</small>` : ''}</span></li>`;
}

function stripeSubmitHtml() {
  return `<i class="fa-solid fa-plug"></i> <span>${paymentStatus?.connected ? 'Trocar chave' : 'Conectar Stripe'}</span>`;
}

function renderPaymentSettings(status) {
  const badge = document.getElementById('stripe-badge');
  const box = document.getElementById('stripe-status');
  if (!badge || !box) return;
  paymentStatus = status;

  if (!status.connected) {
    badge.className = 'badge warn';
    badge.textContent = 'Não conectada';
    box.innerHTML = `
      <p class="pay-lead">A loja ainda não aceita pagamentos online. Para conectar:</p>
      <ol class="pay-steps">
        <li>No painel da Stripe, abra <b>Desenvolvedores → Chaves de API</b>.</li>
        <li>Copie a <b>Chave secreta</b>. Comece pela de teste (<code>sk_test_…</code>) para fazer uma compra de teste.</li>
        <li>Cole abaixo e clique em <b>Conectar Stripe</b>. A confirmação automática dos pedidos (webhook) é criada na hora.</li>
      </ol>`;
  } else {
    const account = status.account;
    const live = status.mode === 'live';
    badge.className = `badge ${status.error ? 'danger' : live ? 'success' : 'warn'}`;
    badge.textContent = status.error ? 'Com erro' : live ? 'Conectada · Real' : 'Conectada · Teste';
    const connectedAt = status.updatedAt ? ` · conectada em ${formatDate(status.updatedAt)}${status.updatedBy ? ` por ${status.updatedBy}` : ''}` : '';
    box.innerHTML = `
      ${status.error ? `<p class="pay-error"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(status.error)}</p>` : ''}
      ${account ? `
        <div class="pay-account">
          <strong>${escapeHtml(account.name || account.email || 'Conta Stripe')}</strong>
          <span>${escapeHtml([account.id, account.email, account.country].filter(Boolean).join(' · '))}</span>
        </div>
        <ul class="pay-checks">
          ${paymentCheck(account.chargesEnabled, 'Pode receber pagamentos', 'Conclua a ativação da conta na Stripe (dados da empresa e conta bancária).')}
          ${paymentCheck(account.payoutsEnabled, 'Repasses para a conta bancária', 'Cadastre a conta bancária na Stripe.')}
          ${paymentCheck(status.webhookReady, 'Confirmação automática dos pedidos (webhook)', 'Cole a mesma chave em “Trocar chave” para recriar o webhook.')}
        </ul>` : ''}
      ${account && !live ? `<p class="pay-tip"><i class="fa-solid fa-flask"></i> Modo teste: faça uma compra na loja com o cartão <b>4242 4242 4242 4242</b>, qualquer data futura e qualquer CVC. Nada é cobrado. Quando estiver tudo certo, troque pela chave real (<code>sk_live_…</code>).</p>` : ''}
      <p class="pay-meta">Chave ${escapeHtml(status.keyHint)}${escapeHtml(connectedAt)}${status.managedHere ? '' : ' · definida no servidor'}</p>`;
  }

  document.getElementById('stripe-key-label').textContent = status.connected ? 'Trocar chave secreta' : 'Chave secreta da Stripe';
  document.getElementById('stripe-submit').innerHTML = stripeSubmitHtml();
  document.getElementById('stripe-disconnect').hidden = !status.managedHere;
}

async function loadPaymentSettings() {
  const badge = document.getElementById('stripe-badge');
  if (!badge) return;
  badge.className = 'badge neutral';
  badge.textContent = 'Verificando…';
  try {
    renderPaymentSettings(await apiRequest('getPaymentSettings'));
  } catch (error) {
    badge.className = 'badge danger';
    badge.textContent = 'Erro';
    document.getElementById('stripe-status').innerHTML = `<p class="pay-error">${escapeHtml(error.message || 'Não foi possível consultar a Stripe.')}</p>`;
  }
}

async function handleStripeSubmit(event) {
  event.preventDefault();
  const input = event.target.querySelector('[name="secretKey"]');
  const submit = document.getElementById('stripe-submit');
  submit.disabled = true;
  submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Verificando na Stripe…</span>';
  try {
    const status = await apiRequest('savePaymentSettings', { secretKey: input.value.trim() });
    input.value = '';
    renderPaymentSettings(status);
    showToast(`Stripe conectada${status.account?.name ? `: ${status.account.name}` : ''}.`);
  } catch (error) {
    showToast(error.message || 'Não foi possível conectar a Stripe.', 'error');
  } finally {
    submit.disabled = false;
    submit.innerHTML = stripeSubmitHtml();
  }
}

async function handleStripeDisconnect() {
  if (!confirm('Desconectar a Stripe? A loja deixa de aceitar pagamentos online até você conectar de novo.')) return;
  try {
    renderPaymentSettings(await apiRequest('disconnectPaymentSettings'));
    showToast('Stripe desconectada.');
  } catch (error) {
    showToast(error.message || 'Não foi possível desconectar a Stripe.', 'error');
  }
}

function setupEvents() {
  document.getElementById('stripe-form')?.addEventListener('submit', handleStripeSubmit);
  document.getElementById('stripe-disconnect')?.addEventListener('click', handleStripeDisconnect);
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
    if (event.target === dom.drawer) requestDrawerClose();
  });
  dom.modal.addEventListener('click', (event) => {
    if (event.target === dom.modal) closeModal();
  });
  dom.drawerClose.addEventListener('click', requestDrawerClose);

  applyInputMasks(dom.clienteForm);

  dom.clienteForm.addEventListener('submit', handleClienteSubmit);
  dom.orcamentoForm.addEventListener('submit', handleOrcamentoSubmit);
  dom.vendaForm.addEventListener('submit', handleVendaSubmit);
  if (dom.productForm) dom.productForm.addEventListener('submit', handleProductSubmit);
  if (dom.productFormReset) dom.productFormReset.addEventListener('click', resetProductForm);
  setupProductPhotoReorder();
  categoryPicker = createCategoryPicker(document.getElementById('product-category-picker'));
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
  if (dom.productGrid) dom.productGrid.addEventListener('click', handleProductActions);
  [dom.productGrid, dom.productTable].forEach((container) => {
    if (!container) return;
    container.addEventListener('mouseover', handleQuickViewMouseOver);
    container.addEventListener('mouseout', handleQuickViewMouseOut);
    container.addEventListener('keydown', handleQuickViewAnchorKey);
    container.addEventListener('error', (event) => markImageMissing(event.target), true);
  });
  document.addEventListener('pointerdown', handleQuickViewOutsidePointer, true);
  document.addEventListener('keydown', handleQuickViewKeydown);
  window.addEventListener('scroll', handleQuickViewScroll, { capture: true, passive: true });
  window.addEventListener('resize', handleQuickViewResize);
  if (dom.productViewToggle) {
    dom.productViewToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view]');
      if (!btn) return;
      productViewMode = btn.dataset.view;
      dom.productViewToggle.querySelectorAll('.icon-btn').forEach((b) => b.classList.toggle('active', b === btn));
      renderProducts();
    });
  }
  if (dom.bulkStockBtn) dom.bulkStockBtn.addEventListener('click', openBulkStockDrawer);
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

/* Marketing module — see js/marketing.js */

init();
