import { createContext, ReactNode, useContext, useState } from 'react';

type TransitionType = 'standard' | 'wave' | 'geometric';

interface TransitionContextType {
  transitionType: TransitionType;
  setTransitionType: (type: TransitionType) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

interface TransitionProviderProps {
  children: ReactNode;
  initialType?: TransitionType;
}

/**
 * Provider for the transition context
 * 
 * This allows any component in the app to access or change the current
 * page transition animation style.
 */
export const TransitionProvider = ({ 
  children, 
  initialType = 'standard' 
}: TransitionProviderProps) => {
  const [transitionType, setTransitionType] = useState<TransitionType>(initialType);

  return (
    <TransitionContext.Provider value={{ transitionType, setTransitionType }}>
      {children}
    </TransitionContext.Provider>
  );
};

/**
 * Hook to access the transition context
 * 
 * Use this in components to get or set the current transition type
 */
export const useTransition = () => {
  const context = useContext(TransitionContext);
  
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  
  return context;
};