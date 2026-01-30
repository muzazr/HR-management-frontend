import { Job, JobResponse, JobsResponse, CreateJobRequest } from '../../types/job';
import { MockDatabase } from '../mock-db';
import { apiClient, delay, USE_MOCK_API } from './client';

export class JobService {

  /**
   * getAll
   * - Ambil semua job.
   * - Jika mode mock aktif: delegasi ke MockDatabase (simulasi latency).
   * - Mapping response API ke tipe internal Job.
   */
  static async getAll(): Promise<JobsResponse> {
    console.log('JobService.getAll');

    if (USE_MOCK_API) {
      await delay(600);
      const jobs = MockDatabase.getAllJobs();
      return { success: true, data: jobs };
    }

    try {
      const data = await apiClient<any[]>('/jobs', { method: 'GET' });

      const jobs: Job[] = data.map((job: any) => ({
        id: job.id.toString(),
        title: job.title,
        location: job.location,
        min_education: job.min_education,
        skills: job.skills,
        deadline: job.deadline,
        is_open: job.is_open !== undefined ? job.is_open : true,
        postedDate: new Date().toISOString(),
        applicants: job.applicant_count,
      }));

      return { success: true, data: jobs };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * getById
   * - Ambil job berdasarkan id.
   * - Pada implementasi non-mock: mengambil seluruh list lalu mencari id (simple cache-less lookup).
   */
  static async getById(jobId: string): Promise<JobResponse> {
    console.log('JobService.getById:', jobId);

    if (USE_MOCK_API) {
      await delay(400);
      const job = MockDatabase.getJobById(jobId);
      if (!job) return { success: false, error: 'Job not found' };
      return { success: true, data: job };
    }

    try {
      console.log('Fetching all jobs to find job by ID')

      const response = await this.getAll()

      if(!response.success || !response.data) {
        return {success: false, error: response.error || 'Failed to fetch jobs'}
      }

      const job = response.data.find(j => j.id === jobId)

      if(!job) {
        console.error('Job not found')
        return {success: false, error: 'Job not found'}
      }

      console.log('Found job: ', job.title)
      return {success: true, data: job}
    } catch (error: any) {
      console.error('getById error: ', error)
      return {success: false, error: error.message}
    }
  }

  /**
   * create
   * - Buat job baru lewat API atau MockDatabase.
   * - Mapping payload input ke DTO yang dibutuhkan API.
   */
  static async create(jobData: CreateJobRequest): Promise<JobResponse> {
    console.log('JobService.create');

    if (USE_MOCK_API) {
      await delay(800);
      try {
        const job = MockDatabase.createJob(jobData);
        return { success: true, data: job, message: 'Job created successfully' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    try {
      const data = await apiClient<any>('/jobs/add', {
        method: 'POST',
        body: JSON.stringify({
          title: jobData.title,
          location: jobData.location,
          min_education: jobData.min_education,
          deadline: jobData.deadline,
          is_open: true,
          skills: jobData.skills,
        }),
      });

      const job: Job = {
        id: data.id.toString(),
        title: data.title,
        location: data.location,
        min_education: data.min_education,
        skills: data.skills,
        deadline: data.deadline,
        is_open: data.is_open,
        postedDate: new Date().toISOString(),
        applicants: 0,
      };

      return { success: true, data: job, message: 'Job created successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * update
   * - Update job via API atau MockDatabase.
   * - Mengembalikan job yang telah diperbarui.
   */
  static async update(jobId: string, updates: Partial<Job>): Promise<JobResponse> {
    console.log('JobService.update:', jobId);

    if (USE_MOCK_API) {
      await delay(600);
      const job = MockDatabase.updateJob(jobId, updates);
      if (!job) return { success: false, error: 'Job not found' };
      return { success: true, data: job, message: 'Job updated successfully' };
    }

    try {
      const data = await apiClient<any>(`/jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: updates.title,
          location: updates.location,
          min_education: updates.min_education,
          deadline: updates.deadline,
          is_open: updates.is_open,
          skills: updates.skills,
        }),
      });

      const job: Job = {
        id: data.id.toString(),
        title: data.title,
        location: data.location,
        min_education: data.min_education,
        skills: data.skills,
        deadline: data.deadline,
        is_open: data.is_open,
        postedDate: data.created_at || new Date().toISOString(),
        applicants: data.applicants_count || 0,
      };

      return { success: true, data: job, message: 'Job updated successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * delete
   * - Hapus job lewat API atau MockDatabase.
   * - Mengembalikan status operasi.
   */
  static async delete(jobId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('JobService.delete:', jobId);

    if (USE_MOCK_API) {
      await delay(400);
      const deleted = MockDatabase.deleteJob(jobId);
      if (!deleted) return { success: false, error: 'Job not found' };
      return { success: true, message: 'Job deleted successfully' };
    }

    try {
      await apiClient(`/jobs/${jobId}`, { method: 'DELETE' });
      return { success: true, message: 'Job deleted successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * toggleStatus
   * - Toggle open/closed status job.
   * - Implementasi non-mock: ambil job saat ini, ubah is_open dan update.
   */
  static async toggleStatus(jobId: string): Promise<JobResponse> {
    console.log('JobService.toggleStatus:', jobId);

    if (USE_MOCK_API) {
      await delay(500);
      const job = MockDatabase.getJobById(jobId);
      if (!job) return { success: false, error: 'Job not found' };
      return { 
        success: true, 
        data: job, 
        message: `Job ${job.is_open ? 'opened' : 'closed'} successfully` 
      };
    }

    try {
      
      // Get current job first
      const currentJob = await this.getById(jobId);
      if (!currentJob.success || !currentJob.data) {
        return { success: false, error: 'Job not found' };
      }

      // Toggle status
      const updatedJob = await this.update(jobId, {
        ...currentJob.data,
        is_open: !currentJob.data.is_open,
      });

      return updatedJob;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * getStats
   * - Hitung statistik sederhana berdasarkan daftar job yang tersedia.
   * - Mengembalikan openJobs, closedJobs, totalApplicants dan totalJobs.
   */
  static async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('JobService.getStats');

    if (USE_MOCK_API) {
      await delay(400);
      const stats = MockDatabase.getJobStats();
      return { success: true, data: stats };
    }

    try {
      
      const jobsResponse = await this.getAll();
      
      if (!jobsResponse.success || !jobsResponse.data) {
        return { success: false, error: 'Failed to fetch jobs' };
      }

      const jobs = jobsResponse.data;
      const openJobs = jobs.filter(j => j.is_open).length;
      const closedJobs = jobs.filter(j => !j.is_open).length;
      const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
      
      const stats = {
        openJobs,
        closedJobs,
        totalApplicants,
        totalJobs: jobs.length,
      };

      return { success: true, data: stats };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * search
   * - Cari job berdasarkan keyword (title, location, skills).
   * - Pada non-mock: memanfaatkan getAll() lalu filter client-side.
   */
  static async search(keyword: string): Promise<JobsResponse> {
    console.log('JobService.search:', keyword);

    if (USE_MOCK_API) {
      await delay(400);
      const allJobs = MockDatabase.getAllJobs();
      const filtered = allJobs.filter(job =>
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.location.toLowerCase().includes(keyword.toLowerCase()) ||
        job.skills.toLowerCase().includes(keyword.toLowerCase())
      );
      return { success: true, data: filtered };
    }

    try { 
      const response = await this.getAll();
      
      if (!response.success || !response.data) {
        return response;
      }

      const filtered = response.data.filter(job =>
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.location.toLowerCase().includes(keyword.toLowerCase()) ||
        job.skills.toLowerCase().includes(keyword.toLowerCase())
      );

      return { success: true, data: filtered };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}