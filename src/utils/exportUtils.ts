import { SimulationLogEntry, SimulationMetrics, SimulationState, AccumulatedEnergy, TariffConfig } from '../types/simulation';

/**
 * Generates an engineering-grade CSV string of simulation time-series data.
 * All rows and headers are formatted for standard data analysis tools (Excel, Pandas, MATLAB).
 */
export function generateSimulationCSV(
  logEntries: SimulationLogEntry[],
  state: SimulationState,
  metrics: SimulationMetrics,
  accumulated: AccumulatedEnergy
): string {
  const metadataHeaders = [
    '# ==========================================================================',
    '# LOADPILOT AI - ELECTRICAL ENERGY BALANCE SIMULATION TIME-SERIES LOG',
    '# DISCLAIMER: SIMULATED DATA ONLY - COLLEGE ENGINEERING RESEARCH PROTOTYPE',
    '# NOT CERTIFIED FOR DIRECT PHYSICAL GRID DISCONNECT OR LIFE SAFETY SYSTEMS',
    '# ==========================================================================',
    `# Export Timestamp: ${new Date().toISOString()}`,
    `# Solar Capacity: ${state.solar.installedCapacityKW} kW (DC)`,
    `# Inverter Rating: ${state.inverter.ratedCapacityKW} kW (Efficiency: ${state.inverter.efficiencyPct}%)`,
    `# Battery Storage: ${state.battery.capacityKWh} kWh (Min SoC: ${state.battery.minStateOfChargePct}%)`,
    `# Contract Capacity Limit: ${state.grid.importLimitW} W`,
    `# Grid Interconnection: ${state.grid.isConnected ? 'Connected (On-Grid)' : 'Islanded Microgrid'}`,
    `# Cumulative Load Energy: ${accumulated.totalLoadKWh.toFixed(3)} kWh`,
    `# Cumulative Solar Energy: ${accumulated.solarGeneratedKWh.toFixed(3)} kWh`,
    `# Cumulative Grid Import: ${accumulated.gridImportedKWh.toFixed(3)} kWh`,
    `# Cumulative Grid Export: ${accumulated.gridExportedKWh.toFixed(3)} kWh`,
    '# ==========================================================================',
  ].join('\n');

  const columnHeaders = [
    'Entry_ID',
    'Timestamp',
    'Simulated_Hour',
    'Time_Label',
    'Load_Demand_W',
    'Solar_Generation_W',
    'Solar_AC_Output_W',
    'Solar_Used_By_House_W',
    'Battery_Power_Flow_W',
    'Battery_SoC_Pct',
    'Grid_Import_W',
    'Grid_Export_W',
    'Inverter_Load_W',
    'Is_Islanded',
    'System_Status',
    'Active_Alerts_Count',
  ].join(',');

  // If log is empty, provide current snapshot as entry
  const rows = logEntries.length > 0 ? logEntries : [
    {
      id: 'snapshot-0',
      timestamp: new Date().toLocaleTimeString(),
      simulatedHour: state.timeOfDayHour,
      timeLabel: `${state.timeOfDayHour.toString().padStart(2, '0')}:00`,
      loadW: metrics.totalHouseholdLoadW,
      solarW: metrics.solarGenerationW,
      solarACOutputW: metrics.solarACOutputW,
      solarUsedByHouseW: metrics.solarUsedByHouseW || 0,
      batteryFlowW: metrics.batteryPowerFlowW,
      batterySoCPct: state.battery.stateOfChargePct,
      gridImportW: metrics.gridImportW,
      gridExportW: metrics.gridExportW,
      inverterLoadW: metrics.inverterLoadW,
      isIslanded: metrics.isIslanded,
      status: metrics.status,
      alertsCount: metrics.activeAlerts.length,
    }
  ];

  const dataRows = rows.map((e) => [
    e.id,
    `"${e.timestamp}"`,
    e.simulatedHour.toFixed(2),
    `"${e.timeLabel}"`,
    e.loadW,
    e.solarW,
    e.solarACOutputW,
    e.solarUsedByHouseW,
    e.batteryFlowW,
    e.batterySoCPct.toFixed(1),
    e.gridImportW,
    e.gridExportW,
    e.inverterLoadW,
    e.isIslanded ? 'TRUE' : 'FALSE',
    `"${e.status}"`,
    e.alertsCount,
  ].join(','));

  return `${metadataHeaders}\n${columnHeaders}\n${dataRows.join('\n')}`;
}

/**
 * Triggers a browser download of the generated CSV file.
 */
export function downloadCSVFile(csvContent: string, fileName = 'loadpilot_simulation_data.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
