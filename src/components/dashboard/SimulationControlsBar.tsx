import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Clock, 
  Gauge, 
  FileText, 
  Flame, 
  Zap,
  BatteryCharging,
  Info
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';

interface SimulationControlsBarProps {
  onOpenReportModal?: () => void;
}

export const SimulationControlsBar: React.FC<SimulationControlsBarProps> = ({ onOpenReportModal }) => {
  const {
    isSimulationPlaying,
    toggleSimulationPlay,
    simulatedHour,
    simulatedTimeFormatted,
    setSimulatedHour,
    simulationSpeed,
    setSimulationSpeed,
    resetDemo,
    accumulatedEnergy,
    resetAccumulatedEnergy,
    metrics,
    state,
    estimatedNetEnergyCostUSD,
    tariff,
    validationWarnings
  } = useEnergySimulation();

  // Speed options
  const speedOptions = [1, 5, 30, 60, 120, 300];

  // Icon for time of day
  const getTimeIcon = () => {
    if (simulatedHour >= 5.5 && simulatedHour < 9) return <Sunrise className="w-4 h-4 text-emerald-400" />;
    if (simulatedHour >= 9 && simulatedHour < 17) return <Sun className="w-4 h-4 text-[#10B981]" />;
    if (simulatedHour >= 17 && simulatedHour < 20) return <Sunset className="w-4 h-4 text-[#E11D48]" />;
    return <Moon className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-3.5 sm:p-4 shadow-xl space-y-3.5">
      {/* Top Row: Clock, Play/Pause, Speeds, Reset, and Simulated Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback controls and Clock */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Primary Play/Pause Button */}
          <button
            onClick={toggleSimulationPlay}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              isSimulationPlaying
                ? 'bg-[#BE123C] hover:bg-[#9F1239] text-white shadow-rose-950/30'
                : 'bg-[#1B5E3F] hover:bg-[#23754F] text-white shadow-emerald-950/30'
            }`}
            title={isSimulationPlaying ? 'Pause Simulation' : 'Start Continuous Simulation'}
          >
            {isSimulationPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Sim</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              resetDemo();
              resetAccumulatedEnergy();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#1A1F27] hover:bg-[#232936] border border-[#252B35] transition-colors"
            title="Reset Simulation & Accumulators to Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clock Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1014] border border-[#20252F] font-mono">
            {getTimeIcon()}
            <span className="text-sm font-bold text-white tracking-wide">
              {simulatedTimeFormatted}
            </span>
            <span className="text-[10px] text-slate-500 uppercase">
              ({state.timeOfDay})
            </span>
          </div>

          {/* Speed Selector */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[#0D1014] border border-[#20252F]">
            <span className="text-[10px] text-slate-500 px-1.5 font-mono">Speed:</span>
            {speedOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  simulationSpeed === spd
                    ? 'bg-[#1B5E3F] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1F27]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Simulated Badge & Report Modal Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Prominent Simulated Data Warning Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D2419] border border-[#10B981]/40 text-[10px] font-mono font-medium text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>SIMULATED DATA</span>
          </div>

          {/* Report Export Button */}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#141B24] hover:bg-[#1A2432] border border-[#222E3E] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle: Diurnal Solar Scrub Bar */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulate Time-of-Day Slider (Diurnal Solar Curve):</span>
          </span>
          <span className="text-emerald-400">
            PV Irradiance: {state.sunIrradiancePct}% ({metrics.solarGenerationW} W)
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={24}
            step={0.1}
            value={simulatedHour}
            onChange={(e) => setSimulatedHour(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#141B24] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-mono px-0.5 mt-1">
          <span>00:00 (Midnight)</span>
          <span>06:00 (Sunrise)</span>
          <span className="text-[#10B981] font-bold">12:30 (Solar Peak)</span>
          <span>19:00 (Sunset)</span>
          <span>24:00 (Night)</span>
        </div>
      </div>

      {/* Bottom Telemetry Strip: Cumulative Energy Accumulators */}
      <div className="pt-2 border-t border-[#18202A] grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-mono">
        {/* Consumed */}
        <div className="p-2 rounded-lg bg-[#07090C] border border-[#18202A] flex flex-col">
          <span className="text-[10px] text-slate-400">Total Consumed:</span>
          <span className="text-sm font-bold text-white mt-0.5">
            {accumulatedEnergy.totalLoadKWh.toFixed(3)} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </span>
        </div>

        {/* Solar Generated */}
        <div className="p-2 rounded-lg bg-[#07090C] border border-[#18202A] flex flex-col">
          <span className="text-[10px] text-slate-400">Solar Harvest:</span>
          <span className="text-sm font-bold text-[#10B981] mt-0.5">
            {accumulatedEnergy.solarGeneratedKWh.toFixed(3)} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </span>
        </div>

        {/* Net Grid Import/Export */}
        <div className="p-2 rounded-lg bg-[#07090C] border border-[#18202A] flex flex-col">
          <span className="text-[10px] text-slate-400">Grid Import / Export:</span>
          <span className="text-sm font-bold text-slate-200 mt-0.5">
            {accumulatedEnergy.gridImportedKWh.toFixed(2)} <span className="text-[10px] text-slate-500">/</span> {accumulatedEnergy.gridExportedKWh.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </span>
        </div>

        {/* Estimated Cost Delta */}
        <div className="p-2 rounded-lg bg-[#07090C] border border-[#18202A] flex flex-col">
          <span className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Net Bill Est.:</span>
            <span className="text-[9px] text-slate-500">@{tariff.importRatePerKWh}/kWh</span>
          </span>
          <span className={`text-sm font-bold mt-0.5 ${estimatedNetEnergyCostUSD > 0 ? 'text-[#FB7185]' : 'text-[#10B981]'}`}>
            {tariff.currencySymbol}{estimatedNetEnergyCostUSD.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
