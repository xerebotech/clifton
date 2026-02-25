import { Property } from '@/lib/propertiesData';

export const currenciesMap: Record<string, number> = { AED: 1, USD: 0.2723, INR: 22.7, GBP: 0.215, PKR: 76.0, EUR: 0.251 };
export const curSymbols: Record<string, string> = { AED: 'AED', USD: '$', INR: '₹', GBP: '£', PKR: 'PKR', EUR: '€' };

export function fmt(n: number, cur: string = 'AED'): string {
    const converted = Math.round(n * (currenciesMap[cur] || 1));
    return (curSymbols[cur] || cur) + ' ' + converted.toLocaleString('en-US');
}

export function calcEMI(price: number, dpPct: number, rate: number, yrs: number): number {
    const principal = price * (1 - dpPct / 100);
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function grossYield(rent: number, price: number): string {
    if (!price || price === 0) return '0';
    return ((rent / price) * 100).toFixed(1);
}

export function netYield(rent: number, sc: number, price: number): string {
    if (!price || price === 0) return '0';
    return (((rent - sc) / price) * 100).toFixed(1);
}

export function fmtShort(n: number): string {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
}
export interface CalcValues {
    emi: number;
    monthlyRent: number;
    netMonthly: number;
    fiveYrVal: number;
    invested: number;
    totalReturn: string;
    cashOnCash: string;
    gy: string;
    ny: string;
    baseEmi: number;
    baseMonthlyRent: number;
    tenantPaysPct: number;
    dldFee: number;
    adminFee: number;
    mgmtFee: number;
    dpVal: number;
    price: number;
    rent: number;
    sc: number;
}

export function calcValues(p: Property, dp: number, rate: number, term: number, app: number, vac: number, calcMode: 'mortgage' | 'cash') {
    if (!p || !p.priceNumeric) return null;
    const price = p.priceNumeric;
    const rent = p.annualRent || 0;
    const sc = p.serviceCharges || 0;
    const dpVal = calcMode === 'cash' ? 100 : dp;
    const emi = dpVal >= 100 ? 0 : calcEMI(price, dpVal, rate, term);
    const effectiveRent = rent * (1 - vac / 100);
    const monthlyRent = effectiveRent / 12;
    const mgmt = effectiveRent * 0.05;
    const monthlyCosts = emi + sc / 12 + mgmt / 12;
    const netMonthly = monthlyRent - monthlyCosts;
    const fiveYrVal = price * Math.pow(1 + app / 100, 5);
    const totalRent5 = effectiveRent * 5;
    const capitalGain = fiveYrVal - price;
    const invested = price * dpVal / 100;
    const totalReturn = ((capitalGain + totalRent5) / invested * 100).toFixed(0);
    const cashOnCash = ((effectiveRent - sc - mgmt) / invested * 100).toFixed(1);
    const gy = grossYield(rent, price);
    const ny = rent && sc ? ((rent - sc) / price * 100).toFixed(1) : '0';
    const baseEmi = calcEMI(price, 20, 4.5, 25);
    const baseMonthlyRent = rent / 12;
    const tenantPaysPct = Math.round((baseMonthlyRent / baseEmi) * 100);
    const dldFee = price * 0.04;
    const adminFee = 4200;
    const mgmtFee = rent * 0.05;
    return { emi, monthlyRent, netMonthly, fiveYrVal, invested, totalReturn, cashOnCash, gy, ny, baseEmi, baseMonthlyRent, tenantPaysPct, dldFee, adminFee, mgmtFee, dpVal, price, rent, sc };
}
