import Link from "next/link";
import { InstallButton } from "@/components/install-button";
import { APP_NAME, APP_SHORT_NAME } from "@/lib/constants";

export default function InstallPage() {
  return (
    <div className="page-shell max-w-2xl mx-auto w-full">
      <header className="mb-8 border-b border-[var(--card-border)] pb-6">
        <p className="eyebrow mb-2">Install</p>
        <h2 className="font-display text-3xl font-medium tracking-tight">Install the app</h2>
        <p className="text-[var(--muted)] mt-2">
          Use {APP_NAME} in <strong className="text-[var(--foreground)]">Firefox</strong> or{" "}
          <strong className="text-[var(--foreground)]">Chrome</strong> — same website, installable in
          both. No app store required.
        </p>
        <div className="mt-5">
          <InstallButton variant="page" />
        </div>
        <p className="text-xs text-[var(--muted)] mt-3">
          In Firefox, the button opens step-by-step instructions (Firefox has no one-click
          install like Chrome).
        </p>
      </header>

      <p className="text-sm text-[var(--muted)] mb-6 editorial-card p-4">
        You can always use the site normally in any browser at your URL. Installing adds a
        home-screen or desktop shortcut and opens it in its own window.
      </p>

      <div className="space-y-6 text-sm text-[var(--foreground)]">
        <section className="editorial-card p-5 border-t-2 border-t-orange-500/50">
          <h3 className="font-display font-medium mb-1 flex items-center gap-2">
            Mozilla Firefox
          </h3>
          <p className="text-xs text-[var(--muted)] mb-3">Desktop (Windows / Mac / Linux)</p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>Open this site in Firefox</li>
            <li>
              Click the <strong className="text-[var(--foreground)]">☰ menu</strong> (top right)
            </li>
            <li>
              Choose <strong className="text-[var(--foreground)]">Install…</strong> or{" "}
              <strong className="text-[var(--foreground)]">Install this site as an app</strong>
            </li>
            <li>Confirm — the app appears in your applications / taskbar</li>
          </ol>
          <p className="text-xs text-[var(--muted)] mt-4 mb-2">Firefox on Android</p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>Open the site in Firefox</li>
            <li>
              Tap <strong className="text-[var(--foreground)]">☰</strong> →{" "}
              <strong className="text-[var(--foreground)]">Add to Home screen</strong> or{" "}
              <strong className="text-[var(--foreground)]">Install</strong>
            </li>
          </ol>
          <p className="text-xs text-[var(--muted)] mt-3 opacity-80">
            If you don’t see Install, update Firefox to the latest version — older builds
            only support “Add to Home screen” on mobile.
          </p>
        </section>

        <section className="editorial-card p-5 border-t-2 border-t-blue-500/50">
          <h3 className="font-display font-medium mb-1">Google Chrome</h3>
          <p className="text-xs text-[var(--muted)] mb-3">Desktop</p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>Open this site in Chrome</li>
            <li>
              Click the <strong className="text-[var(--foreground)]">install icon</strong> in the
              address bar, or use the sidebar <strong className="text-[var(--foreground)]">Install</strong>{" "}
              button
            </li>
            <li>
              Or: <strong className="text-[var(--foreground)]">⋮</strong> →{" "}
              <strong className="text-[var(--foreground)]">Install {APP_SHORT_NAME}…</strong>
            </li>
          </ol>
          <p className="text-xs text-[var(--muted)] mt-4 mb-2">Chrome on Android</p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>Open the site in Chrome</li>
            <li>
              <strong className="text-[var(--foreground)]">⋮ → Install app</strong> or{" "}
              <strong className="text-[var(--foreground)]">Add to Home screen</strong>
            </li>
          </ol>
        </section>

        <section className="editorial-card p-5">
          <h3 className="font-display font-medium mb-2">Just browse (no install)</h3>
          <p className="text-[var(--muted)]">
            Visit the same URL in Firefox or Chrome anytime — bookmark it like any website.
            All features work without installing.
          </p>
        </section>

        <section className="editorial-card p-5 border-t-2 border-t-[var(--gold)]">
          <h3 className="font-display font-medium mb-2">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">HTTPS</strong> when live (or{" "}
              <code className="text-[var(--accent)]">localhost</code> while developing)
            </li>
            <li>Firefox and Chrome both read the same app manifest and service worker</li>
            <li>
              After deploy, share one link — teammates pick Firefox or Chrome themselves
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="text-link">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
