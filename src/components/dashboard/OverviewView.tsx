import React from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { CapacityWarningBanner } from './CapacityWarningBanner';
import { SimulationControlsBar } from './SimulationControlsBar';
import { DashboardCharts } from './DashboardCharts';
import { ApplianceCard } from './ApplianceCard';
import { 
  Zap, 
  Sun, 
  Sliders, 
  Battery, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Scale,
  BookOpen
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
  onNavigateToBuilder?: () => void;
  onOpenReportModal?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ 
  onNavigate, 
  onNavigateToBuilder,
  onOpenReportModal 
}) => {
  const { state, metrics } = useEnergySimulation();

  const isExporting = metrics.gridExportW > 0;
  const isImporting = metrics.gridImportW > 0;

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Capacity Warning / Status Banner */}
      <CapacityWarningBanner onNavigateToAppliances={() => onNavigate('appliances')} />

      {/* Step 5: Continuous Time-Step Simulation Engine Controls Bar */}
      <SimulationControlsBar onOpenReportModal={onOpenReportModal} />

      {/* Feature Spotlight: Smart Home Builder */}
      {onNavigateToBuilder && (
        <div className="rounded-xl border border-[#2D936C]/40 bg-gradient-to-r from-[#14231B] via-[#101915] to-[#14181F] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/40 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Interactive Smart Home Builder (Phase 3)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30 uppercase font-semibold">
                  SIMULATOR
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Design and simulate rooftop solar, hybrid inverter, BESS battery, rooms, EV charging and appliances with real-time Kirchhoff power flow.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToBuilder}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] active:bg-[#154C32] border border-[#2D936C]/40 rounded-md transition-all flex items-center gap-1.5 shadow-md shrink-0 self-start sm:self-center"
          >
            <span>Open Smart Home Builder</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        </div>
      )}

      {/* Step 5 & Phase 4 Gateway Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <button
          onClick={() => onNavigate('scenarios')}
          className="text-left rounded-xl border border-[#2D936C]/40 hover:border-[#2ECC71] bg-gradient-to-b from-[#14231B] to-[#10151C] p-4 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/40 font-bold">
                Step 5
              </span>
              <span className="text-xs font-bold text-white">7 Engineering Scenarios</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2ECC71] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Normal, High-Load, Low-Solar, Outage, Empty Battery, Surplus, and Before/After smart optimization delta benchmarks.
          </p>
        </button>

        <button
          onClick={() => onNavigate('forecasting')}
          className="text-left rounded-xl border border-[#252B35] hover:border-[#2D936C]/50 bg-[#14181F] p-4 transition-all hover:bg-[#161B23] group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 font-semibold">
                Phase 4
              </span>
              <span className="text-xs font-bold text-white">Demand Forecasting</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#2ECC71] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Multi-horizon trajectory forecasting (6h, 12h, 24h) with empirical validation error scores (MAE, RMSE, MAPE).
          </p>
        </button>

        <button
          onClick={() => onNavigate('scheduling')}
          className="text-left rounded-xl border border-[#252B35] hover:border-[#2D936C]/50 bg-[#14181F] p-4 transition-all hover:bg-[#161B23] group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 font-semibold">
                Phase 4
              </span>
              <span className="text-xs font-bold text-white">Smart Load Scheduling</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#2ECC71] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Constraint-aware optimization engine that shifts flexible loads (EV, pumps, AC) under peak limits and aligns with solar surplus.
          </p>
        </button>
      </div>

      {/* 2. Primary KPI Ribbon (6 Core Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Active Load */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Household Load</span>
            <Zap className="w-3.5 h-3.5 text-[#2ECC71]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.totalHouseholdLoadW} <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-[#2ECC71] mt-1">
            {metrics.totalHouseholdLoadKW.toFixed(2)} kW Active
          </div>
        </div>

        {/* Metric 2: Configured Load Capacity */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Capacity Limit</span>
            <Sliders className="w-3.5 h-3.5 text-[#FB7185]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-[#FB7185] tabular-nums">
            {metrics.capacityLimitKW.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {metrics.capacityLimitW} W Ceiling
          </div>
        </div>

        {/* Metric 3: Solar Generation */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Solar PV Output</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-amber-300 tabular-nums">
            {metrics.solarGenerationW} <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-amber-400/80 mt-1">
            {metrics.solarGenerationKW.toFixed(2)} kW Injected
          </div>
        </div>

        {/* Metric 4: Grid Import / Export */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Grid Exchange</span>
            {isExporting ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#2ECC71]" />
            ) : (
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#FB7185]" />
            )}
          </div>
          <div className={`mt-2 text-xl sm:text-2xl font-mono font-bold tabular-nums ${isExporting ? 'text-[#2ECC71]' : isImporting ? 'text-[#FB7185]' : 'text-slate-300'}`}>
            {isExporting ? `+${metrics.gridExportW}` : isImporting ? `-${metrics.gridImportW}` : '0'}{' '}
            <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            {isExporting ? 'Exporting Surplus' : isImporting ? 'Importing Grid' : 'Zero Net'}
          </div>
        </div>

        {/* Metric 5: Battery State of Charge */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Battery SoC</span>
            <Battery className="w-3.5 h-3.5 text-[#2ECC71]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {state.batterySoCPct}%
          </div>
          <div className="text-[11px] font-mono text-emerald-300 mt-1">
            {state.batteryCapacityKWh} kWh Pack
          </div>
        </div>

        {/* Metric 6: Current Capacity Status */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Capacity Status</span>
            {metrics.isCapacityExceeded ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#FB7185]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC71]" />
            )}
          </div>
          <div className={`mt-2 text-sm sm:text-base font-bold tracking-tight truncate ${metrics.isCapacityExceeded ? 'text-[#FB7185]' : 'text-[#2ECC71]'}`}>
            {metrics.isCapacityExceeded ? 'Overload Warning' : 'Nominal Safe'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {metrics.capacityUtilizationPct}% Capacity Used
          </div>
        </div>
      </div>

      {/* 3. Analytical Charts Component */}
      <DashboardCharts />

      {/* 4. Quick Appliance Roster Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Quick Appliance Dispatch</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                (Click switches to see real-time power recalculation)
              </span>
            </h3>
          </div>

          <button
            onClick={() => onNavigate('appliances')}
            className="text-xs font-semibold text-[#2ECC71] hover:text-[#A7F3D0] flex items-center gap-1 transition-colors"
          >
            <span>Open Appliance Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {state.appliances.slice(0, 4).map((appliance) => (
            <ApplianceCard key={appliance.id} appliance={appliance} compact={true} />
          ))}
        </div>
      </div>

      {/* 5. Educational Disclosure Disclaimer */}
      <div className="rounded-xl border border-[#20252F] bg-[#0E1115] p-3.5 sm:p-4 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2ECC71] shrink-0" />
          <span>Demo configuration with deterministic physical model · Not connected to live electrical hardware</span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#2ECC71] hover:underline shrink-0"
        >
          Configure Settings →
        </button>
      </div>
    </div>
  );
};
