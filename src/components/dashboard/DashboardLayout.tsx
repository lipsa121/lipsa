import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  Tv2, 
  BrainCircuit, 
  CalendarClock, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Menu, 
  X, 
  Zap, 
  Activity, 
  ShieldCheck,
  RotateCcw,
  Home,
  Scale,
  BookOpen,
  FileText,
  Compass
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { OverviewView } from './OverviewView';
import { EnergyFlowView } from './EnergyFlowView';
import { AppliancesView } from './AppliancesView';
import { ForecastingView } from './ForecastingView';
import { SchedulingView } from './SchedulingView';
import { SettingsView } from './SettingsView';
import { ScenariosView } from './ScenariosView';
import { MethodologyView } from './MethodologyView';
import { SimulationReportModal } from './SimulationReportModal';
import { GuidedDemoTour } from './GuidedDemoTour';

interface DashboardLayoutProps {
  onBackToLanding: () => void;
  onNavigateToBuilder?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  onBackToLanding, 
  onNavigateToBuilder 
}) => {
  const { metrics, resetDemo } = useEnergySimulation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [resetFeedback, setResetFeedback] = useState<boolean>(false);

  const handleResetDemo = () => {
    resetDemo();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2000);
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scenarios', label: 'Scenarios & Benchmarks', icon: Scale, badge: 'Step 5' },
    { id: 'builder', label: 'Smart Home Builder', icon: Home, badge: 'Simulator' },
    { id: 'energy_flow', label: 'Energy Flow', icon: GitFork },
    { id: 'appliances', label: 'Appliances', icon: Tv2 },
    { id: 'forecasting', label: 'Forecasting', icon: BrainCircuit, badge: 'AI Engine' },
    { id: 'scheduling', label: 'Smart Scheduling', icon: CalendarClock, badge: 'Optimizer' },
    { id: 'methodology', label: 'Methodology & Limits', icon: BookOpen, badge: 'Docs' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView 
            onNavigate={(tab) => setActiveTab(tab)} 
            onNavigateToBuilder={onNavigateToBuilder}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        );
      case 'scenarios':
        return <ScenariosView />;
      case 'energy_flow':
        return <EnergyFlowView />;
      case 'appliances':
        return <AppliancesView />;
      case 'forecasting':
        return <ForecastingView />;
      case 'scheduling':
        return <SchedulingView />;
      case 'methodology':
        return <MethodologyView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <OverviewView 
            onNavigate={(tab) => setActiveTab(tab)} 
            onNavigateToBuilder={onNavigateToBuilder}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-slate-100 flex flex-col selection:bg-[#10B981]/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#18202A] bg-[#07090C]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-md hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D1117] border border-[#1F2733] flex items-center justify-center relative shadow-sm">
              <Zap className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-[#07090C]" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">
                LoadPilot <span className="text-[#10B981] font-semibold">AI</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2 font-mono">
                · Smart Energy Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Header Telemetry Strip */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Capacity Mini Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0E1115] border border-[#20252F] text-xs font-mono">
            <span className="text-slate-400">Load:</span>
            <span className={`font-bold ${metrics.isCapacityExceeded ? 'text-[#FB7185]' : 'text-[#2ECC71]'}`}>
              {metrics.totalHouseholdLoadW} W
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-300">{metrics.capacityLimitW} W</span>
          </div>

          {/* Interactive Guided Demo Tour Trigger Button */}
          <button
            onClick={() => setIsDemoTourOpen(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 shadow-sm ${
              isDemoTourOpen 
                ? 'bg-[#2ECC71] text-[#0C0F14] font-bold shadow-[0_0_15px_rgba(46,204,113,0.4)]'
                : 'text-emerald-300 bg-[#16291F] hover:bg-[#1D3528] border border-[#2D936C]/50'
            }`}
            title="Start Step-by-Step 6-Phase Evaluator Walkthrough"
          >
            <Compass className="w-3.5 h-3.5 text-current animate-spin-slow" />
            <span className="hidden sm:inline">Guided Demo</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30">1-6</span>
          </button>

          {/* 1-Click Reset Demo Button */}
          <button
            onClick={handleResetDemo}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-[#161B23] hover:bg-[#1F2530] border border-[#2A313E] rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            title="Reset all loads, solar, battery, and scenarios to initial baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#2ECC71] ${resetFeedback ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{resetFeedback ? 'Reset Done' : 'Reset Demo'}</span>
          </button>

          {/* Export Report Header Action Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#1A1F27] hover:bg-[#232936] border border-[#2A313E] rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            title="Generate Audit & CSV Simulation Report"
          >
            <FileText className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          {/* Direct Smart Home Builder Action Button in Header */}
          {onNavigateToBuilder && (
            <button
              onClick={onNavigateToBuilder}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Home className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden md:inline">Smart Home Builder</span>
            </button>
          )}

          {/* Back to Landing Page Button */}
          <button
            onClick={onBackToLanding}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#1A1F27] hover:bg-[#232936] border border-[#2A313E] rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span className="hidden sm:inline">Landing</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Collapsible) */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#18202A] bg-[#0A0D12] transition-all duration-300 select-none ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Sidebar Collapse Toggle Button */}
          <div className="p-3 border-b border-[#18202A] flex justify-end">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161D26] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'builder' && onNavigateToBuilder) {
                      onNavigateToBuilder();
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#059669] text-white shadow-lg shadow-emerald-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#121720]'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          item.id === 'scenarios'
                            ? 'bg-[#0D2419] text-[#10B981] border-[#10B981]/30 font-bold'
                            : item.id === 'builder' 
                            ? 'bg-[#0D2419] text-[#10B981] border-[#10B981]/30 font-bold' 
                            : 'bg-[#0D1117] text-slate-400 border-[#1F2733]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Bottom Context Strip */}
          {!sidebarCollapsed && (
            <div className="p-3.5 border-t border-[#18202A] bg-[#07090C] text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>LoadPilot AI Suite</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Step 5 Active · Energy Balance & Validation Engine
              </p>
            </div>
          )}
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-[#0E1115] border-r border-[#222731] h-full flex flex-col p-4 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#20252F] mb-3">
                <span className="text-sm font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'builder' && onNavigateToBuilder) {
                          onNavigateToBuilder();
                          setMobileMenuOpen(false);
                          return;
                        }
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1B5E3F] text-white shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-[#161B23]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#101317] text-slate-400">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#20252F]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBackToLanding();
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-200 bg-[#161B23] border border-[#20252F] rounded-md flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#2ECC71]" />
                  <span>Return to Landing Page</span>
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090C]">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Guided Evaluator Demonstration Mode Tour (Step 6) */}
      {isDemoTourOpen && (
        <GuidedDemoTour
          activeTab={activeTab}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onClose={() => setIsDemoTourOpen(false)}
        />
      )}

      {/* Global Simulation Audit Report Modal */}
      <SimulationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
