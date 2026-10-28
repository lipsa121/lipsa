/**
 * LoadPilot AI - Automated Electrical Calculation Engine & Step 5 Test Suite
 * Run with: npx tsx tests/electricalEngine.test.ts
 */

import { 
  calculateElectricalMetrics, 
  calculateDiurnalIrradiance, 
  calculateBatterySoCDelta,
  generateValidationWarnings,
  ENGINEERING_SCENARIOS 
} from '../src/utils/electricalEngine';
import { generateSimulationCSV } from '../src/utils/exportUtils';
import { SimulationState } from '../src/types/simulation';

function assert(condition: boolean, testName: string, failureDetail?: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${testName}`);
    if (failureDetail) console.error(`   Details: ${failureDetail}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${testName}`);
  }
}

console.log('\n======================================================');
console.log('⚡ RUNNING LOADPILOT AI ELECTRICAL ENGINE UNIT TESTS');
console.log('======================================================\n');

// Mock Base State
const createBaseState = (): SimulationState => ({
  appliances: [
    {
      id: 'ac',
      name: 'Air Conditioner',
      category: 'Climate',
      room: 'bedroom',
      defaultWattage: 1500,
      wattage: 1500,
      isOn: true,
      priority: 'High',
      flexibility: 'Semi-Flexible',
      iconName: 'Wind',
      description: 'Cooling',
    },
    {
      id: 'lights',
      name: 'Lights',
      category: 'Illumination',
      room: 'living',
      defaultWattage: 100,
      wattage: 100,
      isOn: true,
      priority: 'Critical',
      flexibility: 'Non-Flexible',
      iconName: 'Lightbulb',
      description: 'Lighting',
    },
    {
      id: 'ev',
      name: 'EV Charger',
      category: 'Transport',
      room: 'garage',
      defaultWattage: 2400,
      wattage: 2400,
      isOn: false,
      priority: 'High',
      flexibility: 'Flexible',
      iconName: 'Car',
      description: 'Vehicle',
    }
  ],
  solar: {
    installedCapacityKW: 3.0,
    generationFactor: 0.5,
    irradianceFactor: 0.5,
    tiltAngleDeg: 25,
    azimuth: 'South',
  },
  solarConfig: {
    installedCapacityKW: 3.0,
    generationFactor: 0.5,
    irradianceFactor: 0.5,
    tiltAngleDeg: 25,
    azimuth: 'South',
  },
  inverter: {
    ratedCapacityKW: 5.0,
    efficiencyPct: 96,
  },
  inverterConfig: {
    ratedCapacityKW: 5.0,
    efficiencyPct: 96,
  },
  battery: {
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
  },
  batteryConfig: {
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
  },
  grid: {
    isConnected: true,
    importLimitW: 3000,
    importCapacityLimitW: 3000,
  },
  gridConfig: {
    isConnected: true,
    importLimitW: 3000,
    importCapacityLimitW: 3000,
  },
  evCharger: {
    ratedPowerW: 2400,
    isPluggedIn: true,
    isCharging: false,
    batteryCapacityKWh: 60,
    currentSoCPct: 55,
  },
  timeOfDay: 'afternoon',
  timeOfDayHour: 14,
  sunIrradiancePct: 50,
  isSimulationPlaying: false,
  isAutoAdvancing: false,
  solarGenerationW: 1500,
  capacityLimitW: 3000,
  batteryCapacityKWh: 8.0,
  batterySoCPct: 80,
  batteryMode: 'self_consumption',
  batteryMaxDischargeW: 2500,
  batteryMaxChargeW: 2500,
});

// Test 1: Total Load Calculation
{
  const state = createBaseState();
  const metrics = calculateElectricalMetrics(state);
  assert(metrics.totalHouseholdLoadW === 1600, 'Test 1.1: Sum of active appliances matches total load (1500 + 100 = 1600 W)');
  assert(metrics.totalHouseholdLoadKW === 1.6, 'Test 1.2: Total load in kW matches 1.6 kW');
}

// Test 2: Appliance Toggling Dynamic Update
{
  const state = createBaseState();
  state.appliances[2].isOn = true; // Turn ON 2400W EV
  const metrics = calculateElectricalMetrics(state);
  assert(metrics.totalHouseholdLoadW === 4000, 'Test 2.1: Toggling EV ON raises load to 4000 W');
  assert(metrics.isCapacityExceeded === true, 'Test 2.2: 4000 W load triggers capacity exceedance against 3000 W ceiling');
  assert(metrics.capacityExceededByW === 1000, 'Test 2.3: Overload margin is exactly 1000 W');
}

// Test 3: Diurnal Solar Curve
{
  const midnight = calculateDiurnalIrradiance(0);
  const night = calculateDiurnalIrradiance(23);
  const noon = calculateDiurnalIrradiance(12.5);
  const sunrise = calculateDiurnalIrradiance(6.0);
  
  assert(midnight === 0, 'Test 3.1: Midnight irradiance is exactly 0.0');
  assert(night === 0, 'Test 3.2: 11:00 PM irradiance is exactly 0.0');
  assert(noon > 0.95 && noon <= 1.0, 'Test 3.3: Midday peak (12:30 PM) is near unity (1.0)');
  assert(sunrise > 0.0 && sunrise < 0.2, 'Test 3.4: Sunrise (06:00 AM) shows early dawn threshold');
}

// Test 4: Battery SoC Coulombic Integration
{
  // 2000W discharge for 1 hour from 8kWh battery with 95% efficiency
  const deltaDischarge = calculateBatterySoCDelta(2000, 8.0, 1.0, 95, 95);
  // Expected: -(2000 / 0.95) / 8000 * 100 = -26.315%
  assert(deltaDischarge < -25 && deltaDischarge > -28, `Test 4.1: Battery discharge SoC delta is negative and correct (${deltaDischarge.toFixed(2)}%)`);

  // 2000W charge for 1 hour into 8kWh battery with 95% efficiency
  const deltaCharge = calculateBatterySoCDelta(-2000, 8.0, 1.0, 95, 95);
  // Expected: +(2000 * 0.95) / 8000 * 100 = +23.75%
  assert(deltaCharge > 22 && deltaCharge < 25, `Test 4.2: Battery charge SoC delta is positive and correct (+${deltaCharge.toFixed(2)}%)`);
}

// Test 5: Islanded Microgrid & Unmet Demand
{
  const state = createBaseState();
  state.grid.isConnected = false; // Grid disconnected!
  state.solar.generationFactor = 0.0; // No solar
  state.battery.stateOfChargePct = 15; // At min SoC, cannot discharge
  state.battery.minStateOfChargePct = 15;
  
  const metrics = calculateElectricalMetrics(state);
  assert(metrics.isIslanded === true, 'Test 5.1: System identifies as islanded microgrid');
  assert(metrics.gridImportW === 0, 'Test 5.2: Disconnected grid imports exactly 0 W');
  assert(metrics.gridExportW === 0, 'Test 5.3: Disconnected grid exports exactly 0 W');
  assert(metrics.hasUnmetDemand === true, 'Test 5.4: Flags unmet demand blackout hazard');
  assert(metrics.unmetDemandW === 1600, 'Test 5.5: Unmet demand equals full 1600 W load deficit');
}

// Test 6: Inverter Overload Detection
{
  const state = createBaseState();
  state.inverter.ratedCapacityKW = 1.0; // Restrict inverter to 1.0 kW
  state.appliances[0].wattage = 3500; // 3.5 kW AC load
  const metrics = calculateElectricalMetrics(state);
  assert(metrics.isInverterOverloaded === true, 'Test 6.1: Inverter overload correctly detected');
  
  const warnings = generateValidationWarnings(state, metrics);
  const hasInverterWarn = warnings.some(w => w.type === 'inverter_overload');
  assert(hasInverterWarn === true, 'Test 6.2: Actionable inverter overload warning generated');
}

// Test 7: Preconfigured Scenarios Integrity
{
  assert(ENGINEERING_SCENARIOS.length === 7, 'Test 7.1: Exactly 7 pre-configured engineering scenarios provided');
  ENGINEERING_SCENARIOS.forEach((sc, idx) => {
    assert(sc.name.length > 0, `Test 7.2.${idx}: Scenario '${sc.id}' has title`);
    assert(sc.beforeOptimization.peakLoadKW > 0, `Test 7.3.${idx}: Scenario '${sc.id}' has valid before metrics`);
    assert(sc.afterOptimization.peakLoadKW > 0, `Test 7.4.${idx}: Scenario '${sc.id}' has valid after metrics`);
    assert(sc.correctiveActionRecommendation.length > 0, `Test 7.5.${idx}: Scenario '${sc.id}' has actionable advice`);
  });
}

// Test 8: CSV Export Structure & Disclaimers
{
  const state = createBaseState();
  const metrics = calculateElectricalMetrics(state);
  const accumulated = {
    totalLoadKWh: 4.5,
    solarGeneratedKWh: 3.2,
    gridImportedKWh: 1.8,
    gridExportedKWh: 0.5,
    batteryChargedKWh: 1.2,
    batteryDischargedKWh: 0.9,
    elapsedSimulationSeconds: 7200,
  };
  const csv = generateSimulationCSV([], state, metrics, accumulated);
  assert(csv.includes('SIMULATED DATA ONLY'), 'Test 8.1: CSV header explicitly includes SIMULATED DATA disclaimer');
  assert(csv.includes('Load_Demand_W,Solar_Generation_W'), 'Test 8.2: CSV includes required time-series column headers');
  assert(csv.includes('Cumulative Load Energy: 4.500 kWh'), 'Test 8.3: CSV metadata includes cumulative kWh totals');
}

console.log('\n======================================================');
console.log('🎉 ALL LOADPILOT AI ELECTRICAL ENGINE TESTS PASSED!');
console.log('======================================================\n');
