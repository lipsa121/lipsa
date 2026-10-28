import React, { useState } from 'react';
import { 
  Wind, 
  Fan, 
  Lightbulb, 
  Refrigerator, 
  Droplets, 
  Monitor, 
  Car, 
  Power, 
  Edit3, 
  Check, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { Appliance } from '../../types/simulation';
import { useEnergySimulation } from '../../context/EnergySimulationContext';

interface ApplianceCardProps {
  appliance: Appliance;
  compact?: boolean;
}

export const ApplianceCard: React.FC<ApplianceCardProps> = ({ appliance, compact = false }) => {
  const { toggleAppliance, updateApplianceWattage } = useEnergySimulation();
  const [isEditing, setIsEditing] = useState(false);
  const [editWattage, setEditWattage] = useState(appliance.wattage.toString());

  const getIcon = (name: string) => {
    switch (name) {
      case 'Wind':
        return Wind;
      case 'Fan':
        return Fan;
      case 'Lightbulb':
        return Lightbulb;
      case 'Refrigerator':
        return Refrigerator;
      case 'Droplets':
        return Droplets;
      case 'Monitor':
        return Monitor;
      case 'Car':
        return Car;
      default:
        return Zap;
    }
  };

  const Icon = getIcon(appliance.iconName);

  const handleSaveWattage = () => {
    const parsed = parseInt(editWattage, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      updateApplianceWattage(appliance.id, parsed);
    } else {
      setEditWattage(appliance.wattage.toString());
    }
    setIsEditing(false);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-[#FB7185] bg-[#3B0C15] border-[#BE123C]/40';
      case 'High':
        return 'text-amber-300 bg-amber-950/60 border-amber-500/30';
      case 'Medium':
        return 'text-sky-300 bg-sky-950/60 border-sky-500/30';
      case 'Low':
        return 'text-slate-300 bg-slate-800/80 border-slate-700/40';
      case 'Deferrable':
        return 'text-[#2ECC71] bg-[#16291F] border-[#2D936C]/40';
      default:
        return 'text-slate-300 bg-slate-800 border-white/5';
    }
  };

  const getFlexibilityBadgeClass = (flex: string) => {
    switch (flex) {
      case 'Flexible':
        return 'text-[#2ECC71] border-[#2D936C]/40 bg-[#16291F]/60';
      case 'Semi-Flexible':
        return 'text-amber-300 border-amber-500/30 bg-amber-950/40';
      case 'Non-Flexible':
        return 'text-slate-400 border-slate-700/40 bg-slate-800/40';
      default:
        return 'text-slate-400 border-white/5';
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 relative overflow-hidden ${
        appliance.isOn
          ? 'bg-[#151921] border-[#2D936C]/50 shadow-[0_0_20px_rgba(27,94,63,0.18)]'
          : 'bg-[#12151B] border-[#20252F] hover:border-[#2C3442] opacity-85'
      } ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`}
    >
      {/* Active state indicator glow line */}
      {appliance.isOn && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent" />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon & Appliance Details */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              appliance.isOn
                ? 'bg-[#1B5E3F] text-emerald-200 border border-[#2ECC71]/40'
                : 'bg-[#1A1F27] text-slate-400 border border-white/5'
            }`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate tracking-tight">
              {appliance.name}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">{appliance.category}</p>
          </div>
        </div>

        {/* Right: ON/OFF Switch Button */}
        <button
          type="button"
          onClick={() => toggleAppliance(appliance.id)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151B] ${
            appliance.isOn ? 'bg-[#2ECC71]' : 'bg-[#202530]'
          }`}
          role="switch"
          aria-checked={appliance.isOn}
          aria-label={`Toggle ${appliance.name}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              appliance.isOn ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Wattage Display & Editable Mode */}
      <div className="mt-4 pt-3 border-t border-[#1F2530] flex items-center justify-between">
        <div className="text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-mono">
            Rated Power
          </span>
          {isEditing ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="number"
                min="0"
                max="10000"
                value={editWattage}
                onChange={(e) => setEditWattage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveWattage()}
                className="w-20 px-2 py-0.5 text-xs font-mono bg-[#0E1115] border border-[#2D936C] rounded text-white focus:outline-none"
                autoFocus
              />
              <span className="text-[11px] font-mono text-slate-400">W</span>
              <button
                onClick={handleSaveWattage}
                className="p-1 rounded bg-[#1B5E3F] text-white hover:bg-[#23754F]"
                title="Save wattage"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {appliance.wattage}
              </span>
              <span className="text-xs font-mono text-slate-400">W</span>
              <button
                onClick={() => {
                  setEditWattage(appliance.wattage.toString());
                  setIsEditing(true);
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Edit power rating"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Current Draw Status */}
        <div className="text-right">
          <span className="text-slate-400 block text-[10px] uppercase font-mono">
            Active Load
          </span>
          <div
            className={`font-mono text-xs font-semibold tabular-nums mt-0.5 ${
              appliance.isOn ? 'text-[#2ECC71]' : 'text-slate-400'
            }`}
          >
            {appliance.isOn ? `${appliance.wattage} W` : '0 W (Standby)'}
          </div>
        </div>
      </div>

      {/* Priority and Flexibility Tags */}
      {!compact && (
        <div className="mt-3 pt-2.5 border-t border-[#1F2530] flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
          <span
            className={`px-2 py-0.5 rounded border font-mono font-medium ${getPriorityBadgeClass(
              appliance.priority
            )}`}
          >
            {appliance.priority}
          </span>
          <span
            className={`px-2 py-0.5 rounded border font-mono ${getFlexibilityBadgeClass(
              appliance.flexibility
            )}`}
          >
            {appliance.flexibility}
          </span>
        </div>
      )}
    </div>
  );
};
