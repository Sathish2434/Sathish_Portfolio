import { motion } from "framer-motion";
import { Link } from "wouter";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const projects = [
    {
      title: "AI-Commerce Platform",
      description: "Full-stack e-commerce platform with AI-powered product recommendations, intelligent search, and personalized shopping experiences.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Node.js", "OpenAI", "PostgreSQL"],
      features: ["AI recommendations", "Real-time chat support", "Advanced analytics"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/ai-commerce"
    },
    {
      title: "SmartTask AI",
      description: "Intelligent task management system with AI-powered priority suggestions, automated scheduling, and natural language task creation.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Next.js", "TypeScript", "OpenAI", "Prisma"],
      features: ["Natural language processing", "Smart scheduling", "Team collaboration"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/smarttask"
    },
    {
      title: "DataViz Pro",
      description: "Advanced analytics platform with real-time data visualization, predictive modeling, and interactive dashboard customization.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Vue.js", "Python", "D3.js", "MongoDB"],
      features: ["Real-time updates", "Custom widgets", "Predictive analytics"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/dataviz"
    },
    {
      title: "ConnectHub",
      description: "Modern social media platform with real-time messaging, content sharing, and AI-powered content moderation and recommendation system.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["React Native", "GraphQL", "Redis", "Socket.io"],
      features: ["Real-time chat", "Content moderation", "Cross-platform"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/connecthub"
    },
    {
      title: "WealthTracker",
      description: "Comprehensive financial management platform with AI-driven insights, portfolio tracking, and automated investment recommendations.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Angular", "Spring Boot", "Machine Learning", "MySQL"],
      features: ["Portfolio analysis", "Risk assessment", "Automated trading"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/wealthtracker"
    },
    {
      title: "HealthSync",
      description: "Integrated healthcare management system with patient records, appointment scheduling, and AI-powered diagnostic assistance for healthcare providers.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", ".NET Core", "Azure", "HIPAA"],
      features: ["Patient management", "Telemedicine", "Secure messaging"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/healthsync"
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
            Featured Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of innovative solutions and creative implementations
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="group"
              data-testid="view-all-projects"
            >
              View All Projects
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
