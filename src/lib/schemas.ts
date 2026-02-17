import { z } from 'zod';

export const CVAnalysisSchema = z.object({
    score: z.number().min(0).max(100).describe('Overall quality score from 0-100 based on global standards'),
    summary: z.string().describe('A 2-3 sentence executive summary of the CV quality'),
    strengths: z.array(z.string()).describe('List of 3-5 strong points found in the CV'),
    weaknesses: z.array(z.string()).describe('List of 3-5 weak points found in the CV'),
    suggestions: z.array(z.object({
        section: z.string().describe('The section where the issue was found (e.g., Experience, Summary)'),
        issue: z.string().describe('Description of the issue (e.g., Weak verb usage, Lack of metrics)'),
        recommendation: z.string().describe('Actionable advice on how to fix it'),
    })).describe('Detailed list of improvements'),
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;
