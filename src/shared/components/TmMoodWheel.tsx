"use client";

import { useState } from "react";

// ตาม design 7.png — 8 ช่อง ตามเข็มนาฬิกาจากบนสุด
const MOODS = [
  { name: "เบื่อหน่าย", color: "#C5E1A5" },  // เขียวเหลืองอ่อน
  { name: "สับสน", color: "#FFD54F" },         // เหลือง
  { name: "ประหลาดใจ", color: "#FFB74D" },     // ส้มอ่อน
  { name: "กลัว", color: "#FF8A65" },          // ส้ม
  { name: "กังวล", color: "#F48FB1" },         // ชมพู
  { name: "อาย", color: "#CE93D8" },           // ม่วงอ่อน
  { name: "เศร้าซึม", color: "#81D4FA" },      // ฟ้า
  { name: "เปล่าเปลี่ยว", color: "#80CBC4" },  // เขียวน้ำเงิน (teal)
] as const;

export type MoodName = (typeof MOODS)[number]["name"];

interface TmMoodWheelProps {
  onSelect: (mood: string) => void;
  selected?: string;
}

export function TmMoodWheel({ onSelect, selected }: TmMoodWheelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const segmentAngle = 360 / MOODS.length;

  return (
    <div className="relative mx-auto w-72 h-72">
      {/* Outer ring border */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
        {/* Background circle border */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#E0E0E0" strokeWidth="1" />

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

          const midAngle = (((startAngle + endAngle) / 2) * Math.PI) / 180;
          const labelX = 100 + 62 * Math.cos(midAngle);
          const labelY = 100 + 62 * Math.sin(midAngle);

          const isSelected = selected === mood.name;
          const isHovered = hoveredIndex === i;

          return (
            <g key={mood.name}>
              <path
                d={`M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={mood.color}
                opacity={isSelected || isHovered ? 1 : 0.75}
                stroke="white"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelect(mood.name)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={isSelected ? { filter: "brightness(1.1)", strokeWidth: 3 } : undefined}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none font-medium fill-tm-navy"
                style={{ fontSize: "7px" }}
              >
                {mood.name}
              </text>
            </g>
          );
        })}

        {/* Center white dot (indicator) */}
        <circle cx="100" cy="100" r="10" fill="white" />
        <circle cx="100" cy="100" r="4" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      </svg>
    </div>
  );
}
