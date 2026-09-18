/**
 * Role-Aware AI Assistant Engine
 * 
 * Supports all 11 North Eastern & National Languages:
 * English, Hindi, Assamese, Bengali, Bodo, Meitei (Manipuri), Khasi, Mizo, Nagamese, Kokborok, Nepali
 * 
 * Integrated with Natural Language Intent Detection (intentService.js)
 * to power voice-controlled navigation and auto-activity actions.
 */

import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations.js';
import { detectIntent, INTENTS } from '../services/intentService.js';
import { understand } from './nluEngine.js';
import { respond } from './dialogueEngine.js';
import { detectLanguage, ttsLocale } from './languageDetector.js';

export const ASSISTANT_LANGUAGES = SUPPORTED_LANGUAGES;
/** Chip label in the given language (falls back to English). */
const chipText = (lang, key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key];


export function processVoiceCommand(input = '', role = 'elderly', contextData = {}) {
  const query = (input || '').toLowerCase().trim();
  const {
    activeUser = { name: 'Asha Sharma' },
    reminders = [],
    routine = [],
    cognitiveProfile = {},
    language = 'en'
  } = contextData;

  /* ------------------------------------------------------------
     Reply in the language that was SPOKEN, not the language the UI
     happens to be set to. Someone asking "kaun si dawai li" in an
     English-configured app still deserves a Hindi answer; switching
     the UI to Hindi and saying "which medicine did I take" still
     deserves English. Detection falls back to the UI language when
     the utterance carries no language signal of its own.
     ------------------------------------------------------------ */
  const detected = query ? detectLanguage(input) : { code: language, script: 'none', confidence: 0 };
  const detectedSupported = SUPPORTED_LANGUAGES.some(l => l.code === detected.code);
  const replyLanguage = detectedSupported ? detected.code : language;

  const userName = activeUser?.name || 'Asha';

  // Localized greetings
  const greetings = {
    en: { elderly: `Hello ${userName}! I am your SmarTCARE companion.`, caregiver: 'Caregiver Assistant online.', healthcare: 'Clinical Portal Assistant ready.' },
    hi: { elderly: `नमस्ते ${userName} जी! मैं आपकी स्मार्टकेयर साथी हूँ।`, caregiver: 'केयरगिवर सहायक ऑनलाइन है।', healthcare: 'स्वास्थ्य पोर्टल सहायक तैयार है।' },
    as: { elderly: `নমস্কাৰ ${userName} বাইদেউ! মই আপোনাৰ স্মাৰ্টকেয়াৰ সংগী।`, caregiver: 'শুশ্ৰূষাকাৰী সহায়ক সাজু।', healthcare: 'স্বাস্থ্যকৰ্মী সহায়ক সক্ৰিয়।' },
    bn: { elderly: `নমস্কার ${userName} দিদি! আমি আপনার স্মার্টকেয়ার সঙ্গী।`, caregiver: 'পরিচর্যাকারী সহকারী অনলাইন।', healthcare: 'স্বাস্থ্যসেবা সহকারী প্রস্তুত।' },
    brx: { elderly: `खुलुमबाय ${userName}! आं नोंथांनि स्मार्टकेयार लोगो।`, caregiver: 'सामलायगिरि हेफाजाबगिरि जाखांखा।', healthcare: 'सास्थ’ हेफाजाबगिरि थियारि।' },
    mni: { elderly: `খুরুমজরি ${userName}! ঐহাক নহাক্কী স্মার্টকেয়ার মরুপনি।`, caregiver: 'য়েংশিনবীবা পাউতাকপীবা শেম-শারে।', healthcare: 'অনাবা য়েংশিনবা মতেংপাংবা সাজু।' },
    kha: { elderly: `Khublei ${userName}! Nga dei ka SmarTCARE jong phi.`, caregiver: 'Nongsumar Assistant la kloi.', healthcare: 'Doctor Assistant la kloi.' },
    lus: { elderly: `Chibai ${userName}! I SmarTCARE thiante ka ni e.`, caregiver: 'Enkawltu Assistant inpeih e.', healthcare: 'Hriselna Assistant inpeih e.' },
    nag: { elderly: `Namaste ${userName}! Ami apuni laga SmarTCARE sathi ase.`, caregiver: 'Dekha-Suna manu assistant online ase.', healthcare: 'Doctor assistant taiyar ase.' },
    trp: { elderly: `Kahamba ${userName}! Ang nini SmarTCARE logi.`, caregiver: 'Nayphirnai assistant online tongha.', healthcare: 'Daktar assistant taiyar tongha.' },
    ne: { elderly: `नमस्ते ${userName} ज्यू! म तपाईंको स्मार्टकेयर साथी हुँ।`, caregiver: 'हेरचाहकर्ता सहायक अनलाइन छ।', healthcare: 'स्वास्थ्य सेवा सहायक तयार छ।' }
  };

  const activeGreeting = greetings[replyLanguage] ? greetings[replyLanguage][role] || greetings.en[role] : greetings.en[role];

  // If query is empty, return an opening greeting.
  // For elderly users we enrich it with a live status line so the very first
  // thing they hear is useful ("2 medicines pending today").
  if (!query) {
    if (role === 'elderly') {
      const pendingMeds = reminders.filter(
        r => !r.completed && (r.category === 'Medicine' || /medicine|tablet|pill|dawa/i.test(r.title || ''))
      );

      const statusLine = pendingMeds.length
        ? (replyLanguage === 'hi'
            ? ` आज ${pendingMeds.length} दवा बाकी है।`
            : ` You have ${pendingMeds.length} medicine${pendingMeds.length === 1 ? '' : 's'} pending today.`)
        : (replyLanguage === 'hi'
            ? ' आज सब कुछ ठीक चल रहा है।'
            : ' Everything is on track today.');

      const askLine = replyLanguage === 'hi'
        ? ' क्या करना चाहेंगी?'
        : ' What would you like to do?';

      const greetingText = activeGreeting + statusLine + askLine;

      return {
        reply: greetingText,
        spoken: greetingText,
        action: null,
        chips: [
              { label: `🎮 ${chipText(replyLanguage, 'chip_play')}`, cmd: 'game khelna hai' },
              { label: `💊 ${chipText(replyLanguage, 'chip_med_taken')}`, cmd: 'which medicine did I take' },
              { label: `⏰ ${chipText(replyLanguage, 'chip_med_next')}`, cmd: 'when is my next medicine' },
              { label: `🫁 ${chipText(replyLanguage, 'chip_breath')}`, cmd: 'start breathing' },
              { label: `🏠 ${chipText(replyLanguage, 'chip_home')}`, cmd: 'mera ghar kaha hai' }
            ],
        pendingSlot: null,
        detectedLanguage: replyLanguage,
        detectedScript: detected.script,
        ttsLocale: ttsLocale(replyLanguage)
      };
    }

    return {
      reply: activeGreeting,
      detectedLanguage: replyLanguage,
      ttsLocale: ttsLocale(replyLanguage),
      action: { type: 'SUGGESTION', items: ['Start memory game', 'Start breathing', 'When is my medicine?'] },
      spoken: activeGreeting
    };
  }

  // 1. ELDERLY ROLE — advanced NLU + dialogue engine
  if (role === 'elderly') {
    const nlu = understand(input, contextData.session || {});
    const result = respond(nlu, {
      reminders,
      routine,
      cognitiveProfile,
      user: activeUser,
      role,
      language: replyLanguage
    });

    return {
      ...result,
      intent: nlu.intent,
      confidence: nlu.confidence,
      concepts: nlu.concepts,
      action: normaliseAction(result.action),
      detectedLanguage: replyLanguage,
      detectedScript: detected.script,
      ttsLocale: ttsLocale(replyLanguage)
    };
  }

  // 2. CAREGIVER ROLE
  if (role === 'caregiver') {
    return {
      reply: `Caregiver Intelligence (${language.toUpperCase()}):\n• Asha's memory accuracy: 84% (Improving trend)\n• Reminders: 4/5 completed today\n• Breathing sessions: 1 session (10 cycles)\n• Current Difficulty: Moderate\nSupportive trend tracking active.`,
      action: { type: 'NAVIGATE', route: '/caregiver/reports', label: 'View Reports' },
      spoken: `Asha has completed 4 of 5 reminders and maintains an 84 percent accuracy trend.`
    };
  }

  // 3. HEALTHCARE WORKER ROLE
  return {
    reply: `Clinical Healthcare Portal (${language.toUpperCase()}):\n• Patient: Asha Sharma (68, Tezpur, Assam)\n• Adherence: 88.4% weekly compliance\n• Moderate challenge tier maintained\n• Realtime sync ready.`,
    action: { type: 'NAVIGATE', route: '/healthcare', label: 'Clinical Portal' },
    spoken: `Patient Asha Sharma maintains an 88 percent weekly adherence.`
  };
}

/**
 * Bridges the dialogue engine's action vocabulary to the shape the UI layer
 * already understands, so existing NAVIGATE / CALL_SIMULATION handling keeps
 * working while new action types (COMPLETE_REMINDER, STOP_SPEAKING) pass through.
 */
function normaliseAction(action) {
  if (!action) return null;

  if (action.type === 'CALL') {
    return {
      type: 'CALL_SIMULATION',
      contact: action.contact,
      phone: action.phone,
      label: action.label
    };
  }

  return action;
}
