import { motion } from 'framer-motion';

interface NordicTransitionEffectsProps {
  isActive: boolean;
  type?: 'standard' | 'wave' | 'geometric';
}

const NordicTransitionEffects = ({ 
  isActive, 
  type = 'standard' 
}: NordicTransitionEffectsProps) => {
  
  // Don't render if not active
  if (!isActive) return null;

  // Standard transition with minimalist Nordic design
  if (type === 'standard') {
    return (
      <motion.div 
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Soft frost overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        
        {/* Subtle diagonal lines suggesting Nordic patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              className="h-screen w-full"
              style={{ 
                position: 'absolute',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%)',
                backgroundSize: `${30 + (i * 5)}px ${30 + (i * 5)}px`,
                opacity: 0.5 - (i * 0.04),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 - (i * 0.04) }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            />
          ))}
        </div>
        
        {/* Central transition element */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-primary-light/20 backdrop-blur-md" />
        </motion.div>
      </motion.div>
    );
  }

  // Wave-like animation representing Nordic fjords and water
  if (type === 'wave') {
    return (
      <motion.div 
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 backdrop-blur-sm" />
        
        {/* Wave patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-screen h-24"
              style={{ 
                top: `${(i * 12) + 5}%`,
                background: `linear-gradient(90deg, 
                  rgba(134, 161, 177, ${0.01 + (i * 0.01)}) 0%, 
                  rgba(134, 161, 177, ${0.03 + (i * 0.01)}) 50%, 
                  rgba(134, 161, 177, ${0.01 + (i * 0.01)}) 100%)`,
                borderRadius: '50%',
                height: `${10 + (i * 2)}px`,
                transform: `scaleX(1.5) translateY(${i % 2 === 0 ? 5 : -5}px)`,
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2.5 - (i * 0.2), 
                ease: "easeInOut",
                repeat: 0,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Geometric patterns inspired by Nordic design
  if (type === 'geometric') {
    return (
      <motion.div 
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        {/* Geometric elements */}
        <div className="absolute inset-0">
          {/* Triangle grid */}
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="trianglePattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <motion.path 
                d="M0,0 L10,0 L5,8.66 z" 
                fill="none" 
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="0.2"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </pattern>
            <motion.rect 
              width="100%" 
              height="100%" 
              fill="url(#trianglePattern)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          
          {/* Central decorative element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-32 h-32 rotate-45"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 border-2 border-white/10 rounded" />
              <div className="absolute inset-4 border border-white/10 rounded" />
              <div className="absolute inset-8 border border-white/10 rounded" />
              <div className="absolute inset-12 border border-white/10 rounded" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default NordicTransitionEffects;