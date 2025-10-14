import { apiClient } from '@/api';

export interface CompanyDashboardStats {
  totalInternships: number;
  activeInternships: number;
  totalApplicants: number;
  totalHires: number;
  newInternshipsWeek?: number;
  newApplicantsMonth?: number;
  applicantsChangePercent?: number;
  newHiresMonth?: number;
  endingSoon?: number;
  pendingReviews?: number;
}

export interface MonthlyApplicationData {
  month: string;
  total_applications: number;
  hired: number;
  rejected: number;
}

export interface HiringFunnelData {
  applied: number;
  screened: number;
  interviewed: number;
  offered: number;
  hired: number;
}

export class CompanyAnalyticsService {
  static async getDashboardStats(): Promise<CompanyDashboardStats> {
    try {
      const response = await apiClient.get('/api/v1/internships/company/dashboard-stats');
      
      return {
        totalInternships: response.total_internships || 0,
        activeInternships: response.active_internships || 0,
        totalApplicants: response.total_applicants || 0,
        totalHires: response.total_hires || 0,
        newInternshipsWeek: response.new_internships_week || 0,
        newApplicantsMonth: response.new_applicants_month || 0,
        applicantsChangePercent: response.applicants_change_percent || 0,
        newHiresMonth: response.new_hires_month || 0,
        endingSoon: response.ending_soon || 0,
        pendingReviews: response.pending_reviews || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values instead of throwing
      return {
        totalInternships: 0,
        activeInternships: 0,
        totalApplicants: 0,
        totalHires: 0,
        newInternshipsWeek: 0,
        newApplicantsMonth: 0,
        applicantsChangePercent: 0,
        newHiresMonth: 0,
        endingSoon: 0,
        pendingReviews: 0,
      };
    }
  }

  static async getMonthlyApplications(): Promise<MonthlyApplicationData[]> {
    try {
      const response = await apiClient.get('/api/v1/internships/company/analytics/monthly-applications');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching monthly applications:', error);
      return [];
    }
  }

  static async getHiringFunnel(): Promise<HiringFunnelData> {
    try {
      const response = await apiClient.get('/api/v1/internships/company/analytics/hiring-funnel');
      
      return {
        applied: response.applied || 0,
        screened: response.screened || 0,
        interviewed: response.interviewed || 0,
        offered: response.offered || 0,
        hired: response.hired || 0,
      };
    } catch (error) {
      console.error('Error fetching hiring funnel:', error);
      return {
        applied: 0,
        screened: 0,
        interviewed: 0,
        offered: 0,
        hired: 0,
      };
    }
  }

  static async getAllAnalyticsData(): Promise<{
    stats: CompanyDashboardStats;
    monthlyData: MonthlyApplicationData[];
    funnelData: HiringFunnelData;
  }> {
    try {
      const [stats, monthlyData, funnelData] = await Promise.all([
        this.getDashboardStats(),
        this.getMonthlyApplications(),
        this.getHiringFunnel(),
      ]);

      return { stats, monthlyData, funnelData };
    } catch (error) {
      console.error('Error fetching all analytics data:', error);
      return {
        stats: await this.getDashboardStats(),
        monthlyData: [],
        funnelData: {
          applied: 0,
          screened: 0,
          interviewed: 0,
          offered: 0,
          hired: 0,
        },
      };
    }
  }
}