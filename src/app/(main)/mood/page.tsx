"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TmLogo, TmButton, TmMoodWheel } from "@/shared/components";
import { api } from "@/shared/lib/api";

// อารมณ์ที่ถือว่าลบ/น่าเป็นห่วง
const CONCERNING_MOODS = ["เศร้าซึม", "เบื่อหน่าย", "วิตกกลัว", "ว้าวุ่น"];

// เกณฑ์ trigger แบบประเมิน: ≥57% ของ 7 วัน (4 วัน) — อ้างอิง PHQ-9 "more than half the days"
const THRESHOLD_DAYS = 4;
const LOOKBACK_DAYS = 7;

interface MoodEntry {
  mood: string;
  createdAt: string;
}

function isWithinMoodHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 12 && hour <= 23;
}

export default function MoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setAvailable(isWithinMoodHours());
  }, []);

  async function checkMoodHistory(): Promise<boolean> {
    const { data } = await api.get<MoodEntry[]>(`/mood/history?limit=${LOOKBACK_DAYS}`);
    if (!data || data.length < THRESHOLD_DAYS) return false;

    // นับจำนวนวันที่ mood ลบใน 7 วันล่าสุด
    const negativeDays = data.filter((entry) =>
      CONCERNING_MOODS.includes(entry.mood)
    ).length;

    return negativeDays >= THRESHOLD_DAYS;
  }

  async function handleSubmit() {
    if (!selectedMood || !available) return;

    setLoading(true);
    await api.post("/mood", { mood: selectedMood, note: note || undefined });

    // เช็ค 7 วันย้อนหลัง: ถ้า mood ลบ ≥ 4 วัน (57%) → trigger แบบประเมิน (อ้างอิง PHQ-9)
    const shouldTrigger = await checkMoodHistory();
    if (shouldTrigger) {
      setLoading(false);
      setShowPrompt(true);
    } else {
      router.push("/");
    }
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

  // Prompt ให้ทำแบบประเมิน
  if (showPrompt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <TmLogo size="lg" className="mb-8" />
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm border border-tm-light/50 text-center">
          <span className="text-5xl">💛</span>
          <h1 className="mt-4 text-lg font-bold text-tm-navy">
            เราเป็นห่วงคุณนะ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-tm-gray">
            ช่วงนี้คุณดูเหนื่อย ๆ อยากลองทำแบบประเมินสุขภาพจิตดูมั้ย?
            เพื่อให้เราช่วยดูแลคุณได้ดีขึ้น
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <TmButton onClick={() => router.push("/care/assessment")}>
              ทำแบบประเมิน
            </TmButton>
            <TmButton variant="outline" onClick={() => router.push("/")}>
              ไว้ทีหลัง
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
