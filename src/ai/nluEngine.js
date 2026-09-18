/**
 * SmarTCARE Advanced NLU Engine
 * ============================================================
 * Turns messy, real-world elderly speech into structured meaning.
 *
 * Pipeline:
 *   raw text
 *     -> normalise (case, punctuation, filler words)
 *     -> phrase folding  ("kha li"  -> TAKEN,  "memory game" -> MEMORY)
 *     -> token folding via multilingual lexicon (dawai/दवा/medicine -> MEDICINE)
 *     -> fuzzy repair of ASR typos (levenshtein <= 1)
 *     -> weighted intent scoring (required groups + boosts + negatives)
 *     -> entity / slot extraction
 *     -> confidence + ranked alternatives
 *
 * Designed for Hinglish + Devanagari + NER-language speech, because our
 * users rarely speak in clean single-language sentences. Someone saying
 * "maine subah wali BP ki dawai kha li hai" must be understood as
 * MED_MARK_TAKEN with a medicine slot — not routed to a page.
 */

/* ============================================================
   1. INTENT VOCABULARY
   ============================================================ */

export const INTENT = {
  // --- Games / activities -------------------------------------------------
  GAME_START: 'GAME_START',
  GAME_LIST: 'GAME_LIST',
  GAME_RECOMMEND: 'GAME_RECOMMEND',

  // --- Medicine (query + action) -----------------------------------------
  MED_NEXT: 'MED_NEXT',
  MED_LIST_TODAY: 'MED_LIST_TODAY',
  MED_WHICH_TAKEN: 'MED_WHICH_TAKEN',
  MED_DID_I_TAKE: 'MED_DID_I_TAKE',
  MED_MARK_TAKEN: 'MED_MARK_TAKEN',
  MED_MISSED: 'MED_MISSED',

  // --- Reminders in general ----------------------------------------------
  REMINDER_LIST: 'REMINDER_LIST',
  REMINDER_NEXT: 'REMINDER_NEXT',
  REMINDER_ADD: 'REMINDER_ADD',

  // --- Routine ------------------------------------------------------------
  ROUTINE_NEXT: 'ROUTINE_NEXT',
  ROUTINE_TODAY: 'ROUTINE_TODAY',

  // --- Well-being ---------------------------------------------------------
  BREATHING_START: 'BREATHING_START',
  GROUNDING_START: 'GROUNDING_START',
  WELLBEING_OPEN: 'WELLBEING_OPEN',

  // --- Progress / profile -------------------------------------------------
  PROGRESS_QUERY: 'PROGRESS_QUERY',
  PROFILE_OPEN: 'PROFILE_OPEN',

  // --- People -------------------------------------------------------------
  CALL_CAREGIVER: 'CALL_CAREGIVER',
  CALL_DOCTOR: 'CALL_DOCTOR',
  MEMORY_LANE: 'MEMORY_LANE',

  // --- Navigation ---------------------------------------------------------
  GO_HOME: 'GO_HOME',
  OPEN_CAREGIVER_PORTAL: 'OPEN_CAREGIVER_PORTAL',
  OPEN_HEALTHCARE_PORTAL: 'OPEN_HEALTHCARE_PORTAL',

  // --- Conversational glue ------------------------------------------------
  GREETING: 'GREETING',
  THANKS: 'THANKS',
  HELP: 'HELP',
  TIME_QUERY: 'TIME_QUERY',
  WHO_ARE_YOU: 'WHO_ARE_YOU',
  AFFIRM: 'AFFIRM',
  DENY: 'DENY',
  STOP: 'STOP',

  UNKNOWN: 'UNKNOWN'
};

/** Games the assistant can open, with the words that point at each. */
export const GAME_CATALOG = {
  memory: {
    id: 'memory',
    route: '/games/memory',
    label: 'Memory Match',
    labelHi: 'याददाश्त का खेल',
    tokens: ['MEMORY']
  },
  cultural: {
    id: 'cultural',
    route: '/games/cultural',
    label: 'NER Cultural Match',
    labelHi: 'सांस्कृतिक खेल',
    tokens: ['CULTURAL']
  },
  attention: {
    id: 'attention',
    route: '/games/attention',
    label: 'Sequence Recall',
    labelHi: 'क्रम याद रखने का खेल',
    tokens: ['ATTENTION']
  },
  pattern: {
    id: 'pattern',
    route: '/games/pattern',
    label: 'Pattern Match',
    labelHi: 'पैटर्न खेल',
    tokens: ['PATTERN']
  },
  'daily-recall': {
    id: 'daily-recall',
    route: '/games/daily-recall',
    label: 'Daily Routine Recall',
    labelHi: 'दिनचर्या याद खेल',
    tokens: ['DAILYRECALL']
  },
  objects: {
    id: 'objects',
    route: '/games/objects',
    label: 'Familiar Object Recognition',
    labelHi: 'वस्तु पहचान खेल',
    tokens: ['OBJECTGAME']
  },
  sound: {
    id: 'sound',
    route: '/games/sound',
    label: 'Sound & Environment Recall',
    labelHi: 'ध्वनि खेल',
    tokens: ['SOUNDGAME']
  }
};

/* ============================================================
   2. PHRASE FOLDING
   Multi-word expressions collapse first, because word-by-word
   lookup would destroy their meaning ("kha li" is one idea).
   ============================================================ */

const PHRASES = [
  // ---- "I already took it" (the single most important phrase family) ----
  [/\b(kha|kah|khaa)\s*(li|liya|lia|liye|li\s*hai|liya\s*hai)\b/g, ' TAKEN '],
  [/\b(le|lay|lai)\s*(li|liya|lia|liye|li\s*hai|liya\s*hai)\b/g, ' TAKEN '],
  [/\b(kha|khaa)\s*(rakhi|rakha|rakhe)\s*(thi|tha|the)?\b/g, ' TAKEN '],
  [/\b(le|lee)\s*(rakhi|rakha|rakhe)\s*(thi|tha|the)?\b/g, ' TAKEN '],
  [/\bho\s*(gaya|gayi|gai|gya)\b/g, ' TAKEN '],
  [/\b(kar|kr)\s*(li|liya|lia)\b/g, ' TAKEN '],
  [/\balready\s+(had|took|taken|eaten)\b/g, ' TAKEN '],
  [/\b(i\s+)?(took|had|swallowed)\s+(my|the)?\s*(medicine|medicines|pill|pills|tablet|tablets)\b/g, ' TAKEN MEDICINE '],
  [/\bkhaa?\s*chuka\b/g, ' TAKEN '],
  [/\bkhaa?\s*chuki\b/g, ' TAKEN '],
  [/(?:^|\s)(ली|लिया|खाई|खाया)\s*(थी|था|है|हैं)(?=\s|$)/g, ' TAKEN '],
  [/(?:^|\s)खा\s*(ली|लिया|लि)(?=\s|$)/g, ' TAKEN '],
  [/(?:^|\s)ले\s*(ली|लिया|लि)(?=\s|$)/g, ' TAKEN '],
  [/(?:^|\s)खा\s*(रखी|रखा)(?=\s|$)/g, ' TAKEN '],
  [/(?:^|\s)हो\s*ग(या|यी|ई)(?=\s|$)/g, ' TAKEN '],

  // ---- Identity & time questions (BEFORE the generic "kaun" -> WHICH rule,
  //      otherwise "tum kaun ho" would fold into WHICH and lose its meaning) ----
  [/\b(who\s+are\s+you|tum\s+kaun\s+ho|aap\s+kaun\s+ho|tumhara\s+naam)\b/g, ' WHOAREYOU '],
  [/(?:^|\s)(तुम|आप)\s+कौन\s+ह(ो|ैं)(?=\s|$)/g, ' WHOAREYOU '],
  [/\b(kitne|kitna)\s*baje\b/g, ' WHEN TIME '],
  [/(?:^|\s)कितने\s*बजे(?=\s|$)/g, ' WHEN TIME '],
  [/\bwhat\s*(is\s*)?(the\s*)?time\b/g, ' WHAT TIME '],
  [/\bsamay\s*kya\b/g, ' WHAT TIME '],

  // ---- Question framings -------------------------------------------------
  [/\b(kaun|kon|kaun\s*si|konsi|kaunsi|kaun\s*sa|konsa|kaunsa)\b/g, ' WHICH '],
  [/(?:^|\s)कौन\s*(सी|सा)(?=\s|$)/g, ' WHICH '],
  [/\bwhich\s+one\b/g, ' WHICH '],
  [/\bkya\s*maine\b/g, ' DIDI '],
  [/(?:^|\s)मैंने\s*क्या(?=\s|$)/g, ' DIDI '],
  [/\bdid\s+i\b/g, ' DIDI '],
  [/\bhave\s+i\b/g, ' DIDI '],
  [/\bmaine\s+kya\b/g, ' DIDI '],
  [/\bab\s*(kya|kaunsa)\b/g, ' NEXT '],
  [/(?:^|\s)अब\s*क्या(?=\s|$)/g, ' NEXT '],
  [/\bwhat\s*(do|should)\s*i\s*(do|take)\b/g, ' NEXT '],
  [/\bwhat'?s?\s+next\b/g, ' NEXT '],
  [/\bhow\s+am\s+i\s+doing\b/g, ' PROGRESS '],
  [/\b(main|mai|me)?\s*kais[aiey]+\s*(kar\s*)?(raha|rahi|rha|rhi)\s*(hu|hun|hoon)?\b/g, ' PROGRESS '],
  [/(?:^|\s)मैं\s*कैस(ा|ी)\s*कर\s*रह(ा|ी)(?=\s|$)/g, ' PROGRESS '],

  // ---- Game names (before the generic GAME token) ------------------------
  [/\b(memory|memori|yaad(dasht)?|smriti|yaddasht)\s*(match|game|khel)?\b/g, ' MEMORY '],
  [/(?:^|\s)(याद(दाश्त)?|स्मृति|मेमोरी)(?=\s|$)/g, ' MEMORY '],
  [/\bcard\s*(flip|match)\b/g, ' MEMORY '],
  [/\b(cultural|culture|ner\s*cultural|sanskritik)\b/g, ' CULTURAL '],
  [/(?:^|\s)(सांस्कृतिक)(?=\s|$)/g, ' CULTURAL '],
  [/\b(attention|sequence|kram|order\s*game|dhyan)\b/g, ' ATTENTION '],
  [/(?:^|\s)(ध्यान|क्रम)(?=\s|$)/g, ' ATTENTION '],
  [/\b(pattern|naksha|design)\b/g, ' PATTERN '],
  [/(?:^|\s)(पैटर्न|नक्शा)(?=\s|$)/g, ' PATTERN '],
  [/\b(daily\s*recall|routine\s*recall|dincharya\s*khel)\b/g, ' DAILYRECALL '],
  [/\b(object|objects|vastu|cheez\s*pehchan)\s*(recognition|pehchan)?\b/g, ' OBJECTGAME '],
  [/\b(sound|awaaz|dhvani|audio)\s*(game|memory|khel)?\b/g, ' SOUNDGAME '],
  [/\b(memory\s*lane|family\s*photo|family\s*photos|purani\s*yaadein|album)\b/g, ' MEMORYLANE '],

  // ---- Well-being --------------------------------------------------------
  [/\b(saans|sans|saas)\s*(lena|le|ki)?\s*(exercise|abhyas)?\b/g, ' BREATHING '],
  [/(?:^|\s)(सांस|साँस|स्वास|श्वास|प्राणायाम)(?=\s|$)/g, ' BREATHING '],
  [/\bdeep\s*breath\w*\b/g, ' BREATHING '],
  [/\b5\s*4\s*3\s*2\s*1\b/g, ' GROUNDING '],

  // ---- People ------------------------------------------------------------
  [/\b(beti|bete|daughter|sunita)\s*(ko)?\s*(call|phone|bulao)?\b/g, ' CAREGIVER '],
  [/(?:^|\s)(बेटी|सुनीता)(?=\s|$)/g, ' CAREGIVER '],
  [/\b(doctor|daktar|dr|barua|physician)\b/g, ' DOCTOR '],
  [/(?:^|\s)(डॉक्टर|दक्तर)(?=\s|$)/g, ' DOCTOR '],

  // ---- Time-of-day slots -------------------------------------------------
  [/\b(subah|morning|savere|savera)\b/g, ' MORNING '],
  [/(?:^|\s)(सुबह|सवेरे)(?=\s|$)/g, ' MORNING '],
  [/\b(dopahar|afternoon|noon)\b/g, ' AFTERNOON '],
  [/(?:^|\s)(दोपहर)(?=\s|$)/g, ' AFTERNOON '],
  [/\b(shaam|sham|evening)\b/g, ' EVENING '],
  [/(?:^|\s)(शाम)(?=\s|$)/g, ' EVENING '],
  [/\b(raat|night|rat)\b/g, ' NIGHT '],
  [/(?:^|\s)(रात)(?=\s|$)/g, ' NIGHT '],

  // ---- Misc --------------------------------------------------------------
  [/\b(thank\s*you|thanks|dhanyavad|shukriya)\b/g, ' THANKS '],
  [/(?:^|\s)(धन्यवाद|शुक्रिया)(?=\s|$)/g, ' THANKS '],
  [/\b(good\s*morning|good\s*evening|namaste|namaskar|hello|hi|hey|pranam)\b/g, ' HELLO '],
  [/(?:^|\s)(नमस्ते|नमस्कार|प्रणाम)(?=\s|$)/g, ' HELLO '],
  [/\bblood\s*pressure\b/g, ' BP '],
  [/\bbp\b/g, ' BP '],
  [/\bsugar|diabetes|madhumeh\b/g, ' SUGAR ']
];

/* ============================================================
   3. SINGLE-TOKEN LEXICON
   Every surface form a user might utter, folded to one concept.
   ============================================================ */

const LEXICON = {
  // MEDICINE
  medicine: 'MEDICINE', medicines: 'MEDICINE', medicin: 'MEDICINE', med: 'MEDICINE',
  meds: 'MEDICINE', pill: 'MEDICINE', pills: 'MEDICINE', tablet: 'MEDICINE',
  tablets: 'MEDICINE', dawa: 'MEDICINE', dawai: 'MEDICINE', davai: 'MEDICINE',
  dava: 'MEDICINE', dvai: 'MEDICINE', goli: 'MEDICINE', aushadhi: 'MEDICINE',
  oukhod: 'MEDICINE', hidak: 'MEDICINE', damdawi: 'MEDICINE', bwtwi: 'MEDICINE',
  'दवा': 'MEDICINE', 'दवाई': 'MEDICINE', 'गोली': 'MEDICINE', 'औषधि': 'MEDICINE',
  'ঔষধ': 'MEDICINE', 'দৰৱ': 'MEDICINE',

  // GAME
  game: 'GAME', games: 'GAME', gaem: 'GAME', khel: 'GAME', khelna: 'GAME',
  khelo: 'GAME', khelu: 'GAME', khelein: 'GAME', khelenge: 'GAME', khelte: 'GAME',
  activity: 'GAME', activities: 'GAME', puzzle: 'GAME',
  'खेल': 'GAME', 'खेलना': 'GAME', 'खेलो': 'GAME', 'খেলা': 'GAME',
  'गेम': 'GAME', 'अभ्यास': 'PRACTICE',

  // ACTIONS
  start: 'START', begin: 'START', chalu: 'START', chala: 'START', chalao: 'START',
  shuru: 'START', suru: 'START', start_karo: 'START', launch: 'START', play: 'START',
  'शुरू': 'START', 'चालू': 'START', 'चलाओ': 'START', 'करो': 'START', 'कीजिए': 'START',
  open: 'OPEN', kholo: 'OPEN', khol: 'OPEN', dikhao: 'OPEN', dikha: 'OPEN',
  show: 'OPEN', batao: 'OPEN', bata: 'OPEN', dekhna: 'OPEN', dekho: 'OPEN',
  'खोलो': 'OPEN', 'दिखाओ': 'OPEN', 'बताओ': 'OPEN',
  stop: 'STOP', band: 'STOP', ruko: 'STOP', cancel: 'STOP', quit: 'STOP', exit: 'STOP',
  'बंद': 'STOP', 'रुको': 'STOP',

  // QUESTION WORDS
  kab: 'WHEN', when: 'WHEN', 'कब': 'WHEN',
  kya: 'WHAT', what: 'WHAT', 'क्या': 'WHAT',
  kitna: 'HOWMANY', kitne: 'HOWMANY', kitni: 'HOWMANY', how: 'HOWMANY',
  kaise: 'HOW', 'कैसे': 'HOW',

  // STATE
  taken: 'TAKEN', liya: 'TAKEN', li: 'TAKEN', khaya: 'TAKEN', khai: 'TAKEN',
  done: 'TAKEN', complete: 'TAKEN', completed: 'TAKEN', finished: 'TAKEN',
  'खाया': 'TAKEN', 'लिया': 'TAKEN',
  pending: 'PENDING', baaki: 'PENDING', bachi: 'PENDING', remaining: 'PENDING',
  'बाकी': 'PENDING',
  missed: 'MISSED', chhut: 'MISSED', chhoot: 'MISSED', bhool: 'MISSED',
  bhul: 'MISSED', forgot: 'MISSED', 'भूल': 'MISSED', 'छूट': 'MISSED',

  // TIME
  next: 'NEXT', agla: 'NEXT', agli: 'NEXT', 'अगली': 'NEXT', 'अगला': 'NEXT',
  today: 'TODAY', aaj: 'TODAY', 'आज': 'TODAY',
  now: 'NOW', abhi: 'NOW', 'अभी': 'NOW',
  time: 'TIME', samay: 'TIME', baje: 'TIME', 'समय': 'TIME',

  // DOMAINS
  reminder: 'REMINDER', reminders: 'REMINDER', yaad: 'REMINDER',
  yaaddilao: 'REMINDER', alarm: 'REMINDER', 'याद': 'REMINDER',
  routine: 'ROUTINE', schedule: 'ROUTINE', dincharya: 'ROUTINE',
  timetable: 'ROUTINE', 'दिनचर्या': 'ROUTINE',
  breathing: 'BREATHING', breathe: 'BREATHING', breath: 'BREATHING',
  relax: 'BREATHING', calm: 'BREATHING', shant: 'BREATHING', pranayam: 'BREATHING',
  grounding: 'GROUNDING', senses: 'GROUNDING', anxious: 'GROUNDING',
  ghabrahat: 'GROUNDING', panic: 'GROUNDING',
  wellbeing: 'WELLBEING', health: 'WELLBEING', sehat: 'WELLBEING', 'सेहत': 'WELLBEING',
  progress: 'PROGRESS', score: 'PROGRESS', pragati: 'PROGRESS',
  performance: 'PROGRESS', 'प्रगति': 'PROGRESS',
  profile: 'PROFILE', account: 'PROFILE', 'प्रोफाइल': 'PROFILE',
  home: 'HOME', ghar: 'HOME', mukhya: 'HOME', 'घर': 'HOME', 'होम': 'HOME',
  caregiver: 'CAREGIVER', 'केयरगिवर': 'CAREGIVER',
  call: 'CALL', phone: 'CALL', bulao: 'CALL', baat: 'CALL', 'फोन': 'CALL', 'बुलाओ': 'CALL',
  help: 'HELP', madad: 'HELP', sahayata: 'HELP', 'मदद': 'HELP',

  // YES / NO
  yes: 'YES', haan: 'YES', han: 'YES', ha: 'YES', ji: 'YES', bilkul: 'YES',
  ok: 'YES', okay: 'YES', sure: 'YES', 'हाँ': 'YES', 'हां': 'YES', 'जी': 'YES',
  no: 'NO', nahi: 'NO', nahin: 'NO', na: 'NO', 'नहीं': 'NO', 'ना': 'NO',

  // Recommendation
  recommend: 'RECOMMEND', suggest: 'RECOMMEND', suggestion: 'RECOMMEND',
  chahiye: 'WANT', want: 'WANT', mann: 'WANT', chaho: 'WANT'
};

/** Filler words that add no meaning — dropped before scoring. */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'to', 'for', 'of', 'in',
  'on', 'at', 'my', 'me', 'i', 'you', 'please', 'can', 'could', 'would', 'will',
  'hai', 'he', 'ho', 'hu', 'hun', 'hoon', 'tha', 'thi', 'the', 'ka', 'ki', 'ke',
  'ko', 'se', 'me', 'mein', 'main', 'maine', 'mera', 'meri', 'mujhe', 'muje',
  'aur', 'ya', 'bhi', 'to', 'toh', 'na', 'ne', 'wala', 'wali', 'zara', 'thoda',
  'please', 'kar', 'karo', 'karna', 'do', 'de', 'dijiye', 'kripya',
  'है', 'हूँ', 'था', 'थी', 'का', 'की', 'के', 'को', 'से', 'में', 'मैं', 'मुझे', 'और'
]);

/* ============================================================
   4. INTENT DEFINITIONS
   `all`    : every group must be present (AND of ORs)
   `any`    : at least one token adds score
   `not`    : presence disqualifies / penalises
   `weight` : tie-breaker priority — more specific intents score higher
   ============================================================ */

const INTENT_DEFS = [
  // ---------- MEDICINE: the richest area, most specific first ----------
  {
    intent: INTENT.MED_WHICH_TAKEN,
    all: [['WHICH'], ['MEDICINE'], ['TAKEN']],
    weight: 12
  },
  {
    intent: INTENT.MED_DID_I_TAKE,
    all: [['DIDI'], ['MEDICINE']],
    any: ['TAKEN'],
    weight: 11
  },
  {
    intent: INTENT.MED_MARK_TAKEN,
    all: [['TAKEN'], ['MEDICINE']],
    not: ['WHICH', 'DIDI', 'WHEN'],
    weight: 10
  },
  {
    intent: INTENT.MED_MISSED,
    all: [['MISSED'], ['MEDICINE', 'REMINDER']],
    weight: 10
  },
  {
    intent: INTENT.MED_NEXT,
    all: [['MEDICINE'], ['WHEN', 'NEXT', 'TIME']],
    weight: 9
  },
  {
    intent: INTENT.MED_LIST_TODAY,
    all: [['MEDICINE']],
    any: ['WHICH', 'TODAY', 'OPEN', 'WHAT', 'HOWMANY', 'PENDING'],
    weight: 7
  },
  {
    intent: INTENT.MED_LIST_TODAY,
    all: [['MEDICINE']],
    weight: 4
  },

  // ---------- GAMES ----------
  {
    intent: INTENT.GAME_RECOMMEND,
    all: [['GAME']],
    any: ['RECOMMEND', 'WHICH', 'WHAT'],
    not: ['MEMORY', 'CULTURAL', 'ATTENTION', 'PATTERN', 'DAILYRECALL', 'OBJECTGAME', 'SOUNDGAME'],
    weight: 9
  },
  {
    intent: INTENT.GAME_START,
    all: [['MEMORY', 'CULTURAL', 'ATTENTION', 'PATTERN', 'DAILYRECALL', 'OBJECTGAME', 'SOUNDGAME']],
    not: ['MEMORYLANE'],
    weight: 9
  },
  {
    intent: INTENT.GAME_START,
    all: [['GAME'], ['START', 'OPEN', 'WANT']],
    weight: 8
  },
  {
    intent: INTENT.GAME_LIST,
    all: [['GAME']],
    weight: 5
  },

  // ---------- WELL-BEING ----------
  { intent: INTENT.BREATHING_START, all: [['BREATHING']], weight: 8 },
  { intent: INTENT.GROUNDING_START, all: [['GROUNDING']], weight: 8 },
  { intent: INTENT.WELLBEING_OPEN, all: [['WELLBEING']], weight: 6 },

  // ---------- REMINDERS / ROUTINE ----------
  { intent: INTENT.REMINDER_NEXT, all: [['REMINDER'], ['NEXT', 'WHEN']], weight: 8 },
  { intent: INTENT.REMINDER_ADD, all: [['REMINDER'], ['ADD']], weight: 8 },
  { intent: INTENT.REMINDER_LIST, all: [['REMINDER']], weight: 6 },
  { intent: INTENT.ROUTINE_NEXT, all: [['ROUTINE'], ['NEXT', 'NOW']], weight: 8 },
  { intent: INTENT.ROUTINE_NEXT, all: [['NEXT']], weight: 5 },
  { intent: INTENT.ROUTINE_TODAY, all: [['ROUTINE']], weight: 6 },

  // ---------- PROGRESS / PROFILE ----------
  { intent: INTENT.PROGRESS_QUERY, all: [['PROGRESS']], weight: 7 },
  { intent: INTENT.PROFILE_OPEN, all: [['PROFILE']], weight: 6 },

  // ---------- PEOPLE ----------
  { intent: INTENT.CALL_DOCTOR, all: [['DOCTOR'], ['CALL']], weight: 9 },
  { intent: INTENT.CALL_CAREGIVER, all: [['CAREGIVER'], ['CALL']], weight: 9 },
  { intent: INTENT.CALL_CAREGIVER, all: [['CAREGIVER']], weight: 5 },
  { intent: INTENT.CALL_DOCTOR, all: [['DOCTOR']], weight: 5 },
  { intent: INTENT.MEMORY_LANE, all: [['MEMORYLANE']], weight: 9 },

  // ---------- NAVIGATION ----------
  { intent: INTENT.GO_HOME, all: [['HOME']], weight: 7 },

  // ---------- CONVERSATIONAL ----------
  { intent: INTENT.WHO_ARE_YOU, all: [['WHOAREYOU']], weight: 10 },
  { intent: INTENT.TIME_QUERY, all: [['TIME'], ['WHAT', 'WHEN']], weight: 8 },
  { intent: INTENT.THANKS, all: [['THANKS']], weight: 7 },
  { intent: INTENT.GREETING, all: [['HELLO']], weight: 6 },
  { intent: INTENT.HELP, all: [['HELP']], weight: 6 },
  { intent: INTENT.STOP, all: [['STOP']], weight: 6 },
  { intent: INTENT.AFFIRM, all: [['YES']], weight: 3 },
  { intent: INTENT.DENY, all: [['NO']], weight: 3 }
];

/* ============================================================
   5. TEXT PROCESSING HELPERS
   ============================================================ */

function basicNormalise(raw) {
  return (raw || '')
    .toLowerCase()
    .replace(/[.,!?;:"'`’()\[\]{}\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Classic Levenshtein, capped for speed — repairs small ASR slips. */
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[n];
}

const LEXICON_KEYS = Object.keys(LEXICON);

/** Exact lookup, then a tolerant pass for mis-heard words. */
function foldToken(token) {
  if (LEXICON[token]) return LEXICON[token];
  if (token.length < 5) return null;
  let best = null;
  let bestDist = 2; // accept distance 1 only
  for (const key of LEXICON_KEYS) {
    if (key.length < 4) continue;
    const d = levenshtein(token, key);
    if (d < bestDist) {
      bestDist = d;
      best = LEXICON[key];
      if (d === 0) break;
    }
  }
  return best;
}

/**
 * Full normalisation pipeline.
 * @returns {{ concepts: string[], words: string[], clean: string }}
 */
export function analyseText(raw) {
  let text = basicNormalise(raw);

  // Phrase folding injects UPPERCASE concept markers directly into the string.
  for (const [pattern, replacement] of PHRASES) {
    text = text.replace(pattern, replacement);
  }
  text = text.replace(/\s+/g, ' ').trim();

  const words = text.split(' ').filter(Boolean);
  const concepts = [];

  for (const word of words) {
    // Already a concept marker produced by phrase folding.
    if (/^[A-Z]+$/.test(word)) {
      concepts.push(word);
      continue;
    }
    if (STOPWORDS.has(word)) continue;
    const folded = foldToken(word);
    if (folded) concepts.push(folded);
  }

  return {
    concepts: [...new Set(concepts)],
    words,
    clean: basicNormalise(raw)
  };
}

/* ============================================================
   6. SCORING
   ============================================================ */

function scoreDefinition(def, conceptSet) {
  // Every required group needs at least one present concept.
  if (def.all) {
    for (const group of def.all) {
      if (!group.some(c => conceptSet.has(c))) return 0;
    }
  }
  // Disqualifiers.
  if (def.not && def.not.some(c => conceptSet.has(c))) return 0;

  let score = def.weight || 1;
  if (def.any) {
    const hits = def.any.filter(c => conceptSet.has(c)).length;
    score += hits * 2;
  }
  // Reward matching many required groups (specificity).
  if (def.all) score += def.all.length;

  return score;
}

/* ============================================================
   7. ENTITY / SLOT EXTRACTION
   ============================================================ */

function extractGame(conceptSet) {
  for (const game of Object.values(GAME_CATALOG)) {
    if (game.tokens.some(t => conceptSet.has(t))) return game;
  }
  return null;
}

function extractTimeOfDay(conceptSet) {
  if (conceptSet.has('MORNING')) return 'morning';
  if (conceptSet.has('AFTERNOON')) return 'afternoon';
  if (conceptSet.has('EVENING')) return 'evening';
  if (conceptSet.has('NIGHT')) return 'night';
  return null;
}

function extractMedicineHint(conceptSet, clean) {
  if (conceptSet.has('BP')) return 'bp';
  if (conceptSet.has('SUGAR')) return 'sugar';
  // Fall back to a raw-text scan for condition words the lexicon misses.
  if (/\bheart|dil\b/.test(clean)) return 'heart';
  if (/\bvitamin|calcium\b/.test(clean)) return 'vitamin';
  return null;
}

/* ============================================================
   8. PUBLIC API
   ============================================================ */

/**
 * Understand an utterance.
 *
 * @param {string} raw            what the user said / typed
 * @param {object} session        { pendingSlot, lastIntent } for multi-turn
 * @returns {object} structured NLU result
 */
export function understand(raw, session = {}) {
  const { concepts, clean } = analyseText(raw);
  const conceptSet = new Set(concepts);

  if (!clean) {
    return {
      intent: INTENT.UNKNOWN,
      confidence: 0,
      concepts: [],
      entities: {},
      raw: raw || '',
      empty: true
    };
  }

  // ---- Multi-turn: are we waiting on an answer to a clarifying question? ----
  if (session.pendingSlot) {
    const resolved = resolvePendingSlot(session.pendingSlot, conceptSet, clean);
    if (resolved) {
      return {
        ...resolved,
        concepts,
        raw,
        resolvedFromSlot: true
      };
    }
  }

  // ---- Score every definition, keep the best ----
  const scored = INTENT_DEFS
    .map(def => ({ intent: def.intent, score: scoreDefinition(def, conceptSet) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      intent: INTENT.UNKNOWN,
      confidence: 0.15,
      concepts,
      entities: {},
      raw
    };
  }

  const top = scored[0];
  const runnerUp = scored[1];

  // Confidence: absolute strength, reduced when a rival scores nearly as high.
  let confidence = Math.min(0.98, 0.45 + top.score * 0.045);
  if (runnerUp && runnerUp.intent !== top.intent) {
    const margin = top.score - runnerUp.score;
    if (margin <= 1) confidence -= 0.12;
  }

  return {
    intent: top.intent,
    confidence: Math.max(0.3, Number(confidence.toFixed(2))),
    concepts,
    entities: {
      game: extractGame(conceptSet),
      timeOfDay: extractTimeOfDay(conceptSet),
      medicineHint: extractMedicineHint(conceptSet, clean),
      isQuestion: conceptSet.has('WHICH') || conceptSet.has('WHEN') ||
                  conceptSet.has('WHAT') || conceptSet.has('DIDI') ||
                  conceptSet.has('HOWMANY')
    },
    alternatives: scored.slice(1, 4).map(s => s.intent),
    raw
  };
}

/**
 * When the assistant asked a clarifying question, interpret the reply in
 * that narrow context instead of running full intent detection.
 */
function resolvePendingSlot(pendingSlot, conceptSet, clean) {
  if (pendingSlot.type === 'CONFIRM_MED_TAKEN') {
    if (conceptSet.has('YES')) {
      return {
        intent: INTENT.MED_MARK_TAKEN,
        confidence: 0.95,
        entities: { reminderId: pendingSlot.reminderId },
        slotAnswer: 'yes'
      };
    }
    if (conceptSet.has('NO')) {
      return { intent: INTENT.DENY, confidence: 0.95, entities: {}, slotAnswer: 'no' };
    }
  }

  if (pendingSlot.type === 'CHOOSE_MEDICINE') {
    const options = pendingSlot.options || [];
    // Match by ordinal ("pehli", "first", "1")
    const ordinals = [
      [/\b(1|first|pehl[ia]|पहली|पहला)\b/, 0],
      [/\b(2|second|dusr[ia]|दूसरी|दूसरा)\b/, 1],
      [/\b(3|third|teesr[ia]|तीसरी|तीसरा)\b/, 2]
    ];
    for (const [pattern, idx] of ordinals) {
      if (pattern.test(clean) && options[idx]) {
        return {
          intent: INTENT.MED_MARK_TAKEN,
          confidence: 0.92,
          entities: { reminderId: options[idx].id }
        };
      }
    }
    // Match by any distinctive word from the reminder title
    for (const option of options) {
      const titleWords = basicNormalise(option.title)
        .split(' ')
        .filter(w => w.length > 3);
      if (titleWords.some(w => clean.includes(w))) {
        return {
          intent: INTENT.MED_MARK_TAKEN,
          confidence: 0.9,
          entities: { reminderId: option.id }
        };
      }
    }
  }

  if (pendingSlot.type === 'CHOOSE_GAME') {
    const game = extractGame(conceptSet);
    if (game) {
      return {
        intent: INTENT.GAME_START,
        confidence: 0.93,
        entities: { game }
      };
    }
  }

  return null;
}

export default { understand, analyseText, INTENT, GAME_CATALOG };
