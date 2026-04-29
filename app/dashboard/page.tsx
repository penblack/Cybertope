import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getBand } from '@/lib/scoring/bands';
import { Submission } from '@/lib/supabase/types';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:  'bg-neutral-800 text-neutral-400',
    running:  'bg-indigo-950 text-indigo-300 border border-indigo-800',
    complete: 'bg-green-950 text-green-400 border border-green-800',
    failed:   'bg-red-950 text-red-400 border border-red-800',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, assessment_runs(id)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">Cybertope</Link>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <form action="/api/auth/signout" method="post">
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-neutral-400 mt-1">{session.user.email}</p>
          </div>
          <Link
            href="/submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            New Assessment
          </Link>
        </div>

        {!submissions || submissions.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
            <p className="text-neutral-400 mb-4">No assessments yet.</p>
            <Link
              href="/submit"
              className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Submit your first model
            </Link>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-400">Model</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Date</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Score</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Band</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {(submissions as (Submission & { assessment_runs: { id: string }[] })[]).map(sub => {
                  const runId = sub.assessment_runs?.[0]?.id;
                  const band = sub.composite_score != null ? getBand(sub.composite_score) : null;
                  return (
                    <tr key={sub.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="px-4 py-3">
                        {runId ? (
                          <Link href={`/assessment/${runId}`} className="text-white hover:text-indigo-400 transition-colors font-medium">
                            {sub.display_name || sub.model_name}
                          </Link>
                        ) : (
                          <span className="font-medium">{sub.display_name || sub.model_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {sub.composite_score != null ? sub.composite_score.toFixed(1) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {band ? (
                          <span className="text-neutral-300">{band.label}</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={sub.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
