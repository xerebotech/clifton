export interface InvestmentProperty {
    id: number;
    title: string;
    location: string;
    developer: string;
    devProjects: number;
    devYears: number;
    devDelivered: string;
    devRating: string;
    status: string;
    handover: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    annualRent: number;
    serviceCharges: number;
    appreciation: number;
    goldenVisa: boolean;
    unitsLeft: number;
    description: string;
    amenitiesText: string;
    images: string[];
    commutes: { icon: string; name: string; dist: string; time: string }[];
    amenities: { icon: string; name: string; dist: string }[];
    areaGrowth: number[];
    occupancy: number;
    popGrowth: string;
    avgDaysToRent: number;
    viewedToday: number;
    bookedThisWeek: number;
}

export const properties: InvestmentProperty[] = [
    {
        id: 1,
        title: "5 BR Villa — The Heights",
        location: "Dubai South",
        developer: "Emaar Properties",
        devProjects: 80, devYears: 27, devDelivered: "108,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q3 2030",
        price: 10900000, beds: 5, baths: 5, sqft: 5884,
        annualRent: 500000, serviceCharges: 106000, appreciation: 8,
        goldenVisa: true, unitsLeft: 12,
        description: "The Heights Country Club & Wellness is a luxury community blending modern design, wellness, and serene nature.",
        amenitiesText: "Wellness club & spa, Resort-style pools, Jogging & cycling tracks, Yoga decks, Retail & dining",
        images: [
            "https://www.binayah.com/wp-content/uploads/2024/05/The-Heights-Country-Club-Wellness-at-Dubailand-by-Emaar.jpg",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "35 km", time: "35 min" },
            { icon: "✈️", name: "Al Maktoum Intl", dist: "15 km", time: "18 min" },
            { icon: "🚇", name: "Expo Metro", dist: "8 km", time: "12 min" },
            { icon: "🌳", name: "Expo Park", dist: "6 km", time: "8 min" }
        ],
        amenities: [
            { icon: "🏫", name: "Greenfield Intl School", dist: "5 km" },
            { icon: "🛒", name: "Ibn Battuta Mall", dist: "12 km" },
            { icon: "🏥", name: "Mediclinic Parkview", dist: "18 km" },
            { icon: "🌳", name: "Expo Park", dist: "6 km" }
        ],
        areaGrowth: [6.1, 9.3, 14.5, 18.2, 11.8],
        occupancy: 82, popGrowth: "+18%", avgDaysToRent: 18,
        viewedToday: 22, bookedThisWeek: 5
    },
    {
        id: 2,
        title: "4 BR Villa — Valley Ovelle",
        location: "Dubailand",
        developer: "Emaar Properties",
        devProjects: 80, devYears: 27, devDelivered: "108,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q2 2028",
        price: 7100888, beds: 4, baths: 6, sqft: 5798,
        annualRent: 380000, serviceCharges: 93000, appreciation: 10,
        goldenVisa: true, unitsLeft: 8,
        description: "Ovelle is a nature-inspired valley community blending contemporary living with culture, wellness, and serene outdoor beauty.",
        amenitiesText: "Golden Beach, Town Centre, Kid\u2019s Dale, Wellness Centre, Sports Village, Gym & Padel, Pool, Restaurants, Spa",
        images: [
            "https://homes4life.ae/wp-content/uploads/2025/11/OVELLE_TV_BR25-_1_.webp",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "30 km", time: "30 min" },
            { icon: "✈️", name: "DXB Airport", dist: "30 km", time: "35 min" },
            { icon: "🚇", name: "Global Village (future)", dist: "10 km", time: "15 min" },
            { icon: "🏖", name: "Golden Beach", dist: "On-site", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "The Aquila School", dist: "15 km" },
            { icon: "🛒", name: "Dubai Outlet Mall", dist: "10 km" },
            { icon: "🏥", name: "Mediclinic Parkview", dist: "20 km" },
            { icon: "🌊", name: "Golden Beach (47K sqm)", dist: "On-site" }
        ],
        areaGrowth: [4.5, 8.2, 13.5, 16.0, 10.5],
        occupancy: 85, popGrowth: "+16%", avgDaysToRent: 16,
        viewedToday: 15, bookedThisWeek: 4
    },
    {
        id: 3,
        title: "2 BR — Montiva by Vida Branded",
        location: "Creek Harbour",
        developer: "Emaar Properties",
        devProjects: 80, devYears: 27, devDelivered: "108,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q3 2029",
        price: 2800000, beds: 2, baths: 2, sqft: 1143,
        annualRent: 175000, serviceCharges: 25000, appreciation: 8,
        goldenVisa: true, unitsLeft: 20,
        description: "Montiva at Dubai Creek Harbour redefines contemporary living with tranquil waterfront residences surrounded by lush greenery and iconic skyline views.",
        amenitiesText: "Pools, parks, cycling tracks, play areas, waterfront promenades, Dubai Creek Tower & Island Park access",
        images: [
            "https://d3h330vgpwpjr8.cloudfront.net/x/1392x/Modern_Creekside_Living_at_Montiva_by_Vida_7f6f04350a.webp",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "10 km", time: "12 min" },
            { icon: "✈️", name: "DXB Airport", dist: "10 km", time: "15 min" },
            { icon: "🚇", name: "Creek Metro (planned)", dist: "1 km", time: "5 min" },
            { icon: "🌿", name: "Ras Al Khor Sanctuary", dist: "1.5 km", time: "5 min" }
        ],
        amenities: [
            { icon: "🏫", name: "Hartland International", dist: "3 km" },
            { icon: "🛒", name: "Festival City Mall", dist: "8 km" },
            { icon: "🏥", name: "Mediclinic Creek Harbour", dist: "2 km" },
            { icon: "🌳", name: "Creek Park", dist: "1.5 km" }
        ],
        areaGrowth: [3.8, 6.5, 9.8, 11.0, 8.5],
        occupancy: 92, popGrowth: "+10%", avgDaysToRent: 10,
        viewedToday: 28, bookedThisWeek: 6
    },
    {
        id: 4,
        title: "4 BR Villa — Nad Al Sheba Gardens",
        location: "Nad Al Sheba",
        developer: "Meraas",
        devProjects: 30, devYears: 17, devDelivered: "15,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q3 2028",
        price: 13632000, beds: 4, baths: 5, sqft: 4795,
        annualRent: 600000, serviceCharges: 96000, appreciation: 7,
        goldenVisa: true, unitsLeft: 5,
        description: "Nad Al Sheba Gardens is a premium Meraas gated community featuring contemporary villas and townhouses centered around wellness-focused greenery and swimmable lagoons.",
        amenitiesText: "Swimmable lagoon, beach-like shores, wave pool, tennis & basketball courts",
        images: [
            "https://meraas.com/sites/default/files/2024-05/NASG%20Top%20Gallery%20image%202%20-%20%20Convenient%20location%20880x860.jpg",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "Downtown Dubai", dist: "12 km", time: "10 min" },
            { icon: "✈️", name: "DXB Airport", dist: "16 km", time: "20 min" },
            { icon: "🚇", name: "Meydan Metro (planned)", dist: "5 km", time: "10 min" },
            { icon: "🏇", name: "Meydan Racecourse", dist: "3 km", time: "5 min" }
        ],
        amenities: [
            { icon: "🏫", name: "Kent College Dubai", dist: "2 km" },
            { icon: "🛒", name: "Meydan One Mall", dist: "5 km" },
            { icon: "🏥", name: "King\u2019s College Hospital", dist: "8 km" },
            { icon: "🏊", name: "Lagoon & Wave Pool", dist: "On-site" }
        ],
        areaGrowth: [3.5, 5.8, 8.5, 10.2, 7.8],
        occupancy: 90, popGrowth: "+8%", avgDaysToRent: 12,
        viewedToday: 14, bookedThisWeek: 3
    },
    {
        id: 5,
        title: "3 BR Townhouse — The Watercrest",
        location: "Mohammed Bin Rashid City",
        developer: "Ellington Properties",
        devProjects: 25, devYears: 10, devDelivered: "5,000+", devRating: "A",
        status: "Off-Plan", handover: "Q4 2027",
        price: 7435828, beds: 3, baths: 4, sqft: 3846,
        annualRent: 400000, serviceCharges: 85000, appreciation: 7,
        goldenVisa: true, unitsLeft: 6,
        description: "The Watercrest featuring contemporary architecture and meticulously crafted interiors with premium finishes and thoughtful layouts designed for understated, design-focused living.",
        amenitiesText: "Infinity pool, Kids play area, Club lounge, Yoga studio, Outdoor cinema, Arcade room, Dog park, Gated community",
        images: [
            "https://ellingtonproperties.ae/wp-content/uploads/The-Watercrest-MainSection_top-scaled.jpg",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "12 km", time: "15 min" },
            { icon: "✈️", name: "DXB Airport", dist: "20 km", time: "25 min" },
            { icon: "🚇", name: "Meydan Metro (planned)", dist: "4 km", time: "8 min" },
            { icon: "🌊", name: "Crystal Lagoon", dist: "0.5 km", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "Kent College Dubai", dist: "1 km" },
            { icon: "🛒", name: "Meydan One Mall", dist: "3 km" },
            { icon: "🏥", name: "Nad Al Sheba Health", dist: "5 km" },
            { icon: "🌊", name: "Crystal Lagoon MBR", dist: "0.5 km" }
        ],
        areaGrowth: [4.2, 7.8, 12.1, 15.3, 9.6],
        occupancy: 89, popGrowth: "+12%", avgDaysToRent: 14,
        viewedToday: 18, bookedThisWeek: 3
    },
    {
        id: 6,
        title: "3 BR Apartment — Terra Woods",
        location: "Expo Living",
        developer: "Emaar Properties",
        devProjects: 80, devYears: 27, devDelivered: "108,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q1 2030",
        price: 3500000, beds: 3, baths: 3, sqft: 1667,
        annualRent: 180000, serviceCharges: 30000, appreciation: 10,
        goldenVisa: true, unitsLeft: 35,
        description: "Terra Woods at Expo Living offers futuristic residences surrounded by lush greenery, steps from Expo City and Al Maktoum International.",
        amenitiesText: "Yoga Lawn, Outdoor Gym, Padel Court, Sports Courts, BBQ Courtyard, Meditation Garden, Adult & Kids Pool",
        images: [
            "https://dubaipropertiesinfomation.wordpress.com/wp-content/uploads/2026/01/gemini_generated_image_yk4blhyk4blhyk4b.png?w=780",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "30 km", time: "30 min" },
            { icon: "✈️", name: "Al Maktoum Intl", dist: "10 km", time: "15 min" },
            { icon: "🚇", name: "Expo Metro", dist: "1.2 km", time: "Walk" },
            { icon: "🎡", name: "Expo City", dist: "1.2 km", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "Greenfield Intl School", dist: "3 km" },
            { icon: "🛒", name: "Expo Mall (upcoming)", dist: "1 km" },
            { icon: "🏥", name: "NMC Hospital Jebel Ali", dist: "10 km" },
            { icon: "🌳", name: "Expo Park / Al Forsan", dist: "1.2 km" }
        ],
        areaGrowth: [6.5, 10.2, 15.8, 19.5, 12.0],
        occupancy: 80, popGrowth: "+20%", avgDaysToRent: 16,
        viewedToday: 12, bookedThisWeek: 4
    },
    {
        id: 7,
        title: "2.5 BR — Vincitore Wellness Estate",
        location: "Majan",
        developer: "Vincitore Real Estate",
        devProjects: 5, devYears: 12, devDelivered: "3,000+", devRating: "B+",
        status: "Off-Plan", handover: "Q4 2029",
        price: 2221000, beds: 2, baths: 3, sqft: 1387,
        annualRent: 140000, serviceCharges: 22000, appreciation: 8,
        goldenVisa: true, unitsLeft: 40,
        description: "The world\u2019s first 7-star wellness residential tower, blending Victorian biophilic architecture with over 200,000 sq. ft. of nature-infused amenities.",
        amenitiesText: "Indoor-Outdoor Sky Pool, Lazy River & Waterfall, Rain Shower, Sky Lounge, Sports Court, Floating Cinema",
        images: [
            "https://vincitorerealty.com/vincitore-wellness-estate/assets/images/updated/crown-jewel.webp",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "25 km", time: "25 min" },
            { icon: "✈️", name: "DXB Airport", dist: "20 km", time: "20 min" },
            { icon: "🚇", name: "Gold Metro (future)", dist: "3 km", time: "4 min" },
            { icon: "🎢", name: "IMG Worlds / Global Village", dist: "6 km", time: "10 min" }
        ],
        amenities: [
            { icon: "🏫", name: "Dunecrest American School", dist: "0.9 km" },
            { icon: "🛒", name: "Cityland Mall", dist: "5 km" },
            { icon: "🏥", name: "Aster Clinic", dist: "8 km" },
            { icon: "🌿", name: "Al Barari Green Spaces", dist: "2 km" }
        ],
        areaGrowth: [4.8, 7.5, 11.2, 14.8, 9.5],
        occupancy: 85, popGrowth: "+15%", avgDaysToRent: 14,
        viewedToday: 10, bookedThisWeek: 3
    },
    {
        id: 8,
        title: "4 BR Villa — The Oasis",
        location: "Dubailand",
        developer: "Emaar Properties",
        devProjects: 80, devYears: 27, devDelivered: "108,000+", devRating: "A+",
        status: "Off-Plan", handover: "Q2 2029",
        price: 13160000, beds: 4, baths: 5, sqft: 7287,
        annualRent: 550000, serviceCharges: 131000, appreciation: 8,
        goldenVisa: true, unitsLeft: 15,
        description: "The Oasis by Emaar is an ultra-luxury villa community set around serene lagoons and lush greenery, offering refined, private living.",
        amenitiesText: "Luxury Country Club, Wellness Centre, Fitness, Cycling & Jogging Tracks, Parks & Greenways, Event Plazas, Yoga",
        images: [
            "https://cdn.properties.emaar.com/wp-content/uploads/2025/12/HOMEPAGE_BANNER_1920x1080-706x385.jpg",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "25 km", time: "25 min" },
            { icon: "✈️", name: "DXB Airport", dist: "30 km", time: "35 min" },
            { icon: "🚇", name: "Business Bay Metro", dist: "15 km", time: "20 min" },
            { icon: "🌊", name: "Oasis Lagoon & Canals", dist: "On-site", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "GEMS / Aquila School", dist: "10 km" },
            { icon: "🛒", name: "Cityland / Global Village", dist: "8 km" },
            { icon: "🏥", name: "Mediclinic Parkview", dist: "15 km" },
            { icon: "🏊", name: "Oasis Lagoon & Canals", dist: "On-site" }
        ],
        areaGrowth: [4.0, 7.2, 11.8, 15.0, 10.0],
        occupancy: 84, popGrowth: "+14%", avgDaysToRent: 16,
        viewedToday: 20, bookedThisWeek: 4
    },
    {
        id: 9,
        title: "2 BR — Meriva Gardens Beachfront",
        location: "Dubai Islands",
        developer: "Ellington Properties",
        devProjects: 25, devYears: 10, devDelivered: "5,000+", devRating: "A",
        status: "Off-Plan", handover: "Q2 2030",
        price: 4999000, beds: 2, baths: 2, sqft: 1272,
        annualRent: 250000, serviceCharges: 32000, appreciation: 10,
        goldenVisa: true, unitsLeft: 15,
        description: "A pedestrianised enclave where layered architecture, flowing water and open landscapes come together, with a gentle pace guided by calm nature and thoughtful design.",
        amenitiesText: "Lagoon water features, Spinning Zone, Climbing wall, Podcast room, Jazz Dining & Lounge, Games room",
        images: [
            "https://tohidfetrat.com/wp-content/uploads/2026/02/the-meriva-collection-beachfront-architecture-evening-view-dubai-tohid-fetrat.webp",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "15 km", time: "18 min" },
            { icon: "✈️", name: "DXB Airport", dist: "12 km", time: "15 min" },
            { icon: "🚇", name: "Gold Souq Green Line", dist: "5 km", time: "10 min" },
            { icon: "🏖", name: "Dubai Islands Beach", dist: "0.2 km", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "International Schools", dist: "5 km" },
            { icon: "🛒", name: "Festival City Mall", dist: "10 km" },
            { icon: "🏥", name: "Dubai Hospital", dist: "12 km" },
            { icon: "🏖", name: "Private Beach Access", dist: "0.2 km" }
        ],
        areaGrowth: [5.0, 8.5, 14.0, 18.5, 12.5],
        occupancy: 80, popGrowth: "+20%", avgDaysToRent: 18,
        viewedToday: 10, bookedThisWeek: 2
    },
    {
        id: 10,
        title: "2 BR — Rove Home Meydan",
        location: "Meydan",
        developer: "ALAIN Properties (OCTA Broker)",
        devProjects: 10, devYears: 8, devDelivered: "3,000+", devRating: "A",
        status: "Off-Plan", handover: "Q1 2029",
        price: 2400000, beds: 2, baths: 2, sqft: 942,
        annualRent: 155000, serviceCharges: 23000, appreciation: 9,
        goldenVisa: true, unitsLeft: 20,
        description: "Rove Home Meydan Horizon is a premium waterfront development by Al Ain Holding offering fully furnished branded residences.",
        amenitiesText: "Outdoor cinema & gaming, Entertainment, Rove Connect, Fitness centre, Cabanas, Co-working space & terrace",
        images: [
            "https://investindxb.com/wp-content/uploads/2025/12/ROVE-MEYDAN-HORIZON-RESIDENCES-DUBAI-investindxb-9.51.17-PM-scaled.png",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
        ],
        commutes: [
            { icon: "🏢", name: "DIFC", dist: "10 km", time: "12 min" },
            { icon: "✈️", name: "DXB Airport", dist: "15 km", time: "18 min" },
            { icon: "🚇", name: "Meydan Metro (planned)", dist: "3 km", time: "6 min" },
            { icon: "🌊", name: "Crystal Lagoon", dist: "0.3 km", time: "Walk" }
        ],
        amenities: [
            { icon: "🏫", name: "N. London Collegiate", dist: "1.7 km" },
            { icon: "🛒", name: "Meydan One Mall", dist: "3 km" },
            { icon: "🏥", name: "Mediclinic Meydan", dist: "4 km" },
            { icon: "🌊", name: "Meydan Crystal Lagoon", dist: "0.3 km" }
        ],
        areaGrowth: [4.5, 7.8, 12.5, 16.0, 10.5],
        occupancy: 88, popGrowth: "+15%", avgDaysToRent: 11,
        viewedToday: 16, bookedThisWeek: 4
    }
];

export const currencies: Record<string, number> = { AED: 1, USD: 0.2723, INR: 22.7, GBP: 0.215, PKR: 76.0, EUR: 0.251 };
export const curSymbols: Record<string, string> = { AED: 'AED', USD: '$', INR: '₹', GBP: '£', PKR: 'PKR', EUR: '€' };

export function fmt(n: number, cur: string = 'AED', currencies_map: Record<string, number> = currencies): string {
    const converted = Math.round(n * currencies_map[cur]);
    return curSymbols[cur] + ' ' + converted.toLocaleString('en-US');
}

export function calcEMI(price: number, dpPct: number, rate: number, years: number): number {
    const principal = price * (1 - dpPct / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function grossYield(rent: number, price: number): string {
    return ((rent / price) * 100).toFixed(1);
}

export function netYield(rent: number, sc: number, price: number): string {
    return (((rent - sc) / price) * 100).toFixed(1);
}

export function fmtShort(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
}
