import React, { useState, useEffect } from 'react';
import { Zap, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenLaunchModal: () => void;
  onLaunchDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLaunchModal, onLaunchDashboard }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Simulation', href: '#simulation' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#07090C]/95 backdrop-blur-md border-b border-[#18202A] shadow-xl shadow-black/60'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark & Simple Electrical Logo */}
          <a
            href="#"
            className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D1117] border border-[#1F2733] flex items-center justify-center relative shadow-sm">
              <Zap className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-[#07090C]" />
            </div>
            <span className="text-white font-bold tracking-tight">
              LoadPilot <span className="text-[#10B981] font-semibold">AI</span>
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap shrink-0 hover:text-[#10B981] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded px-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action in Forest Green */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button
              onClick={onLaunchDashboard || onOpenLaunchModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#10B981] active:bg-[#047857] border border-[#10B981]/40 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090C]"
            >
              <span>Launch Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D936C]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#222731] bg-[#141820]/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-[#2ECC71] hover:bg-white/5 rounded-md"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-[#222731]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLaunchDashboard) {
                  onLaunchDashboard();
                } else {
                  onOpenLaunchModal();
                }
              }}
              className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#23754F] border border-[#2D936C]/40 rounded-md flex items-center justify-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
