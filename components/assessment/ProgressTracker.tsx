'use client';

import { CategoryScore } from '@/lib/supabase/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface ProgressTrackerProps {
  progressPercent: number;
  currentCategory: string | null;
  categoryScores: CategoryScore[];
}

function statusBadge(status: string | null) {
  if (status === 'complete') return <Badge variant="green">Complete</Badge>;
  if (status === 'running') return <Badge variant="indigo">Running</Badge>;
  return <Badge variant="gray">Pending</Badge>;
}

const categoryNames: Record<string, string> = {
  prompt_injection: 'Prompt Injection',
  jailbreak: 'Jailbreak',
};

const owaspTags: Record<string, string> = {
  prompt_injection: 'OWASP LLM01',
  jailbreak: 'OWASP LLM07',
};

export function ProgressTracker({ progressPercent, currentCategory, categoryScores }: ProgressTrackerProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm text-neutral-400 mb-2">
          <span>Overall Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['prompt_injection', 'jailbreak'].map(slug => {
          const score = categoryScores.find(s => s.category_slug === slug);
          const isActive = currentCategory === slug;
          return (
            <Card key={slug} className={`transition-all ${isActive ? 'border-indigo-600' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-white">{categoryNames[slug]}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{owaspTags[slug]}</p>
                </div>
                {statusBadge(score?.status ?? null)}
              </div>
              {score?.score != null && (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{score.score.toFixed(1)}</span>
                  <span className="text-neutral-500 text-sm ml-1">/ 100</span>
                </div>
              )}
              {isActive && score?.status === 'running' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-indigo-400">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running tests...
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
