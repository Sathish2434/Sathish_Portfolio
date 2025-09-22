import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Trash2, Settings, Copy, Bookmark, RotateCcw, Code, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendChat } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hi! I'm your AI assistant. I can help you with:\n\n• **Code reviews** and debugging\n• **Project planning** and architecture\n• **Technical questions** about web development\n• **AI integration** strategies\n\nWhat would you like to discuss today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseStyle, setResponseStyle] = useState("balanced");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string>("default");
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedSessions = localStorage.getItem("aiChatSessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    const savedMessages = localStorage.getItem("aiChatMessages");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setStreamingMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Use streaming for real-time response
      const response = await sendChat(
        messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          stream: true,
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          responseStyle
        }
      );

      let fullContent = "";
      
      if (response.stream) {
        const reader = response.stream.getReader();
        const decoder = new TextDecoder();

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
                  fullContent += data.content;
                  setStreamingMessage(fullContent);
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } else {
        // Fallback for non-streaming response
        fullContent = response.content;
        setStreamingMessage(fullContent);
      }

      // Add the complete assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fullContent,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");

    } catch (error) {
      console.error("AI request failed:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, please contact support.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    setInput(textarea.value);
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    setStreamingMessage("");
    localStorage.removeItem("aiChatMessages");
    toast({
      title: "Chat cleared",
      description: "Conversation history has been cleared.",
    });
  };

  const regenerateLastResponse = async () => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === "user");
    if (lastUserMessageIndex === -1) return;

    // Remove all messages after the last user message
    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToKeep);

    // Regenerate response
    const lastUserMessage = messages[lastUserMessageIndex];
    setIsTyping(true);

    try {
      const response = await sendChat(
        messagesToKeep.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          stream: false,
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          responseStyle
        }
      );

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const saveNote = (content: string) => {
    const notes = JSON.parse(localStorage.getItem("aiNotes") || "[]");
    const note = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString()
    };
    notes.push(note);
    localStorage.setItem("aiNotes", JSON.stringify(notes));
    
    toast({
      title: "Note saved",
      description: "Response has been saved to your notes.",
    });
  };

  const quickActions = [
    "Review my React code",
    "Plan a new project",
    "Optimize database queries",
    "Explain AI concepts"
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant help with your questions, code reviews, project planning, and technical guidance
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <Card className="flex-1 flex flex-col rounded-2xl border-border overflow-hidden">
            {/* Chat Header */}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium">AI Assistant</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <Select value={responseStyle} onValueChange={setResponseStyle}>
                  <SelectTrigger className="w-32 h-8" data-testid="select-response-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-8 w-8 p-0"
                  title="Clear conversation"
                  data-testid="button-clear-chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Settings"
                  data-testid="button-settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 max-w-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-white"
                          : "bg-card border border-border"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>

                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-primary hover:text-primary/80"
                            onClick={regenerateLastResponse}
                            data-testid="button-regenerate"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Regenerate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-primary hover:text-primary/80"
                            onClick={() => copyToClipboard(message.content)}
                            data-testid="button-copy"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-primary hover:text-primary/80"
                            onClick={() => saveNote(message.content)}
                            data-testid="button-save-note"
                          >
                            <Bookmark className="h-3 w-3 mr-1" />
                            Save Note
                          </Button>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2 opacity-70">
                        <span className="mr-1">⏰</span>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming Message */}
              {streamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-2xl">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {streamingMessage}
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && !streamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex items-end space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-2"
                  title="Attach image or code"
                  data-testid="button-attach"
                >
                  <Code className="h-4 w-4" />
                </Button>

                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaResize}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about development, AI, or your projects..."
                    className="min-h-[44px] max-h-32 resize-none pr-16"
                    disabled={isTyping}
                    data-testid="textarea-chat-input"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title="Voice input"
                      data-testid="button-voice"
                    >
                      <Mic className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-muted-foreground">⌘↵</span>
                  </div>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 mb-2"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInput(action)}
                    data-testid={`quick-action-${action.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pb-8"
        >
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Responses</h3>
            <p className="text-sm text-muted-foreground">
              Get instant answers with streaming responses powered by GPT-5
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Code Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Upload code snippets for review, optimization, and debugging help
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Conversation History</h3>
            <p className="text-sm text-muted-foreground">
              All conversations are saved locally for easy reference and follow-up
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
