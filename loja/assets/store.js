(() => {
  'use strict';

  const root        = document.documentElement;
  const CART_API    = 'api/cart.php';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Cart sidebar elements ──────────────────────────────────────
  const sidebar      = document.getElementById('cart-sidebar');
  const overlay      = document.getElementById('cart-overlay');
  const closeBtn     = document.getElementById('cart-close-btn');
  const countBadge   = document.getElementById('cart-count-badge');
  const sidebarCount = document.getElementById('cart-sidebar-count');
  const itemsList    = document.getElementById('sidebar-items-list');
  const emptyState   = document.getElementById('sidebar-empty');
  const sidebarFoot  = document.getElementById('cart-sidebar-foot');
  const subtotalVal  = document.getElementById('sidebar-subtotal-val');

  // ── Open / close sidebar ──────────────────────────────────────
  function openCart() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('cart-open-btn')?.addEventListener('click', openCart);
  document.getElementById('section-cart-open')?.addEventListener('click', openCart);
  document.getElementById('lookbook-cart-btn')?.addEventListener('click', openCart);
  document.getElementById('footer-cart-link')?.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  document.getElementById('sidebar-keep-shopping')?.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) closeCart();
  });

  // ── Update badge + count text ──────────────────────────────────
  function updateCountUI(count) {
    if (countBadge) {
      countBadge.textContent = count;
      countBadge.style.display = count > 0 ? '' : 'none';
    }
    if (sidebarCount) {
      sidebarCount.textContent = count + (count === 1 ? ' item' : ' itens');
    }
    // update inline "Ver sacola (N)" text in section head
    const secBtn = document.getElementById('section-cart-open');
    if (secBtn) {
      const sp = secBtn.querySelector('span');
      if (sp) sp.textContent = count > 0 ? `Ver sacola (${count})` : 'Ver sacola';
    }
  }

  // ── Cart callout tooltip ─────────────────────────────────────
  const cartCallout = document.getElementById('cart-callout');
  let calloutTimer  = null;
  let wasEmpty      = parseInt(countBadge?.textContent || '0', 10) === 0;

  function showCartCallout() {
    if (!cartCallout) return;
    cartCallout.classList.remove('hidden');
    clearTimeout(calloutTimer);
    calloutTimer = setTimeout(hideCartCallout, 5000);
  }
  function hideCartCallout() {
    if (!cartCallout) return;
    cartCallout.classList.add('hidden');
  }

  document.getElementById('callout-view-cart')?.addEventListener('click', () => {
    hideCartCallout();
    openCart();
  });
  document.getElementById('callout-dismiss')?.addEventListener('click', hideCartCallout);

  // ── Render sidebar items from JSON ────────────────────────────
  function imgOrFallback(url) {
    return url || '../img/gaojoias_logo.png';
  }

  function renderSidebarItems(items, subtotalFmt) {
    if (!itemsList) return;

    if (!items || items.length === 0) {
      itemsList.style.display = 'none';
      if (emptyState)  emptyState.style.display  = '';
      if (sidebarFoot) sidebarFoot.style.display  = 'none';
      return;
    }

    itemsList.style.display = '';
    if (emptyState)  emptyState.style.display  = 'none';
    if (sidebarFoot) sidebarFoot.style.display  = '';
    if (subtotalVal) subtotalVal.textContent    = subtotalFmt;

    itemsList.innerHTML = items.map(item => `
      <li class="sidebar-item" data-product-id="${item.product_id}">
        <div class="sidebar-item-img">
          <img src="${escHtml(imgOrFallback(item.image_url))}" alt="${escHtml(item.name)}" loading="lazy">
        </div>
        <div class="sidebar-item-info">
          <span class="sidebar-item-sku">${escHtml(item.sku)}</span>
          <strong class="sidebar-item-name">${escHtml(item.name)}</strong>
          <span class="sidebar-item-price">${escHtml(item.price_fmt)}</span>
        </div>
        <div class="sidebar-item-controls">
          <div class="sidebar-qty">
            <button type="button" class="s-qty-btn s-qty-dec"
              data-product-id="${item.product_id}" data-qty="${item.quantity}">−</button>
            <span class="s-qty-val">${item.quantity}</span>
            <button type="button" class="s-qty-btn s-qty-inc"
              data-product-id="${item.product_id}" data-qty="${item.quantity}">+</button>
          </div>
          <strong class="sidebar-item-total">${escHtml(item.total_fmt)}</strong>
          <button type="button" class="sidebar-remove"
            data-product-id="${item.product_id}" aria-label="Remover">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    `).join('');
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Cart API call ──────────────────────────────────────────────
  async function cartRequest(formData) {
    const res  = await fetch(CART_API, { method: 'POST', body: formData });
    const data = await res.json();
    return data;
  }

  // ── Add to cart (intercept product-form submit) ───────────────
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-ajax-cart]');
    if (!form) return;
    e.preventDefault();

    const btn = form.querySelector('.quick-add-btn, .add-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; }

    const fd = new FormData(form);
    fd.set('action', 'add');

    try {
      const data = await cartRequest(fd);
      if (data.ok) {
        renderSidebarItems(data.items, data.subtotal_fmt);
        updateCountUI(data.count);
        if (data.count === 1 && wasEmpty) {
          showCartCallout();
          wasEmpty = false;
        }
        if (countBadge) {
          countBadge.classList.remove('pulse');
          void countBadge.offsetWidth;
          countBadge.classList.add('pulse');
        }
      } else {
        alert(data.error || 'Erro ao adicionar ao sacola.');
      }
    } catch {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-plus"></i> Adicionar à sacola'; }
    }
  });

  // ── Qty dec / inc in product card ─────────────────────────────
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('.qty-dec');
    const inc = e.target.closest('.qty-inc');
    if (!dec && !inc) return;
    const input = (dec || inc).closest('.qty-input-wrap').querySelector('input[type="number"]');
    if (!input) return;
    const current = parseInt(input.value, 10) || 1;
    if (dec) input.value = Math.max(1, current - 1);
    if (inc) input.value = current + 1;
  });

  // ── Sidebar: remove item ──────────────────────────────────────
  itemsList?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.sidebar-remove');
    if (!btn) return;
    const productId = btn.dataset.productId;
    const fd = new FormData();
    fd.set('action', 'remove');
    fd.set('product_id', productId);
    const li = btn.closest('.sidebar-item');
    if (li) li.style.opacity = '0.4';
    try {
      const data = await cartRequest(fd);
      if (data.ok) {
        renderSidebarItems(data.items, data.subtotal_fmt);
        updateCountUI(data.count);
      }
    } catch { if (li) li.style.opacity = ''; }
  });

  // ── Sidebar: qty buttons ──────────────────────────────────────
  itemsList?.addEventListener('click', async (e) => {
    const dec = e.target.closest('.s-qty-dec');
    const inc = e.target.closest('.s-qty-inc');
    if (!dec && !inc) return;
    const btn       = dec || inc;
    const productId = btn.dataset.productId;
    const current   = parseInt(btn.dataset.qty, 10) || 1;
    const newQty    = dec ? Math.max(0, current - 1) : current + 1;

    const fd = new FormData();
    fd.set('action', newQty === 0 ? 'remove' : 'update');
    fd.set('product_id', productId);
    fd.set('quantity', String(newQty));

    try {
      const data = await cartRequest(fd);
      if (data.ok) {
        renderSidebarItems(data.items, data.subtotal_fmt);
        updateCountUI(data.count);
      }
    } catch { /* silent */ }
  });

  // ── Header scroll effect ──────────────────────────────────────
  const header = document.getElementById('store-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Product card tilt effect ──────────────────────────────────
  if (!reduceMotion) {
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mousemove', (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width  - 0.5;
        const y = (ev.clientY - r.top)  / r.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 2.5).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 2.5).toFixed(2)}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // ── GSAP animations ──────────────────────────────────────────
  const runGsap = () => {
    if (reduceMotion || !window.gsap) {
      root.classList.add('is-loaded');
      return;
    }
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    gsap.defaults({ duration: 0.82, ease: 'power3.out' });

    gsap.from('.announcement-inner span', { y: -8, stagger: 0.06, duration: 0.48, delay: 0.05 });
    gsap.from('.store-header',            { y: -18, duration: 0.6, delay: 0.06 });
    gsap.from('.hero-content > *',        { y: 36, stagger: 0.11, duration: 0.96, delay: 0.16 });
    gsap.from('.hero-image',              { scale: 1.08, duration: 1.6, ease: 'power2.out' });

    if (window.ScrollTrigger) {
      [
        '.cat-pill',
        '.feature-card',
        '.section-head > *',
        '.product-card',
        '.mini-card',
        '.lookbook-copy > *',
        '.store-panel',
        '.footer-brand, .footer-col',
      ].forEach((sel) => {
        gsap.utils.toArray(sel).forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            y: 28,
            opacity: 0,
            duration: 0.72,
            delay: Math.min((i % 5) * 0.055, 0.2),
          });
        });
      });

      gsap.to('.hero-image', {
        scrollTrigger: { trigger: '.hero-luxury', start: 'top top', end: 'bottom top', scrub: true },
        yPercent: 8, scale: 1.04, ease: 'none',
      });
    }

    root.classList.add('is-loaded');
  };

  root.classList.add('gsap-ready');
  if (document.readyState === 'complete') runGsap();
  else window.addEventListener('load', runGsap, { once: true });

})();
