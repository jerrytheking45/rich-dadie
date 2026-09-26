// src/components/Providers.tsx
'use client';

import { AuthProvider } from './AuthProvider';
import { SettingsProvider } from '@/src/context/SettingsProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </AuthProvider>
  );
}