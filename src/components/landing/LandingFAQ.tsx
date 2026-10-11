
import {
  ChevronDown,
  CircleHelp,
} from 'lucide-react';

const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'Create a REDIQ account, complete the required account setup, fund your account using an available deposit option, and explore the published investment plans.',
  },
  {
    question: 'Where can I see available investment plans?',
    answer:
      'Published investment plans are displayed on the public REDIQ website. After signing in, you can also browse investment opportunities from your account.',
  },
  {
    question: 'Can I track my investments?',
    answer:
      'Yes. Your authenticated investment dashboard provides access to your investments, account information, and relevant activity.',
  },
  {
    question: 'How do promotions work?',
    answer:
      'Active promotions and announcements can appear on the platform. A promotion may highlight an investment plan, offer, bonus, announcement, or general platform message.',
  },
  {
    question: 'How does the referral program work?',
    answer:
      'After creating an account, eligible users can invite friends through the REDIQ referral program and track eligible rewards from their account.',
  },
];

export default function LandingFAQ() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-[#050B18]"
    >
      {/* Subtle REDIQ background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[#E60033]/5 blur-[80px] sm:h-64 sm:w-64"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-7 sm:px-6 sm:py-9 lg:py-11">

        {/* SECTION HEADER */}
        <div className="text-center">

          {/* Small badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
            <CircleHelp size={12} />
            Frequently asked
          </div>

          {/* Compact heading */}
          <h2 className="mt-3 text-[22px] font-black leading-tight tracking-tight text-white sm:text-[27px] lg:text-[30px]">
            Questions,
            <span className="text-[#FF476B]"> answered.</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-2 max-w-lg text-[11px] leading-5 text-white/45 sm:text-xs">
            Find answers to common questions about REDIQ,
            investment plans and your account.
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] sm:mt-6">

          {faqs.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/7 transition-colors open:bg-white/[0.025] last:border-b-0"
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-left transition hover:bg-white/[0.025] sm:min-h-13 sm:px-5 [&::-webkit-details-marker]:hidden">

                {/* Question */}
                <div className="flex min-w-0 items-center gap-3">

                  {/* Number */}
                  <span className="hidden shrink-0 text-[10px] font-black tracking-wider text-[#E60033]/65 sm:block">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="text-xs font-bold leading-5 text-white/80 transition-colors group-open:text-white sm:text-[13px]">
                    {item.question}
                  </span>
                </div>

                {/* Dropdown icon */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all duration-300 group-open:rotate-180 group-open:border-[#E60033]/30 group-open:bg-[#E60033]/10 group-open:text-[#FF476B]">
                  <ChevronDown size={14} />
                </span>
              </summary>

              {/* Answer */}
              <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-4">
                <div className="border-l-2 border-[#E60033]/35 pl-3 sm:ml-7 sm:pl-4">

                  <p className="max-w-2xl text-[11px] leading-[1.7] text-white/55 sm:text-xs sm:leading-5">
                    {item.answer}
                  </p>

                </div>
              </div>
            </details>
          ))}

        </div>

        {/* Bottom note */}
        <p className="mt-4 text-center text-[10px] leading-4 text-white/30">
          Learn more about REDIQ and explore available investment opportunities.
        </p>

      </div>
    </section>
  );
}