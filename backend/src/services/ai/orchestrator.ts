import { analyzeCodeFile } from './codeAnalyzer';
import axios from 'axios';

const MODEL_CHAIN = [
  "google/gemini-2.0-flash-lite-001",
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-nemo"
];

export async function orchestrateAnalysis(fileName: string, content: string) {
  // 1. Try Cloud Models First
  for (const model of MODEL_CHAIN) {
    try {
      console.log(`[Orchestrator] Attempting analysis with: ${model}`);
      return await analyzeCodeFile(fileName, content, model);
    } catch (error: any) {
      console.warn(`[Orchestrator] Model ${model} failed: ${error.message}`);
    }
  }

  // 2. Final Fallback: Local Ollama via Ngrok
  const ngrokUrl = process.env.OLLAMA_NGROK_URL;

  if (ngrokUrl) {
    console.log(`[Orchestrator] Cloud models failed. Falling back to local Ollama via Ngrok: ${ngrokUrl}`);
    try {
      const prompt = `You are a senior security engineer. Analyze the code for vulnerabilities. Return ONLY valid JSON format: { "issues": [ { "line_number": number, "severity": "critical" | "high" | "medium" | "low", "issue_type": "string", "message": "string", "description": "string", "fix_suggestion": "string" } ] }. Do not include any conversational text.

File: ${fileName}
Content: ${content}`;

      const response = await axios.post(
        `${ngrokUrl.replace(/\/$/, '')}/api/generate`,
        {
          model: 'gemma:2b',
          prompt: prompt,
          stream: false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      const contentStr = response.data.response || '{"issues": []}';
      const cleanedJson = contentStr.replace(/```json\s*|\s*```/g, '').trim();

      try {
          return JSON.parse(cleanedJson).issues || [];
      } catch (e) {
          console.warn("[Orchestrator] Local model returned invalid JSON.");
          return [];
      }
    } catch (localError: any) {
      console.error(`[Orchestrator] Ngrok fallback failed: ${localError.message}`);
    }
  } else {
    console.warn("[Orchestrator] No OLLAMA_NGROK_URL provided. Skipping local fallback.");
  }

  // 3. If we reach here, absolutely everything failed
  throw new Error("All cloud AI models and local fallbacks are currently unavailable.");
}