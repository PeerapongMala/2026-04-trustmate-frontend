"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TmButton, TmCard, TmAvatar } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { Therapist, TimeSlot } from "@/shared/types/booking";

type Step = 1 | 2 | 3 | 4;

const GENDER_OPTIONS = ["ชาย", "หญิง", "อื่นๆ"];

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

  // Step 3: personal info
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [genderBirth, setGenderBirth] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [phone, setPhone] = useState("");

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
      fullName,
      birthDate,
      genderBirth,
      genderIdentity,
      phone,
    });

    if (!error) {
      setStep(4);
    }
    setLoading(false);
  }

  function selectTherapist(t: Therapist) {
    setSelectedTherapist(t);
    setStep(2);
    setSelectedDate("");
    setSelectedSlot(null);
  }

  // Calendar helpers
  function getCalendarDays(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }

  function isDateAvailable(day: number) {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDates.some((d) => d.slice(0, 10) === dateStr);
  }

  function formatDateStr(day: number) {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Therapist info card (reusable)
  function TherapistSummary() {
    if (!selectedTherapist) return null;
    return (
      <div className="flex items-start gap-3 border-b border-tm-light pb-4">
        <TmAvatar size="lg" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-tm-navy">{selectedTherapist.name}</p>
              <p className="text-sm text-tm-gray">{selectedTherapist.title}</p>
            </div>
            <div className="text-right text-sm text-tm-gray">
              <p>{selectedTherapist.location}</p>
              <p className="text-xs">@ {selectedTherapist.clinic}</p>
            </div>
          </div>
          <p className="mt-1 text-xs">
            <span className="text-tm-orange">หัวข้อที่เชี่ยวชาญ</span>{" "}
            <span className="text-tm-gray">{selectedTherapist.specialties.join(", ")}</span>
          </p>
        </div>
      </div>
    );
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

  // Step 2: เลือกวันเวลาที่สะดวก (with calendar)
  if (step === 2 && selectedTherapist) {
    const calendarDays = getCalendarDays(calendarMonth);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
      <div className="pb-24">
        <header className="flex items-center gap-3 px-4 pt-6 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tm-light">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-tm-navy">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-tm-gray">ขั้นตอนที่ 2</p>
            <p className="font-bold text-tm-navy">เลือกวันเวลาที่สะดวก</p>
          </div>
        </header>

        <div className="mx-4 rounded-3xl border border-tm-light bg-white p-4">
          <TherapistSummary />

          {/* สถานที่ */}
          <div className="mt-4 border-b border-dashed border-tm-light pb-3">
            <span className="text-sm text-tm-navy">สถานที่</span>{" "}
            <span className="text-sm text-tm-orange">{selectedTherapist.clinic}</span>
          </div>

          {/* เลือกวัน — Calendar */}
          <div className="mt-4">
            <p className="text-sm font-medium text-tm-navy">เลือกวัน</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                className="text-tm-gray hover:text-tm-navy"
              >
                &lt;
              </button>
              <div className="rounded-2xl bg-tm-orange px-6 py-2 text-center text-white">
                <span className="font-bold">
                  {String(calendarMonth.getMonth() + 1).padStart(2, "0")}
                </span>
                <span className="mx-4">{MONTH_NAMES[calendarMonth.getMonth()]}</span>
                <span className="font-bold">{calendarMonth.getFullYear()}</span>
              </div>
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                className="text-tm-gray hover:text-tm-navy"
              >
                &gt;
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="py-1 font-medium text-tm-gray">{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} />;
                const dateStr = formatDateStr(day);
                const available = isDateAvailable(day);
                const isToday = dateStr === todayStr;
                const isSelected = selectedDate === dateStr;
                const isSunday = i % 7 === 0;
                const isSaturday = i % 7 === 6;

                return (
                  <button
                    key={dateStr}
                    disabled={!available}
                    onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                    className={`relative rounded-full py-1.5 text-xs transition-colors ${
                      isSelected
                        ? "bg-tm-navy text-white font-bold"
                        : available
                          ? isToday
                            ? "bg-tm-orange/20 text-tm-navy font-bold"
                            : "text-tm-navy hover:bg-tm-light"
                          : "text-tm-gray/30"
                    } ${isSunday || isSaturday ? "text-tm-orange" : ""}`}
                  >
                    {day}
                    {available && !isSelected && (
                      <span className="absolute -top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-tm-orange" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* เลือกเวลา */}
          {selectedDate && (
            <div className="mt-4 border-t border-dashed border-tm-light pt-4">
              <p className="text-sm font-medium text-tm-navy">เลือกเวลา</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {slots.map((s) => {
                  const isSelected = selectedSlot?.id === s.id;
                  return (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-tm-navy"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          isSelected ? "border-tm-orange bg-tm-orange" : "border-tm-gray/30"
                        }`}
                        onClick={() => setSelectedSlot(s)}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span onClick={() => setSelectedSlot(s)}>
                        {s.startTime} - {s.endTime} น.
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mx-4 mt-4 flex justify-end">
          <TmButton onClick={() => setStep(3)} disabled={!selectedSlot}>
            {`>> ถัดไป`}
          </TmButton>
        </div>
      </div>
    );
  }

  // Step 3: กรอกข้อมูลยืนยันตัวตน
  if (step === 3 && selectedTherapist && selectedSlot) {
    const isFormValid = fullName.trim() && birthDate.trim() && genderBirth && phone.trim();

    return (
      <div className="pb-24">
        <header className="flex items-center gap-3 px-4 pt-6 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tm-light">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-tm-navy">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-tm-gray">ขั้นตอนที่ 3</p>
            <p className="font-bold text-tm-navy">กรอกข้อมูลยืนยันตัวตน</p>
          </div>
        </header>

        <div className="mx-4 max-w-lg rounded-3xl border border-tm-light bg-white p-4 overflow-hidden">
          <TherapistSummary />

          {/* Appointment info */}
          <div className="mt-4 border-b border-dashed border-tm-light pb-3">
            <p className="text-sm">
              <span className="text-tm-navy">สถานที่</span>{" "}
              <span className="text-tm-orange">{selectedTherapist.clinic}</span>
            </p>
            <p className="text-sm">
              <span className="text-tm-navy">วันที่</span>{" "}
              <span className="text-tm-orange">
                {new Date(selectedSlot.date).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="ml-4 text-tm-navy">เวลา</span>{" "}
              <span className="text-tm-orange">{selectedSlot.startTime} น.</span>
            </p>
          </div>

          {/* Form */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-tm-navy">ชื่อ-สกุล</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-tm-navy">วัน/เดือน/ปีเกิด</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none"
              />
            </div>

            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-tm-navy">เพศกำเนิด</label>
                <select
                  value={genderBirth}
                  onChange={(e) => setGenderBirth(e.target.value)}
                  className="mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none"
                >
                  <option value="">เลือก</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-tm-navy">เพศสภาพ</label>
                <input
                  type="text"
                  value={genderIdentity}
                  onChange={(e) => setGenderIdentity(e.target.value)}
                  className="mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none"
                  placeholder="ระบุ (ถ้ามี)"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-tm-navy">เบอร์โทร</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none"
                placeholder="0XX-XXX-XXXX"
              />
            </div>

            <p className="text-xs text-tm-orange">
              หมายเหตุ ข้อมูลส่วนนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อนำไปใช้ระบุตัวตนของผู้รับคำปรึกษาใน {selectedTherapist.clinic} เท่านั้น
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4 flex justify-between">
          <TmButton variant="outline" onClick={() => setStep(2)}>
            {`<< ย้อนกลับ`}
          </TmButton>
          <TmButton onClick={handleConfirm} disabled={!isFormValid || loading}>
            {loading ? "กำลังจอง..." : `ยืนยัน >>`}
          </TmButton>
        </div>
      </div>
    );
  }

  // Step 4: จองสำเร็จ
  return (
    <div className="pb-24">
      <header className="flex items-center gap-3 px-4 pt-6 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tm-light">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-tm-navy">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-tm-gray">ขั้นตอนที่ 4</p>
          <p className="font-bold text-tm-navy">จองสำเร็จ</p>
        </div>
      </header>

      {selectedTherapist && selectedSlot && (
        <div className="mx-4 rounded-3xl border border-tm-light bg-white p-4">
          {/* ข้อมูลผู้รับคำปรึกษา */}
          <div className="border-b border-dashed border-tm-light pb-3">
            <p className="mb-2 text-xs text-tm-gray">ข้อมูลผู้รับคำปรึกษา</p>
            <p className="text-sm">
              <span className="text-tm-navy">ชื่อ-สกุล</span>{" "}
              <span className="text-tm-orange">{fullName}</span>
            </p>
            {birthDate && (
              <p className="text-sm">
                <span className="text-tm-navy">วันเดือนปีเกิด</span>{" "}
                <span className="text-tm-orange">
                  {new Date(birthDate).toLocaleDateString("th-TH")}
                </span>
              </p>
            )}
            <p className="text-sm">
              <span className="text-tm-navy">เบอร์โทร</span>{" "}
              <span className="text-tm-orange">{phone}</span>
            </p>
          </div>

          {/* ข้อมูลผู้ให้คำปรึกษา */}
          <div className="mt-4 border-b border-dashed border-tm-light pb-4">
            <p className="mb-2 text-xs text-tm-gray">ข้อมูลผู้ให้คำปรึกษา</p>
            <TherapistSummary />
          </div>

          {/* นัดหมาย */}
          <div className="mt-4 border-b border-dashed border-tm-light pb-3">
            <p className="mb-2 text-xs text-tm-gray">นัดหมาย</p>
            <p className="text-sm">
              <span className="text-tm-navy">สถานที่</span>{" "}
              <span className="text-tm-orange">{selectedTherapist.clinic}</span>
            </p>
            <p className="text-sm">
              <span className="text-tm-navy">วันที่</span>{" "}
              <span className="text-tm-orange">
                {new Date(selectedSlot.date).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="ml-4 text-tm-navy">เวลา</span>{" "}
              <span className="text-tm-orange">{selectedSlot.startTime} น.</span>
            </p>
          </div>

          {/* ค่าบริการ */}
          <div className="mt-4">
            <p className="text-xs text-tm-gray">ค่าบริการ</p>
            <p className="mt-1 text-sm font-bold text-tm-navy">
              {selectedTherapist.pricePerSlot.toLocaleString()} บาท / 30 นาที
            </p>
            <p className="mt-1 text-xs text-tm-orange">* ชำระค่าบริการที่คลินิกโดยตรง</p>
          </div>
        </div>
      )}

      <div className="mx-4 mt-6">
        <TmButton className="w-full" onClick={() => router.push("/care")}>
          เสร็จสิ้น
        </TmButton>
      </div>
    </div>
  );
}
