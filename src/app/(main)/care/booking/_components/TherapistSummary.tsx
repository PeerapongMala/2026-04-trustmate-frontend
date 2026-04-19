import { TmAvatar } from "@/shared/components";
import type { Therapist } from "@/shared/types/booking";

export function TherapistSummary({ therapist }: { therapist: Therapist }) {
  return (
    <div className="flex items-start gap-3 border-b border-tm-light pb-4">
      <TmAvatar size="lg" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-tm-navy">{therapist.name}</p>
            <p className="text-sm text-tm-gray">{therapist.title}</p>
          </div>
          <div className="text-right text-sm text-tm-gray">
            <p>{therapist.location}</p>
            <p className="text-xs">@ {therapist.clinic}</p>
          </div>
        </div>
        <p className="mt-1 text-xs">
          <span className="text-tm-orange">หัวข้อที่เชี่ยวชาญ</span>{" "}
          <span className="text-tm-gray">{therapist.specialties.join(", ")}</span>
        </p>
      </div>
    </div>
  );
}
