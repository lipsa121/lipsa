import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Layers, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Sun,
  Maximize2
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  ForecastingHorizon, 
  ForecastingModelType, 
  ForecastResult 
} from '../../types/simulation';
import { 
  generateDemandForecast, 
  getBenchmarkHistory 
} from '../../utils/forecastingEngine';

export const ForecastingView: React.FC = () => {
  const { state, metrics } = useEnergySimulation();
  
  const [horizon, setHorizon] = useState<ForecastingHorizon>(24);
  const [modelType, setModelType] = useState<ForecastingModelType>('weather_adjusted_smoothing');
  const [showHistoryTable, setShowHistoryTable] = useState<boolean>(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Compute forecast dynamically whenever state/options change
  const forecastResult: ForecastResult = useMemo(() => {
    return generateDemandForecast(
      modelType,
      horizon,
      state.capacityLimitW,
      metrics.totalHouseholdLoadW,
      state.solar.installedCapacityKW
    );
  }, [modelType, horizon, state.capacityLimitW, metrics.totalHouseholdLoadW, state.solar.installedCapacityKW]);

  const predictions = forecastResult.predictions;
  const isPeakOverCapacity = forecastResult.peakPredictedW > state.capacityLimitW;

  // Chart rendering math
  const chartHeight = 240;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max scale based on peak demand, capacity limit, and solar peak
  const maxDataVal = Math.max(
    ...predictions.map((p) => Math.max(p.confidenceUpperW, p.referenceDemandW, p.solarForecastW)),
    state.capacityLimitW,
    3500
  );
  const yMax = Math.ceil((maxDataVal * 1.15) / 500) * 500;

  const getX = (index: number) => {
    if (predictions.length <= 1) return padding.left;
    return padding.left + (index / (predictions.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(yMax, val));
    return padding.top + innerHeight - (clamped / yMax) * innerHeight;
  };

  // Build SVG Paths
  const predictedPath = predictions
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.predictedDemandW).toFixed(1)}`)
    .join(' ');

  const referencePath = predictions
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.referenceDemandW).toFixed(1)}`)
    .join(' ');

  const solarPath = predictions
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.solarForecastW).toFixed(1)}`)
    .join(' ');

  // Confidence ribbon polygon
  const upperPoints = predictions.map((p, i) => `${getX(i).toFixed(1)},${getY(p.confidenceUpperW).toFixed(1)}`);
  const lowerPoints = [...predictions].reverse().map((p, i) => {
    const originalIdx = predictions.length - 1 - i;
    return `${getX(originalIdx).toFixed(1)},${getY(p.confidenceLowerW).toFixed(1)}`;
  });
  const confidencePolygon = `${upperPoints.join(' ')} ${lowerPoints.join(' ')}`;

  const capacityY = getY(state.capacityLimitW);

  // Benchmarked raw data for inspection
  const benchmarkHistory = useMemo(() => getBenchmarkHistory(), []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222731]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 uppercase">
              Phase 4 Core Module
            </span>
            <span className="text-xs font-mono text-slate-400">
              Deterministic Time-Series
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#2ECC71]" />
            <span>Demand Forecasting Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Predictive load trajectory modelling with empirical baseline verification and confidence bounds.
          </p>
        </div>

        {/* Model & Horizon Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selection Buttons */}
          <div className="flex items-center rounded-lg bg-[#0E1115] p-1 border border-[#20252F]">
            {([6, 12, 24] as ForecastingHorizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                  horizon === h
                    ? 'bg-[#1B5E3F] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}h Ahead
              </button>
            ))}
          </div>

          {/* Model Algorithm Toggle */}
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value as ForecastingModelType)}
            className="px-3 py-1.5 text-xs font-medium bg-[#14181F] text-slate-200 border border-[#252B35] rounded-lg focus:outline-none focus:border-[#2ECC71]"
          >
            <option value="weather_adjusted_smoothing">Weather & Trend-Adjusted Smoothing</option>
            <option value="seasonal_naive">Seasonal-Naïve Baseline (y[t] = y[t-24])</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Predicted Peak Demand */}
        <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
          isPeakOverCapacity 
            ? 'bg-[#1F1216] border-[#BE123C]/60 text-rose-100 shadow-md shadow-rose-950/20' 
            : 'bg-[#14181F] border-[#252B35] text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Predicted Peak Demand
            </span>
            {isPeakOverCapacity ? (
              <AlertTriangle className="w-4 h-4 text-[#FB7185]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isPeakOverCapacity ? 'text-[#FB7185]' : 'text-white'}`}>
              {forecastResult.peakPredictedW.toLocaleString()} W
            </span>
            <span className="text-xs font-mono text-slate-400">
              at {forecastResult.peakTimeLabel}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isPeakOverCapacity 
              ? `Exceeds threshold by ${forecastResult.peakPredictedW - state.capacityLimitW} W` 
              : 'Safely within configured capacity limits'}
          </p>
        </div>

        {/* Capacity Threshold */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Configured Capacity Limit
            </span>
            <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {state.capacityLimitW.toLocaleString()} W
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({(state.capacityLimitW / 1000).toFixed(1)} kW)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Grid import threshold setting
          </p>
        </div>

        {/* Mean Absolute Error (MAE) */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Mean Absolute Error (MAE)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40">
              Held-Out Test
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#2ECC71]">
              ±{forecastResult.evaluation.maeW} W
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({forecastResult.evaluation.mapePct}% MAPE)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Empirical accuracy over {forecastResult.evaluation.nSamples} hourly intervals
          </p>
        </div>

        {/* Root Mean Squared Error (RMSE) */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Model RMSE & Max Residual
            </span>
            <TrendingUp className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-200">
              {forecastResult.evaluation.rmseW} W
            </span>
            <span className="text-xs font-mono text-slate-400">
              Max: {forecastResult.evaluation.maxErrorW} W
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Quadratic penalty for peak load deviations
          </p>
        </div>
      </div>

      {/* Primary Forecast Comparison Chart */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F] p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#20252F]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Forecast Trajectory vs. Ground Truth Benchmark</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({forecastResult.horizon}-Hour Horizon)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis between held-out reference demand, predicted demand with 95% confidence bounds, and solar generation.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#2ECC71]" />
              <span className="text-slate-300">Predicted Load</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400 stroke-dasharray" />
              <span className="text-slate-400">Reference Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span className="text-amber-300">Solar Gen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#E11D48]" />
              <span className="text-[#FB7185]">Capacity Limit</span>
            </div>
          </div>
        </div>

        {/* SVG Responsive Container */}
        <div className="mt-4 relative overflow-x-auto">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-auto select-none min-w-[580px]"
          >
            <defs>
              {/* Confidence Band Gradient */}
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.04" />
              </linearGradient>

              {/* Solar Gradient */}
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Horizontal Guide Lines */}
            {[0, 1000, 2000, 3000, 4000].filter((val) => val <= yMax).map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line 
                    x1={padding.left} 
                    y1={y} 
                    x2={chartWidth - padding.right} 
                    y2={y} 
                    stroke="#222731" 
                    strokeDasharray="3 3" 
                  />
                  <text 
                    x={padding.left - 8} 
                    y={y + 3} 
                    fill="#64748B" 
                    fontSize="9" 
                    textAnchor="end" 
                    fontFamily="monospace"
                  >
                    {val} W
                  </text>
                </g>
              );
            })}

            {/* Capacity Threshold Line */}
            <line 
              x1={padding.left} 
              y1={capacityY} 
              x2={chartWidth - padding.right} 
              y2={capacityY} 
              stroke="#E11D48" 
              strokeWidth="1.5" 
              strokeDasharray="6 3" 
            />
            <text 
              x={chartWidth - padding.right - 5} 
              y={capacityY - 6} 
              fill="#FB7185" 
              fontSize="9" 
              textAnchor="end" 
              fontFamily="monospace" 
              fontWeight="bold"
            >
              LIMIT: {state.capacityLimitW} W
            </text>

            {/* Solar Generation Area & Line */}
            <path 
              d={`${solarPath} L ${getX(predictions.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`} 
              fill="url(#solarGrad)" 
            />
            <path 
              d={solarPath} 
              fill="none" 
              stroke="#F59E0B" 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
            />

            {/* Confidence Band Polygon */}
            <polygon 
              points={confidencePolygon} 
              fill="url(#confidenceGrad)" 
            />

            {/* Reference Ground Truth Line */}
            <path 
              d={referencePath} 
              fill="none" 
              stroke="#94A3B8" 
              strokeWidth="1.75" 
              strokeDasharray="3 3" 
              opacity="0.85"
            />

            {/* Forecast Demand Line */}
            <path 
              d={predictedPath} 
              fill="none" 
              stroke="#2ECC71" 
              strokeWidth="2.5" 
            />

            {/* Data Points and Interactivity */}
            {predictions.map((p, i) => {
              const x = getX(i);
              const yPred = getY(p.predictedDemandW);
              const isHovered = hoveredPointIndex === i;

              return (
                <g 
                  key={i}
                  onMouseEnter={() => setHoveredPointIndex(i)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible broad hitbox */}
                  <rect 
                    x={x - 12} 
                    y={padding.top} 
                    width={24} 
                    height={innerHeight} 
                    fill="transparent" 
                  />

                  {/* Vertical cursor guide */}
                  {isHovered && (
                    <line 
                      x1={x} 
                      y1={padding.top} 
                      x2={x} 
                      y2={padding.top + innerHeight} 
                      stroke="#475569" 
                      strokeWidth="1" 
                      strokeDasharray="2 2" 
                    />
                  )}

                  {/* Point marker */}
                  <circle 
                    cx={x} 
                    cy={yPred} 
                    r={p.isPeak ? 5 : isHovered ? 4.5 : 2.5} 
                    fill={p.isPeak ? '#FB7185' : '#2ECC71'} 
                    stroke="#101317" 
                    strokeWidth="1.5" 
                  />

                  {/* X-axis Hour Label */}
                  <text 
                    x={x} 
                    y={chartHeight - padding.bottom + 16} 
                    fill={isHovered ? '#FFFFFF' : '#64748B'} 
                    fontSize="9" 
                    textAnchor="middle" 
                    fontFamily="monospace"
                  >
                    {p.timeLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Hover Detail Tooltip Box */}
          {hoveredPointIndex !== null && predictions[hoveredPointIndex] && (
            <div 
              className="absolute top-2 right-4 z-20 p-3 rounded-lg bg-[#0E1115]/95 border border-[#2D936C]/40 backdrop-blur-md shadow-2xl text-xs font-mono space-y-1 pointer-events-none"
            >
              <div className="font-bold text-white flex items-center justify-between gap-4 border-b border-white/10 pb-1">
                <span>Time: {predictions[hoveredPointIndex].timeLabel}</span>
                <span className="text-[#2ECC71]">Hour +{predictions[hoveredPointIndex].hour}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-300">
                <span>Predicted Demand:</span>
                <span className="text-white font-bold">{predictions[hoveredPointIndex].predictedDemandW} W</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Reference Actual:</span>
                <span>{predictions[hoveredPointIndex].referenceDemandW} W</span>
              </div>
              <div className="flex justify-between gap-4 text-amber-300">
                <span>Solar Generation:</span>
                <span>{predictions[hoveredPointIndex].solarForecastW} W</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <span>95% Bounds:</span>
                <span>{predictions[hoveredPointIndex].confidenceLowerW} – {predictions[hoveredPointIndex].confidenceUpperW} W</span>
              </div>
            </div>
          )}
        </div>

        {/* Source and Status Transparency Box */}
        <div className="mt-4 p-3.5 rounded-lg bg-[#0E1115] border border-[#20252F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-white">Active Model: {forecastResult.modelName}</span>
              <p className="text-[11px] text-slate-400">
                {forecastResult.dataSourceDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHistoryTable(!showHistoryTable)}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-[#1A1F27] border border-[#2A313E] rounded transition-colors whitespace-nowrap"
          >
            {showHistoryTable ? 'Hide Benchmark Data' : 'Inspect Benchmark History'}
          </button>
        </div>
      </div>

      {/* Benchmark History Inspection Table */}
      {showHistoryTable && (
        <div className="rounded-xl border border-[#252B35] bg-[#14181F] p-4 sm:p-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#20252F]">
            <div>
              <h3 className="text-sm font-bold text-white">
                72-Hour Benchmark Time-Series Repository
              </h3>
              <p className="text-xs text-slate-400">
                Verified multi-day load profile showing Day -2 historical, Day -1 lag baseline, and Day 0 evaluation test set.
              </p>
            </div>
            <span className="text-xs font-mono text-[#2ECC71]">
              72 Records Loaded
            </span>
          </div>

          <div className="mt-3 overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-[#0E1115] text-slate-400 border-b border-[#20252F]">
                <tr>
                  <th className="py-2 px-3">Hour Index</th>
                  <th className="py-2 px-3">Cycle Tag</th>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Measured Demand (W)</th>
                  <th className="py-2 px-3">Base Essential (W)</th>
                  <th className="py-2 px-3">Solar Gen (W)</th>
                  <th className="py-2 px-3">Outdoor Temp (°C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20252F] text-slate-300">
                {benchmarkHistory.map((row) => (
                  <tr 
                    key={row.hourIndex}
                    className={row.day === 'today' ? 'bg-[#16291F]/30 text-white' : 'hover:bg-white/5'}
                  >
                    <td className="py-1.5 px-3">{row.hourIndex}</td>
                    <td className="py-1.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        row.day === 'today' 
                          ? 'bg-[#1B5E3F] text-emerald-200 font-bold' 
                          : row.day === 'yesterday'
                          ? 'bg-[#20252F] text-slate-300'
                          : 'bg-[#14181F] text-slate-400'
                      }`}>
                        {row.day === 'today' ? 'Day 0 (Test)' : row.day === 'yesterday' ? 'Day -1 (Lag)' : 'Day -2 (Train)'}
                      </span>
                    </td>
                    <td className="py-1.5 px-3">{row.timeLabel}</td>
                    <td className="py-1.5 px-3 font-semibold text-white">{row.measuredDemandW}</td>
                    <td className="py-1.5 px-3">{row.baseDemandW}</td>
                    <td className="py-1.5 px-3 text-amber-300">{row.solarGenerationW}</td>
                    <td className="py-1.5 px-3">{row.outdoorTempC}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
