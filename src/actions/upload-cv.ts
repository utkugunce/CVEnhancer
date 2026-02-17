'use server';

import { parsePDF, parseDOCX } from '@/lib/parsers';

export async function extractTextFromFile(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';

    if (file.type === 'application/pdf') {
        text = await parsePDF(buffer);
    } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        text = await parseDOCX(buffer);
    } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    return { text };
}
