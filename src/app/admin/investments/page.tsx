
'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import InvestmentManagement from '@/src/components/admin/investments/InvestmentManagement';

export default function SuperAdminInvestmentsPage() {
  return (
    <AdminDashboard title="Investment Management">
      <InvestmentManagement />
    </AdminDashboard>
  );  
}