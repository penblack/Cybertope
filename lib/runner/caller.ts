import { Submission } from '../supabase/types';

// Blocked IP ranges
const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
];

export function validateEndpointUrl(url: string): { valid: boolean; error?: string } {
  let parsed: URL;
  try { parsed = new URL(url); } catch { return { valid: false, error: 'Invalid URL' }; }
  if (parsed.protocol !== 'https:') return { valid: false, error: 'URL must use HTTPS' };
  const host = parsed.hostname;
  if (BLOCKED_PATTERNS.some(p => p.test(host))) return { valid: false, error: 'Private or local URLs are not allowed' };
  return { valid: true };
}

function getNestedValue(obj: unknown, path: string): string {
  // Support dot notation and array indexing e.g. choices[0].message.content
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : JSON.stringify(current);
}

export async function callEndpoint(
  submission: Pick<Submission, 'endpoint_url' | 'auth_type' | 'auth_value' | 'input_field' | 'output_field'>,
  prompt: string
): Promise<string | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (submission.auth_type === 'bearer' && submission.auth_value) {
    headers['Authorization'] = `Bearer ${submission.auth_value}`;
  } else if (submission.auth_type === 'api_key' && submission.auth_value) {
    headers['x-api-key'] = submission.auth_value;
  }

  const body = { [submission.input_field]: prompt };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const res = await fetch(submission.endpoint_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const json = await res.json();
    return getNestedValue(json, submission.output_field) || null;
  } catch {
    return null;
  }
}
