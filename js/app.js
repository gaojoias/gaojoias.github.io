const ADMIN_PASSWORD = 'G@04dm4645#';
const OP_PASSWORD = 'GAO#123';
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyS1DTeTQBI_wcsuxT2souKQrjTlzLLy6yH4TXHH0_vFMaY_2wZiAnLpf5xZDWUfLNe/exec';

const STORAGE_KEYS = {
  scriptUrl: 'gao_script_url',
  session: 'gao_session',
  sidebarCollapsed: 'gao_sidebar_collapsed',
  theme: 'gao_theme'
};

const state = {
  user: null,
  perfil: null,
  data: {
    clientes: [],
    orcamentos: [],
    vendas: [],
    logs: []
  },
  charts: {}
};

const dom = {
  loginScreen: document.getElementById('login-screen'),
  appShell: document.getElementById('app-shell'),
  loginForm: document.getElementById('login-form'),
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
  logTable: document.getElementById('log-table').querySelector('tbody'),
  orcamentoCliente: document.getElementById('orcamento-cliente'),
  vendaCliente: document.getElementById('venda-cliente'),
  scriptUrl: document.getElementById('script-url'),
  saveScriptUrl: document.getElementById('save-script-url'),
  testPdf: document.getElementById('test-pdf'),
  testPrint: document.getElementById('test-print'),
  testThermal: document.getElementById('test-thermal'),
  exportClientes: document.getElementById('export-clientes'),
  exportVendas: document.getElementById('export-vendas'),
  statOrcamentos: document.getElementById('stat-orcamentos'),
  statConversao: document.getElementById('stat-conversao'),
  statVendas: document.getElementById('stat-vendas'),
  statReceita: document.getElementById('stat-receita'),
  statLucro: document.getElementById('stat-lucro'),
  statMargem: document.getElementById('stat-margem'),
  statClientes: document.getElementById('stat-clientes'),
  statTicket: document.getElementById('stat-ticket'),
  topClientes: document.getElementById('top-clientes')
};

const subtitles = {
  dashboard: 'Visao geral do negocio em tempo real',
  clientes: 'Cadastro e gestao de relacionamento',
  orcamentos: 'Propostas, custos e margens',
  vendas: 'Controle financeiro e pagamentos',
  logs: 'Auditoria de acessos do sistema',
  config: 'Conecte o Apps Script e exportacoes'
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
function getSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.session);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getScriptUrl() {
  return localStorage.getItem(STORAGE_KEYS.scriptUrl) || DEFAULT_SCRIPT_URL;
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

function jsonpRequest(action, payload = {}) {
  return new Promise((resolve, reject) => {
    const url = getScriptUrl();
    const callbackName = `gaoJsonp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout ao comunicar com Apps Script.'));
    }, 12000);

    function cleanup() {
      clearTimeout(timeout);
      if (window[callbackName]) delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (response) => {
      cleanup();
      if (!response || !response.ok) {
        reject(new Error(response?.error || 'Erro ao comunicar com Apps Script'));
        return;
      }
      resolve(response.data);
    };

    const script = document.createElement('script');
    const query = new URLSearchParams({
      action,
      callback: callbackName,
      payload: JSON.stringify(payload || {})
    });
    script.src = `${url}?${query.toString()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('Falha ao carregar Apps Script.'));
    };
    document.body.appendChild(script);
  });
}

async function apiRequest(action, payload = {}) {
  const url = getScriptUrl();
  if (!url) throw new Error('URL do Apps Script nao configurada.');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload })
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Erro ao comunicar com Apps Script');
    }
    return data.data;
  } catch (error) {
    const message = String(error && error.message ? error.message : error);
    if (error?.name === 'TypeError' || /NetworkError|Failed to fetch/i.test(message)) {
      return jsonpRequest(action, payload);
    }
    throw error;
  }
}

async function loadAllData() {
  const url = getScriptUrl();
  if (!url) {
    showToast('Configure a URL do Apps Script para iniciar.');
    return;
  }
  try {
    const data = await apiRequest('listAll');
    state.data = data;
    renderAll();
  } catch (error) {
    showToast(error.message || 'Falha ao carregar dados', 'error');
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
  let perfil = null;

  if (senha === ADMIN_PASSWORD) {
    perfil = 'Administrador';
  } else if (senha === OP_PASSWORD) {
    perfil = 'Operador';
  }

  if (!perfil || !user) {
    showToast('Credenciais invalidas.', 'error');
    return;
  }

  state.user = user;
  state.perfil = perfil;
  setSession({ user, perfil, time: nowIso() });
  updateProfile();
  applyRoleAccess();
  dom.loginScreen.classList.add('hidden');
  dom.appShell.classList.remove('hidden');
  showToast(`Bem-vindo, ${user}!`);
  await registerLogin();
  await loadAllData();
}

async function registerLogin() {
  try {
    const ip = await fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => 'indisponivel');
    const info = getSystemInfo();
    await apiRequest('logLogin', {
      user: state.user,
      perfil: state.perfil,
      dataHora: nowIso(),
      sistema: info.system,
      navegador: info.browser,
      ip
    });
  } catch (error) {
    console.warn(error);
  }
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

function handleLogout() {
  clearSession();
  state.user = null;
  state.perfil = null;
  dom.appShell.classList.add('hidden');
  dom.loginScreen.classList.remove('hidden');
}
function renderAll() {
  renderClientes();
  renderOrcamentos();
  renderVendas();
  renderLogs();
  renderDashboard();
  renderClienteOptions();
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
        <td>${formatDateShort(cliente.dataHora)}</td>
        <td>${cliente.nome || '-'}</td>
        <td>${cliente.telefone || '-'}</td>
        <td>${cliente.email || '-'}</td>
        <td>${cliente.empresa || '-'}</td>
        <td>${cliente.cpfCNPJ || '-'}</td>
        <td>${cliente.obs || '-'}</td>
      </tr>
    `)
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
    if (!search) return true;
    return (
      String(orcamento.cliente).toLowerCase().includes(search) ||
      String(orcamento.status).toLowerCase().includes(search)
    );
  });

  dom.orcamentoTable.innerHTML = rows
    .map((orcamento) => {
      const valor = parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro);
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
          <td data-label="Produto/Servico">${orcamento.produtoServico || '-'}</td>
          <td data-label="Valor">${formatCurrency(valor)}</td>
          <td data-label="Lucro">${formatCurrency(orcamento.lucro || 0)}</td>
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
    if (!search) return true;
    return (
      String(venda.cliente).toLowerCase().includes(search) ||
      String(venda.pgto).toLowerCase().includes(search)
    );
  });

  dom.vendaTable.innerHTML = rows
    .map((venda) => {
      return `
        <tr>
          <td data-label="Numero">${venda.numero || '-'}</td>
          <td data-label="Data">${formatDateShort(venda.dataHora)}</td>
          <td data-label="Cliente">${venda.cliente || '-'}</td>
          <td data-label="Produto/Servico">${venda.produtoServico || '-'}</td>
          <td data-label="Valor">${formatCurrency(venda.valor || 0)}</td>
          <td data-label="Lucro">${formatCurrency(venda.lucro || 0)}</td>
          <td data-label="Pagamento">${venda.pgto || '-'}</td>
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
  const orcamentos = state.data.orcamentos;
  const vendas = state.data.vendas;

  const totalOrc = orcamentos.length;
  const totalVendas = vendas.length;
  const receita = vendas.reduce((sum, venda) => sum + parseNumber(venda.valor), 0);
  const lucro = vendas.reduce((sum, venda) => sum + parseNumber(venda.lucro), 0);
  const conversao = totalOrc ? (totalVendas / totalOrc) * 100 : 0;
  const margem = receita ? (lucro / receita) * 100 : 0;
  const ticket = totalVendas ? receita / totalVendas : 0;

  dom.statOrcamentos.textContent = totalOrc;
  dom.statVendas.textContent = totalVendas;
  dom.statClientes.textContent = state.data.clientes.length;
  dom.statReceita.textContent = formatCurrency(receita);
  dom.statLucro.textContent = formatCurrency(lucro);
  dom.statConversao.textContent = `${conversao.toFixed(1)}% de conversao`;
  dom.statMargem.textContent = `Margem ${margem.toFixed(1)}%`;
  dom.statTicket.textContent = `Ticket medio ${formatCurrency(ticket)}`;

  renderCharts();
  renderTopClientes();
}

function renderCharts() {
  const statusCounts = state.data.orcamentos.reduce((acc, item) => {
    const key = item.status || 'Em negociacao';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = Object.keys(statusCounts);
  const statusValues = Object.values(statusCounts);

  updateChart('chart-orcamentos', 'doughnut', {
    labels: statusLabels.length ? statusLabels : ['Sem dados'],
    datasets: [{
      data: statusValues.length ? statusValues : [1],
      backgroundColor: ['#d9b45a', '#4dd599', '#ff6b6b', '#8aa49c']
    }]
  }, {
    plugins: { legend: { labels: { color: '#f1f5f3' } } }
  });

  const monthly = aggregateMonthly(state.data.vendas, 'valor');
  const monthlyLucro = aggregateMonthly(state.data.vendas, 'lucro');

  updateChart('chart-receita', 'bar', {
    labels: monthly.labels,
    datasets: [
      { label: 'Receita', data: monthly.values, backgroundColor: '#d9b45a' },
      { label: 'Lucro', data: monthlyLucro.values, backgroundColor: '#4dd599' }
    ]
  }, {
    plugins: { legend: { labels: { color: '#f1f5f3' } } },
    scales: {
      x: { ticks: { color: '#b9c4bf' } },
      y: { ticks: { color: '#b9c4bf' } }
    }
  });

  const pgtoCounts = state.data.vendas.reduce((acc, item) => {
    const key = item.pgto || 'Pendente';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  updateChart('chart-pgto', 'bar', {
    labels: Object.keys(pgtoCounts),
    datasets: [{
      label: 'Vendas',
      data: Object.values(pgtoCounts),
      backgroundColor: '#4dd599'
    }]
  }, {
    plugins: { legend: { labels: { color: '#f1f5f3' } } },
    indexAxis: 'y',
    scales: {
      x: { ticks: { color: '#b9c4bf' } },
      y: { ticks: { color: '#b9c4bf' } }
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

function aggregateMonthly(items, field) {
  const map = new Map();
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, 0);
  }

  items.forEach((item) => {
    const date = new Date(item.dataHora || Date.now());
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (map.has(key)) {
      map.set(key, map.get(key) + parseNumber(item[field]));
    }
  });

  const labels = Array.from(map.keys()).map((key) => {
    const [year, month] = key.split('-');
    return `${month}/${year.slice(2)}`;
  });

  return { labels, values: Array.from(map.values()) };
}

function renderTopClientes() {
  const ranking = state.data.vendas.reduce((acc, venda) => {
    const key = venda.cliente || 'Sem cliente';
    acc[key] = (acc[key] || 0) + parseNumber(venda.valor);
    return acc;
  }, {});

  const top = Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  dom.topClientes.innerHTML = top
    .map(([cliente, total]) => `
      <div class="list-item">
        <span>${cliente}</span>
        <strong>${formatCurrency(total)}</strong>
      </div>
    `)
    .join('');
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
  const valor = parseNumber(orcamento.totalCustos) + parseNumber(orcamento.lucro);
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
        <table class="doc-table">
          <thead>
            <tr>
              <th>Produto/Servico</th>
              <th>Descricao</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${orcamento.produtoServico || '-'}</td>
              <td>${orcamento.descricao || '-'}</td>
              <td>${formatCurrency(valor)}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div class="doc-total">
        <div class="total-box">
          <span>Total do orcamento</span>
          <strong>${formatCurrency(valor)}</strong>
        </div>
      </div>
      <section class="doc-section">
        <h4>Observacoes</h4>
        <p>${orcamento.obsPublic || '-'}</p>
      </section>
      <footer class="doc-footer">
        <span>Documento nao fiscal • GAO Joias</span>
      </footer>
    </div>
  `;
}

function buildVendaDoc(venda, thermal = false) {
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
        <div><span>Pagamento</span><strong>${venda.pgto || '-'}</strong></div>
        <div><span>Valor</span><strong>${formatCurrency(venda.valor || 0)}</strong></div>
      </div>
      <section class="doc-section">
        <h4>Itens</h4>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Produto/Servico</th>
              <th>Descricao</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${venda.produtoServico || '-'}</td>
              <td>${venda.descricao || '-'}</td>
              <td>${formatCurrency(venda.valor || 0)}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div class="doc-total">
        <div class="total-box">
          <span>Total da venda</span>
          <strong>${formatCurrency(venda.valor || 0)}</strong>
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
    qs('#modal-thermal').addEventListener('click', () => printHtml(docHtml, true));
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
    pgto: 'Pendente',
    obs: orcamento.obsPublic
  };

  try {
    const venda = await apiRequest('createVenda', payload);
    state.data.vendas.unshift(venda);
    const updated = { ...orcamento, status: 'Confirmado' };
    await apiRequest('updateOrcamento', updated);
    const index = state.data.orcamentos.findIndex((item) => item.rowIndex === orcamento.rowIndex);
    if (index >= 0) state.data.orcamentos[index] = updated;
    renderAll();
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
    qs('#modal-thermal').addEventListener('click', () => printHtml(buildVendaDoc(venda, true), true));
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
          <option value="Credito">Credito</option>
          <option value="Debito">Debito</option>
          <option value="Pendente">Pendente</option>
        </select>
      </label>
      <label class="full">Observacoes<input type="text" name="obs" value="${venda.obs || ''}" /></label>
      <button class="btn btn-primary" type="submit">Atualizar</button>
    </form>
  `);

  const form = qs('#venda-edit-form');
  form.querySelector('select[name="pgto"]').value = venda.pgto || 'Pendente';

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
      pgto: formData.get('pgto') || 'Pendente',
      obs: formData.get('obs') || ''
    };

    try {
      await apiRequest('updateVenda', updated);
      const index = state.data.vendas.findIndex((item) => item.rowIndex === venda.rowIndex);
      if (index >= 0) state.data.vendas[index] = updated;
      closeDrawer();
      renderAll();
      showToast('Venda atualizada.');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar venda', 'error');
    }
  });
}
async function handleClienteSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    dataHora: nowIso(),
    nome: formData.get('nome') || '',
    telefone: formData.get('telefone') || '',
    email: formData.get('email') || '',
    empresa: formData.get('empresa') || '',
    cpfCNPJ: formData.get('cpfCNPJ') || '',
    obs: formData.get('obs') || ''
  };

  try {
    const cliente = await apiRequest('createCliente', payload);
    state.data.clientes.unshift(cliente);
    event.target.reset();
    renderAll();
    showToast('Cliente cadastrado.');
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
    pgto: formData.get('pgto') || 'Pendente',
    obs: formData.get('obs') || ''
  };

  try {
    const venda = await apiRequest('createVenda', payload);
    state.data.vendas.unshift(venda);
    event.target.reset();
    renderAll();
    showToast('Venda registrada.');
  } catch (error) {
    showToast(error.message || 'Erro ao salvar venda', 'error');
  }
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

  dom.clienteSearch.addEventListener('input', renderClientes);
  dom.orcamentoSearch.addEventListener('input', renderOrcamentos);
  dom.vendaSearch.addEventListener('input', renderVendas);

  dom.orcamentoTable.addEventListener('click', handleOrcamentoActions);
  dom.vendaTable.addEventListener('click', handleVendaActions);

  dom.saveScriptUrl.addEventListener('click', () => {
    const url = dom.scriptUrl.value.trim();
    if (!url) return;
    localStorage.setItem(STORAGE_KEYS.scriptUrl, url);
    showToast('URL salva.');
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
  dom.testThermal.addEventListener('click', () => {
    const html = buildVendaDoc({ numero: 'TESTE', cliente: 'GAO Joias', produtoServico: 'Teste', dataHora: nowIso(), valor: 0, pgto: 'Pix', obs: '' }, true);
    printHtml(html, true);
  });
  dom.exportClientes.addEventListener('click', () => handleExport('clientes'));
  dom.exportVendas.addEventListener('click', () => handleExport('vendas'));
}

function init() {
  setupEvents();
  loadSidebarState();
  loadTheme();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => null);
    });
  }
  dom.scriptUrl.value = getScriptUrl();
  const session = getSession();
  if (session) {
    state.user = session.user;
    state.perfil = session.perfil;
    dom.loginScreen.classList.add('hidden');
    dom.appShell.classList.remove('hidden');
    applyRoleAccess();
    updateProfile();
    loadAllData();
  }
}

init();

