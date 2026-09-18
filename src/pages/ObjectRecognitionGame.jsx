import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { 
  ArrowLeft, 
  Coffee, 
  ShoppingBag, 
  Scroll, 
  UtensilsCrossed, 
  Umbrella, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Trophy 
} from 'lucide-react';

const OBJECTS = [
  {
    id: 'obj-1',
    name: 'Traditional Bell-Metal Tea Cup (Kahi-Bati)',
    icon: Coffee,
    question: 'What is this brass/bell-metal item traditionally used for every morning in Assam?',
    options: [
      { id: 'a', label: 'Morning Hot Milk Tea (Chah)', isCorrect: true },
      { id: 'b', label: 'Hammering Nails into Wood', isCorrect: false },
      { id: 'c', label: 'Watering the Entire Paddy Field', isCorrect: false },
      { id: 'd', label: 'Washing Clothes in the River', isCorrect: false }
    ],
    hint: 'It is warm, comforting, and filled with fragrant tea leaves from the local garden.'
  },
  {
    id: 'obj-2',
    name: 'Handwoven Bamboo Cane Basket (Dala / Tukuri)',
    icon: ShoppingBag,
    question: 'How is this indigenous woven bamboo basket commonly used around the household?',
    options: [
      { id: 'a', label: 'Storing fresh vegetables, grains, or betel leaves', isCorrect: true },
      { id: 'b', label: 'Using as an umbrella in the heavy rain', isCorrect: false },
      { id: 'c', label: 'Cooking rice directly over an open flame', isCorrect: false },
      { id: 'd', label: 'Locking valuable papers', isCorrect: false }
    ],
    hint: 'Crafted from fine split bamboo, it allows gentle airflow to keep fresh produce dry and clean.'
  },
  {
    id: 'obj-3',
    name: 'Phulam Gamosa (Traditional Textile)',
    icon: Scroll,
    question: 'When is this white and red handwoven Gamosa traditionally offered in the North East?',
    options: [
      { id: 'a', label: 'As a gesture of deep respect to elders, guests, and during festivals', isCorrect: true },
      { id: 'b', label: 'As a floor wiping rag', isCorrect: false },
      { id: 'c', label: 'Only on cold snowy nights', isCorrect: false },
      { id: 'd', label: 'To wrap parcel shipments', isCorrect: false }
    ],
    hint: 'It is the proud emblem of Assamese warmth, gifted with both hands and a gentle bow.'
  },
  {
    id: 'obj-4',
    name: 'Bamboo Handle Umbrella (Shati)',
    icon: Umbrella,
    question: 'Why is this sturdy umbrella a familiar sight by the doorway in North Eastern homes?',
    options: [
      { id: 'a', label: 'For sudden afternoon monsoon showers in the hills', isCorrect: true },
      { id: 'b', label: 'For flying kites on the roof', isCorrect: false },
      { id: 'c', label: 'To measure room length', isCorrect: false },
      { id: 'd', label: 'As a walking crutch for young children', isCorrect: false }
    ],
    hint: 'Cherrapunji and Assam experience the lush, sudden rains of the Brahmaputra monsoon.'
  }
];

export default function ObjectRecognitionGame() {
  const { cognitiveProfile, updateProfileAfterGame, t } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentObj = OBJECTS[currentIdx];
  const IconComponent = currentObj.icon;

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
    if (currentIdx < OBJECTS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      const totalSec = Math.max(12, Math.floor((Date.now() - startTime) / 1000));
      const accuracy = Math.round(((correctCount + (selectedOption?.isCorrect ? 1 : 0)) / OBJECTS.length) * 100);

      const scoreData = calculatePerformanceScore({
        accuracy,
        completionTime: totalSec,
        expectedTime: 50,
        consistency: 88,
        completed: true
      });

      const adaptation = adaptDifficulty(cognitiveProfile?.difficultyLevel || 'Moderate', {
        accuracy,
        mistakes: OBJECTS.length - correctCount,
        hintsUsed: showHint ? 1 : 0,
        speedScore: scoreData.speedScore
      });

      const payload = {
        gameType: 'object-recognition',
        category: 'Semantic Memory',
        difficulty: cognitiveProfile?.difficultyLevel || 'Moderate',
        accuracy,
        attempts: OBJECTS.length,
        mistakes: OBJECTS.length - correctCount,
        hintsUsed: showHint ? 1 : 0,
        completionTime: totalSec,
        completed: true
      };

      if (accuracy >= 75) {
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
          <ArrowLeft className="w-4 h-4" />{t('g_back_hub')}</Link>
        <span className="text-xs font-bold text-slate-500">
          Object {currentIdx + 1} of {OBJECTS.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-teal-600 tracking-wider">{t('or_title')}</span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Cultural Hint'}
            </button>
          </div>

          {/* Visual Showcase Card */}
          <div className="bg-gradient-to-b from-amber-50/50 to-teal-50/50 rounded-2xl p-6 border-2 border-teal-200 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-700">
              <IconComponent className="w-12 h-12" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 text-center">{currentObj.name}</h3>
          </div>

          {showHint && (
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs sm:text-sm text-amber-900 animate-in fade-in">
              💡 {currentObj.hint}
            </div>
          )}

          <h2 className="text-lg font-bold text-slate-800">
            {currentObj.question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {currentObj.options.map(option => {
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
                {currentIdx < OBJECTS.length - 1 ? 'Next Familiar Object →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">{t('or_done')}</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Connecting semantic names to familiar cultural items stimulates semantic memory networks without causing strain.
          </p>

          <div className="flex justify-center gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">{t('g_accuracy')}</span>
              <span className="text-2xl font-black text-teal-900">{Math.round((correctCount / OBJECTS.length) * 100)}%</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3">
              <span className="text-xs text-teal-700 block font-bold">{t('rem_category')}</span>
              <span className="text-sm font-black text-teal-900 mt-1 block">{t('or_tag')}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={resetGame}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >{t('g_play_again')}</button>
            <Link
              to="/games"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >{t('g_game_hub')}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
