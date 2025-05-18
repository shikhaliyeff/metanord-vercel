import React from 'react';
import { Helmet } from 'react-helmet';

interface SocialMediaTagsProps {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  facebookAppId?: string;
  locale?: string;
  alternateLocales?: string[];
  siteName?: string;
}

/**
 * SocialMediaTags component for optimizing social media sharing
 * 
 * This component adds OpenGraph and Twitter Card meta tags to make content look
 * great when shared on social media platforms like Facebook, Twitter, LinkedIn, etc.
 */
export default function SocialMediaTags({
  title,
  description,
  url,
  image,
  type = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@MetaNordTrade',
  twitterCreator = '@MetaNordTrade',
  facebookAppId,
  locale = 'en',
  alternateLocales = ['et', 'ru', 'lv', 'lt', 'pl'],
  siteName = 'MetaNord OÜ'
}: SocialMediaTagsProps) {
  return (
    <Helmet>
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Multiple locale support */}
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Facebook App ID if available */}
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific tags if type is article */}
      {type === 'article' && (
        <>
          <meta property="article:publisher" content="https://www.facebook.com/metanordtrade" />
          <meta property="article:section" content="Business" />
          <meta property="article:tag" content="Aluminum Profiles" />
          <meta property="article:tag" content="Infrastructure Products" />
        </>
      )}
      
      {/* Product specific tags if type is product */}
      {type === 'product' && (
        <>
          <meta property="product:brand" content="MetaNord" />
          <meta property="product:availability" content="in stock" />
        </>
      )}
    </Helmet>
  );
}