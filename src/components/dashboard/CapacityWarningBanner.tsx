import React from 'react';
import { AlertTriangle, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';

interface CapacityWarningBannerProps {
  onNavigateToAppliances?: () => void;
}

export const CapacityWarningBanner: React.FC<CapacityWarningBannerProps> = ({
  onNavigateToAppliances,
}) => {
  const { metrics, state } = useEnergySimulation();

  if (metrics.isCapacityExceeded) {
    return (
      <div className="rounded-xl border border-[#BE123C]/60 bg-[#3B0C15]/80 p-4 sm:p-5 shadow-lg shadow-rose-950/20 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#881326]/60 border border-[#BE123C]/60 text-[#FB7185] shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5 text-[#FB7185]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  Capacity Limit Exceeded
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#BE123C] text-white">
                  +{metrics.capacityExceededByW} W Over Limit
                </span>
              </div>
              <p className="text-xs text-[#FDA4AF] mt-1 leading-relaxed">
                Active household load is <strong className="text-white font-mono">{metrics.totalHouseholdLoadW} W</strong> ({metrics.totalHouseholdLoadKW.toFixed(2)} kW), exceeding your configured threshold of <strong className="text-white font-mono">{metrics.capacityLimitW} W</strong> ({metrics.capacityUtilizationPct}% utilization). Review and switch off flexible loads to prevent transformer thermal stress.
              </p>
            </div>
          </div>

          {onNavigateToAppliances && (
            <button
              onClick={onNavigateToAppliances}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#BE123C] hover:bg-[#E11D48] rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 shadow-md self-start sm:self-center"
            >
              <span>Manage Flexible Loads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2D936C]/30 bg-[#14231B]/70 p-4 sm:p-4.5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/30 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Feeder Capacity Status: Normal
              </span>
              <span className="text-[10px] font-mono text-[#2ECC71] bg-[#16291F] px-1.5 py-0.5 rounded border border-[#2D936C]/30">
                {metrics.capacityUtilizationPct}% Used
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Current load is <span className="font-mono text-white font-medium">{metrics.totalHouseholdLoadW} W</span> of <span className="font-mono text-slate-300">{metrics.capacityLimitW} W</span> limit · Safety headroom: <span className="font-mono text-[#2ECC71] font-semibold">+{metrics.capacityLimitW - metrics.totalHouseholdLoadW} W</span>
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono self-start sm:self-center">
          Software Warning Model · Demo Configuration
        </div>
      </div>
    </div>
  );
};
