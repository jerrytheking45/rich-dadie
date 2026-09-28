
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
      className="relative overflow-hidden bg-[#050B18]"
    >
      {/* Ambient background */}
      <div className="absolute left-[-15%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            <CircleHelp size={12} className="text-[#F7C948]" />
            Frequently asked
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Questions,
            <span className="text-white/35"> answered.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
            A few answers to common questions about the REDIQ
            platform, investment plans, and account experience.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-10 overflow-hidden rounded-4xl border border-white/8 bg-white/2.5">
          {faqs.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/7 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-white/2.5 sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="hidden text-[10px] font-black tracking-[0.12em] text-[#F7C948]/40 sm:block">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="text-sm font-bold text-white sm:text-[15px]">
                    {item.question}
                  </span>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/35 transition group-open:rotate-180 group-open:border-[#F7C948]/20 group-open:text-[#F7C948]">
                  <ChevronDown size={15} />
                </span>
              </summary>

              <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                <div className="ml-0 border-l border-[#F7C948]/15 pl-4 sm:ml-8">
                  <p className="max-w-2xl text-xs leading-6 text-white/40 sm:text-sm">
                    {item.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


