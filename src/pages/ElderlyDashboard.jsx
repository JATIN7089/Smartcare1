import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import VoiceActionModal from '../components/VoiceActionModal.jsx';
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
  Heart, 
  ChevronRight,
  TrendingUp,
  Smile
} from 'lucide-react';

export default function ElderlyDashboard() {
  const { user, reminders, handleToggleReminder, cognitiveProfile, culturalRegion, t } = useApp();
  const navigate = useNavigate();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const hours = new Date().getHours();
  const greetingText = hours < 12 
    ? t('good_morning', 'Good Morning') 
    : hours < 17 
    ? t('good_afternoon', 'Good Afternoon') 
    : t('good_evening', 'Good Evening');

  const activities = [
    {
      title: 'Memory Match',
      desc: 'Match familiar cards',
      tag: 'Memory',
      icon: Brain,
      route: '/games/memory',
      color: 'bg-emerald-500 text-white',
      cardBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
    },
    {
      title: 'Attention Order',
      desc: 'Remember the sequence',
      tag: 'Attention',
      icon: Target,
      route: '/games/attention',
      color: 'bg-sky-500 text-white',
      cardBg: 'bg-sky-50/70 border-sky-200 text-sky-950'
    },
    {
      title: 'Pattern Match',
      desc: 'Find the next shape',
      tag: 'Pattern',
      icon: Puzzle,
      route: '/games/pattern',
      color: 'bg-indigo-500 text-white',
      cardBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
    },
    {
      title: 'Daily Recall',
      desc: 'Remember your morning',
      tag: 'Recall',
      icon: Calendar,
      route: '/games/daily-recall',
      color: 'bg-amber-500 text-white',
      cardBg: 'bg-amber-50/70 border-amber-200 text-amber-950'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Warm App Greeting & AI Recommendation */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {greetingText}, {user?.name?.split(' ')[0] || 'Asha'} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-0.5">{t('dash_ready')}</p>
          </div>

          {/* AI Recommendation Pill */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>{t('dash_ai_suggestion')} {t('dash_ai_tip')}</span>
          </div>
        </div>
      </div>

      {/* 2. Large Voice Assistant Microphone Card */}
      <div className="bg-gradient-to-r from-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-700/15 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          {/* Big Voice Button */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white text-teal-700 hover:bg-teal-50 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition flex-shrink-0 min-h-[56px] min-w-[56px]"
            aria-label={t('shell_talk')}
          >
            <Mic className="w-9 h-9 sm:w-10 sm:h-10 text-teal-600 animate-pulse" />
          </button>
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('shell_talk')}
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm max-w-md leading-relaxed">{t('dash_say')}<strong className="text-white">{t('dash_sample_game')}</strong>, <strong className="text-white">{t('dash_sample_breath')}</strong>, or <strong className="text-white">{t('dash_sample_reminders')}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setVoiceModalOpen(true)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/30 flex items-center gap-2 transition hover:scale-102 min-h-[48px] z-10 whitespace-nowrap"
        >
          <span>{t('dash_tap_to_speak')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Today's Activities */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{t('dash_today_activities')}</span>
          </h2>
          <Link
            to="/games"
            className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>{t('dash_all_activities')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {activities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Link
                key={idx}
                to={act.route}
                className={`p-5 rounded-3xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[140px] ${act.cardBg}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${act.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                      {act.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-snug">{act.title}</h3>
                    <p className="text-xs opacity-75 mt-0.5">{act.desc}</p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end text-xs font-bold opacity-80">
                  <span className="flex items-center gap-1">{t('dash_play_now')}<ChevronRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Today's Reminders & Well-being Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Reminders (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                ⏰
              </div>
              <h2 className="text-xl font-black text-slate-900">{t('dash_today_reminders')}</h2>
            </div>
            <Link to="/reminders" className="text-xs font-bold text-teal-600 hover:underline">{t('dash_view_all')}</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reminders.slice(0, 3).map((rem) => (
              <button
                key={rem.id}
                onClick={() => handleToggleReminder(rem.id)}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between gap-3 min-h-[56px] select-none ${
                  rem.completed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 flex-shrink-0 ${
                      rem.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">{rem.time}</span>
                    <span className={`text-xs sm:text-sm font-bold ${rem.completed ? 'line-through opacity-70' : ''}`}>
                      {rem.title}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Well-being Card (1 Col) */}
        <div className="bg-gradient-to-br from-rose-50 to-teal-50 rounded-3xl p-6 sm:p-7 border border-rose-200/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-700">
              <Wind className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">{t('dash_wellbeing')}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">{t('dash_deep_breath')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('dash_breath_desc')}</p>
          </div>

          <Link
            to="/breathing"
            state={{ autostart: true }}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold p-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition min-h-[48px]"
          >
            <span>{t('dash_breathe_now')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5. Simplified "Your Progress" Card (Section 2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-xl">
            {cognitiveProfile?.overallScore || 81}%
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">{t('dash_your_progress')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t('dash_steady_level')}<strong className="text-teal-700">{cognitiveProfile?.difficultyLevel || 'Moderate'}</strong>
            </p>
          </div>
        </div>

        <Link
          to="/profile"
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-slate-200 flex items-center gap-2 transition min-h-[44px]"
        >
          <span>{t('dash_view_progress')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Global Voice Modal */}
      <VoiceActionModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
}
