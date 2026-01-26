// Applicant Types

export interface Applicant {
  id: string;
  jobId: string;
  name:  string;
  email: string;
  phone: string;
  skills: string[];
  score:  number;
  summary: string;
  aiAnalysis: string;
  position?: string;
  cvFileName?: string;
  uploadedAt: string;
}

export interface UploadCVsRequest {
  jobId: string;
  cvFiles: File[];
}

export interface UploadCVsResponse {
  success: boolean;
  data?:  Applicant[];
  message?: string;
  error?: string;
}

export interface ApplicantResponse {
  success: boolean;
  data?:  Applicant;
  message?: string;
  error?: string;
}

export interface ApplicantsResponse {
  success: boolean;
  data?: Applicant[];
  message?: string;
  error?: string;
}

export interface UpdateCVRequest {
  applicantId: string;
  cvFile: File;
}

export interface UpdateCVResponse {
  success: boolean;
  data?:  Applicant;
  message?:  string;
  error?: string;
}