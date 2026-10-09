import React, { useState, useEffect } from 'react';
import { HUDNavbar } from './components/HUDNavbar';
import { HeroSection } from './components/HeroSection';
import { IntroSequence } from './components/IntroSequence';
import { TaskPlannerModule } from './components/TaskPlannerModule';
import { SyllabusImporterModule } from './components/SyllabusImporterModule';
import { AIAnalyticsModule } from './components/AIAnalyticsModule';
import { LeaderboardModule } from './components/LeaderboardModule';
import { UserProfileModal } from './components/UserProfileModal';
import { ParticleCursorTrail } from './components/ParticleCursorTrail';
import { FogEdgeAlertOverlay } from './components/FogEdgeAlertOverlay';
import { calculateLevelFromHours } from './utils/gamification';
import { soundFX } from './utils/sound';
import {
  getSavedGoogleUser,
  saveGoogleUser,
  logoutGoogleUser,
  parseJwt,
  syncUserProgressToDB,
  fetchUserProgressFromDB
} from './utils/googleAuth';
import { AlertTriangle, LogIn, Shield, X } from 'lucide-react';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('HERO');
  const [soundMuted, setSoundMuted] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dismissGuestWarning, setDismissGuestWarning] = useState(false);

  // Google Authenticated User State
  const [googleUser, setGoogleUser] = useState(() => getSavedGoogleUser());

  // Pin page scroll to top on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset scroll position on HERO tab change
  useEffect(() => {
    if (activeTab === 'HERO') {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

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

  // Auto-sync user state to PostgreSQL when signed in with Google
  useEffect(() => {
    if (googleUser) {
      const levelInfo = calculateLevelFromHours(totalStudyHours);
      syncUserProgressToDB(googleUser, { ...profile, level: levelInfo.level }, totalStudyHours, 0);
    }
  }, [googleUser, totalStudyHours, profile]);

  // Handle Google OAuth Credential Response
  const handleGoogleCallback = async (response) => {
    if (response && response.credential) {
      const payload = parseJwt(response.credential);
      if (payload) {
        const userObj = {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        };
        setGoogleUser(userObj);
        saveGoogleUser(userObj);
        soundFX.playSuccess();

        // Fetch remote user state from database on fresh login
        const dbUser = await fetchUserProgressFromDB(userObj.googleId, userObj.email);
        if (dbUser) {
          if (dbUser.userName) {
            const updatedProf = {
              userName: dbUser.userName,
              companionName: dbUser.companionName || profile.companionName || 'COGNITIVE AI',
              courseTitle: dbUser.courseTitle || profile.courseTitle || 'Class 10th / 11th',
            };
            setProfile(updatedProf);
            localStorage.setItem('sudarshan_profile', JSON.stringify(updatedProf));
          }
          if (dbUser.totalStudyHours && dbUser.totalStudyHours > totalStudyHours) {
            setTotalStudyHours(dbUser.totalStudyHours);
            localStorage.setItem('sudarshan_total_study_hours', dbUser.totalStudyHours);
          }
        }
      }
    }
  };

  // Trigger Google One Tap / Sign In Popup
  const handleTriggerGoogleLogin = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback demo prompt if Google Client ID is not initialized in standard browser preview
          const demoEmail = prompt('Enter Gmail Address to Log In & Sync Progress:', 'operative@gmail.com');
          if (demoEmail && demoEmail.includes('@')) {
            const demoUser = {
              googleId: 'g_' + Math.abs(demoEmail.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
              email: demoEmail,
              name: demoEmail.split('@')[0].toUpperCase(),
              picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${demoEmail}`,
            };
            setGoogleUser(demoUser);
            saveGoogleUser(demoUser);
            soundFX.playSuccess();
          }
        }
      });
    } else {
      const demoEmail = prompt('Enter Gmail Address to Log In & Sync Progress:', 'operative@gmail.com');
      if (demoEmail && demoEmail.includes('@')) {
        const demoUser = {
          googleId: 'g_' + Math.abs(demoEmail.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
          email: demoEmail,
          name: demoEmail.split('@')[0].toUpperCase(),
          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${demoEmail}`,
        };
        setGoogleUser(demoUser);
        saveGoogleUser(demoUser);
        soundFX.playSuccess();
      }
    }
  };

  // Initialize Google Identity Services Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: '1000000000000-dummyid.apps.googleusercontent.com',
          callback: handleGoogleCallback,
          auto_select: false,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLogoutGoogle = () => {
    logoutGoogleUser();
    setGoogleUser(null);
    soundFX.playClick();
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('sudarshan_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile to localStorage:', e);
    }
  };

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

  // Dynamic Subject / Category state with LocalStorage persistence
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'HERO') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.handleOpenLeaderboard = () => {
      setActiveTab('LEADERBOARD');
      const el = document.getElementById('leaderboard-console');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
  }, []);

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-space selection:bg-cyan-500 selection:text-slate-950">

      {/* Sci-Fi Mouse Cursor Particle Trail Canvas Layer */}
      <ParticleCursorTrail />

      {/* Near Level-Up Grey Fog / Mist Edge Vignette Overlay */}
      <FogEdgeAlertOverlay totalHours={totalStudyHours} />

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
        googleUser={googleUser}
        onLoginClick={handleTriggerGoogleLogin}
        onLogoutClick={handleLogoutGoogle}
      />

      {/* Top Fixed HUD Navigation */}
      <HUDNavbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        profile={profile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        googleUser={googleUser}
        onLoginClick={handleTriggerGoogleLogin}
        onLogoutClick={handleLogoutGoogle}
      />

      {/* Non-Intrusive Guest Mode Warning Banner */}
      {!googleUser && !dismissGuestWarning && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-slate-900/95 border border-amber-500/50 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl font-mono-tech animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-amber-300 tracking-wider">
                  GUEST ACCESS — UNSECURED SESSION
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Progress will not sync across devices. Log in with Gmail to secure your standings and level progress.
                </p>
                <button
                  onClick={handleTriggerGoogleLogin}
                  className="mt-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[11px] rounded flex items-center gap-1.5 transition-all shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5" /> LOG IN WITH GMAIL
                </button>
              </div>
            </div>
            <button
              onClick={() => setDismissGuestWarning(true)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

        {activeTab === 'LEADERBOARD' && (
          <div className="pt-20">
            <LeaderboardModule
              currentProfile={profile}
              currentHours={totalStudyHours}
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
