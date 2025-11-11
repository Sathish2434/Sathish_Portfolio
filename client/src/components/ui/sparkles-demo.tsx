import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useTheme } from "@/components/ThemeProvider";

export function SparklesPreview() {
  const { theme } = useTheme();
  const particleColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <div className="h-[40rem] w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md border border-border">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-foreground relative z-20">
        Acme
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-accent to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-accent to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor={particleColor}
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

export function SparklesPreviewDark() {
  const { theme } = useTheme();
  const particleColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <div className="h-[40rem] relative w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md border border-border">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor={particleColor}
          speed={1}
        />
      </div>
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-foreground relative z-20">
        Build faster
      </h1>
    </div>
  );
}

export function SparklesPreviewColorful() {
  const { theme } = useTheme();
  // Use accent color for colorful effect, with fallback
  const particleColor = theme === "dark" ? "#616161" : "#000000";

  return (
    <div className="h-[40rem] relative w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md border border-border">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlescolorful"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor={particleColor}
          speed={0.5}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 relative z-20">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
          The Future
        </h1>
        <p className="text-muted-foreground cursor-default text-center">
          is brighter than you think
        </p>
      </div>
    </div>
  );
}

