
import Link from "next/link";
import TermsBackButton from "./TermsBackButton";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  ShieldCheck,
  ScrollText,
} from "lucide-react";

/* ==========================================
   PAGE METADATA
========================================== */

export const metadata = {
  title: "Terms & Conditions | REDIQ",
  description:
    "Terms and conditions governing the use of the REDIQ investment platform.",
};

/* ==========================================
   TERMS CONTENT
========================================== */

const sections = [
  {
    number: "01",
    title: "Acceptance of These Terms",
    paragraphs: [
      "By accessing or using REDIQ, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.",
      "If you do not agree with these Terms, you should not create an account, make a deposit, participate in an investment plan, or otherwise use the platform.",
    ],
  },
  {
    number: "02",
    title: "Eligibility and Account Registration",
    paragraphs: [
      "You are responsible for providing accurate, complete, and current information when creating and maintaining your REDIQ account.",
      "You must use your account only for lawful purposes and must keep your login credentials and other security information confidential.",
      "REDIQ may require additional information or verification where reasonably necessary for account security, transaction processing, fraud prevention, or compliance with applicable requirements.",
    ],
  },
  {
    number: "03",
    title: "Investment Plans",
    paragraphs: [
      "Investment plans displayed on REDIQ may have different minimum amounts, durations, expected returns, maturity conditions, and other requirements. The terms displayed for the applicable plan govern your participation in that plan.",
      "You should review the details of an investment plan carefully before committing funds. Information presented on the platform is not a guarantee of profit or future performance.",
      "Unless expressly stated otherwise for a particular plan, participation in an investment plan does not guarantee that you will receive a particular financial outcome.",
    ],
  },
  {
    number: "04",
    title: "Deposits and Payments",
    paragraphs: [
      "Deposits must be made using the payment methods and instructions provided by REDIQ.",
      "Digital-asset transactions may require blockchain confirmations before they are recognized as completed. Processing times can be affected by blockchain conditions, network congestion, third-party providers, or technical issues.",
      "You are responsible for verifying the destination address, network, asset, and amount before submitting a blockchain transaction. Blockchain transactions may be irreversible.",
    ],
  },
  {
    number: "05",
    title: "Investment Commitments and Withdrawals",
    paragraphs: [
      "Once funds are committed to an investment plan, they may be subject to the plan's duration, maturity, and withdrawal conditions.",
      "Withdrawal requests may be subject to security checks, account requirements, applicable processing rules, and the conditions of the relevant investment plan.",
      "A blockchain withdrawal may take additional time to confirm after it has been submitted to the network. REDIQ is not responsible for delays caused by blockchain networks or external service providers outside its reasonable control.",
    ],
  },
  {
    number: "06",
    title: "Fees and Charges",
    paragraphs: [
      "Where applicable, fees, charges, minimums, or processing conditions will be presented through the platform or applicable transaction information.",
      "You are responsible for reviewing applicable charges before confirming a transaction.",
    ],
  },
  {
    number: "07",
    title: "Referrals and Promotions",
    paragraphs: [
      "Referral rewards, bonuses, promotional campaigns, and other incentives are subject to the conditions communicated for the relevant offer.",
      "REDIQ may reject or reverse rewards where activity is determined to be inconsistent with the applicable promotional conditions, including duplicate, fraudulent, abusive, or otherwise prohibited activity.",
    ],
  },
  {
    number: "08",
    title: "User Responsibilities",
    paragraphs: [
      "You agree not to use REDIQ for unlawful activity, fraud, unauthorized transactions, impersonation, abuse of promotional programs, interference with platform operations, or attempts to gain unauthorized access to accounts, systems, or data.",
      "You are responsible for the activity conducted through your account and should notify REDIQ through the available support channels if you believe your account has been compromised.",
    ],
  },
  {
    number: "09",
    title: "Platform Availability",
    paragraphs: [
      "REDIQ aims to provide a reliable platform but does not guarantee uninterrupted or error-free availability.",
      "Access may occasionally be limited or suspended for maintenance, upgrades, security measures, technical issues, network conditions, or circumstances outside reasonable control.",
    ],
  },
  {
    number: "10",
    title: "Digital Assets and Blockchain Networks",
    paragraphs: [
      "Where REDIQ supports blockchain-based deposits or withdrawals, transactions depend on the relevant blockchain network and associated infrastructure.",
      "Network congestion, confirmation delays, incorrect transaction details, network fees, protocol changes, or third-party infrastructure failures may affect transaction processing.",
      "You are responsible for ensuring that blockchain transactions are submitted using the correct supported network and destination information.",
    ],
  },
  {
    number: "11",
    title: "No Financial, Legal, or Tax Advice",
    paragraphs: [
      "Information provided through REDIQ is for platform and investment-plan information purposes and should not be treated as personalized financial, legal, accounting, or tax advice.",
      "You are responsible for evaluating whether a particular investment or transaction is appropriate for your own circumstances and for obtaining independent professional advice where necessary.",
    ],
  },
  {
    number: "12",
    title: "Intellectual Property",
    paragraphs: [
      "The REDIQ name, branding, interface, software, text, graphics, and other platform materials are protected by applicable intellectual-property rights.",
      "Except where permitted by law or expressly authorized by REDIQ, you may not copy, reproduce, modify, distribute, reverse engineer, or commercially exploit platform materials.",
    ],
  },
  {
    number: "13",
    title: "Suspension and Termination",
    paragraphs: [
      "REDIQ may restrict, suspend, or terminate access to an account where reasonably necessary to protect users, the platform, or its systems, or where there is a suspected violation of these Terms or applicable requirements.",
      "Where an account is restricted, applicable transaction or withdrawal processing may also be subject to additional verification or review.",
    ],
  },
  {
    number: "14",
    title: "Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, REDIQ will not be responsible for losses arising from circumstances outside its reasonable control, including blockchain-network failures, third-party service interruptions, connectivity problems, unauthorized access caused by compromised user credentials, or incorrect transaction information supplied by a user.",
      "Nothing in these Terms is intended to exclude or limit any liability that cannot lawfully be excluded or limited.",
    ],
  },
  {
    number: "15",
    title: "Changes to These Terms",
    paragraphs: [
      "REDIQ may update these Terms & Conditions from time to time to reflect changes to the platform, services, security requirements, or applicable obligations.",
      "When material changes are made, the updated version will be made available through the platform. Your continued use of REDIQ after an updated version becomes effective constitutes acceptance of the revised Terms, to the extent permitted by applicable law.",
    ],
  },
];

/* ==========================================
   TERMS PAGE
========================================== */

export default function TermsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050B18] text-white">

      {/* BACKGROUND DETAILS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#E60033]/6 blur-[100px]" />

        <div className="absolute -left-32 top-[45%] h-72 w-72 rounded-full bg-[#E60033]/5 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* =====================================
            TOP NAVIGATION
        ====================================== */}

        <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
          <TermsBackButton />

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-3 py-1.5">
            <ShieldCheck
              size={13}
              className="text-[#FF476B]"
              aria-hidden="true"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF7895]">
              Legal
            </span>
          </div>
        </header>

        {/* =====================================
            HERO
        ====================================== */}

        <section className="relative py-10 sm:py-14 lg:py-16">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#FF476B]">
              <FileText size={13} aria-hidden="true" />
              Platform Terms
            </div>

            <h1 className="mt-5 text-[30px] font-black leading-[1.1] tracking-tight text-white sm:text-[43px] lg:text-[50px]">
              Terms <span className="text-[#FF476B]">&</span>
              <span className="block">Conditions</span>
            </h1>

            <p className="mt-4 max-w-2xl text-xs leading-6 text-white/55 sm:text-sm sm:leading-7">
              These Terms & Conditions explain the rules and responsibilities
              that apply when you access or use the REDIQ investment platform.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <ScrollText
                  size={13}
                  className="text-[#FF476B]"
                  aria-hidden="true"
                />
                Last updated: September 29, 2026
              </span>

              <span
                aria-hidden="true"
                className="hidden h-1 w-1 rounded-full bg-white/25 sm:block"
              />

              <span>Please read before using the platform</span>
            </div>
          </div>
        </section>

        {/* =====================================
            DOCUMENT INFORMATION BAR
        ====================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0B1426] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
              <FileText size={14} aria-hidden="true" />
            </div>

            <span className="text-[11px] font-bold text-white/80">
              Terms of Service
            </span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-white/50">
            {sections.length} Sections
          </span>
        </div>

        {/* ACCORDION INSTRUCTIONS */}
        <p className="mb-4 px-1 text-[10px] leading-5 text-white/40 sm:text-[11px]">
          Select a section below to read its contents. You can expand
          multiple sections at the same time.
        </p>

        {/* =====================================
            EXPANDABLE TERMS DOCUMENT
        ====================================== */}

        <section
          aria-label="REDIQ Terms and Conditions"
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426]/80"
        >
          {/* Document accent */}
          <div
            aria-hidden="true"
            className="h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent"
          />

          <div className="divide-y divide-white/8">

            {sections.map((section) => (
              <details
                key={section.number}
                id={`terms-${section.number}`}
                className="group min-w-0 open:bg-[#101A2D] transition-colors duration-200"
              >

                {/* =====================================
                    CLICKABLE DROPDOWN HEADING
                ====================================== */}

                <summary
                  className={[
                    "flex min-w-0 cursor-pointer list-none",
                    "items-center justify-between gap-3",
                    "px-4 py-4 sm:px-6 sm:py-5 lg:px-8",
                    "transition-colors duration-200",
                    "hover:bg-white/2.5",
                    "focus-visible:outline-none",
                    "focus-visible:bg-[#E60033]/5",
                    "focus-visible:ring-2",
                    "focus-visible:ring-inset",
                    "focus-visible:ring-[#E60033]/40",
                    "[&::-webkit-details-marker]:hidden",
                  ].join(" ")}
                >
                  {/* Section number and title */}
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                    {/* Number */}
                    <span
                      className={[
                        "flex h-8 min-w-8 shrink-0",
                        "items-center justify-center rounded-lg",
                        "border border-[#E60033]/20",
                        "bg-[#E60033]/10 px-2",
                        "text-[10px] font-black tabular-nums",
                        "text-[#FF476B]",
                        "transition-colors duration-200",
                        "group-open:border-[#E60033]/40",
                        "group-open:bg-[#E60033]",
                        "group-open:text-white",
                      ].join(" ")}
                    >
                      {section.number}
                    </span>

                    {/* Title */}
                    <h2
                      className={[
                        "min-w-0 text-[12px] font-bold",
                        "leading-5 tracking-tight text-white/80",
                        "transition-colors duration-200",
                        "group-open:text-white",
                        "sm:text-[15px]",
                      ].join(" ")}
                    >
                      {section.title}
                    </h2>
                  </div>

                  {/* Dropdown icon */}
                  <span
                    aria-hidden="true"
                    className={[
                      "flex h-8 w-8 shrink-0",
                      "items-center justify-center rounded-lg",
                      "border border-white/10 bg-white/[0.035]",
                      "text-white/40 transition-all duration-200",
                      "group-hover:border-[#E60033]/25",
                      "group-hover:text-[#FF476B]",
                      "group-open:border-[#E60033]/25",
                      "group-open:bg-[#E60033]/10",
                      "group-open:text-[#FF476B]",
                    ].join(" ")}
                  >
                    <ChevronDown
                      size={16}
                      strokeWidth={2.2}
                      className="transition-transform duration-200 group-open:rotate-180"
                    />
                  </span>
                </summary>

                {/* =====================================
                    EXPANDABLE SECTION CONTENT
                ====================================== */}

                <div className="px-4 pb-5 sm:px-6 sm:pb-6 lg:px-8">

                  <div className="border-t border-white/8 pt-4 sm:ml-12 sm:pt-5">

                    {/* Left accent line */}
                    <div className="border-l-2 border-[#E60033]/35 pl-3.5 sm:pl-4">

                      <div className="max-w-3xl space-y-3.5">

                        {section.paragraphs.map(
                          (paragraph, index) => (
                            <p
                              key={`${section.number}-${index}`}
                              className="text-[11px] leading-[1.9] text-white/60 sm:text-[13px] sm:leading-7"
                            >
                              {paragraph}
                            </p>
                          )
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </details>
            ))}

          </div>
        </section>

        {/* =====================================
            QUESTIONS / SUPPORT
        ====================================== */}

        <section className="py-7 sm:py-9">

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] p-4 sm:p-6">

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#E60033]/10 blur-[60px]"
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <CheckCircle2
                      size={16}
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="text-[13px] font-black text-white sm:text-sm">
                    Questions or support?
                  </h2>
                </div>

                <p className="mt-2 max-w-xl text-[11px] leading-5 text-white/50 sm:text-xs sm:leading-6">
                  If you need assistance with your REDIQ account or platform
                  activity, use the support options available through the
                  platform.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#E60033] px-4 text-[11px] font-black text-white transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] sm:self-auto"
              >
                Go to account
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================
            FOOTER
        ====================================== */}

        <footer className="border-t border-white/10 py-6 text-center">
          <p className="text-[10px] leading-5 text-white/35">
            © {new Date().getFullYear()} REDIQ Investment.
            All rights reserved.
          </p>
        </footer>

      </div>
    </main>
  );
}