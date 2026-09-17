/**
 * Command Router Engine
 * 
 * Takes detected intents from IntentService and executes:
 * 1. Warm, elderly-friendly short spoken voice feedback.
 * 2. Automated navigation to target route with state (e.g. autostart: true).
 * 3. Role/permission enforcement.
 * 4. Contextual actions like reading reminders aloud.
 */

import { INTENTS } from './intentService.js';
import { voiceService } from './voiceService.js';

export function executeCommand(intentResult, { navigate, user, reminders = [], role = 'elderly', language = 'en', onComplete } = {}) {
  if (!intentResult) return { success: false, error: 'No intent provided' };

  const { intent, route, autostart, spoken, text, readAloud } = intentResult;

  // 1. Unknown intent
  if (intent === INTENTS.UNKNOWN || !route) {
    if (spoken && voiceService.enabled) {
      voiceService.speak(spoken, language);
    }
    if (onComplete) onComplete({ success: false, intent, text });
    return { success: false, intent, text };
  }

  // 2. Role permission check for caregiver/healthcare
  if (intent === INTENTS.OPEN_CAREGIVER && role === 'elderly') {
    // Friendly notice or switch to caregiver view
    const msg = "Opening Caregiver Portal.";
    if (voiceService.enabled) voiceService.speak(msg, language);
    if (navigate) {
      navigate('/caregiver');
    }
    if (onComplete) onComplete({ success: true, intent, route: '/caregiver' });
    return { success: true, intent, route: '/caregiver' };
  }

  // 3. Short Spoken Voice Confirmation (Elderly friendly & calm)
  if (spoken && voiceService.enabled) {
    voiceService.speak(spoken, language);
  }

  // 4. Special intent: Read Reminders Aloud
  let reminderSummary = '';
  if (readAloud && reminders.length > 0) {
    const uncompleted = reminders.filter(r => !r.completed);
    if (uncompleted.length > 0) {
      reminderSummary = `You have ${uncompleted.length} pending items today. Next is ${uncompleted[0].title} at ${uncompleted[0].time}.`;
      // Delay slightly so primary confirmation finishes
      setTimeout(() => {
        if (voiceService.enabled) {
          voiceService.speak(reminderSummary, language);
        }
      }, 1400);
    }
  }

  // 5. Automatic Navigation with autostart state
  if (navigate && route) {
    navigate(route, {
      state: {
        autostart: Boolean(autostart),
        intent,
        voiceTriggered: true,
        readAloud: Boolean(readAloud)
      }
    });
  }

  if (onComplete) {
    onComplete({
      success: true,
      intent,
      route,
      autostart,
      text,
      spoken,
      reminderSummary
    });
  }

  return {
    success: true,
    intent,
    route,
    autostart,
    text,
    spoken
  };
}
