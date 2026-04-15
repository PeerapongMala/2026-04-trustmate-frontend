"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TmButton, TmCard, TmAvatar } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { Therapist, TimeSlot } from "@/shared/types/booking";

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(false);

  // Step 1: Load therapists
  useEffect(() => {
    async function load() {
      const { data } = await api.get<Therapist[]>(`/therapists?sort=${sortBy}`);
      if (data) setTherapists(data);
    }
    load();
  }, [sortBy]);

  // Step 2: Load available dates
  useEffect(() => {
    if (!selectedTherapist) return;
    async function load() {
      const { data } = await api.get<string[]>(
        `/therapists/${selectedTherapist!.id}/available-dates`
      );
      if (data) setAvailableDates(data);
    }
    load();
  }, [selectedTherapist]);

  // Step 2: Load slots for selected date
  useEffect(() => {
    if (!selectedTherapist || !selectedDate) return;
    async function load() {
      const { data } = await api.get<TimeSlot[]>(
        `/therapists/${selectedTherapist!.id}/slots?date=${selectedDate}`
      );
      if (data) setSlots(data);
    }
    load();
  }, [selectedTherapist, selectedDate]);

  async function handleConfirm() {
    if (!selectedTherapist || !selectedSlot) return;
    setLoading(true);

    const { error } = await api.post("/bookings", {
      therapistId: selectedTherapist.id,
      slotId: selectedSlot.id,
    });

    if (!error) {
      router.push("/care");
    }
    setLoading(false);
  }

  function selectTherapist(t: Therapist) {
    setSelectedTherapist(t);
    setStep(2);
    setSelectedDate("");
    setSelectedSlot(null);
  }

  // Step 1: เลือกผู้ให้คำปรึกษา
  if (step === 1) {
    return (
      <div>
        <header className="bg-tm-orange px-4 py-3 text-white">
          <button onClick={() => router.push("/care")} className="mr-2">
            &lt;
          </button>
          <span className="font-bold">จองคิว บริการให้คำปรึกษา</span>
        </header>

        <div className="px-4 pt-4">
          <p className="text-sm text-tm-navy">ขั้นตอนที่ 1 — เลือกผู้ให้คำปรึกษา</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setSortBy("rating")}
              className={`rounded-full px-3 py-1 text-xs ${sortBy === "rating" ? "bg-tm-orange text-white" : "bg-tm-light text-tm-navy"}`}
            >
              เรียงตาม Rating
            </button>
            <button
              onClick={() => setSortBy("price")}
              className={`rounded-full px-3 py-1 text-xs ${sortBy === "price" ? "bg-tm-orange text-white" : "bg-tm-light text-tm-navy"}`}
            >
              เรียงตามราคา
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {therapists.length === 0 && (
              <p className="text-center text-sm text-tm-gray">ยังไม่มีผู้ให้คำปรึกษา</p>
            )}
            {therapists.map((t) => (
              <TmCard key={t.id}>
                <div className="flex items-start gap-3">
                  <TmAvatar size="lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-tm-navy">{t.name}</p>
                        <p className="text-sm text-tm-gray">{t.title}</p>
                      </div>
                      <div className="text-right text-sm text-tm-gray">
                        <p>{t.location}</p>
                        <p className="text-xs">@ {t.clinic}</p>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-tm-orange">
                      {t.specialties.join(", ")}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded-full bg-tm-orange px-3 py-1 text-xs text-white">
                        {t.pricePerSlot.toLocaleString()} บาท / 30 นาที
                      </span>
                      <span className="text-xs text-tm-gray">
                        ⭐ {t.avgRating.toFixed(1)} ({t.reviewCount} รีวิว)
                      </span>
                    </div>
                    <button
                      onClick={() => selectTherapist(t)}
                      className="mt-2 text-sm font-medium text-tm-orange hover:underline"
                    >
                      นัดหมาย &gt;&gt;&gt;
                    </button>
                  </div>
                </div>
              </TmCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: เลือกวัน/เวลา
  if (step === 2 && selectedTherapist) {
    return (
      <div>
        <header className="bg-tm-orange px-4 py-3 text-white">
          <button onClick={() => setStep(1)} className="mr-2">
            &lt;
          </button>
          <span className="font-bold">จองคิว บริการให้คำปรึกษา</span>
        </header>

        <div className="px-4 pt-4">
          <p className="text-sm text-tm-navy">ขั้นตอนที่ 2 — เลือกวันเวลาที่สะดวก</p>

          {/* Therapist summary */}
          <TmCard className="mt-3">
            <p className="font-bold text-tm-navy">{selectedTherapist.name}</p>
            <p className="text-sm text-tm-gray">{selectedTherapist.title}</p>
            <p className="text-xs text-tm-orange">
              {selectedTherapist.specialties.join(", ")}
            </p>
          </TmCard>

          {/* Date selection */}
          <div className="mt-4">
            <p className="text-sm font-medium text-tm-navy">เลือกวัน</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableDates.length === 0 && (
                <p className="text-sm text-tm-gray">ไม่มีวันว่าง</p>
              )}
              {availableDates.map((d) => {
                const date = new Date(d);
                const label = date.toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                });
                const isSelected = selectedDate === d;
                return (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      isSelected
                        ? "bg-tm-orange text-white"
                        : "border border-tm-navy text-tm-navy hover:bg-tm-light"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="mt-4">
              <p className="text-sm font-medium text-tm-navy">เลือกเวลา</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {slots.map((s) => {
                  const isSelected = selectedSlot?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-full px-3 py-2 text-sm ${
                        isSelected
                          ? "bg-tm-orange text-white"
                          : "border border-tm-light text-tm-navy hover:bg-tm-light"
                      }`}
                    >
                      {s.startTime} - {s.endTime} น.
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <TmButton
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
            >
              {`>> ถัดไป`}
            </TmButton>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: ยืนยัน
  return (
    <div>
      <header className="bg-tm-orange px-4 py-3 text-white">
        <button onClick={() => setStep(2)} className="mr-2">
          &lt;
        </button>
        <span className="font-bold">ยืนยันการจอง</span>
      </header>

      <div className="px-4 pt-4">
        {selectedTherapist && selectedSlot && (
          <TmCard>
            <h2 className="text-lg font-bold text-tm-navy">สรุปการจอง</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-tm-gray">
              <p>
                <span className="font-medium text-tm-navy">ผู้ให้คำปรึกษา:</span>{" "}
                {selectedTherapist.name}
              </p>
              <p>
                <span className="font-medium text-tm-navy">สถานที่:</span>{" "}
                {selectedTherapist.clinic}, {selectedTherapist.location}
              </p>
              <p>
                <span className="font-medium text-tm-navy">วัน:</span>{" "}
                <span className="text-tm-orange">
                  {new Date(selectedSlot.date).toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p>
                <span className="font-medium text-tm-navy">เวลา:</span>{" "}
                <span className="text-tm-orange">
                  {selectedSlot.startTime} - {selectedSlot.endTime} น.
                </span>
              </p>
              <p>
                <span className="font-medium text-tm-navy">ค่าบริการ:</span>{" "}
                {selectedTherapist.pricePerSlot.toLocaleString()} บาท / 30 นาที
              </p>
            </div>

            <p className="mt-4 text-xs text-tm-orange">
              * ชำระค่าบริการที่คลินิกโดยตรง
            </p>
          </TmCard>
        )}

        <div className="mt-6 flex justify-between">
          <TmButton variant="outline" onClick={() => setStep(2)}>
            {`<< ย้อนกลับ`}
          </TmButton>
          <TmButton onClick={handleConfirm} disabled={loading}>
            {loading ? "กำลังจอง..." : `ยืนยัน >>`}
          </TmButton>
        </div>
      </div>
    </div>
  );
}
