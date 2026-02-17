'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/cv/file-upload';
import { Button } from '@/components/ui/button';
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
          <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            <FileUpload onUploadComplete={setCvText} />
            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => setCvText('')} className="w-full">
              Paste Text Manually
            </Button>
          </div>
        ) : (
          <CVEditor initialText={cvText} onReset={() => setCvText(null)} />
        )}
      </div>
    </main>
  );
}
