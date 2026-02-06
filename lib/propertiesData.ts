export interface Property {
    id: string;
    title: string;
    price: string;
    location: string;
    type: string;
    beds: number;
    baths: number;
    area: number;
    description: string;
    amenities: string[];
    image: string;
    gallery: string[];
}

export const properties: Property[] = [
    {
        id: "downtown-views-ii",
        title: "Downtown Views II",
        price: "3,500,000 AED",
        location: "Downtown Dubai",
        type: "Apartment",
        beds: 2,
        baths: 3,
        area: 1300,
        description: "Experience the height of luxury in this stunning 2-bedroom apartment in Downtown Views II. Offering panoramic views of the Burj Khalifa and the Dubai Fountain, this residence combines modern design with ultimate convenience. Connected directly to The Dubai Mall, you are steps away from world-class shopping, dining, and entertainment.",
        amenities: ["Burj Khalifa View", "Direct Mall Access", "Infinity Pool", "Gym", "Concierge", "Parking"],
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"
        ]
    },
    {
        id: "palm-jumeirah-villa",
        title: "Signature Villa Frond K",
        price: "25,000,000 AED",
        location: "Palm Jumeirah",
        type: "Villa",
        beds: 5,
        baths: 6,
        area: 7000,
        description: "A breathtaking Signature Villa on the exclusive Frond K of Palm Jumeirah. This beach-front property features private beach access, a private pool, and expansive living areas. The customized interiors radiate elegance, making it the perfect family home for those seeking a luxury lifestyle by the sea.",
        amenities: ["Private Beach", "Private Pool", "Garden", "Maid's Room", "Sea View", "Gated Security"],
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80"
        ]
    },
    {
        id: "dubai-market-residences",
        title: "Dubai Creek Harbour",
        price: "1,800,000 AED",
        location: "Dubai Creek",
        type: "Apartment",
        beds: 1,
        baths: 2,
        area: 950,
        description: "Modern living meets waterfront serenity at Dubai Creek Harbour. This spacious 1-bedroom apartment offers skyline views and access to the Creek Marina. Ideal for investors looking for high rental yields and capital appreciation in one of Dubai's fastest-growing districts.",
        amenities: ["Waterfront View", "Gym", "Kids Play Area", "Retail Outlets", "Park Access", "Swimming Pool"],
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
            "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=1200&q=80",
            "https://images.unsplash.com/photo-1502005229766-31e479a4106f?w=1200&q=80"
        ]
    },
    {
        id: "marina-gate-residences",
        title: "Marina Gate II",
        price: "2,850,000 AED",
        location: "Dubai Marina",
        type: "Apartment",
        beds: 2,
        baths: 2,
        area: 1200,
        description: "Located in the heart of Dubai Marina, this apartment in Marina Gate II offers stunning marina views and direct access to the Marina Walk. The building features state-of-the-art facilities, including a two-level gym, squash courts, and an infinity pool.",
        amenities: ["Marina View", "Infinity Pool", "Gym", "Squash Court", "Direct Marina Access", "Valet Parking"],
        image: "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?w=1200&q=80",
            "https://images.unsplash.com/photo-1512918760532-3c111e6af184?w=1200&q=80",
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80"
        ]
    },
    {
        id: "dubai-hills-mansion",
        title: "Modern Mansion",
        price: "45,000,000 AED",
        location: "Dubai Hills Estate",
        type: "Villa",
        beds: 7,
        baths: 9,
        area: 15000,
        description: "An architectural masterpiece in Dubai Hills Estate. This 7-bedroom mansion overlooks the golf course and features a basement cinema, spa, and rooftop terrace. Designed for those who demand the absolute best in luxury living.",
        amenities: ["Golf Course View", "Cinema", "Private Spa", "Elevator", "Rooftop Terrace", "Basement Parking"],
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
            "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1200&q=80",
            "https://images.unsplash.com/photo-1613977257377-620e401b2f83?w=1200&q=80"
        ]
    },
    {
        id: "address-beach-resort",
        title: "Address Beach Resort",
        price: "6,500,000 AED",
        location: "JBR",
        type: "Penthouse",
        beds: 3,
        baths: 4,
        area: 2100,
        description: "Live above the clouds in this serviced apartment at the Address Beach Resort. Enjoy 360-degree views of the Palm, Bluewaters, and the Dubai Eye. Residents have access to the world's highest infinity pool and five-star hotel amenities.",
        amenities: ["Sea View", "Serviced", "Highest Infinity Pool", "Private Beach", "Hotel Amenities", "Fine Dining"],
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80"
        ]
    },
    {
        id: "creek-waters-ii",
        title: "Creek Waters II",
        price: "2,200,000 AED",
        location: "Dubai Creek Harbour",
        type: "Off-Plan",
        beds: 2,
        baths: 2,
        area: 1100,
        description: "A new standard of luxury living at Dubai Creek Harbour. Creek Waters II offers a range of residential units with stunning views of the Creek and the Dubai skyline. Experience world-class amenities and a vibrant waterfront lifestyle in this prestigious off-plan development by Emaar.",
        amenities: ["Creek View", "Pool", "Gym", "Landscaped Podium", "Retail & Dining", "Park Access"],
        image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=1200&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80"
        ]
    }
];
