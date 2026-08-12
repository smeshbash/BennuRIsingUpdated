const fs = require('fs');
let content = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

// 1. Update DetailsFormProps
content = content.replace(
  /amount: string;\n    setAmount: \(val: string\) => void;\n    freqLabel: string;/,
  `amount: string;
    setAmount: (val: string) => void;
    frequency: string;
    setFrequency: (val: string) => void;
    freqLabel: string;`
);

// 2. Update DetailsForm destructuring
content = content.replace(
  /amount, setAmount, freqLabel, funds,/,
  `amount, setAmount, frequency, setFrequency, freqLabel, funds,`
);

// 3. Update the UI in DetailsForm to include a toggle for frequency
const oldAmountUI = `<div className="flex items-center flex-wrap">
                        <span className="text-4xl md:text-6xl font-serif-heading font-bold text-white drop-shadow-md mr-1">₹</span>
                        <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/10 text-4xl md:text-6xl font-serif-heading font-bold text-white drop-shadow-md outline-none w-full max-w-[240px] placeholder-white/50 border-b-2 border-white/30 hover:border-white focus:border-white transition-all rounded px-2 py-1"
                            min="1"
                            placeholder="Amount"
                        />
                        <span className="text-xl text-blue-200 font-medium ml-2 whitespace-nowrap pt-4">/ {freqLabel}</span>
                    </div>`;

const newAmountUI = `<div className="flex flex-col gap-4">
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
                                className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${frequency === 'once' ? 'bg-white text-brand-blue shadow-sm' : 'text-blue-100 hover:text-white'}\`}
                            >
                                One-time
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFrequency('monthly')}
                                className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${frequency === 'monthly' ? 'bg-white text-brand-blue shadow-sm' : 'text-blue-100 hover:text-white'}\`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>`;

content = content.replace(oldAmountUI, newAmountUI);

// 4. Update DonateFlow component to use state for frequency
content = content.replace(
  /const initialFreq = searchParams\.get\('freq'\) \|\| 'monthly';\n  const initialFundId = searchParams\.get\('fund'\);/,
  `const initialFreqParam = searchParams.get('freq') || 'monthly';\n  const initialFundId = searchParams.get('fund');\n  const [frequency, setFrequency] = useState<string>(initialFreqParam);`
);

// 5. Replace references to initialFreq with frequency
content = content.replace(/initialFreq/g, 'frequency');

// Note: Replace frequencyParam for the initial declaration back to initialFreqParam
content = content.replace(/const frequencyParam = searchParams/, 'const initialFreqParam = searchParams');

// 6. Fix PaymentStep Props
content = content.replace(
  /frequency=\{(.*?)frequency\}/g,
  `initialFreq={frequency}`
);

// Wait, PaymentStepProps has initialFreq. Let's change PaymentStepProps to frequency as well
content = content.replace(/initialFreq: string;/g, 'frequency: string;');
content = content.replace(/initialFreq, funds, selectedFund/g, 'frequency, funds, selectedFund');
content = content.replace(/initialFreq === 'monthly'/g, "frequency === 'monthly'");
content = content.replace(/frequency=\{(.*?)\}/g, 'frequency={frequency}');

// 7. Update the DetailsForm usage in DonateFlow
content = content.replace(
  /<DetailsForm[\s\S]*?amount=\{amount\}/,
  `<DetailsForm\n                    amount={amount}\n                    frequency={frequency}\n                    setFrequency={setFrequency}`
);

fs.writeFileSync('pages/DonateFlow.tsx', content);
console.log("Patched frequency in DonateFlow.tsx successfully");
