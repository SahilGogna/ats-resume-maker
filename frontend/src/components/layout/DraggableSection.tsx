import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface Props {
    id: string;
    title: string;
    icon: ReactNode;
    visible: boolean;
    onToggleVisibility: () => void;
    children: ReactNode;
}

export function DraggableSection({ id, title, icon, visible, onToggleVisibility, children }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <section
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${isDragging ? 'ring-2 ring-violet-500' : ''
                }`}
        >
            {/* Header with drag handle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Drag to reorder"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </button>

                    <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                        {icon}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h2>
                </div>

                {/* Visibility Toggle */}
                <button
                    onClick={onToggleVisibility}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${visible
                        ? 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                >
                    {visible ? '✓ Visible' : 'Hidden'}
                </button>
            </div>

            {/* Content */}
            {visible && (
                <div className="p-6">
                    {children}
                </div>
            )}
        </section>
    );
}
