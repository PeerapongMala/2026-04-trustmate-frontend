"use client";

import { useEffect, useState, useCallback } from "react";
import { TmButton, TmCard, TmModal } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { Therapist } from "@/shared/types/booking";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const EMPTY_FORM = {
  name: "",
  title: "",
  specialties: "",
  location: "",
  clinic: "",
  pricePerSlot: "",
};

export default function AdminTherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await api.get<Therapist[]>("/therapists");
      if (data) setTherapists(data);
    }
    load();
  }, []);

  async function handleAdd() {
    if (!form.name || !form.title || !form.clinic || !form.location || !form.pricePerSlot) {
      showToast("กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    setFormLoading(true);
    const { data, error } = await api.post<Therapist>("/admin/therapists", {
      name: form.name,
      title: form.title,
      specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      location: form.location,
      clinic: form.clinic,
      pricePerSlot: Number(form.pricePerSlot),
    });
    setFormLoading(false);

    if (error) {
      showToast("เพิ่มไม่สำเร็จ: " + error, "error");
      return;
    }

    if (data) setTherapists((prev) => [...prev, data]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    showToast("เพิ่มที่ปรึกษาสำเร็จ");
  }

  async function handleDelete(id: string) {
    const { error } = await api.delete(`/admin/therapists/${id}`);
    if (error) {
      showToast("ลบไม่สำเร็จ: " + error, "error");
      return;
    }
    setTherapists((prev) => prev.filter((t) => t.id !== id));
    showToast("ลบที่ปรึกษาสำเร็จ");
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-tm-navy">จัดการที่ปรึกษา</h1>
        <TmButton size="sm" onClick={() => setShowForm(true)}>+ เพิ่ม</TmButton>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {therapists.map((t) => (
          <TmCard key={t.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-tm-navy">{t.name}</p>
                <p className="text-sm text-tm-gray">{t.title}</p>
                <p className="text-xs text-tm-orange">
                  {t.specialties.join(", ")}
                </p>
                <p className="mt-1 text-xs text-tm-gray">
                  {t.clinic}, {t.location} — {t.pricePerSlot.toLocaleString()}{" "}
                  บาท/30 นาที
                </p>
                <p className="text-xs text-tm-gray">
                  ⭐ {t.avgRating.toFixed(1)} ({t.reviewCount} รีวิว)
                </p>
              </div>
              <TmButton
                variant="outline"
                size="sm"
                onClick={() => handleDelete(t.id)}
              >
                ลบ
              </TmButton>
            </div>
          </TmCard>
        ))}
        {therapists.length === 0 && (
          <p className="text-center text-sm text-tm-gray">
            ยังไม่มีผู้ให้คำปรึกษา
          </p>
        )}
      </div>

      {/* Add therapist modal */}
      <TmModal isOpen={showForm} onClose={() => setShowForm(false)}>
        <h2 className="mb-4 text-lg font-bold text-tm-navy">เพิ่มที่ปรึกษา</h2>
        <div className="flex flex-col gap-3">
          <input
            placeholder="ชื่อ เช่น พญ. ใจดี สุขสบาย"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <input
            placeholder="ตำแหน่ง เช่น จิตแพทย์ทั่วไป"
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <input
            placeholder="ความเชี่ยวชาญ (คั่นด้วย ,) เช่น ซึมเศร้า, วิตกกังวล"
            value={form.specialties}
            onChange={(e) => updateForm("specialties", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <input
            placeholder="คลินิก/โรงพยาบาล"
            value={form.clinic}
            onChange={(e) => updateForm("clinic", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <input
            placeholder="จังหวัด เช่น กรุงเทพฯ"
            value={form.location}
            onChange={(e) => updateForm("location", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <input
            type="number"
            placeholder="ราคา (บาท/30 นาที)"
            value={form.pricePerSlot}
            onChange={(e) => updateForm("pricePerSlot", e.target.value)}
            className="rounded-xl border border-tm-light bg-tm-light/50 px-4 py-2.5 text-sm text-tm-navy outline-none focus:ring-2 focus:ring-tm-orange/50"
          />
          <div className="flex gap-2 pt-2">
            <TmButton onClick={handleAdd} disabled={formLoading}>
              {formLoading ? "กำลังเพิ่ม..." : "เพิ่ม"}
            </TmButton>
            <TmButton variant="outline" onClick={() => setShowForm(false)}>
              ยกเลิก
            </TmButton>
          </div>
        </div>
      </TmModal>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {t.type === "success" ? "✓ " : "✕ "}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
