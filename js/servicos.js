'use strict';

/* ── Status config ──────────────────────────────────────────── */
const OS_STATUS = {
  'Recebido':        { badge: 'badge-blue',   icon: 'fa-solid fa-inbox',            label: 'Recebido',         order: 1 },
  'Em andamento':    { badge: 'badge-yellow',  icon: 'fa-solid fa-gears',            label: 'Em andamento',     order: 2 },
  'Aguardando peca': { badge: 'badge-orange',  icon: 'fa-solid fa-clock',            label: 'Aguardando peça',  order: 3 },
  'Concluido':       { badge: 'badge-green',   icon: 'fa-solid fa-check-circle',     label: 'Concluído',        order: 4 },
  'Entregue':        { badge: 'badge-purple',  icon: 'fa-solid fa-box-open',         label: 'Entregue',         order: 5 },
  'Cancelado':       { badge: 'badge-red',     icon: 'fa-solid fa-ban',              label: 'Cancelado',        order: 6 },
};

/* ── Data loading ────────────────────────────────────────────── */
async function loadServicos() {
  try {
    const data = await apiRequest('listServiceOrders');
    state.servicos = data || [];
    state.servicosLoaded = true;
    _populateOSClienteDatalist();
    renderServicos();
  } catch (e) {
    showToast('Erro ao carregar ordens de serviço: ' + e.message, 'error');
  }
}

function _populateOSClienteDatalist() {
  const dl = document.getElementById('os-clientes-datalist');
  if (!dl) return;
  const names = [...new Set((state.data?.clientes || []).map(c => c.nome).filter(Boolean))];
  dl.innerHTML = names.map(n => `<option value="${escapeHtml(n)}">`).join('');
}

/* ── Render ──────────────────────────────────────────────────── */
function renderServicos() {
  const search = (document.getElementById('os-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('os-status-filter')?.value || '';

  let list = [...(state.servicos || [])];
  if (search) {
    list = list.filter(o =>
      (o.customerName || '').toLowerCase().includes(search) ||
      (o.itemDescription || '').toLowerCase().includes(search) ||
      (o.serviceDescription || '').toLowerCase().includes(search) ||
      (o.osNumber || '').toLowerCase().includes(search)
    );
  }
  if (statusF) list = list.filter(o => o.status === statusF);

  // Update count
  const all     = state.servicos || [];
  const active  = all.filter(o => !['Entregue', 'Cancelado'].includes(o.status)).length;
  const late    = all.filter(o => {
    if (['Entregue','Cancelado','Concluido'].includes(o.status)) return false;
    if (!o.promisedAt) return false;
    return new Date(o.promisedAt + 'T00:00:00') < new Date().setHours(0,0,0,0);
  }).length;
  const countEl = document.getElementById('os-count');
  if (countEl) {
    countEl.textContent = `${all.length} ordens · ${active} em aberto${late > 0 ? ` · ${late} atrasada${late > 1 ? 's' : ''}` : ''}`;
    countEl.style.color = late > 0 ? 'var(--error, #ef4444)' : '';
  }

  const container = document.getElementById('os-list');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="os-empty-state">
        <i class="fa-solid fa-screwdriver-wrench"></i>
        <p>${search || statusF ? 'Nenhuma O.S. encontrada com esses filtros.' : 'Nenhuma ordem de serviço cadastrada.'}</p>
        ${!search && !statusF ? `<button class="btn btn-primary" data-open-modal="servico-form"><i class="fa-solid fa-plus"></i> Nova O.S.</button>` : ''}
      </div>`;
    return;
  }

  // Summary bar — status counts
  const statusCounts = {};
  all.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const summaryHtml = Object.entries(OS_STATUS).map(([k, v]) => {
    const cnt = statusCounts[k] || 0;
    return cnt > 0
      ? `<button class="os-summary-pill${statusF === k ? ' active' : ''}" data-os-filter="${k}">
           <i class="${v.icon}"></i> ${v.label} <span>${cnt}</span>
         </button>`
      : '';
  }).join('');

  container.innerHTML = `
    <div class="os-summary-bar">${summaryHtml}</div>
    <div class="table-wrap">
      <table class="table os-table">
        <thead>
          <tr>
            <th>O.S.</th>
            <th>Cliente</th>
            <th>Item recebido / Serviço</th>
            <th>Status</th>
            <th>Prazo</th>
            <th>Valor</th>
            <th>Sinal</th>
            <th>Saldo</th>
            <th class="actions-col"></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(_osRowHtml).join('')}
        </tbody>
      </table>
    </div>`;
}

function _osRowHtml(os) {
  const st     = OS_STATUS[os.status] || OS_STATUS['Recebido'];
  const saldo  = os.priceCents - os.depositCents;
  const today  = new Date(); today.setHours(0,0,0,0);
  const prazo  = os.promisedAt ? new Date(os.promisedAt + 'T00:00:00') : null;
  const isLate = prazo && prazo < today && !['Concluido','Entregue','Cancelado'].includes(os.status);
  const isToday= prazo && prazo.getTime() === today.getTime();

  return `<tr class="os-row${isLate ? ' os-late' : ''}" data-os-id="${os.id}" style="cursor:pointer">
    <td><span class="os-number-chip">${escapeHtml(os.osNumber || '—')}</span></td>
    <td>
      <div class="os-client-cell">
        <strong>${escapeHtml(os.customerName)}</strong>
        ${os.customerPhone ? `<small class="muted">${escapeHtml(os.customerPhone)}</small>` : ''}
      </div>
    </td>
    <td>
      <div class="os-desc-cell">
        <span title="${escapeHtml(os.itemDescription)}">${escapeHtml(os.itemDescription.slice(0,55))}${os.itemDescription.length > 55 ? '…' : ''}</span>
        <small class="muted" title="${escapeHtml(os.serviceDescription)}">${escapeHtml(os.serviceDescription.slice(0,55))}${os.serviceDescription.length > 55 ? '…' : ''}</small>
      </div>
    </td>
    <td><span class="badge ${st.badge}"><i class="${st.icon}"></i> ${st.label}</span></td>
    <td class="${isLate ? 'text-danger fw-600' : isToday ? 'text-warning' : ''}">
      ${prazo ? `${isLate ? '<i class="fa-solid fa-triangle-exclamation"></i> ' : ''}${prazo.toLocaleDateString('pt-BR')}` : '<span class="muted">—</span>'}
    </td>
    <td>${os.priceCents > 0 ? formatCurrency(os.priceCents / 100) : '<span class="muted">—</span>'}</td>
    <td>${os.depositCents > 0 ? formatCurrency(os.depositCents / 100) : '<span class="muted">—</span>'}</td>
    <td>
      ${os.priceCents > 0
        ? saldo > 0
          ? `<strong class="text-warning">${formatCurrency(saldo / 100)}</strong>`
          : `<span class="badge badge-green" style="font-size:11px"><i class="fa-solid fa-check"></i> Quitado</span>`
        : '<span class="muted">—</span>'}
    </td>
    <td class="actions-cell" onclick="event.stopPropagation()">
      <button class="btn btn-ghost action-btn" data-os-action="goldsmith" data-id="${os.id}" title="Nota para o ourives (sem valores)"><i class="fa-solid fa-hammer"></i></button>
      <button class="btn btn-ghost action-btn" data-os-action="receipt"   data-id="${os.id}" title="Comprovante do cliente"><i class="fa-solid fa-file-invoice"></i></button>
      <button class="btn btn-ghost action-btn" data-action="edit-os"      data-id="${os.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-ghost action-btn danger" data-os-action="delete" data-id="${os.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
    </td>
  </tr>`;
}

/* ── Goldsmith slip — SEM valores, para o ourives ────────────── */
function buildOSGoldsmithSlip(os) {
  const today   = new Date().toLocaleDateString('pt-BR');
  const entryDate = os.createdAt ? new Date(os.createdAt).toLocaleDateString('pt-BR') : today;
  const prazoStr = os.promisedAt
    ? new Date(os.promisedAt + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return `
    <div class="doc doc-os">
      <header class="doc-header">
        <div class="brand-block">
          <img src="img/logo_black.png" alt="GAO Joias" />
          <div>
            <div class="doc-title">Ordem de Serviço</div>
            <div class="doc-number">${escapeHtml(os.osNumber || '—')}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">GAO Joias</div>
          <div style="font-size:12px;opacity:.7">Para o Ourives</div>
        </div>
      </header>

      <div class="doc-meta">
        <div><span>Data de entrada</span><strong>${entryDate}</strong></div>
        <div><span>Cliente</span><strong>${escapeHtml(os.customerName)}</strong></div>
        ${os.customerPhone ? `<div><span>Telefone</span><strong>${escapeHtml(os.customerPhone)}</strong></div>` : ''}
        <div><span>Prazo de entrega</span><strong>${prazoStr}</strong></div>
        <div><span>Status</span><strong>${os.status}</strong></div>
      </div>

      <section class="doc-section os-doc-section">
        <h4><i class="fa-solid fa-gem" style="color:#c9a84c;margin-right:6px"></i>Item recebido</h4>
        <div class="os-doc-text">${escapeHtml(os.itemDescription).replace(/\n/g, '<br>')}</div>
      </section>

      <section class="doc-section os-doc-section">
        <h4><i class="fa-solid fa-screwdriver-wrench" style="color:#c9a84c;margin-right:6px"></i>Serviço a realizar</h4>
        <div class="os-doc-text">${escapeHtml(os.serviceDescription).replace(/\n/g, '<br>')}</div>
      </section>

      ${os.notes ? `
      <section class="doc-section os-doc-section">
        <h4><i class="fa-solid fa-note-sticky" style="color:#c9a84c;margin-right:6px"></i>Observações</h4>
        <div class="os-doc-text">${escapeHtml(os.notes).replace(/\n/g, '<br>')}</div>
      </section>` : ''}

      <div class="os-signature-row">
        <div class="os-sig-box">
          <div class="os-sig-line"></div>
          <span>Ourives responsável</span>
        </div>
        <div class="os-sig-box">
          <div class="os-sig-line"></div>
          <span>Data de conclusão</span>
        </div>
      </div>

      <footer class="doc-footer">
        <span>Documento interno — GAO Joias · ${escapeHtml(os.osNumber || '')} · Emitido em ${today}</span>
      </footer>
    </div>`;
}

/* ── Customer receipt — COM valores ─────────────────────────── */
function buildOSCustomerReceipt(os) {
  const saldo     = Math.max(0, os.priceCents - os.depositCents);
  const entryDate = os.createdAt ? new Date(os.createdAt).toLocaleDateString('pt-BR') : '—';
  const prazoStr  = os.promisedAt
    ? new Date(os.promisedAt + 'T00:00:00').toLocaleDateString('pt-BR')
    : '—';
  const today = new Date().toLocaleDateString('pt-BR');

  return `
    <div class="doc">
      <header class="doc-header">
        <div class="brand-block">
          <img src="img/logo_black.png" alt="GAO Joias" />
          <div>
            <div class="doc-title">Ordem de Serviço</div>
            <div class="doc-number">${escapeHtml(os.osNumber || '—')}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">GAO Joias</div>
          <div style="font-size:12px;opacity:.7">Comprovante do cliente</div>
        </div>
      </header>

      <div class="doc-meta">
        <div><span>Cliente</span><strong>${escapeHtml(os.customerName)}</strong></div>
        ${os.customerPhone ? `<div><span>Telefone</span><strong>${escapeHtml(os.customerPhone)}</strong></div>` : ''}
        <div><span>Data de entrada</span><strong>${entryDate}</strong></div>
        <div><span>Prazo combinado</span><strong>${prazoStr}</strong></div>
        <div><span>Status</span><strong>${os.status}</strong></div>
      </div>

      <section class="doc-section">
        <h4>Item recebido</h4>
        <p style="white-space:pre-line">${escapeHtml(os.itemDescription)}</p>
      </section>

      <section class="doc-section">
        <h4>Serviço a realizar</h4>
        <p style="white-space:pre-line">${escapeHtml(os.serviceDescription)}</p>
      </section>

      ${os.notes ? `<section class="doc-section"><h4>Observações</h4><p style="white-space:pre-line">${escapeHtml(os.notes)}</p></section>` : ''}

      <div class="doc-total">
        <div class="total-box" style="width:100%">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:4px 0">Total do serviço</td>
              <td style="text-align:right;font-weight:700">${formatCurrency(os.priceCents / 100)}</td>
            </tr>
            ${os.depositCents > 0 ? `<tr>
              <td style="padding:4px 0;opacity:.8">Sinal recebido</td>
              <td style="text-align:right;opacity:.8">− ${formatCurrency(os.depositCents / 100)}</td>
            </tr>` : ''}
            <tr style="border-top:1px solid rgba(255,255,255,.25);font-size:16px">
              <td style="padding:8px 0 0"><strong>Saldo a pagar na retirada</strong></td>
              <td style="text-align:right;padding:8px 0 0"><strong>${formatCurrency(saldo / 100)}</strong></td>
            </tr>
          </table>
        </div>
      </div>

      <footer class="doc-footer">
        <span>Documento não fiscal · GAO Joias · ${escapeHtml(os.osNumber || '')} · Emitido em ${today}</span>
      </footer>
    </div>`;
}

/* ── Handle actions ──────────────────────────────────────────── */
function handleOSAction(action, id) {
  const os = (state.servicos || []).find(o => o.id === id);
  if (!os && action !== 'delete') return;

  if (action === 'goldsmith') {
    const slip = buildOSGoldsmithSlip(os);
    openModal(`
      <div class="modal-actions">
        <h3><i class="fa-solid fa-hammer"></i> Nota para o ourives — ${escapeHtml(os.osNumber)}</h3>
        <div class="config-actions">
          <button class="btn btn-primary" id="os-gsmith-print"><i class="fa-solid fa-print"></i><span>Imprimir</span></button>
          <button class="btn btn-ghost"   id="os-gsmith-pdf"><i class="fa-solid fa-file-pdf"></i><span>PDF</span></button>
          <button class="icon-btn"        id="os-gsmith-close" title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${slip}
    `);
    qs('#os-gsmith-print').addEventListener('click', () => printHtml(slip));
    qs('#os-gsmith-pdf').addEventListener('click', () => generatePdf(slip, `ourives-${os.osNumber}.pdf`));
    qs('#os-gsmith-close').addEventListener('click', closeModal);
    return;
  }

  if (action === 'receipt') {
    const receipt = buildOSCustomerReceipt(os);
    openModal(`
      <div class="modal-actions">
        <h3><i class="fa-solid fa-file-invoice"></i> Comprovante — ${escapeHtml(os.osNumber)}</h3>
        <div class="config-actions">
          <button class="btn btn-primary" id="os-rcpt-print"><i class="fa-solid fa-print"></i><span>Imprimir</span></button>
          <button class="btn btn-ghost"   id="os-rcpt-pdf"><i class="fa-solid fa-file-pdf"></i><span>PDF</span></button>
          <button class="icon-btn"        id="os-rcpt-close" title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      ${receipt}
    `);
    qs('#os-rcpt-print').addEventListener('click', () => printHtml(receipt));
    qs('#os-rcpt-pdf').addEventListener('click', () => generatePdf(receipt, `os-${os.osNumber}.pdf`));
    qs('#os-rcpt-close').addEventListener('click', closeModal);
    return;
  }

  if (action === 'edit') {
    _populateServicosForm(os);
    // capture-phase listener in index.html will open the modal when this click fires
    return;
  }

  if (action === 'view') {
    _openOSDetailPanel(os);
    return;
  }

  if (action === 'delete') {
    if (!confirm(`Excluir a O.S. ${os?.osNumber} de "${os?.customerName}"?\nEssa ação não pode ser desfeita.`)) return;
    apiRequest('deleteServiceOrder', { id })
      .then(() => {
        state.servicos = (state.servicos || []).filter(o => o.id !== id);
        closeDrawer();
        renderServicos();
        showToast('Ordem de serviço excluída.');
      })
      .catch(e => showToast(e.message || 'Erro ao excluir.', 'error'));
  }
}

/* ── Populate form for editing ───────────────────────────────── */
function _populateServicosForm(os) {
  const form = document.getElementById('servico-form');
  if (!form) return;
  form.querySelector('[name="id"]').value             = os.id;
  form.querySelector('[name="customerName"]').value   = os.customerName || '';
  form.querySelector('[name="customerPhone"]').value  = os.customerPhone || '';
  form.querySelector('[name="itemDescription"]').value    = os.itemDescription || '';
  form.querySelector('[name="serviceDescription"]').value = os.serviceDescription || '';
  form.querySelector('[name="status"]').value         = os.status || 'Recebido';
  form.querySelector('[name="promisedAt"]').value     = os.promisedAt || '';
  form.querySelector('[name="price"]').value          = os.priceCents ? (os.priceCents / 100).toFixed(2) : '';
  form.querySelector('[name="deposit"]').value        = os.depositCents ? (os.depositCents / 100).toFixed(2) : '0';
  form.querySelector('[name="notes"]').value          = os.notes || '';
}

/* ── Detail side panel ───────────────────────────────────────── */
function _openOSDetailPanel(os) {
  const st      = OS_STATUS[os.status] || OS_STATUS['Recebido'];
  const saldo   = Math.max(0, os.priceCents - os.depositCents);
  const today   = new Date(); today.setHours(0,0,0,0);
  const prazo   = os.promisedAt ? new Date(os.promisedAt + 'T00:00:00') : null;
  const isLate  = prazo && prazo < today && !['Concluido','Entregue','Cancelado'].includes(os.status);
  const entryDate = os.createdAt ? new Date(os.createdAt).toLocaleDateString('pt-BR') : '—';

  openDrawer(`
    <h3 style="display:flex;align-items:center;gap:10px;margin:0 0 16px">
      <span class="os-number-chip">${escapeHtml(os.osNumber || '—')}</span>
      <span class="badge ${st.badge}"><i class="${st.icon}"></i> ${st.label}</span>
    </h3>

    <div class="os-detail-meta">
      <div class="os-detail-row"><i class="fa-solid fa-user"></i><span>Cliente</span><strong>${escapeHtml(os.customerName)}</strong></div>
      ${os.customerPhone ? `<div class="os-detail-row"><i class="fa-solid fa-phone"></i><span>Telefone</span><strong>${escapeHtml(os.customerPhone)}</strong></div>` : ''}
      <div class="os-detail-row"><i class="fa-solid fa-calendar-plus"></i><span>Entrada</span><strong>${entryDate}</strong></div>
      ${prazo ? `<div class="os-detail-row${isLate ? ' os-detail-late' : ''}"><i class="fa-solid fa-calendar-check"></i><span>Prazo${isLate ? ' — ⚠ ATRASADO' : ''}</span><strong>${prazo.toLocaleDateString('pt-BR')}</strong></div>` : ''}
    </div>

    <div class="os-detail-block">
      <h5><i class="fa-solid fa-gem"></i> Item recebido</h5>
      <p>${escapeHtml(os.itemDescription).replace(/\n/g, '<br>')}</p>
    </div>
    <div class="os-detail-block">
      <h5><i class="fa-solid fa-screwdriver-wrench"></i> Serviço a realizar</h5>
      <p>${escapeHtml(os.serviceDescription).replace(/\n/g, '<br>')}</p>
    </div>
    ${os.notes ? `<div class="os-detail-block"><h5><i class="fa-solid fa-note-sticky"></i> Observações internas</h5><p>${escapeHtml(os.notes).replace(/\n/g, '<br>')}</p></div>` : ''}

    ${os.priceCents > 0 ? `
    <div class="os-detail-financial">
      <div class="os-fin-item"><span>Total do serviço</span><strong>${formatCurrency(os.priceCents / 100)}</strong></div>
      ${os.depositCents > 0 ? `<div class="os-fin-item"><span>Sinal recebido</span><strong>${formatCurrency(os.depositCents / 100)}</strong></div>` : ''}
      <div class="os-fin-item os-fin-total"><span>Saldo a receber</span><strong class="${saldo > 0 ? 'text-warning' : 'text-success'}">${formatCurrency(saldo / 100)}</strong></div>
    </div>` : ''}

    <div class="os-detail-actions">
      <button class="btn btn-primary" data-os-action="goldsmith" data-id="${os.id}">
        <i class="fa-solid fa-hammer"></i> Nota para o ourives
      </button>
      <button class="btn btn-ghost" data-os-action="receipt" data-id="${os.id}">
        <i class="fa-solid fa-file-invoice"></i> Comprovante cliente
      </button>
      <button class="btn btn-ghost" data-action="edit-os" data-id="${os.id}">
        <i class="fa-solid fa-pen"></i> Editar
      </button>
      <button class="btn btn-ghost danger" data-os-action="delete" data-id="${os.id}">
        <i class="fa-solid fa-trash"></i> Excluir
      </button>
    </div>
  `);
}

/* ── Form submission ─────────────────────────────────────────── */
async function handleServicoSubmit(event) {
  event.preventDefault();
  const fd  = new FormData(event.target);
  const id  = fd.get('id') || '';
  const payload = {
    id:                  id ? Number(id) : undefined,
    customerName:        fd.get('customerName') || '',
    customerPhone:       fd.get('customerPhone') || '',
    itemDescription:     fd.get('itemDescription') || '',
    serviceDescription:  fd.get('serviceDescription') || '',
    status:              fd.get('status') || 'Recebido',
    promisedAt:          fd.get('promisedAt') || null,
    price:               fd.get('price') || '0',
    deposit:             fd.get('deposit') || '0',
    notes:               fd.get('notes') || '',
  };
  try {
    const saved = await apiRequest('upsertServiceOrder', payload);
    const idx = (state.servicos || []).findIndex(o => o.id === saved.id);
    if (idx >= 0) state.servicos[idx] = saved;
    else state.servicos.unshift(saved);
    event.target.reset();
    event.target.querySelector('[name="id"]').value = '';
    renderServicos();
    showToast(id ? 'O.S. atualizada.' : `${saved.osNumber} criada.`);
  } catch (err) {
    showToast(err.message || 'Erro ao salvar.', 'error');
  }
}

/* ── Events ──────────────────────────────────────────────────── */
function initServicosEvents() {
  const section = document.getElementById('servicos');
  if (!section) return;

  // Row click → detail
  section.addEventListener('click', e => {
    if (e.target.closest('[data-os-action]') || e.target.closest('[data-action]')) return;
    const row = e.target.closest('.os-row');
    if (row) handleOSAction('view', Number(row.dataset.osId));
  });

  // Action buttons
  section.addEventListener('click', e => {
    const btn = e.target.closest('[data-os-action]');
    if (!btn) return;
    e.stopPropagation();
    handleOSAction(btn.dataset.osAction, Number(btn.dataset.id));
  });

  // Edit buttons (data-action="edit-os") — open smart modal via capture-phase listener in index.html
  // but we still need to populate the form first
  section.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="edit-os"]');
    if (!btn) return;
    const os = (state.servicos || []).find(o => o.id === Number(btn.dataset.id));
    if (os) _populateServicosForm(os);
  }, true); // capture: runs before smart-modal capture listener

  // Summary pill filter
  section.addEventListener('click', e => {
    const pill = e.target.closest('[data-os-filter]');
    if (!pill) return;
    const sel = document.getElementById('os-status-filter');
    if (sel) {
      sel.value = sel.value === pill.dataset.osFilter ? '' : pill.dataset.osFilter;
    }
    renderServicos();
  });

  // Search + status filter
  document.getElementById('os-search')?.addEventListener('input', renderServicos);
  document.getElementById('os-status-filter')?.addEventListener('change', renderServicos);

  // Form submission
  const form = document.getElementById('servico-form');
  if (form) form.addEventListener('submit', handleServicoSubmit);
}

// Executed after DOM is ready — this script loads deferred after app.js
initServicosEvents();
