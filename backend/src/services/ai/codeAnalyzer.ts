// backend/src/services/ai/codeAnalyzer.ts
import OpenAI from 'openai';

// Initialize the client once. 
// We use a dummy key fallback to prevent SDK initialization errors.
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder',
  defaultHeaders: {
    'HTTP-Referer': 'https://codesage.ai',
    'X-Title': 'CodeSage',
  }
});

/**
 * Analyzes code using a specific model provided by the orchestrator.
 * @param fileName - Name of the file being scanned
 * @param content - Source code content
 * @param model - The OpenRouter model ID to use
 */
export async function analyzeCodeFile(fileName: string, content: string, model: string) {
  try {
    const response = await openai.chat.completions.create({
      model: model, 
      messages: [
        { 
          role: "system", 
          content: "You are a senior security engineer. Analyze code for vulnerabilities. Return ONLY JSON structure: { \"issues\": [ { \"line_number\": number, \"severity\": \"critical\" | \"high\" | \"medium\" | \"low\", \"issue_type\": string, \"message\": string, \"description\": string, \"fix_suggestion\": string } ] }." 
        },
        { 
          role: "user", 
          content: `File: ${fileName}\nContent: ${content}` 
        }
      ],
      temperature: 0.1,
    });

    const contentStr = response.choices[0].message.content || '{"issues": []}';
    // Robustly strip markdown blocks if present
    const cleanedJson = contentStr.replace(/```json\s*|\s*```/g, '').trim();
    
    const parsed = JSON.parse(cleanedJson);
    return parsed.issues || [];
  } catch (error) {
    // Re-throw the error so the orchestrator knows to switch models
    throw error;
  }
}