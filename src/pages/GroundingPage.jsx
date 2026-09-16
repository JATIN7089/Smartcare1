import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import { soundService } from '../services/soundService.js';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Hand, 
  Ear, 
  Flower2, 
  Utensils, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  Shield 
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

const GROUNDING_STEPS = [
  {
    step: 1,
    count: 5,
    sense: 'SEE',
    title: 'Look around and notice 5 things you can see',
    desc: 'Notice colors, shapes, light and shadows in your room or garden.',
    icon: Eye,
    color: 'from-sky-500 to-teal-500',
    borderColor: 'border-sky-300',
    bgColor: 'bg-sky-50',
    examples: ['The green tea leaves in the garden', 'The wooden window frame', 'The pattern on your warm shawl', 'A glass of clean water', 'The soft daylight on the floor'],
    voicePrompt: 'Look around gently and notice five things you can see right now. Take your time.'
  },
  {
    step: 2,
    count: 4,
    sense: 'TOUCH',
    title: 'Notice 4 things you can feel or touch',
    desc: 'Feel textures with your hands or feet resting on the ground.',
    icon: Hand,
    color: 'from-teal-500 to-emerald-600',
    borderColor: 'border-teal-300',
    bgColor: 'bg-teal-50',
    examples: ['The smooth coolness of your wooden chair', 'The softness of cotton clothing', 'Your feet resting firmly on the floor', 'The gentle warmth in your hands'],
    voicePrompt: 'Notice four things you can physically feel or touch with your hands.'
  },
  {
    step: 3,
    count: 3,
    sense: 'HEAR',
    title: 'Listen for 3 gentle sounds around you',
    desc: 'Close your eyes for a moment and listen to the ambient world.',
    icon: Ear,
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-300',
    bgColor: 'bg-indigo-50',
    examples: ['Distant birds singing in the trees', 'The gentle rustle of the wind', 'The soft ticking of a wall clock or distant footsteps'],
    voicePrompt: 'Listen carefully for three sounds around you, near or far.'
  },
  {
    step: 4,
    count: 2,
    sense: 'SMELL',
    title: 'Notice 2 aromas or scents you can smell',
    desc: 'Take a gentle breath in through your nose.',
    icon: Flower2,
    color: 'from-amber-500 to-rose-500',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50',
    examples: ['The fragrant aroma of brewed morning tea', 'The fresh earthy scent of rain or clean air'],
    voicePrompt: 'Breathe in softly and notice two familiar aromas you can smell.'
  },
  {
    step: 5,
    count: 1,
    sense: 'TASTE',
    title: 'Notice 1 taste in your mouth',
    desc: 'Take a sip of water or notice the clean sensation on your tongue.',
    icon: Utensils,
    color: 'from-emerald-500 to-teal-700',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50',
    examples: ['A sip of cool, refreshing water', 'The lingering warmth of cardamom or tea'],
    voicePrompt: 'Notice one taste or take a gentle sip of fresh water. You are safe and grounded in this moment.'
  }
];

export default function GroundingPage() {
  const { accessibility } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = GROUNDING_STEPS[currentStepIdx];
  const StepIcon = current.icon;

  useEffect(() => {
    if (accessibility.voiceEnabled && !completed) {
      voiceService.speak(current.voicePrompt);
    }
  }, [currentStepIdx, completed, accessibility.voiceEnabled]);

  const handleNext = () => {
    soundService.playFlipTone();
    if (currentStepIdx < GROUNDING_STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setCompleted(true);
      soundService.playSingingBowl();
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
    }
  };

  const handlePrev = () => {
    soundService.playFlipTone();
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStepIdx(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/wellbeing"
          className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Well-being
        </Link>
        <span className="text-xs font-bold text-slate-500">
          Step {current.step} of 5
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(current.step / 5) * 100}%` }}
            />
          </div>

          {/* Step header */}
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${current.color} text-white flex items-center justify-center shadow-md`}>
              <StepIcon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
                5-4-3-2-1 Sensory Grounding • Step {current.step}
              </span>
              <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{current.desc}</p>

          {/* Examples list */}
          <div className={`${current.bgColor} border ${current.borderColor} rounded-2xl p-4 sm:p-5 space-y-2.5`}>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Familiar Examples to Look For:
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              {current.examples.map((ex, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 min-h-[44px]"
            >
              Previous
            </button>

            <button
              onClick={() => voiceService.speak(current.voicePrompt)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-3 py-2 rounded-xl"
            >
              <Volume2 className="w-4 h-4" /> Repeat Voice
            </button>

            <button
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow transition flex items-center gap-2 min-h-[44px]"
            >
              <span>{currentStepIdx < 4 ? 'Next Sense' : 'Finish Grounding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Finished Grounding Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">You Are Safe, Present, and Grounded</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            By reconnecting with your 5 senses, your mind and body return to a centered, peaceful baseline.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={reset}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Do Exercise Again
            </button>
            <Link
              to="/breathing"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Paced Breathing Pacer
            </Link>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
