import Link from 'next/link';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getBand } from '@/lib/scoring/bands';

export const revalidate = 60;

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { tier?: string; from?: string; to?: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  let query = supabase
    .from('submissions')
    .select(`
      id,
      display_name,
      model_name,
      composite_score,
      capability_tier,
      created_at,
      is_public,
      users(email),
      assessment_runs(
        id,
        status,
        category_scores(category_slug, score)
      )
    `)
    .eq('is_public', true)
    .eq('status', 'complete')
    .order('composite_score', { ascending: false });

  if (searchParams.tier) query = query.eq('capability_tier', searchParams.tier);
  if (searchParams.from) query = query.gte('created_at', searchParams.from);
  if (searchParams.to) query = query.lte('created_at', searchParams.to + 'T23:59:59');

  const { data: rows } = await query;

  const tierLabels: Record<string, string> = {
    base: 'Base Model',
    instruction_tuned: 'Instruction Tuned',
    full_application: 'Full Application',
  };

  const bandOrder = ['Resilient', 'Hardened', 'Moderate Risk', 'Vulnerable', 'Critical Risk'];

  const entries = (rows ?? []).map((r, idx) => {
    const run = r.assessment_runs?.[0];
    const piScore = run?.category_scores?.find((s: { category_slug: string }) => s.category_slug === 'prompt_injection')?.score ?? null;
    const jbScore = run?.category_scores?.find((s: { category_slug: string }) => s.category_slug === 'jailbreak')?.score ?? null;
    const topWeakness = piScore != null && jbScore != null
      ? (piScore <= jbScore ? 'Prompt Injection' : 'Jailbreak')
      : '—';
    const isAnon = r.display_name === 'anonymous';
    return {
      rank: idx + 1,
      submissionId: r.id as string,
      runId: run?.id as string | undefined,
      name: isAnon ? 'Anonymous' : (r.display_name || r.model_name) as string,
      submitter: isAnon ? 'Anonymous' : ((r.users as unknown as { email: string } | null)?.email ?? '—'),
      score: r.composite_score as number,
      tier: tierLabels[r.capability_tier as string] ?? r.capability_tier as string,
      piScore,
      jbScore,
      topWeakness,
      date: new Date(r.created_at as string).toLocaleDateString(),
    };
  });

  const byBand = bandOrder.map(label => ({
    label,
    rows: entries.filter(e => getBand(e.score).label === label),
  })).filter(g => g.rows.length > 0);

  return (
    <div className="min-h-screen text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">Cybertope</Link>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Submit Model
            </Link>
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-sm text-neutral-400 mt-1">Ranked by composite security score</p>
          </div>

          {/* Filters */}
          <form className="flex items-center gap-3">
            <select
              name="tier"
              defaultValue={searchParams.tier ?? ''}
              className="bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Tiers</option>
              <option value="base">Base Model</option>
              <option value="instruction_tuned">Instruction Tuned</option>
              <option value="full_application">Full Application</option>
            </select>
            <input
              type="date"
              name="from"
              defaultValue={searchParams.from ?? ''}
              className="bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              name="to"
              defaultValue={searchParams.to ?? ''}
              className="bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-neutral-700 hover:bg-neutral-600 text-sm text-white px-4 py-2 rounded-lg transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {entries.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center text-neutral-400">
            No results yet.{' '}
            <Link href="/submit" className="text-indigo-400 hover:text-indigo-300">
              Submit the first model.
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {byBand.map(group => {
              const band = getBand(group.rows[0].score);
              const bandColors: Record<string, string> = {
                green:  'text-green-400 border-green-900/50',
                blue:   'text-blue-400 border-blue-900/50',
                yellow: 'text-yellow-400 border-yellow-900/50',
                orange: 'text-orange-400 border-orange-900/50',
                red:    'text-red-400 border-red-900/50',
              };
              return (
                <div key={group.label}>
                  <h2 className={`text-sm font-semibold mb-3 ${bandColors[band.color]?.split(' ')[0] ?? 'text-neutral-300'}`}>
                    {group.label}
                  </h2>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-800 text-left">
                          <th className="px-4 py-3 font-medium text-neutral-400 w-12">#</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Model</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Submitter</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Score</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Band</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">PI</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">JB</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Weakness</th>
                          <th className="px-4 py-3 font-medium text-neutral-400">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map(row => (
                          <tr
                            key={row.submissionId}
                            className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors cursor-pointer"
                            onClick={() => row.runId && (window.location.href = `/assessment/${row.runId}`)}
                          >
                            <td className="px-4 py-3 text-neutral-500">{row.rank}</td>
                            <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                            <td className="px-4 py-3 text-neutral-400">{row.submitter}</td>
                            <td className="px-4 py-3 font-semibold text-white">{row.score.toFixed(1)}</td>
                            <td className="px-4 py-3 text-neutral-300">{group.label}</td>
                            <td className="px-4 py-3 text-neutral-300">{row.piScore?.toFixed(1) ?? '—'}</td>
                            <td className="px-4 py-3 text-neutral-300">{row.jbScore?.toFixed(1) ?? '—'}</td>
                            <td className="px-4 py-3 text-neutral-400">{row.topWeakness}</td>
                            <td className="px-4 py-3 text-neutral-500">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
