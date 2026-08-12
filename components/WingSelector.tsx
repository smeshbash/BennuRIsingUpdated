import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { WINGS_PILLARS } from '../constants';

interface WingSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Exported so any component displaying the selected fund/wing (e.g. the
// donation confirmation screen) shows the same label as the selector itself,
// instead of a separately hardcoded string that can drift out of sync.
export const getWingLabel = (value: string): string => {
  if (value === 'general') return 'General Fund (Where Needed Most)';
  for (const pillar of WINGS_PILLARS) {
    const wing = pillar.wings.find(w => w.id === value);
    if (wing) return wing.name;
  }
  return 'General Fund (Where Needed Most)';
};

export const WingSelector: React.FC<WingSelectorProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedLabel = () => getWingLabel(value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:border-brand-blue/50 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition flex items-center justify-between text-left"
      >
        <span className="font-bold text-gray-700 text-sm truncate mr-2">
          {getSelectedLabel()}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} shrink-0`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto animate-fade-in scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="p-2">
            <button
              type="button"
              onClick={() => { onChange('general'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                value === 'general' ? 'bg-brand-blue/5 text-brand-blue font-bold' : 'hover:bg-gray-50 text-gray-700 font-medium'
              }`}
            >
              <div className="flex items-center">
                <Globe className={`w-4 h-4 mr-3 ${value === 'general' ? 'text-brand-blue' : 'text-gray-400'}`} />
                <span className="text-sm">General Fund (Where Needed Most)</span>
              </div>
              {value === 'general' && <Check className="w-4 h-4 text-brand-blue" />}
            </button>
          </div>

          {WINGS_PILLARS.map((pillar) => (
            <div key={pillar.id} className="border-t border-gray-100">
              <div className="px-4 py-3 bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{pillar.name}</span>
              </div>
              <div className="p-2 space-y-1">
                {pillar.wings.map((wing) => (
                  <button
                    key={wing.id}
                    type="button"
                    onClick={() => { onChange(wing.id); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      value === wing.id ? 'bg-brand-blue/5 text-brand-blue font-bold' : 'hover:bg-gray-50 text-gray-700 text-sm font-medium'
                    }`}
                  >
                    <span className="truncate mr-4 text-sm">{wing.name}</span>
                    {value === wing.id && <Check className="w-4 h-4 text-brand-blue shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
