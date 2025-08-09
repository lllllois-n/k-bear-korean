// Simple offline cache for K-Bear Learner
const CACHE = 'kbear-cache-v1';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Network first, fallback to cache
  e.respondWith(
    fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, resClone)).catch(()=>{});
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
  );
});
