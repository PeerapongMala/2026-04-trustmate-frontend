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
  note?: string;
  createdAt: string;
}

const NEGATIVE_MOODS = ["เศร้าซึม", "เบื่อหน่าย", "วิตกกลัว", "ว้าวุ่น"];
const DAY_LABELS_FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

const MOOD_LIST = [
  { name: "ลั๊ลลา", color: "#FFD700" },
  { name: "ประหลาดใจ", color: "#FF8C00" },
  { name: "ว้าวุ่น", color: "#E53935" },
  { name: "วิตกกลัว", color: "#F48FB1" },
  { name: "ฉุนเฉียว", color: "#9C27B0" },
  { name: "ขยะแขยง", color: "#1565C0" },
  { name: "เศร้าซึม", color: "#42A5F5" },
  { name: "เบื่อหน่าย", color: "#4CAF50" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<TodayCardItem[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [moodData, setMoodData] = useState<{ day: string; mood: string | null }[]>([]);
  const [allMoods, setAllMoods] = useState<MoodEntry[]>([]);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
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

      // Build 7-day mood line graph data
      if (moodRes.data) {
        setAllMoods(moodRes.data);
        const now = new Date();
        const days: { day: string; mood: string | null }[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().slice(0, 10);
          const dayEntry = moodRes.data.find(
            (m) => m.createdAt.slice(0, 10) === dateStr
          );
          days.push({
            day: DAY_LABELS_FULL[date.getDay()],
            mood: dayEntry?.mood || null,
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
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-50 w-48 rounded-2xl border border-tm-light bg-white py-2 shadow-lg">
                {user.provider === "local" && (
                  <button
                    onClick={() => { setShowMenu(false); setShowChangePassword(true); setPwError(""); setPwSuccess(""); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-tm-gray hover:bg-tm-light/50"
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                )}
                <button
                  onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  ลบบัญชี
                </button>
              </div>
            </>
          )}
        </div>
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
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-tm-orange">{post.tag}</p>
                    {post.visibility === "private" && (
                      <span className="rounded-full bg-tm-gray/10 px-2 py-0.5 text-[10px] text-tm-gray">ส่วนตัว</span>
                    )}
                    {post.visibility === "anonymous" && (
                      <span className="rounded-full bg-tm-navy/10 px-2 py-0.5 text-[10px] text-tm-navy">ไม่ระบุตัวตน</span>
                    )}
                  </div>
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

      {/* Mood line graph 7 วัน */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-tm-navy">
            กราฟอารมณ์ของฉัน — ในช่วง 7 วันที่ผ่านมา
          </h2>
          <button
            onClick={() => setShowMoodHistory(true)}
            className="text-xs font-medium text-tm-orange hover:underline"
          >
            ดูเพิ่มเติม
          </button>
        </div>
        <TmCard>
          <div className="w-full overflow-x-auto">
            {moodData.some((d) => d.mood) ? (
              <svg viewBox="0 0 340 180" className="w-full" style={{ minWidth: 300 }}>
                {/* Y-axis labels (mood names) */}
                {MOOD_LIST.map((m, i) => (
                  <text
                    key={m.name}
                    x="2"
                    y={20 + i * 19}
                    className="text-[7px]"
                    fill={m.color}
                    dominantBaseline="middle"
                  >
                    {m.name}
                  </text>
                ))}

                {/* Grid lines */}
                {MOOD_LIST.map((_, i) => (
                  <line
                    key={i}
                    x1="65"
                    y1={20 + i * 19}
                    x2="330"
                    y2={20 + i * 19}
                    stroke="#E0E0E0"
                    strokeWidth="0.5"
                    strokeDasharray="3,3"
                  />
                ))}

                {/* Line graph */}
                {(() => {
                  const points: { x: number; y: number; color: string }[] = [];
                  const xStep = (330 - 65) / 6;

                  moodData.forEach((d, i) => {
                    if (d.mood) {
                      const moodIdx = MOOD_LIST.findIndex((m) => m.name === d.mood);
                      if (moodIdx >= 0) {
                        const moodObj = MOOD_LIST[moodIdx];
                        points.push({
                          x: 65 + i * xStep,
                          y: 20 + moodIdx * 19,
                          color: moodObj.color,
                        });
                      }
                    }
                  });

                  return (
                    <>
                      {/* Connect line */}
                      {points.length > 1 && (
                        <polyline
                          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                          fill="none"
                          stroke="#E47B18"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      )}
                      {/* Dots */}
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.color} stroke="white" strokeWidth="1.5" />
                      ))}
                    </>
                  );
                })()}

                {/* X-axis labels (days) */}
                {moodData.map((d, i) => {
                  const xStep = (330 - 65) / 6;
                  return (
                    <text
                      key={i}
                      x={65 + i * xStep}
                      y={175}
                      textAnchor="middle"
                      className="text-[7px]"
                      fill="#494F56"
                    >
                      {d.day}
                    </text>
                  );
                })}
              </svg>
            ) : (
              <p className="py-6 text-center text-xs text-tm-gray/50">ยังไม่มีข้อมูลอารมณ์</p>
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

      {/* Mood History Modal */}
      <TmModal isOpen={showMoodHistory} onClose={() => setShowMoodHistory(false)}>
        <div className="max-h-[80vh] overflow-y-auto">
          <h2 className="mb-4 text-center text-lg font-bold text-tm-navy">
            ประวัติวงล้ออารมณ์
          </h2>

          {/* Pie chart */}
          {allMoods.length > 0 ? (
            <>
              <div className="mx-auto w-56 h-56">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {(() => {
                    const counts: Record<string, number> = {};
                    allMoods.forEach((m) => {
                      counts[m.mood] = (counts[m.mood] || 0) + 1;
                    });
                    const total = allMoods.length;
                    let currentAngle = -90;
                    const segments: React.ReactNode[] = [];

                    MOOD_LIST.forEach((mood) => {
                      const count = counts[mood.name] || 0;
                      if (count === 0) return;
                      const sliceAngle = (count / total) * 360;
                      const startRad = (currentAngle * Math.PI) / 180;
                      const endRad = ((currentAngle + sliceAngle) * Math.PI) / 180;
                      const x1 = 100 + 85 * Math.cos(startRad);
                      const y1 = 100 + 85 * Math.sin(startRad);
                      const x2 = 100 + 85 * Math.cos(endRad);
                      const y2 = 100 + 85 * Math.sin(endRad);
                      const largeArc = sliceAngle > 180 ? 1 : 0;

                      const midAngle = ((currentAngle + sliceAngle / 2) * Math.PI) / 180;
                      const labelX = 100 + 55 * Math.cos(midAngle);
                      const labelY = 100 + 55 * Math.sin(midAngle);

                      segments.push(
                        <g key={mood.name}>
                          <path
                            d={`M100,100 L${x1},${y1} A85,85 0 ${largeArc},1 ${x2},${y2} Z`}
                            fill={mood.color}
                            opacity={0.85}
                            stroke="white"
                            strokeWidth="2"
                          />
                          {sliceAngle > 20 && (
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="white"
                              style={{ fontSize: "8px", fontWeight: "bold" }}
                            >
                              {mood.name}
                            </text>
                          )}
                        </g>
                      );

                      currentAngle += sliceAngle;
                    });

                    return segments;
                  })()}
                </svg>
              </div>

              {/* TODAY'S MOOD */}
              {allMoods[0] && (
                <div className="mt-4 border-t border-tm-light pt-3">
                  <p className="text-sm">
                    <span className="font-bold text-tm-navy">TODAY&apos;S MOOD : </span>
                    <span className="font-bold text-tm-orange">{allMoods[0].mood}</span>
                  </p>
                  {allMoods[0].note && (
                    <p className="text-xs text-tm-gray">NOTE: {allMoods[0].note}</p>
                  )}
                </div>
              )}

              {/* History list */}
              <div className="mt-4 border-t border-tm-light pt-3">
                <div className="space-y-1.5">
                  {allMoods.map((m) => (
                    <p key={m.id} className="text-xs text-tm-gray">
                      <span className="text-tm-navy">
                        {new Date(m.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                      {" : "}
                      <span className="font-medium" style={{ color: MOOD_LIST.find((ml) => ml.name === m.mood)?.color || "#494F56" }}>
                        {m.mood}
                      </span>
                      {m.note && <span>, {m.note}</span>}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-tm-gray/50">ยังไม่มีข้อมูลอารมณ์</p>
          )}
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
