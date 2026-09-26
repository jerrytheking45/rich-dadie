
import api from './api';
import type {
  Asset,
  AssetNetwork,
  Wallet,
  DepositAddress,
} from '../types/investment';
import { toCamelCase } from './utils';

export interface BindWalletRequest {
  asset_id: string;
  network_id: string;
  wallet_address: string;
  label?: string;
}

export interface UpdateWalletRequest {
  label?: string;
  is_active?: boolean;
}

export const walletApi = {
  // ---------------------------------------------------------------------------
  // Public asset/network endpoints
  // ---------------------------------------------------------------------------

  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get('/assets');

    return toCamelCase<Asset[]>(response.data);
  },

  getNetworks: async (
    assetId: string,
  ): Promise<AssetNetwork[]> => {
    const response = await api.get(
      `/assets/${assetId}/networks`,
    );

    return toCamelCase<AssetNetwork[]>(response.data);
  },

  getDepositAddresses: async (): Promise<DepositAddress[]> => {
    const response = await api.get('/deposits/addresses');

    return toCamelCase<DepositAddress[]>(response.data);
  },

  // ---------------------------------------------------------------------------
  // Authenticated wallet endpoints
  // ---------------------------------------------------------------------------

  getWallets: async (): Promise<Wallet[]> => {
    const response = await api.get('/wallets');

    return toCamelCase<Wallet[]>(response.data);
  },

  bindWallet: async (
    data: BindWalletRequest,
  ): Promise<Wallet> => {
    const response = await api.post('/wallets', data);

    return toCamelCase<Wallet>(response.data);
  },

  updateWallet: async (
    walletId: string,
    data: UpdateWalletRequest,
  ): Promise<void> => {
    await api.patch(`/wallets/${walletId}`, data);
  },

  deleteWallet: async (
    walletId: string,
  ): Promise<void> => {
    await api.delete(`/wallets/${walletId}`);
  },
};

