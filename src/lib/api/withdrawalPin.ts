
// src/lib/api/withdrawalPin.ts

import api from "./api";

export interface SetWithdrawalPINRequest {
  pin: string;
}

export interface ChangeWithdrawalPINRequest {
  current_pin: string;
  new_pin: string;
}

export interface VerifyWithdrawalPINRequest {
  pin: string;
}

export interface ResetWithdrawalPINRequest {
  token: string;
  pin: string;
}

export interface WithdrawalPINResponse {
  message: string;
}

export interface WithdrawalPINStatusResponse {
  configured: boolean;
}

export interface VerifyWithdrawalPINResponse {
  verified: boolean;
}

/**
 * Wallet PIN API.
 *
 * Authenticated endpoints use the currently
 * authenticated user from the backend session/token.
 *
 * The reset endpoint is intentionally public because
 * the reset token itself authorizes the operation.
 */
export const withdrawalPinApi = {
  /**
   * Get the current user's wallet PIN status.
   */
  getStatus: async (): Promise<WithdrawalPINStatusResponse> => {
    const response = await api.get(
      "/investments/security/pin/status",
    );

    return response.data;
  },

  /**
   * Set the wallet PIN for the first time.
   */
  setPIN: async (
    data: SetWithdrawalPINRequest,
  ): Promise<WithdrawalPINResponse> => {
    const response = await api.post(
      "/investments/security/pin",
      data,
    );

    return response.data;
  },

  /**
   * Change an existing wallet PIN.
   */
  changePIN: async (
    data: ChangeWithdrawalPINRequest,
  ): Promise<WithdrawalPINResponse> => {
    const response = await api.post(
      "/investments/security/pin/change",
      data,
    );

    return response.data;
  },

  /**
   * Verify the current user's wallet PIN.
   *
   * Used to unlock protected wallet functionality.
   */
  verifyPIN: async (
    data: VerifyWithdrawalPINRequest,
  ): Promise<VerifyWithdrawalPINResponse> => {
    const response = await api.post(
      "/investments/security/pin/verify",
      data,
    );

    return response.data;
  },

  /**
   * Request a wallet PIN reset email.
   */
  forgotPIN: async (): Promise<WithdrawalPINResponse> => {
    const response = await api.post(
      "/investments/security/pin/forgot",
    );

    return response.data;
  },

  /**
   * Reset the wallet PIN using the token
   * received in the reset email.
   */
  resetPIN: async (
    data: ResetWithdrawalPINRequest,
  ): Promise<WithdrawalPINResponse> => {
    const response = await api.post(
      "/investments/security/pin/reset",
      data,
    );

    return response.data;
  },
};




