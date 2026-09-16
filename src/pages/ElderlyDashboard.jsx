import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { 
  Brain, 
  Target, 
  Puzzle, 
  Calendar, 
  Wind, 
  Music, 
  Mic, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Pill, 
  Droplets, 
  Stethoscope, 
  Heart, 
  ChevronRight,
  MapPin,
  Volume2
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function ElderlyDashboard() {
  const { user, routine, reminders, handleToggleReminder, cognitiveProfile, culturalRegion, t, language } = useApp();
  const navigate = useNavigate();

  // Calculate today's routine progress
  const completedRoutine = routine.filter(r => r.done).length;
  const totalRoutine = routine.length || 10;
  const progressPercent = Math.min(100, Math.round((completedRoutine / totalRoutine) * 100));

  const hours = new Date().getHours();
  const greetingText = hours < 12 
    ? t('good_morning', 'Good Morning') 
    : hours < 17 
    ? t('good_afternoon', 'Good Afternoon') 
    : t('good_evening', 'Good Evening');

  const activityCards = [
    {
      title: 'Memory Match',
      desc: 'Flip & match cards',
      category: '🧠 Memory',
      route: '/games/memory',
      color: 'bg-teal-50 border-teal-300 text-teal-900',
      iconBg: 'bg-teal-600 text-white'
    },
    {
      title: 'NER Heritage',
      desc: `${culturalRegion} cultural match`,
      category: '🌸 Cultural Memory',
      route: '/games/cultural',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
      iconBg: 'bg-amber-600 text-white'
    },
    {
      title: 'Sequence Recall',
      desc: 'Remember the order',
      category: '🎯 Attention',
      route: '/games/attention',
      color: 'bg-sky-50 border-sky-300 text-sky-900',
      iconBg: 'bg-sky-600 text-white'
    },
    {
      title: 'Pattern Match',
      desc: 'Find the missing shape',
      category: '🧩 Pattern',
      route: '/games/pattern',
      color: 'bg-indigo-50 border-indigo-300 text-indigo-900',
      iconBg: 'bg-indigo-600 text-white'
    },
    {
      title: 'Daily Recall',
      desc: 'Breakfast & medicine recall',
      category: '📅 Daily Recall',
      route: '/games/daily-recall',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'Breathe & Relax',
      desc: 'Guided 4-2-6 breathing',
      category: '🫁 Breathe & Relax',
      route: '/breathing',
      color: 'bg-rose-50 border-rose-300 text-rose-900',
      iconBg: 'bg-rose-600 text-white'
    },
    {
      title: 'Familiar Sounds',
      desc: 'Monsoon rain & temple bells',
      category: '🎵 Familiar Sounds',
      route: '/games/sound',
      color: 'bg-purple-50 border-purple-300 text-purple-900',
      iconBg: 'bg-purple-600 text-white'
    },
    {
      title: 'Family Memories',
      desc: 'Daughter Rita & Tezpur photos',
      category: '❤️ Memory Lane',
      route: '/memory-lane',
      color: 'bg-orange-50 border-orange-300 text-orange-900',
      iconBg: 'bg-orange-600 text-white'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Warm Elderly Greeting Card */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {culturalRegion} • North Eastern Region
            </span>
            <span className="text-xs bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
              {t('level', 'Level')}: {cognitiveProfile?.difficultyLevel || 'Moderate'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {greetingText}, {user?.name || 'Asha'} 👋
          </h1>
          <p className="text-teal-100 text-base sm:text-lg font-medium leading-relaxed">
            "{t('hero_quote', "Let's keep your mind active today.")}"
          </p>

          {/* Today's Progress Bar */}
          <div className="pt-2 space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs font-bold text-teal-100">
              <span>{t('today_progress', "Today's Activities")}</span>
              <span>{progressPercent}% {t('completed', 'Completed')}</span>
            </div>
            <div className="w-full bg-teal-900/60 h-3.5 rounded-full overflow-hidden p-0.5 border border-teal-500/30">
              <div
                className="bg-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Large Microphone Hero CTA (As explicitly required) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-teal-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/assistant')}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition flex-shrink-0 min-h-[44px]"
            aria-label={t('talk_to_smartcare', 'Talk to SmarTCARE')}
          >
            <Mic className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              "{t('talk_to_smartcare', 'Talk to SmarTCARE')}"
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t('talk_desc', 'Tap the microphone anytime to ask about your medicines, start a game, or listen to calming sounds.')}
            </p>
          </div>
        </div>

        <Link
          to="/assistant"
          className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-teal-300 flex items-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <span>{t('nav_assistant', 'Open Voice Assistant')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Primary 8 Cognitive & Care Activity Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            ✨ {t('todays_activities', "Today's Cognitive Activities")}
          </h2>
          <Link to="/games" className="text-xs font-bold text-teal-700 hover:underline">
            {t('view_all_activities', 'View All Activities →')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activityCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.route}
              className={`p-5 rounded-3xl border-2 transition-all duration-200 hover:scale-102 hover:shadow-md flex flex-col justify-between min-h-[140px] ${card.color}`}
            >
              <div>
                <span className="text-xs font-black uppercase tracking-wider block opacity-90">
                  {card.category}
                </span>
                <h3 className="text-lg font-black mt-1 text-slate-900">
                  {card.title}
                </h3>
                <p className="text-xs opacity-75 mt-1 font-medium">{card.desc}</p>
              </div>

              <div className="flex justify-end pt-3">
                <span className="text-xs font-bold flex items-center gap-1 opacity-90">
                  {t('play_now', 'Play Now')} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Reminders Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏰</span>
            <h2 className="text-xl font-black text-slate-900">{t('todays_reminders', "Today's Reminders")}</h2>
          </div>
          <Link to="/reminders" className="text-xs font-bold text-teal-700 hover:underline">
            {t('manage_reminders', 'Manage All Reminders →')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {reminders.slice(0, 3).map(rem => (
            <div
              key={rem.id}
              onClick={() => handleToggleReminder(rem.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 min-h-[56px] select-none ${
                rem.completed
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                    rem.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                  }`}
                >
                  {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{rem.time}</span>
                  <span className={`text-sm font-bold ${rem.completed ? 'line-through opacity-70' : ''}`}>
                    {rem.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
