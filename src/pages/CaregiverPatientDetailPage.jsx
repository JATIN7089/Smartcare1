import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { LiveBadge } from '../components/LiveToast.jsx';
import { soundService } from '../services/soundService.js';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Brain, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  User, 
  AlertTriangle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function CaregiverPatientDetailPage() {
  const { id } = useParams();
  const { cognitiveProfile, reminders, handleAddReminder, activityPlans } = useApp();

  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [patientData, setPatientData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([
    {
      id: 'n-1',
      author: 'Sunita Sharma (Daughter)',
      date: '2026-09-15 19:30',
      text: 'Mother was very joyful playing the Majuli Island memory card today. She remembered the ferry ride vividly. She slept soundly after the 5-minute breathing pacer.'
    },
    {
      id: 'n-2',
      author: 'Dr. B. K. Barua (CHO)',
      date: '2026-09-14 11:15',
      text: 'Routine activity adherence is very positive. Continue with moderate difficulty cognitive games. Emphasized to family that SmarTCARE is supportive engagement, not a medical diagnostic.'
    }
  ]);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remTime, setRemTime] = useState('03:00 PM');
  const [remCategory, setRemCategory] = useState('Hydration');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const data = await api.getCaregiverPatient(id || 'user-asha-68');
    if (data) setPatientData(data);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      id: `note-${Date.now()}`,
      author: 'Sunita Sharma (Caregiver)',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: newNote
    };

    setNotesList(prev => [noteObj, ...prev]);
    await api.addCaregiverNote(noteObj);
    setNewNote('');
    soundService.playSuccessChime();
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!remTitle.trim()) return;

    await handleAddReminder({
      title: remTitle,
      category: remCategory,
      time: remTime,
      date: 'Daily',
      notes: 'Added by caregiver Sunita'
    });

    soundService.playSuccessChime();
    setRemTitle('');
    setShowAddReminderModal(false);
  };

  // Generate 7d, 30d, 90d trend data
  const data7d = [
    { day: 'Day 1', memory: 78, attention: 70, speed: 3.4, adherence: 80 },
    { day: 'Day 2', memory: 80, attention: 72, speed: 3.2, adherence: 85 },
    { day: 'Day 3', memory: 79, attention: 73, speed: 3.1, adherence: 80 },
    { day: 'Day 4', memory: 81, attention: 71, speed: 3.0, adherence: 90 },
    { day: 'Day 5', memory: 83, attention: 75, speed: 2.9, adherence: 88 },
    { day: 'Day 6', memory: 82, attention: 74, speed: 2.8, adherence: 85 },
    { day: 'Day 7', memory: 84, attention: 76, speed: 2.7, adherence: 92 }
  ];

  const data30d = Array.from({ length: 10 }).map((_, idx) => ({
    day: `W${Math.floor(idx / 2.5) + 1}-D${(idx % 3) + 1}`,
    memory: Math.round(75 + idx * 0.8 + Math.random() * 3),
    attention: Math.round(70 + idx * 0.6 + Math.random() * 2),
    speed: (3.5 - idx * 0.08).toFixed(1),
    adherence: Math.round(80 + Math.random() * 12)
  }));

  const data90d = Array.from({ length: 12 }).map((_, idx) => ({
    day: `Month ${(idx % 3) + 1}`,
    memory: Math.round(74 + idx * 0.7 + Math.random() * 4),
    attention: Math.round(68 + idx * 0.5 + Math.random() * 3),
    speed: (3.6 - idx * 0.05).toFixed(1),
    adherence: Math.round(82 + Math.random() * 10)
  }));

  const chartData = timeRange === '7d' ? data7d : timeRange === '30d' ? data30d : data90d;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/caregiver"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Caregiver Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddReminderModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Reminder
          </button>
          <Link
            to="/caregiver/reports"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-slate-300"
          >
            Export Report
          </Link>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Asha Sharma</h1>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                Stable activity
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Age: 68 • Tezpur, Assam (NER) • Paired Caregiver: Sunita Sharma (Daughter)
            </p>
          </div>
        </div>

        {/* Level and streak badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Activity Streak</span>
            <span className="text-xl font-black text-teal-700">9 Days Active</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Current Challenge</span>
            <span className="text-xl font-black text-indigo-700">Moderate</span>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart with 7d, 30d, 90d toggles */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Multi-Day Activity & Adherence Trends</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive timeline of memory score, attention, and daily reminder adherence.
            </p>
          </div>

          {/* Time range buttons */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  timeRange === range
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="memory" name="Memory Recall (%)" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="attention" name="Attention (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="adherence" name="Reminder Adherence (%)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Routine & Reminder Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caregiver Notes Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Caregiver & Clinical Notes</span>
          </h3>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add observation about mother's mood, memory, or sleep..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
              >
                Post Note
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2 divide-y divide-slate-100">
            {notesList.map(note => (
              <div key={note.id} className="pt-3 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>{note.author}</span>
                  <span className="text-slate-400 font-normal">{note.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Supportive Activity Plans */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Assigned Activity Plans</span>
            </h3>
            <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {activityPlans.length} active
            </span>
          </div>

          <div className="space-y-3">
            {activityPlans.map(plan => (
              <div key={plan.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{plan.title}</span>
                  <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    {plan.priority} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Assigned by: {plan.createdBy}</p>

                <div className="space-y-1.5 pt-1">
                  {plan.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center text-white text-[10px] ${task.done ? 'bg-emerald-600' : 'border border-slate-400'}`}>
                        {task.done && '✓'}
                      </div>
                      <span className={task.done ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-lg text-slate-900">Add Reminder for Asha</h3>
            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reminder Name</label>
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g. Afternoon Herbal Tea"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    placeholder="03:00 PM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={remCategory}
                    onChange={(e) => setRemCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="Medicine">Medicine</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Cognitive Activity">Cognitive Activity</option>
                    <option value="Appointments">Appointments</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Save Reminder
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
