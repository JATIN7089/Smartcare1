/**
 * Role-Aware AI Assistant Engine
 * 
 * Supports all 11 North Eastern & National Languages:
 * English, Hindi, Assamese, Bengali, Bodo, Meitei (Manipuri), Khasi, Mizo, Nagamese, Kokborok, Nepali
 */

import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations.js';

export const ASSISTANT_LANGUAGES = SUPPORTED_LANGUAGES;

export function processVoiceCommand(input = '', role = 'elderly', contextData = {}) {
  const query = input.toLowerCase().trim();
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

  // 1. ELDERLY ROLE RESPONSES
  if (role === 'elderly') {
    // Medicine intent
    if (query.includes('medicine') || query.includes('dawa') || query.includes('oukhod') || query.includes('pill') || query.includes('hidak') || query.includes('muli') || query.includes('damdawi') || query.includes('bwtwi') || query.includes('aushadhi') || query.includes('dawai')) {
      const med = reminders.find(r => r.category === 'Medicine');
      const timeStr = med ? med.time : '08:00 AM';

      const medReplies = {
        en: `Your medicine is scheduled at ${timeStr}. Please take it with a cup of warm water.`,
        hi: `आपकी दवा का समय ${timeStr} पर है। कृपया इसे गुनगुने पानी के साथ लें।`,
        as: `আপোনাৰ দৰৱৰ সময় ${timeStr} বজাত। অনুগ্ৰহ কৰি এগিলাচ কুহুমীয়া পানীৰে খাওক।`,
        bn: `আপনার ওষুধের সময় ${timeStr} টায়। অনুগ্রহ করে ঈষদুষ্ণ জলের সাথে খেয়ে নিন।`,
        brx: `नोंथांनि मुलिनि समा ${timeStr} जाबाय। अननानै दुंफुं दैजों लोबानि।`,
        mni: `নহাক্কী হিদাক্কী মতম অসি ${timeStr} তারে। তৌবীদুনা ঈশিং নুংঙাইনা থকপীয়ু।`,
        kha: `Ka dawai jong phi ka dei ha ka ${timeStr}. Sngewbha dih bad ka um kaba syaid.`,
        lus: `I damdawi ei hun chu ${timeStr} a ni e. Tui lum nen in rawh le.`,
        nag: `Apuni laga dawai time ${timeStr} baje ase. Gonom pani logot khabi.`,
        trp: `Nini bwtwi samae ${timeStr} wngha. Lasi tui kaphai bai nungdi.`,
        ne: `तपाईंको औषधीको समय ${timeStr} मा छ। कृपया मनतातो पानीसँग लिनुहोस्।`
      };

      const replyText = medReplies[language] || medReplies.en;
      return {
        reply: replyText,
        action: { type: 'NAVIGATE', route: '/reminders', label: TRANSLATIONS[language]?.nav_reminders || 'Reminders' },
        spoken: replyText
      };
    }

    // Game intent
    if (query.includes('game') || query.includes('play') || query.includes('khel') || query.includes('memory') || query.includes('shannou') || query.includes('infiam') || query.includes('kheldi')) {
      const gameReplies = {
        en: "Let's play your favorite North Eastern Memory Match! Opening your cultural cards now.",
        hi: "आइए आपका पसंदीदा पूर्वोत्तर स्मृति खेल खेलते हैं! खेल खोला जा रहा है।",
        as: "আহক, উত্তৰ-পূবৰ আপোন সোঁৱৰণি খেলখন খেলোঁ! খেলখন খুলি দিয়া হৈছে।",
        bn: "আসুন আপনার পছন্দের উত্তর-পূর্বাঞ্চলীয় স্মৃতি খেলাটি খেলি! এখনই শুরু হচ্ছে।",
        brx: "फै जोंनि अनफाव इसान गेलेनायखौ गेलेनि! खुलिनाय जाबाय।",
        mni: "অৱাং-নোংপোক্কী নাৎকা শাগোন্নবা শান্নপোৎ অসি শান্নরসি! হাংদোক্লে।",
        kha: "To ngin lehkai ia ka jingiakhun kynmaw jingmut jong ka North East!",
        lus: "Kan North East ziarang nena inmil infiamna i khel ang hmiang!",
        nag: "Ahibi, North East laga memory game kheli! Khuli ase.",
        trp: "North Eastni kaham memory khelno kheldi! Chengba wngha.",
        ne: "आउनुहोस् उत्तर-पूर्वी स्मृति खेल खेलौं! खेल खुल्दैछ।"
      };
      const reply = gameReplies[language] || gameReplies.en;
      return {
        reply,
        action: { type: 'NAVIGATE', route: '/games/cultural', label: TRANSLATIONS[language]?.nav_games || 'NER Game' },
        spoken: reply
      };
    }

    // Breathing intent
    if (query.includes('breathe') || query.includes('breathing') || query.includes('relax') || query.includes('calm') || query.includes('shant') || query.includes('swas') || query.includes('thawlak') || query.includes('huktwi') || query.includes('shwas')) {
      const breathReplies = {
        en: "Taking deep breaths makes us feel peaceful. Let's do a 2-minute 4-2-6 breathing exercise together.",
        hi: "गहरी सांस लेने से मन शांत होता है। आइए 2 मिनट का 4-2-6 प्राणायाम अभ्यास करें।",
        as: "দীঘলকৈ উশাহ ল’লে মন শান্ত হয়। আহক, ২ মিনিটৰ উশাহ-নিশাহ পেচাৰ আৰম্ভ কৰোঁ।",
        bn: "গভীর শ্বাস নিলে মন শান্ত হয়। আসুন একসাথে ২ মিনিটের ৪-২-৬ শ্বাসচর্চা করি।",
        brx: "गोथौ हां लामोब्ला गोसोआ गोजोन जायो। फै २ मिनिथ हां लानाय गेलेनि।",
        mni: "স্বাস লুংনা হোঞ্জিল্লবদি নুংঙাইবা ফাওই। পুন্না মিনিত ২ স্বাস পেসর শান্নরসি।",
        kha: "Kaba ring mynsiem jai jai ka pynkmen ia ka jingmut. To ngin sdang 2 minit.",
        lus: "Thawlak zawi muang hian rilru a tihahdam thin. Minit 2 i thawk dun ang u.",
        nag: "Lamba saans lole dimag shanti pai. Ahibi 2 minit saans lowa shuru kori.",
        trp: "Huktwi lasi tubule bokhrok kaham wngo. 2 minit huktwi sona chengnai.",
        ne: "लामो सास फेर्दा मन शान्त हुन्छ। आउनुहोस् २ मिनेटको ४-२-६ श्वास अभ्यास गरौं।"
      };
      const reply = breathReplies[language] || breathReplies.en;
      return {
        reply,
        action: { type: 'NAVIGATE', route: '/breathing', label: TRANSLATIONS[language]?.nav_breathing || 'Breathing Pacer' },
        spoken: reply
      };
    }

    // Caregiver intent
    if (query.includes('caregiver') || query.includes('sunita') || query.includes('call') || query.includes('daughter') || query.includes('help') || query.includes('bonti') || query.includes('chhori')) {
      const callReplies = {
        en: `Connecting you with Sunita Sharma (+91 98640 12345). She is always just a quick phone call away!`,
        hi: `सुनीता शर्मा (+91 98640 12345) से संपर्क किया जा रहा है। वह तुरंत कॉल पर उपलब्ध हैं!`,
        as: `সুনীতা শৰ্মাৰ (+91 98640 12345) লগত সংযোগ কৰা হৈছে। তাই আপোনাৰ ওচৰতে আছে!`,
        bn: `সুনীতা শর্মার (+91 98640 12345) সাথে যোগাযোগ করা হচ্ছে। তিনি সর্বদাই আপনার পাশে!`,
        brx: `सुनिता शर्माजों (+91 98640 12345) फोनांज़ाबबाय। बियो नोंथांनि खाथियावनो दं!`,
        mni: `সুনিথা শর্মাগা (+91 98640 12345) শম্নহল্লে। মহাক নহাক্কীদমক লৈরি!`,
        kha: `Iasnoh bad i Sunita Sharma (+91 98640 12345). I don ryngkat bad phi!`,
        lus: `Sunita Sharma (+91 98640 12345) nen kan inzawm e. A nghakhlel khawp mai che!`,
        nag: `Sunita Sharma (+91 98640 12345) ke connect kori ase. Phone ahibo!`,
        trp: `Sunita Sharma (+91 98640 12345) bai kok sanai wngha. Bo nini kothoma khnanai!`,
        ne: `सुनीता शर्मा (+91 98640 12345) सँग सम्पर्क गरिँदैछ। उहाँ सदैव तपाईंसँग हुनुहुन्छ!`
      };
      const reply = callReplies[language] || callReplies.en;
      return {
        reply,
        action: { type: 'CALL_SIMULATION', contact: 'Sunita Sharma', phone: '+91 98640 12345' },
        spoken: reply
      };
    }

    // Default Elderly Help
    const defaultElderlyReplies = {
      en: `I am here with you, ${userName}. You can ask: "When is my medicine?", "Start memory game", or "Start breathing".`,
      hi: `मैं आपके साथ हूँ, ${userName} जी। आप पूछ सकते हैं: "मेरी दवा कब है?", "स्मृति खेल शुरू करो", या "प्राणायाम कराओ"।`,
      as: `মই আপোনাৰ লগতেই আছোঁ, ${userName} বাইদেউ। আপুনি ক’ব পাৰে: "মোৰ দৰৱ কেতিয়া?", "খেল আৰম্ভ কৰক", বা "উশাহৰ পেচাৰ খোলক"।`,
      bn: `আমি আপনার সাথেই আছি, ${userName} দিদি। আপনি বলতে পারেন: "আমার ওষুধ কখন?", "খেলা শুরু করো", বা "শ্বাসচর্চা শুরু করো"।`,
      brx: `आं नोंथांनि लोगोनो दं, ${userName}। नोंथाङा बुंनो हागौ: "मुलिनि समा माब्ला?", "गेलेनाय जागाय", एबा "हां ला"।`,
      mni: `ঐহাক নহাক্কী নকন্দা লৈরি, ${userName}। নহাক্না হাইবা য়াই: "ঐগী হিদাক মতম করম্বা?", "শান্নবা হৌরো", নত্রগা "স্বাস হোম্বগী থবক হৌরো"।`,
      kha: `Nga don ryngkat bad phi, ${userName}. Phi lah ban kylli: "Lano ka dawai?", "Sdang lehkai", lane "Ring mynsiem".`,
      lus: `I kiangah ka awm reng e, ${userName}. "Engtik nge ka damdawi?", "Infiamna tan rawh", emaw "Thawlak tan rawh" i ti thei ang.`,
      nag: `Ami apuni logot ase, ${userName}. Apuni kobole pare: "Moi laga dawai ketiya?", "Khel shuru koribi", ba "Saans lowa shuru koribi".`,
      trp: `Ang nini logio tongha, ${userName}. Nung sana mannai: "Bwtwi samae bwswk?", "Khel chengbadi", ba "Huktwi sodi".`,
      ne: `म तपाईंसँगै छु, ${userName} ज्यू। तपाईं सोध्न सक्नुहुन्छ: "मेरो औषधी कहिले हो?", "खेल सुरु गर", वा "श्वास अभ्यास सुरु गर"।`
    };

    const reply = defaultElderlyReplies[language] || defaultElderlyReplies.en;
    return {
      reply,
      action: { type: 'SUGGESTION', items: ['When is my medicine?', 'Start memory game', 'Start breathing'] },
      spoken: reply
    };
  }

  // 2. CAREGIVER ROLE
  if (role === 'caregiver') {
    return {
      reply: `Caregiver Intelligence (${language.toUpperCase()}):\n• Asha's memory accuracy: 84% (Improving trend)\n• Reminders: 4/5 completed today\n• Breathing sessions: 1 session (10 cycles)\n• Current Difficulty: Moderate\nNotice: Non-diagnostic supportive trend tracking.`,
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
