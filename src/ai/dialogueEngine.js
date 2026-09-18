/**
 * SmarTCARE Dialogue Engine
 * ============================================================
 * Turns an NLU result + live app state into:
 *   - a warm spoken/printed reply
 *   - an executable action (navigate, mark reminder done, call, ...)
 *   - optional follow-up chips
 *   - an optional pendingSlot when the assistant must ask a question
 *
 * Design rules for this user base:
 *   1. ANSWER FIRST. "Kaunsi medicine li thi?" must be answered in words,
 *      not by dumping the user on the reminders page.
 *   2. Never leave a dead end — always offer the next step.
 *   3. Short sentences, no medical jargon, no diagnosis language.
 *   4. Confirm destructive/stateful actions ("shall I mark it taken?").
 */

import { INTENT, GAME_CATALOG } from './nluEngine.js';
import { TRANSLATIONS } from '../data/translations.js';
import { respondInLanguage } from './dialogueTranslations.js';
import { HOME } from '../data/homeLocation.js';

/* ============================================================
   TIME HELPERS
   ============================================================ */

/** "02:30 PM" -> minutes since midnight. Returns null when unparseable. */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  const m = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const mins = parseInt(m[2], 10);
  const meridiem = (m[3] || '').toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function friendlyClock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** "in 45 minutes" / "2 hours 10 minutes ago" */
function describeGap(targetMins) {
  const diff = targetMins - nowMinutes();
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  let span;
  if (h === 0) span = `${m} minute${m === 1 ? '' : 's'}`;
  else if (m === 0) span = `${h} hour${h === 1 ? '' : 's'}`;
  else span = `${h} hour${h === 1 ? '' : 's'} ${m} minute${m === 1 ? '' : 's'}`;
  return diff >= 0 ? `in ${span}` : `${span} ago`;
}

/* ============================================================
   REMINDER SELECTORS
   ============================================================ */

const MEDICINE_CATEGORIES = ['Medicine'];

/**
 * A spoken hint like "bp" must match a reminder titled "Blood Pressure &
 * Heart Medicine", so each hint maps to the words that actually appear in
 * reminder titles rather than being regex-tested literally.
 */
const MEDICINE_HINT_PATTERNS = {
  bp: /blood\s*pressure|bp|hypertension/i,
  sugar: /sugar|diabet|glucose|metformin/i,
  heart: /heart|cardiac|blood\s*pressure/i,
  vitamin: /vitamin|calcium|supplement|iron/i
};

/** Reminders whose title matches a spoken medicine hint. */
function matchesMedicineHint(reminder, hint) {
  const pattern = MEDICINE_HINT_PATTERNS[hint];
  if (!pattern) return new RegExp(hint, 'i').test(reminder.title || '');
  return pattern.test(reminder.title || '');
}

function isMedicine(reminder) {
  return MEDICINE_CATEGORIES.includes(reminder.category) ||
    /medicine|tablet|pill|dawa/i.test(reminder.title || '');
}

function sortByTime(list) {
  return [...list].sort(
    (a, b) => (parseTimeToMinutes(a.time) ?? 9999) - (parseTimeToMinutes(b.time) ?? 9999)
  );
}

function medicineReminders(reminders) {
  return sortByTime(reminders.filter(isMedicine));
}

function takenMedicines(reminders) {
  return medicineReminders(reminders).filter(r => r.completed);
}

function pendingMedicines(reminders) {
  return medicineReminders(reminders).filter(r => !r.completed);
}

/** Pending items whose scheduled time has already passed. */
function overdueItems(reminders) {
  const now = nowMinutes();
  return sortByTime(reminders.filter(r => {
    if (r.completed) return false;
    const t = parseTimeToMinutes(r.time);
    return t !== null && t < now;
  }));
}

function nextUpcoming(list) {
  const now = nowMinutes();
  const upcoming = sortByTime(list).find(r => {
    const t = parseTimeToMinutes(r.time);
    return !r.completed && t !== null && t >= now;
  });
  // Nothing later today -> fall back to the first pending item at all.
  return upcoming || sortByTime(list).find(r => !r.completed) || null;
}

/** Strip parentheses and trailing detail so speech stays short. */
function shortTitle(title = '') {
  return title.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function listTitles(items, max = 3) {
  const names = items.slice(0, max).map(r => `${shortTitle(r.title)} (${r.time})`);
  const extra = items.length - max;
  let out = names.join(', ');
  if (extra > 0) out += `, and ${extra} more`;
  return out;
}

/* ============================================================
   BILINGUAL REPLY HELPER
   Full dynamic phrasing is authored for English and Hindi — the two
   languages used in the demo. Other supported languages fall back to
   English text while TTS still speaks with their locale voice.
   ============================================================ */

function pick(language, variants) {
  return variants[language] || variants.en;
}

/* ============================================================
   MAIN DIALOGUE RESOLVER
   ============================================================ */

/**
 * @param {object} nlu       result from understand()
 * @param {object} ctx       { reminders, routine, cognitiveProfile, user, role, language, session }
 * @returns {object} { reply, spoken, action, chips, pendingSlot, intent }
 */
export function respond(nlu, ctx = {}) {
  const {
    reminders = [],
    routine = [],
    cognitiveProfile = {},
    user = {},
    role = 'elderly',
    language = 'en'
  } = ctx;

  const L = language;
  const name = (user?.name || 'Asha').split(' ')[0];
  const intent = nlu.intent;
  const ent = nlu.entities || {};

  /* ---------- Answer in the language that was actually spoken ----------
     The engine below writes full English/Hindi dialogue. For the other nine
     supported languages we hand the same live state to the localised
     template table, so an Assamese question gets an Assamese answer instead
     of silently switching to English. */
  if (L !== 'en' && L !== 'hi' && intent && intent !== INTENT.UNKNOWN) {
    const local = buildLocalisedReply(nlu, ctx, L);
    if (local) return local;
  }

  /* ---------- Empty input ---------- */
  if (nlu.empty) {
    return reply({
      text: pick(L, {
        en: "I didn't catch that. You can say “start memory game” or “which medicine did I take?”",
        hi: 'मैं सुन नहीं पाई। आप कह सकते हैं “मेमोरी गेम चालू करो” या “कौन सी दवा ली थी?”'
      }),
      chips: defaultChips(L)
    });
  }

  /* =========================================================
     GAMES
     ========================================================= */

  if (intent === INTENT.GAME_START) {
    const game = ent.game;

    if (!game) {
      // "game khelna hai" — they want to play but didn't say which.
      const suggested = recommendGame(cognitiveProfile);
      return reply({
        text: pick(L, {
          en: `Let's play, ${name}! I suggest ${suggested.label}. Shall I start it, or would you like a different game?`,
          hi: `चलिए खेलते हैं, ${name} जी! मेरा सुझाव है ${suggested.labelHi}। इसे शुरू करूँ या कोई और खेल?`
        }),
        action: { type: 'NAVIGATE', route: suggested.route, autostart: true, label: `Start ${suggested.label}`, delay: 1200 },
        chips: Object.values(GAME_CATALOG).slice(0, 4).map(g => ({
          label: g.label,
          cmd: `start ${g.id} game`
        })),
        pendingSlot: { type: 'CHOOSE_GAME' }
      });
    }

    return reply({
      text: pick(L, {
        en: `Opening ${game.label} for you, ${name}. Take your time — there is no rush.`,
        hi: `${game.labelHi} खोल रही हूँ, ${name} जी। आराम से खेलिए, कोई जल्दी नहीं है।`
      }),
      spoken: pick(L, {
        en: `Starting ${game.label}. Take your time.`,
        hi: `${game.labelHi} शुरू कर रही हूँ। आराम से खेलिए।`
      }),
      action: { type: 'NAVIGATE', route: game.route, autostart: true, label: `Open ${game.label}` }
    });
  }

  if (intent === INTENT.GAME_RECOMMEND) {
    const suggested = recommendGame(cognitiveProfile);
    const level = cognitiveProfile?.difficultyLevel || 'Moderate';
    return reply({
      text: pick(L, {
        en: `Today I suggest ${suggested.label}. It matches your current ${level} comfort level. Shall we begin?`,
        hi: `आज मेरा सुझाव है ${suggested.labelHi}। यह आपके ${level} स्तर के अनुकूल है। शुरू करें?`
      }),
      action: { type: 'NAVIGATE', route: suggested.route, autostart: true, label: `Start ${suggested.label}`, delay: 1400 },
      chips: [
        { label: '▶️ Yes, start it', cmd: `start ${suggested.id} game` },
        { label: '🎲 Show all games', cmd: 'show all games' }
      ]
    });
  }

  if (intent === INTENT.GAME_LIST) {
    return reply({
      text: pick(L, {
        en: 'Here are your activities. Tap any one, or tell me which to start.',
        hi: 'ये रहे आपके खेल। किसी पर टैप करें, या बताइए कौन सा शुरू करूँ।'
      }),
      action: { type: 'NAVIGATE', route: '/games', autostart: false, label: 'Open Activities' },
      chips: Object.values(GAME_CATALOG).slice(0, 4).map(g => ({ label: g.label, cmd: `start ${g.id} game` }))
    });
  }

  /* =========================================================
     MEDICINE — questions answered in words
     ========================================================= */

  if (intent === INTENT.MED_WHICH_TAKEN) {
    const taken = takenMedicines(reminders);
    if (taken.length === 0) {
      const pend = pendingMedicines(reminders);
      return reply({
        text: pick(L, {
          en: `You haven't marked any medicine as taken yet today.${pend.length ? ` Your next one is ${shortTitle(pend[0].title)} at ${pend[0].time}.` : ''}`,
          hi: `आज अभी तक कोई दवा ली हुई दर्ज नहीं है।${pend.length ? ` अगली दवा है ${shortTitle(pend[0].title)}, ${pend[0].time} बजे।` : ''}`
        }),
        chips: pend.length ? [{ label: `✅ I took ${shortTitle(pend[0].title)}`, cmd: `I took ${shortTitle(pend[0].title)}` }] : [],
        action: { type: 'NAVIGATE', route: '/reminders', autostart: false, label: 'Open Reminders', delay: 2600 }
      });
    }
    return reply({
      text: pick(L, {
        en: `You have taken ${taken.length} medicine${taken.length === 1 ? '' : 's'} today: ${listTitles(taken)}. Well done, ${name}.`,
        hi: `आपने आज ${taken.length} दवा ली है: ${listTitles(taken)}। बहुत अच्छा, ${name} जी।`
      }),
      chips: [
        { label: '⏰ What is still pending?', cmd: 'which medicine is pending' },
        { label: '💊 Next medicine', cmd: 'when is my next medicine' }
      ]
    });
  }

  if (intent === INTENT.MED_DID_I_TAKE) {
    const hint = ent.medicineHint;
    const meds = medicineReminders(reminders);
    let target = null;

    if (hint) {
      target = meds.find(r => matchesMedicineHint(r, hint));
    }
    if (!target && ent.timeOfDay) {
      target = meds.find(r => matchesTimeOfDay(r.time, ent.timeOfDay));
    }
    if (!target) target = meds[0];

    if (!target) {
      return reply({
        text: pick(L, {
          en: 'I could not find any medicine in your list today.',
          hi: 'आज की सूची में कोई दवा नहीं मिली।'
        })
      });
    }

    if (target.completed) {
      return reply({
        text: pick(L, {
          en: `Yes ${name}, ${shortTitle(target.title)} (${target.time}) is already marked as taken. Nothing to worry about.`,
          hi: `हाँ ${name} जी, ${shortTitle(target.title)} (${target.time}) ली हुई दर्ज है। चिंता की कोई बात नहीं।`
        }),
        chips: [{ label: '💊 What is pending?', cmd: 'which medicine is pending' }]
      });
    }

    return reply({
      text: pick(L, {
        en: `${shortTitle(target.title)} (${target.time}) is not marked yet. Have you taken it? I can mark it for you.`,
        hi: `${shortTitle(target.title)} (${target.time}) अभी दर्ज नहीं है। क्या आपने ले ली? मैं दर्ज कर दूँ?`
      }),
      chips: [
        { label: '✅ Yes, I took it', cmd: 'yes' },
        { label: '❌ Not yet', cmd: 'no' }
      ],
      pendingSlot: { type: 'CONFIRM_MED_TAKEN', reminderId: target.id }
    });
  }

  if (intent === INTENT.MED_MARK_TAKEN) {
    // Slot-resolved path: the reminder is already decided.
    if (ent.reminderId) {
      const target = reminders.find(r => r.id === ent.reminderId);
      if (target && !target.completed) {
        return reply({
          text: pick(L, {
            en: `Marked ${shortTitle(target.title)} as taken. Well done, ${name}!`,
            hi: `${shortTitle(target.title)} ली हुई दर्ज कर दी। बहुत अच्छा, ${name} जी!`
          }),
          action: { type: 'COMPLETE_REMINDER', reminderId: target.id, label: 'Marked done' },
          chips: [{ label: '💊 Next medicine', cmd: 'when is my next medicine' }]
        });
      }
      return reply({
        text: pick(L, {
          en: 'That one is already marked as taken.',
          hi: 'वह पहले से ली हुई दर्ज है।'
        })
      });
    }

    const pend = pendingMedicines(reminders);
    const hint = ent.medicineHint;
    const tod = ent.timeOfDay;

    // The user named a specific medicine (e.g. "BP ki dawai"). If that exact
    // one is already marked, say so instead of silently marking a different
    // medicine — getting this wrong on a medical item is not acceptable.
    if (hint) {
      const named = medicineReminders(reminders).filter(r => matchesMedicineHint(r, hint));
      const namedPending = named.filter(r => !r.completed);
      if (named.length > 0 && namedPending.length === 0) {
        const already = named[0];
        return reply({
          text: pick(L, {
            en: `${shortTitle(already.title)} (${already.time}) was already marked as taken, ${name}. Nothing more to do for that one.`,
            hi: `${shortTitle(already.title)} (${already.time}) पहले से ली हुई दर्ज है, ${name} जी। उसके लिए कुछ और करने की ज़रूरत नहीं।`
          }),
          chips: pend.length
            ? [{ label: `⏳ ${shortTitle(pend[0].title)} pending`, cmd: 'when is my next medicine' }]
            : []
        });
      }
    }

    let candidates = pend;
    if (hint) {
      const filtered = pend.filter(r => matchesMedicineHint(r, hint));
      if (filtered.length) candidates = filtered;
    }
    if (tod) {
      const filtered = candidates.filter(r => matchesTimeOfDay(r.time, tod));
      if (filtered.length) candidates = filtered;
    }

    if (candidates.length === 0) {
      const taken = takenMedicines(reminders);
      return reply({
        text: pick(L, {
          en: `All your medicines are already marked as taken today${taken.length ? ` (${listTitles(taken)})` : ''}. Nothing pending.`,
          hi: `आज की सारी दवाइयाँ ली हुई दर्ज हैं${taken.length ? ` (${listTitles(taken)})` : ''}। कुछ बाकी नहीं।`
        })
      });
    }

    if (candidates.length === 1) {
      const target = candidates[0];
      return reply({
        text: pick(L, {
          en: `Good. I have marked ${shortTitle(target.title)} (${target.time}) as taken. Well done, ${name}!`,
          hi: `बहुत अच्छा। ${shortTitle(target.title)} (${target.time}) ली हुई दर्ज कर दी, ${name} जी!`
        }),
        spoken: pick(L, {
          en: `Marked ${shortTitle(target.title)} as taken. Well done.`,
          hi: `${shortTitle(target.title)} दर्ज कर दी। बहुत अच्छा।`
        }),
        action: { type: 'COMPLETE_REMINDER', reminderId: target.id, label: 'Marked done' },
        chips: [{ label: '💊 What is next?', cmd: 'when is my next medicine' }]
      });
    }

    // Ambiguous — ask rather than guess wrong on a medical item.
    return reply({
      text: pick(L, {
        en: `Which one did you take? ${candidates.slice(0, 3).map((r, i) => `${i + 1}. ${shortTitle(r.title)} (${r.time})`).join('  ')}`,
        hi: `कौन सी ली? ${candidates.slice(0, 3).map((r, i) => `${i + 1}. ${shortTitle(r.title)} (${r.time})`).join('  ')}`
      }),
      chips: candidates.slice(0, 3).map(r => ({
        label: `✅ ${shortTitle(r.title)}`,
        cmd: `I took ${shortTitle(r.title)}`
      })),
      pendingSlot: { type: 'CHOOSE_MEDICINE', options: candidates.slice(0, 3) }
    });
  }

  if (intent === INTENT.MED_NEXT) {
    const next = nextUpcoming(medicineReminders(reminders));
    if (!next) {
      return reply({
        text: pick(L, {
          en: 'No medicine is pending right now. Everything is done for today.',
          hi: 'अभी कोई दवा बाकी नहीं है। आज सब पूरा हो गया।'
        })
      });
    }
    const t = parseTimeToMinutes(next.time);
    const gap = t !== null ? describeGap(t) : '';
    return reply({
      text: pick(L, {
        en: `Your next medicine is ${shortTitle(next.title)} at ${next.time}${gap ? ` — that is ${gap}` : ''}.${next.notes ? ` Note: ${next.notes}.` : ''}`,
        hi: `अगली दवा है ${shortTitle(next.title)}, ${next.time} बजे।${next.notes ? ` ध्यान रहे: ${next.notes}।` : ''}`
      }),
      spoken: pick(L, {
        en: `Your next medicine is ${shortTitle(next.title)} at ${next.time}.`,
        hi: `अगली दवा है ${shortTitle(next.title)}, ${next.time} बजे।`
      }),
      chips: [
        { label: `✅ I took it`, cmd: `I took ${shortTitle(next.title)}` },
        { label: '📋 All reminders', cmd: 'show my reminders' }
      ]
    });
  }

  if (intent === INTENT.MED_LIST_TODAY) {
    const meds = medicineReminders(reminders);
    if (meds.length === 0) {
      return reply({
        text: pick(L, { en: 'There are no medicines in your list today.', hi: 'आज की सूची में कोई दवा नहीं है।' })
      });
    }
    const taken = meds.filter(r => r.completed);
    const pend = meds.filter(r => !r.completed);
    const lines = meds.map(r => `${r.completed ? '✅' : '⏳'} ${shortTitle(r.title)} — ${r.time}`).join('\n');
    return reply({
      text: pick(L, {
        en: `You have ${meds.length} medicine${meds.length === 1 ? '' : 's'} today — ${taken.length} taken, ${pend.length} pending:\n${lines}`,
        hi: `आज ${meds.length} दवाइयाँ हैं — ${taken.length} ली गईं, ${pend.length} बाकी:\n${lines}`
      }),
      spoken: pick(L, {
        en: `You have ${meds.length} medicines today. ${taken.length} taken and ${pend.length} pending.`,
        hi: `आज ${meds.length} दवाइयाँ हैं। ${taken.length} ली गईं और ${pend.length} बाकी हैं।`
      }),
      chips: pend.length ? [{ label: `✅ I took ${shortTitle(pend[0].title)}`, cmd: `I took ${shortTitle(pend[0].title)}` }] : [],
      action: { type: 'NAVIGATE', route: '/reminders', autostart: false, label: 'Open Reminders', delay: 3000 }
    });
  }

  if (intent === INTENT.MED_MISSED) {
    const overdue = overdueItems(reminders).filter(isMedicine);
    if (overdue.length === 0) {
      return reply({
        text: pick(L, {
          en: `Nothing is missed, ${name}. You are on track today.`,
          hi: `कुछ भी छूटा नहीं, ${name} जी। आज सब ठीक चल रहा है।`
        })
      });
    }
    return reply({
      text: pick(L, {
        en: `${overdue.length} item${overdue.length === 1 ? ' is' : 's are'} still pending from earlier: ${listTitles(overdue)}. No worry — you can take it now and I will mark it.`,
        hi: `${overdue.length} दवा अभी बाकी है: ${listTitles(overdue)}। चिंता मत कीजिए — अभी ले लीजिए, मैं दर्ज कर दूँगी।`
      }),
      chips: overdue.slice(0, 2).map(r => ({ label: `✅ ${shortTitle(r.title)}`, cmd: `I took ${shortTitle(r.title)}` }))
    });
  }

  /* =========================================================
     REMINDERS & ROUTINE
     ========================================================= */

  if (intent === INTENT.REMINDER_NEXT) {
    const next = nextUpcoming(reminders);
    if (!next) {
      return reply({
        text: pick(L, { en: 'Nothing pending — you are all caught up!', hi: 'कुछ बाकी नहीं — सब पूरा हो गया!' })
      });
    }
    const t = parseTimeToMinutes(next.time);
    return reply({
      text: pick(L, {
        en: `Next up: ${shortTitle(next.title)} at ${next.time}${t !== null ? ` (${describeGap(t)})` : ''}.`,
        hi: `अगला काम: ${shortTitle(next.title)}, ${next.time} बजे।`
      }),
      chips: [{ label: '📋 All reminders', cmd: 'show my reminders' }]
    });
  }

  if (intent === INTENT.REMINDER_LIST) {
    const pend = sortByTime(reminders.filter(r => !r.completed));
    const done = reminders.filter(r => r.completed).length;
    return reply({
      text: pick(L, {
        en: pend.length
          ? `You have ${pend.length} pending and ${done} completed today. Pending: ${listTitles(pend, 4)}.`
          : `Everything is completed today, ${name}. Wonderful!`,
        hi: pend.length
          ? `आज ${pend.length} काम बाकी हैं और ${done} पूरे हुए। बाकी: ${listTitles(pend, 4)}।`
          : `आज सब पूरा हो गया, ${name} जी। बहुत बढ़िया!`
      }),
      action: { type: 'NAVIGATE', route: '/reminders', autostart: false, readAloud: false, label: 'Open Reminders', delay: 2600 }
    });
  }

  if (intent === INTENT.REMINDER_ADD) {
    return reply({
      text: pick(L, {
        en: 'Let me open Reminders so you can add a new one.',
        hi: 'रिमाइंडर खोल रही हूँ, वहाँ नया जोड़ सकते हैं।'
      }),
      action: { type: 'NAVIGATE', route: '/reminders', autostart: false, label: 'Open Reminders' }
    });
  }

  if (intent === INTENT.ROUTINE_NEXT) {
    const next = routine.find(r => !r.done);
    if (!next) {
      return reply({
        text: pick(L, { en: 'Your whole routine is complete today. Well done!', hi: 'आज की पूरी दिनचर्या पूरी हो गई। बहुत अच्छा!' })
      });
    }
    return reply({
      text: pick(L, {
        en: `Next in your routine: ${next.label} at ${next.time}.`,
        hi: `दिनचर्या में अगला: ${next.label}, ${next.time} बजे।`
      }),
      action: { type: 'NAVIGATE', route: '/routine', autostart: false, label: 'Open Routine', delay: 2600 }
    });
  }

  if (intent === INTENT.ROUTINE_TODAY) {
    const done = routine.filter(r => r.done).length;
    return reply({
      text: pick(L, {
        en: `You have completed ${done} of ${routine.length} routine steps today. Opening your routine.`,
        hi: `आज ${routine.length} में से ${done} काम पूरे हुए। दिनचर्या खोल रही हूँ।`
      }),
      action: { type: 'NAVIGATE', route: '/routine', autostart: false, label: 'Open Routine' }
    });
  }

  /* =========================================================
     WELL-BEING
     ========================================================= */

  if (intent === INTENT.BREATHING_START) {
    return reply({
      text: pick(L, {
        en: `Let's breathe together, ${name}. Four seconds in, hold two, out for six. Starting now.`,
        hi: `चलिए साथ में साँस लेते हैं, ${name} जी। चार सेकंड अंदर, दो रोकें, छह बाहर। शुरू कर रही हूँ।`
      }),
      spoken: pick(L, { en: "Let's breathe together. Starting now.", hi: 'चलिए साथ में साँस लेते हैं।' }),
      action: { type: 'NAVIGATE', route: '/breathing', autostart: true, label: 'Start Breathing' }
    });
  }

  if (intent === INTENT.GROUNDING_START) {
    return reply({
      text: pick(L, {
        en: "Let's ground ourselves gently — five things you can see, four you can touch. Opening now.",
        hi: 'चलिए शांत होते हैं — पाँच चीज़ें जो दिखें, चार जो छू सकें। खोल रही हूँ।'
      }),
      action: { type: 'NAVIGATE', route: '/grounding', autostart: true, label: 'Start Grounding' }
    });
  }

  if (intent === INTENT.WELLBEING_OPEN) {
    return reply({
      text: pick(L, { en: 'Opening your well-being centre.', hi: 'आपका स्वास्थ्य केंद्र खोल रही हूँ।' }),
      action: { type: 'NAVIGATE', route: '/wellbeing', autostart: false, label: 'Open Well-being' }
    });
  }

  /* =========================================================
     PROGRESS
     ========================================================= */

  if (intent === INTENT.PROGRESS_QUERY) {
    const score = cognitiveProfile?.overallScore;
    const trend = cognitiveProfile?.recentTrend || 'Stable activity';
    const level = cognitiveProfile?.difficultyLevel || 'Moderate';
    return reply({
      text: pick(L, {
        en: `You are doing nicely, ${name}. Your activity score is ${score ?? '—'} with a ${trend.toLowerCase()} pattern, and you are playing at the ${level} level. These are engagement indicators only — not a medical result.`,
        hi: `आप अच्छा कर रही हैं, ${name} जी। आपका स्कोर ${score ?? '—'} है और स्तर ${level} है। यह केवल गतिविधि का संकेत है, कोई चिकित्सा नतीजा नहीं।`
      }),
      spoken: pick(L, {
        en: `You are doing nicely. Your activity score is ${score ?? 'steady'} and your pattern is ${trend.toLowerCase()}.`,
        hi: `आप अच्छा कर रही हैं। आपका स्कोर ${score ?? 'स्थिर'} है।`
      }),
      action: { type: 'NAVIGATE', route: '/profile', autostart: false, label: 'Open Progress', delay: 3200 }
    });
  }

  if (intent === INTENT.PROFILE_OPEN) {
    return reply({
      text: pick(L, { en: 'Opening your profile.', hi: 'आपकी प्रोफ़ाइल खोल रही हूँ।' }),
      action: { type: 'NAVIGATE', route: '/profile', autostart: false, label: 'Open Profile' }
    });
  }

  /* =========================================================
     PEOPLE
     ========================================================= */

  if (intent === INTENT.CALL_CAREGIVER) {
    const cg = user?.caregiver || { name: 'Sunita Sharma', phone: '+91 98640 12345' };
    return reply({
      text: pick(L, {
        en: `Calling ${cg.name} for you now.`,
        hi: `${cg.name} को अभी फोन लगा रही हूँ।`
      }),
      action: { type: 'CALL', contact: cg.name, phone: cg.phone, label: `Call ${cg.name}` }
    });
  }

  if (intent === INTENT.CALL_DOCTOR) {
    const hw = user?.healthcareWorker || { name: 'Dr. B. K. Barua', contact: '+91 94350 56789' };
    return reply({
      text: pick(L, {
        en: `Connecting you to ${hw.name}.`,
        hi: `${hw.name} से जोड़ रही हूँ।`
      }),
      action: { type: 'CALL', contact: hw.name, phone: hw.contact, label: `Call ${hw.name}` }
    });
  }

  if (intent === INTENT.MEMORY_LANE) {
    return reply({
      text: pick(L, {
        en: 'Opening your family photos. These are lovely memories.',
        hi: 'आपके परिवार की तस्वीरें खोल रही हूँ। बहुत प्यारी यादें हैं।'
      }),
      action: { type: 'NAVIGATE', route: '/memory-lane', autostart: false, label: 'Open Memory Lane' }
    });
  }

  /* =========================================================
     NAVIGATION & CHIT-CHAT
     ========================================================= */

  /* ---------- WAYFINDING: "mera ghar kaha hai?" ----------
     A lost resident needs reassurance before directions. Answer in words,
     then open the find-home page with the photo, landmarks and live map. */
  if (intent === INTENT.WAYFIND_HOME) {
    return reply({
      text: pick(L, {
        en: `You are safe, ${name}. Your home is ${HOME.address}. I am opening your home photo and the map with the way home.`,
        hi: `आप सुरक्षित हैं, ${name} जी। आपका घर यहाँ है: ${HOME.address}। मैं घर की फोटो और रास्ते का नक्शा खोल रही हूँ।`
      }),
      spoken: pick(L, {
        en: `Do not worry, ${name}. You are safe. I am showing your home and the way to reach it.`,
        hi: `घबराइए मत, ${name} जी। आप सुरक्षित हैं। मैं आपका घर और वहाँ पहुँचने का रास्ता दिखा रही हूँ।`
      }),
      action: { type: 'NAVIGATE', route: '/find-home', autostart: false, readAloud: true, label: 'Find My Home', delay: 700 },
      chips: [
        { label: '📞 Call Sunita', cmd: 'call my daughter' },
        { label: '🏠 Show my home again', cmd: 'mera ghar kaha hai' }
      ]
    });
  }

  if (intent === INTENT.GO_HOME) {
    return reply({
      text: pick(L, { en: 'Going to your home screen.', hi: 'होम स्क्रीन पर ले जा रही हूँ।' }),
      action: { type: 'NAVIGATE', route: '/elderly', autostart: false, label: 'Go Home' }
    });
  }

  if (intent === INTENT.TIME_QUERY) {
    const next = nextUpcoming(reminders);
    return reply({
      text: pick(L, {
        en: `It is ${friendlyClock()} right now.${next ? ` Your next item is ${shortTitle(next.title)} at ${next.time}.` : ''}`,
        hi: `अभी ${friendlyClock()} बजे हैं।${next ? ` अगला काम ${shortTitle(next.title)}, ${next.time} बजे।` : ''}`
      })
    });
  }

  if (intent === INTENT.GREETING) {
    const pend = pendingMedicines(reminders);
    return reply({
      text: pick(L, {
        en: `Hello ${name}! Good to hear you.${pend.length ? ` You have ${pend.length} medicine${pend.length === 1 ? '' : 's'} pending today.` : ' Everything is on track today.'} What would you like to do?`,
        hi: `नमस्ते ${name} जी! आपकी आवाज़ सुनकर अच्छा लगा।${pend.length ? ` आज ${pend.length} दवा बाकी है।` : ' आज सब ठीक है।'} क्या करना चाहेंगी?`
      }),
      chips: defaultChips(L)
    });
  }

  if (intent === INTENT.THANKS) {
    return reply({
      text: pick(L, {
        en: `You are most welcome, ${name}. I am always here.`,
        hi: `आपका स्वागत है, ${name} जी। मैं हमेशा यहीं हूँ।`
      })
    });
  }

  if (intent === INTENT.WHO_ARE_YOU) {
    return reply({
      text: pick(L, {
        en: `I am your SmarTCARE companion, ${name}. I help you with games, medicine reminders, breathing and calling family. I do not diagnose anything — I am here to keep you company.`,
        hi: `मैं आपकी स्मार्टकेयर साथी हूँ, ${name} जी। खेल, दवा, साँस के अभ्यास और परिवार को फोन करने में मदद करती हूँ।`
      }),
      chips: defaultChips(L)
    });
  }

  if (intent === INTENT.HELP) {
    return reply({
      text: pick(L, {
        en: 'You can say things like:\n• “Game khelna hai” or “start memory game”\n• “Kaunsi medicine li thi?”\n• “Maine BP ki dawai kha li”\n• “Agli dawai kab hai?”\n• “Saans ka abhyas shuru karo”\n• “Beti ko phone karo”',
        hi: 'आप ऐसे कह सकती हैं:\n• “गेम खेलना है” या “मेमोरी गेम चालू करो”\n• “कौन सी दवा ली थी?”\n• “मैंने बीपी की दवाई खा ली”\n• “अगली दवाई कब है?”\n• “साँस का अभ्यास शुरू करो”\n• “बेटी को फोन करो”'
      }),
      chips: defaultChips(L)
    });
  }

  if (intent === INTENT.STOP) {
    return reply({
      text: pick(L, { en: 'Alright, stopping. Tap the microphone whenever you need me.', hi: 'ठीक है, रोक रही हूँ। जब ज़रूरत हो माइक दबाइए।' }),
      action: { type: 'STOP_SPEAKING' }
    });
  }

  if (intent === INTENT.AFFIRM) {
    return reply({
      text: pick(L, { en: 'Okay! What would you like to do?', hi: 'ठीक है! क्या करना चाहेंगी?' }),
      chips: defaultChips(L)
    });
  }

  if (intent === INTENT.DENY) {
    return reply({
      text: pick(L, {
        en: 'No problem. I will leave it as it is. Tell me if you need anything else.',
        hi: 'कोई बात नहीं। वैसे ही रहने देती हूँ। और कुछ चाहिए तो बताइए।'
      }),
      chips: defaultChips(L)
    });
  }

  /* =========================================================
     FALLBACK — never a dead end
     ========================================================= */

  return reply({
    text: pick(L, {
      en: `Sorry ${name}, I did not quite understand that. You can ask me about your medicines, start a game, or begin a breathing exercise.`,
      hi: `माफ़ कीजिए ${name} जी, मैं समझ नहीं पाई। आप दवा के बारे में पूछ सकती हैं, खेल शुरू कर सकती हैं, या साँस का अभ्यास कर सकती हैं।`
    }),
    chips: defaultChips(L),
    lowConfidence: true
  });
}

/* ============================================================
   SUPPORT
   ============================================================ */

function matchesTimeOfDay(timeStr, tod) {
  const t = parseTimeToMinutes(timeStr);
  if (t === null) return false;
  if (tod === 'morning') return t >= 240 && t < 720;      // 04:00–12:00
  if (tod === 'afternoon') return t >= 720 && t < 1020;   // 12:00–17:00
  if (tod === 'evening') return t >= 1020 && t < 1260;    // 17:00–21:00
  if (tod === 'night') return t >= 1260 || t < 240;       // 21:00–04:00
  return false;
}

/** Pick a game that suits the user's weakest recent metric. */
function recommendGame(profile) {
  const m = profile?.metrics || {};
  const ranked = [
    { key: 'memory', value: m.memory ?? 80, game: GAME_CATALOG.memory },
    { key: 'attention', value: m.attention ?? 80, game: GAME_CATALOG.attention },
    { key: 'pattern', value: m.pattern ?? 80, game: GAME_CATALOG.pattern },
    { key: 'dailyRecall', value: m.dailyRecall ?? 80, game: GAME_CATALOG['daily-recall'] }
  ].sort((a, b) => a.value - b.value);
  return ranked[0].game;
}

function defaultChips(L) {
  const dict = (TRANSLATIONS[L] || {});
  const label = (key) => dict[key] || TRANSLATIONS.en[key];
  return [
    { label: `🎮 ${label('chip_play')}`, cmd: 'game khelna hai' },
    { label: `💊 ${label('chip_med_taken')}`, cmd: 'which medicine did I take' },
    { label: `⏰ ${label('chip_med_next')}`, cmd: 'when is my next medicine' },
    { label: `🫁 ${label('chip_breath')}`, cmd: 'start breathing' },
    { label: `🏠 ${label('chip_home')}`, cmd: 'mera ghar kaha hai' }
  ];
}

/** Normalise a partial reply object into the full shape. */
/**
 * Computes the live facts (what was taken, what is pending, what is next,
 * which game to suggest) once, then asks the localised template table for
 * a reply in `lang`. Also re-attaches the action the English/Hindi path
 * would have produced, so a localised "start memory game" still opens it.
 */
function buildLocalisedReply(nlu, ctx, lang) {
  const { reminders = [], cognitiveProfile = {}, user = {} } = ctx;
  const ent = nlu.entities || {};

  const meds = medicineReminders(reminders);
  const taken = takenMedicines(reminders);
  const pend = pendingMedicines(reminders);
  const next = nextUpcoming(pend) || pend[0] || null;
  const suggested = ent.game || recommendGame(cognitiveProfile);

  let targetCompleted = null;
  let focusTitle = next ? shortTitle(next.title) : '';
  let focusTime = next ? next.time : '';

  // For wayfinding the "focus" of the sentence is the home address itself.
  if (nlu.intent === INTENT.WAYFIND_HOME) {
    focusTitle = HOME.address;
    focusTime = '';
  }

  if (nlu.intent === INTENT.MED_DID_I_TAKE) {
    let target = ent.medicineHint ? meds.find(r => matchesMedicineHint(r, ent.medicineHint)) : null;
    if (!target && ent.timeOfDay) target = meds.find(r => matchesTimeOfDay(r.time, ent.timeOfDay));
    if (!target) target = meds[0];
    if (target) {
      targetCompleted = Boolean(target.completed);
      focusTitle = shortTitle(target.title);
      focusTime = target.time;
    }
  }

  const local = respondInLanguage(nlu, {
    user,
    targetCompleted,
    locals: {
      takenList: listTitles(taken),
      takenCount: taken.length,
      pendingList: listTitles(pend),
      pendingCount: pend.length,
      nextTitle: focusTitle,
      nextTime: focusTime,
      gameLabel: suggested ? suggested.label : ''
    }
  }, lang);

  if (!local) return null;

  // Keep stateful actions working in every language.
  if (nlu.intent === INTENT.GAME_START && suggested) {
    local.action = {
      type: 'NAVIGATE',
      route: suggested.route,
      autostart: true,
      label: `Open ${suggested.label}`
    };
  }
  if (nlu.intent === INTENT.BREATHING_START) {
    local.action = { type: 'NAVIGATE', route: '/breathing', autostart: true, label: 'Start Breathing' };
  }
  if (nlu.intent === INTENT.GROUNDING_START) {
    local.action = { type: 'NAVIGATE', route: '/grounding', autostart: true, label: 'Start Grounding' };
  }

  return reply({
    text: local.reply,
    spoken: local.spoken,
    action: local.action,
    chips: local.chips,
    pendingSlot: local.pendingSlot
  });
}

function reply({ text, spoken, action = null, chips = [], pendingSlot = null, lowConfidence = false }) {
  return {
    reply: text,
    spoken: spoken || text.replace(/[•✅⏳🎮💊⏰🫁📋▶️🎲❌]/g, '').replace(/\n+/g, '. ').trim(),
    action,
    chips,
    pendingSlot,
    lowConfidence
  };
}

export default { respond, parseTimeToMinutes };
