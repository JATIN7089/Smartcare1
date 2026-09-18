import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));


/* ============================================================
   DEMO ACCOUNTS
   ------------------------------------------------------------
   A deliberately simple credential store for the SIH demo. Passwords are
   kept in plain text here ONLY because this is an offline demo with fixed
   judge-facing logins; a production deployment would hash them and back
   this with the real user database.

   The important part for the product is the ROLE each account carries:
   a senior can never open the caregiver or clinical portals, because the
   role is decided by the credentials, not by a UI toggle.
   ============================================================ */
const ACCOUNTS = [
  {
    id: 'user-asha-68',
    username: 'asha',
    password: 'asha123',
    pin: '1234',
    role: 'elderly',
    name: 'Asha Sharma',
    detail: 'Tezpur, Assam • 68 yrs',
    avatar: 'A'
  },
  {
    id: 'care-sunita',
    username: 'sunita',
    password: 'care123',
    pin: '2345',
    role: 'caregiver',
    name: 'Sunita Sharma',
    detail: 'Daughter • Primary Caregiver',
    avatar: 'S',
    linkedPatients: ['user-asha-68']
  },
  {
    id: 'cho-barua',
    username: 'barua',
    password: 'doctor123',
    pin: '3456',
    role: 'healthcare',
    name: 'Dr. B. K. Barua',
    detail: 'Community Health Officer • Sonitpur SDH',
    avatar: 'B',
    linkedPatients: ['user-asha-68', 'user-biren-74', 'user-mary-71']
  }
];

/** Active sessions: token -> account id. In-memory for the demo. */
const SESSIONS = new Map();

function publicAccount(acc) {
  if (!acc) return null;
  const { password, pin, ...safe } = acc;
  return safe;
}

function newToken() {
  return 'tok-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Resolves the account behind an Authorization: Bearer <token> header. */
function accountFromRequest(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const accountId = SESSIONS.get(token);
  if (!accountId) return null;
  return ACCOUNTS.find(a => a.id === accountId) || null;
}

/** Express guard: rejects anyone whose role is not in `allowed`. */
function requireRole(...allowed) {
  return (req, res, next) => {
    const acc = accountFromRequest(req);
    if (!acc) {
      return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
    }
    if (!allowed.includes(acc.role)) {
      return res.status(403).json({
        success: false,
        message: 'Your account does not have access to this area.'
      });
    }
    req.account = acc;
    next();
  };
}

// In-Memory Database store with rich initial data
let state = {
  activeUser: {
    id: 'user-asha-68',
    name: 'Asha Sharma',
    age: 68,
    location: 'Tezpur, Assam (NER)',
    role: 'elderly',
    preferredLanguage: 'en',
    culturalRegion: 'Assam',
    joinCode: 'SMT-4821',
    caregiver: {
      name: 'Sunita Sharma (Daughter)',
      phone: '+91 98640 12345',
      connectedSince: 'Jan 2026'
    },
    healthcareWorker: {
      name: 'Dr. B. K. Barua (Community Health Officer)',
      center: 'Sonitpur Sub-District Hospital, Assam',
      contact: '+91 94350 56789'
    }
  },

  cognitiveProfile: {
    userId: 'user-asha-68',
    lastUpdated: new Date().toISOString(),
    overallScore: 81,
    metrics: {
      memory: 82,
      attention: 74,
      pattern: 91,
      dailyRecall: 79,
      reactionTimeScore: 78,
      consistency: 85
    },
    difficultyLevel: 'Moderate',
    recentTrend: 'Stable activity',
    explanation: 'Based on your recent memory-game accuracy (84%) and consistent response time, SmarTCARE selected a moderate challenge level to maintain comfortable cognitive engagement without causing fatigue.',
    sessionHistory: [
      { date: '2026-09-10', memory: 78, attention: 70, pattern: 88, recall: 75, avgResponseTime: 3.4 },
      { date: '2026-09-11', memory: 80, attention: 72, pattern: 89, recall: 76, avgResponseTime: 3.2 },
      { date: '2026-09-12', memory: 79, attention: 73, pattern: 90, recall: 78, avgResponseTime: 3.1 },
      { date: '2026-09-13', memory: 81, attention: 71, pattern: 92, recall: 79, avgResponseTime: 3.0 },
      { date: '2026-09-14', memory: 83, attention: 75, pattern: 90, recall: 80, avgResponseTime: 2.9 },
      { date: '2026-09-15', memory: 82, attention: 74, pattern: 91, recall: 79, avgResponseTime: 2.8 },
      { date: '2026-09-16', memory: 84, attention: 76, pattern: 93, recall: 81, avgResponseTime: 2.7 }
    ]
  },

  gameResults: [
    {
      id: 'g-001',
      gameType: 'memory-match',
      category: 'Memory',
      difficulty: 'Moderate',
      accuracy: 85,
      attempts: 8,
      pairsFound: 6,
      mistakes: 2,
      hintsUsed: 1,
      completionTime: 48,
      completed: true,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'g-002',
      gameType: 'ner-cultural',
      category: 'Cultural Memory',
      difficulty: 'Easy',
      accuracy: 90,
      attempts: 7,
      pairsFound: 6,
      mistakes: 1,
      hintsUsed: 0,
      completionTime: 42,
      completed: true,
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ],

  reminders: [
    {
      id: 'rem-1',
      title: 'Blood Pressure & Heart Medicine',
      category: 'Medicine',
      time: '08:00 AM',
      date: 'Daily',
      completed: true,
      notes: 'Take with warm water after morning tea & breakfast'
    },
    {
      id: 'rem-2',
      title: 'Hydration Break (Fresh Water / Chamomile)',
      category: 'Hydration',
      time: '10:00 AM',
      date: 'Daily',
      completed: true,
      notes: 'Drink a full glass of lukewarm water'
    },
    {
      id: 'rem-3',
      title: 'Afternoon Memory Exercise',
      category: 'Cognitive Activity',
      time: '02:30 PM',
      date: 'Daily',
      completed: false,
      notes: 'Play 1 session of NER Cultural Match'
    },
    {
      id: 'rem-4',
      title: 'Doctor Follow-Up Consultation',
      category: 'Appointments',
      time: '04:00 PM',
      date: 'Today',
      completed: false,
      notes: 'Dr. Barua tele-checkin or Sonitpur clinic'
    },
    {
      id: 'rem-5',
      title: 'Evening Walk in Courtyard',
      category: 'Exercise',
      time: '05:30 PM',
      date: 'Daily',
      completed: false,
      notes: '15-minute gentle walk around tea garden garden'
    },
    {
      id: 'rem-6',
      title: 'Evening Calming Breathing Session',
      category: 'Well-being',
      time: '08:30 PM',
      date: 'Daily',
      completed: false,
      notes: '5 minutes of paced breathing before sleep'
    }
  ],

  routine: [
    { time: '07:00 AM', label: 'Wake up & gentle stretch', done: true, icon: 'Sun' },
    { time: '08:00 AM', label: 'Morning Tea, Breakfast + Medication', done: true, icon: 'Coffee' },
    { time: '10:00 AM', label: 'Morning Hydration & Garden walk', done: true, icon: 'Droplets' },
    { time: '11:00 AM', label: 'SmarTCARE Cognitive Game Session', done: false, icon: 'Brain' },
    { time: '01:00 PM', label: 'Nutritious lunch with family', done: false, icon: 'Utensils' },
    { time: '02:30 PM', label: 'Rest & Memory Lane reminiscence', done: false, icon: 'BookOpen' },
    { time: '04:00 PM', label: 'Doctor Tele-Consultation / Routine check', done: false, icon: 'Stethoscope' },
    { time: '06:00 PM', label: 'Tea & Family conversation with Rita', done: false, icon: 'Users' },
    { time: '08:30 PM', label: 'Breathing Pacer (5 mins) & Light Dinner', done: false, icon: 'Moon' },
    { time: '09:30 PM', label: 'Wind down & sleep preparation', done: false, icon: 'Bed' }
  ],

  breathingSessions: [
    {
      id: 'br-1',
      date: '2026-09-15',
      durationSeconds: 300,
      cyclesCompleted: 25,
      preset: '5 min',
      pace: '4-2-6',
      completed: true
    },
    {
      id: 'br-2',
      date: '2026-09-16',
      durationSeconds: 120,
      cyclesCompleted: 10,
      preset: '2 min',
      pace: '4-2-6',
      completed: true
    }
  ],

  familyMemories: [
    {
      id: 'mem-1',
      title: 'Rita — Elder Daughter',
      relationship: 'Daughter',
      location: 'Guwahati, Assam',
      year: '2025',
      question: 'Who is this visiting you during Rongali Bihu?',
      answer: 'Rita, your elder daughter who lives in Guwahati.',
      category: 'Family',
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
      category: 'Family',
      notes: 'Aarav loves when Dadi tells stories about the Eastern Himalayas.',
      themeColor: '#7c3aed'
    }
  ],

  alerts: [
    {
      id: 'alt-1',
      type: 'activity_change',
      severity: 'moderate',
      title: 'Activity Trend Changed',
      reason: 'Memory-game accuracy slightly decreased across 2 afternoon sessions (from 86% to 78%). Difficulty adapted automatically to provide supportive engagement.',
      status: 'active',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      recommendation: 'Encourage gentle play earlier in the day when mental freshness is highest, or try a 5-minute breathing session.'
    },
    {
      id: 'alt-2',
      type: 'reminder_adherence',
      severity: 'low',
      title: 'Reminder Adherence Noted',
      reason: 'Afternoon hydration reminder was delayed by 45 minutes yesterday. Overall weekly adherence remains strong at 88%.',
      status: 'active',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      recommendation: 'Check if afternoon routine timing needs adjustment.'
    }
  ],

  activityPlans: [
    {
      id: 'plan-1',
      title: 'Morning Cognitive Engagement & Wellness',
      createdBy: 'Dr. B. K. Barua (Healthcare Worker)',
      assignedDate: '2026-09-14',
      priority: 'High',
      status: 'In Progress',
      tasks: [
        { id: 't-1', text: 'Complete 1 round of NER Cultural Memory Match', done: true },
        { id: 't-2', text: 'Perform 5-minute Breathing Pacer exercise', done: true },
        { id: 't-3', text: 'Hydration & verify morning medication', done: true },
        { id: 't-4', text: 'Review 2 Family Memory Lane cards with caregiver', done: false }
      ]
    },
    {
      id: 'plan-2',
      title: 'Gentle Afternoon Recall & Calming Pacer',
      createdBy: 'Sunita Sharma (Caregiver)',
      assignedDate: '2026-09-15',
      priority: 'Normal',
      status: 'Pending',
      tasks: [
        { id: 't-5', text: 'Daily Routine Recall puzzle', done: false },
        { id: 't-6', text: 'Sound Memory recognition activity', done: false },
        { id: 't-7', text: '10-minute courtyard walking and relaxation', done: false }
      ]
    }
  ],

  caregiverNotes: [
    {
      id: 'note-1',
      author: 'Sunita Sharma (Daughter)',
      date: '2026-09-15 19:30',
      text: 'Mother was very joyful playing the Majuli Island memory card today. She remembered the ferry ride vividly. She slept soundly after the 5-minute breathing pacer.'
    },
    {
      id: 'note-2',
      author: 'Dr. B. K. Barua (CHO)',
      date: '2026-09-14 11:15',
      text: 'Routine activity adherence is very positive. Continue with moderate difficulty cognitive games. Emphasized to family that SmarTCARE is supportive engagement, not a medical diagnostic.'
    }
  ],

  connectedPatients: [
    {
      id: 'user-asha-68',
      name: 'Asha Sharma',
      age: 68,
      location: 'Tezpur, Assam',
      lastActive: '12 minutes ago',
      streakDays: 9,
      status: 'Stable activity',
      memoryTrend: 'Improving activity trend (+4% this week)',
      attentionTrend: 'Stable (74%)',
      remindersAdherence: '4/6 completed today (88% weekly)',
      gamesCompletedToday: 2,
      difficulty: 'Moderate',
      flagAlert: false
    },
    {
      id: 'user-biren-74',
      name: 'Biren Gogoi',
      age: 74,
      location: 'Jorhat, Assam',
      lastActive: '2 hours ago',
      streakDays: 14,
      status: 'Activity changed',
      memoryTrend: 'Activity trend changed (-6% across 3 sessions)',
      attentionTrend: 'Slightly reduced response speed',
      remindersAdherence: '3/5 completed today (75% weekly)',
      gamesCompletedToday: 1,
      difficulty: 'Easy (AI adapted)',
      flagAlert: true
    },
    {
      id: 'user-mary-71',
      name: 'Mary Lalrinmawii',
      age: 71,
      location: 'Aizawl, Mizoram',
      lastActive: 'Yesterday',
      streakDays: 5,
      status: 'Needs attention',
      memoryTrend: 'Stable (80%)',
      attentionTrend: 'Stable (77%)',
      remindersAdherence: 'Missed evening hydration yesterday',
      gamesCompletedToday: 0,
      difficulty: 'Moderate',
      flagAlert: true
    }
  ],

  adminMetrics: {
    totalRegisteredUsers: 1420,
    activeElderlyUsersNER: 894,
    gamesCompletedTotal: 18450,
    offlineSessionsSynced: 3420,
    syncSuccessRate: '99.4%',
    reminderAdherenceRate: '86.2%',
    activeCaregivers: 920,
    healthcareWorkersConnected: 114,
    nerStateDistribution: {
      Assam: 480,
      Meghalaya: 145,
      ArunachalPradesh: 110,
      Manipur: 130,
      Nagaland: 125,
      Mizoram: 160,
      Tripura: 140,
      Sikkim: 130
    },
    systemStatus: 'Operational - Low Bandwidth Optimized'
  }
};

// API ROUTES

// Root & Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SmarTCARE API',
    team: 'Phantom techie',
    sihYear: 2026,
    problemStatement: '26003',
    timestamp: new Date().toISOString()
  });
});

/* ============================================================
   AUTHENTICATION
   ============================================================ */

/** The three demo identities, shown on the sign-in screen. */
app.get('/api/auth/accounts', (req, res) => {
  res.json(ACCOUNTS.map(a => ({
    username: a.username,
    role: a.role,
    name: a.name,
    detail: a.detail,
    avatar: a.avatar
  })));
});

/** Sign in with username + password, or username + 4-digit PIN. */
app.post('/api/auth/login', (req, res) => {
  const { username, password, pin } = req.body || {};
  const id = String(username || '').trim().toLowerCase();

  const acc = ACCOUNTS.find(a => a.username === id);
  if (!acc) {
    return res.status(401).json({ success: false, message: 'We could not find that account.' });
  }

  const passwordOk = password && password === acc.password;
  const pinOk = pin && String(pin) === acc.pin;
  if (!passwordOk && !pinOk) {
    return res.status(401).json({ success: false, message: 'Incorrect password or PIN. Please try again.' });
  }

  const token = newToken();
  SESSIONS.set(token, acc.id);

  // The elderly profile is the data subject the whole app revolves around.
  if (acc.role === 'elderly') state.activeUser.role = 'elderly';

  res.json({ success: true, token, account: publicAccount(acc) });
});

app.post('/api/auth/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) SESSIONS.delete(token);
  res.json({ success: true });
});

/** Restores a session on page reload. */
app.get('/api/auth/me', (req, res) => {
  const acc = accountFromRequest(req);
  if (!acc) return res.status(401).json({ success: false, message: 'Not signed in.' });
  res.json({ success: true, account: publicAccount(acc) });
});

app.get('/api/auth/current-user', (req, res) => {
  res.json(state.activeUser);
});

// Join code linking
app.post('/api/caregiver/link', (req, res) => {
  const { code, caregiverName } = req.body;
  if (code === 'SMT-4821' || code === state.activeUser.joinCode) {
    res.json({
      success: true,
      message: 'Caregiver linked successfully to Asha Sharma (Age 68)',
      patient: state.activeUser
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid join code. Try demo code: SMT-4821'
    });
  }
});

// Cognitive Profile
app.get('/api/cognitive-profile', (req, res) => {
  res.json(state.cognitiveProfile);
});

// Game Results & Adaptive Scoring
app.get('/api/games/history', (req, res) => {
  res.json(state.gameResults);
});

app.post('/api/games/submit', (req, res) => {
  const {
    gameType,
    category,
    accuracy,
    attempts,
    mistakes,
    hintsUsed,
    completionTime,
    difficulty
  } = req.body;

  const newGame = {
    id: `g-${Date.now()}`,
    gameType: gameType || 'memory-match',
    category: category || 'Memory',
    difficulty: difficulty || state.cognitiveProfile.difficultyLevel,
    accuracy: Number(accuracy) || 80,
    attempts: Number(attempts) || 6,
    mistakes: Number(mistakes) || 0,
    hintsUsed: Number(hintsUsed) || 0,
    completionTime: Number(completionTime) || 45,
    completed: true,
    timestamp: new Date().toISOString()
  };

  state.gameResults.unshift(newGame);

  // Adaptive AI formula as prescribed:
  // performanceScore = accuracy * 0.45 + speedScore * 0.20 + consistencyScore * 0.20 + completionScore * 0.15
  const speedScore = Math.max(20, Math.min(100, Math.round(100 - (newGame.completionTime / 60) * 30)));
  const consistencyScore = 85;
  const completionScore = 100;
  const computedScore = Math.round(
    newGame.accuracy * 0.45 +
    speedScore * 0.20 +
    consistencyScore * 0.20 +
    completionScore * 0.15
  );

  let newDifficulty = state.cognitiveProfile.difficultyLevel;
  let explanation = '';

  if (newGame.accuracy > 85 && speedScore > 75) {
    newDifficulty = newDifficulty === 'Beginner' ? 'Easy' : newDifficulty === 'Easy' ? 'Moderate' : 'Advanced';
    explanation = `Outstanding performance! With ${newGame.accuracy}% accuracy and steady speed, SmarTCARE smoothly elevated the challenge to ${newDifficulty} to foster ongoing neuroplastic engagement.`;
  } else if (newGame.accuracy < 55 || newGame.mistakes >= 4) {
    newDifficulty = newDifficulty === 'Advanced' ? 'Moderate' : newDifficulty === 'Moderate' ? 'Easy' : 'Beginner';
    explanation = `SmarTCARE gently adapted the next activity to ${newDifficulty} to reduce fatigue, ensuring a relaxed, enjoyable, and supportive experience.`;
  } else {
    explanation = `Activity performance is steady and balanced. Difficulty remains maintained at ${newDifficulty} for optimal comfort.`;
  }

  state.cognitiveProfile.difficultyLevel = newDifficulty;
  state.cognitiveProfile.explanation = explanation;
  state.cognitiveProfile.metrics.memory = Math.round((state.cognitiveProfile.metrics.memory * 0.7) + (newGame.accuracy * 0.3));

  res.json({
    success: true,
    result: newGame,
    computedScore,
    adaptedDifficulty: newDifficulty,
    explanation,
    updatedProfile: state.cognitiveProfile
  });
});

// Reminders API
app.get('/api/reminders', (req, res) => {
  res.json(state.reminders);
});

app.post('/api/reminders', (req, res) => {
  const { title, category, time, date, notes } = req.body;
  const newReminder = {
    id: `rem-${Date.now()}`,
    title: title || 'New Reminder',
    category: category || 'Daily',
    time: time || '12:00 PM',
    date: date || 'Today',
    completed: false,
    notes: notes || ''
  };
  state.reminders.push(newReminder);
  res.json({ success: true, reminder: newReminder });
});

app.put('/api/reminders/:id/toggle', (req, res) => {
  const { id } = req.params;
  const item = state.reminders.find(r => r.id === id);
  if (item) {
    item.completed = !item.completed;
    res.json({ success: true, reminder: item });
  } else {
    res.status(404).json({ error: 'Reminder not found' });
  }
});

app.delete('/api/reminders/:id', (req, res) => {
  const { id } = req.params;
  state.reminders = state.reminders.filter(r => r.id !== id);
  res.json({ success: true });
});

// Daily Routine
app.get('/api/routines', (req, res) => {
  res.json(state.routine);
});

app.put('/api/routines/toggle', (req, res) => {
  const { index } = req.body;
  if (index !== undefined && state.routine[index]) {
    state.routine[index].done = !state.routine[index].done;
    res.json({ success: true, routine: state.routine });
  } else {
    res.status(400).json({ error: 'Invalid routine index' });
  }
});

// Breathing & Well-being
app.get('/api/breathing', (req, res) => {
  res.json(state.breathingSessions);
});

app.post('/api/breathing', (req, res) => {
  const { durationSeconds, cyclesCompleted, preset, pace } = req.body;
  const session = {
    id: `br-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    durationSeconds: Number(durationSeconds) || 120,
    cyclesCompleted: Number(cyclesCompleted) || 10,
    preset: preset || '2 min',
    pace: pace || '4-2-6',
    completed: true,
    timestamp: new Date().toISOString()
  };
  state.breathingSessions.push(session);
  res.json({ success: true, session });
});

// Family Memory Lane
app.get('/api/memories', (req, res) => {
  res.json(state.familyMemories);
});

app.post('/api/memories', (req, res) => {
  const { title, relationship, location, year, question, answer, category, notes, themeColor } = req.body;
  const newMemory = {
    id: `mem-${Date.now()}`,
    title: title || 'Cherished Memory',
    relationship: relationship || 'Family',
    location: location || 'North East India',
    year: year || '2025',
    question: question || 'Do you remember this special day?',
    answer: answer || 'A joyful family celebration.',
    category: category || 'Family',
    notes: notes || '',
    themeColor: themeColor || '#3b82f6'
  };
  state.familyMemories.push(newMemory);
  res.json({ success: true, memory: newMemory });
});

// Caregiver & Healthcare Portals
app.get('/api/caregiver/patients', requireRole('caregiver', 'healthcare'), (req, res) => {
  res.json(state.connectedPatients);
});

app.get('/api/caregiver/patients/:id', requireRole('caregiver', 'healthcare'), (req, res) => {
  const patient = state.connectedPatients.find(p => p.id === req.params.id) || state.connectedPatients[0];
  res.json({
    patient,
    cognitiveProfile: state.cognitiveProfile,
    gameResults: state.gameResults,
    reminders: state.reminders,
    routine: state.routine,
    breathingSessions: state.breathingSessions,
    familyMemories: state.familyMemories,
    caregiverNotes: state.caregiverNotes,
    activityPlans: state.activityPlans,
    alerts: state.alerts
  });
});

app.post('/api/caregiver/notes', requireRole('caregiver', 'healthcare'), (req, res) => {
  const { author, text } = req.body;
  const note = {
    id: `note-${Date.now()}`,
    author: author || 'Caregiver',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    text: text || ''
  };
  state.caregiverNotes.unshift(note);
  res.json({ success: true, note });
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(state.alerts);
});

app.put('/api/alerts/:id/dismiss', (req, res) => {
  const { id } = req.params;
  state.alerts = state.alerts.filter(a => a.id !== id);
  res.json({ success: true });
});

// Activity Plans (ACE-inspired workflow)
app.get('/api/activity-plans', (req, res) => {
  res.json(state.activityPlans);
});

app.post('/api/activity-plans', requireRole('healthcare'), (req, res) => {
  const { title, createdBy, priority, tasks } = req.body;
  const plan = {
    id: `plan-${Date.now()}`,
    title: title || 'New Activity Routine',
    createdBy: createdBy || 'Caregiver',
    assignedDate: new Date().toISOString().split('T')[0],
    priority: priority || 'Normal',
    status: 'In Progress',
    tasks: tasks || []
  };
  state.activityPlans.unshift(plan);
  res.json({ success: true, plan });
});

app.put('/api/activity-plans/:planId/tasks/:taskId/toggle', (req, res) => {
  const { planId, taskId } = req.params;
  const plan = state.activityPlans.find(p => p.id === planId);
  if (plan) {
    const task = plan.tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      return res.json({ success: true, plan });
    }
  }
  res.status(404).json({ error: 'Plan or task not found' });
});

// Admin Metrics
app.get('/api/admin/metrics', requireRole('healthcare'), (req, res) => {
  res.json(state.adminMetrics);
});

// Batch Offline Sync
app.post('/api/sync', (req, res) => {
  const { queue = [] } = req.body;
  const syncedCount = queue.length;

  queue.forEach(item => {
    if (item.type === 'game') {
      state.gameResults.unshift({
        ...item.data,
        id: `synced-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      });
    } else if (item.type === 'breathing') {
      state.breathingSessions.push({
        ...item.data,
        id: `synced-br-${Date.now()}`
      });
    } else if (item.type === 'reminder_toggle') {
      const rem = state.reminders.find(r => r.id === item.data.id);
      if (rem) rem.completed = item.data.completed;
    }
  });

  res.json({
    success: true,
    syncedItems: syncedCount,
    message: `Successfully synchronized ${syncedCount} queued records from offline storage.`,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[API Server] SmarTCARE Express API listening on http://localhost:${PORT}`);
});
