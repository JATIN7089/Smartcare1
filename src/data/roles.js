/**
 * SmarTCARE Role Definitions
 * ============================================================
 * Single source of truth for what each of the three audiences sees.
 *
 * SmarTCARE is used by three very different people on the same device family:
 *
 *   1. ELDERLY     — Asha, 68. Needs calm, large, low-choice screens.
 *   2. CAREGIVER   — Sunita, her daughter. Needs status at a glance + alerts.
 *   3. HEALTHCARE  — Dr. Barua, the Community Health Officer. Needs a whole
 *                    patient cohort, adherence figures and clinical exports.
 *
 * Each role gets its own identity (name, colour, landing page), its own
 * navigation set for both desktop and mobile, and its own "more" menu.
 * Keeping this in one file means the shell, the role switcher and the
 * assistant all stay in agreement.
 */

export const ROLES = {
  elderly: {
    id: 'elderly',
    label: 'Elderly',
    shortLabel: 'Me',
    description: 'Your daily companion',
    // Who is using the app in this mode
    persona: { name: 'Asha Sharma', detail: 'Tezpur • 68 yrs' },
    home: '/elderly',
    // Visual identity so the user always knows which mode they are in
    theme: {
      accent: 'teal',
      gradient: 'from-teal-600 to-sky-600',
      solid: 'bg-teal-600',
      soft: 'bg-teal-50',
      softText: 'text-teal-700',
      border: 'border-teal-200',
      ring: 'ring-teal-500'
    },
    badge: 'App',
    tagline: 'Daily Companion',
    // Desktop sidebar
    nav: [
      { label: 'Home', path: '/elderly', icon: 'Home' },
      { label: 'Activities', path: '/games', icon: 'Puzzle' },
      { label: 'Breathe', path: '/breathing', icon: 'Wind' },
      { label: 'Reminders', path: '/reminders', icon: 'Bell' },
      { label: 'Assistant', path: '/assistant', icon: 'Mic' },
      { label: 'My Progress', path: '/profile', icon: 'User' }
    ],
    // Mobile bottom bar (4 items max — the mic sits in the middle)
    mobileNav: [
      { label: 'Home', path: '/elderly', icon: 'Home' },
      { label: 'Activities', path: '/games', icon: 'Puzzle' },
      { label: 'Breathe', path: '/breathing', icon: 'Wind' },
      { label: 'Reminders', path: '/reminders', icon: 'Bell' }
    ],
    more: [
      { label: 'My People & Places', path: '/my-people', icon: 'Users' },
      { label: 'Daily Routine', path: '/routine', icon: 'Clock' },
      { label: 'Memory Lane', path: '/memory-lane', icon: 'Heart' },
      { label: 'Grounding Exercise', path: '/grounding', icon: 'Sparkles' },
      { label: 'Find My Home', path: '/find-home', icon: 'MapPin' },
      { label: 'Well-being Centre', path: '/wellbeing', icon: 'Activity' },
      { label: 'My Progress', path: '/profile', icon: 'User' }
    ],
    showVoiceButton: true
  },

  caregiver: {
    id: 'caregiver',
    label: 'Caregiver',
    shortLabel: 'Family',
    description: 'Family care dashboard',
    persona: { name: 'Sunita Sharma', detail: 'Daughter • Caregiver' },
    home: '/caregiver',
    theme: {
      accent: 'violet',
      gradient: 'from-violet-600 to-indigo-600',
      solid: 'bg-violet-600',
      soft: 'bg-violet-50',
      softText: 'text-violet-700',
      border: 'border-violet-200',
      ring: 'ring-violet-500'
    },
    badge: 'Care',
    tagline: 'Family Dashboard',
    nav: [
      { label: 'Patients', path: '/caregiver', icon: 'Users' },
      { label: 'Alerts', path: '/caregiver/alerts', icon: 'Bell' },
      { label: 'Reports', path: '/caregiver/reports', icon: 'FileText' },
      { label: 'Reminders', path: '/reminders', icon: 'Clock' },
      { label: 'Assistant', path: '/assistant', icon: 'Mic' }
    ],
    mobileNav: [
      { label: 'Patients', path: '/caregiver', icon: 'Users' },
      { label: 'Alerts', path: '/caregiver/alerts', icon: 'Bell' },
      { label: 'Reports', path: '/caregiver/reports', icon: 'FileText' },
      { label: 'Reminders', path: '/reminders', icon: 'Clock' }
    ],
    more: [
      { label: "Asha's Routine", path: '/routine', icon: 'Clock' },
      { label: 'Memory Lane', path: '/memory-lane', icon: 'Heart' },
      { label: 'Well-being Monitor', path: '/wellbeing/monitor', icon: 'Activity' },
      { label: 'Open Elderly App', path: '/elderly', icon: 'Home' }
    ],
    showVoiceButton: true
  },

  healthcare: {
    id: 'healthcare',
    label: 'Health Worker',
    shortLabel: 'Clinic',
    description: 'Community health portal',
    persona: { name: 'Dr. B. K. Barua', detail: 'CHO • Sonitpur SDH' },
    home: '/healthcare',
    theme: {
      accent: 'blue',
      gradient: 'from-blue-700 to-cyan-600',
      solid: 'bg-blue-700',
      soft: 'bg-blue-50',
      softText: 'text-blue-700',
      border: 'border-blue-200',
      ring: 'ring-blue-500'
    },
    badge: 'CHO',
    tagline: 'Clinical Portal',
    nav: [
      { label: 'Patient Cohort', path: '/healthcare', icon: 'Users' },
      { label: 'Activity Reports', path: '/caregiver/reports', icon: 'Activity' },
      { label: 'Alerts', path: '/caregiver/alerts', icon: 'Bell' },
      { label: 'Assistant', path: '/assistant', icon: 'Mic' }
    ],
    mobileNav: [
      { label: 'Cohort', path: '/healthcare', icon: 'Users' },
      { label: 'Reports', path: '/caregiver/reports', icon: 'Activity' },
      { label: 'Alerts', path: '/caregiver/alerts', icon: 'Bell' },
      { label: 'Admin', path: '/admin', icon: 'Layers' }
    ],
    more: [
      { label: 'Programme Admin', path: '/admin', icon: 'Layers' },
      { label: 'System Architecture', path: '/architecture', icon: 'Layers' },
      { label: 'Well-being Monitor', path: '/wellbeing/monitor', icon: 'Activity' },
      { label: 'Open Elderly App', path: '/elderly', icon: 'Home' }
    ],
    showVoiceButton: true
  }
};

export const ROLE_LIST = Object.values(ROLES);

export function getRole(roleId) {
  return ROLES[roleId] || ROLES.elderly;
}

/**
 * Routes that only make sense for certain roles. Used to bounce a user back
 * to their own home page if they land somewhere that isn't meant for them.
 */
export const ROUTE_ROLES = {
  '/caregiver': ['caregiver', 'healthcare'],
  '/caregiver/alerts': ['caregiver', 'healthcare'],
  '/caregiver/reports': ['caregiver', 'healthcare'],
  '/healthcare': ['healthcare', 'caregiver'],
  '/admin': ['healthcare']
};

export default ROLES;
