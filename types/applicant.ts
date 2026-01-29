// Applicant Types - UPDATED BASED ON REAL API

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  summary: string;
  aiAnalysis: string;
  score: number;
  cvFileName: string;
  uploadedAt: string;
  position?: string;
}

export interface ApplicantResponse {
  success: boolean;
  data?: Applicant;
  message?: string;
  error?: string;
}

export interface ApplicantsResponse {
  success: boolean;
  data?: Applicant[];
  message?: string;
  error?: string;
}

export interface UploadCVsResponse {
  success: boolean;
  data?: Applicant[]; 
  message?: string;
  error?: string;
}

export interface UpdateCVResponse {
  success: boolean;
  data?: Applicant;
  message?: string;
  error?: string;
}