// Dashboard Service for aggregating data
import { internshipService, InternshipResponse } from './internship.service';
import { applicationService, ApplicationResponse } from './application.service';

export interface DashboardStatsIntern {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  availableInternships: number;
}

export interface DashboardStatsCompany {
  totalInternships: number;
  activeInternships: number;
  totalApplicants: number;
  pendingReviews: number;
}

export const dashboardService = {
  async getInternDashboardStats(): Promise<DashboardStatsIntern> {
    try {
      const [applications, internships] = await Promise.all([
        applicationService.getMyApplications(),
        internshipService.getAllInternships(),
      ]);

      const pending = applications.filter(app => app.status === 'pending').length;
      const accepted = applications.filter(app => app.status === 'accepted').length;
      const rejected = applications.filter(app => app.status === 'rejected').length;

      return {
        totalApplications: applications.length,
        pendingApplications: pending,
        acceptedApplications: accepted,
        rejectedApplications: rejected,
        availableInternships: internships.length,
      };
    } catch (error) {
      console.error('Failed to fetch intern dashboard stats:', error);
      throw error;
    }
  },

  async getCompanyDashboardStats(): Promise<DashboardStatsCompany> {
    // This would need additional backend endpoints
    // For now, return mock data or implement when ready
    return {
      totalInternships: 0,
      activeInternships: 0,
      totalApplicants: 0,
      pendingReviews: 0,
    };
  },
};
