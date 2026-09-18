import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { 
  ShieldCheck, 
  Server, 
  Users, 
  Activity, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Layers, 
  MapPin, 
  Award 
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function AdminPage() {
  const [metrics, setMetrics] = useState({
    totalRegisteredUsers: 1420,
    activeElderlyUsersNER: 894,
    gamesCompletedTotal: 18450,
    offlineSessionsSynced: 3420,
    syncSuccessRate: '99.4%',
    reminderAdherenceRate: '86.2%',
    activeCaregivers: 920,
    healthcareWorkersConnected: 114,
    nerStateDistribution: {
      Assam: 480,
      Meghalaya: 145,
      ArunachalPradesh: 110,
      Manipur: 130,
      Nagaland: 125,
      Mizoram: 160,
      Tripura: 140,
      Sikkim: 130
    },
    systemStatus: 'Operational - Low Bandwidth Optimized'
  });

  useEffect(() => {
    api.getAdminMetrics().then(data => {
      if (data && data.totalRegisteredUsers) setMetrics(data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-500/20 text-teal-300 font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
              MDoNER Admin Console
            </span>
            <span className="text-xs text-slate-400">SIH 2026 Problem 26003</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Platform Infrastructure & Telemetry
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            System administration view for the Ministry of Development of North Eastern Region (MDoNER) monitoring offline-first deployments and telemetry across 8 states.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">{t('adm_health')}</span>
            <span className="text-sm font-extrabold text-emerald-300">{metrics.systemStatus}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('adm_seniors')}</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">{metrics.totalRegisteredUsers}</span>
          <span className="text-xs text-teal-600 font-semibold mt-1 block">{t('adm_active')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('adm_games')}</span>
          <span className="text-3xl font-black text-teal-700 mt-1 block">{metrics.gamesCompletedTotal.toLocaleString()}</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('adm_sessions')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('adm_synced')}</span>
          <span className="text-3xl font-black text-indigo-700 mt-1 block">{metrics.offlineSessionsSynced.toLocaleString()}</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('adm_engine')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('adm_rate')}</span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">{metrics.syncSuccessRate}</span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">{t('adm_zero')}</span>
        </div>
      </div>

      {/* NER State Deployment Distribution */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-600" />
          <span>{t('adm_enroll')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {Object.entries(metrics.nerStateDistribution || {}).map(([stateName, count]) => (
            <div key={stateName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">{stateName}</span>
              <span className="text-2xl font-black text-teal-800 block">{count}</span>
              <span className="text-[11px] text-slate-400">{t('adm_users')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Infrastructure Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 text-teal-700 font-bold mb-2">
            <Cpu className="w-5 h-5" />
            <span className="text-sm">{t('adm_edge')}</span>
          </div>
          <p className="text-slate-600">{t('adm_edge_sub')}</p>
          <span className="text-emerald-700 font-bold block pt-1">{t('adm_edge_st')}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 text-sky-700 font-bold mb-2">
            <Database className="w-5 h-5" />
            <span className="text-sm">{t('adm_storage')}</span>
          </div>
          <p className="text-slate-600">{t('adm_storage_sub')}</p>
          <span className="text-sky-700 font-bold block pt-1">{t('adm_storage_st')}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
            <Server className="w-5 h-5" />
            <span className="text-sm">{t('adm_api')}</span>
          </div>
          <p className="text-slate-600">{t('adm_api_sub')}</p>
          <span className="text-indigo-700 font-bold block pt-1">Endpoint: http://0.0.0.0:5000</span>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
