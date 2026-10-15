const CACHE_NAME = 'gao-joias-v20';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/marketing.js',
  './manifest.json',
  './img/favicon.png',
  './img/logo_white.png',
  './img/logo_black.png'
];
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all([
      // cache: 'reload' skips the browser HTTP cache — Hostinger serves js/css with max-age=7d
      cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))).catch(() => null),
      cache.addAll(CDN_ASSETS).catch(() => null)
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// App code is network-first so every deploy shows up on the next load;
// the cache only serves it when offline.
function isAppCode(request, url) {
  if (request.mode === 'navigate') return true;
  return url.origin === self.location.origin && /\.(?:html|js|css|json)$/.test(url.pathname);
}

async function networkFirst(event) {
  const { request } = event;
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, request.mode === 'navigate' ? undefined : { cache: 'no-cache' });
    if (response.ok) event.waitUntil(cache.put(request, response.clone()));
    return response;
  } catch (error) {
    const cached = (await cache.match(request)) || (await cache.match(request, { ignoreSearch: true }));
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return new Response('', { status: 503 });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.includes('/api/') || url.pathname.endsWith('.php') || url.pathname.includes('/loja/')) {
    event.respondWith(fetch(request));
    return;
  }

  if (isAppCode(request, url)) {
    event.respondWith(networkFirst(event));
    return;
  }

  // Images, fonts and version-pinned CDN libraries: cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => new Response('', { status: 503 }));
    })
  );
});
