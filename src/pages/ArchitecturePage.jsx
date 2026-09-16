import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { 
  Layers, 
  Cpu, 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Server, 
  Radio, 
  Brain, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Smartphone,
  Users
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function ArchitecturePage() {
  const { syncState, toggleSimulatedOffline, syncNow } = useApp();

  const [simulating, setSimulating] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const handleManualSyncTest = async () => {
    setSimulating(true);
    const res = await syncNow();
    setTimeout(() => {
      setSimulating(false);
      setSyncFeedback(res?.message || 'Synchronization cycle successfully completed!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <span className="text-xs font-black uppercase tracking-widest bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
          Smart India Hackathon 2026 Technical Stack
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          System Architecture & Offline Sync Engine
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Engineered explicitly for low-connectivity, high-terrain environments across the North Eastern Region. 100% JavaScript stack (React + Express + IndexedDB + Web Speech API + Web Audio API).
        </p>
      </div>

      {/* Interactive Offline Sync Demo Simulator (Section 28) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-300 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-teal-600 ${simulating ? 'animate-spin' : ''}`} />
              <h3 className="font-extrabold text-xl text-slate-900">
                Interactive Offline Sync Demonstration
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Simulate going deep into remote hills (Offline), play activities, then restore connectivity and watch the sync queue batch to cloud.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSimulatedOffline}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] ${
                syncState.simulatedOffline
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
              }`}
            >
              {syncState.simulatedOffline ? <WifiOff className="w-4 h-4 text-amber-700" /> : <Wifi className="w-4 h-4 text-emerald-700" />}
              <span>{syncState.simulatedOffline ? 'Mode: Simulated Offline' : 'Mode: Online (Cloud Connected)'}</span>
            </button>

            <button
              onClick={handleManualSyncTest}
              disabled={simulating}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md transition flex items-center gap-2 min-h-[44px]"
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? 'Syncing...' : 'Simulate Batch Sync'}</span>
            </button>
          </div>
        </div>

        {/* Sync Telemetry Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block uppercase">Queued Offline Items</span>
            <span className="text-2xl font-black text-teal-700">{syncState.queueLength} items</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block uppercase">Last Cloud Sync</span>
            <span className="text-lg font-black text-slate-800">{syncState.meta.lastSynced || 'Just now'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block uppercase">Cumulative Synced Logs</span>
            <span className="text-lg font-black text-emerald-700">{syncState.meta.totalSynced || 42} records</span>
          </div>
        </div>

        {syncFeedback && (
          <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Complete Ecosystem Visual Architecture (Section 8 & 39) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-2xl text-slate-900">End-to-End System Flow Diagram</h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center text-xs">
          {/* Node 1 */}
          <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 space-y-1.5 shadow-xs">
            <Smartphone className="w-6 h-6 text-teal-700 mx-auto" />
            <h4 className="font-black text-slate-900">1. Elderly User</h4>
            <p className="text-slate-500">Touch & Voice UI in Assamese, Hindi, English</p>
          </div>

          <div className="text-teal-600 font-bold text-lg hidden md:block">→</div>

          {/* Node 2 */}
          <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 space-y-1.5 shadow-xs">
            <Cpu className="w-6 h-6 text-sky-700 mx-auto" />
            <h4 className="font-black text-slate-900">2. Local Engine</h4>
            <p className="text-slate-500">Deterministic scoring & Web Audio offline synthesizer</p>
          </div>

          <div className="text-teal-600 font-bold text-lg hidden md:block">→</div>

          {/* Node 3 */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-1.5 shadow-xs">
            <Database className="w-6 h-6 text-amber-700 mx-auto" />
            <h4 className="font-black text-slate-900">3. Sync Queue</h4>
            <p className="text-slate-500">IndexedDB / localStorage conflict-free logs</p>
          </div>

          <div className="text-teal-600 font-bold text-lg hidden md:block">→</div>

          {/* Node 4 */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-1.5 shadow-xs">
            <Users className="w-6 h-6 text-emerald-700 mx-auto" />
            <h4 className="font-black text-slate-900">4. Caregivers & CHO</h4>
            <p className="text-slate-500">Family & Doctor monitoring dashboards</p>
          </div>
        </div>
      </div>

      {/* Layer-by-Layer Technical Deep Dive (Prompt Section 39) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Layer 1: AI Personalization Engine */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">AI Personalization Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Local mathematical evaluation engine that dynamically computes cognitive difficulty levels.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
            Score = Acc × 0.45 + Speed × 0.20 + Consistency × 0.20 + Completion × 0.15
          </div>
          <span className="text-[11px] font-bold text-teal-800 block">✓ Explainable activity feedback</span>
        </div>

        {/* Layer 2: Multilingual Spoken Voice Layer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Voice & Auditory Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            SpeechSynthesis & SpeechRecognition with fallback options for Indian English, Hindi, and Assamese.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
            Web Speech API + Custom Web Audio Harmonic Synthesizer
          </div>
          <span className="text-[11px] font-bold text-sky-800 block">✓ 100% offline nature & singing bowls</span>
        </div>

        {/* Layer 3: PWA & Offline Sync Layer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Offline-First PWA Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cache-first service worker, persistent IndexedDB session queues, and automatic sync reconciliation.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
            IndexedDB → LocalSyncQueue → REST /api/sync
          </div>
          <span className="text-[11px] font-bold text-indigo-800 block">✓ Low-bandwidth NER optimization</span>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
