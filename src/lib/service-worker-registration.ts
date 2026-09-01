export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      (navigator as any).serviceWorker
        .register('/sw.js')
        .then((registration: any) => {
          console.log('SW registered: ', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && (navigator as any).serviceWorker.controller) {
                  // New content is available; refresh to get it
                  if (window.confirm('New content available. Refresh to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError: any) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Request sync for offline activities
export function requestSync(tag: string = 'sync-activities') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration: any) => {
      if ('sync' in registration) {
        registration.sync.register(tag);
      }
    });
  }
}