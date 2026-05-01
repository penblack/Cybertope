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

      {/* Wave divider — composition sits inside here at bottom: 0 */}
      <div style={{ lineHeight: 0, marginBottom: '-1px', position: 'relative' }}>
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '80px' }}
        >
          <path
            d="M0,32 C180,72 360,8 540,40 C720,72 900,8 1080,40 C1260,72 1380,24 1440,32 L1440,80 L0,80 Z"
            fill="#08060f"
          />
        </svg>

        {/* Beetle rolling ball — sitting on the dune at 20% from left */}
        <div
          className="footer-mascot-group"
          style={{
            position: 'absolute',
            left: '20%',
            bottom: 0,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '4px',
          }}
        >
          {/* Icosahedral ball — 60px */}
          <svg
            viewBox="0 0 100 100"
            width="60"
            height="60"
            className="footer-mascot-spin"
            style={{ flexShrink: 0 }}
          >
            <circle cx="50" cy="50" r="47" fill="#120d22" />
            <path d="M50,10 A40,40 0 0,1 85,30 L72,38 A25,25 0 0,0 50,25 Z" fill="#9088ec" />
            <path d="M85,30 A40,40 0 0,1 85,70 L72,62 A25,25 0 0,0 72,38 Z" fill="#7060d8" />
            <path d="M85,70 A40,40 0 0,1 50,90 L50,75 A25,25 0 0,0 72,62 Z" fill="#5848c0" />
            <path d="M50,90 A40,40 0 0,1 15,70 L28,62 A25,25 0 0,0 50,75 Z" fill="#3d2fa0" />
            <path d="M15,70 A40,40 0 0,1 15,30 L28,38 A25,25 0 0,0 28,62 Z" fill="#4840b0" />
            <path d="M15,30 A40,40 0 0,1 50,10 L50,25 A25,25 0 0,0 28,38 Z" fill="#6858d0" />
            <line x1="50" y1="10" x2="50" y2="25" stroke="#c0b8ff" strokeWidth="0.8" opacity="0.55" />
            <line x1="85" y1="30" x2="72" y2="38" stroke="#9080e0" strokeWidth="0.8" opacity="0.45" />
            <line x1="85" y1="70" x2="72" y2="62" stroke="#6858c0" strokeWidth="0.8" opacity="0.35" />
            <line x1="50" y1="90" x2="50" y2="75" stroke="#4838a0" strokeWidth="0.8" opacity="0.35" />
            <line x1="15" y1="70" x2="28" y2="62" stroke="#4838a8" strokeWidth="0.8" opacity="0.35" />
            <line x1="15" y1="30" x2="28" y2="38" stroke="#7060c8" strokeWidth="0.8" opacity="0.45" />
            <circle cx="50" cy="50" r="25" fill="#0d0914" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#6d5fd4" strokeWidth="1.2" opacity="0.65" />
            <circle cx="50" cy="50" r="47" fill="none" stroke="#5040b8" strokeWidth="0.5" opacity="0.3" />
            <ellipse cx="37" cy="20" rx="10" ry="5" fill="white" opacity="0.1" transform="rotate(-25 37 20)" />
          </svg>

          {/* Beetle — flipped to face left toward the ball */}
          <img
            src="/beetle-logo.png"
            alt=""
            aria-hidden="true"
            style={{
              height: '70px',
              width: 'auto',
              opacity: 0.88,
              flexShrink: 0,
              transform: 'scaleX(-1)',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: 'linear-gradient(to bottom, #08060f 0%, #060410 100%)',
          position: 'relative',
        }}
      >

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          {/* Main row */}
          <div className="flex flex-wrap items-start justify-between gap-8 mb-8">

            {/* Left: brand + tagline */}
            <div style={{ minWidth: '180px' }}>
              <span className="text-sm font-semibold text-neutral-200">Cybertope</span>
              <p className="text-xs text-neutral-500 mt-1">AI Security Benchmark Platform</p>
            </div>

            {/* Center: nav links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-500 justify-center">
              <Link href="/leaderboard" className="hover:text-neutral-300 transition-colors">Leaderboard</Link>
              <Link href="/submit" className="hover:text-neutral-300 transition-colors">Submit Model</Link>
              <Link href="#" className="hover:text-neutral-300 transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-neutral-300 transition-colors">About</Link>
            </div>

            {/* Right: social icons */}
            <div className="flex items-center gap-4" style={{ minWidth: '120px', justifyContent: 'flex-end' }}>
              <a
                href="https://github.com/penblack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-300 transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-neutral-300 transition-colors"
                aria-label="Discord"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-neutral-300 transition-colors"
                aria-label="Twitter / X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.737l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-neutral-800/40" />

          <p className="text-center text-xs text-neutral-600 mt-6">
            © 2026 Cybertope · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}