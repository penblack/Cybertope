import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Nav */}
      <nav className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cybertope-logo.png"
            alt="Cybertope logo"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="text-lg font-bold tracking-tight">Cybertope</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          Open benchmark · v1
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Standardized adversarial
          <br />
          <span className="text-indigo-400">benchmarking for AI systems</span>
        </h1>

        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Submit your model endpoint. Cybertope runs a standardized suite of prompt injection and
          jailbreak tests, scores the results, and publishes your model&apos;s security posture to
          a public leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            Submit Your Model
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors border border-neutral-700"
          >
            View Leaderboard
          </Link>
        </div>

        {/* What we test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              OWASP LLM01
            </div>
            <h3 className="font-semibold text-white mb-2">Prompt Injection</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              5 test cases covering instruction override, role reassignment, delimiter injection,
              context exhaustion, and system prompt extraction.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              OWASP LLM07
            </div>
            <h3 className="font-semibold text-white mb-2">Jailbreak &amp; Alignment Bypass</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              5 test cases covering persona adoption, hypothetical framing, encoding obfuscation,
              many-shot bypass, and competing objectives.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 text-center text-sm text-neutral-600">
        Cybertope · AI Security Benchmark Platform
      </footer>
    </div>
  );
}