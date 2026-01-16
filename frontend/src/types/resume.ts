// Resume data types matching the API specification

export interface BasicDetails {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    province: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
}

export interface ProfileSummaryContent {
    format: 'paragraph' | 'bullets';
    text?: string;
    bullets?: string[];
}

export interface SkillCategory {
    name: string;
    skills: string;
}

export interface TechSkillsContent {
    categories: SkillCategory[];
}

export interface ExperienceEntry {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface ExperienceContent {
    entries: ExperienceEntry[];
}

export interface ProjectEntry {
    name: string;
    description: string[];
    technologies?: string;
    link?: string;
    date?: string;
}

export interface ProjectsContent {
    entries: ProjectEntry[];
}

export interface VolunteerEntry {
    organization: string;
    title: string;
    location?: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface VolunteerContent {
    entries: VolunteerEntry[];
}

export interface EducationEntry {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface EducationContent {
    entries: EducationEntry[];
}

export type SectionType =
    | 'profile_summary'
    | 'tech_skills'
    | 'experience'
    | 'projects'
    | 'volunteer'
    | 'education';

export interface Section {
    id: string;
    type: SectionType;
    content:
    | ProfileSummaryContent
    | TechSkillsContent
    | ExperienceContent
    | ProjectsContent
    | VolunteerContent
    | EducationContent;
    visible: boolean;
}

export interface ResumeData {
    basicDetails: BasicDetails;
    sections: Section[];
}

// API Response types
export interface SuccessResponse {
    success: true;
    message: string;
    pdfUrl: string;
    pdfBase64?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
    details?: string[];
}

export type ApiResponse = SuccessResponse | ErrorResponse;
