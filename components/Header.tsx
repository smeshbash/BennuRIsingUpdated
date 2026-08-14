
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getAllSystemSettings } from '../lib/systemSettingsCache';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobileTab, setExpandedMobileTab] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [navItems, setNavItems] = useState(NAV_ITEMS);
  const [config, setConfig] = useState({ donateLabel: "DONATE" });

  useEffect(() => {
    if (isSupabaseConfigured()) {
        getAllSystemSettings().then((data) => {
            if (data) {
                const nav = data.find(d => d.key === 'nav_structure')?.value;
                const conf = data.find(d => d.key === 'header_config_json')?.value;

                if (nav) { try { setNavItems(JSON.parse(nav)); } catch(e) { console.warn("Invalid nav JSON", e); } }
                if (conf) { try { setConfig(prev => ({...prev, ...JSON.parse(conf)})); } catch(e) {} }
            }
        });
    }
  }, []);

  const handleDonateClick = () => {
    navigate('/donate');
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    const scrollToTarget = () => {
        const section = document.getElementById('spirit-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (location.pathname === '/') {
       scrollToTarget();
    } else {
       navigate('/');
       const attemptScroll = (count: number) => {
           const section = document.getElementById('spirit-section');
           if (section) {
               section.scrollIntoView({ behavior: 'smooth' });
           } else if (count < 6) { 
               setTimeout(() => attemptScroll(count + 1), 200);
           }
       };
       setTimeout(() => attemptScroll(0), 100);
    }
    setIsOpen(false);
  };

  const toggleMobileTab = (path: string, e: React.MouseEvent) => {
      e.preventDefault();
      setExpandedMobileTab(prev => prev === path ? null : path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-light/90 backdrop-blur-md shadow-lg border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:gap-8">
          {/* Logo Section - Raised Container */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer py-2 px-6 rounded-2xl bg-brand-light shadow-skeuo-raised hover:shadow-skeuo-sm border border-white/50 active:shadow-skeuo-pressed transition-all lg:mr-4" 
            onClick={handleLogoClick}
          >
            <img 
              src="/logo1.png" 
              alt="Bennu Rising International Foundation" 
              className="h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-1 items-center">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 tracking-wide whitespace-nowrap flex items-center ${
                      isActive 
                        ? 'text-brand-blue shadow-skeuo-pressed bg-brand-light border border-transparent scale-95' 
                        : 'text-gray-600 hover:text-brand-blue hover:shadow-skeuo-sm hover:bg-white border border-transparent hover:border-white'
                    }`
                  }
                >
                  {item.label}
                  {item.subsections && item.subsections.length > 0 && (
                    <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </NavLink>
                
                {/* Dropdown Menu */}
                {item.subsections && item.subsections.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-48">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 overflow-hidden transform origin-top scale-95 group-hover:scale-100 transition-transform duration-300">
                      {item.subsections.map((sub, idx) => (
                        <Link
                          key={idx}
                          to={`${item.path}#${sub.hash}`}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-brand-light rounded-xl transition-colors text-center"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleDonateClick}
              className="ml-4 bg-gradient-to-b from-brand-red to-[#b92b14] text-white px-6 py-3 rounded-xl font-extrabold text-lg shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed active:translate-y-0.5 transition-all border-t border-white/30 tracking-wider whitespace-nowrap"
            >
              {config.donateLabel}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl text-brand-blue hover:bg-white shadow-skeuo-raised active:shadow-skeuo-pressed transition-all focus:outline-none border border-white/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden bg-brand-light border-t border-white absolute w-full shadow-2xl z-50 animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="px-6 pt-6 pb-8 space-y-3">
            {navItems.map((item) => (
              <div key={item.path} className="flex flex-col">
                <div className="flex">
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex-1 px-6 py-4 rounded-xl text-lg font-bold shadow-skeuo-sm active:shadow-skeuo-pressed transition-all ${
                        isActive ? 'text-brand-blue bg-gray-50 shadow-skeuo-pressed' : 'text-gray-700 bg-brand-light'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  
                  {item.subsections && item.subsections.length > 0 && (
                    <button
                      onClick={(e) => toggleMobileTab(item.path, e)}
                      className="ml-2 p-4 rounded-xl shadow-skeuo-sm bg-brand-light text-brand-blue active:shadow-skeuo-pressed transition-all border border-transparent focus:outline-none"
                    >
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expandedMobileTab === item.path ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                
                {/* Mobile Subsections */}
                {item.subsections && item.subsections.length > 0 && expandedMobileTab === item.path && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-brand-blue/20 flex flex-col gap-2 animate-fade-in">
                    {item.subsections.map((sub, idx) => (
                      <Link
                        key={idx}
                        to={`${item.path}#${sub.hash}`}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 text-base font-medium text-gray-600 hover:text-brand-blue bg-white/50 rounded-xl transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleDonateClick}
              className="w-full mt-6 bg-gradient-to-b from-brand-red to-[#b92b14] text-white px-6 py-4 rounded-xl font-bold text-xl shadow-skeuo-raised active:shadow-skeuo-pressed border-t border-white/20 uppercase tracking-widest"
            >
              {config.donateLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

