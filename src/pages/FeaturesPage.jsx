import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  Eye, 
  Layers, 
  Calendar, 
  Coffee, 
  Music, 
  Wind, 
  Heart, 
  Activity, 
  Mic, 
  Bell, 
  Users, 
  Stethoscope, 
  Wifi, 
  Server, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function FeaturesPage() {
  const featureList = [
    { title: 'Adaptive Memory Match', cat: 'Games', route: '/games/memory', icon: Brain, desc: 'Real working memory card game with AI difficulty calibration and chime feedback.' },
    { title: 'NER Cultural Match', cat: 'Games & Culture', route: '/games/cultural', icon: Sparkles, desc: 'Covers Assam, Sikkim, Manipur, Mizoram, Nagaland, Meghalaya, Tripura, Arunachal.' },
    { title: 'Sequence Recall', cat: 'Attention', route: '/games/attention', icon: Eye, desc: 'Attention and working memory test with timed memorization and reproduction.' },
    { title: 'Pattern Match', cat: 'Reasoning', route: '/games/pattern', icon: Layers, desc: 'Pattern logic puzzles utilizing traditional textile weaves and geometric sequences.' },
    { title: 'Daily Routine Recall', cat: 'Recall', route: '/games/daily-recall', icon: Calendar, desc: 'Culturally tailored sequence questions reinforcing medication and meal timings.' },
    { title: 'Familiar Object Recognition', cat: 'Semantic Memory', route: '/games/objects', icon: Coffee, desc: 'Identification of familiar household tea cups, cane baskets, textiles, and umbrellas.' },
    { title: 'Sound & Environmental Recall', cat: 'Auditory', route: '/games/sound', icon: Music, desc: 'Web Audio API synthesizer playing rain, river streams, singing bowls, and birds.' },
    { title: 'Guided Breathing Pacer', cat: 'Well-being', route: '/breathing', icon: Wind, desc: 'Animated circle with 4s Inhale, 2s Hold, 6s Exhale and spoken guidance.' },
    { title: '5-4-3-2-1 Sensory Grounding', cat: 'Well-being', route: '/grounding', icon: ShieldCheck, desc: 'Interactive step-by-step grounding tool reconnecting awareness through the 5 senses.' },
    { title: 'Well-being Telemetry Monitor', cat: 'Hardware Architecture', route: '/wellbeing/monitor', icon: Activity, desc: 'Simulated resting heart rate, respiratory rate, and BLE band sync stream.' },
    { title: 'Role-Aware Voice Assistant', cat: 'Voice', route: '/assistant', icon: Mic, desc: 'Adapts between elderly companion, caregiver summary, and CHO clinical insights.' },
    { title: 'Smart Health Reminders', cat: 'Daily Care', route: '/reminders', icon: Bell, desc: 'Medication, hydration, and doctor appointment reminders with local persistence.' },
    { title: 'Structured Daily Timeline', cat: 'Daily Care', route: '/routine', icon: Calendar, desc: 'Interactive circadian checklist from 7:00 AM wake-up to 9:00 PM wind-down.' },
    { title: 'Family Memory Lane', cat: 'Reminiscence', route: '/memory-lane', icon: Heart, desc: 'Biographical photo reminiscence cards with consent and privacy encryption.' },
    { title: 'Cognitive Profile & Radar', cat: 'Analytics', route: '/profile', icon: Brain, desc: 'Multi-domain radar chart and explainable AI "Why was this activity selected?".' },
    { title: 'Caregiver Portal & Alerts', cat: 'Caregiver', route: '/caregiver', icon: Users, desc: 'Senior monitoring, SMT-4821 join-code pairing, and activity shift alerts.' },
    { title: 'Interactive Trend Reports', cat: 'Analytics', route: '/caregiver/reports', icon: FileText, desc: 'Recharts 7d, 30d, and 90d performance metrics with exportable summary.' },
    { title: 'Healthcare Worker Portal', cat: 'Healthcare', route: '/healthcare', icon: Stethoscope, desc: 'Assign supportive activity plans and review patient adherence trends.' },
    { title: 'Offline-First Sync Engine', cat: 'Architecture', route: '/architecture', icon: Wifi, desc: 'PWA service worker and IndexedDB sync queue for remote NER valleys.' },
    { title: 'MDoNER Admin Console', cat: 'Admin', route: '/admin', icon: Server, desc: 'Ministry overview tracking active senior deployments across all 8 states.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-3">
        <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
          Feature Catalog & Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Complete SmarTCARE Platform Capabilities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Every single module below is fully implemented and interactive. Click on any card to immediately launch and experience the feature.
        </p>
      </div>

      {/* Grid of All 20 Working Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Link
              key={idx}
              to={f.route}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition flex flex-col justify-between group min-h-[190px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {f.cat}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Launch Feature</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
