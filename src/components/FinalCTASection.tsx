import React from 'react';
import { ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface FinalCTASectionProps {
  onLaunchClick: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onLaunchClick }) => {
  return (
    <section className="py-20 md:py-28 bg-[#0D1013] relative border-t border-[#222731] overflow-hidden">
      {/* Subtle radial forest backdrop */}
      <div className="absolute inset-0 bg-radial-forest pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[250px] bg-[#BE123C]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#16291F] border border-[#2D936C]/30 text-[#2ECC71] mx-auto flex items-center justify-center mb-6 shadow-lg shadow-black/40">
          <Zap className="w-6 h-6 fill-[#1B5E3F]/40 text-[#2ECC71]" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance max-w-2xl mx-auto">
          Make Every Unit of Power Count.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Explore a smarter approach to electricity demand forecasting and load scheduling.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchClick}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] active:bg-[#154C32] border border-[#2D936C]/40 rounded-md transition-all shadow-xl hover:shadow-[0_0_30px_rgba(39,174,96,0.3)] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71]"
          >
            <span>Launch LoadPilot AI</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-200" />
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>Electrical Engineering College Project</span>
          <span className="text-slate-600">·</span>
          <span>Open Academic Prototype</span>
        </div>
      </div>
    </section>
  );
};
