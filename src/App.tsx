/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EnergySimulationProvider } from './context/EnergySimulationContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DemoPreviewSection } from './components/DemoPreviewSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { LaunchModal } from './components/LaunchModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { SmartHomeBuilderView } from './components/builder/SmartHomeBuilderView';

type AppRoute = 'landing' | 'dashboard' | 'builder';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    // Check initial route from hash or pathname
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/builder' || hash.includes('builder')) {
        return 'builder';
      }
      if (path === '/dashboard' || hash.includes('dashboard')) {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  const [launchModalOpen, setLaunchModalOpen] = useState(false);

  // Sync route changes with browser history
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/builder' || hash.includes('builder')) {
        setCurrentRoute('builder');
      } else if (path === '/dashboard' || hash.includes('dashboard')) {
        setCurrentRoute('dashboard');
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route === 'builder') {
      window.history.pushState({}, '', '#/builder');
    } else if (route === 'dashboard') {
      window.history.pushState({}, '', '#/dashboard');
    } else {
      window.history.pushState({}, '', '#/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLaunchModal = () => {
    setLaunchModalOpen(true);
  };

  const handleCloseLaunchModal = () => {
    setLaunchModalOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <EnergySimulationProvider>
      <div className="min-h-screen bg-[#07090C] text-slate-100 selection:bg-[#10B981]/30 selection:text-emerald-300">
        {currentRoute === 'builder' ? (
          /* ============================================================
             PHASE 3: BUILD YOUR SMART HOME (INTERACTIVE SIMULATOR)
             ============================================================ */
          <SmartHomeBuilderView
            onBackToDashboard={() => navigateTo('dashboard')}
            onBackToLanding={() => navigateTo('landing')}
          />
        ) : currentRoute === 'dashboard' ? (
          /* ============================================================
             PHASE 2: SMART ENERGY MANAGEMENT DASHBOARD
             ============================================================ */
          <DashboardLayout
            onBackToLanding={() => navigateTo('landing')}
            onNavigateToBuilder={() => navigateTo('builder')}
          />
        ) : (
          /* ============================================================
             PHASE 1: LANDING PAGE (FULLY PRESERVED)
             ============================================================ */
          <>
            {/* Top Navigation */}
            <Navbar
              onOpenLaunchModal={handleOpenLaunchModal}
              onLaunchDashboard={() => navigateTo('dashboard')}
            />

            <main>
              {/* 1. Hero Section */}
              <HeroSection
                onExploreClick={() => scrollToSection('simulation')}
                onHowItWorksClick={() => scrollToSection('how-it-works')}
              />

              {/* 2. Problem & Solution Section: Monitor -> Predict -> Optimize */}
              <ProblemSolutionSection />

              {/* 3. Capabilities Section: 4 Core Panels */}
              <CapabilitiesSection />

              {/* 4. How It Works: 4-Step Process Pipeline */}
              <HowItWorksSection />

              {/* 5. Realistic Simulated Control Center / Feeder Preview */}
              <DemoPreviewSection />

              {/* 6. Final Call to Action */}
              <FinalCTASection onLaunchClick={() => navigateTo('dashboard')} />
            </main>

            {/* Footer */}
            <Footer onOpenSpecsModal={handleOpenLaunchModal} />

            {/* Clearly Defined Dashboard Entry Point Modal */}
            <LaunchModal
              isOpen={launchModalOpen}
              onClose={handleCloseLaunchModal}
              onJumpToSimulation={() => scrollToSection('simulation')}
              onLaunchDashboard={() => navigateTo('dashboard')}
            />
          </>
        )}
      </div>
    </EnergySimulationProvider>
  );
}
