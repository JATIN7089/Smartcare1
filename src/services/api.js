/**
 * API Client Layer
 * Coordinates between Express Backend, Offline Sync Engine, and Local Mock Fallback.
 */

import { syncEngine } from './syncEngine.js';
import { authService } from './authService.js';


/* ------------------------------------------------------------
   Live activity stream.
   One shared EventSource feeds every subscriber, so the caregiver
   dashboard, the patient detail page and the clinical portal all
   refresh the instant the senior does something. Fails silently
   when offline — the sync engine already covers that case.
   ------------------------------------------------------------ */
const liveListeners = new Set();
let liveSource = null;

function ensureLiveSource() {
  if (liveSource || typeof EventSource === 'undefined') return liveSource;
  try {
    liveSource = new EventSource('/api/events');
    liveSource.onmessage = (e) => {
      let data = null;
      try { data = JSON.parse(e.data); } catch (err) { return; }
      for (const cb of [...liveListeners]) {
        try { cb(data); } catch (err) { /* one bad listener must not break others */ }
      }
    };
    liveSource.onerror = () => { /* offline or server restarting: stay quiet */ };
  } catch (e) {
    liveSource = null;
  }
  return liveSource;
}

export const api = {
  /** Subscribe to live senior-activity events. Returns an unsubscribe fn. */
  subscribeLive(cb) {
    ensureLiveSource();
    liveListeners.add(cb);
    return () => liveListeners.delete(cb);
  },

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
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
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

  async toggleReminder(id) {
    if (!syncEngine.effectiveOnline()) {
      syncEngine.enqueue({ type: 'reminder_toggle', data: { id, completed: true } });
      return { success: true, queued: true };
    }
    try {
      const res = await fetch(`/api/reminders/${id}/toggle`, { method: 'PUT' });
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
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
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
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
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
