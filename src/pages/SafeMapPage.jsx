import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import { soundService } from '../services/soundService.js';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Heart,
  Volume2,
  Compass,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SafeMapPage() {
  const navigate = useNavigate();
  const { user, language } = useApp();

  const [locationStatus, setLocationStatus] = useState('');
  const [sharing, setSharing] = useState(false);

  const homeAddress = "Tezpur Ancestral House, Near Mahabhairab Temple Road, Sonitpur, Assam — 784001";
  const homeCoordinates = { lat: 26.6338, lng: 92.7926 };
  const caregiverPhone = "+919864012345";
  const caregiverName = "Sunita Sharma (Daughter)";

  const readAddressAloud = () => {
    soundService.playFlipTone();
    const spokenText = language === 'hi'
      ? "आशा जी, आप बिल्कुल सुरक्षित हैं। आपका घर तेजपुर, असम में महाभैरव मंदिर के पास है। सुनीता को आपकी लोकेशन पता है।"
      : "Asha, you are safe. Your home is located in Tezpur, Assam, near Mahabhairab Temple Road. Sunita knows where you are.";
    voiceService.speak(spokenText, language);
  };

  const openGoogleMaps = () => {
    soundService.playSuccessChime();
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(homeAddress)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const shareLiveLocation = () => {
    setSharing(true);
    setLocationStatus('Getting your GPS coordinates...');

    if (!navigator.geolocation) {
      setLocationStatus('GPS not supported in this browser. Please call Sunita directly.');
      setSharing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = encodeURIComponent(`Emergency: Asha is looking for home. Current location: ${mapsLink}`);
        
        // Open SMS or WhatsApp link
        window.open(`https://wa.me/919864012345?text=${message}`, '_blank');
        setLocationStatus('Location shared with Sunita via WhatsApp/SMS!');
        setSharing(false);
        soundService.playSuccessChime();
      },
      (err) => {
        // Fallback with static address
        const message = encodeURIComponent(`Emergency check-in: Asha requested directions home to ${homeAddress}.`);
        window.open(`https://wa.me/919864012345?text=${message}`, '_blank');
        setLocationStatus('Shared home check-in with Sunita.');
        setSharing(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Back & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/elderly')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" /> You Are Safe
        </span>
      </div>

      {/* Main Assurance Card */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black tracking-widest uppercase text-teal-200">
              Safe Home Navigation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Asha, You Are Safe at Home
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Don't worry. Your family knows where you are. Take a deep breath and look at your home details below.
            </p>
          </div>

          <button
            onClick={readAddressAloud}
            className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white p-3.5 rounded-2xl transition border border-white/30 flex items-center justify-center min-h-[48px] min-w-[48px]"
            title="Read address aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Family Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={`tel:${caregiverPhone}`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md transition active:scale-[0.98] min-h-[50px]"
          >
            <PhoneCall className="w-4 h-4" /> Call Sunita (Daughter)
          </a>

          <button
            onClick={openGoogleMaps}
            className="bg-white hover:bg-teal-50 text-teal-900 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md transition active:scale-[0.98] min-h-[50px]"
          >
            <Navigation className="w-4 h-4 text-teal-700" /> Open Turn-by-Turn Map
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs space-y-4">
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-800">
            <Compass className="w-5 h-5 text-teal-600" />
            <h2 className="font-black text-lg text-slate-900">Live Map View (Tezpur, Assam)</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">OpenStreetMap GPS</span>
        </div>

        <div className="w-full h-72 sm:h-80 bg-slate-100 relative">
          <iframe
            title="Home Map Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=92.7626%2C26.6138%2C92.8226%2C26.6538&layer=mapnik&marker=${homeCoordinates.lat}%2C${homeCoordinates.lng}`}
            className="w-full h-full border-0"
          />
        </div>

        <div className="p-4 sm:p-6 pt-0 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={openGoogleMaps}
            className="bg-teal-600 hover:bg-teal-700 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" /> Start Route Navigation to Home
          </button>

          <button
            onClick={shareLiveLocation}
            disabled={sharing}
            className="border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-slate-700 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4 text-teal-600" />
            {sharing ? 'Sharing...' : 'Share My Location with Family'}
          </button>
        </div>

        {locationStatus && (
          <div className="px-6 pb-4">
            <p className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center">
              {locationStatus}
            </p>
          </div>
        )}
      </div>

      {/* Visual Home Recognition Anchor */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-black text-slate-900">Recognise Your Home</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
            <img
              src="/memories/home.jpg"
              alt="My Home in Tezpur"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/memories/home.jpg';
              }}
            />
          </div>

          <div className="space-y-2 text-slate-700">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Permanent Residence
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                Tezpur Ancestral House
              </p>
              <p className="text-xs text-slate-600">
                Near Mahabhairab Temple Road, Sonitpur, Assam — 784001
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                Key Visual Landmarks
              </span>
              <p className="text-xs font-bold text-emerald-950">
                • Courtyard with Tulsi plant & green front gate
              </p>
              <p className="text-xs font-bold text-emerald-950">
                • 5 minutes from Mahabhairab Temple
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reassurance Guidance for Wandering / Disorientation */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 space-y-3">
        <h3 className="font-black text-amber-950 text-base flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
          What to do right now
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-amber-900/90 font-medium">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Stay in a comfortable and safe spot. Do not rush.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Sunita knows your location and will reach or guide you.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>If someone asks, show them your address card on this screen.</span>
          </li>
        </ul>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
