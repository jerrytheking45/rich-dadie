src/
├── app/
│   ├── layout.tsx                    # Root layout with AuthProvider
│   ├── page.tsx                      # Redirect to /investment
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Register page
│   ├── verify/
│   │   └── page.tsx                  # Verify page
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard (protected)
│   ├── investment/
│   │   ├── layout.tsx                # Protected layout for investment
│   │   ├── page.tsx                  # InvestmentHome
│   │   ├── investments/
│   │   │   ├── page.tsx              # InvestmentsPage
│   │   │   └── [investmentId]/
│   │   │       └── page.tsx          # InvestmentDetailsPage
│   │   ├── invest/
│   │   │   └── [planId]/
│   │   │       └── page.tsx          # InvestFlow
│   │   ├── plans/
│   │   │   └── page.tsx              # PlansPage
│   │   ├── promotions/
│   │   │   ├── page.tsx              # PromotionsPage
│   │   │   └── [promotionId]/
│   │   │       └── page.tsx          # PromotionDetailsPage
│   │   ├── team/
│   │   │   └── page.tsx              # TeamPage
│   │   └── profile/
│   │       ├── page.tsx              # ProfilePage
│   │       ├── info/
│   │       │   └── page.tsx          # ProfileInfoPage
│   │       ├── payments/
│   │       │   └── page.tsx          # ProfilePaymentMethodsPage
│   │       ├── wallet/
│   │       │   └── bind/
│   │       │       └── page.tsx      # ProfileWalletBindPage
│   │       ├── deposit/
│   │       │   └── page.tsx          # ProfileDepositPage
│   │       ├── withdraw/
│   │       │   └── page.tsx          # ProfileWithdrawPage
│   │       ├── transactions/
│   │       │   └── page.tsx          # ProfileTransactionsPage
│   │       ├── security/
│   │       │   └── page.tsx          # ProfileSecurityPage
│   │       ├── notifications/
│   │       │   └── page.tsx          # ProfileNotificationsPage
│   │       └── statements/
│   │           └── page.tsx          # ProfileStatementsPage
│   ├── admin/
│   │   └── page.tsx                  # Admin panel (protected)
│   └── superadmin/
│       └── page.tsx                  # Superadmin panel (protected)
├── components/
│   ├── AuthProvider.tsx              # moved from context
│   ├── ProtectedRoute.tsx            # client component for route guarding
│   ├── AdminRoute.tsx                # client component for admin guarding
│   └── ... (all existing investment components)
├── lib/
│   └── api.ts                        # Axios client with interceptors
├── features/                         # Existing investment features (keep as is)
│   └── investment/
│       ├── components/
│       ├── pages/                    # We'll remove these after migration
│       ├── layouts/                  # Keep but adapt to Next.js
│       └── ...
└── middleware.ts                     # Auth middleware for server‑side protection









