import { MONTH_NAMES, WEEKDAY_LETTERS } from "../_constants";
import { formatDateStr, getCalendarDays, getTodayStr } from "../_helpers";

interface BookingCalendarProps {
  calendarMonth: Date;
  availableDates: string[];
  selectedDate: string;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: string) => void;
}

export function BookingCalendar({
  calendarMonth,
  availableDates,
  selectedDate,
  onMonthChange,
  onDateSelect,
}: BookingCalendarProps) {
  const calendarDays = getCalendarDays(calendarMonth);
  const todayStr = getTodayStr();

  function isDateAvailable(day: number): boolean {
    const dateStr = formatDateStr(calendarMonth, day);
    return availableDates.some((d) => d.slice(0, 10) === dateStr);
  }

  function goToPrevMonth() {
    onMonthChange(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    onMonthChange(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-tm-navy">เลือกวัน</p>
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          onClick={goToPrevMonth}
          className="text-tm-gray hover:text-tm-navy"
        >
          &lt;
        </button>
        <div className="rounded-2xl bg-tm-orange px-6 py-2 text-center text-white">
          <span className="font-bold">
            {String(calendarMonth.getMonth() + 1).padStart(2, "0")}
          </span>
          <span className="mx-4">{MONTH_NAMES[calendarMonth.getMonth()]}</span>
          <span className="font-bold">{calendarMonth.getFullYear()}</span>
        </div>
        <button
          onClick={goToNextMonth}
          className="text-tm-gray hover:text-tm-navy"
        >
          &gt;
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAY_LETTERS.map((d, i) => (
          <div key={i} className="py-1 font-medium text-tm-gray">
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = formatDateStr(calendarMonth, day);
          const available = isDateAvailable(day);
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;
          const isWeekend = i % 7 === 0 || i % 7 === 6;

          return (
            <button
              key={dateStr}
              disabled={!available}
              onClick={() => onDateSelect(dateStr)}
              className={`relative rounded-full py-1.5 text-xs transition-colors ${
                isSelected
                  ? "bg-tm-navy text-white font-bold"
                  : available
                    ? isToday
                      ? "bg-tm-orange/20 text-tm-navy font-bold"
                      : "text-tm-navy hover:bg-tm-light"
                    : "text-tm-gray/30"
              } ${isWeekend ? "text-tm-orange" : ""}`}
            >
              {day}
              {available && !isSelected && (
                <span className="absolute -top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-tm-orange" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
