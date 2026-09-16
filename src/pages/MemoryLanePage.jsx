import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { 
  Heart, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function MemoryLanePage() {
  const { familyMemories, handleAddMemory, user } = useApp();

  const [revealedIds, setRevealedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [location, setLocation] = useState('Tezpur, Assam');
  const [year, setYear] = useState('2025');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [notes, setNotes] = useState('');

  const toggleReveal = (id) => {
    soundService.playFlipTone();
    if (revealedIds.includes(id)) {
      setRevealedIds(prev => prev.filter(i => i !== id));
    } else {
      setRevealedIds(prev => [...prev, id]);
    }
  };

  const handleCreateMemory = async (e) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) return;

    await handleAddMemory({
      title,
      relationship,
      location,
      year,
      question,
      answer: answer || 'A joyful family memory.',
      notes,
      category: 'Family'
    });

    soundService.playSuccessChime();
    setTitle('');
    setQuestion('');
    setAnswer('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            Personalized Reminiscence Companion
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Family Memory Lane (স্মৃতি বীথি)
          </h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Cherished family photographs, ancestral journeys, and family milestones curated by Sunita Sharma for Asha. Reconnecting with biographical milestones sparks positive emotional warmth.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-sm shadow-md transition flex items-center gap-2 min-h-[44px]"
        >
          <Plus className="w-5 h-5 text-rose-600" /> Add Cherished Memory
        </button>
      </div>

      {/* Privacy & Consent Badge as required */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Consent & Privacy Protected:</strong> Memory cards are encrypted locally and shared exclusively within Asha's verified caregiver circle.
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">
          HIPAA & SIH Compliant Sandbox
        </span>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyMemories.map(memory => {
          const isRevealed = revealedIds.includes(memory.id);

          return (
            <div
              key={memory.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              {/* Photo Card Hero simulation */}
              <div className="bg-gradient-to-tr from-teal-50 to-amber-50 p-6 border-b border-slate-100 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                      {memory.relationship}
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {memory.year}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {memory.location}
                  </span>
                </div>

                {/* Decorative Fictional Avatar / Silhouette */}
                <div className="w-20 h-20 rounded-full bg-white shadow-md mx-auto my-4 flex items-center justify-center border-2 border-teal-200">
                  <Heart className="w-10 h-10 text-rose-500 fill-rose-100" />
                </div>

                <h3 className="text-xl font-black text-slate-900 text-center">{memory.title}</h3>
                {memory.notes && (
                  <p className="text-xs text-slate-500 text-center mt-1 italic">"{memory.notes}"</p>
                )}
              </div>

              {/* Reminiscence Prompt Box */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" /> Reminiscence Question
                  </div>
                  <p className="font-bold text-slate-800 text-base">{memory.question}</p>
                </div>

                {/* Answer reveal button / card */}
                {isRevealed ? (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-950 space-y-1 animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase">Answer & Cherished Story</span>
                      <button
                        onClick={() => toggleReveal(memory.id)}
                        className="text-xs text-emerald-700 hover:underline font-bold"
                      >
                        Hide
                      </button>
                    </div>
                    <p className="text-sm font-semibold">{memory.answer}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleReveal(memory.id)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Reveal Who & Where This Was</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-xl text-slate-900">Add Family Memory</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Memory Title / Person</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Granddaughter Ananya's Dance Performance"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relation</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Granddaughter"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tezpur"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reminiscence Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Who performed the graceful dance in the red dress?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Answer</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. Your granddaughter Ananya at the school annual day."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Family Story / Note</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Dadi clapped enthusiastically and gave her a warm hug afterwards."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow transition"
                >
                  Save to Memory Lane
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
