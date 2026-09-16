import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { api } from '../services/api.js';
import { calculatePerformanceScore, adaptDifficulty } from '../ai/personalizationService.js';
import { NER_REGIONS, NER_CULTURAL_ITEMS } from '../data/nerCultureData.js';
import { 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Trophy, 
  Clock, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Layers, 
  Info,
  Coffee,
  Scroll,
  Sun,
  Shield,
  Feather,
  Landmark,
  Waves,
  GitBranch,
  CloudRain,
  Music,
  Flower,
  Castle,
  Package,
  MountainSnow,
  Leaf
} from 'lucide-react';

const ICON_MAP = {
  Coffee,
  Scroll,
  Sun,
  Shield,
  Feather,
  Landmark,
  Waves,
  Sparkles,
  GitBranch,
  CloudRain,
  Music,
  Layers,
  Flower,
  ShieldAlert: Shield,
  Castle,
  Package,
  MountainSnow,
  Leaf
};

export default function NERCulturalGame() {
  const { culturalRegion, setCulturalRegion, cognitiveProfile, updateProfileAfterGame, user } = useApp();

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastMatchedFact, setLastMatchedFact] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Initialize deck based on cultural region
  useEffect(() => {
    initDeck();
  }, [culturalRegion]);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const initDeck = () => {
    // Pick cultural items matching region, or pick 4 items from NER pool
    let pool = NER_CULTURAL_ITEMS.filter(item => item.region === culturalRegion);
    if (pool.length < 4) {
      pool = [...pool, ...NER_CULTURAL_ITEMS.filter(item => item.region !== culturalRegion)].slice(0, 4);
    } else {
      pool = pool.slice(0, 4);
    }

    const deck = [...pool, ...pool]
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
    setLastMatchedFact(null);
    setGameResult(null);
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
        soundService.playSuccessChime();
        const newMatched = [...matchedIds, first.id];
        setMatchedIds(newMatched);
        setLastMatchedFact({ name: first.name, fact: first.fact, localName: first.localName });
        setFlippedIndices([]);

        if (newMatched.length === 4) {
          handleVictory(attempts + 1, mistakes);
        }
      } else {
        setMistakes(prev => prev + 1);
        soundService.playSoftRetry();
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  const handleVictory = async (finalAttempts, finalMistakes) => {
    setIsCompleted(true);
    const finalSec = Math.max(10, Math.floor((Date.now() - startTime) / 1000));
    const accuracy = Math.max(30, Math.min(100, Math.round((4 / (finalAttempts || 1)) * 100)));

    const scoreData = calculatePerformanceScore({
      accuracy,
      completionTime: finalSec,
      expectedTime: 40,
      consistency: 90,
      completed: true
    });

    const adaptation = adaptDifficulty(cognitiveProfile?.difficultyLevel || 'Moderate', {
      accuracy,
      mistakes: finalMistakes,
      hintsUsed,
      speedScore: scoreData.speedScore
    });

    const payload = {
      gameType: 'ner-cultural',
      category: 'NER Cultural Memory',
      difficulty: cognitiveProfile?.difficultyLevel || 'Moderate',
      accuracy,
      attempts: finalAttempts,
      mistakes: finalMistakes,
      hintsUsed,
      completionTime: finalSec,
      completed: true
    };

    try { confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } }); } catch (e) {}

    const res = await api.submitGameResult(payload);
    updateProfileAfterGame(payload, scoreData.score, adaptation.nextDifficulty, adaptation.explanation);

    setGameResult({
      accuracy,
      attempts: finalAttempts,
      time: finalSec,
      score: scoreData.score,
      adaptation,
      explanation: adaptation.explanation,
      offlineQueued: res?.queued
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Region Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/games"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game Hub
        </Link>

        {/* Region preference picker */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-slate-600">Region Theme:</span>
          <select
            value={culturalRegion}
            onChange={(e) => setCulturalRegion(e.target.value)}
            className="text-xs font-bold text-teal-800 bg-transparent outline-none cursor-pointer"
          >
            {NER_REGIONS.map(reg => (
              <option key={reg.id} value={reg.id}>{reg.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-700 tracking-wider">NER Cultural Heritage</span>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {culturalRegion}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            🌸 North Eastern Memory Match
          </h1>
          <p className="text-sm text-slate-600">
            Enjoy matching cultural symbols from {culturalRegion}. No rush—take in the heritage and memories!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Time</span>
            <span className="text-lg font-black text-slate-800 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {elapsedSeconds}s
            </span>
          </div>
          <button
            onClick={initDeck}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* Cultural Fact Toast on Matched Card */}
      {lastMatchedFact && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-xs animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
            ✓
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-950">
              Matched: {lastMatchedFact.name} <span className="text-xs text-emerald-700 font-normal">({lastMatchedFact.localName})</span>
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{lastMatchedFact.fact}</p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedIds.includes(card.id);
          const IconComp = ICON_MAP[card.iconName] || Sparkles;

          return (
            <button
              key={card.uniqueKey}
              onClick={() => handleCardClick(idx)}
              disabled={isMatched || isFlipped}
              className={`h-36 sm:h-40 rounded-2xl p-3 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[44px] ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 shadow-inner'
                  : isFlipped
                  ? 'bg-white border-teal-500 shadow-lg scale-102'
                  : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-teal-400 shadow-sm cursor-pointer'
              }`}
            >
              {isFlipped || isMatched ? (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: card.bgColor, color: card.color }}
                  >
                    <IconComp className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 text-center leading-tight">
                    {card.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {card.region}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-black">
                    🪷
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Tap Card</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory Dialog */}
      {isCompleted && gameResult && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-teal-500 rounded-3xl p-6 shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">Cultural Match Completed</span>
              <h2 className="text-2xl font-black text-slate-900">Wonderful, {user?.name || 'Asha'}!</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-bold block">Accuracy</span>
              <span className="text-xl font-black text-teal-800">{gameResult.accuracy}%</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-bold block">Time</span>
              <span className="text-xl font-black text-slate-800">{gameResult.time}s</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-teal-100 text-center">
              <span className="text-xs text-slate-500 font-bold block">Score</span>
              <span className="text-xl font-black text-indigo-700">{gameResult.score}/100</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-teal-200">
            <p className="text-xs font-bold text-slate-500 uppercase">AI Engagement Explanation</p>
            <p className="text-sm text-slate-700 mt-1">{gameResult.explanation}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={initDeck}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition"
            >
              Play Again
            </button>
            <Link
              to="/cultural-mode"
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-5 py-3 rounded-xl text-sm shadow-md transition"
            >
              Explore All 8 NER States
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
