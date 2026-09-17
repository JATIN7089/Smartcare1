import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import { soundService } from '../services/soundService.js';
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
  Heart, 
  Activity, 
  Shield,
  Sparkles
} from 'lucide-react';

const CYCLE_CONFIG = {
  inhale: 4,
  hold: 2,
  exhale: 6,
  totalCycleTime: 12
};

export default function BreathingPacerPage() {
  const { handleRecordBreathing, accessibility, language, t } = useApp();
  const location = useLocation();

  const [presetMinutes, setPresetMinutes] = useState(2); // 2, 5, 10
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale'
  const [phaseTimer, setPhaseTimer] = useState(CYCLE_CONFIG.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [autoStartedBadge, setAutoStartedBadge] = useState(false);

  const timerRef = useRef(null);

  // Automatic Start from Voice Command ("start breathing", "let's breathe")
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldStart = location.state?.autostart || params.get('autostart') === '1' || params.get('autostart') === 'true';
    if (shouldStart && !isActive && !sessionCompleted) {
      setIsActive(true);
      setAutoStartedBadge(true);
      soundService.playSingingBowl();
      setTimeout(() => setAutoStartedBadge(false), 4000);
    }
  }, [location.state]);

  // Spoken voice guidance in active language
  const speakGuidance = (text) => {
    if (voiceGuidance && accessibility.voiceEnabled) {
      voiceService.speak(text, language);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTotalSecondsElapsed(prev => {
        const nextSec = prev + 1;
        const targetSec = presetMinutes * 60;
        if (nextSec >= targetSec) {
          finishSession();
        }
        return nextSec;
      });

      setPhaseTimer(prevTimer => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        }

        // Transition phases with localized spoken guidance
        if (phase === 'inhale') {
          setPhase('hold');
          speakGuidance(t('hold_gently', 'Hold.'));
          return CYCLE_CONFIG.hold;
        } else if (phase === 'hold') {
          setPhase('exhale');
          speakGuidance(t('exhale_gently', 'Exhale gently.'));
          return CYCLE_CONFIG.exhale;
        } else {
          // Finished exhale -> next cycle
          soundService.playSingingBowl();
          setCyclesCompleted(c => c + 1);
          setPhase('inhale');
          speakGuidance(t('inhale_slowly', 'Inhale slowly.'));
          return CYCLE_CONFIG.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, phase, presetMinutes, voiceGuidance, accessibility.voiceEnabled, language]);

  const startSession = () => {
    setIsActive(true);
    setSessionCompleted(false);
    setPhase('inhale');
    setPhaseTimer(CYCLE_CONFIG.inhale);
    speakGuidance(t('inhale_slowly', 'Inhale slowly through your nose.'));
  };

  const pauseSession = () => {
    setIsActive(false);
    voiceService.stopSpeaking();
  };

  const stopSession = () => {
    setIsActive(false);
    voiceService.stopSpeaking();
    if (cyclesCompleted > 0) {
      finishSession();
    } else {
      resetSession();
    }
  };

  const finishSession = async () => {
    setIsActive(false);
    setSessionCompleted(true);
    voiceService.stopSpeaking();
    soundService.playSingingBowl();

    const sessionPayload = {
      preset: `${presetMinutes} min`,
      durationSeconds: totalSecondsElapsed || 120,
      cyclesCompleted: Math.max(1, cyclesCompleted),
      pace: '4-2-6'
    };

    try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
    await handleRecordBreathing(sessionPayload);
  };

  const resetSession = () => {
    setIsActive(false);
    setPhase('inhale');
    setPhaseTimer(CYCLE_CONFIG.inhale);
    setCyclesCompleted(0);
    setTotalSecondsElapsed(0);
    setSessionCompleted(false);
  };

  let circleScale = 'scale-100';
  let circleColor = 'bg-teal-500/20 border-teal-500 text-teal-800';

  if (phase === 'inhale') {
    circleScale = 'scale-125';
    circleColor = 'bg-teal-500/30 border-teal-500 text-teal-900';
  } else if (phase === 'hold') {
    circleScale = 'scale-125';
    circleColor = 'bg-sky-500/30 border-sky-500 text-sky-900';
  } else if (phase === 'exhale') {
    circleScale = 'scale-75';
    circleColor = 'bg-indigo-500/30 border-indigo-500 text-indigo-900';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/wellbeing"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> {t('back_to_wellbeing', 'Back to Well-being Center')}
        </Link>

        {/* Voice guidance toggle */}
        <button
          onClick={() => setVoiceGuidance(!voiceGuidance)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
            voiceGuidance ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {voiceGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceGuidance ? 'Spoken Guidance ON' : 'Guidance Muted'}</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
          Mindful Respiratory Pacer
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          {t('breathing_title', 'Guided 4-2-6 Breathing Pacer')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('breathing_sub', 'Inhale for 4 seconds, hold gently for 2 seconds, and exhale for 6 seconds. This rhythm calms autonomic nervous arousal and nurtures peaceful focus.')}
        </p>
      </div>

      {/* Preset Selector */}
      {!isActive && !sessionCompleted && (
        <div className="flex justify-center items-center gap-3">
          {[2, 5, 10].map(mins => (
            <button
              key={mins}
              onClick={() => {
                setPresetMinutes(mins);
                resetSession();
              }}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition min-h-[44px] ${
                presetMinutes === mins
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>
      )}

      {/* Central Visual Breathing Circle */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
        {/* Animated Circle Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
          {/* Subtle Outer Pulsing Halo */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-dashed transition-all ${
              accessibility.reducedMotion ? '' : 'duration-1000'
            } ${circleColor} ${isActive ? circleScale : 'scale-90 opacity-40'}`}
          />

          {/* Inner Solid Circle */}
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 shadow-xl flex flex-col items-center justify-center transition-all ${
              accessibility.reducedMotion ? '' : 'duration-1000'
            } ${circleColor} ${isActive ? circleScale : 'scale-100'}`}
          >
            {isActive ? (
              <>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
                  {phase === 'inhale' ? t('inhale', 'INHALE') : phase === 'hold' ? t('hold', 'HOLD') : t('exhale', 'EXHALE')}
                </span>
                <span className="text-5xl sm:text-6xl font-black text-slate-900 my-1">
                  {phaseTimer}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Cycle #{cyclesCompleted + 1}
                </span>
              </>
            ) : sessionCompleted ? (
              <div className="text-center p-4">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-1" />
                <span className="text-base font-black text-slate-900 block">{t('session_completed', 'Session Complete!')}</span>
                <span className="text-xs text-slate-600">{cyclesCompleted} cycles done</span>
              </div>
            ) : (
              <div className="text-center p-4">
                <Wind className="w-12 h-12 text-teal-600 mx-auto mb-1" />
                <span className="text-base font-black text-slate-900 block">{t('start_breathing', 'Ready to Begin')}</span>
                <span className="text-xs text-slate-500">{presetMinutes} minute session</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-6 mt-4 text-center">
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">{t('time', 'Time Elapsed')}</span>
            <span className="text-lg font-black text-slate-800">
              {Math.floor(totalSecondsElapsed / 60)}:{(totalSecondsElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">{t('cycles_completed', 'Completed Cycles')}</span>
            <span className="text-lg font-black text-teal-700">{cyclesCompleted}</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">{t('current_phase', 'Current Phase')}</span>
            <span className="text-lg font-black text-slate-800 capitalize">
              {phase === 'inhale' ? t('inhale', 'Inhale') : phase === 'hold' ? t('hold', 'Hold') : t('exhale', 'Exhale')}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 mt-8">
          {!isActive && !sessionCompleted && (
            <button
              onClick={startSession}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-lg transition flex items-center gap-2 min-h-[48px]"
            >
              <Play className="w-5 h-5 fill-white" /> {t('start_breathing', 'Start Breathing')}
            </button>
          )}

          {isActive && (
            <>
              <button
                onClick={pauseSession}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow transition flex items-center gap-2 min-h-[44px]"
              >
                <Pause className="w-4 h-4 fill-white" /> {t('pause', 'Pause')}
              </button>
              <button
                onClick={stopSession}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow transition flex items-center gap-2 min-h-[44px]"
              >
                <Square className="w-4 h-4 fill-white" /> {t('complete_session', 'Complete Session')}
              </button>
            </>
          )}

          {sessionCompleted && (
            <button
              onClick={resetSession}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow transition flex items-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" /> {t('play_again', 'Start New Session')}
            </button>
          )}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
