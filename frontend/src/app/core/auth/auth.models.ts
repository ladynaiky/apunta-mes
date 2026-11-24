export type UserRole = 'student' | 'parent' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterData {
  name: string;
  role: UserRole;
  email: string;
  password: string;
}
