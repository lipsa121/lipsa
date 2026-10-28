import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { BarChart3, TrendingUp, Sun, Zap, Info } from 'lucide-react';

export const DashboardCharts: React.FC = () => {
  const { state, metrics } = useEnergySimulation();
  const [activeChartTab, setActiveChartTab] = useState<'profile' | 'solar_vs_load' | 'distribution'>('profile');

  // Simulated 24-hour diurnal profile dynamically scaled by current total active load
  const currentLoadW = metrics.totalHouseholdLoadW;
  const solarGenW = metrics.solarGenerationW;
  const capacityW = metrics.capacityLimitW;

  // 12 points representing 2-hour intervals from 00:00 to 22:00
  // Scaling factors model normal residential daily curves
  const diurnalFactors = [0.45, 0.40, 0.42, 0.55, 0.75, 0.90, 0.85, 1.0, 1.15, 1.05, 0.80, 0.60];
  const solarFactors = [0, 0, 0, 0.1, 0.55, 0.95, 1.0, 0.85, 0.40, 0.05, 0, 0];
  const timeLabels = ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];

  const hourlyPoints = timeLabels.map((time, idx) => {
    // Current operating point corresponds to 14:00 (peak afternoon window, idx 7)
    const factor = diurnalFactors[idx];
    const solarFactor = solarFactors[idx];
    const estimatedLoad = Math.round(currentLoadW * factor);
    const estimatedSolar = Math.round(solarGenW * solarFactor);
    return {
      time,
      load: estimatedLoad,
      solar: estimatedSolar,
      isCurrent: idx === 7, // 14:00 current active hour
    };
  });

  // Calculate appliance-level breakdown for currently active loads
  const activeAppliances = state.appliances.filter((a) => a.isOn);
  const totalActiveApplianceWatts = activeAppliances.reduce((sum, a) => sum + a.wattage, 0) || 1;

  return (
    <div className="rounded-xl border border-[#252B35] bg-[#14181F]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
      {/* Chart Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#252B35] gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Energy Telemetry & Analytical Charts</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time calculations from shared simulation state · Updates instantly with appliance toggles
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#0E1115] p-1 rounded-lg border border-[#20252F] text-xs">
          <button
            onClick={() => setActiveChartTab('profile')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'profile'
                ? 'bg-[#1B5E3F] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            24h Load Profile
          </button>
          <button
            onClick={() => setActiveChartTab('solar_vs_load')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'solar_vs_load'
                ? 'bg-[#1B5E3F] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Solar vs Demand
          </button>
          <button
            onClick={() => setActiveChartTab('distribution')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'distribution'
                ? 'bg-[#1B5E3F] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Appliance Breakdown
          </button>
        </div>
      </div>

      {/* TAB 1: 24h Load Profile */}
      {activeChartTab === 'profile' && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#2ECC71]">
                <span className="w-2.5 h-0.5 bg-[#2ECC71] rounded-full" /> Simulated Load Curve
              </span>
              <span className="flex items-center gap-1.5 text-[#FB7185]">
                <span className="w-2.5 h-0.5 border-t border-dashed border-[#E11D48]" /> Capacity Limit ({capacityW} W)
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Current Operating Point (14:00): <strong className="text-white">{currentLoadW} W</strong>
            </div>
          </div>

          <div className="h-64 w-full bg-[#0E1115] rounded-lg border border-[#20252F] p-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" fill="none">
              {/* Reference Grid lines */}
              <line x1="25" y1="20" x2="585" y2="20" stroke="#1F2530" strokeDasharray="3 3" />
              <line x1="25" y1="65" x2="585" y2="65" stroke="#1F2530" strokeDasharray="3 3" />
              <line x1="25" y1="110" x2="585" y2="110" stroke="#1F2530" strokeDasharray="3 3" />
              <line x1="25" y1="150" x2="585" y2="150" stroke="#2B3340" />

              {/* Y Axis reference */}
              <text x="20" y="24" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">4000W</text>
              <text x="20" y="69" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">3000W</text>
              <text x="20" y="114" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">1500W</text>
              <text x="20" y="154" fill="#6A778B" fontSize="9" fontFamily="monospace" textAnchor="end">0W</text>

              {/* Dynamic Capacity Line */}
              {(() => {
                // Map capacity 0-4500W to y=150 to y=15
                const capY = Math.max(15, Math.min(150, 150 - (capacityW / 4500) * 135));
                return (
                  <g>
                    <line x1="25" y1={capY} x2="585" y2={capY} stroke="#E11D48" strokeWidth="1.5" strokeDasharray="5 3" />
                    <text x="580" y={capY - 4} fill="#FB7185" fontSize="8" fontFamily="monospace" textAnchor="end">
                      LIMIT: {capacityW}W
                    </text>
                  </g>
                );
              })()}

              {/* Dynamic Load Curve */}
              {(() => {
                const points = hourlyPoints.map((pt, i) => {
                  const x = 35 + i * (540 / (hourlyPoints.length - 1));
                  const y = Math.max(15, Math.min(150, 150 - (pt.load / 4500) * 135));
                  return { x, y, ...pt };
                });

                const pathString = points.reduce((acc, pt, i) => {
                  return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '');

                const fillString = `${pathString} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

                return (
                  <g>
                    <defs>
                      <linearGradient id="loadCurveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1B5E3F" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={fillString} fill="url(#loadCurveFill)" />
                    <path d={pathString} fill="none" stroke="#2ECC71" strokeWidth="2.5" />

                    {/* Plot Points */}
                    {points.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.isCurrent ? 5 : 3}
                          fill={pt.isCurrent ? '#E11D48' : '#2ECC71'}
                          stroke="#101317"
                          strokeWidth="1.5"
                        />
                        <text
                          x={pt.x}
                          y="166"
                          fill={pt.isCurrent ? '#2ECC71' : '#6A778B'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight={pt.isCurrent ? 'bold' : 'normal'}
                          textAnchor="middle"
                        >
                          {pt.time}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* TAB 2: Solar Generation vs Household Demand */}
      {activeChartTab === 'solar_vs_load' && (
        <div className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm" /> Solar Generation ({solarGenW} W)
              </span>
              <span className="flex items-center gap-1.5 text-[#2ECC71]">
                <span className="w-2.5 h-2.5 bg-[#2ECC71] rounded-sm" /> Household Demand ({currentLoadW} W)
              </span>
            </div>
            <div className="font-mono text-xs">
              {metrics.gridExportW > 0 ? (
                <span className="text-[#2ECC71]">Solar Surplus: +{metrics.gridExportW} W (Exporting)</span>
              ) : (
                <span className="text-[#FB7185]">Solar Shortfall: -{metrics.gridImportW} W (Importing)</span>
              )}
            </div>
          </div>

          <div className="h-64 w-full bg-[#0E1115] rounded-lg border border-[#20252F] p-4 flex items-end justify-between gap-2 sm:gap-3">
            {hourlyPoints.map((pt, i) => {
              const maxH = 150; // px
              const loadBarH = Math.min(maxH, (pt.load / 4000) * maxH);
              const solarBarH = Math.min(maxH, (pt.solar / 4000) * maxH);

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-[150px]">
                    {/* Solar Bar */}
                    <div
                      className="w-1/2 bg-amber-400/80 rounded-t-sm transition-all group-hover:bg-amber-300"
                      style={{ height: `${solarBarH}px` }}
                      title={`Solar: ${pt.solar} W`}
                    />
                    {/* Load Bar */}
                    <div
                      className={`w-1/2 rounded-t-sm transition-all ${
                        pt.isCurrent
                          ? 'bg-[#2ECC71] group-hover:bg-[#A7F3D0]'
                          : 'bg-[#1B5E3F] group-hover:bg-[#2ECC71]'
                      }`}
                      style={{ height: `${loadBarH}px` }}
                      title={`Load: ${pt.load} W`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono mt-2 ${pt.isCurrent ? 'text-white font-bold' : 'text-slate-400'}`}>
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Appliance-Level Breakdown */}
      {activeChartTab === 'distribution' && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Active Appliance Load Shares ({activeAppliances.length} Active / {state.appliances.length} Total)
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              Total Active: {currentLoadW} W
            </span>
          </div>

          {activeAppliances.length === 0 ? (
            <div className="p-8 text-center bg-[#0E1115] rounded-lg border border-[#20252F] text-slate-400 text-xs">
              All simulated appliances are currently switched OFF. Total demand is 0 W.
            </div>
          ) : (
            <div className="space-y-3 bg-[#0E1115] rounded-lg border border-[#20252F] p-4">
              {/* Multi-segment stacked bar */}
              <div className="h-4 w-full bg-[#1A1F27] rounded-full overflow-hidden flex">
                {activeAppliances.map((app, idx) => {
                  const pct = (app.wattage / totalActiveApplianceWatts) * 100;
                  const palette = ['#2ECC71', '#38A169', '#27AE60', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
                  const color = palette[idx % palette.length];
                  return (
                    <div
                      key={app.id}
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      className="h-full transition-all"
                      title={`${app.name}: ${app.wattage} W (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>

              {/* Breakdown List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {activeAppliances.map((app, idx) => {
                  const pct = Math.round((app.wattage / totalActiveApplianceWatts) * 100);
                  const palette = ['#2ECC71', '#38A169', '#27AE60', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
                  const color = palette[idx % palette.length];

                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2 rounded bg-[#14181F] border border-[#20252F] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-white font-medium truncate max-w-[140px]">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-300">{app.wattage} W</span>
                        <span className="text-slate-400 text-[11px]">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Diagnostic Tag */}
      <div className="mt-4 pt-3 border-t border-[#20252F] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Illustrative Simulated Diurnal History · Synchronized with Active Appliance State
        </span>
        <span className="text-slate-400">Time-Series Res: 2-Hour Buckets</span>
      </div>
    </div>
  );
};
