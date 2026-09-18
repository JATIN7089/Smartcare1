import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { authService } from '../services/authService.js';
import { syncEngine } from '../services/syncEngine.js';
import { soundService } from '../services/soundService.js';
import { voiceService } from '../services/voiceService.js';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication & Role
  // `account` is the signed-in identity; `role` is derived from it, so the
  // role can no longer be changed by the UI alone.
  const [account, setAccount] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [role, setRole] = useState('elderly'); // elderly | caregiver | healthcare
  const [user, setUser] = useState({
    id: 'user-asha-68',
    name: 'Asha Sharma',
    age: 68,
    location: 'Tezpur, Assam (NER)',
    role: 'elderly',
    preferredLanguage: 'en',
    culturalRegion: 'Assam',
    joinCode: 'SMT-4821',
    caregiver: { name: 'Sunita Sharma (Daughter)', phone: '+91 98640 12345' },
    healthcareWorker: { name: 'Dr. B. K. Barua (CHO)', center: 'Sonitpur SDH' }
  });

  // Cognitive State
  const [cognitiveProfile, setCognitiveProfile] = useState({
    userId: 'user-asha-68',
    overallScore: 81,
    metrics: { memory: 82, attention: 74, pattern: 91, dailyRecall: 79, reactionTimeScore: 78, consistency: 85 },
    difficultyLevel: 'Moderate',
    recentTrend: 'Stable activity',
    explanation: 'Based on your recent memory-game accuracy (84%) and steady response pace, SmarTCARE selected a moderate challenge level to maintain comfortable cognitive engagement without fatigue.',
    sessionHistory: [
      { date: '2026-09-10', memory: 78, attention: 70, pattern: 88, recall: 75, avgResponseTime: 3.4 },
      { date: '2026-09-11', memory: 80, attention: 72, pattern: 89, recall: 76, avgResponseTime: 3.2 },
      { date: '2026-09-12', memory: 79, attention: 73, pattern: 90, recall: 78, avgResponseTime: 3.1 },
      { date: '2026-09-13', memory: 81, attention: 71, pattern: 92, recall: 79, avgResponseTime: 3.0 },
      { date: '2026-09-14', memory: 83, attention: 75, pattern: 90, recall: 80, avgResponseTime: 2.9 },
      { date: '2026-09-15', memory: 82, attention: 74, pattern: 91, recall: 79, avgResponseTime: 2.8 },
      { date: '2026-09-16', memory: 84, attention: 76, pattern: 93, recall: 81, avgResponseTime: 2.7 }
    ]
  });

  // Reminders, Routine, Wellbeing
  const [reminders, setReminders] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [breathingSessions, setBreathingSessions] = useState([]);
  const [familyMemories, setFamilyMemories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activityPlans, setActivityPlans] = useState([]);

  // Cultural Region & Language
  const [culturalRegion, setCulturalRegion] = useState('Assam');
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('smartcare_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const handleLanguageChange = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('smartcare_language', newLang);
    } catch (e) {}
    soundService.playFlipTone();
  };

  // Helper translation function
  const t = (key, fallback = '') => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
      return TRANSLATIONS[language][key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const currentLanguageObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Accessibility Controls
  const [accessibility, setAccessibility] = useState({
    textSize: 'normal', // normal | large | xlarge
    highContrast: false,
    reducedMotion: false,
    voiceEnabled: true,
    simpleLanguage: false
  });

  // Offline Sync State
  const [syncState, setSyncState] = useState({
    isOnline: true,
    simulatedOffline: false,
    effectiveOnline: true,
    queueLength: 0,
    meta: { lastSynced: 'Just now', totalSynced: 42 }
  });

  // Hackathon Guided Demo Tour State (0 = closed, 1-14 = step active)
  const [demoTourStep, setDemoTourStep] = useState(0);

  // Restore any existing session before deciding what to render.
  useEffect(() => {
    let alive = true;
    authService.restore()
      .then(acc => {
        if (!alive) return;
        if (acc) {
          setAccount(acc);
          setRole(acc.role);
        }
      })
      .finally(() => { if (alive) setAuthChecked(true); });
    return () => { alive = false; };
  }, []);

  // Load app data once a session exists.
  useEffect(() => {
    if (!account) return undefined;
    loadInitialData();

    const unsubscribeSync = syncEngine.subscribe(state => {
      setSyncState(state);
    });

    return () => {
      unsubscribeSync();
    };
  }, [account]);

  /** Adopts whatever role the freshly created session carries. */
  const adopt = (res) => {
    if (res.success && res.account) {
      setAccount(res.account);
      setRole(res.account.role);
    }
    return res;
  };

  /**
   * Opens the senior's home with no credentials. Someone living with dementia
   * cannot be asked to recall a password, so the device itself is the key.
   */
  const enterAsResident = async (username) => adopt(await authService.enter(username));

  /** Staff sign-in — caregivers and health workers handle real health data. */
  const login = async (credentials) => adopt(await authService.login(credentials));

  /** Staff registration. Seniors never register; their profile is set up for them. */
  const register = async (details) => adopt(await authService.register(details));

  const logout = async () => {
    await authService.logout();
    setAccount(null);
    setRole('elderly');
  };

  const loadInitialData = async () => {
    try {
      const [u, prof, rem, rout, br, mem, alt, plans] = await Promise.all([
        api.getCurrentUser(),
        api.getCognitiveProfile(),
        api.getReminders(),
        api.getRoutines(),
        fetch('/api/breathing').then(r => r.json()).catch(() => []),
        api.getMemories(),
        api.getAlerts(),
        api.getActivityPlans()
      ]);

      if (u) setUser(u);
      if (prof) setCognitiveProfile(prof);
      if (rem && rem.length) setReminders(rem);
      if (rout && rout.length) setRoutine(rout);
      if (br && br.length) setBreathingSessions(br);
      if (mem && mem.length) setFamilyMemories(mem);
      if (alt && alt.length) setAlerts(alt);
      if (plans && plans.length) setActivityPlans(plans);
    } catch (e) {
      console.warn('Initial data load note:', e);
    }
  };

  // Role Switching
  /**
   * Roles come from the signed-in account, so this only permits a change the
   * account is actually entitled to. A senior can never become a caregiver or
   * health worker by toggling the UI — they must sign in with those details.
   */
  const handleRoleChange = async (newRole) => {
    if (!account) return { success: false, message: 'Please sign in first.' };
    if (account.role !== newRole) {
      return {
        success: false,
        message: `You are signed in as ${account.name}. Sign out to use a different account.`
      };
    }
    setRole(newRole);
    setUser(prev => ({ ...prev, role: newRole }));
    await api.switchRole(newRole);
    return { success: true };
  };

  // Accessibility Toggles
  const setTextSize = (size) => setAccessibility(prev => ({ ...prev, textSize: size }));
  const toggleHighContrast = () => setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  const toggleReducedMotion = () => setAccessibility(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  const toggleVoiceEnabled = () => {
    setAccessibility(prev => {
      const next = !prev.voiceEnabled;
      voiceService.enabled = next;
      soundService.isMuted = !next;
      return { ...prev, voiceEnabled: next };
    });
  };
  const toggleSimpleLanguage = () => setAccessibility(prev => ({ ...prev, simpleLanguage: !prev.simpleLanguage }));

  // Offline Simulator Toggle
  const toggleSimulatedOffline = () => {
    const next = !syncState.simulatedOffline;
    syncEngine.setSimulatedOffline(next);
  };

  const syncNow = async () => {
    const result = await syncEngine.syncQueuedData();
    if (result && result.success) {
      soundService.playSuccessChime();
      await loadInitialData();
    }
    return result;
  };

  // Action methods
  const handleToggleReminder = async (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    soundService.playSuccessChime();
    await api.toggleReminder(id);
  };

  const handleAddReminder = async (newRem) => {
    const res = await api.addReminder(newRem);
    if (res?.reminder) {
      setReminders(prev => [...prev, res.reminder]);
    }
  };

  const handleDeleteReminder = async (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    await api.deleteReminder(id);
  };

  const handleToggleRoutine = async (index) => {
    setRoutine(prev => prev.map((item, i) => i === index ? { ...item, done: !item.done } : item));
    soundService.playFlipTone();
    await api.toggleRoutine(index);
  };

  const handleRecordBreathing = async (sessionData) => {
    const res = await api.recordBreathingSession(sessionData);
    setBreathingSessions(prev => [sessionData, ...prev]);
    soundService.playSingingBowl();
    return res;
  };

  const handleAddMemory = async (memory) => {
    const res = await api.addMemory(memory);
    if (res?.memory) {
      setFamilyMemories(prev => [res.memory, ...prev]);
    }
  };

  const handleDismissAlert = async (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    await api.dismissAlert(id);
  };

  const handleTogglePlanTask = async (planId, taskId) => {
    setActivityPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      }
      return p;
    }));
    await api.togglePlanTask(planId, taskId);
  };

  const updateProfileAfterGame = (resultData, computedScore, adaptedDifficulty, explanation) => {
    setCognitiveProfile(prev => ({
      ...prev,
      overallScore: computedScore || prev.overallScore,
      difficultyLevel: adaptedDifficulty || prev.difficultyLevel,
      explanation: explanation || prev.explanation,
      metrics: {
        ...prev.metrics,
        memory: Math.round((prev.metrics.memory * 0.7) + ((resultData.accuracy || 80) * 0.3))
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole: handleRoleChange,
        account,
        authChecked,
        enterAsResident,
        login,
        register,
        logout,
        user,
        setUser,
        cognitiveProfile,
        setCognitiveProfile,
        updateProfileAfterGame,
        reminders,
        handleToggleReminder,
        handleAddReminder,
        handleDeleteReminder,
        routine,
        handleToggleRoutine,
        breathingSessions,
        handleRecordBreathing,
        familyMemories,
        handleAddMemory,
        alerts,
        handleDismissAlert,
        activityPlans,
        handleTogglePlanTask,
        culturalRegion,
        setCulturalRegion,
        language,
        setLanguage: handleLanguageChange,
        t,
        currentLanguageObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
        accessibility,
        setTextSize,
        toggleHighContrast,
        toggleReducedMotion,
        toggleVoiceEnabled,
        toggleSimpleLanguage,
        syncState,
        toggleSimulatedOffline,
        syncNow,
        demoTourStep,
        setDemoTourStep,
        reloadAllData: loadInitialData
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-200 ${
          accessibility.highContrast
            ? 'bg-amber-50/20 text-black contrast-125'
            : 'bg-[#fafbfe] text-slate-800'
        } ${
          accessibility.textSize === 'large'
            ? 'text-lg'
            : accessibility.textSize === 'xlarge'
            ? 'text-xl'
            : 'text-base'
        }`}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
