import type { Request, Response } from "express";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
}

// Knowledge base about Sathish
const knowledgeBase = {
  name: "Sathish Sundaramoorthy",
  title: "Full Stack Developer & Java Developer",
  bio: "I'm a Full Stack Developer with a strong foundation in full-stack development. I focus on building modern web applications with seamless AI integration. I'm passionate about making complex technologies simple and user-friendly. Beyond coding, I enjoy learning the latest in AI, contributing to projects, and supporting fellow developers in their growth.",
  skills: [
    "React.js",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML5",
    "CSS3",
    "TailwindCSS",
    "Java",
    "AI Integration",
    "Full Stack Development"
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description: "An e-commerce web application supporting product browsing, search/filter, shopping cart, favourite items, user authentication, order checkout with a payment gateway.",
      tech: ["HTML", "CSS", "JavaScript"],
      url: "https://dazzlewear.netlify.app/",
      github: "https://github.com/Sathish2434/E-com.git"
    },
    {
      name: "Coffee Cup",
      description: "A user-friendly task management system focused on intuitive UI design, automated scheduling, and natural language task creation.",
      tech: ["HTML5", "CSS3", "JavaScript"],
      github: "https://github.com/Sathish2434/coffee.git"
    },
    {
      name: "AI-Powered Collaborative Knowledge Hub",
      description: "AI-Powered Collaborative Knowledge Hub with AI-powered priority suggestions, automated scheduling, and natural language task creation.",
      tech: ["React.js", "TailwindCSS", "JavaScript", "GEMINI", "Supabase"],
      github: "https://github.com/Sathish2434/AI-Powered-Collaborative-Knowledge-Hub.git"
    },
    {
      name: "Music Player",
      description: "A modern music player with a sleek design, smooth animations, and a focus on user experience.",
      tech: ["React vite", "TailwindCSS", "JavaScript", "iTune API"],
      url: "https://music-player-three-omega-72.vercel.app/",
      github: "https://github.com/Sathish2434/Music_Player.git"
    },
    {
      name: "Weather Finder",
      description: "Modern weather application delivering real-time forecasts, location-based weather insights, and an intuitive user interface.",
      tech: ["HTML5", "CSS3", "JavaScript", "OpenWeatherMap API"],
      url: "https://sathish2434.github.io/Weather-finder/",
      github: "https://github.com/Sathish2434/Weather-finder.git"
    },
    {
      name: "Fake News Detector",
      description: "A project focused on detecting fake news using AI and machine learning techniques.",
      tech: ["Python", "Machine Learning", "AI"]
    }
  ],
  social: {
    github: "https://github.com/Sathish2434",
    linkedin: "https://www.linkedin.com/in/sathish-sundharamoorthy-959946294/",
    twitter: "https://x.com/SATHISH00731",
    instagram: "https://www.instagram.com/god__of_pain/?hl=en"
  },
  interests: [
    "AI and Machine Learning",
    "Full Stack Development",
    "Modern Web Technologies",
    "Contributing to Open Source",
    "Supporting Fellow Developers"
  ]
};

// Simple keyword matching and response generation
function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
    return `Hello! I'm here to help you learn about ${knowledgeBase.name}. What would you like to know?`;
  }
  
  // Name questions
  if (message.match(/\b(who are you|what is your name|your name|name)\b/)) {
    return `I'm ${knowledgeBase.name}, a ${knowledgeBase.title}. ${knowledgeBase.bio}`;
  }
  
  // About/Bio questions
  if (message.match(/\b(about|tell me about|who is|bio|background|introduce)\b/)) {
    return `I'm ${knowledgeBase.name}, a ${knowledgeBase.title}. ${knowledgeBase.bio}`;
  }
  
  // Skills questions
  if (message.match(/\b(skills|technologies|tech stack|what can you do|expertise|proficient)\b/)) {
    return `My skills include: ${knowledgeBase.skills.join(", ")}. I specialize in full-stack development with a focus on modern web technologies and AI integration.`;
  }
  
  // Projects questions
  if (message.match(/\b(projects|portfolio|work|what have you built|applications|apps)\b/)) {
    const projectList = knowledgeBase.projects.map(p => 
      `• ${p.name}: ${p.description} (Built with ${p.tech.join(", ")})`
    ).join("\n");
    return `Here are some of my projects:\n\n${projectList}\n\nYou can check out my GitHub at ${knowledgeBase.social.github} for more details!`;
  }
  
  // Specific project questions
  for (const project of knowledgeBase.projects) {
    if (message.includes(project.name.toLowerCase())) {
      let response = `${project.name}: ${project.description}\n\nTechnologies used: ${project.tech.join(", ")}`;
      if (project.url) response += `\nLive demo: ${project.url}`;
      if (project.github) response += `\nGitHub: ${project.github}`;
      return response;
    }
  }
  
  // Contact/Social questions
  if (message.match(/\b(contact|social|github|linkedin|twitter|instagram|where can i find|links)\b/)) {
    return `You can find me on:\n• GitHub: ${knowledgeBase.social.github}\n• LinkedIn: ${knowledgeBase.social.linkedin}\n• Twitter: ${knowledgeBase.social.twitter}\n• Instagram: ${knowledgeBase.social.instagram}\n\nFeel free to reach out!`;
  }
  
  // Experience/Experience level
  if (message.match(/\b(experience|years|how long|expertise level)\b/)) {
    return `I'm a Full Stack Developer with experience in building modern web applications. I focus on creating scalable solutions with AI integration and have worked on various projects ranging from e-commerce platforms to AI-powered applications.`;
  }
  
  // Interests/Passions
  if (message.match(/\b(interests|passion|hobbies|what do you like|enjoy)\b/)) {
    return `I'm passionate about ${knowledgeBase.interests.join(", ")}. I love learning new technologies and helping fellow developers grow.`;
  }
  
  // Services/What can you do
  if (message.match(/\b(services|what can you help|what do you offer|hire|work with)\b/)) {
    return `I offer Full Stack Development services including:\n• Web application development\n• AI integration\n• Modern UI/UX design\n• Backend development\n• Technical consulting\n\nFeel free to reach out through the contact form or my social media links!`;
  }
  
  // Default response
  const defaultResponses = [
    `I'm ${knowledgeBase.name}, a ${knowledgeBase.title}. I'd be happy to answer questions about my skills, projects, or experience. What would you like to know?`,
    `That's an interesting question! I'm ${knowledgeBase.name}, and I specialize in full-stack development and AI integration. Could you rephrase your question? I can tell you about my projects, skills, or background.`,
    `I'm here to help you learn about ${knowledgeBase.name}. You can ask me about my projects, skills, experience, or how to get in touch. What would you like to know?`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Main handler function
export const handler = async (req: Request, res: Response): Promise<void> => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const { messages, stream } = req.body as AIRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    if (!lastUserMessage) {
      res.status(400).json({ error: "No user message found" });
      return;
    }

    // Generate response
    const responseContent = generateResponse(lastUserMessage.content);

    if (stream) {
      // Simulate streaming by sending chunks
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Simulate streaming by breaking response into chunks
      const words = responseContent.split(" ");
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        const data = JSON.stringify({ content: chunk });
        res.write(`data: ${data}\n\n`);
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      // Non-streaming response
      res.json({
        content: responseContent,
        model: "dummy-ai-v1",
        usage: {
          prompt_tokens: lastUserMessage.content.length,
          completion_tokens: responseContent.length,
          total_tokens: lastUserMessage.content.length + responseContent.length
        }
      });
    }
  } catch (error) {
    console.error("Dummy AI Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
};

// Export for compatibility
export default handler;

