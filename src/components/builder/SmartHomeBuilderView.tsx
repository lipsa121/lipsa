import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { SmartHomeCanvas } from './SmartHomeCanvas';
import { SmartHomeConfigPanel } from './SmartHomeConfigPanel';
import { 
  Home, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon, 
  Zap, 
  Battery, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  LayoutDashboard,
  ShieldCheck,
  Info,
  Maximize2
} from 'lucide-react';
import { TimeOfDay } from '../../types/simulation';

interface SmartHomeBuilderViewProps {
  onBackToDashboard: () => void;
  onBackToLanding: () => void;
}

export const SmartHomeBuilderView: React.FC<SmartHomeBuilderViewProps> = ({
  onBackToDashboard,
  onBackToLanding,
}) => {
  const {
    state,
    metrics,
    setTimeOfDay,
    toggleSimulationPlay,
    resetDemo,
    selectedComponentId,
    setSelectedComponentId,
  } = useEnergySimulation();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const times: { id: TimeOfDay; label: string; icon: string }[] = [
    { id: 'morning', label: 'Morning (08h)', icon: '🌅' },
    { id: 'noon', label: 'Noon Peak (12h)', icon: '☀️' },
    { id: 'afternoon', label: 'Afternoon (15h)', icon: '🌤️' },
    { id: 'evening', label: 'Evening (18h)', icon: '🌇' },
    { id: 'night', label: 'Night (22h)', icon: '🌙' },
  ];

  return (
    <div className="min-h-screen bg-[#101317] text-slate-100 flex flex-col selection:bg-[#1B5E3F]/30 selection:text-emerald-300">
      {/* Top Engineering Control Navbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#222731] bg-[#101317]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161B22] border border-[#26303D] flex items-center justify-center relative">
            <Home className="w-4 h-4 text-[#2ECC71]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Build Your Smart Home
              </span>
              <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30">
                Phase 3 Interactive Simulator
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Photovoltaic, Inverter, Storage & Appliance Microgrid Modeling Engine
            </p>
          </div>
        </div>

        {/* Global Action Navigation Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reset Button */}
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 text-xs text-slate-300 hover:text-white bg-[#161B22] hover:bg-[#202632] border border-[#252C38] rounded-md transition-colors flex items-center gap-1.5"
            title="Reset Simulation Setup"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Return to Dashboard */}
          <button
            onClick={onBackToDashboard}
            className="px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] active:bg-[#154C32] border border-[#2D936C]/40 rounded-md transition-colors flex items-center gap-1.5 shadow-md"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-200" />
            <span>View Dashboard</span>
          </button>
        </div>
      </header>

      {/* Confirmation Reset Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#252B35] bg-[#12151B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B0C15] text-[#FB7185] border border-[#BE123C]/40 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reset Smart Home Setup?</h4>
                <p className="text-xs text-slate-400">Restore factory baseline specifications</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore solar to 3 kWp, inverter to 5 kW, battery to 8 kWh (80% SoC), grid connected at 3 kW limit, and reset all room appliance wattages and initial states.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#1A1F27] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemo();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#BE123C] hover:bg-[#E11D48] rounded-md shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Simulator Stage */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* KPI & Power Balance Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Household Demand */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Household Load</span>
              <Zap className="w-3.5 h-3.5 text-[#2ECC71]" />
            </div>
            <div className="mt-2 text-xl font-mono font-bold text-white tabular-nums">
              {metrics.totalHouseholdLoadW} <span className="text-xs font-normal text-slate-400">W</span>
            </div>
            <div className="text-[11px] font-mono text-[#2ECC71] mt-1">
              {metrics.totalHouseholdLoadKW.toFixed(2)} kW ({state.appliances.filter((a) => a.isOn).length} Loads ON)
            </div>
          </div>

          {/* 2. Solar PV Output */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Rooftop Solar Array</span>
              <Sun className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="mt-2 text-xl font-mono font-bold text-[#10B981] tabular-nums">
              {metrics.solarGenerationW} <span className="text-xs font-normal text-slate-400">W</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 mt-1">
              {state.solar.installedCapacityKW} kWp · {state.sunIrradiancePct}% Sun
            </div>
          </div>

          {/* 3. Inverter Throughput */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Inverter Throughput</span>
              <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="mt-2 text-xl font-mono font-bold text-white tabular-nums">
              {metrics.inverterLoadW} <span className="text-xs font-normal text-slate-400">W</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {metrics.inverterUtilizationPct}% of {state.inverter.ratedCapacityKW} kW Rated
            </div>
          </div>

          {/* 4. Battery Storage */}
          <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>BESS Battery Unit</span>
              <Battery className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="mt-2 text-xl font-mono font-bold text-white tabular-nums">
              {state.battery.stateOfChargePct}% <span className="text-xs font-normal text-slate-400">SoC</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 mt-1">
              {state.battery.capacityKWh} kWh · {metrics.batteryPowerFlowW !== 0 ? `${Math.abs(metrics.batteryPowerFlowW)}W ${metrics.batteryPowerFlowW > 0 ? 'Disch.' : 'Charge'}` : 'Idle'}
            </div>
          </div>

          {/* 5. Grid Exchange / Microgrid Status */}
          <div className="col-span-2 md:col-span-1 rounded-2xl border border-[#18202A] bg-[#0D1117] p-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Grid Balance</span>
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className={`mt-2 text-xl font-mono font-bold tabular-nums ${
              metrics.isIslanded 
                ? 'text-[#FB7185]' 
                : metrics.gridExportW > 0 
                ? 'text-[#10B981]' 
                : 'text-[#FB7185]'
            }`}>
              {metrics.isIslanded ? 'Islanded' : metrics.gridExportW > 0 ? `+${metrics.gridExportW} W` : `-${metrics.gridImportW} W`}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {metrics.isIslanded ? 'Disconnected' : metrics.gridExportW > 0 ? 'Surplus Export' : 'Grid Import'}
            </div>
          </div>
        </div>

        {/* Time of Day & Environmental Simulation Controller */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/80 p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Diurnal Solar Cycle:
            </span>
            <div className="flex items-center bg-[#0E1115] p-1 rounded-lg border border-[#20252F] text-xs">
              {times.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeOfDay(t.id)}
                  className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                    state.timeOfDay === t.id
                      ? 'bg-[#1B5E3F] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Ticking Simulation Play/Pause */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSimulationPlay}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                state.isSimulationPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#161B23] text-slate-300 hover:text-white border border-[#252C38]'
              }`}
            >
              {state.isSimulationPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#2ECC71]" />}
              <span>{state.isSimulationPlaying ? 'Pause Clock' : 'Live Clock (Auto-Tick)'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Workspace: Interactive Smart Home Canvas on Left, Equipment Drawer on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7–8 Cols: Interactive Architectural Cutaway Smart Home */}
          <div className="lg:col-span-8 space-y-4">
            <SmartHomeCanvas
              onSelectComponent={(id) => setSelectedComponentId(id)}
              selectedId={selectedComponentId}
            />

            {/* Quick Component Selection Shortcuts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <button
                onClick={() => setSelectedComponentId('solar')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  selectedComponentId === 'solar' ? 'border-[#2ECC71] bg-[#16291F]' : 'border-[#20252F] bg-[#14181F] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Array</div>
                <div className="font-bold text-white text-xs truncate">Rooftop Solar</div>
              </button>

              <button
                onClick={() => setSelectedComponentId('inverter')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  selectedComponentId === 'inverter' ? 'border-[#2ECC71] bg-[#16291F]' : 'border-[#20252F] bg-[#14181F] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Conversion</div>
                <div className="font-bold text-white text-xs truncate">Hybrid Inverter</div>
              </button>

              <button
                onClick={() => setSelectedComponentId('battery')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  selectedComponentId === 'battery' ? 'border-[#2ECC71] bg-[#16291F]' : 'border-[#20252F] bg-[#14181F] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Storage</div>
                <div className="font-bold text-white text-xs truncate">BESS Unit</div>
              </button>

              <button
                onClick={() => setSelectedComponentId('ev')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  selectedComponentId === 'ev' ? 'border-[#2ECC71] bg-[#16291F]' : 'border-[#20252F] bg-[#14181F] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Mobility</div>
                <div className="font-bold text-white text-xs truncate">EV Fast Charger</div>
              </button>

              <button
                onClick={() => setSelectedComponentId('grid')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  selectedComponentId === 'grid' ? 'border-[#2ECC71] bg-[#16291F]' : 'border-[#20252F] bg-[#14181F] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Interconnection</div>
                <div className="font-bold text-white text-xs truncate">Utility Feeder</div>
              </button>
            </div>
          </div>

          {/* Right 4–5 Cols: Component Configuration & Equipment Library */}
          <div className="lg:col-span-4 h-full">
            <SmartHomeConfigPanel
              selectedComponentId={selectedComponentId}
              onSelectComponent={(id) => setSelectedComponentId(id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
