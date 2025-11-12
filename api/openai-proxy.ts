import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

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
    console.error("OPENAI_API_KEY is missing. Available env vars:", Object.keys(process.env).filter(k => k.includes("OPENAI") || k.includes("API")));
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
  res: VercelResponse
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
  } catch (error: any) {
    console.error("Streaming error:", error);
    // Check if it's a quota or API key error - throw special error for fallback
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("insufficient_quota") || errorMessage.includes("OPENAI_API_KEY")) {
      res.end(); // Close the stream
      const fallbackError = new Error("FALLBACK_TO_DUMMY_AI");
      (fallbackError as any).originalError = error;
      throw fallbackError;
    }
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
  res: VercelResponse
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
  } catch (error: any) {
    console.error("Non-streaming error:", error);
    // Check if it's a quota or API key error - throw special error for fallback
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("insufficient_quota") || errorMessage.includes("OPENAI_API_KEY")) {
      const fallbackError = new Error("FALLBACK_TO_DUMMY_AI");
      (fallbackError as any).originalError = error;
      throw fallbackError;
    }
    throw error;
  }
};

// Main handler function
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
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
    const clientIP = req.headers['x-forwarded-for']?.toString().split(',')[0] || 
                     req.headers['x-real-ip']?.toString() || 
                     'unknown';
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
    // Check if we should fall back to dummy AI
    if (error instanceof Error && error.message === "FALLBACK_TO_DUMMY_AI") {
      console.log("Falling back to dummy AI due to OpenAI error");
      try {
        // Import and call dummy AI handler
        const dummyAI = await import('./dummy-ai');
        await dummyAI.default(req, res);
        return;
      } catch (fallbackError) {
        console.error("Dummy AI fallback failed:", fallbackError);
        // Continue to error handling below
      }
    }
    console.error("OpenAI Proxy Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (error instanceof Error) {
      const errorMessage = error.message;
      const errorStack = error.stack;
      
      console.error("Error message:", errorMessage);
      
      if (errorMessage.includes("OPENAI_API_KEY")) {
        // Fall back to dummy AI when API key is missing
        console.log("OpenAI API key missing, falling back to dummy AI");
        try {
          const dummyAI = await import('./dummy-ai');
          await dummyAI.default(req, res);
          return;
        } catch (fallbackError) {
          res.status(500).json({ 
            error: "Server configuration error",
            message: "OpenAI API key not configured"
          });
        }
      } else if (errorMessage.includes("rate_limit_exceeded") || errorMessage.includes("rate limit")) {
        res.status(429).json({ 
          error: "OpenAI rate limit exceeded",
          message: "Please try again in a few minutes"
        });
      } else if (errorMessage.includes("insufficient_quota") || errorMessage.includes("quota") || errorMessage.includes("exceeded your current quota") || errorMessage.includes("429")) {
        // Fall back to dummy AI when quota is exceeded
        console.log("OpenAI quota exceeded, falling back to dummy AI");
        try {
          const dummyAI = await import('./dummy-ai');
          await dummyAI.default(req, res);
          return;
        } catch (fallbackError) {
          res.status(402).json({ 
            error: "API quota exceeded",
            message: "Your OpenAI API quota has been exceeded. Please check your plan and billing details at https://platform.openai.com/account/billing"
          });
        }
      } else if (errorMessage.includes("Invalid") || errorMessage.includes("required")) {
        res.status(400).json({ 
          error: "Invalid request",
          message: errorMessage
        });
      } else if (errorMessage.includes("model") || errorMessage.includes("gpt-5")) {
        res.status(400).json({ 
          error: "Model error",
          message: isDevelopment ? errorMessage : "The requested AI model is not available. Please try a different model."
        });
      } else {
        res.status(500).json({ 
          error: "Internal server error",
          message: isDevelopment ? `${errorMessage}${errorStack ? `\n\nStack: ${errorStack}` : ''}` : "An unexpected error occurred"
        });
      }
    } else {
      res.status(500).json({ 
        error: "Internal server error",
        message: isDevelopment ? String(error) : "An unexpected error occurred"
      });
    }
  }
}

