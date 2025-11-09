import { motion } from "framer-motion";
import { Link } from "wouter";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function Portfolio() {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "An e-commerce web application supporting product browsing, search/filter, shopping cart, favourite items, user authentication, order checkout with a payment gateway. Mobile responsive, secure, and production-ready.",
      image: "/E-Com.png",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Favourite Items", "Cart Management", "Payment Gateway"],
      liveUrl: "https://dazzlewear.netlify.app/",
      githubUrl: "https://github.com/Sathish2434/E-com.git"
    },
    {
      title: "Coffee Cup",
      description: "A user-friendly task management system focused on intuitive UI design, automated scheduling, and natural language task creation. Inspired by the coffee cup theme for a warm, productive experience.",
      image: "/Coffee.png",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      features: ["Gift voucher and special offers section", "Responsive design", "Interactive features"],
      liveUrl: "https://sathish2434.github.io/coffee/",
      githubUrl: "https://github.com/Sathish2434/coffee.git"
    },
    {
      title: "AI-Powered Collaborative Knowledge Hub",
      description: "AI-Powered Collaborative Knowledge Hub with AI-powered priority suggestions, automated scheduling, and natural language task creation.",
      image: "/public/AI.png",
      technologies: ["React.js", "TailwindCSS", "JavaScript", "GEMINI", "Supabase"],
      features: ["Real-time updates", "Data Visualization", "Form Management"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/Sathish2434/AI-Powered-Collaborative-Knowledge-Hub.git"
    },
    {
      title: "Music Player",
      description: "A modern music player with a sleek design, smooth animations, and a focus on user experience. Inspired by the music player theme for a seamless, enjoyable listening experience.",
      image: "/public/music.png",
      technologies: ["React vite", "TailwindCSS", "JavaScript", "iTune API"],
      features: [" Play / Pause / Seek audio tracks", " Album artwork display", "Responsive UI "],
      liveUrl: "https://music-player-three-omega-72.vercel.app/",
      githubUrl: "https://github.com/Sathish2434/Music_Player.git"
    },
    {
      title: "Weather Finder",
      description: "Modern weather application delivering real-time forecasts, location-based weather insights, and an intuitive user interface for quick and accurate weather updates.",
      image: "/public/Weather.png",
      technologies: ["HTML5", "CSS3", "JavaScript", "OpenWeatherMap API"],
      features: ["Real-time weather updates", "Location-based weather insights", "Intuitive user interface"],
      liveUrl: "https://sathish2434.github.io/Weather-finder/",
      githubUrl: "https://github.com/Sathish2434/Weather-finder.git"
    },
    {
      title: "Fake News Detector",
      description: "Integrated healthcare management system with patient records, appointment scheduling, and AI-powered diagnostic assistance for healthcare providers.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", ".NET Core", "Azure", "HIPAA"],
      features: ["Patient management", "Telemedicine", "Secure messaging"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/healthsync"
    }
  ];

  const moreProjects = [
    {
      title: "Blog Markdown Editor",
      description: "A clean markdown editor with live preview, syntax highlighting, and export to HTML/PDF.",
      image: "/Markdown.png",
      technologies: ["React", "TailwindCSS", "TypeScript"],
      features: ["Live preview", "Export", "Autosave"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/markdown-editor"
    },
    {
      title: "AI Chat Widget",
      description: "Embeddable AI support widget with context memory and themeable UI.",
      image: "/AI.png",
      technologies: ["React", "Vite", "OpenAI"],
      features: ["Context memory", "Theming", "Embeddable"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/ai-widget"
    },
    {
      title: "Analytics Dashboard",
      description: "Responsive analytics dashboard with charts, filters, and exportable reports.",
      image: "https://images.unsplash.com/photo-1551281044-8d8d8a6c6d90?auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Chart.js", "TailwindCSS"],
      features: ["Charts", "Filters", "Exports"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/analytics-dashboard"
    },
    {
      title: "Portfolio v1",
      description: "Earlier iteration of my portfolio with simpler animations and layout.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=400",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Responsive", "Accessible", "SEO"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/portfolio-v1"
    },
    {
      title: "Task Manager",
      description: "Kanban-style task manager with drag-and-drop and offline support.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Dexie", "TailwindCSS"],
      features: ["Drag-and-drop", "Offline", "Search"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/task-manager"
    },
    {
      title: "Docs Site",
      description: "Documentation site with search, versioning, and dark mode.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=400",
      technologies: ["Vite", "React", "Algolia"],
      features: ["Search", "Versioning", "Dark mode"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/docs-site"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Projects Button – reveal and scroll to more projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="group"
            data-testid="view-all-projects"
            onClick={() => {
              if (!showMore) {
                setShowMore(true);
                // Allow React to commit and the section to mount before scrolling
                setTimeout(() => {
                  moreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              } else {
                moreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
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
        </motion.div>

        {/* More Projects Section (revealed after button click) */}
        {showMore && (
        <div id="more-projects" ref={moreRef} className="scroll-mt-28 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold">More Projects</h2>
            <p className="text-muted-foreground mt-2">Explore additional work and experiments</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {moreProjects.map((project, index) => (
              <ProjectCard
                key={`more-${project.title}`}
                {...project}
                delay={index * 0.06}
              />
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
