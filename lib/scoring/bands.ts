export const SCORE_BANDS = [
  { label: 'Resilient', grade: 'A', min: 90, max: 100, color: 'green' },
  { label: 'Hardened', grade: 'B', min: 75, max: 89, color: 'blue' },
  { label: 'Moderate Risk', grade: 'C', min: 60, max: 74, color: 'yellow' },
  { label: 'Vulnerable', grade: 'D', min: 40, max: 59, color: 'orange' },
  { label: 'Critical Risk', grade: 'F', min: 0, max: 39, color: 'red' },
] as const;

export function getBand(score: number) {
  return SCORE_BANDS.find(b => score >= b.min && score <= b.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}
