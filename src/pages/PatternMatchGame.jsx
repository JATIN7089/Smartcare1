import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy, Sparkles, HelpCircle } from 'lucide-react';

const PATTERN_QUESTIONS = [
  {
    id: 'pq-1',
    title: 'Textile Border Pattern (Gamosa Weave)',
    desc: 'Look at the sequence of handwoven shapes. Which shape comes next?',
    sequence: ['♦️ Red Diamond', '🔻 Red Triangle', '♦️ Red Diamond', '🔻 Red Triangle', '❓'],
    options: [
      { id: 'opt-a', label: '♦️ Red Diamond', isCorrect: true },
      { id: 'opt-b', label: '🔵 Blue Circle', isCorrect: false },
      { id: 'opt-c', label: '⭐ Golden Star', isCorrect: false },
      { id: 'opt-d', label: '🟩 Green Square', isCorrect: false }
    ],
    hint: 'Notice the alternating pattern: Diamond, Triangle, Diamond, Triangle...'
  },
  {
    id: 'pq-2',
    title: 'Monsoon Garden Growth',
    desc: 'Which stage naturally follows the gentle rain shower?',
    sequence: ['☁️ Rain Clouds', '🌧️ Gentle Rain', '🌱 Fresh Sprout', '🌸 Blooming Flower', '❓'],
    options: [
      { id: 'opt-a', label: '🍃 Golden Tea Leaf', isCorrect: true },
      { id: 'opt-b', label: '❄️ Heavy Snowfall', isCorrect: false },
      { id: 'opt-c', label: '⚡ Thunderstorm', isCorrect: false },
      { id: 'opt-d', label: '🌪️ Dust Storm', isCorrect: false }
    ],
    hint: 'A healthy garden continues by producing fresh mature leaves for plucking.'
  },
  {
    id: 'pq-3',
    title: 'Color Cadence',
    desc: 'Complete the peaceful color rhythm:',
    sequence: ['🟢 Emerald Green', '🟡 Warm Ochre', '🟢 Emerald Green', '🟡 Warm Ochre', '❓'],
    options: [
      { id: 'opt-a', label: '🟢 Emerald Green', isCorrect: true },
      { id: 'opt-b', label: '🟣 Violet Flower', isCorrect: false },
      { id: 'opt-c', label: '⚫ Coal Black', isCorrect: false },
      { id: 'opt-d', label: '⚪ Chalk White', isCorrect: false }
    ],
    hint: 'The pattern repeats every two steps between green and ochre.'
  }
];

export default function PatternMatchGame() {
  const { cognitiveProfile, updateProfileAfterGame, user } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = PATTERN_QUESTIONS[currentIdx];

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option.isCorrect) {
      soundService.playSuccessChime();
      setCorrectAnswers(prev => prev + 1);
    } else {
      soundService.playSoftRetry();
    }
  };

  const handleNext = async () => {
    if (currentIdx < PATTERN_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Completed all questions
      setCompleted(true);
      const totalTime = Math.max(15, Math.floor((Date.now() - startTime) / 1000));
      const accuracy = Math.round(((correctAnswers + (selectedOption?.isCorrect ? 1 : 0)) / PATTERN_QUESTIONS.length) * 100);

      const scoreData = calculatePerformanceScore({
        accuracy,
        completionTime: totalTime,
        expectedTime: 60,
        consistency: 90,
        completed: true
      });

      const adaptation = adaptDifficulty(cognitiveProfile?.difficultyLevel || 'Moderate', {
        accuracy,
        mistakes: PATTERN_QUESTIONS.length - correctAnswers,
        hintsUsed: showHint ? 1 : 0,
        speedScore: scoreData.speedScore
      });

      const payload = {
        gameType: 'pattern-match',
        category: 'Pattern Recognition',
        difficulty: cognitiveProfile?.difficultyLevel || 'Moderate',
        accuracy,
        attempts: PATTERN_QUESTIONS.length,
        mistakes: PATTERN_QUESTIONS.length - correctAnswers,
        hintsUsed: showHint ? 1 : 0,
        completionTime: totalTime,
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
    setIsAnswered(false);
    setShowHint(false);
    setCorrectAnswers(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/games"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game Hub
        </Link>
        <span className="text-xs font-bold text-slate-500">
          Question {currentIdx + 1} of {PATTERN_QUESTIONS.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div>
            <span className="text-xs font-black uppercase text-teal-600 tracking-wider">Pattern Recognition</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{currentQ.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{currentQ.desc}</p>
          </div>

          {/* Sequence Display */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-center gap-3">
            {currentQ.sequence.map((item, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 rounded-xl border font-bold text-sm sm:text-base flex items-center justify-center ${
                  item.includes('❓')
                    ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse font-black text-lg'
                    : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Hint */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
            </button>
          </div>

          {showHint && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
              💡 {currentQ.hint}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map(option => {
              const isSelected = selectedOption?.id === option.id;
              let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
              if (isAnswered) {
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
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition min-h-[56px] flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option.label}</span>
                  {isAnswered && option.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow transition"
              >
                {currentIdx < PATTERN_QUESTIONS.length - 1 ? 'Next Pattern →' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Pattern Exercise Complete!</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            You solved patterns with precision. Pattern recognition activates the parietal cortex and promotes mental flexibility.
          </p>

          <div className="flex justify-center gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Solved</span>
              <span className="text-2xl font-black text-teal-900">{correctAnswers}/{PATTERN_QUESTIONS.length}</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Category</span>
              <span className="text-sm font-black text-teal-900 mt-1 block">Pattern Reasoning</span>
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
              to="/games"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Game Hub
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
