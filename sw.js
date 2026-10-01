'use strict';

const CACHE_VERSION = 'champion-cache-v16';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Always try the network first for page navigation, preventing stale HTML.
  if (request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Do not cache the live Google Sheets CSV.
  if (url.hostname === 'docs.google.com') {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // Same-origin assets use stale-while-revalidate for fast offline loading.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request, { cache: 'no-cache' }).then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        });
        return cached || network;
      })
    );
  }
});
