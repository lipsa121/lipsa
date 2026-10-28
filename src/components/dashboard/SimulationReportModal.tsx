import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Sun, 
  Battery, 
  Building2, 
  DollarSign,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { generateSimulationCSV, downloadCSVFile } from '../../utils/exportUtils';

interface SimulationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationReportModal: React.FC<SimulationReportModalProps> = ({ isOpen, onClose }) => {
  const { 
    state, 
    metrics, 
    accumulatedEnergy, 
    simulationLog, 
    tariff, 
    estimatedNetEnergyCostUSD,
    validationWarnings,
    simulatedTimeFormatted
  } = useEnergySimulation();

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvData = generateSimulationCSV(simulationLog, state, metrics, accumulatedEnergy);
    downloadCSVFile(csvData, `loadpilot_simulation_report_${Date.now()}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#2D3748] bg-[#12161E] text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#202735] flex items-center justify-between bg-[#0E1218]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/40 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                LoadPilot AI · Energy Simulation & Audit Report
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} · Simulated Time: {simulatedTimeFormatted}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Explicit Research Disclaimer Banner */}
          <div className="rounded-xl border border-[#BE123C]/50 bg-[#3B0C15]/60 p-3.5 sm:p-4 text-xs text-rose-200/90 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-[#FB7185] uppercase tracking-wide font-mono text-[11px]">
                Engineering Disclaimer — Simulated Data Only
              </div>
              <p className="leading-relaxed text-slate-300">
                This report represents mathematical simulations executed by the LoadPilot AI electrical energy balance model for college engineering evaluation. Values are calculated using steady-state Kirchhoff power dispatch and idealized battery cell models. All financial values are theoretical estimates based on configured tariff inputs.
              </p>
            </div>
          </div>

          {/* Section 1: System Specifications & Rating Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2ECC71]" />
              <span>1. System Configuration & Nameplate Ratings</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0B0E13] border border-[#1E2532]">
                <div className="text-slate-400 text-[11px]">Rooftop Solar Array</div>
                <div className="text-sm font-bold text-white mt-1">{state.solar.installedCapacityKW} kW DC</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tilt: 25° · South</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0E13] border border-[#1E2532]">
                <div className="text-slate-400 text-[11px]">Hybrid Inverter</div>
                <div className="text-sm font-bold text-white mt-1">{state.inverter.ratedCapacityKW} kW AC</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Efficiency: {state.inverter.efficiencyPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0E13] border border-[#1E2532]">
                <div className="text-slate-400 text-[11px]">BESS Battery Bank</div>
                <div className="text-sm font-bold text-white mt-1">{state.battery.capacityKWh} kWh</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Min Cutoff: {state.battery.minStateOfChargePct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0E13] border border-[#1E2532]">
                <div className="text-slate-400 text-[11px]">Contract Capacity</div>
                <div className="text-sm font-bold text-white mt-1">{state.grid.importLimitW} W</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Status: {state.grid.isConnected ? 'On-Grid' : 'Islanded'}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Energy Balance & Cumulative Ledger */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>2. Cumulative Energy Balance Ledger</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#1E2532] bg-[#0B0E13]">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-[#12161F] text-slate-400 text-[11px] border-b border-[#1E2532]">
                  <tr>
                    <th className="p-3 font-semibold">Energy Category</th>
                    <th className="p-3 font-semibold">Instantaneous Power</th>
                    <th className="p-3 font-semibold">Cumulative Energy</th>
                    <th className="p-3 font-semibold">Unit Share / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A202C] text-slate-200">
                  <tr>
                    <td className="p-3 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      Household Load Demand
                    </td>
                    <td className="p-3">{metrics.totalHouseholdLoadW} W</td>
                    <td className="p-3 font-bold text-white">{accumulatedEnergy.totalLoadKWh.toFixed(3)} kWh</td>
                    <td className="p-3 text-slate-400">100.0% of site consumption</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                      Solar Generation (AC)
                    </td>
                    <td className="p-3 text-[#2ECC71] font-medium">{metrics.solarACOutputW} W</td>
                    <td className="p-3 font-bold text-[#2ECC71]">{accumulatedEnergy.solarGeneratedKWh.toFixed(3)} kWh</td>
                    <td className="p-3 text-emerald-300/80">Self-consumption source</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      Battery Storage (BESS)
                    </td>
                    <td className="p-3">
                      {metrics.batteryPowerFlowW > 0 
                        ? `Discharging ${metrics.batteryPowerFlowW} W` 
                        : metrics.batteryPowerFlowW < 0 
                        ? `Charging ${Math.abs(metrics.batteryPowerFlowW)} W` 
                        : 'Idle'}
                    </td>
                    <td className="p-3 font-bold text-[#10B981]">
                      Discharged: {accumulatedEnergy.batteryDischargedKWh.toFixed(3)} kWh
                    </td>
                    <td className="p-3 text-slate-400">SoC: {state.battery.stateOfChargePct.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                      Utility Grid Net Flow
                    </td>
                    <td className="p-3 font-medium">
                      {metrics.gridImportW > 0 
                        ? `Importing ${metrics.gridImportW} W` 
                        : metrics.gridExportW > 0 
                        ? `Exporting ${metrics.gridExportW} W` 
                        : 'Balanced'}
                    </td>
                    <td className="p-3 font-bold text-[#FB7185]">
                      Import: {accumulatedEnergy.gridImportedKWh.toFixed(3)} kWh / Export: {accumulatedEnergy.gridExportedKWh.toFixed(3)} kWh
                    </td>
                    <td className="p-3 text-slate-400">{state.grid.isConnected ? 'Synchronized' : 'Islanded'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Tariff & Cost Estimates */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#10B981]" />
              <span>3. Tariff Breakdown & Estimated Financial Model</span>
            </h3>

            <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[11px]">Configured Utility Import Rate:</span>
                <div className="text-sm font-bold text-white mt-0.5">{tariff.currencySymbol}{tariff.importRatePerKWh.toFixed(2)} / kWh</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Solar Net Feed-In Tariff:</span>
                <div className="text-sm font-bold text-[#10B981] mt-0.5">{tariff.currencySymbol}{tariff.exportFeedInRatePerKWh.toFixed(2)} / kWh</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Net Cumulative Bill (Estimate):</span>
                <div className={`text-base font-bold mt-0.5 ${estimatedNetEnergyCostUSD > 0 ? 'text-[#FB7185]' : 'text-[#10B981]'}`}>
                  {tariff.currencySymbol}{estimatedNetEnergyCostUSD.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Electrical Protection & Validation Log */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FB7185]" />
              <span>4. Electrical Protection & Inverter Health Status</span>
            </h3>

            {validationWarnings.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#14231B] border border-[#2ECC71]/30 text-xs font-mono text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2ECC71] shrink-0" />
                <span>All electrical constraints satisfied: Inverter load within nameplate, zero breaker tripping hazard, battery reserve preserved.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {validationWarnings.map((warn) => (
                  <div key={warn.id} className="p-3.5 rounded-xl bg-[#181216] border border-[#E11D48]/40 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-[#FB7185] font-mono">
                      <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
                      <span>{warn.title}</span>
                    </div>
                    <p className="text-slate-300">{warn.description}</p>
                    <div className="text-[11px] text-slate-400 pt-1 font-mono">
                      <span className="text-emerald-400 font-semibold">Mitigation: </span>
                      {warn.correctiveAction}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-[#202735] bg-[#0E1218] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-mono">
            {simulationLog.length} time-series interval snapshots recorded.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#1A1F27] hover:bg-[#232936] border border-[#2A313E] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 transition-colors flex items-center gap-2 shadow-md shadow-emerald-950/30"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Download CSV Time-Series</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
