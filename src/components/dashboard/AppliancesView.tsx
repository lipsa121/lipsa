import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { ApplianceCard } from './ApplianceCard';
import { Power, Sliders, ShieldCheck, ZapOff, CheckSquare, Filter } from 'lucide-react';
import { FlexibilityType } from '../../types/simulation';

export const AppliancesView: React.FC = () => {
  const { state, metrics, setApplianceState } = useEnergySimulation();
  const [filterFlexibility, setFilterFlexibility] = useState<string>('all');

  const activeAppliances = state.appliances.filter((a) => a.isOn);
  const flexibleAppliances = state.appliances.filter((a) => a.flexibility === 'Flexible' || a.flexibility === 'Semi-Flexible');
  const activeFlexibleAppliances = flexibleAppliances.filter((a) => a.isOn);

  // Bulk action: Turn off all flexible loads to immediately shave peak demand
  const handleTurnOffFlexible = () => {
    flexibleAppliances.forEach((app) => {
      setApplianceState(app.id, false);
    });
  };

  const handleTurnAllOn = () => {
    state.appliances.forEach((app) => {
      setApplianceState(app.id, true);
    });
  };

  const filteredAppliances = state.appliances.filter((app) => {
    if (filterFlexibility === 'flexible') return app.flexibility === 'Flexible' || app.flexibility === 'Semi-Flexible';
    if (filterFlexibility === 'critical') return app.priority === 'Critical';
    if (filterFlexibility === 'active') return app.isOn;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Household Appliance Control Center</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/30">
                {activeAppliances.length} Active of {state.appliances.length} Installed
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Switch appliances ON or OFF to observe immediate recalculated power balance, load curves, and threshold warnings. Click any power rating to edit appliance wattage.
            </p>
          </div>

          {/* Quick Bulk Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleTurnOffFlexible}
              disabled={activeFlexibleAppliances.length === 0}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#BE123C] hover:bg-[#E11D48] disabled:opacity-40 disabled:hover:bg-[#BE123C] rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              title="Quickly switch off deferrable loads to avoid capacity breach"
            >
              <ZapOff className="w-3.5 h-3.5" />
              <span>Shed Flexible Loads ({activeFlexibleAppliances.length})</span>
            </button>

            <button
              onClick={handleTurnAllOn}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#1A1F27] hover:bg-[#232935] border border-[#2A313E] rounded-md transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#2ECC71]" />
              <span>Turn All ON</span>
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="mt-5 pt-4 border-t border-[#222832] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter appliances:</span>
            <div className="flex items-center bg-[#0E1115] p-1 rounded-lg border border-[#20252F]">
              <button
                onClick={() => setFilterFlexibility('all')}
                className={`px-2.5 py-1 rounded transition-colors ${filterFlexibility === 'all' ? 'bg-[#1C212B] text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                All ({state.appliances.length})
              </button>
              <button
                onClick={() => setFilterFlexibility('active')}
                className={`px-2.5 py-1 rounded transition-colors ${filterFlexibility === 'active' ? 'bg-[#1C212B] text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Active ({activeAppliances.length})
              </button>
              <button
                onClick={() => setFilterFlexibility('flexible')}
                className={`px-2.5 py-1 rounded transition-colors ${filterFlexibility === 'flexible' ? 'bg-[#1C212B] text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Flexible ({flexibleAppliances.length})
              </button>
              <button
                onClick={() => setFilterFlexibility('critical')}
                className={`px-2.5 py-1 rounded transition-colors ${filterFlexibility === 'critical' ? 'bg-[#1C212B] text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Critical
              </button>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-300">
            Active Total: <strong className="text-white">{metrics.totalHouseholdLoadW} W</strong> ({metrics.totalHouseholdLoadKW.toFixed(2)} kW)
          </div>
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppliances.map((appliance) => (
          <ApplianceCard key={appliance.id} appliance={appliance} />
        ))}
      </div>
    </div>
  );
};
