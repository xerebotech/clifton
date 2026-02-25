import { fmt, currenciesMap, CalcValues } from './utils';
import { Building2, Banknote } from 'lucide-react';

interface ROITabProps {
    calcValues: CalcValues;
    currency: string;
    onCurrencyChange: (c: string) => void;
    calcMode: 'mortgage' | 'cash';
    setCalcMode: (m: 'mortgage' | 'cash') => void;
    dp: number;
    setDp: (v: number) => void;
    rate: number;
    setRate: (v: number) => void;
    term: number;
    setTerm: (v: number) => void;
    app: number;
    setApp: (v: number) => void;
    vac: number;
    setVac: (v: number) => void;
}

export default function ROITab({
    calcValues, currency, onCurrencyChange, calcMode, setCalcMode,
    dp, setDp, rate, setRate, term, setTerm, app, setApp, vac, setVac
}: ROITabProps) {
    const f = (n: number) => fmt(n, currency);

    return (
        <div className="space-y-8">
            {/* Purchase Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${calcMode === 'mortgage' ? 'bg-white shadow-sm text-navy' : 'text-gray-400 hover:text-navy'}`}
                    onClick={() => setCalcMode('mortgage')}
                >
                    <Building2 className="w-3.5 h-3.5" /> Mortgage
                </button>
                <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${calcMode === 'cash' ? 'bg-white shadow-sm text-navy' : 'text-gray-400 hover:text-navy'}`}
                    onClick={() => setCalcMode('cash')}
                >
                    <Banknote className="w-3.5 h-3.5" /> Cash
                </button>
            </div>

            {/* Currency Selection */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Object.keys(currenciesMap).map(c => (
                    <button
                        key={c}
                        className={`px-4 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${c === currency ? 'bg-navy border-navy text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-copper'}`}
                        onClick={() => onCurrencyChange(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div className={calcMode === 'cash' ? 'opacity-30 pointer-events-none' : ''}>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-5 italic">Financing Parameters</h4>
                    {[
                        { label: 'Down Payment', val: calcMode === 'cash' ? 100 : dp, unit: '%', min: 10, max: 100, step: 1, setter: setDp },
                        { label: 'Mortgage Rate', val: rate, unit: '%', min: 2, max: 8, step: 0.25, setter: setRate },
                        { label: 'Loan Term', val: term, unit: ' years', min: 5, max: 25, step: 1, setter: setTerm }
                    ].map((s, i) => (
                        <div key={i} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-center mb-2.5">
                                <span className="text-xs font-semibold text-gray-600">{s.label}</span>
                                <span className="text-sm font-bold text-navy">{s.val}{s.unit}</span>
                            </div>
                            <input
                                type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                                onChange={e => s.setter(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-copper"
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-5 italic">Market Projections</h4>
                    {[
                        { label: 'Expected Appreciation', val: app, unit: '%', min: 0, max: 15, step: 1, setter: setApp },
                        { label: 'Vacancy & Maintenance', val: vac, unit: '%', min: 0, max: 20, step: 1, setter: setVac }
                    ].map((s, i) => (
                        <div key={i} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-center mb-2.5">
                                <span className="text-xs font-semibold text-gray-600">{s.label}</span>
                                <span className="text-sm font-bold text-navy">{s.val}{s.unit}</span>
                            </div>
                            <input
                                type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                                onChange={e => s.setter(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-copper"
                            />
                        </div>
                    ))}
                    <div className="mt-6 p-4 bg-copper/5 rounded-xl border border-copper/10">
                        <p className="text-[10px] text-copper leading-relaxed font-medium">
                            <strong className="uppercase mr-1">Insider Tip:</strong>
                            Mortgage rates in Dubai currently hover around 4.5% for non-residents. Appreciation averaged 12% in prime areas last year.
                        </p>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
                {[
                    { label: calcValues.dpVal >= 100 ? 'Purchase Price' : 'Monthly EMI', val: calcValues.dpVal >= 100 ? f(calcValues.price) : f(Math.round(calcValues.emi)), color: 'text-navy' },
                    { label: 'Monthly Rent', val: f(Math.round(calcValues.monthlyRent)), color: 'text-deep-teal' },
                    { label: 'Net Cash Flow', val: (calcValues.netMonthly >= 0 ? '+' : '') + f(Math.round(calcValues.netMonthly)), color: calcValues.netMonthly >= 0 ? 'text-deep-teal' : 'text-copper' },
                    { label: '5-Year Value', val: f(Math.round(calcValues.fiveYrVal)), color: 'text-copper' },
                    { label: 'Cash-on-Cash', val: calcValues.cashOnCash + '%', color: 'text-deep-teal' },
                    { label: '5-Year Total ROI', val: calcValues.totalReturn + '%', color: 'text-deep-teal' }
                ].map((res, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-[20px] border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-copper/20 group">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-bold mb-1 group-hover:text-copper transition-colors">{res.label}</div>
                        <div className={`text-lg font-bold font-cinzel ${res.color}`}>{res.val}</div>
                    </div>
                ))}
            </div>

            <div className="p-5 bg-navy rounded-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold mb-4 text-center">Global Benchmark Comparison</div>
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {[
                        { name: 'S&P 500 Index', val: '7-10%' },
                        { name: 'Dubai Average', val: '6.5%' },
                        { name: 'London prime', val: '3.1%' },
                        { name: 'This Property', val: calcValues.cashOnCash + '%', highlight: true }
                    ].map((v, i) => (
                        <div key={i} className="text-center">
                            <div className="text-[10px] text-white/40 mb-1 font-medium">{v.name}</div>
                            <div className={`text-base font-bold font-cinzel ${v.highlight ? 'text-copper' : ''}`}>{v.val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
