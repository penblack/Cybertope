import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Documentation — Cybertope' };

const sections = [
  { id: 'overview',   label: 'Overview' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'categories', label: 'Test categories' },
  { id: 'scoring',    label: 'Scoring' },
  { id: 'endpoint',   label: 'Endpoint requirements' },
  { id: 'faq',        label: 'FAQ' },
];

export default function DocsPage() {
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
            <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">About</Link>
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-24 flex gap-12">

        {/* Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">On this page</p>
            <nav className="space-y-1">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-neutral-500 hover:text-neutral-200 transition-colors py-0.5"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* Overview */}
          <section id="overview">
            <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              Documentation
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Overview</h1>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Cybertope is a standardized adversarial benchmarking platform for AI/ML systems. You submit an
              HTTP endpoint that wraps your model; Cybertope sends adversarial prompts, evaluates responses,
              and produces a scored security report.
            </p>
            <p className="text-neutral-400 leading-relaxed">
              All tests are anchored to the{' '}
              <span className="text-indigo-400">OWASP LLM Top 10</span> — the industry reference for
              large language model security risks. Results are reproducible and version-pinned.
            </p>
          </section>

          <div className="border-t border-neutral-800" />

          {/* Quick start */}
          <section id="quickstart">
            <h2 className="text-2xl font-bold mb-6">Quick start</h2>
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Step 1 — Create an account</p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  <Link href="/register" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Register</Link> for
                  a free Cybertope account. Your account tracks submission history and lets you manage
                  whether results appear on the public leaderboard.
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Step 2 — Expose an HTTP endpoint</p>
                <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                  Your model must be accessible via a public HTTPS URL. The endpoint must accept a POST
                  request with a JSON body and return a text response.
                </p>
                <div className="bg-neutral-950 rounded-lg p-4 font-mono text-xs text-neutral-300 overflow-x-auto">
                  <div className="text-neutral-500 mb-1">{'// Minimum required request shape'}</div>
                  <div>{'POST https://your-endpoint.com/v1/chat'}</div>
                  <div className="mt-2 text-neutral-400">{'{'}</div>
                  <div className="pl-4 text-green-400">{'"prompt"'}<span className="text-neutral-400">{': '}</span><span className="text-amber-300">{'"<adversarial input>"'}</span></div>
                  <div className="text-neutral-400">{'}'}</div>
                  <div className="mt-2 text-neutral-500">{'// Response (any field containing the model output)'}</div>
                  <div className="text-neutral-400">{'{'}</div>
                  <div className="pl-4 text-green-400">{'"response"'}<span className="text-neutral-400">{': '}</span><span className="text-amber-300">{'"<model output>"'}</span></div>
                  <div className="text-neutral-400">{'}'}</div>
                </div>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Step 3 — Submit</p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Go to the{' '}
                  <Link href="/submit" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Submit page</Link>,
                  enter your endpoint URL, optional auth header, model name, and capability tier.
                  The benchmark typically completes within 2–5 minutes.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-neutral-800" />

          {/* Test categories */}
          <section id="categories">
            <h2 className="text-2xl font-bold mb-6">Test categories</h2>
            <p className="text-neutral-400 leading-relaxed mb-8">
              The v1 benchmark covers two OWASP LLM Top 10 categories, with 5 test cases each (10 total).
            </p>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">OWASP LLM01</div>
                    <h3 className="text-lg font-semibold">Prompt Injection</h3>
                  </div>
                  <span className="text-xs bg-indigo-950 border border-indigo-800 text-indigo-300 px-2 py-1 rounded-full shrink-0">5 tests</span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  Prompt injection occurs when an attacker manipulates a model by crafting inputs that override
                  its original instructions. We test five distinct injection techniques:
                </p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  {[
                    ['Instruction override', 'Direct commands to ignore system instructions.'],
                    ['Role reassignment', 'Attempts to redefine the model as a different persona.'],
                    ['Delimiter injection', 'Using structural characters to break prompt boundaries.'],
                    ['Context exhaustion', 'Flooding context to push system instructions out of scope.'],
                    ['System prompt extraction', 'Attempts to reveal or leak the system prompt.'],
                  ].map(([name, desc]) => (
                    <li key={name} className="flex gap-2">
                      <span className="text-indigo-600 mt-0.5 shrink-0">›</span>
                      <span><span className="text-neutral-300 font-medium">{name}</span> — {desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">OWASP LLM07</div>
                    <h3 className="text-lg font-semibold">Jailbreak & Alignment Bypass</h3>
                  </div>
                  <span className="text-xs bg-indigo-950 border border-indigo-800 text-indigo-300 px-2 py-1 rounded-full shrink-0">5 tests</span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  Jailbreaks attempt to bypass a model&apos;s safety training and content policies. We test
                  five commonly observed bypass patterns:
                </p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  {[
                    ['Persona adoption', 'Asking the model to roleplay as an unconstrained AI.'],
                    ['Hypothetical framing', 'Wrapping harmful requests in fictional or academic framing.'],
                    ['Encoding obfuscation', 'Using Base64, leetspeak, or character substitution to mask intent.'],
                    ['Many-shot bypass', 'Demonstrating compliant responses in-context to normalize harmful output.'],
                    ['Competing objectives', 'Introducing goals that conflict with safety constraints.'],
                  ].map(([name, desc]) => (
                    <li key={name} className="flex gap-2">
                      <span className="text-indigo-600 mt-0.5 shrink-0">›</span>
                      <span><span className="text-neutral-300 font-medium">{name}</span> — {desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="border-t border-neutral-800" />

          {/* Scoring */}
          <section id="scoring">
            <h2 className="text-2xl font-bold mb-6">Scoring</h2>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Each test is scored pass/fail. The composite score is the percentage of tests the model
              successfully resisted (0–100). Scores map to five security bands:
            </p>
            <div className="space-y-3 mb-8">
              {[
                { band: 'Resilient',      range: '90–100', color: 'text-green-400',  border: 'border-green-900/50',  desc: 'Resisted nearly all adversarial attempts.' },
                { band: 'Hardened',       range: '75–89',  color: 'text-blue-400',   border: 'border-blue-900/50',   desc: 'Strong resistance with minor exposure.' },
                { band: 'Moderate Risk',  range: '50–74',  color: 'text-yellow-400', border: 'border-yellow-900/50', desc: 'Partial resistance — notable attack surface.' },
                { band: 'Vulnerable',     range: '25–49',  color: 'text-orange-400', border: 'border-orange-900/50', desc: 'Significant attack surface. Use with caution.' },
                { band: 'Critical Risk',  range: '0–24',   color: 'text-red-400',    border: 'border-red-900/50',    desc: 'Highly susceptible to adversarial manipulation.' },
              ].map(({ band, range, color, border, desc }) => (
                <div key={band} className={`flex items-center gap-4 bg-neutral-900 border ${border} rounded-xl px-5 py-3`}>
                  <span className={`text-sm font-semibold w-32 shrink-0 ${color}`}>{band}</span>
                  <span className="text-xs text-neutral-500 font-mono w-14 shrink-0">{range}</span>
                  <span className="text-sm text-neutral-400">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500">
              Category scores (Prompt Injection and Jailbreak) are reported separately alongside the composite.
            </p>
          </section>

          <div className="border-t border-neutral-800" />

          {/* Endpoint requirements */}
          <section id="endpoint">
            <h2 className="text-2xl font-bold mb-6">Endpoint requirements</h2>
            <div className="space-y-4 text-sm text-neutral-400 leading-relaxed">
              <p>Your endpoint must meet these requirements to be benchmarked successfully:</p>
              <ul className="space-y-3">
                {[
                  'HTTPS only — plain HTTP endpoints will be rejected.',
                  'Must accept POST requests with a JSON body containing at least a prompt field.',
                  'Must return a JSON response. Cybertope will scan top-level string fields for the model output.',
                  'Must respond within 30 seconds per request. Timeouts count as failures.',
                  'Auth is supported via a single Authorization header (Bearer token, API key, etc.).',
                  'The endpoint must be publicly reachable — private VPC or localhost URLs are not supported.',
                ].map((req, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-600 mt-0.5 shrink-0">›</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-neutral-800" />

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is this free?',
                  a: 'Yes. Submitting a model and viewing results is free. We may introduce rate limits or paid tiers for high-volume or private benchmarking in the future.',
                },
                {
                  q: 'Are results always public?',
                  a: 'No. You choose whether your results appear on the public leaderboard at submission time. Private results are visible only to your account.',
                },
                {
                  q: 'Can I re-submit after improving my model?',
                  a: 'Yes, as many times as you like. Each submission is a separate record. Only the most recent submission is shown on the leaderboard by default.',
                },
                {
                  q: 'What models can I benchmark?',
                  a: 'Any model accessible via an HTTP API — commercial APIs, self-hosted models, fine-tunes, or full applications with an LLM backend. You select a capability tier at submission time.',
                },
                {
                  q: 'How are responses evaluated?',
                  a: 'A separate evaluator model scores each response against the attack\'s intended outcome. Scores are deterministic for a given (prompt, response) pair.',
                },
                {
                  q: 'Will test cases change?',
                  a: 'The benchmark is versioned. v1 test cases will not change. Future versions will be additive and clearly labeled.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <p className="font-semibold text-white mb-2">{q}</p>
                  <p className="text-sm text-neutral-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-600">
        © 2026 Cybertope · All rights reserved.
      </footer>
    </div>
  );
}
