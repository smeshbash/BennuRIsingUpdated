// Kill-switch service worker.
//
// This app has never intentionally shipped a service worker — there is no
// `navigator.serviceWorker.register(...)` call anywhere in the codebase.
// But at some point in the site's history, something DID register a real
// service worker at this exact URL (`/_service-worker.js`), and any visitor
// whose browser installed it back then is stuck with it forever: once
// installed, a service worker keeps controlling that origin and intercepting
// every request, completely independent of what the current server code
// does, until it's explicitly replaced or unregistered. Since the server no
// longer serves anything at this path (it used to fall through to the SPA's
// catch-all and return index.html — the wrong content, but never a real
// update), those old workers had no way to ever self-correct.
//
// This file exists purely to reach those already-affected browsers. The
// browser periodically re-fetches and byte-compares the installed service
// worker's script against this URL; once it sees this new content, it
// installs and activates it, at which point this script immediately clears
// every cache it can see and unregisters itself — restoring normal
// network-only behavior. Do not turn this into a "real" service worker
// later without a deliberate decision to do so; leave it as a no-op kill
// switch unless the site actually needs offline/PWA support again.

self.addEventListener('install', () => {
  // Activate immediately instead of waiting for old tabs to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Remove any Cache Storage entries a prior version of this worker
      // may have written.
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Stop controlling this origin entirely.
      await self.registration.unregister();

      // Force any currently-open tabs (which are still "controlled" by this
      // worker until they navigate) to reload, so the fix takes effect
      // immediately instead of only on the visitor's next visit.
      const allClients = await self.clients.matchAll({ type: 'window' });
      for (const client of allClients) {
        client.navigate(client.url);
      }
    })()
  );
});
