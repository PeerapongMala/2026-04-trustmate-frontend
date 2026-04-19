import { useRouter } from "next/navigation";
import { TmAvatar, TmCard } from "@/shared/components";
import type { Therapist } from "@/shared/types/booking";

interface Step1Props {
  therapists: Therapist[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSelect: (therapist: Therapist) => void;
}

export function Step1SelectTherapist({
  therapists,
  sortBy,
  onSortChange,
  onSelect,
}: Step1Props) {
  const router = useRouter();

  return (
    <div>
      <header className="bg-tm-orange px-4 py-3 text-white">
        <button onClick={() => router.push("/care")} className="mr-2">
          &lt;
        </button>
        <span className="font-bold">จองคิว บริการให้คำปรึกษา</span>
      </header>

      <div className="px-4 pt-4">
        <p className="text-sm text-tm-navy">ขั้นตอนที่ 1 — เลือกผู้ให้คำปรึกษา</p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onSortChange("rating")}
            className={`rounded-full px-3 py-1 text-xs ${
              sortBy === "rating"
                ? "bg-tm-orange text-white"
                : "bg-tm-light text-tm-navy"
            }`}
          >
            เรียงตาม Rating
          </button>
          <button
            onClick={() => onSortChange("price")}
            className={`rounded-full px-3 py-1 text-xs ${
              sortBy === "price"
                ? "bg-tm-orange text-white"
                : "bg-tm-light text-tm-navy"
            }`}
          >
            เรียงตามราคา
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {therapists.length === 0 && (
            <p className="text-center text-sm text-tm-gray">
              ยังไม่มีผู้ให้คำปรึกษา
            </p>
          )}
          {therapists.map((t) => (
            <TmCard key={t.id}>
              <div className="flex items-start gap-3">
                <TmAvatar size="lg" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-tm-navy">{t.name}</p>
                      <p className="text-sm text-tm-gray">{t.title}</p>
                    </div>
                    <div className="text-right text-sm text-tm-gray">
                      <p>{t.location}</p>
                      <p className="text-xs">@ {t.clinic}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-tm-orange">
                    {t.specialties.join(", ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-tm-orange px-3 py-1 text-xs text-white">
                      {t.pricePerSlot.toLocaleString()} บาท / 30 นาที
                    </span>
                    <span className="text-xs text-tm-gray">
                      ⭐ {t.avgRating.toFixed(1)} ({t.reviewCount} รีวิว)
                    </span>
                  </div>
                  <button
                    onClick={() => onSelect(t)}
                    className="mt-2 text-sm font-medium text-tm-orange hover:underline"
                  >
                    นัดหมาย &gt;&gt;&gt;
                  </button>
                </div>
              </div>
            </TmCard>
          ))}
        </div>
      </div>
    </div>
  );
}
