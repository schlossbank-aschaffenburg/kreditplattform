/* Offline-Betrieb: Die App wird beim ersten Öffnen gespeichert und läuft danach ohne Internet.
   Bei jeder Änderung an der App die Versionsnummer erhöhen, damit alle Geräte die neue Fassung laden. */
const VERSION = 'sb-kredit-1.0.0';
const DATEIEN = [
  './', 'index.html', 'css/app.css', 'js/daten.js', 'js/app.js', 'manifest.webmanifest',
  'assets/logo.png', 'assets/logo-weiss.png', 'assets/icon-180.png', 'assets/icon-192.png', 'assets/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Erst aus dem Netz laden (damit Änderungen sofort ankommen), ohne Netz aus dem Speicher.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(antwort => {
        const kopie = antwort.clone();
        caches.open(VERSION).then(c => c.put(e.request, kopie));
        return antwort;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
