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
  BookOpen,
  Wallet,
  CloudSun,
  Activity,
  Maximize2
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
  const { state, metrics, estimatedNetEnergyCostUSD, tariff } = useEnergySimulation();

  const isExporting = metrics.gridExportW > 0;
  const isImporting = metrics.gridImportW > 0;

  // Autonomy hours estimate
  const batteryKWhAvailable = state.batteryConfig.capacityKWh * (state.batteryConfig.socPct / 100);
  const currentLoadKW = Math.max(0.1, metrics.totalHouseholdLoadKW);
  const autonomyHours = (batteryKWhAvailable / currentLoadKW).toFixed(1);

  // Load balance percentages (Solar vs Grid)
  const totalSupplyW = Math.max(1, metrics.solarGenerationW + metrics.gridImportW + Math.max(0, metrics.batteryPowerFlowW));
  const cleanEnergyPct = Math.min(100, Math.round(((metrics.solarGenerationW + Math.max(0, metrics.batteryPowerFlowW)) / totalSupplyW) * 100));
  const gridPct = Math.max(0, 100 - cleanEnergyPct);

  // Radial dial calculation for battery status (matching Ekova visual reference)
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (state.batteryConfig.socPct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Capacity Warning / Status Banner */}
      <CapacityWarningBanner onNavigateToAppliances={() => onNavigate('appliances')} />

      {/* Step 5: Continuous Time-Step Simulation Engine Controls Bar */}
      <SimulationControlsBar onOpenReportModal={onOpenReportModal} />

      {/* =========================================================================
          EKOVA-INSPIRED LUXURY ENERGY TELEMETRY DECK (BLACK, GREEN & CRIMSON RED)
          ========================================================================= */}
      <div className="rounded-3xl border border-[#18202A] bg-[#0A0D12]/95 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle ambient luxury organic glow */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-[#10B981]/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[250px] bg-[#E11D48]/8 blur-[120px] pointer-events-none rounded-full" />

        {/* Top Deck Row: Welcome Greeting + Estimated Full + Battery Status Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-10">
          {/* Welcome Card: Inspired by Ekova Web App Header */}
          <div className="lg:col-span-5 rounded-2xl border border-[#18202A] bg-[#0D1117] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#10B981] font-semibold">
                  Intelligent Energy Control
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Welcome in, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#10B981]">
                  LoadPilot AI.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Monitor solar energy. Reduce peak costs. Power the future with constraint-aware load scheduling.
              </p>
            </div>

            {/* Circular Feature Pill Badges */}
            <div className="mt-6 pt-4 border-t border-[#18202A] flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-full bg-[#0D2419] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-sm"
                title="Solar PV Harvest Active"
              >
                <Sun className="w-4 h-4" />
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-[#0D2419] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-sm"
                title="BESS Battery Unit Online"
              >
                <Battery className="w-4 h-4" />
              </div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  metrics.isCapacityExceeded 
                    ? 'bg-[#3B0C15] border border-[#BE123C]/60 text-[#FB7185]' 
                    : 'bg-[#0D2419] border border-[#10B981]/40 text-[#10B981]'
                }`}
                title={metrics.isCapacityExceeded ? 'Peak Exceeded Alert' : 'Feeder Nominal Safe'}
              >
                {metrics.isCapacityExceeded ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 ml-1">
                {metrics.isCapacityExceeded ? 'Grid Threshold Alert' : 'System Safe & Nominal'}
              </span>
            </div>
          </div>

          {/* Card: Estimated Full / Autonomous Reserve (Ekova Micro Bar Chart) */}
          <div className="lg:col-span-3 rounded-2xl border border-[#18202A] bg-[#0D1117] p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Estimated Reserve
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="my-3">
              <div className="text-2xl font-mono font-bold text-white tracking-tight tabular-nums">
                {autonomyHours} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
              <div className="text-[11px] font-mono text-[#10B981] mt-0.5">
                {state.batteryConfig.mode === 'charging' ? 'Charging Solar' : 'Storage Autonomy'}
              </div>
            </div>

            {/* Micro vertical bar histogram (Ekova Aesthetic) */}
            <div className="h-12 w-full flex items-end justify-between gap-1 pt-1 border-t border-[#18202A]">
              {[35, 60, 45, 80, 65, 90, 75, 100, 85, 70, 55, 90, 80, 65].map((val, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-t-sm transition-all ${
                    i >= 10 ? 'bg-[#10B981]' : 'bg-[#18202A]'
                  }`}
                  style={{ height: `${(val / 100) * 36}px` }}
                />
              ))}
            </div>
          </div>

          {/* Card: Battery Status Radial Gauge Ring (Ekova 78% Charging Radial Dial) */}
          <div className="lg:col-span-4 rounded-2xl border border-[#18202A] bg-[#0D1117] p-5 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Battery Status</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">
                {state.batteryConfig.socPct}%
              </div>
              <div className="text-[11px] font-mono text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="uppercase">{state.batteryConfig.mode}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                {state.batteryConfig.capacityKWh} kWh Pack · {metrics.batteryPowerFlowW !== 0 ? `${Math.abs(metrics.batteryPowerFlowW)} W` : 'Standby'}
              </div>
            </div>

            {/* Circular Radial Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                {/* Background Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="#18202A"
                  strokeWidth="6"
                  strokeDasharray="4 3"
                />
                {/* Value Progress Arc in Vibrant Emerald Green */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={state.batteryConfig.socPct < 20 ? '#E11D48' : '#10B981'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold font-mono text-white">
                  {state.batteryConfig.socPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Deck Row: Total Energy, Load Balance, Net Bill, Weather, Energy Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {/* 1. Total Energy Card */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Active Demand</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-mono font-bold text-white tabular-nums">
                {metrics.totalHouseholdLoadW} <span className="text-xs font-normal text-slate-400">W</span>
              </div>
              <div className="text-[11px] font-mono text-[#10B981]">
                {metrics.totalHouseholdLoadKW.toFixed(2)} kW Active
              </div>
            </div>
            {/* Segmented Pill Indicator */}
            <div className="space-y-1 pt-2 border-t border-[#18202A]">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Capacity Util.:</span>
                <span className={metrics.isCapacityExceeded ? 'text-[#FB7185] font-bold' : 'text-[#10B981]'}>
                  {metrics.capacityUtilizationPct}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#18202A] rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    metrics.isCapacityExceeded 
                      ? 'bg-[#E11D48]' 
                      : 'bg-[#10B981]'
                  }`}
                  style={{ width: `${Math.min(100, metrics.capacityUtilizationPct)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Load Balance Card */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Power Mix Balance</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div className="my-2 flex items-baseline justify-between">
              <div>
                <div className="text-xl font-mono font-bold text-[#10B981]">
                  {cleanEnergyPct}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Solar & BESS</div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-mono font-bold ${gridPct > 50 ? 'text-[#FB7185]' : 'text-slate-200'}`}>
                  {gridPct}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Grid Import</div>
              </div>
            </div>
            {/* Dual Color Micro Meter Bar */}
            <div className="h-2 w-full bg-[#18202A] rounded-full overflow-hidden flex pt-0.5">
              <div 
                className="h-full bg-[#10B981] transition-all duration-300" 
                style={{ width: `${cleanEnergyPct}%` }}
                title={`Clean Solar/Battery: ${cleanEnergyPct}%`}
              />
              <div 
                className="h-full bg-[#E11D48] transition-all duration-300" 
                style={{ width: `${gridPct}%` }}
                title={`Grid Import: ${gridPct}%`}
              />
            </div>
          </div>

          {/* 3. Tariff & Bill Delta Card */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Net Energy Balance</span>
              <Wallet className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="my-2">
              <div className={`text-2xl font-mono font-bold tabular-nums ${estimatedNetEnergyCostUSD > 0 ? 'text-[#FB7185]' : 'text-[#10B981]'}`}>
                {tariff.currencySymbol}{Math.abs(estimatedNetEnergyCostUSD).toFixed(2)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {estimatedNetEnergyCostUSD > 0 ? 'Estimated Bill Cost' : 'Solar Net Credit'}
              </div>
            </div>
            <div className="pt-2 border-t border-[#18202A] flex justify-between text-[10px] font-mono text-slate-400">
              <span>Feed-in: {tariff.currencySymbol}{tariff.exportFeedInRatePerKWh}/kWh</span>
              <span className="text-[#10B981]">Active DSM</span>
            </div>
          </div>

          {/* 4. Weather & Solar Irradiance Card */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Site Weather & Solar</span>
              <CloudSun className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="my-2 flex items-center justify-between">
              <div>
                <div className="text-xl font-mono font-bold text-white">
                  Sunny 32°C
                </div>
                <div className="text-[11px] font-mono text-[#10B981]">
                  Irradiance: {state.sunIrradiancePct}%
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#0D2419] border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>
            <div className="pt-2 border-t border-[#18202A] flex justify-between text-[10px] font-mono text-slate-400">
              <span>Output: {metrics.solarGenerationW} W</span>
              <span className="text-[#10B981]">{(metrics.solarGenerationW / 1000).toFixed(2)} kW</span>
            </div>
          </div>
        </div>

        {/* Bottom Energy Flow Segmented Bar (Matching Ekova Bottom Pill) */}
        <div className="p-4 rounded-2xl border border-[#18202A] bg-[#07090C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10B981]" />
            <span className="font-bold text-white">Continuous Energy Flow Conduits:</span>
          </div>

          {/* Segmented 3-color Pill Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2419] border border-[#10B981]/40 text-[#10B981]">
              <Sun className="w-3.5 h-3.5" />
              <span>Solar: {metrics.solarGenerationW}W</span>
            </div>
            <div className="flex-1 sm:flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141B24] border border-[#222E3E] text-slate-200">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <span>Load: {metrics.totalHouseholdLoadW}W</span>
            </div>
            <div className={`flex-1 sm:flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isExporting 
                ? 'bg-[#0D2419] border-[#10B981]/40 text-[#10B981]' 
                : isImporting 
                ? 'bg-[#3B0C15] border-[#BE123C]/50 text-[#FB7185]' 
                : 'bg-[#141B24] border-[#222E3E] text-slate-400'
            }`}>
              {isExporting ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
              <span>Grid: {isExporting ? `+${metrics.gridExportW}W` : isImporting ? `-${metrics.gridImportW}W` : '0W'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Spotlight: Smart Home Builder */}
      {onNavigateToBuilder && (
        <div className="rounded-2xl border border-[#10B981]/30 bg-gradient-to-r from-[#0B1E15] via-[#0D1217] to-[#0A0D12] p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#059669] text-white border border-[#10B981]/40 flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Interactive Smart Home Builder (Phase 3)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D2419] text-[#10B981] border border-[#10B981]/30 uppercase font-semibold">
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
            className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#10B981] active:bg-[#047857] border border-[#10B981]/40 rounded-xl transition-all flex items-center gap-1.5 shadow-md shrink-0 self-start sm:self-center"
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
          className="text-left rounded-2xl border border-[#10B981]/30 hover:border-[#10B981] bg-gradient-to-b from-[#0D1A13] to-[#0A0D12] p-4 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#059669] text-white font-bold">
                Step 5
              </span>
              <span className="text-xs font-bold text-white">7 Engineering Scenarios</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#10B981] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Normal, High-Load, Low-Solar, Outage, Empty Battery, Surplus, and Before/After smart optimization delta benchmarks.
          </p>
        </button>

        <button
          onClick={() => onNavigate('forecasting')}
          className="text-left rounded-2xl border border-[#18202A] hover:border-[#10B981]/50 bg-[#0D1117] p-4 transition-all hover:bg-[#121720] group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0D2419] text-[#10B981] border border-[#10B981]/40 font-semibold">
                Phase 4
              </span>
              <span className="text-xs font-bold text-white">Demand Forecasting</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Multi-horizon trajectory forecasting (6h, 12h, 24h) with empirical validation error scores (MAE, RMSE, MAPE).
          </p>
        </button>

        <button
          onClick={() => onNavigate('scheduling')}
          className="text-left rounded-2xl border border-[#18202A] hover:border-[#10B981]/50 bg-[#0D1117] p-4 transition-all hover:bg-[#121720] group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0D2419] text-[#10B981] border border-[#10B981]/40 font-semibold">
                Phase 4
              </span>
              <span className="text-xs font-bold text-white">Smart Load Scheduling</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Constraint-aware optimization engine that shifts flexible loads (EV, pumps, AC) under peak limits and aligns with solar surplus.
          </p>
        </button>
      </div>

      {/* 2. Primary KPI Ribbon (6 Core Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Active Load */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Household Load</span>
            <Zap className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.totalHouseholdLoadW} <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-[#10B981] mt-1">
            {metrics.totalHouseholdLoadKW.toFixed(2)} kW Active
          </div>
        </div>

        {/* Metric 2: Configured Load Capacity */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
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

        {/* Metric 3: Solar Generation in Vibrant Emerald Green */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Solar PV Output</span>
            <Sun className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-[#10B981] tabular-nums">
            {metrics.solarGenerationW} <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-300 mt-1">
            {metrics.solarGenerationKW.toFixed(2)} kW Injected
          </div>
        </div>

        {/* Metric 4: Grid Import / Export */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Grid Exchange</span>
            {isExporting ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
            ) : (
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#FB7185]" />
            )}
          </div>
          <div className={`mt-2 text-xl sm:text-2xl font-mono font-bold tabular-nums ${isExporting ? 'text-[#10B981]' : isImporting ? 'text-[#FB7185]' : 'text-slate-300'}`}>
            {isExporting ? `+${metrics.gridExportW}` : isImporting ? `-${metrics.gridImportW}` : '0'}{' '}
            <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            {isExporting ? 'Exporting Surplus' : isImporting ? 'Importing Grid' : 'Zero Net'}
          </div>
        </div>

        {/* Metric 5: Battery State of Charge */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Battery SoC</span>
            <Battery className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {state.batterySoCPct}%
          </div>
          <div className="text-[11px] font-mono text-emerald-300 mt-1">
            {state.batteryCapacityKWh} kWh Pack
          </div>
        </div>

        {/* Metric 6: Current Capacity Status */}
        <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Capacity Status</span>
            {metrics.isCapacityExceeded ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#FB7185]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            )}
          </div>
          <div className={`mt-2 text-sm sm:text-base font-bold tracking-tight truncate ${metrics.isCapacityExceeded ? 'text-[#FB7185]' : 'text-[#10B981]'}`}>
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
            className="text-xs font-semibold text-[#10B981] hover:text-emerald-300 flex items-center gap-1 transition-colors"
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
      <div className="rounded-2xl border border-[#18202A] bg-[#07090C] p-3.5 sm:p-4 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>Demo configuration with deterministic physical model · Not connected to live electrical hardware</span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#10B981] hover:underline shrink-0"
        >
          Configure Settings →
        </button>
      </div>
    </div>
  );
};
