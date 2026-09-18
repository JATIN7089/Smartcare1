import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Calendar, 
  Check, 
  Clock, 
  Sun, 
  Coffee, 
  Droplets, 
  Brain, 
  Utensils, 
  BookOpen, 
  Stethoscope, 
  Users, 
  Moon, 
  Bed, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

const ICON_MAP = {
  Sun,
  Coffee,
  Droplets,
  Brain,
  Utensils,
  BookOpen,
  Stethoscope,
  Users,
  Moon,
  Bed
};

export default function RoutinePage() {
  const { routine, handleToggleRoutine, role } = useApp();
  const [showCustomize, setShowCustomize] = useState(false);

  const completedCount = routine.filter(r => r.done).length;
  const progressPercent = Math.round((completedCount / (routine.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-teal-700 tracking-wider">{t('rou_title')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">{t('rou_structured')}</h1>
          <p className="text-xs sm:text-sm text-slate-600">{t('rou_sub')}</p>
        </div>

        {/* Progress summary badge */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center min-w-[140px]">
          <span className="text-xs font-bold text-teal-800 block">{t('rou_today')}</span>
          <span className="text-2xl font-black text-teal-900">{progressPercent}%</span>
          <span className="text-[11px] text-teal-700 block">{completedCount} of {routine.length} done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-teal-500 to-emerald-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-teal-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6 py-2">
        {routine.map((item, idx) => {
          const IconComp = ICON_MAP[item.icon] || Clock;
          return (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl p-4 sm:p-5 border-2 transition flex items-center justify-between gap-4 ${
                item.done
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-teal-400 shadow-sm'
              }`}
            >
              {/* Timeline Dot Marker */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-white text-xs ${
                  item.done ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-teal-500 text-teal-600 font-bold'
                }`}
              >
                {item.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : (idx + 1)}
              </div>

              {/* Item Info */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${
                    item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      {item.time}
                    </span>
                  </div>
                  <h3
                    className={`font-bold text-base sm:text-lg text-slate-900 mt-1 ${
                      item.done ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {item.label}
                  </h3>
                </div>
              </div>

              {/* Big Touch Target Toggle (Min 44px) */}
              <button
                onClick={() => handleToggleRoutine(idx)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 transition flex-shrink-0 ${
                  item.done
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 hover:border-teal-600 text-slate-400'
                }`}
                aria-label={`Toggle routine ${item.label}`}
              >
                <Check className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          );
        })}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
