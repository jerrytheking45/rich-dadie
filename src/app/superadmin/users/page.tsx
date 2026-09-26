'use client';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import UserManagement from '@/src/components/admin/users/UserManagement';

export default function SuperAdminUsersPage() {
  return (
    <AdminDashboard title="User Management">
      <UserManagement superAdmin />
    </AdminDashboard>
  );
}