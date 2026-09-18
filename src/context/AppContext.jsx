import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { authService } from '../services/authService.js';
import { syncEngine } from '../services/syncEngine.js';
import { soundService } from '../services/soundService.js';
import { voiceService } from '../services/voiceService.js';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations.js';

const INITIAL_REMINDERS = [
  { id: 'rem-1', title: 'Blood Pressure & Heart Medicine', category: 'Medicine', time: '08:00 AM', date: 'Daily', completed: true, notes: 'Take with warm water after morning tea & breakfast' },
  { id: 'rem-2', title: 'Hydration Break (Fresh Water / Chamomile)', category: 'Hydration', time: '10:00 AM', date: 'Daily', completed: true, notes: 'Drink a full glass of lukewarm water' },
  { id: 'rem-3', title: 'Afternoon Memory Exercise', category: 'Cognitive Activity', time: '02:30 PM', date: 'Daily', completed: false, notes: 'Play 1 session of NER Cultural Match' },
  { id: 'rem-4', title: 'Doctor Follow-Up Consultation', category: 'Appointments', time: '04:00 PM', date: 'Today', completed: false, notes: 'Dr. Barua tele-checkin or Sonitpur clinic' },
  { id: 'rem-5', title: 'Evening Walk in Courtyard', category: 'Exercise', time: '05:30 PM', date: 'Daily', completed: false, notes: '15-minute gentle walk around tea garden garden' },
  { id: 'rem-6', title: 'Evening Calming Breathing Session', category: 'Well-being', time: '08:30 PM', date: 'Daily', completed: false, notes: '5 minutes of paced breathing before sleep' }
];

const INITIAL_ROUTINE = [
  { time: '07:00 AM', label: 'Wake up & gentle stretch', done: true, icon: 'Sun' },
  { time: '08:00 AM', label: 'Morning Tea, Breakfast + Medication', done: true, icon: 'Coffee' },
  { time: '10:00 AM', label: 'Morning Hydration & Garden walk', done: true, icon: 'Droplets' },
  { time: '11:00 AM', label: 'SmarTCARE Cognitive Game Session', done: false, icon: 'Brain' },
  { time: '01:00 PM', label: 'Nutritious lunch with family', done: false, icon: 'Utensils' },
  { time: '02:30 PM', label: 'Rest & Memory Lane reminiscence', done: false, icon: 'BookOpen' },
  { time: '04:00 PM', label: 'Doctor Tele-Consultation / Routine check', done: false, icon: 'Stethoscope' },
  { time: '06:00 PM', label: 'Tea & Family conversation with Rita', done: false, icon: 'Users' },
  { time: '08:30 PM', label: 'Evening Breathing & Lights out', done: false, icon: 'Moon' }
];

const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Rita — Elder Daughter',
    relationship: 'Daughter',
    location: 'Guwahati, Assam',
    year: '2025',
    question: 'Who is this visiting you during Rongali Bihu?',
    answer: 'Rita, your elder daughter who lives in Guwahati.',
    category: 'Person',
    subject: 'Rita',
    voiceNote: 'This is Rita, your elder daughter. She lives in Guwahati and calls you every evening.',
    photo: '/memories/rita.jpg',
    notes: 'Rita calls every evening at 6:00 PM to talk about the grandchildren.',
    themeColor: '#3b82f6'
  },
  {
    id: 'mem-2',
    title: 'Bihu Celebration at Tezpur Courtyard',
    relationship: 'Family Festival',
    location: 'Tezpur Ancestral House',
    year: '2024',
    question: 'Which festival were we celebrating when we prepared fresh Pitha and Laru?',
    answer: 'Rongali Bihu in the month of Bohag!',
    category: 'Event',
    subject: 'Rongali Bihu',
    voiceNote: 'This is Rongali Bihu at your Tezpur courtyard.',
    photo: null,
    notes: 'Asha made Til Pitha and played the Tokari with her grandchildren.',
    themeColor: '#ea580c'
  },
  {
    id: 'mem-3',
    title: 'Trip to Majuli Island',
    relationship: 'Travel Memory',
    location: 'Majuli River Island, Brahmaputra',
    year: '2023',
    question: 'Where did we take the ferry across the mighty Brahmaputra river?',
    answer: 'Majuli Island, visiting the peaceful Satras and pottery makers.',
    category: 'Place',
    subject: 'Majuli Island',
    voiceNote: 'This is Majuli Island, where you took the ferry across the Brahmaputra.',
    photo: null,
    notes: 'Asha loved hearing the devotional Borgeet and seeing traditional masks.',
    themeColor: '#0d9488'
  },
  {
    id: 'mem-4',
    title: 'Grandson Aarav’s School Graduation',
    relationship: 'Grandson',
    location: 'Jorhat, Assam',
    year: '2024',
    question: 'Whose science exhibition did you attend with your red silk chador?',
    answer: 'Aarav, your grandson who won the science trophy.',
    category: 'Person',
    subject: 'Aarav',
    voiceNote: 'This is Aarav, your grandson. He won the science trophy.',
    photo: '/memories/aarav.jpg',
    notes: 'Aarav loves when Dadi tells stories about the Eastern Himalayas.',
    themeColor: '#7c3aed'
  },
  {
    id: 'mem-5',
    title: 'My Home',
    relationship: 'Home',
    location: 'Tezpur, Assam',
    year: 'Present',
    question: 'Is this your home?',
    answer: 'Yes, this is your home in Tezpur where you live.',
    category: 'Place',
    subject: 'My Home',
    voiceNote: 'Yes, this is your home in Tezpur. You are safe here.',
    photo: '/memories/home.jpg',
    isHome: true,
    notes: 'The green gate and the tulsi plant in the courtyard.',
    themeColor: '#0d9488'
  },
  {
    id: 'mem-6',
    title: 'Sunita — Younger Daughter',
    relationship: 'Daughter',
    location: 'Tezpur, Assam',
    year: 'Present',
    question: 'Who is this that looks after you every day?',
    answer: 'Sunita, your younger daughter and primary caregiver.',
    category: 'Person',
    subject: 'Sunita',
    voiceNote: 'This is Sunita, your younger daughter. She looks after you every day.',
    photo: '/memories/sunita.jpg',
    notes: 'Sunita manages the reminders and medicines.',
    themeColor: '#7c3aed'
  }
];

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
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcare_reminders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_REMINDERS;
  });

  const [routine, setRoutine] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcare_routine_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ROUTINE;
  });

  const [breathingSessions, setBreathingSessions] = useState([]);
  const [familyMemories, setFamilyMemories] = useState(INITIAL_MEMORIES);
  const [alerts, setAlerts] = useState([]);
  const [activityPlans, setActivityPlans] = useState([]);

  useEffect(() => {
    try {
      if (reminders && reminders.length > 0) {
        localStorage.setItem('smartcare_reminders_v1', JSON.stringify(reminders));
      }
    } catch (e) {}
  }, [reminders]);

  useEffect(() => {
    try {
      if (routine && routine.length > 0) {
        localStorage.setItem('smartcare_routine_v1', JSON.stringify(routine));
      }
    } catch (e) {}
  }, [routine]);

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
      if (rem && Array.isArray(rem) && rem.length) {
        setReminders(prev => {
          if (!prev || prev.length === 0) return rem;
          const localMap = new Map(prev.map(r => [r.id, r]));
          const merged = rem.map(s => {
            const local = localMap.get(s.id);
            return local ? { ...s, completed: local.completed } : s;
          });
          const serverIds = new Set(rem.map(s => s.id));
          const localOnly = prev.filter(p => !serverIds.has(p.id));
          return [...merged, ...localOnly];
        });
      }
      if (rout && Array.isArray(rout) && rout.length) {
        setRoutine(prev => {
          if (prev && prev.length === rout.length) return prev;
          return rout;
        });
      }
      if (br && Array.isArray(br) && br.length) setBreathingSessions(br);
      if (mem && Array.isArray(mem) && mem.length) setFamilyMemories(mem);
      if (alt && Array.isArray(alt) && alt.length) setAlerts(alt);
      if (plans && Array.isArray(plans) && plans.length) setActivityPlans(plans);
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
  const handleToggleReminder = async (id, forcedStatus) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = typeof forcedStatus === 'boolean' ? forcedStatus : !r.completed;
        return { ...r, completed: nextStatus };
      }
      return r;
    }));
    soundService.playSuccessChime();
    await api.toggleReminder(id, forcedStatus);
  };

  const handleCompleteReminder = async (id) => {
    return handleToggleReminder(id, true);
  };

  const handleAddReminder = async (newRem) => {
    const tempId = newRem.id || `rem-${Date.now()}`;
    const item = {
      id: tempId,
      title: newRem.title || 'New Reminder',
      category: newRem.category || 'Medicine',
      time: newRem.time || '09:00 AM',
      date: newRem.date || 'Today',
      completed: false,
      notes: newRem.notes || ''
    };
    setReminders(prev => [...prev, item]);
    const res = await api.addReminder(item);
    if (res?.reminder?.id && res.reminder.id !== tempId) {
      setReminders(prev => prev.map(r => r.id === tempId ? res.reminder : r));
    }
  };

  const handleDeleteReminder = async (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    soundService.playSoftRetry();
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
        handleCompleteReminder,
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
