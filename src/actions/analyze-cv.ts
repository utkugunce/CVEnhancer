'use server';

import { generateObject } from 'ai';
import { getModel, AIProvider } from '@/lib/ai';
import { CVAnalysisSchema } from '@/lib/schemas';

export async function analyzeCV(text: string, provider: AIProvider = 'openai') {
    if (!text || text.length < 50) {
        throw new Error('Text is too short to analyze.');
    }

    try {
        const model = getModel(provider);
        const { object } = await generateObject({
            model,
            schema: CVAnalysisSchema,
            prompt: `
        You are an expert Technical Recruiter and Resume Strategist with experience at FAANG companies.
        Analyze the following resume text against global best practices (Harvard Resume Guide, Google's XYZ formula).

        Your goal is to provide a critical, constructive analysis.
        
        CRITERIA:
        1. **Impact & Metrics:** Does it use numbers to quantify achievements? (e.g., "Increased sales by 20%" vs "Helped with sales")
        2. **Action Verbs:** Does it start bullet points with strong power verbs? (e.g., "Spearheaded", "Architected" vs "Responsible for")
        3. **Formatting & Structure:** Is it concise, easy to skim, and standard? (Note: You are analyzing raw text, so infer formatting from structure where possible, but focus on content).
        4. **ATS Compliance:** Are there weird characters or unreadable sections?
        5. **STAR Method:** Do the bullet points follow Situation, Task, Action, Result?

        RESUME TEXT:
        ${text}
      `,
        });

        return object;
    } catch (error) {
        console.error('Error analyzing CV:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error analyzing CV:', error);
        throw new Error(`Analysis failed: ${errorMessage}`);
    }
}
