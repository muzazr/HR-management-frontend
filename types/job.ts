export interface Job {
  id:  string;
  ownerId?: string;
  title: string;
  location: string;
  min_education: string;
  skills: string;
  deadline: string; 
  postedDate: string; 
  is_open?: boolean;
  applicants: number;
  createdBy?:  string; 
}

export interface CreateJobRequest {
  title: string;
  location: string;
  min_education: string;
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