export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  githubLink: string;
  linkedinProfile: string;
}

export interface Education {
  degree: string;
  college: string;
  cgpa: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  responsibilities: string[];
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  objective: string;
  education: Education[];
  projects: Project[];
  experience: Experience[];
  skills: string[];
  certifications: Certification[];
}
