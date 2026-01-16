import { TechSkillsContent, SkillCategory } from '../../types/resume';

interface Props {
    data: TechSkillsContent;
    onChange: (content: TechSkillsContent) => void;
}

export function TechSkillsSection({ data, onChange }: Props) {
    const inputClass = "bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all w-full";

    const addCategory = () => {
        onChange({
            categories: [...data.categories, { name: '', skills: '' }],
        });
    };

    const removeCategory = (index: number) => {
        onChange({
            categories: data.categories.filter((_, i) => i !== index),
        });
    };

    const updateCategory = (index: number, updates: Partial<SkillCategory>) => {
        const newCategories = [...data.categories];
        newCategories[index] = { ...newCategories[index], ...updates };
        onChange({ categories: newCategories });
    };

    return (
        <div className="space-y-4">
            {data.categories.map((category, index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Category (e.g., Programming Languages)"
                            value={category.name}
                            onChange={(e) => updateCategory(index, { name: e.target.value })}
                            className={inputClass}
                        />
                        {data.categories.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeCategory(index)}
                                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Skills (comma-separated: Python, JavaScript, Go)"
                        value={category.skills}
                        onChange={(e) => updateCategory(index, { skills: e.target.value })}
                        className={inputClass}
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={addCategory}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
                + Add skill category
            </button>
        </div>
    );
}
