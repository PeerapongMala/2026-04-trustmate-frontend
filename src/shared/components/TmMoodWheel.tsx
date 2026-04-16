"use client";

import { useState } from "react";

// ตาม design 7.png — 8 ช่อง ตามเข็มนาฬิกาจากบนสุด
const MOODS = [
  { name: "ลั๊ลลา", color: "#FFD700", dark: false },       // เหลือง
  { name: "ประหลาดใจ", color: "#FF8C00", dark: false },     // ส้ม
  { name: "ว้าวุ่น", color: "#E53935", dark: true },        // แดง
  { name: "วิตกกลัว", color: "#F48FB1", dark: false },      // ชมพู
  { name: "ฉุนเฉียว", color: "#9C27B0", dark: true },       // ม่วง
  { name: "ขยะแขยง", color: "#1565C0", dark: true },        // น้ำเงิน
  { name: "เศร้าซึม", color: "#42A5F5", dark: false },      // ฟ้า
  { name: "เบื่อหน่าย", color: "#4CAF50", dark: false },    // เขียว
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
                className="pointer-events-none font-medium"
                fill={mood.dark ? "#FFFFFF" : "#31356E"}
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
