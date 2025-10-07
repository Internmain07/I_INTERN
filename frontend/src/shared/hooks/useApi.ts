// API Hooks using React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { internshipService, InternshipCreateRequest, InternshipUpdateRequest } from '@/services/internship.service';
import { applicationService, ApplicationCreateRequest } from '@/services/application.service';
import { dashboardService } from '@/services/dashboard.service';

// Internship Hooks
export const useInternships = () => {
  return useQuery({
    queryKey: ['internships'],
    queryFn: () => internshipService.getAllInternships(),
  });
};

export const useInternship = (id: string) => {
  return useQuery({
    queryKey: ['internship', id],
    queryFn: () => internshipService.getInternshipById(id),
    enabled: !!id,
  });
};

export const useCreateInternship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InternshipCreateRequest) => internshipService.createInternship(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    },
  });
};

export const useUpdateInternship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InternshipUpdateRequest }) => 
      internshipService.updateInternship(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    },
  });
};

export const useDeleteInternship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => internshipService.deleteInternship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    },
  });
};

// Application Hooks
export const useMyApplications = () => {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(),
  });
};

export const useApplyForInternship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ApplicationCreateRequest) => applicationService.applyForInternship(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    },
  });
};

export const useApplicantsForInternship = (internshipId: string) => {
  return useQuery({
    queryKey: ['applicants', internshipId],
    queryFn: () => applicationService.getApplicantsForInternship(internshipId),
    enabled: !!internshipId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) => 
      applicationService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
    },
  });
};

// Dashboard Hooks
export const useInternDashboardStats = () => {
  return useQuery({
    queryKey: ['intern-dashboard-stats'],
    queryFn: () => dashboardService.getInternDashboardStats(),
  });
};

export const useCompanyDashboardStats = () => {
  return useQuery({
    queryKey: ['company-dashboard-stats'],
    queryFn: () => dashboardService.getCompanyDashboardStats(),
  });
};
