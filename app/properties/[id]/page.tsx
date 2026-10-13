import type { Metadata } from 'next';

import { properties } from '@/lib/propertiesData';
import { pageMetadata } from '@/lib/seo';
import PropertyClient from './PropertyClient';

export async function generateStaticParams() {
    return properties.map((property) => ({
        id: property.id,
    }));
}

// Without this the page inherits /properties' canonical from the parent layout.
// Listings that only exist in the Google Sheet are not in the static data, so
// they still get a self-canonical with a generic title.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const property = properties.find((p) => p.id === id);

    return pageMetadata({
        path: `/properties/${id}`,
        title: property
            ? `${property.title}, ${property.location} | Clifton Capital`
            : 'Dubai Property for Sale | Clifton Capital Real Estate',
        description: property
            ? `${property.type} in ${property.location} for ${property.price}. ${property.description}`.slice(0, 155)
            : 'View this Dubai investment property with Clifton Capital Real Estate.',
    });
}

export default function Page() {
    return <PropertyClient />;
}
