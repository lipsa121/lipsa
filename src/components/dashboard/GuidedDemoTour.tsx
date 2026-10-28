import React, { useState } from 'react';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  X, 
  Play, 
  CheckCircle2, 
  Zap, 
  Tv2, 
  GitFork, 
  AlertTriangle, 
  CalendarClock, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';

interface GuidedDemoTourProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onClose: () => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  tabTarget: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  description: string;
  evaluationChecklist: string[];
  suggestedActionLabel?: string;
  onAction?: () => void;
}

export const GuidedDemoTour: React.FC<GuidedDemoTourProps> = ({
  activeTab,
  onNavigateTab,
  onOpenReportModal,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [resetFeedback, setResetFeedback] = useState<boolean>(false);

  const { 
    state, 
    metrics, 
    toggleAppliance, 
    loadScenario, 
    resetDemo, 
    setSimulatedHour 
  } = useEnergySimulation();

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Inspect Overview & Energy Balance',
      tabTarget: 'overview',
      icon: Zap,
      badge: 'Step 1 of 6 · Baseline KPIs',
      headline: 'Examine Real-Time Household Electrical Balance',
      description: 'Observe how active household demand is balanced against rooftop solar PV generation and the utility grid. Notice the 3,000 W capacity threshold line and the diurnal simulation scrub bar.',
      evaluationChecklist: [
        'Total Household Load (W & kW) computed from active appliances',
        'Inverter loading % and capacity threshold headroom indicator',
        '24-hour diurnal solar irradiance slider synchronized across all cards',
      ],
      suggestedActionLabel: 'Jump to Peak Solar (12:30 PM)',
      onAction: () => {
        setSimulatedHour(12.5);
      },
    },
    {
      stepNumber: 2,
      title: 'Switch Appliances & Test Overload',
      tabTarget: 'appliances',
      icon: Tv2,
      badge: 'Step 2 of 6 · Load Switching',
      headline: 'Toggle High-Draw Loads & Trigger Capacity Breach',
      description: 'Interact with individual appliance switches. Toggling the Level-2 EV Charger (+2,400 W) or Heat Pump instantly pushes total power above the 3,000 W threshold, engaging safety overload warnings.',
      evaluationChecklist: [
        'Deterministic additive sum: active loads reflect exact nameplate ratings',
        'Capacity exceedance banner activates when P_load > P_limit',
        'Flexible loads marked as deferrable can be scheduled by the optimizer',
      ],
      suggestedActionLabel: 'Toggle EV Charger (+2400 W)',
      onAction: () => {
        const evAppliance = state.appliances.find((a) => a.id === 'ev_charger');
        if (evAppliance) {
          toggleAppliance('ev_charger');
        }
      },
    },
    {
      stepNumber: 3,
      title: 'Observe Kirchhoff Power Flows',
      tabTarget: 'energy_flow',
      icon: GitFork,
      badge: 'Step 3 of 6 · Nodal Balance',
      headline: 'Inspect Deterministic Energy Routing Diagram',
      description: 'View the central inverter busbar dispatching power according to Kirchhoff’s Current Law: Solar generation feeds house loads first, surplus charges storage or exports to grid, and deficits import from the utility.',
      evaluationChecklist: [
        'Nodal balance holds strictly: Sum(Supply) = Sum(Demand)',
        'Dynamic color coding: Green export (+W), Crimson import (-W)',
        'Battery mode switches between Idle, Self-Consumption, and Charging',
      ],
      suggestedActionLabel: 'Verify Nodal Balance',
      onAction: () => {
        onNavigateTab('energy_flow');
      },
    },
    {
      stepNumber: 4,
      title: 'Simulate Grid Outage & Microgrid Islanding',
      tabTarget: 'scenarios',
      icon: AlertTriangle,
      badge: 'Step 4 of 6 · Scenario Engineering',
      headline: 'Test Islanded Microgrid & Contingency Load Shedding',
      description: 'Simulate an unexpected distribution grid blackout. The inverter automatically switches to islanded microgrid mode. Non-critical loads shed immediately while battery storage protects essential circuits.',
      evaluationChecklist: [
        'Utility grid import and export drop immediately to 0 W',
        'Unmet load deficit and blackout safety hazard alerts trigger if PV + BESS < demand',
        'Compare Before vs. After scenario deltas across 7 electrical test cases',
      ],
      suggestedActionLabel: 'Load Grid Outage Scenario',
      onAction: () => {
        loadScenario('grid_outage');
        onNavigateTab('scenarios');
      },
    },
    {
      stepNumber: 5,
      title: 'Run Constraint-Aware Smart Scheduling',
      tabTarget: 'scheduling',
      icon: CalendarClock,
      badge: 'Step 5 of 6 · Heuristic Optimization',
      headline: 'Shift Deferrable Loads to Minimize Peak & Cost',
      description: 'Examine the LoadPilot AI heuristic scheduling engine. By shifting deferrable appliances (EV charger, heat pump, dishwasher) out of on-peak tariff hours ($0.38/kWh) into solar surplus windows, peak load drops by over 30%.',
      evaluationChecklist: [
        'Transparent greedy heuristic with hourly feeder capacity constraints',
        'Before vs. After load profile overlay chart with peak reduction metrics',
        'Demonstrates measurable dollar savings without service interruption',
      ],
      suggestedActionLabel: 'View Before vs After Schedule',
      onAction: () => {
        onNavigateTab('scheduling');
      },
    },
    {
      stepNumber: 6,
      title: 'Export Simulation Report & CSV Audit Data',
      tabTarget: 'overview',
      icon: FileText,
      badge: 'Step 6 of 6 · Verification & Export',
      headline: 'Generate Formal Engineering Audit Sheet & CSV Data',
      description: 'Open the comprehensive simulation report containing full mathematical formulations, cumulative kWh balances, scenario audits, and a one-click CSV time-series download with clear academic disclaimers.',
      evaluationChecklist: [
        'Complete printable energy balance summary with IEEE standard units',
        'CSV file download formatted with RFC-4180 compliance and simulated disclaimer header',
        'One-click Demo Reset button restores all initial parameters cleanly',
      ],
      suggestedActionLabel: 'Open Simulation Audit Sheet',
      onAction: () => {
        onOpenReportModal();
      },
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigateTab(steps[nextIndex].tabTarget);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigateTab(steps[prevIndex].tabTarget);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    onNavigateTab(steps[index].tabTarget);
  };

  const handleResetDemoWithToast = () => {
    resetDemo();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14181F] border border-[#2D936C] text-[#2ECC71] shadow-2xl shadow-emerald-950/40 hover:bg-[#1A222B] transition-all"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span className="text-xs font-bold text-white">Resume Evaluator Walkthrough</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16291F] border border-[#2D936C]/40 text-[#2ECC71]">
            Step {currentStepIndex + 1}/6
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[480px] z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-2xl border border-[#2D936C]/60 bg-[#12161E]/95 backdrop-blur-xl shadow-2xl shadow-black/80 p-4 sm:p-5 text-slate-100 relative overflow-hidden">
        {/* Subtle top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B5E3F] via-[#2ECC71] to-[#E11D48]" />

        {/* Header: Title, Step Counter, Minimize & Close */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#202733]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#16291F] border border-[#2D936C]/40 flex items-center justify-center text-[#2ECC71]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Guided Evaluator Tour</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30">
                  Step {currentStep.stepNumber} of 6
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors text-xs font-mono"
              title="Minimize tour"
            >
              Minimize
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
              title="Exit walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Indicator Bullets */}
        <div className="grid grid-cols-6 gap-1.5 my-3">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => handleStepClick(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.6)]'
                  : idx < currentStepIndex
                  ? 'bg-[#1B5E3F]'
                  : 'bg-[#202733]'
              }`}
              title={`Step ${s.stepNumber}: ${s.title}`}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#161B23] border border-[#26303D] flex items-center justify-center text-[#2ECC71] shrink-0 mt-0.5">
              <currentStep.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {currentStep.headline}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Academic Evaluator Checklist */}
          <div className="p-2.5 rounded-lg bg-[#0C0F14] border border-[#1E2532] space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#2ECC71] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#2ECC71]" />
              <span>What to verify in this step:</span>
            </span>
            <ul className="space-y-1 text-[10px] text-slate-300">
              {currentStep.evaluationChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive 1-Click Action Button if provided */}
          {currentStep.suggestedActionLabel && currentStep.onAction && (
            <button
              onClick={currentStep.onAction}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{currentStep.suggestedActionLabel}</span>
            </button>
          )}
        </div>

        {/* Footer Navigation & Prominent Reset Demo Button */}
        <div className="mt-3.5 pt-3 border-t border-[#202733] flex items-center justify-between gap-2">
          {/* Reset Demo button */}
          <button
            onClick={handleResetDemoWithToast}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 hover:text-white bg-[#161B23] hover:bg-[#1F2530] border border-[#2A313E] rounded-md transition-colors"
            title="Reset simulation parameters to default baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#2ECC71] ${resetFeedback ? 'animate-spin' : ''}`} />
            <span>{resetFeedback ? 'Reset Complete!' : 'Reset Demo'}</span>
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`p-1.5 rounded border border-[#202733] text-xs transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-30 text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A222B]'
              }`}
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 transition-colors shadow-sm"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 transition-colors shadow-sm"
              >
                <span>Finish Tour</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
