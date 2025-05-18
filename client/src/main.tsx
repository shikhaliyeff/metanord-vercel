import { createRoot } from "react-dom/client";
import { Suspense, useEffect } from "react";
import App from "./App";
import "./styles/globals.css";
import "./styles/admin.css"; // Import admin-specific styles
import "./styles/consolidated-styles.css"; // Import optimized consolidated styles
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "@/components/ui/loader";

// Import i18n configuration and initialize it before rendering
import "./i18n";
import { setupI18nOptimization } from "./i18n-optimizations";

// Loader component for when translations are being loaded
const I18nFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" variant="accent" text="Loading translations..." />
  </div>
);

// Apply performance optimizations when the app loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize performance optimizations for i18n
  setupI18nOptimization();
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={<I18nFallback />}>
        <App />
        <Toaster />
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);
