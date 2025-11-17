(function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const register = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.info('[StepPet] Service worker registered'))
      .catch((err) => console.warn('[StepPet] Service worker registration failed', err));
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
})();
