import React, { useState } from 'react';
import { TrendingUp, CalendarClock, Gauge, SplitSquareVertical, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  // Simulation scenario state for panel D
  const [simulationScenario, setSimulationScenario] = useState<'standard' | 'heatwave' | 'ev_rush'>('heatwave');

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-[#101317] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2ECC71] uppercase mb-3">
            <span>Engineering Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Intelligent Load Management Capabilities
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Engineered specifically to solve the electrical grid challenges of peak demand,
            equipment thermal saturation, and tariff penalization through intelligent scheduling.
          </p>
        </div>

        {/* 4 Capability Cards in a 2x2 Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: Demand Forecasting */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#2D936C]/40 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#2ECC71] uppercase">
                  Capability A
                </span>
                <div className="w-8 h-8 rounded bg-[#16291F] border border-[#2D936C]/30 flex items-center justify-center text-[#2ECC71]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Demand Forecasting</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Evaluates historical feeder consumption alongside ambient temperature and production cycles to generate day-ahead demand projections with 95% confidence intervals.
              </p>

              {/* Visual Preview Box */}
              <div className="bg-[#0E1115] rounded-lg p-4 border border-[#20252F] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" /> Historical Demand
                    </span>
                    <span className="flex items-center gap-1.5 text-[#2ECC71]">
                      <span className="w-2.5 h-0.5 bg-[#2ECC71] rounded-full" /> Projected Forecast
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Sample Demo Profile</span>
                </div>

                {/* SVG Curve Comparison */}
                <div className="h-28 w-full">
                  <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#1F2530" strokeDasharray="2 2" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#1F2530" strokeDasharray="2 2" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#1F2530" strokeDasharray="2 2" />
                    
                    {/* Historical Baseline Line (dashed gray) */}
                    <path
                      d="M 0 70 Q 50 65 100 55 T 200 45 T 300 35 T 400 40"
                      stroke="#64748B"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />

                    {/* Forecast Line (solid Forest Green) */}
                    <path
                      d="M 0 72 Q 60 70 120 50 T 220 30 T 320 25 T 400 38"
                      stroke="#2ECC71"
                      strokeWidth="2.5"
                    />

                    {/* Confidence band */}
                    <path
                      d="M 0 68 Q 60 65 120 44 T 220 24 T 320 18 T 400 32 L 400 44 T 320 32 T 220 36 T 120 56 Q 60 76 0 76 Z"
                      fill="#1B5E3F"
                      opacity="0.2"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#20252F] text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Baseline Peak</span>
                    <span className="font-mono text-slate-200 font-semibold tabular-nums">412 kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Forecast Peak</span>
                    <span className="font-mono text-[#2ECC71] font-semibold tabular-nums">386 kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Confidence (CI)</span>
                    <span className="font-mono text-emerald-300 font-semibold tabular-nums">±3.8%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222832] flex items-center justify-between text-xs text-slate-400">
              <span>Time-Series Algorithm</span>
              <span className="text-slate-300 font-medium">Auto-Regressive + Exogenous ML</span>
            </div>
          </div>

          {/* Card B: Smart Load Scheduling */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#2D936C]/40 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#2ECC71] uppercase">
                  Capability B
                </span>
                <div className="w-8 h-8 rounded bg-[#16291F] border border-[#2D936C]/30 flex items-center justify-center text-[#2ECC71]">
                  <CalendarClock className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Smart Load Scheduling</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Ranks connected loads by operational priority, temperature dead-bands, and process elasticity to shift non-critical consumption to low-tariff and solar hours.
              </p>

              {/* Visual Preview Box */}
              <div className="bg-[#0E1115] rounded-lg p-4 border border-[#20252F] space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-[#20252F]">
                  <span className="text-slate-400">Flexible Load Schedule</span>
                  <span className="text-[10px] text-slate-400 font-mono">Illustrative Demo</span>
                </div>

                {/* Priority Rows with Crimson and Forest accents */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-[#161B23] border border-[#222832]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                      <span className="text-slate-200 font-medium">EV Fleet Charging Hub</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 line-through">14:00 - 17:00</span>
                      <span className="text-[10px] font-mono font-semibold text-[#FB7185] bg-[#3B0C15]/70 px-2 py-0.5 rounded border border-[#BE123C]/40">
                        Shifted → 19:30
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#161B23] border border-[#222832]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                      <span className="text-slate-200 font-medium">Cold Storage Pre-Cooling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">11:00 - 13:30</span>
                      <span className="text-[10px] font-mono font-semibold text-[#A7F3D0] bg-[#143A27]/70 px-2 py-0.5 rounded border border-[#2D936C]/40">
                        Pre-Cool Active
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#161B23] border border-[#222832]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                      <span className="text-slate-200 font-medium">Municipal Booster Pumps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 line-through">15:00 - 16:30</span>
                      <span className="text-[10px] font-mono font-semibold text-[#FB7185] bg-[#3B0C15]/70 px-2 py-0.5 rounded border border-[#BE123C]/40">
                        Deferred → 22:00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222832] flex items-center justify-between text-xs text-slate-400">
              <span>Optimization Method</span>
              <span className="text-slate-300 font-medium">Mixed-Integer Linear Dispatch</span>
            </div>
          </div>

          {/* Card C: Peak Load Analysis (Crimson Red Accents) */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#BE123C]/40 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#E11D48] uppercase">
                  Capability C
                </span>
                <div className="w-8 h-8 rounded bg-[#3B0C15] border border-[#BE123C]/40 flex items-center justify-center text-[#FB7185]">
                  <Gauge className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Peak Load Analysis</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Monitors real-time and day-ahead margins against contracted transformer ratings, issuing proactive warnings before exceeding maximum demand tiers.
              </p>

              {/* Visual Preview Box */}
              <div className="bg-[#0E1115] rounded-lg p-4 border border-[#20252F] space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Contracted Maximum Demand</span>
                  <span className="font-mono text-[#FB7185] font-semibold tabular-nums">450.0 kW</span>
                </div>

                {/* Progress bar comparison */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Unmanaged Peak Projected</span>
                    <span className="text-[#FB7185] font-mono font-medium">518 kW (115.1% — Breach)</span>
                  </div>
                  <div className="h-2 w-full bg-[#1F2530] rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#E11D48] rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#2ECC71]">LoadPilot Scheduled Peak</span>
                    <span className="text-[#A7F3D0] font-mono font-medium">386 kW (85.7% — Safe)</span>
                  </div>
                  <div className="h-2 w-full bg-[#1F2530] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: '85.7%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#20252F] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Available Safety Headroom</span>
                  <span className="text-[#2ECC71] font-mono font-semibold">+64.0 kW Buffer</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222832] flex items-center justify-between text-xs text-slate-400">
              <span>Grid Safety Metric</span>
              <span className="text-slate-300 font-medium">Thermal & Tariff Protection</span>
            </div>
          </div>

          {/* Card D: What-If Simulation */}
          <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#2D936C]/40 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#2ECC71] uppercase">
                  Capability D
                </span>
                <div className="w-8 h-8 rounded bg-[#16291F] border border-[#2D936C]/30 flex items-center justify-center text-[#2ECC71]">
                  <SplitSquareVertical className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">What-If Simulation</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Test custom grid stress conditions and evaluate dynamic load responses prior to actual feeder execution.
              </p>

              {/* Scenario selector tabs */}
              <div className="flex items-center gap-1.5 mb-4 p-1 bg-[#0E1115] rounded-lg border border-[#20252F]">
                <button
                  onClick={() => setSimulationScenario('standard')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded transition-all whitespace-nowrap ${
                    simulationScenario === 'standard'
                      ? 'bg-[#1C212B] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Standard Day
                </button>
                <button
                  onClick={() => setSimulationScenario('heatwave')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded transition-all whitespace-nowrap ${
                    simulationScenario === 'heatwave'
                      ? 'bg-[#1B5E3F]/40 text-[#A7F3D0] border border-[#2D936C]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Summer Heatwave
                </button>
                <button
                  onClick={() => setSimulationScenario('ev_rush')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded transition-all whitespace-nowrap ${
                    simulationScenario === 'ev_rush'
                      ? 'bg-[#1C212B] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EV Fleet Surge
                </button>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-[#0E1115] rounded-lg p-4 border border-[#20252F] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scenario Dispatch Results</span>
                  <span className="text-[10px] text-slate-400 font-mono">Simulated Demo</span>
                </div>

                {simulationScenario === 'heatwave' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Ambient Temperature:</span>
                      <span className="font-mono text-[#FB7185]">38.5 °C (High Cooling Demand)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Mitigation Strategy:</span>
                      <span className="font-mono text-[#2ECC71]">Thermal Pre-cooling + 50kW BESS</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Peak Shaved:</span>
                      <span className="font-mono text-[#2ECC71] font-semibold">-84 kW (-17.9%)</span>
                    </div>
                  </div>
                )}

                {simulationScenario === 'standard' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Ambient Temperature:</span>
                      <span className="font-mono text-slate-300">24.0 °C (Nominal Base)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Mitigation Strategy:</span>
                      <span className="font-mono text-[#2ECC71]">Routine Tariff Optimization</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Tariff Cost Reduction:</span>
                      <span className="font-mono text-[#2ECC71] font-semibold">14.2% Daily Savings</span>
                    </div>
                  </div>
                )}

                {simulationScenario === 'ev_rush' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Concurrently Plugged:</span>
                      <span className="font-mono text-[#FB7185]">18 Commercial Fleet Vans</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Mitigation Strategy:</span>
                      <span className="font-mono text-[#2ECC71]">Staggered Interleaved Charging</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Peak Surge Avoided:</span>
                      <span className="font-mono text-[#2ECC71] font-semibold">-110 kW Flattened</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222832] flex items-center justify-between text-xs text-slate-400">
              <span>Simulation Engine</span>
              <span className="text-slate-300 font-medium">Deterministic Constraint Solver</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
