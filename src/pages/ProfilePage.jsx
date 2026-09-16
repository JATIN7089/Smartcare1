import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { 
  Brain, 
  Activity, 
  Calendar, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function ProfilePage() {
  const { cognitiveProfile, user } = useApp();
  const [showExplanation, setShowExplanation] = useState(false);

  const metrics = cognitiveProfile?.metrics || {
    memory: 82,
    attention: 74,
    pattern: 91,
    dailyRecall: 79,
    reactionTimeScore: 78,
    consistency: 85
  };

  const radarData = [
    { subject: 'Memory Recall', value: metrics.memory, fullMark: 100 },
    { subject: 'Attention & Focus', value: metrics.attention, fullMark: 100 },
    { subject: 'Pattern Logic', value: metrics.pattern, fullMark: 100 },
    { subject: 'Daily Routine Recall', value: metrics.dailyRecall, fullMark: 100 },
    { subject: 'Response Cadence', value: metrics.reactionTimeScore, fullMark: 100 },
    { subject: 'Engagement Consistency', value: metrics.consistency, fullMark: 100 }
  ];

  const trendData = cognitiveProfile?.sessionHistory || [
    { date: 'Sep 10', memory: 78, attention: 70, pattern: 88, recall: 75 },
    { date: 'Sep 11', memory: 80, attention: 72, pattern: 89, recall: 76 },
    { date: 'Sep 12', memory: 79, attention: 73, pattern: 90, recall: 78 },
    { date: 'Sep 13', memory: 81, attention: 71, pattern: 92, recall: 79 },
    { date: 'Sep 14', memory: 83, attention: 75, pattern: 90, recall: 80 },
    { date: 'Sep 15', memory: 82, attention: 74, pattern: 91, recall: 79 },
    { date: 'Sep 16', memory: 84, attention: 76, pattern: 93, recall: 81 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Asha Sharma'}</h1>
              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
                Age: {user?.age || 68}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.location || 'Tezpur, Assam (NER)'} • Senior Profile</p>
          </div>
        </div>

        {/* Level and Trend badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Adaptive Challenge Level</span>
            <span className="text-lg font-black text-teal-800">{cognitiveProfile?.difficultyLevel || 'Moderate'}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Activity Trend</span>
            <span className="text-lg font-black text-emerald-900 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" /> {cognitiveProfile?.recentTrend || 'Stable activity'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Explainability Card (As required by prompt) */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border-2 border-teal-300 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <h3 className="font-extrabold text-slate-900 text-base">Adaptive AI Activity Calibration</h3>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showExplanation ? 'Hide Reasoning' : 'Why was this activity selected?'}</span>
          </button>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          {cognitiveProfile?.explanation || "Based on your recent memory-game accuracy (84%) and steady response pace, SmarTCARE selected a moderate challenge level to maintain comfortable cognitive engagement without fatigue."}
        </p>

        {showExplanation && (
          <div className="bg-white rounded-2xl p-4 border border-teal-200 text-xs text-slate-600 space-y-2 animate-in fade-in">
            <p><strong>Transparency Formula:</strong> Score = (Accuracy × 0.45) + (Speed × 0.20) + (Consistency × 0.20) + (Completion × 0.15).</p>
            <p><strong>Adaptation Thresholds:</strong> Sustained accuracy above 85% gently increases card/symbol complexity to stimulate neuroplasticity. Scores below 55% or multiple mistakes automatically adjust the system to simpler, hint-assisted exercises to prevent fatigue.</p>
            <p className="text-amber-800 font-semibold">Important Medical Notice: This indicator tracks game interaction only and is strictly non-diagnostic.</p>
          </div>
        )}
      </div>

      {/* Visual Analytics Grid: Radar & Line Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>Cognitive Activity Profile (Multi-Domain)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Current balanced engagement across memory, attention, pattern recognition, and routine recall.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Asha's Activity" dataKey="value" stroke="#0d9488" fill="#14b8a6" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            <span>Weekly Engagement Trend (7 Days)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Multi-session tracking showing positive engagement trajectories across recent sessions.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="memory" name="Memory Recall" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pattern" name="Pattern Reasoning" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="recall" name="Routine Recall" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Memory Recall', val: `${metrics.memory}%`, tag: 'Strong', color: 'text-teal-700 bg-teal-50 border-teal-200' },
          { label: 'Attention Focus', val: `${metrics.attention}%`, tag: 'Stable', color: 'text-sky-700 bg-sky-50 border-sky-200' },
          { label: 'Pattern Logic', val: `${metrics.pattern}%`, tag: 'High', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { label: 'Routine Recall', val: `${metrics.dailyRecall}%`, tag: 'Reliable', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Response Pace', val: `${metrics.reactionTimeScore}%`, tag: 'Comfortable', color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Consistency', val: `${metrics.consistency}%`, tag: 'Consistent', color: 'text-purple-700 bg-purple-50 border-purple-200' }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${item.color} text-center space-y-1`}>
            <span className="text-[11px] font-bold block opacity-80">{item.label}</span>
            <span className="text-2xl font-black block">{item.val}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-90">{item.tag}</span>
          </div>
        ))}
      </div>

      {/* Mandatory Non-Clinical Statement as required by prompt */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 space-y-1 border border-slate-200">
        <p className="font-bold text-slate-800">
          Non-Diagnostic Platform Policy:
        </p>
        <p>
          "These indicators describe interaction with SmarTCARE activities and are not clinical measurements. SmarTCARE does not diagnose, predict, or evaluate dementia or any medical disease. Consider discussing persistent changes with a qualified healthcare professional."
        </p>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
