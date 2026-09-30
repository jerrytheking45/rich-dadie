import Link from "next/link";
import TermsBackButton from "./TermsBackButton";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | REDIQ",
  description:
    "Terms and conditions governing the use of the REDIQ investment platform.",
};

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

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between border-b border-white/7 pb-6">
          <TermsBackButton />

          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-2">
            <ShieldCheck size={13} className="text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              Legal
            </span>
          </div>
        </header>

        <section className="py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F7C948]">
              <FileText size={14} />
              Platform Terms
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              These Terms & Conditions explain the rules and responsibilities
              that apply when you access or use the REDIQ investment platform.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/25">
              <span>Last updated: September 29, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Please read before using the platform</span>
            </div>
          </div>
        </section>

        <section className="border-t border-white/7">
          <div className="divide-y divide-white/7">
            {sections.map((section) => (
              <article
                key={section.number}
                className="grid gap-5 py-9 sm:grid-cols-[90px_1fr] sm:py-11"
              >
                <div className="text-xs font-black tracking-[0.14em] text-[#F7C948]/70">
                  {section.number}
                </div>

                <div className="max-w-3xl">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-7 text-white/45"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/7 py-10">
          <div className="flex flex-col gap-5 rounded-3xl border border-white/7 bg-white/2.5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-300" />
                <h2 className="text-sm font-bold">Questions or support?</h2>
              </div>
              <p className="mt-2 max-w-xl text-xs leading-6 text-white/35">
                If you need assistance with your REDIQ account or platform
                activity, use the support options available through the
                platform.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Go to account
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/7 py-7 text-center">
          <p className="text-[10px] leading-5 text-white/20">
            © {new Date().getFullYear()} REDIQ Investment. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
