/**
 * GAO Marketing Module v2
 * Calendário editorial, biblioteca de mídia, métricas e campanhas
 */

'use strict';

/* ── Constants ─────────────────────────────────────────────── */

const MKT_PLATFORMS = {
  instagram: { label: 'Instagram', icon: 'fa-brands fa-instagram', color: '#e1306c' },
  facebook:  { label: 'Facebook',  icon: 'fa-brands fa-facebook',  color: '#1877f2' },
  tiktok:    { label: 'TikTok',    icon: 'fa-brands fa-tiktok',    color: '#e91e8c' },
  youtube:   { label: 'YouTube',   icon: 'fa-brands fa-youtube',   color: '#ff0000' },
  pinterest: { label: 'Pinterest', icon: 'fa-brands fa-pinterest', color: '#e60023' },
  threads:   { label: 'Threads',   icon: 'fa-brands fa-threads',   color: '#555' },
  whatsapp:  { label: 'WhatsApp',  icon: 'fa-brands fa-whatsapp',  color: '#25d366' },
};

const MKT_STATUS = {
  draft:     { label: 'Rascunho',  badge: 'badge-muted',   icon: 'fa-solid fa-pen-to-square' },
  scheduled: { label: 'Agendado',  badge: 'badge-blue',    icon: 'fa-solid fa-clock' },
  published: { label: 'Publicado', badge: 'badge-green',   icon: 'fa-solid fa-check-circle' },
  cancelled: { label: 'Cancelado', badge: 'badge-red',     icon: 'fa-solid fa-ban' },
};

const MKT_GOAL_LABELS = {
  awareness:   { label: 'Alcance',      icon: 'fa-solid fa-bullhorn'      },
  engagement:  { label: 'Engajamento',  icon: 'fa-solid fa-heart'         },
  conversion:  { label: 'Conversão',    icon: 'fa-solid fa-arrow-trend-up' },
  followers:   { label: 'Seguidores',   icon: 'fa-solid fa-user-plus'     },
  traffic:     { label: 'Tráfego',      icon: 'fa-solid fa-arrow-pointer' },
};

const MKT_TYPE_LABELS = { feed: 'Feed', story: 'Story', reel: 'Reel', carousel: 'Carrossel', video: 'Vídeo' };

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

/* ── State helpers ──────────────────────────────────────────── */

function mktPostMetrics(postId) {
  return (state.marketing.metrics || []).find(m => m.postId === postId) || null;
}

function mktKpi() {
  const posts     = state.marketing.posts || [];
  const metrics   = state.marketing.metrics || [];
  const published = posts.filter(p => p.status === 'published');
  const scheduled = posts.filter(p => p.status === 'scheduled');
  const totalReach = metrics.reduce((s, m) => s + (m.reach || 0), 0);
  const totalImpr  = metrics.reduce((s, m) => s + (m.impressions || 0), 0);
  const totalEng   = metrics.reduce((s, m) => s + (m.likes || 0) + (m.commentsCount || 0) + (m.saves || 0), 0);
  const engRate    = totalImpr > 0 ? (totalEng / totalImpr * 100) : 0;
  const totalRev   = metrics.reduce((s, m) => s + (m.revenueAttributedCents || 0), 0);
  const totalFoll  = metrics.reduce((s, m) => s + (m.newFollowers || 0), 0);
  return { published: published.length, scheduled: scheduled.length, totalReach, totalImpr, engRate, totalRev, totalFoll };
}

/* ── Formatting ─────────────────────────────────────────────── */

function mktFmtNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function mktFmtBRL(cents) {
  return ((cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mktFmtDatetime(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function mktFmtDate(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  return d.toLocaleDateString('pt-BR');
}

function mktEngRate(m) {
  if (!m || !m.impressions) return null;
  const eng = (m.likes || 0) + (m.commentsCount || 0) + (m.saves || 0);
  return (eng / m.impressions * 100).toFixed(1);
}

/* ── Data loading ───────────────────────────────────────────── */

async function loadMarketing() {
  try {
    const data = await apiRequest('listMarketing');
    state.marketing.posts     = data?.posts     || [];
    state.marketing.campaigns = data?.campaigns || [];
    state.marketing.metrics   = data?.metrics   || [];
    state.marketing.loaded    = true;
    renderMarketing();
  } catch (e) {
    showToast('Erro ao carregar marketing: ' + e.message, 'error');
  }
}

function renderMarketing() {
  _mktUpdateCounts();
  renderMktOverview();
  renderMktCalendar();
  renderMktPostagens();
  renderMktCampanhas();
  renderMktBiblioteca();
  _mktPopulateCampaignFilter();
}

function _mktUpdateCounts() {
  const postsCount = (state.marketing.posts || []).length;
  const campsCount = (state.marketing.campaigns || []).length;
  const pc = document.getElementById('mkt-count-posts');
  const cc = document.getElementById('mkt-count-camps');
  if (pc) pc.textContent = postsCount || '';
  if (cc) cc.textContent = campsCount || '';
}

function _mktPopulateCampaignFilter() {
  const sel = document.getElementById('mkt-filter-campaign');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">Todas campanhas</option>' +
    (state.marketing.campaigns || []).map(c => `<option value="${c.id}" ${current == c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
}

/* ── Overview ───────────────────────────────────────────────── */

function renderMktOverview() {
  _renderKpiRow();
  _renderPlatformChart();
  _renderBestPosts();
  _renderActiveCampaignsMini();
}

function _renderKpiRow() {
  const kpi = mktKpi();
  const el  = document.getElementById('mkt-kpi-row');
  if (!el) return;
  el.innerHTML = `
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(99,102,241,.15);color:#6366f1"><i class="fa-solid fa-images"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${kpi.published}</span>
        <span class="mkt-kpi-label">Publicados</span>
      </div>
    </div>
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(59,130,246,.15);color:#3b82f6"><i class="fa-solid fa-clock"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${kpi.scheduled}</span>
        <span class="mkt-kpi-label">Agendados</span>
      </div>
    </div>
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(16,185,129,.15);color:#10b981"><i class="fa-solid fa-eye"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${mktFmtNum(kpi.totalReach)}</span>
        <span class="mkt-kpi-label">Alcance total</span>
      </div>
    </div>
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(245,158,11,.15);color:#f59e0b"><i class="fa-solid fa-heart"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${kpi.engRate.toFixed(1)}%</span>
        <span class="mkt-kpi-label">Engajamento</span>
      </div>
    </div>
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(139,92,246,.15);color:#8b5cf6"><i class="fa-solid fa-user-plus"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${mktFmtNum(kpi.totalFoll)}</span>
        <span class="mkt-kpi-label">Novos seguidores</span>
      </div>
    </div>
    <div class="mkt-kpi">
      <div class="mkt-kpi-icon" style="background:rgba(239,68,68,.15);color:#ef4444"><i class="fa-solid fa-sack-dollar"></i></div>
      <div class="mkt-kpi-body">
        <span class="mkt-kpi-val">${mktFmtBRL(kpi.totalRev)}</span>
        <span class="mkt-kpi-label">Receita atribuída</span>
      </div>
    </div>
  `;
}

function _renderPlatformChart() {
  const el = document.getElementById('mkt-platform-chart');
  if (!el) return;
  const posts = state.marketing.posts || [];
  const byPlatform = {};
  posts.forEach(p => { byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1; });
  const total = posts.length || 1;
  const sorted = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);
  el.innerHTML = sorted.map(([plat, count]) => {
    const p = MKT_PLATFORMS[plat] || { label: plat, color: '#888', icon: 'fa-solid fa-globe' };
    const pct = Math.round(count / total * 100);
    return `<div class="mkt-plat-bar-row">
      <span class="mkt-plat-bar-label"><i class="${p.icon}" style="color:${p.color}"></i> ${p.label}</span>
      <div class="mkt-plat-bar-track">
        <div class="mkt-plat-bar-fill" style="width:${pct}%;background:${p.color}"></div>
      </div>
      <span class="mkt-plat-bar-count">${count}</span>
    </div>`;
  }).join('') || '<p class="muted" style="font-size:12px">Sem dados ainda.</p>';
}

function _renderBestPosts() {
  const el = document.getElementById('mkt-best-posts');
  if (!el) return;
  const posts = [...(state.marketing.posts || [])]
    .filter(p => p.status === 'published')
    .sort((a, b) => {
      const ma = mktPostMetrics(a.id), mb = mktPostMetrics(b.id);
      return (mb?.reach || 0) - (ma?.reach || 0);
    })
    .slice(0, 6);
  el.innerHTML = posts.length
    ? posts.map(p => _mktPostCardHtml(p)).join('')
    : `<div class="mkt-empty-state"><i class="fa-solid fa-images"></i><p>Nenhum post publicado ainda.</p><button class="btn btn-primary btn-sm mkt-new-post-btn"><i class="fa-solid fa-plus"></i> Criar primeira postagem</button></div>`;
}

function _renderActiveCampaignsMini() {
  const el = document.getElementById('mkt-active-campaigns');
  if (!el) return;
  const active = (state.marketing.campaigns || []).filter(c => c.status === 'active').slice(0, 3);
  el.innerHTML = active.map(c => {
    const goal = MKT_GOAL_LABELS[c.goal] || { label: c.goal, icon: 'fa-solid fa-flag' };
    const progress = c.budgetCents > 0 ? Math.min(100, (c.revenueCents / c.budgetCents) * 100) : 0;
    return `<div class="mkt-camp-mini" data-mkt-action="edit-campaign" data-id="${c.id}" style="cursor:pointer">
      <div class="mkt-camp-mini-head">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="mkt-goal-pill"><i class="${goal.icon}"></i> ${goal.label}</span>
        </div>
        <span class="mkt-camp-mini-posts">${c.postsCount} posts</span>
      </div>
      <div class="mkt-camp-mini-stats">
        <span><i class="fa-solid fa-eye"></i> ${mktFmtNum(c.totalReach)}</span>
        <span><i class="fa-solid fa-sack-dollar"></i> ${mktFmtBRL(c.revenueCents)}</span>
      </div>
      ${c.budgetCents > 0 ? `
      <div class="mkt-progress-wrap" title="${mktFmtBRL(c.revenueCents)} de ${mktFmtBRL(c.budgetCents)}">
        <div class="mkt-progress-bar" style="width:${progress}%"></div>
      </div>` : ''}
    </div>`;
  }).join('') || '<p class="muted" style="font-size:12px;padding:8px 0">Nenhuma campanha ativa.</p>';
}

/* ── Post card ──────────────────────────────────────────────── */

function _mktPostCardHtml(p) {
  const plat  = MKT_PLATFORMS[p.platform] || MKT_PLATFORMS.instagram;
  const st    = MKT_STATUS[p.status] || MKT_STATUS.draft;
  const m     = mktPostMetrics(p.id);
  const er    = mktEngRate(m);
  const imgs  = p.imageUrls || [];

  const thumbsHtml = imgs.length
    ? `<div class="mkt-card-imgs">
        ${imgs.slice(0, 4).map((u, i) => `<img src="${escapeHtml(u)}" class="mkt-card-img" alt="" data-mkt-action="preview-img" data-src="${escapeHtml(u)}">`).join('')}
        ${imgs.length > 4 ? `<div class="mkt-card-img-more">+${imgs.length - 4}</div>` : ''}
      </div>`
    : `<div class="mkt-card-imgs mkt-no-img" style="border-color:${plat.color}22">
        <i class="${plat.icon}" style="color:${plat.color};opacity:.4;font-size:32px"></i>
      </div>`;

  return `<div class="mkt-post-card" data-post-id="${p.id}">
    ${thumbsHtml}
    <div class="mkt-card-body">
      <div class="mkt-card-meta-row">
        <span class="mkt-plat-tag" style="color:${plat.color}"><i class="${plat.icon}"></i> ${plat.label}</span>
        <span class="mkt-type-tag">${MKT_TYPE_LABELS[p.postType] || p.postType}</span>
        <span class="badge ${st.badge}" style="margin-left:auto"><i class="${st.icon}"></i> ${st.label}</span>
      </div>
      <p class="mkt-card-title">${escapeHtml(p.title || '(sem título)')}</p>
      ${p.caption ? `<p class="mkt-card-caption">${escapeHtml(p.caption.slice(0, 100))}${p.caption.length > 100 ? '…' : ''}</p>` : ''}
      ${p.scheduledAt ? `<p class="mkt-card-date"><i class="fa-solid fa-calendar-check"></i> ${mktFmtDatetime(p.scheduledAt)}</p>` : ''}
      ${p.campaignName ? `<p class="mkt-card-campaign"><i class="fa-solid fa-flag"></i> ${escapeHtml(p.campaignName)}</p>` : ''}
      ${m ? `<div class="mkt-card-metrics-row">
        <span title="Alcance"><i class="fa-solid fa-eye"></i> ${mktFmtNum(m.reach)}</span>
        <span title="Curtidas"><i class="fa-solid fa-heart"></i> ${mktFmtNum(m.likes)}</span>
        <span title="Salvamentos"><i class="fa-solid fa-bookmark"></i> ${mktFmtNum(m.saves)}</span>
        <span title="Comentários"><i class="fa-solid fa-comment"></i> ${mktFmtNum(m.commentsCount)}</span>
        ${er !== null ? `<span title="Engajamento" class="mkt-eng-rate">${er}%</span>` : ''}
      </div>` : ''}
    </div>
    <div class="mkt-card-footer">
      <button class="btn btn-ghost btn-xs" data-mkt-action="edit-post" data-id="${p.id}" title="Editar"><i class="fa-solid fa-pen"></i> Editar</button>
      <button class="btn btn-ghost btn-xs" data-mkt-action="metrics-post" data-id="${p.id}" title="Métricas"><i class="fa-solid fa-chart-bar"></i> Métricas</button>
      <button class="btn btn-ghost btn-xs danger" data-mkt-action="delete-post" data-id="${p.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
    </div>
  </div>`;
}

function _mktPostRowHtml(p) {
  const plat = MKT_PLATFORMS[p.platform] || MKT_PLATFORMS.instagram;
  const st   = MKT_STATUS[p.status] || MKT_STATUS.draft;
  const m    = mktPostMetrics(p.id);
  const thumb = (p.imageUrls || [])[0]
    ? `<img src="${escapeHtml(p.imageUrls[0])}" class="mkt-table-thumb" alt="">`
    : `<div class="mkt-table-thumb mkt-thumb-ph"><i class="${plat.icon}" style="color:${plat.color}"></i></div>`;
  return `<tr>
    <td>${thumb}</td>
    <td><strong>${escapeHtml(p.title || '(sem título)')}</strong><br><small class="muted">${escapeHtml((p.caption || '').slice(0,60))}${(p.caption || '').length > 60 ? '…' : ''}</small></td>
    <td><span style="color:${plat.color}"><i class="${plat.icon}"></i> ${plat.label}</span></td>
    <td>${MKT_TYPE_LABELS[p.postType] || p.postType}</td>
    <td><span class="badge ${st.badge}"><i class="${st.icon}"></i> ${st.label}</span></td>
    <td class="muted">${p.scheduledAt ? mktFmtDatetime(p.scheduledAt) : '—'}</td>
    <td class="muted">${p.campaignName ? escapeHtml(p.campaignName) : '—'}</td>
    <td>${m ? mktFmtNum(m.reach) : '<span class="muted">—</span>'}</td>
    <td class="actions-cell">
      <button class="btn btn-ghost action-btn" data-mkt-action="edit-post" data-id="${p.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-ghost action-btn" data-mkt-action="metrics-post" data-id="${p.id}" title="Métricas"><i class="fa-solid fa-chart-bar"></i></button>
      <button class="btn btn-ghost action-btn danger" data-mkt-action="delete-post" data-id="${p.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
    </td>
  </tr>`;
}

/* ── Calendar ───────────────────────────────────────────────── */

function renderMktCalendar() {
  const label = document.getElementById('mkt-cal-label');
  const grid  = document.getElementById('mkt-cal-grid');
  const legend= document.getElementById('mkt-cal-legend');
  if (!label || !grid) return;

  label.textContent = `${MONTHS_PT[state.mktCalMonth]} ${state.mktCalYear}`;

  // Build legend
  if (legend) {
    const platsUsed = [...new Set((state.marketing.posts || []).map(p => p.platform))];
    legend.innerHTML = platsUsed.map(k => {
      const p = MKT_PLATFORMS[k] || { label: k, color: '#888', icon: 'fa-solid fa-globe' };
      return `<span class="mkt-cal-legend-item"><i class="${p.icon}" style="color:${p.color}"></i> ${p.label}</span>`;
    }).join('');
  }

  const year = state.mktCalYear, month = state.mktCalMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const postsByDay = {};
  (state.marketing.posts || []).forEach(p => {
    const dt = p.scheduledAt || p.publishedAt;
    if (!dt) return;
    const d = new Date(dt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!postsByDay[day]) postsByDay[day] = [];
      postsByDay[day].push(p);
    }
  });

  let html = '';
  for (let i = 0; i < firstDay; i++) html += `<div class="mkt-cal-cell empty"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    const posts   = postsByDay[day] || [];
    html += `<div class="mkt-cal-cell${isToday ? ' today' : ''}" data-day="${day}">
      <span class="mkt-cal-day-num">${day}</span>
      <div class="mkt-cal-pills">
        ${posts.slice(0, 3).map(p => {
          const pl = MKT_PLATFORMS[p.platform] || MKT_PLATFORMS.instagram;
          const st = MKT_STATUS[p.status] || MKT_STATUS.draft;
          const thumb = (p.imageUrls || [])[0] ? `<img src="${escapeHtml(p.imageUrls[0])}" style="width:14px;height:14px;border-radius:2px;object-fit:cover;flex-shrink:0">` : `<i class="${pl.icon}" style="color:${pl.color};font-size:10px;flex-shrink:0"></i>`;
          return `<div class="mkt-cal-pill" style="border-left-color:${pl.color}" data-mkt-action="edit-post" data-id="${p.id}">
            ${thumb}<span>${escapeHtml(p.title?.slice(0, 16) || MKT_TYPE_LABELS[p.postType])}</span>
          </div>`;
        }).join('')}
        ${posts.length > 3 ? `<div class="mkt-cal-pill-more">+${posts.length - 3} mais</div>` : ''}
      </div>
      <button class="mkt-cal-add" data-mkt-action="new-post-day" data-day="${day}"><i class="fa-solid fa-plus"></i></button>
    </div>`;
  }
  grid.innerHTML = html;
}

/* ── Postagens tab ──────────────────────────────────────────── */

let mktPostView = 'grid'; // 'grid' | 'list'

function renderMktPostagens() {
  _renderStatusFilters();
  _renderPostsContainer();
}

function _renderStatusFilters() {
  const el = document.getElementById('mkt-status-filters');
  if (!el) return;
  const posts = state.marketing.posts || [];
  const counts = { all: posts.length };
  Object.keys(MKT_STATUS).forEach(s => { counts[s] = posts.filter(p => p.status === s).length; });
  const current = el.querySelector('.mkt-status-pill.active')?.dataset.status || 'all';
  el.innerHTML = [
    { key: 'all', label: 'Todos', count: counts.all },
    ...Object.entries(MKT_STATUS).map(([k, v]) => ({ key: k, label: v.label, count: counts[k] }))
  ].map(({ key, label, count }) =>
    `<button class="mkt-status-pill${current === key ? ' active' : ''}" data-status="${key}">${label} <span class="mkt-pill-count">${count}</span></button>`
  ).join('');
}

function _renderPostsContainer() {
  const container = document.getElementById('mkt-posts-container');
  if (!container) return;

  const platFilter   = document.getElementById('mkt-filter-platform')?.value || '';
  const campFilter   = document.getElementById('mkt-filter-campaign')?.value || '';
  const statusEl     = document.querySelector('#mkt-postagens .mkt-status-pill.active');
  const statusFilter = statusEl?.dataset.status || 'all';

  let posts = [...(state.marketing.posts || [])];
  if (platFilter)              posts = posts.filter(p => p.platform === platFilter);
  if (campFilter)              posts = posts.filter(p => String(p.campaignId) === campFilter);
  if (statusFilter !== 'all')  posts = posts.filter(p => p.status === statusFilter);
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (mktPostView === 'grid') {
    container.innerHTML = posts.length
      ? `<div class="mkt-cards-grid">${posts.map(_mktPostCardHtml).join('')}</div>`
      : `<div class="mkt-empty-state"><i class="fa-solid fa-filter"></i><p>Nenhuma postagem com esses filtros.</p></div>`;
  } else {
    container.innerHTML = `<div class="table-wrap"><table class="table">
      <thead><tr><th>Arte</th><th>Título / Caption</th><th>Plataforma</th><th>Tipo</th><th>Status</th><th>Agendado</th><th>Campanha</th><th>Alcance</th><th>Ações</th></tr></thead>
      <tbody>${posts.map(_mktPostRowHtml).join('') || `<tr><td colspan="9" class="empty-row">Nenhuma postagem.</td></tr>`}</tbody>
    </table></div>`;
  }
}

/* ── Campanhas tab ──────────────────────────────────────────── */

function renderMktCampanhas() {
  const grid = document.getElementById('mkt-campaigns-grid');
  if (!grid) return;

  const statusFilter = document.getElementById('mkt-filter-camp-status')?.value || '';
  let camps = [...(state.marketing.campaigns || [])];
  if (statusFilter) camps = camps.filter(c => c.status === statusFilter);
  camps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  grid.innerHTML = camps.map(c => {
    const goal = MKT_GOAL_LABELS[c.goal] || { label: c.goal, icon: 'fa-solid fa-flag' };
    const statusMap = { draft: { label: 'Rascunho', badge: 'badge-muted' }, active: { label: 'Ativa', badge: 'badge-green' }, paused: { label: 'Pausada', badge: 'badge-blue' }, completed: { label: 'Concluída', badge: 'badge-purple' }, cancelled: { label: 'Cancelada', badge: 'badge-red' } };
    const st = statusMap[c.status] || { label: c.status, badge: 'badge-muted' };
    const progress = c.budgetCents > 0 ? Math.min(100, Math.round(c.revenueCents / c.budgetCents * 100)) : 0;
    const roi = c.budgetCents > 0 ? Math.round((c.revenueCents - c.budgetCents) / c.budgetCents * 100) : null;

    // Posts of this campaign
    const campPosts = (state.marketing.posts || []).filter(p => p.campaignId === c.id);
    const thumbs = campPosts.flatMap(p => p.imageUrls || []).slice(0, 4);

    return `<div class="mkt-camp-card">
      <div class="mkt-camp-card-header">
        ${thumbs.length ? `<div class="mkt-camp-thumbs">${thumbs.map(u => `<img src="${escapeHtml(u)}" class="mkt-camp-thumb" alt="">`).join('')}</div>` : ''}
        <div class="mkt-camp-card-top">
          <div>
            <span class="badge ${st.badge}">${st.label}</span>
            <h5 class="mkt-camp-name">${escapeHtml(c.name)}</h5>
            ${c.description ? `<p class="mkt-camp-desc">${escapeHtml(c.description)}</p>` : ''}
          </div>
          <div class="mkt-camp-card-actions">
            <button class="btn btn-ghost btn-xs" data-mkt-action="edit-campaign" data-id="${c.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-ghost btn-xs danger" data-mkt-action="delete-campaign" data-id="${c.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
      <div class="mkt-camp-meta">
        <span><i class="${goal.icon}"></i> ${goal.label}</span>
        ${c.startDate ? `<span><i class="fa-solid fa-calendar"></i> ${mktFmtDate(c.startDate)}${c.endDate ? ' → ' + mktFmtDate(c.endDate) : ''}</span>` : ''}
        ${c.budgetCents ? `<span><i class="fa-solid fa-wallet"></i> ${mktFmtBRL(c.budgetCents)}</span>` : ''}
      </div>
      <div class="mkt-camp-stats-row">
        <div class="mkt-camp-stat"><span class="mkt-camp-stat-val">${c.postsCount}</span><span class="mkt-camp-stat-label">Posts</span></div>
        <div class="mkt-camp-stat"><span class="mkt-camp-stat-val">${mktFmtNum(c.totalReach)}</span><span class="mkt-camp-stat-label">Alcance</span></div>
        <div class="mkt-camp-stat"><span class="mkt-camp-stat-val">${mktFmtBRL(c.revenueCents)}</span><span class="mkt-camp-stat-label">Receita</span></div>
        ${roi !== null ? `<div class="mkt-camp-stat"><span class="mkt-camp-stat-val" style="color:${roi >= 0 ? '#10b981' : '#ef4444'}">${roi >= 0 ? '+' : ''}${roi}%</span><span class="mkt-camp-stat-label">ROI</span></div>` : ''}
      </div>
      ${c.budgetCents > 0 ? `
      <div class="mkt-camp-progress-row">
        <div class="mkt-progress-wrap">
          <div class="mkt-progress-bar" style="width:${progress}%"></div>
        </div>
        <span class="mkt-progress-label">${mktFmtBRL(c.revenueCents)} de ${mktFmtBRL(c.budgetCents)} (${progress}%)</span>
      </div>` : ''}
      ${campPosts.length ? `<div class="mkt-camp-posts-strip">
        <span class="muted" style="font-size:11px;margin-right:6px">${campPosts.length} postagens:</span>
        ${campPosts.slice(0, 5).map(p => {
          const pl = MKT_PLATFORMS[p.platform] || MKT_PLATFORMS.instagram;
          return `<span class="mkt-cal-pill" style="border-left-color:${pl.color}" data-mkt-action="edit-post" data-id="${p.id}"><i class="${pl.icon}" style="color:${pl.color};font-size:9px"></i><span>${escapeHtml(p.title?.slice(0,14) || 'Post')}</span></span>`;
        }).join('')}
        ${campPosts.length > 5 ? `<span class="muted" style="font-size:11px">+${campPosts.length - 5}</span>` : ''}
      </div>` : ''}
    </div>`;
  }).join('') || `<div class="mkt-empty-state"><i class="fa-solid fa-flag"></i><p>Nenhuma campanha criada ainda.</p><button class="btn btn-primary btn-sm mkt-new-campaign-btn"><i class="fa-solid fa-plus"></i> Criar campanha</button></div>`;
}

/* ── Biblioteca (Media Library) ─────────────────────────────── */

function renderMktBiblioteca() {
  const grid = document.getElementById('mkt-library-grid');
  const cnt  = document.getElementById('mkt-lib-count');
  if (!grid) return;

  // Collect all images from all posts with their post context
  const items = [];
  (state.marketing.posts || []).forEach(p => {
    (p.imageUrls || []).forEach((url, idx) => {
      items.push({ url, post: p, idx });
    });
  });

  // Also try to find img/uploads images from products that might be reused
  if (cnt) cnt.textContent = `${items.length} imagens em ${(state.marketing.posts || []).length} postagens`;

  if (!items.length) {
    grid.innerHTML = `<div class="mkt-empty-state">
      <i class="fa-solid fa-photo-film"></i>
      <p>Nenhuma imagem cadastrada ainda.</p>
      <p class="muted" style="font-size:12px">Crie uma postagem e faça upload das imagens.</p>
    </div>`;
    return;
  }

  grid.innerHTML = items.map(({ url, post }) => {
    const pl = MKT_PLATFORMS[post.platform] || MKT_PLATFORMS.instagram;
    const st = MKT_STATUS[post.status] || MKT_STATUS.draft;
    return `<div class="mkt-lib-item" data-url="${escapeHtml(url)}">
      <div class="mkt-lib-img-wrap">
        <img src="${escapeHtml(url)}" alt="" loading="lazy" data-mkt-action="preview-img" data-src="${escapeHtml(url)}">
        <div class="mkt-lib-overlay">
          <button class="btn btn-ghost btn-xs" data-mkt-action="preview-img" data-src="${escapeHtml(url)}" title="Ver"><i class="fa-solid fa-expand"></i></button>
          <button class="btn btn-ghost btn-xs" data-mkt-action="use-lib-img" data-url="${escapeHtml(url)}" title="Usar em nova postagem"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <div class="mkt-lib-info">
        <p class="mkt-lib-name">${escapeHtml(post.title || '(sem título)')}</p>
        <span style="color:${pl.color};font-size:10px"><i class="${pl.icon}"></i> ${pl.label}</span>
        <span class="badge ${st.badge}" style="font-size:9px">${st.label}</span>
      </div>
    </div>`;
  }).join('');
}

/* ── Image upload ───────────────────────────────────────────── */

async function mktUploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const resp = await fetch('api/upload.php', { method: 'POST', credentials: 'same-origin', body: fd });
  const data = await resp.json().catch(() => null);
  if (!data?.ok) throw new Error(data?.error || 'Falha no upload');
  return data.url;
}

async function mktUploadLibraryFiles(files) {
  const progressEl = document.getElementById('mkt-lib-uploading');
  if (progressEl) { progressEl.classList.remove('hidden'); progressEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fazendo upload...'; }
  const urls = [];
  for (const file of Array.from(files)) {
    try {
      const url = await mktUploadImage(file);
      urls.push(url);
    } catch (e) {
      showToast('Erro: ' + e.message, 'error');
    }
  }
  if (progressEl) progressEl.classList.add('hidden');
  if (urls.length) {
    openPostModal(null, null, urls);
    showToast(`${urls.length} imagens carregadas. Preencha os dados da postagem.`);
  }
}

/* ── Post Modal (with drag & drop upload) ───────────────────── */

function openPostModal(post = null, prefillDay = null, prefillUrls = []) {
  const camps  = state.marketing.campaigns || [];
  const isEdit = !!post;
  const sched  = post?.scheduledAt
    ? post.scheduledAt.slice(0, 16)
    : prefillDay
      ? `${state.mktCalYear}-${String(state.mktCalMonth + 1).padStart(2, '0')}-${String(prefillDay).padStart(2, '0')}T12:00`
      : '';

  const initialUrls = [...(post?.imageUrls || []), ...prefillUrls];

  openModal(`
    <div class="mkt-modal-header">
      <h3>${isEdit ? '<i class="fa-solid fa-pen"></i> Editar postagem' : '<i class="fa-solid fa-plus"></i> Nova postagem'}</h3>
    </div>
    <form id="mkt-post-form">
      <div class="mkt-modal-body">

        <!-- Upload zone -->
        <div class="mkt-upload-section">
          <div class="mkt-dropzone" id="mkt-dropzone">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <strong>Arraste imagens aqui</strong>
            <span>ou <label class="mkt-dz-link">clique para selecionar<input type="file" id="mkt-file-input" multiple accept="image/*" style="display:none"></label></span>
            <span class="muted" style="font-size:11px">JPG, PNG, WEBP até 8MB cada</span>
          </div>
          <div id="mkt-img-previews" class="mkt-img-previews"></div>
          <div id="mkt-upload-progress" class="mkt-upload-progress hidden"></div>
        </div>

        <div class="mkt-modal-fields">
          <input type="hidden" name="id" value="${post?.id || ''}">

          <label class="full">Título da postagem
            <input type="text" name="title" value="${escapeHtml(post?.title || '')}" placeholder="Ex: Colar Riviera Safira — Lançamento verão">
          </label>

          <label class="full">
            Legenda / Caption
            <textarea name="caption" rows="5" maxlength="2200" id="mkt-caption-input" placeholder="Escreva a legenda da postagem. Use hashtags e emojis...">${escapeHtml(post?.caption || '')}</textarea>
            <div class="mkt-caption-meta">
              <span id="mkt-char-count">0 / 2.200</span>
              <span id="mkt-hashtag-count">0 hashtags</span>
            </div>
          </label>

          <div class="mkt-fields-row">
            <label>Plataforma
              <select name="platform" id="mkt-platform-sel">
                ${Object.entries(MKT_PLATFORMS).map(([k, v]) => `<option value="${k}" ${(post?.platform || 'instagram') === k ? 'selected' : ''}>${v.label}</option>`).join('')}
              </select>
            </label>
            <label>Tipo de post
              <select name="postType">
                ${Object.entries(MKT_TYPE_LABELS).map(([k, v]) => `<option value="${k}" ${(post?.postType || 'feed') === k ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </label>
            <label>Status
              <select name="status">
                ${Object.entries(MKT_STATUS).map(([k, v]) => `<option value="${k}" ${(post?.status || 'draft') === k ? 'selected' : ''}>${v.label}</option>`).join('')}
              </select>
            </label>
          </div>

          <div class="mkt-fields-row">
            <label>Agendado para
              <input type="datetime-local" name="scheduledAt" value="${escapeHtml(sched)}">
            </label>
            <label>Publicado em
              <input type="datetime-local" name="publishedAt" value="${escapeHtml(post?.publishedAt?.slice(0, 16) || '')}">
            </label>
            <label>Campanha
              <select name="campaignId">
                <option value="">Nenhuma</option>
                ${camps.map(c => `<option value="${c.id}" ${post?.campaignId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
              </select>
            </label>
          </div>

          <label>Tags <small class="muted">(separadas por vírgula)</small>
            <input type="text" name="tags" value="${escapeHtml(post?.tags || '')}" placeholder="#joias, #prata, #conjunto">
          </label>

          <label>Observações internas
            <textarea name="notes" rows="2">${escapeHtml(post?.notes || '')}</textarea>
          </label>
        </div>
      </div>

      <div class="mkt-modal-footer">
        <button type="button" class="btn btn-ghost" id="mkt-post-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> ${isEdit ? 'Salvar alterações' : 'Criar postagem'}</button>
      </div>
    </form>
  `);

  // Image state
  let uploadedUrls = [...initialUrls];

  function renderPreviews() {
    const el = document.getElementById('mkt-img-previews');
    if (!el) return;
    el.innerHTML = uploadedUrls.map((url, i) =>
      `<div class="mkt-preview-item">
        <img src="${escapeHtml(url)}" alt="">
        <button type="button" class="mkt-preview-remove" data-idx="${i}" title="Remover"><i class="fa-solid fa-times"></i></button>
        ${i === 0 ? '<span class="mkt-preview-primary">Principal</span>' : ''}
      </div>`
    ).join('');
    // Remove buttons
    el.querySelectorAll('.mkt-preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        uploadedUrls.splice(Number(btn.dataset.idx), 1);
        renderPreviews();
      });
    });
  }
  renderPreviews();

  // Caption counter
  const captionEl = document.getElementById('mkt-caption-input');
  const charCountEl = document.getElementById('mkt-char-count');
  const hashCountEl = document.getElementById('mkt-hashtag-count');
  function updateCaptionMeta() {
    const val = captionEl?.value || '';
    if (charCountEl) charCountEl.textContent = `${val.length.toLocaleString('pt-BR')} / 2.200`;
    if (hashCountEl) hashCountEl.textContent = `${(val.match(/#\w+/g) || []).length} hashtags`;
  }
  captionEl?.addEventListener('input', updateCaptionMeta);
  updateCaptionMeta();

  // File upload handler
  async function handleFiles(files) {
    const progressEl = document.getElementById('mkt-upload-progress');
    if (progressEl) { progressEl.classList.remove('hidden'); progressEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fazendo upload…'; }
    for (const file of Array.from(files)) {
      try {
        const url = await mktUploadImage(file);
        uploadedUrls.push(url);
        renderPreviews();
      } catch (e) {
        showToast('Erro no upload: ' + e.message, 'error');
      }
    }
    if (progressEl) { progressEl.classList.add('hidden'); }
  }

  // Dropzone events
  const dz = document.getElementById('mkt-dropzone');
  const fi = document.getElementById('mkt-file-input');
  fi?.addEventListener('change', e => handleFiles(e.target.files));
  dz?.addEventListener('click', () => fi?.click());
  dz?.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dz-over'); });
  dz?.addEventListener('dragleave', () => dz.classList.remove('dz-over'));
  dz?.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('dz-over');
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  });

  document.getElementById('mkt-post-cancel')?.addEventListener('click', closeModal);

  document.getElementById('mkt-post-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      id: fd.get('id') || undefined,
      title: fd.get('title'), caption: fd.get('caption'),
      platform: fd.get('platform'), postType: fd.get('postType'),
      status: fd.get('status'), scheduledAt: fd.get('scheduledAt'),
      publishedAt: fd.get('publishedAt'), campaignId: fd.get('campaignId'),
      tags: fd.get('tags'), notes: fd.get('notes'),
      imageUrls: uploadedUrls,
    };
    try {
      const saved = await apiRequest('upsertPost', payload);
      const idx = (state.marketing.posts || []).findIndex(p => p.id === saved.id);
      if (idx >= 0) state.marketing.posts[idx] = saved;
      else state.marketing.posts.unshift(saved);
      closeModal();
      renderMarketing();
      showToast(isEdit ? 'Postagem atualizada.' : 'Postagem criada.');
    } catch (err) { showToast(err.message || 'Erro ao salvar.', 'error'); }
  });
}

/* ── Campaign Modal ─────────────────────────────────────────── */

function openCampaignModal(campaign = null) {
  const isEdit = !!campaign;
  openModal(`
    <div class="mkt-modal-header">
      <h3>${isEdit ? '<i class="fa-solid fa-pen"></i> Editar campanha' : '<i class="fa-solid fa-flag"></i> Nova campanha'}</h3>
    </div>
    <form id="mkt-camp-form">
      <div class="mkt-modal-body" style="display:block;padding:20px">
        <input type="hidden" name="id" value="${campaign?.id || ''}">
        <div class="form-grid">
          <label class="full">Nome da campanha
            <input type="text" name="name" value="${escapeHtml(campaign?.name || '')}" required placeholder="Ex: Coleção Verão 2026">
          </label>
          <label class="full">Descrição <small class="muted">(opcional)</small>
            <textarea name="description" rows="2" placeholder="Objetivo e contexto da campanha...">${escapeHtml(campaign?.description || '')}</textarea>
          </label>
          <label>Objetivo
            <select name="goal">
              ${Object.entries(MKT_GOAL_LABELS).map(([k, v]) => `<option value="${k}" ${(campaign?.goal || 'engagement') === k ? 'selected' : ''}><i class="${v.icon}"></i> ${v.label}</option>`).join('')}
            </select>
          </label>
          <label>Status
            <select name="status">
              <option value="draft" ${(campaign?.status || 'draft') === 'draft' ? 'selected' : ''}>Rascunho</option>
              <option value="active" ${campaign?.status === 'active' ? 'selected' : ''}>Ativa</option>
              <option value="paused" ${campaign?.status === 'paused' ? 'selected' : ''}>Pausada</option>
              <option value="completed" ${campaign?.status === 'completed' ? 'selected' : ''}>Concluída</option>
              <option value="cancelled" ${campaign?.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
            </select>
          </label>
          <label>Data de início
            <input type="date" name="startDate" value="${campaign?.startDate || ''}">
          </label>
          <label>Data de término
            <input type="date" name="endDate" value="${campaign?.endDate || ''}">
          </label>
          <label>Verba investida (R$)
            <input type="number" step="0.01" min="0" name="budget" value="${campaign?.budgetCents ? (campaign.budgetCents / 100).toFixed(2) : ''}">
          </label>
        </div>
      </div>
      <div class="mkt-modal-footer">
        <button type="button" class="btn btn-ghost" id="mkt-camp-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> ${isEdit ? 'Salvar' : 'Criar campanha'}</button>
      </div>
    </form>
  `);
  document.getElementById('mkt-camp-cancel')?.addEventListener('click', closeModal);
  document.getElementById('mkt-camp-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const saved = await apiRequest('upsertCampaign', Object.fromEntries(fd));
      const idx = (state.marketing.campaigns || []).findIndex(c => c.id === saved.id);
      if (idx >= 0) state.marketing.campaigns[idx] = saved;
      else state.marketing.campaigns.unshift(saved);
      closeModal();
      renderMarketing();
      showToast(isEdit ? 'Campanha atualizada.' : 'Campanha criada.');
    } catch (err) { showToast(err.message || 'Erro ao salvar.', 'error'); }
  });
}

/* ── Metrics Modal ──────────────────────────────────────────── */

function openMetricsModal(postId) {
  const post = (state.marketing.posts || []).find(p => p.id === postId);
  const m    = mktPostMetrics(postId);
  const plat = MKT_PLATFORMS[post?.platform] || MKT_PLATFORMS.instagram;
  const er   = mktEngRate(m);

  openModal(`
    <div class="mkt-modal-header">
      <h3><i class="${plat.icon}" style="color:${plat.color}"></i> Métricas — ${escapeHtml(post?.title || 'Postagem')}</h3>
      <p class="muted" style="font-size:12px;margin:4px 0 0">Copie os dados do ${plat.label} Insights e cole aqui.</p>
    </div>
    ${m && er !== null ? `<div class="mkt-metrics-summary">
      <span><i class="fa-solid fa-eye"></i> Alcance: <strong>${mktFmtNum(m.reach)}</strong></span>
      <span><i class="fa-solid fa-heart"></i> Curtidas: <strong>${mktFmtNum(m.likes)}</strong></span>
      <span><i class="fa-solid fa-chart-bar"></i> Engajamento: <strong>${er}%</strong></span>
      <span><i class="fa-solid fa-sack-dollar"></i> Receita: <strong>${mktFmtBRL(m.revenueAttributedCents)}</strong></span>
    </div>` : ''}
    <form id="mkt-metrics-form">
      <div class="mkt-modal-body" style="display:block;padding:20px">
        <input type="hidden" name="postId" value="${postId}">
        <input type="hidden" name="id" value="${m?.id || ''}">
        <div class="mkt-metrics-grid">
          <div class="mkt-metric-group">
            <p class="mkt-metric-group-label"><i class="fa-solid fa-chart-line"></i> Alcance e Impressões</p>
            <label>Alcance (pessoas únicas)<input type="number" min="0" name="reach" value="${m?.reach || 0}"></label>
            <label>Impressões (visualizações)<input type="number" min="0" name="impressions" value="${m?.impressions || 0}"></label>
            <label>Visitas ao perfil<input type="number" min="0" name="profileVisits" value="${m?.profileVisits || 0}"></label>
          </div>
          <div class="mkt-metric-group">
            <p class="mkt-metric-group-label"><i class="fa-solid fa-heart"></i> Engajamento</p>
            <label>Curtidas<input type="number" min="0" name="likes" value="${m?.likes || 0}"></label>
            <label>Comentários<input type="number" min="0" name="commentsCount" value="${m?.commentsCount || 0}"></label>
            <label>Salvamentos<input type="number" min="0" name="saves" value="${m?.saves || 0}"></label>
            <label>Compartilhamentos<input type="number" min="0" name="shares" value="${m?.shares || 0}"></label>
          </div>
          <div class="mkt-metric-group">
            <p class="mkt-metric-group-label"><i class="fa-solid fa-arrow-trend-up"></i> Conversão</p>
            <label>Cliques no link<input type="number" min="0" name="clicks" value="${m?.clicks || 0}"></label>
            <label>Novos seguidores<input type="number" min="0" name="newFollowers" value="${m?.newFollowers || 0}"></label>
            <label>Receita atribuída (R$)
              <input type="number" min="0" step="0.01" name="revenueAttributed" value="${m?.revenueAttributedCents ? (m.revenueAttributedCents / 100).toFixed(2) : '0'}">
            </label>
          </div>
        </div>
        <label style="margin-top:12px">Observações
          <textarea name="notes" rows="2">${escapeHtml(m?.notes || '')}</textarea>
        </label>
      </div>
      <div class="mkt-modal-footer">
        <button type="button" class="btn btn-ghost" id="mkt-met-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Salvar métricas</button>
      </div>
    </form>
  `);
  document.getElementById('mkt-met-cancel')?.addEventListener('click', closeModal);
  document.getElementById('mkt-metrics-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const saved = await apiRequest('saveMetrics', Object.fromEntries(fd));
      const idx = (state.marketing.metrics || []).findIndex(x => x.postId === postId);
      if (idx >= 0) state.marketing.metrics[idx] = saved;
      else state.marketing.metrics.push(saved);
      closeModal();
      renderMarketing();
      showToast('Métricas salvas.');
    } catch (err) { showToast(err.message || 'Erro ao salvar.', 'error'); }
  });
}

/* ── Image Preview Modal ────────────────────────────────────── */

function openImagePreview(src) {
  openModal(`
    <div style="text-align:center">
      <img src="${escapeHtml(src)}" style="max-width:100%;max-height:70vh;border-radius:8px;object-fit:contain" alt="">
      <br><button class="btn btn-ghost btn-sm" id="mkt-img-close" style="margin-top:12px"><i class="fa-solid fa-times"></i> Fechar</button>
    </div>
  `);
  document.getElementById('mkt-img-close')?.addEventListener('click', closeModal);
}

/* ── Events ─────────────────────────────────────────────────── */

function initMktEvents() {
  const section = document.getElementById('marketing');
  if (!section) return;

  // Sub-tab switching
  section.addEventListener('click', e => {
    // Tab buttons
    const tabBtn = e.target.closest('[data-mkt-tab]');
    if (tabBtn) {
      section.querySelectorAll('.mkt-tab').forEach(t => t.classList.remove('active'));
      section.querySelectorAll('.mkt-panel').forEach(p => p.classList.remove('active'));
      tabBtn.classList.add('active');
      const panel = document.getElementById(tabBtn.dataset.mktTab);
      if (panel) panel.classList.add('active');
      return;
    }

    // Status pills in postagens
    const pill = e.target.closest('.mkt-status-pill');
    if (pill && section.contains(pill)) {
      section.querySelectorAll('.mkt-status-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      _renderPostsContainer();
      return;
    }

    // View toggle (grid/list)
    const viewBtn = e.target.closest('.mkt-view-btn');
    if (viewBtn) {
      section.querySelectorAll('.mkt-view-btn').forEach(b => b.classList.remove('active'));
      viewBtn.classList.add('active');
      mktPostView = viewBtn.dataset.view;
      _renderPostsContainer();
      return;
    }

    // Action buttons
    const actionEl = e.target.closest('[data-mkt-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.mktAction;
    const id     = Number(actionEl.dataset.id) || 0;

    switch (action) {
      case 'edit-post': {
        const post = (state.marketing.posts || []).find(p => p.id === id);
        if (post) openPostModal(post);
        break;
      }
      case 'metrics-post':
        openMetricsModal(id);
        break;
      case 'delete-post': {
        const post = (state.marketing.posts || []).find(p => p.id === id);
        if (!confirm(`Excluir "${post?.title || '#' + id}"? Esta ação não pode ser desfeita.`)) return;
        apiRequest('deletePost', { id })
          .then(() => {
            state.marketing.posts = (state.marketing.posts || []).filter(p => p.id !== id);
            renderMarketing();
            showToast('Postagem excluída.');
          })
          .catch(err => showToast(err.message, 'error'));
        break;
      }
      case 'edit-campaign': {
        const camp = (state.marketing.campaigns || []).find(c => c.id === id);
        if (camp) openCampaignModal(camp);
        break;
      }
      case 'delete-campaign': {
        const camp = (state.marketing.campaigns || []).find(c => c.id === id);
        if (!confirm(`Excluir campanha "${camp?.name || '#' + id}"?`)) return;
        apiRequest('deleteCampaign', { id })
          .then(() => {
            state.marketing.campaigns = (state.marketing.campaigns || []).filter(c => c.id !== id);
            renderMarketing();
            showToast('Campanha excluída.');
          })
          .catch(err => showToast(err.message, 'error'));
        break;
      }
      case 'new-post-day':
        openPostModal(null, Number(actionEl.dataset.day));
        break;
      case 'preview-img':
        openImagePreview(actionEl.dataset.src);
        break;
      case 'use-lib-img':
        openPostModal(null, null, [actionEl.dataset.url]);
        break;
    }
  });

  // New post / campaign buttons (delegated via class)
  section.addEventListener('click', e => {
    if (e.target.closest('.mkt-new-post-btn'))     openPostModal();
    if (e.target.closest('.mkt-new-campaign-btn'))  openCampaignModal();
  });

  // Calendar nav
  document.getElementById('mkt-cal-prev')?.addEventListener('click', () => {
    state.mktCalMonth--;
    if (state.mktCalMonth < 0) { state.mktCalMonth = 11; state.mktCalYear--; }
    renderMktCalendar();
  });
  document.getElementById('mkt-cal-next')?.addEventListener('click', () => {
    state.mktCalMonth++;
    if (state.mktCalMonth > 11) { state.mktCalMonth = 0; state.mktCalYear++; }
    renderMktCalendar();
  });

  // Filter dropdowns
  ['mkt-filter-platform', 'mkt-filter-campaign', 'mkt-filter-camp-status'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      renderMktPostagens();
      if (id === 'mkt-filter-camp-status') renderMktCampanhas();
    });
  });

  // Library upload
  document.getElementById('mkt-lib-upload')?.addEventListener('change', e => {
    if (e.target.files.length) mktUploadLibraryFiles(e.target.files);
  });
}
