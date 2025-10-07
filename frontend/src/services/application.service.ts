// Application Service
import { apiClient } from '@/api';

export interface ApplicationCreateRequest {
  internship_id: string;  // UUID as string
}

export interface ApplicationResponse {
  id: string;  // UUID as string
  status: string;
  intern_id: number;  // Changed to number to match backend (user.id is integer)
  internship_id: string;  // UUID as string
}

export interface ApplicantWithScore {
  application_id: string;  // UUID as string
  applicant_id: string;  // UUID as string
  name: string | null;
  email: string;
  phone: string | null;
  university: string | null;
  major: string | null;
  graduation_year: string | null;
  grading_type: string | null;
  grading_score: string | null;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  skills: string[] | null;
  work_experiences: any[];
  projects: any[];
  match_percentage: number;
  match_score: string;
  skill_match?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  status: string;
  applied_date: string | null;
  internship_title: string;
  internship_id: string;  // UUID as string
  can_view_contact_details: boolean;
  offer_sent_date: string | null;
  offer_response_date: string | null;
}

export interface OfferResponse {
  id: string;
  application_id: string;
  position: string;
  title: string;
  company: string;
  company_id: string;
  salary: string | null;
  stipend: number | null;
  location: string | null;
  startDate: string | null;
  status: string;
  application_date: string | null;
  offer_sent_date: string | null;
  offer_response_date: string | null;
  deadline: string | null;
  internship_id: string;
  duration: string | null;
  type: string | null;
}

export const applicationService = {
  async applyForInternship(data: ApplicationCreateRequest): Promise<ApplicationResponse> {
    return apiClient.post('/api/v1/applications/', data);
  },

  async getApplicantsForInternship(internshipId: string): Promise<ApplicantWithScore[]> {
    return apiClient.get(`/api/v1/applications/${internshipId}/applicants`);
  },

  async getAllCompanyApplicants(): Promise<ApplicantWithScore[]> {
    return apiClient.get('/api/v1/applications/company/all-applicants');
  },

  async getMyApplications(): Promise<ApplicationResponse[]> {
    return apiClient.get('/api/v1/applications/my-applications');
  },

  async updateApplicationStatus(applicationId: string, status: string): Promise<ApplicationResponse> {
    return apiClient.patch(`/api/v1/applications/${applicationId}/status?status=${encodeURIComponent(status)}`, {});
  },

  async getMyOffers(): Promise<OfferResponse[]> {
    return apiClient.get('/api/v1/applications/my-offers');
  },

  async respondToOffer(applicationId: string, response: 'accepted' | 'declined'): Promise<OfferResponse> {
    return apiClient.patch(`/api/v1/applications/${applicationId}/respond?response=${response}`, {});
  },
};
