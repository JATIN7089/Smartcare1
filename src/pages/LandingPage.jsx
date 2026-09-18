import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Brain, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Users, 
  Stethoscope, 
  Wind, 
  Bell, 
  Mic, 
  MapPin, 
  Award,
  ChevronRight,
  Clock,
  Coffee,
  Layers
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function LandingPage() {
  const { setDemoTourStep, setRole, user, culturalRegion, t } = useApp();
  const navigate = useNavigate();

  const handleStartElderly = () => {
    setRole('elderly');
    navigate('/elderly');
  };

  const handleStartDemo = () => {
    setDemoTourStep(1);
    setRole('elderly');
    navigate('/elderly');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-teal-50/70 via-sky-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <Award className="w-4 h-4 text-teal-700" />
                <span>Smart India Hackathon 2026 • Problem Statement 26003</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Helping Memories <span className="text-teal-600">{t('lp_active')}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                An AI-powered cognitive gaming and memory assistance platform designed for elderly users, families and healthcare workers across the North Eastern Region.
              </p>

              {/* Tagline Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>{t('lp_play')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>{t('lp_recall')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>{t('lp_connected')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>{t('lp_better')}</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={handleStartElderly}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-teal-600/20 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 min-h-[48px]"
                >
                  <span>{t('lp_start')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleStartDemo}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold px-6 py-3.5 rounded-2xl text-base shadow-md transition flex items-center gap-2 min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-amber-950" />
                  <span>{t('lp_demo')}</span>
                </button>
              </div>

              {/* Ministry and Team Tag */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-rose-500" /> Ministry of Development of North Eastern Region (MDoNER)
                </span>
                <span>•</span>
                <span className="font-bold text-teal-800">{t('lp_team')}</span>
              </div>
            </div>

            {/* Hero Right Visual: Realistic Tablet/Mobile Interface Simulation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md bg-white border-8 border-slate-900 rounded-[40px] shadow-2xl p-4 sm:p-5 space-y-4 ring-1 ring-slate-900/10">
                {/* Device Camera Notch */}
                <div className="w-20 h-4 bg-slate-900 rounded-b-xl mx-auto -mt-4 mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>

                {/* Simulated Senior Screen */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase">{t('lp_place')}</span>
                      <h3 className="font-black text-slate-900 text-sm">{t('lp_gm')}</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Level: Moderate
                    </span>
                  </div>

                  {/* Simulated Progress */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>{t('lp_today')}</span>
                      <span className="text-teal-700">{t('lp_done')}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full w-4/5 rounded-full" />
                    </div>
                  </div>

                  {/* Micro Activity Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                      <Brain className="w-4 h-4 text-teal-700 mb-1" />
                      <span className="font-bold text-slate-900 block">{t('gm_memory_title')}</span>
                      <span className="text-[10px] text-teal-800 font-semibold">{t('lp_acc')}</span>
                    </div>
                    <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
                      <Wind className="w-4 h-4 text-sky-700 mb-1" />
                      <span className="font-bold text-slate-900 block">{t('lp_card_bp')}</span>
                      <span className="text-[10px] text-sky-800 font-semibold">{t('lp_cycles')}</span>
                    </div>
                  </div>

                  {/* Simulated Reminder */}
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                    <Bell className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">{t('lp_med')}</span>
                      <span className="text-[10px] text-amber-800">{t('lp_medtime')}</span>
                    </div>
                  </div>

                  {/* Big Voice Mic Simulation button */}
                  <button
                    onClick={() => navigate('/assistant')}
                    className="w-full bg-gradient-to-r from-teal-600 to-sky-600 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>{t('assistant_title')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Safety Notice immediately visible under Hero */}
          <div className="mt-12">
            <DisclaimerBanner />
          </div>
        </div>
      </section>

      {/* Triad Ecosystem: For Elderly, For Caregivers, For Healthcare Workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
            Connected Care Ecosystem
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            One Unified Platform. Three Empowered Roles.
          </h2>
          <p className="text-sm text-slate-600">
            SmarTCARE seamlessly unites the elderly individual, family caregivers, and primary health workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Persona 1: Elderly User */}
          <div className="bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  For Elderly Seniors
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{t('lp_dignity')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Simple, large-target touch controls with local North Eastern cultural imagery, voice guidance, structured routines, and paced breathing.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" />{t('lp_g7')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" />{t('lp_bp')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" />{t('lp_off')}</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setRole('elderly');
                navigate('/elderly');
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{t('lp_explore')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Persona 2: Caregiver */}
          <div className="bg-white rounded-3xl p-8 border-2 border-sky-200 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  For Family Caregivers
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{t('lp_peace')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Realtime adherence monitoring, explainable activity shift alerts, memory lane curation, and secure join-code senior linking.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" />{t('lp_charts')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" />{t('lp_alerts')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" />{t('lp_join')}</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setRole('caregiver');
                navigate('/caregiver');
              }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{t('lp_open_cg')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Persona 3: Healthcare Workers */}
          <div className="bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  For Healthcare Workers
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{t('lp_community')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Primary Health Center (PHC) cohort analytics, structured supportive activity plans, and clinical timeline synchronization.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" />{t('lp_cohort')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" />{t('lp_prescribe')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" />{t('lp_safety')}</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setRole('healthcare');
                navigate('/healthcare');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{t('lp_open_hc')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8 States Cultural Adaptability Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-700 via-teal-800 to-sky-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Regional North Eastern Cultural Inclusivity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Tailored for Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura & Sikkim
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              We never assume a senior’s heritage. The platform features indigenous textiles (Gamosa, Puan), local crafts (bamboo cane baskets, Jaapi), regional music (Bihu, singing bowls), and dialect options.
            </p>
          </div>

          <Link
            to="/cultural-mode"
            className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-md transition flex items-center gap-2 flex-shrink-0"
          >
            <span>{t('lp_cultural')}</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </Link>
        </div>
      </section>
    </div>
  );
}
