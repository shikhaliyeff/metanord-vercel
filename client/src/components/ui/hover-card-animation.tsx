import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverCardAnimationProps {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  scaleOnHover?: boolean;
  liftOnHover?: boolean;
  glowOnHover?: boolean;
  borderOnHover?: boolean;
}

export function HoverCardAnimation({
  children,
  className,
  backgroundClassName,
  scaleOnHover = true,
  liftOnHover = true,
  glowOnHover = true,
  borderOnHover = false,
}: HoverCardAnimationProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg transition-all duration-300',
        liftOnHover && 'hover:-translate-y-2',
        glowOnHover && 'hover:shadow-xl',
        borderOnHover && 'hover:border-accent/50 border-2 border-transparent',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={scaleOnHover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Subtle background animation */}
      {glowOnHover && (
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-tr from-accent/5 via-accent/10 to-primary/5 opacity-0 transition-opacity',
            backgroundClassName
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}