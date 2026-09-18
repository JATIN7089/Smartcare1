import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ROLES } from '../data/roles.js';
import {
  Brain,
  User,
  Users,
  Stethoscope,
  Lock,
  Delete,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn
} from 'lucide-react';

const ROLE_ICON = { elderly: User, caregiver: Users, healthcare: Stethoscope };

/** Demo credentials surfaced on screen so judges can sign in instantly. */
const HINTS = {
  asha:   { password: 'asha123',   pin: '1234' },
  sunita: { password: 'care123',   pin: '2345' },
  barua:  { password: 'doctor123', pin: '3456' }
};

export default function LoginPage() {
  const { login } = useApp();

  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    import('../services/authService.js').then(({ authService }) => {
      authService.listAccounts().then(list => { if (alive) setAccounts(list); });
    });
    return () => { alive = false; };
  }, []);

  const choose = (acc) => {
    setSelected(acc);
    setPassword('');
    setPin('');
    setError('');
  };

  const back = () => {
    setSelected(null);
    setPassword('');
    setPin('');
    setError('');
  };

  // Seniors sign in with a 4-digit PIN; staff use a password.
  const usesPin = selected?.role === 'elderly';

  const submit = async (pinOverride) => {
    if (busy) return;
    const pinValue = pinOverride ?? pin;

    if (usesPin ? pinValue.length !== 4 : !password) return;

    setBusy(true);
    setError('');

    const res = await login({
      username: selected.username,
      password: usesPin ? undefined : password,
      pin: usesPin ? pinValue : undefined
    });

    if (!res.success) {
      setError(res.message || 'Sign in failed.');
      setPin('');
      setBusy(false);
    }
    // On success the app swaps this screen out for the portal.
  };

  const pressDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError('');
    if (next.length === 4) submit(next);
  };

  const hint = selected ? HINTS[selected.username] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-white via-teal-50/60 to-emerald-50">
      <div className="w-full max-w-md space-y-5">

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-lg mx-auto">
            <Brain className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Smar<span className="text-teal-600">TCARE</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {selected ? 'Enter your details to continue' : 'Who is signing in?'}
          </p>
        </div>

        {/* ---------- Step 1: pick an identity ---------- */}
        {!selected && (
          <div className="space-y-3">
            {accounts.map(acc => {
              const cfg = ROLES[acc.role] || ROLES.elderly;
              const RoleIcon = ROLE_ICON[acc.role] || User;
              return (
                <button
                  key={acc.username}
                  onClick={() => choose(acc)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 bg-white text-left transition hover:shadow-md active:scale-[0.98] min-h-[80px] ${cfg.theme.border}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cfg.theme.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <RoleIcon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-slate-900 truncate">{acc.name}</p>
                    <p className="text-xs text-slate-500 truncate">{acc.detail}</p>
                    <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.theme.soft} ${cfg.theme.softText}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <LogIn className="w-5 h-5 text-slate-300 flex-shrink-0" />
                </button>
              );
            })}

            <p className="text-center text-[11px] text-slate-400 pt-1 leading-relaxed">
              Each account sees only what it should.<br />
              Seniors never see clinical data.
            </p>
          </div>
        )}

        {/* ---------- Step 2: credentials ---------- */}
        {selected && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" /> Not you? Choose another
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${(ROLES[selected.role] || ROLES.elderly).theme.gradient} text-white flex items-center justify-center font-black text-lg`}>
                {selected.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 truncate">{selected.name}</p>
                <p className="text-xs text-slate-500 truncate">{selected.detail}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Seniors: big friendly PIN pad */}
            {usesPin ? (
              <div className="space-y-4">
                <p className="text-center text-sm font-bold text-slate-600">
                  Enter your 4-digit PIN
                </p>

                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition ${
                        pin.length > i
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}
                    >
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {['1','2','3','4','5','6','7','8','9'].map(d => (
                    <button
                      key={d}
                      onClick={() => pressDigit(d)}
                      disabled={busy}
                      className="h-16 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-300 text-2xl font-black text-slate-800 transition active:scale-95 disabled:opacity-50"
                    >
                      {d}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => pressDigit('0')}
                    disabled={busy}
                    className="h-16 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-300 text-2xl font-black text-slate-800 transition active:scale-95 disabled:opacity-50"
                  >
                    0
                  </button>
                  <button
                    onClick={() => { setPin(p => p.slice(0, -1)); setError(''); }}
                    disabled={busy}
                    className="h-16 rounded-2xl bg-slate-50 hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-300 flex items-center justify-center text-slate-600 transition active:scale-95 disabled:opacity-50"
                    aria-label="Delete last digit"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              /* Staff: username + password */
              <form
                onSubmit={(e) => { e.preventDefault(); submit(); }}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Username</label>
                  <input
                    value={selected.username}
                    readOnly
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      autoFocus
                      placeholder="Enter password"
                      className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl pl-11 pr-11 py-3 text-sm outline-none transition min-h-[48px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy || !password}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition active:scale-[0.98] min-h-[50px]"
                >
                  {busy ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Demo credentials — this is a hackathon build, judges need these */}
            {hint && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">
                  Demo credentials
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {usesPin ? `PIN: ${hint.pin}` : `${selected.username} / ${hint.password}`}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 leading-relaxed">
          SmarTCARE is a supportive cognitive engagement companion.<br />
          It does not diagnose any medical condition.
        </p>
      </div>
    </div>
  );
}
