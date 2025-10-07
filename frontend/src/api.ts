// src/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Your backend URL

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const createHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    
    // Handle 403 Forbidden - often means wrong user role for the endpoint
    if (response.status === 403) {
      const errorMsg = errorData.detail || "Access denied";
      
      // If the error message indicates a role mismatch, redirect to appropriate dashboard
      if (errorMsg.includes('students/interns only')) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'company') {
          window.location.href = '/company/dashboard';
        } else if (userRole === 'admin') {
          window.location.href = '/admin/dashboard';
        }
      } else if (errorMsg.includes('company only')) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'intern') {
          window.location.href = '/interns/dashboard';
        }
      }
      
      throw new Error(errorMsg);
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw new Error("Session expired. Please log in again.");
    }
    
    throw new Error(errorData.detail || "Something went wrong");
  }
  
  return response.json();
};

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: createHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: createHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: createHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: createHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: createHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  }
};