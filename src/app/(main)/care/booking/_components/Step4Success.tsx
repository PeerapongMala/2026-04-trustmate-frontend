import { useRouter } from "next/navigation";
import { TmButton } from "@/shared/components";
import type { Therapist, TimeSlot } from "@/shared/types/booking";
import type { PersonalInfo } from "./Step3PersonalInfo";
import { StepHeader } from "./StepHeader";
import { TherapistSummary } from "./TherapistSummary";

interface Step4Props {
  therapist: Therapist;
  slot: TimeSlot;
  info: PersonalInfo;
}

export function Step4Success({ therapist, slot, info }: Step4Props) {
  const router = useRouter();

  return (
    <div className="pb-24">
      <StepHeader stepLabel="ขั้นตอนที่ 4" title="จองสำเร็จ" />

      <div className="mx-4 rounded-3xl border border-tm-light bg-white p-4">
        <div className="border-b border-dashed border-tm-light pb-3">
          <p className="mb-2 text-xs text-tm-gray">ข้อมูลผู้รับคำปรึกษา</p>
          <p className="text-sm">
            <span className="text-tm-navy">ชื่อ-สกุล</span>{" "}
            <span className="text-tm-orange">{info.fullName}</span>
          </p>
          {info.birthDate && (
            <p className="text-sm">
              <span className="text-tm-navy">วันเดือนปีเกิด</span>{" "}
              <span className="text-tm-orange">
                {new Date(info.birthDate).toLocaleDateString("th-TH")}
              </span>
            </p>
          )}
          <p className="text-sm">
            <span className="text-tm-navy">เบอร์โทร</span>{" "}
            <span className="text-tm-orange">{info.phone}</span>
          </p>
        </div>

        <div className="mt-4 border-b border-dashed border-tm-light pb-4">
          <p className="mb-2 text-xs text-tm-gray">ข้อมูลผู้ให้คำปรึกษา</p>
          <TherapistSummary therapist={therapist} />
        </div>

        <div className="mt-4 border-b border-dashed border-tm-light pb-3">
          <p className="mb-2 text-xs text-tm-gray">นัดหมาย</p>
          <p className="text-sm">
            <span className="text-tm-navy">สถานที่</span>{" "}
            <span className="text-tm-orange">{therapist.clinic}</span>
          </p>
          <p className="text-sm">
            <span className="text-tm-navy">วันที่</span>{" "}
            <span className="text-tm-orange">
              {new Date(slot.date).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="ml-4 text-tm-navy">เวลา</span>{" "}
            <span className="text-tm-orange">{slot.startTime} น.</span>
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs text-tm-gray">ค่าบริการ</p>
          <p className="mt-1 text-sm font-bold text-tm-navy">
            {therapist.pricePerSlot.toLocaleString()} บาท / 30 นาที
          </p>
          <p className="mt-1 text-xs text-tm-orange">
            * ชำระค่าบริการที่คลินิกโดยตรง
          </p>
        </div>
      </div>

      <div className="mx-4 mt-6">
        <TmButton className="w-full" onClick={() => router.push("/care")}>
          เสร็จสิ้น
        </TmButton>
      </div>
    </div>
  );
}
