import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AIWidget } from "@/components/AIWidget";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Footer from "@/components/Footer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
              {/* Hero Section */}
              <section id="home" className="scroll-mt-16">
                <Hero />
              </section>
              
              {/* About Section */}
              <section id="about" className="scroll-mt-16">
                <About />
              </section>
              
              {/* Services Section */}
              <section id="services" className="scroll-mt-16">
                <Services />
              </section>
              
              {/* Portfolio Section */}
              <section id="portfolio" className="scroll-mt-16">
                <Portfolio />
              </section>
              
              {/* Blog Section */}
              <section id="blog" className="scroll-mt-16">
                <Blog />
              </section>
              
              {/* Contact Section */}
              <section id="contact" className="scroll-mt-16">
                <Contact />
              </section>
            </main>
            <Footer />
            <AIWidget />
            <Toaster />
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
