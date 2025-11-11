import { Github, Linkedin, Twitter, Dribbble, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 64; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              SATHISH
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Full Stack Developer & AI Specialist crafting innovative digital experiences.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://github.com/Sathish2434"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                data-testid="footer-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sathish-sundharamoorthy-959946294/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                data-testid="footer-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/SATHISH00731"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                data-testid="footer-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/god__of_pain/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                data-testid="footer-dribbble"
              >
                <Dribbble className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("home")}
                >
                  Home
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("services")}
                >
                  Services
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("portfolio")}
                >
                  Portfolio
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("services")}
                >
                  Web Development
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("services")}
                >
                  AI Integration
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("services")}
                >
                  UI/UX Design
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => scrollToSection("services")}
                >
                  Consulting
                </span>
              </li>
              <li>
                <span 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    const aiWidget = document.querySelector('[data-ai-widget]');
                    if (aiWidget) {
                      (aiWidget as HTMLElement).click();
                    }
                  }}
                >
                  AI Assistant
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:sathishsundharamoorthym@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  data-testid="footer-email"
                >
                  sathishsundharamoorthym@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href="tel:+916379387377"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  data-testid="footer-phone"
                >
                  +91 6379387377
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">SH 49, Mahabalipuram, Tamil Nadu 603104</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Sathish Sundaramoorthy. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
