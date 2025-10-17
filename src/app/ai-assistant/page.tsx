"use client";

import { useState, useRef, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectRelevantFiles = (question: string): string[] => {
    const questionLower = question.toLowerCase();
    const files: string[] = [];

    // Map keywords to file paths
    const fileMap: Record<string, string[]> = {
      arm: ["src/main/java/frc/robot/subsystems/Arm.java"],
      flywheel: ["src/main/java/frc/robot/subsystems/Flywheel.java"],
      shooter: ["src/main/java/frc/robot/subsystems/Flywheel.java"],
      subsystem: [
        "src/main/java/frc/robot/subsystems/Arm.java",
        "src/main/java/frc/robot/subsystems/Flywheel.java",
      ],
      command: [
        "src/main/java/frc/robot/RobotContainer.java",
        "src/main/java/frc/robot/Robot.java",
      ],
      pid: ["src/main/java/frc/robot/subsystems/Arm.java"],
      "motion magic": ["src/main/java/frc/robot/subsystems/Arm.java"],
      "dynamic flywheel": ["src/main/java/frc/robot/subsystems/Flywheel.java"],
      robotcontainer: [
        "src/main/java/frc/robot/RobotContainer.java",
        "src/main/java/frc/robot/Robot.java",
      ],
      trigger: ["src/main/java/frc/robot/RobotContainer.java"],
      button: ["src/main/java/frc/robot/RobotContainer.java"],
      robot: ["src/main/java/frc/robot/Robot.java"],
      main: ["src/main/java/frc/robot/Main.java"],
      vision: [
        "src/main/java/frc/robot/subsystems/Limelight.java",
        "src/main/java/frc/robot/LimelightHelpers.java",
      ],
      limelight: [
        "src/main/java/frc/robot/subsystems/Limelight.java",
        "src/main/java/frc/robot/LimelightHelpers.java",
      ],
      camera: ["src/main/java/frc/robot/subsystems/Limelight.java"],
      apriltag: ["src/main/java/frc/robot/subsystems/Limelight.java"],
    };

    // Check which files are relevant
    for (const [keyword, paths] of Object.entries(fileMap)) {
      if (questionLower.includes(keyword)) {
        files.push(...paths);
      }
    }

    // If no specific files found, return all main files for general context
    if (files.length === 0) {
      return [
        "src/main/java/frc/robot/Robot.java",
        "src/main/java/frc/robot/RobotContainer.java",
        "src/main/java/frc/robot/subsystems/Arm.java",
        "src/main/java/frc/robot/subsystems/Flywheel.java",
        "src/main/java/frc/robot/subsystems/Limelight.java",
        "src/main/java/frc/robot/LimelightHelpers.java",
      ];
    }

    // Remove duplicates
    return [...new Set(files)];
  };

  const fetchGithubFilesFromBranches = async (
    filePaths: string[]
  ): Promise<string> => {
    if (filePaths.length === 0) return "";

    const branches = ["4-MotionMagic", "4-DynamicFlywheel"];

    try {
      const branchResults = await Promise.all(
        branches.map(async (branchName) => {
          const fileContents = await Promise.all(
            filePaths.map(async (path) => {
              const response = await fetch("/api/github/fetch-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath: path, branch: branchName }),
              });

              if (!response.ok) return null;

              const data = await response.json();
              return `### File: ${path}\n\`\`\`java\n${data.content}\n\`\`\``;
            })
          );

          const validContents = fileContents.filter((c) => c !== null);
          if (validContents.length === 0) return null;

          return `## Branch: ${branchName}\n\n${validContents.join("\n\n")}`;
        })
      );

      return branchResults.filter((r) => r !== null).join("\n\n---\n\n");
    } catch (error) {
      console.error("Error fetching GitHub files:", error);
      return "";
    }
  };

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
      let context = "";

      // Add GitHub code context from both branches
      const relevantFiles = detectRelevantFiles(input);
      if (relevantFiles.length > 0) {
        const githubContent = await fetchGithubFilesFromBranches(relevantFiles);
        if (githubContent) {
          context = `## Workshop Code Examples from GitHub:\n\n${githubContent}`;
        }
      }

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
            Ask questions about the FRC Programming Workshop. The AI will use
            code examples from the Workshop-Code repository (branches:
            4-MotionMagic and 4-DynamicFlywheel) to provide relevant answers.
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
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-primary-600 dark:prose-code:text-primary-400">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return match ? (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className="bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
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
