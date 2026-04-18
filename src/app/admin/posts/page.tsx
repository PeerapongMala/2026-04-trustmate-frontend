"use client";

import { useEffect, useState, useCallback } from "react";
import { TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";

interface AdminPost {
  id: string;
  content: string;
  tag: string;
  flagStatus: string;
  createdAt: string;
  author: { alias: string; email: string };
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    async function load() {
      setError("");
      const status = filter === "all" ? "" : `?status=${filter}`;
      const { data, error } = await api.get<{ data: AdminPost[] }>(
        `/admin/posts${status}`
      );
      if (data) setPosts(data.data);
      else setError(error || "ไม่สามารถโหลดข้อมูลได้ — กรุณา login ด้วย admin account ก่อน");
    }
    load();
  }, [filter]);

  async function handleDelete(postId: string) {
    const { error } = await api.delete(`/admin/posts/${postId}`);
    if (error) {
      showToast("ลบไม่สำเร็จ: " + error, "error");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast("ลบโพสต์สำเร็จ");
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">จัดการโพสต์</h1>

      <div className="mt-3 flex gap-2">
        {["all", "clean", "flagged", "blocked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs ${
              filter === f
                ? "bg-tm-orange text-white"
                : "bg-tm-light text-tm-navy"
            }`}
          >
            {f === "all" ? "ทั้งหมด" : f}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {posts.map((post) => (
          <TmCard key={post.id} className="overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-tm-navy">
                    {post.author.alias}
                  </span>
                  <span className="text-xs text-tm-gray">{post.tag}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      post.flagStatus === "clean"
                        ? "bg-green-100 text-green-700"
                        : post.flagStatus === "flagged"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {post.flagStatus}
                  </span>
                </div>
                <p className="mt-1 break-all text-sm text-tm-gray line-clamp-2">
                  {post.content}
                </p>
              </div>
              <TmButton
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post.id)}
              >
                ลบ
              </TmButton>
            </div>
          </TmCard>
        ))}
        {error && (
          <div className="py-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <a href="/login" className="mt-2 inline-block text-sm text-tm-orange underline">ไปหน้า Login</a>
          </div>
        )}
        {!error && posts.length === 0 && (
          <p className="text-center text-sm text-tm-gray">ไม่มีโพสต์</p>
        )}
      </div>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {t.type === "success" ? "✓ " : "✕ "}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
