const CACHE_NAME = 'imagineme-v1';
const urlsToCache = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/child-login',
  '/manifest.json',
];

const STATIC_CACHE = 'imagineme-static-v1';
const DYNAMIC_CACHE = 'imagineme-dynamic-v1';
const IMAGE_CACHE = 'imagineme-images-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - network first for HTML, cache first for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests - network only
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return a custom offline response for API requests
        return new Response(
          JSON.stringify({ error: 'Offline - API requests require connection' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // HTML pages - Network First strategy
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response and cache it
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Images - Cache First strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }

          return fetch(request).then((response) => {
            // Clone response and cache it
            const responseClone = response.clone();
            cache.put(request, responseClone);
            return response;
          });
        });
      })
    );
    return;
  }

  // Static assets - Cache First strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Clone response and cache it
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncActivities());
  }
});

async function syncActivities() {
  // Implementation for syncing offline activities when connection returns
  try {
    const pendingActivities = await getPendingActivities();
    for (const activity of pendingActivities) {
      await syncActivity(activity);
    }
  } catch (error) {
    console.error('Failed to sync activities:', error);
  }
}

// Placeholder functions for activity syncing
async function getPendingActivities() {
  // Get pending activities from IndexedDB
  return [];
}

async function syncActivity(activity) {
  // Sync individual activity to server
  return fetch('/api/child/activities', {
    method: 'POST',
    body: JSON.stringify(activity),
  });
}