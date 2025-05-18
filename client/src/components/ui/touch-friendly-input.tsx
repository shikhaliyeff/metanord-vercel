import React from "react";
import { Input } from "./input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface TouchFriendlyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
}

export function TouchFriendlyInput({
  className,
  label,
  helpText,
  error,
  ...props
}: TouchFriendlyInputProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id} 
          className={cn(
            "block text-sm font-medium",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </label>
      )}
      <Input
        className={cn(
          isMobile && "h-11 px-4 text-base",
          error && "border-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {(helpText || error) && (
        <p 
          className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || helpText}
        </p>
      )}
    </div>
  );
}

// TouchFriendly Textarea component
import { Textarea } from "./textarea";

interface TouchFriendlyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  error?: string;
}

export function TouchFriendlyTextarea({
  className,
  label,
  helpText,
  error,
  ...props
}: TouchFriendlyTextareaProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id} 
          className={cn(
            "block text-sm font-medium",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </label>
      )}
      <Textarea
        className={cn(
          isMobile && "px-4 py-3 text-base",
          error && "border-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {(helpText || error) && (
        <p 
          className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || helpText}
        </p>
      )}
    </div>
  );
}

// Touch-friendly Button Group
interface TouchFriendlyButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function TouchFriendlyButtonGroup({
  children,
  className,
  orientation = "horizontal"
}: TouchFriendlyButtonGroupProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div 
      className={cn(
        "flex gap-2",
        orientation === "vertical" && "flex-col",
        isMobile && orientation === "horizontal" && "flex-wrap",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Safely clone the element with a new className
          return React.cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              isMobile && "min-h-[44px]" // Ensure minimum touch target size
            ),
          });
        }
        return child;
      })}
    </div>
  );
}