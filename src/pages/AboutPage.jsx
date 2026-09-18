import { useApp } from '../context/AppContext.jsx';
import React from 'react';
import { 
  Award, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Brain, 
  Heart, 
  Building, 
  Cpu, 
  FileCheck2 
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function AboutPage() {
  const { t } = useApp();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4 border border-slate-800">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30">
          <Award className="w-4 h-4" />
          <span>SMART INDIA HACKATHON 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          About SmarTCARE & Team Phantom techie
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          "Empowering elderly lives. Building healthier communities. A brighter North East."
        </p>
      </div>

      {/* Official SIH 2026 Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-sm space-y-5">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-teal-600" />
          <span>{t('ab_spec')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[11px]">{t('ab_psid')}</span>
            <span className="text-lg font-black text-teal-800">26003</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[11px]">{t('ab_team')}</span>
            <span className="text-lg font-black text-slate-900">Phantom techie</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[11px]">{t('ab_min')}</span>
            <span className="text-base font-black text-slate-800">
              Ministry of Development of North Eastern Region (MDoNER)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[11px]">{t('ab_theme')}</span>
            <span className="text-base font-black text-slate-800">
              Healthcare, Biomedical Devices & Assistive Technology (Software)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-1">
          <span className="font-extrabold uppercase tracking-wide text-teal-800 block">{t('ab_ptitle')}</span>
          <p className="font-semibold leading-relaxed">
            "AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)"
          </p>
        </div>
      </div>

      {/* Ethical Medical Safety Principles (Section 3 & 45) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{t('ab_safety')}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In strict compliance with medical ethics and software safety standards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 uppercase">{t('ab_not')}</span>
            <ul className="space-y-1.5 text-rose-800">
              <li>{t('ab_n1')}</li>
              <li>{t('ab_n2')}</li>
              <li>{t('ab_n3')}</li>
              <li>{t('ab_n4')}</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 uppercase">{t('ab_yes')}</span>
            <ul className="space-y-1.5 text-emerald-800">
              <li>{t('ab_y1')}</li>
              <li>{t('ab_y2')}</li>
              <li>{t('ab_y3')}</li>
              <li>{t('ab_y4')}</li>
            </ul>
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
