import { Internship, Applicant, DashboardStats } from '../types';

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Mumbai, Maharashtra',
    stipend: 15000,
    applicantCount: 45,
    status: 'Active',
    datePosted: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    description: 'Work on modern React applications with our product team.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS'],
    duration: '3 months',
    type: 'Hybrid',
    rating: 4.5,
    category: 'Technology',
    level: 'Intermediate',
    benefits: ['Flexible Hours', 'Learning & Development', 'Team Events'],
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedDate: new Date('2024-01-15'),
    applicants: 45,
    industry: 'Software Development'
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'DataFlow Analytics',
    location: 'Bangalore, Karnataka',
    stipend: 20000,
    applicantCount: 32,
    status: 'Active',
    datePosted: new Date('2024-01-10'),
    deadline: new Date('2024-02-10'),
    description: 'Analyze data and build machine learning models.',
    requirements: ['Python', 'Machine Learning', 'SQL'],
    duration: '6 months',
    type: 'Remote'
  },
  {
    id: '3',
    title: 'UI/UX Design Intern',
    company: 'Design Studio Pro',
    location: 'Delhi, Delhi',
    stipend: 12000,
    applicantCount: 28,
    status: 'Active',
    datePosted: new Date('2024-01-08'),
    deadline: new Date('2024-02-08'),
    description: 'Design user interfaces and improve user experience.',
    requirements: ['Figma', 'Adobe Creative Suite', 'Design Thinking'],
    duration: '4 months',
    type: 'On-site'
  },
  {
    id: '4',
    title: 'Backend Developer Intern',
    company: 'CloudTech Systems',
    location: 'Pune, Maharashtra',
    stipend: 18000,
    applicantCount: 38,
    status: 'Closed',
    datePosted: new Date('2024-01-05'),
    deadline: new Date('2024-01-25'),
    description: 'Build scalable APIs and microservices.',
    requirements: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    duration: '5 months',
    type: 'Hybrid'
  },
  {
    id: '5',
    title: 'Marketing Intern',
    company: 'BrandBoost Agency',
    location: 'Chennai, Tamil Nadu',
    stipend: 10000,
    applicantCount: 22,
    status: 'Draft',
    datePosted: new Date('2024-01-20'),
    deadline: new Date('2024-03-01'),
    description: 'Assist in digital marketing campaigns and content creation.',
    requirements: ['Digital Marketing', 'Content Writing', 'Social Media'],
    duration: '3 months',
    type: 'Remote'
  }
];

export const mockApplicants: Applicant[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@email.com',
    phone: '+91 98765 43210',
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    applicationDate: new Date('2024-01-16'),
    status: 'Under Review',
    internshipId: '1',
    internshipTitle: 'Frontend Developer Intern',
    experience: '1 year freelancing',
    education: 'B.Tech CSE, IIT Delhi',
    resumeUrl: 'https://example.com/resume/arjun-sharma.pdf',
    canViewContactDetails: false  // Contact details hidden until offer acceptance
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    applicationDate: new Date('2024-01-12'),
    status: 'Hired',
    internshipId: '2',
    internshipTitle: 'Data Science Intern',
    experience: '2 projects during college',
    education: 'M.Sc Data Science, BITS Pilani',
    canViewContactDetails: true,  // Can view contact details after hiring
    offerSentDate: new Date('2024-01-18'),
    offerResponseDate: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@email.com',
    phone: '+91 76543 21098',
    skills: ['Figma', 'Photoshop', 'User Research'],
    applicationDate: new Date('2024-01-09'),
    status: 'Applied',
    internshipId: '3',
    internshipTitle: 'UI/UX Design Intern',
    experience: 'Design club lead',
    education: 'B.Des, NID Ahmedabad',
    canViewContactDetails: false
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 65432 10987',
    skills: ['Node.js', 'Express', 'MongoDB'],
    applicationDate: new Date('2024-01-07'),
    status: 'Rejected',
    internshipId: '4',
    internshipTitle: 'Backend Developer Intern',
    experience: '6 months internship',
    education: 'B.E CSE, VIT Vellore',
    canViewContactDetails: false
  },
  {
    id: '5',
    name: 'Vikash Singh',
    email: 'vikash.singh@email.com',
    phone: '+91 54321 09876',
    skills: ['Digital Marketing', 'SEO', 'Content Writing'],
    applicationDate: new Date('2024-01-21'),
    status: 'Offered',
    internshipId: '5',
    internshipTitle: 'Marketing Intern',
    experience: 'Blogging for 2 years',
    education: 'MBA Marketing, XLRI Jamshedpur',
    canViewContactDetails: false,
    offerSentDate: new Date('2024-01-25'),
    offerLetter: 'Congratulations! We would like to offer you the Marketing Intern position...'
  },
  {
    id: '6',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@email.com',
    phone: '+91 43210 98765',
    skills: ['React', 'TypeScript', 'Next.js'],
    applicationDate: new Date('2024-01-18'),
    status: 'Offer Accepted',
    internshipId: '1',
    internshipTitle: 'Frontend Developer Intern',
    experience: 'Open source contributor',
    education: 'B.Tech IT, IIIT Hyderabad',
    canViewContactDetails: true,  // Contact details available after acceptance
    offerSentDate: new Date('2024-01-22'),
    offerResponseDate: new Date('2024-01-24')
  }
];

export const mockStats: DashboardStats = {
  totalInternships: 5,
  totalApplicants: 165,
  totalHires: 12,
  activeInternships: 3
};

// Chart data
export const applicantStatusData = [
  { name: 'Pending', value: 45, color: '#f59e0b' },
  { name: 'Under Review', value: 38, color: '#3b82f6' },
  { name: 'Hired', value: 25, color: '#10b981' },
  { name: 'Rejected', value: 57, color: '#ef4444' },
];

export const monthlyApplicationsData = [
  { month: 'Jan', applications: 45, hired: 8, rejected: 12 },
  { month: 'Feb', applications: 52, hired: 10, rejected: 15 },
  { month: 'Mar', applications: 38, hired: 6, rejected: 18 },
  { month: 'Apr', applications: 61, hired: 12, rejected: 20 },
  { month: 'May', applications: 48, hired: 9, rejected: 16 },
  { month: 'Jun', applications: 55, hired: 11, rejected: 19 },
];

export const internshipTypeData = [
  { type: 'Remote', count: 8, applicants: 95 },
  { type: 'Hybrid', count: 12, applicants: 142 },
  { type: 'On-site', count: 6, applicants: 78 },
];

export const hiringFunnelData = [
  { stage: 'Applied', count: 165, percentage: 100 },
  { stage: 'Screened', count: 98, percentage: 59 },
  { stage: 'Interviewed', count: 45, percentage: 27 },
  { stage: 'Final Round', count: 28, percentage: 17 },
  { stage: 'Hired', count: 12, percentage: 7 },
];

// Mock user data for interns dashboard
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder.svg',
  role: 'Student',
  university: 'IIT Delhi',
  course: 'Computer Science',
  year: '3rd Year',
  skills: ['React', 'TypeScript', 'Node.js', 'Python'],
  completedApplications: 5,
  pendingApplications: 3,
  offers: 1
};

// Mock recommendations data
export const mockRecommendations = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Tech Corp',
    location: 'Mumbai',
    stipend: 25000,
    duration: '6 months',
    skills: ['React', 'Node.js', 'MongoDB'],
    postedDate: new Date('2024-01-20'),
    deadline: new Date('2024-02-20'),
    description: 'Join our engineering team to build scalable web applications.',
    matchScore: 95
  },
  {
    id: '2', 
    title: 'Frontend Developer Intern',
    company: 'Design Studio',
    location: 'Bangalore',
    stipend: 20000,
    duration: '4 months',
    skills: ['React', 'TypeScript', 'CSS'],
    postedDate: new Date('2024-01-18'),
    deadline: new Date('2024-02-18'),
    description: 'Create beautiful user interfaces and enhance user experience.',
    matchScore: 88
  }
];

// Mock search results data
export const mockSearchResults = [
  {
    id: '1',
    title: 'Data Science Intern',
    company: 'Analytics Pro',
    location: 'Delhi',
    stipend: 22000,
    duration: '5 months',
    skills: ['Python', 'Machine Learning', 'SQL'],
    postedDate: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    description: 'Work with big data and machine learning algorithms.',
    type: 'Remote'
  },
  {
    id: '2',
    title: 'Mobile App Developer Intern',
    company: 'Mobile Solutions',
    location: 'Pune',
    stipend: 18000,
    duration: '4 months', 
    skills: ['React Native', 'Flutter', 'Mobile Development'],
    postedDate: new Date('2024-01-12'),
    deadline: new Date('2024-02-12'),
    description: 'Develop cross-platform mobile applications.',
    type: 'Hybrid'
  }
];