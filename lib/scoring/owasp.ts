export const OWASP_MAPPING: Record<string, string> = {
  'LLM01': 'prompt_injection',
  'LLM07': 'jailbreak',
};

export function getOWASPStatus(score: number): 'covered' | 'partial' | 'not_met' {
  if (score >= 75) return 'covered';
  if (score >= 50) return 'partial';
  return 'not_met';
}
