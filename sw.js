// 온종일 소셜 서플라이 — 서비스워커(PWA 설치 + 오프라인 기본 캐시)
const CACHE = 'supply-v1';
const ASSETS = ['./', './index.html', './services.js', './manifest.json',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // API(동기화·잔액)는 항상 네트워크(캐시 금지 — 최신 데이터)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('stream-promotion') || url.hostname.includes('smbpanel') || url.hostname.includes('realsite')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}})));
    return;
  }
  // 그 외 정적 = 네트워크 우선, 실패 시 캐시(오프라인)
  e.respondWith(fetch(e.request).then((r) => {
    const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)).catch(()=>{}); return r;
  }).catch(() => caches.match(e.request)));
});
