import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  TrendingDown, 
  Zap, 
  Sun, 
  Battery, 
  AlertTriangle,
  Flame,
  Scale,
  Sparkles
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { PreconfiguredScenarioId } from '../../types/simulation';

export const ScenariosView: React.FC = () => {
  const { 
    allScenarios, 
    activeScenarioId, 
    loadScenario, 
    clearScenario, 
    metrics, 
    state 
  } = useEnergySimulation();

  const selectedScenario = allScenarios.find((s) => s.id === activeScenarioId) || allScenarios[0];

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#222731]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pre-Configured Engineering Scenarios & Benchmarks
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 font-semibold uppercase">
              Step 5
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Stress-test the LoadPilot AI electrical energy balance model across 7 standardized engineering conditions. Compare unmanaged baseline profiles with automated constraint-aware scheduling.
          </p>
        </div>

        {activeScenarioId && (
          <button
            onClick={clearScenario}
            className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#1A1F27] hover:bg-[#232936] border border-[#2A313E] rounded-lg transition-colors"
          >
            Clear Active Scenario
          </button>
        )}
      </div>

      {/* 7 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {allScenarios.map((sc) => {
          const isActive = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => loadScenario(sc.id)}
              className={`text-left rounded-xl p-4 transition-all cursor-pointer border flex flex-col justify-between ${
                isActive
                  ? 'bg-[#14231B] border-[#2ECC71] shadow-lg shadow-emerald-950/20 ring-1 ring-[#2ECC71]'
                  : 'bg-[#14181F] hover:bg-[#181D26] border-[#222731] hover:border-[#2D936C]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                    style={{
                      backgroundColor: `${sc.badgeColor}20`,
                      color: sc.badgeColor,
                      border: `1px solid ${sc.badgeColor}40`,
                    }}
                  >
                    {sc.badge}
                  </span>

                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#2ECC71] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mt-2 tracking-tight">
                  {sc.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {sc.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#1F2531] flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Solar: {sc.conditions.solarKW}kW · Battery: {sc.conditions.batterySoCPct}%
                </span>
                <span className="text-[#2ECC71] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{isActive ? 'Active' : 'Apply'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Selected Scenario Benchmark Inspector */}
      {selectedScenario && (
        <div className="rounded-2xl border border-[#252D3B] bg-[#12161E] p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202735]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                  style={{
                    backgroundColor: `${selectedScenario.badgeColor}20`,
                    color: selectedScenario.badgeColor,
                    border: `1px solid ${selectedScenario.badgeColor}40`,
                  }}
                >
                  {selectedScenario.badge}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {selectedScenario.name}
                </h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {selectedScenario.description}
              </p>
            </div>

            <button
              onClick={() => loadScenario(selectedScenario.id)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-lg transition-all flex items-center gap-2 shadow-md shrink-0 self-start md:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{activeScenarioId === selectedScenario.id ? 'Re-Apply Scenario' : 'Run Scenario in Simulator'}</span>
            </button>
          </div>

          {/* Before vs After Optimization Delta Analysis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#2ECC71]" />
                <span>Before vs. After Optimization Benchmark Delta</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Derived from 24h simulation horizon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Before (Unmanaged Baseline) */}
              <div className="rounded-xl border border-[#BE123C]/30 bg-[#161014] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FB7185] font-mono uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                    <span>Before (Unmanaged Baseline)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Random/Simultaneous</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0E0C0F] border border-[#2A1820]">
                    <span className="text-[10px] text-slate-400">Peak Demand:</span>
                    <div className="text-base font-bold text-[#FB7185] mt-0.5">
                      {selectedScenario.beforeOptimization.peakLoadKW.toFixed(2)} kW
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0E0C0F] border border-[#2A1820]">
                    <span className="text-[10px] text-slate-400">Grid Import:</span>
                    <div className="text-base font-bold text-slate-200 mt-0.5">
                      {selectedScenario.beforeOptimization.gridImportKWh.toFixed(1)} kWh
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0E0C0F] border border-[#2A1820]">
                    <span className="text-[10px] text-slate-400">Solar Self-Consumption:</span>
                    <div className="text-base font-bold text-slate-200 mt-0.5">
                      {selectedScenario.beforeOptimization.solarSelfConsumptionPct}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0E0C0F] border border-[#2A1820]">
                    <span className="text-[10px] text-slate-400">Est. Daily Bill:</span>
                    <div className="text-base font-bold text-[#FB7185] mt-0.5">
                      ${selectedScenario.beforeOptimization.estimatedCostUSD.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: After (LoadPilot AI Automated Optimization) */}
              <div className="rounded-xl border border-[#2ECC71]/30 bg-[#121E17] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2ECC71] font-mono uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                    <span>After (LoadPilot AI Optimized)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 font-semibold">Constraint-Aware</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0C1510] border border-[#1A3324]">
                    <span className="text-[10px] text-slate-400">Shaved Peak Demand:</span>
                    <div className="text-base font-bold text-[#2ECC71] mt-0.5 flex items-center justify-between">
                      <span>{selectedScenario.afterOptimization.peakLoadKW.toFixed(2)} kW</span>
                      {(selectedScenario.afterOptimization.peakReductionPct ?? 0) > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2ECC71]/30">
                          -{(selectedScenario.afterOptimization.peakReductionPct ?? 0).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0C1510] border border-[#1A3324]">
                    <span className="text-[10px] text-slate-400">Optimized Grid Import:</span>
                    <div className="text-base font-bold text-slate-200 mt-0.5">
                      {selectedScenario.afterOptimization.gridImportKWh.toFixed(1)} kWh
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0C1510] border border-[#1A3324]">
                    <span className="text-[10px] text-slate-400">Solar Self-Consumption:</span>
                    <div className="text-base font-bold text-[#2ECC71] mt-0.5">
                      {selectedScenario.afterOptimization.solarSelfConsumptionPct}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0C1510] border border-[#1A3324]">
                    <span className="text-[10px] text-slate-400">Est. Daily Bill:</span>
                    <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-center justify-between">
                      <span>${selectedScenario.afterOptimization.estimatedCostUSD.toFixed(2)}</span>
                      {(selectedScenario.afterOptimization.savingsPct ?? 0) > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2ECC71]/30">
                          -{(selectedScenario.afterOptimization.savingsPct ?? 0).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight & Engineering Correction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-[#1E2532] text-xs">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#1F2633] space-y-1">
              <span className="font-bold text-slate-200 font-mono text-[11px] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span>Physical & Behavioral Insight</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedScenario.keyInsight}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#1F2633] space-y-1">
              <span className="font-bold text-slate-200 font-mono text-[11px] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span>Recommended Engineering Mitigation</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedScenario.correctiveActionRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
