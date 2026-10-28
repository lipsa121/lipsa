import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  SlidersHorizontal, 
  Maximize2, 
  Clock, 
  Power, 
  BatteryCharging, 
  Thermometer, 
  Car, 
  Droplets,
  Layers,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface LoadItem {
  id: string;
  name: string;
  category: string;
  ratedPower: number; // in kW
  priority: 'High' | 'Flexible' | 'Deferrable' | 'Storage';
  status: 'Active' | 'Pre-Cooled' | 'Deferred' | 'Discharging' | 'Standby';
  shiftable: boolean;
  activeHourLoad: number; // current hour draw
}

export const DemoPreviewSection: React.FC = () => {
  // Configured capacity limit
  const capacityLimit = 450; // kW

  // Interactive selected hour for the 24h timeline (default 15 = 15:00, peak hour)
  const [selectedHour, setSelectedHour] = useState<number>(15);

  // Filter or view mode
  const [viewMode, setViewMode] = useState<'all' | 'flexible' | 'storage'>('all');

  // Virtual electrical loads roster
  const [loads, setLoads] = useState<LoadItem[]>([
    {
      id: 'load-1',
      name: 'HVAC Chiller Bank A & B',
      category: 'Thermal Conditioning',
      ratedPower: 120,
      priority: 'High',
      status: 'Pre-Cooled',
      shiftable: true,
      activeHourLoad: 92,
    },
    {
      id: 'load-2',
      name: 'Fleet EV Direct Fast Chargers (4x)',
      category: 'Fleet Logistics',
      ratedPower: 95,
      priority: 'Flexible',
      status: 'Deferred',
      shiftable: true,
      activeHourLoad: 25,
    },
    {
      id: 'load-3',
      name: 'Municipal Water Booster Pumps',
      category: 'Fluid Mechanics',
      ratedPower: 45,
      priority: 'Deferrable',
      status: 'Standby',
      shiftable: true,
      activeHourLoad: 0,
    },
    {
      id: 'load-4',
      name: '150 kWh / 75 kW BESS System',
      category: 'Battery Storage',
      ratedPower: 75,
      priority: 'Storage',
      status: 'Discharging',
      shiftable: true,
      activeHourLoad: -45, // negative indicates grid injection / peak shaving
    },
    {
      id: 'load-5',
      name: 'Industrial Precision Assembly Line',
      category: 'Critical Manufacturing',
      ratedPower: 160,
      priority: 'High',
      status: 'Active',
      shiftable: false,
      activeHourLoad: 155,
    },
    {
      id: 'load-6',
      name: 'Basement Ventilation Fans',
      category: 'Air Quality Safety',
      ratedPower: 30,
      priority: 'Flexible',
      status: 'Active',
      shiftable: true,
      activeHourLoad: 22,
    },
  ]);

  // Hourly profile simulation data across 24h
  const hourlyData = [
    { hour: '00:00', unmanaged: 180, scheduled: 195, hourNum: 0 },
    { hour: '02:00', unmanaged: 165, scheduled: 190, hourNum: 2 },
    { hour: '04:00', unmanaged: 160, scheduled: 210, hourNum: 4 }, // Valley filling
    { hour: '06:00', unmanaged: 210, scheduled: 230, hourNum: 6 },
    { hour: '08:00', unmanaged: 310, scheduled: 300, hourNum: 8 },
    { hour: '10:00', unmanaged: 360, scheduled: 345, hourNum: 10 },
    { hour: '12:00', unmanaged: 410, scheduled: 380, hourNum: 12 },
    { hour: '14:00', unmanaged: 480, scheduled: 395, hourNum: 14 }, // Critical start
    { hour: '15:00', unmanaged: 518, scheduled: 384, hourNum: 15 }, // Peak breach in unmanaged!
    { hour: '16:00', unmanaged: 495, scheduled: 390, hourNum: 16 },
    { hour: '17:00', unmanaged: 440, scheduled: 385, hourNum: 17 },
    { hour: '18:00', unmanaged: 380, scheduled: 370, hourNum: 18 },
    { hour: '20:00', unmanaged: 320, scheduled: 340, hourNum: 20 },
    { hour: '22:00', unmanaged: 240, scheduled: 270, hourNum: 22 },
  ];

  // Current hourly metrics for selected hour
  const currentSlot = hourlyData.find((d) => d.hourNum === selectedHour) || hourlyData[8];
  const currentSimulatedDemand = currentSlot.scheduled;
  const unmanagedDemand = currentSlot.unmanaged;
  const headroom = (capacityLimit - currentSimulatedDemand).toFixed(1);
  const capacityPct = ((currentSimulatedDemand / capacityLimit) * 100).toFixed(1);

  // Toggle load shift state
  const handleToggleLoad = (id: string) => {
    setLoads((prev) =>
      prev.map((load) => {
        if (load.id === id) {
          if (load.status === 'Deferred') {
            return { ...load, status: 'Active', activeHourLoad: load.ratedPower * 0.8 };
          } else if (load.status === 'Active' && load.shiftable) {
            return { ...load, status: 'Deferred', activeHourLoad: 0 };
          }
        }
        return load;
      })
    );
  };

  const filteredLoads = loads.filter((load) => {
    if (viewMode === 'flexible') return load.shiftable;
    if (viewMode === 'storage') return load.priority === 'Storage';
    return true;
  });

  return (
    <section id="simulation" className="py-20 md:py-28 bg-[#101317] relative overflow-hidden">
      {/* Background glow: Forest green top-center, Crimson subtle lower edge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-[#1B5E3F]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#BE123C]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2ECC71] uppercase mb-3">
            <span>Prototype Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Interactive Control Center Preview
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Explore the simulated dispatch environment. Inspect active feeder thresholds,
            flexible asset states, and the predictive 24-hour demand trajectory.
          </p>
        </div>

        {/* Dashboard Preview Shell */}
        <div className="rounded-xl border border-[#252B35] bg-[#14181F]/95 shadow-2xl shadow-black/90 overflow-hidden backdrop-blur-xl">
          {/* Top Control Bar with Peak Demand Alert */}
          <div className="p-4 sm:p-5 border-b border-[#252B35] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E1115]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#2ECC71]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Virtual Feeder Substation #04
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    · Industrial Feeder 415V
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Illustrative Simulation Mode · Electrical Engineering Capstone Prototype
                </div>
              </div>
            </div>

            {/* Peak Demand Warning Indicator Banner in Crimson Red */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#3B0C15]/80 border border-[#BE123C]/50 text-xs">
              <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
              <div className="text-[#FDA4AF] font-medium">
                Peak Window Anticipated: 14:00 – 17:30
                <span className="text-[#F43F5E] hidden sm:inline"> · Autonomous Load Shifting Active</span>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border-b border-[#252B35] bg-[#111419]">
            <div className="bg-[#151921] p-4 rounded-lg border border-[#222832]">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Current Simulated Demand</span>
                <Zap className="w-3.5 h-3.5 text-[#2ECC71]" />
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-white tabular-nums">
                {currentSimulatedDemand.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-[#2ECC71] mt-1 font-mono">
                Selected Hour: {currentSlot.hour}
              </div>
            </div>

            <div className="bg-[#151921] p-4 rounded-lg border border-[#222832]">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Configured Capacity Limit</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FB7185]" />
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-[#FB7185] tabular-nums">
                {capacityLimit.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Contracted Transformer Cap
              </div>
            </div>

            <div className="bg-[#151921] p-4 rounded-lg border border-[#222832]">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Safety Headroom</span>
                <CheckCircle className="w-3.5 h-3.5 text-[#2ECC71]" />
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-[#2ECC71] tabular-nums">
                +{headroom} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-emerald-300 mt-1">
                Utilization: {capacityPct}%
              </div>
            </div>

            <div className="bg-[#151921] p-4 rounded-lg border border-[#222832]">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Peak Shaving Delta</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-200" />
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-200 tabular-nums">
                -{(unmanagedDemand - currentSimulatedDemand).toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                Avoided Peak Exceedance
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout: 24h Chart on Left, Virtual Loads on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6">
            {/* Left 7 Columns: 24h Demand Curve with Interactive Hour Scrubber */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>24-Hour Predictive Demand Trajectory</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click along the timeline below to inspect feeder load at any hour
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-[#FB7185]">
                    <span className="w-2.5 h-0.5 bg-[#E11D48] rounded-full" /> Unmanaged
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2ECC71]">
                    <span className="w-2.5 h-0.5 bg-[#2ECC71] rounded-full" /> LoadPilot
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-0.5 border-t border-dashed border-[#E11D48]" /> Limit (450kW)
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="h-64 sm:h-72 w-full bg-[#0E1115] rounded-lg border border-[#20252F] p-3 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" fill="none">
                  {/* Grid lines */}
                  <line x1="30" y1="20" x2="680" y2="20" stroke="#1F2530" strokeDasharray="3 3" />
                  <line x1="30" y1="65" x2="680" y2="65" stroke="#1F2530" strokeDasharray="3 3" />
                  <line x1="30" y1="110" x2="680" y2="110" stroke="#1F2530" strokeDasharray="3 3" />
                  <line x1="30" y1="155" x2="680" y2="155" stroke="#1F2530" strokeDasharray="3 3" />
                  <line x1="30" y1="190" x2="680" y2="190" stroke="#2B3340" />

                  {/* Y Axis */}
                  <text x="24" y="24" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">550</text>
                  <text x="24" y="69" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">450</text>
                  <text x="24" y="114" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">350</text>
                  <text x="24" y="159" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">250</text>

                  {/* 450 kW Capacity Line (Crimson) */}
                  <line x1="30" y1="65" x2="680" y2="65" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="5 3" />

                  {/* Unmanaged Curve (Crimson Red line) */}
                  <path
                    d="M 40 170 Q 100 175 160 160 T 260 110 T 360 80 T 450 30 T 520 80 T 600 130 T 670 155"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Scheduled Curve (Forest Green line) */}
                  <path
                    d="M 40 165 Q 100 160 160 145 T 260 115 T 360 90 T 450 85 T 520 88 T 600 115 T 670 145"
                    fill="none"
                    stroke="#2ECC71"
                    strokeWidth="3"
                  />

                  {/* Scheduled Fill */}
                  <path
                    d="M 40 165 Q 100 160 160 145 T 260 115 T 360 90 T 450 85 T 520 88 T 600 115 T 670 145 L 670 190 L 40 190 Z"
                    fill="url(#dashboardFillGrad)"
                    opacity="0.18"
                  />

                  {/* Time ticks and interactive click columns */}
                  {hourlyData.map((d, index) => {
                    const xPos = 40 + (index * (630 / (hourlyData.length - 1)));
                    const isSelected = d.hourNum === selectedHour;
                    return (
                      <g key={d.hour} className="cursor-pointer" onClick={() => setSelectedHour(d.hourNum)}>
                        <line
                          x1={xPos}
                          y1="20"
                          x2={xPos}
                          y2="190"
                          stroke={isSelected ? '#2ECC71' : 'transparent'}
                          strokeWidth="1.5"
                          strokeDasharray={isSelected ? '2 2' : 'none'}
                        />
                        {isSelected && (
                          <circle cx={xPos} cy="85" r="5" fill="#2ECC71" />
                        )}
                        <text
                          x={xPos}
                          y="205"
                          fill={isSelected ? '#2ECC71' : '#6A778B'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          textAnchor="middle"
                        >
                          {d.hour.slice(0, 2)}h
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="dashboardFillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2ECC71" />
                      <stop offset="100%" stopColor="#1B5E3F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Scrubber slider bar */}
              <div className="flex items-center gap-4 bg-[#0E1115] p-3 rounded-lg border border-[#20252F]">
                <span className="text-xs text-slate-400 whitespace-nowrap">Timeline Scrubber:</span>
                <input
                  type="range"
                  min="0"
                  max="22"
                  step="2"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  className="w-full accent-[#2ECC71] cursor-pointer"
                />
                <span className="font-mono text-xs font-semibold text-[#2ECC71] whitespace-nowrap">
                  {selectedHour.toString().padStart(2, '0')}:00 hrs
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Virtual Electrical Loads Roster */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Connected Electrical Loads</h4>
                  <p className="text-xs text-slate-400">Live dispatch status & flexibility</p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center bg-[#0E1115] p-1 rounded border border-[#20252F] text-[11px]">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-2 py-0.5 rounded transition-colors ${viewMode === 'all' ? 'bg-[#1C212B] text-white' : 'text-slate-400'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setViewMode('flexible')}
                    className={`px-2 py-0.5 rounded transition-colors ${viewMode === 'flexible' ? 'bg-[#1C212B] text-white' : 'text-slate-400'}`}
                  >
                    Flexible
                  </button>
                  <button
                    onClick={() => setViewMode('storage')}
                    className={`px-2 py-0.5 rounded transition-colors ${viewMode === 'storage' ? 'bg-[#1C212B] text-white' : 'text-slate-400'}`}
                  >
                    Storage
                  </button>
                </div>
              </div>

              {/* Loads List */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredLoads.map((load) => (
                  <div
                    key={load.id}
                    className="p-3 rounded-lg bg-[#0E1115] border border-[#20252F] hover:border-[#2C3442] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-white">{load.name}</div>
                        <div className="text-[10px] text-slate-400">{load.category} · Rated {load.ratedPower} kW</div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          load.status === 'Discharging'
                            ? 'bg-[#1B5E3F] text-emerald-100 border-[#2ECC71]/40'
                            : load.status === 'Pre-Cooled'
                            ? 'bg-[#16291F] text-[#A7F3D0] border-[#2D936C]/40'
                            : load.status === 'Deferred'
                            ? 'bg-[#3B0C15] text-[#FB7185] border-[#BE123C]/50'
                            : 'bg-[#181D26] text-slate-300 border-[#252C38]'
                        }`}
                      >
                        {load.status}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1C222C] flex items-center justify-between text-xs">
                      <div className="text-slate-400 text-[11px]">
                        Hourly Draw: <span className="font-mono text-white font-medium">{load.activeHourLoad} kW</span>
                      </div>

                      {load.shiftable && (
                        <button
                          onClick={() => handleToggleLoad(load.id)}
                          className="text-[10px] font-medium text-[#2ECC71] hover:text-[#A7F3D0] flex items-center gap-1 focus-visible:outline-none"
                        >
                          <Power className="w-3 h-3" />
                          <span>Toggle Shift</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-300 p-2.5 rounded bg-[#0E1115] border border-[#20252F] flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#2ECC71] shrink-0" />
                <span>Simulated demonstration feeder. Interactive controls, solar-storage balance, and AI scheduling are live in the Dashboard.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
