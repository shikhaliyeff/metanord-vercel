import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Smartphone, Tablet, Monitor, LayoutGrid, ExternalLink } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import previewCss from "@/styles/preview-override.css?raw";

// Define screen sizes for responsive testing
const SCREEN_SIZES = {
  mobile: { width: 375, height: 667, icon: Smartphone, label: "Mobile" },
  tablet: { width: 768, height: 1024, icon: Tablet, label: "Tablet" },
  desktop: { width: "100%", height: 600, icon: Monitor, label: "Desktop" },
};

type PreviewSize = keyof typeof SCREEN_SIZES;

interface PreviewManagerProps {
  url?: string;
  title?: string;
  height?: number;
  allowFullscreen?: boolean;
  enableResponsiveControls?: boolean;
}

export function PreviewManager({
  url = "/", // Default to root URL when not provided
  title = "Website Preview",
  height = 600,
  allowFullscreen = true,
  enableResponsiveControls = true,
}: PreviewManagerProps) {
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Create URL with forced light theme and cache-busting timestamp
  const getThemeUrl = (baseUrl: string) => {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}forceTheme=light&theme=light&mode=light&t=${Date.now()}`;
  };
  
  // Force light theme in the iframe
  useEffect(() => {
    const setLightTheme = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          // Try to access the iframe content and set light theme
          const iframeDocument = iframeRef.current.contentWindow.document;
          const htmlElement = iframeDocument.documentElement;
          
          // Remove any theme classes and set light theme
          htmlElement.classList.remove('dark');
          htmlElement.classList.add('light');
          htmlElement.setAttribute('data-theme', 'light');
          
          // Inject our CSS to force light mode
          const style = iframeDocument.createElement('style');
          style.id = 'preview-light-mode-override';
          style.textContent = previewCss;
          
          // Remove any existing style first
          const existingStyle = iframeDocument.getElementById('preview-light-mode-override');
          if (existingStyle) {
            existingStyle.remove();
          }
          
          // Add the new style to the head
          iframeDocument.head.appendChild(style);
          
          // Try to set the theme in localStorage as well
          iframeRef.current.contentWindow.localStorage.setItem('theme', 'light');
          iframeRef.current.contentWindow.localStorage.setItem('metanord-theme', 'light');
          
          // Execute script to force light mode
          const script = iframeDocument.createElement('script');
          script.textContent = `
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
            localStorage.setItem("metanord-theme", "light");
          `;
          iframeDocument.body.appendChild(script);
        } catch (e) {
          console.log("Cannot directly manipulate iframe content due to same-origin policy", e);
        }
      }
    };
    
    // Add a load event listener to set the theme when the iframe loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', setLightTheme);
      
      // Cleanup
      return () => {
        iframe.removeEventListener('load', setLightTheme);
      };
    }
  }, []);
  
  // Handle refresh action
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = getThemeUrl(url);
    }
  };
  
  // Handle opening in new tab
  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
  };
  
  // Calculate iframe dimensions based on selected preview size
  const getIframeDimensions = () => {
    if (isFullscreen) {
      return { width: "100%", height: "calc(100vh - 120px)" };
    }
    
    const size = SCREEN_SIZES[previewSize];
    return { 
      width: size.width,
      height: typeof size.height === "number" ? size.height : height
    };
  };
  
  // Create a container class based on selected size
  const getContainerClasses = () => {
    if (isFullscreen) {
      return "w-full h-full";
    }
    
    switch (previewSize) {
      case "mobile":
        return "flex justify-center border-l border-r border-t rounded-t-lg mx-auto";
      case "tablet":
        return "flex justify-center border-l border-r border-t rounded-t-lg mx-auto";
      default:
        return "w-full";
    }
  };
  
  const dimensions = getIframeDimensions();
  
  return (
    <div className="space-y-4 overflow-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
      {/* Preview toolbar */}
      <div className="flex items-center justify-between bg-muted/30 rounded-md p-2">
        <div className="text-sm font-medium">{title}</div>
        
        <div className="flex items-center gap-2">
          {/* Responsive size controls */}
          {enableResponsiveControls && (
            <div className="flex items-center border rounded-md overflow-hidden">
              {Object.entries(SCREEN_SIZES).map(([key, { icon: Icon, label }]) => {
                const sizeKey = key as PreviewSize;
                return (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={previewSize === sizeKey ? "default" : "ghost"}
                          size="sm"
                          className="h-8 rounded-none"
                          onClick={() => setPreviewSize(sizeKey)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenInNewTab}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open in new tab</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {allowFullscreen && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      {/* Preview container */}
      <div className={getContainerClasses()}>
        {/* Mobile preview */}
        {previewSize === "mobile" && (
          <div className="bg-gray-800 pt-4 px-2 rounded-t-xl">
            <div className="w-16 h-1 bg-gray-600 rounded-full mx-auto mb-2"></div>
            <div className="bg-white" style={{ width: dimensions.width as number, height: dimensions.height as number }}>
              <iframe
                ref={iframeRef}
                src={getThemeUrl(url)}
                title={title}
                className="border-0 w-full h-full bg-white"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
        
        {/* Tablet preview */}
        {previewSize === "tablet" && (
          <div className="bg-gray-800 pt-4 px-3 rounded-t-xl">
            <div className="w-20 h-1 bg-gray-600 rounded-full mx-auto mb-2"></div>
            <div className="bg-white" style={{ width: dimensions.width as number, height: dimensions.height as number }}>
              <iframe
                ref={iframeRef}
                src={getThemeUrl(url)}
                title={title}
                className="border-0 w-full h-full bg-white"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
        
        {/* Desktop preview */}
        {previewSize === "desktop" && (
          <div className="bg-white w-full rounded-md border">
            <iframe
              ref={iframeRef}
              src={getThemeUrl(url)}
              title={title}
              className="border-0 w-full rounded-md bg-white"
              style={{ 
                width: dimensions.width, 
                height: typeof dimensions.height === "number" ? `${dimensions.height}px` : dimensions.height 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewManager;