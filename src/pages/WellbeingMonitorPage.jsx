import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { sensorSimulator } from '../services/sensorSimulator.js';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  Radio, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  Bluetooth
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function WellbeingMonitorPage() {
  const { breathingSessions, t } = useApp();
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [telemetry, setTelemetry] = useState({
    heartRate: 72,
    respiratoryRate: 14,
    heartRateVariability: 58,
    skinConductance: 3.24,
    isCalm: true,
    signalQuality: 'Good (98%)',
    timestamp: 'Just now',
    isSimulation: true
  });

  useEffect(() => {
    // Automatically initiate demo sensor stream
    const info = sensorSimulator.connect((data) => {
      setTelemetry(data);
    });
    setDeviceConnected(true);

    return () => {
      sensorSimulator.disconnect();
    };
  }, []);

  const totalCyclesToday = breathingSessions.reduce((acc, s) => acc + (s.cyclesCompleted || 0), 0);
  const totalMinutes = Math.round(breathingSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/wellbeing"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />{t('wbm_back')}
        </Link>

        {/* Live Bluetooth demo status */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold">
          <Bluetooth className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{t('wbm_band')}</span>
        </div>
      </div>

      {/* Prominent Demo Data Notice */}
      <div className="bg-amber-500/10 border-2 border-amber-400 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <p className="font-extrabold uppercase tracking-wide text-amber-950">
            DEMO SIMULATION SENSOR DATA
          </p>
          <p>
            The physiological metrics below are <strong>{t('wbm_sim')}</strong>{t('wbm_sim2')}
          </p>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          🫁 Well-being & Pacing Monitor
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Live visualization of mindful paced respiration, calm tone indicators, and wearable telemetry streams.
        </p>
      </div>

      {/* Realtime Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('wbm_hr')}</span>
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{telemetry.heartRate}</span>
            <span className="text-xs font-bold text-slate-500">{t('wbm_bpm')}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{t('wbm_cad')}</span>
            <span className="text-rose-600 font-bold">{t('wbm_simtag')}</span>
          </div>
        </div>

        {/* Respiratory Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('wbm_rr')}</span>
            <Wind className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{telemetry.respiratoryRate}</span>
            <span className="text-xs font-bold text-slate-500">{t('wbm_rru')}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{t('wbm_pace')}</span>
            <span className="text-teal-600 font-bold">Simulated</span>
          </div>
        </div>

        {/* HRV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('wbm_hrv')}</span>
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{telemetry.heartRateVariability}</span>
            <span className="text-xs font-bold text-slate-500">ms</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{t('wbm_tone')}</span>
            <span className="text-indigo-600 font-bold">Simulated</span>
          </div>
        </div>

        {/* Skin Conductance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('wbm_gsr')}</span>
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{telemetry.skinConductance}</span>
            <span className="text-xs font-bold text-slate-500">µS</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{t('wbm_arouse')}</span>
            <span className="text-amber-600 font-bold">Simulated</span>
          </div>
        </div>
      </div>

      {/* Breathing Sessions Summary & Future Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breathing History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">{t('wbm_today')}</h3>
            <Link
              to="/breathing"
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              Start Session →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">{t('wbm_cycles')}</span>
              <span className="text-2xl font-black text-teal-700">{totalCyclesToday || 35}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">{t('wbm_minutes')}</span>
              <span className="text-2xl font-black text-teal-700">{totalMinutes || 7}m</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">{t('wbm_curpace')}</span>
              <span className="text-2xl font-black text-slate-800">4-2-6</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('wbm_recent')}</span>
            {breathingSessions.slice(0, 3).map((sess, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{sess.preset || '5 min'} Guided Pacer</span>
                  <span className="text-slate-400 block">{sess.date || 'Today'} • {sess.pace || '4-2-6'}</span>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {sess.cyclesCompleted || 10} cycles
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Wearable Integration Architecture diagram as required */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-lg text-white">{t('wbm_arch')}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for future low-cost BLE bands deployed by community health workers across the North Eastern Region:
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-teal-300 font-bold">{t('wbm_a1')}</span>
              <span className="text-slate-400">{t('wbm_a1s')}</span>
            </div>
            <div className="text-center text-teal-400 font-bold text-xs">{t('wbm_a1b')}</div>
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-sky-300 font-bold">{t('wbm_a2')}</span>
              <span className="text-slate-400">{t('wbm_a2s')}</span>
            </div>
            <div className="text-center text-teal-400 font-bold text-xs">{t('wbm_a2b')}</div>
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-indigo-300 font-bold">{t('wbm_a3')}</span>
              <span className="text-slate-400">{t('wbm_a3s')}</span>
            </div>
            <div className="text-center text-teal-400 font-bold text-xs">{t('wbm_a3b')}</div>
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-emerald-300 font-bold">{t('wbm_a4')}</span>
              <span className="text-slate-400">{t('wbm_a4s')}</span>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
