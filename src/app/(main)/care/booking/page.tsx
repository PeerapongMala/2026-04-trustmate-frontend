"use client";

import { useEffect, useState } from "react";
import { api } from "@/shared/lib/api";
import type { Therapist, TimeSlot } from "@/shared/types/booking";
import { Step1SelectTherapist } from "./_components/Step1SelectTherapist";
import { Step2SelectDateTime } from "./_components/Step2SelectDateTime";
import {
  Step3PersonalInfo,
  type PersonalInfo,
} from "./_components/Step3PersonalInfo";
import { Step4Success } from "./_components/Step4Success";

type Step = 1 | 2 | 3 | 4;

const INITIAL_INFO: PersonalInfo = {
  fullName: "",
  birthDate: "",
  genderBirth: "",
  genderIdentity: "",
  phone: "",
};

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<PersonalInfo>(INITIAL_INFO);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    async function load() {
      const { data } = await api.get<Therapist[]>(`/therapists?sort=${sortBy}`);
      if (data) setTherapists(data);
    }
    load();
  }, [sortBy]);

  useEffect(() => {
    if (!selectedTherapist) return;
    async function load() {
      const { data } = await api.get<string[]>(
        `/therapists/${selectedTherapist!.id}/available-dates`,
      );
      if (data) setAvailableDates(data);
    }
    load();
  }, [selectedTherapist]);

  useEffect(() => {
    if (!selectedTherapist || !selectedDate) return;
    async function load() {
      const { data } = await api.get<TimeSlot[]>(
        `/therapists/${selectedTherapist!.id}/slots?date=${selectedDate}`,
      );
      if (data) setSlots(data);
    }
    load();
  }, [selectedTherapist, selectedDate]);

  function selectTherapist(t: Therapist) {
    setSelectedTherapist(t);
    setStep(2);
    setSelectedDate("");
    setSelectedSlot(null);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  async function handleConfirm() {
    if (!selectedTherapist || !selectedSlot) return;
    setLoading(true);

    const { error } = await api.post("/bookings", {
      therapistId: selectedTherapist.id,
      slotId: selectedSlot.id,
    });

    if (!error) {
      setStep(4);
    } else {
      alert("จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
    setLoading(false);
  }

  if (step === 1) {
    return (
      <Step1SelectTherapist
        therapists={therapists}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSelect={selectTherapist}
      />
    );
  }

  if (step === 2 && selectedTherapist) {
    return (
      <Step2SelectDateTime
        therapist={selectedTherapist}
        calendarMonth={calendarMonth}
        availableDates={availableDates}
        selectedDate={selectedDate}
        slots={slots}
        selectedSlot={selectedSlot}
        onCalendarMonthChange={setCalendarMonth}
        onDateSelect={handleDateSelect}
        onSlotSelect={setSelectedSlot}
        onNext={() => setStep(3)}
      />
    );
  }

  if (step === 3 && selectedTherapist && selectedSlot) {
    return (
      <Step3PersonalInfo
        therapist={selectedTherapist}
        slot={selectedSlot}
        info={info}
        loading={loading}
        onChange={(patch) => setInfo((prev) => ({ ...prev, ...patch }))}
        onBack={() => setStep(2)}
        onConfirm={handleConfirm}
      />
    );
  }

  if (step === 4 && selectedTherapist && selectedSlot) {
    return (
      <Step4Success
        therapist={selectedTherapist}
        slot={selectedSlot}
        info={info}
      />
    );
  }

  return null;
}
