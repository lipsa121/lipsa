import React, { useState } from 'react';
import { ArrowDown, Activity, Zap, ShieldCheck, BatteryCharging, SunMedium, Building2, Car } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHowItWorksClick,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>('bess');

  // Node details for the interactive electrical smart-grid model
  const nodes = [
    {
      id: 'substation',
      name: 'Grid Substation',
      type: 'Primary Infeed',
      voltage: '11 kV / 415 V',
      currentLoad: '280 kW',
      state: 'Normal',
      accent: '#BE123C', // Crimson red for primary utility infeed
    },
    {
      id: 'solar',
      name: 'Rooftop Solar PV',
      type: 'Distributed Gen',
      voltage: '415 V 3-Phase',
      currentLoad: '+65 kW (Gen)',
      state: 'Exporting',
      accent: '#2ECC71', // Forest green
    },
    {
      id: 'bess',
      name: 'BESS Battery Unit',
      type: '150 kWh Storage',
      voltage: '480 V DC/AC',
      currentLoad: '45 kW (Discharge)',
      state: 'Peak Shaving',
      accent: '#1B5E3F', // Deep Forest green
    },
    {
      id: 'hvac',
      name: 'Central Chillers',
      type: 'Thermal Storage',
      voltage: '415 V 3-Phase',
      currentLoad: '120 kW (Pre-cooled)',
      state: 'Scheduled',
      accent: '#38A169', // Forest green medium
    },
    {
      id: 'ev',
      name: 'EV Depot Hub',
      type: 'Fleet Fast Charging',
      voltage: '415 V 3-Phase',
      currentLoad: '35 kW (Curtailed)',
      state: 'Deferred',
      accent: '#E11D48', // Crimson red for deferred load
    },
  ];

  const selectedNodeData = nodes.find((n) => n.id === activeNode) || nodes[2];

  return (
    <section id="overview" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-grid-pattern bg-[#101317]">
      {/* Ambient lighting: Forest green upper aura, deep charcoal field, subtle crimson floor glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1B5E3F]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-[#BE123C]/6 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow Label: Forest Green & Crimson Accents */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2ECC71] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
              <span>AI-Powered Energy Intelligence</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Demand-Side Management</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Predict Demand.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] via-[#A7F3D0] to-white">
                Balance Loads.
              </span>{' '}
              Power Smarter.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              An intelligent load management platform that forecasts electricity demand
              and recommends smarter scheduling of flexible electrical loads before peak
              demand becomes a problem.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] active:bg-[#154C32] border border-[#2D936C]/40 rounded-md transition-all shadow-md hover:shadow-[0_0_25px_rgba(39,174,96,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71]"
              >
                Explore the Platform
              </button>

              <button
                onClick={onHowItWorksClick}
                className="px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-[#181B22] hover:bg-[#212630] border border-[#2A313E] rounded-md transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>See How It Works</span>
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Academic Context Line */}
            <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#2ECC71] shrink-0" />
              <span>Built for intelligent energy management</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">Electrical Engineering Project</span>
            </div>
          </div>

          {/* Right Column: Charcoal & Forest Green Smart-Grid Centerpiece */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl border border-[#252B35] bg-[#14181F]/90 backdrop-blur-xl p-5 md:p-6 shadow-2xl shadow-black/80">
              {/* Telemetry header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#252B35]">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-[#18261F] border border-[#2D936C]/30 text-[#2ECC71]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-white tracking-wide">
                      Microgrid Bus Topology
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Illustrative feeder model · 415V distribution bus
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-[#2ECC71] tabular-nums">
                    384.6 kW <span className="text-slate-400">/</span> <span className="text-[#FB7185]">450 kW</span>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Demand Ceiling: 85.5%
                  </div>
                </div>
              </div>

              {/* Interactive Smart Grid Flow SVG */}
              <div className="relative my-4 aspect-[16/10] bg-[#0E1115] rounded-lg border border-[#20252F] overflow-hidden flex items-center justify-center p-2">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 540 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="forestFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1B5E3F" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="crimsonFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#BE123C" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Electrical feeder busbar (Main Central Bus) */}
                  <line
                    x1="120"
                    y1="160"
                    x2="440"
                    y2="160"
                    stroke="#232934"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="120"
                    y1="160"
                    x2="440"
                    y2="160"
                    stroke="#1B5E3F"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />

                  {/* Flow branch: Grid Substation to Central Bus (Crimson) */}
                  <path
                    d="M 60 70 L 160 70 L 160 160"
                    stroke="#2D1A22"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 70 L 160 70 L 160 160"
                    stroke="#BE123C"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    strokeDashoffset="28"
                  />

                  {/* Flow branch: Solar PV to Central Bus (Forest Green) */}
                  <path
                    d="M 60 250 L 160 250 L 160 160"
                    stroke="#192A22"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 250 L 160 250 L 160 160"
                    stroke="#2ECC71"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />

                  {/* Flow branch: Central Bus to BESS Unit (Forest Green) */}
                  <path
                    d="M 280 160 L 280 60 L 360 60"
                    stroke="#192A22"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 280 160 L 280 60 L 360 60"
                    stroke="#38A169"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />

                  {/* Flow branch: Central Bus to HVAC Chillers */}
                  <path
                    d="M 370 160 L 460 160"
                    stroke="#1F2630"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 370 160 L 460 160"
                    stroke="#2ECC71"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />

                  {/* Flow branch: Central Bus to EV Fleet Depot (Crimson Deferred path) */}
                  <path
                    d="M 310 160 L 310 250 L 390 250"
                    stroke="#2D1A22"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 310 160 L 310 250 L 390 250"
                    stroke="#E11D48"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                  />

                  {/* NODE 1: Grid Infeed (Substation - Crimson Red Accent) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveNode('substation')}
                  >
                    <rect
                      x="20"
                      y="45"
                      width="80"
                      height="50"
                      rx="6"
                      fill="#161920"
                      stroke={activeNode === 'substation' ? '#BE123C' : '#2C3442'}
                      strokeWidth={activeNode === 'substation' ? '2' : '1'}
                    />
                    <circle cx="38" cy="70" r="10" fill="#3B0C15" />
                    <text x="38" y="74" textAnchor="middle" fill="#FB7185" fontSize="10" fontWeight="bold">G</text>
                    <text x="60" y="65" fill="#F1F5F9" fontSize="10" fontWeight="600">Grid Feed</text>
                    <text x="60" y="79" fill="#FB7185" fontSize="8" fontFamily="monospace">280 kW</text>
                  </g>

                  {/* NODE 2: Solar PV Array (Forest Green) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveNode('solar')}
                  >
                    <rect
                      x="20"
                      y="225"
                      width="80"
                      height="50"
                      rx="6"
                      fill="#161920"
                      stroke={activeNode === 'solar' ? '#2ECC71' : '#2C3442'}
                      strokeWidth={activeNode === 'solar' ? '2' : '1'}
                    />
                    <circle cx="38" cy="250" r="10" fill="#143A27" />
                    <text x="38" y="254" textAnchor="middle" fill="#2ECC71" fontSize="10" fontWeight="bold">PV</text>
                    <text x="60" y="245" fill="#F1F5F9" fontSize="10" fontWeight="600">Solar PV</text>
                    <text x="60" y="259" fill="#2ECC71" fontSize="8" fontFamily="monospace">+65 kW</text>
                  </g>

                  {/* Central Bus Junction Indicator */}
                  <g>
                    <circle cx="280" cy="160" r="8" fill="#161A22" stroke="#1B5E3F" strokeWidth="2" />
                    <circle cx="280" cy="160" r="3" fill="#2ECC71" />
                    <text x="280" y="185" textAnchor="middle" fill="#8C98A9" fontSize="9" fontWeight="600">
                      415V MAIN BUS
                    </text>
                  </g>

                  {/* NODE 3: BESS Storage (Forest Green) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveNode('bess')}
                  >
                    <rect
                      x="360"
                      y="35"
                      width="96"
                      height="52"
                      rx="6"
                      fill="#161920"
                      stroke={activeNode === 'bess' ? '#2ECC71' : '#2C3442'}
                      strokeWidth={activeNode === 'bess' ? '2' : '1'}
                    />
                    <circle cx="380" cy="61" r="10" fill="#143A27" />
                    <text x="380" y="65" textAnchor="middle" fill="#2ECC71" fontSize="9" fontWeight="bold">BESS</text>
                    <text x="400" y="55" fill="#F1F5F9" fontSize="10" fontWeight="600">Battery</text>
                    <text x="400" y="69" fill="#2ECC71" fontSize="8" fontFamily="monospace">45 kW Disch.</text>
                  </g>

                  {/* NODE 4: HVAC Chillers */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveNode('hvac')}
                  >
                    <rect
                      x="450"
                      y="135"
                      width="80"
                      height="50"
                      rx="6"
                      fill="#161920"
                      stroke={activeNode === 'hvac' ? '#38A169' : '#2C3442'}
                      strokeWidth={activeNode === 'hvac' ? '2' : '1'}
                    />
                    <circle cx="468" cy="160" r="10" fill="#1B3828" />
                    <text x="468" y="164" textAnchor="middle" fill="#A7F3D0" fontSize="9" fontWeight="bold">AC</text>
                    <text x="488" y="154" fill="#F1F5F9" fontSize="10" fontWeight="600">Chillers</text>
                    <text x="488" y="168" fill="#94A3B8" fontSize="8" fontFamily="monospace">120 kW</text>
                  </g>

                  {/* NODE 5: EV Fleet Hub (Crimson Deferred) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveNode('ev')}
                  >
                    <rect
                      x="390"
                      y="225"
                      width="86"
                      height="50"
                      rx="6"
                      fill="#161920"
                      stroke={activeNode === 'ev' ? '#E11D48' : '#2C3442'}
                      strokeWidth={activeNode === 'ev' ? '2' : '1'}
                    />
                    <circle cx="410" cy="250" r="10" fill="#3B0C15" />
                    <text x="410" y="254" textAnchor="middle" fill="#FB7185" fontSize="9" fontWeight="bold">EV</text>
                    <text x="430" y="244" fill="#F1F5F9" fontSize="10" fontWeight="600">EV Fleet</text>
                    <text x="430" y="258" fill="#FB7185" fontSize="8" fontFamily="monospace">35 kW Shift</text>
                  </g>
                </svg>

                {/* Micro instruction hint */}
                <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                  Click any node to inspect electrical telemetry
                </div>
              </div>

              {/* Node Telemetry Inspector Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[#252B35]">
                <div className="bg-[#0E1115] rounded p-2.5 border border-[#20252F]">
                  <div className="text-[10px] text-slate-400">Selected Node</div>
                  <div className="text-xs font-semibold text-white truncate">{selectedNodeData.name}</div>
                </div>
                <div className="bg-[#0E1115] rounded p-2.5 border border-[#20252F]">
                  <div className="text-[10px] text-slate-400">Dispatch Status</div>
                  <div 
                    className="text-xs font-mono font-medium truncate"
                    style={{ color: selectedNodeData.accent }}
                  >
                    {selectedNodeData.state}
                  </div>
                </div>
                <div className="bg-[#0E1115] rounded p-2.5 border border-[#20252F]">
                  <div className="text-[10px] text-slate-400">Power Rating</div>
                  <div className="text-xs font-mono text-white truncate tabular-nums">{selectedNodeData.currentLoad}</div>
                </div>
                <div className="bg-[#0E1115] rounded p-2.5 border border-[#20252F]">
                  <div className="text-[10px] text-slate-400">Electrical Spec</div>
                  <div className="text-xs font-mono text-slate-300 truncate">{selectedNodeData.voltage}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
