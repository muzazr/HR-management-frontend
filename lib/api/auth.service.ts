import { AuthResponse, User } from '../../types/auth';
import { MockDatabase } from '../mock-db';
import { Storage } from '../storage';
import { apiClient, uploadClient, delay, USE_MOCK_API } from './client';

/**
 * AuthService
 * Ringkasan:
 * - Abstraksi operasi otentikasi (login, register, logout, current user).
 * - Mendukung mode mock (USE_MOCK_API) untuk pengembangan lokal.
 * - Semua method static agar dapat dipanggil tanpa instance.
 *
 * Catatan singkat:
 * - Method mock_* digunakan hanya saat USE_MOCK_API = true.
 * - return mengikuti tipe AuthResponse / struktur sederhana untuk konsistensi pemanggil.
 */
export class AuthService {

  // ==================== MOCK METHODS ====================

  /**
   * mockLogin
   * - Simulasi login via MockDatabase.
   * - Mengembalikan { success, data: { user, token }, message } atau error.
   */
  private static async mockLogin(username: string, password: string): Promise<AuthResponse> {
    await delay();
    try {
      const { user, token } = MockDatabase.login(username, password);
      return { success: true, data: { user, token }, message: 'Login successful' };
    } catch (error: any) {
      return { success: false, error: error.message, message: error.message };
    }
  }

  /**
   * mockRegister
   * - Simulasi registrasi user via MockDatabase.
   * - Menerima FormData dan mengembalikan user + token jika berhasil.
   */
  private static async mockRegister(formData: FormData): Promise<AuthResponse> {
    await delay(1200);
    try {
      const name = formData.get('name') as string;
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const photoFile = formData.get('photo') as File | null;

      let photoUrl = '/images/default-avatar.png';
      if (photoFile && photoFile.size > 0) {
        photoUrl = `/images/uploaded-${Date.now()}.png`;
      }

      const { user, token } = MockDatabase.register({ name, username, email, password, photo: photoUrl });
      return { success: true, data: { user, token }, message: 'Registration successful' };
    } catch (error: any) {
      return { success: false, error: error.message, message: error.message };
    }
  }

  /**
   * mockLogout
   * - Simulasi logout: clear session di mock DB/storage.
   */
  private static async mockLogout(): Promise<{ success: boolean; message: string }> {
    await delay(300);
    const token = Storage.getToken();
    if (token) MockDatabase.logout(token);
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * mockGetCurrentUser
   * - Ambil user saat ini dari MockDatabase berdasarkan token di Storage.
   */
  private static async mockGetCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    await delay(500);
    const token = Storage.getToken();
    if (!token) return { success: false, error: 'No auth token' };

    const user = MockDatabase.getCurrentUser(token);
    return user ? { success: true, data: user } : { success: false, error: 'Session expired' };
  }

  // ==================== PUBLIC API ====================

  /**
   * Login user
   * - Jika USE_MOCK_API true -> gunakan mockLogin.
   * - Jika non-mock -> kirim FormData ke endpoint /api/login.
   * - Tangani response non-ok dengan melempar Error .
   */
  static async login(username: string, password: string): Promise<AuthResponse> {
    console.log('AuthService.login', { username });

    if (USE_MOCK_API) {
      return this.mockLogin(username, password);
    }

    try {
      const formData = new FormData();
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');

      const url = '/api/login';
      
      console.log('Login Request:', {
        url,
        method: 'POST',
        username,
      });

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log('Login Response:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login Error:', errorData);
        
        const errorMessage = errorData.detail || 'Login failed. Please check your credentials.';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login Success:', data);

      return {
        success: true,
        data: {
          token: data.access_token,
          user: {
            id: '',
            name: data.full_name,
            username: data.username,
            email: '',
            photo: data.profile_picture,
            createdAt: new Date().toISOString(),
          },
        },
        message: 'Login successful',
      };
    } catch (error: any) {
      console.error('Login Error:', error);
      return { success: false, error: error.message, message: error.message };
    }
  }

  /**
   * Register new user
   * - Menerima FormData dari frontend, mengubah field sesuai kebutuhan API target.
   * - Menggunakan uploadClient untuk mengirim form multipart bila tersedia.
   * - Kembalikan AuthResponse berisi user info minimal.
   */
  static async register(formData: FormData): Promise<AuthResponse> {
    console.log('AuthService.register');

    if (USE_MOCK_API) {
      return this.mockRegister(formData);
    }

    try {
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.get('email') as string);
        formDataToSend.append('username', formData.get('username') as string);
        formDataToSend.append('full_name', formData.get('name') as string);
        formDataToSend.append('password', formData.get('password') as string);
        
        const photoFile = formData.get('photo') as File
        if(photoFile && photoFile.size > 0) {
            formDataToSend.append('file_foto', photoFile);
        }

        const data = await uploadClient<any>('/register', formDataToSend)
    
        return {
            success: true,
            data: {
                token: '',
                user: {
                    id: data.user_id.toString(),
                    name: formData.get('name') as string,
                    username: data.username,
                    email: formData.get('email') as string,
                    photo: data.profile_url,
                    createdAt: new Date().toISOString()
                }
            },
            message: data.message || "Registration Successful, please login."
        }
    } catch (error: any) {
        return {success: false, error: error.message, message: error.message}
    }
  }

  /**
   * Logout user (client-only)
   * - Membersihkan Storage lokal / localStorage.
   * - Tidak memanggil API; fungsi dirancang sebagai client-side cleanup.
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    console.log('AuthService.logout (client-only)');

    try {
      try {
        Storage.clearAuth();
      } catch (err) {
        console.warn('Storage.clearAuth failed:', err);
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        } catch {}
      }

      return { success: true, message: 'Logged out (client)' };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Logout failed' };
    }
  }

  /**
   * Get current authenticated user
   * - Jika USE_MOCK_API true -> mockGetCurrentUser.
   * - Jika non-mock -> gunakan apiClient untuk memanggil /auth/me dan kembalikan data.user.
   */
  static async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    console.log('AuthService.getCurrentUser');

    if (USE_MOCK_API) {
      return this.mockGetCurrentUser();
    }

    try {
      const data = await apiClient<any>('/auth/me', { method: 'GET' });
      return { success: true, data: data.user || data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}