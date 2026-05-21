export type Role = 'USER' | 'ADMIN';

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  profilePicture?: string;
  bio?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  user: UserResponse;
}

export interface SessionResponse {
  id: number;
  device: string;
  os: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}
