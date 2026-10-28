import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Settings, 
  RotateCcw, 
  Sun, 
  Sliders, 
  Battery, 
  Zap, 
  AlertCircle, 
  Check, 
  Info 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    state,
    metrics,
    updateSolarGeneration,
    updateCapacityLimit,
    updateBatteryCapacity,
    updateBatterySoC,
    updateApplianceWattage,
    resetDemo,
  } = useEnergySimulation();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReset = () => {
    resetDemo();
    setConfirmResetOpen(false);
    setSuccessMessage('Demo configuration restored to initial electrical specifications.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Settings Header */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Simulation Parameters & Settings</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30">
                Interactive Config
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Fine-tune simulated solar irradiance, contracted utility capacity limits, and battery storage capacity to test edge-case grid conditions.
            </p>
          </div>

          <button
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1A1F27] hover:bg-[#252C38] border border-[#2A313E] rounded-md transition-colors flex items-center gap-2 self-start sm:self-center shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>Reset Demo to Defaults</span>
          </button>
        </div>

        {successMessage && (
          <div className="mt-4 p-3 rounded-lg bg-[#14231B] border border-[#2D936C]/50 text-xs text-[#2ECC71] flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Reset */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#252B35] bg-[#12151B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#3B0C15] text-[#FB7185] border border-[#BE123C]/40 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reset Demo Configuration?</h4>
                <p className="text-xs text-slate-400">Restore standard electrical parameters</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore solar generation to 1500 W, capacity limit to 3000 W, battery capacity to 8 kWh (80% SoC), and revert all appliance wattages and initial ON/OFF states.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#1A1F27] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#BE123C] hover:bg-[#E11D48] rounded-md shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Power & Grid Limits */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#20252F]">
          <Sliders className="w-4 h-4 text-[#2ECC71]" />
          <span>Feeder Limits & Distributed Generation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solar Generation */}
          <div className="space-y-3 p-4 rounded-lg bg-[#0E1115] border border-[#20252F]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Simulated Solar PV Generation</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-300">
                {metrics.solarGenerationW} W
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Adjust instantaneous simulated rooftop solar array output.
            </p>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={metrics.solarGenerationW}
              onChange={(e) => updateSolarGeneration(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 W (Night)</span>
              <span>2500 W</span>
              <span>5000 W (Peak Noon)</span>
            </div>
          </div>

          {/* Capacity Threshold */}
          <div className="space-y-3 p-4 rounded-lg bg-[#0E1115] border border-[#20252F]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FB7185]" />
                <span className="text-xs font-bold text-white">Contracted Capacity Limit</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#FB7185]">
                {state.gridConfig.importCapacityLimitW} W
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Feeder maximum demand threshold before software overload warnings trigger.
            </p>
            <input
              type="range"
              min="1000"
              max="8000"
              step="100"
              value={state.gridConfig.importCapacityLimitW}
              onChange={(e) => updateCapacityLimit(Number(e.target.value))}
              className="w-full accent-[#E11D48] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1000 W</span>
              <span>3000 W (Default)</span>
              <span>8000 W</span>
            </div>
          </div>
        </div>

        {/* Section 2: Battery Energy Storage System (BESS) */}
        <div className="pt-4 border-t border-[#20252F]">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Battery className="w-4 h-4 text-[#2ECC71]" />
            <span>Battery Energy Storage System (BESS)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 rounded-lg bg-[#0E1115] border border-[#20252F]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Nominal Battery Pack Capacity</span>
                <span className="font-mono font-bold text-white">{state.batteryConfig.capacityKWh} kWh</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={state.batteryConfig.capacityKWh}
                onChange={(e) => updateBatteryCapacity(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>2 kWh</span>
                <span>8 kWh (Default)</span>
                <span>24 kWh</span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-[#0E1115] border border-[#20252F]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Initial State of Charge (SoC)</span>
                <span className="font-mono font-bold text-[#2ECC71]">{state.batteryConfig.socPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={state.batteryConfig.socPct}
                onChange={(e) => updateBatterySoC(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10% (Depleted)</span>
                <span>50%</span>
                <span>100% (Full)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Appliance Base Wattages Table */}
        <div className="pt-4 border-t border-[#20252F]">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Simulated Appliance Power Ratings
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0E1115] text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 rounded-l">Appliance</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Default</th>
                  <th className="py-2.5 px-3 rounded-r text-right">Configured Rating (W)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2530]">
                {state.appliances.map((app) => (
                  <tr key={app.id} className="hover:bg-[#161B23]">
                    <td className="py-2.5 px-3 font-medium text-white">{app.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{app.flexibility}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{app.priority}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{app.defaultWattage} W</td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={app.wattage}
                        onChange={(e) => updateApplianceWattage(app.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-mono text-right bg-[#0E1115] border border-[#252B35] focus:border-[#2D936C] rounded text-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
