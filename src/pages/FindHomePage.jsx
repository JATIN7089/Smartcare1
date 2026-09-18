import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, MapPin, Navigation, Phone, Image as ImageIcon, Landmark,
  WifiOff, ArrowLeft, HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { HOME, landmarksFor, osmEmbedUrl, osmLink, directionsUrl } from '../data/homeLocation.js';
import { voiceService } from '../services/voiceService.js';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

/**
 * SmarTCARE Wayfinding — "Mera ghar kaha hai?"
 * ============================================================
 * For the moment an elderly resident steps out and cannot remember the way
 * back. The page is deliberately calm and huge-type:
 *
 *   1. Reassure first ("you are safe") — panic is the real risk here.
 *   2. Show the HOME PHOTO, because recognition beats reading an address.
 *   3. Show the address and familiar landmarks in big words.
 *   4. Connect to a live map (keyless OpenStreetMap embed) and offer
 *      turn-by-turn directions in the device's own map app.
 *   5. One tap to call the caregiver.
 *
 * Works offline: the photo, address and landmarks are bundled assets, so a
 * lost user with no network still sees everything except the live map.
 */
export default function FindHomePage() {
  const { t, language, accessibility, user } = useApp();
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [spokenOnce, setSpokenOnce] = useState(false);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Speak the reassurance the moment the page opens, in the active language.
  useEffect(() => {
    if (spokenOnce) return;
    setSpokenOnce(true);
    if (accessibility.voiceEnabled) {
      voiceService.speak(t('fw_spoken'), language);
    }
  }, [spokenOnce, language, accessibility.voiceEnabled, t]);

  const name = (user?.name || 'Asha').split(' ')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <DisclaimerBanner />

      {/* -------- Reassurance header -------- */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white p-6 sm:p-8 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <HeartHandshake className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight">{t('fw_title')}</h1>
        <p className="mt-2 text-base sm:text-lg font-semibold text-teal-50">
          {t('fw_sub')} {name} जी।
        </p>
      </div>

      {/* -------- Home photo (recognition first) -------- */}
      <div className="rounded-3xl border-2 border-teal-200 bg-white overflow-hidden shadow-sm">
        <div className="relative">
          <img
            src={HOME.photo}
            alt={t('fw_photo_alt')}
            className="w-full h-64 sm:h-80 object-cover"
          />
          <span className="absolute top-3 left-3 bg-white/95 text-teal-800 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Home className="w-4 h-4" /> {t('fw_your_home')}
          </span>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-lg sm:text-xl font-black text-slate-900">{HOME.label}</p>
          <p className="text-base sm:text-lg font-semibold text-slate-700 flex items-start gap-2">
            <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
            {HOME.address}
          </p>
        </div>
      </div>

      {/* -------- Live map + directions -------- */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-teal-600" /> {t('fw_map_title')}
        </h2>

        {online ? (
          <iframe
            title={t('fw_map_title')}
            src={osmEmbedUrl()}
            className="w-full h-72 rounded-2xl border border-slate-200"
            loading="lazy"
          />
        ) : (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 text-center space-y-2">
            <WifiOff className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="font-bold text-amber-900">{t('fw_offline')}</p>
            <p className="text-sm font-semibold text-amber-800">{t('fw_offline_desc')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={directionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl text-base min-h-[56px] shadow-md"
          >
            <Navigation className="w-5 h-5" /> {t('fw_directions')}
          </a>
          <a
            href={osmLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-black py-4 rounded-2xl text-base min-h-[56px]"
          >
            <MapPin className="w-5 h-5" /> {t('fw_open_map')}
          </a>
        </div>
      </div>

      {/* -------- Familiar landmarks -------- */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-teal-600" /> {t('fw_landmarks')}
        </h2>
        <ul className="space-y-2">
          {landmarksFor(language).map((line, i) => (
            <li
              key={line}
              className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4 text-base sm:text-lg font-semibold text-slate-800"
            >
              <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-black flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* -------- Call caregiver -------- */}
      <a
        href={`tel:${HOME.contact.phone.replace(/\s/g, '')}`}
        className="flex items-center justify-center gap-3 w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-5 rounded-3xl text-lg shadow-md min-h-[64px]"
      >
        <Phone className="w-6 h-6" />
        {t('fw_call')} — {HOME.contact.name}
      </a>

      <div className="flex justify-center pb-6">
        <Link
          to="/elderly"
          className="flex items-center gap-2 text-slate-600 hover:text-teal-700 font-bold py-3 px-5 rounded-2xl hover:bg-slate-100 min-h-[48px]"
        >
          <ArrowLeft className="w-5 h-5" /> {t('fw_back_home_screen')}
        </Link>
      </div>
    </div>
  );
}
