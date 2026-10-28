import React from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Sun, 
  Home, 
  Zap, 
  Battery, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  ArrowLeft,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { BatteryMode } from '../../types/simulation';

export const EnergyFlowView: React.FC = () => {
  const { state, metrics, setBatteryMode } = useEnergySimulation();

  const isExporting = metrics.gridExportW > 0;
  const isImporting = metrics.gridImportW > 0;
  const solarW = metrics.solarGenerationW;
  const loadW = metrics.totalHouseholdLoadW;
  const netGridW = isExporting ? metrics.gridExportW : metrics.gridImportW;

  return (
    <div className="space-y-6">
      {/* Top Description & Transparency Note */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Simplified Power Balance & Energy Flow</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30">
                Deterministic Model
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Solar power directly supplies active household demand first. If solar exceeds demand, surplus is available for grid export. If demand exceeds solar, shortfall is imported from the grid.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0E1115] border border-[#20252F] text-xs font-mono shrink-0">
            <span className="text-slate-400 block text-[10px] uppercase">Net Grid Exchange</span>
            <div className={`text-base font-bold ${isExporting ? 'text-[#2ECC71]' : isImporting ? 'text-[#FB7185]' : 'text-slate-300'}`}>
              {isExporting ? `Export: ${netGridW} W` : isImporting ? `Import: ${netGridW} W` : '0 W (Balanced)'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Energy Flow Diagram Canvas */}
      <div className="rounded-xl border border-[#252B35] bg-[#0E1115] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#1B5E3F]/8 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Top Node: Solar Generation */}
          <div className="flex justify-center mb-8">
            <div className="w-64 rounded-xl border border-[#10B981]/50 bg-[#0E1612] p-4 text-center shadow-lg shadow-emerald-950/20 relative group">
              <div className="w-10 h-10 rounded-lg bg-[#122A1E] border border-[#10B981]/40 text-[#10B981] mx-auto flex items-center justify-center mb-2">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Rooftop Solar PV
              </div>
              <div className="text-xl font-mono font-bold text-[#10B981] mt-1 tabular-nums">
                {solarW} W
              </div>
              <div className="text-[10px] font-mono text-emerald-300/80 mt-0.5">
                {(solarW / 1000).toFixed(2)} kW Generated
              </div>
            </div>
          </div>

          {/* Vertical Conduit: Solar down to Central Bus */}
          <div className="flex justify-center -my-3">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-10 bg-[#10B981]/60 relative overflow-hidden">
                <div className="w-full h-1/2 bg-[#10B981] animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-[#10B981] bg-[#07090C] px-2 py-0.5 rounded border border-[#10B981]/30 my-1">
                ↓ {solarW} W
              </div>
              <div className="w-0.5 h-10 bg-[#10B981]/60" />
            </div>
          </div>

          {/* Middle Row: Central Bus with Grid on Left, Battery on Bottom/Right, Household on Right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6">
            {/* Left Node: Utility Grid Infeed / Export */}
            <div className={`rounded-xl border p-5 text-center transition-all ${
              isExporting
                ? 'border-[#2D936C]/60 bg-[#14231B] shadow-[0_0_20px_rgba(46,204,113,0.15)]'
                : isImporting
                ? 'border-[#BE123C]/60 bg-[#2D1219] shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                : 'border-[#20252F] bg-[#14181F]'
            }`}>
              <div className={`w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2 ${
                isExporting ? 'bg-[#1B5E3F] text-[#2ECC71]' : isImporting ? 'bg-[#3B0C15] text-[#FB7185]' : 'bg-[#1E242E] text-slate-400'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Utility Grid
              </div>
              <div className={`text-xl font-mono font-bold mt-1 tabular-nums ${
                isExporting ? 'text-[#2ECC71]' : isImporting ? 'text-[#FB7185]' : 'text-slate-300'
              }`}>
                {isExporting ? `+${metrics.gridExportW} W` : isImporting ? `-${metrics.gridImportW} W` : '0 W'}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {isExporting ? 'Potential Export to Grid' : isImporting ? 'Estimated Grid Import' : 'Zero Grid Infeed'}
              </div>
            </div>

            {/* Center Node: Central Inverter / Main Busbar */}
            <div className="rounded-xl border border-[#2D936C]/40 bg-[#161B23] p-5 text-center shadow-xl relative">
              <div className="text-[10px] font-mono text-[#2ECC71] uppercase tracking-wider font-semibold">
                Central Inverter & Busbar
              </div>
              <div className="my-2 py-1 px-3 rounded bg-[#0E1115] border border-[#20252F] inline-block font-mono text-xs text-slate-200">
                Sum(Supply) = Sum(Demand)
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                Deterministic power dispatch junction
              </div>
            </div>

            {/* Right Node: Household Active Load */}
            <div className={`rounded-xl border p-5 text-center transition-all ${
              metrics.isCapacityExceeded
                ? 'border-[#BE123C]/70 bg-[#2D1219] shadow-[0_0_25px_rgba(225,29,72,0.2)]'
                : 'border-[#2D936C]/50 bg-[#14231B]'
            }`}>
              <div className={`w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2 ${
                metrics.isCapacityExceeded ? 'bg-[#3B0C15] text-[#FB7185]' : 'bg-[#1B5E3F] text-[#2ECC71]'
              }`}>
                <Home className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Household Demand
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1 tabular-nums">
                {loadW} W
              </div>
              <div className="text-[10px] font-mono text-slate-300 mt-0.5">
                {metrics.totalHouseholdLoadKW.toFixed(2)} kW ({state.appliances.filter((a) => a.isOn).length} appliances ON)
              </div>
            </div>
          </div>

          {/* Bottom Node: Battery Storage Subsystem */}
          <div className="mt-8 pt-6 border-t border-[#20252F]">
            <div className="max-w-xl mx-auto rounded-xl border border-[#20252F] bg-[#14181F] p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#16291F] border border-[#2D936C]/40 text-[#2ECC71] flex items-center justify-center shrink-0">
                    <Battery className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        Battery Storage Unit
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-[#16291F] px-1.5 py-0.5 rounded border border-[#2D936C]/30">
                        {state.batteryConfig.capacityKWh} kWh ({state.batteryConfig.socPct}% SoC)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mode: <strong className="text-slate-200 uppercase font-mono">{state.batteryConfig.mode}</strong> · Power Flow: <span className="font-mono text-white">{metrics.batteryPowerFlowW} W</span>
                    </p>
                  </div>
                </div>

                {/* Interactive Mode Controls */}
                <div className="flex items-center bg-[#0E1115] p-1 rounded-lg border border-[#20252F] text-xs shrink-0">
                  <button
                    onClick={() => setBatteryMode('idle')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      state.batteryConfig.mode === 'idle'
                        ? 'bg-[#1C212B] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Idle
                  </button>
                  <button
                    onClick={() => setBatteryMode('self_consumption')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      state.batteryConfig.mode === 'self_consumption'
                        ? 'bg-[#1B5E3F] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Discharge
                  </button>
                  <button
                    onClick={() => setBatteryMode('charging')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      state.batteryConfig.mode === 'charging'
                        ? 'bg-[#1B5E3F] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Charge
                  </button>
                </div>
              </div>

              {/* State of Charge Bar */}
              <div className="mt-4 pt-3 border-t border-[#1F2530] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">State of Charge (SoC)</span>
                  <span className="font-mono text-white font-semibold">{state.batteryConfig.socPct}% ({(state.batteryConfig.capacityKWh * (state.batteryConfig.socPct / 100)).toFixed(1)} kWh available)</span>
                </div>
                <div className="h-2 w-full bg-[#1F2530] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1B5E3F] to-[#2ECC71] rounded-full transition-all duration-300"
                    style={{ width: `${state.batteryConfig.socPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Disclosure Footer */}
      <div className="p-4 rounded-lg bg-[#14181F] border border-[#20252F] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#2ECC71] shrink-0" />
          <span>
            Simplified deterministic solar-vs-load model. Battery storage and inverter losses are modeled transparently as educational approximations, not live sensor hardware.
          </span>
        </div>
      </div>
    </div>
  );
};
