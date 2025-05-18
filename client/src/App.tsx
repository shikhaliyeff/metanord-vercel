import { Switch, Route } from "wouter";
import React, { useEffect, Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Loader } from "@/components/ui/loader";
import NordicPageTransition from "@/components/transitions/NordicPageTransition";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";
import { setupScrollPositionManagement, scrollToTop } from "@/utils/scroll-manager";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
// Import transitions CSS for smooth language switching
// transitions.css now included in consolidated-styles.css
// TransitionProvider and context no longer needed - using fixed transition style
// TransitionSettings removed per client request

// Lazy-loaded page components for performance optimization
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
// Import optimized Products page with better performance
const Products = lazy(() => import("@/pages/ProductPage"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const Documents = lazy(() => import("@/pages/Documents"));
const Faq = lazy(() => import("@/pages/Faq"));
const PageBuilderTest = lazy(() => import("@/pages/PageBuilderTest"));

// Admin pages
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const UXDemo = lazy(() => import("@/pages/UXDemoPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader size="lg" variant="accent" text="Loading page..." />
  </div>
);

// The main App component with Nordic-inspired transitions
function AppContent() {
  // Always use the modern 'geometric' transition type instead of relying on settings
  const transitionType = 'geometric';
  
  // Set up scroll position management and handle smooth scroll to anchors
  useEffect(() => {
    // Setup global scroll position management
    const cleanupScrollManager = setupScrollPositionManagement();
    
    // Always scroll to top on component mount
    scrollToTop();
    
    // Function to handle anchor links
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchorElement = target.closest('a');
      
      if (anchorElement && anchorElement.href && anchorElement.href.includes('#')) {
        const url = new URL(anchorElement.href);
        const hash = url.hash;

        // Check if we're on the same page as the anchor
        if (url.pathname === window.location.pathname || url.pathname === '/' + window.location.pathname) {
          event.preventDefault();
          
          // Find the element to scroll to
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL without refreshing the page
            window.history.pushState(null, '', hash);
          }
        }
      }
    };

    // Check for hash in URL on page load and scroll to it
    const handleHashOnLoad = () => {
      if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
          // Use a small timeout to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      } else {
        // If no hash in URL, ensure we're at the top of the page
        scrollToTop();
      }
    };

    // Add event listener for anchor clicks
    document.body.addEventListener('click', handleAnchorClick);
    // Handle hash in URL on initial load after a short delay to ensure full page load
    setTimeout(handleHashOnLoad, 150);

    // Clean up event listeners on component unmount
    return () => {
      document.body.removeEventListener('click', handleAnchorClick);
      cleanupScrollManager();
    };
  }, []);

  // Check if we're on an admin route
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Display Header only for non-admin routes */}
      {!isAdminRoute && <Header />}
      
      <main className={`${!isAdminRoute ? 'flex-grow pt-14 xs:pt-16 sm:pt-20 md:pt-24 lg:pt-28' : ''}`}>
        <NordicPageTransition transitionType={transitionType}>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              {/* Public routes */}
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/products" component={Products} />
              <Route path="/products/:id" component={ProductDetail} />
              <Route path="/product" component={ProductDetail} />
              <Route path="/search" component={SearchResults} />
              <Route path="/services" component={Services} />
              <Route path="/contact" component={Contact} />
              <Route path="/projects" component={Projects} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path="/documents" component={Documents} />
              <Route path="/faq" component={Faq} />
              <Route path="/page-builder-test" component={PageBuilderTest} />
              
              {/* Admin routes */}
              <Route path="/admin/login" component={AdminLogin} />
              <ProtectedRoute path="/admin" component={AdminDashboard} />
              
              {/* UX Demo route - available to anyone */}
              <Route path="/ux-demo" component={UXDemo} />
              
              {/* 404 route */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </NordicPageTransition>
      </main>
      
      {/* Display Footer only for non-admin routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ScrollToTop />}
    </div>
  );
}

// Import UI components
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import SEO components
import Sitemap, { OrganizationSchema } from "@/components/seo/Sitemap";
import { MetaTags } from "@/components/seo/GoogleTagManager";

// Import debugging tools
import { TranslationTester } from "@/components/debug/TranslationTester";

// Import performance monitoring utility
import { usePerformanceMonitoring } from "@/lib/performance-optimizations";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Root component - wraps AppContent with performance optimizations
function App() {
  // Set up performance monitoring
  const { startMeasure, endMeasure } = usePerformanceMonitoring();

  // Start measuring app render time
  useEffect(() => {
    startMeasure('appMount');
    
    // Register CSS optimizations
    if (typeof document !== 'undefined') {
      // Add content-visibility for large sections to improve rendering
      const contentSections = document.querySelectorAll('section');
      contentSections.forEach(section => {
        if (section.clientHeight > 500) {
          section.classList.add('content-optimize');
        }
      });
    }
    
    // Log performance on unmount
    return () => {
      const mountTime = endMeasure('appMount');
      console.log(`App mount time: ${mountTime}ms`);
    };
  }, [startMeasure, endMeasure]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            {/* SEO Components */}
            <Sitemap baseURL="https://metanord.eu" />
            <OrganizationSchema />
            <MetaTags
              title="MetaNord OÜ | Industrial Infrastructure Solutions"
              description="Estonian industrial infrastructure solutions company specializing in aluminum profiles, polyethylene pipes, and infrastructure components."
              keywords="aluminum profiles, polyethylene pipes, infrastructure components, industrial solutions, MetaNord"
            />
            
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
            <Toaster />
            
            {/* Development tools (visible when Alt+Shift+T is pressed) */}
            <TranslationTester />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
