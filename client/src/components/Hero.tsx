import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const nameVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
      
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
          variants={nameVariants}
        >
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent whitespace-nowrap">
            Sathish Sundaramoorthy
          </span>
          <motion.span
            className="block text-2xl sm:text-3xl lg:text-4xl font-light text-muted-foreground mt-4"
            variants={itemVariants}
          >
            Full Stack Developer & Java Developer
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Crafting innovative web experiences with cutting-edge AI integration.
          Transforming ideas into scalable, beautiful applications that make a difference.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 group"
              data-testid="hero-view-work"
            >
              View My Work
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted transition-all duration-300 group"
              data-testid="hero-try-ai"
            >
              Try AI Assistant
              <Bot className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
