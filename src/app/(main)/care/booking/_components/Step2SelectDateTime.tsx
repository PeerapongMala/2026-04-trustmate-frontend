import { TmButton } from "@/shared/components";
import type { Therapist, TimeSlot } from "@/shared/types/booking";
import { BookingCalendar } from "./BookingCalendar";
import { StepHeader } from "./StepHeader";
import { TherapistSummary } from "./TherapistSummary";

interface Step2Props {
  therapist: Therapist;
  calendarMonth: Date;
  availableDates: string[];
  selectedDate: string;
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onCalendarMonthChange: (date: Date) => void;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  onNext: () => void;
}

export function Step2SelectDateTime({
  therapist,
  calendarMonth,
  availableDates,
  selectedDate,
  slots,
  selectedSlot,
  onCalendarMonthChange,
  onDateSelect,
  onSlotSelect,
  onNext,
}: Step2Props) {
  return (
    <div className="pb-24">
      <StepHeader stepLabel="ขั้นตอนที่ 2" title="เลือกวันเวลาที่สะดวก" />

      <div className="mx-4 rounded-3xl border border-tm-light bg-white p-4">
        <TherapistSummary therapist={therapist} />

        <div className="mt-4 border-b border-dashed border-tm-light pb-3">
          <span className="text-sm text-tm-navy">สถานที่</span>{" "}
          <span className="text-sm text-tm-orange">{therapist.clinic}</span>
        </div>

        <BookingCalendar
          calendarMonth={calendarMonth}
          availableDates={availableDates}
          selectedDate={selectedDate}
          onMonthChange={onCalendarMonthChange}
          onDateSelect={onDateSelect}
        />

        {selectedDate && (
          <div className="mt-4 border-t border-dashed border-tm-light pt-4">
            <p className="text-sm font-medium text-tm-navy">เลือกเวลา</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {slots.map((s) => {
                const isSelected = selectedSlot?.id === s.id;
                return (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-tm-navy"
                    onClick={() => onSlotSelect(s)}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-tm-orange bg-tm-orange"
                          : "border-tm-gray/30"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span>
                      {s.startTime} - {s.endTime} น.
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mx-4 mt-4 flex justify-end">
        <TmButton onClick={onNext} disabled={!selectedSlot}>
          {`>> ถัดไป`}
        </TmButton>
      </div>
    </div>
  );
}
