/**
 * API Client Layer
 * Coordinates between Express Backend, Offline Sync Engine, and Local Mock Fallback.
 */

import { syncEngine } from './syncEngine.js';
import { authService } from './authService.js';

export const api = {
  // Current user
  async getCurrentUser() {
    try {
      const res = await fetch('/api/auth/current-user');
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
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
    };
  },

  // Switch role
  async switchRole(role) {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, user: { role } };
  },

  // Link caregiver with join code SMT-4821
  async linkCaregiver(code) {
    try {
      const res = await fetch('/api/caregiver/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      return await res.json();
    } catch (e) {
      if (code === 'SMT-4821') {
        return { success: true, message: 'Caregiver linked successfully to Asha Sharma (Age 68)' };
      }
      return { success: false, message: 'Invalid code. Use demo code SMT-4821' };
    }
  },

  // Cognitive profile
  async getCognitiveProfile() {
    try {
      const res = await fetch('/api/cognitive-profile');
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
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
    };
  },

  // Submit Game Result
  async submitGameResult(gameData) {
    if (!syncEngine.effectiveOnline()) {
      syncEngine.enqueue({ type: 'game', data: gameData });
      return {
        success: true,
        queued: true,
        message: 'Saved to offline sync queue. Will sync automatically when connectivity returns.',
        result: gameData
      };
    }

    try {
      const res = await fetch('/api/games/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback queue
    syncEngine.enqueue({ type: 'game', data: gameData });
    return { success: true, queued: true, result: gameData };
  },

  // Reminders
  async getReminders() {
    try {
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (e) {}
    return [
      { id: 'rem-1', title: 'Blood Pressure & Heart Medicine', category: 'Medicine', time: '08:00 AM', date: 'Daily', completed: true, notes: 'Take with warm water after morning tea & breakfast' },
      { id: 'rem-2', title: 'Hydration Break (Fresh Water / Chamomile)', category: 'Hydration', time: '10:00 AM', date: 'Daily', completed: true, notes: 'Drink a full glass of lukewarm water' },
      { id: 'rem-3', title: 'Afternoon Memory Exercise', category: 'Cognitive Activity', time: '02:30 PM', date: 'Daily', completed: false, notes: 'Play 1 session of NER Cultural Match' },
      { id: 'rem-4', title: 'Doctor Follow-Up Consultation', category: 'Appointments', time: '04:00 PM', date: 'Today', completed: false, notes: 'Dr. Barua tele-checkin or Sonitpur clinic' },
      { id: 'rem-5', title: 'Evening Walk in Courtyard', category: 'Exercise', time: '05:30 PM', date: 'Daily', completed: false, notes: '15-minute gentle walk around tea garden garden' },
      { id: 'rem-6', title: 'Evening Calming Breathing Session', category: 'Well-being', time: '08:30 PM', date: 'Daily', completed: false, notes: '5 minutes of paced breathing before sleep' }
    ];
  },

  async addReminder(reminder) {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, reminder: { ...reminder, id: `rem-${Date.now()}` } };
  },

  async toggleReminder(id, targetState) {
    if (!syncEngine.effectiveOnline()) {
      syncEngine.enqueue({ type: 'reminder_toggle', data: { id, completed: targetState !== undefined ? targetState : true } });
      return { success: true, queued: true };
    }
    try {
      const res = await fetch(`/api/reminders/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: targetState })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  async deleteReminder(id) {
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Routines
  async getRoutines() {
    try {
      const res = await fetch('/api/routines');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (e) {}
    return [
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
  },

  async toggleRoutine(index) {
    try {
      const res = await fetch('/api/routines/toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Breathing
  async recordBreathingSession(sessionData) {
    if (!syncEngine.effectiveOnline()) {
      syncEngine.enqueue({ type: 'breathing', data: sessionData });
      return { success: true, queued: true };
    }
    try {
      const res = await fetch('/api/breathing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    syncEngine.enqueue({ type: 'breathing', data: sessionData });
    return { success: true, queued: true };
  },

  // Family Memories
  async getMemories() {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (e) {}
    return [
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
  },

  async addMemory(memory) {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, memory: { ...memory, id: `mem-${Date.now()}` } };
  },

  // Caregiver patient detail
  async getCaregiverPatient(id = 'user-asha-68') {
    try {
      const res = await fetch(`/api/caregiver/patients/${id}`, { headers: authService.authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async getConnectedPatients() {
    try {
      const res = await fetch('/api/caregiver/patients', { headers: authService.authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addCaregiverNote(note) {
    try {
      const res = await fetch('/api/caregiver/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, note };
  },

  // Alerts
  async getAlerts() {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async dismissAlert(id) {
    try {
      const res = await fetch(`/api/alerts/${id}/dismiss`, { method: 'PUT' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Activity Plans
  async getActivityPlans() {
    try {
      const res = await fetch('/api/activity-plans');
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addActivityPlan(plan) {
    try {
      const res = await fetch('/api/activity-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, plan };
  },

  async togglePlanTask(planId, taskId) {
    try {
      const res = await fetch(`/api/activity-plans/${planId}/tasks/${taskId}/toggle`, { method: 'PUT' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Admin
  async getAdminMetrics() {
    try {
      const res = await fetch('/api/admin/metrics', { headers: authService.authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {};
  }
};
