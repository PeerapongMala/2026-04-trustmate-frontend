export interface TodayCardItem {
  id: string;
  answer: string;
  createdAt: string;
  question: { question: string; date: string };
}

export interface MoodEntry {
  id: string;
  mood: string;
  note?: string;
  createdAt: string;
}

export interface MoodDay {
  day: string;
  mood: string | null;
}
