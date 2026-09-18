import React from 'react';
import { Link } from 'react-router-dom';
import { 
  WifiOff, 
  MapPin, 
  Languages, 
  Users, 
  Clock, 
  Brain, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function ProblemPage() {
  const problemCards = [
    {
      id: 1,
      title: 'Geographic Remoteness & Limited Clinical Access',
      icon: MapPin,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      description: 'Hilly terrain, distant sub-district hospitals, and seasonal monsoons in the North Eastern Region isolate elderly individuals from specialized neuropsychiatric and cognitive therapy facilities.'
    },
    {
      id: 2,
      title: 'Low-Connectivity & Intermittent Cellular Networks',
      icon: WifiOff,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description: 'Cloud-dependent health apps fail consistently in rural valleys and remote hill stations. Without robust local-first offline caching, daily cognitive routines are abruptly interrupted.'
    },
    {
      id: 3,
      title: 'Language & Cultural Incongruity in Brain Games',
      icon: Languages,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'Mainstream cognitive platforms use Western icons, foreign vocabulary, and sterile puzzles that confuse North Eastern seniors. Cultural disconnection produces anxiety instead of therapeutic stimulation.'
    },
    {
      id: 4,
      title: 'Caregiver Burnout & Ineffective Trend Visibility',
      icon: Users,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      description: 'Family caregivers and community health workers (ASHAs/CHOs) lack objective daily engagement records. Subtle cognitive and adherence shifts go unnoticed until acute behavioral changes occur.'
    },
    {
      id: 5,
      title: 'Difficulty Remembering Daily Living Routines',
      icon: Clock,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Age-associated memory decline disrupts hydration, blood pressure medications, and meal timing. Seniors experience disorientation without a calm, compassionate circadian structure.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-full border border-rose-500/30">
            Smart India Hackathon 2026 • Problem Statement ID: 26003
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          The Cognitive Care Dilemma in the North East
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Ministry of Development of North Eastern Region (MDoNER) identified critical barriers facing seniors with progressive cognitive challenges and their dedicated caregivers.
        </p>
      </div>

      {/* 5 Clean Cards (As required by prompt Section 7) */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">{t('prob_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`p-6 rounded-3xl border-2 transition hover:shadow-md bg-white ${
                  idx === 4 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Barrier 0{card.id}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA to Solution */}
      <div className="bg-teal-50 border-2 border-teal-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-xl text-teal-950">{t('prob_sol')}</h3>
          <p className="text-xs sm:text-sm text-teal-800 mt-1">
            Explore how our local-first AI ecosystem overcomes each of these five regional challenges.
          </p>
        </div>
        <Link
          to="/solution"
          className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <span>{t('prob_view')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
