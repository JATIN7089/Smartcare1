import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import { soundService } from '../services/soundService.js';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  RotateCcw,
  Wind,
  Volume2,
  VolumeX,
  CheckCircle2,
  Home,
  Sparkles
} from 'lucide-react';

const CYCLE_CONFIG = {
  inhale: 4,
  hold: 2,
  exhale: 6
};

const PHASE_ORDER = { inhale: 'hold', hold: 'exhale', exhale: 'inhale' };

/** Visual + copy treatment for each phase of the 4-2-6 rhythm. */
const PHASE_STYLE = {
  inhale: {
    label: 'Breathe In',
    hint: 'Slowly through your nose',
    ring: 'border-teal-400',
    glow: 'shadow-[0_0_70px_-10px_rgba(13,148,136,0.55)]',
    fill: 'from-teal-300/70 to-emerald-200/70',
    text: 'text-teal-900',
    chip: 'bg-teal-600'
  },
  hold: {
    label: 'Hold',
    hint: 'Stay relaxed',
    ring: 'border-sky-400',
    glow: 'shadow-[0_0_70px_-10px_rgba(56,189,248,0.55)]',
    fill: 'from-sky-300/70 to-cyan-200/70',
    text: 'text-sky-900',
    chip: 'bg-sky-600'
  },
  exhale: {
    label: 'Breathe Out',
    hint: 'Gently through your mouth',
    ring: 'border-indigo-400',
    glow: 'shadow-[0_0_70px_-10px_rgba(129,140,248,0.5)]',
    fill: 'from-indigo-300/70 to-violet-200/70',
    text: 'text-indigo-900',
    chip: 'bg-indigo-600'
  }
};

export default function BreathingPacerPage() {
  const { handleRecordBreathing, accessibility, language, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [presetMinutes, setPresetMinutes] = useState(2);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [phaseTimer, setPhaseTimer] = useState(CYCLE_CONFIG.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [autoStartedBadge, setAutoStartedBadge] = useState(false);

  const timerRef = useRef(null);
  const finishedRef = useRef(false);

  // Latest values for the interval callback, so the ticking effect can depend
  // only on `isActive`. Previously it also depended on `phase`, which tore down
  // and recreated the interval on every phase change and dropped a second.
  const stateRef = useRef({ phase, voiceGuidance, presetMinutes });
  useEffect(() => {
    stateRef.current = { phase, voiceGuidance, presetMinutes };
  }, [phase, voiceGuidance, presetMinutes]);

  const speakGuidance = useCallback((text) => {
    if (stateRef.current.voiceGuidance && accessibility.voiceEnabled) {
      voiceService.speak(text, language);
    }
  }, [accessibility.voiceEnabled, language]);

  const finishSession = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    clearInterval(timerRef.current);
    setIsActive(false);
    setSessionCompleted(true);
    voiceService.stopSpeaking();

    try { soundService.playSingingBowl(); } catch (e) {}
    try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

    setTotalSecondsElapsed(prevSeconds => {
      setCyclesCompleted(prevCycles => {
        handleRecordBreathing({
          preset: `${stateRef.current.presetMinutes} min`,
          durationSeconds: prevSeconds || 0,
          cyclesCompleted: prevCycles,
          pace: '4-2-6'
        });
        return prevCycles;
      });
      return prevSeconds;
    });
  }, [handleRecordBreathing]);

  /* ---------------- Core ticking loop ---------------- */
  useEffect(() => {
    if (!isActive) return undefined;

    timerRef.current = setInterval(() => {
      // 1. Advance overall elapsed time and stop when the preset is reached.
      setTotalSecondsElapsed(prev => {
        const next = prev + 1;
        if (next >= stateRef.current.presetMinutes * 60) {
          finishSession();
        }
        return next;
      });

      // 2. Advance the phase countdown.
      setPhaseTimer(prev => {
        if (prev > 1) return prev - 1;

        const current = stateRef.current.phase;
        const nextPhase = PHASE_ORDER[current];

        if (current === 'exhale') {
          setCyclesCompleted(c => c + 1);
          try { soundService.playSingingBowl(); } catch (e) {}
        }

        setPhase(nextPhase);
        stateRef.current.phase = nextPhase;

        if (nextPhase === 'inhale') speakGuidance(t('inhale_slowly', 'Breathe in.'));
        else if (nextPhase === 'hold') speakGuidance(t('hold_gently', 'Hold.'));
        else speakGuidance(t('exhale_gently', 'Breathe out.'));

        return CYCLE_CONFIG[nextPhase];
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, finishSession, speakGuidance, t]);

  /* ---------------- Controls ---------------- */
  const startSession = useCallback(() => {
    finishedRef.current = false;
    setSessionCompleted(false);
    setPhase('inhale');
    stateRef.current.phase = 'inhale';
    setPhaseTimer(CYCLE_CONFIG.inhale);
    setIsActive(true);
    try { soundService.playSingingBowl(); } catch (e) {}
    speakGuidance(t('inhale_slowly', 'Breathe in slowly through your nose.'));
  }, [speakGuidance, t]);

  const pauseSession = () => {
    setIsActive(false);
    voiceService.stopSpeaking();
  };

  const resumeSession = () => setIsActive(true);

  const resetSession = () => {
    finishedRef.current = false;
    clearInterval(timerRef.current);
    setIsActive(false);
    setPhase('inhale');
    stateRef.current.phase = 'inhale';
    setPhaseTimer(CYCLE_CONFIG.inhale);
    setCyclesCompleted(0);
    setTotalSecondsElapsed(0);
    setSessionCompleted(false);
    voiceService.stopSpeaking();
  };

  const stopSession = () => {
    voiceService.stopSpeaking();
    if (cyclesCompleted > 0 || totalSecondsElapsed > 10) finishSession();
    else resetSession();
  };

  /* ---------------- Voice-command autostart ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldStart =
      location.state?.autostart ||
      params.get('autostart') === '1' ||
      params.get('autostart') === 'true';

    if (shouldStart) {
      setAutoStartedBadge(true);
      startSession();
      const id = setTimeout(() => setAutoStartedBadge(false), 4000);
      return () => clearTimeout(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  /* ---------------- Cleanup on leaving the page ---------------- */
  useEffect(() => () => {
    clearInterval(timerRef.current);
    voiceService.stopSpeaking();
  }, []);

  /* ---------------- Derived view values ---------------- */
  const style = PHASE_STYLE[phase];
  const targetSeconds = presetMinutes * 60;
  const progressPct = Math.min(100, (totalSecondsElapsed / targetSeconds) * 100);
  const remaining = Math.max(0, targetSeconds - totalSecondsElapsed);
  const calm = accessibility.reducedMotion;

  // The circle grows on inhale, stays expanded through the hold, and shrinks
  // on exhale — the animation duration matches the length of each phase.
  const scale = !isActive
    ? 'scale-95'
    : phase === 'inhale' ? 'scale-110'
    : phase === 'hold' ? 'scale-110'
    : 'scale-75';

  const durationClass = calm
    ? 'duration-200'
    : phase === 'inhale' ? 'duration-[4000ms]'
    : phase === 'hold' ? 'duration-[2000ms]'
    : 'duration-[6000ms]';

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* ---------- Top bar: Back + Home + guidance toggle ---------- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition min-h-[44px]"
            aria-label="{t('brp_back')}"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back', 'Back')}</span>
          </button>

          <Link
            to="/elderly"
            className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition min-h-[44px]"
            aria-label="{t('brp_home')}"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t('home', 'Home')}</span>
          </Link>
        </div>

        <button
          onClick={() => {
            setVoiceGuidance(v => !v);
            if (voiceGuidance) voiceService.stopSpeaking();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition min-h-[44px] ${
            voiceGuidance
              ? 'bg-teal-50 text-teal-800 border-teal-300'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          aria-pressed={voiceGuidance}
        >
          {voiceGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{voiceGuidance ? 'Voice On' : 'Muted'}</span>
        </button>
      </div>

      {/* ---------- Title ---------- */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t('breathing_title', 'Calm Breathing')}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {t('breathing_sub', 'Breathe in for 4, hold for 2, breathe out for 6. Just follow the circle.')}
        </p>
      </div>

      {autoStartedBadge && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />{t('br_voice_started')}</span>
        </div>
      )}

      {/* ---------- Duration presets ---------- */}
      {!isActive && !sessionCompleted && totalSecondsElapsed === 0 && (
        <div className="flex justify-center items-center gap-2.5">
          {[2, 5, 10].map(mins => (
            <button
              key={mins}
              onClick={() => { setPresetMinutes(mins); resetSession(); }}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition min-h-[44px] ${
                presetMinutes === mins
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      )}

      {/* ---------- Breathing stage ---------- */}
      <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col items-center">

        {/* Phase label above the circle — large and readable */}
        <div className="h-16 flex flex-col items-center justify-center mb-2">
          {isActive ? (
            <>
              <span className={`text-2xl sm:text-3xl font-black ${style.text}`}>
                {style.label}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {style.hint}
              </span>
            </>
          ) : sessionCompleted ? (
            <span className="text-2xl font-black text-teal-700">{t('br_well_done')}</span>
          ) : (
            <span className="text-lg font-bold text-slate-500">
              {totalSecondsElapsed > 0 ? 'Paused' : 'Ready when you are'}
            </span>
          )}
        </div>

        {/* Animated circle */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
          {isActive && !calm && (
            <div className={`absolute inset-0 rounded-full border-2 ${style.ring} opacity-30 animate-ping`} />
          )}

          <div
            className={`absolute inset-3 rounded-full border-4 ${style.ring} bg-gradient-to-br ${style.fill}
              ${isActive ? style.glow : ''} transition-transform ease-in-out ${durationClass} ${scale}`}
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
            {isActive ? (
              <>
                <span className={`text-7xl sm:text-8xl font-black tabular-nums ${style.text}`}>
                  {phaseTimer}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Cycle {cyclesCompleted + 1}
                </span>
              </>
            ) : sessionCompleted ? (
              <>
                <CheckCircle2 className="w-14 h-14 text-teal-600 mb-2" />
                <span className="text-base font-bold text-slate-800">
                  {cyclesCompleted} {cyclesCompleted === 1 ? 'breath' : 'breaths'} · {fmt(totalSecondsElapsed)}
                </span>
              </>
            ) : (
              <>
                <Wind className="w-14 h-14 text-teal-600 mb-2" />
                <span className="text-base font-bold text-slate-700">
                  {totalSecondsElapsed > 0 ? `${fmt(remaining)} left` : `${presetMinutes} minute session`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm mt-8">
          <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full ${style.chip} transition-all duration-500`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mt-2 tabular-nums">
            <span>{fmt(totalSecondsElapsed)}</span>
            <span>{cyclesCompleted} cycles</span>
            <span>{fmt(targetSeconds)}</span>
          </div>
        </div>

        {/* ---------- Controls ---------- */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!isActive && !sessionCompleted && (
            <button
              onClick={totalSecondsElapsed > 0 ? resumeSession : startSession}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-9 py-4 rounded-2xl text-base shadow-lg transition flex items-center gap-2 min-h-[52px] active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              {totalSecondsElapsed > 0 ? t('resume', 'Resume') : t('start_breathing', 'Start')}
            </button>
          )}

          {isActive && (
            <>
              <button
                onClick={pauseSession}
                className="bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-bold px-7 py-3.5 rounded-2xl text-sm shadow-xs transition flex items-center gap-2 min-h-[48px] active:scale-95"
              >
                <Pause className="w-4 h-4" /> {t('pause', 'Pause')}
              </button>
              <button
                onClick={stopSession}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow transition flex items-center gap-2 min-h-[48px] active:scale-95"
              >
                <Square className="w-4 h-4 fill-white" /> {t('finish', 'Finish')}
              </button>
            </>
          )}

          {!isActive && totalSecondsElapsed > 0 && !sessionCompleted && (
            <button
              onClick={resetSession}
              className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 font-bold px-6 py-3.5 rounded-2xl text-sm transition flex items-center gap-2 min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" /> {t('reset', 'Reset')}
            </button>
          )}

          {sessionCompleted && (
            <>
              <button
                onClick={resetSession}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow transition flex items-center gap-2 min-h-[48px] active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> {t('play_again', 'Again')}
              </button>
              <Link
                to="/elderly"
                className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 font-bold px-7 py-3.5 rounded-2xl text-sm transition flex items-center gap-2 min-h-[48px]"
              >
                <Home className="w-4 h-4" /> {t('home', 'Home')}
              </Link>
            </>
          )}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
