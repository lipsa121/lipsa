import { 
  FlexibleTask, 
  OptimizationObjective, 
  ScheduledJob, 
  HourlyScheduleProfile, 
  SchedulingComparison,
  Appliance
} from '../types/simulation';
import { BENCHMARK_TIME_SERIES } from './forecastingEngine';

// ============================================================================
// LOADPILOT AI — CONSTRAINT-AWARE SMART LOAD SCHEDULING ENGINE (PHASE 4)
// Deterministic optimization that respects hard operating windows, duration,
// capacity thresholds, and task priorities while maximizing solar self-consumption.
// ============================================================================

/**
 * Default flexible tasks derived from common residential deferrable appliances
 */
export const DEFAULT_FLEXIBLE_TASKS: FlexibleTask[] = [
  {
    id: 'task-ev',
    name: 'EV Level-2 Charging Session',
    applianceId: 'ev',
    ratedPowerW: 2400,
    durationHours: 3,
    earliestStartHour: 10,  // 10:00 AM
    latestEndHour: 17,     // 05:00 PM (solar daylight window)
    preferredStartHour: 19, // Unmanaged: User usually plugs in at 7 PM (peak evening!)
    priority: 'High',
    flexibility: 'Flexible',
    isEnabled: true,
  },
  {
    id: 'task-pump',
    name: 'Overhead Tank Water Pump',
    applianceId: 'pump',
    ratedPowerW: 750,
    durationHours: 2,
    earliestStartHour: 11,  // 11:00 AM
    latestEndHour: 16,     // 04:00 PM
    preferredStartHour: 20, // Unmanaged: Often turned on at 8 PM
    priority: 'Deferrable',
    flexibility: 'Flexible',
    isEnabled: true,
  },
  {
    id: 'task-ac-precool',
    name: 'Pre-Cooling Thermal Storage Shift',
    applianceId: 'ac',
    ratedPowerW: 1500,
    durationHours: 2,
    earliestStartHour: 12,  // 12:00 PM
    latestEndHour: 16,     // 04:00 PM
    preferredStartHour: 18, // Unmanaged: Evening cooling blast at 6 PM
    priority: 'Medium',
    flexibility: 'Semi-Flexible',
    isEnabled: true,
  },
  {
    id: 'task-dishwasher',
    name: 'Eco Dishwasher / Utility Cycle',
    applianceId: 'utility-cycle',
    ratedPowerW: 1200,
    durationHours: 2,
    earliestStartHour: 10,  // 10:00 AM
    latestEndHour: 18,     // 06:00 PM
    preferredStartHour: 21, // Unmanaged: Run after dinner at 9 PM
    priority: 'Low',
    flexibility: 'Flexible',
    isEnabled: true,
  },
];

/**
 * Extracts 24h baseline demand and solar profile from benchmark or active state
 */
export function get24HourBaseline(
  installedSolarCapacityKW: number = 3.0,
  activeAppliances?: Appliance[]
): { baseLoads: number[]; solarGeneration: number[] } {
  // Use today's held-out reference slice for base essential load
  const todaySlice = BENCHMARK_TIME_SERIES.slice(48, 72);
  
  // Calculate essential non-flexible load (fridge, lighting, base electronics)
  let nonFlexibleActiveW = 0;
  if (activeAppliances) {
    nonFlexibleActiveW = activeAppliances
      .filter((a) => a.flexibility === 'Non-Flexible' && a.isOn)
      .reduce((sum, a) => sum + a.wattage, 0);
  }

  const baseLoads: number[] = [];
  const solarGeneration: number[] = [];

  for (let h = 0; h < 24; h++) {
    const pt = todaySlice[h];
    // Baseline essential load represents protected non-deferrable consumption
    // If active non-flexible loads exceed benchmark base, adaptively scale
    const baseW = Math.max(pt.baseDemandW, nonFlexibleActiveW > 0 ? nonFlexibleActiveW : pt.baseDemandW);
    baseLoads.push(Math.round(baseW));

    // Solar profile
    const solarFactor = pt.solarGenerationW / 3000;
    const solarW = Math.round(installedSolarCapacityKW * 1000 * solarFactor);
    solarGeneration.push(solarW);
  }

  return { baseLoads, solarGeneration };
}

/**
 * Priority weighting for solver dispatch order
 */
const PRIORITY_RANK: Record<string, number> = {
  Critical: 5,
  High: 4,
  Medium: 3,
  Low: 2,
  Deferrable: 1,
};

/**
 * Constraint-Aware Deterministic Load Scheduling Algorithm
 */
export function solveSmartSchedule(
  tasks: FlexibleTask[],
  capacityLimitW: number = 3000,
  objective: OptimizationObjective = 'balanced',
  installedSolarCapacityKW: number = 3.0,
  activeAppliances?: Appliance[]
): SchedulingComparison {
  const { baseLoads, solarGeneration } = get24HourBaseline(installedSolarCapacityKW, activeAppliances);

  // 1. Compute Unmanaged Baseline:
  // In unmanaged profile, tasks run at their preferredStartHour unconditionally
  const unmanagedProfile: number[] = [...baseLoads];
  const enabledTasks = tasks.filter((t) => t.isEnabled);

  for (const task of enabledTasks) {
    const start = Math.max(0, Math.min(23, task.preferredStartHour));
    const duration = Math.max(1, Math.min(24 - start, task.durationHours));
    for (let h = start; h < start + duration; h++) {
      if (h < 24) {
        unmanagedProfile[h] += task.ratedPowerW;
      }
    }
  }

  // 2. Sort tasks by priority (High priority tasks claim optimal solar/capacity slots first)
  const sortedTasks = [...enabledTasks].sort((a, b) => {
    const pDiff = (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0);
    if (pDiff !== 0) return pDiff;
    // Tie-breaker: longer duration first
    return b.durationHours - a.durationHours;
  });

  // 3. Constraint-Aware Placement
  const scheduledProfile: number[] = [...baseLoads];
  const scheduledJobs: ScheduledJob[] = [];
  const infeasibleJobs: ScheduledJob[] = [];
  const activeJobsByHour: string[][] = Array.from({ length: 24 }, () => []);

  for (const task of sortedTasks) {
    const duration = task.durationHours;
    const earliest = Math.max(0, Math.min(23, task.earliestStartHour));
    const latest = Math.max(earliest + duration, Math.min(24, task.latestEndHour));
    const latestStart = latest - duration;

    // Check if task window is too tight for its duration
    if (latestStart < earliest) {
      infeasibleJobs.push({
        taskId: task.id,
        taskName: task.name,
        applianceId: task.applianceId,
        assignedStartHour: -1,
        assignedEndHour: -1,
        powerW: task.ratedPowerW,
        status: 'infeasible',
        infeasibilityReason: `Operating window [${earliest}:00 - ${latest}:00] is shorter than required runtime (${duration}h).`,
        priority: task.priority,
      });
      continue;
    }

    // Evaluate all valid candidate start hours in [earliest, latestStart]
    type CandidateSlot = {
      startHour: number;
      maxPower: number;
      solarSurplusUtilization: number;
      gridImportW: number;
      isStrictlyFeasible: boolean;
      score: number;
    };

    const candidates: CandidateSlot[] = [];

    for (let s = earliest; s <= latestStart; s++) {
      let isStrictlyFeasible = true;
      let slotMaxPower = 0;
      let solarSurplusCoveredW = 0;
      let totalGridImportW = 0;

      for (let h = s; h < s + duration; h++) {
        const currentTotal = scheduledProfile[h];
        const newTotal = currentTotal + task.ratedPowerW;
        if (newTotal > slotMaxPower) {
          slotMaxPower = newTotal;
        }

        if (newTotal > capacityLimitW) {
          isStrictlyFeasible = false;
        }

        // Solar surplus overlap calculation
        const solarSurplus = Math.max(0, solarGeneration[h] - currentTotal);
        const solarUsed = Math.min(solarSurplus, task.ratedPowerW);
        solarSurplusCoveredW += solarUsed;

        // Grid import calculation
        const netAfterSolar = Math.max(0, newTotal - solarGeneration[h]);
        totalGridImportW += netAfterSolar;
      }

      // Objective scoring formulation:
      // Lower score is better
      let score = 0;
      if (objective === 'solar_first') {
        // Heavy penalty on grid import, heavy reward for solar utilization
        score = totalGridImportW * 2.0 - solarSurplusCoveredW * 3.0 + (slotMaxPower > capacityLimitW ? 100000 : 0);
      } else if (objective === 'peak_shaving') {
        // Heavy penalty on high peak kW
        score = slotMaxPower * 4.0 + (slotMaxPower > capacityLimitW ? 100000 : 0);
      } else {
        // Balanced: peak shaving + solar maximization
        score = slotMaxPower * 2.0 + totalGridImportW * 1.5 - solarSurplusCoveredW * 2.0 + (slotMaxPower > capacityLimitW ? 100000 : 0);
      }

      candidates.push({
        startHour: s,
        maxPower: slotMaxPower,
        solarSurplusUtilization: solarSurplusCoveredW,
        gridImportW: totalGridImportW,
        isStrictlyFeasible,
        score,
      });
    }

    // Filter to strictly feasible candidate slots first
    const strictlyFeasibleCandidates = candidates.filter((c) => c.isStrictlyFeasible);

    let chosenCandidate: CandidateSlot | null = null;

    if (strictlyFeasibleCandidates.length > 0) {
      // Pick best score among feasible candidates
      strictlyFeasibleCandidates.sort((a, b) => a.score - b.score);
      chosenCandidate = strictlyFeasibleCandidates[0];

      // Commit to schedule
      for (let h = chosenCandidate.startHour; h < chosenCandidate.startHour + duration; h++) {
        scheduledProfile[h] += task.ratedPowerW;
        activeJobsByHour[h].push(task.name);
      }

      scheduledJobs.push({
        taskId: task.id,
        taskName: task.name,
        applianceId: task.applianceId,
        assignedStartHour: chosenCandidate.startHour,
        assignedEndHour: chosenCandidate.startHour + duration,
        powerW: task.ratedPowerW,
        status: 'scheduled',
        priority: task.priority,
      });
    } else {
      // No slot can accommodate the load under capacity limit!
      // Pick the least-violating candidate, but mark as infeasible with clear explanation
      candidates.sort((a, b) => a.score - b.score);
      const fallback = candidates[0];

      infeasibleJobs.push({
        taskId: task.id,
        taskName: task.name,
        applianceId: task.applianceId,
        assignedStartHour: fallback ? fallback.startHour : -1,
        assignedEndHour: fallback ? fallback.startHour + duration : -1,
        powerW: task.ratedPowerW,
        status: 'infeasible',
        infeasibilityReason: `Load requires ${task.ratedPowerW}W for ${duration}h. Adding to window [${earliest}:00 - ${latest}:00] pushes total demand to ${fallback ? fallback.maxPower : 'over'}W, exceeding the ${capacityLimitW}W capacity limit.`,
        priority: task.priority,
      });
    }
  }

  // 4. Construct Hourly Comparative Profiles
  const hourlyProfiles: HourlyScheduleProfile[] = [];
  let unmanagedBreachCount = 0;
  let scheduledBreachCount = 0;
  let unmanagedPeak = 0;
  let scheduledPeak = 0;
  let totalSolarGenKWh = 0;
  let unmanagedSolarUsedKWh = 0;
  let scheduledSolarUsedKWh = 0;

  for (let h = 0; h < 24; h++) {
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    const baseW = baseLoads[h];
    const unmanW = unmanagedProfile[h];
    const schedW = scheduledProfile[h];
    const solarW = solarGeneration[h];

    if (unmanW > unmanagedPeak) unmanagedPeak = unmanW;
    if (schedW > scheduledPeak) scheduledPeak = schedW;

    const unmanBreach = unmanW > capacityLimitW;
    const schedBreach = schedW > capacityLimitW;

    if (unmanBreach) unmanagedBreachCount++;
    if (schedBreach) scheduledBreachCount++;

    const unmanGridImport = Math.max(0, unmanW - solarW);
    const schedGridImport = Math.max(0, schedW - solarW);

    // Solar utilization
    totalSolarGenKWh += solarW / 1000;
    unmanagedSolarUsedKWh += Math.min(solarW, unmanW) / 1000;
    scheduledSolarUsedKWh += Math.min(solarW, schedW) / 1000;

    hourlyProfiles.push({
      hour: h,
      timeLabel,
      baseDemandW: baseW,
      unmanagedDemandW: unmanW,
      scheduledDemandW: schedW,
      solarGenerationW: solarW,
      capacityLimitW,
      unmanagedCapacityBreach: unmanBreach,
      scheduledCapacityBreach: schedBreach,
      unmanagedGridImportW: unmanGridImport,
      scheduledGridImportW: schedGridImport,
      activeScheduledJobs: activeJobsByHour[h],
    });
  }

  // 5. Delta Calculations
  const peakReductionW = Math.max(0, unmanagedPeak - scheduledPeak);
  const peakReductionPct = unmanagedPeak > 0 ? Math.round((peakReductionW / unmanagedPeak) * 1000) / 10 : 0;

  const unmanagedSelfConsumptionPct = totalSolarGenKWh > 0 
    ? Math.min(100, Math.round((unmanagedSolarUsedKWh / totalSolarGenKWh) * 1000) / 10) 
    : 0;

  const scheduledSelfConsumptionPct = totalSolarGenKWh > 0 
    ? Math.min(100, Math.round((scheduledSolarUsedKWh / totalSolarGenKWh) * 1000) / 10) 
    : 0;

  // Calculate energy shifted from unmanaged slots to scheduled slots
  let shiftedEnergyKWh = 0;
  for (const job of scheduledJobs) {
    const task = tasks.find((t) => t.id === job.taskId);
    if (task && task.preferredStartHour !== job.assignedStartHour) {
      shiftedEnergyKWh += (task.ratedPowerW * task.durationHours) / 1000;
    }
  }

  let solverStatus: 'optimal' | 'feasible_with_warnings' | 'infeasible' = 'optimal';
  let message = 'All flexible tasks successfully scheduled within operating windows without capacity breach.';

  if (infeasibleJobs.length > 0) {
    solverStatus = scheduledJobs.length > 0 ? 'feasible_with_warnings' : 'infeasible';
    message = `${infeasibleJobs.length} task(s) could not be scheduled without breaching the ${capacityLimitW}W threshold.`;
  } else if (scheduledBreachCount > 0) {
    solverStatus = 'feasible_with_warnings';
    message = 'Baseline demand itself exceeds capacity threshold in certain intervals.';
  }

  return {
    objective,
    hourlyProfiles,
    scheduledJobs,
    infeasibleJobs,
    unmanagedPeakW: unmanagedPeak,
    scheduledPeakW: scheduledPeak,
    peakReductionW,
    peakReductionPct,
    unmanagedBreachHours: unmanagedBreachCount,
    scheduledBreachHours: scheduledBreachCount,
    unmanagedSolarSelfConsumptionPct: unmanagedSelfConsumptionPct,
    scheduledSolarSelfConsumptionPct: scheduledSelfConsumptionPct,
    totalShiftedEnergyKWh: Math.round(shiftedEnergyKWh * 10) / 10,
    solverStatus,
    message,
  };
}
