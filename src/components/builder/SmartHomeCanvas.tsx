import React from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Sun, 
  Battery, 
  Zap, 
  Wind, 
  Fan, 
  Lightbulb, 
  Refrigerator, 
  Droplets, 
  Monitor, 
  Car, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface SmartHomeCanvasProps {
  onSelectComponent: (id: string) => void;
  selectedId: string | null;
}

export const SmartHomeCanvas: React.FC<SmartHomeCanvasProps> = ({
  onSelectComponent,
  selectedId,
}) => {
  const { state, metrics, toggleAppliance } = useEnergySimulation();

  const getAppliance = (id: string) => state.appliances.find((a) => a.id === id);
  const ac = getAppliance('ac');
  const fan = getAppliance('fan');
  const lights = getAppliance('lights');
  const fridge = getAppliance('refrigerator');
  const pump = getAppliance('pump');
  const computer = getAppliance('computer');
  const ev = getAppliance('ev');

  const isNight = state.timeOfDay === 'night';
  const isIslanded = !state.grid.isConnected;

  return (
    <div className="relative w-full rounded-2xl border border-[#252B35] bg-[#0A0D11] overflow-hidden shadow-2xl select-none">
      {/* Sky & Atmospheric Ambient Lighting Backdrop */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
          isNight 
            ? 'bg-gradient-to-b from-[#06080A] via-[#0A0D12] to-[#10141A]' 
            : state.timeOfDay === 'evening'
            ? 'bg-gradient-to-b from-[#1C1217] via-[#161720] to-[#0E1116]'
            : 'bg-gradient-to-b from-[#0D151D] via-[#0E1217] to-[#101419]'
        }`}
      />

      {/* Sun / Moon celestial indicator in sky */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
        <div className={`p-2 rounded-xl border backdrop-blur-md flex items-center gap-2 text-xs font-mono ${
          isNight 
            ? 'bg-slate-900/80 border-slate-700 text-slate-300' 
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
        }`}>
          <Sun className={`w-4 h-4 ${isNight ? 'text-slate-400' : 'text-amber-400 animate-spin-slow'}`} />
          <span>
            {state.timeOfDay.toUpperCase()} · Sun Irradiance: {state.sunIrradiancePct}%
          </span>
        </div>

        {/* Islanded Microgrid Flag */}
        {isIslanded && (
          <div className="px-2.5 py-1.5 rounded-xl border border-amber-500/50 bg-amber-950/60 text-amber-300 text-xs font-mono flex items-center gap-1.5 shadow-md animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>ISLANDED MICROGRID MODE</span>
          </div>
        )}
      </div>

      {/* Main Interactive House SVG Stage */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[480px] lg:min-h-[580px]">
        <svg
          viewBox="0 0 960 620"
          className="w-full h-auto max-h-[640px] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="solarGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>

            <linearGradient id="solarActiveGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B5E3F" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#161B23" />
              <stop offset="100%" stopColor="#0E1217" />
            </linearGradient>

            <linearGradient id="roomFloorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C212B" />
              <stop offset="100%" stopColor="#141820" />
            </linearGradient>

            <linearGradient id="coolAirFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* =================================================================
              1. GROUND & ENVIRONMENT
              ================================================================= */}
          <rect x="20" y="520" width="920" height="85" rx="12" fill="#0C0F14" stroke="#1E242E" strokeWidth="2" />
          <line x1="20" y1="520" x2="940" y2="520" stroke="#2D936C" strokeWidth="2" strokeOpacity="0.3" />

          {/* Driveway slab on right */}
          <polygon points="680,520 910,520 930,590 660,590" fill="#141820" stroke="#222834" strokeWidth="1.5" />

          {/* =================================================================
              2. HOUSE MAIN STRUCTURE (Cutaway Architectural Silhouette)
              ================================================================= */}
          {/* Main House Outer Frame */}
          <polygon
            points="180,240 480,100 780,240 780,520 180,520"
            fill="url(#wallGradient)"
            stroke="#252C38"
            strokeWidth="3"
          />

          {/* Roof Ridge & Fascia */}
          <polygon points="160,245 480,90 800,245 770,255 480,115 190,255" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />

          {/* Attic Divider Line */}
          <line x1="180" y1="240" x2="780" y2="240" stroke="#202632" strokeWidth="2" />

          {/* First / Second Floor Divider Line */}
          <line x1="180" y1="380" x2="680" y2="380" stroke="#202632" strokeWidth="2" />

          {/* Internal Room Dividing Walls */}
          {/* Left Vertical Wall: Bedroom 2 upstairs, Living room downstairs */}
          <line x1="430" y1="240" x2="430" y2="520" stroke="#202632" strokeWidth="2" />

          {/* Garage Dividing Wall on Right */}
          <line x1="680" y1="240" x2="680" y2="520" stroke="#202632" strokeWidth="2" />

          {/* =================================================================
              3. ROOFTOP SOLAR PV SYSTEM
              ================================================================= */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectComponent('solar')}
          >
            {/* Solar Panel Array on Left Roof Pitch */}
            <polygon
              points="240,225 450,130 460,145 250,240"
              fill={metrics.solarGenerationW > 0 ? 'url(#solarActiveGlow)' : 'url(#solarGlassGrad)'}
              stroke={selectedId === 'solar' ? '#2ECC71' : '#3B82F6'}
              strokeWidth={selectedId === 'solar' ? '3' : '1.5'}
              filter={selectedId === 'solar' ? 'url(#glowFilter)' : undefined}
            />

            {/* Solar Panel Array on Right Roof Pitch */}
            <polygon
              points="510,130 720,225 710,240 500,145"
              fill={metrics.solarGenerationW > 0 ? 'url(#solarActiveGlow)' : 'url(#solarGlassGrad)'}
              stroke={selectedId === 'solar' ? '#2ECC71' : '#3B82F6'}
              strokeWidth={selectedId === 'solar' ? '3' : '1.5'}
              filter={selectedId === 'solar' ? 'url(#glowFilter)' : undefined}
            />

            {/* Grid Pattern on Solar Panels */}
            <line x1="310" y1="195" x2="320" y2="210" stroke="#475569" strokeWidth="1" />
            <line x1="380" y1="165" x2="390" y2="180" stroke="#475569" strokeWidth="1" />
            <line x1="580" y1="165" x2="570" y2="180" stroke="#475569" strokeWidth="1" />
            <line x1="650" y1="195" x2="640" y2="210" stroke="#475569" strokeWidth="1" />

            {/* Solar Hotspot Badge */}
            <rect x="420" y="80" width="120" height="28" rx="6" fill="#0E1217" stroke="#2ECC71" strokeWidth="1.5" />
            <text x="480" y="98" textAnchor="middle" fill="#2ECC71" fontSize="11" fontWeight="bold" fontFamily="monospace">
              SOLAR: {metrics.solarGenerationW} W
            </text>
          </g>

          {/* =================================================================
              4. ATTIC / POWER ROOM (Smart Inverter & BESS Battery)
              ================================================================= */}
          {/* Smart Hybrid Inverter */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectComponent('inverter')}
          >
            <rect
              x="320"
              y="160"
              width="60"
              height="65"
              rx="6"
              fill="#121720"
              stroke={selectedId === 'inverter' ? '#2ECC71' : metrics.isInverterOverloaded ? '#E11D48' : '#334155'}
              strokeWidth={selectedId === 'inverter' ? '2.5' : '1.5'}
            />
            {/* Inverter Display */}
            <rect x="330" y="170" width="40" height="20" rx="3" fill="#090D12" />
            <text x="350" y="184" textAnchor="middle" fill={metrics.isInverterOverloaded ? '#FB7185' : '#2ECC71'} fontSize="8" fontFamily="monospace" fontWeight="bold">
              {metrics.inverterLoadW}W
            </text>
            <circle cx="340" cy="205" r="3" fill={metrics.isInverterOverloaded ? '#E11D48' : '#2ECC71'} />
            <circle cx="350" cy="205" r="3" fill="#06B6D4" />
            <circle cx="360" cy="205" r="3" fill="#64748B" />
            <text x="350" y="235" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600">INVERTER</text>
          </g>

          {/* BESS Battery Storage Unit */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectComponent('battery')}
          >
            <rect
              x="570"
              y="155"
              width="65"
              height="70"
              rx="6"
              fill="#121720"
              stroke={selectedId === 'battery' ? '#2ECC71' : '#334155'}
              strokeWidth={selectedId === 'battery' ? '2.5' : '1.5'}
            />
            {/* Battery Cells Fill Gauge */}
            <rect x="580" y="165" width="45" height="40" rx="4" fill="#0A0E13" stroke="#202632" />
            <rect
              x="582"
              y={203 - (36 * (state.battery.stateOfChargePct / 100))}
              width="41"
              height={36 * (state.battery.stateOfChargePct / 100)}
              rx="2"
              fill={state.battery.stateOfChargePct <= state.battery.minStateOfChargePct ? '#E11D48' : '#2ECC71'}
            />
            <text x="602" y="190" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {state.battery.stateOfChargePct}%
            </text>
            <text x="602" y="235" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600">BESS 8kWh</text>
          </g>

          {/* =================================================================
              5. UPPER LEVEL ROOMS
              ================================================================= */}
          {/* Room A (Top Left): Master Bedroom / Climate (Air Conditioner) */}
          <g>
            <rect x="195" y="250" width="225" height="120" rx="6" fill="#11151C" stroke="#1F2633" />
            <text x="210" y="270" fill="#64748B" fontSize="10" fontWeight="bold">BEDROOM</text>

            {/* Air Conditioner Unit */}
            {ac && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('ac');
                  toggleAppliance('ac');
                }}
              >
                <rect
                  x="220"
                  y="280"
                  width="75"
                  height="30"
                  rx="4"
                  fill="#1E2530"
                  stroke={selectedId === 'ac' ? '#2ECC71' : ac.isOn ? '#06B6D4' : '#334155'}
                  strokeWidth={selectedId === 'ac' ? '2' : '1'}
                />
                <circle cx="230" cy="295" r="3" fill={ac.isOn ? '#06B6D4' : '#64748B'} />
                <line x1="240" y1="295" x2="280" y2="295" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
                <text x="257" y="291" fill="#E2E8F0" fontSize="8" fontWeight="600">A/C UNIT</text>

                {/* Animated airflow waves when AC is ON */}
                {ac.isOn && (
                  <path
                    d="M 230 315 Q 240 330 250 315 T 270 315"
                    stroke="#06B6D4"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                )}

                <text x="257" y="325" fill={ac.isOn ? '#38BDF8' : '#64748B'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {ac.isOn ? `${ac.wattage} W (ON)` : 'OFF'}
                </text>
              </g>
            )}

            {/* Bed graphic */}
            <rect x="330" y="310" width="70" height="45" rx="4" fill="#1A202C" stroke="#2D3748" />
            <rect x="335" y="315" width="25" height="15" rx="2" fill="#2D3748" />
          </g>

          {/* Room B (Top Center): Kitchen & Food Prep (Refrigerator) */}
          <g>
            <rect x="440" y="250" width="230" height="120" rx="6" fill="#11151C" stroke="#1F2633" />
            <text x="455" y="270" fill="#64748B" fontSize="10" fontWeight="bold">KITCHEN</text>

            {/* Refrigerator */}
            {fridge && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('refrigerator');
                  toggleAppliance('refrigerator');
                }}
              >
                <rect
                  x="460"
                  y="280"
                  width="40"
                  height="75"
                  rx="4"
                  fill="#181F2A"
                  stroke={selectedId === 'refrigerator' ? '#2ECC71' : fridge.isOn ? '#2ECC71' : '#334155'}
                  strokeWidth={selectedId === 'refrigerator' ? '2' : '1'}
                />
                <line x1="460" y1="310" x2="500" y2="310" stroke="#334155" strokeWidth="1.5" />
                <rect x="465" y="295" width="3" height="8" rx="1" fill="#94A3B8" />
                <rect x="465" y="325" width="3" height="12" rx="1" fill="#94A3B8" />

                <text x="480" y="367" textAnchor="middle" fill={fridge.isOn ? '#2ECC71' : '#64748B'} fontSize="8" fontFamily="monospace" fontWeight="bold">
                  {fridge.isOn ? `${fridge.wattage} W` : 'OFF'}
                </text>
              </g>
            )}

            {/* Countertops */}
            <rect x="520" y="320" width="135" height="35" rx="3" fill="#1A202C" stroke="#2D3748" />
            <circle cx="550" cy="335" r="7" stroke="#475569" strokeWidth="1.5" />
            <circle cx="580" cy="335" r="7" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* =================================================================
              6. LOWER LEVEL ROOMS
              ================================================================= */}
          {/* Room C (Bottom Left): Living Room & Study (Lights, Fan, Computer) */}
          <g>
            <rect x="195" y="390" width="225" height="120" rx="6" fill="#11151C" stroke="#1F2633" />
            <text x="210" y="410" fill="#64748B" fontSize="10" fontWeight="bold">LIVING & STUDY</text>

            {/* Ceiling Lights Fixture */}
            {lights && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('lights');
                  toggleAppliance('lights');
                }}
              >
                <circle
                  cx="240"
                  cy="405"
                  r="8"
                  fill={lights.isOn ? '#FEF08A' : '#334155'}
                  stroke={selectedId === 'lights' ? '#2ECC71' : '#EAB308'}
                  strokeWidth="1.5"
                  filter={lights.isOn ? 'url(#glowFilter)' : undefined}
                />
                <text x="240" y="425" textAnchor="middle" fill={lights.isOn ? '#FEF08A' : '#64748B'} fontSize="8" fontFamily="monospace">
                  {lights.isOn ? `${lights.wattage}W` : 'OFF'}
                </text>
              </g>
            )}

            {/* Ceiling Fan */}
            {fan && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('fan');
                  toggleAppliance('fan');
                }}
              >
                <circle cx="310" cy="405" r="5" fill="#1E293B" stroke="#64748B" />
                <line
                  x1="295"
                  y1="405"
                  x2="325"
                  y2="405"
                  stroke={fan.isOn ? '#2ECC71' : '#475569'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={fan.isOn ? 'origin-center animate-spin-slow' : ''}
                />
                <text x="310" y="425" textAnchor="middle" fill={fan.isOn ? '#2ECC71' : '#64748B'} fontSize="8" fontFamily="monospace">
                  {fan.isOn ? `${fan.wattage}W` : 'OFF'}
                </text>
              </g>
            )}

            {/* Workstation Computer */}
            {computer && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('computer');
                  toggleAppliance('computer');
                }}
              >
                {/* Desk */}
                <rect x="350" y="460" width="55" height="40" fill="#1E2530" stroke="#334155" />
                {/* Monitor */}
                <rect
                  x="360"
                  y="435"
                  width="35"
                  height="22"
                  rx="2"
                  fill={computer.isOn ? '#0284C7' : '#0F172A'}
                  stroke={selectedId === 'computer' ? '#2ECC71' : '#38BDF8'}
                  strokeWidth="1"
                />
                <text x="377" y="475" textAnchor="middle" fill={computer.isOn ? '#38BDF8' : '#64748B'} fontSize="8" fontFamily="monospace">
                  {computer.isOn ? `${computer.wattage}W` : 'OFF'}
                </text>
              </g>
            )}
          </g>

          {/* Room D (Bottom Center): Utility & Pump Room (Water Pump) */}
          <g>
            <rect x="440" y="390" width="230" height="120" rx="6" fill="#11151C" stroke="#1F2633" />
            <text x="455" y="410" fill="#64748B" fontSize="10" fontWeight="bold">UTILITY ROOM</text>

            {/* Water Booster Pump */}
            {pump && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('pump');
                  toggleAppliance('pump');
                }}
              >
                <circle
                  cx="540"
                  cy="450"
                  r="24"
                  fill="#18202C"
                  stroke={selectedId === 'pump' ? '#2ECC71' : pump.isOn ? '#06B6D4' : '#334155'}
                  strokeWidth={selectedId === 'pump' ? '2.5' : '1.5'}
                />
                <path d="M 525 450 L 555 450 M 540 435 L 540 465" stroke="#475569" strokeWidth="2" />
                {/* Pipe flow */}
                <path d="M 500 450 L 516 450" stroke="#06B6D4" strokeWidth="6" strokeLinecap="round" />
                <path d="M 564 450 L 590 450" stroke="#06B6D4" strokeWidth="6" strokeLinecap="round" />

                <text x="540" y="490" textAnchor="middle" fill={pump.isOn ? '#22D3EE' : '#64748B'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  PUMP: {pump.isOn ? `${pump.wattage} W (ON)` : 'OFF'}
                </text>
              </g>
            )}
          </g>

          {/* =================================================================
              7. GARAGE & EV CHARGER (Room E - Right Side)
              ================================================================= */}
          <g>
            <rect x="680" y="250" width="220" height="260" rx="6" fill="#11151C" stroke="#1F2633" />
            <text x="695" y="275" fill="#64748B" fontSize="10" fontWeight="bold">GARAGE & CHARGING</text>

            {/* Level-2 Wallbox EV Charger */}
            {ev && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  onSelectComponent('ev');
                  toggleAppliance('ev');
                }}
              >
                <rect
                  x="705"
                  y="300"
                  width="45"
                  height="65"
                  rx="6"
                  fill="#1A202C"
                  stroke={selectedId === 'ev' ? '#2ECC71' : ev.isOn ? '#2ECC71' : '#334155'}
                  strokeWidth={selectedId === 'ev' ? '2.5' : '1.5'}
                />
                <circle cx="727" cy="320" r="10" fill="#0D1117" stroke={ev.isOn ? '#2ECC71' : '#475569'} strokeWidth="2" />
                <text x="727" y="324" textAnchor="middle" fill={ev.isOn ? '#2ECC71' : '#64748B'} fontSize="8" fontWeight="bold">EV</text>
                {/* Charging cord */}
                <path
                  d="M 727 365 Q 730 400 760 410"
                  stroke={ev.isOn ? '#2ECC71' : '#475569'}
                  strokeWidth="3"
                  fill="none"
                />
                <text x="727" y="380" textAnchor="middle" fill={ev.isOn ? '#2ECC71' : '#64748B'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {ev.isOn ? `${ev.wattage} W` : 'READY'}
                </text>
              </g>
            )}

            {/* Electric Vehicle (EV) Car Silhouette */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectComponent('ev')}
            >
              {/* Car Body */}
              <polygon
                points="760,420 780,390 850,390 880,420 890,460 750,460"
                fill="#161E28"
                stroke={selectedId === 'ev' ? '#2ECC71' : '#334155'}
                strokeWidth="2"
              />
              {/* Windows */}
              <polygon points="785,395 845,395 865,420 775,420" fill="#0C131D" stroke="#253243" />
              {/* Wheels */}
              <circle cx="775" cy="460" r="16" fill="#0B0E14" stroke="#475569" strokeWidth="4" />
              <circle cx="865" cy="460" r="16" fill="#0B0E14" stroke="#475569" strokeWidth="4" />
              {/* Car Battery Gauge */}
              <rect x="795" y="430" width="45" height="15" rx="3" fill="#0A0E13" stroke="#2D936C" strokeWidth="1" />
              <rect x="797" y="432" width={41 * (state.evCharger.currentSoCPct / 100)} height="11" rx="2" fill="#2ECC71" />
              <text x="817" y="442" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
                {state.evCharger.currentSoCPct}%
              </text>
            </g>
          </g>

          {/* =================================================================
              8. UTILITY GRID CONNECTION POLE (Left Margin)
              ================================================================= */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectComponent('grid')}
          >
            {/* Pole */}
            <line x1="70" y1="180" x2="70" y2="520" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            {/* Crossbar */}
            <line x1="40" y1="210" x2="100" y2="210" stroke="#475569" strokeWidth="4" />
            <circle cx="50" cy="210" r="5" fill="#334155" />
            <circle cx="90" cy="210" r="5" fill="#334155" />

            {/* Smart Meter Box */}
            <rect
              x="50"
              y="380"
              width="40"
              height="50"
              rx="4"
              fill="#161B22"
              stroke={selectedId === 'grid' ? '#2ECC71' : isIslanded ? '#E11D48' : '#334155'}
              strokeWidth={selectedId === 'grid' ? '2.5' : '1.5'}
            />
            <rect x="55" y="390" width="30" height="15" fill="#0A0E13" rx="2" />
            <text x="70" y="401" textAnchor="middle" fill={isIslanded ? '#FB7185' : '#2ECC71'} fontSize="8" fontFamily="monospace" fontWeight="bold">
              {isIslanded ? 'OFF' : `${Math.abs(metrics.effectiveNetGridW)}W`}
            </text>

            {/* Feeder Power Line from Pole to Inverter */}
            {!isIslanded && (
              <path
                d="M 70 210 Q 180 250 320 180"
                stroke={metrics.gridExportW > 0 ? '#2ECC71' : '#E11D48'}
                strokeWidth="2.5"
                strokeDasharray="6 4"
                fill="none"
              />
            )}

            <text x="70" y="445" textAnchor="middle" fill={isIslanded ? '#FB7185' : '#E2E8F0'} fontSize="9" fontWeight="bold">
              {isIslanded ? 'DISCONNECTED' : 'GRID FEED'}
            </text>
          </g>
        </svg>
      </div>

      {/* Micro Legend & Interactive Tip Bar */}
      <div className="p-3 border-t border-[#20252F] bg-[#0E1116] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]" /> Generation / Self-Supplied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" /> Grid Import / Overload
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Flexible Thermal Load
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          💡 Click any component or appliance in the house to configure its electrical parameters
        </div>
      </div>
    </div>
  );
};
