import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Brain, 
  Heart,
  TrendingUp,
  Share2
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function CaregiverReportsPage() {
  const { user, cognitiveProfile } = useApp();
  const [range, setRange] = useState('7d'); // 7d, 30d, 90d
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const reportData = [
    { label: 'Mon', games: 2, accuracy: 82, adherence: 85, breathing: 10, responseTime: 3.2 },
    { label: 'Tue', games: 3, accuracy: 85, adherence: 90, breathing: 15, responseTime: 3.0 },
    { label: 'Wed', games: 2, accuracy: 80, adherence: 80, breathing: 10, responseTime: 3.1 },
    { label: 'Thu', games: 3, accuracy: 84, adherence: 90, breathing: 20, responseTime: 2.9 },
    { label: 'Fri', games: 4, accuracy: 88, adherence: 95, breathing: 25, responseTime: 2.8 },
    { label: 'Sat', games: 2, accuracy: 83, adherence: 85, breathing: 15, responseTime: 2.8 },
    { label: 'Sun', games: 3, accuracy: 86, adherence: 90, breathing: 20, responseTime: 2.7 }
  ];

  const handleExportSummary = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/caregiver"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />{t('cgr_back')}
        </Link>

        <div className="flex items-center gap-2">
          {/* Time range picker */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
            {['7d', '30d', '90d'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  range === r ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportSummary}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Summary Downloaded!' : 'Export Summary'}</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
            SmarTCARE Cognitive Activity & Well-being Progress Report
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Executive Activity Trends: Asha Sharma (Age 68)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Period: Last {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'} • Community Health Center: Sonitpur SDH, Assam
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase block">{t('cgr_games')}</span>
          <span className="text-3xl font-black text-teal-700 mt-1 block">19</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('cgr_games_sub')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase block">{t('cgr_acc')}</span>
          <span className="text-3xl font-black text-indigo-700 mt-1 block">84.2%</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">{t('cgr_acc_sub')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase block">{t('cgr_adh')}</span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">88%</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('cgr_adh_sub')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase block">{t('cgr_breath')}</span>
          <span className="text-3xl font-black text-sky-700 mt-1 block">115</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('cgr_breath_sub')}</span>
        </div>
      </div>

      {/* Chart 1: Accuracy & Reminder Adherence */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span>Accuracy Trend & Reminder Adherence ({range.toUpperCase()})</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tracking engagement accuracy alongside routine medicine and hydration completion.
        </p>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportData}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAdh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="accuracy" name="Game Accuracy (%)" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              <Area type="monotone" dataKey="adherence" name="Reminder Adherence (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Daily Game Completion & Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span>{t('cgr_sessions')}</span>
          </h3>
          <p className="text-xs text-slate-500">{t('cgr_sessions_sub')}</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="games" name="Sessions" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>{t('cgr_cadence')}</span>
          </h3>
          <p className="text-xs text-slate-500">{t('cgr_cadence_sub')}</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[2.0, 4.0]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="responseTime" name="Avg Response Time (s)" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
