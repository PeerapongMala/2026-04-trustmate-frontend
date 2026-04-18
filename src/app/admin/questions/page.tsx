"use client";

import { useState, useCallback } from "react";
import { TmButton, TmCard, TmInput } from "@/shared/components";
import { api } from "@/shared/lib/api";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function AdminQuestionsPage() {
  const [assessmentText, setAssessmentText] = useState("");
  const [assessmentOrder, setAssessmentOrder] = useState("");
  const [todayQuestion, setTodayQuestion] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  async function handleAddAssessment() {
    if (!assessmentText || !assessmentOrder) {
      showToast("กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }
    const { error } = await api.post("/admin/assessment-questions", {
      text: assessmentText,
      order: parseInt(assessmentOrder, 10),
    });
    if (error) {
      showToast("เพิ่มไม่สำเร็จ: " + error, "error");
      return;
    }
    showToast("เพิ่มคำถามแบบประเมินสำเร็จ");
    setAssessmentText("");
    setAssessmentOrder("");
  }

  async function handleAddToday() {
    if (!todayQuestion || !todayDate) {
      showToast("กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }
    const { error } = await api.post("/admin/today-questions", {
      question: todayQuestion,
      date: todayDate,
    });
    if (error) {
      showToast("เพิ่มไม่สำเร็จ: " + error, "error");
      return;
    }
    showToast("เพิ่มคำถาม Today Card สำเร็จ");
    setTodayQuestion("");
    setTodayDate("");
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">จัดการคำถาม</h1>

      {/* Assessment Questions */}
      <TmCard className="mt-4">
        <h2 className="font-bold text-tm-navy">เพิ่มคำถามแบบประเมิน</h2>
        <div className="mt-3 flex flex-col gap-3">
          <TmInput
            label="คำถาม"
            value={assessmentText}
            onChange={(e) => setAssessmentText(e.target.value)}
            placeholder="เช่น คุณรู้สึกหงุดหงิดหรืออารมณ์เสียมากแค่ไหน"
          />
          <TmInput
            label="ลำดับ"
            type="number"
            value={assessmentOrder}
            onChange={(e) => setAssessmentOrder(e.target.value)}
            placeholder="1, 2, 3..."
          />
          <TmButton size="sm" onClick={handleAddAssessment}>
            เพิ่มคำถาม
          </TmButton>
        </div>
      </TmCard>

      {/* Today Card Questions */}
      <TmCard className="mt-4">
        <h2 className="font-bold text-tm-navy">เพิ่มคำถาม Today Card</h2>
        <div className="mt-3 flex flex-col gap-3">
          <TmInput
            label="คำถาม"
            value={todayQuestion}
            onChange={(e) => setTodayQuestion(e.target.value)}
            placeholder="เช่น วันนี้มาทบทวนคุณตัวเองว่างัย"
          />
          <TmInput
            label="วันที่"
            type="date"
            value={todayDate}
            onChange={(e) => setTodayDate(e.target.value)}
          />
          <TmButton size="sm" onClick={handleAddToday}>
            เพิ่มคำถาม
          </TmButton>
        </div>
      </TmCard>

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
