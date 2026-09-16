import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';

// Common Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AccessibilityBar from './components/AccessibilityBar.jsx';
import DemoTourModal from './components/DemoTourModal.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import SolutionPage from './pages/SolutionPage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import ElderlyDashboard from './pages/ElderlyDashboard.jsx';

// Games
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
import ProfilePage from './pages/ProfilePage.jsx';

// Caregiver & Healthcare Portals
import CaregiverDashboard from './pages/CaregiverDashboard.jsx';
import CaregiverPatientDetailPage from './pages/CaregiverPatientDetailPage.jsx';
import CaregiverAlertsPage from './pages/CaregiverAlertsPage.jsx';
import CaregiverReportsPage from './pages/CaregiverReportsPage.jsx';
import HealthcarePage from './pages/HealthcarePage.jsx';

// Admin & Info
import AdminPage from './pages/AdminPage.jsx';
import ArchitecturePage from './pages/ArchitecturePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public & Ecosystem */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/problem" element={<ProblemPage />} />
              <Route path="/solution" element={<SolutionPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Elderly Experience */}
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
              <Route path="/cultural-mode" element={<CulturalModePage />} />

              {/* Well-being & Mindfulness */}
              <Route path="/wellbeing" element={<WellbeingPage />} />
              <Route path="/breathing" element={<BreathingPacerPage />} />
              <Route path="/wellbeing/monitor" element={<WellbeingMonitorPage />} />
              <Route path="/grounding" element={<GroundingPage />} />

              {/* Assistance & Daily Life */}
              <Route path="/assistant" element={<VoiceAssistantPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/memory-lane" element={<MemoryLanePage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Caregiver Portal */}
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/caregiver/patients" element={<CaregiverDashboard />} />
              <Route path="/caregiver/patients/:id" element={<CaregiverPatientDetailPage />} />
              <Route path="/caregiver/alerts" element={<CaregiverAlertsPage />} />
              <Route path="/caregiver/reports" element={<CaregiverReportsPage />} />

              {/* Healthcare & Administrative */}
              <Route path="/healthcare" element={<HealthcarePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Persistent Accessibility Toolbar & SIH Demo Tour Modal */}
          <AccessibilityBar />
          <DemoTourModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
