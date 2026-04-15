"use client";

import { useState } from "react";
import { TmButton, TmCard, TmInput } from "@/shared/components";
import { api } from "@/shared/lib/api";

export default function AdminQuestionsPage() {
  const [assessmentText, setAssessmentText] = useState("");
  const [assessmentOrder, setAssessmentOrder] = useState("");
  const [todayQuestion, setTodayQuestion] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [message, setMessage] = useState("");

  async function handleAddAssessment() {
    if (!assessmentText || !assessmentOrder) return;
    const { error } = await api.post("/admin/assessment-questions", {
      text: assessmentText,
      order: parseInt(assessmentOrder, 10),
    });
    if (!error) {
      setMessage("เพิ่มคำถามแบบประเมินสำเร็จ");
      setAssessmentText("");
      setAssessmentOrder("");
    }
  }

  async function handleAddToday() {
    if (!todayQuestion || !todayDate) return;
    const { error } = await api.post("/admin/today-questions", {
      question: todayQuestion,
      date: todayDate,
    });
    if (!error) {
      setMessage("เพิ่มคำถาม Today Card สำเร็จ");
      setTodayQuestion("");
      setTodayDate("");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-tm-navy">จัดการคำถาม</h1>

      {message && (
        <p className="mt-2 text-sm text-green-600">{message}</p>
      )}

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
    </div>
  );
}
