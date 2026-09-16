import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { 
  Stethoscope, 
  Users, 
  Activity, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Brain, 
  Heart, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function HealthcarePage() {
  const { activityPlans, handleTogglePlanTask } = useApp();

  const [plans, setPlans] = useState(activityPlans);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planPriority, setPlanPriority] = useState('High');
  const [tasksText, setTasksText] = useState('Complete NER Cultural Memory Match\nTake 5-minute Breathing Pacer\nHydration break with warm water');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cohort = [
    { id: 'user-asha-68', name: 'Asha Sharma', age: 68, center: 'Sonitpur SDH', status: 'Stable activity', adherence: '88%', lastSession: 'Today', tier: 'Moderate' },
    { id: 'user-biren-74', name: 'Biren Gogoi', age: 74, center: 'Jorhat Dist Hospital', status: 'Activity changed', adherence: '75%', lastSession: '2 hrs ago', tier: 'Easy (AI Adapted)' },
    { id: 'user-mary-71', name: 'Mary Lalrinmawii', age: 71, center: 'Aizawl Civil Clinic', status: 'Needs attention', adherence: '71%', lastSession: 'Yesterday', tier: 'Moderate' }
  ];

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    const taskItems = tasksText
      .split('\n')
      .filter(t => t.trim().length > 0)
      .map((t, idx) => ({ id: `t-${Date.now()}-${idx}`, text: t.trim(), done: false }));

    const newPlan = {
      id: `plan-${Date.now()}`,
      title: planTitle,
      createdBy: 'Dr. B. K. Barua (CHO)',
      assignedDate: new Date().toISOString().split('T')[0],
      priority: planPriority,
      status: 'In Progress',
      tasks: taskItems
    };

    setPlans(prev => [newPlan, ...prev]);
    soundService.playSuccessChime();
    setSavedSuccess(true);
    setTimeout(() => {
      setShowAddPlanModal(false);
      setSavedSuccess(false);
      setPlanTitle('');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
              Primary Health Center & CHO Portal
            </span>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
              Dr. B. K. Barua (Community Health Officer)
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            North Eastern Healthcare Cohort Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Sonitpur Sub-District Hospital, Assam • Supportive Cognitive Engagement Tracking
          </p>
        </div>

        <button
          onClick={() => setShowAddPlanModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl text-sm shadow-md transition flex items-center gap-2 min-h-[44px]"
        >
          <Plus className="w-5 h-5" /> Prescribe Supportive Activity Plan
        </button>
      </div>

      {/* Cohort Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block">Assigned Senior Cohort</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">3</span>
          <span className="text-xs text-slate-400 mt-1 block">Sonitpur & Jorhat Districts</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block">Weekly Adherence Rate</span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">84.6%</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Stable engagement</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block">Active Activity Plans</span>
          <span className="text-3xl font-black text-teal-700 mt-1 block">{plans.length}</span>
          <span className="text-xs text-slate-400 mt-1 block">Syncs directly to Senior UI</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block">Activity Change Flags</span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">1</span>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">Biren Gogoi (Jorhat)</span>
        </div>
      </div>

      {/* Cohort Patient Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Enrolled Seniors Cohort</h2>
          <span className="text-xs text-slate-500 font-medium">Remote rural clinics sync via low-bandwidth queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Age & Center</th>
                <th className="py-3 px-3">Activity Status</th>
                <th className="py-3 px-3">Weekly Adherence</th>
                <th className="py-3 px-3">Challenge Tier</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cohort.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-3 text-slate-500">Age: {p.age} • {p.center}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Stable activity'
                        ? 'bg-emerald-100 text-emerald-900'
                        : p.status === 'Activity changed'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">{p.adherence}</td>
                  <td className="py-3.5 px-3 text-teal-800 font-semibold">{p.tier}</td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      to={`/caregiver/patients/${p.id}`}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                    >
                      View Review Timeline →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supportive Activity Plans (ACE Workflow Inspired) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Assigned Supportive Activity Plans</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured daily tasks prescribed by healthcare workers that instantly sync to the senior's tablet.
            </p>
          </div>
          <button
            onClick={() => setShowAddPlanModal(true)}
            className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 hover:bg-teal-100"
          >
            + Create New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {plans.map(plan => (
            <div key={plan.id} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-slate-900">{plan.title}</h4>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  plan.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {plan.priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-400">Prescribed by: {plan.createdBy} • Due Date: {plan.assignedDate}</p>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                {plan.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleTogglePlanTask(plan.id, task.id)}
                    className="flex items-center gap-2.5 cursor-pointer text-xs group"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition ${
                      task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white group-hover:border-teal-500'
                    }`}>
                      {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`font-semibold ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-xl text-slate-900">Create Supportive Activity Plan</h3>
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Morning Cultural Recall & Hydration"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority</label>
                <select
                  value={planPriority}
                  onChange={(e) => setPlanPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2"
                >
                  <option value="High">High Priority</option>
                  <option value="Normal">Normal Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasks (one per line)</label>
                <textarea
                  rows={4}
                  value={tasksText}
                  onChange={(e) => setTasksText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  {savedSuccess ? 'Prescribed & Synced!' : 'Prescribe Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
