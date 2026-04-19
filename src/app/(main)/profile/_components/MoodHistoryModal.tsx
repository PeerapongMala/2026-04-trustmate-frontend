import { TmModal } from "@/shared/components";
import { MOOD_LIST } from "../_constants";
import type { MoodEntry } from "../_types";

interface MoodHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moods: MoodEntry[];
}

const CENTER = 100;
const RADIUS = 85;
const LABEL_RADIUS = 55;

interface PieSegment {
  name: string;
  color: string;
  path: string;
  label: { x: number; y: number; show: boolean };
}

function buildPieSegments(moods: MoodEntry[]): PieSegment[] {
  const counts: Record<string, number> = {};
  moods.forEach((m) => {
    counts[m.mood] = (counts[m.mood] || 0) + 1;
  });
  const total = moods.length;
  if (total === 0) return [];

  const segments: PieSegment[] = [];
  let currentAngle = -90;

  MOOD_LIST.forEach((mood) => {
    const count = counts[mood.name] || 0;
    if (count === 0) return;
    const sliceAngle = (count / total) * 360;
    const startRad = (currentAngle * Math.PI) / 180;
    const endRad = ((currentAngle + sliceAngle) * Math.PI) / 180;
    const x1 = CENTER + RADIUS * Math.cos(startRad);
    const y1 = CENTER + RADIUS * Math.sin(startRad);
    const x2 = CENTER + RADIUS * Math.cos(endRad);
    const y2 = CENTER + RADIUS * Math.sin(endRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;

    const midAngle = ((currentAngle + sliceAngle / 2) * Math.PI) / 180;

    segments.push({
      name: mood.name,
      color: mood.color,
      path: `M${CENTER},${CENTER} L${x1},${y1} A${RADIUS},${RADIUS} 0 ${largeArc},1 ${x2},${y2} Z`,
      label: {
        x: CENTER + LABEL_RADIUS * Math.cos(midAngle),
        y: CENTER + LABEL_RADIUS * Math.sin(midAngle),
        show: sliceAngle > 20,
      },
    });

    currentAngle += sliceAngle;
  });

  return segments;
}

export function MoodHistoryModal({ isOpen, onClose, moods }: MoodHistoryModalProps) {
  const segments = buildPieSegments(moods);
  const latest = moods[0];

  return (
    <TmModal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto">
        <h2 className="mb-4 text-center text-lg font-bold text-tm-navy">
          ประวัติวงล้ออารมณ์
        </h2>

        {moods.length > 0 ? (
          <>
            <div className="mx-auto w-56 h-56">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {segments.map((s) => (
                  <g key={s.name}>
                    <path
                      d={s.path}
                      fill={s.color}
                      opacity={0.85}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {s.label.show && (
                      <text
                        x={s.label.x}
                        y={s.label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        style={{ fontSize: "8px", fontWeight: "bold" }}
                      >
                        {s.name}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {latest && (
              <div className="mt-4 border-t border-tm-light pt-3">
                <p className="text-sm">
                  <span className="font-bold text-tm-navy">TODAY&apos;S MOOD : </span>
                  <span className="font-bold text-tm-orange">{latest.mood}</span>
                </p>
                {latest.note && (
                  <p className="text-xs text-tm-gray">NOTE: {latest.note}</p>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-tm-light pt-3">
              <div className="space-y-1.5">
                {moods.map((m) => (
                  <p key={m.id} className="text-xs text-tm-gray">
                    <span className="text-tm-navy">
                      {new Date(m.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                    {" : "}
                    <span
                      className="font-medium"
                      style={{
                        color:
                          MOOD_LIST.find((ml) => ml.name === m.mood)?.color ||
                          "#494F56",
                      }}
                    >
                      {m.mood}
                    </span>
                    {m.note && <span>, {m.note}</span>}
                  </p>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-tm-gray/50">
            ยังไม่มีข้อมูลอารมณ์
          </p>
        )}
      </div>
    </TmModal>
  );
}
