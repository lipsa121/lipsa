import React, { useState } from 'react';
import { LineChart, Clock, TrendingUp, Sliders, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [controlMode, setControlMode] = useState<'reactive' | 'predictive'>('predictive');

  const stages = [
    {
      step: '01',
      title: 'Monitor',
      badge: 'Real-Time Acquisition',
      description: 'Capture high-resolution 15-minute electrical feeder telemetry, baseline historical consumption, and power quality indices across industrial and commercial sub-circuits.',
      icon: LineChart,
      metricLabel: 'Telemetry Resolution',
      metricVal: '15-min intervals',
    },
    {
      step: '02',
      title: 'Predict',
      badge: 'Time-Series Forecasting',
      description: 'Estimate upcoming 24-hour demand curves using historical load profiles, day-ahead operational schedules, ambient temperatures, and weather heuristics.',
      icon: TrendingUp,
      metricLabel: 'Forecast Horizon',
      metricVal: '24–48 Hours',
    },
    {
      step: '03',
      title: 'Optimize',
      badge: 'Dynamic Scheduling',
      description: 'Recommend precision schedules for flexible, deferrable loads (chillers, BESS, EV depots) to flatten peak curves and avoid contracted capacity breaches.',
      icon: Sliders,
      metricLabel: 'Peak Demand Reduction',
      metricVal: 'Up to 24.8%',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#0D1013] border-t border-b border-[#222731] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2ECC71] uppercase mb-3">
            <span>Grid Transition Paradigm</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            From Reactive Monitoring to Predictive Control
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Traditional facilities react to peak demand only after expensive thresholds
            are breached. LoadPilot AI anticipates load surges hours ahead and pre-empts them.
          </p>
        </div>

        {/* 3 Stages Horizontal/Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer rounded-xl p-6 transition-all border ${
                  isSelected
                    ? 'bg-[#151921] border-[#2D936C] shadow-[0_0_25px_rgba(27,94,63,0.2)]'
                    : 'bg-[#12151B] border-[#20252F] hover:border-[#2C3442] hover:bg-[#151921]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#2ECC71]">
                    STAGE {stage.step}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/40'
                        : 'bg-[#1A1F27] text-slate-400 border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {stage.description}
                </p>

                <div className="pt-4 border-t border-[#222832] flex items-center justify-between text-xs">
                  <span className="text-slate-400">{stage.metricLabel}</span>
                  <span className="font-mono font-semibold text-[#2ECC71]">
                    {stage.metricVal}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Comparison Visualizer */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Feeder Load Profile Comparison</span>
                <span className="text-xs text-slate-400 font-normal">
                  (Simulated 24-Hour Cycle)
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toggle below to evaluate unmanaged grid spikes versus AI-scheduled load smoothing.
              </p>
            </div>

            {/* Interactive Mode Toggle */}
            <div className="flex items-center bg-[#0E1115] p-1 rounded-lg border border-[#222731]">
              <button
                onClick={() => setControlMode('reactive')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  controlMode === 'reactive'
                    ? 'bg-[#881326]/40 text-[#FB7185] border border-[#BE123C]/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reactive (Unmanaged)
              </button>
              <button
                onClick={() => setControlMode('predictive')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  controlMode === 'predictive'
                    ? 'bg-[#1B5E3F]/40 text-[#A7F3D0] border border-[#2D936C]/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Predictive (LoadPilot AI)
              </button>
            </div>
          </div>

          {/* Load Curve SVG Chart */}
          <div className="mt-6">
            <div className="h-64 sm:h-72 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" fill="none">
                {/* Horizontal gridlines */}
                <line x1="40" y1="30" x2="780" y2="30" stroke="#1F2530" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="780" y2="80" stroke="#1F2530" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="780" y2="130" stroke="#1F2530" strokeDasharray="3 3" />
                <line x1="40" y1="180" x2="780" y2="180" stroke="#1F2530" strokeDasharray="3 3" />
                <line x1="40" y1="210" x2="780" y2="210" stroke="#2B3340" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="32" y="34" fill="#8C98A9" fontSize="10" fontFamily="monospace" textAnchor="end">500 kW</text>
                <text x="32" y="84" fill="#8C98A9" fontSize="10" fontFamily="monospace" textAnchor="end">400 kW</text>
                <text x="32" y="134" fill="#8C98A9" fontSize="10" fontFamily="monospace" textAnchor="end">300 kW</text>
                <text x="32" y="184" fill="#8C98A9" fontSize="10" fontFamily="monospace" textAnchor="end">200 kW</text>

                {/* Configured Capacity Limit Ceiling Line (Crimson Red: 450 kW) */}
                <line
                  x1="40"
                  y1="55"
                  x2="780"
                  y2="55"
                  stroke="#E11D48"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <text
                  x="770"
                  y="48"
                  fill="#FB7185"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  CONTRACT LIMIT: 450 kW
                </text>

                {/* Peak Danger Zone Shading for Reactive Mode (Crimson) */}
                {controlMode === 'reactive' && (
                  <path
                    d="M 460 55 L 480 35 L 530 20 L 580 40 L 610 55 Z"
                    fill="rgba(225, 29, 72, 0.28)"
                  />
                )}

                {/* Time Axis Labels */}
                <text x="40" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">00:00</text>
                <text x="160" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">04:00</text>
                <text x="280" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">08:00</text>
                <text x="400" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">12:00</text>
                <text x="520" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">16:00 (Peak)</text>
                <text x="640" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">20:00</text>
                <text x="760" y="228" fill="#6A778B" fontSize="10" fontFamily="monospace">24:00</text>

                {/* Reactive Curve (Crimson spike above 450 kW) */}
                {controlMode === 'reactive' ? (
                  <>
                    <path
                      d="M 40 185 Q 120 180 180 170 T 300 120 T 400 95 T 520 20 T 620 90 T 700 150 T 780 180"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 40 185 Q 120 180 180 170 T 300 120 T 400 95 T 520 20 T 620 90 T 700 150 T 780 180 L 780 210 L 40 210 Z"
                      fill="url(#reactiveGrad)"
                      opacity="0.3"
                    />
                    {/* Spike annotation pin */}
                    <circle cx="520" cy="20" r="5" fill="#E11D48" />
                    <text x="520" y="10" fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle">
                      518 kW (PENALTY SPIKE)
                    </text>
                  </>
                ) : (
                  /* Predictive Curve (Forest Green smooth curve, safely under 450 kW) */
                  <>
                    <path
                      d="M 40 180 Q 120 175 180 150 T 300 115 T 400 90 T 520 72 T 620 95 T 700 140 T 780 175"
                      fill="none"
                      stroke="#2ECC71"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 40 180 Q 120 175 180 150 T 300 115 T 400 90 T 520 72 T 620 95 T 700 140 T 780 175 L 780 210 L 40 210 Z"
                      fill="url(#predictiveGrad)"
                      opacity="0.25"
                    />
                    {/* Safe Peak annotation pin */}
                    <circle cx="520" cy="72" r="5" fill="#2ECC71" />
                    <text x="520" y="60" fill="#A7F3D0" fontSize="10" fontWeight="bold" textAnchor="middle">
                      392 kW (OPTIMIZED PEAK)
                    </text>
                  </>
                )}

                <defs>
                  <linearGradient id="reactiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="predictiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2ECC71" />
                    <stop offset="100%" stopColor="#1B5E3F" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Diagnostic readout below graph */}
            <div className="mt-4 pt-4 border-t border-[#252B35] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                {controlMode === 'reactive' ? (
                  <div className="flex items-center gap-2 text-[#FB7185] font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#E11D48]" />
                    <span>Threshold Exceeded: +68 kW surge beyond maximum contracted tariff</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#2ECC71] font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Peak Safely Shaved: -126 kW peak reduction · Zero contract breaches</span>
                  </div>
                )}
              </div>

              <div className="text-slate-400 text-[11px] font-mono">
                Illustrative 24h Feeder Load Simulation · Sample Dataset
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
