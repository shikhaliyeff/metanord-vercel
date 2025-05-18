import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
}

// Nordic-inspired colors
const snowWhite = '#F8F9FB';
const fjordBlue = '#86A1B1';

const PageTransition = ({ children }: PageTransitionProps) => {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
      
      // After the exit animation, update location and fade in
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 400); // Match this with the exit animation duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  // Nordic-inspired animations
  // - Smooth, clean, and minimal transitions
  // - Gentle, flowing movements representing natural elements (snow, water, ice)
  const pageVariants = {
    fadeIn: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    },
    fadeOut: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      }
    }
  };

  // For individual elements to animate into view with a subtle stagger
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation}
        initial="fadeOut"
        animate={transitionStage}
        variants={pageVariants}
        className="page-transition"
      >
        {/* Transitioning content */}
        {children}
        
        {/* Nordic-inspired overlay effect for page transitions */}
        {transitionStage === 'fadeOut' && (
          <motion.div 
            className="fixed inset-0 z-50 pointer-events-none" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 backdrop-blur-sm" />
            
            {/* Geometric Nordic pattern - horizontal lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="h-px w-full bg-white/10"
                  style={{ 
                    top: `${(i * 5) + 2}%`,
                    opacity: 0.1 + (i * 0.03), 
                    transform: `scaleX(${1 - (i * 0.03)})`,
                  }}
                  initial={{ scaleX: 0, x: -100 }}
                  animate={{ scaleX: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeOut",
                    delay: 0.05 * i 
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;