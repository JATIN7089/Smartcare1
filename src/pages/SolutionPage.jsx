import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  Mic, 
  Heart, 
  Wind, 
  Users, 
  Wifi, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Database,
  Smartphone
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function SolutionPage() {
  const pillars = [
    { title: 'Cognitive Games', icon: Brain, desc: '7 working games targeting memory, sequence, pattern logic, and routine recall.', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'AI Personalization', icon: Sparkles, desc: 'Mathematical performance calibration adjusting difficulty without sudden jumps.', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { title: 'Role-Aware Voice Assistant', icon: Mic, desc: 'Natural spoken interactions in Assamese, Hindi, and Indian English.', color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { title: 'Family Memory Lane', icon: Heart, desc: 'Personalized reminiscence cards connecting seniors to beloved faces and festivals.', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Well-being & 4-2-6 Breathing', icon: Wind, desc: 'Calming respiratory pacer and 5-4-3-2-1 sensory grounding tools.', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'Caregiver Portal & Trends', icon: Users, desc: 'Objective adherence monitoring, join-code pairing, and non-stigmatizing alerts.', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Offline-First PWA Sync', icon: Wifi, desc: 'Zero-drop performance in remote hill stations with local IndexedDB queuing.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3">
        <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          The SmarTCARE Solution
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          A Complete Connected Care Ecosystem
        </h1>
        <p className="text-teal-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          From playing an engaging cognitive game, to understanding the senior's activity pattern, to adapting the next activity, to supporting daily routines, to keeping caregivers informed—even when offline.
        </p>
      </div>

      {/* Visual System Architecture (Prompt Section 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-xl text-slate-900">{t('sol_flow')}</h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs">
          <div className="w-full md:w-36 bg-teal-50 border-2 border-teal-300 rounded-2xl p-4">
            <Smartphone className="w-6 h-6 text-teal-700 mx-auto mb-1" />
            <span className="font-extrabold text-slate-900 block">{t('sol_1')}</span>
            <span className="text-[10px] text-slate-500">{t('sol_1s')}</span>
          </div>

          <div className="text-teal-600 font-bold text-lg rotate-90 md:rotate-0">→</div>

          <div className="w-full md:w-36 bg-sky-50 border-2 border-sky-300 rounded-2xl p-4">
            <Brain className="w-6 h-6 text-sky-700 mx-auto mb-1" />
            <span className="font-extrabold text-slate-900 block">SmarTCARE APP</span>
            <span className="text-[10px] text-slate-500">{t('sol_2s')}</span>
          </div>

          <div className="text-teal-600 font-bold text-lg rotate-90 md:rotate-0">→</div>

          <div className="w-full md:w-36 bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-4">
            <Sparkles className="w-6 h-6 text-indigo-700 mx-auto mb-1" />
            <span className="font-extrabold text-slate-900 block">{t('sol_3')}</span>
            <span className="text-[10px] text-slate-500">{t('sol_3s')}</span>
          </div>

          <div className="text-teal-600 font-bold text-lg rotate-90 md:rotate-0">→</div>

          <div className="w-full md:w-36 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
            <Database className="w-6 h-6 text-amber-700 mx-auto mb-1" />
            <span className="font-extrabold text-slate-900 block">{t('sol_4')}</span>
            <span className="text-[10px] text-slate-500">{t('sol_4s')}</span>
          </div>

          <div className="text-teal-600 font-bold text-lg rotate-90 md:rotate-0">→</div>

          <div className="w-full md:w-36 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4">
            <Users className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
            <span className="font-extrabold text-slate-900 block">{t('sol_5')}</span>
            <span className="text-[10px] text-slate-500">{t('sol_5s')}</span>
          </div>
        </div>
      </div>

      {/* Seven Key Pillars Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">{t('sol_pillars')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
