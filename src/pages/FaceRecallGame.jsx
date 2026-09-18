import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { voiceService } from '../services/voiceService.js';
import {
  ArrowLeft,
  Heart,
  Volume2,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ImagePlus,
  RefreshCw,
  Home as HomeIcon,
  Users
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

/**
 * "Who Is This?" — recognition practice using the senior's own family photos.
 *
 * Deliberately different from the other games in this app:
 *
 *  - There is no timer, no score and no losing. Recognition difficulty in
 *    dementia fluctuates hour to hour, and a score would turn a hard morning
 *    into evidence of decline.
 *  - A wrong tap never says "wrong". It gently narrows the choices and offers
 *    the answer, because repeated failure on a relative's face is distressing
 *    rather than motivating (errorless learning).
 *  - The correct answer is always spoken as a full reassuring sentence -
 *    "This is Sunita, your younger daughter" - so the name, the face and the
 *    relationship are rehearsed together.
 */
export default function FaceRecallGame() {
  const navigate = useNavigate();
  const { familyMemories = [], language } = useApp();

  // Only photographed memories can be recognised.
  const playable = useMemo(
    () => familyMemories.filter(m => m.photo),
    [familyMemories]
  );

  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [seen, setSeen] = useState(0);

  const current = playable[index];

  /** Builds three options: the subject plus two other names from their circle. */
  const buildChoices = (target) => {
    if (!target) return [];
    const others = playable
      .filter(m => m.id !== target.id)
      .map(m => m.subject || m.title);

    const unique = [...new Set(others)].sort(() => Math.random() - 0.5).slice(0, 2);
    const answer = target.subject || target.title;
    return [answer, ...unique].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setChoices(buildChoices(current));
    setEliminated([]);
    setRevealed(false);
    setShowHint(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playable.length]);

  const speak = (text) => {
    try { voiceService.speak(text, language); } catch (e) { /* speech optional */ }
  };

  const answerName = current ? (current.subject || current.title) : '';

  const handleChoice = (name) => {
    if (revealed || eliminated.includes(name)) return;

    if (name === answerName) {
      soundService.playSuccessChime();
      setRevealed(true);
      setSeen(s => s + 1);
      speak(current.voiceNote || current.answer || `Yes, this is ${answerName}.`);
      return;
    }

    // Not "wrong" — just quietly take that option away and nudge.
    soundService.playSoftRetry();
    setEliminated(prev => [...prev, name]);
    setShowHint(true);
  };

  /** The senior can always ask to simply be told. */
  const tellMe = () => {
    setRevealed(true);
    setSeen(s => s + 1);
    speak(current.voiceNote || current.answer || `This is ${answerName}.`);
  };

  const next = () => {
    if (index + 1 < playable.length) setIndex(index + 1);
    else setIndex(0);
  };

  /* ---------- Empty state: no photos added yet ---------- */
  if (playable.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-8">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Activities
        </button>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <ImagePlus className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No photos yet</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            This activity uses photos of your own family, your home and the
            places you love. A family member can add them in Memory Lane.
          </p>
          <button
            onClick={() => navigate('/memory-lane')}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition active:scale-[0.98] min-h-[50px]"
          >
            <Heart className="w-4 h-4" /> Open Memory Lane
          </button>
        </div>
      </div>
    );
  }

  const isPlace = current.category === 'Place' || current.isHome;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      <button
        onClick={() => navigate('/games')}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Activities
      </button>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            {isPlace ? 'Do You Know This Place?' : 'Who Is This?'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Take your time. There is no timer and no score.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Photo</p>
          <p className="text-sm font-black text-slate-700">{index + 1} / {playable.length}</p>
        </div>
      </div>

      {/* The photo */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <img
          src={current.photo}
          alt={revealed ? answerName : 'A family photo to recognise'}
          className="w-full aspect-square object-cover bg-slate-100"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/memories/rita.jpg';
          }}
        />

        <div className="p-5 space-y-4">
          {!revealed ? (
            <>
              <p className="text-lg font-black text-slate-900 text-center leading-snug">
                {current.question ||
                  (isPlace ? 'Do you know this place?' : 'Who is this?')}
              </p>

              <div className="space-y-2.5">
                {choices.map(name => {
                  const gone = eliminated.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => handleChoice(name)}
                      disabled={gone}
                      className={`w-full py-5 rounded-2xl border-2 text-lg font-black transition active:scale-[0.98] min-h-[64px] ${
                        gone
                          ? 'bg-slate-50 border-slate-100 text-slate-300 line-through'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-rose-400 hover:bg-rose-50'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Encouragement after a miss — never the word "wrong" */}
              {showHint && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900">
                      Not quite — here is a clue.
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {current.relationship
                        ? `This is your ${String(current.relationship).toLowerCase()}.`
                        : `This is in ${current.location || 'a place you know'}.`}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={tellMe}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-700 font-bold text-sm transition min-h-[50px]"
              >
                Just tell me
              </button>
            </>
          ) : (
            /* Revealed — warm confirmation, never a verdict */
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-2xl font-black text-slate-900">{answerName}</p>
                {current.relationship && (
                  <p className="text-sm font-bold text-rose-600">{current.relationship}</p>
                )}
              </div>

              <p className="text-sm text-slate-600 text-center leading-relaxed">
                {current.voiceNote || current.answer}
              </p>

              {current.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">
                    Something to remember
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{current.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => speak(current.voiceNote || current.answer)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-teal-400 hover:text-teal-700 text-slate-600 font-extrabold text-sm transition min-h-[50px]"
                >
                  <Volume2 className="w-4 h-4" /> Say again
                </button>
                <button
                  onClick={next}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm transition active:scale-[0.98] min-h-[50px]"
                >
                  Next photo <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiet progress — effort, never accuracy */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-slate-600">
            {seen} {seen === 1 ? 'photo' : 'photos'} revisited today
          </span>
        </div>
        <button
          onClick={() => { setIndex(0); setSeen(0); }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition min-h-[40px]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Start over
        </button>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
