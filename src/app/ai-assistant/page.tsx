"use client";

import { useState, useRef, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Send, Sparkles, AlertCircle, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import {
  retrieveRelevantChunks,
  buildContextFromChunks,
  extractSources,
} from "@/lib/ragRetrieval";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; url: string; section?: string }>;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // RAG retrieval is now handled by retrieveRelevantChunks

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Use RAG vector search to retrieve relevant chunks
      // Search across all sources (workshop pages, docs, AND code)
      const chunks = await retrieveRelevantChunks(input, {
        limit: 5,
        // No sourceType filter - search everything!
      });

      // Build context from retrieved chunks
      const context = buildContextFromChunks(chunks);

      // Extract sources for citation
      const sources = extractSources(chunks);

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTemplate title="AI Workshop Assistant">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              AI Workshop Assistant
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Ask questions about the FRC Programming Workshop. The AI uses
            semantic search across all workshop content to provide accurate,
            contextual answers with source citations.
          </p>
        </div>

        <div className="card p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Start a conversation
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Ask me anything about FRC programming, command-based
                architecture, PID tuning, or any workshop topics!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="break-words">
                      {message.role === "user" ? (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-code:text-primary-600 dark:prose-code:text-primary-400">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({
                                inline,
                                className,
                                children,
                                ...props
                              }: {
                                inline?: boolean;
                                className?: string;
                                children?: React.ReactNode;
                              }) {
                                // Inline code
                                if (inline) {
                                  return (
                                    <code
                                      className="bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-sm font-mono"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                }

                                // Block code - render inside the pre tag (handled by pre component)
                                return (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              pre({
                                children,
                              }: {
                                children?: React.ReactNode;
                              }) {
                                // Extract code element and its props
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const codeElement = children as any;
                                const className =
                                  codeElement?.props?.className || "";
                                const codeChildren =
                                  codeElement?.props?.children || "";

                                const match = /language-(\w+)/.exec(className);

                                // Render with syntax highlighting
                                return (
                                  <SyntaxHighlighter
                                    style={
                                      currentTheme === "dark"
                                        ? oneDark
                                        : oneLight
                                    }
                                    language={match ? match[1] : "text"}
                                    PreTag="div"
                                    customStyle={{
                                      margin: "1rem 0",
                                      borderRadius: "0.5rem",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {String(codeChildren).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                );
                              },
                              a({ href, children }) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                                  >
                                    {children}
                                    {href?.startsWith("http") && (
                                      <ExternalLink className="w-3 h-3" />
                                    )}
                                  </a>
                                );
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          Sources:
                        </div>
                        <div className="space-y-1">
                          {message.sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {source.title}
                              {source.section && ` - ${source.section}`}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-primary-100"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      <span className="text-slate-600 dark:text-slate-300">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about subsystems, commands, PID tuning..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </PageTemplate>
  );
}
