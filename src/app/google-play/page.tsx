export default function GooglePlayPage() {
  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      <header className="mb-8 border-b border-[var(--card-border)] pb-6">
        <p className="eyebrow mb-2">Deploy</p>
        <h2 className="font-display text-3xl font-medium tracking-tight">Google Play deployment</h2>
        <p className="text-[var(--muted)] mt-2">
          Ship SocialMngmnt as an Android app on the Google Play Store
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="editorial-card p-5 border-t-2 border-t-[var(--accent)]">
          <h3 className="font-display font-medium mb-2">
            Recommended path: Trusted Web Activity (TWA)
          </h3>
          <p className="text-[var(--muted)] mb-3">
            This project is a Next.js web app. The fastest way to list on Google Play
            is wrapping your hosted URL in a TWA — a full-screen Chrome tab that feels
            native, without rewriting in Kotlin.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>Deploy the app (Vercel, Google Cloud Run, or Firebase Hosting)</li>
            <li>
              Use{" "}
              <a
                href="https://github.com/GoogleChromeLabs/bubblewrap"
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                Bubblewrap CLI
              </a>{" "}
              to generate an Android project from your URL
            </li>
            <li>Add Digital Asset Links (assetlinks.json) for domain verification</li>
            <li>Build a signed AAB and upload to Google Play Console</li>
            <li>Complete store listing, privacy policy, and content rating</li>
          </ol>
        </section>

        <section className="editorial-card p-5">
          <h3 className="font-display font-medium mb-2">Alternative: Capacitor</h3>
          <p className="text-[var(--muted)]">
            Wrap the static export or WebView with{" "}
            <a
              href="https://capacitorjs.com/"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              Capacitor
            </a>{" "}
            for more native plugins (push notifications, biometrics). Heavier setup,
            better if you need deep device APIs later.
          </p>
        </section>

        <section className="editorial-card p-5">
          <h3 className="font-display font-medium mb-2">Google ecosystem extras</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
            <li>Firebase Auth — sign-in for your team</li>
            <li>Firebase Cloud Messaging — engagement alerts</li>
            <li>Google Cloud Run — host the Next.js server</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
