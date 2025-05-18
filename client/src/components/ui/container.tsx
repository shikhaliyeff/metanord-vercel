import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className, id }: ContainerProps) {
  return (
    <div 
      id={id}
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 relative z-10", 
        className
      )}
    >
      {children}
    </div>
  );
}