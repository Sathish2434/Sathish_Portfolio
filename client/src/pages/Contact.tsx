import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "sathishsundharamoorthym@gmail.com",
      href: "mailto:sathishsundharamoorthym@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 6379387377",
      href: "tel:+916379387377"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "SH 49, Mahabalipuram, Tamil Nadu 603104",
      href: null
    }
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/Sathish2434", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/sathish-sundharamoorthy-959946294/", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/SATHISH00731", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/god__of_pain/?hl=en", label: "Instagram" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-6">Let's Connect</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you have a project in mind, need technical consultation, or just want to chat about
                the latest in web development and AI, I'm always excited to connect with fellow innovators and entrepreneurs.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{method.label}</div>
                    {method.href ? (
                      <a
                        href={method.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        data-testid={`contact-${method.label.toLowerCase()}`}
                      >
                        {method.value}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{method.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="font-medium mb-4">Follow Me</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                    data-testid={`social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
