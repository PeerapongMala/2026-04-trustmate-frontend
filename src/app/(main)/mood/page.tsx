"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TmLogo, TmButton, TmMoodWheel } from "@/shared/components";
import { api } from "@/shared/lib/api";

function isWithinMoodHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 12 && hour <= 23; // 12:00 - 23:59
}

export default function MoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    setAvailable(isWithinMoodHours());
  }, []);

  async function handleSubmit() {
    if (!selectedMood || !available) return;

    setLoading(true);
    await api.post("/mood", { mood: selectedMood, note: note || undefined });
    router.push("/");
  }

  if (!available) {
    return (
      <div className="px-4 pt-4">
        <header className="flex items-center justify-center py-2">
          <TmLogo size="sm" />
        </header>
        <div className="mt-20 text-center">
          <span className="text-5xl">🌙</span>
          <h1 className="mt-4 text-lg font-bold text-tm-navy">
            วงล้ออารมณ์ยังไม่เปิด
          </h1>
          <p className="mt-2 text-sm text-tm-gray">
            เปิดให้บันทึกอารมณ์ช่วง 12:00 - 23:59 น.
          </p>
          <p className="mt-1 text-sm text-tm-gray">
            กลับมาอีกทีตอนบ่ายนะ
          </p>
          <div className="mt-6">
            <TmButton variant="outline" onClick={() => router.push("/")}>
              กลับหน้าหลัก
            </TmButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <header className="flex items-center justify-center py-2">
        <TmLogo size="sm" />
      </header>

      <div className="mt-4 text-center">
        <h1 className="text-lg font-bold text-tm-navy">
          TODAY&apos;S MOOD : วงล้ออารมณ์
        </h1>
      </div>

      <div className="mt-6">
        <TmMoodWheel onSelect={setSelectedMood} selected={selectedMood} />
      </div>

      {selectedMood && (
        <p className="mt-4 text-center text-sm text-tm-orange">
          อารมณ์วันนี้: {selectedMood}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <label className="text-sm font-medium text-tm-navy">Note:</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="บันทึกเพิ่มเติม..."
          className="flex-1 rounded-full border border-tm-light bg-white px-4 py-2 text-sm text-tm-gray focus:outline-none focus:ring-2 focus:ring-tm-orange/50"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <TmButton onClick={handleSubmit} disabled={!selectedMood || loading}>
          {loading ? "กำลังบันทึก..." : "เสร็จสิ้น"}
        </TmButton>
      </div>
    </div>
  );
}
