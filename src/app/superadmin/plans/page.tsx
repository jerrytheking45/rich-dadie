'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import SuperadminPlanManagement from '@/src/components/superadmin/plans/SuperadminPlanManagement';
//import PlanManagement from '@/src/components/admin/plans/PlanManagement';

export default function SuperadminPlansPage() {
  return (
    <AdminDashboard title="Investment Plans">
      <SuperadminPlanManagement />
    </AdminDashboard>
  );
}