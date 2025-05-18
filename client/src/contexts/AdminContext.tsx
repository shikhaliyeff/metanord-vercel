import { createContext, useContext, ReactNode } from 'react';

interface AdminContextType {
  activeTab: string;
  navigateTo: (tab: string, params?: Record<string, string>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

interface AdminProviderProps {
  children: ReactNode;
  value: AdminContextType;
}

export function AdminProvider({ children, value }: AdminProviderProps) {
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}