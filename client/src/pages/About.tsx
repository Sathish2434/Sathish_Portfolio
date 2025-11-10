import { motion } from "framer-motion";
import SectionCard from "@/components/SectionCard";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const skills = [
    "React.js", "Node.js", "JavaScript", "Java", "Spring Boot",
    "TailWindCSS", "MySql", "RestAPI", "Next.js"
  ];

  const stats = [
    { value: "10+", label: "Projects" },
    { value: "3+", label: "Internships" },
    { value: "10+", label: "Certifications" },
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
            About Me
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating digital experiences that combine beautiful design with powerful functionality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="/Sathish.jpg"
                alt="Sathish - Professional headshot"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl"></div>
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">Hello, I'm Sathish!</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                With a strong foundation in full-stack development, I focus on building modern web
                applications with seamless AI integration. I’m passionate about making complex
                technologies simple and user-friendly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Beyond coding, I enjoy learning the latest in AI, contributing to projects, and
                supporting fellow developers in their growth.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Core Technologies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <Badge
                      variant={index % 2 === 0 ? "default" : "secondary"}
                      className="w-full justify-center py-2"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="text-2xl font-bold text-primary"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
