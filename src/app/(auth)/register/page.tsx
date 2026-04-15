"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TmLogo, TmInput, TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { AuthResponse } from "@/shared/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alias, setAlias] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!acceptPolicy) {
      setError("กรุณายอมรับนโยบายความเป็นส่วนตัว");
      return;
    }

    setLoading(true);

    const { data, error: apiError } = await api.post<AuthResponse>(
      "/auth/register",
      { email, password, alias }
    );

    if (apiError) {
      setError(apiError);
      setLoading(false);
      return;
    }

    if (data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <>
      <TmLogo size="xl" className="mb-8" />

      <TmCard className="w-full">
        <h1 className="mb-6 text-center text-2xl font-bold text-tm-navy">
          สร้างบัญชี
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TmInput
            label="อีเมล"
            type="email"
            placeholder="ป้อนอีเมลของคุณ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TmInput
            label="นามแฝง"
            type="text"
            placeholder="ตั้งนามแฝงของคุณ..."
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
          />

          <TmInput
            label="รหัสผ่าน"
            type="password"
            placeholder="สร้างรหัสผ่านของคุณ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <TmInput
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="ยืนยันรหัสผ่านของคุณ..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="flex items-start gap-2 text-sm text-tm-gray">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-tm-light accent-tm-orange"
            />
            <span>
              ฉันรับทราบและยอมรับ{" "}
              <Link href="#" className="font-bold text-tm-orange hover:underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </span>
          </label>

          <p className="text-xs text-tm-gray/70">
            การคลิกที่ปุ่ม
            <span className="text-tm-orange">สร้างบัญชี</span>
            แสดงว่าคุณยินยอมรับ{" "}
            <Link href="#" className="text-tm-orange hover:underline">
              ข้อตกลงและเงื่อนไข
            </Link>{" "}
            ตาม
            <Link href="#" className="text-tm-orange hover:underline">
              นโยบายข้อมูล
            </Link>{" "}
            ของเราแล้ว
          </p>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <TmButton type="submit" disabled={loading} className="w-full">
            {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </TmButton>
        </form>
      </TmCard>
    </>
  );
}
