import { TmCard } from "@/shared/components";
import { MOOD_LIST } from "../_constants";
import type { MoodDay } from "../_types";

interface MoodLineGraphProps {
  data: MoodDay[];
  onSeeMore: () => void;
}

const X_START = 65;
const X_END = 330;
const Y_START = 20;
const ROW_HEIGHT = 19;

export function MoodLineGraph({ data, onSeeMore }: MoodLineGraphProps) {
  const hasData = data.some((d) => d.mood);
  const xStep = (X_END - X_START) / 6;

  const points = data.flatMap((d, i) => {
    if (!d.mood) return [];
    const moodIdx = MOOD_LIST.findIndex((m) => m.name === d.mood);
    if (moodIdx < 0) return [];
    return [
      {
        x: X_START + i * xStep,
        y: Y_START + moodIdx * ROW_HEIGHT,
        color: MOOD_LIST[moodIdx].color,
      },
    ];
  });

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-tm-navy">
          กราฟอารมณ์ของฉัน — ในช่วง 7 วันที่ผ่านมา
        </h2>
        <button
          onClick={onSeeMore}
          className="text-xs font-medium text-tm-orange hover:underline"
        >
          ดูเพิ่มเติม
        </button>
      </div>
      <TmCard>
        <div className="w-full overflow-x-auto">
          {hasData ? (
            <svg viewBox="0 0 340 180" className="w-full" style={{ minWidth: 300 }}>
              {MOOD_LIST.map((m, i) => (
                <text
                  key={m.name}
                  x="2"
                  y={Y_START + i * ROW_HEIGHT}
                  className="text-[7px]"
                  fill={m.color}
                  dominantBaseline="middle"
                >
                  {m.name}
                </text>
              ))}

              {MOOD_LIST.map((_, i) => (
                <line
                  key={i}
                  x1={X_START}
                  y1={Y_START + i * ROW_HEIGHT}
                  x2={X_END}
                  y2={Y_START + i * ROW_HEIGHT}
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                />
              ))}

              {points.length > 1 && (
                <polyline
                  points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#E47B18"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={p.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}

              {data.map((d, i) => (
                <text
                  key={i}
                  x={X_START + i * xStep}
                  y={175}
                  textAnchor="middle"
                  className="text-[7px]"
                  fill="#494F56"
                >
                  {d.day}
                </text>
              ))}
            </svg>
          ) : (
            <p className="py-6 text-center text-xs text-tm-gray/50">
              ยังไม่มีข้อมูลอารมณ์
            </p>
          )}
        </div>
      </TmCard>
    </div>
  );
}
