import { queryClient } from "./queryClient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatOptions {
  model?: "gpt-5" | "gpt-4o";
  stream?: boolean;
  responseStyle?: string;
}

interface ChatResponse {
  content: string;
  stream?: ReadableStream<Uint8Array>;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const OPENAI_ENDPOINT = `${API_BASE}/api/openai-proxy`;
const DUMMY_AI_ENDPOINT = `${API_BASE}/api/dummy-ai`;

export async function sendChat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResponse> {
  const {
    model = "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    stream = false,
    responseStyle = "balanced"
  } = options;

  try {
    const body = JSON.stringify({
      messages: messages.map(msg => ({
        role: msg.role,
        content:
          msg.content +
          (msg.role === "user" && responseStyle !== "balanced"
            ? `\n\n[Response style: ${responseStyle}]`
            : ""),
      })),
      model,
      stream,
    });

    let response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      // Try fallback to dummy AI on 404/402/500 or missing backend
      if ([404, 402, 500].includes(response.status)) {
        const fallback = await fetch(DUMMY_AI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        if (fallback.ok) {
          // Non-streaming only for fallback
          const data = await safeParseJson(fallback);
          return {
            content: data.content || "No response received",
          };
        } else {
          const errorText = await fallback.text().catch(() => "");
          const maybeJson = safeTryParse(errorText);
          const errorMessage =
            (maybeJson && (maybeJson.message || maybeJson.error)) ||
            `HTTP ${fallback.status}: ${fallback.statusText}`;
          throw new Error(errorMessage);
        }
      }

      // Otherwise, read error safely without assuming JSON
      const errorText = await response.text().catch(() => "");
      const maybeJson = safeTryParse(errorText);
      const errorMessage =
        (maybeJson && (maybeJson.message || maybeJson.error)) ||
        `HTTP ${response.status}: ${response.statusText}`;
      console.error("API Error Details:", maybeJson || errorText);
      throw new Error(errorMessage);
    }

    if (stream && response.body) {
      return {
        content: "",
        stream: response.body
      };
    } else {
      const data = await safeParseJson(response);
      return {
        content: data.content || data.choices?.[0]?.message?.content || "No response received"
      };
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to connect to AI service. Please check your connection and try again."
    );
  }
}

function safeTryParse(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function safeParseJson(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text().catch(() => "");
  const maybe = safeTryParse(text);
  if (maybe) return maybe;
  return {};
}

// Progress callback for streaming responses
export async function* streamChatResponse(
  messages: ChatMessage[],
  options: ChatOptions = {}
): AsyncGenerator<string, void, unknown> {
  const response = await sendChat(messages, { ...options, stream: true });
  
  if (!response.stream) {
    yield response.content;
    return;
  }

  const reader = response.stream.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              yield data.content;
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Helper function to get streaming chat with progress callback
export async function sendChatWithProgress(
  messages: ChatMessage[],
  onProgress: (content: string) => void,
  options: ChatOptions = {}
): Promise<string> {
  let fullContent = "";
  
  for await (const chunk of streamChatResponse(messages, { ...options, stream: true })) {
    fullContent += chunk;
    onProgress(fullContent);
  }
  
  return fullContent;
}
