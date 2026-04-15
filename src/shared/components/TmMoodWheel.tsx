"use client";

import { useState } from "react";

const MOODS = [
  { name: "เบื่อหน่าย", color: "#A8D5BA" },
  { name: "สับสน", color: "#F7DC6F" },
  { name: "ประหลาดใจ", color: "#F5B041" },
  { name: "กลัว", color: "#E67E22" },
  { name: "กังวล", color: "#EC7063" },
  { name: "อาย", color: "#C39BD3" },
  { name: "เศร้าซึม", color: "#85C1E9" },
  { name: "เปล่าเปลี่ยว", color: "#76D7C4" },
] as const;

interface TmMoodWheelProps {
  onSelect: (mood: string) => void;
  selected?: string;
}

export function TmMoodWheel({ onSelect, selected }: TmMoodWheelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const segmentAngle = 360 / MOODS.length;

  return (
    <div className="relative mx-auto w-64 h-64">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {MOODS.map((mood, i) => {
          const startAngle = i * segmentAngle - 90;
          const endAngle = startAngle + segmentAngle;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 100 + 90 * Math.cos(startRad);
          const y1 = 100 + 90 * Math.sin(startRad);
          const x2 = 100 + 90 * Math.cos(endRad);
          const y2 = 100 + 90 * Math.sin(endRad);

          const largeArc = segmentAngle > 180 ? 1 : 0;

          const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
          const labelX = 100 + 60 * Math.cos(midAngle);
          const labelY = 100 + 60 * Math.sin(midAngle);

          const isSelected = selected === mood.name;
          const isHovered = hoveredIndex === i;

          return (
            <g key={mood.name}>
              <path
                d={`M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={mood.color}
                opacity={isSelected || isHovered ? 1 : 0.7}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-opacity"
                onClick={() => onSelect(mood.name)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none text-[8px] font-medium fill-tm-navy"
              >
                {mood.name}
              </text>
            </g>
          );
        })}
        {/* Center dot */}
        <circle cx="100" cy="100" r="8" fill="white" />
      </svg>
    </div>
  );
}
