'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import AccountDepositManagement from '@/src/components/admin/account-deposits/AccountDepositManagement';

export default function AdminAccountDepositsPage() {
  return (
    <AdminDashboard title="Account Deposit Management">
      <AccountDepositManagement />
    </AdminDashboard>
  );
}