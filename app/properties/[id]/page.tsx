import { properties } from '@/lib/propertiesData';
import PropertyClient from './PropertyClient';

export async function generateStaticParams() {
    return properties.map((property) => ({
        id: property.id,
    }));
}

export default function Page() {
    return <PropertyClient />;
}
