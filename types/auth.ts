export interface User {
  id:  string;
  name: string;
  username: string;
  email: string;
  photo?:  string;
  createdAt:  string;
  lastLogin?:  string;
}

export interface MockUser extends User {
  password: string; // Only for mock database
}

export interface LoginRequest {
  username: string; // bisa username atau email
  password: string;
}

export interface RegisterRequest {
  photo?:  File | null;
  name: string;
  username: string;
  email:  string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}