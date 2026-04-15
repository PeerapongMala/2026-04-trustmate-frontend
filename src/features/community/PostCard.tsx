"use client";

import { TmAvatar } from "@/shared/components";
import type { Post } from "@/shared/types/post";

interface PostCardProps {
  post: Post;
  onHug: (postId: string, isHugged: boolean) => void;
  onReport: (postId: string) => void;
}

export function PostCard({ post, onHug, onReport }: PostCardProps) {
  return (
    <article className="border-b border-tm-light px-4 py-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <TmAvatar size="md" color={post.author.avatarColor || undefined} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-tm-navy">
                {post.author.alias}
              </span>
              <span className="ml-2 text-sm text-tm-navy">{post.tag}</span>
            </div>
            <button
              onClick={() => onReport(post.id)}
              className="text-tm-orange hover:text-tm-orange/70"
              aria-label="แจ้งรายงาน"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <p className="mt-2 text-sm leading-relaxed text-tm-gray whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Hug button */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onHug(post.id, post.isHugged)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors ${
                post.isHugged
                  ? "bg-tm-orange/10 text-tm-orange"
                  : "text-tm-gray hover:bg-tm-light"
              }`}
            >
              <svg viewBox="0 0 24 24" fill={post.isHugged ? "#E47B18" : "none"} stroke="#E47B18" strokeWidth="2" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {post.hugCount}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
