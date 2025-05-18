import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'scale-up' 
  | 'scale-down' 
  | 'stagger';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  duration?: number;
  staggerChildren?: number;
  staggerDirection?: 'forward' | 'reverse';
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  duration = 0.7,
  staggerChildren = 0.1,
  staggerDirection = 'forward',
  ...props
}: AnimatedSectionProps & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, isInView } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // Define animation variants based on the type
  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    'fade-down': {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 }
    },
    'fade-left': {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    },
    'fade-right': {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1 }
    },
    'scale-down': {
      hidden: { opacity: 0, scale: 1.15 },
      visible: { opacity: 1, scale: 1 }
    },
    'stagger': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  };

  const containerVariants = animation === 'stagger' ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
        staggerDirection: staggerDirection === 'forward' ? 1 : -1
      }
    }
  } : undefined;

  return (
    <div ref={ref} className={cn(className)} {...props}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        transition={{
          duration,
          delay: animation !== 'stagger' ? delay : 0,
          ease: "easeOut"
        }}
        className="w-full"
      >
        {animation === 'stagger' ? (
          // For staggered animations, we need to wrap each child
          Array.isArray(children) ? (
            <>
              {React.Children.map(children, (child) => (
                <motion.div variants={variants[animation]}>
                  {child}
                </motion.div>
              ))}
            </>
          ) : (
            <motion.div variants={variants[animation]}>
              {children}
            </motion.div>
          )
        ) : (
          // For non-staggered animations
          <motion.div variants={variants[animation]}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}