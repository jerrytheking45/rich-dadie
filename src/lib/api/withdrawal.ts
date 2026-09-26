
// src/lib/api/withdrawal.ts

import api from "./api";
import { toCamelCase } from "./utils";

import type {
  Withdrawal,
  CreateWithdrawalRequest,
  Pagination,
} from "../types/investment";

export interface WithdrawalWalletResponse {
  id: string;
  userId: string;
  assetId: string;
  networkId: string;
  networkName: string;
  address: string;
  status: "ACTIVE" | "UNBOUND";
  createdAt: string;
  updatedAt: string;
  unboundAt?: string | null;
}

export interface BindWithdrawalWalletRequest {
  address: string;
  pin: string;
}

export interface ChangeWithdrawalWalletRequest {
  new_address: string;
  current_pin: string;
}

export interface UnbindWithdrawalWalletRequest {
  pin: string;
}

export interface WithdrawalListResponse {
  withdrawals: Withdrawal[];
  pagination: Pagination;
}

export const withdrawalApi = {
  // ---------------------------------------------------------------------------
  // AUTHORITATIVE WITHDRAWAL WALLET
  // ---------------------------------------------------------------------------

  /**
   * Returns the authenticated user's single active withdrawal wallet.
   *
   * The backend is authoritative. The frontend must never maintain
   * a separate withdrawal-wallet list.
   *
   * A newly created account may legitimately have no wallet yet.
   * In that case the backend returns HTTP 200 with JSON null.
   */
  getWithdrawalWallet:
    async (): Promise<WithdrawalWalletResponse | null> => {
      const response = await api.get(
        "/investments/withdrawal-wallet",
      );

      if (response.data == null) {
        return null;
      }

      return toCamelCase<WithdrawalWalletResponse | null>(
        response.data,
      );
    },

  /**
   * Bind the user's first withdrawal wallet.
   *
   * Requires the user's 6-digit wallet PIN.
   *
   * The backend determines the supported asset/network:
   * USDT on TRON.
   */
  bindWithdrawalWallet: async (
    address: string,
    pin: string,
  ): Promise<WithdrawalWalletResponse> => {
    const response = await api.post(
      "/investments/withdrawal-wallet",
      {
        address: address.trim(),
        pin: pin.trim(),
      },
    );

    return toCamelCase<WithdrawalWalletResponse>(
      response.data,
    );
  },

  /**
   * Atomically replace the existing withdrawal wallet.
   *
   * The backend verifies current_pin before changing
   * the authoritative withdrawal destination.
   */
  changeWithdrawalWallet: async (
    newAddress: string,
    currentPin: string,
  ): Promise<WithdrawalWalletResponse> => {
    const response = await api.patch(
      "/investments/withdrawal-wallet",
      {
        new_address: newAddress.trim(),
        current_pin: currentPin.trim(),
      },
    );

    return toCamelCase<WithdrawalWalletResponse>(
      response.data,
    );
  },

  /**
   * Unbind the user's active withdrawal wallet.
   *
   * Requires the 6-digit wallet PIN.
   */
  unbindWithdrawalWallet: async (
    walletId: string,
    pin: string,
  ): Promise<void> => {
    await api.delete(
      `/investments/withdrawal-wallet/${walletId}`,
      {
        data: {
          pin: pin.trim(),
        },
      },
    );
  },

  // ---------------------------------------------------------------------------
  // WITHDRAWALS
  // ---------------------------------------------------------------------------

  /**
   * Create a withdrawal.
   *
   * IMPORTANT:
   * destination_address is intentionally NOT accepted here.
   *
   * The backend resolves the user's currently active
   * withdrawal wallet.
   */
  createWithdrawal: async (
    data: CreateWithdrawalRequest,
  ): Promise<Withdrawal> => {
    const response = await api.post(
      "/investments/withdrawals",
      data,
    );

    return toCamelCase<Withdrawal>(response.data);
  },

  /**
   * Get the authenticated user's withdrawal history.
   *
   * The backend MUST scope this query to the authenticated
   * user's ID. The frontend never supplies userId.
   */
  getWithdrawals: async (
    page = 1,
    pageSize = 50,
  ): Promise<WithdrawalListResponse> => {
    const response = await api.get(
      "/investments/withdrawals",
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

    return toCamelCase<WithdrawalListResponse>(
      response.data,
    );
  },

  /**
   * Get a withdrawal by ID.
   *
   * The backend MUST verify that the withdrawal belongs
   * to the authenticated user.
   */
  getWithdrawal: async (
    withdrawalId: string,
  ): Promise<Withdrawal> => {
    const response = await api.get(
      `/investments/withdrawals/${withdrawalId}`,
    );

    return toCamelCase<Withdrawal>(response.data);
  },
};

