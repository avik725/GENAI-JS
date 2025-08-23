"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, RotateCcw, Brain } from "lucide-react";

export default function ChatPanel({
  hasReferences,
  references,
  onSendMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const chatsBox = document.querySelector(".chats-box");
    if (chatsBox) {
      chatsBox.scrollTop = chatsBox.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && references.length === 0) {
      setMessages([]);
    }
  }, [references?.length, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.type,
        content: msg.content,
      }));

      const response = await onSendMessage(
        userMessage.content,
        conversationHistory
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response?.content,
        page: response?.page || null,
        refType : response?.refTyp,
        fileName: response?.fileName || null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-xl p-6 border-0">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold">Intelligent Chat</h2>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
          <div className="hidden md:inline-block lg:inline-block px-3 py-1 bg-accent/10 rounded-full text-sm font-medium text-accent">
            {hasReferences
              ? `${references.length} reference${
                  references.length !== 1 ? "s" : ""
                } loaded`
              : "Add references to start"}
          </div>
        </div>
      </div>

      <div className="chats-box flex-1 lg:max-h-[65vh] md:max-h-[55vh] max-h-[60vh] bg-gradient-to-b from-muted/20 to-muted/10 rounded-xl p-6 mb-6 overflow-y-scroll min-h-0 border border-border/30">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            {hasReferences ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl w-fit mx-auto">
                  <Bot className="w-16 h-16 text-primary mx-auto" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Ready to assist you!</p>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Ask me anything about your reference materials. I can
                    analyze, summarize, or answer questions based on your{" "}
                    {references.length} loaded reference
                    {references.length !== 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-2xl w-fit mx-auto">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">
                    <span className="block md:hidden lg:hidden">Scroll down and</span>Upload your content
                  </p>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Add reference material to start an intelligent conversation
                    about your documents.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex lg:gap-4 md:gap-4 gap-2 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "assistant" && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-card border border-border/50 backdrop-blur-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 opacity-70 ${
                      message.type === "user"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border/50 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              hasReferences
                ? "Ask a question about your content..."
                : "Add references first..."
            }
            disabled={!hasReferences || isLoading}
            className="h-12 px-4 bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!hasReferences || !inputValue.trim() || isLoading}
          size="icon"
          className="h-12 w-12 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
