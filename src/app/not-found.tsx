import Link from "next/link";
import { TmButton, TmLogo } from "@/shared/components";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-tm-bg px-4 text-center">
      <TmLogo size="md" />
      <span className="text-5xl">🔍</span>
      <h1 className="text-xl font-bold text-tm-navy">ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-sm text-tm-gray">
        หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว
      </p>
      <Link href="/">
        <TmButton>กลับหน้าหลัก</TmButton>
      </Link>
    </div>
  );
}
