import type { Request, Response } from "express";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-5";
const MAX_TOKENS = 4000;
const MAX_REQUEST_SIZE = 50000; // 50KB limit for request body

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenAIRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  max_tokens?: number;
}

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  
  return new OpenAI({ apiKey });
};

// Input validation and sanitization
const validateAndSanitizeRequest = (body: any): OpenAIRequest => {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const { messages, model, stream, max_tokens } = body;

  // Validate messages
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required and must not be empty");
  }

  // Validate each message
  const sanitizedMessages: ChatMessage[] = messages.map((msg: any, index: number) => {
    if (!msg || typeof msg !== "object") {
      throw new Error(`Invalid message at index ${index}`);
    }

    const { role, content } = msg;

    if (!role || !["user", "assistant", "system"].includes(role)) {
      throw new Error(`Invalid role at message index ${index}. Must be 'user', 'assistant', or 'system'`);
    }

    if (!content || typeof content !== "string") {
      throw new Error(`Invalid content at message index ${index}. Must be a non-empty string`);
    }

    // Sanitize content (basic XSS prevention)
    const sanitizedContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    if (sanitizedContent.length === 0) {
      throw new Error(`Empty content after sanitization at message index ${index}`);
    }

    if (sanitizedContent.length > 10000) {
      throw new Error(`Message content too long at index ${index}. Maximum 10,000 characters allowed`);
    }

    return {
      role: role as ChatMessage["role"],
      content: sanitizedContent,
    };
  });

  // Validate model
  const validModels = ["gpt-5", "gpt-4o", "gpt-4o-mini"];
  const selectedModel = model && validModels.includes(model) ? model : DEFAULT_MODEL;

  // Validate other parameters
  const isStreaming = typeof stream === "boolean" ? stream : false;
  const maxTokens = typeof max_tokens === "number" && max_tokens > 0 && max_tokens <= MAX_TOKENS 
    ? max_tokens 
    : MAX_TOKENS;

  return {
    messages: sanitizedMessages,
    model: selectedModel,
    stream: isStreaming,
    max_tokens: maxTokens,
  };
};

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Streaming response handler
const handleStreamingResponse = async (
  openai: OpenAI,
  request: OpenAIRequest,
  res: Response
): Promise<void> => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: request.model!,
      messages: request.messages,
      max_completion_tokens: request.max_tokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        const data = JSON.stringify({ content });
        res.write(`data: ${data}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    const errorData = JSON.stringify({ 
      error: "Streaming failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
    res.write(`data: ${errorData}\n\n`);
    res.end();
  }
};

// Non-streaming response handler
const handleNonStreamingResponse = async (
  openai: OpenAI,
  request: OpenAIRequest,
  res: Response
): Promise<void> => {
  try {
    const completion = await openai.chat.completions.create({
      model: request.model!,
      messages: request.messages,
      max_completion_tokens: request.max_tokens,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    res.json({
      content,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Non-streaming error:", error);
    throw error;
  }
};

// Main handler function
export const handler = async (req: Request, res: Response): Promise<void> => {
  // CORS headers for cross-origin requests
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
    // Check request size
    const contentLength = parseInt(req.headers["content-length"] || "0", 10);
    if (contentLength > MAX_REQUEST_SIZE) {
      res.status(413).json({ 
        error: "Request too large",
        maxSize: MAX_REQUEST_SIZE
      });
      return;
    }

    // Rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    if (!checkRateLimit(clientIP)) {
      res.status(429).json({ 
        error: "Rate limit exceeded",
        message: `Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute allowed`
      });
      return;
    }

    // Initialize OpenAI client
    const openai = getOpenAIClient();

    // Validate and sanitize request
    const validatedRequest = validateAndSanitizeRequest(req.body);

    // Handle streaming vs non-streaming responses
    if (validatedRequest.stream) {
      await handleStreamingResponse(openai, validatedRequest, res);
    } else {
      await handleNonStreamingResponse(openai, validatedRequest, res);
    }

  } catch (error) {
    console.error("OpenAI Proxy Error:", error);

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (error instanceof Error) {
      if (error.message.includes("OPENAI_API_KEY")) {
        res.status(500).json({ 
          error: "Server configuration error",
          message: "OpenAI API key not configured"
        });
      } else if (error.message.includes("rate_limit_exceeded")) {
        res.status(429).json({ 
          error: "OpenAI rate limit exceeded",
          message: "Please try again in a few minutes"
        });
      } else if (error.message.includes("insufficient_quota")) {
        res.status(402).json({ 
          error: "API quota exceeded",
          message: "OpenAI API quota has been exceeded"
        });
      } else if (error.message.includes("Invalid") || error.message.includes("required")) {
        res.status(400).json({ 
          error: "Invalid request",
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: "Internal server error",
          message: isDevelopment ? error.message : "An unexpected error occurred"
        });
      }
    } else {
      res.status(500).json({ 
        error: "Internal server error",
        message: "An unexpected error occurred"
      });
    }
  }
};

// Export for Vercel compatibility
export default handler;

// Export for Netlify compatibility
export { handler as netlifyHandler };
