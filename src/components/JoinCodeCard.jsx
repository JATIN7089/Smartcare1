import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { KeyRound, Copy, Check, Share2, Eye, EyeOff } from 'lucide-react';

/**
 * Shows the family join code that a new caregiver needs while registering.
 *
 * The code used to live only inside the caregiver dashboard, which nobody can
 * open until they are already a caregiver — so a new family member had no way
 * to find it. It belongs here, on the senior's own profile, where the family
 * member can read it off the phone in front of them.
 *
 * Treated as a secret: hidden behind a tap, since anyone holding this code can
 * request access to the senior's health data.
 */
export default function JoinCodeCard() {
  const { user } = useApp();
  const code = user?.joinCode || 'SMT-4821';

  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      // Older mobile browsers without the clipboard API.
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); } catch (err) { /* nothing more to try */ }
      document.body.removeChild(el);
    }
    setRevealed(true);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    const text = `Join my SmarTCARE care circle. Open the app, tap "Caregiver or Health Worker sign in", then "Register a new account" and enter join code ${code}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SmarTCARE join code', text });
        setRevealed(true);
        return;
      }
    } catch (e) { /* user dismissed the share sheet */ }
    copy();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-lg text-slate-900">Family Join Code</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Share this with a family member or health worker so they can create
            their own account and support you.
          </p>
        </div>
      </div>

      {/* The code itself */}
      <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/60 p-5 text-center">
        {revealed ? (
          <p className="text-3xl font-black tracking-[0.2em] text-teal-800 font-mono break-all">
            {code}
          </p>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="w-full flex flex-col items-center gap-2 py-1 text-teal-800 min-h-[56px]"
          >
            <span className="text-3xl font-black tracking-[0.2em] font-mono select-none blur-[7px]">
              {code}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <Eye className="w-3.5 h-3.5" /> Tap to reveal
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={copy}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition active:scale-[0.98] min-h-[48px]"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
        <button
          onClick={share}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-200 hover:border-teal-400 hover:text-teal-700 text-slate-600 font-extrabold text-sm transition active:scale-[0.98] min-h-[48px]"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {revealed && (
        <button
          onClick={() => setRevealed(false)}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition min-h-[36px]"
        >
          <EyeOff className="w-3.5 h-3.5" /> Hide code
        </button>
      )}

      {/* Step-by-step, because the person reading this is guiding someone else */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          How they use it
        </p>
        <ol className="space-y-1.5 text-xs text-slate-600 font-medium">
          {[
            'They open SmarTCARE on their own phone.',
            'They tap "Caregiver or Health Worker sign in".',
            'They choose "Register a new account".',
            'They enter this code to join your care circle.'
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        Only share this with people you trust. Anyone with this code can ask to
        see your reminders and activity.
      </p>
    </div>
  );
}
