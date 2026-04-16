"use client";

import { useState, useRef, useEffect } from "react";
import { TmLogo } from "@/shared/components";
import { TmMetAvatar } from "@/shared/components/TmMetAvatar";
import { api } from "@/shared/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // โหลด session ล่าสุดเมื่อเข้าหน้า chat
  useEffect(() => {
    async function loadLastSession() {
      const { data: sessions } = await api.get<ChatSession[]>("/chat/sessions");

      if (sessions && sessions.length > 0) {
        const lastSession = sessions[0];
        setSessionId(lastSession.id);

        const { data: msgs } = await api.get<ChatMessage[]>(
          `/chat/sessions/${lastSession.id}`
        );
        if (msgs) {
          setMessages(msgs);
        }
      }
      setInitialLoading(false);
    }

    loadLastSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const { data } = await api.post<{
      sessionId: string;
      message: ChatMessage;
    }>("/chat", {
      message: text,
      sessionId,
    });

    if (data) {
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, data.message]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-tm-light px-4 py-3">
        <TmLogo size="sm" />
        <div>
          <span className="text-lg font-bold text-tm-navy">LET&apos;S TALK</span>
          <span className="ml-2 text-sm text-tm-orange">with AI Chatbot</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36">
        {initialLoading ? (
          <div className="flex items-center justify-center pt-10">
            <p className="text-sm text-tm-gray">กำลังโหลดแชท...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pt-10 text-center">
            <TmMetAvatar size="lg" />
            <p className="text-sm text-tm-gray">
              สวัสดี เราชื่อ &quot;เมท&quot; นะ
            </p>
            <p className="text-sm text-tm-gray">
              เราอยู่ตรงนี้เพื่อรับฟังคุณนะ
            </p>
          </div>
        ) : null}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="mr-2 mt-1 flex-shrink-0">
                <TmMetAvatar size="sm" />
              </div>
            )}
            <div
              className={`max-w-[75%] break-words overflow-hidden rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-tm-blue text-tm-navy"
                  : "bg-tm-light text-tm-gray"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="mr-2 mt-1 flex-shrink-0">
              <TmMetAvatar size="sm" />
            </div>
            <div className="rounded-2xl bg-tm-light px-4 py-2.5 text-sm text-tm-gray">
              กำลังพิมพ์...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-[5.5rem] left-0 right-0 border-t border-tm-light bg-tm-bg px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 rounded-full border border-tm-light bg-white px-4 py-2.5 text-sm text-tm-gray placeholder:text-tm-gray/40 focus:outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-full text-tm-orange transition-colors hover:bg-tm-orange/10 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
