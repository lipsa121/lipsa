import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  GitBranch, 
  Terminal, 
  Layers, 
  Zap, 
  Activity,
  HardDrive
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#222731]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Methodology, Engineering Formulations & Physical Limitations
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 font-semibold uppercase">
            Documentation
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Comprehensive documentation of mathematical models, engineering assumptions, state equations, and required physical hardware integrations for future production deployment.
        </p>
      </div>

      {/* Prominent Educational Boundary Notice */}
      <div className="rounded-xl border border-[#BE123C]/50 bg-[#3B0C15]/70 p-4 text-xs text-rose-200/90 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#FB7185] uppercase tracking-wide font-mono text-[11px]">
            Academic Prototype Scope & Operational Boundaries
          </div>
          <p className="leading-relaxed text-slate-300">
            LoadPilot AI is designed and implemented as an electrical engineering undergraduate capstone prototype. The software executes deterministic discrete-time equations. It is not approved for direct electrical service breaker control or mission-critical hospital/life-support loads without certified hardware fail-safes (UL 1741 / IEEE 1547 compliant contactors).
          </p>
        </div>
      </div>

      {/* Section 1: Mathematical State Equations */}
      <div className="rounded-2xl border border-[#18202A] bg-[#0D1117] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D2419] border border-[#10B981]/40 text-[#10B981] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              1. Mathematical State & Power Balance Equations
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Enforcing Kirchhoff's Current Law (KCL) at the Point of Common Coupling (PCC)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Formula 1: Energy Balance */}
          <div className="p-4 rounded-xl bg-[#07090C] border border-[#18202A] space-y-2">
            <span className="text-[#10B981] font-bold text-[11px] uppercase">
              Eq. 1 — Point of Common Coupling Power Equilibrium
            </span>
            <div className="p-2.5 rounded bg-[#0A0D12] border border-[#1C2634] text-emerald-300 overflow-x-auto">
              P_load + P_grid_exp + P_batt_chg = P_solar_AC + P_grid_imp + P_batt_dis
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              At every discrete simulation increment, total power drawn by loads, grid export, and battery charging strictly balances against AC solar generation, utility import, and battery discharge.
            </p>
          </div>

          {/* Formula 2: Inverter DC/AC Model */}
          <div className="p-4 rounded-xl bg-[#07090C] border border-[#18202A] space-y-2">
            <span className="text-[#10B981] font-bold text-[11px] uppercase">
              Eq. 2 — Inverter Efficiency & Conversion Loss
            </span>
            <div className="p-2.5 rounded bg-[#0A0D12] border border-[#1C2634] text-[#10B981] overflow-x-auto">
              P_solar_AC = min(P_inv_rated, P_solar_DC · η_inv)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Accounts for solid-state semiconductor IGBT losses (configured nominal efficiency: 96%) and clipping of peak DC power when array generation exceeds the inverter nameplate rating.
            </p>
          </div>

          {/* Formula 3: Diurnal Irradiance Arc */}
          <div className="p-4 rounded-xl bg-[#07090C] border border-[#18202A] space-y-2">
            <span className="text-[#10B981] font-bold text-[11px] uppercase">
              Eq. 3 — Diurnal Solar Irradiance Curve
            </span>
            <div className="p-2.5 rounded bg-[#0A0D12] border border-[#1C2634] text-[#10B981] overflow-x-auto">
              I(t) = max(0, sin(π · (t - 5.75) / 13.5))^1.25
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Simulates clear-sky solar elevation and atmospheric optical air mass between 05:45 (sunrise) and 19:15 (sunset), peaking symmetrically at 12:30 PM.
            </p>
          </div>

          {/* Formula 4: Battery SoC Integration */}
          <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] space-y-2">
            <span className="text-[#2ECC71] font-bold text-[11px] uppercase">
              Eq. 4 — Discrete Battery State-of-Charge Dynamics
            </span>
            <div className="p-2.5 rounded bg-[#131922] border border-[#253040] text-rose-300 overflow-x-auto">
              SoC(t+Δt) = SoC(t) + [P_chg · η_chg - P_dis / η_dis] · Δt / C_batt
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Computes Coulombic accumulation with asymmetric 95% charge/discharge round-trip efficiency, clamping state within the 0% to 100% boundary and enforcing the 15% reserve cutoff floor.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Real Physical Deployment Requirements */}
      <div className="rounded-2xl border border-[#252D3B] bg-[#12161E] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B5E3F] text-emerald-200 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              2. Physical Grid Integration & Hardware Deployment Roadmap
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Requirements for transitioning from software prototype to commercial physical installation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 font-mono">
              <HardDrive className="w-4 h-4 text-[#2ECC71]" />
              <span>Current Transformers (CTs)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Requires physical split-core 100A/200A CT clamps on main service feeders (L1/L2) and dedicated sub-circuits to provide real-time true-RMS current measurements at 100ms sampling rates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 font-mono">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Modbus / SunSpec Protocols</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Industrial RS485 / Ethernet Modbus TCP communications with hybrid inverter and battery BMS registers to poll voltage, frequency, active/reactive power, and transmit curtailment setpoints.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>UL 1741 / IEEE 1547 Switchgear</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mandatory automatic transfer switch (ATS) and certified anti-islanding relay to physically disconnect from the utility grid in under 16ms during distribution line outages to protect utility workers.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Engineering Assumptions & Software Boundaries */}
      <div className="rounded-2xl border border-[#252D3B] bg-[#12161E] p-5 sm:p-6 shadow-xl space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2ECC71]" />
          <span>3. Software Simulation Assumptions & Simplifications</span>
        </h2>

        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Pure Active Power Modeling:</strong> Loads and generators are modeled in Watts (W) and Kilowatts (kW), assuming unity power factor (cos φ = 1.0). Reactive power (VAR) and harmonic distortion (THD) are simplified for prototype clarity.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Fixed Ambient Cell Temperature:</strong> Solar photovoltaic cell derating operates at standard test conditions (25°C). Thermal runaway and seasonal azimuth angles are approximated by the calibrated diurnal factor.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Linear Battery Voltage Plateau:</strong> Battery capacity is tracked via integral energy accumulation without Peukert effect or temperature-dependent electrolyte freezing resistance.
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Final Engineering Review & Architectural Taxonomy (Step 6) */}
      <div className="rounded-2xl border border-[#2D936C]/40 bg-[#12161E] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B5E3F] text-emerald-200 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              4. Final Engineering Review & Component Taxonomy
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Transparent demarcation between deterministic mathematics, heuristic algorithms, and synthetic datasets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: Implemented Calculations */}
          <div className="p-4 rounded-xl bg-[#0B0E13] border border-[#1E2532] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-[#2ECC71] font-mono text-[11px] uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Calculations</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Fully implemented mathematical equations evaluated synchronously on every state transition:
              </p>
              <ul className="mt-2.5 space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2ECC71] font-mono">•</span>
                  <span><strong>KCL Nodal Balance:</strong> ΣP_in = ΣP_out verified continuously at the busbar.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2ECC71] font-mono">•</span>
                  <span><strong>Diurnal Solar Curve:</strong> 24h astronomical sun elevation & clear-sky irradiance.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2ECC71] font-mono">•</span>
                  <span><strong>Battery Coulombic Tracking:</strong> Integral ΔSoC integration with round-trip efficiency loss.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2ECC71] font-mono">•</span>
                  <span><strong>Inverter Sizing & Limits:</strong> Dynamic headroom and safety margin clipping.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#1C2330] text-[10px] font-mono text-emerald-400">
              Status: Verified by 28 automated unit tests
            </div>
          </div>

          {/* Column 2: Baseline Algorithmic Models */}
          <div className="p-4 rounded-xl bg-[#07090C] border border-[#18202A] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-[#10B981] font-mono text-[11px] uppercase">
                <Activity className="w-4 h-4" />
                <span>Algorithmic Optimization</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Baseline algorithmic solutions designed for student research & evaluation:
              </p>
              <ul className="mt-2.5 space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#10B981] font-mono">•</span>
                  <span><strong>Demand Forecasting:</strong> Moving-average statistical time-series with temperature derating.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#10B981] font-mono">•</span>
                  <span><strong>Smart Scheduling:</strong> Constraint-aware greedy heuristic shifting loads to low-tariff solar hours.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#10B981] font-mono">•</span>
                  <span><strong>Peak Shaving:</strong> Prevents coincident high draws (e.g. EV + HVAC) exceeding feeder threshold.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#18202A] text-[10px] font-mono text-[#10B981]">
              Status: Algorithmic Simulation (Rule-Based)
            </div>
          </div>

          {/* Column 3: Simulated Synthetic Datasets */}
          <div className="p-4 rounded-xl bg-[#07090C] border border-[#18202A] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-[#FB7185] font-mono text-[11px] uppercase">
                <HardDrive className="w-4 h-4" />
                <span>Synthetic Datasets</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Academic college prototype datasets clearly labeled to prevent misleading claims:
              </p>
              <ul className="mt-2.5 space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FB7185] font-mono">•</span>
                  <span><strong>Historical Traces:</strong> Synthetic 24h & 7-day residential load profiles calibrated to IEEE test feeders.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FB7185] font-mono">•</span>
                  <span><strong>Tariff Schedules:</strong> Representative 3-tier Time-Of-Use pricing ($0.08, $0.22, $0.38/kWh).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FB7185] font-mono">•</span>
                  <span><strong>No Live Hardware:</strong> Does not connect to live utility meters or physical switchgear.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#18202A] text-[10px] font-mono text-[#FB7185]">
              Status: Simulated Academic Data Only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
