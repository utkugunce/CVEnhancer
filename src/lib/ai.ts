import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Bypass SSL certificate validation for development (local self-signed certs etc.)
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const openaiApiKey = process.env.OPENAI_API_KEY;
const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!openaiApiKey) console.warn('Missing OPENAI_API_KEY');
if (!googleApiKey) console.warn('Missing GOOGLE_GENERATIVE_AI_API_KEY');

export const openai = createOpenAI({
    apiKey: openaiApiKey || '',
});

export const google = createGoogleGenerativeAI({
    apiKey: googleApiKey || '',
});

export type AIProvider = 'openai' | 'google';

export function getModel(provider: AIProvider) {
    if (provider === 'google') {
        return google('gemini-1.5-pro-latest');
    }
    return openai('gpt-4o');
}
