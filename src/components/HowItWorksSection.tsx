import React, { useState } from 'react';
import { Database, BrainCircuit, Cpu, BarChart3, ChevronRight, Layers, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: 'Historical Load Data',
      subtitle: 'Data Acquisition & Cleansing',
      icon: Database,
      tag: 'Step 01',
      description: 'Ingests 15-minute smart meter intervals, ambient temperature logs, production shifts, and contractual maximum demand limits.',
      technicalDetails: {
        inputs: '15-min Active Power (kW), Reactive Power (kVAR), Ambient Temp (°C)',
        output: 'Cleaned, normalized multivariate time-series matrix',
        algorithm: 'Outlier rejection via Z-score & seasonal median imputation',
      },
    },
    {
      id: 2,
      title: 'Demand Forecast',
      subtitle: 'Predictive Modeling',
      icon: BrainCircuit,
      tag: 'Step 02',
      description: 'Synthesizes cyclical weekly patterns, weather sensitivity, and baselines to estimate next-day unconstrained electrical load demand.',
      technicalDetails: {
        inputs: '24-hour ahead weather forecast + historical seasonality',
        output: 'Probabilistic 24h demand trajectory [kW(t)] with bounds',
        algorithm: 'Ensemble Auto-Regressive + Gradient Boosted Trees',
      },
    },
    {
      id: 3,
      title: 'Scheduling Optimizer',
      subtitle: 'Constraint Solver',
      icon: Cpu,
      tag: 'Step 03',
      description: 'Dispatches flexible loads, schedules pre-cooling windows, and manages battery charge/discharge to keep aggregate demand below capacity.',
      technicalDetails: {
        inputs: 'Demand forecast, peak limit (450 kW), load flexibility bounds',
        output: 'Optimal load state schedule {P_i(t)} for all flexible assets',
        algorithm: 'Mixed-Integer Linear Programming (MILP) solver',
      },
    },
    {
      id: 4,
      title: 'Simulation Results',
      subtitle: 'Validation & Telemetry',
      icon: BarChart3,
      tag: 'Step 04',
      description: 'Outputs before-and-after load profiles, peak shaving margins, avoided capacity penalties, and electrical power factor stability metrics.',
      technicalDetails: {
        inputs: 'Simulated dispatch schedule versus baseline unmanaged profile',
        output: 'Final load duration curve, peak shaving delta (-24%), savings report',
        algorithm: 'Grid stability verification & tariff cost calculation',
      },
    },
  ];

  const currentStep = steps.find((s) => s.id === selectedStep) || steps[0];

  return (
    <section id="process" className="py-20 md:py-28 bg-[#0D1013] border-t border-b border-[#222731] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2ECC71] uppercase mb-3">
            <span>Algorithmic Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            How LoadPilot AI Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            A 4-step deterministic and machine learning pipeline that transforms raw electrical consumption logs into actionable load shifting commands.
          </p>
        </div>

        {/* Process Diagram: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedStep === step.id;
            return (
              <div key={step.id} className="relative group">
                <button
                  onClick={() => setSelectedStep(step.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all h-full flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#151921] border-[#2ECC71] shadow-[0_0_25px_rgba(27,94,63,0.25)] ring-1 ring-[#2ECC71]/30'
                      : 'bg-[#12151B] border-[#20252F] hover:border-[#2C3442] hover:bg-[#151921]/60'
                  }`}
                >
                  <div>
                    {/* Step label & icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-semibold text-[#2ECC71]">
                        {step.tag}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#1B5E3F] text-emerald-200'
                            : 'bg-[#1A1F27] text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{step.subtitle}</p>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#20252F] flex items-center justify-between text-[11px] text-[#2ECC71] font-medium">
                    <span>{isSelected ? 'Viewing Specs' : 'Click to inspect'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Connector Arrow for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#161B23] border border-[#262C38] items-center justify-center text-slate-400 pointer-events-none">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Step Technical Details Drawer */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/95 p-6 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#252B35] gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#16291F] border border-[#2D936C]/30 text-[#2ECC71]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Technical Specifications · {currentStep.title} ({currentStep.tag})
                </h4>
                <p className="text-xs text-slate-400">
                  Engineering formulation and runtime constraints
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-[#2ECC71] bg-[#16291F] px-2.5 py-1 rounded border border-[#2D936C]/30 self-start sm:self-auto">
              Pipeline Stage {currentStep.id} of 4
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            <div className="bg-[#0E1115] p-4 rounded-lg border border-[#20252F] space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Data Inputs</div>
              <div className="text-xs text-slate-200 font-medium">{currentStep.technicalDetails.inputs}</div>
            </div>

            <div className="bg-[#0E1115] p-4 rounded-lg border border-[#20252F] space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Methodology / Formulation</div>
              <div className="text-xs text-[#2ECC71] font-mono font-medium">{currentStep.technicalDetails.algorithm}</div>
            </div>

            <div className="bg-[#0E1115] p-4 rounded-lg border border-[#20252F] space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Pipeline Output</div>
              <div className="text-xs text-emerald-200 font-medium">{currentStep.technicalDetails.output}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
