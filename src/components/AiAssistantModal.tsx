import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Sparkles, Send, Bot, User, RefreshCw, Eye, ArrowRight } from "lucide-react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  time: string;
}

export const AiAssistantModal: React.FC = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, navigateToCatalog } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Welcome to ILens! I am Aura, your personal AI Optical Stylist. Tell me about your style preferences, face shape, prescription requirements, or lens questions!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isAiAssistantOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    const userMsg: Message = {
      sender: "user",
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: userMsgText, messages })
      });

      const data = await res.json();
      const assistantText = data.reply || data.fallback || "I am here to assist with all your optical styling needs!";

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: assistantText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I am having trouble connecting to my optical database right now. However, I highly recommend checking out our Geometric and Titanium collections for lightweight elegance!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Recommend frames for a Round face shape",
    "What is the difference between 1.60 and 1.67 lens index?",
    "Show me blue light glasses for software developers",
    "How does the 30-day risk free trial work?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[640px] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Aura <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">AI Stylist</span>
              </h3>
              <p className="text-xs text-neutral-400">Powered by Gemini 3.6 Optical Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAssistantOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-neutral-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "user"
                    ? "bg-neutral-900 text-white"
                    : "bg-amber-500 text-neutral-950"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-neutral-900 text-white rounded-tr-none"
                    : "bg-white text-neutral-900 border border-neutral-200 shadow-2xs rounded-tl-none whitespace-pre-line"
                }`}
              >
                <p>{msg.text}</p>
                <span className={`block text-[9px] mt-2 ${msg.sender === "user" ? "text-neutral-400" : "text-neutral-400"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 text-neutral-950 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-neutral-200 p-4 rounded-2xl text-xs text-neutral-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>Aura is thinking & consulting optical models...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 bg-white border-t border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">
            Suggestions:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt);
              }}
              className="px-3 py-1 bg-neutral-100 hover:bg-amber-50 hover:text-amber-900 text-neutral-700 text-[11px] rounded-full shrink-0 border border-neutral-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Aura about styles, face shapes, prescription lenses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white p-3 rounded-2xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
