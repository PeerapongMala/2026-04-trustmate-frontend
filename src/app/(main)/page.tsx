"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TmLogo, TmLoading, TmEmpty, TmModal } from "@/shared/components";
import { PostCard } from "@/features/community/PostCard";
import { api } from "@/shared/lib/api";
import type { Post, PostsResponse } from "@/shared/types/post";

interface TodayCardData {
  question: { id: string; question: string } | null;
  answer: { id: string; answer: string } | null;
}

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTodayCard, setShowTodayCard] = useState(false);
  const [todayCard, setTodayCard] = useState<TodayCardData | null>(null);
  const [cardAnswer, setCardAnswer] = useState("");
  const [cardSubmitting, setCardSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const [postsRes, cardRes] = await Promise.all([
      api.get<PostsResponse>("/posts"),
      api.get<TodayCardData>("/today-card"),
    ]);

    if (postsRes.data) setPosts(postsRes.data.data);
    if (cardRes.data) {
      setTodayCard(cardRes.data);
      // Show popup if there's a question and user hasn't answered
      if (cardRes.data.question && !cardRes.data.answer) {
        setShowTodayCard(true);
      }
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleHug(postId: string, isHugged: boolean) {
    if (isHugged) {
      await api.delete(`/posts/${postId}/hug`);
    } else {
      await api.post(`/posts/${postId}/hug`, {});
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isHugged: !isHugged,
              hugCount: isHugged ? p.hugCount - 1 : p.hugCount + 1,
            }
          : p
      )
    );
  }

  function handleReport(postId: string) {
    api.post(`/posts/${postId}/report`, { reason: "เนื้อหาไม่เหมาะสม" });
  }

  async function handleCardSubmit() {
    if (!cardAnswer.trim()) return;
    setCardSubmitting(true);
    await api.post("/today-card", { answer: cardAnswer.trim() });
    setShowTodayCard(false);
    setCardSubmitting(false);
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-tm-light bg-tm-bg/90 px-4 py-3 backdrop-blur-sm">
        <TmLogo size="sm" />
        <Link
          href="/mood"
          className="rounded-full bg-tm-light px-3 py-1 text-xs font-medium text-tm-navy hover:bg-tm-blue/30"
        >
          🎯 Mood วันนี้
        </Link>
      </header>

      {/* Feed */}
      {loading ? (
        <TmLoading />
      ) : posts.length === 0 ? (
        <TmEmpty
          icon="💬"
          title="ยังไม่มีโพสต์"
          description="เริ่มแชร์ความรู้สึกของคุณ กดปุ่ม + ด้านล่าง"
        />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onHug={handleHug}
              onReport={handleReport}
            />
          ))}
        </div>
      )}

      {/* FAB create post */}
      <Link
        href="/create-post"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-tm-orange text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="สร้างโพสต์"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>

      {/* Today Card popup */}
      <TmModal isOpen={showTodayCard} onClose={() => setShowTodayCard(false)}>
        <div className="flex flex-col items-center gap-4">
          <TmLogo size="sm" />

          {/* Envelope visual */}
          <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100">
            <span className="text-5xl">✉️</span>
          </div>

          {todayCard?.question && (
            <p className="text-center text-sm text-tm-navy">
              {todayCard.question.question}
            </p>
          )}

          <textarea
            value={cardAnswer}
            onChange={(e) => setCardAnswer(e.target.value)}
            placeholder="พิมพ์คำตอบของคุณ..."
            className="w-full resize-none rounded-2xl bg-tm-light p-3 text-sm text-tm-gray placeholder:text-tm-gray/40 focus:outline-none focus:ring-2 focus:ring-tm-orange/50"
            rows={3}
          />

          <p className="text-xs font-medium text-tm-navy">
            TODAY&apos;S CARD : คำถามประจำวัน
          </p>

          <button
            onClick={handleCardSubmit}
            disabled={!cardAnswer.trim() || cardSubmitting}
            className="rounded-full bg-tm-orange px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {cardSubmitting ? "กำลังบันทึก..." : "ส่งคำตอบ"}
          </button>
        </div>
      </TmModal>
    </div>
  );
}
