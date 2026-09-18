import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Minimum time (ms) the splash stays visible.
 * Prevents an abrupt flash on fast loads while still feeling snappy.
 */
const SPLASH_MIN_DURATION = 1600;

/** Matches the CSS opacity transition on #smartcare-splash. */
const SPLASH_FADE_DURATION = 600;

let splashDismissed = false;

function removeSplash() {
  const splash = document.getElementById('smartcare-splash');
  if (!splash) return;
  splash.classList.add('is-hidden');
  // Remove from the DOM after fading so it never traps focus or taps.
  window.setTimeout(() => splash.remove(), SPLASH_FADE_DURATION);
}

function dismissSplash() {
  if (splashDismissed) return;
  splashDismissed = true;

  const startedAt = window.__SMARTCARE_SPLASH_START__ || Date.now();
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, SPLASH_MIN_DURATION - elapsed);

  window.setTimeout(() => {
    // Let the inline script run the bar to 100% and show "Ready" before fading.
    const finish = window.__SMARTCARE_SPLASH_FINISH__;
    if (typeof finish === 'function') finish(removeSplash);
    else removeSplash();
  }, remaining);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Wait for fonts/images already in flight so the app doesn't pop in half-styled.
if (document.readyState === 'complete') {
  dismissSplash();
} else {
  window.addEventListener('load', dismissSplash, { once: true });
  // Safety net: never let the splash outlive a slow or failed asset.
  window.setTimeout(dismissSplash, 6000);
}
