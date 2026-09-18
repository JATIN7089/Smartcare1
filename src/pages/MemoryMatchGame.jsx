import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Trophy, 
  Clock, 
  Sparkles, 
  Coffee, 
  Sun, 
  Feather, 
  Flower2, 
  Heart, 
  Music, 
  Shield, 
  CheckCircle2, 
  Activity,
  Layers,
  Info
} from 'lucide-react';

const CARD_SYMBOLS = [
  { id: 'tea', label: 'Assam Tea', icon: Coffee, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'sun', label: 'Sun Dawn', icon: Sun, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'hornbill', label: 'Hornbill Feather', icon: Feather, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'flower', label: 'Dzukou Lily', icon: Flower2, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'heart', label: 'Family Love', icon: Heart, color: 'text-red-600 bg-red-50 border-red-200' },
  { id: 'music', label: 'Bihu Dhol Rhythm', icon: Music, color: 'text-purple-600 bg-purple-50 border-purple-200' }
];

export default function MemoryMatchGame() {
  const { cognitiveProfile, updateProfileAfterGame, user, language, t } = useApp();

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Difficulty determines grid size
  const currentDiff = cognitiveProfile?.difficultyLevel || 'Moderate';
  const pairCount = currentDiff === 'Beginner' ? 4 : currentDiff === 'Easy' ? 4 : currentDiff === 'Moderate' ? 6 : 6;

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, [currentDiff]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const startNewGame = () => {
    const selected = CARD_SYMBOLS.slice(0, pairCount);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        uniqueKey: `${item.id}-${idx}`,
        ...item
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setAttempts(0);
    setMistakes(0);
    setHintsUsed(0);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setIsCompleted(false);
    setGameResult(null);
    setShowExplanation(false);
  };

  const handleCardClick = (idx) => {
    if (isCompleted) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(idx)) return;
    if (matchedIds.includes(cards[idx].id)) return;

    soundService.playFlipTone();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.id === second.id) {
        // Match found!
        soundService.playSuccessChime();
        const newMatched = [...matchedIds, first.id];
        setMatchedIds(newMatched);
        setFlippedIndices([]);

        // Check victory
        if (newMatched.length === pairCount) {
          handleGameWon(attempts + 1, mistakes);
        }
      } else {
        // Mismatch
        setMistakes(prev => prev + 1);
        soundService.playSoftRetry();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleHint = () => {
    if (hintsUsed >= 3 || isCompleted) return;
    setHintsUsed(prev => prev + 1);
    soundService.playFlipTone();

    // Find unmatched cards and temporarily highlight
    const unmatched = cards
      .map((c, i) => ({ ...c, originalIdx: i }))
      .filter(c => !matchedIds.includes(c.id));

    if (unmatched.length >= 2) {
      const matchPair = unmatched.filter(c => c.id === unmatched[0].id);
      const indicesToShow = matchPair.map(c => c.originalIdx);
      setFlippedIndices(indicesToShow);
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1200);
    }
  };

  const handleGameWon = async (finalAttempts, finalMistakes) => {
    setIsCompleted(true);
    const finalSeconds = Math.max(10, Math.floor((Date.now() - startTime) / 1000));

    // Calculate accuracy percentage
    const totalFlips = finalAttempts || 1;
    const accuracy = Math.max(30, Math.min(100, Math.round((pairCount / totalFlips) * 100)));

    // Score calculation
    const scoreBreakdown = calculatePerformanceScore({
      accuracy,
      completionTime: finalSeconds,
      expectedTime: pairCount * 10,
      consistency: 85,
      completed: true
    });

    // AI Adaptation logic
    const adaptation = adaptDifficulty(currentDiff, {
      accuracy,
      mistakes: finalMistakes,
      hintsUsed,
      speedScore: scoreBreakdown.speedScore
    });

    const payload = {
      gameType: 'memory-match',
      category: 'Memory',
      difficulty: currentDiff,
      accuracy,
      attempts: finalAttempts,
      mistakes: finalMistakes,
      hintsUsed,
      completionTime: finalSeconds,
      completed: true
    };

    // Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Submit to API
    const res = await api.submitGameResult(payload);
    updateProfileAfterGame(payload, scoreBreakdown.score, adaptation.nextDifficulty, adaptation.explanation);

    setGameResult({
      accuracy,
      attempts: finalAttempts,
      time: finalSeconds,
      score: scoreBreakdown.score,
      adaptation,
      explanation: adaptation.explanation,
      offlineQueued: res?.queued
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/games"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />{t('g_back_hub')}</Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-600" />{t('g_challenge')}<strong className="text-teal-800">{currentDiff}</strong>
          </span>

          <button
            onClick={startNewGame}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />{t('g_restart')}</button>
        </div>
      </div>

      {/* Game Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            🧠 Memory Match Game
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Flip two cards at a time to find matching North Eastern pairs. Take your time!
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">{t('time')}</span>
            <span className="text-lg font-black text-slate-800 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {elapsedSeconds}s
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">{t('attempts')}</span>
            <span className="text-lg font-black text-teal-700">{attempts}</span>
          </div>

          <button
            onClick={handleHint}
            disabled={hintsUsed >= 3 || isCompleted}
            className="bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200 text-amber-900 font-bold px-3 py-2 rounded-xl text-xs flex flex-col items-center justify-center min-h-[48px] transition"
          >
            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{t('hint')}</span>
            <span className="text-[10px] text-amber-700">{3 - hintsUsed} left</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-4 mb-8 ${pairCount === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedIds.includes(card.id);
          const CardIcon = card.icon;

          return (
            <button
              key={card.uniqueKey}
              onClick={() => handleCardClick(idx)}
              disabled={isMatched || isFlipped}
              className={`h-32 sm:h-36 rounded-2xl p-3 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 select-none min-h-[44px] ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95 shadow-inner'
                  : isFlipped
                  ? `${card.color} shadow-lg scale-102`
                  : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-teal-400 shadow-sm cursor-pointer'
              }`}
            >
              {isFlipped || isMatched ? (
                <>
                  <CardIcon className="w-10 h-10 animate-in zoom-in-75 duration-150" />
                  <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                    {card.label}
                  </span>
                  {isMatched && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />{t('matched')}</span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                    ?
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{t('tap_reveal')}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory & AI Score Modal / Card */}
      {isCompleted && gameResult && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-teal-500 rounded-3xl p-6 shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">{t('g_completed')}</span>
              <h2 className="text-2xl font-black text-slate-900">Splendid Effort, {user?.name || 'Asha'}!</h2>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/90 rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('g_accuracy')}</span>
              <span className="text-xl font-extrabold text-teal-800">{gameResult.accuracy}%</span>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('attempts')}</span>
              <span className="text-xl font-extrabold text-slate-800">{gameResult.attempts}</span>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('time')}</span>
              <span className="text-xl font-extrabold text-slate-800">{gameResult.time}s</span>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('g_activity_score')}</span>
              <span className="text-xl font-extrabold text-indigo-700">{gameResult.score}/100</span>
            </div>
          </div>

          {/* Adaptive AI Explanation */}
          <div className="bg-white rounded-2xl p-4 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-sm text-slate-900">{t('g_adaptive')}</span>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                Next: {gameResult.adaptation.nextDifficulty}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {gameResult.explanation}
            </p>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showExplanation ? 'Hide AI explainability reasoning' : 'Why was this activity adjusted?'}</span>
            </button>

            {showExplanation && (
              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                <p><strong>{t('g_explain_rule')}</strong> If accuracy &gt; 85% and response pace is brisk, difficulty gradually steps up to foster neuroplastic engagement. If mistakes accumulate, difficulty gently simplifies to prevent cognitive fatigue.</p>
                <p className="text-amber-800 font-medium">Notice: This adaptive metric tracks interaction engagement and is strictly non-diagnostic.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />{t('g_play_another')}</button>

            <Link
              to="/breathing"
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-5 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Take a 2-Minute Breathing Break</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
