import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { SmartHomeHouseVisualizer } from './SmartHomeHouseVisualizer';
import { EquipmentConfigDrawer } from './EquipmentConfigDrawer';
import { 
  ArrowLeft, 
  RotateCcw, 
  Zap, 
  Sun, 
  Battery, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Layers,
  ArrowRightLeft,
  Info
} from 'lucide-react';

interface SmartHomeBuilderPageProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'builder') => void;
}

export const SmartHomeBuilderPage: React.FC<SmartHomeBuilderPageProps> = ({ onNavigate }) => {
  const { state, metrics, resetDemo } = useEnergySimulation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#101317] text-[#E4E4E7] flex flex-col font-sans selection:bg-[#1B5E3F] selection:text-white">
      {/* Top Builder Navigation & Status Bar */}
      <header className="sticky top-0 z-30 bg-[#101317]/95 backdrop-blur-md border-b border-[#232931] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Back to Dashboard & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 text-xs font-medium text-[#A1A1AA] hover:text-white px-2.5 py-1.5 rounded-lg border border-[#232931] hover:border-[#384351] bg-[#161B22] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>Dashboard</span>
          </button>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Build Your Smart Home
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1B5E3F]/30 text-[#2ECC71] border border-[#2ECC71]/40">
                Phase 3 Engineering Studio
              </span>
            </div>
            <p className="text-xs text-[#71717A] hidden md:block">
              Interactive architectural cutaway simulation & deterministic equipment sizing
            </p>
          </div>
        </div>

        {/* Right: Quick System Status & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 bg-[#161B22] px-3 py-1.5 rounded-lg border border-[#232931] text-xs font-mono">
            <span className="text-[#71717A]">Inverter Efficiency:</span>
            <span className="text-[#38BDF8] font-bold">{state.inverterConfig.efficiencyPct}%</span>
            <span className="text-[#3F3F46]">|</span>
            <span className="text-[#71717A]">Grid Link:</span>
            <span className={`font-bold ${state.gridConfig.isConnected ? 'text-[#2ECC71]' : 'text-[#E11D48]'}`}>
              {state.gridConfig.isConnected ? 'Tied' : 'Islanded'}
            </span>
          </div>

          <button
            onClick={resetDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#161B22] hover:bg-[#1E252D] text-[#A1A1AA] hover:text-white border border-[#232931] transition-colors"
            title="Reset equipment to default demonstration baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Live Power Balance Formula Ribbon */}
        <div className="p-4 rounded-xl bg-[#141920] border border-[#232931] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="flex items-center space-x-2 bg-[#0c0f12] px-3 py-1.5 rounded-lg border border-[#232931]">
              <span className="text-[#71717A]">Load:</span>
              <span className="font-bold text-[#E4E4E7]">{metrics.totalHouseholdLoadKW.toFixed(2)} kW</span>
            </div>
            <span className="text-[#71717A] font-bold">=</span>
            <div className="flex items-center space-x-2 bg-[#0c0f12] px-3 py-1.5 rounded-lg border border-[#232931]">
              <span className="text-[#F59E0B]">Solar:</span>
              <span className="font-bold text-[#F59E0B]">{metrics.solarGenerationKW.toFixed(2)} kW</span>
            </div>
            <span className="text-[#71717A] font-bold">+</span>
            <div className="flex items-center space-x-2 bg-[#0c0f12] px-3 py-1.5 rounded-lg border border-[#232931]">
              <span className="text-[#2ECC71]">Battery:</span>
              <span className="font-bold text-[#2ECC71]">
                {metrics.batteryPowerFlowW > 0 
                  ? `+${(metrics.batteryPowerFlowW / 1000).toFixed(2)} kW` 
                  : metrics.batteryPowerFlowW < 0 
                    ? `-${(Math.abs(metrics.batteryPowerFlowW) / 1000).toFixed(2)} kW` 
                    : '0.00 kW'}
              </span>
            </div>
            <span className="text-[#71717A] font-bold">+</span>
            <div className="flex items-center space-x-2 bg-[#0c0f12] px-3 py-1.5 rounded-lg border border-[#232931]">
              <span className="text-[#38BDF8]">Grid:</span>
              <span className={`font-bold ${metrics.effectiveNetGridW > 0 ? 'text-[#F59E0B]' : metrics.effectiveNetGridW < 0 ? 'text-[#2ECC71]' : 'text-[#71717A]'}`}>
                {!state.gridConfig.isConnected 
                  ? '0.00 kW (Islanded)' 
                  : metrics.effectiveNetGridW > 0 
                    ? `+${(metrics.gridImportW / 1000).toFixed(2)} kW` 
                    : `-${(metrics.gridExportW / 1000).toFixed(2)} kW`}
              </span>
            </div>
          </div>

          {/* System Feasibility Status Badge */}
          <div className="flex items-center space-x-2">
            {metrics.status === 'islanded_alert' || metrics.unmetDemandW > 0 ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson-950/80 border border-crimson-700/60 text-crimson-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-crimson-400" />
                <span>Deficit: {(metrics.unmetDemandW / 1000).toFixed(2)} kW Unmet</span>
              </div>
            ) : metrics.isInverterOverloaded ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson-950/80 border border-crimson-700/60 text-crimson-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-crimson-400" />
                <span>Inverter Sizing Exceeded (+{metrics.inverterOverloadByW}W)</span>
              </div>
            ) : metrics.isCapacityExceeded ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Grid Capacity Over Limit</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#18261F] border border-[#2ECC71]/40 text-[#2ECC71] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
                <span>Power Balance Satisfied</span>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Visualizer & Equipment Configuration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Architectural Cutaway (approx 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <SmartHomeHouseVisualizer
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />

            {/* Quick Helper Tips */}
            <div className="p-4 rounded-xl bg-[#141920]/80 border border-[#232931] text-xs text-[#A1A1AA] flex items-start space-x-3">
              <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#E4E4E7]">Interactive Visualizer Controls:</p>
                <p className="mt-1 leading-relaxed text-[#71717A]">
                  Click on any appliance or component hotspot in the cross-section to toggle power or configure specifications in the right drawer. Scrub the top slider to observe solar diurnal irradiance shifts from sunrise through solar noon to night.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Equipment Configuration Drawer / Studio (approx 5 cols) */}
          <div className="lg:col-span-5">
            <EquipmentConfigDrawer
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-[#232931] bg-[#0c0f12] py-4 px-6 text-center text-xs text-[#71717A] font-mono">
        LoadPilot AI Engineering Studio • Deterministic Mathematical Power Dispatch Model • College Capstone Prototype
      </footer>
    </div>
  );
};
