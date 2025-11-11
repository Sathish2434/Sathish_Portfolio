import { motion } from "framer-motion";

interface AnimatedDotBackgroundProps {
  className?: string;
}

export default function AnimatedDotBackground({ className = "" }: AnimatedDotBackgroundProps) {
  // Generate random dots with different sizes and positions
  const dots = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1, // Random size between 1-5px
    x: Math.random() * 100, // Random x position (percentage)
    y: Math.random() * 100, // Random y position (percentage)
    delay: Math.random() * 5, // Random animation delay
    duration: Math.random() * 10 + 10, // Random duration between 10-20 seconds
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Background gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
      
      {/* Animated dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-foreground/20"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Grid pattern overlay for more dynamic effect */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            backgroundPosition: '0 0, 25px 25px',
          }}
        />
      </div>
    </div>
  );
}

