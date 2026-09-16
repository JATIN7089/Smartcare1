import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function DisclaimerBanner({ className = '' }) {
  return (
    <div className={`bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs sm:text-sm ${className}`}>
      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="font-bold text-amber-950">Ethical & Medical Safety Notice</p>
        <p className="text-amber-800 leading-relaxed">
          <strong>SmarTCARE</strong> is a supportive cognitive engagement and memory assistance platform. It does <strong>not</strong> diagnose, predict, or replace professional medical care. All activity patterns are supportive indicators to help families and community health workers provide warm, timely encouragement.
        </p>
      </div>
    </div>
  );
}
