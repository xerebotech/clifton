export interface Country {
    name: string;
    code: string;
    dialCode: string;
}

export const countries: Country[] = [
    { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
    { name: "United Kingdom", code: "GB", dialCode: "+44" },
    { name: "United States", code: "US", dialCode: "+1" },
    { name: "India", code: "IN", dialCode: "+91" },
    { name: "Saudi Arabia", code: "SA", dialCode: "+966" },
    { name: "Qatar", code: "QA", dialCode: "+974" },
    { name: "Kuwait", code: "KW", dialCode: "+965" },
    { name: "Oman", code: "OM", dialCode: "+968" },
    { name: "Bahrain", code: "BH", dialCode: "+973" },
    { name: "Pakistan", code: "PK", dialCode: "+92" },
    { name: "Canada", code: "CA", dialCode: "+1" },
    { name: "Australia", code: "AU", dialCode: "+61" },
    { name: "France", code: "FR", dialCode: "+33" },
    { name: "Germany", code: "DE", dialCode: "+49" },
    { name: "Switzerland", code: "CH", dialCode: "+41" },
    { name: "Italy", code: "IT", dialCode: "+39" },
    { name: "Spain", code: "ES", dialCode: "+34" },
    { name: "Russia", code: "RU", dialCode: "+7" },
    { name: "China", code: "CN", dialCode: "+86" },
    { name: "Japan", code: "JP", dialCode: "+81" },
    { name: "Lebanon", code: "LB", dialCode: "+961" },
    { name: "Jordan", code: "JO", dialCode: "+962" },
    { name: "Egypt", code: "EG", dialCode: "+20" },
    { name: "Turkey", code: "TR", dialCode: "+90" },
].sort((a, b) => a.name.localeCompare(b.name));

// Put UAE at the top manually if needed
export const sortedCountries = [
    countries.find(c => c.code === "AE")!,
    ...countries.filter(c => c.code !== "AE")
];
