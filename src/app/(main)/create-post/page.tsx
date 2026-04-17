"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TmLogo, TmButton, TmAvatar, TmTag } from "@/shared/components";
import { api } from "@/shared/lib/api";
import { TAGS } from "@/shared/types/post";

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!content.trim()) {
      setError("กรุณาพิมพ์เนื้อหา");
      return;
    }
    if (!selectedTag) {
      setError("กรุณาเลือก tag");
      return;
    }

    setLoading(true);
    setError("");

    const { error: apiError } = await api.post("/posts", {
      content: content.trim(),
      tag: selectedTag,
      visibility,
    });

    if (apiError) {
      setError(apiError);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-tm-bg">
      <header className="sticky top-0 z-40 flex items-center justify-center border-b border-tm-light bg-tm-bg/90 px-4 py-3 backdrop-blur-sm">
        <TmLogo size="sm" />
      </header>

      <div className="px-4 pt-4">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <TmAvatar size="md" />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="rounded-full border border-tm-light bg-white px-3 py-1.5 text-sm text-tm-navy"
          >
            <option value="public">สาธารณะ</option>
            <option value="anonymous">ไม่ระบุตัวตน</option>
            <option value="private">ส่วนตัว</option>
          </select>

          <div className="flex-1" />

          <TmButton size="sm" onClick={handleSubmit} disabled={loading}>
            {loading ? "กำลังโพสต์..." : "โพสต์"}
          </TmButton>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="นี่คือพื้นที่ปลอดภัย แบ่งปันเรื่องราวของคุณ..."
          className="mt-4 w-full resize-none rounded-2xl bg-transparent p-2 text-tm-gray placeholder:text-tm-gray/40 focus:outline-none"
          rows={8}
          maxLength={2000}
        />

        {/* Mood question */}
        <p className="mt-2 text-sm text-tm-navy">ตอนนี้คุณกำลังรู้สึกอย่างไร</p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <TmTag
              key={tag}
              label={tag}
              selected={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            />
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
