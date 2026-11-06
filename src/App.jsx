import React, { useState } from 'react';
import VectorParticleCanvas from './components/VectorParticleCanvas.jsx';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import StatsBanner from './components/StatsBanner.jsx';
import BackgroundPhilosophy from './components/BackgroundPhilosophy.jsx';
import FlagshipDeployments from './components/FlagshipDeployments.jsx';
import SystemsMatrix from './components/SystemsMatrix.jsx';
import ContactFooter from './components/ContactFooter.jsx';
import SearchCommandModal from './components/SearchCommandModal.jsx';
import { portfolioData } from './data/portfolioData.js';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenDispatch = () => {
    const contactElem = document.querySelector('#contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#E5E5EA] selection:bg-[#FF1E27] selection:text-white">
      {/* Background Vector Particle System */}
      <VectorParticleCanvas />

      {/* Main Content Layer */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Hero Section */}
        <HeroSection hero={portfolioData.hero} onOpenDispatch={handleOpenDispatch} />

        {/* Inline Stats Banner */}
        <StatsBanner metrics={portfolioData.hero.metrics} />

        {/* Section 1: Background & Philosophy */}
        <BackgroundPhilosophy bio={portfolioData.bio} ethos={portfolioData.ethos} />

        {/* Section 2: Flagship Deployments (SAAI 7-Layer + Sub-grid) */}
        <FlagshipDeployments flagship={portfolioData.flagship} />

        {/* Section 3: The Systems Matrix */}
        <SystemsMatrix matrix={portfolioData.matrix} />

        {/* Section 4: Contact & Footer */}
        <ContactFooter contact={portfolioData.contact} />
      </div>

      {/* Global Command / Search Palette */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        portfolioData={portfolioData}
      />
    </div>
  );
}
