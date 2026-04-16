"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TmAvatar,
  TmButton,
  TmCard,
  TmInput,
  TmModal,
  TmLoading,
} from "@/shared/components";
import { TmEnvelope } from "@/shared/components/TmEnvelope";
import { api } from "@/shared/lib/api";
import type { User } from "@/shared/types/auth";
import type { Post } from "@/shared/types/post";

interface TodayCardItem {
  id: string;
  answer: string;
  createdAt: string;
  question: { question: string; date: string };
}

interface MoodEntry {
  id: string;
  mood: string;
  createdAt: string;
}

const NEGATIVE_MOODS = ["เศร้าซึม", "เปล่าเปลี่ยว", "กลัว", "กังวล"];
const DAY_LABELS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<TodayCardItem[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [moodData, setMoodData] = useState<{ day: string; count: number; hasNegative: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editAlias, setEditAlias] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarColor, setEditAvatarColor] = useState("");

  // 3-dot menu state
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const [userRes, cardsRes, moodRes, postsRes] = await Promise.all([
        api.get<User>("/users/me"),
        api.get<TodayCardItem[]>("/today-card/history"),
        api.get<MoodEntry[]>("/mood/history"),
        api.get<Post[]>("/posts/me"),
      ]);

      if (userRes.data) {
        setUser(userRes.data);
        setEditAlias(userRes.data.alias);
        setEditBio(userRes.data.bio || "");
        setEditAvatarColor(userRes.data.avatarColor || "#D8E1ED");
      } else {
        localStorage.removeItem("token");
        router.push("/login");
      }

      if (cardsRes.data) setCards(cardsRes.data);
      if (postsRes.data) setMyPosts(postsRes.data);

      // Build 7-day mood graph data
      if (moodRes.data) {
        const now = new Date();
        const days: { day: string; count: number; hasNegative: boolean }[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().slice(0, 10);
          const dayEntries = moodRes.data.filter(
            (m) => m.createdAt.slice(0, 10) === dateStr
          );
          days.push({
            day: DAY_LABELS[date.getDay()],
            count: dayEntries.length,
            hasNegative: dayEntries.some((m) => NEGATIVE_MOODS.includes(m.mood)),
          });
        }
        setMoodData(days);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  async function handleSaveProfile() {
    const { data } = await api.patch<User>("/users/me", {
      alias: editAlias,
      bio: editBio,
      avatarColor: editAvatarColor,
    });
    if (data) setUser(data);
    setShowEdit(false);
  }

  async function handleChangePassword() {
    setPwError("");
    setPwSuccess("");
    if (newPassword.length < 6) {
      setPwError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    const { error } = await api.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    if (error) {
      setPwError(error);
    } else {
      setPwSuccess("เปลี่ยนรหัสผ่านสำเร็จ");
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  async function handleDeleteAccount() {
    await api.delete("/users/me");
    localStorage.removeItem("token");
    router.push("/login");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) return <TmLoading />;
  if (!user) return null;

  return (
    <div className="px-4 pt-4">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-tm-navy">{user.alias}</h1>
          <p className="text-sm text-tm-gray">{user.bio || "คำอธิบาย"}</p>
        </div>
        <TmAvatar size="lg" color={user.avatarColor || undefined} />
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-tm-gray hover:text-tm-navy"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Edit button */}
      <div className="mt-4">
        <TmButton variant="solid" size="sm" onClick={() => setShowEdit(true)}>
          แก้ไขข้อมูลผู้ใช้
        </TmButton>
      </div>

      {/* My posts */}
      <div className="mt-6">
        <button
          onClick={() => setShowMyPosts(!showMyPosts)}
          className="w-full"
        >
          <TmCard className="bg-tm-light">
            <p className="text-center text-sm font-medium text-tm-navy">
              คลังโพสต์ของฉัน ({myPosts.length}) {showMyPosts ? "▲" : "▼"}
            </p>
          </TmCard>
        </button>
        {showMyPosts && (
          <div className="mt-2 space-y-2">
            {myPosts.length === 0 ? (
              <p className="py-4 text-center text-xs text-tm-gray/50">ยังไม่มีโพสต์</p>
            ) : (
              myPosts.map((post) => (
                <TmCard key={post.id} className="bg-white">
                  <p className="text-xs text-tm-orange">{post.tag}</p>
                  <p className="mt-1 text-sm text-tm-gray whitespace-pre-wrap">{post.content}</p>
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

      {/* Mood graph 7 วัน */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-tm-navy">
          กราฟอารมณ์ย้อนหลัง — ในช่วง 7 วันที่ผ่านมา
        </h2>
        <TmCard className="h-40 flex items-center justify-center">
          <div className="w-full px-2">
            {moodData.length > 0 ? (
              <div className="flex items-end justify-between gap-1 h-24">
                {moodData.map((d, i) => {
                  const maxCount = Math.max(...moodData.map((m) => m.count), 1);
                  const heightPct = d.count > 0 ? Math.max((d.count / maxCount) * 100, 15) : 5;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-full rounded-t ${d.hasNegative ? "bg-red-400/60" : "bg-tm-orange/60"}`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[9px] text-tm-gray">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-xs text-tm-gray/50">ยังไม่มีข้อมูลอารมณ์</p>
            )}
          </div>
        </TmCard>
      </div>

      {/* Today Card collection */}
      <div className="mt-6">
        <h2 className="mb-3 text-base font-bold text-tm-navy">
          Today Card ของฉัน
        </h2>
        {cards.length === 0 ? (
          <TmCard className="flex h-32 items-center justify-center bg-tm-light/50">
            <p className="text-xs text-tm-gray/50">ยังไม่มีการ์ด</p>
          </TmCard>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <TmEnvelope
                key={card.id}
                title={card.question.question}
                subtitle={`${card.answer} — ${new Date(card.createdAt).toLocaleDateString("th-TH")}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-8 mb-8">
        <TmButton variant="outline" size="sm" onClick={handleLogout}>
          ออกจากระบบ
        </TmButton>
      </div>

      {/* Menu Modal */}
      <TmModal isOpen={showMenu} onClose={() => setShowMenu(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">ตั้งค่า</h2>
        <div className="flex flex-col gap-2">
          {user.provider === "local" && (
            <button
              onClick={() => { setShowMenu(false); setShowChangePassword(true); setPwError(""); setPwSuccess(""); }}
              className="flex items-center gap-3 rounded-xl border border-tm-light px-4 py-3 text-left text-sm text-tm-gray hover:bg-tm-light/50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              เปลี่ยนรหัสผ่าน
            </button>
          )}
          <button
            onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
            className="flex items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
            </svg>
            ลบบัญชี
          </button>
        </div>
      </TmModal>

      {/* Change Password Modal */}
      <TmModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">เปลี่ยนรหัสผ่าน</h2>
        <div className="flex flex-col gap-4">
          <TmInput
            label="รหัสผ่านปัจจุบัน"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TmInput
            label="รหัสผ่านใหม่"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
          <TmButton onClick={handleChangePassword}>บันทึก</TmButton>
        </div>
      </TmModal>

      {/* Delete Account Modal */}
      <TmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="h-8 w-8">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-tm-navy">ลบบัญชีผู้ใช้</h2>
          <p className="text-center text-sm text-tm-gray">
            คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="flex gap-3">
            <TmButton variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              ยกเลิก
            </TmButton>
            <button
              onClick={handleDeleteAccount}
              className="rounded-full bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              ลบบัญชี
            </button>
          </div>
        </div>
      </TmModal>

      {/* Edit Modal */}
      <TmModal isOpen={showEdit} onClose={() => setShowEdit(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">
          แก้ไขข้อมูลผู้ใช้
        </h2>
        <div className="flex flex-col gap-4">
          {/* Avatar color picker */}
          <div>
            <p className="mb-2 text-sm font-medium text-tm-navy">สีโปรไฟล์</p>
            <div className="flex items-center gap-3">
              <TmAvatar size="lg" color={editAvatarColor} />
              <div className="flex flex-wrap gap-2">
                {["#D8E1ED", "#B1C9EB", "#E47B18", "#31356E", "#F4A7BB", "#A8D5BA", "#F9D56E", "#C4B5FD"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditAvatarColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform ${
                      editAvatarColor === c ? "border-tm-navy scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <TmInput
            label="นามแฝง"
            value={editAlias}
            onChange={(e) => setEditAlias(e.target.value)}
          />
          <TmInput
            label="คำอธิบาย"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="บอกเล่าเกี่ยวกับตัวคุณ..."
          />
          <TmButton onClick={handleSaveProfile}>บันทึก</TmButton>
        </div>
      </TmModal>
    </div>
  );
}
