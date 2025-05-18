import fs from 'fs';
import path from 'path';
import { storage } from './storage';

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
 * Generate sitemap XML content from a list of URLs
 */
function generateSitemapXML(urls: SitemapURL[], baseURL: string): string {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  // Add each URL entry
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}${url.loc}</loc>\n`;
    
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    // Add alternates for language versions
    if (url.alternates && url.alternates.length > 0) {
      for (const alternate of url.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />\n`;
      }
    }
    
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  return xml;
}

/**
 * Generate a complete sitemap
 * @param baseURL The base URL for the site (e.g., https://metanord.eu)
 * @returns The sitemap XML content
 */
export async function generateSitemap(baseURL: string = 'https://metanord.eu'): Promise<string> {
  const urls: SitemapURL[] = [];
  const languages = ['en', 'et', 'ru', 'lv', 'lt', 'pl'];
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Add static pages
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/products', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/projects', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
  ];
  
  for (const page of staticPages) {
    const alternates = languages.map(lang => ({
      hreflang: lang,
      href: `${baseURL}${page.path}?lang=${lang}`
    }));
    
    urls.push({
      loc: page.path,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
      alternates
    });
  }
  
  // Add all products
  try {
    const products = await storage.getAllProducts();
    products.forEach(product => {
      const productUrl: SitemapURL = {
        loc: `/product/${product.productId}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: languages.map(lang => ({
          hreflang: lang,
          href: `${baseURL}/product/${product.productId}?lang=${lang}`
        }))
      };
      urls.push(productUrl);
    });
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }
  
  // Add all projects
  try {
    const projects = await storage.getAllProjects();
    projects.forEach(project => {
      const projectUrl: SitemapURL = {
        loc: `/project/${project.id}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: languages.map(lang => ({
          hreflang: lang,
          href: `${baseURL}/project/${project.id}?lang=${lang}`
        }))
      };
      urls.push(projectUrl);
    });
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }
  
  return generateSitemapXML(urls, baseURL);
}

/**
 * Save generated sitemap to a file
 * @param outputPath Path to save the sitemap file
 * @returns boolean indicating success
 */
export async function saveSitemapToFile(outputPath: string = 'public/sitemap.xml'): Promise<boolean> {
  try {
    const sitemapXml = await generateSitemap();
    const outputDir = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, sitemapXml);
    console.log(`Sitemap saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error saving sitemap:', error);
    return false;
  }
}

/**
 * Generate robots.txt content
 * @param sitemapUrl URL to the sitemap
 * @returns The robots.txt content
 */
export function generateRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${sitemapUrl}
`;
}

/**
 * Save generated robots.txt to a file
 * @param sitemapUrl URL to the sitemap
 * @param outputPath Path to save the robots.txt file
 * @returns boolean indicating success
 */
export function saveRobotsTxt(sitemapUrl: string, outputPath: string = 'public/robots.txt'): boolean {
  try {
    const robotsTxt = generateRobotsTxt(sitemapUrl);
    const outputDir = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, robotsTxt);
    console.log(`robots.txt saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error saving robots.txt:', error);
    return false;
  }
}