import React from 'react';
import { Helmet } from 'react-helmet';

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Track an event in Google Tag Manager/Analytics
 * @param eventName The name of the event to track
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  // Only proceed if window and dataLayer are defined
  if (typeof window !== 'undefined' && window.dataLayer) {
    try {
      window.dataLayer.push({
        event: eventName,
        ...eventParams
      });
      console.debug('Analytics event tracked:', eventName, eventParams);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  } else {
    console.warn('dataLayer not found. Analytics event not tracked:', eventName);
  }
}

/**
 * GoogleTagManager component - Adds Google Tag Manager script to the page head
 * @param {string} gtmId - Google Tag Manager ID (e.g., 'GTM-XXXXXXX')
 */
export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    console.warn('Google Tag Manager ID is not provided. GTM will not be initialized.');
    return null;
  }

  return (
    <Helmet>
      <script>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </script>
      <noscript>
        {`
          <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
        `}
      </noscript>
    </Helmet>
  );
}

/**
 * GoogleAnalytics component - Adds Google Analytics script to the page head
 * This is a simpler alternative to GTM when you only need basic analytics
 * @param {string} gaId - Google Analytics ID (e.g., 'G-XXXXXXXXXX' for GA4)
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) {
    console.warn('Google Analytics ID is not provided. GA will not be initialized.');
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </script>
    </Helmet>
  );
}

/**
 * MetaTags component - Adds basic SEO meta tags to the page head
 */
export function MetaTags({ 
  title, 
  description, 
  keywords,
  ogImage,
  canonical,
  locale = 'en_US'
}: { 
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  locale?: string;
}) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={locale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}