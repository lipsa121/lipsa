import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Appliance, 
  SimulationState, 
  SimulationMetrics, 
  BatteryMode,
  SolarConfig,
  InverterConfig,
  BatteryConfig,
  GridConfig,
  EvChargerConfig,
  TimeOfDay,
  AccumulatedEnergy,
  SimulationLogEntry,
  TariffConfig,
  ValidationWarning,
  PreconfiguredScenarioId,
  EngineeringScenario
} from '../types/simulation';
import { 
  calculateElectricalMetrics, 
  calculateDiurnalIrradiance,
  calculateBatterySoCDelta,
  generateValidationWarnings,
  ENGINEERING_SCENARIOS 
} from '../utils/electricalEngine';

const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'ac',
    name: 'Air Conditioner',
    category: 'Climate Control',
    room: 'bedroom',
    defaultWattage: 1500,
    wattage: 1500,
    isOn: true,
    priority: 'High',
    flexibility: 'Semi-Flexible',
    iconName: 'Wind',
    description: 'Inverter compressor unit. High load, can be pre-cooled.',
  },
  {
    id: 'fan',
    name: 'Ceiling Fan',
    category: 'Circulation',
    room: 'living',
    defaultWattage: 75,
    wattage: 75,
    isOn: true,
    priority: 'Low',
    flexibility: 'Flexible',
    iconName: 'Fan',
    description: 'Continuous airflow. Low energy consumption.',
  },
  {
    id: 'lights',
    name: 'Household Lighting',
    category: 'Illumination',
    room: 'living',
    defaultWattage: 100,
    wattage: 100,
    isOn: true,
    priority: 'Critical',
    flexibility: 'Non-Flexible',
    iconName: 'Lightbulb',
    description: 'LED ambient and work luminaire fixtures.',
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    category: 'Cold Storage',
    room: 'kitchen',
    defaultWattage: 200,
    wattage: 200,
    isOn: true,
    priority: 'Critical',
    flexibility: 'Non-Flexible',
    iconName: 'Refrigerator',
    description: 'Essential refrigeration cycle. Continuous base load.',
  },
  {
    id: 'pump',
    name: 'Water Pump',
    category: 'Hydro Utilities',
    room: 'utility',
    defaultWattage: 750,
    wattage: 750,
    isOn: false,
    priority: 'Deferrable',
    flexibility: 'Flexible',
    iconName: 'Droplets',
    description: 'Overhead tank booster pump. Can be delayed to off-peak.',
  },
  {
    id: 'computer',
    name: 'Workstation Computer',
    category: 'Electronics',
    room: 'living',
    defaultWattage: 150,
    wattage: 150,
    isOn: true,
    priority: 'Medium',
    flexibility: 'Flexible',
    iconName: 'Monitor',
    description: 'Dual monitor desktop workstation and network router.',
  },
  {
    id: 'ev',
    name: 'EV Level-2 Charger',
    category: 'Transport',
    room: 'garage',
    defaultWattage: 2400,
    wattage: 2400,
    isOn: false,
    priority: 'High',
    flexibility: 'Flexible',
    iconName: 'Car',
    description: 'Electric vehicle home charging terminal. Highly deferrable.',
  },
];

const INITIAL_SOLAR: SolarConfig = {
  installedCapacityKW: 3.0,
  generationFactor: 0.5,
  irradianceFactor: 0.5,
  tiltAngleDeg: 25,
  azimuth: 'South',
};

const INITIAL_INVERTER: InverterConfig = {
  ratedCapacityKW: 5.0,
  efficiencyPct: 96,
};

const INITIAL_BATTERY: BatteryConfig = {
  capacityKWh: 8.0,
  stateOfChargePct: 80,
  socPct: 80,
  minStateOfChargePct: 15,
  minSoCPct: 15,
  maxDischargePowerW: 2500,
  maxDischargeRateW: 2500,
  maxChargePowerW: 2500,
  maxChargeRateW: 2500,
  mode: 'self_consumption',
};

const INITIAL_GRID: GridConfig = {
  isConnected: true,
  importLimitW: 3000,
  importCapacityLimitW: 3000,
};

const INITIAL_EV: EvChargerConfig = {
  ratedPowerW: 2400,
  isPluggedIn: true,
  isCharging: false,
  batteryCapacityKWh: 60,
  currentSoCPct: 55,
};

const INITIAL_ACCUMULATED_ENERGY: AccumulatedEnergy = {
  totalLoadKWh: 0,
  solarGeneratedKWh: 0,
  gridImportedKWh: 0,
  gridExportedKWh: 0,
  batteryChargedKWh: 0,
  batteryDischargedKWh: 0,
  elapsedSimulationSeconds: 0,
};

const DEFAULT_TARIFF: TariffConfig = {
  importRatePerKWh: 0.28,
  exportFeedInRatePerKWh: 0.08,
  currencySymbol: '$',
};

interface SimulationContextValue {
  state: SimulationState;
  metrics: SimulationMetrics;
  
  // Appliance actions
  toggleAppliance: (id: string) => void;
  setApplianceState: (id: string, isOn: boolean) => void;
  updateApplianceWattage: (id: string, wattage: number) => void;
  updateApplianceDetails: (id: string, updates: Partial<Appliance>) => void;
  addAppliance: (appliance: Omit<Appliance, 'id'>) => void;
  removeAppliance: (id: string) => void;
  
  // Solar actions
  updateSolarCapacity: (capacityKW: number) => void;
  updateSolarCapacityKW: (capacityKW: number) => void;
  updateSolarGenerationFactor: (factor: number) => void;
  updateSolarIrradianceFactor: (factor: number) => void;
  updateSolarGeneration: (wattage: number) => void;
  
  // Inverter actions
  updateInverterConfig: (updates: Partial<InverterConfig>) => void;
  updateInverterCapacityKW: (capacityKW: number) => void;
  updateInverterEfficiencyPct: (pct: number) => void;
  
  // Battery actions
  updateBatteryConfig: (updates: Partial<BatteryConfig>) => void;
  updateBatteryCapacity: (kWh: number) => void;
  updateBatterySoC: (socPct: number) => void;
  updateBatteryMinSoC: (socPct: number) => void;
  updateBatteryMaxRates: (chargeW: number, dischargeW: number) => void;
  setBatteryMode: (mode: BatteryMode) => void;
  
  // Grid actions
  updateGridConfig: (updates: Partial<GridConfig>) => void;
  toggleGridConnection: () => void;
  setGridConnected: (connected: boolean) => void;
  updateCapacityLimit: (wattage: number) => void;
  
  // EV actions
  updateEvChargerConfig: (updates: Partial<EvChargerConfig>) => void;
  toggleEvCharging: () => void;
  
  // Environment / Time actions
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  setTimeOfDayHour: (hour: number) => void;
  simulatedHour: number;
  simulatedTimeFormatted: string;
  setSimulatedHour: (hour: number) => void;
  
  // Simulation loop controls
  isSimulationPlaying: boolean;
  simulationSpeed: number; // 1, 5, 30, 60, 120, 300
  setSimulationSpeed: (speed: number) => void;
  toggleSimulationPlay: () => void;
  toggleAutoAdvance: () => void;
  resetDemo: () => void;
  
  // Energy accumulator & History logs
  accumulatedEnergy: AccumulatedEnergy;
  resetAccumulatedEnergy: () => void;
  simulationLog: SimulationLogEntry[];
  clearSimulationLog: () => void;
  
  // Tariff & Financial Estimates
  tariff: TariffConfig;
  updateTariff: (updates: Partial<TariffConfig>) => void;
  estimatedNetEnergyCostUSD: number;
  
  // Validation warnings
  validationWarnings: ValidationWarning[];
  
  // Scenarios
  allScenarios: EngineeringScenario[];
  activeScenarioId: PreconfiguredScenarioId | null;
  loadScenario: (id: PreconfiguredScenarioId) => void;
  clearScenario: () => void;
  
  // Smart Home Builder Selected Hotspot
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
}

const EnergySimulationContext = createContext<SimulationContextValue | null>(null);

export const EnergySimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliances, setAppliances] = useState<Appliance[]>(INITIAL_APPLIANCES);
  const [solar, setSolar] = useState<SolarConfig>(INITIAL_SOLAR);
  const [inverter, setInverter] = useState<InverterConfig>(INITIAL_INVERTER);
  const [battery, setBattery] = useState<BatteryConfig>(INITIAL_BATTERY);
  const [grid, setGrid] = useState<GridConfig>(INITIAL_GRID);
  const [evCharger, setEvCharger] = useState<EvChargerConfig>(INITIAL_EV);
  
  // Time & Simulation Clock
  const [simulatedHour, setSimulatedHourState] = useState<number>(14.0); // 14:00 (2:00 PM)
  const [isSimulationPlaying, setIsSimulationPlaying] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(60); // 1 real sec = 60 sim sec (1 min)
  
  // Cumulative Energy & History
  const [accumulatedEnergy, setAccumulatedEnergy] = useState<AccumulatedEnergy>(INITIAL_ACCUMULATED_ENERGY);
  const [simulationLog, setSimulationLog] = useState<SimulationLogEntry[]>([]);
  
  // Tariff & Financial Settings
  const [tariff, setTariff] = useState<TariffConfig>(DEFAULT_TARIFF);
  
  // Scenarios
  const [activeScenarioId, setActiveScenarioId] = useState<PreconfiguredScenarioId | null>(null);
  
  // 3D Builder Component Selection
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('solar');

  // Convert simulated decimal hour to TimeOfDay category
  const timeOfDay: TimeOfDay = useMemo(() => {
    if (simulatedHour >= 6 && simulatedHour < 11) return 'morning';
    if (simulatedHour >= 11 && simulatedHour < 14) return 'noon';
    if (simulatedHour >= 14 && simulatedHour < 18) return 'afternoon';
    if (simulatedHour >= 18 && simulatedHour < 22) return 'evening';
    return 'night';
  }, [simulatedHour]);

  // Formatted string: e.g. "14:24"
  const simulatedTimeFormatted = useMemo(() => {
    const totalMinutes = Math.floor(simulatedHour * 60);
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [simulatedHour]);

  // Sync EV appliance ON state with EV charger config
  const toggleAppliance = useCallback((id: string) => {
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const nextState = !app.isOn;
          if (id === 'ev') {
            setEvCharger((ev) => ({ ...ev, isCharging: nextState }));
          }
          return { ...app, isOn: nextState };
        }
        return app;
      })
    );
  }, []);

  const setApplianceState = useCallback((id: string, isOn: boolean) => {
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          if (id === 'ev') {
            setEvCharger((ev) => ({ ...ev, isCharging: isOn }));
          }
          return { ...app, isOn };
        }
        return app;
      })
    );
  }, []);

  const updateApplianceWattage = useCallback((id: string, wattage: number) => {
    const validWattage = Math.max(0, Math.round(wattage));
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          if (id === 'ev') {
            setEvCharger((ev) => ({ ...ev, ratedPowerW: validWattage }));
          }
          return { ...app, wattage: validWattage };
        }
        return app;
      })
    );
  }, []);

  const updateApplianceDetails = useCallback((id: string, updates: Partial<Appliance>) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  }, []);

  const addAppliance = useCallback((newApp: Omit<Appliance, 'id'>) => {
    const id = `custom-${Date.now()}`;
    setAppliances((prev) => [...prev, { ...newApp, id, isCustom: true }]);
  }, []);

  const removeAppliance = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((app) => app.id !== id));
  }, []);

  // Solar actions
  const updateSolarCapacity = useCallback((capacityKW: number) => {
    setSolar((prev) => ({ ...prev, installedCapacityKW: Math.max(0.5, Math.min(20, capacityKW)) }));
  }, []);

  const updateSolarGenerationFactor = useCallback((factor: number) => {
    const val = Math.max(0, Math.min(1.0, factor));
    setSolar((prev) => ({ ...prev, generationFactor: val, irradianceFactor: val }));
  }, []);

  const updateSolarGeneration = useCallback((wattage: number) => {
    const clampedW = Math.max(0, Math.round(wattage));
    const factor = solar.installedCapacityKW > 0 ? Math.min(1.0, clampedW / (solar.installedCapacityKW * 1000)) : 0;
    setSolar((prev) => ({ ...prev, generationFactor: factor, irradianceFactor: factor }));
  }, [solar.installedCapacityKW]);

  // Inverter actions
  const updateInverterConfig = useCallback((updates: Partial<InverterConfig>) => {
    setInverter((prev) => ({ ...prev, ...updates }));
  }, []);

  // Battery actions
  const updateBatteryConfig = useCallback((updates: Partial<BatteryConfig>) => {
    setBattery((prev) => {
      const merged = { ...prev, ...updates };
      if (updates.socPct !== undefined) merged.stateOfChargePct = updates.socPct;
      if (updates.stateOfChargePct !== undefined) merged.socPct = updates.stateOfChargePct;
      if (updates.minSoCPct !== undefined) merged.minStateOfChargePct = updates.minSoCPct;
      if (updates.minStateOfChargePct !== undefined) merged.minSoCPct = updates.minStateOfChargePct;
      if (updates.maxChargeRateW !== undefined) merged.maxChargePowerW = updates.maxChargeRateW;
      if (updates.maxChargePowerW !== undefined) merged.maxChargeRateW = updates.maxChargePowerW;
      if (updates.maxDischargeRateW !== undefined) merged.maxDischargePowerW = updates.maxDischargeRateW;
      if (updates.maxDischargePowerW !== undefined) merged.maxDischargeRateW = updates.maxDischargePowerW;
      return merged;
    });
  }, []);

  const updateBatteryCapacity = useCallback((kWh: number) => {
    setBattery((prev) => ({ ...prev, capacityKWh: Math.max(1, Math.min(100, kWh)) }));
  }, []);

  const updateBatterySoC = useCallback((socPct: number) => {
    const val = Math.max(0, Math.min(100, socPct));
    setBattery((prev) => ({ ...prev, stateOfChargePct: val, socPct: val }));
  }, []);

  const setBatteryMode = useCallback((mode: BatteryMode) => {
    setBattery((prev) => ({ ...prev, mode }));
  }, []);

  // Grid actions
  const updateGridConfig = useCallback((updates: Partial<GridConfig>) => {
    setGrid((prev) => {
      const merged = { ...prev, ...updates };
      if (updates.importCapacityLimitW !== undefined) merged.importLimitW = updates.importCapacityLimitW;
      if (updates.importLimitW !== undefined) merged.importCapacityLimitW = updates.importLimitW;
      return merged;
    });
  }, []);

  const toggleGridConnection = useCallback(() => {
    setGrid((prev) => ({ ...prev, isConnected: !prev.isConnected }));
  }, []);

  const setGridConnected = useCallback((connected: boolean) => {
    setGrid((prev) => ({ ...prev, isConnected: connected }));
  }, []);

  const updateCapacityLimit = useCallback((wattage: number) => {
    const valid = Math.max(100, Math.round(wattage));
    setGrid((prev) => ({ ...prev, importLimitW: valid, importCapacityLimitW: valid }));
  }, []);

  // EV actions
  const updateEvChargerConfig = useCallback((updates: Partial<EvChargerConfig>) => {
    setEvCharger((prev) => {
      const next = { ...prev, ...updates };
      if (updates.isCharging !== undefined) {
        setAppliances((apps) =>
          apps.map((a) => (a.id === 'ev' ? { ...a, isOn: updates.isCharging! } : a))
        );
      }
      return next;
    });
  }, []);

  const toggleEvCharging = useCallback(() => {
    toggleAppliance('ev');
  }, [toggleAppliance]);

  // Set Simulated Hour
  const setSimulatedHour = useCallback((hour: number) => {
    const clamped = Math.max(0, Math.min(24, hour));
    setSimulatedHourState(clamped);
    // Recalculate diurnal solar factor
    const solarFactor = calculateDiurnalIrradiance(clamped);
    setSolar((prev) => ({ ...prev, generationFactor: solarFactor, irradianceFactor: solarFactor }));
  }, []);

  // Time of Day Setter
  const setTimeOfDay = useCallback((time: TimeOfDay) => {
    let hr = 14;
    switch (time) {
      case 'morning': hr = 8.5; break;
      case 'noon': hr = 12.5; break;
      case 'afternoon': hr = 14.5; break;
      case 'evening': hr = 19.5; break;
      case 'night': hr = 23.0; break;
    }
    setSimulatedHour(hr);
  }, [setSimulatedHour]);

  const setTimeOfDayHour = useCallback((hour: number) => {
    setSimulatedHour(hour);
  }, [setSimulatedHour]);

  const toggleSimulationPlay = useCallback(() => {
    setIsSimulationPlaying((prev) => !prev);
  }, []);

  // Reset Demo
  const resetDemo = useCallback(() => {
    setAppliances(INITIAL_APPLIANCES);
    setSolar(INITIAL_SOLAR);
    setInverter(INITIAL_INVERTER);
    setBattery(INITIAL_BATTERY);
    setGrid(INITIAL_GRID);
    setEvCharger(INITIAL_EV);
    setSimulatedHourState(14.0);
    setIsSimulationPlaying(false);
    setAccumulatedEnergy(INITIAL_ACCUMULATED_ENERGY);
    setSimulationLog([]);
    setActiveScenarioId(null);
  }, []);

  const resetAccumulatedEnergy = useCallback(() => {
    setAccumulatedEnergy(INITIAL_ACCUMULATED_ENERGY);
  }, []);

  const clearSimulationLog = useCallback(() => {
    setSimulationLog([]);
  }, []);

  const updateTariff = useCallback((updates: Partial<TariffConfig>) => {
    setTariff((prev) => ({ ...prev, ...updates }));
  }, []);

  // Load a Preconfigured Scenario
  const loadScenario = useCallback((scenarioId: PreconfiguredScenarioId) => {
    const sc = ENGINEERING_SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;

    setActiveScenarioId(scenarioId);
    
    // Apply scenario parameters
    setSolar((prev) => ({
      ...prev,
      installedCapacityKW: sc.conditions.solarKW,
      generationFactor: sc.conditions.solarFactor,
      irradianceFactor: sc.conditions.solarFactor,
    }));

    setBattery((prev) => ({
      ...prev,
      stateOfChargePct: sc.conditions.batterySoCPct,
      socPct: sc.conditions.batterySoCPct,
    }));

    setGrid((prev) => ({
      ...prev,
      isConnected: sc.conditions.gridConnected,
      importLimitW: sc.conditions.capacityLimitW,
      importCapacityLimitW: sc.conditions.capacityLimitW,
    }));

    setAppliances((prev) =>
      prev.map((app) => ({
        ...app,
        isOn: sc.conditions.activeAppliances.includes(app.id),
      }))
    );
  }, []);

  const clearScenario = useCallback(() => {
    setActiveScenarioId(null);
  }, []);

  // Assemble full simulation state
  const state: SimulationState = useMemo(() => {
    const calculatedSolarW = Math.round(solar.installedCapacityKW * 1000 * solar.generationFactor);
    return {
      appliances,
      solar,
      solarConfig: solar,
      inverter,
      inverterConfig: inverter,
      battery,
      batteryConfig: battery,
      grid,
      gridConfig: grid,
      evCharger,
      timeOfDay,
      timeOfDayHour: Math.floor(simulatedHour),
      sunIrradiancePct: Math.round(solar.generationFactor * 100),
      isSimulationPlaying,
      isAutoAdvancing: isSimulationPlaying,
      solarGenerationW: calculatedSolarW,
      capacityLimitW: grid.importLimitW,
      batteryCapacityKWh: battery.capacityKWh,
      batterySoCPct: battery.stateOfChargePct,
      batteryMode: battery.mode,
      batteryMaxDischargeW: battery.maxDischargePowerW,
      batteryMaxChargeW: battery.maxChargePowerW,
    };
  }, [appliances, solar, inverter, battery, grid, evCharger, timeOfDay, simulatedHour, isSimulationPlaying]);

  // Compute metrics with pure electrical engine
  const metrics = useMemo<SimulationMetrics>(() => {
    return calculateElectricalMetrics(state);
  }, [state]);

  // Compute validation warnings
  const validationWarnings = useMemo<ValidationWarning[]>(() => {
    return generateValidationWarnings(state, metrics);
  }, [state, metrics]);

  // Financial estimate: Net electricity bill
  const estimatedNetEnergyCostUSD = useMemo(() => {
    const importCost = accumulatedEnergy.gridImportedKWh * tariff.importRatePerKWh;
    const exportRevenue = accumulatedEnergy.gridExportedKWh * tariff.exportFeedInRatePerKWh;
    return +(importCost - exportRevenue).toFixed(2);
  }, [accumulatedEnergy, tariff]);

  // Continuous Simulation Loop (Real-time accumulator & SoC integration)
  const lastTickRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!isSimulationPlaying) {
      lastTickRef.current = Date.now();
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const realDeltaMs = now - lastTickRef.current;
      lastTickRef.current = now;

      // Delta time in simulated hours:
      // (realDeltaMs / 1000) * simulationSpeed / 3600
      const realDeltaSec = Math.min(1.0, realDeltaMs / 1000); // capped for tab inactivity
      const simDeltaSec = realDeltaSec * simulationSpeed;
      const simDeltaHours = simDeltaSec / 3600;

      // 1. Advance simulated clock
      setSimulatedHourState((prevHour) => {
        const nextHour = (prevHour + simDeltaHours) % 24;
        // Dynamically track diurnal solar profile
        const solarFactor = calculateDiurnalIrradiance(nextHour);
        setSolar((s) => ({ ...s, generationFactor: solarFactor, irradianceFactor: solarFactor }));
        return nextHour;
      });

      // 2. Integrate Battery SoC
      if (metrics.batteryPowerFlowW !== 0) {
        const dSoC = calculateBatterySoCDelta(
          metrics.batteryPowerFlowW,
          battery.capacityKWh,
          simDeltaHours
        );
        setBattery((b) => {
          const newSoC = Math.max(0, Math.min(100, b.stateOfChargePct + dSoC));
          return { ...b, stateOfChargePct: +newSoC.toFixed(2), socPct: +newSoC.toFixed(2) };
        });
      }

      // 3. Accumulate Energy (kWh)
      setAccumulatedEnergy((prev) => ({
        totalLoadKWh: +(prev.totalLoadKWh + (metrics.totalHouseholdLoadW * simDeltaHours) / 1000).toFixed(4),
        solarGeneratedKWh: +(prev.solarGeneratedKWh + (metrics.solarGenerationW * simDeltaHours) / 1000).toFixed(4),
        gridImportedKWh: +(prev.gridImportedKWh + (metrics.gridImportW * simDeltaHours) / 1000).toFixed(4),
        gridExportedKWh: +(prev.gridExportedKWh + (metrics.gridExportW * simDeltaHours) / 1000).toFixed(4),
        batteryChargedKWh: +(prev.batteryChargedKWh + (metrics.isBatteryCharging ? (Math.abs(metrics.batteryPowerFlowW) * simDeltaHours) / 1000 : 0)).toFixed(4),
        batteryDischargedKWh: +(prev.batteryDischargedKWh + (metrics.isBatteryDischarging ? (metrics.batteryPowerFlowW * simDeltaHours) / 1000 : 0)).toFixed(4),
        elapsedSimulationSeconds: prev.elapsedSimulationSeconds + simDeltaSec,
      }));

      // 4. Record Time-Series History Log (every ~2 seconds of real time)
      setSimulationLog((prevLog) => {
        const totalMinutes = Math.floor(simulatedHour * 60);
        const hrs = Math.floor(totalMinutes / 60) % 24;
        const mins = totalMinutes % 60;
        const timeLabel = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        const newEntry: SimulationLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
          simulatedHour: +simulatedHour.toFixed(2),
          timeLabel,
          loadW: metrics.totalHouseholdLoadW,
          solarW: metrics.solarGenerationW,
          solarACOutputW: metrics.solarACOutputW,
          solarUsedByHouseW: metrics.solarUsedByHouseW || 0,
          batteryFlowW: metrics.batteryPowerFlowW,
          batterySoCPct: +battery.stateOfChargePct.toFixed(1),
          gridImportW: metrics.gridImportW,
          gridExportW: metrics.gridExportW,
          inverterLoadW: metrics.inverterLoadW,
          isIslanded: metrics.isIslanded,
          status: metrics.status,
          alertsCount: validationWarnings.length,
        };

        // Keep last 150 points for memory efficiency
        return [...prevLog.slice(-149), newEntry];
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, [
    isSimulationPlaying, 
    simulationSpeed, 
    metrics, 
    battery.capacityKWh, 
    battery.stateOfChargePct, 
    simulatedHour, 
    validationWarnings.length
  ]);

  const value: SimulationContextValue = {
    state,
    metrics,
    toggleAppliance,
    setApplianceState,
    updateApplianceWattage,
    updateApplianceDetails,
    addAppliance,
    removeAppliance,
    updateSolarCapacity,
    updateSolarCapacityKW: (kw) => updateSolarCapacity(kw),
    updateSolarGenerationFactor,
    updateSolarIrradianceFactor: (f) => updateSolarGenerationFactor(f),
    updateSolarGeneration,
    updateInverterConfig,
    updateInverterCapacityKW: (kw) => updateInverterConfig({ ratedCapacityKW: kw }),
    updateInverterEfficiencyPct: (pct) => updateInverterConfig({ efficiencyPct: pct }),
    updateBatteryConfig,
    updateBatteryCapacity,
    updateBatterySoC,
    updateBatteryMinSoC: (minSoC) => updateBatteryConfig({ minStateOfChargePct: minSoC }),
    updateBatteryMaxRates: (chg, dis) => updateBatteryConfig({ maxChargePowerW: chg, maxDischargePowerW: dis }),
    setBatteryMode,
    updateGridConfig,
    toggleGridConnection,
    setGridConnected,
    updateCapacityLimit,
    updateEvChargerConfig,
    toggleEvCharging,
    timeOfDay,
    setTimeOfDay,
    setTimeOfDayHour,
    simulatedHour,
    simulatedTimeFormatted,
    setSimulatedHour,
    isSimulationPlaying,
    simulationSpeed,
    setSimulationSpeed,
    toggleSimulationPlay,
    toggleAutoAdvance: toggleSimulationPlay,
    resetDemo,
    accumulatedEnergy,
    resetAccumulatedEnergy,
    simulationLog,
    clearSimulationLog,
    tariff,
    updateTariff,
    estimatedNetEnergyCostUSD,
    validationWarnings,
    allScenarios: ENGINEERING_SCENARIOS,
    activeScenarioId,
    loadScenario,
    clearScenario,
    selectedComponentId,
    setSelectedComponentId,
  };

  return (
    <EnergySimulationContext.Provider value={value}>
      {children}
    </EnergySimulationContext.Provider>
  );
};

export const useEnergySimulation = () => {
  const context = useContext(EnergySimulationContext);
  if (!context) {
    throw new Error('useEnergySimulation must be used within an EnergySimulationProvider');
  }
  return context;
};
