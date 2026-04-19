"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TmAvatar, TmButton, TmCard, TmLoading } from "@/shared/components";
import { TmEnvelope } from "@/shared/components/TmEnvelope";
import { api } from "@/shared/lib/api";
import type { User } from "@/shared/types/auth";
import type { Post } from "@/shared/types/post";
import { DAY_LABELS_FULL } from "./_constants";
import type { MoodDay, MoodEntry, TodayCardItem } from "./_types";
import { MoodLineGraph } from "./_components/MoodLineGraph";
import { MoodHistoryModal } from "./_components/MoodHistoryModal";
import { EditProfileModal } from "./_components/EditProfileModal";
import { MyPostsSection } from "./_components/MyPostsSection";
import {
  ChangePasswordModal,
  DeleteAccountModal,
} from "./_components/AccountMenuModals";

function buildMoodDays(moods: MoodEntry[]): MoodDay[] {
  const now = new Date();
  const days: MoodDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const entry = moods.find((m) => m.createdAt.slice(0, 10) === dateStr);
    days.push({
      day: DAY_LABELS_FULL[date.getDay()],
      mood: entry?.mood || null,
    });
  }
  return days;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<TodayCardItem[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [moodData, setMoodData] = useState<MoodDay[]>([]);
  const [allMoods, setAllMoods] = useState<MoodEntry[]>([]);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editAlias, setEditAlias] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarColor, setEditAvatarColor] = useState("");

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

      if (moodRes.data) {
        setAllMoods(moodRes.data);
        setMoodData(buildMoodDays(moodRes.data));
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
    const { error } = await api.post<{ message: string }>(
      "/auth/change-password",
      { currentPassword, newPassword },
    );
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
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-tm-navy">{user.alias}</h1>
          <p className="text-sm text-tm-gray">{user.bio || "คำอธิบาย"}</p>
        </div>
        <TmAvatar size="lg" color={user.avatarColor || undefined} />
        <div className="relative">
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
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-50 w-48 rounded-2xl border border-tm-light bg-white py-2 shadow-lg">
                {user.provider === "local" && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowChangePassword(true);
                      setPwError("");
                      setPwSuccess("");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-tm-gray hover:bg-tm-light/50"
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  ลบบัญชี
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <TmButton variant="solid" size="sm" onClick={() => setShowEdit(true)}>
          แก้ไขข้อมูลผู้ใช้
        </TmButton>
      </div>

      <MyPostsSection
        posts={myPosts}
        expanded={showMyPosts}
        onToggle={() => setShowMyPosts(!showMyPosts)}
      />

      <MoodLineGraph data={moodData} onSeeMore={() => setShowMoodHistory(true)} />

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

      <div className="mt-8 mb-8">
        <TmButton variant="outline" size="sm" onClick={handleLogout}>
          ออกจากระบบ
        </TmButton>
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        currentPassword={currentPassword}
        newPassword={newPassword}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onSubmit={handleChangePassword}
        error={pwError}
        success={pwSuccess}
      />

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />

      <MoodHistoryModal
        isOpen={showMoodHistory}
        onClose={() => setShowMoodHistory(false)}
        moods={allMoods}
      />

      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        alias={editAlias}
        bio={editBio}
        avatarColor={editAvatarColor}
        onAliasChange={setEditAlias}
        onBioChange={setEditBio}
        onAvatarColorChange={setEditAvatarColor}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
