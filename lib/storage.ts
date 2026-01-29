// Local Storage Helper

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export class Storage {
  
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Save token
  static setToken(token: string): void {
    if (! this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  // Get token
  static getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Remove token
  static removeToken(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Save user
  static setUser(user: any): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  // Get user
  static getUser(): any | null {
    if (!this.isBrowser()) return null;
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  // Remove user
  static removeUser(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Clear all auth
  static clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }
}