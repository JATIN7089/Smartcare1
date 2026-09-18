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
import JoinCodeCard from '../components/JoinCodeCard.jsx';

export default function ProfilePage() {
  const { cognitiveProfile, user, t } = useApp();
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
    { subject: t('prm_memory'), value: metrics.memory, fullMark: 100 },
    { subject: t('prm_attention'), value: metrics.attention, fullMark: 100 },
    { subject: t('prm_pattern'), value: metrics.pattern, fullMark: 100 },
    { subject: t('prm_routine'), value: metrics.dailyRecall, fullMark: 100 },
    { subject: t('prm_cadence'), value: metrics.reactionTimeScore, fullMark: 100 },
    { subject: t('prm_consistency'), value: metrics.consistency, fullMark: 100 }
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
          <span className="text-[11px] font-bold text-slate-500 uppercase block">{t('prof_challenge')}</span>
          <span className="text-lg font-black text-teal-800">{cognitiveProfile?.difficultyLevel || 'Moderate'}</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-center">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">{t('prof_trend')}</span>
          <span className="text-lg font-black text-emerald-900 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" /> {cognitiveProfile?.recentTrend || 'Active & Steady'}
          </span>
        </div>
      </div>
    </div>

    {/* Friendly Personalization Explanation */}
    <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border-2 border-teal-200 rounded-3xl p-6 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-700" />
          <h3 className="font-extrabold text-slate-900 text-base">{t('prof_adapts')}</h3>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs min-h-[36px]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showExplanation ? 'Hide Details' : 'Why this level?'}</span>
        </button>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        {cognitiveProfile?.explanation || "Based on your steady activity and accurate memory matches, SmarTCARE keeps exercises comfortable and engaging without fatigue."}
      </p>

      {showExplanation && (
        <div className="bg-white rounded-2xl p-4 border border-teal-200 text-xs text-slate-600 space-y-2 animate-in fade-in">
          <p><strong>{t('prof_balance')}</strong>{t('prof_unlock')}</p>
        </div>
      )}
    </div>

    {/* The code a new caregiver needs while registering. It lives here because
        the senior's phone is the one place a family member can actually read
        it off — the caregiver dashboard is locked until they already have an
        account. */}
    <JoinCodeCard />

    {/* Visual Grid: Radar & Line Trend */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span>{t('prof_your_balance')}</span>
        </h3>
        <p className="text-xs text-slate-500">{t('prof_balance_desc')}</p>

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
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-600" />
          <span>{t('prof_7day')}</span>
        </h3>
        <p className="text-xs text-slate-500">{t('prof_7day_desc')}</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="memory" name={t('prm_memory')} stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pattern" name={t('prl_reasoning')} stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="recall" name={t('prl_routine')} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: t('prm_memory'), val: `${metrics.memory}%`, tag: t('prs_strong'), color: 'text-teal-700 bg-teal-50 border-teal-200' },
          { label: t('prm_attfocus'), val: `${metrics.attention}%`, tag: t('prs_stable'), color: 'text-sky-700 bg-sky-50 border-sky-200' },
          { label: t('prm_pattern'), val: `${metrics.pattern}%`, tag: t('prs_high'), color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { label: t('prl_routine'), val: `${metrics.dailyRecall}%`, tag: t('prs_reliable'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: t('prm_pace'), val: `${metrics.reactionTimeScore}%`, tag: t('prs_comfortable'), color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: t('prm_cons'), val: `${metrics.consistency}%`, tag: t('prs_consistent'), color: 'text-purple-700 bg-purple-50 border-purple-200' }
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
        <p className="font-bold text-slate-800">{t('prof_policy')}</p>
        <p>{t('prof_quote')}</p>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
