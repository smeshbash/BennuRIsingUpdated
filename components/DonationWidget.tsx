import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, HeartHandshake, Info, ChevronDown, Heart } from 'lucide-react';
import { WINGS_PILLARS } from "../constants";
import { WingSelector } from "./WingSelector";
import { DonationFrequency, DonationFund, DonationTier } from '../types';
import { DONATION_TIERS, DONATION_FUNDS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface DonationWidgetProps {
  className?: string;
  defaultFrequency?: DonationFrequency;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({ className = "", defaultFrequency = 'monthly' }) => {
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState<DonationFrequency>(defaultFrequency);
  const [amount, setAmount] = useState<number | string>(1000);
  const [funds, setFunds] = useState<DonationFund[]>(DONATION_FUNDS);
  const [fund, setFund] = useState<string>('');
  const [isPillarsOpen, setIsPillarsOpen] = useState(true);
  const [tiers, setTiers] = useState<DonationTier[]>(DONATION_TIERS);
  const [isOther, setIsOther] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enable80gTaxExemption, setEnable80gTaxExemption] = useState(false);
  
  // Dynamic Labels
  const [labels, setLabels] = useState({
      title: "Make a Difference",
      subtitle: "Your contribution brings healing.",
      btnLabel: "Donate & Change a Life",
      monthlyLabel: "MONTHLY",
      onceLabel: "GIVE ONCE",
      customAmountLabel: "I can contribute more...",
      secureText: "256-bit Secure",
      taxText: "Section 80G Tax Exempt"
  });

  useEffect(() => {
      const fetchConfig = async () => {
          if (isSupabaseConfigured()) {
              const { data: dFunds } = await supabase.from('donation_funds').select('*').eq('is_active', true).order('display_order');
              if (dFunds) {
                  setFunds(dFunds);
                  if (dFunds.length > 0) {
                      setFund(dFunds[0].id);
                  } else {
                      setFund('');
                  }
              }

              // Fetch Tiers & Labels
              const { data: systemData } = await supabase.from('system_settings').select('*').in('key', ['donation_tiers', 'widget_labels_json', 'enable_80g_tax_exemption']);
              
              if (systemData) {
                  const tiersJson = systemData.find(d => d.key === 'donation_tiers')?.value;
                  if (tiersJson) { try { setTiers(JSON.parse(tiersJson)); } catch(e) {} }

                  const tax = systemData.find(d => d.key === 'enable_80g_tax_exemption')?.value;
                  if (tax) setEnable80gTaxExemption(tax === 'true');

                  const labelsJson = systemData.find(d => d.key === 'widget_labels_json')?.value;
                  if (labelsJson) { 
                      try { 
                          const l = JSON.parse(labelsJson);
                          setLabels(prev => ({...prev, ...l}));
                      } catch(e) {} 
                  }
              }

          } else {
              setFund(DONATION_FUNDS[0].id);
          }
      };
      fetchConfig();
  }, []);

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setIsOther(false);
  };

  const handleOtherClick = () => {
    setIsOther(true);
    setAmount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        navigate(`/donate?amt=${amount}&freq=${frequency}&fund=${fund}`);
    }, 500);
  };

  return (
    <div className={`bg-brand-light p-8 rounded-3xl shadow-skeuo-raised max-w-md w-full relative overflow-hidden border border-white/50 ${className}`}>
      {/* Decorative metal screw/element */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>
      <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>

      <div className="relative z-10 mb-6 text-center">
        <h3 className="text-2xl font-serif-heading font-bold text-brand-blue mb-1 drop-shadow-sm">
          {labels.title}
        </h3>
        <p className="text-gray-500 text-sm font-medium">{labels.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Toggle Switch */}
        <div className="flex mb-4 bg-brand-light p-1.5 rounded-2xl shadow-skeuo-pressed">
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              frequency === 'monthly' 
                ? 'bg-brand-blue text-white shadow-lg transform scale-95' 
                : 'text-gray-500 hover:text-brand-blue'
            }`}
          >
            {labels.monthlyLabel}
          </button>
          <button
            type="button"
            onClick={() => setFrequency('once')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              frequency === 'once' 
                ? 'bg-brand-blue text-white shadow-lg transform scale-95' 
                : 'text-gray-500 hover:text-brand-blue'
            }`}
          >
            {labels.onceLabel}
          </button>
        </div>

        {/* Cause Selection - Wing Earmarking */}
        <div className="mb-4 bg-brand-light p-4 rounded-xl shadow-skeuo-pressed border border-white/50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Your Impact Allocation (Earmark)</label>
          <div className="relative">
              <WingSelector
                  value={fund}
                  onChange={setFund}
              />
          </div>
          <div className="mt-3 flex items-start text-[10px] text-gray-500 font-medium leading-tight">
              <Info className="w-3 h-3 text-brand-blue mr-1.5 flex-shrink-0 mt-0.5" />
              <span>By default, donations go to our General Fund to be deployed where most urgently needed.</span>
          </div>
        </div>

        {/* Amount Grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {tiers.map((tier) => {
            const isActive = !isOther && Number(amount) === tier.amount;
            return (
                <button
                key={tier.amount}
                type="button"
                onClick={() => handleAmountClick(tier.amount)}
                className={`py-4 text-sm font-bold rounded-xl transition-all flex flex-col items-center justify-center active:scale-95 duration-200 ${
                    isActive
                    ? 'bg-brand-blue text-white shadow-skeuo-pressed border-2 border-transparent'
                    : 'bg-brand-light text-gray-600 shadow-skeuo-raised hover:bg-gray-50 border border-white'
                }`}
                >
                <span>₹{tier.amount}</span>
                </button>
            );
          })}
        </div>
        
        {/* Custom Amount Tab Button */}
        <button
          type="button"
          onClick={handleOtherClick}
          className={`w-full py-4 mb-6 text-sm font-bold rounded-xl transition-all flex flex-col items-center justify-center active:scale-95 duration-200 ${
              isOther
              ? 'bg-brand-blue text-white shadow-skeuo-pressed border-2 border-transparent'
              : 'bg-brand-light text-gray-600 shadow-skeuo-raised hover:bg-gray-50 border border-white'
          }`}
        >
          <span>{labels.customAmountLabel}</span>
        </button>
        
        {/* Custom Input Field - Only Visible when Custom is Selected */}
        {isOther && (
            <div className="mb-6 animate-fade-in relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue font-bold">₹</span>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 pr-4 py-4 rounded-xl bg-brand-light shadow-skeuo-input font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all border border-transparent focus:border-brand-blue/30"
                    autoFocus
                />
            </div>
        )}

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full bg-gradient-to-b from-brand-red to-[#b92b14] hover:from-[#ff5c4d] hover:to-brand-red text-white text-lg font-bold py-4 rounded-2xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center group border-t border-white/20"
        >
          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <>
                {labels.btnLabel} <HeartHandshake className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </>
          )}
        </button>

        <div className="mt-5 flex flex-col items-center justify-center text-center space-y-2">
           <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-200/50 px-3 py-1 rounded-full shadow-inner">
             <ShieldCheck className="w-3 h-3 mr-1 text-brand-green" />
             {labels.secureText}
           </div>
           <p className="text-[10px] text-gray-400 font-medium">
             {enable80gTaxExemption ? labels.taxText : ""}
           </p>
        </div>
      </form>
    </div>
  );
};

export default DonationWidget;