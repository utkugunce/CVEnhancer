'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/cv/file-upload';
import { CVEditor } from '@/components/cv/cv-editor';

export default function Home() {
  const [cvText, setCvText] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-background text-foreground">
      <div className="z-10 w-full max-w-7xl items-center justify-between text-sm flex-col space-y-8">
        {!cvText && (
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              CV Improver AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
              Upload your resume and let our AI analyze, rewrite, and optimize it for global standards and ATS compliance.
            </p>
          </div>
        )}

        {!cvText ? (
          <FileUpload onUploadComplete={setCvText} />
        ) : (
          <CVEditor initialText={cvText} onReset={() => setCvText(null)} />
        )}
      </div>
    </main>
  );
}
