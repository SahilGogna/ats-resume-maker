import { EducationContent, EducationEntry } from '../../types/resume';

interface Props {
    data: EducationContent;
    onChange: (content: EducationContent) => void;
}

export function EducationSection({ data, onChange }: Props) {
    const inputClass = "bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all w-full";

    const addEntry = () => {
        onChange({
            entries: [...data.entries, {
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
            }],
        });
    };

    const removeEntry = (index: number) => {
        onChange({
            entries: data.entries.filter((_, i) => i !== index),
        });
    };

    const updateEntry = (index: number, updates: Partial<EducationEntry>) => {
        const newEntries = [...data.entries];
        newEntries[index] = { ...newEntries[index], ...updates };
        onChange({ entries: newEntries });
    };

    return (
        <div className="space-y-6">
            {data.entries.map((entry, entryIndex) => (
                <div key={entryIndex} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">Education {entryIndex + 1}</span>
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
                            placeholder="Degree (e.g., Bachelor of Computer Science) *"
                            value={entry.degree}
                            onChange={(e) => updateEntry(entryIndex, { degree: e.target.value })}
                            className={`${inputClass} col-span-2`}
                        />
                        <input
                            type="text"
                            placeholder="Institution Name *"
                            value={entry.institution}
                            onChange={(e) => updateEntry(entryIndex, { institution: e.target.value })}
                            className={`${inputClass} col-span-2`}
                        />
                        <input
                            type="text"
                            placeholder="Start Year (e.g., 2018)"
                            value={entry.startDate}
                            onChange={(e) => updateEntry(entryIndex, { startDate: e.target.value })}
                            className={inputClass}
                        />
                        <input
                            type="text"
                            placeholder="End Year (e.g., 2022 or Expected 2024)"
                            value={entry.endDate}
                            onChange={(e) => updateEntry(entryIndex, { endDate: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addEntry}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-all font-medium"
            >
                + Add Education
            </button>
        </div>
    );
}
