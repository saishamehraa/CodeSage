//backend/src/services/ai/codeAnalyzer.ts
import OpenAI from 'openai';

// FIX 1: Add customApiKey as an optional parameter
export async function analyzeCodeFile(fileName: string, content: string, model: string, customApiKey?: string) {
  
  // FIX 2: Dynamically create the client using the custom key or fallback to .env
  const activeKey = customApiKey || process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder';
  
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: activeKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://codesage.ai',
      'X-Title': 'CodeSage',
    }
  });

  try {
    const response = await openai.chat.completions.create({
      model: model, 
      messages: [
        { 
          role: "system", 
          content: "You are a senior security engineer. Analyze the code for vulnerabilities. Return ONLY valid JSON format: { \"issues\": [ { \"line_number\": number, \"severity\": \"critical\" | \"high\" | \"medium\" | \"low\", \"issue_type\": string, \"message\": string, \"description\": string, \"fix_suggestion\": string } ] }. Do not include any conversational text. Keep explanations concise to avoid token limits." 
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
    
    try {
      // JSON Safety Net: Catch "Unterminated string" errors
      const parsed = JSON.parse(cleanedJson);
      return parsed.issues || [];
    } catch (parseError) {
      console.warn(`[Analyzer] JSON parse failed for model ${model}. Cut off output.`);
      throw new Error("Invalid or incomplete JSON returned by model."); 
    }
    
  } catch (error) {
    throw error; // Bubbles up to Orchestrator
  }
}