import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, MapPin, Award, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Team */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">SmarT<span className="text-teal-400">CARE</span></span>
                <p className="text-xs text-slate-400">{t('tagline')}</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{t('foot_quote')}</p>

            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <Award className="w-4 h-4" />
                <span>{t('ft_sih')}</span>
              </div>
              <p className="text-slate-300 font-medium">{t('ft_psid')}<span className="text-white font-bold">26003</span></p>
              <p className="text-slate-400">{t('foot_problem')}</p>
              <p className="text-amber-300 text-[11px] pt-1">
                <strong>{t('ft_min')}</strong>{t('ft_mdoner')}
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>{t('ft_team')}</strong> Phantom techie
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">{t('foot_hub')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/elderly" className="hover:text-teal-400 transition">{t('foot_l_elderly')}</Link></li>
              <li><Link to="/games" className="hover:text-teal-400 transition">{t('foot_l_gameshub')}</Link></li>
              <li><Link to="/games/memory" className="hover:text-teal-400 transition">{t('foot_l_memory')}</Link></li>
              <li><Link to="/games/cultural" className="hover:text-teal-400 transition">{t('foot_l_cultural')}</Link></li>
              <li><Link to="/games/sound" className="hover:text-teal-400 transition">{t('foot_l_sound')}</Link></li>
              <li><Link to="/games/daily-recall" className="hover:text-teal-400 transition">{t('foot_l_daily')}</Link></li>
              <li><Link to="/cultural-mode" className="hover:text-teal-400 transition">{t('foot_l_mode')}</Link></li>
            </ul>
          </div>

          {/* Care & Well-being */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">{t('foot_care')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/breathing" className="hover:text-teal-400 transition">{t('foot_l_breathing')}</Link></li>
              <li><Link to="/wellbeing" className="hover:text-teal-400 transition">{t('foot_l_well')}</Link></li>
              <li><Link to="/wellbeing/monitor" className="hover:text-teal-400 transition">{t('foot_l_monitor')}</Link></li>
              <li><Link to="/grounding" className="hover:text-teal-400 transition">{t('foot_l_ground')}</Link></li>
              <li><Link to="/memory-lane" className="hover:text-teal-400 transition">{t('foot_l_lane')}</Link></li>
              <li><Link to="/reminders" className="hover:text-teal-400 transition">{t('foot_l_rem')}</Link></li>
              <li><Link to="/routine" className="hover:text-teal-400 transition">{t('foot_l_routine')}</Link></li>
            </ul>
          </div>

          {/* Portals & Architecture */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3.5">{t('foot_portals')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/assistant" className="hover:text-teal-400 transition">{t('foot_l_assist')}</Link></li>
              <li><Link to="/profile" className="hover:text-teal-400 transition">{t('foot_l_profile')}</Link></li>
              <li><Link to="/caregiver" className="hover:text-teal-400 transition">{t('foot_l_caredash')}</Link></li>
              <li><Link to="/caregiver/reports" className="hover:text-teal-400 transition">{t('foot_l_reports')}</Link></li>
              <li><Link to="/healthcare" className="hover:text-teal-400 transition">{t('foot_l_health')}</Link></li>
              <li><Link to="/admin" className="hover:text-teal-400 transition">{t('foot_l_admin')}</Link></li>
              <li><Link to="/architecture" className="hover:text-teal-400 transition">{t('foot_l_arch')}</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition">{t('foot_l_about')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{t('foot_copy')}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">{t('foot_tag')}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>{t('foot_bw')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
