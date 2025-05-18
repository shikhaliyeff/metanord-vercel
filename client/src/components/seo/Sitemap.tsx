import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // Value between 0.0 and 1.0
  alternates?: {
    hreflang: string;
    href: string;
  }[];
}

/**
 * Sitemap component for SEO
 * This component injects links to the sitemap and adds the appropriate meta tags
 */
export default function Sitemap({ baseURL = 'https://metanord.eu' }: { baseURL?: string }) {
  return (
    <Helmet>
      {/* Link to sitemap */}
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
    </Helmet>
  );
}

/**
 * Schema.org Organization markup
 */
export function OrganizationSchema() {
  const baseURL = 'https://metanord.eu';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MetaNord OÜ',
    url: baseURL,
    logo: `${baseURL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+372 XXXXXXXX',
      contactType: 'customer service',
      email: 'info@metanord.eu',
      availableLanguage: ['English', 'Estonian', 'Russian', 'Latvian', 'Lithuanian', 'Polish'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tornimäe tn 5',
      addressLocality: 'Tallinn',
      addressRegion: 'Harju maakond',
      postalCode: '10145',
      addressCountry: 'Estonia',
    },
    sameAs: [
      'https://www.facebook.com/metanord',
      'https://www.linkedin.com/company/metanord',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}

/**
 * Schema.org Product markup
 */
export function ProductSchema({ product }: { product: any }) {
  const baseURL = 'https://metanord.eu';
  
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images && product.images[0] ? `${baseURL}${product.images[0]}` : null,
    manufacturer: {
      '@type': 'Organization',
      name: 'MetaNord OÜ'
    },
    category: product.category,
    sku: product.productId,
    brand: {
      '@type': 'Brand',
      name: 'MetaNord'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
}

/**
 * Schema.org BreadcrumbList markup
 */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string; position: number }[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}