export default function GooglePlayPage() {
  return (
    <div className="p-8 max-w-3xl prose prose-invert prose-zinc max-w-none">
      <header className="mb-8 not-prose">
        <h2 className="text-2xl font-semibold">Google Play deployment</h2>
        <p className="text-zinc-500 mt-1">
          Ship SocialMngmnt as an Android app on the Google Play Store
        </p>
      </header>

      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed not-prose">
        <section className="rounded-xl border border-zinc-800 bg-[#12121a] p-5">
          <h3 className="font-semibold text-zinc-100 mb-2">
            Recommended path: Trusted Web Activity (TWA)
          </h3>
          <p className="text-zinc-400 mb-3">
            This project is a Next.js web app. The fastest way to list on Google Play
            is wrapping your hosted URL in a TWA — a full-screen Chrome tab that feels
            native, without rewriting in Kotlin.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Deploy the app (Vercel, Google Cloud Run, or Firebase Hosting)</li>
            <li>
              Use{" "}
              <a
                href="https://github.com/GoogleChromeLabs/bubblewrap"
                className="text-indigo-400 hover:underline"
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

        <section className="rounded-xl border border-zinc-800 bg-[#12121a] p-5">
          <h3 className="font-semibold text-zinc-100 mb-2">Alternative: Capacitor</h3>
          <p className="text-zinc-400">
            Wrap the static export or WebView with{" "}
            <a
              href="https://capacitorjs.com/"
              className="text-indigo-400 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Capacitor
            </a>{" "}
            for more native plugins (push notifications, biometrics). Heavier setup,
            better if you need deep device APIs later.
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-[#12121a] p-5">
          <h3 className="font-semibold text-zinc-100 mb-2">Google ecosystem extras</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Firebase Auth — sign-in for your team</li>
            <li>Firebase Cloud Messaging — engagement alerts</li>
            <li>Google Cloud Run — host the Next.js server</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
