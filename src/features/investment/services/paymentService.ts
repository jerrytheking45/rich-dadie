// src/features/investment/services/paymentService.ts
import type { Wallet, PaymentTransaction, UserProfile } from '../types/investment';

const STORAGE_KEY = 'investment_user_profile';

// Default user profile (for demo)
const defaultProfile: UserProfile = {
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
  ],
  transactions: [
    {
      id: 'tx-1',
      type: 'DEPOSIT',
      amount: 500,
      currency: 'USDT',
      status: 'COMPLETED',
      description: 'Deposit from external wallet',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      reference: '0xabc...',
    },
    {
      id: 'tx-2',
      type: 'WITHDRAWAL',
      amount: 100,
      currency: 'USDT',
      status: 'PENDING',
      description: 'Withdrawal to ERC20 wallet',
      date: new Date().toISOString(),
      walletId: 'wallet-1',
    },
  ],
};

export class PaymentService {
  private static instance: PaymentService;
  private profile: UserProfile;

  private constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.profile = JSON.parse(stored);
    } else {
      this.profile = defaultProfile;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    }
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
  }

  // ---- User Profile ----
  getUserProfile(): UserProfile {
    return { ...this.profile };
  }

  updateProfile(updates: Partial<UserProfile>) {
    this.profile = { ...this.profile, ...updates };
    this.save();
  }

  // ---- Wallets ----
  getWallets(): Wallet[] {
    return [...this.profile.wallets];
  }

  addWallet(wallet: Omit<Wallet, 'id' | 'createdAt'>) {
    const newWallet: Wallet = {
      ...wallet,
      id: `wallet-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    // If this is the first wallet, make it default
    if (this.profile.wallets.length === 0) {
      newWallet.isDefault = true;
    }
    this.profile.wallets.push(newWallet);
    this.save();
    return newWallet;
  }

  setDefaultWallet(walletId: string) {
    this.profile.wallets = this.profile.wallets.map(w => ({
      ...w,
      isDefault: w.id === walletId,
    }));
    this.save();
  }

  deleteWallet(walletId: string) {
    this.profile.wallets = this.profile.wallets.filter(w => w.id !== walletId);
    this.save();
  }

  // ---- Transactions ----
  getTransactions(): PaymentTransaction[] {
    return [...this.profile.transactions];
  }

  addTransaction(tx: Omit<PaymentTransaction, 'id' | 'date'>) {
    const newTx: PaymentTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
    };
    this.profile.transactions.push(newTx);
    this.save();
    return newTx;
  }

  // ---- Deposit Simulation ----
  createDeposit(amount: number, walletId: string): PaymentTransaction {
    return this.addTransaction({
      type: 'DEPOSIT',
      amount,
      currency: 'USDT',
      status: 'PENDING',
      description: 'Deposit to investment account',
      walletId,
    });
  }

  // ---- Withdrawal Simulation ----
  createWithdrawal(amount: number, walletId: string): PaymentTransaction {
    // In production, check balance and wallet existence
    return this.addTransaction({
      type: 'WITHDRAWAL',
      amount,
      currency: 'USDT',
      status: 'PENDING',
      description: 'Withdrawal to external wallet',
      walletId,
    });
  }

  // ---- Confirm transaction (simulate admin approval) ----
  confirmTransaction(txId: string) {
    const tx = this.profile.transactions.find(t => t.id === txId);
    if (tx) {
      tx.status = 'COMPLETED';
      this.save();
    }
  }

  // ---- Cancel transaction (simulate admin rejection) ----
  cancelTransaction(txId: string) {
    const tx = this.profile.transactions.find(t => t.id === txId);
    if (tx) {
      tx.status = 'FAILED';
      this.save();
    }
  }

  // ---- Get total balance in base currency (USDT) ----
  getBalance(): number {
    // Sum all completed deposits minus completed withdrawals
    const deposits = this.profile.transactions
      .filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = this.profile.transactions
      .filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);
    return deposits - withdrawals;
  }
}