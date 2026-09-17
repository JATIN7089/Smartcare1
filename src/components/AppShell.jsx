import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import VoiceActionModal from './VoiceActionModal.jsx';
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
  ChevronRight, 
  Check, 
  Clock, 
  Heart,
  Info,
  Layers,
  Wifi,
  WifiOff,
  RefreshCw,
  Play
} from 'lucide-react';

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
    syncNow,
    setDemoTourStep
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncNow();
    setTimeout(() => setSyncing(false), 600);
  };

  // Primary navigation items by role
  const elderlyNav = [
    { label: t('nav_home', 'Home'), path: '/elderly', icon: Home },
    { label: t('nav_games', 'Activities'), path: '/games', icon: Puzzle },
    { label: 'Memory', path: '/games/memory', icon: Brain },
    { label: t('nav_breathing', 'Breathe'), path: '/breathing', icon: Wind },
    { label: t('nav_reminders', 'Reminders'), path: '/reminders', icon: Bell },
    { label: t('nav_assistant', 'Assistant'), path: '/assistant', icon: Mic },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const caregiverNav = [
    { label: 'Patients', path: '/caregiver', icon: Users },
    { label: 'Alerts', path: '/caregiver/alerts', icon: Bell },
    { label: 'Reports', path: '/caregiver/reports', icon: FileText },
    { label: 'Elderly App', path: '/elderly', icon: Home },
  ];

  const healthcareNav = [
    { label: 'Patients', path: '/healthcare', icon: Users },
    { label: 'Activity', path: '/caregiver/reports', icon: Activity },
    { label: 'Clinic Overview', path: '/healthcare', icon: Heart },
    { label: 'Elderly App', path: '/elderly', icon: Home },
  ];

  const currentNav = role === 'caregiver' ? caregiverNav : role === 'healthcare' ? healthcareNav : elderlyNav;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row antialiased selection:bg-teal-100">
      {/* ========================================================
          1. DESKTOP & TABLET SIDEBAR (>= 768px)
          Modern, calm, uncluttered application navigation
         ======================================================== */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 shadow-xs flex-shrink-0">
        {/* Brand App Header */}
        <div className="p-5 border-b border-slate-100">
          <Link to="/elderly" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  SmarT<span className="text-teal-600">CARE</span>
                </span>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full border border-teal-200">
                  App
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Daily Companion</p>
            </div>
          </Link>

          {/* User Mini Card */}
          <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Asha Sharma'}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Tezpur • {user?.age || 68} yrs</p>
              </div>
            </div>

            {/* Quick Role Switcher Pill */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-[11px] font-bold bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              title="Switch user role"
            >
              <option value="elderly">Elderly</option>
              <option value="caregiver">Caregiver</option>
              <option value="healthcare">Health CHO</option>
            </select>
          </div>
        </div>

        {/* Primary Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/elderly' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[48px] ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Controls: Voice Hero & Language */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
          {/* Prominent Voice Assistant CTA */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white rounded-2xl p-3.5 flex items-center justify-center gap-2.5 font-extrabold text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[50px]"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>Talk to SmarTCARE</span>
          </button>

          {/* Language Switcher Pill */}
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

            {/* Offline Simulation Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              title={syncState.simulatedOffline ? 'Simulated Offline active' : 'Network Online'}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center min-h-[40px] min-w-[40px] ${
                syncState.simulatedOffline 
                  ? 'bg-amber-100 border-amber-300 text-amber-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {syncState.simulatedOffline ? (
                <WifiOff className="w-4 h-4 text-amber-700" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-600" />
              )}
            </button>
          </div>

          {/* Subtle More / Project Info Link */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
            <Link to="/about" className="hover:text-teal-600 transition">About SmarTCARE</Link>
            <button onClick={() => setDemoTourStep(1)} className="hover:text-teal-600 transition">Tour</button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. MOBILE TOP BAR (< 768px)
         ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link to="/elderly" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900">SmarT<span className="text-teal-600">CARE</span></span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Language Pill */}
          <button
            onClick={() => setLangModalOpen(true)}
            className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 min-h-[44px]"
          >
            <span>{currentLanguageObj.flag}</span>
            <span className="text-[11px]">{currentLanguageObj.code.toUpperCase()}</span>
          </button>

          {/* Quick Voice Mic */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md min-h-[44px] min-w-[44px]"
            aria-label="Voice Assistant"
          >
            <Mic className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      </header>

      {/* ========================================================
          3. MAIN CONTENT CONTAINER
         ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ========================================================
          4. MOBILE BOTTOM NAVIGATION BAR (< 768px)
          Large touch targets, elevated center voice button
         ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {/* Home */}
        <Link
          to="/elderly"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[48px] ${
            location.pathname === '/elderly' || location.pathname === '/' ? 'text-teal-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* Activities */}
        <Link
          to="/games"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[48px] ${
            location.pathname.startsWith('/games') ? 'text-teal-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Puzzle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Activities</span>
        </Link>

        {/* Big Center Floating Voice Button */}
        <div className="-mt-6">
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center shadow-xl shadow-teal-500/30 transform active:scale-95 transition min-h-[56px] min-w-[56px]"
            aria-label="Talk to SmarTCARE"
          >
            <Mic className="w-7 h-7" />
          </button>
        </div>

        {/* Breathe */}
        <Link
          to="/breathing"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[48px] ${
            location.pathname === '/breathing' ? 'text-teal-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Wind className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Breathe</span>
        </Link>

        {/* More App Menu */}
        <button
          onClick={() => setMoreDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[48px] text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* ========================================================
          5. MOBILE "MORE" APP DRAWER
         ======================================================== */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
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

              {/* Secondary Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/reminders"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <Bell className="w-4 h-4 text-teal-600" /> Reminders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <User className="w-4 h-4 text-teal-600" /> Your Progress
                </Link>
                <Link
                  to="/routine"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <Clock className="w-4 h-4 text-teal-600" /> Daily Routine
                </Link>
                <Link
                  to="/memory-lane"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <Heart className="w-4 h-4 text-teal-600" /> Memory Lane
                </Link>
                <Link
                  to="/grounding"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" /> Grounding Exercise
                </Link>
                <Link
                  to="/caregiver"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[44px]"
                >
                  <Users className="w-4 h-4 text-teal-600" /> Caregiver Portal
                </Link>
              </div>
            </div>

            {/* Bottom Project Info */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <Link
                to="/about"
                onClick={() => setMoreDrawerOpen(false)}
                className="block hover:text-teal-600 font-medium"
              >
                About SmarTCARE Project
              </Link>
              <button
                onClick={() => {
                  setMoreDrawerOpen(false);
                  setDemoTourStep(1);
                }}
                className="text-teal-700 font-bold"
              >
                Launch SIH Demo Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 11-LANGUAGE SELECTION MODAL
         ======================================================== */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
              {supportedLanguages.map((langItem) => {
                const isSelected = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    onClick={() => {
                      setLanguage(langItem.code);
                      setLangModalOpen(false);
                    }}
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
          7. GLOBAL VOICE ACTION MODAL
         ======================================================== */}
      <VoiceActionModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
}
