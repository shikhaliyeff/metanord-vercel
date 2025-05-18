import React, { useState } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({ color, onChange, className, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleColorChange = (newColor: ColorResult) => {
    onChange(newColor.hex);
  };
  
  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <div className={cn("flex items-center gap-2", className)}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "h-8 w-10 rounded-md border border-input shadow-sm",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          />
        </PopoverTrigger>
        <div className="text-sm text-muted-foreground font-mono">
          {color}
        </div>
      </div>
      <PopoverContent className="w-auto p-0 border-none" align="start">
        <SketchPicker
          color={color}
          onChange={handleColorChange}
          presetColors={[
            "#005fa3", // Primary blue
            "#00c4ff", // Secondary blue
            "#0096db", // Medium blue
            "#ffffff", // White
            "#f8fafc", // Light gray
            "#f1f5f9", // Lighter gray
            "#e2e8f0", // Light border
            "#94a3b8", // Medium gray
            "#64748b", // Dark gray
            "#334155", // Darker gray
            "#1e293b", // Very dark gray
            "#0f172a", // Almost black
            "#ef4444", // Red
            "#f97316", // Orange
            "#eab308", // Yellow
            "#22c55e", // Green
            "#06b6d4", // Cyan
            "#8b5cf6", // Purple
            "#ec4899", // Pink
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}