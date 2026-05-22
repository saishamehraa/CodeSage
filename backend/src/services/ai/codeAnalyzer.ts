// backend/src/services/ai/codeAnalyzer.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeCodeFile(fileName: string, content: string) {
  const prompt = `
    You are an elite enterprise DevSecOps AI. Analyze the following code for OWASP vulnerabilities, runtime risks, and logic bugs.
    Return ONLY a JSON object with an array of "issues". Each issue must have:
    - line_number (integer)
    - severity ("critical", "high", "medium", "low")
    - issue_type (string, e.g., "SQL Injection", "Hardcoded Secret")
    - message (string, brief summary)
    - description (string, detailed explanation)
    - fix_suggestion (string, actionable code fix)
    
    File: ${fileName}
    Content:
    ${content}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const parsed = JSON.parse(response.choices[0].message.content || '{"issues": []}');
  return parsed.issues || [];
}