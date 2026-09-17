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

export const ASSISTANT_LANGUAGES = SUPPORTED_LANGUAGES;

export function processVoiceCommand(input = '', role = 'elderly', contextData = {}) {
  const query = (input || '').toLowerCase().trim();
  const {
    activeUser = { name: 'Asha Sharma' },
    reminders = [],
    routine = [],
    cognitiveProfile = {},
    language = 'en'
  } = contextData;

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

  const activeGreeting = greetings[language] ? greetings[language][role] || greetings.en[role] : greetings.en[role];

  // If query is empty, return initial greeting
  if (!query) {
    return {
      reply: activeGreeting,
      action: { type: 'SUGGESTION', items: ['Start memory game', 'Start breathing', 'When is my medicine?'] },
      spoken: activeGreeting
    };
  }

  // 1. ELDERLY ROLE RESPONSES & ACTIONS
  if (role === 'elderly') {
    // Caregiver call intent
    if (query.includes('caregiver') && (query.includes('call') || query.includes('phone') || query.includes('talk') || query.includes('sunita'))) {
      const callReplies = {
        en: `Connecting you with Sunita Sharma (+91 98640 12345). Calling now...`,
        hi: `सुनीता शर्मा (+91 98640 12345) से संपर्क किया जा रहा है।`,
        as: `সুনীতা শৰ্মাৰ (+91 98640 12345) লগত সংযোগ কৰা হৈছে।`,
        bn: `সুনীতা শর্মার (+91 98640 12345) সাথে যোগাযোগ করা হচ্ছে।`,
        brx: `सुनिता शर्माजों (+91 98640 12345) फोनांज़ाबबाय।`,
        mni: `সুনিথা শর্মাগা (+91 98640 12345) শম্নহল্লে।`,
        kha: `Iasnoh bad i Sunita Sharma (+91 98640 12345).`,
        lus: `Sunita Sharma (+91 98640 12345) nen kan inzawm e.`,
        nag: `Sunita Sharma (+91 98640 12345) ke call kori ase.`,
        trp: `Sunita Sharma (+91 98640 12345) bai kok sanai wngha.`,
        ne: `सुनीता शर्मा (+91 98640 12345) सँग सम्पर्क गरिँदैछ।`
      };
      const reply = callReplies[language] || callReplies.en;
      return {
        reply,
        action: { type: 'CALL_SIMULATION', contact: 'Sunita Sharma', phone: '+91 98640 12345' },
        spoken: reply
      };
    }

    // Process through Natural Language Intent Engine
    const intentRes = detectIntent(query, { language, reminders });
    if (intentRes && intentRes.intent !== INTENTS.UNKNOWN && intentRes.route) {
      // Localized short responses
      return {
        reply: intentRes.text,
        spoken: intentRes.spoken,
        action: {
          type: 'NAVIGATE',
          route: intentRes.route,
          autostart: intentRes.autostart,
          readAloud: intentRes.readAloud,
          intent: intentRes.intent,
          label: intentRes.text
        }
      };
    }

    // Default Fallback
    const defaultElderlyReplies = {
      en: `I am here with you, ${userName}. You can say: "Start memory game", "Start breathing", or "Show my reminders".`,
      hi: `मैं आपके साथ हूँ, ${userName} जी। आप कह सकते हैं: "स्मृति खेल शुरू करो", "प्राणायाम शुरू करो", या "दवा दिखाओ"।`,
      as: `মই আপোনাৰ লগতেই আছোঁ, ${userName} বাইদেউ। আপুনি ক’ব পাৰে: "খেল আৰম্ভ কৰক", "উশাহৰ পেচাৰ আৰম্ভ কৰক", বা "দৰৱ দেখুৱাওক"।`,
      bn: `আমি আপনার সাথেই আছি, ${userName} দিদি। আপনি বলতে পারেন: "খেলা শুরু করো", "শ্বাসচর্চা শুরু করো", বা "ওষুধ দেখাও"।`,
      brx: `आं नोंथांनि लोगोनो दं, ${userName}। नोंथाङा बुंनो हागौ: "गेलेनाय जागाय", एबा "हां ला"।`,
      mni: `ঐহাক নহাক্কী নকন্দা লৈরি, ${userName}। নহাক্না হাইবা য়াই: "শান্নবা হৌরো", নত্রগা "স্বাস হোম্বগী থবক হৌরো"।`,
      kha: `Nga don ryngkat bad phi, ${userName}. Phi lah ban ong: "Sdang lehkai", lane "Ring mynsiem".`,
      lus: `I kiangah ka awm reng e, ${userName}. "Infiamna tan rawh", emaw "Thawlak tan rawh" i ti thei ang.`,
      nag: `Ami apuni logot ase, ${userName}. Apuni kobole pare: "Khel shuru koribi", ba "Saans lowa shuru koribi".`,
      trp: `Ang nini logio tongha, ${userName}. Nung sana mannai: "Khel chengbadi", ba "Huktwi sodi".`,
      ne: `म तपाईंसँगै छु, ${userName} ज्यू। तपाईं भन्न सक्नुहुन्छ: "खेल सुरु गर", वा "श्वास अभ्यास सुरु गर"।`
    };

    const reply = defaultElderlyReplies[language] || defaultElderlyReplies.en;
    return {
      reply,
      action: { type: 'SUGGESTION', items: ['Start memory game', 'Start breathing', 'Show my reminders'] },
      spoken: reply
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
