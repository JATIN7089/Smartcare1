import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Trophy, 
  RotateCcw, 
  Music, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

const SOUND_QUESTIONS = [
  {
    id: 'sq-1',
    soundType: 'rain',
    title: 'Sound Challenge 1',
    prompt: 'Listen carefully to the ambient sound by pressing the audio button.',
    question: 'What natural sound did you hear?',
    options: [
      { id: 'opt-rain', label: '🌧️ Gentle Monsoon Rain on Tea Bushes', isCorrect: true },
      { id: 'opt-fire', label: '🔥 Loud Roaring Bonfire', isCorrect: false },
      { id: 'opt-car', label: '🚗 Heavy City Highway Horns', isCorrect: false },
      { id: 'opt-drum', label: '🥁 Rapid Martial Drums', isCorrect: false }
    ],
    hint: 'It is a soft, continuous, soothing patter associated with the Abode of Clouds.'
  },
  {
    id: 'sq-2',
    soundType: 'temple_bell',
    title: 'Sound Challenge 2',
    prompt: 'Listen to the ringing resonance.',
    question: 'What sacred traditional sound was produced?',
    options: [
      { id: 'opt-bell', label: '🔔 Himalayan Brass Temple Bell / Singing Bowl', isCorrect: true },
      { id: 'opt-drill', label: '🪛 Electric Construction Drill', isCorrect: false },
      { id: 'opt-dog', label: '🐕 Barking Guard Dog', isCorrect: false },
      { id: 'opt-door', label: '🚪 Squeaky Wooden Door', isCorrect: false }
    ],
    hint: 'A pure, resonant bronze chime heard at sunrise prayer in Tawang and Kamakhya.'
  },
  {
    id: 'sq-3',
    soundType: 'bird',
    title: 'Sound Challenge 3',
    prompt: 'Listen to the high-pitched melodic notes.',
    question: 'What creature is singing?',
    options: [
      { id: 'opt-bird', label: '🐦 Morning Songbird Chirping in Courtyard Tree', isCorrect: true },
      { id: 'opt-cat', label: '🐱 Purring Cat', isCorrect: false },
      { id: 'opt-frog', label: '🐸 Croaking Bullfrog', isCorrect: false },
      { id: 'opt-wind', label: '🌪️ Howling Mountain Blizzard', isCorrect: false }
    ],
    hint: 'A cheery, bright feathered companion greeting the early dawn.'
  }
];

export default function SoundMemoryGame() {
  const { cognitiveProfile, updateProfileAfterGame } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = SOUND_QUESTIONS[currentIdx];

  const handlePlaySound = () => {
    setIsPlaying(true);
    soundService.playSoundSample(currentQ.soundType);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  };

  const handleSelect = (option) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);

    if (option.isCorrect) {
      soundService.playSuccessChime();
      setCorrectCount(prev => prev + 1);
    } else {
      soundService.playSoftRetry();
    }
  };

  const handleNext = async () => {
    if (currentIdx < SOUND_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      const totalSec = Math.max(15, Math.floor((Date.now() - startTime) / 1000));
      const accuracy = Math.round(((correctCount + (selectedOption?.isCorrect ? 1 : 0)) / SOUND_QUESTIONS.length) * 100);

      const scoreData = calculatePerformanceScore({
        accuracy,
        completionTime: totalSec,
        expectedTime: 50,
        consistency: 85,
        completed: true
      });

      const adaptation = adaptDifficulty(cognitiveProfile?.difficultyLevel || 'Moderate', {
        accuracy,
        mistakes: SOUND_QUESTIONS.length - correctCount,
        hintsUsed: showHint ? 1 : 0,
        speedScore: scoreData.speedScore
      });

      const payload = {
        gameType: 'sound-memory',
        category: 'Auditory Memory',
        difficulty: cognitiveProfile?.difficultyLevel || 'Moderate',
        accuracy,
        attempts: SOUND_QUESTIONS.length,
        mistakes: SOUND_QUESTIONS.length - correctCount,
        hintsUsed: showHint ? 1 : 0,
        completionTime: totalSec,
        completed: true
      };

      if (accuracy >= 66) {
        try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
      }

      await api.submitGameResult(payload);
      updateProfileAfterGame(payload, scoreData.score, adaptation.nextDifficulty, adaptation.explanation);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setShowHint(false);
    setCorrectCount(0);
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
          Sound {currentIdx + 1} of {SOUND_QUESTIONS.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-teal-600 tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4" /> Sound & Environmental Memory
            </span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Sound Hint'}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {currentQ.question}
          </h2>

          {/* Sound Player Box */}
          <div className="bg-gradient-to-br from-teal-50 to-sky-50 border-2 border-teal-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3">
            <button
              onClick={handlePlaySound}
              disabled={isPlaying}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition transform active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
              }`}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-10 h-10 animate-bounce" />
                  <span className="text-[10px] font-black uppercase mt-1">Playing...</span>
                </>
              ) : (
                <>
                  <Play className="w-10 h-10 fill-white ml-1" />
                  <span className="text-[10px] font-black uppercase mt-1">Listen Sound</span>
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 font-medium">Tap to play environmental audio through your speakers</p>
          </div>

          {showHint && (
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs sm:text-sm text-amber-900 animate-in fade-in">
              💡 {currentQ.hint}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
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
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow transition"
              >
                {currentIdx < SOUND_QUESTIONS.length - 1 ? 'Next Sound →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sound Exercise Completed!</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Auditory recognition engages the temporal lobes and sensory integration areas of the brain.
          </p>

          <div className="flex justify-center gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Accuracy</span>
              <span className="text-2xl font-black text-teal-900">{Math.round((correctCount / SOUND_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">Category</span>
              <span className="text-sm font-black text-teal-900 mt-1 block">Auditory Memory</span>
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
