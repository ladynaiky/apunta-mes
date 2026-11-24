import type { PersonRole } from '../../shared/utils/roles';

export type UserRole = PersonRole;

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
