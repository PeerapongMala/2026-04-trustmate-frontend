"use client";

import { useEffect, useState } from "react";
import { TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";

interface DashboardStats {
  userCount: number;
  postCount: number;
  flaggedCount: number;
  pendingReports: number;
  bookingCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await api.get<DashboardStats>("/admin/dashboard");
      if (data) setStats(data);
      else setError(error || "ไม่สามารถโหลดข้อมูลได้ — กรุณา login ด้วย admin account ก่อน");
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <a href="/login" className="mt-2 inline-block text-sm text-tm-orange underline">ไปหน้า Login</a>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center text-tm-gray">กำลังโหลด...</p>;
  }

  const cards = [
    { label: "ผู้ใช้ทั้งหมด", value: stats.userCount, color: "text-tm-navy" },
    { label: "โพสต์ทั้งหมด", value: stats.postCount, color: "text-tm-navy" },
    { label: "โพสต์ถูก Flag", value: stats.flaggedCount, color: "text-tm-orange" },
    { label: "Report รอดู", value: stats.pendingReports, color: "text-red-500" },
    { label: "การจองทั้งหมด", value: stats.bookingCount, color: "text-tm-navy" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <TmCard key={c.label}>
            <p className="text-sm text-tm-gray">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</p>
          </TmCard>
        ))}
      </div>
    </div>
  );
}
