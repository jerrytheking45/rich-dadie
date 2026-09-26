'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import DepositManagement from '@/src/components/admin/deposits/DepositManagement';

export default function SuperAdminDepositsPage() {
  return (
    <AdminDashboard title="Deposit Management">
      <DepositManagement superAdmin />
    </AdminDashboard>
  );
} 