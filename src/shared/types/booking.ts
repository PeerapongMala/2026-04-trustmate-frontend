export interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  location: string;
  clinic: string;
  pricePerSlot: number;
  avgRating: number;
  reviewCount: number;
  avatarUrl: string | null;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}
