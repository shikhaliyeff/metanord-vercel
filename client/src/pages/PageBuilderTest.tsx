import React from "react";
import { PageRenderer } from "@/components/page-builder";
import { PageComponent, PageSection } from "@shared/schema";

// Sample data for the page
const samplePage = {
  sections: [
    {
      id: "section1",
      title: "Welcome Section",
      content: {
        padding: "py-12 px-4",
        background: "bg-blue-50",
        maxWidth: "max-w-5xl",
        fullWidth: false,
        cssClasses: "rounded-lg shadow-sm"
      },
      components: [
        {
          id: "heading1",
          type: "heading",
          content: {
            text: "Welcome to MetaNord Page Builder",
            level: "h1",
            align: "center",
            color: "text-blue-800",
            cssClasses: "font-bold mb-6"
          }
        },
        {
          id: "paragraph1",
          type: "paragraph",
          content: {
            text: "This is a demonstration of the Visual Page Builder component. It allows you to create dynamic page layouts with various components like headings, paragraphs, images, buttons, and more.",
            align: "center",
            color: "text-gray-700",
            cssClasses: "mb-8 max-w-3xl mx-auto"
          }
        },
        {
          id: "button1",
          type: "button",
          content: {
            text: "Learn More",
            url: "#map-section",
            variant: "primary",
            size: "lg",
            align: "center",
            cssClasses: "rounded-full font-medium"
          }
        }
      ] as PageComponent[]
    } as PageSection,
    {
      id: "map-section",
      title: "Location Section",
      content: {
        padding: "py-16 px-4",
        background: "bg-white",
        maxWidth: "max-w-6xl",
        fullWidth: false,
        cssClasses: ""
      },
      components: [
        {
          id: "heading2",
          type: "heading",
          content: {
            text: "Find Us on the Map",
            level: "h2",
            align: "center",
            color: "text-gray-900",
            cssClasses: "font-bold mb-4"
          }
        },
        {
          id: "paragraph2",
          type: "paragraph",
          content: {
            text: "Our headquarters is located in the heart of Tallinn, Estonia. We serve clients throughout the Baltic region and beyond.",
            align: "center",
            color: "text-gray-600",
            cssClasses: "mb-8 max-w-2xl mx-auto"
          }
        },
        {
          id: "map1",
          type: "map",
          content: {
            address: "Tornimäe tn 5, 10145 Tallinn, Estonia",
            zoom: 14,
            height: "400px",
            mapType: "roadmap",
            showMarker: true
          }
        },
        {
          id: "paragraph3",
          type: "paragraph",
          content: {
            text: "Contact us to schedule a meeting at our office or discuss your project requirements.",
            align: "center",
            color: "text-gray-600",
            cssClasses: "mt-6 italic"
          }
        }
      ] as PageComponent[]
    } as PageSection,
    {
      id: "cards-section",
      title: "Features Section",
      content: {
        padding: "py-16 px-4",
        background: "bg-gradient-to-r from-blue-50 to-indigo-50",
        maxWidth: "max-w-7xl",
        fullWidth: false,
        cssClasses: ""
      },
      components: [
        {
          id: "heading3",
          type: "heading",
          content: {
            text: "Our Key Features",
            level: "h2",
            align: "center",
            color: "text-gray-900",
            cssClasses: "font-bold mb-12"
          }
        },
        {
          id: "list1",
          type: "list",
          content: {
            items: [
              "Fully responsive design for all devices",
              "Interactive components with modern styling",
              "Customizable section layouts and backgrounds",
              "Support for various content types including maps",
              "Easy integration with existing website content"
            ],
            listType: "bullet",
            align: "left",
            color: "text-gray-700",
            cssClasses: "max-w-2xl mx-auto space-y-2"
          }
        },
        {
          id: "divider1",
          type: "divider",
          content: {
            width: "w-1/2",
            color: "border-gray-300",
            thickness: "border-t-2",
            align: "center",
            cssClasses: "my-10"
          }
        },
        {
          id: "paragraph4",
          type: "paragraph",
          content: {
            text: "The Page Builder is designed to make content creation intuitive and flexible, allowing you to create compelling layouts without technical knowledge.",
            align: "center",
            color: "text-gray-600",
            cssClasses: "max-w-3xl mx-auto"
          }
        }
      ] as PageComponent[]
    } as PageSection
  ]
};

export default function PageBuilderTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Page Builder Test</h1>
          <p className="text-gray-600">Demonstrating the Page Builder components with sample data</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <PageRenderer pageStructure={samplePage} />
        </div>
      </div>
    </div>
  );
}