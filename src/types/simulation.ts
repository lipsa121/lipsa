export type AppliancePriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Deferrable';

export type FlexibilityType = 'Non-Flexible' | 'Flexible' | 'Semi-Flexible' | 'Storage';

export interface Appliance {
  id: string;
  name: string;
  category: string;
  room: 'living' | 'bedroom' | 'kitchen' | 'utility' | 'garage' | 'general';
  defaultWattage: number;
  wattage: number;
  isOn: boolean;
  priority: AppliancePriority;
  flexibility: FlexibilityType;
  iconName: string;
  description: string;
  isCustom?: boolean;
}

export type BatteryMode = 'idle' | 'self_consumption' | 'charging';

export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

export interface SolarConfig {
  installedCapacityKW: number; // e.g. 3.0 kW
  generationFactor: number; // 0 to 1.0 (derived from sun slider/time of day)
  irradianceFactor: number;
  tiltAngleDeg: number;
  azimuth: string;
}

export interface InverterConfig {
  ratedCapacityKW: number; // e.g. 5.0 kW
  efficiencyPct: number; // e.g. 96%
}

export interface BatteryConfig {
  capacityKWh: number; // e.g. 8.0 kWh
  stateOfChargePct: number; // 0 to 100%
  socPct: number;
  minStateOfChargePct: number; // e.g. 15%
  minSoCPct: number;
  maxDischargePowerW: number; // e.g. 2500 W
  maxDischargeRateW: number;
  maxChargePowerW: number; // e.g. 2500 W
  maxChargeRateW: number;
  mode: BatteryMode;
}

export interface GridConfig {
  isConnected: boolean; // True = on-grid, False = islanded microgrid
  importLimitW: number; // e.g. 3000 W
  importCapacityLimitW: number;
}

export interface EvChargerConfig {
  ratedPowerW: number; // e.g. 2400 W
  isPluggedIn: boolean;
  isCharging: boolean;
  batteryCapacityKWh: number;
  currentSoCPct: number;
}

export interface SimulationState {
  appliances: Appliance[];
  solar: SolarConfig;
  solarConfig: SolarConfig;
  inverter: InverterConfig;
  inverterConfig: InverterConfig;
  battery: BatteryConfig;
  batteryConfig: BatteryConfig;
  grid: GridConfig;
  gridConfig: GridConfig;
  evCharger: EvChargerConfig;
  timeOfDay: TimeOfDay;
  timeOfDayHour: number;
  sunIrradiancePct: number; // 0 to 100%
  isSimulationPlaying: boolean;
  isAutoAdvancing: boolean;
  // Legacy compatibility mappings
  solarGenerationW: number;
  capacityLimitW: number;
  batteryCapacityKWh: number;
  batterySoCPct: number;
  batteryMode: BatteryMode;
  batteryMaxDischargeW: number;
  batteryMaxChargeW: number;
}

export interface SimulationMetrics {
  totalHouseholdLoadW: number;
  totalHouseholdLoadKW: number;
  solarGenerationW: number;
  solarGenerationKW: number;
  solarACOutputW: number;
  inverterOutputW: number;
  inverterEfficiencyLossW?: number;
  batteryAvailableEnergyKWh?: number;
  capacityLimitW: number;
  capacityLimitKW: number;
  isCapacityExceeded: boolean;
  capacityExceededByW: number;
  capacityUtilizationPct: number;
  
  // Grid
  gridImportW: number;
  gridExportW: number;
  effectiveNetGridW: number;
  isGridOverloaded: boolean;
  gridOverloadByW: number;
  isIslanded: boolean;

  // Battery
  batteryPowerFlowW: number; // >0 discharging, <0 charging, 0 idle
  isBatteryDischarging: boolean;
  isBatteryCharging: boolean;
  isBatteryAtMinSoC: boolean;
  isBatteryFull: boolean;

  // Inverter
  inverterLoadW: number;
  isInverterOverloaded: boolean;
  inverterOverloadByW: number;
  inverterUtilizationPct: number;

  solarUsedByHouseW?: number;
  excessSolarW?: number;
  batterySOCPct?: number;

  // Unmet Demand (Physical power balance violation when islanded or constrained)
  unmetDemandW: number;
  hasUnmetDemand: boolean;

  // System status
  status: 'normal' | 'warning' | 'critical' | 'islanded_alert';
  statusMessage?: string;
  isGridDisconnected?: boolean;
  isBatteryDepleted?: boolean;
  activeAlerts: string[];
}

// ----------------------------------------------------
// STEP 5: Engine Accumulators, Logging & Validation Types
// ----------------------------------------------------

export interface AccumulatedEnergy {
  totalLoadKWh: number;
  solarGeneratedKWh: number;
  gridImportedKWh: number;
  gridExportedKWh: number;
  batteryChargedKWh: number;
  batteryDischargedKWh: number;
  elapsedSimulationSeconds: number;
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string; // e.g. "14:15:00"
  simulatedHour: number; // e.g. 14.25
  timeLabel: string; // e.g. "14:15"
  loadW: number;
  solarW: number;
  solarACOutputW: number;
  solarUsedByHouseW: number;
  batteryFlowW: number;
  batterySoCPct: number;
  gridImportW: number;
  gridExportW: number;
  inverterLoadW: number;
  isIslanded: boolean;
  status: 'normal' | 'warning' | 'critical' | 'islanded_alert';
  alertsCount: number;
}

export interface TariffConfig {
  importRatePerKWh: number; // e.g. $0.28
  exportFeedInRatePerKWh: number; // e.g. $0.08
  currencySymbol: string;
}

export interface ValidationWarning {
  id: string;
  type: 'inverter_overload' | 'capacity_exceeded' | 'battery_cutoff' | 'battery_full' | 'islanded_blackout' | 'infeasible_schedule';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  technicalDetails: string;
  correctiveAction: string;
  actionButtonLabel?: string;
  actionType?: 'shed_load' | 'enable_solar' | 'switch_grid' | 'reset_battery' | 'optimize';
}

export type PreconfiguredScenarioId = 
  | 'normal'
  | 'high_load'
  | 'low_solar'
  | 'grid_outage'
  | 'battery_empty'
  | 'solar_surplus'
  | 'smart_scheduling_comparison';

export interface ScenarioMetricComparison {
  peakLoadKW: number;
  gridImportKWh: number;
  solarSelfConsumptionPct: number;
  estimatedCostUSD: number;
  unmetDemandKW?: number;
  peakReductionPct?: number;
  savingsPct?: number;
}

export interface EngineeringScenario {
  id: PreconfiguredScenarioId;
  name: string;
  badge: string;
  badgeColor: string;
  summary: string;
  description: string;
  conditions: {
    solarKW: number;
    solarFactor: number;
    batterySoCPct: number;
    gridConnected: boolean;
    capacityLimitW: number;
    activeAppliances: string[];
  };
  beforeOptimization: ScenarioMetricComparison;
  afterOptimization: ScenarioMetricComparison;
  keyInsight: string;
  correctiveActionRecommendation: string;
}

// ----------------------------------------------------
// PHASE 4: Forecasting & Scheduling Engine Types
// ----------------------------------------------------

export type ForecastingHorizon = 6 | 12 | 24;

export type ForecastingModelType = 'seasonal_naive' | 'weather_adjusted_smoothing';

export interface TimeSeriesPoint {
  hourIndex: number;
  timeLabel: string;
  measuredDemandW: number;
  baseDemandW: number;
  solarGenerationW: number;
  outdoorTempC: number;
  isHistorical: boolean;
  day: 'day_minus_2' | 'yesterday' | 'today';
}

export interface ForecastEvaluationMetrics {
  maeW: number;
  rmseW: number;
  mapePct: number;
  maxErrorW: number;
  nSamples: number;
}

export interface ForecastPredictionPoint {
  hour: number;
  timeLabel: string;
  predictedDemandW: number;
  confidenceUpperW: number;
  confidenceLowerW: number;
  referenceDemandW: number; // True observation from held-out benchmark
  solarForecastW: number;
  capacityLimitW: number;
  isPeak: boolean;
}

export interface ForecastResult {
  modelType: ForecastingModelType;
  modelName: string;
  horizon: ForecastingHorizon;
  predictions: ForecastPredictionPoint[];
  peakPredictedW: number;
  peakHour: number;
  peakTimeLabel: string;
  evaluation: ForecastEvaluationMetrics;
  dataSourceDescription: string;
}

export interface FlexibleTask {
  id: string;
  name: string;
  applianceId: string;
  ratedPowerW: number;
  durationHours: number;
  earliestStartHour: number; // 0 - 23
  latestEndHour: number;     // 1 - 24
  preferredStartHour: number;// 0 - 23 (unmanaged default start)
  priority: AppliancePriority;
  flexibility: FlexibilityType;
  isEnabled: boolean;
}

export type OptimizationObjective = 'solar_first' | 'peak_shaving' | 'balanced';

export interface ScheduledJob {
  taskId: string;
  taskName: string;
  applianceId: string;
  assignedStartHour: number;
  assignedEndHour: number;
  powerW: number;
  status: 'scheduled' | 'infeasible';
  infeasibilityReason?: string;
  priority: AppliancePriority;
}

export interface HourlyScheduleProfile {
  hour: number;
  timeLabel: string;
  baseDemandW: number;
  unmanagedDemandW: number;
  scheduledDemandW: number;
  solarGenerationW: number;
  capacityLimitW: number;
  unmanagedCapacityBreach: boolean;
  scheduledCapacityBreach: boolean;
  unmanagedGridImportW: number;
  scheduledGridImportW: number;
  activeScheduledJobs: string[];
}

export interface SchedulingComparison {
  objective: OptimizationObjective;
  hourlyProfiles: HourlyScheduleProfile[];
  scheduledJobs: ScheduledJob[];
  infeasibleJobs: ScheduledJob[];
  unmanagedPeakW: number;
  scheduledPeakW: number;
  peakReductionW: number;
  peakReductionPct: number;
  unmanagedBreachHours: number;
  scheduledBreachHours: number;
  unmanagedSolarSelfConsumptionPct: number;
  scheduledSolarSelfConsumptionPct: number;
  totalShiftedEnergyKWh: number;
  solverStatus: 'optimal' | 'feasible_with_warnings' | 'infeasible';
  message: string;
}

