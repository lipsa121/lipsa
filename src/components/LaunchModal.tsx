import React from 'react';
import { X, Zap, Cpu, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSimulation: () => void;
  onLaunchDashboard?: () => void;
}

export const LaunchModal: React.FC<LaunchModalProps> = ({
  isOpen,
  onClose,
  onJumpToSimulation,
  onLaunchDashboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-xl border border-[#252B35] bg-[#12151B] p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#16291F] border border-[#2D936C]/40 flex items-center justify-center relative">
            <Zap className="w-5 h-5 fill-[#1B5E3F]/40 text-[#2ECC71]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
          </div>
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-white tracking-tight">
              LoadPilot AI Dashboard Entry Point
            </h3>
            <p className="text-xs text-slate-400">
              Predictive Smart Load Management System · Project Status
            </p>
          </div>
        </div>

        {/* Notice Box */}
        <div className="p-4 rounded-lg bg-[#161B23] border border-[#2D936C]/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2ECC71]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Phase 1 Architecture Complete</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are viewing the completed <strong>Phase 1 Landing Interface and Simulation Model</strong>.
            The complete standalone production control room, hardware telemetry connectors (Modbus/SCADA), and live ML inference services will be implemented in subsequent project phases.
          </p>
        </div>

        {/* Development Roadmap Cards */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Engineering Phases
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Phase 1 */}
            <div className="p-3.5 rounded-lg bg-[#0E1115] border border-[#2D936C]/40">
              <div className="flex items-center justify-between font-semibold text-white mb-1.5">
                <span className="flex items-center gap-1.5 text-[#2ECC71]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Phase 1 (Active)
                </span>
                <span className="text-[10px] text-[#2ECC71] font-mono">COMPLETE</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>· Charcoal & Forest Green interface</li>
                <li>· Crimson peak alert indicators</li>
                <li>· Interactive smart grid network model</li>
                <li>· 24h demand curve visualizer</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="p-3.5 rounded-lg bg-[#0E1115] border border-[#20252F]">
              <div className="flex items-center justify-between font-semibold text-white mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-[#E11D48]" /> Phase 2 (Planned)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">UPCOMING</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>· Full-screen operator control room</li>
                <li>· Real-time ML demand forecasting</li>
                <li>· Mixed-Integer linear load optimizer</li>
                <li>· Real-time SCADA/IoT data streaming</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#20252F] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Electrical Engineering College Capstone Project
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onLaunchDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchDashboard();
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] active:bg-[#154C32] border border-[#2D936C]/40 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Launch Smart Energy Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onJumpToSimulation();
              }}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1C212B] hover:bg-[#232936] rounded-md transition-colors border border-[#28303E] flex items-center justify-center gap-1.5"
            >
              <span>Feeder Simulator</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
