import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { 
  ArrowLeft, 
  RotateCcw, 
  Eye, 
  Play, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Layers,
  Info 
} from 'lucide-react';

const SYMBOLS_POOL = [
  { id: '1', label: '1 - Tea Leaf', symbol: '🌱', name: 'Tea Leaf' },
  { id: '2', label: '2 - Brahmaputra River', symbol: '🌊', name: 'River' },
  { id: '3', label: '3 - Morning Sun', symbol: '☀️', name: 'Sun' },
  { id: '4', label: '4 - Temple Bell', symbol: '🔔', name: 'Bell' },
  { id: '5', label: '5 - Orchid Flower', symbol: '🌸', name: 'Flower' },
  { id: '6', label: '6 - Traditional Drum', symbol: '🥁', name: 'Drum' }
];

export default function SequenceRecallGame() {
  const { cognitiveProfile, updateProfileAfterGame, user } = useApp();
  const currentDiff = cognitiveProfile?.difficultyLevel || 'Moderate';

  // Sequence length based on difficulty: Beginner=3, Easy=3, Moderate=4, Advanced=5
  const sequenceLength = currentDiff === 'Beginner' ? 3 : currentDiff === 'Easy' ? 3 : currentDiff === 'Moderate' ? 4 : 5;
  const location = useLocation();

  const [targetSequence, setTargetSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'memorizing' | 'recalling' | 'finished'
  const [countdown, setCountdown] = useState(4);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [gameResult, setGameResult] = useState(null);
  const [autoStartCount, setAutoStartCount] = useState(null);

  // Auto-start on voice command
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldStart = location.state?.autostart || params.get('autostart') === '1' || params.get('autostart') === 'true';
    if (shouldStart && phase === 'ready') {
      setAutoStartCount(3);
      const cTimer1 = setTimeout(() => setAutoStartCount(2), 500);
      const cTimer2 = setTimeout(() => setAutoStartCount(1), 1000);
      const cTimer3 = setTimeout(() => {
        setAutoStartCount(null);
        startRound();
      }, 1500);
      return () => {
        clearTimeout(cTimer1);
        clearTimeout(cTimer2);
        clearTimeout(cTimer3);
      };
    }
  }, [location.state]);

  const startRound = () => {
    // Generate random sequence
    const shuffled = [...SYMBOLS_POOL].sort(() => Math.random() - 0.5);
    const seq = shuffled.slice(0, sequenceLength);

    setTargetSequence(seq);
    setUserSequence([]);
    setPhase('memorizing');
    setCountdown(4);
    setStartTime(Date.now());
    soundService.playSuccessChime();

    // Countdown to hide
    let timer = 4;
    const interval = setInterval(() => {
      timer--;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setPhase('recalling');
        soundService.playFlipTone();
      }
    }, 1000);
  };

  const handleSelectSymbol = (item) => {
    if (phase !== 'recalling') return;

    soundService.playFlipTone();
    const nextSeq = [...userSequence, item];
    setUserSequence(nextSeq);

    // If user completed their sequence
    if (nextSeq.length === targetSequence.length) {
      checkResult(nextSeq);
    }
  };

  const checkResult = async (finalSeq) => {
    const elapsed = Math.max(4, Math.floor((Date.now() - startTime) / 1000));
    setAttempts(prev => prev + 1);

    // Count correct positions
    let correctCount = 0;
    finalSeq.forEach((item, idx) => {
      if (targetSequence[idx] && item.id === targetSequence[idx].id) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / sequenceLength) * 100);
    const scoreData = calculatePerformanceScore({
      accuracy,
      completionTime: elapsed,
      expectedTime: sequenceLength * 6,
      consistency: 82,
      completed: true
    });

    const adaptation = adaptDifficulty(currentDiff, {
      accuracy,
      mistakes: sequenceLength - correctCount,
      hintsUsed: 0,
      speedScore: scoreData.speedScore
    });

    const payload = {
      gameType: 'sequence-recall',
      category: 'Attention',
      difficulty: currentDiff,
      accuracy,
      attempts: 1,
      mistakes: sequenceLength - correctCount,
      hintsUsed: 0,
      completionTime: elapsed,
      completed: true
    };

    if (accuracy >= 75) {
      soundService.playSuccessChime();
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      soundService.playSoftRetry();
    }

    setPhase('finished');
    const res = await api.submitGameResult(payload);
    updateProfileAfterGame(payload, scoreData.score, adaptation.nextDifficulty, adaptation.explanation);

    setGameResult({
      accuracy,
      score: scoreData.score,
      time: elapsed,
      correctCount,
      adaptation,
      offlineQueued: res?.queued
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/games"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game Hub
        </Link>

        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-600" /> Challenge: <strong className="text-teal-800">{currentDiff} ({sequenceLength} items)</strong>
        </span>
      </div>

      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            🎯 Sequence Recall
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Watch the sequence appear, memorize the order, then tap the items in the same sequence.
          </p>
        </div>

        {phase === 'ready' && (
          <button
            onClick={startRound}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Start Sequence
          </button>
        )}
      </div>

      {/* Main Play Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md min-h-[300px] flex flex-col items-center justify-center mb-8">
        {phase === 'ready' && (
          <div className="text-center space-y-4 py-10">
            {autoStartCount !== null ? (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-lg animate-pulse">
                  {autoStartCount}
                </div>
                <h3 className="text-2xl font-black text-slate-800">Starting Automatically...</h3>
                <p className="text-sm text-teal-700 font-bold">Voice command received • Get ready!</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl font-black">
                  1-2-3
                </div>
                <h3 className="text-xl font-bold text-slate-800">Your Attention Activity</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Watch the {sequenceLength} symbols appear, remember the order, and tap them in sequence.
                </p>
                <button
                  onClick={startRound}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-2xl shadow transition min-h-[48px]"
                >
                  Start Sequence
                </button>
              </>
            )}
          </div>
        )}

        {phase === 'memorizing' && (
          <div className="text-center space-y-6 w-full py-6">
            <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-sm bg-teal-50 px-4 py-1.5 rounded-full w-max mx-auto border border-teal-200">
              <Eye className="w-4 h-4" />
              <span>Memorize this sequence ({countdown}s)</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {targetSequence.map((item, idx) => (
                <div
                  key={idx}
                  className="w-24 h-28 bg-gradient-to-b from-sky-50 to-teal-50 border-2 border-teal-400 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-md animate-in zoom-in-75 duration-200"
                >
                  <span className="text-3xl">{item.symbol}</span>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] font-black text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'recalling' && (
          <div className="w-full space-y-6 py-4">
            <div className="text-center">
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Your Turn</span>
              <h3 className="text-lg font-bold text-slate-800">Tap the symbols in the order you saw them</h3>
            </div>

            {/* Answer Slots */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: sequenceLength }).map((_, idx) => {
                const filled = userSequence[idx];
                return (
                  <div
                    key={idx}
                    className={`w-20 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition ${
                      filled
                        ? 'border-teal-500 bg-teal-50 text-slate-800'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {filled ? (
                      <>
                        <span className="text-2xl">{filled.symbol}</span>
                        <span className="text-[10px] font-bold text-slate-700">{filled.name}</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Step {idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tap Options */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 text-center block mb-3 uppercase">Available Options</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {SYMBOLS_POOL.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSymbol(item)}
                    className="h-20 bg-white hover:bg-slate-50 active:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 rounded-xl p-2 flex flex-col items-center justify-center gap-1 shadow-xs transition"
                  >
                    <span className="text-2xl">{item.symbol}</span>
                    <span className="text-[11px] font-bold text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'finished' && gameResult && (
          <div className="w-full space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {gameResult.accuracy >= 75 ? 'Great memory recall!' : 'Good exercise for the mind!'}
                </h3>
                <p className="text-xs text-slate-600">
                  You matched {gameResult.correctCount} of {sequenceLength} symbols correctly.
                </p>
              </div>
            </div>

            {/* Target vs Answered */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 block uppercase">Original Sequence</span>
              <div className="flex items-center gap-2">
                {targetSequence.map((item, idx) => (
                  <div key={idx} className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-1">
                    <span>{item.symbol}</span> <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-teal-50 rounded-xl p-3 border border-teal-200 text-center">
                <span className="text-xs text-teal-700 font-bold block">Accuracy</span>
                <span className="text-xl font-black text-teal-900">{gameResult.accuracy}%</span>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 border border-teal-200 text-center">
                <span className="text-xs text-teal-700 font-bold block">Score</span>
                <span className="text-xl font-black text-teal-900">{gameResult.score}/100</span>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 border border-teal-200 text-center">
                <span className="text-xs text-teal-700 font-bold block">Time</span>
                <span className="text-xl font-black text-teal-900">{gameResult.time}s</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={startRound}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Play Another Round
              </button>
              <Link
                to="/games"
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Choose Another Game
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
