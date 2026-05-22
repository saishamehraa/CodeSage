//src/app/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

export function getSeverityLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 90) return 'low';
  if (score >= 75) return 'medium';
  if (score >= 60) return 'high';
  return 'critical';
}

export function getStatusFromScores(
  securityScore: number,
  reliabilityScore: number,
  criticalIssues: number
): 'pass' | 'warn' | 'block' {
  if (criticalIssues > 5 || securityScore < 60) return 'block';
  if (criticalIssues > 0 || securityScore < 75) return 'warn';
  return 'pass';
}

export function calculateOverallScore(
  security: number,
  reliability: number,
  maintainability: number
): number {
  return Math.round((security + reliability + maintainability) / 3);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function getLanguageFromFile(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'cs': 'csharp',
  };
  return langMap[ext || ''] || 'plaintext';
}

export function getCveUrl(cve: string): string {
  return `https://nvd.nist.gov/vuln/detail/${cve}`;
}

export function getGithubAdvisoryUrl(packageName: string): string {
  return `https://github.com/advisories?query=${encodeURIComponent(packageName)}`;
}
