"use client";

import { useEffect, useState } from "react";
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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const status = filter === "all" ? "" : `?status=${filter}`;
      const { data } = await api.get<{ data: AdminPost[] }>(
        `/admin/posts${status}`
      );
      if (data) setPosts(data.data);
    }
    load();
  }, [filter]);

  async function handleDelete(postId: string) {
    await api.delete(`/admin/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
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
          <TmCard key={post.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
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
                <p className="mt-1 text-sm text-tm-gray line-clamp-2">
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
        {posts.length === 0 && (
          <p className="text-center text-sm text-tm-gray">ไม่มีโพสต์</p>
        )}
      </div>
    </div>
  );
}
