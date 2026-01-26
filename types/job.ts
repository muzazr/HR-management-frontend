// Job Types

export interface Job {
  id:  string;
  title: string;
  location: string;
  requirement: string;
  skills: string; // Comma separated
  deadline: string; // ISO date string
  postedDate: string; // ISO date string
  status: boolean;
  applicants: number;
  createdBy?:  string; // User ID yang create
}

export interface CreateJobRequest {
  title: string;
  location: string;
  requirement: string;
  skills: string;
  deadline: string;
}

export interface JobResponse {
  success: boolean;
  data?:  Job;
  message?: string;
  error?: string;
}

export interface JobsResponse {
  success: boolean;
  data?:  Job[];
  message?: string;
  error?: string;
}