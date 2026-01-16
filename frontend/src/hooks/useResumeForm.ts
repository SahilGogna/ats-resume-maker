import { useState, useCallback } from 'react';
import { ResumeData, Section, BasicDetails } from '../types/resume';

const defaultBasicDetails: BasicDetails = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    province: '',
    github: '',
    linkedin: '',
    portfolio: '',
};

const defaultSections: Section[] = [
    {
        id: 'profile_summary',
        type: 'profile_summary',
        content: { format: 'paragraph', text: '' },
        visible: true,
    },
    {
        id: 'tech_skills',
        type: 'tech_skills',
        content: { categories: [{ name: 'Technical Skills', skills: '' }] },
        visible: true,
    },
    {
        id: 'experience',
        type: 'experience',
        content: {
            entries: [{
                company: '',
                title: '',
                location: '',
                startDate: '',
                endDate: '',
                bullets: [''],
            }],
        },
        visible: true,
    },
    {
        id: 'projects',
        type: 'projects',
        content: {
            entries: [{
                name: '',
                description: [''],
                technologies: '',
                link: '',
                date: '',
            }],
        },
        visible: true,
    },
    {
        id: 'volunteer',
        type: 'volunteer',
        content: {
            entries: [{
                organization: '',
                title: '',
                location: '',
                startDate: '',
                endDate: '',
                bullets: [''],
            }],
        },
        visible: true,
    },
    {
        id: 'education',
        type: 'education',
        content: {
            entries: [{
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
            }],
        },
        visible: true,
    },
];

export function useResumeForm() {
    const [basicDetails, setBasicDetails] = useState<BasicDetails>(defaultBasicDetails);
    const [sections, setSections] = useState<Section[]>(defaultSections);

    const updateBasicDetails = useCallback((updates: Partial<BasicDetails>) => {
        setBasicDetails(prev => ({ ...prev, ...updates }));
    }, []);

    const updateSection = useCallback((sectionId: string, content: Section['content']) => {
        setSections(prev =>
            prev.map(s => (s.id === sectionId ? { ...s, content } : s))
        );
    }, []);

    const toggleSectionVisibility = useCallback((sectionId: string) => {
        setSections(prev =>
            prev.map(s => (s.id === sectionId ? { ...s, visible: !s.visible } : s))
        );
    }, []);

    const reorderSections = useCallback((newOrder: Section[]) => {
        setSections(newOrder);
    }, []);

    const getResumeData = useCallback((): ResumeData => {
        return {
            basicDetails,
            sections,
        };
    }, [basicDetails, sections]);

    const isValid = useCallback((): boolean => {
        const { firstName, lastName, email, city, province } = basicDetails;
        return !!(firstName && lastName && email && city && province);
    }, [basicDetails]);

    const loadFromData = useCallback((data: { basicDetails: BasicDetails; sections: Section[] }) => {
        setBasicDetails(data.basicDetails);
        setSections(data.sections);
    }, []);

    const resetToDefaults = useCallback(() => {
        setBasicDetails(defaultBasicDetails);
        setSections(defaultSections);
    }, []);

    return {
        basicDetails,
        sections,
        updateBasicDetails,
        updateSection,
        toggleSectionVisibility,
        reorderSections,
        getResumeData,
        isValid,
        loadFromData,
        resetToDefaults,
    };
}
