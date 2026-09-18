/**
 * Natural Language Intent Detection Engine
 * 
 * Maps user speech and text input to application actions and routes.
 * Supports natural language phrasing, synonyms, intent classification,
 * and North Eastern / National multilingual keywords.
 */

export const INTENTS = {
  // Memory Game
  START_MEMORY_GAME: 'START_MEMORY_GAME',
  OPEN_MEMORY_GAME: 'OPEN_MEMORY_GAME',
  
  // Attention / Sequence Game
  START_ATTENTION_GAME: 'START_ATTENTION_GAME',
  OPEN_ATTENTION_GAME: 'OPEN_ATTENTION_GAME',

  // Pattern Game
  START_PATTERN_GAME: 'START_PATTERN_GAME',
  OPEN_PATTERN_GAME: 'OPEN_PATTERN_GAME',

  // Daily Recall
  START_DAILY_RECALL: 'START_DAILY_RECALL',
  OPEN_DAILY_RECALL: 'OPEN_DAILY_RECALL',

  // Games Hub / General Activities
  OPEN_GAMES: 'OPEN_GAMES',
  START_ACTIVITY: 'START_ACTIVITY',

  // Breathing Pacer
  START_BREATHING: 'START_BREATHING',
  OPEN_BREATHING: 'OPEN_BREATHING',

  // Grounding Exercise
  START_GROUNDING: 'START_GROUNDING',
  OPEN_GROUNDING: 'OPEN_GROUNDING',

  // Reminders
  OPEN_REMINDERS: 'OPEN_REMINDERS',

  // Routine
  OPEN_ROUTINE: 'OPEN_ROUTINE',

  // Profile & Progress
  OPEN_PROGRESS: 'OPEN_PROGRESS',
  OPEN_PROFILE: 'OPEN_PROFILE',

  // Family Memory Lane
  OPEN_MEMORY_LANE: 'OPEN_MEMORY_LANE',

  // Navigation
  GO_HOME: 'GO_HOME',

  // Caregiver & Healthcare
  OPEN_CAREGIVER: 'OPEN_CAREGIVER',
  OPEN_HEALTHCARE: 'OPEN_HEALTHCARE',

  // Fallback
  UNKNOWN: 'UNKNOWN'
};

/**
 * Normalized intent detection
 * @param {string} rawInput 
 * @param {object} context 
 * @returns {object} { intent, route, autostart, spoken, text, confidence, readAloud }
 */
export function detectIntent(rawInput = '', context = {}) {
  const text = (rawInput || '').toLowerCase().trim();
  if (!text) {
    return {
      intent: INTENTS.UNKNOWN,
      text: "I didn't hear anything. Try saying 'Open memory game' or 'Start breathing'.",
      spoken: "I didn't hear anything. Try saying 'Open memory game' or 'Start breathing'.",
      confidence: 0
    };
  }

  const isStartAction = /(start|play|begin|let'?s\s*do|let'?s\s*play|let'?s|give\s*me|i\s*want\s*to\s*play|can\s*we\s*play|शुरू|खेलो|खेले|आरম্ভ)/i.test(text);

  // 1. MEMORY MATCH
  // "Open memory game", "Play memory game", "I want to play memory", "Let's play memory", "Start memory", "Give me a memory activity"
  if (/(memory|card\s*match|flip\s*card|স্মৃতি|स्मृति|মেমোরি)/i.test(text)) {
    if (text.includes('lane') || text.includes('family') || text.includes('photo') || text.includes('album')) {
      return {
        intent: INTENTS.OPEN_MEMORY_LANE,
        route: '/memory-lane',
        autostart: false,
        text: 'Opening Family Memory Lane.',
        spoken: 'Opening your family photos.',
        confidence: 0.95
      };
    }

    if (isStartAction) {
      return {
        intent: INTENTS.START_MEMORY_GAME,
        route: '/games/memory',
        autostart: true,
        text: 'Starting Memory Game...',
        spoken: 'Opening your memory game.',
        confidence: 0.98
      };
    } else {
      return {
        intent: INTENTS.OPEN_MEMORY_GAME,
        route: '/games/memory',
        autostart: true, // auto-ready without extra clicks
        text: 'Opening Memory Game...',
        spoken: 'Opening your memory game.',
        confidence: 0.95
      };
    }
  }

  // 2. ATTENTION / SEQUENCE RECALL
  // "Open attention game", "Play attention game", "Start attention game", "Sequence game"
  if (/(attention|sequence|order|1-2-3|monozog|ध्यान|मजेदार)/i.test(text)) {
    return {
      intent: isStartAction ? INTENTS.START_ATTENTION_GAME : INTENTS.OPEN_ATTENTION_GAME,
      route: '/games/attention',
      autostart: true,
      text: isStartAction ? 'Starting Attention Game...' : 'Opening Attention Game...',
      spoken: 'Opening your attention game.',
      confidence: 0.95
    };
  }

  // 3. PATTERN MATCH
  // "Open pattern game", "Play pattern game", "Pattern game"
  if (/(pattern|shape|weave|gamosa|पैटर्न|নকশা)/i.test(text)) {
    return {
      intent: isStartAction ? INTENTS.START_PATTERN_GAME : INTENTS.OPEN_PATTERN_GAME,
      route: '/games/pattern',
      autostart: true,
      text: isStartAction ? 'Starting Pattern Game...' : 'Opening Pattern Game...',
      spoken: 'Opening your pattern game.',
      confidence: 0.95
    };
  }

  // 4. DAILY RECALL
  // "Open daily recall", "Play daily recall", "Recall activity"
  if (/(daily\s*recall|recall|what\s*did\s*i\s*eat|breakfast\s*recall|সোঁৱৰণি)/i.test(text)) {
    return {
      intent: isStartAction ? INTENTS.START_DAILY_RECALL : INTENTS.OPEN_DAILY_RECALL,
      route: '/games/daily-recall',
      autostart: true,
      text: 'Opening Daily Recall...',
      spoken: 'Opening daily recall.',
      confidence: 0.95
    };
  }

  // 5. BREATHING PACER
  // "Open breathing", "Start breathing", "Let's breathe", "I want to relax", "Breathe with me"
  if (/(breath|breathe|breathing|relax|calm|peaceful|shant|प्राणायाम|सांस|উশাহ|হুকত্বি)/i.test(text)) {
    if (isStartAction || text.includes('breathe') || text.includes('relax') || text.includes('calm')) {
      return {
        intent: INTENTS.START_BREATHING,
        route: '/breathing',
        autostart: true,
        text: 'Starting breathing exercise...',
        spoken: "Let's begin.",
        confidence: 0.98
      };
    } else {
      return {
        intent: INTENTS.OPEN_BREATHING,
        route: '/breathing',
        autostart: true,
        text: 'Opening breathing exercise...',
        spoken: 'Opening breathing exercise.',
        confidence: 0.95
      };
    }
  }

  // 6. GROUNDING EXERCISE
  // "Open grounding", "Start grounding", "Calm my senses", "5-4-3-2-1"
  if (/(grounding|5-4-3-2-1|senses|sense)/i.test(text)) {
    return {
      intent: isStartAction ? INTENTS.START_GROUNDING : INTENTS.OPEN_GROUNDING,
      route: '/grounding',
      autostart: true,
      text: isStartAction ? 'Starting grounding exercise...' : 'Opening grounding exercise...',
      spoken: "Let's do a grounding exercise.",
      confidence: 0.95
    };
  }

  // 7. START ACTIVITY / RECOMMENDATION
  // "Start activity", "Give me an activity", "What activity should I do?"
  if (/(start\s*activity|give\s*me\s*an\s*activity|give\s*me\s*activity|new\s*activity|recommend|today'?s\s*activity)/i.test(text)) {
    return {
      intent: INTENTS.START_ACTIVITY,
      route: '/games/memory', // opens recommended activity
      autostart: true,
      text: 'Starting your recommended activity...',
      spoken: 'Opening your recommended activity.',
      confidence: 0.95
    };
  }

  // 8. GAMES HUB
  // "Open games", "Show games", "Games", "Activities"
  if (/(games|game|activities|activity\s*hub|khel|খেলা)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_GAMES,
      route: '/games',
      autostart: false,
      text: 'Opening Activities...',
      spoken: 'Opening activities.',
      confidence: 0.92
    };
  }

  // 9. REMINDERS / MEDICINE
  // "Open reminders", "Show my reminders", "What are my reminders?", "When is my medicine?", "Medicine"
  if (/(reminder|reminders|medicine|pill|dawa|dawai|oukhod|damdawi|hidak|bwtwi|aushadhi|schedule\s*medicine|दवा|दवाई)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_REMINDERS,
      route: '/reminders',
      autostart: false,
      readAloud: true,
      text: 'Opening your reminders...',
      spoken: 'Opening your reminders.',
      confidence: 0.98
    };
  }

  // 10. DAILY ROUTINE
  // "Open my routine", "Show my routine", "Daily routine"
  if (/(routine|daily\s*schedule|timeline|দিনচৰ্যা|दिनचर्या)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_ROUTINE,
      route: '/routine',
      autostart: false,
      text: 'Opening your daily routine...',
      spoken: 'Opening your routine.',
      confidence: 0.95
    };
  }

  // 11. PROGRESS / PROFILE
  // "Open my progress", "Show my progress", "How am I doing?", "My score"
  if (/(progress|how\s*am\s*i\s*doing|my\s*score|analytics|performance|सुधार|प्रगति)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_PROGRESS,
      route: '/profile',
      autostart: false,
      text: 'Opening your progress...',
      spoken: 'Opening your progress.',
      confidence: 0.96
    };
  }

  // 12. PROFILE
  // "Open my profile", "Show profile", "My profile"
  if (/(profile|account|settings|about\s*me|प्रोफ़ाइल)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_PROFILE,
      route: '/profile',
      autostart: false,
      text: 'Opening your profile...',
      spoken: 'Opening your profile.',
      confidence: 0.95
    };
  }

  // 12.5 TAKE ME HOME / SAFE MAP
  // "Mujhe ghar jana hai", "Ghar jana hai", "Take me home", "Ghar le chalo", "Map kholo"
  if (/(mujhe\s*ghar\s*jana\s*hai|ghar\s*jana\s*hai|ghar\s*le\s*chalo|ghar\s*chalo|take\s*me\s*home|mera\s*ghar|map|naksha|rasta|navigation|ghar)/i.test(text)) {
    return {
      intent: 'TAKE_ME_HOME',
      route: '/map',
      autostart: true,
      text: 'Opening your Home Map and navigation to Tezpur, Assam...',
      spoken: 'Opening your home map. You are safe.',
      confidence: 0.99
    };
  }

  // 13. GO HOME SCREEN (strictly UI home screen)
  if (/(home\s*screen|main\s*screen|home\s*page|होम\s*स्क्रीन)/i.test(text)) {
    return {
      intent: INTENTS.GO_HOME,
      route: '/elderly',
      autostart: false,
      text: 'Going to Home screen...',
      spoken: 'Opening home screen.',
      confidence: 0.98
    };
  }

  // 14. MEMORY LANE / FAMILY
  // "Open memory lane", "Show memory lane", "Family photos"
  if (/(memory\s*lane|family\s*photo|family\s*memories|album|daughter\s*photos|परिवार)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_MEMORY_LANE,
      route: '/memory-lane',
      autostart: false,
      text: 'Opening Family Memory Lane...',
      spoken: 'Opening your family photos.',
      confidence: 0.96
    };
  }

  // 15. CAREGIVER
  // "Open caregiver", "Caregiver dashboard", "Sunita", "Call daughter"
  if (/(caregiver|daughter|sunita|care\s*giver|केयरगिवर)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_CAREGIVER,
      route: '/caregiver',
      autostart: false,
      text: 'Opening Caregiver Portal...',
      spoken: 'Opening Caregiver Portal.',
      confidence: 0.92
    };
  }

  // 16. HEALTHCARE
  if (/(doctor|healthcare|clinic|asha\s*worker|cho|dr\s*barua)/i.test(text)) {
    return {
      intent: INTENTS.OPEN_HEALTHCARE,
      route: '/healthcare',
      autostart: false,
      text: 'Opening Healthcare Portal...',
      spoken: 'Opening Healthcare Portal.',
      confidence: 0.92
    };
  }

  // UNKNOWN / NOT UNDERSTOOD
  return {
    intent: INTENTS.UNKNOWN,
    route: null,
    autostart: false,
    text: "Sorry, I didn't understand. Try saying 'Open memory game' or 'Start breathing'.",
    spoken: "Sorry, I didn't understand. Try saying 'Open memory game'.",
    confidence: 0.2
  };
}
