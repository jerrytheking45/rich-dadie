// src/features/investment/data/profile-demo.ts

export interface DemoWallet {
  id: string;
  address: string;
  network: 'ERC20' | 'BEP20' | 'TRC20' | 'SOLANA';
  label: string;
  isDefault: boolean;
  createdAt: string;
}

export interface DemoTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'EARNING';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  date: string;
  reference?: string;
  walletId?: string;
}

export interface DemoUserProfile {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  avatar: string; // base64 or URL, empty for demo
  wallets: DemoWallet[];
  transactions: DemoTransaction[];
}

export const demoProfile: DemoUserProfile = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  employeeId: 'GH-0241',
  avatar: '',
  wallets: [
    {
      id: 'wallet-1',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      network: 'ERC20',
      label: 'Ethereum Mainnet',
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'wallet-2',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      network: 'BEP20',
      label: 'BSC Wallet',
      isDefault: false,
      createdAt: new Date().toISOString(),
    },
  ],
  transactions: [
    {
      id: 'tx-1',
      type: 'DEPOSIT',
      amount: 500,
      currency: 'USDT',
      status: 'COMPLETED',
      description: 'Deposit from external wallet',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      reference: '0xabc...',
    },
    {
      id: 'tx-2',
      type: 'WITHDRAWAL',
      amount: 100,
      currency: 'USDT',
      status: 'PENDING',
      description: 'Withdrawal to ERC20 wallet',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      walletId: 'wallet-1',
    },
    {
      id: 'tx-3',
      type: 'DEPOSIT',
      amount: 250,
      currency: 'USDT',
      status: 'COMPLETED',
      description: 'Investment return',
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ],
};

export interface NotificationPreference {
  id: string;
  type: 'email' | 'push' | 'in_app';
  label: string;
  enabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface StatementItem {
  id: string;
  period: string; // e.g., "August 2026"
  dateGenerated: string;
  url: string; // dummy URL
}

export const notificationPreferences: NotificationPreference[] = [
  { id: 'pref-1', type: 'email', label: 'Email Notifications', enabled: true },
  { id: 'pref-2', type: 'push', label: 'Push Notifications', enabled: false },
  { id: 'pref-3', type: 'in_app', label: 'In-App Notifications', enabled: true },
];

export const recentNotifications: NotificationItem[] = [
  { id: 'notif-1', title: 'Investment Matured', message: 'Your Gold Growth Plan has matured.', date: '2026-08-20T10:00:00Z', read: false },
  { id: 'notif-2', title: 'Deposit Confirmed', message: 'Your deposit of 500 USDT has been confirmed.', date: '2026-08-19T14:30:00Z', read: true },
  { id: 'notif-3', title: 'Withdrawal Request', message: 'Your withdrawal request is pending approval.', date: '2026-08-18T09:15:00Z', read: true },
];

export const statements: StatementItem[] = [
  { id: 'stmt-1', period: 'August 2026', dateGenerated: '2026-08-31', url: '/statements/august-2026.pdf' },
  { id: 'stmt-2', period: 'July 2026', dateGenerated: '2026-07-31', url: '/statements/july-2026.pdf' },
  { id: 'stmt-3', period: 'June 2026', dateGenerated: '2026-06-30', url: '/statements/june-2026.pdf' },
];