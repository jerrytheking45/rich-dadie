// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/src/components/Providers';
import TransactionActivityToast from '@/src/components/TransactionActivityToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rich-Dadie investment',
  description: 'Investment platform for managed digital investments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <TransactionActivityToast />
        </Providers>
      </body>
    </html>
  );
}