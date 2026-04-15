"use client";

import { useState } from "react";
import Link from "next/link";
import { TmLogo, TmInput, TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: apiError } = await api.post("/auth/forgot-password", {
      email,
    });

    if (apiError) {
      setError(apiError);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <>
      <TmLogo size="xl" className="mb-8" />

      <TmCard className="w-full">
        {sent ? (
          <div className="text-center">
            <span className="text-4xl">✉️</span>
            <h1 className="mt-4 text-xl font-bold text-tm-navy">
              ส่งอีเมลแล้ว
            </h1>
            <p className="mt-2 text-sm text-tm-gray">
              หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้
              กรุณาเช็คอีเมลของคุณ
            </p>
            <Link href="/login">
              <TmButton className="mt-6">กลับหน้าเข้าสู่ระบบ</TmButton>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-center text-2xl font-bold text-tm-navy">
              ลืมรหัสผ่าน
            </h1>
            <p className="mb-6 text-center text-sm text-tm-gray">
              กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TmInput
                label="อีเมล"
                type="email"
                placeholder="ป้อนอีเมลของคุณ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <TmButton type="submit" disabled={loading} className="w-full">
                {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
              </TmButton>
            </form>

            <p className="mt-4 text-center text-sm text-tm-gray">
              <Link
                href="/login"
                className="text-tm-orange hover:underline"
              >
                กลับหน้าเข้าสู่ระบบ
              </Link>
            </p>
          </>
        )}
      </TmCard>
    </>
  );
}
