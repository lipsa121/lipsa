import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Sun, 
  Battery, 
  Zap, 
  Cpu, 
  Car, 
  Plus, 
  Trash2, 
  Sliders, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Power
} from 'lucide-react';
import { AppliancePriority, FlexibilityType } from '../../types/simulation';

interface EquipmentConfigDrawerProps {
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

export const EquipmentConfigDrawer: React.FC<EquipmentConfigDrawerProps> = ({
  selectedComponentId,
  onSelectComponent,
}) => {
  const {
    state,
    metrics,
    updateSolarCapacityKW,
    updateSolarIrradianceFactor,
    updateInverterCapacityKW,
    updateInverterEfficiencyPct,
    updateBatteryCapacity,
    updateBatterySoC,
    updateBatteryMinSoC,
    updateBatteryMaxRates,
    setBatteryMode,
    updateCapacityLimit,
    setGridConnected,
    toggleAppliance,
    updateApplianceWattage,
    addAppliance,
    removeAppliance,
  } = useEnergySimulation();

  const [activeTab, setActiveTab] = useState<'solar' | 'inverter' | 'battery' | 'grid' | 'appliances'>(
    selectedComponentId === 'solar' || selectedComponentId === 'inverter' || selectedComponentId === 'battery' || selectedComponentId === 'grid'
      ? (selectedComponentId as any)
      : 'appliances'
  );

  // New custom appliance modal/form state
  const [showAddAppliance, setShowAddAppliance] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppWattage, setNewAppWattage] = useState(500);
  const [newAppCategory, setNewAppCategory] = useState('Utility');
  const [newAppPriority, setNewAppPriority] = useState<AppliancePriority>('Medium');
  const [newAppFlexibility, setNewAppFlexibility] = useState<FlexibilityType>('Flexible');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) {
      setFormError('Please enter a valid appliance name');
      return;
    }
    if (newAppWattage <= 0 || newAppWattage > 15000) {
      setFormError('Wattage must be between 1 and 15,000 W');
      return;
    }

    addAppliance({
      name: newAppName.trim(),
      category: newAppCategory,
      room: 'general',
      defaultWattage: newAppWattage,
      wattage: newAppWattage,
      isOn: true,
      priority: newAppPriority,
      flexibility: newAppFlexibility,
      iconName: 'Zap',
      description: 'Custom user-configured electrical load.',
    });

    setNewAppName('');
    setNewAppWattage(500);
    setShowAddAppliance(false);
    setFormError(null);
  };

  return (
    <div className="rounded-xl border border-[#252B35] bg-[#14181F]/95 shadow-xl flex flex-col h-full overflow-hidden">
      {/* Drawer Tab Navigation */}
      <div className="p-3 border-b border-[#20252F] bg-[#101317] flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('appliances')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'appliances'
              ? 'bg-[#1B5E3F] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Appliances ({state.appliances.length})
        </button>
        <button
          onClick={() => setActiveTab('solar')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'solar'
              ? 'bg-[#1B5E3F] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Solar PV ({state.solarConfig.installedCapacityKW} kW)
        </button>
        <button
          onClick={() => setActiveTab('inverter')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'inverter'
              ? 'bg-[#1B5E3F] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inverter ({state.inverterConfig.ratedCapacityKW} kW)
        </button>
        <button
          onClick={() => setActiveTab('battery')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'battery'
              ? 'bg-[#1B5E3F] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Battery ({state.batteryConfig.capacityKWh} kWh)
        </button>
        <button
          onClick={() => setActiveTab('grid')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'grid'
              ? 'bg-[#1B5E3F] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Grid Link ({state.gridConfig.isConnected ? 'Connected' : 'Islanded'})
        </button>
      </div>

      {/* Drawer Body Content */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
        {/* TAB 1: APPLIANCES & CUSTOM LOADS */}
        {activeTab === 'appliances' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Household Appliance Roster</h3>
                <p className="text-xs text-slate-400">Toggle switches or edit rated wattage</p>
              </div>

              <button
                onClick={() => setShowAddAppliance(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-md transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Appliance</span>
              </button>
            </div>

            {/* Modal for adding custom appliance */}
            {showAddAppliance && (
              <form onSubmit={handleCreateAppliance} className="p-3.5 rounded-lg bg-[#0E1115] border border-[#2D936C]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Add Custom Electrical Load</span>
                  <button
                    type="button"
                    onClick={() => setShowAddAppliance(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                {formError && (
                  <div className="text-[11px] text-[#FB7185] bg-[#3B0C15] p-2 rounded border border-[#BE123C]/40">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Induction Stove"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#20252F] rounded text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Rated Power (Watts)</label>
                    <input
                      type="number"
                      min="1"
                      max="15000"
                      value={newAppWattage}
                      onChange={(e) => setNewAppWattage(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#20252F] rounded text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Priority</label>
                    <select
                      value={newAppPriority}
                      onChange={(e) => setNewAppPriority(e.target.value as AppliancePriority)}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#20252F] rounded text-white text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Deferrable">Deferrable</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Flexibility</label>
                    <select
                      value={newAppFlexibility}
                      onChange={(e) => setNewAppFlexibility(e.target.value as FlexibilityType)}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#20252F] rounded text-white text-xs"
                    >
                      <option value="Flexible">Flexible</option>
                      <option value="Semi-Flexible">Semi-Flexible</option>
                      <option value="Non-Flexible">Non-Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAppliance(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-semibold text-white bg-[#1B5E3F] rounded"
                  >
                    Save Appliance
                  </button>
                </div>
              </form>
            )}

            {/* List of appliances */}
            <div className="space-y-2">
              {state.appliances.map((app) => (
                <div
                  key={app.id}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                    app.isOn
                      ? 'bg-[#151921] border-[#2D936C]/40'
                      : 'bg-[#0E1115] border-[#20252F] opacity-75'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{app.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101317] text-slate-400 border border-[#20252F]">
                        {app.flexibility}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span>Rated:</span>
                      <input
                        type="number"
                        min="0"
                        max="15000"
                        value={app.wattage}
                        onChange={(e) => updateApplianceWattage(app.id, Number(e.target.value))}
                        className="w-16 px-1 py-0.5 text-xs font-mono bg-[#0A0D10] border border-[#252C38] rounded text-white text-right"
                      />
                      <span>W</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleAppliance(app.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        app.isOn ? 'bg-[#2ECC71]' : 'bg-[#202530]'
                      }`}
                      role="switch"
                      aria-checked={app.isOn}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          app.isOn ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {app.isCustom && (
                      <button
                        onClick={() => removeAppliance(app.id)}
                        className="p-1 text-slate-500 hover:text-[#FB7185] transition-colors"
                        title="Remove custom appliance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SOLAR PANELS CONFIG */}
        {activeTab === 'solar' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Rooftop Photovoltaic (PV) Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust installed nameplate capacity and ambient irradiance factor
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Installed PV Array Capacity</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {state.solarConfig.installedCapacityKW} kW ({state.solarConfig.installedCapacityKW * 1000} W)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={state.solarConfig.installedCapacityKW}
                onChange={(e) => updateSolarCapacityKW(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.5 kW</span>
                <span>3.0 kW (Standard)</span>
                <span>15.0 kW (Large)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Solar Irradiance / Sun Factor</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(state.solarConfig.irradianceFactor * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={state.solarConfig.irradianceFactor}
                onChange={(e) => updateSolarIrradianceFactor(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0% (Night)</span>
                <span>50% (Cloudy)</span>
                <span>100% (Peak Noon)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#161B23] border border-[#252C38] text-xs font-mono flex items-center justify-between">
              <span className="text-slate-400">Instantaneous PV Output:</span>
              <span className="text-amber-300 font-bold">{metrics.solarGenerationW} W ({metrics.solarGenerationKW.toFixed(2)} kW)</span>
            </div>
          </div>
        )}

        {/* TAB 3: HYBRID INVERTER CONFIG */}
        {activeTab === 'inverter' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2ECC71]" />
                <span>Central Hybrid Inverter</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                DC-to-AC power conversion limits and efficiency parameters
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Inverter Rated Capacity</span>
                <span className="font-mono font-bold text-white text-sm">
                  {state.inverterConfig.ratedCapacityKW} kW ({state.inverterConfig.ratedCapacityKW * 1000} W)
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="15.0"
                step="0.5"
                value={state.inverterConfig.ratedCapacityKW}
                onChange={(e) => updateInverterCapacityKW(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>2.0 kW</span>
                <span>5.0 kW (Nominal)</span>
                <span>15.0 kW</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Inverter Conversion Efficiency</span>
                <span className="font-mono font-bold text-[#2ECC71]">
                  {state.inverterConfig.efficiencyPct}%
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                step="1"
                value={state.inverterConfig.efficiencyPct}
                onChange={(e) => updateInverterEfficiencyPct(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>80% (Lossy)</span>
                <span>96% (High Efficiency)</span>
                <span>99%</span>
              </div>
            </div>

            {metrics.isInverterOverloaded && (
              <div className="p-3 rounded-lg bg-[#3B0C15] border border-[#BE123C]/50 text-xs text-[#FB7185] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Inverter is overloaded by +{metrics.inverterOverloadByW} W! Exceeds rated {state.inverterConfig.ratedCapacityKW} kW ceiling.
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BATTERY ENERGY STORAGE (BESS) */}
        {activeTab === 'battery' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Battery className="w-4 h-4 text-[#2ECC71]" />
                <span>Battery Storage System (BESS)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Storage capacity, State of Charge (SoC), and dispatch behavior
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Battery Pack Capacity</span>
                <span className="font-mono font-bold text-white text-sm">
                  {state.batteryConfig.capacityKWh} kWh
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="30.0"
                step="1.0"
                value={state.batteryConfig.capacityKWh}
                onChange={(e) => updateBatteryCapacity(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>2 kWh</span>
                <span>8 kWh (Standard)</span>
                <span>30 kWh</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">State of Charge (SoC)</span>
                <span className="font-mono font-bold text-[#2ECC71]">
                  {state.batteryConfig.socPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={state.batteryConfig.socPct}
                onChange={(e) => updateBatterySoC(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Minimum Allowed SoC Protection</span>
                <span className="font-mono font-bold text-amber-300">
                  {state.batteryConfig.minSoCPct}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={state.batteryConfig.minSoCPct}
                onChange={(e) => updateBatteryMinSoC(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 leading-tight">
                Protects battery cell degradation by halting discharge below this reserve.
              </p>
            </div>

            {/* Battery Mode Selector */}
            <div className="p-3.5 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-2">
              <span className="text-xs font-medium text-slate-300 block">Dispatch Mode</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setBatteryMode('idle')}
                  className={`py-1.5 px-2 rounded font-medium transition-colors ${
                    state.batteryConfig.mode === 'idle'
                      ? 'bg-[#1C212B] text-white border border-[#2A313E]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Idle Standby
                </button>
                <button
                  type="button"
                  onClick={() => setBatteryMode('self_consumption')}
                  className={`py-1.5 px-2 rounded font-medium transition-colors ${
                    state.batteryConfig.mode === 'self_consumption'
                      ? 'bg-[#1B5E3F] text-white border border-[#2ECC71]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Self-Consume
                </button>
                <button
                  type="button"
                  onClick={() => setBatteryMode('charging')}
                  className={`py-1.5 px-2 rounded font-medium transition-colors ${
                    state.batteryConfig.mode === 'charging'
                      ? 'bg-[#1B5E3F] text-white border border-[#2ECC71]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Solar Charge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GRID LINK & ISLANDING CONFIG */}
        {activeTab === 'grid' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FB7185]" />
                <span>Utility Grid Connection & Islanding</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Grid-Tied vs Islanded Microgrid operational modes
              </p>
            </div>

            {/* Grid Connection Switch */}
            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Utility Grid Service Link
                </span>
                <span className="text-[11px] text-slate-400">
                  {state.gridConfig.isConnected ? 'Grid-Tied: Import / Export enabled' : 'Islanded Microgrid: Disconnected from grid'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setGridConnected(!state.gridConfig.isConnected)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  state.gridConfig.isConnected
                    ? 'bg-[#1B5E3F] text-white border border-[#2ECC71]/40'
                    : 'bg-[#BE123C] text-white border border-[#BE123C]/50'
                }`}
              >
                {state.gridConfig.isConnected ? 'Connected' : 'Disconnected (Islanded)'}
              </button>
            </div>

            {/* Import Capacity Limit */}
            <div className="p-4 rounded-lg bg-[#0E1115] border border-[#20252F] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Contracted Import Capacity Limit</span>
                <span className="font-mono font-bold text-[#FB7185] text-sm">
                  {state.gridConfig.importCapacityLimitW} W ({(state.gridConfig.importCapacityLimitW / 1000).toFixed(1)} kW)
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="12000"
                step="250"
                value={state.gridConfig.importCapacityLimitW}
                onChange={(e) => updateCapacityLimit(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>1000 W</span>
                <span>3000 W (Default)</span>
                <span>12000 W</span>
              </div>
            </div>

            {/* Islanded Warning Banner */}
            {!state.gridConfig.isConnected && metrics.unmetDemandW > 0 && (
              <div className="p-3.5 rounded-lg bg-[#3B0C15] border border-[#BE123C]/60 text-xs text-[#FB7185] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unmet Demand Warning ({metrics.unmetDemandW} W)</span>
                </div>
                <p className="text-[11px] text-[#FDA4AF] leading-relaxed">
                  The home is in disconnected microgrid mode. Solar generation and battery storage cannot supply current load. Switch off non-critical appliances to restore balance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
