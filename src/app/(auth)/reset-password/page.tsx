"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TmLogo, TmInput, TmButton, TmCard, TmLoading } from "@/shared/components";
import { api } from "@/shared/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!token) {
      setError("ลิงก์ไม่ถูกต้อง");
      return;
    }

    setLoading(true);

    const { error: apiError } = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });

    if (apiError) {
      setError(apiError);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <>
        <TmLogo size="xl" className="mb-8" />
        <TmCard className="w-full text-center">
          <span className="text-4xl">⚠️</span>
          <p className="mt-4 text-tm-navy font-bold">ลิงก์ไม่ถูกต้อง</p>
          <Link href="/forgot-password">
            <TmButton className="mt-4">ขอลิงก์ใหม่</TmButton>
          </Link>
        </TmCard>
      </>
    );
  }

  return (
    <>
      <TmLogo size="xl" className="mb-8" />

      <TmCard className="w-full">
        {success ? (
          <div className="text-center">
            <span className="text-4xl">✅</span>
            <h1 className="mt-4 text-xl font-bold text-tm-navy">
              เปลี่ยนรหัสผ่านสำเร็จ
            </h1>
            <p className="mt-2 text-sm text-tm-gray">
              กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่
            </p>
            <Link href="/login">
              <TmButton className="mt-6">เข้าสู่ระบบ</TmButton>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-6 text-center text-2xl font-bold text-tm-navy">
              ตั้งรหัสผ่านใหม่
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TmInput
                label="รหัสผ่านใหม่"
                type="password"
                placeholder="อย่างน้อย 8 ตัวอักษร..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <TmInput
                label="ยืนยันรหัสผ่านใหม่"
                type="password"
                placeholder="พิมพ์รหัสผ่านอีกครั้ง..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <TmButton type="submit" disabled={loading} className="w-full">
                {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
              </TmButton>
            </form>
          </>
        )}
      </TmCard>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<TmLoading text="กำลังโหลด..." />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
