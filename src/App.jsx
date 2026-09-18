import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { getRole, ROUTE_ROLES } from './data/roles.js';
import LoginPage from './pages/LoginPage.jsx';

// Application Shell & Accessibility
import AppShell from './components/AppShell.jsx';
import AccessibilityBar from './components/AccessibilityBar.jsx';
import DemoTourModal from './components/DemoTourModal.jsx';

// Elderly Experience (App Home)
import ElderlyDashboard from './pages/ElderlyDashboard.jsx';

// Cognitive Games
import GameHubPage from './pages/GameHubPage.jsx';
import MemoryMatchGame from './pages/MemoryMatchGame.jsx';
import SequenceRecallGame from './pages/SequenceRecallGame.jsx';
import PatternMatchGame from './pages/PatternMatchGame.jsx';
import DailyRecallGame from './pages/DailyRecallGame.jsx';
import ObjectRecognitionGame from './pages/ObjectRecognitionGame.jsx';
import SoundMemoryGame from './pages/SoundMemoryGame.jsx';
import NERCulturalGame from './pages/NERCulturalGame.jsx';
import CulturalModePage from './pages/CulturalModePage.jsx';

// Well-being & Assistants
import VoiceAssistantPage from './pages/VoiceAssistantPage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';
import RoutinePage from './pages/RoutinePage.jsx';
import WellbeingPage from './pages/WellbeingPage.jsx';
import BreathingPacerPage from './pages/BreathingPacerPage.jsx';
import WellbeingMonitorPage from './pages/WellbeingMonitorPage.jsx';
import GroundingPage from './pages/GroundingPage.jsx';
import MemoryLanePage from './pages/MemoryLanePage.jsx';
import MyPeoplePage from './pages/MyPeoplePage.jsx';
import FaceRecallGame from './pages/FaceRecallGame.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SafeMapPage from './pages/SafeMapPage.jsx';

// Caregiver & Healthcare Portals
import CaregiverDashboard from './pages/CaregiverDashboard.jsx';
import CaregiverPatientDetailPage from './pages/CaregiverPatientDetailPage.jsx';
import CaregiverAlertsPage from './pages/CaregiverAlertsPage.jsx';
import CaregiverReportsPage from './pages/CaregiverReportsPage.jsx';
import HealthcarePage from './pages/HealthcarePage.jsx';

// Admin & Info
import LandingPage from './pages/LandingPage.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import SolutionPage from './pages/SolutionPage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ArchitecturePage from './pages/ArchitecturePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

/**
 * Sends each role to its own home screen. A caregiver opening the app should
 * land on the family dashboard, not on the elderly activity screen.
 */
function RoleHome() {
  const { role } = useApp();
  return <Navigate to={getRole(role).home} replace />;
}

/**
 * Blocks a route when the signed-in role is not permitted, sending the person
 * back to their own home instead. This is the client-side half of the rule —
 * the Express API enforces the same thing with requireRole().
 */
function Protected({ path, children }) {
  const { role } = useApp();
  const allowed = ROUTE_ROLES[path];
  if (allowed && !allowed.includes(role)) {
    return <Navigate to={getRole(role).home} replace />;
  }
  return children;
}

/**
 * Everything below the auth gate. Until someone signs in, the only thing the
 * app will render is the login screen.
 */
function AuthenticatedApp() {
  const { account, authChecked } = useApp();

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  if (!account) return <LoginPage />;

  return (
    <>
      <AppShell>
        <Routes>
          {/* Elderly Experience */}
          <Route path="/" element={<RoleHome />} />
          <Route path="/elderly" element={<ElderlyDashboard />} />
          <Route path="/dashboard" element={<ElderlyDashboard />} />

          {/* Cognitive Games */}
          <Route path="/games" element={<GameHubPage />} />
          <Route path="/games/memory" element={<MemoryMatchGame />} />
          <Route path="/games/attention" element={<SequenceRecallGame />} />
          <Route path="/games/pattern" element={<PatternMatchGame />} />
          <Route path="/games/daily-recall" element={<DailyRecallGame />} />
          <Route path="/games/objects" element={<ObjectRecognitionGame />} />
          <Route path="/games/sound" element={<SoundMemoryGame />} />
          <Route path="/games/cultural" element={<NERCulturalGame />} />
          <Route path="/games/faces" element={<FaceRecallGame />} />
          <Route path="/cultural-mode" element={<CulturalModePage />} />

          {/* Well-being */}
          <Route path="/wellbeing" element={<WellbeingPage />} />
          <Route path="/breathing" element={<BreathingPacerPage />} />
          <Route path="/wellbeing/monitor" element={<WellbeingMonitorPage />} />
          <Route path="/grounding" element={<GroundingPage />} />

          {/* Assistance & Daily Life */}
          <Route path="/assistant" element={<VoiceAssistantPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/memory-lane" element={<MemoryLanePage />} />
          <Route path="/my-people" element={<MyPeoplePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<SafeMapPage />} />
          <Route path="/take-me-home" element={<SafeMapPage />} />

          {/* Caregiver Portal — caregiver + health worker only */}
          <Route path="/caregiver" element={<Protected path="/caregiver"><CaregiverDashboard /></Protected>} />
          <Route path="/caregiver/patients" element={<Protected path="/caregiver"><CaregiverDashboard /></Protected>} />
          <Route path="/caregiver/patients/:id" element={<Protected path="/caregiver"><CaregiverPatientDetailPage /></Protected>} />
          <Route path="/caregiver/alerts" element={<Protected path="/caregiver/alerts"><CaregiverAlertsPage /></Protected>} />
          <Route path="/caregiver/reports" element={<Protected path="/caregiver/reports"><CaregiverReportsPage /></Protected>} />

          {/* Clinical — health worker only */}
          <Route path="/healthcare" element={<Protected path="/healthcare"><HealthcarePage /></Protected>} />
          <Route path="/admin" element={<Protected path="/admin"><AdminPage /></Protected>} />
          <Route path="/architecture" element={<ArchitecturePage />} />

          {/* Public & Ecosystem */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/problem" element={<ProblemPage />} />
          <Route path="/solution" element={<SolutionPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="*" element={<RoleHome />} />
        </Routes>
      </AppShell>

      <AccessibilityBar />
      <DemoTourModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    </AppProvider>
  );
}
