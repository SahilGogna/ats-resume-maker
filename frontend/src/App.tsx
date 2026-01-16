import { useState, ReactNode, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useResumeForm } from './hooks/useResumeForm';
import { compileResume, createPdfUrl } from './utils/api';
import { BasicDetailsSection } from './components/sections/BasicDetails';
import { ProfileSummarySection } from './components/sections/ProfileSummary';
import { TechSkillsSection } from './components/sections/TechSkills';
import { ExperienceSection } from './components/sections/Experience';
import { ProjectsSection } from './components/sections/Projects';
import { VolunteerSection } from './components/sections/Volunteer';
import { EducationSection } from './components/sections/Education';
import { DraggableSection } from './components/layout/DraggableSection';
import { ProfileSummaryContent, TechSkillsContent, ExperienceContent, ProjectsContent, VolunteerContent, EducationContent } from './types/resume';
import { testBasicDetails, testSections } from './data/testData';

const sectionIcons: Record<string, ReactNode> = {
    profile_summary: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    tech_skills: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    experience: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    projects: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    volunteer: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    education: <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
};

const sectionTitles: Record<string, string> = {
    profile_summary: 'Profile Summary',
    tech_skills: 'Technical Skills',
    experience: 'Experience',
    projects: 'Projects',
    volunteer: 'Volunteer Experience',
    education: 'Education',
};

function App() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTestMode, setIsTestMode] = useState(false);

    const {
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
    } = useResumeForm();

    // Handle test mode toggle
    useEffect(() => {
        if (isTestMode) {
            loadFromData({ basicDetails: testBasicDetails, sections: testSections });
        } else {
            resetToDefaults();
        }
        setPdfUrl(null); // Reset preview when toggling
    }, [isTestMode, loadFromData, resetToDefaults]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            reorderSections(arrayMove(sections, oldIndex, newIndex));
        }
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        setError(null);

        try {
            const result = await compileResume(getResumeData());

            if (result.success && result.pdfBase64) {
                const url = createPdfUrl(result.pdfBase64);
                setPdfUrl(url);
            } else if (!result.success) {
                setError(result.error + (result.details ? ': ' + result.details.join(', ') : ''));
            }
        } catch (err) {
            setError('Failed to compile resume. Please try again.');
            console.error(err);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${basicDetails.firstName}_${basicDetails.lastName}_Resume.pdf`;
            link.click();
        }
    };

    const renderSectionContent = (sectionId: string, content: unknown) => {
        switch (sectionId) {
            case 'profile_summary':
                return (
                    <ProfileSummarySection
                        data={content as ProfileSummaryContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            case 'tech_skills':
                return (
                    <TechSkillsSection
                        data={content as TechSkillsContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            case 'experience':
                return (
                    <ExperienceSection
                        data={content as ExperienceContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            case 'projects':
                return (
                    <ProjectsSection
                        data={content as ProjectsContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            case 'volunteer':
                return (
                    <VolunteerSection
                        data={content as VolunteerContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            case 'education':
                return (
                    <EducationSection
                        data={content as EducationContent}
                        onChange={(c) => updateSection(sectionId, c)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-white">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ATS Resume Builder
                    </h1>
                    <div className="flex items-center gap-6">
                        {/* Test Mode Toggle */}
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${!isTestMode ? 'text-gray-900' : 'text-gray-400'}`}>Normal</span>
                            <button
                                onClick={() => setIsTestMode(!isTestMode)}
                                className={`toggle-switch ${isTestMode ? 'active' : ''}`}
                                aria-label="Toggle test mode"
                            />
                            <span className={`text-sm font-medium ${isTestMode ? 'text-violet-600' : 'text-gray-400'}`}>Test</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Layout */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6 min-h-[calc(100vh-120px)]">
                    {/* Left Panel - Form (60%) */}
                    <div className="w-3/5 overflow-y-auto pr-4 space-y-6">
                        {/* Basic Details - Fixed, not draggable */}
                        <BasicDetailsSection data={basicDetails} onChange={updateBasicDetails} />

                        {/* Draggable Sections */}
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                {sections.map((section) => (
                                    <DraggableSection
                                        key={section.id}
                                        id={section.id}
                                        title={sectionTitles[section.type]}
                                        icon={sectionIcons[section.type]}
                                        visible={section.visible}
                                        onToggleVisibility={() => toggleSectionVisibility(section.id)}
                                    >
                                        {renderSectionContent(section.id, section.content)}
                                    </DraggableSection>
                                ))}
                            </SortableContext>
                        </DndContext>

                        {/* Compile Button */}
                        <div className="sticky bottom-4">
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handleCompile}
                                disabled={!isValid() || isCompiling}
                                className={`w-full py-4 px-6 rounded-xl shadow-lg font-semibold transition-all transform ${isValid() && !isCompiling
                                    ? 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isCompiling ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Compiling...
                                    </span>
                                ) : (
                                    '✨ Compile Resume'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Preview (40%) */}
                    <div className="w-2/5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                        {pdfUrl ? (
                            <>
                                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Preview</span>
                                    <button
                                        onClick={handleDownload}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        ⬇ Download PDF
                                    </button>
                                </div>
                                <div className="flex-1 p-4">
                                    <iframe src={pdfUrl} className="w-full h-full rounded-lg bg-white border border-gray-100" title="Resume Preview" />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-violet-50 rounded-2xl flex items-center justify-center">
                                        <svg className="w-12 h-12 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>PDF Preview</h3>
                                    <p className="text-sm text-gray-500">
                                        Fill in your details and click "Compile Resume" to see your ATS-friendly resume here
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
