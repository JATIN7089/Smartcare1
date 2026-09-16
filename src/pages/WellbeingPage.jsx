import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Wind, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Bluetooth,
  Clock
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function WellbeingPage() {
  const { breathingSessions } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          Holistic Well-being & Mindfulness
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mt-3">
          Breathing, Grounding & Sensory Harmony
        </h1>
        <p className="text-teal-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Inspired by compassionate clinical care workflows, SmarTCARE offers soothing, paced respiration and present-moment grounding tailored for seniors across the North Eastern Region.
        </p>
      </div>

      {/* Primary Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tool 1: Breathing Pacer */}
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Wind className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Core Relaxation
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Breathing Pacer</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Visual animated circle with 4-2-6 rhythm and gentle voice guidance.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/breathing"
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 w-full min-h-[44px]"
            >
              <span>Start Breathing Pacer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tool 2: 5-4-3-2-1 Grounding */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Sensory Anchoring
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">5-4-3-2-1 Grounding</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Step-by-step calming exercise guiding seniors through the 5 senses.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/grounding"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 w-full min-h-[44px]"
            >
              <span>Begin Grounding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tool 3: Well-being Monitor */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Wearable Telemetry (Demo)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Well-being Monitor</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Simulated resting heart rate, respiratory rate, and BLE band sync architecture.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/wellbeing/monitor"
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 w-full min-h-[44px]"
            >
              <span>View Monitor Stream</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* History of Completed Breathing Sessions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Recorded Relaxation Sessions</h3>
        {breathingSessions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {breathingSessions.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.preset || 'Paced Breathing'} Session</h4>
                    <span className="text-xs text-slate-400">Pace: {item.pace || '4-2-6'} • Duration: {item.durationSeconds || 120}s</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {item.cyclesCompleted || 10} cycles completed
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No breathing sessions recorded today yet. Start a 2-minute session above!</p>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
