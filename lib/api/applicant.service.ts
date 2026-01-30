import { Applicant, ApplicantsResponse, UpdateCVResponse, UploadCVsResponse } from '../../types/applicant';
import { MockDatabase } from '../mock-db';
import { apiClient, delay, uploadClient, USE_MOCK_API } from './client';

/**
 * ApplicantService
 * - Abstraksi operasi terkait applicant: ambil per job, upload CV batch, update CV tunggal, hapus applicant.
 * - Mendukung mode mock (USE_MOCK_API) untuk pengembangan/offline testing.
 * - Semua method bersifat static agar mudah dipanggil tanpa instance.
 *
 * Catatan:
 * - Error handling diarahkan untuk retutn objek { success, data?, error?, message? }.
 * - Tidak melakukan side-effect lain selain fetch / pemanggilan MockDatabase.
 */
export class ApplicantService {

  // Helper private untuk mengambil token dari localStorage dan menyiapkan header.
  private static getAuthHeaders(isMultipart = false): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const headers: any = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }


/**
   * Get applicants by job ID
   * - Jika USE_MOCK_API: ambil dari MockDatabase.
   * - Jika non-mock: panggil API route /api/applicants/job/:jobId dan mapping response ke tipe Applicant.
   * - Meng-handle common HTTP errors (401,403).
   */
  static async getByJobId(jobId: string): Promise<ApplicantsResponse> {
    console.log('ApplicantService.getByJobId:', jobId);

    if (USE_MOCK_API) {
      await delay(600);
      const applicants = MockDatabase.getApplicantsByJobId(jobId);
      return { success: true, data: applicants };
    }

    try {
      
      const response = await fetch(`/api/applicants/job/${jobId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(false) 
      });

      if (!response.ok) {
         if (response.status === 403) throw new Error("Akses Ditolak (403). Cek kepemilikan Job.");
         if (response.status === 401) throw new Error("Sesi habis. Login ulang.");
         const errorBody = await response.json();
         throw new Error(errorBody.detail || 'Gagal mengambil data pelamar');
      }

      const data = await response.json();
      
      const applicants: Applicant[] = data.map((app: any) => ({
        id: app.id.toString(),
        jobId: jobId,
        name: app.name,
        email: app.email,
        phone: app.phone || '-',
        skills: app.skills || '',
        score: app.match_score || 0,
        position: app.position || 'Applicant', 
        summary: app.summary || 'No summary available',
        aiAnalysis: app.ai_analysis || 'No analysis available', 
        cvFileName: app.cv_file_name || app.cv_filename || 'resume.pdf',  
        uploadedAt: app.uploaded_at || app.applied_at || new Date().toISOString(), 
      }));

      return { success: true, data: applicants };
    } catch (error: any) {
      console.error('getByJobId error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload and process CVs (batch)
   * - Jika USE_MOCK_API: delegasi ke MockDatabase.processCVs.
   * - Jika non-mock: kirim FormData ke API route `/api/jobs/:jobId/apply`.
   * - Mengembalikan pesan sukses atau error yang terstandardisasi.
   */
  static async uploadCVs(jobId: string, cvFiles: File[]): Promise<UploadCVsResponse> {
    console.log(`ApplicantService.uploadCVs: ${cvFiles.length} files for job ${jobId}`);

    if (USE_MOCK_API) {
      try {
        const applicants = await MockDatabase.processCVs(jobId, cvFiles);
        return { success: true, data: applicants, message: `Processed ${cvFiles.length} CV(s)` };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    try {
      const formData = new FormData();
      cvFiles.forEach(file => formData.append('files', file));

      console.log('Uploading to API Proxy...');

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: this.getAuthHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Sesi habis. Login ulang.");
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: [],  
        message: data.message || `Uploaded ${cvFiles.length} CV(s) successfully`,
      };
    } catch (error: any) {
      console.error('uploadCVs error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update applicant CV (single)
   * - Jika USE_MOCK_API: MockDatabase.updateApplicantCV mengembalikan applicant terbaru.
   * - Jika non-mock: PUT multipart ke `/api/applicants/:applicantId/update-cv`.
   * - Mapping response API kembali ke tipe Applicant.
   */
  static async updateCV(applicantId: string, cvFile: File): Promise<UpdateCVResponse> {
    console.log('ApplicantService.updateCV:', applicantId);

    if (USE_MOCK_API) {
      try {
        const applicant = await MockDatabase.updateApplicantCV(applicantId, cvFile);
        if (!applicant) return { success: false, error: 'Applicant not found' };
        return { success: true, data: applicant, message: 'CV updated' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    try {
      const formData = new FormData();
      formData.append('file', cvFile);

      console.log('Updating CV via API route...');

      const headers = this.getAuthHeaders(true)
      if(headers['Content-Type']) {
        delete headers['Content-Type']
      }

      const response = await fetch(`/api/applicants/${applicantId}/update-cv`, {
        method: 'PUT',
        headers: headers, // true karena upload file
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Update CV failed');
      }

      const data = await response.json();
      
      // Mapping response kembali ke object Applicant
      const applicant: Applicant = {
        id: data.id,
        jobId: data.job_id,
        name: data.name,
        email: data.email,
        phone: data.phone || '-',
        skills: data.skills || '',
        score: data.match_score || 0,
        position: data.position || 'Applicant',
        summary: data.summary || 'No summary available',
        aiAnalysis: data.ai_analysis || 'No analysis available',
        cvFileName: data.cv_file_name || data.cv_filename || 'resume.pdf',
        uploadedAt: data.uploaded_at || data.applied_at || new Date().toISOString(),
      };

      return { success: true, data: applicant, message: 'CV updated successfully' };
    } catch (error: any) {
      console.error('updateCV error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete applicant
   * - Jika USE_MOCK_API: hapus di MockDatabase.
   * - Jika non-mock: DELETE ke `/api/applicants/:applicantId`.
   * - Mengembalikan { success, message? } atau { success:false, error }.
   */
  static async delete(applicantId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('ApplicantService.delete:', applicantId);

    if (USE_MOCK_API) {
      await delay(400);
      const deleted = MockDatabase.deleteApplicant(applicantId);
      if (!deleted) return { success: false, error: 'Applicant not found' };
      return { success: true, message: 'Applicant deleted' };
    }

    try {
      console.log('Deleting via API route...');

      const response = await fetch(`/api/applicants/${applicantId}`, { 
        method: 'DELETE',
        headers: this.getAuthHeaders(false)
      });

      if(!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Delete failed')
      }
      
      console.log('Delete success');
      return { success: true, message: 'Applicant deleted successfully' };
    } catch (error: any) {
      console.error('delete error:', error);
      return { success: false, error: error.message };
    }
  }
}