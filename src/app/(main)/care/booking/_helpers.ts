export function getCalendarDays(monthDate: Date): (number | null)[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export function formatDateStr(monthDate: Date, day: number): string {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getTodayStr(): string {
  const today = new Date();
  return formatDateStr(today, today.getDate());
}
