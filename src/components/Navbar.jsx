import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Brain, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Globe, 
  Play, 
  Menu, 
  X,
  ChevronDown,
  Check
} from 'lucide-react';

export default function Navbar() {
  const {
    role,
    setRole,
    user,
    accessibility,
    toggleVoiceEnabled,
    syncState,
    toggleSimulatedOffline,
    syncNow,
    language,
    setLanguage,
    t,
    currentLanguageObj,
    supportedLanguages,
    setDemoTourStep
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const location = useLocation();
  const langMenuRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSyncClick = async () => {
    setSyncing(true);
    await syncNow();
    setTimeout(() => setSyncing(false), 600);
  };

  const navLinks = [
    { label: t('nav_home', 'Home'), path: '/' },
    { label: t('nav_elderly', 'Elderly App'), path: '/elderly' },
    { label: t('nav_games', 'Games'), path: '/games' },
    { label: t('nav_breathing', 'Breathing'), path: '/breathing' },
    { label: t('nav_reminders', 'Reminders'), path: '/reminders' },
    { label: t('nav_assistant', 'Voice Assistant'), path: '/assistant' },
    { label: t('nav_caregiver', 'Caregiver'), path: '/caregiver' },
    { label: t('nav_healthcare', 'Healthcare'), path: '/healthcare' },
    { label: t('nav_architecture', 'Architecture'), path: '/architecture' },
    { label: t('nav_about', 'About'), path: '/about' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Banner: SIH 2026 & Offline Simulator Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white text-xs px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">SIH 2026</span>
          <span className="hidden md:inline">Problem 26003 • Ministry of Development of North Eastern Region (MDoNER)</span>
          <span className="md:hidden">SmarTCARE • Team Phantom techie</span>
        </div>

        {/* Network & Offline Mode Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSimulatedOffline}
            title="Toggle simulated offline mode to demo remote NER connectivity"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold transition ${
              syncState.simulatedOffline 
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300' 
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-900'
            }`}
          >
            {syncState.simulatedOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-950 animate-pulse" />
                <span>{t('nav_offline_sim', 'Simulated Offline Mode')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('nav_online', 'Online (NER Sync Ready)')}</span>
              </>
            )}
          </button>

          {syncState.queueLength > 0 && (
            <button
              onClick={handleSyncClick}
              disabled={syncing}
              className="flex items-center gap-1 bg-white text-teal-800 px-2 py-0.5 rounded text-xs font-bold hover:bg-teal-50 transition"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>Sync ({syncState.queueLength})</span>
            </button>
          )}

          {/* Quick Demo Tour launcher */}
          <button
            onClick={() => setDemoTourStep(1)}
            className="flex items-center gap-1 bg-amber-400 text-amber-950 hover:bg-amber-300 px-2.5 py-0.5 rounded font-bold shadow-sm transition"
          >
            <Play className="w-3 h-3 fill-amber-950" />
            <span>{t('nav_demo_tour', 'SIH Demo Tour')}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">SmarT<span className="text-teal-600">CARE</span></span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full">NER</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">{t('tagline', 'Cognitive Care for Brighter Tomorrows')}</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'text-teal-700 bg-teal-50 shadow-xs'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Toolbar: Role Switcher, Language Dropdown & Accessibility */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Working 11-Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 shadow-xs transition"
              title="Change Application Language"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{currentLanguageObj.flag} {currentLanguageObj.native}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu listing all 11 Languages */}
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-teal-500 p-2 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider block">
                    Choose Language (ভাষা / भाषा)
                  </span>
                  <span className="text-xs text-slate-500">11 North Eastern & National Languages</span>
                </div>

                <div className="space-y-1">
                  {supportedLanguages.map(l => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition ${
                          isSelected
                            ? 'bg-teal-50 border border-teal-300 text-teal-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <div>
                            <span className="font-extrabold text-slate-900 block">{l.native}</span>
                            <span className="text-[10px] text-slate-400">{l.name} • {l.region}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Voice Audio On/Off */}
          <button
            onClick={toggleVoiceEnabled}
            title={accessibility.voiceEnabled ? "Voice Guidance & Chimes ON" : "Voice Guidance MUTED"}
            className={`p-2 rounded-lg border transition ${
              accessibility.voiceEnabled 
                ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' 
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {accessibility.voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="elderly">Elderly: Asha (68)</option>
              <option value="caregiver">Caregiver: Sunita</option>
              <option value="healthcare">Healthcare: Dr. Barua</option>
              <option value="admin">MDoNER Admin</option>
            </select>
          </div>

          <Link
            to="/elderly"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{t('nav_open_app', 'Open App')}</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile quick language toggle button */}
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 bg-slate-100 border border-slate-300 text-xs font-bold px-2 py-1 rounded"
          >
            <span>{currentLanguageObj.flag}</span>
            <span className="text-[11px] font-bold">{currentLanguageObj.code.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setDemoTourStep(1)}
            className="bg-amber-400 text-amber-950 font-bold px-2 py-1 rounded text-xs"
          >
            Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-50 text-slate-800 font-semibold hover:bg-teal-50 hover:text-teal-700 text-xs"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Language Grid */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              Language (11 Languages)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {supportedLanguages.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg font-bold border transition text-left flex items-center gap-1.5 ${
                    language === l.code ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span className="truncate">{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Switch Role</span>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-slate-100 border border-slate-300 text-xs font-bold rounded px-2 py-1"
            >
              <option value="elderly">Elderly: Asha (68)</option>
              <option value="caregiver">Caregiver: Sunita</option>
              <option value="healthcare">Healthcare: Dr. Barua</option>
              <option value="admin">MDoNER Admin</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
