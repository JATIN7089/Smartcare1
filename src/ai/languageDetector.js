/**
 * SmarTCARE Utterance Language Detector
 * ============================================================
 * Decides WHICH language the user actually spoke, so the assistant can
 * answer in that same language instead of the app's currently selected
 * UI language.
 *
 * Two passes:
 *   1. SCRIPT  — Devanagari / Bengali-Assamese scripts identify their
 *      language almost unambiguously, including script-specific letters
 *      (Assamese ৰ/ৱ, Bodo and Nepali Devanagari markers, Meitei words).
 *   2. LEXICON — roman text is scored against distinctive marker words per
 *      language. Hinglish ("kaun si dawai li") scores as Hindi even though
 *      it is written in Latin script, which is exactly how our users type
 *      and speak to the microphone.
 *
 * Returns { code, script, confidence }. `code` is always one of the codes
 * in SUPPORTED_LANGUAGES so callers can use it directly.
 */

/* Script ranges */
const DEVANAGARI = /[\u0900-\u097F]/;
const BENGALI_SCRIPT = /[\u0980-\u09FF]/;

/* Devanagari is shared by Hindi, Nepali and Bodo — markers disambiguate. */
const NE_DEV_MARKERS = /ज्यू|तपाई|तपाइ|गर्नु|गर्छ|छुँ|मैले|मलाई|मेरो|कुन|खाएँ|औषधि/;
const BRX_DEV_MARKERS = /खुलुमबाय|नोंथांनि|आं\s|सामलाय|हेफाजाब/;

/* Bengali script is shared by Bengali, Assamese and Meitei. */
const MNI_BEN_MARKERS = /খুরুমজরি|মরুপ|ঐহাক|নহাক্কী|য়েংশিন/;
const AS_BEN_MARKERS = /ৰ|ৱ|মই|আপোনাৰ|সক্ৰিয়|কৰো|বাইদেউ/;

/* Roman-script marker lexicons. Order matters: most distinctive first. */
const ROMAN_MARKERS = [
  ['brx', /khulumba|nongtham|ntho|anga\s|samla|hephazab/i],
  ['mni', /khurumjari|eihak|nahakki|marup|yenshin/i],
  ['kha', /khublei|shublei|jong\s|ka\s+ktien|phi\s|nga\s+dei|nongsumar/i],
  ['lus', /chibai|thiante|engkawltu|hriselna|ka\s+ni\s|inpeih/i],
  ['trp', /kahamba|tongha|nayphirnai|nini\s|ang\s+nini/i],
  ['nag', /apuni|taiyar|laga\s|ami\s+apuni|ase\s/i],
  ['ne',  /tapai|tapai(n)?ko|garnu|garchu|chha\b|jyu\b/i],
  ['as',  /\bmoi\b|apuni|koribo|khelibo|lagibo|baidew|xun\b|mor\b|tumar/i],
  ['bn',  /\bami\b|apni|korbo|koren|din\b|ki\s+korbo/i],
  ['hi',  /maine|mai\s|mujhe|muje|karo|karna|chahiye|nahi|nahin|kya|kaun|koun|dawai|dawa\b|boliye|bolo|aap|tum|mera|meri|hai|hain|tha\b|thi\b|li\b|lee\b|subah|shaam|raat|saans|\bkhel\b|khelo|khelna/i]
];

/**
 * @param {string} text raw utterance (typed or ASR output)
 * @returns {{code: string, script: 'devanagari'|'bengali'|'latin'|'none', confidence: number}}
 */
export function detectLanguage(text = '') {
  const raw = String(text || '');
  const s = raw.trim();
  if (!s) return { code: 'en', script: 'none', confidence: 0 };

  if (DEVANAGARI.test(s)) {
    if (BRX_DEV_MARKERS.test(s)) return { code: 'brx', script: 'devanagari', confidence: 0.9 };
    if (NE_DEV_MARKERS.test(s)) return { code: 'ne', script: 'devanagari', confidence: 0.85 };
    return { code: 'hi', script: 'devanagari', confidence: 0.95 };
  }

  if (BENGALI_SCRIPT.test(s)) {
    if (MNI_BEN_MARKERS.test(s)) return { code: 'mni', script: 'bengali', confidence: 0.85 };
    if (AS_BEN_MARKERS.test(s)) return { code: 'as', script: 'bengali', confidence: 0.9 };
    return { code: 'bn', script: 'bengali', confidence: 0.9 };
  }

  // Roman script: score every language, keep a clear winner.
  let best = null;
  let bestHits = 0;
  let second = 0;
  for (const [code, pattern] of ROMAN_MARKERS) {
    const hits = (s.match(new RegExp(pattern.source, 'gi')) || []).length;
    if (hits > bestHits) {
      second = bestHits;
      bestHits = hits;
      best = code;
    } else if (hits > second) {
      second = hits;
    }
  }

  if (best && bestHits > 0 && bestHits > second) {
    return { code: best, script: 'latin', confidence: Math.min(0.95, 0.55 + bestHits * 0.12) };
  }

  return { code: 'en', script: 'latin', confidence: 0.6 };
}

/** BCP-47 tag for speech synthesis of a reply in `code`. */
export function ttsLocale(code) {
  switch (code) {
    case 'hi': return 'hi-IN';
    case 'as': return 'bn-IN';   // Assamese TTS voices are rare; Eastern Indo-Aryan voice is closest
    case 'bn': return 'bn-IN';
    case 'ne': return 'ne-NP';
    case 'mni': return 'bn-IN';   // Meitei shares the Bengali script & TTS voice
    case 'brx': return 'hi-IN';   // Bodo is Devanagari; Hindi voice is closest
    default: return 'en-IN';
  }
}

export default { detectLanguage, ttsLocale };
