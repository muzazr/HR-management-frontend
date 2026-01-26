// API Service
import { AuthResponse, User } from '../types/auth';
import { MockDatabase } from './mock-db';
import { Storage } from './storage';
import { Job, JobResponse, JobsResponse, CreateJobRequest } from '../types/job';
import { Applicant, UploadCVsResponse, ApplicantResponse, ApplicantsResponse, UpdateCVResponse } from './../types/applicant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export class ApiService {
  
  // Simulate delay
  private static async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock Login
  private static async mockLogin(username: string, password: string): Promise<AuthResponse> {
    await this.delay();

    try {
      const { user, token } = MockDatabase.login(username, password);
      
      return {
        success: true,
        data: { user, token },
        message: 'Login successful',
      };
    } catch (error:  any) {
      return {
        success: false,
        error: error.message,
        message: error.message,
      };
    }
  }

  // Mock Register
  private static async mockRegister(formData: FormData): Promise<AuthResponse> {
    await this. delay(1200);

    try {
      const name = formData.get('name') as string;
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData. get('password') as string;
      const photoFile = formData.get('photo') as File | null;

      // Simulate photo upload
      let photoUrl = '/images/default-avatar.png';
      if (photoFile && photoFile.size > 0) {
        photoUrl = `/images/uploaded-${Date.now()}.png`;
      }

      const { user, token } = MockDatabase.register({
        name,
        username,
        email,
        password,
        photo: photoUrl,
      });

      return {
        success: true,
        data: { user, token },
        message: 'Registration successful',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: error.message,
      };
    }
  }

  // Mock Logout
  private static async mockLogout(token: string): Promise<{ success: boolean; message: string }> {
    await this.delay(300);
    MockDatabase.logout(token);
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  // Mock Get Current User
  private static async mockGetCurrentUser(token: string): Promise<{ success: boolean; data?: User; error?: string }> {
    await this.delay(500);
    const user = MockDatabase.getCurrentUser(token);
    
    if (!user) {
      return {
        success: false,
        error: 'Session expired or invalid',
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  // PUBLIC API - Login
  static async login(username:  string, password: string): Promise<AuthResponse> {

    if (USE_MOCK_API) {
      return this. mockLogin(username, password);
    }

    // Real API call (when backend ready)
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    return response.json();
  }

  // PUBLIC API - Register
  static async register(formData: FormData): Promise<AuthResponse> {
    console.log('📝 API: Register request');

    if (USE_MOCK_API) {
      console.log('🎭 Using Mock API');
      return this.mockRegister(formData);
    }

    // Real API call (when backend ready)
    const token = Storage.getToken();
    const headers:  HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  // PUBLIC API - Logout
  static async logout(): Promise<{ success: boolean; message: string }> {
    console.log('👋 API: Logout request');
    
    const token = Storage. getToken();
    if (!token) {
      return { success: false, message: 'No active session' };
    }

    if (USE_MOCK_API) {
      console.log('🎭 Using Mock API');
      return this.mockLogout(token);
    }

    // Real API call (when backend ready)
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers:  {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // PUBLIC API - Get Current User
  static async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    console.log('👤 API: Get current user');
    
    const token = Storage.getToken();
    if (!token) {
      return { success: false, error: 'No auth token' };
    }

    if (USE_MOCK_API) {
      console.log('🎭 Using Mock API');
      return this. mockGetCurrentUser(token);
    }

    // Real API call (when backend ready)
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }


    // ==================== JOB API METHODS ====================

  // Get All Jobs
  static async getAllJobs(): Promise<JobsResponse> {
    console.log('📋 API:  Get all jobs');

    if (USE_MOCK_API) {
      await this.delay(600);
      const jobs = MockDatabase.getAllJobs();
      return {
        success: true,
        data: jobs,
      };
    }

    // Real API call (when backend ready)
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // Get Job by ID
  static async getJobById(jobId: string): Promise<JobResponse> {
    console.log('📄 API: Get job by ID:', jobId);

    if (USE_MOCK_API) {
      await this.delay(400);
      const job = MockDatabase.getJobById(jobId);
      
      if (! job) {
        return {
          success: false,
          error: 'Job not found',
        };
      }

      return {
        success: true,
        data: job,
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // Create Job
  static async createJob(jobData: CreateJobRequest): Promise<JobResponse> {
    console. log('➕ API: Create job:', jobData);

    if (USE_MOCK_API) {
      await this.delay(800);
      
      try {
        const job = MockDatabase.createJob(jobData);
        return {
          success: true,
          data:  job,
          message: 'Job created successfully',
        };
      } catch (error:  any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    return response.json();
  }

  // Update Job
  static async updateJob(jobId: string, updates: Partial<Job>): Promise<JobResponse> {
    console.log('✏️ API: Update job:', jobId, updates);

    if (USE_MOCK_API) {
      await this.delay(600);
      
      const job = MockDatabase.updateJob(jobId, updates);
      
      if (!job) {
        return {
          success: false,
          error: 'Job not found',
        };
      }

      return {
        success:  true,
        data: job,
        message: 'Job updated successfully',
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    return response.json();
  }

  // Delete Job
  static async deleteJob(jobId:  string): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('🗑️ API: Delete job:', jobId);

    if (USE_MOCK_API) {
      await this.delay(400);
      
      const deleted = MockDatabase.deleteJob(jobId);
      
      if (! deleted) {
        return {
          success: false,
          error: 'Job not found',
        };
      }

      return {
        success: true,
        message: 'Job deleted successfully',
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response. json();
  }

  // Toggle Job Status
  static async toggleJobStatus(jobId: string): Promise<JobResponse> {
    console.log('🔄 API: Toggle job status:', jobId);

    if (USE_MOCK_API) {
      await this.delay(500);
      
      const job = MockDatabase.toggleJobStatus(jobId);
      
      if (! job) {
        return {
          success: false,
          error: 'Job not found',
        };
      }

      return {
        success: true,
        data: job,
        message: `Job ${job.status === true ? 'opened' : 'closed'} successfully`,
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // Get Job Stats
  static async getJobStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('📊 API: Get job stats');

    if (USE_MOCK_API) {
      await this.delay(400);
      const stats = MockDatabase.getJobStats();
      return {
        success: true,
        data: stats,
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

    // ==================== APPLICANT API ====================

  // Get applicants by job ID
  static async getApplicantsByJobId(jobId: string): Promise<ApplicantsResponse> {
    console.log('📋 API: Get applicants for job:', jobId);

    if (USE_MOCK_API) {
      await this.delay(600);
      const applicants = MockDatabase.getApplicantsByJobId(jobId);
      return {
        success: true,
        data: applicants,
      };
    }

    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applicants`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    return response.json();
  }

  // Upload and process CVs
  static async uploadCVs(jobId: string, cvFiles: File[]): Promise<UploadCVsResponse> {
    console.log(`📤 API: Upload ${cvFiles.length} CVs for job: `, jobId);

    if (USE_MOCK_API) {
      try {
        const newApplicants = await MockDatabase. processCVs(jobId, cvFiles);
        return {
          success: true,
          data: newApplicants,
          message: `Successfully processed ${cvFiles.length} CV(s)`,
        };
      } catch (error:  any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    // Real API call
    const token = Storage.getToken();
    const formData = new FormData();
    cvFiles.forEach(file => {
      formData. append('cvs', file);
    });

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/upload-cvs`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    return response.json();
  }

  // Update applicant CV
  static async updateApplicantCV(applicantId:  string, cvFile: File): Promise<UpdateCVResponse> {
    console.log('🔄 API: Update CV for applicant:', applicantId);

    if (USE_MOCK_API) {
      try {
        const updatedApplicant = await MockDatabase.updateApplicantCV(applicantId, cvFile);
        
        if (! updatedApplicant) {
          return {
            success: false,
            error: 'Applicant not found',
          };
        }

        return {
          success: true,
          data: updatedApplicant,
          message: 'CV updated and reprocessed successfully',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    // Real API call
    const token = Storage.getToken();
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}/update-cv`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    return response.json();
  }

  // Delete applicant
  static async deleteApplicant(applicantId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('🗑️ API: Delete applicant:', applicantId);

    if (USE_MOCK_API) {
      await this.delay(400);
      
      const deleted = MockDatabase.deleteApplicant(applicantId);
      
      if (! deleted) {
        return {
          success: false,
          error: 'Applicant not found',
        };
      }

      return {
        success: true,
        message: 'Applicant deleted successfully',
      };
    }

    // Real API call
    const token = Storage. getToken();
    const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    return response.json();
  }

  // Get applicant by ID
  static async getApplicantById(applicantId: string): Promise<ApplicantResponse> {

    if (USE_MOCK_API) {
      await this.delay(400);
      const applicant = MockDatabase.getApplicantById(applicantId);
      
      if (!applicant) {
        return {
          success: false,
          error: 'Applicant not found',
        };
      }

      return {
        success: true,
        data: applicant,
      };
    }

    // Real API call
    const token = Storage.getToken();
    const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    return response.json();
  }

}