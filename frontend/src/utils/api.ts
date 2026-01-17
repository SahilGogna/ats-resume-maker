import { ResumeData, ApiResponse } from '../types/resume';

// Use environment variable for production, fallback to local proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function compileResume(data: ResumeData): Promise<ApiResponse> {
    // Transform data to match API format (remove 'id' and 'visible' fields)
    const payload = {
        basicDetails: data.basicDetails,
        sections: data.sections
            .filter(s => s.visible)
            .map(({ type, content }) => ({ type, content })),
    };

    const response = await fetch(`${API_BASE_URL}/compile-resume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export function downloadPDF(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

export function createPdfUrl(base64: string): string {
    const blob = base64ToBlob(base64, 'application/pdf');
    return URL.createObjectURL(blob);
}
