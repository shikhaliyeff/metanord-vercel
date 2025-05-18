import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="page-header pb-4 md:pb-6 lg:pb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-4">
          {description}
        </p>
      )}
      {children && <div className={cn("mt-4 md:mt-6")}>{children}</div>}
    </div>
  );
}