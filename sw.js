// Reiseplaner – Offline-Betrieb (web-v16). Erst Netz, sonst gespeicherte Kopie.
const C = "reiseplaner-web-v16";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(["./", "./index.html", "./manifest.json", "./icon.png"]).then(() => c.addAll(["./pdf.min.js", "./pdf.worker.min.js"]).catch(() => {})))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html"))));
});
