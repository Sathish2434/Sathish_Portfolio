import { motion } from "framer-motion";
import { Code, Brain, Palette, Cloud, Lightbulb, Wrench, Check } from "lucide-react";
import SectionCard from "@/components/SectionCard";

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Full-stack web applications built with modern frameworks and best practices. From concept to deployment, I deliver scalable and maintainable solutions.",
      features: [
        "React.js & Next.js Applications",
        "RESTful & GraphQL APIs",
        "Database Design & Optimization"
      ]
    },
    {
      icon: Brain,
      title: "AI Integration",
      description: "Seamlessly integrate AI capabilities into your applications. From chatbots to advanced analytics, I help you leverage the power of artificial intelligence.",
      features: [
        "OpenAI & Custom AI Models",
        "Intelligent Chatbots & Assistants",
        "Data Analysis & ML Pipelines"
      ]
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "User-centered design that combines aesthetics with functionality. Creating interfaces that are both beautiful and intuitive to use.",
      features: [
        "Responsive Design Systems",
        "User Research & Prototyping",
        "Accessibility & Performance"
      ]
    },
    {
      icon: Cloud,
      title: "Java Development",
      description: "Scalable infrastructure and deployment pipelines. From local development to production, ensuring your applications run smoothly and securely.",
      features: [
        "AWS & Docker Deployment",
        "CI/CD Pipeline Setup",
        "Monitoring & Security"
      ]
    },
    {
      icon: Lightbulb,
      title: "Technical Consulting",
      description: "Strategic guidance for your technology decisions. Architecture reviews, technology selection, and roadmap planning for your digital initiatives.",
      features: [
        "Architecture & Code Reviews",
        "Technology Stack Selection",
        "Team Training & Mentoring"
      ]
    },
    {
      icon: Wrench,
      title: "Maintenance & Support",
      description: "Ongoing support and maintenance for your applications. Bug fixes, performance optimization, and feature enhancements to keep your systems running smoothly.",
      features: [
        "24/7 Monitoring & Support",
        "Performance Optimization",
        "Security Updates & Patches"
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
