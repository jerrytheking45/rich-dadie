import AdminRoute from '@/src/components/AdminRoute';
import PlatformSettingsManagement from '@/src/components/superadmin/platform-settings/PlatformSettingsManagement';
import AdminDashboard from '@/src/components/admin/AdminDashboard';

export default function SuperadminPlatformSettingsPage() {
  return (
    <AdminRoute requireSuperAdmin>
      <AdminDashboard title="PlatformSettings Management">
       <PlatformSettingsManagement />
      </AdminDashboard>
    </AdminRoute>
  );
}
