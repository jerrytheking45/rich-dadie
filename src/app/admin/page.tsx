// src/app/admin/page.tsx
import AdminRoute from '@/src/components/AdminRoute';
import AdminPageContent from './AdminPageContent'; // move content to separate client component

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}