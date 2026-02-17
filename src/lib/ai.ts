import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const openaiApiKey = process.env.OPENAI_API_KEY;
const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!openaiApiKey) console.warn('Missing OPENAI_API_KEY');
if (!googleApiKey) console.warn('Missing GOOGLE_GENERATIVE_AI_API_KEY');

// Define fetch implementation for Google provider
const customFetch = async (url: string | URL | Request, options: any) => {
    try {
        const { fetch, Agent } = await import('undici');
        const dispatcher = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        });
        // @ts-ignore - undici fetch types mismatch slightly with native fetch
        return fetch(url, { ...options, dispatcher });
    } catch (e) {
        console.error('Failed to use custom fetch, falling back to global fetch', e);
        return fetch(url, options);
    }
};


export const openai = createOpenAI({
    apiKey: openaiApiKey || '',
});

export const google = createGoogleGenerativeAI({
    apiKey: googleApiKey || '',
    // @ts-ignore - The google provider accepts fetch but types might be strict
    fetch: customFetch,
});

export type AIProvider = 'openai' | 'google';

export function getModel(provider: AIProvider) {
    if (provider === 'google') {
        return google('gemini-1.5-pro-latest');
    }
    return openai('gpt-4o');
}
