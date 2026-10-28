import React, { useState } from 'react';
import { useEnergySimulation } from '../../context/EnergySimulationContext';
import { 
  Sun, 
  Moon, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Battery, 
  Car, 
  Wind, 
  Tv, 
  Lightbulb, 
  Radio, 
  Power,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SmartHomeHouseVisualizerProps {
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

export const SmartHomeHouseVisualizer: React.FC<SmartHomeHouseVisualizerProps> = ({
  selectedComponentId,
  onSelectComponent,
}) => {
  const {
    state,
    metrics,
    toggleAppliance,
    setTimeOfDayHour,
    toggleAutoAdvance,
    setGridConnected,
    resetDemo,
  } = useEnergySimulation();

  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Time formatting
  const formattedHour = `${String(state.timeOfDayHour).padStart(2, '0')}:00`;
  const isNight = state.timeOfDayHour < 6 || state.timeOfDayHour >= 19;
  const isSolarPeak = state.timeOfDayHour >= 11 && state.timeOfDayHour <= 15;

  // Find key appliances
  const acApp = state.appliances.find((a) => a.id === 'ac');
  const fridgeApp = state.appliances.find((a) => a.id === 'refrigerator');
  const lightsApp = state.appliances.find((a) => a.id === 'lights');
  const fanApp = state.appliances.find((a) => a.id === 'fan');
  const pumpApp = state.appliances.find((a) => a.id === 'pump');
  const compApp = state.appliances.find((a) => a.id === 'computer');
  const evApp = state.appliances.find((a) => a.id === 'ev_charger');

  // Conduit animation speeds based on power magnitude
  const solarFlowActive = metrics.solarGenerationW > 30;
  const batteryFlowActive = Math.abs(metrics.batteryPowerFlowW) > 20;
  const gridFlowActive = Math.abs(metrics.effectiveNetGridW) > 20 && state.gridConfig.isConnected;
  const homeLoadActive = metrics.totalHouseholdLoadW > 0;

  return (
    <div className="relative w-full rounded-2xl bg-[#0c0f12] border border-[#232931] overflow-hidden shadow-2xl flex flex-col">
      {/* Top Visualizer Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#14191f]/90 border-b border-[#232931] backdrop-blur-md z-10">
        {/* Left: View Title & Lighting Mode */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] animate-pulse"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Architectural Digital Twin
            </span>
          </div>
          <span className="text-[#3F3F46]">|</span>
          <span className="text-xs text-[#E4E4E7] font-medium hidden sm:inline">
            Interactive Cutaway Cross-Section
          </span>
        </div>

        {/* Center: Sun Scrubber / Time of Day */}
        <div className="flex items-center space-x-2 bg-[#090b0d] px-3 py-1.5 rounded-xl border border-[#232931]">
          {isNight ? (
            <Moon className="w-4 h-4 text-[#818CF8]" />
          ) : (
            <Sun className={`w-4 h-4 ${isSolarPeak ? 'text-amber-400 animate-spin-slow' : 'text-amber-300'}`} />
          )}
          <span className="text-xs font-mono font-bold text-[#E4E4E7] min-w-[42px]">
            {formattedHour}
          </span>
          <input
            type="range"
            min="0"
            max="23"
            value={state.timeOfDayHour}
            onChange={(e) => setTimeOfDayHour(parseInt(e.target.value, 10))}
            className="w-24 sm:w-32 h-1.5 bg-[#232931] rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
            title="Time of Day Scrubber"
          />
          <button
            onClick={toggleAutoAdvance}
            className={`p-1 rounded-md transition-colors ${
              state.isAutoAdvancing 
                ? 'bg-[#1B5E3F] text-white' 
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E252D]'
            }`}
            title={state.isAutoAdvancing ? 'Pause Clock' : 'Auto Advance Clock'}
          >
            {state.isAutoAdvancing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Quick Presets & Reset */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setTimeOfDayHour(8)}
              className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                state.timeOfDayHour === 8 
                  ? 'bg-[#1B5E3F]/30 border-[#2ECC71] text-[#2ECC71]' 
                  : 'bg-[#161B22] border-[#232931] text-[#A1A1AA] hover:text-white'
              }`}
            >
              Morning (8h)
            </button>
            <button
              onClick={() => setTimeOfDayHour(13)}
              className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                state.timeOfDayHour === 13 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                  : 'bg-[#161B22] border-[#232931] text-[#A1A1AA] hover:text-white'
              }`}
            >
              Peak Sun (13h)
            </button>
            <button
              onClick={() => setTimeOfDayHour(20)}
              className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                state.timeOfDayHour === 20 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                  : 'bg-[#161B22] border-[#232931] text-[#A1A1AA] hover:text-white'
              }`}
            >
              Evening (20h)
            </button>
          </div>
          <button
            onClick={resetDemo}
            className="p-1.5 text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#1E252D] rounded-lg transition-colors border border-[#232931]"
            title="Reset Simulation Setup"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main SVG Cutaway Canvas */}
      <div className="relative w-full aspect-[16/10] min-h-[460px] max-h-[640px] bg-gradient-to-b from-[#080a0d] via-[#0d1117] to-[#07090b] flex items-center justify-center p-2 sm:p-4 select-none">
        
        {/* Dynamic Sky & Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: isNight
              ? 'radial-gradient(circle at 75% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)'
              : 'radial-gradient(circle at 65% 15%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* SVG Drawing Layer */}
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full filter drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E232A" />
              <stop offset="100%" stopColor="#12161C" />
            </linearGradient>

            <linearGradient id="wallExtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222831" />
              <stop offset="100%" stopColor="#161B22" />
            </linearGradient>

            <linearGradient id="roomInteriorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#171C23" />
              <stop offset="100%" stopColor="#10141A" />
            </linearGradient>

            <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#151A21" />
              <stop offset="100%" stopColor="#0D1014" />
            </linearGradient>

            {/* Glowing filters */}
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Flow line animated patterns */}
            <style>{`
              @keyframes dashFlow {
                to {
                  stroke-dashoffset: -40;
                }
              }
              @keyframes dashFlowReverse {
                to {
                  stroke-dashoffset: 40;
                }
              }
              @keyframes pulseWave {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.08); }
              }
              .flow-dc {
                stroke-dasharray: 6 6;
                animation: dashFlow 1.2s linear infinite;
              }
              .flow-ac {
                stroke-dasharray: 8 6;
                animation: dashFlow 0.9s linear infinite;
              }
              .flow-grid-import {
                stroke-dasharray: 6 6;
                animation: dashFlow 1.4s linear infinite;
              }
              .flow-grid-export {
                stroke-dasharray: 6 6;
                animation: dashFlowReverse 1.4s linear infinite;
              }
            `}</style>
          </defs>

          {/* ========================================================== */}
          {/* BACKGROUND LANDSCAPE & TERRAIN                             */}
          {/* ========================================================== */}
          <rect x="0" y="520" width="1000" height="100" fill="url(#groundGrad)" />
          <line x1="0" y1="520" x2="1000" y2="520" stroke="#2A3441" strokeWidth="2" />
          
          {/* Concrete Driveway on Right */}
          <polygon points="710,520 960,520 940,560 690,560" fill="#1C222B" stroke="#28333F" strokeWidth="1" />
          <line x1="770" y1="535" x2="900" y2="535" stroke="#374151" strokeDasharray="10 8" strokeWidth="2" />

          {/* Sun / Moon Orb in Sky */}
          <g transform={`translate(${isNight ? '780, 80' : '680, 75'})`}>
            {isNight ? (
              <g>
                <circle cx="0" cy="0" r="28" fill="#312E81" opacity="0.3" filter="url(#glowCyan)" />
                <circle cx="0" cy="0" r="18" fill="#C7D2FE" />
                <circle cx="6" cy="-4" r="16" fill="#080a0d" />
              </g>
            ) : (
              <g>
                <circle cx="0" cy="0" r="45" fill="#F59E0B" opacity="0.2" filter="url(#glowGold)" />
                <circle cx="0" cy="0" r="24" fill="#FBBF24" />
                {/* Sun rays */}
                <circle cx="0" cy="0" r="32" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.7" />
              </g>
            )}
          </g>

          {/* ========================================================== */}
          {/* UTILITY GRID POLE & TRANSFORMER (LEFT SIDE)                 */}
          {/* ========================================================== */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSelectComponent('grid')}
            onMouseEnter={() => setHoveredHotspot('grid')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Pole Base & Shaft */}
            <line x1="70" y1="230" x2="70" y2="520" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
            <line x1="50" y1="260" x2="90" y2="260" stroke="#334155" strokeWidth="5" />
            <line x1="45" y1="290" x2="95" y2="290" stroke="#334155" strokeWidth="5" />

            {/* Transformer Can */}
            <rect x="75" y="300" width="22" height="36" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="86" cy="310" r="3" fill="#94A3B8" />

            {/* Ceramic Insulators */}
            <rect x="45" y="250" width="8" height="10" fill="#94A3B8" rx="2" />
            <rect x="87" y="250" width="8" height="10" fill="#94A3B8" rx="2" />
            <rect x="40" y="280" width="8" height="10" fill="#94A3B8" rx="2" />
            <rect x="92" y="280" width="8" height="10" fill="#94A3B8" rx="2" />

            {/* Utility Grid Hotspot Dot */}
            <circle 
              cx="70" 
              cy="230" 
              r="14" 
              fill={state.gridConfig.isConnected ? (metrics.gridImportW > 0 ? '#F59E0B' : '#2ECC71') : '#E11D48'}
              opacity="0.25"
              className="animate-ping"
            />
            <circle 
              cx="70" 
              cy="230" 
              r="8" 
              fill={state.gridConfig.isConnected ? (metrics.gridImportW > 0 ? '#F59E0B' : '#2ECC71') : '#E11D48'} 
              stroke="#FFFFFF" 
              strokeWidth="2" 
            />
          </g>

          {/* ========================================================== */}
          {/* MAIN HOUSE ARCHITECTURAL CUTAWAY                           */}
          {/* ========================================================== */}
          
          {/* Outer Building Silhouette */}
          <path
            d="M 180,520 L 180,260 L 370,110 L 740,110 L 740,520 Z"
            fill="url(#wallExtGrad)"
            stroke="#2E3846"
            strokeWidth="3"
          />

          {/* Pitched Roof Section */}
          <polygon
            points="160,268 370,102 755,102 755,122 365,122 170,278"
            fill="url(#roofGrad)"
            stroke="#3B4758"
            strokeWidth="2"
          />

          {/* Garage / Carport Outbuilding on Right */}
          <path
            d="M 740,320 L 920,320 L 920,520 L 740,520 Z"
            fill="#141920"
            stroke="#26313D"
            strokeWidth="2"
          />
          <polygon
            points="735,320 925,320 925,335 735,335"
            fill="#232C37"
            stroke="#3B4758"
            strokeWidth="1.5"
          />

          {/* ========================================================== */}
          {/* ROOFTOP SOLAR PV SYSTEM                                     */}
          {/* ========================================================== */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectComponent('solar')}
            onMouseEnter={() => setHoveredHotspot('solar')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Array Mounting Rack */}
            <polygon
              points="385,100 720,100 705,116 370,116"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Individual PV Panels Matrix */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <polygon
                key={`pv-${i}`}
                points={`${380 + i * 47},98 ${422 + i * 47},98 ${412 + i * 47},116 ${370 + i * 47},116`}
                fill="url(#solarPanelGrad)"
                stroke="#38BDF8"
                strokeWidth={selectedComponentId === 'solar' ? '2.5' : '1'}
                opacity={solarFlowActive ? '0.95' : '0.6'}
                className="transition-all duration-300"
              />
            ))}

            {/* Panel Grid Lines for Realism */}
            <line x1="375" y1="107" x2="710" y2="107" stroke="#38BDF8" strokeWidth="0.8" opacity="0.7" />

            {/* Solar Hotspot Pin */}
            <circle cx="550" cy="85" r="14" fill="#F59E0B" opacity="0.3" className="animate-ping" />
            <circle cx="550" cy="85" r="7" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
          </g>

          {/* ========================================================== */}
          {/* INTERIOR ROOM ROOM CUTAWAYS                                */}
          {/* ========================================================== */}

          {/* SECOND FLOOR: Bedroom & Study */}
          <rect x="210" y="150" width="500" height="160" fill="url(#roomInteriorGrad)" stroke="#222A36" strokeWidth="2" rx="4" />
          <line x1="450" y1="150" x2="450" y2="310" stroke="#252F3C" strokeWidth="2" strokeDasharray="4 4" />

          {/* Room Label: 2F Left - Climate Suite */}
          <text x="225" y="172" fill="#71717A" fontSize="11" fontFamily="monospace" fontWeight="600">
            ROOM 201 • CLIMATE SUITE
          </text>
          
          {/* Room Label: 2F Right - Smart Study */}
          <text x="465" y="172" fill="#71717A" fontSize="11" fontFamily="monospace" fontWeight="600">
            ROOM 202 • WORKSTATION & STUDY
          </text>

          {/* FIRST FLOOR: Living / Dining & Kitchen */}
          <rect x="210" y="335" width="500" height="175" fill="url(#roomInteriorGrad)" stroke="#222A36" strokeWidth="2" rx="4" />
          <line x1="450" y1="335" x2="450" y2="510" stroke="#252F3C" strokeWidth="2" strokeDasharray="4 4" />

          {/* Room Label: 1F Left - Living & Entertainment */}
          <text x="225" y="357" fill="#71717A" fontSize="11" fontFamily="monospace" fontWeight="600">
            ROOM 101 • MAIN LIVING & MEDIA
          </text>
          
          {/* Room Label: 1F Right - Kitchen & Base Utilities */}
          <text x="465" y="357" fill="#71717A" fontSize="11" fontFamily="monospace" fontWeight="600">
            ROOM 102 • KITCHEN & STORAGE
          </text>

          {/* Floor Divider Slab */}
          <rect x="195" y="310" width="530" height="25" fill="#181F28" stroke="#283341" strokeWidth="1" />
          <line x1="200" y1="322" x2="720" y2="322" stroke="#2ECC71" strokeWidth="1" opacity="0.3" />

          {/* ========================================================== */}
          {/* APPLIANCES & ELECTRICAL LOADS (CLICKABLE HOTSPOTS)        */}
          {/* ========================================================== */}

          {/* 1. AIR CONDITIONER (2F Left) */}
          <g
            className="cursor-pointer group"
            onClick={() => acApp && toggleAppliance(acApp.id)}
            onMouseEnter={() => setHoveredHotspot('ac')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* AC Unit Box */}
            <rect
              x="230"
              y="190"
              width="70"
              height="30"
              rx="4"
              fill={acApp?.isOn ? '#1E293B' : '#0F172A'}
              stroke={acApp?.isOn ? '#38BDF8' : '#334155'}
              strokeWidth={acApp?.isOn ? '2' : '1'}
            />
            {/* Louvers */}
            <line x1="235" y1="212" x2="295" y2="212" stroke={acApp?.isOn ? '#38BDF8' : '#475569'} strokeWidth="1.5" />
            <line x1="235" y1="216" x2="295" y2="216" stroke={acApp?.isOn ? '#38BDF8' : '#475569'} strokeWidth="1.5" />
            {/* Cooling Airwaves if ON */}
            {acApp?.isOn && (
              <g opacity="0.75" stroke="#38BDF8" strokeWidth="1.5" fill="none">
                <path d="M 245,224 Q 255,232 265,224" />
                <path d="M 265,224 Q 275,232 285,224" />
              </g>
            )}
            {/* Status dot */}
            <circle cx="290" cy="198" r="3" fill={acApp?.isOn ? '#2ECC71' : '#64748B'} />
            {/* Hotspot Pin */}
            <circle cx="265" cy="190" r="10" fill="#38BDF8" opacity={acApp?.isOn ? '0.3' : '0.1'} />
            <circle cx="265" cy="190" r="5" fill={acApp?.isOn ? '#38BDF8' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* 2. CEILING FAN (2F Left) */}
          <g
            className="cursor-pointer group"
            onClick={() => fanApp && toggleAppliance(fanApp.id)}
            onMouseEnter={() => setHoveredHotspot('fan')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <line x1="360" y1="150" x2="360" y2="185" stroke="#64748B" strokeWidth="2" />
            <circle cx="360" cy="188" r="7" fill={fanApp?.isOn ? '#2ECC71' : '#475569'} />
            {/* Fan Blades */}
            <ellipse cx="335" cy="188" rx="20" ry="4" fill={fanApp?.isOn ? '#2ECC71' : '#334155'} opacity="0.8" />
            <ellipse cx="385" cy="188" rx="20" ry="4" fill={fanApp?.isOn ? '#2ECC71' : '#334155'} opacity="0.8" />
            <circle cx="360" cy="188" r="4" fill={fanApp?.isOn ? '#2ECC71' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* 3. COMPUTER WORKSTATION (2F Right) */}
          <g
            className="cursor-pointer group"
            onClick={() => compApp && toggleAppliance(compApp.id)}
            onMouseEnter={() => setHoveredHotspot('computer')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Desk */}
            <rect x="530" y="260" width="85" height="6" rx="1" fill="#475569" />
            <line x1="540" y1="266" x2="540" y2="305" stroke="#334155" strokeWidth="3" />
            <line x1="605" y1="266" x2="605" y2="305" stroke="#334155" strokeWidth="3" />
            {/* Monitor */}
            <rect
              x="555"
              y="225"
              width="36"
              height="26"
              rx="2"
              fill={compApp?.isOn ? '#0284C7' : '#0F172A'}
              stroke={compApp?.isOn ? '#38BDF8' : '#334155'}
              strokeWidth="1.5"
            />
            <line x1="573" y1="251" x2="573" y2="260" stroke="#64748B" strokeWidth="2" />
            {/* Glowing Screen */}
            {compApp?.isOn && (
              <rect x="558" y="228" width="30" height="20" rx="1" fill="#38BDF8" opacity="0.6" filter="url(#glowCyan)" />
            )}
            <circle cx="573" cy="225" r="4" fill={compApp?.isOn ? '#38BDF8' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* 4. SMART TV & LIVING LIGHTING (1F Left) */}
          <g
            className="cursor-pointer group"
            onClick={() => lightsApp && toggleAppliance(lightsApp.id)}
            onMouseEnter={() => setHoveredHotspot('lights')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Ceiling Light Fixtures */}
            <line x1="330" y1="335" x2="330" y2="365" stroke="#64748B" strokeWidth="1.5" />
            <circle
              cx="330"
              cy="368"
              r="7"
              fill={lightsApp?.isOn ? '#FDE047' : '#334155'}
              stroke="#FFF"
              strokeWidth="1"
              filter={lightsApp?.isOn ? 'url(#glowGold)' : undefined}
            />
            {lightsApp?.isOn && (
              <polygon points="310,430 350,430 338,375 322,375" fill="#FEF08A" opacity="0.15" />
            )}
          </g>

          {/* Entertainment TV Unit */}
          <g>
            <rect x="235" y="415" width="55" height="36" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <rect x="240" y="420" width="45" height="26" rx="1" fill="#1E293B" />
            <line x1="262" y1="451" x2="262" y2="465" stroke="#475569" strokeWidth="2" />
            <line x1="250" y1="465" x2="275" y2="465" stroke="#475569" strokeWidth="2" />
          </g>

          {/* 5. REFRIGERATOR (1F Right) */}
          <g
            className="cursor-pointer group"
            onClick={() => fridgeApp && toggleAppliance(fridgeApp.id)}
            onMouseEnter={() => setHoveredHotspot('fridge')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <rect
              x="635"
              y="380"
              width="45"
              height="85"
              rx="3"
              fill={fridgeApp?.isOn ? '#1E293B' : '#0F172A'}
              stroke={fridgeApp?.isOn ? '#2ECC71' : '#334155'}
              strokeWidth={fridgeApp?.isOn ? '2' : '1'}
            />
            {/* Fridge Door split */}
            <line x1="635" y1="415" x2="680" y2="415" stroke="#334155" strokeWidth="1.5" />
            {/* Handles */}
            <line x1="640" y1="395" x2="640" y2="408" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="640" y1="425" x2="640" y2="445" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            {/* Dispenser display */}
            <rect x="655" y="390" width="12" height="15" rx="1" fill="#0284C7" opacity={fridgeApp?.isOn ? '0.8' : '0.2'} />
            <circle cx="657" cy="380" r="4" fill={fridgeApp?.isOn ? '#2ECC71' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* 6. WATER PUMP / UTILITY HYDRO (1F Right Bottom) */}
          <g
            className="cursor-pointer group"
            onClick={() => pumpApp && toggleAppliance(pumpApp.id)}
            onMouseEnter={() => setHoveredHotspot('pump')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <rect
              x="500"
              y="445"
              width="40"
              height="35"
              rx="4"
              fill={pumpApp?.isOn ? '#1E293B' : '#0F172A'}
              stroke={pumpApp?.isOn ? '#06B6D4' : '#334155'}
              strokeWidth={pumpApp?.isOn ? '2' : '1'}
            />
            <circle cx="520" cy="462" r="10" fill="#0E7490" opacity={pumpApp?.isOn ? '0.8' : '0.3'} />
            {/* Impeller cross */}
            <line x1="514" y1="462" x2="526" y2="462" stroke="#E0F2FE" strokeWidth="2" />
            <line x1="520" y1="456" x2="520" y2="468" stroke="#E0F2FE" strokeWidth="2" />
            <circle cx="520" cy="445" r="4" fill={pumpApp?.isOn ? '#06B6D4' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* ========================================================== */}
          {/* EXTERNAL OUTDOOR EQUIPMENT: INVERTER, BESS & HVAC          */}
          {/* ========================================================== */}

          {/* HYBRID INVERTER (Mounted on Left External Wall) */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectComponent('inverter')}
            onMouseEnter={() => setHoveredHotspot('inverter')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Inverter Enclosure */}
            <rect
              x="142"
              y="335"
              width="34"
              height="55"
              rx="3"
              fill="#1E2632"
              stroke={selectedComponentId === 'inverter' ? '#38BDF8' : '#475569'}
              strokeWidth={selectedComponentId === 'inverter' ? '2.5' : '1.5'}
            />
            {/* LCD Screen on Inverter */}
            <rect x="148" y="344" width="22" height="15" rx="1" fill="#082F49" />
            <text x="150" y="354" fill="#38BDF8" fontSize="7" fontFamily="monospace">
              {metrics.isInverterOverloaded ? 'ERR' : `${(metrics.inverterOutputW / 1000).toFixed(1)}k`}
            </text>
            {/* Cooling Fin Lines */}
            <line x1="147" y1="367" x2="171" y2="367" stroke="#334155" strokeWidth="1" />
            <line x1="147" y1="373" x2="171" y2="373" stroke="#334155" strokeWidth="1" />
            <line x1="147" y1="379" x2="171" y2="379" stroke="#334155" strokeWidth="1" />

            {/* Inverter Hotspot Pin */}
            <circle cx="159" cy="335" r="10" fill="#38BDF8" opacity="0.3" className="animate-ping" />
            <circle cx="159" cy="335" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* BATTERY ENERGY STORAGE (BESS) CABINET (Left Ground Wall) */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectComponent('battery')}
            onMouseEnter={() => setHoveredHotspot('battery')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* BESS Cabinet Enclosure */}
            <rect
              x="135"
              y="410"
              width="45"
              height="95"
              rx="4"
              fill="#18202A"
              stroke={selectedComponentId === 'battery' ? '#2ECC71' : '#3B4856'}
              strokeWidth={selectedComponentId === 'battery' ? '2.5' : '1.5'}
            />
            {/* Battery SoC LED bar graph */}
            <rect x="145" y="422" width="25" height="6" rx="1" fill="#0F172A" />
            <rect
              x="145"
              y="422"
              width={25 * (state.batteryConfig.socPct / 100)}
              height="6"
              rx="1"
              fill={state.batteryConfig.socPct < 20 ? '#E11D48' : '#2ECC71'}
            />
            {/* Modular battery pack seam lines */}
            <line x1="139" y1="445" x2="176" y2="445" stroke="#25303D" strokeWidth="1.5" />
            <line x1="139" y1="468" x2="176" y2="468" stroke="#25303D" strokeWidth="1.5" />
            {/* BESS Brand Logo glyph */}
            <text x="148" y="492" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">
              BESS
            </text>

            {/* Battery Hotspot Pin */}
            <circle cx="157" cy="410" r="10" fill="#2ECC71" opacity="0.3" className="animate-ping" />
            <circle cx="157" cy="410" r="5" fill="#2ECC71" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* OUTDOOR HVAC CHILLER / HEAT PUMP (Ground Far Left) */}
          <g>
            <rect x="90" y="465" width="35" height="40" rx="3" fill="#1C232E" stroke="#334155" strokeWidth="1.5" />
            <circle cx="107" cy="485" r="14" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            {/* HVAC Fan Fan blades */}
            <line x1="97" y1="485" x2="117" y2="485" stroke="#64748B" strokeWidth="1.5" />
            <line x1="107" y1="475" x2="107" y2="495" stroke="#64748B" strokeWidth="1.5" />
          </g>

          {/* ========================================================== */}
          {/* EV CHARGER & ELECTRIC VEHICLE (RIGHT CARPORT)              */}
          {/* ========================================================== */}
          
          {/* Wall-Mount EV Charger */}
          <g
            className="cursor-pointer group"
            onClick={() => evApp && toggleAppliance(evApp.id)}
            onMouseEnter={() => setHoveredHotspot('ev')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <rect
              x="755"
              y="380"
              width="24"
              height="40"
              rx="3"
              fill={evApp?.isOn ? '#1E293B' : '#0F172A'}
              stroke={evApp?.isOn ? '#2ECC71' : '#475569'}
              strokeWidth={evApp?.isOn ? '2' : '1'}
            />
            <circle cx="767" cy="392" r="5" fill={evApp?.isOn ? '#2ECC71' : '#64748B'} />
            {/* Charging Cable coiled to vehicle */}
            <path
              d="M 767,420 Q 775,460 805,450"
              fill="none"
              stroke={evApp?.isOn ? '#2ECC71' : '#475569'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* EV Charger Pin */}
            <circle cx="767" cy="380" r="4" fill={evApp?.isOn ? '#2ECC71' : '#64748B'} stroke="#FFF" strokeWidth="1" />
          </g>

          {/* Electric Vehicle (Sedan Silhouette) */}
          <g
            className="cursor-pointer group"
            onClick={() => evApp && toggleAppliance(evApp.id)}
          >
            {/* Car Body */}
            <path
              d="M 780,470 L 805,445 L 870,445 L 905,465 L 925,475 L 925,495 L 775,495 Z"
              fill="#1E2632"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Windows */}
            <polygon points="812,448 845,448 845,465 798,465" fill="#0C4A6E" opacity="0.8" />
            <polygon points="850,448 875,448 895,465 850,465" fill="#0C4A6E" opacity="0.8" />
            {/* Wheels */}
            <circle cx="805" cy="495" r="15" fill="#0F172A" stroke="#475569" strokeWidth="3" />
            <circle cx="805" cy="495" r="6" fill="#94A3B8" />
            <circle cx="895" cy="495" r="15" fill="#0F172A" stroke="#475569" strokeWidth="3" />
            <circle cx="895" cy="495" r="6" fill="#94A3B8" />
            {/* Headlights */}
            <polygon points="775,475 780,475 780,482 775,482" fill="#E2E8F0" />
            {/* Charging Inlet Glow if charging */}
            {evApp?.isOn && (
              <circle cx="805" cy="450" r="6" fill="#2ECC71" opacity="0.8" filter="url(#glowGreen)" />
            )}
          </g>

          {/* ========================================================== */}
          {/* ENERGY FLOW CONDUITS & DYNAMIC BUS LINES                   */}
          {/* ========================================================== */}

          {/* Conduit 1: DC Flow - Rooftop Solar PV -> Inverter */}
          <path
            d="M 370,116 L 160,116 L 160,335"
            fill="none"
            stroke={solarFlowActive ? '#F59E0B' : '#334155'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={solarFlowActive ? 'flow-dc' : undefined}
          />

          {/* Conduit 2: DC Flow - Inverter <-> BESS Battery */}
          <path
            d="M 160,390 L 160,410"
            fill="none"
            stroke={batteryFlowActive ? '#2ECC71' : '#334155'}
            strokeWidth="3.5"
            strokeLinecap="round"
            className={batteryFlowActive ? 'flow-dc' : undefined}
          />

          {/* Conduit 3: Grid Feed - Grid Pole -> Inverter / Breaker */}
          <path
            d="M 70,230 L 120,230 L 120,355 L 142,355"
            fill="none"
            stroke={
              !state.gridConfig.isConnected 
                ? '#E11D48' 
                : metrics.effectiveNetGridW > 0 
                  ? '#F59E0B' 
                  : metrics.effectiveNetGridW < 0 
                    ? '#2ECC71' 
                    : '#334155'
            }
            strokeWidth="3"
            strokeDasharray={!state.gridConfig.isConnected ? '4 4' : undefined}
            className={
              state.gridConfig.isConnected
                ? metrics.effectiveNetGridW > 0
                  ? 'flow-grid-import'
                  : metrics.effectiveNetGridW < 0
                    ? 'flow-grid-export'
                    : undefined
                : undefined
            }
          />

          {/* Conduit 4: AC Distribution Bus - Inverter -> Home Interior Subpanels */}
          <path
            d="M 176,355 L 210,355 L 210,210 L 230,210"
            fill="none"
            stroke={homeLoadActive ? '#38BDF8' : '#334155'}
            strokeWidth="2.5"
            className={homeLoadActive ? 'flow-ac' : undefined}
          />
          <path
            d="M 210,210 L 450,210 L 530,240"
            fill="none"
            stroke={homeLoadActive ? '#38BDF8' : '#334155'}
            strokeWidth="2"
            className={homeLoadActive ? 'flow-ac' : undefined}
          />
          <path
            d="M 210,355 L 330,355 L 450,355 L 635,420"
            fill="none"
            stroke={homeLoadActive ? '#38BDF8' : '#334155'}
            strokeWidth="2"
            className={homeLoadActive ? 'flow-ac' : undefined}
          />
          {/* Branch to Carport EV */}
          <path
            d="M 635,420 L 710,420 L 755,400"
            fill="none"
            stroke={evApp?.isOn ? '#2ECC71' : '#334155'}
            strokeWidth="2"
            className={evApp?.isOn ? 'flow-ac' : undefined}
          />

          {/* ========================================================== */}
          {/* LIVE TELEMETRY CALLOUT TAGS / BADGES                       */}
          {/* ========================================================== */}

          {/* Solar Callout Badge */}
          <g transform="translate(560, 48)">
            <rect x="0" y="0" width="135" height="34" rx="6" fill="#141920" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="10" y="15" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">ROOFTOP SOLAR PV</text>
            <text x="10" y="27" fill="#F59E0B" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {metrics.solarGenerationKW.toFixed(2)} kW
            </text>
            <text x="88" y="26" fill="#64748B" fontSize="9" fontFamily="sans-serif">
              {state.solarConfig.installedCapacityKW}kWp
            </text>
          </g>

          {/* Inverter Callout Badge */}
          <g transform="translate(18, 360)">
            <rect x="0" y="0" width="112" height="34" rx="6" fill="#141920" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="8" y="14" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">HYBRID INVERTER</text>
            <text x="8" y="27" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {(metrics.inverterOutputW / 1000).toFixed(2)} kW
            </text>
            <text x="75" y="26" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              {state.inverterConfig.ratedCapacityKW}kVA
            </text>
          </g>

          {/* Battery Callout Badge */}
          <g transform="translate(18, 435)">
            <rect x="0" y="0" width="112" height="34" rx="6" fill="#141920" stroke="#2ECC71" strokeWidth="1.5" />
            <text x="8" y="14" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">BESS STORAGE</text>
            <text x="8" y="27" fill="#2ECC71" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {state.batteryConfig.socPct}%
            </text>
            <text x="46" y="26" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
              | {state.batteryConfig.capacityKWh}kWh
            </text>
          </g>

          {/* Grid Callout Badge */}
          <g transform="translate(12, 175)">
            <rect 
              x="0" 
              y="0" 
              width="120" 
              height="36" 
              rx="6" 
              fill="#141920" 
              stroke={!state.gridConfig.isConnected ? '#E11D48' : '#2ECC71'} 
              strokeWidth="1.5" 
            />
            <text x="8" y="14" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">
              UTILITY INTERTIE
            </text>
            <text 
              x="8" 
              y="28" 
              fill={!state.gridConfig.isConnected ? '#E11D48' : metrics.gridImportW > 0 ? '#F59E0B' : '#2ECC71'} 
              fontSize="11" 
              fontFamily="monospace" 
              fontWeight="bold"
            >
              {!state.gridConfig.isConnected 
                ? 'ISLANDED [OFF]' 
                : metrics.effectiveNetGridW > 0 
                  ? `+${(metrics.gridImportW / 1000).toFixed(2)} kW (Imp)`
                  : metrics.effectiveNetGridW < 0 
                    ? `-${(metrics.gridExportW / 1000).toFixed(2)} kW (Exp)`
                    : 'BALANCED'}
            </text>
          </g>

          {/* EV Charger Badge */}
          <g transform="translate(770, 335)">
            <rect 
              x="0" 
              y="0" 
              width="110" 
              height="32" 
              rx="6" 
              fill="#141920" 
              stroke={evApp?.isOn ? '#2ECC71' : '#475569'} 
              strokeWidth="1.5" 
            />
            <text x="8" y="13" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">SMART EV CHARGER</text>
            <text x="8" y="25" fill={evApp?.isOn ? '#2ECC71' : '#71717A'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              {evApp?.isOn ? `${((evApp.wattage || 3200) / 1000).toFixed(1)} kW (Charging)` : 'STANDBY'}
            </text>
          </g>
        </svg>

        {/* Floating Quick Legend at Bottom-Left */}
        <div className="absolute bottom-3 left-4 hidden sm:flex items-center space-x-3 bg-[#10141a]/90 px-3 py-1.5 rounded-lg border border-[#232931] backdrop-blur text-[11px] font-mono text-[#A1A1AA]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 rounded bg-[#F59E0B]"></span>
            <span>DC Flow (Solar/Battery)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 rounded bg-[#38BDF8]"></span>
            <span>AC Flow (Home Load)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 rounded bg-[#2ECC71]"></span>
            <span>Grid Intertie</span>
          </div>
        </div>

        {/* Floating Grid Islanded Alert if Disconnected */}
        {!state.gridConfig.isConnected && (
          <div className="absolute top-16 left-4 flex items-center space-x-2 bg-crimson-950/90 border border-crimson-600/60 text-crimson-200 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-lg">
            <ShieldAlert className="w-4 h-4 text-crimson-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">ISLANDED MICROGRID MODE:</span> Disconnected from grid.
              {metrics.unmetDemandW > 0 && (
                <span className="block text-[11px] text-crimson-300">
                  Deficit: {(metrics.unmetDemandW / 1000).toFixed(2)} kW cannot be met.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Appliance Quick-Toggle Bar inside Visualizer */}
      <div className="px-5 py-3 bg-[#11151b] border-t border-[#232931] flex items-center justify-between overflow-x-auto gap-3">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono font-medium text-[#71717A] uppercase tracking-wider">
            Quick Toggle:
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {state.appliances.map((app) => (
            <button
              key={app.id}
              onClick={() => toggleAppliance(app.id)}
              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                app.isOn
                  ? 'bg-[#18261F] border-[#2ECC71]/40 text-[#2ECC71]'
                  : 'bg-[#14191f] border-[#232931] text-[#71717A] hover:text-[#A1A1AA]'
              }`}
              title={`${app.name} (${app.wattage}W) - Click to toggle`}
            >
              <Power className={`w-3 h-3 ${app.isOn ? 'text-[#2ECC71]' : 'text-[#71717A]'}`} />
              <span className="truncate max-w-[100px]">{app.name}</span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {app.isOn ? `${app.wattage}W` : 'OFF'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
