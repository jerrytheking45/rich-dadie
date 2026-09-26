
// src/app/admin/deposits/page.tsx

'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import DepositManagement from '@/src/components/admin/deposits/DepositManagement';

export default function AdminDepositsPage() {
  return (
    <AdminDashboard title="Deposit Management">
      <DepositManagement />
    </AdminDashboard>
  );
}