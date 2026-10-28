import React from 'react';
import { Zap, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenSpecsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSpecsModal }) => {
  return (
    <footer className="bg-[#0A0D10] border-t border-[#1F242C] pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#1A1F26]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-7 h-7 rounded bg-[#161B22] border border-[#26303D] flex items-center justify-center relative">
                <Zap className="w-3.5 h-3.5 text-[#2ECC71] fill-[#1B5E3F]/40" />
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-[#E11D48]" />
              </div>
              <span>LoadPilot AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              LoadPilot AI — Predictive Smart Load Management System.
              An Electrical Engineering software prototype for forecasting electrical demand and optimizing the dispatch of flexible commercial and industrial loads.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Phase 1 Landing Interface · Educational engineering prototype.
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase text-slate-200 tracking-wider">
              Project Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#overview" className="hover:text-[#2ECC71] transition-colors">
                  System Overview
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#2ECC71] transition-colors">
                  Demand Shift Methodology
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#2ECC71] transition-colors">
                  Forecasting & Optimization
                </a>
              </li>
              <li>
                <a href="#simulation" className="hover:text-[#2ECC71] transition-colors">
                  Feeder Simulation
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Scope */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold uppercase text-slate-200 tracking-wider">
              Prototype Scope
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as an Electrical Engineering capstone research project. Focused on demand-side management (DSM), peak shaving algorithms, and battery energy storage dispatch (BESS).
            </p>
            <button
              onClick={onOpenSpecsModal}
              className="inline-flex items-center gap-1.5 text-xs text-[#2ECC71] hover:text-[#A7F3D0] transition-colors pt-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Technical Specification & Roadmap</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Quiet legal and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} LoadPilot AI. Educational engineering prototype.
          </div>
          <div className="flex items-center gap-4">
            <span>Electrical Engineering Project</span>
            <span>·</span>
            <span>Demonstration Data Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
