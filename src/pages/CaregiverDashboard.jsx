import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { ALERT_KEYS, STATUS_KEYS } from '../data/translations.js';
import { LiveBadge } from '../components/LiveToast.jsx';
import { 
  Users, 
  Activity, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Brain, 
  ShieldCheck, 
  HeartHandshake, 
  Clock,
  Send
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function CaregiverDashboard() {
  const { alerts, handleDismissAlert, t, user } = useApp();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState(null);
  const [encouragementText, setEncouragementText] = useState('');
  const [encouragementSent, setEncouragementSent] = useState(false);

  useEffect(() => {
    loadPatients();
    // Refresh the instant the senior completes anything (server push).
    const unsubscribe = api.subscribeLive(evt => {
      if (evt.kind !== 'hello') loadPatients();
    });
    return unsubscribe;
  }, []);

  const loadPatients = async () => {
    const data = await api.getConnectedPatients();
    if (data && data.length) {
      setPatients(data);
    }
  };

  const handleLinkCode = async (e) => {
    e.preventDefault();
    setJoinStatus({ loading: true });
    const res = await api.linkCaregiver(joinCodeInput.trim().toUpperCase());
    if (res.success) {
      setJoinStatus({ success: true, message: res.message });
      setJoinCodeInput('');
    } else {
      setJoinStatus({ error: true, message: res.message || 'Invalid code' });
    }
  };

  const sendEncouragement = (e) => {
    e.preventDefault();
    if (!encouragementText.trim()) return;
    setEncouragementSent(true);
    setTimeout(() => {
      setEncouragementText('');
      setEncouragementSent(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
              {t('cg_portal')}
            </span>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {user?.name || 'Sunita Sharma'} {t('cg_rel_daughter')}
            </span>
          </div>
          <LiveBadge /> <h1 className="text-3xl font-black text-slate-900 mt-1">
            {t('cg_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t('cg_sub')}
          </p>
        </div>

        {/* Join Code Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-1.5 min-w-[260px]">
          <span className="text-[11px] font-bold text-slate-500 uppercase">{t('cg_join').replace('{name}', 'Asha')}</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-teal-800 font-mono tracking-widest">SMT-4821</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {t('cg_verified')}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('cg_st_sen')}</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">3</span>
          <span className="text-xs text-teal-600 font-semibold mt-1 block">{t('cg_st_sen_sub')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('cg_st_ses')}</span>
          <span className="text-3xl font-black text-teal-700 mt-1 block">3</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('cg_st_ses_sub')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('cg_st_adh')}</span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">88%</span>
          <span className="text-xs text-slate-400 mt-1 block">{t('cg_st_adh_sub').replace('{done}', '4').replace('{total}', '5')}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">{t('cg_st_alt')}</span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">{alerts.length}</span>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">{t('cg_st_alt_sub')}</span>
        </div>
      </div>

      {/* Active Activity Alerts (Explainable as required) */}
      {alerts.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-base text-amber-950">{t('cg_alerts_head')}</h3>
            </div>
            <Link to="/caregiver/alerts" className="text-xs font-bold text-amber-800 hover:underline">
              {t('cg_view_all').replace('{n}', alerts.length)}
            </Link>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{t((ALERT_KEYS[alert.id] || {}).title || '', alert.title)}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      Asha Sharma
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t((ALERT_KEYS[alert.id] || {}).reason || '', alert.reason)}</p>
                  <p className="text-[11px] text-teal-800 font-semibold">{t('cg_reco')} {t((ALERT_KEYS[alert.id] || {}).reco || '', alert.recommendation)}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    {t('cg_ack')}
                  </button>
                  <Link
                    to="/caregiver/patients/user-asha-68"
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    {t('cg_inspect')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Patients List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">{t('cg_assigned')}</h2>
          <span className="text-xs text-slate-500 font-medium">{t('cg_assigned_sub')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patients.map(patient => (
            <div
              key={patient.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{patient.name}</h3>
                    <span className="text-xs text-slate-500">{t('cg_age')} {patient.age} • {patient.location}</span>
                  </div>
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                    patient.status === 'Stable activity'
                      ? 'bg-emerald-100 text-emerald-900'
                      : patient.status === 'Activity changed'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}>
                    {t(STATUS_KEYS[patient.status] || '', patient.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{t('cg_mem_trend')}</span>
                    <span className="font-bold text-slate-800">{patient.memoryTrend}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{t('cg_rem')}</span>
                    <span className="font-bold text-slate-800">{patient.remindersAdherence}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{t('cg_last')}</span>
                    <span className="font-bold text-teal-700">{patient.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/caregiver/patients/${patient.id}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 w-full justify-center min-h-[44px]"
                >
                  <span>{t('cg_view_charts')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Caregiver Actions & Encouragement Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send Encouragement Audio/Text */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-500" />
            <span>{t('cg_send_enc').replace('{name}', 'Asha')}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {t('cg_enc_sub')}
          </p>

          <form onSubmit={sendEncouragement} className="space-y-3">
            <input
              type="text"
              value={encouragementText}
              onChange={(e) => setEncouragementText(e.target.value)}
              placeholder={t('cg_enc_ph')}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between items-center">
              {encouragementSent && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sent to Asha's device!
                </span>
              )}
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 ml-auto shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Send Encouragement
              </button>
            </div>
          </form>
        </div>

        {/* Link Senior with Join Code */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Link Another Senior with Join Code</span>
          </h3>
          <p className="text-xs text-slate-500">
            Enter the 8-character pairing code generated on the senior's tablet (e.g. SMT-4821).
          </p>

          <form onSubmit={handleLinkCode} className="flex gap-2">
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="e.g. SMT-4821"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
            >
              Verify Code
            </button>
          </form>

          {joinStatus?.message && (
            <p className={`text-xs font-semibold ${joinStatus.success ? 'text-emerald-700' : 'text-rose-600'}`}>
              {joinStatus.message}
            </p>
          )}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
