
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/src/components/Providers';
import TransactionActivityToast from '@/src/components/TransactionActivityToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'REDIQ',
  description: 'Investment platform for managed digital investments.',
  metadataBase: new URL('https://rediq.vercel.app'),

  openGraph: {
    title: 'REDIQ',
    description: 'Investment platform for managed digital investments.',
    type: 'website',
    siteName: 'REDIQ',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'REDIQ',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'REDIQ',
    description: 'Investment platform for managed digital investments.',
    images: ['/images/logo.png'],
  },
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

