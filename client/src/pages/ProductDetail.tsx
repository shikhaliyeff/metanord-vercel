import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getProductDetails, ProductDetails } from "@/data/product-data";
import { QuoteRequestModal } from "@/components/ui/quote-request-modal";
import { BreadcrumbSchema } from "@/components/seo/Sitemap";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { isMobileDevice } from "@/utils/mobile-detection";

export default function ProductDetail() {
  const { t, i18n } = useTranslation();
  const [match, params] = useRoute('/products/:id');
  const [location, navigate] = useLocation();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const currentLanguage = i18n.language;
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Detect if we're on mobile and apply mobile-specific adjustments
  useEffect(() => {
    // Check for mobile device
    setIsMobile(isMobileDevice());
    
    // Force scroll to top on page load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
    
    // Fix mobile layout issues after render
    const fixMobileLayout = () => {
      if (isMobileDevice() && detailsRef.current) {
        // Find and fix any layout issues
        const fixOverlappingElements = () => {
          try {
            // Find product image and make sure it's not too large on mobile
            const productImages = document.querySelectorAll('img');
            productImages.forEach(img => {
              if (img instanceof HTMLImageElement) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                // Remove any absolute positioning that might cause overlaps
                if (window.getComputedStyle(img).position === 'absolute') {
                  img.style.position = 'relative';
                }
              }
            });
            
            // Fix any specifications table that might overflow
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
              table.style.width = '100%';
              table.style.maxWidth = '100%';
              table.style.tableLayout = 'fixed';
              table.style.wordBreak = 'break-word';
            });
            
            // Ensure buttons don't overlap
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
              button.style.margin = '5px';
              button.style.whiteSpace = 'normal';
              button.style.wordBreak = 'break-word';
            });
            
            // Ensure text doesn't overflow containers
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
            textElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.maxWidth = '100%';
                el.style.wordBreak = 'break-word';
                el.style.overflowWrap = 'break-word';
              }
            });
          } catch (e) {
            console.error('Error fixing mobile layout:', e);
          }
        };
        
        // Apply fixes after rendering
        setTimeout(fixOverlappingElements, 100);
        setTimeout(fixOverlappingElements, 500);
        
        // Apply fixes on orientation change
        window.addEventListener('resize', fixOverlappingElements);
        
        // Cleanup
        return () => {
          window.removeEventListener('resize', fixOverlappingElements);
        };
      }
    };
    
    fixMobileLayout();
  }, []);
  
  useEffect(() => {
    // Function to fetch product details based on ID and current language
    const fetchProduct = (id: string) => {
      const productDetails = getProductDetails(id, currentLanguage);
      if (productDetails) {
        setProduct(productDetails);
        return true;
      }
      return false;
    };

    // First check for id in route params
    if (match && params?.id) {
      const productId = params.id;
      if (!fetchProduct(productId) && location.startsWith('/product')) {
        // Product not found, redirect to products page
        navigate('/products');
      }
      return;
    }
    
    // If not found in route params, check for id in query params
    const searchParams = new URLSearchParams(window.location.search);
    const queryId = searchParams.get('id');
    
    if (queryId) {
      if (!fetchProduct(queryId) && location.startsWith('/product')) {
        // Product not found, redirect to products page
        navigate('/products');
      }
    } else if (location.startsWith('/product')) {
      // No product id provided, redirect to products page
      navigate('/products');
    }
  }, [match, params, navigate, location, currentLanguage]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p>{t('productDetail.loading', 'Loading product information...')}</p>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={`${product.title} - ${t('products.metaTitle', 'MetaNord Products')}`}
        description={product.description.substring(0, 150) + '...'}
        keywords={`${product.category}, industrial products, MetaNord, aluminum profiles, infrastructure solutions`}
        ogImage={product.image}
      />
      
      {/* Product structured data for SEO */}
      <SchemaOrg
        type="product"
        title={product.title}
        description={product.description}
        imageUrl={product.image}
        product={{
          name: product.title,
          description: product.description,
          image: product.image,
          category: product.category,
          brand: 'MetaNord',
          availability: 'https://schema.org/InStock'
        }}
        breadcrumbs={[
          { name: t('navigation.home', 'Home'), url: '/' },
          { name: t('navigation.products', 'Products'), url: '/products' },
          { name: product.title, url: `/products/${product.id}` }
        ]}
      />
      
      {/* Breadcrumb structured data for SEO */}
      <BreadcrumbSchema items={[
        { name: t('home', 'Home'), url: '/', position: 1 },
        { name: t('products.title', 'Products'), url: '/products', position: 2 },
        { name: product.title, url: `/products/${product.id}`, position: 3 }
      ]} />
      
      {/* Removed duplicate MetaTags - only one instance needed for SEO */}
      
      <section className="bg-primary text-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div ref={detailsRef} className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/products')}
                className="flex items-center text-white/80 hover:text-white mb-4 transition-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {(() => {
                  switch(i18n.language) {
                    case 'ru': return 'Назад к продуктам';
                    case 'et': return 'Tagasi toodete juurde';
                    case 'lv': return 'Atpakaļ uz produktiem';
                    case 'lt': return 'Grįžti į produktus';
                    case 'pl': return 'Powrót do produktów';
                    default: return t('products.backToProducts', 'Back to Products');
                  }
                })()}
              </button>
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-4">
                {product.title}
              </h1>
              <p className="text-lg font-medium text-white/80">
                {(() => {
                  // Translate category based on current language
                  const category = product.category.toLowerCase();
                  switch(i18n.language) {
                    case 'ru': 
                      return category === 'cast iron' ? 'Чугун' : 
                             category === 'polyethylene' ? 'Полиэтилен' : 
                             category === 'valves' ? 'Клапаны' : 
                             category === 'fire-protection' ? 'Противопожарное' : 
                             product.category;
                    case 'et': 
                      return category === 'cast iron' ? 'Malm' : 
                             category === 'polyethylene' ? 'Polüetüleen' : 
                             category === 'valves' ? 'Klapid' : 
                             category === 'fire-protection' ? 'Tulekustutus' : 
                             product.category;
                    case 'lv': 
                      return category === 'cast iron' ? 'Čuguns' : 
                             category === 'polyethylene' ? 'Polietilēns' : 
                             category === 'valves' ? 'Vārsti' : 
                             category === 'fire-protection' ? 'Ugunsdzēsība' : 
                             product.category;
                    case 'lt': 
                      return category === 'cast iron' ? 'Ketus' : 
                             category === 'polyethylene' ? 'Polietilenas' : 
                             category === 'valves' ? 'Vožtuvai' : 
                             category === 'fire-protection' ? 'Priešgaisrinė apsauga' : 
                             product.category;
                    case 'pl': 
                      return category === 'cast iron' ? 'Żeliwo' : 
                             category === 'polyethylene' ? 'Polietylen' : 
                             category === 'valves' ? 'Zawory' : 
                             category === 'fire-protection' ? 'Ochrona przeciwpożarowa' : 
                             product.category;
                    default: 
                      return product.category;
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <div className="bg-neutral-lightest rounded-lg overflow-hidden shadow-md">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-8">
                <QuoteRequestModal 
                  productId={product.id} 
                  productName={product.title}
                  trigger={
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white font-inter font-medium py-6 rounded-lg shadow-md transition-all duration-300 glassmorphism-btn border border-white/20">
                      {t('header.requestQuote', 'Request a Quote')}
                    </Button>
                  }
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-inter font-bold mb-4">
                  {t('products.description', 'Product Description')}
                </h2>
                <p className="text-lg text-neutral-dark font-roboto">
                  {product.description}
                </p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-inter font-bold mb-4">
                  {t('products.features', 'Key Features')}
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="text-accent mt-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="font-roboto text-neutral-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-inter font-bold mb-4">
                  {t('products.applications', 'Applications')}
                </h2>
                <ul className="space-y-2">
                  {product.applications.map((application, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="text-accent mt-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="font-roboto text-neutral-dark">{application}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {product.specifications && (
                <div>
                  <h2 className="text-2xl font-inter font-bold mb-4">
                    {t('products.specifications', 'Technical Specifications')}
                  </h2>
                  <div className="bg-neutral-lightest rounded-lg p-6">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value], index) => (
                          <tr key={index} className={index !== 0 ? "border-t border-neutral-light" : ""}>
                            <td className="py-3 pr-4 font-inter font-semibold text-neutral-dark">{key}</td>
                            <td className="py-3 font-roboto text-neutral-dark">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {product.documents && product.documents.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-inter font-bold mb-4">
                    {t('productDetail.documentTitle', 'Product Documents')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {product.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1 w-full">
                            <h3 className="font-inter font-semibold text-lg text-neutral-dark mb-1">
                              {doc.title}
                            </h3>
                            {doc.description && (
                              <p className="text-sm text-neutral-medium mb-3 line-clamp-2">
                                {doc.description}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-neutral-medium mt-2">
                              {doc.fileType && (
                                <span className="mr-3 font-medium uppercase">{doc.fileType}</span>
                              )}
                              {doc.fileSize && (
                                <span className="mr-3">{doc.fileSize}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="bg-accent hover:bg-accent/90 text-white font-inter font-medium px-4 py-3 rounded-lg shadow-sm transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
                            size="default"
                          >
                            <FileDown className="h-5 w-5" />
                            <span className="whitespace-nowrap">
                              {doc.fileType?.toLowerCase() === 'pdf' ? 
                                t('productDetail.downloadCatalog', 'Download Catalog') :
                                t('productDetail.downloadDatasheet', 'Download Datasheet')}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-neutral-lightest">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-inter font-bold mb-6">
            {(() => {
              switch(i18n.language) {
                case 'ru': return 'Заинтересованы в этом продукте?';
                case 'et': return 'Huvitatud sellest tootest?';
                case 'lv': return 'Vai jūs interesē šis produkts?';
                case 'lt': return 'Domina šis produktas?';
                case 'pl': return 'Zainteresowany tym produktem?';
                default: return t('productDetail.interested', 'Interested in this product?');
              }
            })()}
          </h2>
          <p className="text-lg text-neutral-dark mb-8 max-w-2xl mx-auto font-roboto">
            {(() => {
              switch(i18n.language) {
                case 'ru': return 'Свяжитесь с нашей командой, чтобы обсудить ваши конкретные требования и узнать, как мы можем поставить этот продукт для вашего проекта.';
                case 'et': return 'Võtke ühendust meie meeskonnaga, et arutada oma spetsiifilisi nõudeid ja saada teada, kuidas me saame seda toodet teie projekti jaoks tarnida.';
                case 'lv': return 'Sazinieties ar mūsu komandu, lai apspriestu jūsu konkrētās prasības un uzzinātu, kā mēs varam piegādāt šo produktu jūsu projektam.';
                case 'lt': return 'Susisiekite su mūsų komanda, kad aptartumėte savo konkrečius reikalavimus ir sužinotumėte, kaip galime tiekti šį produktą jūsų projektui.';
                case 'pl': return 'Skontaktuj się z naszym zespołem, aby omówić swoje konkretne wymagania i dowiedzieć się, jak możemy dostarczyć ten produkt do Twojego projektu.';
                default: return t('productDetail.contactMessage', 'Contact our team to discuss your specific requirements and learn how we can supply this product for your project.');
              }
            })()}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/contact')}
              className="bg-primary hover:bg-primary/90 text-white font-inter font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-300 glassmorphism-btn border border-white/20"
            >
              {(() => {
                switch(i18n.language) {
                  case 'ru': return 'Связаться с нами';
                  case 'et': return 'Võta meiega ühendust';
                  case 'lv': return 'Sazināties ar mums';
                  case 'lt': return 'Susisiekite su mumis';
                  case 'pl': return 'Skontaktuj się z nami';
                  default: return t('header.contactUs', 'Contact Us');
                }
              })()}
            </Button>
            
            <QuoteRequestModal 
              productId={product.id} 
              productName={product.title}
              trigger={
                <Button className="bg-accent hover:bg-accent/90 text-white font-inter font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-300 glassmorphism-btn border border-white/20">
                  {t('header.requestQuote', 'Request a Quote')}
                </Button>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}