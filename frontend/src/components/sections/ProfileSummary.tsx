import { ProfileSummaryContent } from '../../types/resume';

interface Props {
    data: ProfileSummaryContent;
    onChange: (content: ProfileSummaryContent) => void;
}

export function ProfileSummarySection({ data, onChange }: Props) {
    const inputClass = "bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all w-full";
    const buttonClass = "px-3 py-1.5 text-sm font-medium rounded-lg transition-all";

    const addBullet = () => {
        onChange({
            ...data,
            bullets: [...(data.bullets || []), ''],
        });
    };

    const removeBullet = (index: number) => {
        onChange({
            ...data,
            bullets: (data.bullets || []).filter((_, i) => i !== index),
        });
    };

    const updateBullet = (index: number, value: string) => {
        const newBullets = [...(data.bullets || [])];
        newBullets[index] = value;
        onChange({ ...data, bullets: newBullets });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    type="button"
                    className={`${buttonClass} ${data.format === 'paragraph' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => onChange({ ...data, format: 'paragraph' })}
                >
                    Paragraph
                </button>
                <button
                    type="button"
                    className={`${buttonClass} ${data.format === 'bullets' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => onChange({ ...data, format: 'bullets' })}
                >
                    Bullet Points
                </button>
            </div>

            {data.format === 'paragraph' ? (
                <textarea
                    placeholder="Write a brief professional summary..."
                    value={data.text || ''}
                    onChange={(e) => onChange({ ...data, text: e.target.value })}
                    className={`${inputClass} min-h-[100px] resize-y`}
                    maxLength={500}
                />
            ) : (
                <div className="space-y-2">
                    {(data.bullets || ['']).map((bullet, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                placeholder={`Bullet point ${index + 1}`}
                                value={bullet}
                                onChange={(e) => updateBullet(index, e.target.value)}
                                className={inputClass}
                            />
                            {(data.bullets?.length || 0) > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBullet(index)}
                                    className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addBullet}
                        className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                        + Add bullet point
                    </button>
                </div>
            )}
        </div>
    );
}
