"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TmLogo, TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";

interface Question {
  id: string;
  text: string;
  order: number;
}

interface AssessmentResult {
  type: string;
  totalScore: number;
  maxScore: number;
  level: string;
  recommendation: string;
}

// PSS-10: 0-4 per item
const STRESS_EMOJIS = [
  { label: "น้อยที่สุด", emoji: "😌", value: 0 },
  { label: "น้อย", emoji: "🙂", value: 1 },
  { label: "ปานกลาง", emoji: "😐", value: 2 },
  { label: "มาก", emoji: "😟", value: 3 },
  { label: "มากที่สุด", emoji: "😞", value: 4 },
];

// PHQ-9: 0-3 per item
const PHQ9_EMOJIS = [
  { label: "ไม่เลย", emoji: "😊", value: 0 },
  { label: "เป็นบางวัน", emoji: "🙂", value: 1 },
  { label: "บ่อยครั้ง", emoji: "😟", value: 2 },
  { label: "เกือบทุกวัน", emoji: "😞", value: 3 },
];

type Step = "choose" | "intro" | "questions" | "result";
type AssessmentType = "stress" | "depression";

export default function AssessmentPage() {
  const router = useRouter();
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("stress");
  const [step, setStep] = useState<Step>("choose");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== "questions" && step !== "intro") return;
    async function load() {
      const { data } = await api.get<Question[]>(
        `/assessment/questions?type=${assessmentType}`
      );
      if (data) setQuestions(data);
    }
    load();
  }, [assessmentType, step]);

  function handleScore(score: number) {
    const q = questions[currentQ];
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
  }

  async function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      setLoading(true);
      const payload = questions.map((q) => ({
        questionId: q.id,
        score: answers[q.id] ?? 0,
      }));

      const { data } = await api.post<AssessmentResult>(
        `/assessment/submit?type=${assessmentType}`,
        { answers: payload }
      );

      if (data) setResult(data);
      setStep("result");
      setLoading(false);
    }
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ((prev) => prev - 1);
  }

  function startAssessment(type: AssessmentType) {
    setAssessmentType(type);
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setStep("intro");
  }

  const emojis = assessmentType === "depression" ? PHQ9_EMOJIS : STRESS_EMOJIS;

  // Choose type
  if (step === "choose") {
    return (
      <div className="px-4 pt-4">
        <header className="flex items-center justify-center py-2">
          <TmLogo size="sm" />
        </header>
        <h1 className="mt-6 text-center text-xl font-bold text-tm-navy">
          เลือกแบบประเมิน
        </h1>
        <div className="mt-6 flex flex-col gap-4">
          <TmCard
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <button onClick={() => startAssessment("stress")} className="w-full text-left">
              <p className="text-lg font-bold text-tm-navy">แบบประเมินความเครียด</p>
              <p className="mt-1 text-sm text-tm-gray">PSS-10 — 10 ข้อ</p>
              <p className="mt-1 text-xs text-tm-orange">ลองนึกถึงช่วง 1 เดือนที่ผ่านมา</p>
            </button>
          </TmCard>
          <TmCard
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <button onClick={() => startAssessment("depression")} className="w-full text-left">
              <p className="text-lg font-bold text-tm-navy">แบบประเมินภาวะซึมเศร้า</p>
              <p className="mt-1 text-sm text-tm-gray">PHQ-9 — 9 ข้อ</p>
              <p className="mt-1 text-xs text-tm-orange">ประเมินอาการในช่วง 2 สัปดาห์ที่ผ่านมา</p>
            </button>
          </TmCard>
        </div>
      </div>
    );
  }

  // Intro
  if (step === "intro") {
    const introText =
      assessmentType === "depression"
        ? "เห็นช่วงนี้คุณดูเหนื่อย ๆ นะ… มีอะไรที่ทำให้คุณรู้สึกเศร้าหรือไม่สบายใจอยู่บ้างไหม ลองค่อย ๆ มาทบทวนไปพร้อมกันนะ"
        : "ช่วงนี้คุณมีเรื่องที่กังวลใจอยู่ไหม\n\nเราอยากให้คุณลองนึกถึงช่วง 1 เดือนที่ผ่านมา\n\nเหมือนคุณกำลังย้อนดูเรื่องราวในชีวิตของตัวเอง...";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <TmLogo size="lg" className="mb-8" />
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <p className="whitespace-pre-line text-lg leading-relaxed text-tm-gray">
            {introText}
          </p>
          <div className="mt-8 flex justify-end">
            <TmButton onClick={() => setStep("questions")}>{`>> ถัดไป`}</TmButton>
          </div>
        </div>
      </div>
    );
  }

  // Result
  if (step === "result" && result) {
    const levelEmoji =
      result.level.includes("น้อย") || result.level === "ต่ำ"
        ? "😊"
        : result.level === "ปานกลาง" || result.level.includes("เล็กน้อย")
          ? "😐"
          : result.level.includes("รุนแรงสูง")
            ? "😞"
            : "😟";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <TmLogo size="lg" className="mb-8" />
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm text-center">
          <div className="text-6xl">{levelEmoji}</div>
          <p className="mt-4 text-sm text-tm-gray">
            {assessmentType === "depression" ? "แบบประเมินซึมเศร้า PHQ-9" : "แบบประเมินความเครียด PSS-10"}
          </p>
          <p className="mt-2 text-tm-gray">
            คะแนนรวม:{" "}
            <span className="font-bold text-tm-orange">
              {result.totalScore} / {result.maxScore} คะแนน
            </span>
          </p>
          <p className="mt-2 text-tm-gray">
            ผลการทดสอบ:{" "}
            <span className="font-bold text-tm-orange">{result.level}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-tm-orange">
            {result.recommendation}
          </p>

          {result.totalScore > (assessmentType === "depression" ? 14 : 26) && (
            <div className="mt-4 rounded-2xl bg-red-50 p-3">
              <p className="text-sm font-medium text-red-600">
                สายด่วนสุขภาพจิต{" "}
                <a href="tel:1323" className="font-bold underline">
                  1323
                </a>{" "}
                (24 ชั่วโมง)
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <TmButton variant="outline" onClick={() => setStep("choose")}>
              ทำแบบอื่น
            </TmButton>
            <TmButton onClick={() => router.push("/care")}>ปิด</TmButton>
          </div>
        </div>
      </div>
    );
  }

  // Questions
  const q = questions[currentQ];
  const currentScore = q ? answers[q.id] : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <TmLogo size="lg" className="mb-8" />
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm">
        {q ? (
          <>
            <p className="text-center text-sm text-tm-gray">
              ข้อ {currentQ + 1} / {questions.length}
            </p>
            <p className="mt-4 text-center text-lg font-medium leading-relaxed text-tm-navy">
              {q.text}
            </p>

            <div className="mt-8 flex justify-center gap-3">
              {emojis.map((e) => {
                const isSelected = currentScore === e.value;
                return (
                  <button
                    key={e.value}
                    onClick={() => handleScore(e.value)}
                    className={`flex flex-col items-center gap-1 transition-transform ${
                      isSelected ? "scale-125" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <span className="text-[10px] text-tm-gray">{e.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <TmButton
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={currentQ === 0}
              >
                {`<< ย้อนกลับ`}
              </TmButton>
              <TmButton
                size="sm"
                onClick={handleNext}
                disabled={currentScore === undefined || loading}
              >
                {currentQ === questions.length - 1
                  ? loading
                    ? "กำลังประมวลผล..."
                    : "ดูผลลัพธ์"
                  : `ถัดไป >>`}
              </TmButton>
            </div>
          </>
        ) : (
          <p className="text-center text-tm-gray">กำลังโหลดคำถาม...</p>
        )}
      </div>
    </div>
  );
}
