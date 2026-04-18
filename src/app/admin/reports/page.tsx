"use client";

import { useEffect, useState } from "react";
import { TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";

interface AdminReport {
  id: string;
  targetType: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { alias: string };
  post: { content: string; tag: string } | null;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await api.get<{ data: AdminReport[] }>("/admin/reports");
      if (data) setReports(data.data);
      else setError(error || "ไม่สามารถโหลดข้อมูลได้ — กรุณา login ด้วย admin account ก่อน");
    }
    load();
  }, []);

  async function handleAction(id: string, action: "reviewed" | "dismissed") {
    await api.patch(`/admin/reports/${id}`, { action });
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">Reports</h1>

      <div className="mt-4 flex flex-col gap-3">
        {reports.map((r) => (
          <TmCard key={r.id} className="overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-tm-navy">
                  แจ้งโดย: {r.reporter.alias}
                </span>
                <span className="text-xs text-tm-gray">{r.targetType}</span>
              </div>
              <p className="break-all text-sm text-tm-gray">เหตุผล: {r.reason}</p>
              {r.post && (
                <p className="break-all text-sm text-tm-gray/70 line-clamp-2">
                  เนื้อหา: {r.post.content}
                </p>
              )}
              <div className="flex gap-2">
                <TmButton
                  size="sm"
                  onClick={() => handleAction(r.id, "reviewed")}
                >
                  ดำเนินการ
                </TmButton>
                <TmButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(r.id, "dismissed")}
                >
                  ปัดตก
                </TmButton>
              </div>
            </div>
          </TmCard>
        ))}
        {error && (
          <div className="py-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <a href="/login" className="mt-2 inline-block text-sm text-tm-orange underline">ไปหน้า Login</a>
          </div>
        )}
        {!error && reports.length === 0 && (
          <p className="text-center text-sm text-tm-gray">ไม่มี report ที่รอดู</p>
        )}
      </div>
    </div>
  );
}
