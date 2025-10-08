// User Profile Service
import { apiClient } from '@/api';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface UserProfileData {
  id?: number;
  email?: string;
  role?: string;
  name?: string | null;
  phone?: string | null;
  location?: string | null;
  date_of_birth?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  university?: string | null;
  major?: string | null;
  graduation_year?: string | null;
  grading_type?: string | null;
  grading_score?: string | null;
  skills?: string | null;
  avatar_url?: string | null;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface Project {
  id?: number;
  title: string;
  description?: string | null;
  technologies?: string[];
  start_date?: string | null;
  end_date?: string | null;
  github_url?: string | null;
  live_demo_url?: string | null;
}

export const userService = {
  async getProfile(): Promise<UserProfileData> {
    return apiClient.get('/api/v1/users/profile');
  },

  async updateProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
    return apiClient.put('/api/v1/users/profile', data);
  },

  async uploadAvatar(file: File): Promise<{ message: string; avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/api/v1/profile/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload avatar');
    }

    return response.json();
  },

  async deleteAvatar(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/v1/profile/delete-avatar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete avatar');
    }

    return response.json();
  },
  
  // Work Experience endpoints
  async getWorkExperiences(): Promise<WorkExperience[]> {
    return apiClient.get('/api/v1/profile/work-experiences');
  },

  async addWorkExperience(data: Omit<WorkExperience, 'id'>): Promise<WorkExperience> {
    return apiClient.post('/api/v1/profile/work-experiences', data);
  },

  async updateWorkExperience(id: number, data: Partial<WorkExperience>): Promise<WorkExperience> {
    return apiClient.put(`/api/v1/profile/work-experiences/${id}`, data);
  },

  async deleteWorkExperience(id: number): Promise<void> {
    return apiClient.delete(`/api/v1/profile/work-experiences/${id}`);
  },

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return apiClient.get('/api/v1/profile/projects');
  },

  async addProject(data: Omit<Project, 'id'>): Promise<Project> {
    return apiClient.post('/api/v1/profile/projects', data);
  },

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    return apiClient.put(`/api/v1/profile/projects/${id}`, data);
  },

  async deleteProject(id: number): Promise<void> {
    return apiClient.delete(`/api/v1/profile/projects/${id}`);
  },
};
