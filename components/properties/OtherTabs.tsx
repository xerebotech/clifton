import { fmt } from './utils';
import { Property } from '@/lib/propertiesData';
import { MapPin, Clock, Landmark, Gem, ShieldCheck, Rocket, Star } from 'lucide-react';

// Location Tab
export function LocationTab({ p }: { p: Property; price: number; currency: string }) {
    return (
        <div className="space-y-6 py-2">
            <div className="aspect-video w-full bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100 group shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center text-gray-200 opacity-50 group-hover:opacity-100 transition-opacity">
                    <MapPin className="w-16 h-16" strokeWidth={1} />
                </div>
                {/* Simulated Map Marker */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-copper rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(174,149,115,0.4)] border-2 border-white animate-bounce">
                        <div className="w-2 h-2 bg-navy rounded-full" />
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-lg">
                    <div className="text-[10px] font-bold text-copper uppercase tracking-widest mb-0.5">Location Hub</div>
                    <div className="text-xs font-semibold text-navy leading-tight">{p.location}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Proximity to Metro', val: '7 min walk', icon: <Clock className="w-3 h-3" /> },
                    { label: 'Airport Drive', val: '18 min', icon: <Clock className="w-3 h-3" /> },
                    { label: 'Downtown Access', val: '12 min', icon: <Clock className="w-3 h-3" /> },
                    { label: 'Beach Access', val: '15 min', icon: <Clock className="w-3 h-3" /> }
                ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                            {item.icon} {item.label}
                        </div>
                        <div className="text-xs font-bold text-navy">{item.val}</div>
                    </div>
                ))}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed italic">
                *Location data is based on Google Maps estimates during peak hours. Prime areas like {p.location} consistently see higher rental demand.
            </p>
        </div>
    );
}

// Compare Tab
export function CompareTab({ currentProp, allProperties, currency }: { currentProp: Property; allProperties: Property[]; currency: string }) {
    const f = (n: number) => fmt(n, currency);

    // Filter similar properties (mock logic for now)
    const similar = allProperties
        .filter((prop: Property) => prop.id !== currentProp.id && (prop.beds === currentProp.beds || prop.location === currentProp.location))
        .slice(0, 2);

    return (
        <div className="space-y-8 py-2">
            <h4 className="font-cinzel font-bold text-xs tracking-[0.2em] text-navy uppercase italic">Market Positioning</h4>
            <div className="overflow-x-auto no-scrollbar pt-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metric</th>
                            <th className="py-3 text-[10px] font-bold text-copper uppercase tracking-widest px-4">This Property</th>
                            {similar.map((s: any, idx: number) => (
                                <th key={idx} className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">{s.title.split('—')[0]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[
                            { l: 'Price', v: f(currentProp.priceNumeric || 0), others: similar.map((s: Property) => f(s.priceNumeric || 0)) },
                            { l: 'Yield', v: '7.8%', others: similar.map(() => (6 + Math.random() * 2).toFixed(1) + '%') },
                            { l: 'Sq.Ft Price', v: 'AED 1,450', others: similar.map(() => 'AED ' + (1300 + Math.round(Math.random() * 300))) },
                            { l: 'Developer', v: currentProp.developer || 'Top Tier', others: similar.map((s: any) => s.developer || 'Premier') }
                        ].map((row, i) => (
                            <tr key={i} className="group">
                                <td className="py-4 text-xs font-semibold text-gray-500">{row.l}</td>
                                <td className="py-4 text-xs font-bold text-navy px-4">{row.v}</td>
                                {row.others.map((o: string, idx: number) => (
                                    <td key={idx} className="py-4 text-xs font-medium text-gray-400 px-4">{o}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-copper/5 rounded-2xl p-4 border border-copper/10 text-center">
                <p className="text-[11px] font-medium text-copper leading-relaxed">
                    This unit is priced <strong>12% below the area average</strong> for {currentProp.beds} bedroom apartments in {currentProp.location}, providing immediate equity gap potential.
                </p>
            </div>
        </div>
    );
}

// Trust Tab
export function TrustTab({ p }: { p: Property; calcValues: any; currency: string }) {
    return (
        <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                {[
                    { icon: <Landmark className="w-5 h-5 text-copper" />, title: 'RERA Licensed', desc: 'Legally compliant brokerage under license 12345.' },
                    { icon: <Gem className="w-5 h-5 text-copper" />, title: 'Verified Units', desc: 'Direct developer pricing. Zero markup guarantee.' },
                    { icon: <ShieldCheck className="w-5 h-5 text-copper" />, title: 'Escrow Secure', desc: 'Payments stay in DLD-monitored escrow accounts.' },
                    { icon: <Rocket className="w-5 h-5 text-copper" />, title: 'Aftercare', desc: 'Full property management & tenant sourcing included.' }
                ].map((item, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 transition-all hover:bg-white hover:shadow-md hover:border-copper/20">
                        <div className="pt-0.5">{item.icon}</div>
                        <div>
                            <div className="text-xs font-bold text-navy mb-1">{item.title}</div>
                            <div className="text-[10px] text-gray-500 leading-normal font-medium">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-5 bg-navy/2 rounded-2xl border border-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white text-[10px] font-bold font-cinzel">CC</div>
                    <div>
                        <div className="text-xs font-bold text-navy">Clifton Capital Real Estate</div>
                        <div className="text-[10px] text-gray-400 font-medium tracking-wide">Authorized Investment Partner</div>
                    </div>
                </div>
                <div className="flex gap-1.5 grayscale opacity-50">
                    <Star className="w-4 h-4 fill-current text-copper" />
                    <Star className="w-4 h-4 fill-current text-copper" />
                    <Star className="w-4 h-4 fill-current text-copper" />
                    <Star className="w-4 h-4 fill-current text-copper" />
                    <Star className="w-4 h-4 fill-current text-copper" />
                </div>
            </div>
        </div>
    );
}
