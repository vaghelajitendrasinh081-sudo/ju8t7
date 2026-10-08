import React, { useState } from 'react';
import { HUDNavbar } from './components/HUDNavbar';
import { HeroSection } from './components/HeroSection';
import { IntroSequence } from './components/IntroSequence';
import { TaskPlannerModule } from './components/TaskPlannerModule';
import { SyllabusImporterModule } from './components/SyllabusImporterModule';
import { AIAnalyticsModule } from './components/AIAnalyticsModule';
import { UserProfileModal } from './components/UserProfileModal';
import { ParticleCursorTrail } from './components/ParticleCursorTrail';
import { calculateLevelFromHours } from './utils/gamification';
import { soundFX } from './utils/sound';
import { Bot, Sparkles } from 'lucide-react';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('HERO');
  const [soundMuted, setSoundMuted] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // User & Companion Profile State with LocalStorage persistence
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading profile from localStorage:', e);
    }
    return {
      userName: '',
      companionName: '',
      courseTitle: ''
    };
  });

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('sudarshan_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile to localStorage:', e);
    }
  };

  // Tracked Study Hours and Gamified Progression State
  const [totalStudyHours, setTotalStudyHours] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_total_study_hours');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading study hours from localStorage:', e);
    }
    return 0;
  });

  const [levelUpData, setLevelUpData] = useState(null);

  const handleLogStudyHours = (additionalHours) => {
    setTotalStudyHours((prevHours) => {
      const oldLevelInfo = calculateLevelFromHours(prevHours);
      const newHours = prevHours + additionalHours;
      const newLevelInfo = calculateLevelFromHours(newHours);

      try {
        localStorage.setItem('sudarshan_total_study_hours', newHours);
      } catch (e) {
        console.error('Error saving study hours to localStorage:', e);
      }

      if (newLevelInfo.level > oldLevelInfo.level) {
        soundFX.playSuccess();
        setLevelUpData(newLevelInfo);
      }

      return newHours;
    });
  };

  // Dynamic Subject / Category state with LocalStorage persistence (defaults to empty array)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from localStorage:', e);
    }
    return [];
  });

  const handleAddCategory = (newCategory) => {
    if (!newCategory || !newCategory.trim()) return;
    const trimmed = newCategory.trim();
    setCategories((prev) => {
      const updated = prev.includes(trimmed) ? prev : [...prev, trimmed];
      try {
        localStorage.setItem('sudarshan_categories', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving categories to localStorage:', e);
      }
      return updated;
    });
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (!categoryToDelete) return;
    setCategories((prev) => {
      const updated = prev.filter((cat) => cat !== categoryToDelete);
      try {
        localStorage.setItem('sudarshan_categories', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving categories to localStorage:', e);
      }
      return updated;
    });
  };

  const handleLaunchConsole = () => {
    setActiveTab('PLANNER');
    const el = document.getElementById('planner-console');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImportSyllabus = () => {
    setActiveTab('SYLLABUS');
    const el = document.getElementById('syllabus-console');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAI = () => {
    setActiveTab('ANALYTICS');
    setTimeout(() => {
      const el = document.getElementById('analytics-console');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-space selection:bg-cyan-500 selection:text-slate-950">

      {/* Sci-Fi Mouse Cursor Particle Trail Canvas Layer */}
      <ParticleCursorTrail />

      {/* Futuristic Intro Sequence Animation Overlay */}
      {showIntro && (
        <IntroSequence onComplete={() => {
          setShowIntro(false);
          window.scrollTo(0, 0);
        }} />
      )}

      {/* User Profile Creation / Edit Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Top Fixed HUD Navigation */}
      <HUDNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        profile={profile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Display */}
      <main className="flex-1">
        {activeTab === 'HERO' && (
          <>
            <HeroSection
              onLaunchConsole={handleLaunchConsole}
              onImportSyllabus={handleImportSyllabus}
            />
            {/* Dashboard Preview Section under Hero */}
            <div className="border-t border-cyan-500/20 bg-slate-950/90 py-12">
              <TaskPlannerModule categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
              <SyllabusImporterModule categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
              <AIAnalyticsModule
                categories={categories}
                totalHours={totalStudyHours}
                onLogStudyHours={handleLogStudyHours}
                levelUpData={levelUpData}
                onDismissLevelUpModal={() => setLevelUpData(null)}
                profile={profile}
              />
            </div>
          </>
        )}

        {activeTab === 'PLANNER' && (
          <div className="pt-20">
            <TaskPlannerModule categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
          </div>
        )}

        {activeTab === 'SYLLABUS' && (
          <div className="pt-20">
            <SyllabusImporterModule categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
          </div>
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="pt-20">
            <AIAnalyticsModule
              categories={categories}
              totalHours={totalStudyHours}
              onLogStudyHours={handleLogStudyHours}
              levelUpData={levelUpData}
              onDismissLevelUpModal={() => setLevelUpData(null)}
              profile={profile}
            />
          </div>
        )}
      </main>

      {/* HUD Footer Telemetry */}
      <footer className="border-t border-cyan-500/20 py-6 bg-slate-950 text-xs font-mono-tech text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            SUDARSHAN // HIGH-END FUTURISTIC STUDY DASHBOARD &amp; COGNITIVE HUD CONSOLE
          </div>
          <div className="text-cyan-400/60">
            ALL SYSTEMS OPERATIONAL // Kurukshetra Observatory v1.0
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
