import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

/** Maps a server event kind to a translation key (the sentence is completed
 *  after the senior's name, e.g. "Asha completed a reminder"). */
const KIND_KEYS = {
  game: 'live_game',
  reminder_done: 'live_reminder_done',
  reminder_reopen: 'live_reminder_reopen',
  breathing: 'live_breathing',
  routine: 'live_routine',
  sync: 'live_sync',
  plan: 'live_plan'
};

/**
 * Live activity toast for the caregiver & clinical portals.
 * The server pushes an event the instant the senior completes anything,
 * so Sunita or Dr. Barua see it within a second — no refresh needed.
 */
export default function LiveToast({ name = 'Asha' } = {}) {
  const { lastLiveEvent, liveConnected, t } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastLiveEvent || lastLiveEvent.kind === 'hello') return undefined;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(id);
  }, [lastLiveEvent]);

  if (!liveConnected || !lastLiveEvent) return null;

  const key = KIND_KEYS[lastLiveEvent.kind];
  if (!key) return null;
  const message = `${name} ${t(key)}`;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[70] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-slate-900/95 text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 max-w-sm border border-emerald-500/40">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <p className="text-sm font-bold leading-snug">
          <span className="text-emerald-300 uppercase tracking-wider text-[11px] block">
            {t('live_title')}
          </span>
          {message}
        </p>
      </div>
    </div>
  );
}

/** Small pulsing "LIVE" pill for portal headers. */
export function LiveBadge() {
  const { liveConnected, t } = useApp();
  if (!liveConnected) return null;
  return (
    <span
      title={t('live_on')}
      className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {t('live_title')}
    </span>
  );
}
