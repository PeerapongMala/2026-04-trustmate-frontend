export interface Post {
  id: string;
  content: string;
  tag: string;
  visibility: string;
  hugCount: number;
  isHugged: boolean;
  createdAt: string;
  author: {
    alias: string;
    avatarColor: string | null;
  };
}

export interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const TAGS = [
  "#เศร้า",
  "#สุขใจ",
  "#หวาดกลัว",
  "#หงุดหงิด",
  "#ประหลาดใจ",
  "#ตื่นเต้น",
  "#โกรธ",
  "#อื่นๆ",
] as const;
