import { motion } from "framer-motion";
import { Code, Coffee, Brain, ShoppingCart, Plug, Lightbulb, Check } from "lucide-react";
import SectionCard from "@/components/SectionCard";

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "Complete end-to-end web application development from frontend to backend. Building robust, scalable, and maintainable full-stack solutions using modern technologies and best practices.",
      features: [
        "Frontend: React, Next.js, TypeScript",
        "Backend: Node.js, Express, REST APIs",
        "Database: PostgreSQL, MongoDB, MySQL",
        "Deployment & DevOps Integration"
      ]
    },
    {
      icon: Coffee,
      title: "Java Backend Development",
      description: "Enterprise-grade backend systems built with Java. Creating high-performance, secure, and scalable server-side applications using Spring Boot and modern Java frameworks.",
      features: [
        "Spring Boot & Spring Framework",
        "RESTful & Microservices Architecture",
        "Database Integration & ORM",
        "Security & Authentication Systems"
      ]
    },
    {
      icon: Brain,
      title: "AI-Powered Web Integration",
      description: "Seamlessly integrate artificial intelligence capabilities into your web applications. From intelligent chatbots to advanced analytics, leverage AI to enhance user experiences and automate processes.",
      features: [
        "OpenAI & Custom AI Model Integration",
        "Intelligent Chatbots & Virtual Assistants",
        "Machine Learning Pipelines",
        "AI-Powered Analytics & Insights"
      ]
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Development",
      description: "Complete e-commerce solutions from product catalogs to payment processing. Building secure, user-friendly online stores with modern shopping experiences and robust transaction handling.",
      features: [
        "Shopping Cart & Checkout Systems",
        "Payment Gateway Integration",
        "Inventory & Order Management",
        "Customer Account & Dashboard"
      ]
    },
    {
      icon: Plug,
      title: "API Design & Integration",
      description: "Design and develop robust APIs that connect your systems seamlessly. Creating well-documented, secure, and efficient APIs for third-party integrations and internal services.",
      features: [
        "RESTful & GraphQL API Design",
        "Third-Party Service Integration",
        "API Documentation & Testing",
        "Authentication & Rate Limiting"
      ]
    },
    {
      icon: Lightbulb,
      title: "Technical Consultation",
      description: "Strategic technology guidance and expert consultation for your projects. Architecture reviews, technology stack recommendations, and roadmap planning to ensure your digital initiatives succeed.",
      features: [
        "System Architecture & Design Reviews",
        "Technology Stack Selection",
        "Code Review & Best Practices",
        "Team Training & Technical Mentoring"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            What I Do
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for your digital transformation needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <SectionCard key={service.title} delay={index * 0.1}>
              <div className="group">
                <motion.div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-gradient-to-r from-accent to-primary"
                  }`}
                  whileHover={{ rotate: 5 }}
                >
                  <service.icon className="h-6 w-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
