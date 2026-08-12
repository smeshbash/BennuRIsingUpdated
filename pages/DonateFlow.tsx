import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CircleCheck, Lock, ArrowLeft, ArrowRight, CreditCard, Loader2, Heart, FileText, ShieldCheck, User, Info, ChevronDown, Repeat, SquareCheck, ShieldAlert, Pencil } from 'lucide-react';
import { DONATION_FUNDS, RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID, WINGS_PILLARS } from '../constants';
import { WingSelector, getWingLabel } from "../components/WingSelector";
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DonationFund } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DetailsFormProps {
    amount: string;
    setAmount: (val: string) => void;
    frequency: string;
    setFrequency: (val: string) => void;
    freqLabel: string;
    funds: DonationFund[];
    selectedFund: string;
    setSelectedFund: (val: string) => void;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    wantsTaxReceipt: boolean;
    enable80gTaxExemption: boolean;
    setWantsTaxReceipt: (val: boolean) => void;
    loading: boolean;
    submitDetails: (e: React.FormEvent) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({
    amount, setAmount, frequency, setFrequency, freqLabel, funds, selectedFund, setSelectedFund, 
    formData, handleInputChange, wantsTaxReceipt, setWantsTaxReceipt, 
    loading, submitDetails, enable80gTaxExemption
}) => {
    const [isPillarsOpen, setIsPillarsOpen] = useState(true);
    return (
    <div className="animate-fade-in">
      <div className="relative z-50 rounded-[2rem] bg-gradient-to-br from-brand-blue to-[#00509d] text-white shadow-xl mb-10 ring-1 ring-white/20 group">
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -left-20 w-48 h-48 bg-brand-green/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>
                
        <div className="relative z-10 p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div className="w-full md:w-auto">
                    <div className="flex items-center space-x-2 text-blue-200 mb-2">
                        <Heart className="w-4 h-4 fill-brand-red text-brand-red animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Donation Summary</span>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center flex-wrap">
                            <span className="text-4xl md:text-6xl font-serif-heading font-bold text-white drop-shadow-md mr-1">₹</span>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/10 text-4xl md:text-6xl font-serif-heading font-bold text-white drop-shadow-md outline-none w-full max-w-[240px] placeholder-white/50 border-b-2 border-white/30 hover:border-white focus:border-white transition-all rounded px-2 py-1"
                                min="1"
                                placeholder="Amount"
                            />
                        </div>
                        <div className="flex bg-white/20 p-1 rounded-xl w-fit">
                            <button 
                                type="button"
                                onClick={() => setFrequency('once')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${frequency === 'once' ? 'bg-white text-brand-blue shadow-sm' : 'text-blue-100 hover:text-white'}`}
                            >
                                One-time
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFrequency('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${frequency === 'monthly' ? 'bg-white text-brand-blue shadow-sm' : 'text-blue-100 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-blue-300 mt-2 flex items-center font-bold uppercase tracking-wider">
                        <Pencil className="w-3 h-3 mr-1" /> Tap amount to edit
                    </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl flex items-center shadow-lg">
                     <ShieldCheck className="w-6 h-6 text-brand-green mr-3" />
                     <div className="text-left">
                         <span className="block text-[10px] uppercase font-bold text-blue-200 tracking-wider">Secure</span>
                         <span className="block text-sm font-bold text-white">Transaction</span>
                     </div>
                 </div>
            </div>
                        
            <div className="bg-white rounded-2xl p-1.5 shadow-lg">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 relative">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Your Impact Allocation (Select a Wing to Earmark)</label>
                    <div className="relative">
                        <WingSelector 
                             value={selectedFund}
                             onChange={setSelectedFund}
                         />
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-gray-500">
                        <Info className="w-4 h-4 text-brand-blue mr-2" />
                        By default, donations go to our General Fund to be deployed where most urgently needed.
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <form onSubmit={submitDetails} className="space-y-8 px-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
           <h3 className="text-2xl font-bold text-gray-800 flex items-center">
             <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center mr-4 text-brand-blue shadow-skeuo-raised border border-white">
                <User className="w-6 h-6" />
             </div>
             Donor Details
           </h3>
        </div>
                
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-4 md:col-span-1">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Title</label>
             <div className="relative">
                <select name="title" value={formData.title} onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-2xl bg-brand-light shadow-skeuo-input focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition font-bold text-gray-700 appearance-none cursor-pointer">
                <option>Mr.</option>
                <option>Ms.</option>
                <option>Mrs.</option>
                <option>Dr.</option>
                <option>Col.</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
             </div>
          </div>
          <div className="col-span-4 md:col-span-3">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">First Name *</label>
             <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-2xl bg-brand-light shadow-skeuo-input focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition font-medium text-lg placeholder-gray-400" placeholder="John" />
          </div>
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Last Name *</label>
           <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-2xl bg-brand-light shadow-skeuo-input focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition font-medium text-lg placeholder-gray-400" placeholder="Doe" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-2xl bg-brand-light shadow-skeuo-input focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition font-medium text-lg placeholder-gray-400" placeholder="john@example.com" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Phone Number *</label>
                <div className="flex shadow-skeuo-input rounded-2xl overflow-hidden bg-brand-light border border-gray-200">
                    <span className="inline-flex items-center px-5 bg-gray-100 text-gray-600 text-sm font-bold border-r border-gray-200">+91</span>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-transparent outline-none focus:bg-white transition font-medium text-lg placeholder-gray-400" placeholder="9876543210" maxLength={10} />
                </div>
            </div>
        </div>
                
        {enable80gTaxExemption && (
        <div 
             className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${wantsTaxReceipt ? 'bg-white shadow-skeuo-pressed border-brand-green/30' : 'bg-brand-light shadow-skeuo-raised border-white'}`}
             onClick={() => setWantsTaxReceipt(!wantsTaxReceipt)}
        >
            <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${wantsTaxReceipt ? 'bg-brand-green border-brand-green' : 'border-gray-300 bg-white'}`}>
                {wantsTaxReceipt && <SquareCheck className="w-4 h-4 text-white" />}
            </div>
            <div className="select-none flex-1">
                <label className="font-bold text-gray-800 cursor-pointer text-base flex items-center mb-1">
                    I want to claim 80G Tax Benefits
                    <span className="ml-3 text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md border border-green-200 tracking-wider">Tax Exempt</span>
                </label>
                <p className="text-gray-500 text-xs leading-relaxed">
                    Check this if you are an Indian citizen and wish to receive a tax exemption receipt for your donation.
                </p>
            </div>
        </div>
        )}
        
        {enable80gTaxExemption && wantsTaxReceipt && (
            <div className="animate-fade-in-up bg-green-50/50 p-6 rounded-2xl border border-green-100">
                <label className="block text-xs font-bold text-green-700 uppercase mb-3 ml-2">PAN Card Number *</label>
                <input 
                     required={wantsTaxReceipt}
                     name="pan"
                     value={formData.pan}
                     onChange={handleInputChange}
                     className="w-full p-4 border border-green-200 rounded-2xl bg-white shadow-skeuo-input focus:border-brand-green focus:ring-2 focus:ring-green-500/20 outline-none transition uppercase font-mono tracking-widest text-lg text-green-800 placeholder-green-300"
                     placeholder="ABCDE1234F"
                     maxLength={10}
                 />
                <p className="text-[11px] text-green-600 mt-2 ml-2 font-medium flex items-center">
                    <Info className="w-3 h-3 mr-1.5"/> Valid 10-digit PAN required by Govt. of India for 80G receipts.
                </p>
            </div>
        )}
        
        <button type="submit" disabled={loading || !amount || Number(amount) <= 0} className="w-full bg-gradient-to-r from-brand-red to-[#b92b14] hover:from-[#ff5c4d] hover:to-brand-red text-white text-xl font-bold py-6 rounded-2xl shadow-xl shadow-brand-red/20 transition-all transform active:scale-[0.98] active:shadow-inner flex justify-center items-center uppercase tracking-widest group mt-10 border-t border-white/20 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
              <>Proceed to Pay <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
    );
};

interface PaymentStepProps {
    setStep: (step: number) => void;
    amount: string;
    frequency: string;
    funds: DonationFund[];
    selectedFund: string;
    handleRazorpayPayment: () => void;
    loading: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ setStep, amount, frequency, funds, selectedFund, handleRazorpayPayment, loading }) => (
    <div className="animate-fade-in">
       <button onClick={() => setStep(1)} className="flex items-center text-sm text-gray-500 mb-8 hover:text-brand-blue transition-colors font-bold group bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit">
         <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Edit Details
       </button>
       <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue"></div>
                    
          <div className="bg-brand-light p-10 border-b border-gray-100">
             <div className="flex justify-between items-end mb-2">
                <div>
                   <span className="font-bold text-gray-400 uppercase tracking-widest text-xs block mb-1">Confirm Donation To</span>
                   <h3 className="font-serif-heading font-bold text-2xl text-brand-blue">{getWingLabel(selectedFund)}</h3>
                </div>
                <div className="text-right">
                   <span className="font-bold text-gray-400 uppercase tracking-widest text-xs block mb-1">Amount</span>
                   <span className="text-4xl font-bold text-brand-dark">₹{Number(amount).toLocaleString()}</span>
                </div>
             </div>
          </div>
                    
          <div className="p-12 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-8 shadow-skeuo-raised border border-white">
                <CreditCard className="w-10 h-10 text-brand-blue" />
             </div>
                          
             <h3 className="text-3xl font-bold text-gray-800 mb-3">Secure Payment Gateway</h3>
                          
             {frequency === 'monthly' && (
                 <div className="bg-blue-50 border border-brand-blue/20 text-brand-blue px-6 py-2 rounded-full text-sm font-bold flex items-center mb-6 shadow-sm">
                     <Repeat className="w-4 h-4 mr-2" />
                     Monthly Contribution Setup
                 </div>
             )}
             
             <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
                 You will be redirected to Razorpay to complete your donation securely via UPI, Credit Card, or Netbanking.
             </p>
             <div className="flex space-x-8 mb-10 grayscale opacity-60">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" alt="UPI" className="h-8" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
             </div>
             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                 <button
                     onClick={handleRazorpayPayment}
                     disabled={loading}
                    className="flex-1 bg-brand-green hover:bg-[#43a047] text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center uppercase tracking-wider border-t border-white/20"
                 >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (frequency === 'monthly' ? "Activate Monthly" : "Pay Now")}
                 </button>
             </div>
                          
             <div className="mt-6 text-xs text-gray-400 flex items-center font-bold">
                 <Lock className="w-3 h-3 mr-1.5" /> 256-bit SSL Encrypted • No card details stored.
             </div>
          </div>
       </div>
    </div>
);

interface SuccessStepProps {
    verified: boolean;
    formData: any;
    amount: string;
    funds: DonationFund[];
    selectedFund: string;
    transactionId: string;
    wantsTaxReceipt: boolean;
    enable80gTaxExemption: boolean;
    navigate: (path: string) => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ verified, formData, amount, funds, selectedFund, transactionId, wantsTaxReceipt, enable80gTaxExemption, navigate }) => (
    <div className="text-center py-16 animate-fade-in">
       <div className={`w-28 h-28 ${verified ? 'bg-green-50' : 'bg-yellow-50'} rounded-full flex items-center justify-center mx-auto mb-8 shadow-skeuo-raised border border-white`}>
          {verified ? (
              <CircleCheck className="w-14 h-14 text-brand-green" />
          ) : (
              <ShieldAlert className="w-14 h-14 text-yellow-500" />
          )}
       </div>
       <h2 className="text-4xl font-serif-heading font-bold text-gray-800 mb-4">
           {verified ? 'Thank You!' : 'Payment Received'}
       </h2>
       <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
           {verified 
            ? `Your generous donation of ₹${Number(amount).toLocaleString()} has been received successfully.` 
            : `We've received your payment of ₹${Number(amount).toLocaleString()}, but verification is taking longer than usual. Please keep your Transaction ID safe.`
           }
       </p>
              
       <div className="bg-blue-50 p-6 rounded-2xl inline-block mb-12 border border-blue-100 shadow-sm max-w-md mx-auto w-full">
            <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase text-xs">Transaction ID</span>
                    <span className="font-mono font-bold text-gray-800">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase text-xs">Verification</span>
                    {verified ? (
                         <span className="font-bold text-green-600 flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Verified & Secured</span>
                    ) : (
                         <span className="font-bold text-yellow-600 flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> Pending Check</span>
                    )}
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase text-xs">Receipt Status</span>
                    <span className="font-bold text-gray-800">Sent via Email</span>
                </div>
                {enable80gTaxExemption && wantsTaxReceipt && (
                    <div className="mt-4 pt-4 border-t border-blue-200 text-xs text-blue-600 font-bold flex items-center justify-center">
                        <FileText className="w-4 h-4 mr-2" /> 80G Tax Receipt Included
                    </div>
                )}
            </div>
       </div>
       
       <button onClick={() => navigate('/')} className="bg-brand-blue text-white px-12 py-5 rounded-2xl font-bold shadow-lg hover:bg-brand-dark transition transform hover:-translate-y-1 block mx-auto uppercase tracking-wider text-lg">
         Return Home
       </button>
    </div>
);

// --- MAIN COMPONENT ---
const DonateFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const initialAmtParam = searchParams.get('amt') || '1000';
  const initialFreqParam = searchParams.get('freq') || 'monthly';
  const initialFundId = searchParams.get('fund');
  const volunteerId = searchParams.get('vid');
  
  const [amount, setAmount] = useState<string>(initialAmtParam);
  const [frequency, setFrequency] = useState<string>(initialFreqParam);
  const [funds, setFunds] = useState<DonationFund[]>(DONATION_FUNDS);
  const [selectedFund, setSelectedFund] = useState(initialFundId || "general");
  
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [wantsTaxReceipt, setWantsTaxReceipt] = useState(false);
  
  // Dynamic Keys
  const [razorpayKey, setRazorpayKey] = useState(RAZORPAY_KEY_ID);
  const [razorpayPlan, setRazorpayPlan] = useState(RAZORPAY_PLAN_ID);
  const [enable80gTaxExemption, setEnable80gTaxExemption] = useState(false);
  
  useEffect(() => {
      if(isSupabaseConfigured()) {
          // Fetch Settings
          supabase.from('system_settings').select('*').in('key', ['razorpay_key_id', 'razorpay_plan_id', 'enable_80g_tax_exemption'])
          .then(({data}) => {
              if (data) {
                  const k = data.find(d => d.key === 'razorpay_key_id')?.value;
                  const p = data.find(d => d.key === 'razorpay_plan_id')?.value;
                  const tax = data.find(d => d.key === 'enable_80g_tax_exemption')?.value;
                  if (k) setRazorpayKey(k);
                  if (p) setRazorpayPlan(p);
                  if (tax) setEnable80gTaxExemption(tax === 'true');
              }
          });
          
          // Fetch Funds
          supabase.from('donation_funds').select('*').eq('is_active', true).order('display_order')
          .then(({data}) => {
              if (data) {
                  setFunds(data);
                  if (data.length > 0) {
                      // Validate initial fund selection against DB funds
                      const isValid = data.some((f: any) => f.id === initialFundId);
                      if (!isValid) setSelectedFund(data[0].id);
                  } else {
                      setSelectedFund('');
                  }
              }
          });
      }
  }, [initialFundId]);
  
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pan: '',
    address: ''
  });
  const [transactionId, setTransactionId] = useState('');
  const [verified, setVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // --- Input Validation & Sanitization ---
    if (name === 'phone') {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length > 15) return;
        setFormData(prev => ({ ...prev, [name]: numericValue }));
        return;
    }
    if (name === 'pan') {
        const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (cleanValue.length > 10) return;
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
        return;
    }
    if (name === 'firstName' || name === 'lastName') {
        const cleanValue = value.replace(/[^a-zA-Z\s\-\']/g, '');
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
        return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      window.scrollTo(0, 0);
    }, 800);
  };

  // Note: this used to also INSERT the donation into Supabase directly from the
  // browser using the anon key. That's been removed — it was a genuine security
  // hole (anyone with the public anon key could forge a "verified" donation row
  // via the REST API directly, no payment required, independent of this code).
  // The donations table is now written exclusively by the /api/webhooks/razorpay
  // handler, which is server-to-server and independently confirms the payment
  // with Razorpay before writing anything. This function now only updates local
  // UI state for the success screen — by this point /api/verify-payment has
  // already confirmed the payment signature is genuine, so it's safe to show
  // the donor a success screen; the durable database record is the webhook's job.
  const recordDonation = (paymentId: string) => {
      setTransactionId(paymentId);
      setVerified(true);
      setLoading(false);
      setStep(3);
      window.scrollTo(0, 0);
  };
  
  const createSubscription = async () => {
    console.log("[Frontend: Subscription] Initiating subscription. Plan:", razorpayPlan);
    try {
        if (!razorpayPlan) {
            // Muted
            return initiateStandardPayment(true);
        }
        
        const description = `Monthly Subscription for ${getWingLabel(selectedFund)}`;
        
        console.log("[Frontend: Subscription] Calling /api/create-subscription...");
        // 1. Create subscription on backend
        const subRes = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan_id: razorpayPlan,
                // Attached to the subscription so every future recurring charge
                // carries this data too, not just the first payment.
                notes: {
                    frequency: 'monthly',
                    fund_id: selectedFund,
                    donor_email: formData.email,
                    donor_name: `${formData.title} ${formData.firstName} ${formData.lastName}`,
                    volunteer_id: volunteerId || '',
                    pan_number: wantsTaxReceipt ? formData.pan : '',
                }
            })
        });
        
        const subData = await subRes.json();
        console.log("[Frontend: Subscription] Response from /api/create-subscription:", subData);
        if (!subData.subscription_id) throw new Error("Failed to create subscription: " + JSON.stringify(subData));
        


        const rzpKeySub = import.meta.env.VITE_RAZORPAY_KEY_ID;
        console.log("[Frontend: Subscription] Using Razorpay Key (VITE_RAZORPAY_KEY_ID):", rzpKeySub ? (rzpKeySub.substring(0, 8) + '...') : "MISSING");

        // 2. Initialize Razorpay for subscription
        const options = {
            key: rzpKeySub || 'mock_key',
            name: "Bennu Rising Intl. Foundation",
            description: description,
            subscription_id: subData.subscription_id,
            notes: {
                frequency: frequency,
                fund_id: selectedFund,
                donor_email: formData.email,
                is_subscription_intent: 'true'
            },
            handler: async function (response: any) {
                console.log("[Frontend: StandardPayment] Razorpay checkout success response:", response);
                try {
                    console.log("[Frontend: StandardPayment] Calling /api/verify-payment...");
                    // 3. Verify signature on backend
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    const verifyData = await verifyRes.json();
                    console.log("[Frontend: StandardPayment] Response from /api/verify-payment:", verifyData);
                    
                    if (verifyData.success) {
                        console.log("[Frontend: StandardPayment] Verification successful, recording donation.");
                        recordDonation(response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed");
                        setLoading(false);
                    }
                } catch (e) {
                    console.error("Payment verification error", e);
                    alert("Payment verification error");
                    setLoading(false);
                }
            },
            prefill: {
                name: formData.title + " " + formData.firstName + " " + formData.lastName,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#00509d"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            }
        };
        
        console.log("[Frontend: Subscription] Opening Razorpay checkout modal with options:", { ...options, key: "HIDDEN" });
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            console.error("[Frontend: Subscription] Razorpay checkout FAILED event:", response);
            setPaymentError(response?.error?.description || response?.error?.reason || JSON.stringify(response?.error) || "Unknown Razorpay Error");
            console.error("RAZORPAY ERROR RAW:", response);
            setLoading(false);
        });
        rzp.open();
    } catch (err) {
        console.error("[Frontend: Subscription] Catch block error:", err);
        setPaymentError("Failed to initialize subscription modal. Check console.");
        setLoading(false);
    }
  };
  
  const initiateStandardPayment = async (isFallbackMonthly: boolean = false) => {
    console.log("[Frontend: StandardPayment] Initiating standard payment. Amount:", amount, "Frequency:", frequency);
    try {
        const description = `${isFallbackMonthly || frequency === 'monthly' ? 'Monthly Subscription (First Installment)' : 'Donation'} for ${getWingLabel(selectedFund)}`;
        
        console.log("[Frontend: StandardPayment] Calling /api/create-order...");
        // 1. Create order on backend
        const orderRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Number(amount) })
        });
        
        const orderData = await orderRes.json();
        console.log("[Frontend: StandardPayment] Response from /api/create-order:", orderData);
        if (!orderData.order_id) throw new Error("Failed to create order: " + JSON.stringify(orderData));
        


        console.log("[Frontend: StandardPayment] Using Razorpay Key:", razorpayKey ? (razorpayKey.substring(0, 8) + '...') : "MISSING");
        // 2. Initialize Razorpay
        // Use the amount returned by the backend (already in paise, tied to this exact order_id)
        // instead of recomputing it, so it can never drift from what the order was created with.
        const options = {
            key: razorpayKey,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
            name: "Bennu Rising Intl. Foundation",
            description: description,
            order_id: orderData.order_id,
            notes: {
                frequency: frequency,
                fund_id: selectedFund,
                donor_email: formData.email,
                donor_name: `${formData.title} ${formData.firstName} ${formData.lastName}`,
                volunteer_id: volunteerId || '',
                pan_number: wantsTaxReceipt ? formData.pan : '',
                is_subscription_intent: isFallbackMonthly ? 'true' : 'false'
            },
            handler: async function (response: any) {
                console.log("[Frontend: Subscription] Razorpay checkout success response:", response);
                try {
                    console.log("[Frontend: Subscription] Calling /api/verify-payment...");
                    // 3. Verify signature on backend
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    if (verifyRes.ok) {
                        recordDonation(response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed");
                        setLoading(false);
                    }
                } catch (e) {
                    alert("Payment verification error");
                    setLoading(false);
                }
            },
            prefill: {
                name: `${formData.title} ${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#003F7F"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            }
        };
        
        console.log("[Frontend] Opening Razorpay checkout modal with options:", { ...options, key: "HIDDEN" });
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            setPaymentError(response?.error?.description || response?.error?.reason || JSON.stringify(response?.error) || "Unknown Razorpay Error");
            console.error("RAZORPAY ERROR RAW:", response);
            setLoading(false);
        });
        rzp.open();
    } catch (err) {
        console.error(err);
        setPaymentError("Failed to initialize payment modal. Check console.");
        setLoading(false);
    }
  };
  
  const handleRazorpayPayment = () => {
    setLoading(true);
    if (frequency === 'monthly' && razorpayPlan) {
        createSubscription();
    } else {
        initiateStandardPayment();
    }
  };
  
  const freqLabel = frequency.charAt(0).toUpperCase() + frequency.slice(1);
  
  return (
    <div className="min-h-screen bg-brand-light py-16">
      <div className="container mx-auto px-4">
        {paymentError && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">Payment Error: {paymentError}</p>
                </div>
            </div>
          </div>
        )}
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-blue rounded-full z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>1</div>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>2</div>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>3</div>
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                <span>Details</span>
                <span>Payment</span>
                <span>Confirm</span>
            </div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
           {step === 1 && (
               <DetailsForm 
                    amount={amount}
                    frequency={frequency}
                    setFrequency={setFrequency}
                    setAmount={setAmount}
                    freqLabel={freqLabel}
                    funds={funds}
                    selectedFund={selectedFund}
                    setSelectedFund={setSelectedFund}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    wantsTaxReceipt={wantsTaxReceipt}
                    setWantsTaxReceipt={setWantsTaxReceipt}
                    loading={loading}
                    submitDetails={submitDetails}
                    enable80gTaxExemption={enable80gTaxExemption}
               />
           )}
           {step === 2 && (
               <PaymentStep 
                    setStep={setStep}
                    amount={amount}
                    frequency={frequency}
                    funds={funds}
                    selectedFund={selectedFund}
                    handleRazorpayPayment={handleRazorpayPayment}
                    loading={loading}
               />
           )}
           {step === 3 && (
               <SuccessStep 
                    verified={verified}
                    formData={formData}
                    amount={amount}
                    funds={funds}
                    selectedFund={selectedFund}
                    transactionId={transactionId}
                    wantsTaxReceipt={wantsTaxReceipt}
                    navigate={navigate}
                    enable80gTaxExemption={enable80gTaxExemption}
               />
           )}
        </div>
                
        <div className="text-center mt-10 text-gray-400 text-xs flex items-center justify-center font-bold tracking-wide">
           <Lock className="w-3 h-3 mr-2 text-brand-green" /> 256-bit SSL Encrypted • ISO 27001 Certified Payment Infrastructure
        </div>
      </div>
    </div>
  );
};
export default DonateFlow;
