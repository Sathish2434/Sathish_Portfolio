import { motion } from "framer-motion";
import { BookOpen, Target, FileText, Lightbulb } from "lucide-react";
import SectionCard from "@/components/SectionCard";

export default function Blog() {
  const sections = [
    {
      icon: BookOpen,
      title: "Welcome to My Portfolio Blog",
      content: "This space is straightforward—no unnecessary noise. I created this blog to keep a clear record of my work, my learning, and the ideas that shape me as a developer. Technology keeps moving forward, and staying rooted in the basics while exploring new possibilities is the balance I follow."
    },
    {
      icon: Target,
      title: "Why This Blog Exists",
      content: "I wanted a place where I could share experiences that actually matter—projects I build, challenges I face, and lessons I pick up along the way. Writing things down helps me stay honest about my progress and reminds me where I started and how far I've come."
    },
    {
      icon: FileText,
      title: "What You Will Find Here",
      content: "Practical breakdowns of my projects, clean explanations of concepts I learn, real problem-solving approaches, and personal reflections on growth and discipline. No unnecessary complexity—just useful content that can help others or serve as a reference for myself."
    },
    {
      icon: Lightbulb,
      title: "My Approach to Development",
      content: "I value consistency. Good work doesn't happen overnight. It comes from learning the fundamentals, respecting the process, and being open to new ideas. Innovation means nothing without clarity and discipline. Every project I build is shaped by this mindset."
    }
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
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A space for learning, sharing, and reflecting on the journey of development
          </p>
        </motion.div>

        {/* Blog Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <SectionCard key={section.title} delay={index * 0.1}>
              <div className="group">
                <motion.div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-gradient-to-r from-accent to-primary"
                  }`}
                  whileHover={{ rotate: 5 }}
                >
                  <section.icon className="h-6 w-6 text-white" />
                </motion.div>

                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {section.content}
                </p>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}

