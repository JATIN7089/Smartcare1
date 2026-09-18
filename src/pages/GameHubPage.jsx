import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getRecommendationsForTime } from '../ai/recommendationService.js';
import { GAME_META_KEYS, CATEGORY_KEYS } from '../data/translations.js';
import { 
  Brain, 
  Sparkles, 
  Clock, 
  Layers, 
  MapPin, 
  Music, 
  Eye, 
  Calendar, 
  Coffee, 
  ChevronRight, 
  Play, 
  Award,
  Filter,
  Heart
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function GameHubPage() {
  const { cognitiveProfile, culturalRegion, t } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const recommendation = getRecommendationsForTime();

  const meta = (id, field, fallback) => {
    const keys = GAME_META_KEYS[id];
    return keys ? t(keys[field], fallback) : fallback;
  };
  const fillRegion = (str) => String(str).replace('{region}', culturalRegion || 'Assam');
  const diffLabel = (v) => t('diff_' + String(v).toLowerCase(), v);

  const games = [
    {
      id: 'memory',
      title: fillRegion(meta('memory','title','Memory Match')),
      desc: fillRegion(meta('memory','desc','Flip cards and find matching pairs. Trains working memory and visual recall.')),
      category: 'Memory',
      route: '/games/memory',
      icon: Brain,
      badge: fillRegion(meta('memory','badge','Cognitive Baseline')),
      color: 'from-teal-500 to-emerald-600',
      difficulty: cognitiveProfile?.difficultyLevel || 'Moderate'
    },
    {
      id: 'faces',
      title: fillRegion(meta('faces','title','Who Is This?')),
      desc: fillRegion(meta('faces','desc','Recognise your own family, your home and the places you love. No timer, no score.')),
      category: 'Memory',
      route: '/games/faces',
      icon: Heart,
      badge: fillRegion(meta('faces','badge','Personal Photos')),
      color: 'from-rose-500 to-pink-600',
      difficulty: 'Gentle'
    },
    {
      id: 'cultural',
      title: fillRegion(meta('cultural','title','NER Cultural Memory Match')),
      desc: fillRegion(meta('cultural','desc','Match regional symbols from ${culturalRegion} & 8 North Eastern states. Fosters semantic familiarity.')),
      category: 'Cultural',
      route: '/games/cultural',
      icon: Sparkles,
      badge: fillRegion(meta('cultural','badge','NER Heritage')),
      color: 'from-amber-500 to-orange-600',
      difficulty: 'Adaptive'
    },
    {
      id: 'attention',
      title: fillRegion(meta('attention','title','Sequence Recall')),
      desc: fillRegion(meta('attention','desc','Watch a sequence of symbols, memorize order, then reproduce step-by-step.')),
      category: 'Attention',
      route: '/games/attention',
      icon: Eye,
      badge: fillRegion(meta('attention','badge','Focus & Attention')),
      color: 'from-sky-500 to-blue-600',
      difficulty: cognitiveProfile?.difficultyLevel || 'Moderate'
    },
    {
      id: 'pattern',
      title: fillRegion(meta('pattern','title','Pattern Match')),
      desc: fillRegion(meta('pattern','desc','Solve geometric, color, and textile weave sequences to stimulate pattern logic.')),
      category: 'Pattern',
      route: '/games/pattern',
      icon: Layers,
      badge: fillRegion(meta('pattern','badge','Reasoning')),
      color: 'from-indigo-500 to-purple-600',
      difficulty: 'Moderate'
    },
    {
      id: 'daily-recall',
      title: fillRegion(meta('daily-recall','title','Daily Routine Recall')),
      desc: fillRegion(meta('daily-recall','desc','Gentle sequencing questions regarding meals, hydration, and morning medication habits.')),
      category: 'Daily Recall',
      route: '/games/daily-recall',
      icon: Calendar,
      badge: fillRegion(meta('daily-recall','badge','Everyday Independence')),
      color: 'from-emerald-500 to-teal-700',
      difficulty: 'Gentle'
    },
    {
      id: 'objects',
      title: fillRegion(meta('objects','title','Familiar Object Recognition')),
      desc: fillRegion(meta('objects','desc','Identify everyday household objects like tea cups, bamboo baskets, and handloom textiles.')),
      category: 'Memory',
      route: '/games/objects',
      icon: Coffee,
      badge: fillRegion(meta('objects','badge','Semantic Recall')),
      color: 'from-orange-500 to-amber-700',
      difficulty: 'Gentle'
    },
    {
      id: 'sound',
      title: fillRegion(meta('sound','title','Sound & Environmental Recall')),
      desc: fillRegion(meta('sound','desc','Listen to synthesized soothing sounds: monsoon rain, singing bowls, morning birdsong.')),
      category: 'Sound',
      route: '/games/sound',
      icon: Music,
      badge: fillRegion(meta('sound','badge','Auditory Memory')),
      color: 'from-violet-500 to-fuchsia-600',
      difficulty: 'Calming'
    }
  ];

  const categories = ['all', 'Memory', 'Attention', 'Pattern', 'Daily Recall', 'Cultural', 'Sound'];

  const filteredGames = selectedFilter === 'all'
    ? games
    : games.filter(g => g.category.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* App Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{t('gh_hub')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">{t('gh_your')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">{t('gh_sub')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl text-slate-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-600" />{t('gh_level')}<strong className="text-teal-800">{diffLabel(cognitiveProfile?.difficultyLevel || 'Moderate')}</strong>
          </span>
          <span className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" /> {culturalRegion}
          </span>
        </div>
      </div>

      {/* AI Daily Recommendation Card */}
      {recommendation?.primaryActivity && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">{t('gh_ai')}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{recommendation.primaryActivity.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{recommendation.primaryActivity.reason}</p>
          </div>
          <Link
            to={recommendation.primaryActivity.route}
            state={{ autostart: true }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 flex-shrink-0 min-h-[48px]"
          >
            <Play className="w-4 h-4 fill-white" />{t('gh_start')}</Link>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition min-h-[44px] ${
              selectedFilter === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat === 'all' ? t('all_activities', 'All Activities') : t(CATEGORY_KEYS[cat] || '', cat)}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(game => {
          const GameIcon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md`}>
                    <GameIcon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {game.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{game.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{game.desc}</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {t('level', 'Level')}: <strong className="text-slate-800">{diffLabel(game.difficulty)}</strong>
                </span>

                <Link
                  to={game.route}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 min-h-[44px]"
                >
                  <span>{t('play_now', 'Play Now')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
