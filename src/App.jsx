import React, { useState } from 'react';
import { HUDNavbar } from './components/HUDNavbar';
import { HeroSection } from './components/HeroSection';
import { IntroSequence } from './components/IntroSequence';
import { TaskPlannerModule } from './components/TaskPlannerModule';
import { SyllabusImporterModule } from './components/SyllabusImporterModule';
import { AIAnalyticsModule } from './components/AIAnalyticsModule';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('HERO');
  const [soundMuted, setSoundMuted] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-space selection:bg-cyan-500 selection:text-slate-950">

      {/* Futuristic Intro Sequence Animation Overlay */}
      {showIntro && (
        <IntroSequence onComplete={() => setShowIntro(false)} />
      )}

      {/* Top Fixed HUD Navigation */}
      <HUDNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
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
              <AIAnalyticsModule categories={categories} />
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
            <AIAnalyticsModule categories={categories} />
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
