import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'About — Cybertope' };

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/cybertope-logo.png" alt="Cybertope logo" width={28} height={28} className="h-7 w-7" priority />
            <span className="text-lg font-bold tracking-tight">Cybertope</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition-colors">Docs</Link>
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-20 pb-24">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            About
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            The standard for AI security auditing
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed">
            Cybertope is an open benchmark platform that tests AI systems against adversarial prompts and
            publishes results transparently — so developers, researchers, and buyers can make informed decisions
            about the models they deploy.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-4">Why this exists</h2>
          <div className="space-y-4 text-neutral-400 leading-relaxed">
            <p>
              As AI systems become embedded in critical infrastructure, customer-facing products, and automated
              decision-making pipelines, their resistance to adversarial manipulation matters more than ever. Yet
              there is no agreed-upon, reproducible way to measure it.
            </p>
            <p>
              Cybertope fills that gap. We run a fixed, versioned suite of prompt injection and jailbreak tests
              against any model endpoint you provide — and score the results using a standardized rubric anchored
              to the OWASP LLM Top 10.
            </p>
            <p>
              Results are published to a public leaderboard. No black boxes, no pay-to-play rankings.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6">How it works</h2>
          <div className="grid gap-4">
            {[
              {
                step: '01',
                title: 'Submit your endpoint',
                body: 'Provide a model API endpoint and optional auth header. We support any HTTP API that accepts a prompt and returns a text response.',
              },
              {
                step: '02',
                title: 'We run the benchmark',
                body: 'Cybertope sends 10 standardized adversarial prompts across two OWASP categories — 5 prompt injection tests and 5 jailbreak tests.',
              },
              {
                step: '03',
                title: 'Responses are scored',
                body: 'Each response is evaluated for whether the model resisted the attack. Scores are aggregated into a composite security rating from 0–100.',
              },
              {
                step: '04',
                title: 'Results are published',
                body: 'Your model receives a security band (Resilient → Critical Risk) and is listed on the public leaderboard if you opt in.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <span className="text-2xl font-bold text-indigo-800 tabular-nums shrink-0">{step}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6">Principles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Open', body: 'Test cases are documented and versioned. You know exactly what we test.' },
              { title: 'Reproducible', body: 'The same endpoint submitted twice will produce the same score.' },
              { title: 'Independent', body: 'We have no financial relationship with model vendors. Scores cannot be purchased.' },
            ].map(({ title, body }) => (
              <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">{title}</div>
                <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-950 border border-indigo-800 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Ready to benchmark your model?</h2>
          <p className="text-sm text-neutral-400 mb-6">Submit an endpoint and get your security score in minutes.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Submit a model
            </Link>
            <Link href="/docs" className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700">
              Read the docs
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-600">
        © 2026 Cybertope · All rights reserved.
      </footer>
    </div>
  );
}
