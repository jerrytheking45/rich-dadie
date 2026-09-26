
// src/app/admin/plans/page.tsx
'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import PlanManagement from '@/src/components/admin/plans/PlanManagement';

export default function AdminPlansPage() {
  return (
    <AdminDashboard title="Investment Plans">
      <PlanManagement />
    </AdminDashboard>
  );
}