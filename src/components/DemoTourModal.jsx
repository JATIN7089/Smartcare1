import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Heart, 
  Calendar, 
  Activity, 
  Users, 
  FileText, 
  Bell, 
  Wind 
} from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Login as Elderly User (Asha Sharma, 68)',
    desc: 'Welcomes Asha in Tezpur, Assam with large cards, today’s routine progress, and voice guidance.',
    route: '/elderly',
    role: 'elderly',
    icon: Brain,
    badge: 'Elderly Home Experience'
  },
  {
    step: 2,
    title: '2. Start Adaptive Memory Game',
    desc: 'Launch the Memory Match activity. Notice high-contrast cards, gentle audio feedback, and attempt counters.',
    route: '/games/memory',
    role: 'elderly',
    icon: Sparkles,
    badge: 'Cognitive Engagement'
  },
  {
    step: 3,
    title: '3. Complete Game & Observe Positive Feedback',
    desc: 'Match pairs to record attempts, response time, and accuracy. Confetti and Himalayan chime celebrate completion.',
    route: '/games/memory',
    role: 'elderly',
    icon: CheckCircle2,
    badge: 'Game Completion'
  },
  {
    step: 4,
    title: '4. View Transparent Performance Score',
    desc: 'System applies formula: Score = (Accuracy × 0.45) + (Speed × 0.20) + (Consistency × 0.20) + (Completion × 0.15).',
    route: '/profile',
    role: 'elderly',
    icon: Activity,
    badge: 'Scoring Engine'
  },
  {
    step: 5,
    title: '5. AI Adjusts Difficulty & Explains Why',
    desc: 'Transparent AI: "Why was this activity selected?" button explains difficulty adjustment without medical claims.',
    route: '/profile',
    role: 'elderly',
    icon: Sparkles,
    badge: 'Explainable AI'
  },
  {
    step: 6,
    title: '6. Start Guided Breathing Exercise',
    desc: 'Breathing Pacer: 4s Inhale, 2s Hold, 6s Exhale with visual expanding circle and spoken voice guidance.',
    route: '/breathing',
    role: 'elderly',
    icon: Wind,
    badge: 'Well-being Pacer'
  },
  {
    step: 7,
    title: '7. Complete Breathing Session',
    desc: 'Tracks completed cycles, logs session to local database and sync queue with singing bowl tone.',
    route: '/wellbeing',
    role: 'elderly',
    icon: Heart,
    badge: 'Well-being Log'
  },
  {
    step: 8,
    title: '8. Complete & Manage Smart Reminders',
    desc: 'Check off morning medicine or hydration. Test adding or snoozing reminders with audio confirmation.',
    route: '/reminders',
    role: 'elderly',
    icon: Calendar,
    badge: 'Daily Assistance'
  },
  {
    step: 9,
    title: '9. Inspect Personal Cognitive Profile',
    desc: 'Shows radar chart and weekly activity trends. Strictly labeled as supportive engagement, not a clinical diagnosis.',
    route: '/profile',
    role: 'elderly',
    icon: Brain,
    badge: 'Cognitive Profile'
  },
  {
    step: 10,
    title: '10. Switch to Caregiver Dashboard',
    desc: 'Seamless role transition: Sunita Sharma (Daughter) oversees Asha’s daily activity, routine, and alerts.',
    route: '/caregiver',
    role: 'caregiver',
    icon: Users,
    badge: 'Caregiver Portal'
  },
  {
    step: 11,
    title: '11. Show Realtime Updated Session Data',
    desc: 'Recent game and breathing session immediately appear in caregiver feed via local sync architecture.',
    route: '/caregiver/patients/user-asha-68',
    role: 'caregiver',
    icon: Activity,
    badge: 'Caregiver Insights'
  },
  {
    step: 12,
    title: '12. Review Multi-day Activity Trends',
    desc: 'Interactive 7-day, 30-day, and 90-day Recharts graphs tracking accuracy, reaction time, and consistency.',
    route: '/caregiver/reports',
    role: 'caregiver',
    icon: FileText,
    badge: 'Trend Analytics'
  },
  {
    step: 13,
    title: '13. Review Explainable Supportive Alerts',
    desc: 'Caregiver sees "Activity Trend Changed" (e.g. afternoon fatigue). Stigma-free, actionable recommendations.',
    route: '/caregiver/alerts',
    role: 'caregiver',
    icon: Bell,
    badge: 'Explainable Alerts'
  },
  {
    step: 14,
    title: '14. Healthcare Activity Plans & Summary',
    desc: 'Healthcare Worker (Dr. Barua) can assign supportive routine tasks that instantly sync to Asha’s home screen.',
    route: '/healthcare',
    role: 'healthcare',
    icon: Heart,
    badge: 'Clinical Collaboration'
  }
];

export default function DemoTourModal() {
  const { demoTourStep, setDemoTourStep, setRole } = useApp();
  const navigate = useNavigate();

  if (!demoTourStep || demoTourStep < 1 || demoTourStep > DEMO_STEPS.length) {
    return null;
  }

  const current = DEMO_STEPS[demoTourStep - 1];
  const StepIcon = current.icon;

  const goToStep = (stepNumber) => {
    const target = DEMO_STEPS[stepNumber - 1];
    setDemoTourStep(stepNumber);
    if (target.role) {
      setRole(target.role);
    }
    navigate(target.route);
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-white border-2 border-teal-600 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-800 animate-in fade-in zoom-in-95">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="bg-teal-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            SIH 2026 Judge Tour
          </span>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Step {demoTourStep} of {DEMO_STEPS.length}
          </span>
        </div>
        <button
          onClick={() => setDemoTourStep(0)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          title="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="py-3 flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex-shrink-0 flex items-center justify-center">
          <StepIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-base text-slate-900">{current.title}</h4>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              {current.badge}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{current.desc}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
        <div 
          className="bg-teal-600 h-full transition-all duration-300"
          style={{ width: `${(demoTourStep / DEMO_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => goToStep(demoTourStep - 1)}
          disabled={demoTourStep === 1}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:hover:text-slate-600 px-3 py-2 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate(current.route);
            }}
            className="text-xs font-bold text-teal-700 hover:underline px-2 py-1"
          >
            Jump to Page
          </button>

          {demoTourStep < DEMO_STEPS.length ? (
            <button
              onClick={() => goToStep(demoTourStep + 1)}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition"
            >
              <span>Next Demo Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setDemoTourStep(0)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tour Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
