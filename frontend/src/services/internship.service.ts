// Internship Service
import { apiClient } from '@/api';

export interface InternshipCreateRequest {
  title: string;
  description: string;
  required_skills: string;
}

export interface InternshipUpdateRequest {
  title: string;
  description: string;
  required_skills: string;
}

export interface InternshipPartialUpdateRequest {
  title?: string;
  description?: string;
  required_skills?: string;
  status?: string;
  location?: string;
  stipend?: number;
  duration?: string;
  type?: string;
  level?: string;
  category?: string;
  skills?: string;
  requirements?: string;
  benefits?: string;
  deadline?: string;
}

export interface InternshipResponse {
  id: string;  // UUID as string
  title: string;
  description: string;
  company_id: string;  // UUID as string
  company_name?: string | null;  // Company name for display
  location?: string | null;
  stipend?: number | null;
  duration?: string | null;
  type?: string | null;  // Remote, Hybrid, In-office, Full-time, Part-time
  level?: string | null;  // Beginner, Intermediate, Advanced
  category?: string | null;
  skills?: string | null;  // Comma-separated skills
  requirements?: string | null;
  benefits?: string | null;
  required_skills?: string | null;  // Legacy field
  deadline?: string | null;  // ISO date string
  date_posted?: string | null;  // ISO date string
  status?: string | null;  // Active, Closed, Draft
  applicant_count?: number;  // Number of applicants
  match_percentage?: number;  // Match percentage for student
  match_score?: string;  // Match score as formatted string
  skill_match?: number;  // Skill-based match percentage
  matching_skills?: string[];  // Skills that match
  missing_skills?: string[];  // Skills that are missing
}

export const internshipService = {
  async getAllInternships(): Promise<InternshipResponse[]> {
    return apiClient.get('/api/v1/internships/');
  },

  async getInternshipsWithMatch(): Promise<InternshipResponse[]> {
    return apiClient.get('/api/v1/internships/with-match');
  },

  async createInternship(data: InternshipCreateRequest): Promise<InternshipResponse> {
    return apiClient.post('/api/v1/internships/', data);
  },

  async updateInternship(id: string, data: InternshipUpdateRequest): Promise<InternshipResponse> {
    return apiClient.put(`/api/v1/internships/${id}`, data);
  },

  async partialUpdateInternship(id: string, data: InternshipPartialUpdateRequest): Promise<InternshipResponse> {
    return apiClient.patch(`/api/v1/internships/${id}`, data);
  },

  async deleteInternship(id: string): Promise<InternshipResponse> {
    return apiClient.delete(`/api/v1/internships/${id}`);
  },

  async getInternshipById(id: string): Promise<InternshipResponse> {
    return apiClient.get(`/api/v1/internships/${id}`);
  },
};
