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

interface TodayCardItem {
  id: string;
  answer: string;
  createdAt: string;
  question: { question: string; date: string };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<TodayCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editAlias, setEditAlias] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const [userRes, cardsRes] = await Promise.all([
        api.get<User>("/users/me"),
        api.get<TodayCardItem[]>("/today-card/history"),
      ]);

      if (userRes.data) {
        setUser(userRes.data);
        setEditAlias(userRes.data.alias);
        setEditBio(userRes.data.bio || "");
      } else {
        localStorage.removeItem("token");
        router.push("/login");
      }

      if (cardsRes.data) setCards(cardsRes.data);
      setLoading(false);
    }

    fetchData();
  }, [router]);

  async function handleSaveProfile() {
    const { data } = await api.patch<User>("/users/me", {
      alias: editAlias,
      bio: editBio,
    });
    if (data) setUser(data);
    setShowEdit(false);
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
        <button className="text-tm-gray hover:text-tm-navy">
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

      {/* My posts link */}
      <div className="mt-6">
        <TmCard className="bg-tm-light">
          <p className="text-center text-sm font-medium text-tm-navy">
            คลังโพสต์ของฉัน &gt;&gt;&gt;
          </p>
        </TmCard>
      </div>

      {/* Mood graph 7 วัน */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-tm-navy">
          กราฟอารมณ์ย้อนหลัง — ในช่วง 7 วันที่ผ่านมา
        </h2>
        <TmCard className="h-40 flex items-center justify-center">
          <div className="w-full px-2">
            <div className="flex items-end justify-between gap-1 h-24">
              {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t bg-tm-orange/60"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                  <span className="text-[9px] text-tm-gray">{d}</span>
                </div>
              ))}
            </div>
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

      {/* Edit Modal */}
      <TmModal isOpen={showEdit} onClose={() => setShowEdit(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">
          แก้ไขข้อมูลผู้ใช้
        </h2>
        <div className="flex flex-col gap-4">
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
