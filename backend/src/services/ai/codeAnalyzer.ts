// backend/src/services/ai/codeAnalyzer.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder',
  defaultHeaders: {
    'HTTP-Referer': 'https://codesage.ai',
    'X-Title': 'CodeSage',
  }
});

export async function analyzeCodeFile(fileName: string, content: string, model: string) {
  try {
    const response = await openai.chat.completions.create({
      model: model, 
      messages: [
        { 
          role: "system", 
          content: "You are a senior security engineer. Analyze the code for vulnerabilities. Return ONLY valid JSON format: { \"issues\": [ { \"line_number\": number, \"severity\": \"critical\" | \"high\" | \"medium\" | \"low\", \"issue_type\": string, \"message\": string, \"description\": string, \"fix_suggestion\": string } ] }. Do not include any conversational text." 
        },
        { 
          role: "user", 
          content: `File: ${fileName}\nContent: ${content}` 
        }
      ],
      temperature: 0.1,
    });

    const contentStr = response.choices[0].message.content || '{"issues": []}';
    const cleanedJson = contentStr.replace(/```json\s*|\s*```/g, '').trim();
    
    return JSON.parse(cleanedJson).issues || [];
  } catch (error) {
    throw error;
  }
}