"use client";

import { useEffect, useState } from "react";
import { api } from "@/shared/lib/api";

interface DashboardStats {
  userCount: number;
  postCount: number;
  flaggedCount: number;
  pendingReports: number;
  bookingCount: number;
}

const STAT_CONFIG = [
  {
    key: "userCount" as const,
    label: "ผู้ใช้ทั้งหมด",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    accent: "text-tm-navy",
    bg: "bg-tm-blue/20",
    iconColor: "text-tm-navy",
  },
  {
    key: "postCount" as const,
    label: "โพสต์ทั้งหมด",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    accent: "text-tm-navy",
    bg: "bg-tm-light/50",
    iconColor: "text-tm-navy",
  },
  {
    key: "flaggedCount" as const,
    label: "โพสต์ถูก Flag",
    icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z",
    accent: "text-tm-orange",
    bg: "bg-tm-orange/10",
    iconColor: "text-tm-orange",
  },
  {
    key: "pendingReports" as const,
    label: "Report รอดู",
    icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "text-red-500",
    bg: "bg-red-50",
    iconColor: "text-red-400",
  },
  {
    key: "bookingCount" as const,
    label: "การจองทั้งหมด",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    accent: "text-tm-navy",
    bg: "bg-tm-blue/20",
    iconColor: "text-tm-navy",
  },
];

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
    return <p className="pt-10 text-center text-tm-gray">กำลังโหลด...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-tm-gray">ภาพรวมระบบ TrustMate</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STAT_CONFIG.map((c) => (
          <div
            key={c.key}
            className="rounded-3xl border border-tm-light/50 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${c.bg}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`h-4 w-4 ${c.iconColor}`}>
                  <path d={c.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-tm-gray">{c.label}</p>
            </div>
            <p className={`mt-3 text-3xl font-bold ${c.accent}`}>
              {stats[c.key].toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
