import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ROLES } from '../data/roles.js';
import {
  Brain,
  Users,
  Stethoscope,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Heart,
  UserPlus,
  KeyRound,
  HelpCircle
} from 'lucide-react';

const ROLE_ICON = { caregiver: Users, healthcare: Stethoscope };

/** Demo passwords surfaced on screen so judges can sign in instantly. */
const HINTS = { sunita: 'care123', barua: 'doctor123' };

export default function LoginPage() {
  const { enterAsResident, login, register, t } = useApp();

  const [accounts, setAccounts] = useState([]);
  // 'welcome' | 'staff' | 'signin' | 'register'
  const [screen, setScreen] = useState('welcome');
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showCodeHelp, setShowCodeHelp] = useState(false);

  const [form, setForm] = useState({
    name: '', username: '', password: '',
    role: 'caregiver', detail: '', joinCode: ''
  });

  useEffect(() => {
    let alive = true;
    import('../services/authService.js').then(({ authService }) => {
      authService.listAccounts().then(list => { if (alive) setAccounts(list); });
    });
    return () => { alive = false; };
  }, []);

  const resident = accounts.find(a => a.role === 'elderly');
  const staff = accounts.filter(a => a.role !== 'elderly');

  const reset = () => { setError(''); setPassword(''); setSelected(null); };

  /** The senior taps one button — no password to remember. */
  const openResidentHome = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    const res = await enterAsResident(resident?.username || 'asha');
    if (!res.success) {
      setError(res.message || 'Could not open your home screen.');
      setBusy(false);
    }
  };

  const submitSignIn = async (e) => {
    e.preventDefault();
    if (busy || !password) return;
    setBusy(true);
    setError('');
    const res = await login({ username: selected.username, password });
    if (!res.success) {
      setError(res.message || 'Sign in failed.');
      setBusy(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const res = await register(form);
    if (!res.success) {
      setError(res.message || 'Could not create your account.');
      setBusy(false);
    }
  };

  const field = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError('');
  };

  const errorBox = error && (
    <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl p-3">
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );

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
        </div>

        {/* ================= WELCOME — senior first ================= */}
        {screen === 'welcome' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border-2 border-teal-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-500">{t('log_welcome')}</p>
                <p className="text-2xl font-black text-slate-900">
                  {resident ? resident.name : 'Asha Sharma'}
                </p>
                <p className="text-xs text-slate-500">
                  {resident ? resident.detail : 'Tezpur, Assam • 68 yrs'}
                </p>
              </div>

              {errorBox}

              {/* One tap. No password, ever. */}
              <button
                onClick={openResidentHome}
                disabled={busy}
                className="w-full bg-gradient-to-tr from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 disabled:opacity-50 text-white rounded-3xl py-6 shadow-lg transition active:scale-[0.98] flex flex-col items-center gap-2"
              >
                <Heart className="w-9 h-9" />
                <span className="text-xl font-black">
                  {busy ? 'Opening…' : 'Open My Home'}
                </span>
                <span className="text-xs font-semibold opacity-90">{t('log_no_pass')}</span>
              </button>

              <p className="text-center text-[11px] text-slate-400 leading-relaxed">{t('log_one_tap')}</p>
            </div>

            {/* Staff entrance, deliberately quieter */}
            <button
              onClick={() => { reset(); setScreen('staff'); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:border-slate-300 font-bold text-sm transition min-h-[52px]"
            >
              <Lock className="w-4 h-4" />{t('log_staff')}</button>

            <p className="text-center text-[10px] text-slate-400 leading-relaxed">{t('log_supportive')}<br />{t('log_no_diagnose')}</p>
          </div>
        )}

        {/* ================= STAFF — pick an account ================= */}
        {screen === 'staff' && (
          <div className="space-y-3">
            <button
              onClick={() => { reset(); setScreen('welcome'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />{t('back')}</button>

            <p className="text-sm font-bold text-slate-600 text-center">{t('log_signin')}</p>

            {errorBox}

            {staff.map(acc => {
              const cfg = ROLES[acc.role] || ROLES.caregiver;
              const RoleIcon = ROLE_ICON[acc.role] || Users;
              return (
                <button
                  key={acc.username}
                  onClick={() => { setSelected(acc); setPassword(''); setError(''); setScreen('signin'); }}
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
                  <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                </button>
              );
            })}

            <button
              onClick={() => { reset(); setScreen('register'); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-600 hover:bg-white hover:border-teal-400 hover:text-teal-700 font-bold text-sm transition min-h-[52px]"
            >
              <UserPlus className="w-4 h-4" />{t('log_register')}</button>
          </div>
        )}

        {/* ================= STAFF — password ================= */}
        {screen === 'signin' && selected && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <button
              onClick={() => { reset(); setScreen('staff'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />{t('log_not_you')}</button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${(ROLES[selected.role] || ROLES.caregiver).theme.gradient} text-white flex items-center justify-center font-black text-lg`}>
                {selected.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 truncate">{selected.name}</p>
                <p className="text-xs text-slate-500 truncate">{selected.detail}</p>
              </div>
            </div>

            {errorBox}

            <form onSubmit={submitSignIn} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    autoFocus
                    placeholder={t('log_ph_pass')}
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

            {HINTS[selected.username] && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">{t('log_demo_creds')}</p>
                <p className="text-xs font-bold text-slate-700">
                  {selected.username} / {HINTS[selected.username]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= REGISTER — staff only ================= */}
        {screen === 'register' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <button
              onClick={() => { reset(); setScreen('staff'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />{t('back')}</button>

            <div>
              <h2 className="text-lg font-black text-slate-900">{t('log_create')}</h2>
              <p className="text-xs text-slate-500">{t('log_for_staff')}</p>
            </div>

            {errorBox}

            <form onSubmit={submitRegister} className="space-y-3">
              {/* Role choice drives what this account will ever be able to see */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_iam')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'caregiver', label: 'Caregiver', icon: Users },
                    { id: 'healthcare', label: 'Health Worker', icon: Stethoscope }
                  ].map(opt => {
                    const active = form.role === opt.id;
                    const cfg = ROLES[opt.id];
                    const OptIcon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: opt.id }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition min-h-[76px] ${
                          active
                            ? `${cfg.theme.soft} ${cfg.theme.border} ${cfg.theme.softText}`
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <OptIcon className="w-5 h-5" />
                        <span className="text-xs font-black">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_fullname')}</label>
                <input
                  value={form.name}
                  onChange={field('name')}
                  placeholder={t('log_ph_name')}
                  className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm outline-none transition min-h-[48px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_username')}</label>
                <input
                  value={form.username}
                  onChange={field('username')}
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder={t('log_ph_user')}
                  className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm outline-none transition min-h-[48px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={field('password')}
                    placeholder={t('log_ph_pass2')}
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

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t('log_role_detail')}<span className="font-medium text-slate-400">{t('log_optional')}</span>
                </label>
                <input
                  value={form.detail}
                  onChange={field('detail')}
                  placeholder={form.role === 'caregiver' ? 'e.g. Daughter' : 'e.g. CHO, Sonitpur SDH'}
                  className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm outline-none transition min-h-[48px]"
                />
              </div>

              {/* Proves the caregiver belongs to this family before they see any data */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  Join code{' '}
                  {form.role === 'caregiver'
                    ? <span className="text-rose-500">*</span>
                    : <span className="font-medium text-slate-400">{t('log_optional')}</span>}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    value={form.joinCode}
                    onChange={(e) => { setForm(f => ({ ...f, joinCode: e.target.value.toUpperCase() })); setError(''); }}
                    autoCapitalize="characters"
                    placeholder="{t('log_ph')}"
                    className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold tracking-wide outline-none transition min-h-[48px]"
                  />
                </div>
                {/* Someone registering for the first time has no way to guess
                    where this comes from, so spell it out. */}
                <button
                  type="button"
                  onClick={() => setShowCodeHelp(h => !h)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-teal-800 mt-2 min-h-[36px]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />{t('log_where_code')}</button>

                {showCodeHelp && (
                  <div className="mt-1 rounded-2xl bg-teal-50 border border-teal-200 p-4 space-y-2.5">
                    <p className="text-xs font-black text-teal-900">{t('log_on_senior')}</p>
                    <ol className="space-y-1.5 text-[11px] text-teal-900/80 font-medium">
                      {[
                        'Open SmarTCARE and tap "Open My Home".',
                        'Go to My Progress (in the More menu).',
                        'Find the "Family Join Code" card.',
                        'Tap to reveal, then Copy or Share it to you.'
                      ].map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-[10px] text-teal-800/70 leading-relaxed border-t border-teal-200 pt-2">
                      Health workers can leave this blank — your facility verifies
                      you instead.
                    </p>
                    <div className="border-t border-teal-200 pt-2">
                      <p className="text-[10px] font-black uppercase tracking-wide text-teal-700/60 mb-1">{t('log_demo_code')}</p>
                      <button
                        type="button"
                        onClick={() => { setForm(f => ({ ...f, joinCode: 'SMT-4821' })); setError(''); }}
                        className="text-xs font-black font-mono tracking-widest text-teal-800 bg-white border border-teal-300 rounded-xl px-3 py-2 hover:bg-teal-100 transition"
                      >{t('log_tap_fill')}</button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition active:scale-[0.98] min-h-[50px]"
              >
                {busy ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
