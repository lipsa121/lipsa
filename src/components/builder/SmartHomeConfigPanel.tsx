import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Sun, 
  Cpu, 
  Battery, 
  Zap, 
  Car, 
  Tv2, 
  Plus, 
  Trash2, 
  Power, 
  AlertTriangle, 
  Sliders, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { AppliancePriority, FlexibilityType } from '../../types/simulation';

interface SmartHomeConfigPanelProps {
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

export const SmartHomeConfigPanel: React.FC<SmartHomeConfigPanelProps> = ({
  selectedComponentId,
  onSelectComponent,
}) => {
  const {
    state,
    metrics,
    toggleAppliance,
    updateApplianceWattage,
    updateApplianceDetails,
    addAppliance,
    removeAppliance,
    updateSolarCapacity,
    updateSolarGenerationFactor,
    updateInverterConfig,
    updateBatteryConfig,
    updateGridConfig,
    toggleGridConnection,
    updateEvChargerConfig,
    toggleEvCharging,
  } = useEnergySimulation();

  const [activeTab, setActiveTab] = useState<'appliances' | 'solar' | 'battery' | 'grid' | 'inverter'>('appliances');
  const [newAppName, setNewAppName] = useState('');
  const [newAppWattage, setNewAppWattage] = useState('350');
  const [newAppPriority, setNewAppPriority] = useState<AppliancePriority>('Medium');
  const [newAppFlexibility, setNewAppFlexibility] = useState<FlexibilityType>('Flexible');
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-switch tab based on selected canvas component
  React.useEffect(() => {
    if (selectedComponentId === 'solar') setActiveTab('solar');
    else if (selectedComponentId === 'inverter') setActiveTab('inverter');
    else if (selectedComponentId === 'battery') setActiveTab('battery');
    else if (selectedComponentId === 'grid') setActiveTab('grid');
    else if (selectedComponentId === 'ev') setActiveTab('appliances');
    else if (selectedComponentId) setActiveTab('appliances');
  }, [selectedComponentId]);

  const handleAddNewAppliance = () => {
    if (!newAppName.trim()) {
      setValidationError('Please enter a valid appliance name');
      return;
    }
    const watts = parseInt(newAppWattage, 10);
    if (isNaN(watts) || watts < 0 || watts > 10000) {
      setValidationError('Appliance power rating must be between 0 and 10,000 Watts');
      return;
    }

    addAppliance({
      name: newAppName.trim(),
      category: 'Custom Load',
      room: 'living',
      defaultWattage: watts,
      wattage: watts,
      isOn: true,
      priority: newAppPriority,
      flexibility: newAppFlexibility,
      iconName: 'Zap',
      description: 'User-configured custom load.',
    });

    setNewAppName('');
    setNewAppWattage('350');
    setShowAddForm(false);
    setValidationError(null);
  };

  return (
    <div className="rounded-2xl border border-[#252B35] bg-[#14181F]/95 p-5 sm:p-6 backdrop-blur-md shadow-2xl flex flex-col h-full space-y-5">
      {/* Panel Tab Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#252B35]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#2ECC71]" />
            <span>Equipment & Subsystem Config</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time parameter manipulation for connected smart assets
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0E1115] rounded-xl border border-[#20252F] overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('appliances')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'appliances' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv2 className="w-3.5 h-3.5" />
          <span>Appliances</span>
        </button>

        <button
          onClick={() => setActiveTab('solar')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'solar' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Solar PV</span>
        </button>

        <button
          onClick={() => setActiveTab('inverter')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'inverter' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Inverter</span>
        </button>

        <button
          onClick={() => setActiveTab('battery')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'battery' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Battery className="w-3.5 h-3.5" />
          <span>Battery</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'grid' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
      </div>

      {/* Dynamic Tab Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* ==============================================================
            TAB 1: APPLIANCES ROSTER
            ============================================================== */}
        {activeTab === 'appliances' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Configured Household Loads ({state.appliances.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-2.5 py-1 text-xs font-semibold text-[#2ECC71] bg-[#16291F] hover:bg-[#1E382A] border border-[#2D936C]/40 rounded-md transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Load</span>
              </button>
            </div>

            {/* Add Custom Appliance Form */}
            {showAddForm && (
              <div className="p-4 rounded-xl border border-[#2D936C]/40 bg-[#0E1318] space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-white">Add New Electrical Load</h4>
                {validationError && (
                  <div className="text-[11px] text-[#FB7185] bg-[#3B0C15] p-2 rounded border border-[#BE123C]/50 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Load Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dishwasher, Dehumidifier"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141820] border border-[#252B35] rounded text-white text-xs focus:border-[#2D936C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Rated Power (Watts)</label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={newAppWattage}
                      onChange={(e) => setNewAppWattage(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141820] border border-[#252B35] rounded text-white text-xs font-mono focus:border-[#2D936C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Flexibility</label>
                    <select
                      value={newAppFlexibility}
                      onChange={(e) => setNewAppFlexibility(e.target.value as FlexibilityType)}
                      className="w-full px-2 py-1.5 bg-[#141820] border border-[#252B35] rounded text-white text-xs focus:border-[#2D936C] outline-none"
                    >
                      <option value="Flexible">Flexible (Shiftable)</option>
                      <option value="Semi-Flexible">Semi-Flexible</option>
                      <option value="Non-Flexible">Non-Flexible (Fixed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Priority</label>
                    <select
                      value={newAppPriority}
                      onChange={(e) => setNewAppPriority(e.target.value as AppliancePriority)}
                      className="w-full px-2 py-1.5 bg-[#141820] border border-[#252B35] rounded text-white text-xs focus:border-[#2D936C] outline-none"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Deferrable">Deferrable</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewAppliance}
                    className="px-3.5 py-1 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] rounded"
                  >
                    Add Load
                  </button>
                </div>
              </div>
            )}

            {/* List of Configured Appliances */}
            <div className="space-y-2.5">
              {state.appliances.map((app) => (
                <div
                  key={app.id}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedComponentId === app.id
                      ? 'border-[#2ECC71] bg-[#16211C] shadow-md'
                      : 'border-[#20252F] bg-[#0E1115] hover:border-[#2C3442]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{app.name}</span>
                        {app.isCustom && (
                          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/30">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {app.priority} · {app.flexibility}
                      </div>
                    </div>

                    {/* Power Rating Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={app.wattage}
                        onChange={(e) => updateApplianceWattage(app.id, Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 text-xs font-mono text-right bg-[#141820] border border-[#252B35] rounded text-white"
                      />
                      <span className="text-[11px] font-mono text-slate-400">W</span>
                    </div>

                    {/* Toggle ON/OFF Switch */}
                    <button
                      type="button"
                      onClick={() => toggleAppliance(app.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        app.isOn ? 'bg-[#2ECC71]' : 'bg-[#202530]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                          app.isOn ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Delete for custom loads */}
                    {app.isCustom && (
                      <button
                        onClick={() => removeAppliance(app.id)}
                        className="p-1 text-slate-500 hover:text-[#FB7185]"
                        title="Delete custom appliance"
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

        {/* ==============================================================
            TAB 2: SOLAR PHOTOVOLTAIC
            ============================================================== */}
        {activeTab === 'solar' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#20252F] bg-[#0E1115] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase">Installed Solar PV Array</span>
                </div>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {state.solar.installedCapacityKW} kW Peak
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Array Capacity Rating</span>
                  <span className="font-mono text-white">{state.solar.installedCapacityKW} kWp</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.5"
                  value={state.solar.installedCapacityKW}
                  onChange={(e) => updateSolarCapacity(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Instantaneous Irradiance Factor</span>
                  <span className="font-mono text-amber-300">
                    {Math.round(state.solar.generationFactor * 100)}% ({metrics.solarGenerationW} W)
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.05"
                  value={state.solar.generationFactor}
                  onChange={(e) => updateSolarGenerationFactor(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1F2530] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Tilt Angle</span>
                  <span className="font-mono text-slate-200">25° Pitch</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Azimuth Alignment</span>
                  <span className="font-mono text-slate-200">180° True South</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: SMART INVERTER
            ============================================================== */}
        {activeTab === 'inverter' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#20252F] bg-[#0E1115] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2ECC71]" />
                  <span className="text-xs font-bold text-white uppercase">Hybrid Solar Inverter</span>
                </div>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  metrics.isInverterOverloaded ? 'bg-[#3B0C15] text-[#FB7185] border-[#BE123C]/50' : 'bg-[#16291F] text-[#2ECC71] border-[#2D936C]/40'
                }`}>
                  {metrics.isInverterOverloaded ? 'OVERLOADED' : 'NORMAL'}
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Inverter Rated Continuous Capacity</span>
                  <span className="font-mono text-white">{state.inverter.ratedCapacityKW} kW</span>
                </label>
                <input
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.5"
                  value={state.inverter.ratedCapacityKW}
                  onChange={(e) => updateInverterConfig({ ratedCapacityKW: Number(e.target.value) })}
                  className="w-full accent-[#2ECC71] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Conversion Efficiency</span>
                  <span className="font-mono text-[#2ECC71]">{state.inverter.efficiencyPct}%</span>
                </label>
                <input
                  type="range"
                  min="85"
                  max="99"
                  step="1"
                  value={state.inverter.efficiencyPct}
                  onChange={(e) => updateInverterConfig({ efficiencyPct: Number(e.target.value) })}
                  className="w-full accent-[#2ECC71] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#1F2530] text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Current AC Conversion Output:</span>
                  <span className="font-mono text-white">{metrics.solarACOutputW} W</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Thermal / Inverter Load Ratio:</span>
                  <span className="font-mono text-emerald-300">{metrics.inverterUtilizationPct}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: BATTERY STORAGE (BESS)
            ============================================================== */}
        {activeTab === 'battery' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#20252F] bg-[#0E1115] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-[#2ECC71]" />
                  <span className="text-xs font-bold text-white uppercase">Battery Energy Storage</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-300">
                  {state.battery.capacityKWh} kWh Pack
                </span>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5">Operational Dispatch Strategy</label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#141820] p-1 rounded-lg border border-[#252B35] text-xs">
                  <button
                    onClick={() => updateBatteryConfig({ mode: 'idle' })}
                    className={`py-1 rounded font-medium transition-colors ${state.battery.mode === 'idle' ? 'bg-[#1C212B] text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    Idle
                  </button>
                  <button
                    onClick={() => updateBatteryConfig({ mode: 'self_consumption' })}
                    className={`py-1 rounded font-medium transition-colors ${state.battery.mode === 'self_consumption' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    Self-Use
                  </button>
                  <button
                    onClick={() => updateBatteryConfig({ mode: 'charging' })}
                    className={`py-1 rounded font-medium transition-colors ${state.battery.mode === 'charging' ? 'bg-[#1B5E3F] text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    Charge Solar
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>State of Charge (SoC)</span>
                  <span className="font-mono text-[#2ECC71]">{state.battery.stateOfChargePct}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={state.battery.stateOfChargePct}
                  onChange={(e) => updateBatteryConfig({ stateOfChargePct: Number(e.target.value) })}
                  className="w-full accent-[#2ECC71] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Minimum Reserve SoC Limit</span>
                  <span className="font-mono text-slate-300">{state.battery.minStateOfChargePct}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={state.battery.minStateOfChargePct}
                  onChange={(e) => updateBatteryConfig({ minStateOfChargePct: Number(e.target.value) })}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Max Discharge Power Limit</span>
                  <span className="font-mono text-white">{state.battery.maxDischargePowerW} W</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="250"
                  value={state.battery.maxDischargePowerW}
                  onChange={(e) => updateBatteryConfig({ maxDischargePowerW: Number(e.target.value) })}
                  className="w-full accent-[#2ECC71] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 5: UTILITY GRID & EV CHARGER
            ============================================================== */}
        {activeTab === 'grid' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#20252F] bg-[#0E1115] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2ECC71]" />
                  <span className="text-xs font-bold text-white uppercase">Grid Connection Status</span>
                </div>
                <button
                  onClick={toggleGridConnection}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    state.grid.isConnected
                      ? 'bg-[#1B5E3F] text-white hover:bg-[#23754F]'
                      : 'bg-[#BE123C] text-white hover:bg-[#E11D48]'
                  }`}
                >
                  {state.grid.isConnected ? 'CONNECTED' : 'DISCONNECTED (ISLANDED)'}
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between mb-1">
                  <span>Contracted Feeder Import Limit</span>
                  <span className="font-mono text-[#FB7185]">{state.grid.importLimitW} W</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="8000"
                  step="250"
                  value={state.grid.importLimitW}
                  onChange={(e) => updateGridConfig({ importLimitW: Number(e.target.value) })}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              {/* EV Fast Charger Details */}
              <div className="pt-3 border-t border-[#1F2530] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#2ECC71]" />
                    <span className="text-xs font-bold text-white">Electric Vehicle Wallbox</span>
                  </div>
                  <button
                    onClick={toggleEvCharging}
                    className={`px-2.5 py-0.5 text-xs font-mono rounded ${
                      state.evCharger.isCharging ? 'bg-[#1B5E3F] text-white' : 'bg-[#1A1F27] text-slate-400'
                    }`}
                  >
                    {state.evCharger.isCharging ? 'CHARGING' : 'STOPPED'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Vehicle Battery Pack:</span>
                  <span className="font-mono text-white">60 kWh ({state.evCharger.currentSoCPct}% SoC)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warnings & Diagnostics Footer Banner */}
      {metrics.activeAlerts.length > 0 && (
        <div className="p-3 rounded-xl border border-[#BE123C]/50 bg-[#3B0C15]/80 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#FB7185]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Active System Alerts ({metrics.activeAlerts.length})</span>
          </div>
          <ul className="text-[11px] text-[#FDA4AF] space-y-1 pl-5 list-disc">
            {metrics.activeAlerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
