import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className = "" }: PageHeaderProps) {
  return (
    <div className={`bg-muted/30 pt-8 pb-10 xs:pt-10 xs:pb-12 sm:py-12 md:py-16 ${className}`}>
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto md:mx-0">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 xs:mb-3 sm:mb-4 text-balance">{title}</h1>
          {description && (
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-prose text-balance">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;