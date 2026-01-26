// Mock Database - Simulasi database untuk development
import { MockUser, User } from '../types/auth';
import { Job } from '../types/job';
import { Applicant } from '../types/applicant';
import { resolve } from 'path';

export interface MockSession {
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}

// Mock Users Database
let mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@company.com',
    password: 'admin123',
    photo:  '/images/default-avatar.png',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2026-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@company.com',
    password: 'password123',
    photo: '/images/default-avatar.png',
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2026-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@company.com',
    password: 'password123',
    photo: '/images/default-avatar.png',
    createdAt: '2024-03-10T00:00:00Z',
    lastLogin: '2026-01-15T09:15:00Z'
  }
];

let mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Sr. UX Designer',
    location: 'Bengaluru',
    requirement: 'Bachelor Degree',
    skills: 'UI/UX Design, Figma, User Research, Prototyping',
    deadline: '2026-01-17',
    postedDate: '2026-01-11T00:00:00Z',
    status: true,
    applicants: 45,
  },
  {
    id:  'job-002',
    title: 'Growth Manager',
    location: 'Remote',
    requirement: 'Bachelor Degree',
    skills: 'Marketing, Analytics, Growth Hacking, SEO',
    deadline: '2026-01-06',
    postedDate: '2026-01-08T00:00:00Z',
    status: true,
    applicants: 38,
  },
  {
    id: 'job-003',
    title: 'Financial Analyst',
    location: 'Mumbai',
    requirement: 'Master Degree',
    skills: 'Financial Modeling, Excel, Data Analysis, Forecasting',
    deadline: '2026-01-14',
    postedDate: '2026-01-03T00:00:00Z',
    status: false,
    applicants: 25,
  },
  {
    id: 'job-004',
    title: 'Security Analyst',
    location: 'New Delhi',
    requirement: 'Bachelor Degree',
    skills:  'Cybersecurity, Network Security, Penetration Testing',
    deadline: '2026-01-19',
    postedDate: '2025-12-29T00:00:00Z',
    status: true,
    applicants: 105,
  },
  {
    id: 'job-005',
    title: 'Product Manager',
    location: 'Bangalore',
    requirement: 'Bachelor Degree',
    skills: 'Product Strategy, Agile, Roadmapping, Stakeholder Management',
    deadline: '2026-01-25',
    postedDate: '2025-12-24T00:00:00Z',
    status: true,
    applicants: 67,
  },
];

let mockApplicants: Applicant[] = [
  {
    id: 'app-001',
    jobId: 'job-002',
    name: 'Muhammad Zaki Azhar',
    email: 'zakiazhar04@gmail.com',
    phone: '+62 812-3456-7890',
    skills: ['Marketing', 'Analytics', 'SEO', 'Growth Hacking'],
    score: 9.8,
    position: 'Growth Specialist',
    summary: 'Experienced growth marketer with 5 years of expertise in digital marketing and analytics. Led growth initiatives that resulted in 300% user acquisition increase.',
    aiAnalysis: 'Excellent match for Growth Manager role.  Strong analytical skills and proven track record in growth hacking.  Communication and leadership capabilities are outstanding.',
    cvFileName: 'zaki_azhar_cv.pdf',
    uploadedAt: '2026-01-12T10:30:00Z',
  },
  {
    id: 'app-002',
    jobId: 'job-002',
    name: 'Muhammad Najmi Azhar',
    email: 'najmi@example.com',
    phone: '+62 813-9876-5432',
    skills: ['Marketing', 'Data Analysis', 'A/B Testing'],
    score: 9.2,
    position: 'Marketing Analyst',
    summary: 'Data-driven marketer with strong analytical background.',
    aiAnalysis: 'Good match for the role. Strong in data analysis.',
    cvFileName: 'najmi_cv.pdf',
    uploadedAt: '2026-01-13T14:20:00Z',
  },
];


// Mock Sessions
let mockSessions: MockSession[] = [];

// Generate token
function generateMockToken(userId: string): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `mock_jwt_${userId}_${randomString}_${Date.now()}`;
}

// Remove password from user
function sanitizeUser(mockUser: MockUser): User {
  const { password, ...user } = mockUser;
  return user;
}

export class MockDatabase {
  
  // Find user by username or email
  static findUserByCredentials(usernameOrEmail: string): MockUser | undefined {
    return mockUsers.find(
      user => 
        user. username. toLowerCase() === usernameOrEmail.toLowerCase() || 
        user.email.toLowerCase() === usernameOrEmail. toLowerCase()
    );
  }

  // Find user by ID
  static findUserById(userId: string): MockUser | undefined {
    return mockUsers.find(user => user.id === userId);
  }

  // Find user by email
  static findUserByEmail(email: string): MockUser | undefined {
    return mockUsers.find(user => user.email. toLowerCase() === email.toLowerCase());
  }

  // Find user by username
  static findUserByUsername(username: string): MockUser | undefined {
    return mockUsers.find(user => user. username. toLowerCase() === username.toLowerCase());
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    return !!this.findUserByEmail(email);
  }

  // Check if username exists
  static usernameExists(username: string): boolean {
    return !!this.findUserByUsername(username);
  }

  // Create new user
  static createUser(userData: {
    name: string;
    username: string;
    email:  string;
    password: string;
    photo?: string;
  }): User {
    if (this.emailExists(userData.email)) {
      throw new Error('Email already exists');
    }
    if (this.usernameExists(userData.username)) {
      throw new Error('Username already exists');
    }

    const newUser: MockUser = {
      id: (mockUsers.length + 1).toString(),
      name: userData. name,
      username: userData. username,
      email: userData. email,
      password: userData. password,
      photo: userData.photo || '/images/default-avatar.png',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    console.log('Mock DB: User created:', sanitizeUser(newUser));
    
    return sanitizeUser(newUser);
  }

  // Update last login
  static updateLastLogin(userId: string): void {
    const user = this.findUserById(userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
    }
  }

  // Create session (login)
  static createSession(userId: string): string {
    const token = generateMockToken(userId);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session: MockSession = {
      userId,
      token,
      createdAt: now. toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    mockSessions.push(session);
    this.updateLastLogin(userId);
    
    console.log('Mock DB: Session created for user:', userId);
    return token;
  }

  // Validate session
  static validateSession(token:  string): MockUser | null {
    const session = mockSessions.find(s => s.token === token);
    
    if (!session) {
      return null;
    }

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      this.deleteSession(token);
      return null;
    }

    const user = this.findUserById(session.userId);
    return user || null;
  }

  // Delete session (logout)
  static deleteSession(token: string): boolean {
    const initialLength = mockSessions.length;
    mockSessions = mockSessions.filter(s => s.token !== token);
    return mockSessions.length < initialLength;
  }

  // Login
  static login(usernameOrEmail: string, password: string): { user: User; token: string } {
    const user = this.findUserByCredentials(usernameOrEmail);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid username or password');
    }

    const token = this.createSession(user.id);

    console.log('Mock DB: Login successful:', user.username);
    return {
      user:  sanitizeUser(user),
      token,
    };
  }

  // Register
  static register(userData: {
    name:  string;
    username: string;
    email: string;
    password: string;
    photo?:  string;
  }): { user: User; token: string } {
    const user = this.createUser(userData);
    const token = this.createSession(user.id);

    console.log('Mock DB: Registration successful:', user.username);
    return {
      user,
      token,
    };
  }

  // Logout
  static logout(token: string): boolean {
    return this.deleteSession(token);
  }

  // Get current user from token
  static getCurrentUser(token: string): User | null {
    const user = this.validateSession(token);
    return user ? sanitizeUser(user) : null;
  }

  // Get stats (for debugging)
  static getStats() {
    return {
      totalUsers: mockUsers.length,
      activeSessions: mockSessions.length,
    };
  }

    static getAllJobs(): Job[] {
    return mockJobs. map(job => ({ ...job }));
  }

  // Get job by ID
  static getJobById(jobId: string): Job | null {
    return mockJobs.find(job => job.id === jobId) || null;
  }

  // Create new job
  static createJob(jobData: {
    title: string;
    location: string;
    requirement:  string;
    skills: string;
    deadline: string;
  }): Job {
    const newJob:  Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: jobData.title,
      location: jobData.location,
      requirement: jobData.requirement,
      skills: jobData.skills,
      deadline: jobData.deadline,
      postedDate: new Date().toISOString(),
      status: true,
      applicants: 0,
    };

    mockJobs.unshift(newJob); // Add to beginning
    console.log('✅ Mock DB: Job created:', newJob);
    return newJob;
  }

  // Update job
  static updateJob(jobId:  string, updates: Partial<Job>): Job | null {
    const index = mockJobs.findIndex(job => job.id === jobId);
    if (index === -1) return null;

    mockJobs[index] = {
      ...mockJobs[index],
      ...updates,
      id: jobId, // Prevent ID change
    };

    console.log('✅ Mock DB: Job updated:', mockJobs[index]);
    return mockJobs[index];
  }

  // Delete job
  static deleteJob(jobId: string): boolean {
    const initialLength = mockJobs.length;
    mockJobs = mockJobs.filter(job => job. id !== jobId);
    
    if (mockJobs.length < initialLength) {
      console.log('✅ Mock DB: Job deleted:', jobId);
      return true;
    }
    return false;
  }

  // Toggle job status
  static toggleJobStatus(jobId: string): Job | null {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return null;

    job.status = !job.status;
    console.log('✅ Mock DB: Job status toggled:', job);
    return job;
  }

  // Get job statistics
  static getJobStats(): { totalJobs: number; openJobs: number; closedJobs: number; totalApplicants: number } {
    return {
      totalJobs: mockJobs.length,
      openJobs: mockJobs.filter(j => j.status === true).length,
      closedJobs: mockJobs.filter(j => j.status === false).length,
      totalApplicants: mockJobs.reduce((sum, job) => sum + job.applicants, 0),
    };
  }


  // ==================== APPLICANT OPERATIONS ====================

  // Get applicants by Job ID
  static getApplicantsByJobId(jobId: string): Applicant[] {
    return mockApplicants
    .filter(app => app.jobId === jobId)
    .sort((a, b) => b.score - a.score)
  }

  // Get Applicant by ID
  static getApplicantById(applicantId: string): Applicant | null {
    return mockApplicants.find(app => app.id === applicantId) || null
  }

  // Simulate CV Processing (Mock AI processing)
  static async processCVs(jobId: string, cvFiles: File[]): Promise<Applicant[]> {
    // simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const job = this.getJobById(jobId)
    if(!job) throw new Error('job not found')

    const newApplicants: Applicant[] = cvFiles.map((file, index) => {
      const baseName = file.name.replace('.pdf', '').replace(/_/g, '')
      const randomScore = (Math.random() * 2 + 8).toFixed(1)

      return {
        id: `app-${Date.now()}-${index}`,
        jobId:  jobId,
        name: baseName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: `${baseName.toLowerCase().replace(/ /g, '.')}@example.com`,
        phone: `+62 81${Math.floor(Math.random() * 10)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        skills: job.skills.split(',').map(s => s.trim()).slice(0, 3 + Math.floor(Math.random() * 2)),
        score: parseFloat(randomScore),
        position: `${job.title} Candidate`,
        summary: `Experienced professional with relevant background in ${job.title}.  Demonstrates strong capabilities in required skills and shows excellent potential for the role.`,
        aiAnalysis: `AI Analysis: This candidate shows strong match for the ${job. title} position. Skills alignment is high, and experience level matches requirements.`,
        cvFileName: file.name,
        uploadedAt: new Date().toISOString()  
      }
    })

    mockApplicants.push(...newApplicants)

    // update job applicants count
    const updatedJob = this.getJobById(jobId)
    if(updatedJob) {
      updatedJob.applicants = this.getApplicantsByJobId(jobId).length
    }
    
    return newApplicants
  }

  // update applicant CV
  static async updateApplicantCV(applicantId: string, cvFile: File): Promise<Applicant | null> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const applicant = this.getApplicantById(applicantId)
    if(!applicant) return null

    const randomScore = (Math.random() * 2 + 8).toFixed(1);
    
    applicant.cvFileName = cvFile. name;
    applicant.score = parseFloat(randomScore);
    applicant.summary = `Updated:  Experienced professional with relevant background in ${applicant.position}. Recent achievements demonstrate growth and adaptability.`;
    applicant.aiAnalysis = `AI Analysis (Updated): Candidate profile refreshed.  Shows strong match after CV update.`;
    applicant.uploadedAt = new Date().toISOString();

    return applicant;
  }

  static deleteApplicant(applicantId: string): boolean {
    const initialLength = mockApplicants.length
    const applicant = this.getApplicantById(applicantId)

    mockApplicants = mockApplicants.filter(app => app.id !== applicantId)

    if(mockApplicants.length < initialLength) {
      if(applicant) {
        const job = this.getJobById(applicant.jobId)
        if(job) {
          job.applicants = this.getApplicantsByJobId(applicant.jobId).length
        }
      }
      return true
    } 

    return false
  }

}

console.log(' Mock Database initialized with', mockUsers.length, 'users');