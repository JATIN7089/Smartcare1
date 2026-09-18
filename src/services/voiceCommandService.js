/**
 * Voice Command Orchestrator Service
 *
 * Flow:
 *   USER SPEAKS
 *     ↓
 *   Speech Recognition (Web Speech API)
 *     ↓
 *   Advanced NLU  (ai/nluEngine.js)      → intent + entities + confidence
 *     ↓
 *   Dialogue Engine (ai/dialogueEngine.js) → reply + action + follow-up chips
 *     ↓
 *   Action execution (navigate / mark reminder / call / speak)
 *
 * This powers the global microphone available on every screen. It shares the
 * exact same brain as the full Assistant page, so "maine dawai kha li" works
 * from anywhere in the app — not just inside the assistant.
 */

import { voiceService } from './voiceService.js';
import { understand, INTENT } from '../ai/nluEngine.js';
import { respond } from '../ai/dialogueEngine.js';
import { detectLanguage } from '../ai/languageDetector.js';
import { SUPPORTED_LANGUAGES } from '../data/translations.js';

// Kept for backward compatibility with any older imports.
import { detectIntent, INTENTS } from './intentService.js';
import { executeCommand } from './commandRouter.js';

class VoiceCommandService {
  constructor() {
    this.isListening = false;
    // Multi-turn memory for the global mic, so a clarifying question asked in
    // one pop-up can be answered the next time the user taps the microphone.
    this.session = { pendingSlot: null, lastIntent: null };
    // The language the user last spoke in. The microphone follows it, so a
    // Hindi speaker never has to change the UI language to be understood.
    this.lastLanguage = null;
  }

  resetSession() {
    this.session = { pendingSlot: null, lastIntent: null };
  }

  /**
   * Understand an utterance and carry out whatever it asks for.
   *
   * @param {string} text     the spoken or typed utterance
   * @param {object} context  { navigate, user, reminders, routine,
   *                            cognitiveProfile, role, language,
   *                            onCompleteReminder, onComplete }
   */
  processTextCommand(text = '', context = {}) {
    const {
      navigate,
      user = {},
      reminders = [],
      routine = [],
      cognitiveProfile = {},
      role = 'elderly',
      language = 'en',
      onCompleteReminder,
      onComplete
    } = context;

    /* Answer in the language that was SPOKEN, exactly like the Assistant
       page does. Without this the global microphone always replied in the
       UI language, which is why a Hindi question got an English answer. */
    const detected = (text || '').trim() ? detectLanguage(text) : { code: language };
    const replyLanguage = SUPPORTED_LANGUAGES.some(l => l.code === detected.code)
      ? detected.code
      : language;
    this.lastLanguage = replyLanguage;

    const nlu = understand(text, this.session);
    const result = respond(nlu, {
      reminders,
      routine,
      cognitiveProfile,
      user,
      role,
      language: replyLanguage
    });

    // Remember any clarifying question for the next turn.
    this.session = {
      pendingSlot: result.pendingSlot || null,
      lastIntent: nlu.intent
    };

    // Speak the reply in the language it was written in.
    if (result.spoken && voiceService.enabled) {
      voiceService.speak(result.spoken, replyLanguage);
    }

    // Carry out the action.
    const action = result.action;
    let navigated = false;

    if (action) {
      if (action.type === 'COMPLETE_REMINDER' && action.reminderId) {
        if (onCompleteReminder) onCompleteReminder(action.reminderId);
      } else if (action.type === 'STOP_SPEAKING') {
        voiceService.stopSpeaking();
      } else if (action.type === 'NAVIGATE' && action.route && navigate) {
        const delay = typeof action.delay === 'number' ? action.delay : 900;
        navigated = true;
        setTimeout(() => {
          navigate(action.route, {
            state: {
              autostart: action.autostart !== false,
              readAloud: Boolean(action.readAloud),
              intent: nlu.intent,
              voiceTriggered: true
            }
          });
        }, delay);
      }
    }

    const understood = nlu.intent !== INTENT.UNKNOWN;

    const execution = {
      success: understood,
      intent: nlu.intent,
      confidence: nlu.confidence,
      text: result.reply,
      spoken: result.spoken,
      route: action?.route || null,
      navigated,
      detectedLanguage: replyLanguage,
      chips: result.chips || [],
      pendingSlot: result.pendingSlot || null,
      // Keep the pop-up open when the assistant asked a question or simply
      // answered one — closing it would hide the answer.
      keepOpen: Boolean(result.pendingSlot) || (!navigated && understood)
    };

    if (onComplete) onComplete(execution);

    return {
      rawText: text,
      nlu,
      intentResult: result,
      execution
    };
  }

  /**
   * Start microphone listening, recognise speech, understand it, and act.
   */
  listenAndExecute({
    onListeningStart,
    onTranscript,
    onIntentMatched,
    onError,
    onEnd,
    context = {}
  }) {
    if (this.isListening) {
      voiceService.stopListening();
      this.isListening = false;
      if (onEnd) onEnd();
      return false;
    }

    const lang = this.lastLanguage || context.language || 'en';
    const started = voiceService.startListening({
      lang,
      onResult: (transcript) => {
        this.isListening = false;
        if (onTranscript) onTranscript(transcript);

        const result = this.processTextCommand(transcript, context);
        if (onIntentMatched) onIntentMatched(result);
      },
      onError: (err) => {
        this.isListening = false;
        if (onError) onError(err);
      },
      onEnd: () => {
        this.isListening = false;
        if (onEnd) onEnd();
      }
    });

    if (started) {
      this.isListening = true;
      if (onListeningStart) onListeningStart();
    }

    return started;
  }

  stopListening() {
    voiceService.stopListening();
    this.isListening = false;
  }
}

export const voiceCommandService = new VoiceCommandService();
export { INTENT, understand, respond };
export { INTENTS, detectIntent, executeCommand };
