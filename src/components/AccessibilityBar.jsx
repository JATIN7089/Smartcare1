import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Type, 
  Contrast, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Smile, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Eye,
  Globe
} from 'lucide-react';

export default function AccessibilityBar() {
  const {
    accessibility,
    setTextSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleVoiceEnabled,
    toggleSimpleLanguage,
    language,
    setLanguage,
    supportedLanguages
  } = useApp();

  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Accessibility Controls" className="fixed bottom-4 right-4 z-40 print:hidden">
      {/* Floating Toggle Button */}
      <div className="flex flex-col items-end gap-2">
        {expanded && (
          <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-4 w-72 sm:w-84 space-y-4 text-slate-800 transition-all transform animate-in slide-in-from-bottom-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Accessibility & Language</h3>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector (All 11 Languages) */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" /> Language (11 Languages)
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border-2 border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.native} — {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size controls */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-teal-600" /> Text Size
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'normal', label: 'Normal', sizeDesc: '100%' },
                  { id: 'large', label: 'Large', sizeDesc: '120%' },
                  { id: 'xlarge', label: 'X-Large', sizeDesc: '140%' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTextSize(item.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition min-h-[44px] flex flex-col items-center justify-center ${
                      accessibility.textSize === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.sizeDesc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between min-h-[44px] py-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-sm font-bold block text-slate-800">High Contrast</span>
                  <span className="text-xs text-slate-500">Sharper borders & text</span>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  accessibility.highContrast ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between min-h-[44px] py-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-sm font-bold block text-slate-800">Reduce Motion</span>
                  <span className="text-xs text-slate-500">Limits spinning animations</span>
                </div>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  accessibility.reducedMotion ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    accessibility.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Voice Guidance / Audio Feedback */}
            <div className="flex items-center justify-between min-h-[44px] py-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {accessibility.voiceEnabled ? (
                  <Volume2 className="w-4 h-4 text-teal-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-sm font-bold block text-slate-800">Voice Assistance</span>
                  <span className="text-xs text-slate-500">Spoken guidance & chimes</span>
                </div>
              </div>
              <button
                onClick={toggleVoiceEnabled}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  accessibility.voiceEnabled ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    accessibility.voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Simple Language Mode */}
            <div className="flex items-center justify-between min-h-[44px] py-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-sm font-bold block text-slate-800">Simple Language</span>
                  <span className="text-xs text-slate-500">Easiest words & prompts</span>
                </div>
              </div>
              <button
                onClick={toggleSimpleLanguage}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  accessibility.simpleLanguage ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    accessibility.simpleLanguage ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Trigger Button (Min 44px for accessibility) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="h-12 px-4 rounded-full bg-slate-900 text-white font-bold shadow-xl hover:bg-slate-800 border-2 border-white flex items-center gap-2 group transition"
          aria-label="Open accessibility toolbar"
        >
          <Eye className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm hidden sm:inline">Accessibility Controls</span>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
