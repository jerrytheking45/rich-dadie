// src/features/investment/data/investmentData.ts

import type {
  Investment,
  InvestmentPlan,
  InvestmentSummary,
  Promotion,
  TeamMemberInvestment,
} from "../types/investment";

// -----------------------------------------------------------------------------
// Investment Summary (all values in USDT)
// -----------------------------------------------------------------------------
export const investmentSummary: InvestmentSummary = {
  totalInvested: 1250,        // was 1,250,000 UGX
  currentValue: 1387.5,       // was 1,387,500 UGX
  projectedEarnings: 137.5,   // was 137,500 UGX
  activeInvestments: 3,
  maturedInvestments: 1,
};

// -----------------------------------------------------------------------------
// Investment Plans (all amounts in USDT)
// -----------------------------------------------------------------------------
export const investmentPlans: InvestmentPlan[] = [
  // Daily
  {
    id: "daily",
    name: "Daily Growth Plan",
    nameKey: "plans.daily.name",
    description: "A one‑day plan for quick savings with a small return.",
    descriptionKey: "plans.daily.description",
    image: "/images/investments/daily.jpg",
    minimumAmount: 5,
    maximumAmount: 50,
    durationDays: 1,
    expectedReturnRate: 0.5,
    riskLevel: "LOW",
    status: "ACTIVE",
    featured: false,
  },
  // Weekly
  {
    id: "weekly",
    name: "Weekly Growth Plan",
    nameKey: "plans.weekly.name",
    description: "A seven‑day plan that gives you steady weekly gains.",
    descriptionKey: "plans.weekly.description",
    image: "/images/investments/weekly.jpg",
    minimumAmount: 10,
    maximumAmount: 100,
    durationDays: 7,
    expectedReturnRate: 2,
    riskLevel: "LOW",
    status: "ACTIVE",
    featured: false,
  },
  // Monthly
  {
    id: "monthly",
    name: "Monthly Growth Plan",
    nameKey: "plans.monthly.name",
    description: "A 30‑day plan for regular monthly savings and returns.",
    descriptionKey: "plans.monthly.description",
    image: "/images/investments/monthly.jpg",
    minimumAmount: 20,
    maximumAmount: 200,
    durationDays: 30,
    expectedReturnRate: 5,
    riskLevel: "LOW",
    status: "ACTIVE",
    featured: false,
  },
  // Quarterly
  {
    id: "quarterly",
    name: "Quarterly Growth Plan",
    nameKey: "plans.quarterly.name",
    description: "A 90‑day plan offering medium‑term growth and a balanced risk.",
    descriptionKey: "plans.quarterly.description",
    image: "/images/investments/quarterly.jpg",
    minimumAmount: 30,
    maximumAmount: 500,
    durationDays: 90,
    expectedReturnRate: 7,
    riskLevel: "MEDIUM",
    status: "ACTIVE",
    featured: true,
  },
  // Starter
  {
    id: "starter",
    name: "Starter Growth Plan",
    nameKey: "plans.starter.name",
    description:
      "A simple entry‑level investment plan designed for employees starting their investment journey.",
    descriptionKey: "plans.starter.description",
    image: "/images/investments/starter.jpg",
    minimumAmount: 25,
    maximumAmount: 250,
    durationDays: 180,
    expectedReturnRate: 8,
    riskLevel: "LOW",
    status: "ACTIVE",
    featured: false,
  },
  // Silver
  {
    id: "silver",
    name: "Silver Growth Plan",
    nameKey: "plans.silver.name",
    description:
      "A balanced investment option designed for medium‑term employee savings.",
    descriptionKey: "plans.silver.description",
    image: "/images/investments/silver.jpg",
    minimumAmount: 50,
    maximumAmount: 1000,
    durationDays: 360,
    expectedReturnRate: 12,
    riskLevel: "MEDIUM",
    status: "ACTIVE",
    featured: true,
  },
  // Gold
  {
    id: "gold",
    name: "Gold Growth Plan",
    nameKey: "plans.gold.name",
    description:
      "A premium long‑term investment plan for employees seeking higher projected growth.",
    descriptionKey: "plans.gold.description",
    image: "/images/investments/gold.jpg",
    minimumAmount: 75,
    maximumAmount: 5000,
    durationDays: 360,
    expectedReturnRate: 15,
    riskLevel: "MEDIUM",
    status: "ACTIVE",
    featured: true,
  },
  // Premium
  {
    id: "premium",
    name: "Premium Growth Plan",
    nameKey: "plans.premium.name",
    description:
      "A premium investment product intended for larger long‑term investments.",
    descriptionKey: "plans.premium.description",
    image: "/images/investments/premium.jpg",
    minimumAmount: 250,
    maximumAmount: 20000,
    durationDays: 720,
    expectedReturnRate: 18,
    riskLevel: "HIGH",
    status: "ACTIVE",
    featured: false,
  },
];

// -----------------------------------------------------------------------------
// Active Investments (all amounts in USDT)
// -----------------------------------------------------------------------------
export const activeInvestments: Investment[] = [
  {
    id: "INV-000124",
    planId: "gold",
    planName: "Gold Growth Plan",
    amount: 75,             // was 75,000 UGX
    expectedReturn: 11.25,  // was 11,250 UGX
    projectedValue: 86.25,  // was 86,250 UGX
    durationDays: 360,
    startDate: "2026-08-19",
    maturityDate: "2027-08-14",
    progress: 2,
    status: "ACTIVE",
    image: "/images/investments/gold.jpg",
  },
  {
    id: "INV-000119",
    planId: "silver",
    planName: "Silver Growth Plan",
    amount: 250,            // was 250,000 UGX
    expectedReturn: 30,     // was 30,000 UGX
    projectedValue: 280,    // was 280,000 UGX
    durationDays: 360,
    startDate: "2026-07-15",
    maturityDate: "2027-07-10",
    progress: 11,
    status: "ACTIVE",
    image: "/images/investments/silver.jpg",
  },
  {
    id: "INV-000107",
    planId: "starter",
    planName: "Starter Growth Plan",
    amount: 100,            // was 100,000 UGX
    expectedReturn: 8,      // was 8,000 UGX
    projectedValue: 108,    // was 108,000 UGX
    durationDays: 180,
    startDate: "2026-06-01",
    maturityDate: "2026-11-28",
    progress: 45,
    status: "ACTIVE",
    image: "/images/investments/starter.jpg",
  },
];

// -----------------------------------------------------------------------------
// Team Members (amounts in USDT)
// -----------------------------------------------------------------------------
export const teamMembers: TeamMemberInvestment[] = [
  {
    id: "EMP-001",
    name: "John Doe",
    planName: "Gold Growth Plan",
    investedAmount: 150,     // was 150,000 UGX
    status: "ACTIVE",
  },
  {
    id: "EMP-002",
    name: "Sarah Williams",
    planName: "Silver Growth Plan",
    investedAmount: 75,      // was 75,000 UGX
    status: "ACTIVE",
  },
  {
    id: "EMP-003",
    name: "David Mark",
    planName: "Starter Growth Plan",
    investedAmount: 25,      // was 25,000 UGX
    status: "ACTIVE",
  },
];

// -----------------------------------------------------------------------------
// Promotions (titles/descriptions are translatable)
// -----------------------------------------------------------------------------
export const promotions: Promotion[] = [
  {
    id: "PROMO-001",
    title: "Employee Growth Month",
    titleKey: "promotions.employee_growth_month.title",
    description:
      "Explore our current employee investment opportunities and start building your financial future.",
    descriptionKey: "promotions.employee_growth_month.description",
    image: "/images/investments/promotion.jpg",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    active: true,
  },
  {
    id: "PROMO-002",
    title: "Referral Bonus Program",
    titleKey: "promotions.referral_bonus.title",
    description:
      "Refer a fellow team member and earn a bonus when they make their first investment.",
    descriptionKey: "promotions.referral_bonus.description",
    image: "/images/investments/referral.jpg",
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    active: true,
  },
  {
    id: "PROMO-003",
    title: "Early Bird Special",
    titleKey: "promotions.early_bird.title",
    description:
      "Invest before the end of the month and receive an extra 1% return on your first investment.",
    descriptionKey: "promotions.early_bird.description",
    image: "/images/investments/earlybird.jpg",
    startDate: "2026-08-15",
    endDate: "2026-08-31",
    active: true,
  },
  {
    id: "PROMO-004",
    title: "Team Challenge",
    titleKey: "promotions.team_challenge.title",
    description:
      "Join the team challenge – the department with the highest total investment wins a team reward.",
    descriptionKey: "promotions.team_challenge.description",
    image: "/images/investments/teamchallenge.jpg",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    active: true,
  },
  {
    id: "PROMO-005",
    title: "Holiday Investment Bonus",
    titleKey: "promotions.holiday_bonus.title",
    description:
      "Invest during the holiday season and get a festive bonus of up to USDT 50 on qualifying plans.",
    descriptionKey: "promotions.holiday_bonus.description",
    image: "/images/investments/holiday.jpg",
    startDate: "2026-12-01",
    endDate: "2026-12-25",
    active: true,
  },
];