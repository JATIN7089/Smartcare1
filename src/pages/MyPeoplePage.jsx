import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import {
  Heart,
  Home as HomeIcon,
  Users,
  Volume2,
  X,
  ImagePlus,
  MapPin,
  Phone,
  ShieldCheck
} from 'lucide-react';

/**
 * "My People & Places" — reassurance, not a test.
 *
 * The recognition game asks questions. This page never does. When someone is
 * disoriented and wondering whether they are in the right house, or who the
 * woman visiting them is, the last thing they need is a quiz. Every photo is
 * labelled straight away, and tapping it reads the answer aloud.
 *
 * "Is this my home?" is answered before it is asked: the home photo sits at
 * the top with a plain "Yes, this is your home" and the address.
 */
export default function MyPeoplePage() {
  const navigate = useNavigate();
  const { familyMemories = [], language, user } = useApp();

  const [open, setOpen] = useState(null);

  const withPhotos = useMemo(
    () => familyMemories.filter(m => m.photo),
    [familyMemories]
  );

  const home = withPhotos.find(m => m.isHome);
  const people = withPhotos.filter(m => m.category === 'Person' && !m.isHome);
  const places = withPhotos.filter(m => m.category !== 'Person' && !m.isHome);

  const speak = (text) => {
    try { voiceService.speak(text, language); } catch (e) { /* speech optional */ }
  };

  const openPhoto = (m) => {
    setOpen(m);
    speak(m.voiceNote || m.answer || `This is ${m.subject || m.title}.`);
  };

  if (withPhotos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <ImagePlus className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No photos yet</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            When a family member adds photos of your loved ones and your home,
            they will always be here for you to look at.
          </p>
          <button
            onClick={() => navigate('/memory-lane')}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition min-h-[50px]"
          >
            <Heart className="w-4 h-4" /> Open Memory Lane
          </button>
        </div>
      </div>
    );
  }

  const PhotoTile = ({ m, big }) => (
    <button
      onClick={() => openPhoto(m)}
      className="group text-left bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-md transition active:scale-[0.98] w-full"
    >
      <img
        src={m.photo}
        alt={m.subject || m.title}
        className={`w-full object-cover bg-slate-100 ${big ? 'aspect-video' : 'aspect-square'}`}
      />
      <div className="p-3.5">
        {/* Always labelled. Never a guessing game. */}
        <p className={`font-black text-slate-900 leading-tight ${big ? 'text-xl' : 'text-base'}`}>
          {m.subject || m.title}
        </p>
        {m.relationship && (
          <p className="text-xs font-bold text-rose-600 mt-0.5">{m.relationship}</p>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1.5">
          <Volume2 className="w-3 h-3" /> Tap to hear
        </span>
      </div>
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" /> My People &amp; Places
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Everyone who loves you. Tap any photo to hear about them.
        </p>
      </div>

      {/* Home first — the question that causes the most distress */}
      {home && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border-2 border-teal-200 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-black text-teal-900">Yes, this is your home</p>
              <p className="text-xs text-teal-700 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {home.location || 'Tezpur, Assam'}
              </p>
            </div>
          </div>

          <button
            onClick={() => openPhoto(home)}
            className="block w-full rounded-2xl overflow-hidden border-2 border-white shadow-sm active:scale-[0.98] transition"
          >
            <img
              src={home.photo}
              alt="Your home"
              className="w-full aspect-video object-cover bg-slate-100"
            />
          </button>

          {home.notes && (
            <p className="text-xs text-teal-800/80 leading-relaxed">{home.notes}</p>
          )}

          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-white/70 rounded-2xl px-4 py-3">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>You are safe here.</span>
          </div>
        </div>
      )}

      {/* People */}
      {people.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4" /> My Family
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {people.map(m => <PhotoTile key={m.id} m={m} />)}
          </div>
        </div>
      )}

      {/* Places */}
      {places.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Places I Know
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {places.map(m => <PhotoTile key={m.id} m={m} />)}
          </div>
        </div>
      )}

      {/* Practice is offered, never pushed */}
      <button
        onClick={() => navigate('/games/faces')}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-rose-400 hover:text-rose-600 font-bold text-sm transition min-h-[52px]"
      >
        <Sparkle /> Practise remembering these faces
      </button>

      {/* ---------- Full-screen viewer ---------- */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={open.photo}
                alt={open.subject || open.title}
                className="w-full aspect-square object-cover bg-slate-100"
              />
              <button
                onClick={() => setOpen(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900/80"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <p className="text-2xl font-black text-slate-900">
                  {open.subject || open.title}
                </p>
                {open.relationship && (
                  <p className="text-sm font-bold text-rose-600">{open.relationship}</p>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {open.voiceNote || open.answer}
              </p>

              {open.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-600 leading-relaxed">{open.notes}</p>
                </div>
              )}

              <button
                onClick={() => speak(open.voiceNote || open.answer || `This is ${open.subject}.`)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition active:scale-[0.98] min-h-[50px]"
              >
                <Volume2 className="w-4 h-4" /> Say it again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Small local flourish so the practice button has an icon without a new import. */
function Sparkle() {
  return <Heart className="w-4 h-4" />;
}
