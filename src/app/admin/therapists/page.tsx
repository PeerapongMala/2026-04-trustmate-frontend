"use client";

import { useEffect, useState } from "react";
import { TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { Therapist } from "@/shared/types/booking";

export default function AdminTherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get<Therapist[]>("/therapists");
      if (data) setTherapists(data);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    await api.delete(`/admin/therapists/${id}`);
    setTherapists((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-tm-navy">จัดการที่ปรึกษา</h1>
        <TmButton size="sm">+ เพิ่ม</TmButton>
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
    </div>
  );
}
