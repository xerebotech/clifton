import { MetadataRoute } from 'next'
import { fetchPropertiesFromSheet } from '@/lib/googleSheets'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.cliftonuae.com'

    // Fetch dynamic properties
    const properties = await fetchPropertiesFromSheet()
    const propertyUrls = properties.map((property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // Static routes
    const routes = [
        '',
        '/about-us',
        '/buy-property',
        '/contact-us',
        '/invest-in-dubai',
        '/landing',
        '/privacy-policy',
        '/properties',
        '/rent-property',
        '/sell-property',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? ('daily' as const) : ('monthly' as const),
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes, ...propertyUrls]
}
