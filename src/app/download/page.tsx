import Link from "next/link";

const APK_URL =
  "https://github.com/jerrytheking45/rich-dadie/releases/latest/download/rediq.apk";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt="REDIQ"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
          >
            Back to website
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-16 sm:py-20">
          <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F7C948]/20 bg-[#F7C948]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F7C948]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7C948]" />
                Android App
              </div>

              <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Take REDIQ
                <span className="block text-[#F7C948]">with you.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                Access your investments, track your portfolio, manage your
                account, and stay connected with REDIQ directly from your
                Android device.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={APK_URL}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F7C948] px-6 py-3.5 text-sm font-black text-[#050B18] shadow-lg shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] hover:shadow-[#F7C948]/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 3.5 18 12 6 20.5V3.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Download APK
                </a>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3.5 text-sm font-bold text-white/80 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Sign in on web
                </Link>
              </div>

              <p className="mt-4 text-xs text-white/35">
                Android APK • Official REDIQ application
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-10 rounded-full bg-[#F7C948]/5 blur-3xl" />

              <div className="relative mx-auto rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-3 shadow-2xl">
                <div className="rounded-[2rem] border border-white/10 bg-[#07182F] px-5 py-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7C948] shadow-lg shadow-[#F7C948]/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-7 w-7 text-[#050B18]"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 8.5h10M8 6l-1.5-2M16 6l1.5-2M8 17v2.5M16 17v2.5M5.5 9v5.5A2.5 2.5 0 0 0 8 17h8a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 16 6H8a2.5 2.5 0 0 0-2.5 3Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h2 className="mt-6 text-center text-xl font-black">
                    REDIQ Android
                  </h2>

                  <p className="mt-2 text-center text-sm leading-6 text-white/50">
                    Your investment platform, wherever you go.
                  </p>

                  <div className="mt-7 space-y-3">
                    {[
                      "View your investment portfolio",
                      "Manage your account",
                      "Track deposits and withdrawals",
                      "Stay connected with REDIQ",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7C948]/10 text-[#F7C948]">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="m5 10 3 3 7-7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>

                        <span className="text-xs font-medium text-white/65">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-xl font-black sm:text-2xl">
              How to install the app
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Download",
                  text: "Tap Download APK and save the REDIQ application to your Android device.",
                },
                {
                  number: "02",
                  title: "Allow installation",
                  text: "If prompted, allow your browser to install applications from this source.",
                },
                {
                  number: "03",
                  title: "Open REDIQ",
                  text: "Install the app, open REDIQ, and sign in with your account.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-white/7 bg-white/[0.025] p-5"
                >
                  <span className="text-xs font-black tracking-[0.15em] text-[#F7C948]">
                    {step.number}
                  </span>

                  <h3 className="mt-3 font-bold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 py-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} REDIQ. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
