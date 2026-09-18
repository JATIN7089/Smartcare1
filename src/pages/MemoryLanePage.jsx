import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { soundService } from '../services/soundService.js';
import { compressPhoto, approxSizeKB } from '../services/photoService.js';
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
  Image as ImageIcon,
  Camera,
  Loader2,
  Home as HomeIcon,
  User as UserIcon,
  MapPinned
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function MemoryLanePage() {
  const { familyMemories, handleAddMemory, user, t } = useApp();

  const [revealedIds, setRevealedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [location, setLocation] = useState('Tezpur, Assam');
  const [year, setYear] = useState('2025');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [notes, setNotes] = useState('');

  // Photo + recognition fields. A face without a name teaches nothing, so the
  // subject is what the senior is asked to recall.
  const [photo, setPhoto] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [subject, setSubject] = useState('');
  const [voiceNote, setVoiceNote] = useState('');
  const [category, setCategory] = useState('Person');
  const [isHome, setIsHome] = useState(false);

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setPhotoError('');
    try {
      const { dataUrl } = await compressPhoto(file);
      setPhoto(dataUrl);
    } catch (err) {
      setPhotoError(err.message || 'Could not use that photo.');
    }
    setPhotoBusy(false);
  };

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

    const who = subject.trim() || title.trim();

    await handleAddMemory({
      title,
      relationship,
      location,
      year,
      question,
      answer: answer || `This is ${who}.`,
      notes,
      category,
      photo,
      subject: who,
      // Spoken back to the senior, so it reads as reassurance not data.
      voiceNote: voiceNote.trim() ||
        (relationship
          ? `This is ${who}, your ${String(relationship).toLowerCase()}.`
          : `This is ${who}.`),
      isHome
    });

    soundService.playSuccessChime();
    setTitle('');
    setQuestion('');
    setAnswer('');
    setNotes('');
    setPhoto(null);
    setSubject('');
    setVoiceNote('');
    setCategory('Person');
    setIsHome(false);
    setPhotoError('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">{t('ml_sub')}</span>
          <h1 className="text-3xl sm:text-4xl font-black">{t('ml_title')}</h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Cherished family photographs, ancestral journeys, and family milestones curated by Sunita Sharma for Asha. Reconnecting with biographical milestones sparks positive emotional warmth.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-sm shadow-md transition flex items-center gap-2 min-h-[44px]"
        >
          <Plus className="w-5 h-5 text-rose-600" />{t('ml_add')}</button>
      </div>

      {/* Privacy & Consent Badge as required */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>{t('ml_consent')}</strong>{t('ml_privacy')}
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">{t('ml_hipaa')}</span>
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

                {/* The real photograph, when the family has added one. */}
                {memory.photo ? (
                  <img
                    src={memory.photo}
                    alt={memory.subject || memory.title}
                    className="w-28 h-28 rounded-full object-cover shadow-md mx-auto my-4 border-4 border-white ring-2 ring-teal-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white shadow-md mx-auto my-4 flex items-center justify-center border-2 border-teal-200">
                    <Heart className="w-10 h-10 text-rose-500 fill-rose-100" />
                  </div>
                )}

                <h3 className="text-xl font-black text-slate-900 text-center">{memory.title}</h3>
                {memory.notes && (
                  <p className="text-xs text-slate-500 text-center mt-1 italic">"{memory.notes}"</p>
                )}
              </div>

              {/* Reminiscence Prompt Box */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />{t('ml_question')}</div>
                  <p className="font-bold text-slate-800 text-base">{memory.question}</p>
                </div>

                {/* Answer reveal button / card */}
                {isRevealed ? (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-950 space-y-1 animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase">{t('ml_answer')}</span>
                      <button
                        onClick={() => toggleReveal(memory.id)}
                        className="text-xs text-emerald-700 hover:underline font-bold"
                      >{t('ml_hide')}</button>
                    </div>
                    <p className="text-sm font-semibold">{memory.answer}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleReveal(memory.id)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{t('ml_reveal')}</span>
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
              <h3 className="font-extrabold text-xl text-slate-900">{t('ml_add_family')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_mem_title')}</label>
                {/* ---- Photo ---- */}
                <div className="space-y-2 pb-3 mb-3 border-b border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block">{t('g_photo')}<span className="font-medium text-slate-400">{t('ml_photo_hint')}</span>
                  </label>

                  {photo ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={photo}
                        alt="{t('ml_sel')}"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-700">{t('ml_photo_ready')}</p>
                        <p className="text-[10px] text-slate-400">
                          Resized to about {approxSizeKB(photo)} KB so it loads on a slow connection.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPhoto(null)}
                          className="text-[11px] font-bold text-rose-600 hover:underline mt-1"
                        >{t('ml_remove')}</button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50/50 text-slate-500 hover:text-teal-700 font-bold text-xs cursor-pointer transition min-h-[64px]">
                      {photoBusy ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />{t('ml_preparing')}</>
                      ) : (
                        <><Camera className="w-4 h-4" />{t('ml_take')}</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoPick}
                        disabled={photoBusy}
                      />
                    </label>
                  )}

                  {photoError && (
                    <p className="text-[11px] font-bold text-rose-600">{photoError}</p>
                  )}

                  {/* ---- What kind of memory ---- */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { id: 'Person', label: 'A person', icon: UserIcon },
                      { id: 'Place', label: 'A place', icon: MapPinned },
                      { id: 'Event', label: 'An event', icon: Sparkles }
                    ].map(opt => {
                      const active = category === opt.id;
                      const OptIcon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setCategory(opt.id); if (opt.id !== 'Place') setIsHome(false); }}
                          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[11px] font-black transition ${
                            active
                              ? 'bg-teal-50 border-teal-400 text-teal-800'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <OptIcon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Marking the home pins it to the top of My People & Places,
                      where "is this my home?" gets answered without asking. */}
                  {category === 'Place' && (
                    <label className="flex items-center gap-2.5 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHome}
                        onChange={(e) => setIsHome(e.target.checked)}
                        className="w-4 h-4 accent-teal-600"
                      />
                      <HomeIcon className="w-4 h-4 text-teal-700" />
                      <span className="text-xs font-bold text-teal-900">{t('ml_is_home')}</span>
                    </label>
                  )}
                </div>

                {/* ---- Who or what is it ---- */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_who')}<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={category === 'Person' ? 'e.g. Ananya' : 'e.g. My Home'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">{t('ml_who_hint')}</p>
                </div>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="{t('ml_ph1')}'s Dance Performance"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_relation')}</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder={t('ml_ph_rel')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_year')}</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_location')}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="{t('ml_ph2')}"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_question')}</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t('ml_ph_q')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_answer2')}</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t('ml_ph_a')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_spoken')}<span className="font-medium text-slate-400">{t('ml_read_aloud')}</span>
                </label>
                <input
                  type="text"
                  value={voiceNote}
                  onChange={(e) => setVoiceNote(e.target.value)}
                  placeholder="{t('ml_ph3')}"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">{t('ml_blank')}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('ml_story')}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="{t('ml_ph4')}"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
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
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow transition"
                >{t('ml_save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
