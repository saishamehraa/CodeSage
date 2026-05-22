// backend/src/services/ai/codeAnalyzer.ts
import OpenAI from 'openai';

// OpenRouter is 100% compatible with the OpenAI SDK
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY, 
  defaultHeaders: {
    'HTTP-Referer': 'https://codesage.ai', 
    'X-Title': 'CodeSage',
  }
});

export async function analyzeCodeFile(fileName: string, content: string) {
  // We use a high-performance open model available on OpenRouter
  // e.g., 'meta-llama/llama-3.1-70b-instruct' or 'mistralai/mistral-nemo'
  const response = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct:free", 
    messages: [
      { role: "system", content: "You are a senior security engineer. Analyze code for vulnerabilities. Return ONLY JSON." },
      { role: "user", content: `File: ${fileName}\nContent: ${content}` }
    ],
    // OpenRouter models handle JSON mode via structured prompting 
    // or specific model capabilities
    temperature: 0.1,
  });

  const contentStr = response.choices[0].message.content || '{"issues": []}';
  // If the model adds markdown code blocks, strip them
  const cleanedJson = contentStr.replace(/```json|```/g, '');
  return JSON.parse(cleanedJson).issues || [];
}