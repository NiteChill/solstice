export type Role = 'USER' | 'ADMIN';

export interface UserResponse {
  id: string;
  displayName: string;
  username: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  user: UserResponse;
}

export interface SessionResponse {
  id: number;
  deviceName: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}
