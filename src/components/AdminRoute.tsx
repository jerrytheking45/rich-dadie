
// src/components/AdminRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface AdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export default function AdminRoute({ children, requireSuperAdmin = false }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();
  const router = useRouter();



useEffect(() => {
  if (!loading) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (requireSuperAdmin && !isSuperAdmin) {
      router.push('/admin'); // or '/investment'? Admin users can go to admin panel
      return;
    }
    if (!requireSuperAdmin && !isAdmin) {
      router.push('/investment'); // employees go to investment
      return;
    }
  }
}, [loading, isAuthenticated, isAdmin, isSuperAdmin, requireSuperAdmin, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated && (isAdmin || (requireSuperAdmin && isSuperAdmin)) ? <>{children}</> : null;
}