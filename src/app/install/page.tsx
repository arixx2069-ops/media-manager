import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Install the app</h2>
        <p className="text-zinc-500 mt-1">
          Use Aeen-iq.Social-manager in <strong className="text-zinc-400">Firefox</strong> or{" "}
          <strong className="text-zinc-400">Chrome</strong> — same website, installable in
          both. No app store required.
        </p>
      </header>

      <p className="text-sm text-zinc-400 mb-6 rounded-lg border border-zinc-800 bg-[#12121a] p-4">
        You can always use the site normally in any browser at your URL. Installing adds a
        home-screen or desktop shortcut and opens it in its own window.
      </p>

      <div className="space-y-6 text-sm text-zinc-300">
        <section className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5">
          <h3 className="font-semibold text-orange-200/90 mb-1 flex items-center gap-2">
            Mozilla Firefox
          </h3>
          <p className="text-xs text-zinc-500 mb-3">Desktop (Windows / Mac / Linux)</p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Open this site in Firefox</li>
            <li>
              Click the <strong className="text-zinc-300">☰ menu</strong> (top right)
            </li>
            <li>
              Choose <strong className="text-zinc-300">Install…</strong> or{" "}
              <strong className="text-zinc-300">Install this site as an app</strong>
            </li>
            <li>Confirm — the app appears in your applications / taskbar</li>
          </ol>
          <p className="text-xs text-zinc-500 mt-4 mb-2">Firefox on Android</p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Open the site in Firefox</li>
            <li>
              Tap <strong className="text-zinc-300">☰</strong> →{" "}
              <strong className="text-zinc-300">Add to Home screen</strong> or{" "}
              <strong className="text-zinc-300">Install</strong>
            </li>
          </ol>
          <p className="text-xs text-zinc-600 mt-3">
            If you don’t see Install, update Firefox to the latest version — older builds
            only support “Add to Home screen” on mobile.
          </p>
        </section>

        <section className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
          <h3 className="font-semibold text-blue-200/90 mb-1">Google Chrome</h3>
          <p className="text-xs text-zinc-500 mb-3">Desktop</p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Open this site in Chrome</li>
            <li>
              Click the <strong className="text-zinc-300">install icon</strong> in the
              address bar, or the sidebar <strong className="text-zinc-300">Install</strong>{" "}
              button when it appears
            </li>
            <li>
              Or: <strong className="text-zinc-300">⋮</strong> →{" "}
              <strong className="text-zinc-300">Install Aeen-iq…</strong>
            </li>
          </ol>
          <p className="text-xs text-zinc-500 mt-4 mb-2">Chrome on Android</p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Open the site in Chrome</li>
            <li>
              <strong className="text-zinc-300">⋮ → Install app</strong> or{" "}
              <strong className="text-zinc-300">Add to Home screen</strong>
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-zinc-700 bg-[#12121a] p-5">
          <h3 className="font-semibold text-zinc-100 mb-2">Just browse (no install)</h3>
          <p className="text-zinc-400">
            Visit the same URL in Firefox or Chrome anytime — bookmark it like any website.
            All features work without installing.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h3 className="font-semibold text-amber-200/90 mb-2">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-300">HTTPS</strong> when live (or{" "}
              <code className="text-indigo-300">localhost</code> while developing)
            </li>
            <li>Firefox and Chrome both read the same app manifest and service worker</li>
            <li>
              After deploy, share one link — teammates pick Firefox or Chrome themselves
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/" className="text-indigo-400 hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
