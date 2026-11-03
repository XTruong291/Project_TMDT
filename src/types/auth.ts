export type UserRole = "admin" | "customer";

export type User = {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  user: User;
};

