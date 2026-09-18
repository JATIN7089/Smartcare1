import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { NAV_LABEL_KEYS, ROLE_LABEL_KEYS, TAGLINE_KEYS, PERSONA_KEYS } from '../data/translations.js';
import LiveToast, { LiveBadge } from './LiveToast.jsx';
import VoiceActionModal from './VoiceActionModal.jsx';
import { getRole } from '../data/roles.js';
import {
  Home,
  Puzzle,
  Brain,
  Wind,
  Bell,
  User,
  Mic,
  Globe,
  Users,
  Activity,
  FileText,
  Menu,
  X,
  Sparkles,
  Check,
  Clock,
  Heart,
  Layers,
  Wifi,
  WifiOff,
  ChevronDown,
  ArrowLeftRight,
  LogOut
} from 'lucide-react';

/** Icon names in roles.js are resolved through this map. */
const ICONS = {
  Home, Puzzle, Brain, Wind, Bell, User, Mic, Users,
  Activity, FileText, Clock, Heart, Sparkles, Layers
};

function Icon({ name, className }) {
  const Cmp = ICONS[name] || Home;
  return <Cmp className={className} />;
}

export default function AppShell({ children }) {
  const {
    role,
    setRole,
    user,
    language,
    setLanguage,
    t,
    currentLanguageObj,
    supportedLanguages,
    syncState,
    toggleSimulatedOffline,
    alerts = [],
    reminders = [],
    account,
    logout,
    setDemoTourStep,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // One-time nudge so people discover that caregiver and health-worker
  // portals exist at all. Dismissed permanently once the picker is opened.
  const [roleHintSeen, setRoleHintSeen] = useState(() => {
    try {
      return localStorage.getItem('smartcare_role_hint_seen') === '1';
    } catch (e) {
      return true;
    }
  });

  const dismissRoleHint = () => {
    setRoleHintSeen(true);
    try { localStorage.setItem('smartcare_role_hint_seen', '1'); } catch (e) {}
  };

  const openRolePicker = () => {
    dismissRoleHint();
    setRoleModalOpen(true);
  };

  const cfg = getRole(role);
  const theme = cfg.theme;

  /**
   * Roles are tied to credentials now, so "switching" means signing out and
   * signing back in as the other person. This keeps a senior from wandering
   * into the caregiver or clinical portals.
   */
  const handleSignOut = async () => {
    setRoleModalOpen(false);
    setMoreDrawerOpen(false);
    await logout();
    navigate('/');
  };

  const isActivePath = (path) => {
    if (path === '/elderly') {
      return location.pathname === '/elderly' || location.pathname === '/';
    }
    if (path === '/games') return location.pathname.startsWith('/games');
    if (path === '/caregiver') {
      return location.pathname === '/caregiver' || location.pathname.startsWith('/caregiver/patients');
    }
    return location.pathname === path;
  };

  // Live counts shown as nav badges so caregivers/CHOs see what needs action.
  const openAlerts = alerts.length;
  const pendingReminders = reminders.filter(r => !r.completed).length;

  const badgeFor = (path) => {
    if (path === '/caregiver/alerts' && openAlerts > 0) return openAlerts;
    if (path === '/reminders' && pendingReminders > 0) return pendingReminders;
    return null;
  };

  /* ============================================================
     Reusable: role switcher trigger button

     This is the only way into the caregiver / health-worker portals, so it
     has to read unmistakably as "you are X, tap to change" — an icon alone
     was far too easy to miss on a phone.
     ============================================================ */
  const RoleSwitchButton = ({ compact = false }) => (
    <div className="relative">
    <button
      onClick={openRolePicker}
      className={`flex items-center rounded-xl border-2 font-bold transition min-h-[44px] ${
        compact ? 'gap-1.5 pl-1.5 pr-2 py-1' : 'gap-2 px-3 py-2 text-xs w-full justify-between'
      } ${theme.soft} ${theme.softText} ${theme.border} hover:brightness-95 active:scale-95`}
      title={t('navbar_switch_role')}
      aria-label={`Current view: ${cfg.label}. Tap to switch role.`}
    >
      {compact ? (
        <>
          {/* Avatar keeps the control recognisable at a glance */}
          <span className={`w-7 h-7 rounded-lg ${theme.solid} text-white flex items-center justify-center text-[11px] font-black flex-shrink-0`}>
            {cfg.persona.name[0]}
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[8px] uppercase tracking-wide opacity-70 font-black">{t('shell_account')}</span>
            <span className="text-[11px] font-black">{cfg.shortLabel}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
        </>
      ) : (
        <>
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{t(ROLE_LABEL_KEYS[cfg.label] || '', cfg.label)} · {t('shell_account')}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </>
      )}
    </button>

    {/* First-run nudge pointing at the switcher */}
    {compact && !roleHintSeen && (
      <>
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
        </span>
        <button
          onClick={dismissRoleHint}
          className="md:hidden absolute top-[110%] right-0 z-50 w-max max-w-[220px] bg-slate-900 text-white text-[11px] font-semibold rounded-xl px-3 py-2 shadow-xl text-left leading-snug"
        >{t('shell_account_desc')}<span className="block text-[10px] text-slate-400 mt-0.5">{t('shell_dismiss')}</span>
        </button>
      </>
    )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row antialiased selection:bg-teal-100">

      {/* ========================================================
          1. DESKTOP SIDEBAR (>= 768px)
         ======================================================== */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 shadow-xs flex-shrink-0">
        <div className="p-5 border-b border-slate-100">
          <Link to={cfg.home} className="flex items-center gap-3 group">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  SmarT<span className={theme.softText}>CARE</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${theme.soft} ${theme.softText} ${theme.border}`}>
                  {cfg.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{t(TAGLINE_KEYS[cfg.tagline] || '', cfg.tagline)}</p>
            </div>
          </Link>

          {/* Persona card for the active role */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full ${theme.solid} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                {cfg.persona.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 leading-none truncate">
                  {role === 'elderly' ? (user?.name || cfg.persona.name) : cfg.persona.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{t(PERSONA_KEYS[cfg.persona.detail] || '', cfg.persona.detail)}</p>
              </div>
            </div>
            <RoleSwitchButton />
          </div>
        </div>

        {/* Role-specific navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {cfg.nav.map((item) => {
            const active = isActivePath(item.path);
            const badge = badgeFor(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[48px] ${
                  active
                    ? `${theme.solid} text-white shadow-md`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon name={item.icon} className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span className="flex-1">{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
                {badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Secondary links for this role */}
          {cfg.more.length > 0 && (
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
              <p className="px-4 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">{t('shell_more')}</p>
              {cfg.more.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs transition min-h-[42px]"
                >
                  <Icon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                  <span>{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
          {cfg.showVoiceButton && (
            <button
              onClick={() => setVoiceModalOpen(true)}
              className={`w-full bg-gradient-to-r ${theme.gradient} text-white rounded-2xl p-3.5 flex items-center justify-center gap-2.5 font-extrabold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[50px]`}
            >
              <Mic className="w-5 h-5" />
              <span>{t('shell_talk')}</span>
            </button>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex-1 flex items-center justify-between bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition min-h-[40px]"
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>{currentLanguageObj.flag} {currentLanguageObj.native}</span>
              </span>
              <span className="text-[10px] text-slate-400">{t('shell_change')}</span>
            </button>

            <button
              onClick={toggleSimulatedOffline}
              title={syncState.simulatedOffline ? 'Simulated Offline active' : 'Network Online'}
              className={`p-2 rounded-xl border transition flex items-center justify-center min-h-[40px] min-w-[40px] ${
                syncState.simulatedOffline
                  ? 'bg-amber-100 border-amber-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {syncState.simulatedOffline
                ? <WifiOff className="w-4 h-4 text-amber-700" />
                : <Wifi className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
            <Link to="/about" className="hover:text-teal-600 transition">{t('shell_about')}</Link>
            <button onClick={() => setDemoTourStep(1)} className="hover:text-teal-600 transition">{t('shell_tour')}</button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. MOBILE TOP BAR (< 768px)
         ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shadow-xs">
        <Link to={cfg.home} className="flex items-center gap-2 min-w-0 flex-shrink">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white shadow-xs flex-shrink-0`}>
            <Brain className="w-5 h-5" />
          </div>
          {/* Wordmark hides on very narrow phones so the role switcher always fits */}
          <span className="font-extrabold text-base text-slate-900 leading-none truncate hidden min-[380px]:block">
            SmarT<span className={theme.softText}>CARE</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Role switcher — the only route into the caregiver / CHO portals */}
          <RoleSwitchButton compact />

          <button
            onClick={() => setLangModalOpen(true)}
            className="flex items-center justify-center bg-slate-100 text-slate-700 w-10 h-10 rounded-xl text-sm font-bold border border-slate-200 min-h-[44px] min-w-[44px]"
            aria-label={t('shell_choose_language')}
          >
            <span>{currentLanguageObj.flag}</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          3. MAIN CONTENT
         ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ========================================================
          4. MOBILE BOTTOM NAVIGATION — role specific
         ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
        {cfg.mobileNav.slice(0, 2).map((item) => {
          const active = isActivePath(item.path);
          const badge = badgeFor(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl min-h-[48px] flex-1 ${
                active ? `${theme.softText} font-extrabold` : 'text-slate-500'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
              {badge && (
                <span className="absolute top-0 right-1 bg-rose-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Centre voice button */}
        <div className="-mt-6 flex-shrink-0 px-1">
          <button
            onClick={() => setVoiceModalOpen(true)}
            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${theme.gradient} text-white flex items-center justify-center shadow-xl transform active:scale-95 transition min-h-[56px] min-w-[56px]`}
            aria-label={t('shell_talk')}
          >
            <Mic className="w-7 h-7" />
          </button>
        </div>

        {cfg.mobileNav.slice(2, 4).map((item) => {
          const active = isActivePath(item.path);
          const badge = badgeFor(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl min-h-[48px] flex-1 ${
                active ? `${theme.softText} font-extrabold` : 'text-slate-500'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
              {badge && (
                <span className="absolute top-0 right-1 bg-rose-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl min-h-[48px] flex-1 text-slate-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('shell_more')}</span>
        </button>
      </nav>

      {/* ========================================================
          5. MOBILE "MORE" DRAWER — role specific
         ======================================================== */}
      {moreDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setMoreDrawerOpen(false)}
        >
          <div
            className="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-lg">{t('shell_menu')}</span>
                <button
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current role + quick switch */}
              <div className={`p-3 rounded-2xl border ${theme.soft} ${theme.border} space-y-2`}>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t('shell_signed_in_as')}</p>
                <p className="text-sm font-bold text-slate-900">{cfg.persona.name}</p>
                <p className="text-[11px] text-slate-500">{cfg.persona.detail}</p>
                <button
                  onClick={() => { setMoreDrawerOpen(false); openRolePicker(); }}
                  className={`w-full mt-1 ${theme.solid} text-white rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[40px]`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> {t('shell_account')} &amp; {t('shell_signout')}
                </button>
              </div>

              <div className="space-y-1">
                {[...cfg.nav, ...cfg.more].map((item) => (
                  <Link
                    key={item.path + item.label}
                    to={item.path}
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                  >
                    <Icon name={item.icon} className={`w-4 h-4 ${theme.softText}`} />
                    <span>{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <Link to="/about" onClick={() => setMoreDrawerOpen(false)} className="block hover:text-teal-600 font-medium">{t('shell_about')}</Link>
              <button
                onClick={() => { setMoreDrawerOpen(false); setDemoTourStep(1); }}
                className="text-teal-700 font-bold"
              >{t('shell_tour')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. ACCOUNT MODAL — identity + sign out
         ======================================================== */}
      {roleModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setRoleModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{t('shell_your_account')}</h3>
                <p className="text-xs text-slate-500">{t('shell_own_details')}</p>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Who is signed in */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${theme.soft} ${theme.border}`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.gradient} text-white flex items-center justify-center font-black text-lg flex-shrink-0`}>
                {account?.avatar || cfg.persona.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">
                  {account?.name || cfg.persona.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {account?.detail || cfg.persona.detail}
                </p>
                <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${theme.solid} text-white`}>
                  {cfg.label}
                </span>
              </div>
            </div>

            {/* What this account can reach */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t('shell_access')}</p>
              {cfg.nav.map(item => (
                <div key={item.path} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                  <Check className={`w-3.5 h-3.5 ${theme.softText} flex-shrink-0`} />
                  <span>{t(NAV_LABEL_KEYS[item.label] || '', item.label)}</span>
                </div>
              ))}
            </div>

            {/* A senior should never be able to lock themselves out of their own
                reminders, so their panel offers a handover to family instead of
                a sign-out. Staff, who hold other people's data, get a real one. */}
            {role === 'elderly' ? (
              <>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">{t('shell_no_password')}</p>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3.5 rounded-2xl text-sm transition active:scale-[0.98] min-h-[50px] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />{t('shell_hand_phone')}</button>
              </>
            ) : (
              <>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">{t('shell_hand_phone_desc')}</p>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition active:scale-[0.98] min-h-[50px] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />{t('shell_signout')}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          7. LANGUAGE MODAL
         ======================================================== */}
      {langModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setLangModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">{t('shell_choose_language')}</h3>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] sm:max-h-80 overflow-y-auto p-1">
              {supportedLanguages.map((langItem) => {
                const isSelected = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    onClick={() => { setLanguage(langItem.code); setLangModalOpen(false); }}
                    className={`flex items-center justify-between p-3 rounded-2xl text-left border transition min-h-[48px] ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{langItem.flag}</span>
                      <div>
                        <p className="text-xs font-bold">{langItem.native}</p>
                        <p className="text-[10px] text-slate-400">{langItem.name}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. GLOBAL VOICE MODAL
         ======================================================== */}
      <VoiceActionModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    {role !== 'elderly' && <LiveToast />}
    </div>
  );
}
