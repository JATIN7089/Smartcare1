import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import VoiceActionModal from './VoiceActionModal.jsx';
import { ROLES, ROLE_LIST, getRole } from '../data/roles.js';
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
  ArrowLeftRight
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
    setDemoTourStep
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const cfg = getRole(role);
  const theme = cfg.theme;

  /** Switching role also lands the user on that role's own home page. */
  const switchRole = (newRole) => {
    setRole(newRole);
    setRoleModalOpen(false);
    setMoreDrawerOpen(false);
    navigate(ROLES[newRole].home);
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
     ============================================================ */
  const RoleSwitchButton = ({ compact = false }) => (
    <button
      onClick={() => setRoleModalOpen(true)}
      className={`flex items-center gap-1.5 rounded-xl border font-bold transition min-h-[44px] ${
        compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs w-full justify-between'
      } ${theme.soft} ${theme.softText} ${theme.border} hover:brightness-95`}
      title="Switch role"
    >
      <span className="flex items-center gap-1.5">
        <ArrowLeftRight className="w-3.5 h-3.5" />
        <span>{compact ? cfg.shortLabel : cfg.label}</span>
      </span>
      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
    </button>
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
              <p className="text-[11px] text-slate-400 font-medium">{cfg.tagline}</p>
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
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{cfg.persona.detail}</p>
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
                <span className="flex-1">{item.label}</span>
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
              <p className="px-4 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">More</p>
              {cfg.more.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs transition min-h-[42px]"
                >
                  <Icon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
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
              <span>Talk to SmarTCARE</span>
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
              <span className="text-[10px] text-slate-400">Change</span>
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
            <Link to="/about" className="hover:text-teal-600 transition">About SmarTCARE</Link>
            <button onClick={() => setDemoTourStep(1)} className="hover:text-teal-600 transition">Tour</button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. MOBILE TOP BAR (< 768px)
         ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shadow-xs">
        <Link to={cfg.home} className="flex items-center gap-2 min-w-0">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white shadow-xs flex-shrink-0`}>
            <Brain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-base text-slate-900 block leading-none truncate">
              SmarT<span className={theme.softText}>CARE</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{cfg.tagline}</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Role switcher — the key fix: reachable on phones */}
          <RoleSwitchButton compact />

          <button
            onClick={() => setLangModalOpen(true)}
            className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 min-h-[44px]"
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
              <span className="text-[10px] mt-0.5 truncate max-w-full">{item.label}</span>
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
            aria-label="Talk to SmarTCARE"
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
              <span className="text-[10px] mt-0.5 truncate max-w-full">{item.label}</span>
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
          <span className="text-[10px] mt-0.5">More</span>
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
                <span className="font-extrabold text-slate-900 text-lg">Menu</span>
                <button
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current role + quick switch */}
              <div className={`p-3 rounded-2xl border ${theme.soft} ${theme.border} space-y-2`}>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Signed in as</p>
                <p className="text-sm font-bold text-slate-900">{cfg.persona.name}</p>
                <p className="text-[11px] text-slate-500">{cfg.persona.detail}</p>
                <button
                  onClick={() => { setMoreDrawerOpen(false); setRoleModalOpen(true); }}
                  className={`w-full mt-1 ${theme.solid} text-white rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[40px]`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Switch Role
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
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <Link to="/about" onClick={() => setMoreDrawerOpen(false)} className="block hover:text-teal-600 font-medium">
                About SmarTCARE Project
              </Link>
              <button
                onClick={() => { setMoreDrawerOpen(false); setDemoTourStep(1); }}
                className="text-teal-700 font-bold"
              >
                Launch SIH Demo Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. ROLE SWITCHER MODAL
         ======================================================== */}
      {roleModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setRoleModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Choose Your View</h3>
                <p className="text-xs text-slate-500">Each role shows different information</p>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {ROLE_LIST.map((r) => {
                const selected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition min-h-[64px] ${
                      selected
                        ? `${r.theme.soft} ${r.theme.border} shadow-xs`
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${r.theme.gradient} text-white flex items-center justify-center font-black flex-shrink-0`}>
                      {r.persona.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900">{r.label}</p>
                      <p className="text-[11px] text-slate-500 truncate">{r.description}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{r.persona.name} · {r.persona.detail}</p>
                    </div>
                    {selected && <Check className={`w-5 h-5 flex-shrink-0 ${r.theme.softText}`} />}
                  </button>
                );
              })}
            </div>
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
                <h3 className="text-lg font-black text-slate-900">Choose Language</h3>
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
    </div>
  );
}
