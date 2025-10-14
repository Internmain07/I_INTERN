import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api';

interface CompanyProfile {
  id: string;
  email: string;
  company_name?: string;
  contact_person?: string;
  contact_number?: string;
  company_website?: string;
  industry_type?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  logo_url?: string;
  is_verified: boolean;
  is_active: boolean;
}

export const useCompanyProfile = () => {
  return useQuery({
    queryKey: ['company-profile'],
    queryFn: async (): Promise<CompanyProfile> => {
      return await apiClient.get('/api/v1/companies/profile');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRefreshCompanyProfile = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['company-profile'] });
  };
};