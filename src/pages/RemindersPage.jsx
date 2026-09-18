import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { REMINDER_TITLE_KEYS } from '../data/translations.js';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { voiceService } from '../services/voiceService.js';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';
import { 
  Bell, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Pill, 
  Droplets, 
  Utensils, 
  Calendar, 
  Brain, 
  Activity, 
  PhoneCall, 
  Moon, 
  X, 
  Volume2,
  Filter
} from 'lucide-react';

const CATEGORY_ICONS = {
  Medicine: Pill,
  Hydration: Droplets,
  Meals: Utensils,
  Appointments: Calendar,
  'Cognitive Activity': Brain,
  Exercise: Activity,
  'Family Calls': PhoneCall,
  Sleep: Moon
};

export default function RemindersPage() {
  const { reminders, handleToggleReminder, handleAddReminder, handleDeleteReminder, language } = useApp();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | completed | all
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Medicine');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newNotes, setNewNotes] = useState('');

  // Read aloud on voice command ("What are my reminders?")
  useEffect(() => {
    if (location.state?.readAloud) {
      readRemindersAloud();
    }
  }, [location.state]);

  const readRemindersAloud = () => {
    const uncompleted = reminders.filter(r => !r.completed);
    if (uncompleted.length === 0) {
      voiceService.speak("You have completed all reminders for today. Well done!", language);
    } else {
      const summary = `You have ${uncompleted.length} pending items today: ${uncompleted.map(r => `${t(REMINDER_TITLE_KEYS[r.title] || '', r.title)} at ${r.time}`).join(', ')}.`;
      voiceService.speak(summary, language);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await handleAddReminder({
      title: newTitle,
      category: newCategory,
      time: newTime,
      date: 'Today',
      notes: newNotes
    });

    soundService.playSuccessChime();
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const upcomingList = reminders.filter(r => !r.completed);
  const completedList = reminders.filter(r => r.completed);

  const displayedList = activeTab === 'upcoming' 
    ? upcomingList 
    : activeTab === 'completed' 
    ? completedList 
    : reminders;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{t('rem_title')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 flex items-center gap-2">{t('rem_heading')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t('rem_sub')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={readRemindersAloud}
            className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-teal-200 flex items-center gap-2 transition min-h-[44px]"
            title={t('rem_read_aloud')}
          >
            <Volume2 className="w-4 h-4 text-teal-600" />{t('rem_read_aloud')}</button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />{t('rem_add')}</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'upcoming'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'completed'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({completedList.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Items ({reminders.length})
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
            <Check className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="font-bold text-slate-700">{t('rem_none')}</p>
            <p className="text-xs text-slate-400">{t('rem_none_done')}</p>
          </div>
        ) : (
          displayedList.map(reminder => {
            const Icon = CATEGORY_ICONS[reminder.category] || Bell;
            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start sm:items-center justify-between gap-4 ${
                  reminder.completed
                    ? 'border-emerald-200 bg-emerald-50/30 opacity-80'
                    : 'border-slate-200 hover:border-teal-400 shadow-sm'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Big toggle check button (Min 44px) */}
                  <button
                    onClick={() => handleToggleReminder(reminder.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 transition flex-shrink-0 ${
                      reminder.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-teal-600 text-transparent hover:text-teal-600'
                    }`}
                    title={reminder.completed ? "Mark as Incomplete" : "Mark as Completed"}
                    aria-label="{t('rem_toggle')}"
                  >
                    <Check className="w-6 h-6 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                        <Icon className="w-3 h-3 text-teal-600" /> {reminder.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {reminder.time}
                      </span>
                    </div>

                    <h3 className={`font-extrabold text-base sm:text-lg text-slate-900 ${reminder.completed ? 'line-through text-slate-500' : ''}`}>
                      {t(REMINDER_TITLE_KEYS[reminder.title] || '', reminder.title)}
                    </h3>

                    {reminder.notes && (
                      <p className="text-xs text-slate-500">{reminder.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right controls: delete */}
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                  title="{t('rem_del')}"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-xl text-slate-900">{t('rem_add_new')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('rem_title_field')}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t('rem_ph_title')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('rem_category')}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Medicine">{t('rem_cat_medicine')}</option>
                    <option value="Hydration">{t('rem_cat_hydration')}</option>
                    <option value="Meals">{t('rem_cat_meals')}</option>
                    <option value="Appointments">{t('rem_cat_appointments')}</option>
                    <option value="Cognitive Activity">{t('rem_cat_cognitive')}</option>
                    <option value="Exercise">{t('rem_cat_exercise')}</option>
                    <option value="Family Calls">{t('rem_cat_family')}</option>
                    <option value="Sleep">{t('rem_cat_sleep')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('rem_time')}</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('rem_notes')}</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={t('rem_ph_notes')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >{t('rem_cancel')}</button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition"
                >{t('rem_save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
