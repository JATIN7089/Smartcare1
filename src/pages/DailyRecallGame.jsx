import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { ArrowLeft, Clock, CheckCircle2, RotateCcw, Trophy, Calendar, Sparkles } from 'lucide-react';

const ROUTINE_QUESTIONS = [
  {
    id: 'rq-1',
    question: 'Which activity usually comes right after having morning breakfast?',
    options: [
      { id: 'opt-med', label: '💊 Morning Blood Pressure Medicine & Water', isCorrect: true },
      { id: 'opt-sleep', label: '🛌 Going to Sleep for the Night', isCorrect: false },
      { id: 'opt-dinner', label: '🍲 Eating Dinner', isCorrect: false },
      { id: 'opt-bed', label: '🌙 Bedtime Stretches', isCorrect: false }
    ],
    explanation: 'Taking prescribed morning medicine right after warm breakfast ensures optimal absorption and avoids stomach sensitivity.'
  },
  {
    id: 'rq-2',
    question: 'At 10:00 AM in the morning, what gentle health routine is recommended?',
    options: [
      { id: 'opt-water', label: '💧 Drinking a Full Glass of Fresh Water', isCorrect: true },
      { id: 'opt-run', label: '🏃 Running a 5-Kilometer Race', isCorrect: false },
      { id: 'opt-dark', label: '🌑 Staying in a Pitch Dark Room', isCorrect: false },
      { id: 'opt-heavy', label: '📦 Lifting Heavy Furniture', isCorrect: false }
    ],
    explanation: 'Mid-morning hydration keeps energy high and supports kidney health and cognitive clarity.'
  },
  {
    id: 'rq-3',
    question: 'What is a wonderful soothing activity to do around 8:30 PM before sleep?',
    options: [
      { id: 'opt-breath', label: '🫁 5-Minute Gentle Breathing Pacer & Wind-down', isCorrect: true },
      { id: 'opt-coffee', label: '☕ Drinking 3 Cups of Strong Black Coffee', isCorrect: false },
      { id: 'opt-loud', label: '🔊 Listening to Loud Blaring Sirens', isCorrect: false },
      { id: 'opt-sun', label: '☀️ Staring into Direct Sunlight', isCorrect: false }
    ],
    explanation: 'Paced slow breathing calms the nervous system and prepares the body for deep, rejuvenating sleep.'
  }
];

export default function DailyRecallGame() {
  const { cognitiveProfile, updateProfileAfterGame } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = ROUTINE_QUESTIONS[currentIdx];

  const handleSelect = (option) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);

    if (option.isCorrect) {
      soundService.playSuccessChime();
      setScoreCount(prev => prev + 1);
    } else {
      soundService.playSoftRetry();
    }
  };

  const handleNext = async () => {
    if (currentIdx < ROUTINE_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setCompleted(true);
      const totalSec = Math.max(12, Math.floor((Date.now() - startTime) / 1000));
      const accuracy = Math.round(((scoreCount + (selectedOption?.isCorrect ? 1 : 0)) / ROUTINE_QUESTIONS.length) * 100);

      const scoreData = calculatePerformanceScore({
        accuracy,
        completionTime: totalSec,
        expectedTime: 45,
        consistency: 90,
        completed: true
      });

      const adaptation = adaptDifficulty(cognitiveProfile?.difficultyLevel || 'Moderate', {
        accuracy,
        mistakes: ROUTINE_QUESTIONS.length - scoreCount,
        hintsUsed: 0,
        speedScore: scoreData.speedScore
      });

      const payload = {
        gameType: 'daily-recall',
        category: 'Daily Routine Recall',
        difficulty: cognitiveProfile?.difficultyLevel || 'Moderate',
        accuracy,
        attempts: ROUTINE_QUESTIONS.length,
        mistakes: ROUTINE_QUESTIONS.length - scoreCount,
        hintsUsed: 0,
        completionTime: totalSec,
        completed: true
      };

      if (accuracy >= 66) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }

      await api.submitGameResult(payload);
      updateProfileAfterGame(payload, scoreData.score, adaptation.nextDifficulty, adaptation.explanation);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setScoreCount(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/games"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game Hub
        </Link>
        <span className="text-xs font-bold text-slate-500">
          Question {currentIdx + 1} of {ROUTINE_QUESTIONS.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 text-teal-700">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">Daily Routine Recall</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 leading-snug">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map(option => {
              const isSelected = selectedOption?.id === option.id;
              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (answered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={answered}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition min-h-[56px] flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option.label}</span>
                  {answered && option.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs sm:text-sm text-teal-900 animate-in fade-in space-y-1">
              <span className="font-black uppercase tracking-wider block text-teal-800 text-[11px]">Why this matters:</span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {answered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow transition"
              >
                {currentIdx < ROUTINE_QUESTIONS.length - 1 ? 'Next Question →' : 'See Recall Summary'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Routine Recall Complete!</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Recalling daily sequencing reinforces independent living habits and episodic memory pathways.
          </p>

          <div className="flex justify-center gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Accuracy</span>
              <span className="text-2xl font-black text-teal-900">{Math.round((scoreCount / ROUTINE_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Category</span>
              <span className="text-sm font-black text-teal-900 mt-1 block">Routine Memory</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={resetGame}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Play Again
            </button>
            <Link
              to="/routine"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              View Daily Timeline
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
