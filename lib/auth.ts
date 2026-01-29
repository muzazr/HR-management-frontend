// Auth Helper
import { User } from '../types/auth';
import { Storage } from './storage';

export class AuthHelper {
  
  // Save auth data
  static saveAuth(token: string, user: User): void {
    Storage.setToken(token);
    Storage.setUser(user);
  }

  // Get token
  static getToken(): string | null {
    return Storage.getToken();
  }

  // Get user
  static getUser(): User | null {
    return Storage.getUser();
  }

  // Check if authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Clear auth
  static clearAuth(): void {
    Storage.clearAuth();
  }

  // Logout
  static logout(): void {
    this.clearAuth();
  }
}