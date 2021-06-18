// polyfills
import 'core-js/stable';

// styles - order matters
// base -> mobile -> desktop -> scroll bar styles
import '@styles/base.scss';
import '@styles/portrait.scss';
import '@styles/landscape.scss';
import '@styles/simplebar.scss';

// main
import '@js/app';

// PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
