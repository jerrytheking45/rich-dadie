'use client';

import { useAuth } from '@/src/components/AuthProvider';
import AdminDashboard from '@/src/components/admin/AdminDashboard';
import UserManagement from '@/src/components/admin/users/UserManagement';

interface AdminPageContentProps {
  section?: 'dashboard' | 'users' | 'deposits';
}

export default function AdminPageContent({
  section = 'dashboard',
}: AdminPageContentProps) {
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === 'superadmin';

  if (section === 'users') {
    return (
      <AdminDashboard
        title="User Management"
      >
        <UserManagement
          superAdmin={isSuperAdmin}
        />
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard title="Admin Dashboard" />
  );
}