import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Import AI handlers
  const openaiProxy = await import("./functions/openai-proxy");
  const dummyAI = await import("./functions/dummy-ai");

  // OpenAI proxy endpoint (automatically falls back to dummy AI on errors)
  app.post("/api/openai-proxy", openaiProxy.handler);

  // Direct dummy AI endpoint (for testing or direct use)
  app.post("/api/dummy-ai", dummyAI.handler);

  const httpServer = createServer(app);

  return httpServer;
}
