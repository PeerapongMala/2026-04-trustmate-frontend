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

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  alias: string;
}
