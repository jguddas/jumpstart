export function register(config = {}) {
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${PUBLIC_URL}service-worker.js`)
        .then(registration => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh!')
                  if (config.onUpdate) {
                    config.onUpdate(registration)
                  }
                } else {
                  console.log('Content is cached for offline use.')
                  if (config.onSuccess) {
                    config.onSuccess(registration)
                  }
                }
              }
            }
          }
        }).catch(error => {
          console.error('Error during service worker registration:', error)
          if (config.onError) {
            config.onError(error)
          }
        })
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
