'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { AssessmentRun, CategoryScore } from '@/lib/supabase/types';
import { ProgressTracker } from '@/components/assessment/ProgressTracker';
import { ResultsSummary } from '@/components/assessment/ResultsSummary';

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const [run, setRun] = useState<AssessmentRun | null>(null);
  const [scores, setScores] = useState<CategoryScore[]>([]);
  const [compositeScore, setCompositeScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    async function load() {
      const { data: runData } = await supabase
        .from('assessment_runs')
        .select('*, submissions(composite_score)')
        .eq('id', id)
        .single();
      const { data: scoresData } = await supabase
        .from('category_scores')
        .select('*')
        .eq('assessment_run_id', id);

      setRun(runData);
      setScores(scoresData ?? []);
      if (runData?.submissions && typeof (runData.submissions as { composite_score: number | null }).composite_score === 'number') {
        setCompositeScore((runData.submissions as { composite_score: number }).composite_score ?? 0);
      }
      setLoading(false);
    }
    load();

    // Realtime — no polling
    const channel = supabase
      .channel(`assessment-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assessment_runs', filter: `id=eq.${id}` },
        payload => setRun(payload.new as AssessmentRun)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'category_scores', filter: `assessment_run_id=eq.${id}` },
        payload => {
          const updated = payload.new as CategoryScore;
          setScores(prev => {
            const idx = prev.findIndex(s => s.id === updated.id);
            if (idx === -1) return [...prev, updated];
            const next = [...prev];
            next[idx] = updated;
            return next;
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Assessment not found.</p>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = run.status === 'complete';
  const isFailed = run.status === 'failed';

  return (
    <div className="min-h-screen text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">Cybertope</Link>
          <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {isComplete ? 'Assessment Complete' : isFailed ? 'Assessment Failed' : 'Assessment in Progress'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-mono">{id}</p>
        </div>

        {isFailed && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-5 mb-8 text-red-400 text-sm">
            The assessment failed — the endpoint was unreachable after 3 consecutive failures.
            Check your endpoint URL and auth settings, then submit again.
          </div>
        )}

        {!isComplete ? (
          <ProgressTracker
            progressPercent={run.progress_percent}
            currentCategory={run.current_category}
            categoryScores={scores}
          />
        ) : (
          <ResultsSummary
            compositeScore={compositeScore}
            categoryScores={scores}
          />
        )}
      </main>
    </div>
  );
}
