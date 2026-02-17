'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractTextFromFile } from '@/actions/upload-cv';

interface FileUploadProps {
    onUploadComplete: (text: string) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await extractTextFromFile(formData);
            onUploadComplete(result.text);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to parse file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
        multiple: false,
    });

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-4',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                    isUploading && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
            >
                <input {...getInputProps()} />
                <div className="p-4 bg-muted rounded-full">
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium">
                        {isUploading ? 'Parsing your CV...' : 'Drop your CV here or click to upload'}
                    </p>
                    <p className="text-sm text-muted-foreground">Supports PDF and DOCX</p>
                </div>
            </div>
        </div>
    );
}
