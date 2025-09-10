// src/types/auth.ts

// ========================
// User / Auth Types
// ========================
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  isAdmin: boolean;
}

// Token payload we decode from JWT
export interface DecodedToken {
  _id: string;
  email: string;
  fullName?: string;
  profileImage?: string;
  isAdmin: boolean;
  iat: number; // issued at
  exp: number; // expiry
}

// ========================
// Auth Request Payloads
// ========================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isAdmin: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

// ========================
// Auth Response Shapes
// ========================
export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token: string;
}

export interface ApiError {
  message: string;
}
