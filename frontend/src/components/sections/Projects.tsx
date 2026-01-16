import { ProjectsContent, ProjectEntry } from '../../types/resume';

interface Props {
    data: ProjectsContent;
    onChange: (content: ProjectsContent) => void;
}

export function ProjectsSection({ data, onChange }: Props) {
    const inputClass = "bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all w-full";

    const addEntry = () => {
        onChange({
            entries: [...data.entries, {
                name: '',
                description: [''],
                technologies: '',
                link: '',
                date: '',
            }],
        });
    };

    const removeEntry = (index: number) => {
        onChange({
            entries: data.entries.filter((_, i) => i !== index),
        });
    };

    const updateEntry = (index: number, updates: Partial<ProjectEntry>) => {
        const newEntries = [...data.entries];
        newEntries[index] = { ...newEntries[index], ...updates };
        onChange({ entries: newEntries });
    };

    const addBullet = (entryIndex: number) => {
        const newEntries = [...data.entries];
        newEntries[entryIndex].description.push('');
        onChange({ entries: newEntries });
    };

    const removeBullet = (entryIndex: number, bulletIndex: number) => {
        const newEntries = [...data.entries];
        newEntries[entryIndex].description = newEntries[entryIndex].description.filter((_, i) => i !== bulletIndex);
        onChange({ entries: newEntries });
    };

    const updateBullet = (entryIndex: number, bulletIndex: number, value: string) => {
        const newEntries = [...data.entries];
        newEntries[entryIndex].description[bulletIndex] = value;
        onChange({ entries: newEntries });
    };

    return (
        <div className="space-y-6">
            {data.entries.map((entry, entryIndex) => (
                <div key={entryIndex} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">Project {entryIndex + 1}</span>
                        {data.entries.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEntry(entryIndex)}
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Project Name *"
                            value={entry.name}
                            onChange={(e) => updateEntry(entryIndex, { name: e.target.value })}
                            className={inputClass}
                        />
                        <input
                            type="text"
                            placeholder="Date (e.g., 2024)"
                            value={entry.date}
                            onChange={(e) => updateEntry(entryIndex, { date: e.target.value })}
                            className={inputClass}
                        />
                        <input
                            type="text"
                            placeholder="Technologies (comma-separated)"
                            value={entry.technologies}
                            onChange={(e) => updateEntry(entryIndex, { technologies: e.target.value })}
                            className={inputClass}
                        />
                        <input
                            type="url"
                            placeholder="Project Link (optional)"
                            value={entry.link}
                            onChange={(e) => updateEntry(entryIndex, { link: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-500">Description</span>
                        {entry.description.map((desc, bulletIndex) => (
                            <div key={bulletIndex} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Description ${bulletIndex + 1}`}
                                    value={desc}
                                    onChange={(e) => updateBullet(entryIndex, bulletIndex, e.target.value)}
                                    className={inputClass}
                                />
                                {entry.description.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeBullet(entryIndex, bulletIndex)}
                                        className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addBullet(entryIndex)}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
                        >
                            + Add description
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addEntry}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-all font-medium"
            >
                + Add Project
            </button>
        </div>
    );
}
