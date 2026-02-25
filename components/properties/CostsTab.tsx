import { fmt, CalcValues } from './utils';
import { Lock, Calendar, TrendingUp } from 'lucide-react';

interface CostsTabProps {
    calcValues: CalcValues;
    currency: string;
}

export default function CostsTab({ calcValues, currency }: CostsTabProps) {
    const f = (n: number) => fmt(n, currency);

    const sections = [
        {
            title: 'Entry Capital Required',
            icon: <Lock className="w-4 h-4" />,
            total: f(Math.round(calcValues.price * 0.2 + calcValues.dldFee + calcValues.adminFee)),
            items: [
                { l: 'Down Payment (20%)', v: f(calcValues.price * 0.2) },
                { l: 'DLD Registration (4%)', v: f(calcValues.dldFee) },
                { l: 'Trustee & Admin Fees', v: f(calcValues.adminFee) },
                { l: 'Agency Commission', v: 'WAIVED (Developer Pays)', free: true }
            ]
        },
        {
            title: 'Carrying Costs',
            icon: <Calendar className="w-4 h-4" />,
            total: f(Math.round(calcValues.baseEmi + calcValues.sc / 12 + calcValues.mgmtFee / 12)) + '/mo',
            items: [
                { l: 'Mortgage Principal + Interest', v: f(Math.round(calcValues.baseEmi)) },
                { l: 'Quarterly Service Charges', v: f(Math.round(calcValues.sc / 12)) },
                { l: 'Full Property Management (5%)', v: f(Math.round(calcValues.mgmtFee / 12)) }
            ]
        },
        {
            title: 'Projected Monthly Revenue',
            icon: <TrendingUp className="w-4 h-4" />,
            total: f(Math.round(calcValues.baseMonthlyRent)) + '/mo',
            highlight: 'text-deep-teal',
            items: [
                { l: 'Rental Receipt', v: f(Math.round(calcValues.baseMonthlyRent)), color: 'text-deep-teal' },
                { l: 'Corporate/Rental Tax', v: 'AED 0 (Tax Haven Status)', free: true }
            ]
        }
    ];

    const netPos = calcValues.baseMonthlyRent - (calcValues.baseEmi + calcValues.sc / 12 + calcValues.mgmtFee / 12);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-10 py-2">
            {sections.map((section, i) => (
                <div key={i} className={`group ${i === 2 ? 'xl:col-span-2' : ''}`}>
                    <div className="flex justify-between items-end mb-5 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-copper">{(section as any).icon}</span>
                            <span className="font-cinzel font-bold text-sm tracking-widest text-navy uppercase">{section.title}</span>
                        </div>
                        <div className="text-right">
                            <span className={`font-bold text-lg font-cinzel ${section.highlight || 'text-navy'}`}>{section.total}</span>
                        </div>
                    </div>
                    <div className="space-y-3.5">
                        {section.items.map((item, j) => (
                            <div key={j} className="flex justify-between text-xs font-medium">
                                <span className="text-gray-500 font-sans">{item.l}</span>
                                <span className={`font-sans ${(item as { v: string; color?: string }).color || 'text-navy'}`}>
                                    {item.v}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-copper/20 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <div className="text-xs font-bold text-copper uppercase tracking-widest mb-1">Final Net Cash Position</div>
                    <div className="text-[10px] text-gray-400 font-medium tracking-wide">Calculated after all debt service and management costs</div>
                </div>
                <div className={`text-2xl font-bold font-cinzel ${netPos >= 0 ? 'text-deep-teal' : 'text-copper'}`}>
                    {netPos >= 0 ? '+' : ''}{f(Math.abs(Math.round(netPos)))}/mo
                </div>
            </div>
        </div>
    );
}
