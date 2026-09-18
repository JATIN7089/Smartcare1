import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  MessageSquare, 
  Info,
  Check
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function CaregiverAlertsPage() {
  const { alerts, handleDismissAlert } = useApp();
  const [activeNoteAlertId, setActiveNoteAlertId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

  const handleSaveAlertNote = (alertId) => {
    if (!noteText.trim()) return;
    setNoteSuccess(true);
    soundService.playSuccessChime();
    setTimeout(() => {
      setActiveNoteAlertId(null);
      setNoteText('');
      setNoteSuccess(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/caregiver"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />{t('cga_back')}
        </Link>
        <span className="text-xs font-bold text-slate-500">
          Explainable Activity Notification System
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Caregiver Awareness
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Activity Change Alerts & Trends
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          SmarTCARE automatically flags persistent changes in cognitive cadence and reminder adherence. All alerts use objective, supportive language and are strictly non-diagnostic.
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-900">{t('cga_steady')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No recent activity changes or missed adherence flags detected for Asha Sharma.
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-4 transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{alert.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">{t('cga_patient')}</span>
                  </div>
                </div>

                <span className="text-xs font-extrabold uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  {alert.severity} priority
                </span>
              </div>

              {/* Explainable Reasoning */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px] block">{t('cga_pattern')}</span>
                  <p className="text-slate-800 font-medium">{alert.reason}</p>
                </div>

                <div className="pt-1 border-t border-slate-200/80">
                  <span className="font-bold text-teal-800 uppercase tracking-wide text-[11px] block">{t('cga_action')}</span>
                  <p className="text-teal-900">{alert.recommendation}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setActiveNoteAlertId(activeNoteAlertId === alert.id ? null : alert.id)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 hover:bg-indigo-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{activeNoteAlertId === alert.id ? 'Close Note' : 'Add Caregiver Note'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Dismiss Alert
                  </button>
                  <Link
                    to="/caregiver/patients/user-asha-68"
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                  >
                    View Asha's Full Profile
                  </Link>
                </div>
              </div>

              {/* Note Drawer */}
              {activeNoteAlertId === alert.id && (
                <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="{t('cga_ph')}"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex justify-between items-center">
                    {noteSuccess && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />{t('cga_saved')}
                      </span>
                    )}
                    <button
                      onClick={() => handleSaveAlertNote(alert.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs ml-auto shadow-xs"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
