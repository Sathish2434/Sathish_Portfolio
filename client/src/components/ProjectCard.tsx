import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  delay?: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  technologies,
  features,
  liveUrl,
  githubUrl,
  delay = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className="group"
    >
      <Card className="rounded-2xl overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-background">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="flex space-x-2">
              {liveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                  data-testid={`project-live-${title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {githubUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                  data-testid={`project-github-${title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>

          {/* Technologies - Initially hidden, shown on hover */}
          <motion.div
            className="technologies"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech, index) => (
                <Badge
                  key={tech}
                  variant={index % 2 === 0 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <strong>Key Features:</strong> {features.join(", ")}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
