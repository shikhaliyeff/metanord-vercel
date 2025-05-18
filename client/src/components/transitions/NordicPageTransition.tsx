import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import NordicTransitionEffects from './NordicTransitionEffects';

interface NordicPageTransitionProps {
  children: ReactNode;
  transitionType?: 'standard' | 'wave' | 'geometric';
}

/**
 * A Nordic-inspired page transition component
 * 
 * Creates smooth transitions between pages with styles inspired by Nordic design:
 * - Clean, minimalist animations
 * - Light, airy feel with subtle geometric patterns
 * - Soft color transitions reminiscent of Nordic landscapes
 */
const NordicPageTransition = ({ 
  children, 
  transitionType = 'standard'
}: NordicPageTransitionProps) => {
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
      }, 600); // Match this with the exit animation duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  // Modern, enhanced Nordic-inspired animations
  // - Smoother transitions with subtle scaling and blur effects
  // - Sleek, professional feel that matches premium brand image
  const pageVariants = {
    fadeIn: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.19, 1.0, 0.22, 1.0], // Custom easing curve for modern feel
      }
    },
    fadeOut: {
      opacity: 0,
      y: -15,
      scale: 0.98,
      filter: "blur(4px)",
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96], // Custom easing curve for modern feel
      }
    }
  };

  return (
    <div className="nordic-transition-container relative min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayLocation}
          initial="fadeOut"
          animate={transitionStage}
          variants={pageVariants}
          className="min-h-screen"
        >
          {/* The page content */}
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Nordic-styled transition effects */}
      <NordicTransitionEffects 
        isActive={transitionStage === 'fadeOut'} 
        type={transitionType} 
      />
    </div>
  );
};

export default NordicPageTransition;