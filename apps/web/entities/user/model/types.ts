export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
  token: string;
}
