import LandingFAQ from '@/src/components/landing/LandingFAQ';
import LandingFinalCTA from '@/src/components/landing/LandingFinalCTA';
import LandingFooter from '@/src/components/landing/LandingFooter';
import LandingHeader from '@/src/components/landing/LandingHeader';
import LandingHero from '@/src/components/landing/LandingHero';
import LandingHowItWorks from '@/src/components/landing/LandingHowItWorks';
import LandingPlans from '@/src/components/landing/LandingPlans';
import LandingPromotions from '@/src/components/landing/LandingPromotions';
import LandingReferralCTA from '@/src/components/landing/LandingReferralCTA';
import LandingWhyUs from '@/src/components/landing/LandingWhyUs';

import { investmentApi } from '@/src/lib/api/investmentApi';
import type { InvestmentPlan } from '@/src/lib/types/investment';

async function getPlans(): Promise<InvestmentPlan[]> {
  try {
    return await investmentApi.getPlans();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const plans = await getPlans();

  const featuredPlans = plans
    .filter(
      (plan) =>
        plan.status === 'PUBLISHED' &&
        plan.featured
    )
    .slice(0, 4);

  const displayPlans =
    featuredPlans.length > 0
      ? featuredPlans
      : plans
          .filter(
            (plan) => plan.status === 'PUBLISHED'
          )
          .slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <LandingHeader />

      <LandingHero plansCount={plans.length} />

      <LandingPromotions />

      <LandingPlans plans={displayPlans} />

      <LandingHowItWorks />

      <LandingWhyUs />

      <LandingReferralCTA />

      <LandingFAQ />

      <LandingFinalCTA />

      <LandingFooter />
    </main>
  );
}