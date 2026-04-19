import { TmButton } from "@/shared/components";
import type { Therapist, TimeSlot } from "@/shared/types/booking";
import { GENDER_OPTIONS } from "../_constants";
import { StepHeader } from "./StepHeader";
import { TherapistSummary } from "./TherapistSummary";

export interface PersonalInfo {
  fullName: string;
  birthDate: string;
  genderBirth: string;
  genderIdentity: string;
  phone: string;
}

interface Step3Props {
  therapist: Therapist;
  slot: TimeSlot;
  info: PersonalInfo;
  loading: boolean;
  onChange: (patch: Partial<PersonalInfo>) => void;
  onBack: () => void;
  onConfirm: () => void;
}

const INPUT_CLASS =
  "mt-1 box-border w-full min-w-0 rounded-xl border-0 bg-tm-light px-4 py-2.5 text-sm text-tm-navy outline-none";

export function Step3PersonalInfo({
  therapist,
  slot,
  info,
  loading,
  onChange,
  onBack,
  onConfirm,
}: Step3Props) {
  const isFormValid =
    info.fullName.trim() &&
    info.birthDate.trim() &&
    info.genderBirth &&
    info.phone.trim();

  return (
    <div className="pb-24">
      <StepHeader stepLabel="ขั้นตอนที่ 3" title="กรอกข้อมูลยืนยันตัวตน" />

      <div className="mx-4 max-w-lg overflow-hidden rounded-3xl border border-tm-light bg-white p-4">
        <TherapistSummary therapist={therapist} />

        <div className="mt-4 border-b border-dashed border-tm-light pb-3">
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

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-tm-navy">ชื่อ-สกุล</label>
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-tm-navy">
              วัน/เดือน/ปีเกิด
            </label>
            <input
              type="date"
              value={info.birthDate}
              onChange={(e) => onChange({ birthDate: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <label className="text-sm font-medium text-tm-navy">เพศกำเนิด</label>
              <select
                value={info.genderBirth}
                onChange={(e) => onChange({ genderBirth: e.target.value })}
                className={INPUT_CLASS}
              >
                <option value="">เลือก</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1">
              <label className="text-sm font-medium text-tm-navy">เพศสภาพ</label>
              <input
                type="text"
                value={info.genderIdentity}
                onChange={(e) => onChange({ genderIdentity: e.target.value })}
                className={INPUT_CLASS}
                placeholder="ระบุ (ถ้ามี)"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-tm-navy">เบอร์โทร</label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={INPUT_CLASS}
              placeholder="0XX-XXX-XXXX"
            />
          </div>

          <p className="text-xs text-tm-orange">
            หมายเหตุ ข้อมูลส่วนนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อนำไปใช้ระบุตัวตนของผู้รับคำปรึกษาใน{" "}
            {therapist.clinic} เท่านั้น
          </p>
        </div>
      </div>

      <div className="mx-4 mt-4 flex justify-between">
        <TmButton variant="outline" onClick={onBack}>
          {`<< ย้อนกลับ`}
        </TmButton>
        <TmButton onClick={onConfirm} disabled={!isFormValid || loading}>
          {loading ? "กำลังจอง..." : `ยืนยัน >>`}
        </TmButton>
      </div>
    </div>
  );
}
