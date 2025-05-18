import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

// Base company information
const COMPANY_DATA = {
  name: 'MetaNord OÜ',
  url: 'https://metanord.eu',
  logo: 'https://meta-nord-trade-shikhaliyeff.replit.app/logo.png', // Update with actual logo URL
  email: 'info@metanord.eu',
  telephone: '+372 000 0000', // Update with actual phone
  address: {
    streetAddress: 'Tornimäe tn 5',
    addressLocality: 'Tallinn',
    addressRegion: 'Kesklinna linnaosa',
    postalCode: '10145',
    addressCountry: 'EE',
  },
  foundingDate: '2023-01-01', // Update with actual founding date
  registryCode: '17235227',
};

export interface SchemaOrgProps {
  type?: 'website' | 'organization' | 'product' | 'article' | 'contactpage';
  url?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  product?: {
    name: string;
    description: string;
    image: string;
    sku?: string;
    brand?: string;
    category?: string;
    availability?: string;
  };
  article?: {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
  };
}

/**
 * SchemaOrg component for adding structured data to pages
 */
export default function SchemaOrg({
  type = 'website',
  url,
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  breadcrumbs,
  product,
  article,
}: SchemaOrgProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Base WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title || 'MetaNord OÜ',
    description: description || 'European Trading and Distribution Company Specializing in Aluminum Profiles and Infrastructure Products',
    url: url || 'https://metanord.eu',
    inLanguage: currentLanguage,
  };
  
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_DATA.name,
    url: COMPANY_DATA.url,
    logo: COMPANY_DATA.logo,
    email: COMPANY_DATA.email,
    telephone: COMPANY_DATA.telephone,
    address: {
      '@type': 'PostalAddress',
      ...COMPANY_DATA.address,
    },
    foundingDate: COMPANY_DATA.foundingDate,
    taxID: COMPANY_DATA.registryCode,
    // Relevant social media profiles can be added here
  };
  
  // Product schema
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'MetaNord',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      availability: product.availability || 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: COMPANY_DATA.name,
      },
    },
  } : null;
  
  // Article schema for case studies/projects
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author ? {
      '@type': 'Person',
      name: article.author,
    } : {
      '@type': 'Organization',
      name: COMPANY_DATA.name,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_DATA.name,
      logo: {
        '@type': 'ImageObject',
        url: COMPANY_DATA.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  } : null;
  
  // BreadcrumbList schema
  const breadcrumbsSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } : null;
  
  // Contact page schema
  const contactPageSchema = type === 'contactpage' ? {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: title || 'Contact MetaNord',
    description: description || 'Contact MetaNord for aluminum profiles and infrastructure products',
    url: url,
    mainEntity: {
      '@type': 'Organization',
      name: COMPANY_DATA.name,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: COMPANY_DATA.telephone,
        email: COMPANY_DATA.email,
        contactType: 'customer service',
        availableLanguage: ['en', 'et', 'ru', 'lv', 'lt', 'pl'],
      },
    },
  } : null;
  
  // Determine which schema to use based on type
  let schemaData;
  switch (type) {
    case 'organization':
      schemaData = organizationSchema;
      break;
    case 'product':
      schemaData = productSchema;
      break;
    case 'article':
      schemaData = articleSchema;
      break;
    case 'contactpage':
      schemaData = contactPageSchema;
      break;
    case 'website':
    default:
      schemaData = websiteSchema;
      break;
  }
  
  // Combine all applicable schemas
  const schemas = [schemaData];
  if (type === 'website') {
    schemas.push(organizationSchema);
  }
  if (breadcrumbsSchema) {
    schemas.push(breadcrumbsSchema);
  }
  
  return (
    <Helmet>
      {schemas.map((schema, index) => (
        schema && (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      ))}
    </Helmet>
  );
}