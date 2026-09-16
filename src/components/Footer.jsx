import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, MapPin, Award, Shield, Cpu, ExternalLink } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner.jsx';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Disclaimer in Footer */}
        <div className="mb-10">
          <DisclaimerBanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Team */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">SmarT<span className="text-teal-400">CARE</span></span>
                <p className="text-xs text-slate-400">Cognitive Care for Brighter Tomorrows</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "Empowering elderly lives. Building healthier communities. A brighter North East."
            </p>

            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <Award className="w-4 h-4" />
                <span>SMART INDIA HACKATHON 2026</span>
              </div>
              <p className="text-slate-300 font-medium">Problem Statement ID: <span className="text-white font-bold">26003</span></p>
              <p className="text-slate-400">AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)</p>
              <p className="text-amber-300 text-[11px] pt-1">
                <strong>Ministry:</strong> Ministry of Development of North Eastern Region (MDoNER)
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>Team:</strong> Phantom techie
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">Cognitive Hub</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/elderly" className="hover:text-teal-400 transition">Elderly Home Screen</Link></li>
              <li><Link to="/games" className="hover:text-teal-400 transition">Cognitive Games Hub</Link></li>
              <li><Link to="/games/memory" className="hover:text-teal-400 transition">Memory Match</Link></li>
              <li><Link to="/games/cultural" className="hover:text-teal-400 transition">NER Cultural Match</Link></li>
              <li><Link to="/games/sound" className="hover:text-teal-400 transition">Sound Memory Game</Link></li>
              <li><Link to="/games/daily-recall" className="hover:text-teal-400 transition">Daily Routine Recall</Link></li>
              <li><Link to="/cultural-mode" className="hover:text-teal-400 transition">NER Cultural Mode (8 States)</Link></li>
            </ul>
          </div>

          {/* Care & Well-being */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">Care & Well-being</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/breathing" className="hover:text-teal-400 transition">Breathing Pacer (4-2-6)</Link></li>
              <li><Link to="/wellbeing" className="hover:text-teal-400 transition">Well-being Center</Link></li>
              <li><Link to="/wellbeing/monitor" className="hover:text-teal-400 transition">Well-being Monitor (Demo)</Link></li>
              <li><Link to="/grounding" className="hover:text-teal-400 transition">5-4-3-2-1 Grounding</Link></li>
              <li><Link to="/memory-lane" className="hover:text-teal-400 transition">Family Memory Lane</Link></li>
              <li><Link to="/reminders" className="hover:text-teal-400 transition">Smart Reminders</Link></li>
              <li><Link to="/routine" className="hover:text-teal-400 transition">Daily Routine Timeline</Link></li>
            </ul>
          </div>

          {/* Portals & Architecture */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">Portals & System</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/assistant" className="hover:text-teal-400 transition">Role-Aware Voice Assistant</Link></li>
              <li><Link to="/profile" className="hover:text-teal-400 transition">Personal Cognitive Profile</Link></li>
              <li><Link to="/caregiver" className="hover:text-teal-400 transition">Caregiver Dashboard</Link></li>
              <li><Link to="/caregiver/reports" className="hover:text-teal-400 transition">Trend Analytics Reports</Link></li>
              <li><Link to="/healthcare" className="hover:text-teal-400 transition">Healthcare Worker Portal</Link></li>
              <li><Link to="/admin" className="hover:text-teal-400 transition">MDoNER Admin View</Link></li>
              <li><Link to="/architecture" className="hover:text-teal-400 transition">Offline-First Architecture</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition">About Phantom techie</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SmarTCARE • Team Phantom techie • Smart India Hackathon 2026</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Tagline: Play • Recall • Stay Connected • Live Better</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>NER Low-Bandwidth Optimized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
