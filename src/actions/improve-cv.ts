'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel, AIProvider } from '@/lib/ai';

const ImprovementSchema = z.object({
    original: z.string(),
    improved: z.string(),
    explanation: z.string(),
});

export async function improveText(text: string, context: string = 'bullet point', provider: AIProvider = 'openai') {
    if (!text || text.length < 5) return null;

    try {
        const model = getModel(provider);
        const { object } = await generateObject({
            model,
            schema: ImprovementSchema,
            prompt: `
        You are an expert Resume Writer.
        Rewrite the following ${context} to be more impactful, concise, and result-oriented.
        Follow the Google 'XYZ' formula (Accomplished [X] as measured by [Y], by doing [Z]) and the STAR method.
        
        RULES:
        1. Start with a strong power verb (e.g., Engineered, Spearheaded, Optimized).
        2. Quantify results where possible. If numbers are missing, intelligently estimate or add a placeholder like "[X]%" or "[Y] users" for the user to fill in.
        3. Remove fluff and passive voice.
        4. Target: FAANG / Tier-1 Tech Companies.

        TEXT TO IMPROVE:
        "${text}"
      `,
        });

        return object;
    } catch (error) {
        console.error('Error improving text:', error);
        throw new Error('Failed to improve text.');
    }
}
