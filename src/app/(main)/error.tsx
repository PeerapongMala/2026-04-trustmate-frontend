"use client";

import { TmButton } from "@/shared/components";

export default function MainError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-4xl">😢</span>
      <p className="text-lg font-medium text-tm-navy">เกิดข้อผิดพลาด</p>
      <p className="text-sm text-tm-gray">กรุณาลองใหม่อีกครั้ง</p>
      <TmButton onClick={reset} size="sm">
        ลองอีกครั้ง
      </TmButton>
    </div>
  );
}
