"use client";

import { useState, useRef, useEffect } from "react";
import { TmLogo, TmModal } from "@/shared/components";
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
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // โหลด session ล่าสุดเมื่อเข้าหน้า chat
  useEffect(() => {
    async function loadLastSession() {
      const { data } = await api.get<ChatSession[]>("/chat/sessions");

      if (data && data.length > 0) {
        setSessions(data);
        const lastSession = data[0];
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
      isCrisis?: boolean;
      message: ChatMessage;
    }>("/chat", {
      message: text,
      sessionId,
    });

    if (data) {
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, data.message]);
      if (data.isCrisis) {
        setShowCrisisBanner(true);
      }
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewChat() {
    setSessionId(null);
    setMessages([]);
  }

  async function handleOpenHistory() {
    const { data } = await api.get<ChatSession[]>("/chat/sessions");
    if (data) setSessions(data);
    setShowHistory(true);
  }

  async function handleSelectSession(session: ChatSession) {
    setSessionId(session.id);
    const { data: msgs } = await api.get<ChatMessage[]>(
      `/chat/sessions/${session.id}`
    );
    if (msgs) setMessages(msgs);
    setShowHistory(false);
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-tm-light px-4 py-3">
        <TmLogo size="sm" />
        <div className="flex-1">
          <span className="text-lg font-bold text-tm-navy">LET&apos;S TALK</span>
          <span className="ml-2 text-sm text-tm-orange">with AI Chatbot</span>
        </div>
        <div className="flex items-center gap-1">
          {/* History button */}
          <button
            onClick={handleOpenHistory}
            className="rounded-full p-2 text-tm-gray hover:bg-tm-light"
            title="ดูประวัติ"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          {/* New chat button */}
          <button
            onClick={handleNewChat}
            className="rounded-full p-2 text-tm-orange hover:bg-tm-orange/10"
            title="เริ่มแชทใหม่"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
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

      {/* Crisis banner */}
      {showCrisisBanner && (
        <div className="fixed bottom-[8.5rem] left-0 right-0 z-40 px-4">
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-red-700">
                  สายด่วนสุขภาพจิต
                </p>
                <p className="mt-1 text-xs text-red-600">
                  ถ้าคุณต้องการคุยกับคนจริงๆ โทร{" "}
                  <a href="tel:1323" className="font-bold underline">1323</a>{" "}
                  ได้ตลอด 24 ชม.
                </p>
              </div>
              <button
                onClick={() => setShowCrisisBanner(false)}
                className="mt-0.5 text-red-400 hover:text-red-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* History modal */}
      <TmModal isOpen={showHistory} onClose={() => setShowHistory(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">ประวัติการสนทนา</h2>
        {sessions.length === 0 ? (
          <p className="py-6 text-center text-sm text-tm-gray/50">ยังไม่มีประวัติ</p>
        ) : (
          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {sessions.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  s.id === sessionId
                    ? "border-tm-orange bg-tm-orange/10"
                    : "border-tm-light hover:bg-tm-light/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tm-light text-sm font-bold text-tm-navy">
                  {sessions.length - i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-tm-navy">
                    {s.id === sessionId ? "สนทนาปัจจุบัน" : `สนทนาที่ ${sessions.length - i}`}
                  </p>
                  <p className="text-xs text-tm-gray">
                    {new Date(s.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {s.id === sessionId && (
                  <span className="rounded-full bg-tm-orange px-2 py-0.5 text-[10px] text-white">
                    ปัจจุบัน
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </TmModal>
    </div>
  );
}
