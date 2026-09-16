import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { NER_REGIONS, NER_CULTURAL_ITEMS } from '../data/nerCultureData.js';
import { 
  Sparkles, 
  MapPin, 
  Check, 
  ArrowRight, 
  Coffee, 
  Scroll, 
  Sun, 
  Shield, 
  Feather, 
  Landmark, 
  Waves, 
  GitBranch, 
  CloudRain, 
  Music, 
  Flower, 
  Castle, 
  Package, 
  MountainSnow, 
  Leaf,
  Layers
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

const ICON_MAP = {
  Coffee,
  Scroll,
  Sun,
  Shield,
  Feather,
  Landmark,
  Waves,
  Sparkles,
  GitBranch,
  CloudRain,
  Music,
  Layers,
  Flower,
  ShieldAlert: Shield,
  Castle,
  Package,
  MountainSnow,
  Leaf
};

export default function CulturalModePage() {
  const { culturalRegion, setCulturalRegion } = useApp();

  const selectedRegionItems = NER_CULTURAL_ITEMS.filter(
    item => culturalRegion === 'General NER' || item.region === culturalRegion
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-amber-800 to-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3">
        <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          Cultural Respect & Semantic Familiarity
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          North Eastern Cultural Adaptation Hub
        </h1>
        <p className="text-amber-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          SmarTCARE never assumes a senior’s ethnicity or language automatically. Seniors and families can choose their cultural heritage preferences across all 8 North Eastern states or General NER.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-300" /> Active Theme: <strong>{culturalRegion}</strong>
          </span>
        </div>
      </div>

      {/* State / Region Grid Selector */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">Choose Cultural Heritage Preference</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {NER_REGIONS.map(reg => {
            const isSelected = culturalRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setCulturalRegion(reg.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between text-left min-h-[110px] ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-md ring-2 ring-teal-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">{reg.stateCode}</span>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base mt-1 text-slate-900">{reg.name}</h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{reg.capital}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cultural Items Preview for Chosen State */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
              Previewing Cultural Memory Library
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {culturalRegion} Heritage & Artifacts
            </h3>
          </div>

          <Link
            to="/games/cultural"
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <span>Play {culturalRegion} Memory Game</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedRegionItems.map(item => {
            const IconComp = ICON_MAP[item.iconName] || Sparkles;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 p-5 space-y-3 hover:shadow-md transition bg-slate-50/50"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: item.bgColor, color: item.color }}
                >
                  <IconComp className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-1">{item.name}</h4>
                  <span className="text-xs text-slate-500 font-medium block italic">{item.localName}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                  {item.fact}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
