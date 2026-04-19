export interface User {
  id: string;
  email: string;
  alias: string;
  bio: string | null;
  avatarColor: string | null;
  provider: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
}
