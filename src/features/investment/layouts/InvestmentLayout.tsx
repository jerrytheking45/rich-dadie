// src/features/investment/layouts/InvestmentLayout.tsx

import { Outlet } from "react-router-dom";
import InvestmentBottomNav from "../components/InvestmentBottomNav";

const InvestmentLayout = () => {
  return (
    <div className="min-h-screen pb-20">
      <Outlet />

      <InvestmentBottomNav />
    </div>
  );
};

export default InvestmentLayout;