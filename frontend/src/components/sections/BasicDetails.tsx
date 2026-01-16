import { BasicDetails } from '../../types/resume';

interface Props {
    data: BasicDetails;
    onChange: (updates: Partial<BasicDetails>) => void;
}

export function BasicDetailsSection({ data, onChange }: Props) {
    const inputClass = "bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all w-full";

    return (
        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </span>
                Basic Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="First Name *"
                    value={data.firstName}
                    onChange={(e) => onChange({ firstName: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="text"
                    placeholder="Last Name *"
                    value={data.lastName}
                    onChange={(e) => onChange({ lastName: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="email"
                    placeholder="Email *"
                    value={data.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="text"
                    placeholder="City *"
                    value={data.city}
                    onChange={(e) => onChange({ city: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="text"
                    placeholder="Province *"
                    value={data.province}
                    onChange={(e) => onChange({ province: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="url"
                    placeholder="GitHub URL"
                    value={data.github}
                    onChange={(e) => onChange({ github: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={data.linkedin}
                    onChange={(e) => onChange({ linkedin: e.target.value })}
                    className={inputClass}
                />
                <input
                    type="url"
                    placeholder="Portfolio URL"
                    value={data.portfolio}
                    onChange={(e) => onChange({ portfolio: e.target.value })}
                    className={inputClass}
                />
            </div>
        </section>
    );
}
