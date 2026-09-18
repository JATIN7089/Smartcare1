/**
 * SmarTCARE Localised Assistant Replies
 * ============================================================
 * The main dialogue engine answers in English and Hindi. When the user
 * speaks one of the other nine supported languages, this module answers
 * the most common questions *in that same language* instead of falling
 * back to English.
 *
 * Placeholders: {name} {count} {list} {pending} {next} {time} {game}
 *
 * Any intent not covered here returns null and the caller falls back to
 * the English/Hindi dialogue engine, so nothing ever breaks.
 */

import { INTENT } from './nluEngine.js';

const T = {
  /* ---------------- Assamese ---------------- */
  as: {
    WAYFIND_HOME: 'ভয় নাপায়, {name} বাইদেউ। আপোনাৰ ঘৰ {next}। মই ঘৰৰ ছবি আৰু বাটৰ মেপ খোলিছোঁ।',
    GREETING: 'নমস্কাৰ {name} বাইদেউ! মই আপোনাৰ স্মাৰ্টকেয়াৰ সংগী।',
    MED_WHICH_TAKEN: 'আপুনি আজি {count} টা দৰৱ খাইছে: {list}। ভাল কৰিছে, {name} বাইদেউ।',
    MED_WHICH_TAKEN_NONE: 'আজি এতিয়ালৈকে কোনো দৰৱ খোৱা বুলি দিয়া নাই। পৰৱৰ্তী দৰৱ {next}, {time} বজাত।',
    MED_DID_I_TAKE_YES: 'হয় {name} বাইদেউ, {next} ({time}) ইতিমধ্যে খোৱা হৈছে। চিন্তা নকৰিব।',
    MED_DID_I_TAKE_NO: '{next} ({time}) এতিয়াও দিয়া নাই। আপুনি খাইছে নেকি? মই দি দিম নেকি?',
    MED_NEXT: 'আপোনাৰ পৰৱৰ্তী দৰৱ {next}, {time} বজাত।',
    MED_LIST_TODAY: 'আজি {pending} টা দৰৱ বাকী আছে: {list}।',
    GAME_START: '{game} খোলা হৈছে, {name} বাইদেউ। লাহে লাহে খেলক, কোনো লৰালৰি নাই।',
    BREATHING_START: 'শ্বাস-প্ৰশ্বাসৰ অভ্যাস আৰম্ভ কৰিছোঁ। মোৰ লগত লাহে লাহে কৰক।',
    UNKNOWN: 'মই ঠিককৈ বুজি পোৱা নাই। আপুনি দৰৱ, খেল বা শ্বাসৰ বিষয়ে ক’ব পাৰে।'
  },
  /* ---------------- Bengali ---------------- */
  bn: {
    WAYFIND_HOME: 'ভয় পেয়ো না, {name} দিদি। আপনার বাড়ি {next}। আমি বাড়ির ছবি ও পথের ম্যাপ খুলছি।',
    GREETING: 'নমস্কার {name} দিদি! আমি আপনার স্মার্টকেয়ার সঙ্গী।',
    MED_WHICH_TAKEN: 'আপনি আজ {count} টি ওষুধ খেয়েছেন: {list}। খুব ভাল, {name} দিদি।',
    MED_WHICH_TAKEN_NONE: 'আজ এখনও কোনো ওষুধ খাওয়া নথিভুক্ত হয়নি। পরের ওষুধ {next}, {time} টায়।',
    MED_DID_I_TAKE_YES: 'হ্যাঁ {name} দিদি, {next} ({time}) আগেই খাওয়া নথিভুক্ত আছে। চিন্তা নেই।',
    MED_DID_I_TAKE_NO: '{next} ({time}) এখনও নথিভুক্ত নয়। আপনি কি খেয়েছেন? আমি লিখে দেব?',
    MED_NEXT: 'আপনার পরের ওষুধ {next}, {time} টায়।',
    MED_LIST_TODAY: 'আজ {pending} টি ওষুধ বাকি আছে: {list}।',
    GAME_START: '{name} দিদি, {game} খোলা হয়েছে। আস্তে খেলুন, কোনো তাড়া নেই।',
    BREATHING_START: 'শ্বাসের অভ্যাস শুরু করছি। আমার সঙ্গে ধীরে ধীরে করুন।',
    UNKNOWN: 'আমি ঠিক বুঝতে পারিনি। আপনি ওষুধ, খেলা বা শ্বাসের কথা বলতে পারেন।'
  },
  /* ---------------- Bodo (Devanagari) ---------------- */
  brx: {
    WAYFIND_HOME: 'गोनांथि होनाय जरुरत जाहाय, {name}। नोंथांनि नो {next}। आं नोनि फोटो आर बाटोनि नक्सा खोलो।',
    GREETING: 'खुलुमबाय {name}! आं नोंथांनि स्मार्टकेयार लोगो।',
    MED_WHICH_TAKEN: 'नोंथांनि आइजौ {count} दवाई खाबाय: {list}। जाहिनां, {name}।',
    MED_WHICH_TAKEN_NONE: 'आइजौ थाइ दवाई खाबाय खोमोनाय जाहाय। गुदान दवाई {next}, {time}।',
    MED_DID_I_TAKE_YES: 'नंगौ {name}, {next} ({time}) खाबाय खोमोनाय जाबाय। गोनांथि होनाय जरुरत जाहाय।',
    MED_DID_I_TAKE_NO: '{next} ({time}) थाइ खोमोनाय जाहाय। नोंथांनि खाबै? आं खोमोनों मा?',
    MED_NEXT: 'नोंथांनि गुदान दवाई {next}, {time}।',
    MED_LIST_TODAY: 'आइजौ {pending} दवाई दोंगाय: {list}।',
    GAME_START: '{game} खोलबाय जादों, {name}। आथेथे खेलो, बेगर जाहाय।',
    BREATHING_START: 'सांस अभ्यास होनाय जादों। आंनि लगों आथेथे खोमो।',
    UNKNOWN: 'आं खोन्दोबै खोनाय जाहाय। नोंथांनि दवाई, खेल एबा सांस खोन्दोबै।'
  },
  /* ---------------- Meitei (Manipuri) ---------------- */
  mni: {
    WAYFIND_HOME: 'খঞ্জররোনু, {name}। নহাক্কী যুমদি {next}। ঐহাক্না যুমগী মফম আরু লম্বীগী map হাংগে।',
    GREETING: 'খুরুমজরি {name}! ঐহাক নহাক্কী স্মার্টকেয়র মরুপনি।',
    MED_WHICH_TAKEN: 'নহাক্না নোংমসিদা {count} হিদাক থক্লে: {list}। নুংঙাইরবনি, {name}।',
    MED_WHICH_TAKEN_NONE: 'হন্দক্ক মশিদা হিদাক থকখ্রে হায়না ইরি। মতুংগী হিদাক {next}, {time}।',
    MED_DID_I_TAKE_YES: 'হোই {name}, {next} ({time}) থকখ্রে হায়না ইরে। খঞ্জররোনু।',
    MED_DID_I_TAKE_NO: '{next} ({time}) হন্দক ইরি। নহাক্না থক্লবরা? ঐহাক্না ইবিয়ুগে?',
    MED_NEXT: 'নহাক্কী মতুংগী হিদাক {next}, {time}।',
    MED_LIST_TODAY: 'নোংমসিদা {pending} হিদাক লেপ্পি: {list}।',
    GAME_START: '{game} হাংলে, {name}। অহিংবা মওংদা শান্নো, হরাক্তে।',
    BREATHING_START: 'নুংঙাইবা শাফু হৌরে। ঐহাক্কা পুন্না অহিংবা শান্নো।',
    UNKNOWN: 'ঐহাক্না খঙবা ঙমদে। নহাক্না হিদাক, শান্নবা নত্রগা শাফু হায়বা য়াই।'
  },
  /* ---------------- Khasi ---------------- */
  kha: {
    WAYFIND_HOME: 'Ym khreh, {name}。Ka iing jong phi {next}。Nga pynkhang ka jingpynkhwai jong ka iing bad ka map.',
    GREETING: 'Khublei {name}! Nga dei ka SmarTCARE jong phi.',
    MED_WHICH_TAKEN: 'Phi la pynlep {count} dawa mynta: {list}.Khublei shibun, {name}.',
    MED_WHICH_TAKEN_NONE: 'Ym don dawa la pynlep mynta. Ka dawa ba wan {next}, {time}.',
    MED_DID_I_TAKE_YES: 'Kumba {name}, ka {next} ({time}) la pynlep baroh. Ym don kam kham.',
    MED_DID_I_TAKE_NO: 'Ka {next} ({time}) ym don pynleh. Phi la pynlep? Nga pynlep na kwah?',
    MED_NEXT: 'Ka dawa ba wan jong phi {next}, {time}.',
    MED_LIST_TODAY: 'Mynta don {pending} dawa ba dang: {list}.',
    GAME_START: 'La pynkhang {game}, {name}. Ioh shanen, ym don buh.',
    BREATHING_START: 'La sdang ka saans. Kren jingjing na ngi.',
    UNKNOWN: 'Nga ym naphang khreh. Phi lah pyndonkam dawa, game, bad saans.'
  },
  /* ---------------- Mizo ---------------- */
  lus: {
    WAYFIND_HOME: 'Hrehawm hlo ang e, {name}。I in chu {next}。I in thlalak athau lam zin ka hawng e.',
    GREETING: 'Chibai {name}! I SmarTCARE thiante ka ni e.',
    MED_WHICH_TAKEN: 'Tunah hian dawidawi {count} i in tawh: {list}.A tha hle, {name}.',
    MED_WHICH_TAKEN_NONE: 'Tunah hian dawidawi in tawh a la ni lo. A dawng {next}, {time} ah.',
    MED_DID_I_TAKE_YES: 'A ni {name}, {next} ({time}) in tawh a ni tawh e. Hrehawm hlo ang e.',
    MED_DID_I_TAKE_NO: '{next} ({time}) a la in lo. I in tawh em? Ka ziak sak e?',
    MED_NEXT: 'I dawidawi a dawng chu {next}, {time} ah.',
    MED_LIST_TODAY: 'Tunah hian dawidawi {pending} a la nghak: {list}.',
    GAME_START: '{game} ka hawng e, {name}.Tluk tahle suh, a in hman zel ang e.',
    BREATHING_START: 'Sa inhriatna ka tan e. Ka nen a reuh reuhin ti rawh.',
    UNKNOWN: 'Ka hreikiam lo e. Dawidawi, game emaw sa inhriatna emaw tih thei e.'
  },
  /* ---------------- Nagamese ---------------- */
  nag: {
    WAYFIND_HOME: 'Chinta nako, {name}। Apuni laga nok {next}। Ami nok laga photo ar rasta laga map kholi diya ase.',
    GREETING: 'Namaste {name}! Ami apuni laga SmarTCARE sathi ase.',
    MED_WHICH_TAKEN: 'Apuni aji {count} dawai khai tawh ase: {list}। Bohot bhal, {name}.',
    MED_WHICH_TAKEN_NONE: 'Aji ekhono kunu dawai kha bola record hoi nahi. Agla dawai {next}, {time} baji.',
    MED_DID_I_TAKE_YES: 'Hoi {name}, {next} ({time}) khai tawh ase record me. Chinta nako.',
    MED_DID_I_TAKE_NO: '{next} ({time}) ekhono record hoi nahi. Apuni khai tawh? Ami record kori dim?',
    MED_NEXT: 'Apuni laga agla dawai {next}, {time} baji.',
    MED_LIST_TODAY: 'Aji {pending} dawai baaki ase: {list}.',
    GAME_START: '{game} kholi diya ase, {name}.Aaram se khele, kunu jaldi nahi.',
    BREATHING_START: 'Saans laga exercise chalu kori ase. More sange aste aste koro.',
    UNKNOWN: 'Ami thik buji nahi. Apuni dawai, game ar saans laga koi sakta ase.'
  },
  /* ---------------- Kokborok ---------------- */
  trp: {
    WAYFIND_HOME: 'Chinta mono, {name}। Nangi nok {next}। Ang nok laga photo ar lam laga map kholhai tongha.',
    GREETING: 'Kahamba {name}! Ang nini SmarTCARE logi.',
    MED_WHICH_TAKEN: 'Nang nua sorno {count} dawai nakha tawh: {list}। Bohot bhal, {name}.',
    MED_WHICH_TAKEN_NONE: 'Nua sorno dawai nakha khama record hokha. Thangthai dawai {next}, {time}.',
    MED_DID_I_TAKE_YES: 'Hoi {name}, {next} ({time}) nakha tawh record hokha. Chinta mono.',
    MED_DID_I_TAKE_NO: '{next} ({time}) ekhono record hokha. Nang nakha tawh? Ang record hai dim?',
    MED_NEXT: 'Nangi thangthai dawai {next}, {time}.',
    MED_LIST_TODAY: 'Nua sorno {pending} dawai baaki: {list}.',
    GAME_START: '{game} kholhai tawh, {name}। Aaste khele, jaldi natong.',
    BREATHING_START: 'Saans abhyas chalu hai tongha. Angni sange aaste koro.',
    UNKNOWN: 'Ang thik bujhai hai. Nang dawai, game athong saans khama koi nakha.'
  },
  /* ---------------- Nepali ---------------- */
  ne: {
    WAYFIND_HOME: 'नआत्तिनुहोस्, {name} ज्यू। तपाईंको घर {next}। म घरको फोटो र बाटोको नक्सा खोल्दैछु।',
    GREETING: 'नमस्ते {name} ज्यू! म तपाईंको स्मार्टकेयर साथी हुँ।',
    MED_WHICH_TAKEN: 'तपाईंले आज {count} औषधि खानुभयो: {list}। धेरै राम्रो, {name} ज्यू।',
    MED_WHICH_TAKEN_NONE: 'आज अहिलेसम्म कुनै औषधि खाएको रेकर्ड छैन। अर्को औषधि {next}, {time} बजे।',
    MED_DID_I_TAKE_YES: 'हो {name} ज्यू, {next} ({time}) खाइसकेको रेकर्ड छ। चिन्ता नगर्नुहोस्।',
    MED_DID_I_TAKE_NO: '{next} ({time}) अहिले रेकर्ड छैन। तपाईंले खानुभयो? म रेकर्ड गरिदिऊँ?',
    MED_NEXT: 'तपाईंको अर्को औषधि {next}, {time} बजे।',
    MED_LIST_TODAY: 'आज {pending} औषधि बाँकी छ: {list}।',
    GAME_START: '{game} खोल्दैछु, {name} ज्यू। आरामले खेल्नुहोस्, कुनै हतार छैन।',
    BREATHING_START: 'सासको अभ्यास सुरु गर्दैछु। मसँगै बिस्तारै गर्नुहोस्।',
    UNKNOWN: 'मैले ठीक बुझिनँ। तपाईं औषधि, खेल वा सासको बारेमा भन्न सक्नुहुन्छ।'
  }
};

function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : ''
  );
}

/**
 * Build a fully localised reply for the nine non-en/hi languages.
 * @returns {object|null} same shape as dialogueEngine.respond(), or null
 *          when this language/intent pair is not covered here.
 */
export function respondInLanguage(nlu, ctx, lang) {
  const table = T[lang];
  if (!table || !nlu || !nlu.intent) return null;

  const {
    reminders = [],
    user = {},
    takenList = '',
    takenCount = 0,
    pendingList = '',
    pendingCount = 0,
    nextTitle = '',
    nextTime = '',
    gameLabel = ''
  } = ctx.locals || {};

  const name = (user?.name || 'Asha').split(' ')[0];
  const vars = {
    name,
    count: takenCount,
    list: takenList,
    pending: pendingCount,
    next: nextTitle,
    time: nextTime,
    game: gameLabel
  };

  const key = nlu.intent;
  let template = table[key];

  // "What is still pending?" must list the PENDING items, not the taken ones.
  if (key === 'MED_LIST_TODAY' || key === INTENT.MED_LIST_TODAY) {
    vars.list = pendingList;
  }

  // Medicine questions branch on whether anything was taken / is pending.
  if (key === INTENT.MED_WHICH_TAKEN) {
    template = takenCount > 0 ? table.MED_WHICH_TAKEN : table.MED_WHICH_TAKEN_NONE;
  }
  if (key === INTENT.MED_DID_I_TAKE) {
    template = ctx.targetCompleted ? table.MED_DID_I_TAKE_YES : table.MED_DID_I_TAKE_NO;
  }

  if (!template) return null;

  const text = fill(template, vars);
  return {
    reply: text,
    spoken: text,
    action: null,
    chips: [],
    pendingSlot: null,
    localisedLanguage: lang
  };
}

export default { respondInLanguage };
