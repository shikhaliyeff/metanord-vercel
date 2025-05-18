import React, { ReactNode } from 'react';

interface MobileFormLayoutProps {
  children: ReactNode;
}

export const MobileFormLayout = ({ children }: MobileFormLayoutProps) => {
  return (
    <div className="py-4 flex flex-col gap-6 max-h-[70vh] overflow-y-auto px-1">
      {children}
    </div>
  );
};