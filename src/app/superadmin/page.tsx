// src/app/superadmin/page.tsx
import AdminRoute from '@/src/components/AdminRoute';
import SuperAdminPageContent from './SuperAdminPageContent';

export default function SuperAdminPage() {
  return (
    <AdminRoute requireSuperAdmin>
      <SuperAdminPageContent />
    </AdminRoute>
  );
}