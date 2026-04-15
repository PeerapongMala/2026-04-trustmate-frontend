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
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h2 className="font-bold text-tm-navy">สายด่วนสุขภาพจิต</h2>
              <a
                href="tel:1323"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-tm-light px-4 py-2 font-bold text-tm-navy"
              >
                📞 1323
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
                <span className="text-2xl">🗓️</span>
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
