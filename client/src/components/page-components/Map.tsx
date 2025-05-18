import React, { useEffect, useRef, useState } from "react";
import { PageComponent } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MapProps {
  component: PageComponent;
  className?: string;
}

export default function Map({ component, className }: MapProps) {
  const { 
    address = "Tornimäe tn 5, 10145 Tallinn, Estonia", 
    zoom = 14,
    height = "400px",
    mapType = "roadmap",
    showMarker = true
  } = component.content || {};
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Load the Google Maps script
  useEffect(() => {
    // Google Maps script loader
    const loadGoogleMapsScript = () => {
      // Check if the script is already loaded
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        initMap();
        return;
      }
      
      // Create a script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setMapError("Failed to load Google Maps. Please try again later.");
      };
      
      // Define the callback function
      window.initMap = () => {
        setMapLoaded(true);
        initMap();
      };
      
      // Append the script to the document
      document.head.appendChild(script);
    };
    
    // Initialize the map
    const initMap = () => {
      if (!mapRef.current || !window.google) return;
      
      // Create geocoder
      const geocoder = new window.google.maps.Geocoder();
      
      // Define map options
      const mapOptions = {
        zoom: zoom,
        mapTypeId: mapType.toLowerCase(),
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      };
      
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Geocode the address
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const location = results[0].geometry.location;
          
          // Set map center
          map.setCenter(location);
          
          // Add marker if needed
          if (showMarker) {
            new window.google.maps.Marker({
              map,
              position: location,
              animation: window.google.maps.Animation.DROP,
            });
          }
        } else {
          setMapError(`Could not geocode address: ${status}`);
        }
      });
    };
    
    // Load the map script
    loadGoogleMapsScript();
    
    // Cleanup function
    return () => {
      // Remove the global callback
      if (window.initMap) {
        window.initMap = undefined;
      }
    };
  }, [address, zoom, mapType, showMarker]);
  
  // Display an error message if loading fails
  if (mapError) {
    return (
      <div className={cn("bg-red-50 p-4 rounded border border-red-200 text-red-800", className)}>
        <p className="font-medium">Map Error</p>
        <p className="text-sm">{mapError}</p>
      </div>
    );
  }
  
  // Render the map container with enhanced mobile support
  return (
    <div className={cn("relative rounded overflow-hidden my-4", className)}>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-gray-500">Loading map...</div>
        </div>
      )}
      
      {/* Enhanced map container with touch optimization */}
      <div 
        ref={mapRef} 
        className="w-full touch-manipulation"
        style={{ 
          height,
          // Enhanced touch handling for mobile devices
          WebkitTapHighlightColor: 'transparent',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none'
        }}
        aria-label={`Map showing ${address}`}
      />
      
      {/* Mobile-friendly address caption */}
      <div className="text-xs text-center py-2 px-3 text-gray-500 bg-gray-50 border-t">
        <span className="inline-block truncate max-w-full">
          {address}
        </span>
      </div>
    </div>
  );
}