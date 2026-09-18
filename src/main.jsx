import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Minimum time (ms) the splash stays visible.
 * Prevents an abrupt flash on fast loads while still feeling snappy.
 */
const SPLASH_MIN_DURATION = 1400;

/** Matches the CSS opacity transition on #smartcare-splash. */
const SPLASH_FADE_DURATION = 550;

function dismissSplash() {
  const splash = document.getElementById('smartcare-splash');
  if (!splash) return;

  const startedAt = window.__SMARTCARE_SPLASH_START__ || Date.now();
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, SPLASH_MIN_DURATION - elapsed);

  window.setTimeout(() => {
    splash.classList.add('is-hidden');
    // Remove from the DOM after fading so it never traps focus or taps.
    window.setTimeout(() => splash.remove(), SPLASH_FADE_DURATION);
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
  // Safety net: never let the splash outlive a slow/failed asset.
  window.setTimeout(dismissSplash, 5000);
}
