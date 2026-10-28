import { 
  SimulationState, 
  SimulationMetrics, 
  ValidationWarning, 
  EngineeringScenario,
  PreconfiguredScenarioId 
} from '../types/simulation';

/**
 * Calculates continuous diurnal solar irradiance factor based on solar altitude angle.
 * 06:00 (Sunrise) -> 12:30 (Peak 1.0) -> 19:00 (Sunset).
 * Hours < 6 or >= 19.5 return 0.0.
 */
export function calculateDiurnalIrradiance(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  if (h < 5.75 || h > 19.25) return 0;
  // Normalized sinusoidal curve with atmospheric peak at 12.5 (12:30 PM)
  const normalizedTime = (h - 5.75) / (19.25 - 5.75); // 0 to 1
  const rawArc = Math.sin(normalizedTime * Math.PI);
  // Atmospheric optical air mass power curve
  return Math.max(0, Math.min(1, Math.pow(rawArc, 1.25)));
}

/**
 * Computes battery SoC percentage delta over a simulation time increment (in hours).
 * Accounts for Coulombic round-trip efficiency:
 * - Charging efficiency: ~95%
 * - Discharging efficiency: ~95%
 */
export function calculateBatterySoCDelta(
  batteryPowerFlowW: number,
  batteryCapacityKWh: number,
  deltaHours: number,
  chargeEfficiencyPct = 95,
  dischargeEfficiencyPct = 95
): number {
  if (batteryCapacityKWh <= 0 || deltaHours <= 0 || batteryPowerFlowW === 0) return 0;
  
  const totalCapacityWh = batteryCapacityKWh * 1000;
  
  if (batteryPowerFlowW < 0) {
    // Charging: power absorbed into battery
    const chargePowerW = Math.abs(batteryPowerFlowW);
    const effectiveEnergyInWh = chargePowerW * deltaHours * (chargeEfficiencyPct / 100);
    return (effectiveEnergyInWh / totalCapacityWh) * 100;
  } else {
    // Discharging: power delivered to load
    const dischargePowerW = batteryPowerFlowW;
    const grossEnergyRequiredWh = (dischargePowerW * deltaHours) / (dischargeEfficiencyPct / 100);
    return -(grossEnergyRequiredWh / totalCapacityWh) * 100;
  }
}

/**
 * Deterministic Electrical Calculation Engine for LoadPilot AI
 * Enforces Kirchhoff's Law and physical power constraints:
 * - Active load summation
 * - Inverter DC/AC conversion and efficiency losses
 * - Solar self-consumption priority
 * - Battery charge/discharge constraints & min/max SoC protection
 * - Islanded grid condition (zero grid import/export with blackout/unmet demand tracking)
 * - Inverter capacity thresholds and overload detection
 */
export function calculateElectricalMetrics(state: SimulationState): SimulationMetrics {
  const activeAlerts: string[] = [];

  // 1. Total Household Load Demand (W & kW)
  const totalHouseholdLoadW = state.appliances.reduce((sum, app) => {
    return app.isOn ? sum + Math.max(0, app.wattage) : sum;
  }, 0);
  const totalHouseholdLoadKW = +(totalHouseholdLoadW / 1000).toFixed(3);

  // 2. Solar Generation (DC rooftop generation)
  const solarCapacityKW = Math.max(0, state.solar.installedCapacityKW);
  const solarIrradiance = Math.max(0, Math.min(1, state.solar.generationFactor ?? state.solar.irradianceFactor ?? 0));
  const solarDCGenerationW = Math.round(solarCapacityKW * 1000 * solarIrradiance);
  const solarGenerationW = solarDCGenerationW;
  const solarGenerationKW = +(solarGenerationW / 1000).toFixed(3);

  // 3. Inverter Conversion & Efficiency
  const inverterEfficiency = Math.max(0.5, Math.min(1.0, (state.inverter.efficiencyPct || 96) / 100));
  const inverterCapacityW = Math.max(500, state.inverter.ratedCapacityKW * 1000);
  
  // Potential AC power available from solar
  const potentialSolarACW = Math.round(solarDCGenerationW * inverterEfficiency);
  const inverterEfficiencyLossW = Math.max(0, solarDCGenerationW - potentialSolarACW);
  const solarACOutputW = potentialSolarACW;

  // 4. Solar-to-Load Dispatch (Self-Consumption Priority)
  const solarToLoadW = Math.min(totalHouseholdLoadW, solarACOutputW);
  let solarSurplusW = Math.max(0, solarACOutputW - totalHouseholdLoadW);
  let loadShortfallW = Math.max(0, totalHouseholdLoadW - solarACOutputW);

  // 5. Battery Storage Dispatch
  const soc = Math.max(0, Math.min(100, state.battery.stateOfChargePct ?? state.battery.socPct ?? 80));
  const minSoC = Math.max(0, Math.min(50, state.battery.minStateOfChargePct ?? state.battery.minSoCPct ?? 15));
  const maxDischargeW = Math.max(0, state.battery.maxDischargePowerW ?? state.battery.maxDischargeRateW ?? 2500);
  const maxChargeW = Math.max(0, state.battery.maxChargePowerW ?? state.battery.maxChargeRateW ?? 2500);
  const mode = state.battery.mode || 'self_consumption';

  let batteryPowerFlowW = 0; // > 0: discharging, < 0: charging
  const isBatteryAtMinSoC = soc <= minSoC;
  const isBatteryFull = soc >= 99.5;

  if ((mode === 'self_consumption' || mode === 'idle') && loadShortfallW > 0 && !isBatteryAtMinSoC) {
    // Discharge battery to supply home demand
    const availableDischargePower = Math.min(maxDischargeW, loadShortfallW);
    batteryPowerFlowW = availableDischargePower;
    loadShortfallW -= availableDischargePower;
  } else if ((mode === 'charging' || mode === 'self_consumption') && solarSurplusW > 0 && !isBatteryFull) {
    // Absorb surplus solar into battery storage
    const availableChargePower = Math.min(maxChargeW, solarSurplusW);
    batteryPowerFlowW = -availableChargePower;
    solarSurplusW -= availableChargePower;
  }

  // 6. Grid Interaction & Islanded Operation
  const isIslanded = !state.grid.isConnected;
  let gridImportW = 0;
  let gridExportW = 0;
  let unmetDemandW = 0;

  if (isIslanded) {
    // Disconnected microgrid: ZERO power transfer to/from utility grid
    gridImportW = 0;
    gridExportW = 0;
    if (loadShortfallW > 0) {
      unmetDemandW = loadShortfallW;
      activeAlerts.push(
        `Islanded Microgrid Deficit: ${unmetDemandW} W of critical load cannot be met without grid backup.`
      );
    }
  } else {
    // On-grid: Remaining shortfall imported from grid; remaining surplus exported
    gridImportW = loadShortfallW;
    gridExportW = solarSurplusW;
  }

  const effectiveNetGridW = gridImportW > 0 ? gridImportW : -gridExportW;

  // 7. Grid Import Limit & Breaker Monitoring
  const importLimitW = Math.max(500, state.grid.importLimitW ?? state.grid.importCapacityLimitW ?? 3000);
  const isGridOverloaded = !isIslanded && gridImportW > importLimitW;
  const gridOverloadByW = Math.max(0, gridImportW - importLimitW);
  if (isGridOverloaded) {
    activeAlerts.push(
      `Grid Import Threshold Exceeded: Drawing ${gridImportW} W (${gridOverloadByW} W above configured ${importLimitW} W ceiling).`
    );
  }

  // 8. Household Software Capacity Limit Threshold
  const capacityLimitW = state.capacityLimitW || importLimitW;
  const capacityLimitKW = +(capacityLimitW / 1000).toFixed(2);
  const isCapacityExceeded = totalHouseholdLoadW > capacityLimitW;
  const capacityExceededByW = Math.max(0, totalHouseholdLoadW - capacityLimitW);
  const capacityUtilizationPct = capacityLimitW > 0 ? Math.round((totalHouseholdLoadW / capacityLimitW) * 100) : 0;
  if (isCapacityExceeded) {
    activeAlerts.push(
      `Capacity Threshold Exceeded: Total load ${totalHouseholdLoadW} W exceeds ${capacityLimitW} W threshold by ${capacityExceededByW} W.`
    );
  }

  // 9. Inverter Rated Throughput & Overload
  const inverterThroughputW = Math.max(
    solarACOutputW,
    Math.abs(batteryPowerFlowW) + (solarToLoadW > 0 ? solarToLoadW : 0)
  );
  const isInverterOverloaded = inverterThroughputW > inverterCapacityW;
  const inverterOverloadByW = Math.max(0, inverterThroughputW - inverterCapacityW);
  const inverterUtilizationPct = inverterCapacityW > 0 ? Math.round((inverterThroughputW / inverterCapacityW) * 100) : 0;
  if (isInverterOverloaded) {
    activeAlerts.push(
      `Inverter Overload: Active power conversion of ${inverterThroughputW} W exceeds rated ${inverterCapacityW} W capacity.`
    );
  }

  // 10. System Status Determination
  let status: 'normal' | 'warning' | 'critical' | 'islanded_alert' = 'normal';
  if (unmetDemandW > 0) {
    status = 'islanded_alert';
  } else if (isInverterOverloaded || isGridOverloaded) {
    status = 'critical';
  } else if (isCapacityExceeded || isBatteryAtMinSoC) {
    status = 'warning';
  }

  const batteryCapacityKWh = state.battery.capacityKWh || 8.0;
  const batteryAvailableEnergyKWh = +(((soc - minSoC) / 100) * batteryCapacityKWh).toFixed(2);

  return {
    totalHouseholdLoadW,
    totalHouseholdLoadKW,
    solarGenerationW,
    solarGenerationKW,
    solarACOutputW,
    inverterOutputW: Math.round(solarACOutputW + (batteryPowerFlowW > 0 ? batteryPowerFlowW : 0)),
    inverterEfficiencyLossW,
    batteryAvailableEnergyKWh: Math.max(0, batteryAvailableEnergyKWh),
    capacityLimitW,
    capacityLimitKW,
    isCapacityExceeded,
    capacityExceededByW,
    capacityUtilizationPct,

    // Solar breakdown
    solarUsedByHouseW: solarToLoadW,
    excessSolarW: gridExportW + (batteryPowerFlowW < 0 ? Math.abs(batteryPowerFlowW) : 0),

    // Grid
    gridImportW,
    gridExportW,
    effectiveNetGridW,
    isGridOverloaded,
    gridOverloadByW,
    isIslanded,
    isGridDisconnected: isIslanded,

    // Battery
    batteryPowerFlowW,
    batterySOCPct: soc,
    isBatteryDischarging: batteryPowerFlowW > 0,
    isBatteryCharging: batteryPowerFlowW < 0,
    isBatteryAtMinSoC,
    isBatteryFull,
    isBatteryDepleted: soc <= 5,

    // Inverter
    inverterLoadW: inverterThroughputW,
    isInverterOverloaded,
    inverterOverloadByW,
    inverterUtilizationPct,

    // Unmet Demand
    unmetDemandW,
    hasUnmetDemand: unmetDemandW > 0,

    // Status
    status,
    activeAlerts,
  };
}

/**
 * Generates actionable engineering validation warnings with mitigation steps.
 */
export function generateValidationWarnings(state: SimulationState, metrics: SimulationMetrics): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Inverter Overload
  if (metrics.isInverterOverloaded) {
    warnings.push({
      id: 'warn-inverter-overload',
      type: 'inverter_overload',
      severity: 'critical',
      title: 'Inverter Overload Protection Alert',
      description: `Inverter throughput (${metrics.inverterLoadW} W) exceeds rated capacity (${state.inverter.ratedCapacityKW * 1000} W) by ${metrics.inverterOverloadByW} W.`,
      technicalDetails: 'Operating the inverter above nominal rated apparent power can trigger thermal shutdown, voltage sag, or harmonic distortion.',
      correctiveAction: 'Shed non-essential heavy loads (e.g. EV charger or Water Pump) or upgrade inverter capacity to accommodate peak simultaneous throughput.',
      actionButtonLabel: 'Shed Deferrable Loads',
      actionType: 'shed_load'
    });
  }

  // Contract Capacity Exceeded
  if (metrics.isCapacityExceeded) {
    warnings.push({
      id: 'warn-capacity-exceeded',
      type: 'capacity_exceeded',
      severity: 'critical',
      title: 'Household Capacity Threshold Breach',
      description: `Total demand of ${metrics.totalHouseholdLoadW} W exceeds configured threshold (${metrics.capacityLimitW} W) by ${metrics.capacityExceededByW} W.`,
      technicalDetails: 'Breaching main utility service ampacity can trip main breakers or incur steep peak demand penalty tariffs.',
      correctiveAction: 'LoadPilot scheduling algorithm can shift EV charging and water pumping to off-peak daylight hours.',
      actionButtonLabel: 'Run Smart Load Shifting',
      actionType: 'optimize'
    });
  }

  // Islanded Microgrid Blackout / Deficit
  if (metrics.isIslanded && metrics.hasUnmetDemand) {
    warnings.push({
      id: 'warn-islanded-blackout',
      type: 'islanded_blackout',
      severity: 'critical',
      title: 'Islanded Microgrid Deficit (Blackout Hazard)',
      description: `Grid contactor is open. Total load (${metrics.totalHouseholdLoadW} W) exceeds combined solar and battery discharge by ${metrics.unmetDemandW} W.`,
      technicalDetails: 'Without grid frequency reference and sufficient storage reserve, the microgrid faces immediate under-frequency collapse.',
      correctiveAction: 'Immediately shed all deferrable loads to match local generation, or re-engage the grid interconnection switch.',
      actionButtonLabel: 'Re-engage Grid Contactor',
      actionType: 'switch_grid'
    });
  }

  // Battery Minimum State of Charge Cutoff
  if (metrics.isBatteryAtMinSoC && !metrics.isBatteryCharging) {
    warnings.push({
      id: 'warn-battery-cutoff',
      type: 'battery_cutoff',
      severity: 'warning',
      title: 'Battery Deep Discharge Protection Active',
      description: `Battery state of charge is at ${state.battery.stateOfChargePct}%, which has reached the ${state.battery.minStateOfChargePct}% minimum reserve cutoff.`,
      technicalDetails: 'Battery management system (BMS) halts discharge to prevent cell degradation and preserve emergency reserve.',
      correctiveAction: 'Allow battery to recharge via surplus solar generation or off-peak utility grid power before attempting further discharge.',
      actionButtonLabel: 'Set Battery to Solar Charge',
      actionType: 'reset_battery'
    });
  }

  return warnings;
}

/**
 * 7 Pre-configured engineering scenarios covering benchmark testing conditions.
 */
export const ENGINEERING_SCENARIOS: EngineeringScenario[] = [
  {
    id: 'normal',
    name: '1. Normal Household Operation',
    badge: 'Baseline',
    badgeColor: '#2ECC71',
    summary: 'Balanced midday operation with moderate appliance demand and active solar generation.',
    description: 'Demonstrates steady-state daytime behavior. Rooftop solar generates ~1,500 W while normal background household loads draw ~1,875 W. The battery discharges moderately to shave grid import.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.5,
      batterySoCPct: 75,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'fan', 'lights', 'refrigerator', 'computer'],
    },
    beforeOptimization: {
      peakLoadKW: 1.88,
      gridImportKWh: 4.8,
      solarSelfConsumptionPct: 78,
      estimatedCostUSD: 1.34,
    },
    afterOptimization: {
      peakLoadKW: 1.45,
      gridImportKWh: 2.1,
      solarSelfConsumptionPct: 94,
      estimatedCostUSD: 0.58,
      peakReductionPct: 22.8,
      savingsPct: 56.7,
    },
    keyInsight: 'Solar self-consumption is optimized when high-priority cooling cycles synchronize with peak generation.',
    correctiveActionRecommendation: 'Maintain automatic battery self-consumption mode to prevent daytime grid imports.',
  },
  {
    id: 'high_load',
    name: '2. High-Load Overload Condition',
    badge: 'Capacity Breach',
    badgeColor: '#E11D48',
    summary: 'EV charger, water pump, and AC running simultaneously, exceeding 3,000 W capacity limit.',
    description: 'Simulates evening peak overload when EV charging (2,400 W) overlaps with AC cooling (1,500 W) and water booster pump (750 W), driving household demand to over 4,900 W.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.1,
      batterySoCPct: 50,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'ev', 'pump', 'refrigerator', 'lights'],
    },
    beforeOptimization: {
      peakLoadKW: 4.95,
      gridImportKWh: 18.6,
      solarSelfConsumptionPct: 35,
      estimatedCostUSD: 5.21,
    },
    afterOptimization: {
      peakLoadKW: 2.85,
      gridImportKWh: 11.2,
      solarSelfConsumptionPct: 82,
      estimatedCostUSD: 3.14,
      peakReductionPct: 42.4,
      savingsPct: 39.7,
    },
    keyInsight: 'EV charging and hydro pump represent 64% of total power and can be deferred without user comfort penalty.',
    correctiveActionRecommendation: 'Schedule EV charging to start at 01:00 AM (off-peak) and stagger water pump cycle.',
  },
  {
    id: 'low_solar',
    name: '3. Low-Solar Heavy Overcast',
    badge: 'Resource Deficit',
    badgeColor: '#F59E0B',
    summary: 'Heavy cloud cover reduces solar irradiance to 15%, testing battery backup and grid resilience.',
    description: 'Cloud cover depresses solar production to ~450 W while household base load requires 1,950 W. Demonstrates the transition from solar self-reliance to hybrid storage dispatch.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.15,
      batterySoCPct: 60,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'lights', 'refrigerator', 'computer'],
    },
    beforeOptimization: {
      peakLoadKW: 2.05,
      gridImportKWh: 12.4,
      solarSelfConsumptionPct: 98,
      estimatedCostUSD: 3.47,
    },
    afterOptimization: {
      peakLoadKW: 1.55,
      gridImportKWh: 7.8,
      solarSelfConsumptionPct: 100,
      estimatedCostUSD: 2.18,
      peakReductionPct: 24.3,
      savingsPct: 37.1,
    },
    keyInsight: 'When solar irradiance dips, smart battery dispatch limits grid exposure while preventing deep battery cycling.',
    correctiveActionRecommendation: 'Pre-cool bedroom ahead of overcast afternoon and throttle flexible ventilation.',
  },
  {
    id: 'grid_outage',
    name: '4. Grid Outage (Islanded Microgrid)',
    badge: 'Islanded Alert',
    badgeColor: '#FB7185',
    summary: 'Utility grid disconnected. System operates in self-sustained islanded mode with zero grid transfer.',
    description: 'Tests anti-islanding switchgear behavior. The home must balance all power locally across rooftop PV and the battery bank. Unmet demand will cause system frequency destabilization.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.6,
      batterySoCPct: 65,
      gridConnected: false,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'lights', 'refrigerator', 'pump'],
    },
    beforeOptimization: {
      peakLoadKW: 3.05,
      gridImportKWh: 0.0,
      solarSelfConsumptionPct: 100,
      estimatedCostUSD: 0.0,
      unmetDemandKW: 0.85,
    },
    afterOptimization: {
      peakLoadKW: 1.85,
      gridImportKWh: 0.0,
      solarSelfConsumptionPct: 100,
      estimatedCostUSD: 0.0,
      peakReductionPct: 39.3,
      savingsPct: 0.0,
    },
    keyInsight: 'Automatic load shedding of deferrable loads preserves battery autonomy and guarantees continuous operation for life-critical loads.',
    correctiveActionRecommendation: 'Isolate EV charging and water booster pump immediately to maintain battery SOC above 30%.',
  },
  {
    id: 'battery_empty',
    name: '5. Battery Nearly Empty (Reserve Cutoff)',
    badge: 'BMS Protection',
    badgeColor: '#E11D48',
    summary: 'Battery SOC at 12%, below the 15% minimum safety cutoff. Discharge is locked out.',
    description: 'BMS enforces deep-discharge protection. All household demand must be served by solar generation or grid import. Verifies that LoadPilot respects hardware warranty constraints.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.35,
      batterySoCPct: 12,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'fan', 'lights', 'refrigerator'],
    },
    beforeOptimization: {
      peakLoadKW: 1.87,
      gridImportKWh: 9.6,
      solarSelfConsumptionPct: 88,
      estimatedCostUSD: 2.68,
    },
    afterOptimization: {
      peakLoadKW: 1.15,
      gridImportKWh: 5.2,
      solarSelfConsumptionPct: 98,
      estimatedCostUSD: 1.45,
      peakReductionPct: 38.5,
      savingsPct: 45.9,
    },
    keyInsight: 'Respecting the 15% reserve floor extends lithium cell longevity while smart curtailment limits costly peak grid imports.',
    correctiveActionRecommendation: 'Direct incoming solar power to battery replenishment until SOC reaches 30%.',
  },
  {
    id: 'solar_surplus',
    name: '6. High Solar Surplus Generation',
    badge: 'Net Export',
    badgeColor: '#2ECC71',
    summary: 'Peak solar generation (2.85 kW) with low household demand (450 W). Charges battery and exports to grid.',
    description: 'Simulates midday sunny conditions with unoccupied house. Examines reverse power flow, battery charging saturation, and net metering feed-in export.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.95,
      batterySoCPct: 40,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['refrigerator', 'lights'],
    },
    beforeOptimization: {
      peakLoadKW: 0.30,
      gridImportKWh: 0.0,
      solarSelfConsumptionPct: 42,
      estimatedCostUSD: -0.85,
    },
    afterOptimization: {
      peakLoadKW: 2.70,
      gridImportKWh: 0.0,
      solarSelfConsumptionPct: 95,
      estimatedCostUSD: -0.32,
      peakReductionPct: -800, // Productive load absorption
      savingsPct: 75.0,
    },
    keyInsight: 'Absorbing surplus solar into EV charging or thermal water storage yields 3x higher value than low-rate feed-in export.',
    correctiveActionRecommendation: 'Activate smart EV charging and water heating opportunistically during solar peak.',
  },
  {
    id: 'smart_scheduling_comparison',
    name: '7. Full Smart Scheduling Benchmark',
    badge: 'Optimization Delta',
    badgeColor: '#38BDF8',
    summary: 'Direct side-by-side comparison of unmanaged chaotic usage vs. LoadPilot AI predictive schedule.',
    description: 'Evaluates the 24-hour engineering performance of LoadPilot AI against unmanaged baseline behavior. Compares peak coincidence, grid stress, solar alignment, and total energy costs.',
    conditions: {
      solarKW: 3.0,
      solarFactor: 0.7,
      batterySoCPct: 65,
      gridConnected: true,
      capacityLimitW: 3000,
      activeAppliances: ['ac', 'fan', 'lights', 'refrigerator', 'pump', 'computer', 'ev'],
    },
    beforeOptimization: {
      peakLoadKW: 5.17,
      gridImportKWh: 24.8,
      solarSelfConsumptionPct: 51,
      estimatedCostUSD: 6.94,
    },
    afterOptimization: {
      peakLoadKW: 2.85,
      gridImportKWh: 14.1,
      solarSelfConsumptionPct: 89,
      estimatedCostUSD: 3.95,
      peakReductionPct: 44.8,
      savingsPct: 43.1,
    },
    keyInsight: 'Constraint-aware scheduling eliminates breaker trips, slashes grid demand charges by 44.8%, and raises solar self-consumption to 89%.',
    correctiveActionRecommendation: 'Adopt the LoadPilot AI automated schedule to guarantee constraint compliance 24/7.',
  },
];
