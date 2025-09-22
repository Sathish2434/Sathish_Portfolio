import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionCard({ children, className, delay = 0 }: SectionCardProps) {
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
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <Card className={cn(
        "rounded-2xl border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-2xl",
        className
      )}>
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
