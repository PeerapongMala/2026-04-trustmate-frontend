import Link from "next/link";
import { TmLogo, TmCard } from "@/shared/components";

export default function CarePage() {
  return (
    <div className="px-4 pt-4">
      <header className="flex items-center justify-center py-2">
        <TmLogo size="sm" />
      </header>

      <div className="mt-6 flex flex-col gap-4">
        {/* สายด่วน */}
        <TmCard>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-tm-light">
              {/* กระทรวงสาธารณสุข icon */}
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="18" fill="#1B7A3D" opacity="0.15" />
                <path d="M20 8v24M8 20h24" stroke="#1B7A3D" strokeWidth="3" strokeLinecap="round" />
                <circle cx="20" cy="20" r="4" fill="#1B7A3D" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-tm-navy">สายด่วนสุขภาพจิต</h2>
              <a
                href="tel:1323"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-tm-navy px-5 py-2.5 font-bold text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                1323
              </a>
            </div>
          </div>
        </TmCard>

        {/* แบบประเมิน */}
        <Link href="/care/assessment">
          <TmCard className="cursor-pointer transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-tm-light">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h2 className="font-bold text-tm-navy">แบบประเมินความเครียด</h2>
                <p className="mt-1 text-sm text-tm-gray">
                  ลองทำแบบประเมินเพื่อเช็คสุขภาพจิตของคุณ
                </p>
              </div>
            </div>
          </TmCard>
        </Link>

        {/* จองคิว */}
        <Link href="/care/booking">
          <TmCard className="cursor-pointer transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-tm-light">
                <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                  <circle cx="20" cy="20" r="18" fill="#31356E" opacity="0.1" />
                  <path d="M14 12h12M12 16h16v14H12V16z" stroke="#31356E" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 12v-2M24 12v-2M16 21h2M22 21h2M16 25h2M22 25h2" stroke="#31356E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-tm-navy">Book a Session</h2>
                <p className="mt-1 text-sm text-tm-gray">
                  จองคิว บริการให้คำปรึกษา
                </p>
                <p className="text-xs text-tm-orange">
                  **มีค่าบริการเพิ่มเติม
                </p>
              </div>
            </div>
          </TmCard>
        </Link>

        {/* ข้อความให้กำลังใจ */}
        <div className="mt-4 text-center text-sm leading-relaxed text-tm-gray">
          <p>บางครั้ง.. แค่ได้พูดคุยกับใครสักคนก็ช่วยให้ใจเบาลงได้มาก</p>
          <p className="mt-1">
            ไม่ว่าคุณกำลังเหนื่อย สับสน หรือรู้สึกโดดเดี่ยว
          </p>
          <p className="mt-1">
            คุณไม่ต้องเผชิญมันลำพัง เราพร้อมรับฟังทุกเรื่องของคุณตลอด 24
            ชั่วโมง
          </p>
          <p className="mt-2">
            เพราะทุกความรู้สึกของคุณมีค่ายิ่งกว่าที่คิด 🤝
          </p>
          <TmLogo size="sm" className="mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
}
