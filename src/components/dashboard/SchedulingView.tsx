import React, { useState, useMemo } from 'react';
import { 
  CalendarClock, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Sun, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  FlexibleTask, 
  OptimizationObjective, 
  SchedulingComparison,
  AppliancePriority
} from '../../types/simulation';
import { 
  DEFAULT_FLEXIBLE_TASKS, 
  solveSmartSchedule 
} from '../../utils/schedulingEngine';

export const SchedulingView: React.FC = () => {
  const { state, simulatedHour, setApplianceState } = useEnergySimulation();

  const [tasks, setTasks] = useState<FlexibleTask[]>(DEFAULT_FLEXIBLE_TASKS);
  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Run solver whenever tasks, capacity limit, or objective change
  const comparison: SchedulingComparison = useMemo(() => {
    return solveSmartSchedule(
      tasks,
      state.capacityLimitW,
      objective,
      state.solar.installedCapacityKW,
      state.appliances
    );
  }, [tasks, state.capacityLimitW, objective, state.solar.installedCapacityKW, state.appliances]);

  // Task mutation handlers
  const toggleTaskEnabled = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  const updateTaskField = <K extends keyof FlexibleTask>(id: string, field: K, value: FlexibleTask[K]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const resetTasksToDefault = () => {
    setTasks(DEFAULT_FLEXIBLE_TASKS);
  };

  // Apply Schedule to Active Simulation State
  const handleApplyScheduleToActiveState = () => {
    // Determine current hour of simulation (prioritizing 24h continuous slider if available)
    const currentHour = simulatedHour !== undefined
      ? Math.floor(simulatedHour)
      : (state.timeOfDay === 'morning' ? 8 : state.timeOfDay === 'noon' ? 12 : state.timeOfDay === 'afternoon' ? 14 : state.timeOfDay === 'evening' ? 19 : 23);

    // Check which scheduled tasks are active at this currentHour
    const activeAtHour = comparison.scheduledJobs.filter(
      (job) => currentHour >= job.assignedStartHour && currentHour < job.assignedEndHour
    );

    const activeAppIds = new Set(activeAtHour.map((j) => j.applianceId));

    // Update simulation appliances: if flexible appliance is in activeAppIds, turn ON, else turn OFF
    tasks.forEach((task) => {
      if (task.applianceId && task.applianceId !== 'utility-cycle') {
        const shouldBeOn = activeAppIds.has(task.applianceId);
        setApplianceState(task.applianceId, shouldBeOn);
      }
    });

    setAppliedNotice(`Optimal schedule for ${currentHour.toString().padStart(2, '0')}:00 hrs applied to simulation.`);
    setTimeout(() => setAppliedNotice(null), 4000);
  };

  // SVG Chart Dimensions
  const chartHeight = 240;
  const chartWidth = 740;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const yMax = Math.ceil(
    Math.max(
      comparison.unmanagedPeakW,
      comparison.scheduledPeakW,
      state.capacityLimitW,
      3500
    ) * 1.15 / 500
  ) * 500;

  const getX = (hour: number) => padding.left + (hour / 23) * innerWidth;
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(yMax, val));
    return padding.top + innerHeight - (clamped / yMax) * innerHeight;
  };

  // Paths
  const unmanagedPath = comparison.hourlyProfiles
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour).toFixed(1)} ${getY(p.unmanagedDemandW).toFixed(1)}`)
    .join(' ');

  const scheduledPath = comparison.hourlyProfiles
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour).toFixed(1)} ${getY(p.scheduledDemandW).toFixed(1)}`)
    .join(' ');

  const solarPath = comparison.hourlyProfiles
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour).toFixed(1)} ${getY(p.solarGenerationW).toFixed(1)}`)
    .join(' ');

  const capacityY = getY(state.capacityLimitW);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222731]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40 uppercase">
              Phase 4 Core Module
            </span>
            <span className="text-xs font-mono text-slate-400">
              Constraint-Aware Solver
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-[#2ECC71]" />
            <span>Smart Load Scheduling Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Optimizes operating windows for flexible electrical loads to eliminate peak capacity breaches and maximize solar utilization.
          </p>
        </div>

        {/* Objective Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-lg bg-[#0E1115] p-1 border border-[#20252F]">
            {(['balanced', 'solar_first', 'peak_shaving'] as OptimizationObjective[]).map((obj) => (
              <button
                key={obj}
                onClick={() => setObjective(obj)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all capitalize ${
                  objective === obj
                    ? 'bg-[#1B5E3F] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {obj.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={handleApplyScheduleToActiveState}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Sync to Active Simulation</span>
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 rounded-lg bg-[#16291F] border border-[#2D936C]/60 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Before-and-After KPI Stat Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Peak Demand Delta */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Peak Demand Reduction
            </span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#16291F] text-[#2ECC71] border border-[#2D936C]/40">
              -{comparison.peakReductionPct}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#2ECC71]">
              {comparison.scheduledPeakW.toLocaleString()} W
            </span>
            <span className="text-xs font-mono line-through text-slate-400">
              {comparison.unmanagedPeakW.toLocaleString()} W
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Shaved {comparison.peakReductionW.toLocaleString()} W off highest unmanaged spike
          </p>
        </div>

        {/* Capacity Violations */}
        <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
          comparison.scheduledBreachHours > 0
            ? 'bg-[#1F1216] border-[#BE123C]/60 text-rose-100'
            : 'bg-[#14181F] border-[#252B35] text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Capacity Breach Hours
            </span>
            {comparison.scheduledBreachHours === 0 ? (
              <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FB7185]" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${
              comparison.scheduledBreachHours === 0 ? 'text-[#2ECC71]' : 'text-[#FB7185]'
            }`}>
              {comparison.scheduledBreachHours} Hours
            </span>
            <span className="text-xs font-mono line-through text-slate-400">
              {comparison.unmanagedBreachHours} Hours
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {comparison.scheduledBreachHours === 0
              ? 'Zero grid capacity overloads remain'
              : 'Grid limit still exceeded during tight windows'}
          </p>
        </div>

        {/* Solar Self-Consumption */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Solar Self-Consumption
            </span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300">
              {comparison.scheduledSolarSelfConsumptionPct}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              (was {comparison.unmanagedSolarSelfConsumptionPct}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Shifted {comparison.totalShiftedEnergyKWh} kWh directly into daytime solar curve
          </p>
        </div>

        {/* Solver Feasibility Status */}
        <div className="p-4 rounded-xl border border-[#252B35] bg-[#14181F] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Solver Dispatch Status
            </span>
            <Cpu className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded border ${
              comparison.solverStatus === 'optimal'
                ? 'bg-[#16291F] text-[#2ECC71] border-[#2D936C]/40'
                : comparison.solverStatus === 'feasible_with_warnings'
                ? 'bg-amber-950/40 text-amber-300 border-amber-600/40'
                : 'bg-rose-950/40 text-[#FB7185] border-rose-600/40'
            }`}>
              {comparison.solverStatus.toUpperCase().replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 truncate" title={comparison.message}>
            {comparison.message}
          </p>
        </div>
      </div>

      {/* Before-and-After Load Profile Chart */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F] p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#20252F]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Before vs. After 24-Hour Load Trajectory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison between unmanaged demand spikes and constraint-aware scheduled dispatch.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#E11D48]" />
              <span className="text-[#FB7185]">Unmanaged (Baseline)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#2ECC71]" />
              <span className="text-[#2ECC71]">Scheduled (Optimized)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span className="text-amber-300">Solar Gen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 stroke-dasharray" />
              <span className="text-slate-400">Limit ({state.capacityLimitW}W)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="mt-4 relative overflow-x-auto">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-auto select-none min-w-[580px]"
          >
            {/* Grid Lines */}
            {[0, 1000, 2000, 3000, 4000, 5000].filter((v) => v <= yMax).map((val) => {
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

            {/* Capacity Limit Line */}
            <line 
              x1={padding.left} 
              y1={capacityY} 
              x2={chartWidth - padding.right} 
              y2={capacityY} 
              stroke="#BE123C" 
              strokeWidth="1.5" 
              strokeDasharray="6 3" 
            />

            {/* Solar Generation Trace */}
            <path 
              d={solarPath} 
              fill="none" 
              stroke="#F59E0B" 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
            />

            {/* Unmanaged Profile Trace (Crimson Red / Salmon) */}
            <path 
              d={unmanagedPath} 
              fill="none" 
              stroke="#E11D48" 
              strokeWidth="2" 
              opacity="0.85"
            />

            {/* Scheduled Profile Trace (Emerald Green) */}
            <path 
              d={scheduledPath} 
              fill="none" 
              stroke="#2ECC71" 
              strokeWidth="2.5" 
            />

            {/* Hour Markers and Hitboxes */}
            {comparison.hourlyProfiles.map((p, i) => {
              const x = getX(p.hour);
              const ySched = getY(p.scheduledDemandW);
              const isHovered = hoveredHour === p.hour;

              return (
                <g 
                  key={i}
                  onMouseEnter={() => setHoveredHour(p.hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                  className="cursor-pointer"
                >
                  <rect 
                    x={x - 12} 
                    y={padding.top} 
                    width={24} 
                    height={innerHeight} 
                    fill="transparent" 
                  />

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

                  {/* Scheduled point dot */}
                  <circle 
                    cx={x} 
                    cy={ySched} 
                    r={isHovered ? 4.5 : 2.5} 
                    fill={p.scheduledCapacityBreach ? '#FB7185' : '#2ECC71'} 
                    stroke="#101317" 
                    strokeWidth="1.5" 
                  />

                  {/* X Axis Label */}
                  {i % 2 === 0 && (
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
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoveredHour !== null && comparison.hourlyProfiles[hoveredHour] && (
            <div 
              className="absolute top-2 right-4 z-20 p-3 rounded-lg bg-[#0E1115]/95 border border-[#2D936C]/40 backdrop-blur-md shadow-2xl text-xs font-mono space-y-1 pointer-events-none"
            >
              <div className="font-bold text-white flex items-center justify-between gap-4 border-b border-white/10 pb-1">
                <span>Interval: {comparison.hourlyProfiles[hoveredHour].timeLabel}</span>
                <span className="text-[#2ECC71]">Hour {hoveredHour}:00</span>
              </div>
              <div className="flex justify-between gap-4 text-emerald-400">
                <span>Scheduled Demand:</span>
                <span className="font-bold">{comparison.hourlyProfiles[hoveredHour].scheduledDemandW} W</span>
              </div>
              <div className="flex justify-between gap-4 text-rose-400">
                <span>Unmanaged Demand:</span>
                <span>{comparison.hourlyProfiles[hoveredHour].unmanagedDemandW} W</span>
              </div>
              <div className="flex justify-between gap-4 text-amber-300">
                <span>Solar Generation:</span>
                <span>{comparison.hourlyProfiles[hoveredHour].solarGenerationW} W</span>
              </div>
              {comparison.hourlyProfiles[hoveredHour].activeScheduledJobs.length > 0 && (
                <div className="pt-1 border-t border-white/10 text-[10px] text-slate-300">
                  <span className="text-slate-400">Running: </span>
                  {comparison.hourlyProfiles[hoveredHour].activeScheduledJobs.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Infeasible / Warning Constraints Reporting Panel */}
      {comparison.infeasibleJobs.length > 0 && (
        <div className="p-4 rounded-xl border border-[#BE123C]/50 bg-[#1F1216]/80 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#FB7185]">
            <AlertTriangle className="w-4.5 h-4.5 text-[#FB7185]" />
            <span>Constraint Violation / Infeasible Task Detected</span>
          </div>
          <p className="text-xs text-rose-200">
            The solver could not schedule the following flexible load(s) without violating physical capacity thresholds or time windows:
          </p>
          <div className="space-y-2 mt-2">
            {comparison.infeasibleJobs.map((job) => (
              <div key={job.taskId} className="p-2.5 rounded bg-black/40 border border-[#BE123C]/40 text-xs font-mono">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>{job.taskName} ({job.powerW} W)</span>
                  <span className="text-[#FB7185] uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#BE123C]/30">
                    Infeasible
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300 font-sans">
                  {job.infeasibilityReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flexible Loads Configurator Grid */}
      <div className="rounded-xl border border-[#252B35] bg-[#14181F] p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#20252F]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Configured Flexible Loads & Operating Windows
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify rated power, operating duration, earliest/latest permitted time windows, and priority.
            </p>
          </div>

          <button
            onClick={resetTasksToDefault}
            className="self-start sm:self-auto px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-white bg-[#0E1115] border border-[#20252F] rounded flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Task Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const scheduledJob = comparison.scheduledJobs.find((j) => j.taskId === task.id);
            const isInfeasible = comparison.infeasibleJobs.some((j) => j.taskId === task.id);

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  !task.isEnabled 
                    ? 'bg-[#0E1115]/50 border-[#20252F] opacity-60' 
                    : isInfeasible
                    ? 'bg-[#181114] border-[#BE123C]/50'
                    : 'bg-[#0E1115] border-[#222731] hover:border-[#2D936C]/40'
                }`}
              >
                {/* Header row: Checkbox + Name + Priority */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#20252F]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={task.isEnabled}
                      onChange={() => toggleTaskEnabled(task.id)}
                      className="w-4 h-4 rounded border-[#2D936C] text-[#1B5E3F] focus:ring-0 focus:outline-none cursor-pointer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{task.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Unmanaged: {task.preferredStartHour}:00 ({task.durationHours}h)
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    task.priority === 'Critical' || task.priority === 'High'
                      ? 'bg-[#BE123C]/20 text-[#FB7185] border-[#BE123C]/40'
                      : task.priority === 'Medium'
                      ? 'bg-amber-950/30 text-amber-300 border-amber-600/30'
                      : 'bg-[#16291F] text-[#2ECC71] border-[#2D936C]/40'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Power (W)</label>
                    <input
                      type="number"
                      value={task.ratedPowerW}
                      onChange={(e) => updateTaskField(task.id, 'ratedPowerW', Math.max(50, Number(e.target.value)))}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#252B35] rounded text-white focus:outline-none focus:border-[#2ECC71]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Duration (h)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={task.durationHours}
                      onChange={(e) => updateTaskField(task.id, 'durationHours', Math.max(1, Math.min(12, Number(e.target.value))))}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#252B35] rounded text-white focus:outline-none focus:border-[#2ECC71]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Earliest Start</label>
                    <select
                      value={task.earliestStartHour}
                      onChange={(e) => updateTaskField(task.id, 'earliestStartHour', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#252B35] rounded text-white focus:outline-none focus:border-[#2ECC71]"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Latest End</label>
                    <select
                      value={task.latestEndHour}
                      onChange={(e) => updateTaskField(task.id, 'latestEndHour', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-[#14181F] border border-[#252B35] rounded text-white focus:outline-none focus:border-[#2ECC71]"
                    >
                      {Array.from({ length: 25 }).map((_, h) => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Solved Dispatch Result Banner */}
                <div className="mt-3 pt-2.5 border-t border-[#20252F] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">Assigned Slot:</span>
                  {scheduledJob ? (
                    <span className="text-[#2ECC71] font-bold flex items-center gap-1.5 bg-[#16291F] px-2 py-0.5 rounded border border-[#2D936C]/40">
                      <Clock className="w-3 h-3" />
                      {scheduledJob.assignedStartHour}:00 – {scheduledJob.assignedEndHour}:00
                    </span>
                  ) : isInfeasible ? (
                    <span className="text-[#FB7185] font-bold bg-[#BE123C]/20 px-2 py-0.5 rounded border border-[#BE123C]/40">
                      Infeasible (Window / Capacity Conflict)
                    </span>
                  ) : (
                    <span className="text-slate-500">Disabled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
