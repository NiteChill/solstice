export type Role = 'USER' | 'ADMIN';

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
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
