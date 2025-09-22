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
    const response = await fetch("/api/openai-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content + (msg.role === "user" && responseStyle !== "balanced" 
            ? `\n\n[Response style: ${responseStyle}]` 
            : "")
        })),
        model,
        stream,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (stream && response.body) {
      return {
        content: "",
        stream: response.body
      };
    } else {
      const data = await response.json();
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
