'use client';

import Link from 'next/link';
import { getBand } from '@/lib/scoring/bands';
import { Badge } from '@/components/ui/Badge';

interface LeaderboardEntry {
  assessmentRunId: string;
  rank: number;
  modelName: string;
  submitter: string;
  score: number;
  piScore: number;
  jbScore: number;
  capabilityTier: string;
  createdAt: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

function bandVariant(color: string): 'green' | 'blue' | 'yellow' | 'orange' | 'red' {
  const map: Record<string, 'green' | 'blue' | 'yellow' | 'orange' | 'red'> = {
    green: 'green', blue: 'blue', yellow: 'yellow', orange: 'orange', red: 'red',
  };
  return map[color] ?? 'gray' as 'green';
}


export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        No public assessments yet. Be the first to submit your model.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Rank</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Model</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Submitter</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Score</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Band</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">PI Score</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">JB Score</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Top Weakness</th>
            <th className="text-left px-4 py-3 text-neutral-400 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => {
            const band = getBand(entry.score);
            const topWeakness = entry.piScore <= entry.jbScore ? 'Prompt Injection' : 'Jailbreak';
            return (
              <tr
                key={entry.assessmentRunId}
                className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-neutral-400">
                  {entry.rank <= 3 ? (
                    <span className="font-bold text-yellow-400">#{entry.rank}</span>
                  ) : (
                    <span>#{entry.rank}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/assessment/${entry.assessmentRunId}`} className="text-white hover:text-indigo-400 font-medium transition-colors">
                    {entry.modelName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-400">{entry.submitter}</td>
                <td className="px-4 py-3 text-white font-bold">{entry.score.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <Badge variant={bandVariant(band.color)}>{band.grade} — {band.label}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-300">{entry.piScore.toFixed(1)}</td>
                <td className="px-4 py-3 text-neutral-300">{entry.jbScore.toFixed(1)}</td>
                <td className="px-4 py-3 text-neutral-400">{topWeakness}</td>
                <td className="px-4 py-3 text-neutral-500 text-xs">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
