'use client';

import { CategoryScore } from '@/lib/supabase/types';
import { getBand } from '@/lib/scoring/bands';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ResultsSummaryProps {
  compositeScore: number;
  categoryScores: CategoryScore[];
}

function bandVariant(color: string): 'green' | 'blue' | 'yellow' | 'orange' | 'red' {
  const map: Record<string, 'green' | 'blue' | 'yellow' | 'orange' | 'red'> = {
    green: 'green',
    blue: 'blue',
    yellow: 'yellow',
    orange: 'orange',
    red: 'red',
  };
  return map[color] ?? 'gray' as 'green';
}

function owaspStatusIcon(status: string | null) {
  if (status === 'covered') return '✅';
  if (status === 'partial') return '⚠️';
  return '❌';
}

const categoryLabels: Record<string, string> = {
  prompt_injection: 'Prompt Injection',
  jailbreak: 'Jailbreak',
};

export function ResultsSummary({ compositeScore, categoryScores }: ResultsSummaryProps) {
  const band = getBand(compositeScore);
  const piScore = categoryScores.find(s => s.category_slug === 'prompt_injection');
  const jbScore = categoryScores.find(s => s.category_slug === 'jailbreak');

  const lowestCategory = (piScore?.score ?? 0) <= (jbScore?.score ?? 0) ? 'prompt_injection' : 'jailbreak';

  const remediation = lowestCategory === 'prompt_injection'
    ? 'Implement system prompt hardening. Use XML-style delimiters and instruction anchoring.'
    : 'Strengthen alignment fine-tuning. Implement output filtering for known jailbreak patterns.';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="space-y-8">
      {/* Composite Score */}
      <Card className="text-center">
        <p className="text-sm text-neutral-400 mb-2">Composite Score</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-7xl font-bold text-white">{compositeScore.toFixed(1)}</span>
        </div>
        <div className="mt-3 flex justify-center">
          <Badge variant={bandVariant(band.color)} className="text-sm px-3 py-1">
            {band.grade} — {band.label}
          </Badge>
        </div>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryScores.map(cs => {
          const catBand = getBand(cs.score ?? 0);
          return (
            <Card key={cs.id}>
              <h3 className="font-medium text-white mb-1">{categoryLabels[cs.category_slug]}</h3>
              <p className="text-xs text-neutral-500 mb-3">{cs.owasp_tag}</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{(cs.score ?? 0).toFixed(1)}</span>
                <Badge variant={bandVariant(catBand.color)}>{catBand.grade}</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* OWASP Table */}
      <Card padding={false}>
        <div className="p-4 border-b border-neutral-800">
          <h3 className="font-medium text-white">OWASP LLM Top 10 Coverage</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Framework</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Coverage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 text-neutral-300">OWASP LLM01 — Prompt Injection</td>
              <td className="px-4 py-3">{owaspStatusIcon(piScore?.owasp_status ?? null)}</td>
              <td className="px-4 py-3 text-neutral-300">{(piScore?.score ?? 0).toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-300">OWASP LLM07 — System Prompt Leakage</td>
              <td className="px-4 py-3">{owaspStatusIcon(jbScore?.owasp_status ?? null)}</td>
              <td className="px-4 py-3 text-neutral-300">{(jbScore?.score ?? 0).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Remediation */}
      <Card>
        <h3 className="font-medium text-white mb-2">Remediation Recommendation</h3>
        <p className="text-sm text-neutral-400 mb-1">
          Lowest scoring category: <span className="text-neutral-200">{categoryLabels[lowestCategory]}</span>
        </p>
        <p className="text-sm text-neutral-300 mt-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
          {remediation}
        </p>
      </Card>

      {/* Share */}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={handleShare}>
          Share Results
        </Button>
      </div>
    </div>
  );
}
