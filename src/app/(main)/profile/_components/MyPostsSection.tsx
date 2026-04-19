import { TmCard } from "@/shared/components";
import type { Post } from "@/shared/types/post";

interface MyPostsSectionProps {
  posts: Post[];
  expanded: boolean;
  onToggle: () => void;
}

export function MyPostsSection({ posts, expanded, onToggle }: MyPostsSectionProps) {
  return (
    <div className="mt-6">
      <button onClick={onToggle} className="w-full">
        <TmCard className="bg-tm-light">
          <p className="text-center text-sm font-medium text-tm-navy">
            คลังโพสต์ของฉัน ({posts.length}) {expanded ? "▲" : "▼"}
          </p>
        </TmCard>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {posts.length === 0 ? (
            <p className="py-4 text-center text-xs text-tm-gray/50">ยังไม่มีโพสต์</p>
          ) : (
            posts.map((post) => (
              <TmCard key={post.id} className="bg-white">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-tm-orange">{post.tag}</p>
                  {post.visibility === "private" && (
                    <span className="rounded-full bg-tm-gray/10 px-2 py-0.5 text-[10px] text-tm-gray">
                      ส่วนตัว
                    </span>
                  )}
                  {post.visibility === "anonymous" && (
                    <span className="rounded-full bg-tm-navy/10 px-2 py-0.5 text-[10px] text-tm-navy">
                      ไม่ระบุตัวตน
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-tm-gray whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-tm-gray/50">
                    {new Date(post.createdAt).toLocaleDateString("th-TH")}
                  </span>
                  <span className="text-xs text-tm-gray/50">
                    กอด {post.hugCount}
                  </span>
                </div>
              </TmCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}
