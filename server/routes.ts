import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Import and use the OpenAI proxy function
  const openaiProxy = await import("./functions/openai-proxy");
  app.post("/api/openai-proxy", openaiProxy.handler);

  const httpServer = createServer(app);

  return httpServer;
}
